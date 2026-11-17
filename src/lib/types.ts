export interface VideoMetadata {
  videoId: string;
  url: string;
  title: string;
  author: string;
  authorUrl?: string;
  thumbnailUrl: string;
}

export interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

export interface KeyPoint {
  topic: string;
  details: string;
  timestamp?: string;
}

export interface SummaryResult {
  title: string;
  channel: string;
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
  executiveSummary: string;
  keyPoints: KeyPoint[];
  takeaways: string[];
  actionItems: string[];
  conclusion: string;
  markdown: string;
  readingTimeMinutes: number;
  estimatedVideoMinutes?: number;
  language: string;
  createdAt: string;
}

export interface SummaryRequest {
  url: string;
  language?: 'id' | 'en';
  format?: 'concise' | 'detailed' | 'actions';
  customApiKey?: string;
  manualTranscript?: string;
}

export interface EmailRequest {
  email: string;
  recipientName?: string;
  notes?: string;
  summary: SummaryResult;
  pdfBase64?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  previewUrl?: string;
}

