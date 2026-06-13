import { GoogleGenAI } from "@google/genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getPool, db } from "../db/index.ts";
import * as schema from "../db/schema.ts";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { withTenant } from "../lib/convo-mag/db.ts";
import { CohereClientV2 } from "cohere-ai";
import OpenAI from "openai";
import { Citation, RetrievalResult } from "../shared/ai-types";
import { AgriIntelligenceService } from './agri-intelligence.ts';

const genAI = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Lazy initialized optional premium clients
let cohereInstance: CohereClientV2 | null = null;
function getCohere(): CohereClientV2 | null {
  if (!cohereInstance && process.env.COHERE_API_KEY) {
    cohereInstance = new CohereClientV2({ token: process.env.COHERE_API_KEY });
  }
  return cohereInstance;
}

let openaiInstance: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!openaiInstance && process.env.OPENAI_API_KEY) {
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
}


/**
 * Generates text embeddings using Gemini or OpenAI depending on key availability and size specifications.
 */
export async function generateEmbedding(text: string, dimension: 768 | 1536 = 768): Promise<number[]> {
  // If 1536 dimension is requested (typically for pgvector text-embedding-3-small compatibility)
  // and OpenAI is available, generate OpenAI embedding.
  if (dimension === 1536) {
    const oai = getOpenAI();
    if (oai) {
      const res = await oai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1536
      });
      return res.data[0].embedding;
    }
  }

  // Fall back to native Gemini text-embedding-004 (768 dimensions)
  const res = await genAI.models.embedContent({
    model: "text-embedding-004",
    contents: [{ parts: [{ text }] }]
  });
  return res.embeddings[0].values;
}

/**
 * Calculates cosine similarity between two float vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  if (mA === 0 || mB === 0) return 0;
  return dotProduct / (mA * mB);
}

/**
 * Performs a highly resilient hybrid RAG retrieval pipeline using Cloud SQL pgvector.
 */
export async function performRagRetrieval(
  tenantId: string,
  documentId: string | null,
  query: string,
  topK: number = 5
): Promise<RetrievalResult> {
  let candidates: Array<{
    id: string;
    document_id: string;
    content: string;
    page_number: number;
    bounding_box: [number, number, number, number];
  }> = [];

  try {
    const pgClient = await getPool().connect();
    try {
      // Generate 1536 dimension query embedding
      const queryVector = await generateEmbedding(query, 1536);
      const vectorStr = `[${queryVector.join(',')}]`;

      // Bind RLS tenant context safely in transaction context
      await pgClient.query('BEGIN');
      await pgClient.query(`SELECT set_config('app.current_tenant_id', $1, true);`, [tenantId]);

      let sql = `
        SELECT kc.id, kc.content, kc.page_number, kc.bounding_box, kc.document_id,
               (1 - (ce.embedding <=> $1::vector)) AS similarity
        FROM knowledge_chunks kc
        JOIN chunk_embeddings ce ON ce.chunk_id = kc.id
        WHERE kc.tenant_id = $2
      `;
      const params: any[] = [vectorStr, tenantId];

      if (documentId) {
        sql += ` AND kc.document_id = $3`;
        params.push(documentId);
      }

      sql += ` ORDER BY ce.embedding <=> $1::vector LIMIT 20`;

      const res = await pgClient.query(sql, params);
      await pgClient.query('COMMIT');

      candidates = res.rows.map(row => ({
        id: row.id,
        document_id: row.document_id,
        content: row.content,
        page_number: Number(row.page_number || 1),
        bounding_box: typeof row.bounding_box === 'string'
          ? JSON.parse(row.bounding_box)
          : (row.bounding_box as [number, number, number, number]) || [0, 0, 0, 0]
      }));
    } catch (err) {
      await pgClient.query('ROLLBACK');
      throw err;
    } finally {
      pgClient.release();
    }
  } catch (pgErr) {
    console.error("Cloud SQL RAG retrieval failed:", pgErr);
  }

  // Double stage Cohere Reranking
  const cohere = getCohere();
  let selectedCandidates = candidates.slice(0, Math.min(candidates.length, topK));

  if (cohere && candidates.length > 0) {
    try {
      const texts = candidates.map(c => c.content);
      const reranked = await cohere.rerank({
        model: 'rerank-english-v3.0',
        query: query,
        documents: texts,
        topN: topK
      });

      selectedCandidates = reranked.results.map(res => candidates[res.index]);
    } catch (cohereErr) {
      console.warn("Cohere Rerank failed, skipping back to vector scores list:", cohereErr);
    }
  }

  if (selectedCandidates.length === 0) {
    return {
      answer: "No relevant content found in the index context matches your query. Please configure your API credentials and ingest document pages.",
      citations: []
    };
  }

  // Synthesize Context-Grounded Answer using Gemini
  let contextBlock = selectedCandidates
    .map((c, idx) => `[Source ${idx}] (Page ${c.page_number}):\n${c.content}`)
    .join("\n\n");

  // Enrich context block with Agricultural Advertiser Match if applicable
  contextBlock = await AgriIntelligenceService.enrichWithAgriIntel(query, contextBlock, tenantId);

  const systemInstructions = `You are ConvoMag AI, a helpful, highly professional conversational magazine reading assistant.
Answer the user's query using strictly the content provided in the CONTEXT blocks.
Include specific page citations inside your response when stating facts (e.g., "[Page 4]").
If the context doesn't contain sufficient details to answer, politely explain that you do not have that info in the publication context.`;

  let synthesizedAnswer = "";
  try {
    const chatResponse = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        { role: 'user', parts: [{ text: `CONTEXT:\n${contextBlock}\n\nUSER QUERY: ${query}` }] }
      ],
      config: {
        systemInstruction: systemInstructions,
        maxOutputTokens: 1024,
      }
    });
    synthesizedAnswer = chatResponse.text || "";
  } catch (genAiError) {
    console.error("Grounded answer synthesis failed, compiling direct extract list:", genAiError);
    synthesizedAnswer = `Here is what I found in the magazine concerning your query:\n\n` +
      selectedCandidates.map(c => `Page ${c.page_number}: "${c.content}"`).join("\n\n") +
      `\n\n*(Note: Displayed list due to service connection limit.)*`;
  }

  // Formulate citations list
  const citations: Citation[] = selectedCandidates.map(c => ({
    chunkId: c.id,
    documentId: c.document_id,
    pageNumber: c.page_number,
    boundingBox: c.bounding_box || [50, 50, 500, 700],
    quote: c.content
  }));

  return {
    answer: synthesizedAnswer,
    citations
  };
}

