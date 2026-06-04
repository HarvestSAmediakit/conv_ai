import { GoogleGenAI } from "@google/genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Generates an embedding for the given text using Gemini.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await genAI.models.embedContent({
    model: "text-embedding-004",
    contents: [{ parts: [{ text: text }] }]
  });
  return res.embeddings[0].values;
}

/**
 * Splits text into semantic chunks.
 */
export async function chunkText(text: string): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });
  return await splitter.splitText(text);
}

/**
 * Calculates cosine similarity between two vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
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
 * Performs a RAG search across stored knowledge chunks.
 */
export async function performRagSearch(tenantId: string, documentId: string | null, query: string, topK: number = 5) {
  const queryEmbedding = await generateEmbedding(query);
  
  // Fetch candidate chunks from DB
  let queryStr = "SELECT * FROM knowledge_chunks WHERE tenant_id = ?";
  let params: any[] = [tenantId];
  
  if (documentId) {
    queryStr += " AND document_id = ?";
    params.push(documentId);
  }
  
  const chunks = db.prepare(queryStr).all(...params) as any[];
  
  // Calculate similarity and sort
  const scoredChunks = chunks.map(chunk => {
    const embedding = JSON.parse(chunk.embedding) as number[];
    return {
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, embedding)
    };
  });
  
  return scoredChunks
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Ingests a new document: parses, chunks, embeds, and stores.
 */
export async function ingestDocument(tenantId: string, documentId: string, fileName: string, text: string) {
  const chunks = await chunkText(text);
  
  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];
    const embedding = await generateEmbedding(content);
    
    db.prepare(`
      INSERT INTO knowledge_chunks (id, tenant_id, document_id, chunk_index, content, embedding, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      tenantId,
      documentId,
      i,
      content,
      JSON.stringify(embedding),
      JSON.stringify({ fileName, source: "manual_ingest" })
    );
  }
  
  db.prepare("UPDATE documents SET status = ? WHERE id = ?").run("completed", documentId);
}
