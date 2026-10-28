import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  BarChart3, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Activity, 
  ArrowRight, 
  Film, 
  CheckCircle2
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { setActiveTab, analysisHistory, loadReviewIntoAnalyzer } = useApp();

  // Aggregate statistics from current history
  const totalAnalyzed = analysisHistory.length;
  const positiveCount = analysisHistory.filter(r => r.sentiment === 'Positive').length;
  const negativeCount = analysisHistory.filter(r => r.sentiment === 'Negative').length;
  const neutralCount = analysisHistory.filter(r => r.sentiment === 'Neutral').length;
  
  const avgConfidence = totalAnalyzed > 0
    ? Math.round(analysisHistory.reduce((acc, r) => acc + r.confidence, 0) / totalAnalyzed)
    : 88;

  const positivePct = totalAnalyzed > 0 ? Math.round((positiveCount / totalAnalyzed) * 100) : 50;
  const negativePct = totalAnalyzed > 0 ? Math.round((negativeCount / totalAnalyzed) * 100) : 30;
  const neutralPct = totalAnalyzed > 0 ? Math.round((neutralCount / totalAnalyzed) * 100) : 20;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-12 overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-600/15 via-cyan-500/15 to-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold dark:bg-purple-950/80 bg-purple-100 dark:border-purple-500/30 border-purple-300 dark:text-purple-300 text-purple-900 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
            <span>UN SDG 9 Aligned • NLP & Generative AI Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-cinematic tracking-tight dark:text-white text-slate-900 leading-tight sm:leading-none">
            Discover the Emotion Behind <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 dark:from-purple-400 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Every Movie Review.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg dark:text-slate-300 text-slate-700 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
            Every review has a story. Let AI understand it. CineSense extracts nuanced sentiment, 
            cinematic aspect breakdowns, emotional polarities, and actionable audience intelligence in milliseconds.
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Analyze a Review</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="px-6 py-3.5 rounded-xl dark:bg-slate-900/90 bg-white hover:bg-slate-50 dark:hover:bg-slate-800/90 dark:text-slate-200 text-slate-800 border dark:border-slate-700/80 border-slate-300 shadow-sm font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Explore Analytics</span>
            </button>
          </div>

          {/* Quick Demo Review Pills */}
          <div className="mt-10 pt-6 border-t dark:border-slate-800/60 border-slate-200 max-w-xl mx-auto">
            <p className="text-xs dark:text-slate-400 text-slate-600 mb-3 font-mono font-medium">⚡ Quick-test with curated reviews:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => loadReviewIntoAnalyzer("An absolute cinematic masterpiece with breathtaking visuals and emotional depth!", "Interstellar", "Sci-Fi")}
                className="px-3 py-1.5 rounded-lg dark:bg-emerald-950/40 bg-emerald-50 border dark:border-emerald-600/30 border-emerald-300 dark:text-emerald-300 text-emerald-800 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                ✨ "Cinematic Masterpiece"
              </button>
              <button
                onClick={() => loadReviewIntoAnalyzer("Utterly lifeless and boring with wooden dialogue and lazy plot holes.", "Hollow Peak", "Horror")}
                className="px-3 py-1.5 rounded-lg dark:bg-rose-950/40 bg-rose-50 border dark:border-rose-600/30 border-rose-300 dark:text-rose-300 text-rose-800 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                💥 "Utterly Lifeless"
              </button>
              <button
                onClick={() => loadReviewIntoAnalyzer("Great visuals and acting, but the second half drags noticeably.", "Clockmaker", "Drama")}
                className="px-3 py-1.5 rounded-lg dark:bg-amber-950/40 bg-amber-50 border dark:border-amber-600/30 border-amber-300 dark:text-amber-300 text-amber-800 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                ⚖️ "Mixed Pacing"
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Stat Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-wider font-mono dark:text-slate-400 text-slate-700 font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600 dark:text-cyan-400" />
            <span>Sentiment System Pulse</span>
          </h2>
          <span className="text-[11px] font-mono dark:text-purple-300 text-purple-800 px-2 py-0.5 rounded dark:bg-purple-950/50 bg-purple-100 border dark:border-purple-800/40 border-purple-200">
            {analysisHistory.some(r => r.source === 'demo') ? 'Includes Demo & Live Records' : 'Live Analyzed Data'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Reviews Card */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold dark:text-slate-400 text-slate-600 uppercase tracking-wide font-sans">Total Analyzed</span>
              <Film className="w-5 h-5 text-purple-600 dark:text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono dark:text-white text-slate-900">{totalAnalyzed}</span>
              <span className="text-xs dark:text-slate-400 text-slate-600">reviews processed</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs dark:text-cyan-300/80 text-cyan-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Full NLP tokenization logged</span>
            </div>
          </div>

          {/* Positive Reviews Card */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide font-sans">Positive Reviews</span>
              <ThumbsUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-300">{positiveCount}</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">({positivePct}%)</span>
            </div>
            <div className="mt-3 w-full dark:bg-slate-800 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${positivePct}%` }} />
            </div>
          </div>

          {/* Negative Reviews Card */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide font-sans">Negative Reviews</span>
              <ThumbsDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-rose-600 dark:text-rose-300">{negativeCount}</span>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">({negativePct}%)</span>
            </div>
            <div className="mt-3 w-full dark:bg-slate-800 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${negativePct}%` }} />
            </div>
          </div>

          {/* Neutral & Confidence Card */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide font-sans">Neutral & Mixed</span>
              <Minus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-300">{neutralCount}</span>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">({neutralPct}%)</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-600 font-medium">
              <span>Avg Confidence:</span>
              <span className="font-mono font-bold dark:text-white text-slate-900">{avgConfidence}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sentiment Distribution Overview & Visual Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b dark:border-slate-800/80 border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold font-cinematic dark:text-white text-slate-900">Sentiment Distribution Breakdown</h2>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 font-sans">
                Real-time proportional distribution of public opinion across evaluated film critiques.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs font-semibold text-purple-600 dark:text-cyan-400 hover:opacity-80 flex items-center gap-1 group"
              >
                <span>View Full Analytics Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Visual Multi-Segment Bar */}
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 w-full dark:bg-slate-900 bg-slate-100 rounded-xl overflow-hidden flex p-1 gap-1 border dark:border-slate-800 border-slate-300">
                <div
                  style={{ width: `${Math.max(5, positivePct)}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-lg transition-all duration-700"
                  title={`Positive: ${positivePct}%`}
                />
                <div
                  style={{ width: `${Math.max(5, neutralPct)}%` }}
                  className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-lg transition-all duration-700"
                  title={`Neutral: ${neutralPct}%`}
                />
                <div
                  style={{ width: `${Math.max(5, negativePct)}%` }}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-lg transition-all duration-700"
                  title={`Negative: ${negativePct}%`}
                />
              </div>

              {/* Legend & Count details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl dark:bg-emerald-950/20 bg-emerald-50 border dark:border-emerald-800/30 border-emerald-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Positive Reviews</span>
                  </div>
                  <div className="mt-1 text-lg font-mono font-bold dark:text-white text-slate-900">{positiveCount} <span className="text-xs dark:text-slate-400 text-slate-600">({positivePct}%)</span></div>
                </div>

                <div className="p-3 rounded-xl dark:bg-amber-950/20 bg-amber-50 border dark:border-amber-800/30 border-amber-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Neutral / Mixed</span>
                  </div>
                  <div className="mt-1 text-lg font-mono font-bold dark:text-white text-slate-900">{neutralCount} <span className="text-xs dark:text-slate-400 text-slate-600">({neutralPct}%)</span></div>
                </div>

                <div className="p-3 rounded-xl dark:bg-rose-950/20 bg-rose-50 border dark:border-rose-800/30 border-rose-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Negative Reviews</span>
                  </div>
                  <div className="mt-1 text-lg font-mono font-bold dark:text-white text-slate-900">{negativeCount} <span className="text-xs dark:text-slate-400 text-slate-600">({negativePct}%)</span></div>
                </div>
              </div>
            </div>

            {/* Quick Insights Box */}
            <div className="p-5 rounded-2xl dark:bg-slate-900/90 bg-slate-100 border dark:border-slate-800/80 border-slate-300 space-y-3">
              <span className="text-xs font-mono font-semibold dark:text-purple-300 text-purple-700 uppercase tracking-wider">Sentiment Index</span>
              <p className="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
                Overall audience sentiment tilts <strong className={positivePct >= negativePct ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                  {positivePct >= negativePct ? "favorable" : "critical"}
                </strong>, with strong emotional polarity in narrative and acting reviews.
              </p>
              <div className="pt-2 border-t dark:border-slate-800 border-slate-300 flex items-center justify-between text-xs">
                <span className="dark:text-slate-400 text-slate-600">Data Reliability:</span>
                <span className="font-mono text-purple-600 dark:text-cyan-400 font-semibold">Calibrated Probabilities</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
