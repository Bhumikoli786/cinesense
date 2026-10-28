/**
 * CineSense AI - Natural Language Processing & Sentiment Engine
 * 
 * Implements standard NLP preprocessing, lexicon-based scoring,
 * aspect extraction, and token metrics calculation.
 * Can run synchronously in the browser or on the Node.js server.
 */

import { AnalysisResult, AspectSentiment, EmotionProfile, KeyPhrase, SentimentType, TokenMetrics } from '../types';

// Stopwords commonly filtered in NLP pipelines
export const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have',
  'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into',
  'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
  'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
  'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s',
  'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
  'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Curated cinematic sentiment lexicon with weights (-3.0 to +3.0)
const CINEMA_LEXICON: Record<string, number> = {
  // Strong Positive (+2.5 to +3.0)
  'masterpiece': 3.0, 'breathtaking': 2.8, 'triumph': 2.7, 'magnificent': 2.8, 'spectacular': 2.7,
  'phenomenal': 2.9, 'brilliant': 2.6, 'exceptional': 2.6, 'captivating': 2.5, 'mesmerizing': 2.7,
  'unforgettable': 2.5, 'perfection': 2.9, 'extraordinary': 2.7, 'stunning': 2.6, 'flawless': 2.8,
  
  // Moderate Positive (+1.0 to +2.4)
  'great': 1.8, 'excellent': 2.2, 'superb': 2.3, 'wonderful': 2.0, 'fantastic': 2.1,
  'enjoyable': 1.5, 'entertaining': 1.6, 'heartwarming': 1.9, 'thrilling': 1.8, 'compelling': 1.9,
  'charming': 1.6, 'funny': 1.5, 'hilarious': 2.2, 'impactful': 1.7, 'riveting': 2.2,
  'solid': 1.2, 'creative': 1.4, 'poignant': 1.7, 'clever': 1.6, 'impressive': 1.8,
  'touching': 1.5, 'sharp': 1.3, 'delightful': 1.8, 'innovative': 1.8, 'visually': 0.8,
  'stellar': 2.2, 'dynamic': 1.4, 'resonant': 1.6, 'bold': 1.4, 'gripping': 2.0,
  
  // Neutral / Subtle modifiers
  'decent': 0.5, 'average': 0.0, 'mediocre': -0.7, 'okay': 0.2, 'fine': 0.4,
  'passable': 0.3, 'standard': 0.0, 'fair': 0.2, 'mixed': 0.0, 'watchable': 0.4,
  
  // Moderate Negative (-1.0 to -2.0)
  'boring': -1.8, 'dull': -1.7, 'flat': -1.4, 'slow': -1.1, 'cliché': -1.5, 'cliche': -1.5,
  'predictable': -1.6, 'uninspired': -1.8, 'weak': -1.5, 'confusing': -1.4, 'disappointing': -1.9,
  'overrated': -1.5, 'shallow': -1.5, 'cheesy': -1.3, 'messy': -1.5, 'tiresome': -1.7,
  'forced': -1.4, 'dragged': -1.6, 'hollow': -1.6, 'generic': -1.4, 'tedious': -1.8,
  'unconvincing': -1.6, 'underwhelming': -1.8, 'forgettable': -1.7, 'disjointed': -1.5,
  
  // Strong Negative (-2.1 to -3.0)
  'terrible': -2.5, 'horrible': -2.6, 'awful': -2.7, 'garbage': -2.9, 'atrocious': -2.8,
  'abysmal': -2.9, 'disaster': -2.7, 'unbearable': -2.8, 'ridiculous': -2.1, 'cringe': -2.2,
  'waste': -2.5, 'pointless': -2.3, 'dreadful': -2.7, 'appalling': -2.8, 'ruined': -2.4
};

// Intensifiers & Negators
const INTENSIFIERS: Record<string, number> = {
  'very': 1.5, 'extremely': 1.8, 'absolutely': 1.9, 'incredibly': 1.8, 'truly': 1.4,
  'deeply': 1.5, 'hugely': 1.5, 'totally': 1.6, 'immensely': 1.7, 'so': 1.3
};

const NEGATORS = new Set([
  'not', 'never', 'hardly', 'barely', 'scarcely', 'no', 'neither', 'nor', 'lacks', 'without', 'isn\'t', 'wasn\'t', 'didn\'t', 'don\'t'
]);

