// src/lib/convo-mag/processor.ts
import { convert } from '@opendataloader/pdf';
import { withTenant } from './db';
import { generateSemanticChunks, ParserRawElement } from './chunker';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

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

interface IngestJobData {
  documentId: string;
  tenantId: string;
  localPdfPath: string;
}

/**
 * Worker processor for document ingestion.
 */
export async function processDocumentIngest(data: IngestJobData): Promise<void> {
  const { documentId, tenantId, localPdfPath } = data;
  const tempOutputDir = path.join(process.cwd(), 'uploads', 'extracted', documentId);

  try {
    if (!fs.existsSync(tempOutputDir)) {
      await fs.promises.mkdir(tempOutputDir, { recursive: true });
    }

    // Step 1: Update status to parsing
    await withTenant(tenantId, async (client) => {
      await client.query(
        `UPDATE documents SET status = 'parsing', updated_at = NOW() WHERE id = $1`,
        [documentId]
      );
    });

    // Step 2: OpenDataLoader execution 
    await convert([localPdfPath], {
      outputDir: tempOutputDir,
      format: 'json',
    });

    const parsedJsonPath = path.join(tempOutputDir, `${path.basename(localPdfPath, '.pdf')}.json`);
    const rawData = await fs.promises.readFile(parsedJsonPath, 'utf8');
    const parsedData = JSON.parse(rawData);

    // Extract structural children arrays from Root element
    const elements: ParserRawElement[] = parsedData.kids || [];

    // Step 3: Partition elements using semantic chunking
    await withTenant(tenantId, async (client) => {
      await client.query(`UPDATE documents SET status = 'chunking' WHERE id = $1`, [documentId]);
    });

    const chunks = await generateSemanticChunks(elements);

    // Step 4: Generate Embeddings and Save to Database
    await withTenant(tenantId, async (client) => {
      await client.query(`UPDATE documents SET status = 'embedding' WHERE id = $1`, [documentId]);
    });

    for (const chunk of chunks) {
      const embeddingResponse = await getOpenAI().embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk.content,
        dimensions: 1536,
      });

      const vectorValue = embeddingResponse.data[0].embedding;

      await withTenant(tenantId, async (client) => {
        // Store metadata in standard chunk reference tables
        const chunkInsertResult = await client.query(
          `INSERT INTO knowledge_chunks (tenant_id, document_id, chunk_index, content, page_number, bounding_box)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [tenantId, documentId, chunk.chunkIndex, chunk.content, chunk.pageNumber, JSON.stringify(chunk.boundingBox)]
        );

        const chunkId = chunkInsertResult.rows[0].id;

        // Serialize vector array formatted as PostgreSQL compatible string
        const vectorSqlString = `[${vectorValue.join(',')}]`;

        await client.query(
          `INSERT INTO chunk_embeddings (tenant_id, chunk_id, embedding)
           VALUES ($1, $2, $3::vector)`,
          [tenantId, chunkId, vectorSqlString]
        );
      });
    }

    // Step 5: Mark document ready
    await withTenant(tenantId, async (client) => {
      await client.query(
        `UPDATE documents SET status = 'ready', updated_at = NOW() WHERE id = $1`,
        [documentId]
      );
    });

  } catch (error: any) {
    console.error('Ingestion Error:', error);
    // Gracefully handle processing failures and update state
    await withTenant(tenantId, async (client) => {
      await client.query(
        `UPDATE documents SET status = 'failed', updated_at = NOW() WHERE id = $1`,
        [documentId]
      );
    });
    throw error;
  } finally {
    // Cleanup temporary processing directory
    if (fs.existsSync(tempOutputDir)) {
        await fs.promises.rm(tempOutputDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
