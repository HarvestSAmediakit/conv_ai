// src/lib/convo-mag/retrieval.ts
import { withTenant } from './db';
import { CohereClientV2 } from 'cohere-ai';
import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;
export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiInstance = new OpenAI({ apiKey });
  }
  return openaiInstance;
}

let cohereInstance: CohereClientV2 | null = null;
export function getCohere(): CohereClientV2 {
  if (!cohereInstance) {
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      throw new Error('COHERE_API_KEY environment variable is required');
    }
    cohereInstance = new CohereClientV2({ token: apiKey });
  }
  return cohereInstance;
}

interface Citation {
  chunkId: string;
  documentId: string;
  pageNumber: number;
  boundingBox: [number, number, number, number];
  quote: string;
}

interface RetrievalResult {
  answer: string;
  citations: Citation[];
}

/**
 * Executes a two-stage hybrid search pipeline: retrieves candidate vectors from PostgreSQL,
 * reranks them with Cohere, and generates a context-grounded answer with citations.
 */
export async function executeTwoStageRAG(
  tenantId: string,
  documentId: string,
  query: string
): Promise<RetrievalResult> {
  // Step 1: Generate query vector
  const embeddingRes = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    dimensions: 1536,
  });
  const vectorStr = `[${embeddingRes.data[0].embedding.join(',')}]`;

  // Step 2: First-Stage Vector Search with active multi-tenant boundary limits
  const rawCandidates = await withTenant(tenantId, async (client) => {
    const res = await client.query(
      `SELECT kc.id, kc.content, kc.page_number, kc.bounding_box, kc.document_id,
              (1 - (ce.embedding <=> $1::vector)) AS similarity
       FROM knowledge_chunks kc
       JOIN chunk_embeddings ce ON ce.chunk_id = kc.id
       WHERE kc.tenant_id = $2 AND kc.document_id = $3
       ORDER BY ce.embedding <=> $1::vector
       LIMIT 20`,
      [vectorStr, tenantId, documentId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      content: row.content,
      pageNumber: row.page_number,
      boundingBox: row.bounding_box as [number, number, number, number],
      documentId: row.document_id,
      similarity: Number(row.similarity),
    }));
  });

  if (rawCandidates.length === 0) {
    return {
      answer: 'No relevant publications context matched your query.',
      citations: [],
    };
  }

  // Step 3: Second-Stage Cohere Rerank 
  const documentsTexts = rawCandidates.map((c) => c.content);
  const rerankedResponse = await getCohere().rerank({
    model: 'rerank-4-fast', // Low-latency, high-performance Reranking engine
    query: query,
    documents: documentsTexts,
    topN: 5,
  });

  // Map indexes to the corresponding database records
  const rerankedCandidates = rerankedResponse.results.map((r) => {
    const orig = rawCandidates[r.index];
    return {
      ...orig,
      relevanceScore: r.relevanceScore,
    };
  });

  // Step 4: Context Integration & Structured Synthesis via OpenAI 
  const contextBlock = rerankedCandidates
    .map((cand, idx) => `[Source ${idx}] Page: ${cand.pageNumber}\nContent: ${cand.content}`)
    .join('\n\n');

  const systemInstructions = `You are a helpful reading assistant. Answer the user query using only the provided context.
Citing your sources is mandatory. For every claim you make, append the source identifier (e.g. [0]) at the end of the sentence.
If the context does not contain sufficient information to formulate an answer, state that you do not have the information.`;

  const chatResponse = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemInstructions },
      { role: 'user', content: `CONTEXT:\n${contextBlock}\n\nUSER QUERY: ${query}` }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'structured_rag_output',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            citations: {
              type: 'array',
              items: { type: 'integer' },
              description: 'Array of indices referring to the provided source context elements.'
            },
          },
          required: ['answer', 'citations'],
          additionalProperties: false,
        },
      },
    },
  });

  const parsedPayload = JSON.parse(chatResponse.choices[0].message.content || '{}');

  // Step 5: Format citations with coordinates for interactive overlays 
  const finalCitations: Citation[] = (parsedPayload.citations || [])
    .map((index: number) => {
      const candidate = rerankedCandidates[index];
      if (!candidate) return null;
      return {
        chunkId: candidate.id,
        documentId: candidate.documentId,
        pageNumber: candidate.pageNumber,
        boundingBox: candidate.boundingBox,
        quote: candidate.content,
      };
    })
    .filter((cit: any): cit is Citation => cit !== null);

  return {
    answer: parsedPayload.answer,
    citations: finalCitations,
  };
}
