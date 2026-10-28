# CineSense — Intelligent Movie Sentiment Analyzer
> *“Every Review Has a Story. Let AI Understand It.”*
> **Academic Project:** Movie Review Sentiment Analysis Using NLP & AI  
> **Alignment:** United Nations Sustainable Development Goal 9 (SDG 9): Industry, Innovation and Infrastructure

---

## 🌟 Executive Overview

**CineSense** is a modern, full-stack web application designed for academic research and digital entertainment analytics. It demonstrates how Artificial Intelligence and Natural Language Processing (NLP) transform unstructured movie reviews into structured, explainable sentiment intelligence—supporting innovation and digital infrastructure in media technology (SDG 9).

The application features:
- **Interactive Review Sentiment Analyzer:** Ingests any movie critique, provides polarity (-1.0 to +1.0), confidence scores, AI summaries, aspect-based evaluations (acting, direction, plot, visuals, sound), and explainable key phrases.
- **6-Stage NLP Pipeline Sandbox:** Interactive educational walkthrough of text cleaning, BPE tokenization, stopword removal, contextual embeddings, classification, and visual rendering.
- **Batch CSV Analysis:** Upload real datasets with custom column mapping, high-throughput classification, search/filtering, and downloadable CSV reports.
- **Analytics Dashboard:** Real-time sentiment donut charts, genre-wise stacked distributions, and historical search records.
- **Movie Explorer:** Benchmark movie catalog with critical reviews and one-click analyzer loading.
- **UN SDG 9 Framework:** Detailed impact analysis connecting NLP advancements with resilient digital media infrastructure.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Backend & Server** | Node.js, Express, TSX runner, Vite middleware proxy |
| **Primary AI Inference** | Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK) |
| **Local Deterministic Fallback** | CineSense Cinema Lexicon & Rule-based NLP Engine (zero-failure offline mode) |
| **Data Persistence** | Browser `localStorage` for historical audits & JSON/CSV exports |

---

## 🔌 Connecting a Custom Trained Model (e.g. FastAPI / PyTorch / Hugging Face)

If you have trained a custom machine learning model (e.g., fine-tuned `BERT`, `RoBERTa`, or a Python FastAPI inference microservice on port 8000), here are the exact files to modify:

### 1. `/server.ts`
The backend Express route at `POST /api/sentiment/analyze` serves as the inference gateway. Replace or augment the Gemini call with an HTTP request to your Python inference server:

```typescript
// server.ts - Example FastAPI proxy integration
app.post('/api/sentiment/analyze', async (req, res) => {
  const { review, movieTitle, genre } = req.body;
  
  // Forward to your custom Python model
  const pyResponse = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review, movie_title: movieTitle, genre })
  });
  
  const pyData = await pyResponse.json();
  return res.json({
    id: `eval_${Date.now()}`,
    sentiment: pyData.sentiment, // 'Positive' | 'Negative' | 'Neutral'
    confidence: pyData.confidence, // e.g. 94
    polarityScore: pyData.polarity, // -1.0 to +1.0
    subjectivityScore: pyData.subjectivity,
    summary: pyData.summary,
    keyPhrases: pyData.key_phrases,
    aspects: pyData.aspects,
    tokenMetrics: calculateTokenMetrics(review),
    modelUsed: 'Custom Fine-Tuned PyTorch RoBERTa',
    timestamp: new Date().toISOString(),
    source: 'custom-model'
  });
});
```

### 2. `/src/utils/sentimentEngine.ts`
Contains tokenizers, text normalization functions, and the offline fallback lexicon. Modify this file if you wish to adjust subword vocabulary, N-gram extraction, or custom stopword lists.

### 3. `/src/types/index.ts`
The data contract file. Update the `AnalysisResult` and `BatchReviewItem` interfaces to match any new custom fields or logits output by your custom model.

### 4. `/.env.example`
Specify your model server URL or API keys (e.g., `CUSTOM_MODEL_URL=http://localhost:8000/predict`).

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy the sample environment variables:
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY` in `.env` if using Google Gemini AI. *(Note: If no API key is provided, CineSense seamlessly operates using its built-in deterministic NLP engine).*

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Compiling & Production Build
```bash
npm run build
npm start
```

---

## 🎯 UN SDG 9 Alignment & Educational Disclaimer

This software prototype aligns with **UN SDG 9: Industry, Innovation and Infrastructure**:
- **Target 9.5:** Enhances technological capabilities within the creative entertainment sector by deploying NLP classification.
- **Target 9.B:** Supports open digital infrastructure for independent creators and film analysts.
- **Target 9.C:** Democratizes access to computational sentiment intelligence via responsive web software.

*Disclaimer: CineSense AI is an academic educational prototype developed for student research and demonstration. It does not establish formal statistical progress toward official United Nations indicators.*
