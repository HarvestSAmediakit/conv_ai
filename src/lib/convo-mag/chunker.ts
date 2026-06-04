// src/lib/convo-mag/chunker.ts
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export interface ParserRawElement {
  type: string;
  id?: number;
  'page number': number; // 1-indexed field
  'bounding box': [number, number, number, number]; // [left, bottom, right, top] in PDF points
  content: string;
}

export interface StructuredChunk {
  content: string;
  pageNumber: number;
  boundingBox: [number, number, number, number];
  chunkIndex: number;
}

/**
 * Groups elements by their reading order and partitions text into logical chunks.
 * Preserves source document metadata and coordinates for downstream citations.
 */
export async function generateSemanticChunks(
  elements: ParserRawElement[]
): Promise<StructuredChunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });

  const processedChunks: StructuredChunk[] = [];
  let aggregateIndex = 0;

  for (const element of elements) {
    const rawText = element.content;
    const pageNum = element['page number'];
    const bbox = element['bounding box'];

    if (!rawText || !rawText.trim()) continue;

    // Split text into semantic fragments
    const splits = await splitter.splitText(rawText);

    for (const split of splits) {
      processedChunks.push({
        content: split,
        pageNumber: pageNum,
        boundingBox: bbox,
        chunkIndex: aggregateIndex++,
      });
    }
  }

  return processedChunks;
}
