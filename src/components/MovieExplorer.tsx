import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_MOVIES_CATALOG } from '../data/mockData';
import { SentimentType } from '../types';
import { 
  Compass, 
  Search, 
  Filter, 
  Star, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  ArrowRight, 
  Atom, 
  Skull, 
  Heart, 
  Zap, 
  Scale, 
  Laugh,
  Film
} from 'lucide-react';

export const MovieExplorer: React.FC = () => {
  const { loadReviewIntoAnalyzer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedSentiment, setSelectedSentiment] = useState<'All' | SentimentType>('All');

  const iconComponentMap: Record<string, React.ElementType> = {
    Atom,
    Skull,
    Heart,
    Zap,
    Scale,
    Laugh
  };

  const filteredMovies = DEMO_MOVIES_CATALOG.filter(movie => {
    const matchesSearch = 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.sampleReview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'All' ? true : movie.genre === selectedGenre;
    const matchesSentiment = selectedSentiment === 'All' ? true : movie.actualSentiment === selectedSentiment;

    return matchesSearch && matchesGenre && matchesSentiment;
  });

  const allGenres = Array.from(new Set(DEMO_MOVIES_CATALOG.map(m => m.genre)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono dark:text-cyan-300 text-purple-800 dark:bg-cyan-950/60 bg-purple-100 dark:border-cyan-800/50 border-purple-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
            <span>Curated Demonstration Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-cinematic dark:text-white text-slate-900 tracking-tight">
            Movie Review Explorer
          </h1>
          <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mt-1 font-sans">
            Explore curated film titles across genres with critic excerpts and benchmark sentiment evaluations.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 text-[11px] font-mono dark:text-slate-400 text-slate-700 shadow-sm">
          Showing {filteredMovies.length} curated benchmark titles
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border dark:border-slate-800 border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search title, director, or review words..."
            className="w-full pl-9 pr-3 py-2 rounded-xl dark:bg-slate-900/90 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="p-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Genres</option>
              {allGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSentiment}
              onChange={e => setSelectedSentiment(e.target.value as any)}
              className="p-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map(movie => {
          const IconComp = iconComponentMap[movie.posterIcon] || Film;
          const isPos = movie.actualSentiment === 'Positive';
          const isNeg = movie.actualSentiment === 'Negative';

          return (
            <div
              key={movie.id}
              className="glass-panel rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden flex flex-col justify-between hover:border-purple-400 dark:hover:border-slate-700 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Cinematic Visual Poster Header (Always dark background for posters) */}
              <div className={`relative h-44 bg-gradient-to-br ${movie.posterBg} p-5 flex flex-col justify-between overflow-hidden text-white`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Top Badge Row */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {movie.genre} • {movie.year}
                  </span>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{movie.rating}</span>
                  </div>
                </div>

                {/* Center Icon & Title */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="font-cinematic font-black text-lg text-white leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Dir. {movie.director}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Excerpt & Sentiment Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono inline-flex items-center gap-1 ${
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
                      <span>{movie.actualSentiment}</span>
                    </span>

                    <span className="text-[11px] font-mono dark:text-cyan-400 text-purple-700 font-bold">
                      {movie.confidence}% Confidence
                    </span>
                  </div>

                  <p className="text-xs dark:text-slate-300 text-slate-700 leading-relaxed font-sans italic dark:bg-slate-950/40 bg-slate-50 p-3 rounded-xl border dark:border-slate-800/80 border-slate-200">
                    "{movie.sampleReview}"
                  </p>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => loadReviewIntoAnalyzer(movie.sampleReview, movie.title, movie.genre)}
                  className="w-full py-2.5 px-3 rounded-xl dark:bg-slate-900 bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 hover:text-white border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400 group-hover:text-white" />
                  <span>Analyze This Review in CineSense</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