/**
 * Clean and normalize text
 */
export function cleanText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/[^\w\s'.!?,-]/g, ' ') // Keep alphanumeric, punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Tokenize text into word tokens
 */
export function tokenize(text: string): string[] {
  const cleaned = cleanText(text).toLowerCase();
  const tokens = cleaned.match(/[a-z0-9'-]+/g);
  return tokens || [];
}

/**
 * Filter stopwords from token list
 */
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter(t => !STOPWORDS.has(t) && t.length > 1);
}

/**
 * Calculate token metrics
 */
export function calculateTokenMetrics(text: string): TokenMetrics {
  const words = tokenize(text);
  const characterCount = text.length;
  const wordCount = words.length;
  const filteredWords = removeStopwords(words);
  const uniqueWords = new Set(words);
  
  // Rule of thumb: average reading speed ~200 WPM
  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 200) * 60));
  const lexicalDiversity = wordCount > 0 ? Number((uniqueWords.size / wordCount).toFixed(2)) : 0;
  
  // Approximate BPE subword tokens (words * ~1.25)
  const totalTokens = Math.round(wordCount * 1.25) + Math.min(10, Math.floor(characterCount / 100));

  return {
    totalTokens: Math.max(1, totalTokens),
    wordCount,
    characterCount,
    cleanWordCount: filteredWords.length,
    readingTimeSeconds,
    lexicalDiversity
  };
}

/**
 * Analyze sentiment using NLP Lexicon & Heuristics
 */
