import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { analyzeSentimentLocally, calculateTokenMetrics } from './src/utils/sentimentEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const hasGemini = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY');

  let ai: GoogleGenAI | null = null;
  if (hasGemini) {
    try {
      ai = new GoogleGenAI();
      console.log('✓ Google GenAI initialized with Gemini 3.8 Flash model');
    } catch (err) {
      console.warn('⚠️ Google GenAI initialization warning:', err);
    }
  } else {
    console.log('ℹ️ No GEMINI_API_KEY provided; CineSense AI will utilize the deterministic NLP engine fallback.');
  }

  // Health and Model status endpoint
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'online',
      hasGeminiApiKey: hasGemini,
      activeModel: hasGemini ? 'gemini-3.8-flash (Primary AI)' : 'CineSense NLP Lexicon Engine (Local Offline)',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Single Review Sentiment Analysis endpoint
  app.post('/api/sentiment/analyze', async (req, res) => {
    try {
      const { review, movieTitle, genre } = req.body;

      if (!review || typeof review !== 'string' || review.trim().length === 0) {
        return res.status(400).json({ error: 'Review text is required.' });
      }

      const text = review.trim();
      const safeTitle = movieTitle && typeof movieTitle === 'string' && movieTitle.trim() ? movieTitle.trim() : 'The Movie';
      const safeGenre = genre && typeof genre === 'string' && genre.trim() ? genre.trim() : 'Cinema';

      // Always calculate objective token metrics using deterministic NLP
      const tokenMetrics = calculateTokenMetrics(text);

      if (hasGemini && ai) {
        try {
          const prompt = `You are CineSense, a state-of-the-art sentiment analysis and NLP engine specialized in movie criticism and digital entertainment media.
Analyze the following movie review in detail.

Movie Title: "${safeTitle}"
Genre: "${safeGenre}"
Review Content:
"""
${text}
"""

Instructions:
1. Determine overall sentiment: strictly "Positive", "Negative", or "Neutral".
2. Estimate calibrated model confidence (integer percentage from 65 to 99).
3. Compute Polarity score (-1.0 for overwhelmingly negative, 0.0 for balanced/neutral, +1.0 for overwhelmingly positive).
4. Compute Subjectivity score (0.0 purely objective/factual to 1.0 purely opinionated/subjective).
5. Generate a concise 1-2 sentence AI summary explaining the reviewer's stance.
6. Extract 4 to 8 impactful key phrases/words from the text with sentiment ("positive", "negative", "neutral") and relative importance weight (0.0 to 1.0).
7. Evaluate individual aspects: "Acting & Cast", "Direction & Pacing", "Plot & Screenplay", "Cinematography & Visuals", "Soundtrack & Audio". If not mentioned in the text, mark sentiment as "Not Mentioned".
8. Rate emotion intensities (0 to 100) for: joy, excitement, sadness, disappointment, suspense.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] },
                  confidence: { type: Type.INTEGER, description: 'Confidence between 65 and 99 percent' },
                  polarityScore: { type: Type.NUMBER, description: 'Float between -1.0 and 1.0' },
                  subjectivityScore: { type: Type.NUMBER, description: 'Float between 0.0 and 1.0' },
                  summary: { type: Type.STRING },
                  keyPhrases: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                        weight: { type: Type.NUMBER }
                      },
                      required: ['text', 'sentiment', 'weight']
                    }
                  },
                  aspects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        aspect: {
                          type: Type.STRING,
                          enum: ['Acting & Cast', 'Direction & Pacing', 'Plot & Screenplay', 'Cinematography & Visuals', 'Soundtrack & Audio']
                        },
                        sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral', 'Not Mentioned'] },
                        score: { type: Type.NUMBER },
                        snippet: { type: Type.STRING }
                      },
                      required: ['aspect', 'sentiment', 'score']
                    }
                  },
                  emotions: {
                    type: Type.OBJECT,
                    properties: {
                      joy: { type: Type.INTEGER },
                      excitement: { type: Type.INTEGER },
                      sadness: { type: Type.INTEGER },
                      disappointment: { type: Type.INTEGER },
                      suspense: { type: Type.INTEGER }
                    },
                    required: ['joy', 'excitement', 'sadness', 'disappointment', 'suspense']
                  }
                },
                required: ['sentiment', 'confidence', 'polarityScore', 'subjectivityScore', 'summary', 'keyPhrases', 'aspects', 'emotions']
              }
            }
          });

          const rawText = response.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const result = {
              id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              movieTitle: safeTitle,
              genre: safeGenre,
              reviewText: text,
              sentiment: parsed.sentiment || 'Neutral',
              confidence: Number(parsed.confidence) || 85,
              polarityScore: Number(parsed.polarityScore) || 0.0,
              subjectivityScore: Number(parsed.subjectivityScore) || 0.5,
              summary: parsed.summary || 'Summary generated by CineSense AI.',
              keyPhrases: parsed.keyPhrases || [],
              aspects: parsed.aspects || [],
              emotions: parsed.emotions || { joy: 50, excitement: 50, sadness: 20, disappointment: 20, suspense: 30 },
              tokenMetrics,
              modelUsed: 'gemini-3.8-flash (Google GenAI)',
              timestamp: new Date().toISOString(),
              source: 'gemini-ai' as const
            };
            return res.json(result);
          }
        } catch (geminiError) {
          console.error('Gemini API call failed, falling back to local NLP engine:', geminiError);
          // Fall through to local fallback
        }
      }

      // Local Deterministic NLP Engine
      const localResult = analyzeSentimentLocally(text, safeTitle, safeGenre);
      return res.json(localResult);
    } catch (err: any) {
      console.error('Error analyzing sentiment:', err);
      return res.status(500).json({ error: err.message || 'Failed to process sentiment analysis.' });
    }
  });

  // Batch Sentiment Analysis endpoint
  app.post('/api/sentiment/batch', async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Array of review items is required.' });
      }

      const maxLimit = 100;
      const slicedItems = items.slice(0, maxLimit);

      const results = slicedItems.map((item: any, idx: number) => {
        const text = typeof item.text === 'string' ? item.text : '';
        const title = item.title || item.movieTitle || `Review #${idx + 1}`;
        const genre = item.genre || 'Cinema';
        const analysis = analyzeSentimentLocally(text, title, genre);
        return {
          id: item.id || `batch_${idx}_${Date.now()}`,
          movieTitle: title,
          genre,
          reviewText: text,
          sentiment: analysis.sentiment,
          confidence: analysis.confidence,
          polarityScore: analysis.polarityScore,
          summary: analysis.summary,
          keyPhrases: analysis.keyPhrases.slice(0, 4),
          status: 'analyzed'
        };
      });

      return res.json({
        totalProcessed: results.length,
        results
      });
    } catch (err: any) {
      console.error('Batch error:', err);
      return res.status(500).json({ error: 'Failed to process batch reviews.' });
    }
  });

  // Serve static files or Vite dev server
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 CineSense Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start CineSense server:', err);
});
