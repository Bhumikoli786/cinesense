import React from 'react';
import { 
  BookOpen, 
  GitBranch, 
  Terminal, 
  FileCode, 
} from 'lucide-react';

export const TechSpecs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b dark:border-slate-800/80 border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono dark:text-cyan-300 text-purple-800 dark:bg-cyan-950/60 bg-purple-100 dark:border-cyan-800/50 border-purple-200 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
          <span>Academic & Engineering Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-cinematic dark:text-white text-slate-900 tracking-tight">
          System Architecture & Technical Specifications
        </h1>
        <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-700 mt-1 font-sans max-w-2xl">
          Complete engineering reference detailing model inference pipelines, API schemas, local lexicon fallbacks, and instructions for connecting custom PyTorch / Hugging Face models.
        </p>
      </div>

      {/* Tech Stack Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600 font-semibold">Frontend Layer</span>
          <div className="text-base font-bold dark:text-white text-slate-900 mt-1">React 19 + TypeScript</div>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">Tailwind CSS v4, Lucide Icons, Canvas Confetti</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600 font-semibold">Backend Runtime</span>
          <div className="text-base font-bold dark:text-white text-slate-900 mt-1">Node.js + Express + TSX</div>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">Full-stack server with Vite middleware proxy</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600 font-semibold">Primary AI Model</span>
          <div className="text-base font-bold dark:text-cyan-400 text-purple-700 mt-1">Google Gemini 3.8 Flash</div>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">@google/genai TypeScript SDK with JSON Schema</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600 font-semibold">Local Fallback</span>
          <div className="text-base font-bold dark:text-purple-400 text-indigo-700 mt-1">CineSense NLP Engine</div>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">Deterministic BPE tokenization + Cinema Lexicon</p>
        </div>
      </div>

      {/* How to Connect Custom Trained Models (FastAPI / PyTorch / Hugging Face) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-purple-500/30 border-purple-200 space-y-6">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold font-cinematic dark:text-white text-slate-900">
            Connecting a Custom Trained ML Model (FastAPI / Hugging Face / BERT)
          </h2>
        </div>

        <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-700 leading-relaxed font-sans">
          If your academic project includes a custom fine-tuned sentiment classifier (such as <code>BERT-base-uncased</code>, <code>RoBERTa</code>, or a Python FastAPI inference server running on port 8000), here are the exact files to modify:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl dark:bg-slate-900/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-cyan-300 text-purple-800">
              <FileCode className="w-4 h-4 text-purple-600 dark:text-cyan-400" />
              <span>1. /server.ts (Backend Route Adapter)</span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed font-sans">
              Update <code>POST /api/sentiment/analyze</code> to forward incoming reviews to your Python FastAPI service (e.g. <code>http://localhost:8000/predict</code>) using <code>fetch</code> or Axios.
            </p>
          </div>

          <div className="p-4 rounded-2xl dark:bg-slate-900/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-purple-300 text-purple-800">
              <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>2. /src/utils/sentimentEngine.ts (Feature Extractor)</span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed font-sans">
              Contains the client-side tokenization, cleaning, and metric calculations. You can plug custom TF-IDF matrices, embedding models, or custom vocabulary dictionaries here.
            </p>
          </div>

          <div className="p-4 rounded-2xl dark:bg-slate-900/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-emerald-300 text-emerald-800">
              <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>3. /src/types/index.ts (Schema Interface)</span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed font-sans">
              Extends or updates <code>AnalysisResult</code> to include any specialized model output tensors (e.g., logits, softmax distributions, multi-label classifications).
            </p>
          </div>

          <div className="p-4 rounded-2xl dark:bg-slate-900/90 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold dark:text-amber-300 text-amber-800">
              <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>4. /.env.example (Environment Secrets)</span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed font-sans">
              Add your Python model endpoint URL: <code>MODEL_ENDPOINT_URL=http://localhost:8000/predict</code> without committing private credentials.
            </p>
          </div>
        </div>

        {/* Code Snippet for FastAPI proxy */}
        <div className="pt-2">
          <span className="text-xs font-mono font-bold dark:text-slate-300 text-slate-800 uppercase block mb-2">
            Example FastAPI Proxy Snippet in server.ts:
          </span>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
{`// Inside server.ts POST /api/sentiment/analyze
const pyResponse = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ review_text: text })
});
const pyData = await pyResponse.json();
return res.json({
  sentiment: pyData.sentiment, // 'Positive' | 'Negative' | 'Neutral'
  confidence: pyData.confidence_score,
  polarityScore: pyData.polarity,
  modelUsed: 'PyTorch DistilBERT v2 (Custom Fine-Tuned)'
});`}
          </pre>
        </div>
      </div>

      {/* API Reference Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <h2 className="text-xl font-bold font-cinematic dark:text-white text-slate-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-600 dark:text-cyan-400" />
          <span>Server API Endpoints</span>
        </h2>

        <div className="border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead className="dark:bg-slate-900 bg-slate-100 text-slate-700 dark:text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Endpoint</th>
                <th className="p-3">Method</th>
                <th className="p-3">Payload</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 divide-slate-200 font-mono">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 text-purple-700 dark:text-cyan-400">/api/status</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">GET</td>
                <td className="p-3 dark:text-slate-400 text-slate-600 font-sans">None</td>
                <td className="p-3 dark:text-slate-300 text-slate-800 font-sans">Returns model availability and server heartbeat</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 text-purple-700 dark:text-cyan-400">/api/sentiment/analyze</td>
                <td className="p-3 text-purple-700 dark:text-purple-400 font-bold">POST</td>
                <td className="p-3 dark:text-slate-300 text-slate-800 font-sans">{'{ review, movieTitle?, genre? }'}</td>
                <td className="p-3 dark:text-slate-300 text-slate-800 font-sans">Full NLP analysis with Gemini 3.8 Flash / NLP Engine</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3 text-purple-700 dark:text-cyan-400">/api/sentiment/batch</td>
                <td className="p-3 text-purple-700 dark:text-purple-400 font-bold">POST</td>
                <td className="p-3 dark:text-slate-300 text-slate-800 font-sans">{'{ items: [{ text, title?, genre? }] }'}</td>
                <td className="p-3 dark:text-slate-300 text-slate-800 font-sans">Bulk multi-review sentiment inference</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
