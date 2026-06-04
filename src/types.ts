export interface PDFDocument {
  id: string;
  filename: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
