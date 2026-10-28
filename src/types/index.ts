/**
 * CineSense AI - Core Data Types & Interfaces
 */

export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export interface KeyPhrase {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  weight: number; // 0 to 1
}

export interface AspectSentiment {
  aspect: 'Acting & Cast' | 'Direction & Pacing' | 'Plot & Screenplay' | 'Cinematography & Visuals' | 'Soundtrack & Audio';
  sentiment: SentimentType | 'Not Mentioned';
  score: number; // -1 to 1
  snippet?: string;
}

export interface EmotionProfile {
  joy: number; // 0 to 100
  excitement: number;
  sadness: number;
  disappointment: number;
  suspense: number;
}

export interface TokenMetrics {
  totalTokens: number;
  wordCount: number;
  characterCount: number;
  cleanWordCount: number;
  readingTimeSeconds: number;
  lexicalDiversity: number; // 0 to 1
}

export interface AnalysisResult {
  id: string;
  movieTitle?: string;
  genre?: string;
  reviewText: string;
  sentiment: SentimentType;
  confidence: number; // 0 to 100%
  polarityScore: number; // -1.0 to +1.0
  subjectivityScore: number; // 0.0 (objective) to 1.0 (subjective)
  summary: string;
  keyPhrases: KeyPhrase[];
  aspects: AspectSentiment[];
  emotions: EmotionProfile;
  tokenMetrics: TokenMetrics;
  modelUsed: string;
  timestamp: string;
  source: 'gemini-ai' | 'nlp-engine' | 'demo';
}

export interface MovieCardData {
  id: string;
  title: string;
  year: number;
  genre: string;
  director: string;
  rating: number; // out of 10
  posterBg: string;
  posterIcon: string;
  sampleReview: string;
  actualSentiment: SentimentType;
  confidence: number;
}

export interface PipelineStep {
  id: string;
  title: string;
  shortDesc: string;
  technicalDetails: string;
  exampleRaw: string;
  exampleProcessed: string;
  codeSnippet: string;
  iconName: string;
}

export interface BatchReviewItem {
  id: string;
  reviewText: string;
  movieTitle?: string;
  genre?: string;
  sentiment?: SentimentType;
  confidence?: number;
  status: 'pending' | 'analyzed' | 'error';
  error?: string;
}
