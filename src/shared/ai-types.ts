export interface Citation {
  chunkId: string;
  documentId: string;
  pageNumber: number;
  boundingBox: [number, number, number, number]; // [left, bottom, right, top]
  quote: string;
}

export interface RetrievalResult {
  answer: string;
  citations: Citation[];
}
