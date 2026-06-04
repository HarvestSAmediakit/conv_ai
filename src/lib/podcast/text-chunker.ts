// src/lib/podcast/text-chunker.ts

export interface ChunkerOptions {
  maxLength: number;
  overlap: number;
  preserveSentences: boolean;
}

export interface Chunk {
  text: string;
}

const textChunker = {
  chunk: (text: string, options: ChunkerOptions): Chunk[] => {
    if (!text) return [];
    
    // Simple sentence-based chunking
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: Chunk[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > options.maxLength && currentChunk.length > 0) {
        chunks.push({ text: currentChunk.trim() });
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push({ text: currentChunk.trim() });
    }
    
    return chunks;
  }
};

export default textChunker;
