export interface Publication {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Issue {
  id: string;
  publicationId: string;
  publication?: Publication;
  issueNumber?: string;
  issueDate?: Date;
  title?: string;
  pdfUrl: string;
  coverImageUrl?: string;
  pageCount?: number;
  status: 'processing' | 'ready' | 'error';
  aiName: string;
  aiVoiceId: string;
  aiIntroduction: string;
  embedEnabled: boolean;
  embedSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  issueId: string;
  issue?: Issue;
  title: string;
  author?: string;
  pageStart: number;
  pageEnd: number;
  section?: string;
  content: string;
  summary?: string;
  keywords?: string[];
  podcastAudioUrl?: string;
  podcastDurationSeconds?: number;
  podcastStatus: 'pending' | 'processing' | 'ready' | 'error';
  createdAt: Date;
}

export interface Advertiser {
  id: string;
  issueId: string;
  brandName: string;
  pageNumber: number;
  adType: 'display' | 'classified' | 'advertorial' | 'native';
  productName?: string;
  productDescription?: string;
  offerText?: string;
  offerCode?: string;
  offerDeadline?: Date;
  ctaUrl?: string;
  usageAdvice?: string;
  targetAudience?: string;
  createdAt: Date;
}

export interface Interaction {
  id: string;
  issueId: string;
  sessionId: string;
  interactionType: 'page_flip' | 'article_read' | 'podcast_play' | 'podcast_interrupt' | 'chat_message' | 'advertiser_click' | 'search';
  metadata: any;
  createdAt: Date;
}
