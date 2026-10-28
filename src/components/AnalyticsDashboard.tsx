import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SentimentType } from '../types';
import { 
  BarChart3, 
  PieChart, 
  Layers, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  ArrowRight
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { analysisHistory, clearHistory, loadReviewIntoAnalyzer, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<'All' | SentimentType>('All');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All');

  // Compute aggregate numbers
  const totalCount = analysisHistory.length;
  const posCount = analysisHistory.filter(r => r.sentiment === 'Positive').length;
  const negCount = analysisHistory.filter(r => r.sentiment === 'Negative').length;
  const neuCount = analysisHistory.filter(r => r.sentiment === 'Neutral').length;

  const posPct = totalCount > 0 ? (posCount / totalCount) * 100 : 0;
  const neuPct = totalCount > 0 ? (neuCount / totalCount) * 100 : 0;
  const negPct = totalCount > 0 ? (negCount / totalCount) * 100 : 0;

  // Genre breakdown
  const genresMap: Record<string, { pos: number; neg: number; neu: number; total: number }> = {};
  analysisHistory.forEach(r => {
    const g = r.genre || 'Other';
    if (!genresMap[g]) {
      genresMap[g] = { pos: 0, neg: 0, neu: 0, total: 0 };
    }
    genresMap[g].total++;
    if (r.sentiment === 'Positive') genresMap[g].pos++;
    else if (r.sentiment === 'Negative') genresMap[g].neg++;
    else genresMap[g].neu++;
  });

  const allGenres = Object.keys(genresMap);

  // Filtered reviews
  const filteredHistory = analysisHistory.filter(item => {
    const matchesSearch = 
      item.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.movieTitle && item.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSentiment = 
      selectedSentimentFilter === 'All' ? true : item.sentiment === selectedSentimentFilter;

    const matchesGenre = 
      selectedGenreFilter === 'All' ? true : item.genre === selectedGenreFilter;

    return matchesSearch && matchesSentiment && matchesGenre;
  });

  const handleExportJSON = () => {
    if (analysisHistory.length === 0) return;
    const blob = new Blob([JSON.stringify(analysisHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinesense_analytics_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported analytics history as JSON', 'info');
  };

  // SVG Donut Chart Calculation
  const circumference = 377;
  const posStroke = (posPct / 100) * circumference;
  const neuStroke = (neuPct / 100) * circumference;
  const negStroke = (negPct / 100) * circumference;

  const posOffset = 0;
  const neuOffset = -posStroke;
  const negOffset = -(posStroke + neuStroke);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono dark:text-cyan-300 text-purple-800 dark:bg-cyan-950/60 bg-purple-100 dark:border-cyan-800/50 border-purple-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
            <span>Public Opinion Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-cinematic dark:text-white text-slate-900 tracking-tight">
            Movie Sentiment Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mt-1 font-sans">
            Aggregate insights, genre-wise distributions, and trend analysis across all evaluated critiques.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            disabled={totalCount === 0}
            className="px-3.5 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 dark:text-cyan-300 text-purple-700 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm hover:border-slate-400"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Clear all stored analysis history? (This will reset session records)')) {
                clearHistory();
              }
            }}
            disabled={totalCount === 0}
            className="px-3.5 py-2 rounded-xl dark:bg-rose-950/40 bg-rose-50 border dark:border-rose-800/50 border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
            title="Clear saved records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
          <div className="text-xs font-semibold dark:text-slate-400 text-slate-600 uppercase font-sans">Total Reviews Analyzed</div>
          <div className="mt-2 text-3xl font-black font-mono dark:text-white text-slate-900">{totalCount}</div>
          <div className="mt-1 text-[11px] text-purple-600 dark:text-cyan-400 font-mono font-medium">
            {analysisHistory.filter(r => r.source !== 'demo').length} live user evaluations
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 dark:bg-emerald-950/10 bg-emerald-50/50">
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase font-sans flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Positive Ratio</span>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300">{posCount}</div>
          <div className="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-mono font-medium">
            {posPct.toFixed(1)}% of total reviews
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 dark:bg-rose-950/10 bg-rose-50/50">
          <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase font-sans flex items-center gap-1.5">
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Negative Ratio</span>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-rose-700 dark:text-rose-300">{negCount}</div>
          <div className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-400/80 font-mono font-medium">
            {negPct.toFixed(1)}% of total reviews
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 dark:bg-amber-950/10 bg-amber-50/50">
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase font-sans flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5" />
            <span>Neutral / Mixed</span>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-amber-700 dark:text-amber-300">{neuCount}</div>
          <div className="mt-1 text-[11px] text-amber-700/80 dark:text-amber-400/80 font-mono font-medium">
            {neuPct.toFixed(1)}% of total reviews
          </div>
        </div>
      </div>

      {/* Visual Charts: Donut Chart & Genre Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-mono uppercase dark:text-slate-300 text-slate-800 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Sentiment Distribution Donut</span>
              </h2>
              <span className="text-[10px] font-mono dark:text-slate-400 text-slate-500">Proportional Area</span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
              Visual proportion of audience polarity across database records.
            </p>
          </div>

          {/* SVG Donut Visual */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="22"
                  className="dark:text-slate-800 text-slate-200"
                />

                {posCount > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="22"
                    strokeDasharray={`${posStroke} ${circumference}`}
                    strokeDashoffset={posOffset}
                    className="transition-all duration-700"
                  />
                )}

                {neuCount > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="22"
                    strokeDasharray={`${neuStroke} ${circumference}`}
                    strokeDashoffset={neuOffset}
                    className="transition-all duration-700"
                  />
                )}

                {negCount > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="22"
                    strokeDasharray={`${negStroke} ${circumference}`}
                    strokeDashoffset={negOffset}
                    className="transition-all duration-700"
                  />
                )}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono dark:text-white text-slate-900">{totalCount}</span>
                <span className="text-[10px] font-mono uppercase dark:text-slate-400 text-slate-600 font-bold">Reviews</span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-4 border-t dark:border-slate-800 border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 dark:text-slate-300 text-slate-700">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span>Positive Reviews</span>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{posPct.toFixed(1)}% ({posCount})</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 dark:text-slate-300 text-slate-700">
                <span className="w-3 h-3 rounded-md bg-amber-500" />
                <span>Neutral / Mixed</span>
              </div>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{neuPct.toFixed(1)}% ({neuCount})</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 dark:text-slate-300 text-slate-700">
                <span className="w-3 h-3 rounded-md bg-rose-500" />
                <span>Negative Reviews</span>
              </div>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{negPct.toFixed(1)}% ({negCount})</span>
            </div>
          </div>
        </div>

        {/* Genre-Wise Sentiment Comparison (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b dark:border-slate-800/80 border-slate-200 pb-4">
            <div>
              <h2 className="text-sm font-bold font-mono uppercase dark:text-slate-300 text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-cyan-400" />
                <span>Genre-Wise Sentiment Distribution</span>
              </h2>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
                Comparative breakdown of public response by film genre.
              </p>
            </div>
            <span className="text-[10px] font-mono dark:text-cyan-400 text-purple-700 px-2 py-1 rounded dark:bg-cyan-950/60 bg-purple-100 border dark:border-cyan-800/40 border-purple-200 font-semibold">
              {allGenres.length} Genres Tracked
            </span>
          </div>

          {/* Bar comparison per genre */}
          <div className="space-y-4">
            {allGenres.length > 0 ? (
              allGenres.map(g => {
                const data = genresMap[g];
                const gPosPct = data.total > 0 ? Math.round((data.pos / data.total) * 100) : 0;
                const gNeuPct = data.total > 0 ? Math.round((data.neu / data.total) * 100) : 0;
                const gNegPct = data.total > 0 ? Math.round((data.neg / data.total) * 100) : 0;

                return (
                  <div key={g} className="space-y-1.5 p-3 rounded-2xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold dark:text-white text-slate-900">{g}</span>
                        <span className="text-[10px] dark:text-slate-400 text-slate-600 font-mono">({data.total} reviews)</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{gPosPct}% Pos</span>
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">{gNegPct}% Neg</span>
                      </div>
                    </div>

                    <div className="h-3 w-full dark:bg-slate-950 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                      {data.pos > 0 && (
                        <div
                          style={{ width: `${gPosPct}%` }}
                          className="bg-emerald-500 h-full transition-all"
                          title={`${g}: ${data.pos} Positive`}
                        />
                      )}
                      {data.neu > 0 && (
                        <div
                          style={{ width: `${gNeuPct}%` }}
                          className="bg-amber-400 h-full transition-all"
                          title={`${g}: ${data.neu} Neutral`}
                        />
                      )}
                      {data.neg > 0 && (
                        <div
                          style={{ width: `${gNegPct}%` }}
                          className="bg-rose-500 h-full transition-all"
                          title={`${g}: ${data.neg} Negative`}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs dark:text-slate-500 text-slate-600">
                No genre data available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filterable Table of Analyzed Reviews */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold font-cinematic dark:text-white text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Historical Analyzed Reviews Database</span>
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 font-sans">
              Search and filter previous assessments. Click any item to reload into the Analyzer.
            </p>
          </div>
          <span className="text-xs font-mono dark:text-slate-400 text-slate-600 font-medium">
            Showing {filteredHistory.length} of {totalCount} reviews
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by review text or title..."
              className="w-full pl-9 pr-3 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSentimentFilter}
              onChange={e => setSelectedSentimentFilter(e.target.value as any)}
              className="w-full p-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive Only</option>
              <option value="Negative">Negative Only</option>
              <option value="Neutral">Neutral Only</option>
            </select>
          </div>

          <div>
            <select
              value={selectedGenreFilter}
              onChange={e => setSelectedGenreFilter(e.target.value)}
              className="w-full p-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Genres</option>
              {allGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="dark:bg-slate-900 bg-slate-100 sticky top-0 border-b dark:border-slate-800 border-slate-200 dark:text-slate-400 text-slate-700 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Film Title</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Sentiment</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Polarity</th>
                <th className="p-3">Review Synopsis / Text</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 font-sans">
              {filteredHistory.length > 0 ? (
                filteredHistory.map(item => {
                  const isPos = item.sentiment === 'Positive';
                  const isNeg = item.sentiment === 'Negative';
                  const isDemo = item.source === 'demo';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-semibold dark:text-white text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{item.movieTitle || 'Untitled'}</span>
                          {isDemo && (
                            <span className="text-[9px] px-1 py-0.2 rounded dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-700 font-mono">
                              Demo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 dark:text-slate-400 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {item.genre || 'Cinema'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono inline-flex items-center gap-1 ${
                            isPos
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : isNeg
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {isPos && <ThumbsUp className="w-3 h-3" />}
                          {isNeg && <ThumbsDown className="w-3 h-3" />}
                          {!isPos && !isNeg && <Minus className="w-3 h-3" />}
                          <span>{item.sentiment}</span>
                        </span>
                      </td>
                      <td className="p-3 font-mono dark:text-cyan-300 text-purple-700 font-bold whitespace-nowrap">
                        {item.confidence}%
                      </td>
                      <td className="p-3 font-mono dark:text-slate-300 text-slate-700 whitespace-nowrap">
                        {item.polarityScore > 0 ? `+${item.polarityScore.toFixed(2)}` : item.polarityScore.toFixed(2)}
                      </td>
                      <td className="p-3 dark:text-slate-300 text-slate-700 max-w-sm">
                        <p className="line-clamp-2">{item.summary || item.reviewText}</p>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => loadReviewIntoAnalyzer(item.reviewText, item.movieTitle, item.genre)}
                          className="px-2.5 py-1 rounded-lg dark:bg-slate-900 bg-white dark:hover:bg-slate-800 hover:bg-slate-100 dark:border-slate-700 border-slate-300 dark:text-cyan-300 text-purple-700 text-[11px] font-semibold transition-all flex items-center gap-1 ml-auto shadow-sm cursor-pointer"
                        >
                          <span>Re-Analyze</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center dark:text-slate-400 text-slate-600">
                    No reviews match the active search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