/**
 * Legacy API matching wrapper for performRagSearch
 */
export async function performRagSearch(tenantId: string, documentId: string | null, query: string, topK: number = 5) {
  const result = await performRagRetrieval(tenantId, documentId, query, topK);
  return result.citations.map(cit => ({
    id: cit.chunkId,
    document_id: cit.documentId,
    content: cit.quote,
    page_number: cit.pageNumber,
    bounding_box: JSON.stringify(cit.boundingBox),
    embedding: "[]",
    tenant_id: tenantId
  }));
}

/**
 * Legacy/Standard multi-source ingestion function. Parses and indexes document safely.
 */
export async function ingestDocument(
  tenantId: string,
  documentId: string,
  fileName: string,
  text: string,
  pagesDataUrl?: string[]
) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });

    // Ingest pages text: either split bulk text or page-by-page mapping if present
    const splitChunks = await splitter.splitText(text);

    for (let i = 0; i < splitChunks.length; i++) {
      const content = splitChunks[i];
      
      const chunkUuid = uuidv4();
      const pageNum = 1; // Standard bulk text default
      const defaultBbox = [50, 100, 550, 700]; // Standard centered frame

      // Save using Drizzle/Cloud SQL
      try {
        const pgClient = await getPool().connect();
        try {
          const pgEmbedding = await generateEmbedding(content, 1536);
          const vectorSqlString = `[${pgEmbedding.join(',')}]`;

          await pgClient.query('BEGIN');
          await pgClient.query(`SELECT set_config('app.current_tenant_id', $1, true);`, [tenantId]);

          // Save chunk metadata
          await pgClient.query(
            `INSERT INTO knowledge_chunks (id, tenant_id, document_id, chunk_index, content, page_number, bounding_box, embedding)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [chunkUuid, tenantId, documentId, i, content, pageNum, JSON.stringify(defaultBbox), JSON.stringify(pgEmbedding)]
          );

          // Save vector separately for pgvector
          await pgClient.query(
            `INSERT INTO chunk_embeddings (id, tenant_id, chunk_id, embedding)
             VALUES ($1, $2, $3, $4::vector)`,
            [uuidv4(), tenantId, chunkUuid, vectorSqlString]
          );

          await pgClient.query('COMMIT');
        } catch (pgInsertErr) {
          await pgClient.query('ROLLBACK');
          console.error("Failed storing chunk in pgvector during ingest:", pgInsertErr);
        } finally {
          pgClient.release();
        }
      } catch (poolErr) {
        console.error("Pool connection error during ingestion:", poolErr);
      }
    }

    await db.update(schema.documents).set({ status: 'completed' }).where(eq(schema.documents.id, documentId));
    await db.update(schema.magazines).set({ status: 'published' }).where(eq(schema.magazines.id, documentId));
    console.log(`Ingested document successfully into relational stores: ${documentId}`);
  } catch (err) {
    console.error("Document Ingest failure:", err);
    await db.update(schema.documents).set({ status: 'failed' }).where(eq(schema.documents.id, documentId));
    await db.update(schema.magazines).set({ status: 'error' }).where(eq(schema.magazines.id, documentId));
  }
}
