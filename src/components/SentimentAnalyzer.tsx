import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_REVIEWS_FOR_ANALYZER } from '../data/mockData';
import { SentimentGauge } from './SentimentGauge';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Send, 
  Copy, 
  Download, 
  Film, 
  Check, 
  AlertTriangle, 
  FileText, 
  BrainCircuit, 
  Smile, 
  Frown, 
  Meh, 
  Tag, 
  Sliders, 
  Cpu
} from 'lucide-react';

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Documentary',
  'Mystery'
];

export const SentimentAnalyzer: React.FC = () => {
  const { 
    currentAnalysis, 
    setCurrentAnalysis,
    isAnalyzing, 
    analyzerInput, 
    setAnalyzerInput, 
    analyzeReview, 
    showToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (field: 'reviewText' | 'movieTitle' | 'genre', val: string) => {
    setAnalyzerInput(prev => ({ ...prev, [field]: val }));
    if (validationError) setValidationError(null);
  };

  const handleSelectSample = (sample: typeof SAMPLE_REVIEWS_FOR_ANALYZER[0]) => {
    setAnalyzerInput({
      reviewText: sample.review,
      movieTitle: sample.title,
      genre: sample.genre
    });
    setValidationError(null);
  };

  const handleClear = () => {
    setAnalyzerInput({
      reviewText: '',
      movieTitle: '',
      genre: 'Drama'
    });
    setCurrentAnalysis(null);
    setValidationError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = analyzerInput.reviewText.trim();

    if (!text) {
      setValidationError('Please enter or paste a movie review to analyze.');
      return;
    }

    if (text.length < 15) {
      setValidationError('Review text is too brief (minimum 15 characters required for meaningful NLP analysis).');
      return;
    }

    if (text.length > 5000) {
      setValidationError('Review exceeds maximum limit of 5,000 characters. Please trim the content.');
      return;
    }

    setValidationError(null);
    try {
      const result = await analyzeReview(text, analyzerInput.movieTitle, analyzerInput.genre);
      
      // If overwhelmingly positive (confidence > 88% and positive), celebrate!
      if (result.sentiment === 'Positive' && result.confidence >= 85) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch {
      // Handled in context toast
    }
  };

  const handleCopyReport = () => {
    if (!currentAnalysis) return;
    const report = `CineSense Sentiment Analysis Report
Movie: ${currentAnalysis.movieTitle || 'Untitled'} (${currentAnalysis.genre || 'Cinema'})
Sentiment: ${currentAnalysis.sentiment} (${currentAnalysis.confidence}% Confidence)
Polarity Score: ${currentAnalysis.polarityScore > 0 ? '+' : ''}${currentAnalysis.polarityScore}
Subjectivity: ${(currentAnalysis.subjectivityScore * 100).toFixed(0)}%
AI Summary: ${currentAnalysis.summary}
Tokens: ${currentAnalysis.tokenMetrics.totalTokens} | Words: ${currentAnalysis.tokenMetrics.wordCount}
Model: ${currentAnalysis.modelUsed}
Analyzed At: ${new Date(currentAnalysis.timestamp).toLocaleString()}
`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    showToast('Analysis report copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!currentAnalysis) return;
    const blob = new Blob([JSON.stringify(currentAnalysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinesense_${(currentAnalysis.movieTitle || 'movie').replace(/\s+/g, '_').toLowerCase()}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Analysis JSON downloaded', 'info');
  };

  const charCount = analyzerInput.reviewText.length;
  const wordCount = analyzerInput.reviewText.trim() ? analyzerInput.reviewText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono dark:text-cyan-300 text-purple-800 dark:bg-cyan-950/60 bg-purple-100 dark:border-cyan-800/50 border-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
            <span>Interactive Sentiment Inference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-cinematic dark:text-white text-slate-900 tracking-tight">
            Movie Review Sentiment Analyzer
          </h1>
          <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mt-1 font-sans">
            Enter any movie review below to extract semantic polarity, keyword sentiment weights, and aspect breakdown.
          </p>
        </div>

        {/* Quick Sample Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs dark:text-slate-400 text-slate-600 font-mono font-medium hidden sm:inline">Test Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_REVIEWS_FOR_ANALYZER.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
                title={sample.review}
              >
                {sample.label.split(' ')[0]} {sample.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form vs Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Review Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b dark:border-slate-800/80 border-slate-200 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono dark:text-cyan-400 text-purple-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Review Input Workspace</span>
              </h2>
              <span className="text-[11px] font-mono dark:text-slate-400 text-slate-600 font-medium">
                {wordCount} words • {charCount}/5000 chars
              </span>
            </div>

            {/* Movie Title & Genre Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5 font-sans">
                  Movie Title <span className="dark:text-slate-400 text-slate-500 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Film className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={analyzerInput.movieTitle}
                    onChange={e => handleInputChange('movieTitle', e.target.value)}
                    placeholder="e.g. Dune: Part Two"
                    className="w-full pl-9 pr-3 py-2 rounded-xl dark:bg-slate-900/90 bg-white border dark:border-slate-700/80 border-slate-300 dark:text-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5 font-sans">
                  Genre
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={analyzerInput.genre}
                    onChange={e => handleInputChange('genre', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl dark:bg-slate-900/90 bg-white border dark:border-slate-700/80 border-slate-300 dark:text-white text-slate-900 text-xs focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer"
                  >
                    {GENRES.map(g => (
                      <option key={g} value={g} className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Review Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 font-sans">
                  Movie Review Text <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] dark:text-slate-400 text-slate-500">
                  Type or paste raw reviewer feedback
                </span>
              </div>
              <textarea
                rows={7}
                value={analyzerInput.reviewText}
                onChange={e => handleInputChange('reviewText', e.target.value)}
                placeholder="Write your review here... e.g., 'The cinematography was spellbinding, but the plot dragged heavily in the final act with predictable dialogue.'"
                className="w-full p-3.5 rounded-2xl dark:bg-slate-900/90 bg-white border dark:border-slate-700/80 border-slate-300 dark:text-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors resize-y leading-relaxed font-sans"
              />
            </div>

            {/* Validation Error Feedback */}
            {validationError && (
              <div className="p-3 rounded-xl dark:bg-rose-950/40 bg-rose-50 border dark:border-rose-500/40 border-rose-300 dark:text-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Sentiment...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-cyan-200" />
                    <span>Analyze Sentiment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={isAnalyzing}
                className="py-3 px-4 rounded-xl dark:bg-slate-900 bg-white dark:hover:bg-slate-800 hover:bg-slate-100 dark:text-slate-300 text-slate-700 dark:border-slate-700 border-slate-300 shadow-sm text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset review form"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </form>

          {/* NLP Explanation Card */}
          <div className="p-5 rounded-2xl dark:bg-slate-900/60 bg-slate-100 border dark:border-slate-800/80 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold dark:text-purple-300 text-purple-700 uppercase font-mono">
              <BrainCircuit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>How Confidence & Polarity Are Calculated</span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
              Polarity represents the directional sentiment vector from -1.0 (overwhelmingly negative) to +1.0 (overwhelmingly positive). 
              Confidence indicates model certainty derived from soft probability distributions over linguistic attention weights.
            </p>
          </div>
        </div>

        {/* Right Column: Analysis Results Panel (7 cols) */}
        <div className="lg:col-span-7">
          {currentAnalysis ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6 shadow-2xl relative">
              {/* Header with Title and Model Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-800/80 border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinematic font-black text-xl dark:text-white text-slate-900">
                      {currentAnalysis.movieTitle || 'Movie Review Analysis'}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 dark:border-slate-700 border-slate-300">
                      {currentAnalysis.genre || 'Cinema'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono dark:text-cyan-400 text-purple-700 font-semibold flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      {currentAnalysis.modelUsed}
                    </span>
                    <span className="dark:text-slate-500 text-slate-400 text-xs">•</span>
                    <span className="text-[11px] font-mono dark:text-slate-400 text-slate-600">
                      {new Date(currentAnalysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Report Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="p-2 rounded-xl dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700 shadow-sm hover:border-slate-400 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    title="Copy analysis summary to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="p-2 rounded-xl dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700 shadow-sm hover:border-slate-400 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    title="Download JSON data"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Top Section: Sentiment Gauge Visualization */}
              <div className="p-4 rounded-2xl dark:bg-slate-950/60 bg-slate-50 dark:border-slate-800/80 border-slate-200 flex flex-col items-center">
                <SentimentGauge
                  sentiment={currentAnalysis.sentiment}
                  confidence={currentAnalysis.confidence}
                  polarityScore={currentAnalysis.polarityScore}
                />

                <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t dark:border-slate-800/60 border-slate-200 text-center">
                  <div className="p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200">
                    <div className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600">Polarity</div>
                    <div className="text-sm font-bold font-mono dark:text-cyan-300 text-purple-700">
                      {currentAnalysis.polarityScore > 0 ? `+${currentAnalysis.polarityScore.toFixed(2)}` : currentAnalysis.polarityScore.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200">
                    <div className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600">Subjectivity</div>
                    <div className="text-sm font-bold font-mono dark:text-purple-300 text-purple-700">
                      {Math.round(currentAnalysis.subjectivityScore * 100)}%
                    </div>
                  </div>
                  <div className="p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200">
                    <div className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600">Tokens</div>
                    <div className="text-sm font-bold font-mono dark:text-white text-slate-900">
                      {currentAnalysis.tokenMetrics.totalTokens}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200">
                    <div className="text-[10px] uppercase font-mono dark:text-slate-400 text-slate-600">Read Time</div>
                    <div className="text-sm font-bold font-mono dark:text-slate-300 text-slate-700">
                      ~{currentAnalysis.tokenMetrics.readingTimeSeconds}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Summary (Clearly Distinguished from Classification) */}
              <div className="p-4 rounded-2xl dark:bg-gradient-to-r dark:from-purple-950/30 dark:to-indigo-950/30 bg-purple-50 border dark:border-purple-500/20 border-purple-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold dark:text-purple-300 text-purple-800 font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
                  <span>AI Review Synopsis (Distinct from Raw Sentiment)</span>
                </div>
                <p className="text-sm dark:text-slate-200 text-slate-800 leading-relaxed font-sans italic">
                  "{currentAnalysis.summary}"
                </p>
              </div>

              {/* Key Words & Explainability Phrases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
                    <span>Explainable Linguistic Signals & Key Phrases</span>
                  </h3>
                  <span className="text-[10px] dark:text-slate-400 text-slate-600 font-mono">Influences Classification</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.keyPhrases && currentAnalysis.keyPhrases.length > 0 ? (
                    currentAnalysis.keyPhrases.map((phrase, idx) => {
                      const isPos = phrase.sentiment === 'positive';
                      const isNeg = phrase.sentiment === 'negative';
                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-transform hover:scale-105 ${
                            isPos
                              ? 'dark:bg-emerald-950/40 bg-emerald-50 dark:text-emerald-300 text-emerald-800 dark:border-emerald-500/40 border-emerald-300'
                              : isNeg
                              ? 'dark:bg-rose-950/40 bg-rose-50 dark:text-rose-300 text-rose-800 dark:border-rose-500/40 border-rose-300'
                              : 'dark:bg-cyan-950/40 bg-purple-50 dark:text-cyan-300 text-purple-800 dark:border-cyan-500/40 border-purple-300'
                          }`}
                          title={`Weight impact: ${Math.round(phrase.weight * 100)}%`}
                        >
                          {isPos && <Smile className="w-3.5 h-3.5 text-emerald-500" />}
                          {isNeg && <Frown className="w-3.5 h-3.5 text-rose-500" />}
                          {!isPos && !isNeg && <Meh className="w-3.5 h-3.5 text-purple-500 dark:text-cyan-400" />}
                          <span className="font-semibold">{phrase.text}</span>
                          <span className="text-[10px] opacity-80 font-mono">({Math.round(phrase.weight * 100)}%)</span>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs dark:text-slate-400 text-slate-600">No strong sentiment-bearing phrases detected.</span>
                  )}
                </div>
              </div>

              {/* Aspect-Based Sentiment Breakdown */}
              {currentAnalysis.aspects && currentAnalysis.aspects.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider dark:text-slate-300 text-slate-700 mb-3 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Cinematic Aspect Breakdown</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentAnalysis.aspects.map((aspect, idx) => {
                      const isPos = aspect.sentiment === 'Positive';
                      const isNeg = aspect.sentiment === 'Negative';
                      const isNeu = aspect.sentiment === 'Neutral';

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl dark:bg-slate-900/80 bg-white border dark:border-slate-800 border-slate-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium dark:text-slate-300 text-slate-800">{aspect.aspect}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              isPos
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                                : isNeg
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                                : isNeu
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500'
                            }`}
                          >
                            {aspect.sentiment}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Raw Review Quotation Box */}
              <div className="pt-2 border-t dark:border-slate-800/80 border-slate-200">
                <div className="text-[11px] dark:text-slate-400 text-slate-600 uppercase font-mono mb-1.5 font-semibold">Raw Review Text:</div>
                <div className="p-3 rounded-xl dark:bg-slate-950/70 bg-slate-50 border dark:border-slate-800/80 border-slate-200 text-xs dark:text-slate-300 text-slate-800 leading-relaxed font-mono max-h-32 overflow-y-auto">
                  {currentAnalysis.reviewText}
                </div>
              </div>
            </div>
          ) : (
            /* Placeholder State When No Review Analyzed Yet */
            <div className="glass-panel p-12 rounded-3xl border border-dashed dark:border-slate-800 border-slate-300 text-center flex flex-col items-center justify-center min-h-[460px] space-y-4">
              <div className="w-16 h-16 rounded-2xl dark:bg-purple-950/60 bg-purple-100 border dark:border-purple-500/30 border-purple-200 flex items-center justify-center dark:text-purple-400 text-purple-700 shadow-md">
                <BrainCircuit className="w-8 h-8 text-purple-600 dark:text-cyan-400 animate-pulse" />
              </div>
              <div className="max-w-md">
                <h3 className="font-cinematic font-bold text-xl dark:text-white text-slate-900">
                  Awaiting Movie Review Input
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-2 leading-relaxed">
                  Type or paste a movie review on the left, or select one of our curated test presets above, then click <strong>Analyze Sentiment</strong> to generate an explainable AI report.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectSample(SAMPLE_REVIEWS_FOR_ANALYZER[0])}
                className="mt-2 px-4 py-2 rounded-xl dark:bg-slate-900 bg-white hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-slate-700 border-slate-300 text-purple-700 dark:text-cyan-300 text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
              >
                Load Sample: "Interstellar Odyssey"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
