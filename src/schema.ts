export interface Publisher {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string; // e.g. /logos/vogue.png
  createdAt: string;
}

export interface Magazine {
  id: string;
  publisherId: string;
  title: string;
  slug: string;
  coverUrl: string; // generated thumbnail from 1st page
  pdfUrl: string;
  status: 'draft' | 'published';
  createdAt: string;
  
  // ConvoMag AI Settings
  aiEnabled: boolean;
  aiPersonality?: 'Professional' | 'Casual' | 'Sarcastic';
  ttsEnabled: boolean;      // Voice available
  chatEnabled: boolean;     // Chatbot available

  // Analytics
  viewCount: number;
  listenCount: number;
}

// Global mock Database (client-side mock for visualization)
export interface DatabaseSchema {
  publishers: Publisher[];
  magazines: Magazine[];
}