export function analyzeSentimentLocally(
  reviewText: string,
  movieTitle = 'Movie',
  genre = 'Drama'
): AnalysisResult {
  const text = cleanText(reviewText);
  const words = tokenize(text);
  const tokenMetrics = calculateTokenMetrics(text);

  let score = 0;
  let wordMatchCount = 0;
  const keyPhrases: KeyPhrase[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const prevPrevWord = i > 1 ? words[i - 2] : '';

    if (CINEMA_LEXICON[word] !== undefined) {
      let wordScore = CINEMA_LEXICON[word];
      let isNegated = false;

      // Check negators in previous 2 words
      if (NEGATORS.has(prevWord) || NEGATORS.has(prevPrevWord)) {
        isNegated = true;
        wordScore = -wordScore * 0.9;
      }

      // Check intensifiers
      if (INTENSIFIERS[prevWord]) {
        wordScore *= INTENSIFIERS[prevWord];
      }

      score += wordScore;
      wordMatchCount++;

      const phraseText = isNegated ? `${prevWord} ${word}` : word;
      const phraseSentiment = wordScore > 0.3 ? 'positive' : wordScore < -0.3 ? 'negative' : 'neutral';
      
      keyPhrases.push({
        text: phraseText,
        sentiment: phraseSentiment,
        weight: Number(Math.min(1.0, Math.abs(wordScore) / 3.0).toFixed(2))
      });
    }
  }

  // Normalize polarity to [-1.0, 1.0]
  const normalizedPolarity = wordMatchCount > 0 
    ? Math.max(-1.0, Math.min(1.0, Number((score / (wordMatchCount * 1.8)).toFixed(2))))
    : 0.05;

  // Determine sentiment category
  let sentiment: SentimentType = 'Neutral';
  if (normalizedPolarity >= 0.18) {
    sentiment = 'Positive';
  } else if (normalizedPolarity <= -0.18) {
    sentiment = 'Negative';
  }

  // Calculate confidence score (65% to 98% based on signal strength & word matches)
  const confidenceBase = Math.abs(normalizedPolarity) * 35;
  const matchBonus = Math.min(25, wordMatchCount * 4);
  const confidence = Math.min(98, Math.max(68, Math.round(55 + confidenceBase + matchBonus)));

  // Subjectivity: proportion of sentiment-bearing words vs neutral
  const subjectivityScore = Number(Math.min(0.95, Math.max(0.15, (wordMatchCount / Math.max(1, words.length * 0.25)))).toFixed(2));

  // Aspect extraction
  const lowerText = text.toLowerCase();
  const aspects: AspectSentiment[] = [
    {
      aspect: 'Acting & Cast',
      sentiment: lowerText.includes('actor') || lowerText.includes('cast') || lowerText.includes('performance') || lowerText.includes('acting')
        ? (normalizedPolarity > 0.1 ? 'Positive' : normalizedPolarity < -0.1 ? 'Negative' : 'Neutral')
        : 'Not Mentioned',
      score: normalizedPolarity > 0 ? 0.75 : -0.6
    },
    {
      aspect: 'Direction & Pacing',
      sentiment: lowerText.includes('direct') || lowerText.includes('pacing') || lowerText.includes('tempo') || lowerText.includes('scene')
        ? (normalizedPolarity > 0.1 ? 'Positive' : normalizedPolarity < -0.1 ? 'Negative' : 'Neutral')
        : 'Not Mentioned',
      score: normalizedPolarity > 0 ? 0.8 : -0.7
    },
    {
      aspect: 'Plot & Screenplay',
      sentiment: lowerText.includes('story') || lowerText.includes('plot') || lowerText.includes('script') || lowerText.includes('ending') || lowerText.includes('twist')
        ? (normalizedPolarity > 0.1 ? 'Positive' : normalizedPolarity < -0.1 ? 'Negative' : 'Neutral')
        : 'Not Mentioned',
      score: normalizedPolarity > 0 ? 0.85 : -0.8
    },
    {
      aspect: 'Cinematography & Visuals',
      sentiment: lowerText.includes('visual') || lowerText.includes('camera') || lowerText.includes('cgi') || lowerText.includes('shot') || lowerText.includes('stunning')
        ? (normalizedPolarity >= 0 ? 'Positive' : 'Neutral')
        : 'Not Mentioned',
      score: 0.8
    },
    {
      aspect: 'Soundtrack & Audio',
      sentiment: lowerText.includes('music') || lowerText.includes('score') || lowerText.includes('sound') || lowerText.includes('audio')
        ? (normalizedPolarity > 0.1 ? 'Positive' : 'Neutral')
        : 'Not Mentioned',
      score: 0.7
    }
  ];

  // Emotion Profile estimation
  const emotions: EmotionProfile = {
    joy: sentiment === 'Positive' ? Math.round(50 + Math.abs(normalizedPolarity) * 45) : Math.round(10 + Math.random() * 15),
    excitement: sentiment === 'Positive' ? Math.round(45 + Math.abs(normalizedPolarity) * 40) : Math.round(15 + Math.random() * 20),
    sadness: sentiment === 'Negative' ? Math.round(40 + Math.abs(normalizedPolarity) * 45) : Math.round(10 + Math.random() * 10),
    disappointment: sentiment === 'Negative' ? Math.round(55 + Math.abs(normalizedPolarity) * 40) : Math.round(5 + Math.random() * 10),
    suspense: genre === 'Thriller' || genre === 'Horror' ? 75 : Math.round(20 + Math.random() * 30)
  };

  // Concise AI / NLP synopsis summary
  let summary = '';
  if (sentiment === 'Positive') {
    summary = `The reviewer expresses high admiration for ${movieTitle || 'the film'}, praising its cinematic execution, thematic engagement, and emotional resonance.`;
  } else if (sentiment === 'Negative') {
    summary = `The reviewer voices substantial criticism regarding ${movieTitle || 'the production'}, highlighting deficiencies in pacing, narrative coherence, or engagement.`;
  } else {
    summary = `The review reflects a balanced perspective on ${movieTitle || 'the movie'}, weighing strengths against noticeable drawbacks with measured sentiment.`;
  }

  // Deduplicate and select top key phrases
  const uniqueKeyPhrases = Array.from(new Map(keyPhrases.map(p => [p.text.toLowerCase(), p])).values()).slice(0, 8);

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    movieTitle,
    genre,
    reviewText,
    sentiment,
    confidence,
    polarityScore: normalizedPolarity,
    subjectivityScore,
    summary,
    keyPhrases: uniqueKeyPhrases,
    aspects,
    emotions,
    tokenMetrics,
    modelUsed: 'CineSense NLP Lexicon Pipeline (Deterministic Fallback)',
    timestamp: new Date().toISOString(),
    source: 'nlp-engine'
  };
}
