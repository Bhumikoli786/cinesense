import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_CSV_DATA } from '../data/mockData';
import { analyzeSentimentLocally } from '../utils/sentimentEngine';
import { SentimentType } from '../types';
import { 
  Upload, 
  FileSpreadsheet, 
  Play, 
  Download, 
  Search, 
  Filter, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Minus,
  Sparkles,
  RefreshCw,
  Table
} from 'lucide-react';

interface ParsedRow {
  id: string;
  movieTitle: string;
  genre: string;
  reviewText: string;
  sentiment?: SentimentType;
  confidence?: number;
  polarityScore?: number;
}

export const BatchAnalysis: React.FC = () => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [selectedTextCol, setSelectedTextCol] = useState<string>('');
  const [selectedTitleCol, setSelectedTitleCol] = useState<string>('');
  const [selectedGenreCol, setSelectedGenreCol] = useState<string>('');

  const [batchResults, setBatchResults] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | SentimentType>('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Robust CSV parser supporting quotes & commas
  const parseCSV = (csvContent: string) => {
    try {
      const lines = csvContent.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        throw new Error('CSV must contain a header row and at least one data row.');
      }

      const splitRow = (rowStr: string): string[] => {
        const matches: string[] = [];
        let cur = '';
        let insideQuote = false;
        for (let i = 0; i < rowStr.length; i++) {
          const char = rowStr[i];
          if (char === '"') {
            insideQuote = !insideQuote;
          } else if (char === ',' && !insideQuote) {
            matches.push(cur.trim().replace(/^"|"$/g, ''));
            cur = '';
          } else {
            cur += char;
          }
        }
        matches.push(cur.trim().replace(/^"|"$/g, ''));
        return matches;
      };

      const parsedHeaders = splitRow(lines[0]);
      if (parsedHeaders.length === 0) {
        throw new Error('No column headers detected in CSV.');
      }

      const parsedData: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = splitRow(lines[i]);
        const obj: Record<string, string> = {};
        parsedHeaders.forEach((h, idx) => {
          obj[h] = values[idx] || '';
        });
        parsedData.push(obj);
      }

      setHeaders(parsedHeaders);
      setRows(parsedData);
      setErrorMsg(null);

      const textColCandidate = parsedHeaders.find(h => /review|text|comment|body|critique/i.test(h)) || parsedHeaders[0];
      const titleColCandidate = parsedHeaders.find(h => /title|movie|film|name/i.test(h)) || '';
      const genreColCandidate = parsedHeaders.find(h => /genre|category/i.test(h)) || '';

      setSelectedTextCol(textColCandidate);
      setSelectedTitleCol(titleColCandidate);
      setSelectedGenreCol(genreColCandidate);

      showToast(`Parsed ${parsedData.length} reviews from CSV`, 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV file. Please verify CSV structure.');
      showToast('CSV Parsing Error', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Please upload a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      parseCSV(content);
    };
    reader.onerror = () => {
      setErrorMsg('Error reading uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCSV = () => {
    parseCSV(SAMPLE_CSV_DATA);
  };

  const handleRunBatchAnalysis = async () => {
    if (!selectedTextCol) {
      setErrorMsg('Please select which column contains the review text.');
      return;
    }
    if (rows.length === 0) {
      setErrorMsg('No review rows available to analyze.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setErrorMsg(null);

    const results: ParsedRow[] = [];
    const total = rows.length;

    for (let i = 0; i < total; i++) {
      const row = rows[i];
      const text = row[selectedTextCol] || '';
      const movieTitle = selectedTitleCol ? row[selectedTitleCol] : `Movie #${i + 1}`;
      const genre = selectedGenreCol ? row[selectedGenreCol] : 'Cinema';

      const analysis = analyzeSentimentLocally(text, movieTitle, genre);

      results.push({
        id: `batch_item_${i}`,
        movieTitle,
        genre,
        reviewText: text,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        polarityScore: analysis.polarityScore
      });

      setProgress(Math.round(((i + 1) / total) * 100));
      if (i % 5 === 0) {
        await new Promise(r => setTimeout(r, 20));
      }
    }

    setBatchResults(results);
    setIsProcessing(false);
    showToast(`Batch completed: ${results.length} reviews classified!`, 'success');
  };

  const handleDownloadAnalyzedCSV = () => {
    if (batchResults.length === 0) return;

    const csvRows: string[] = [];
    csvRows.push('id,movie_title,genre,sentiment,confidence_pct,polarity_score,review_text');

    batchResults.forEach(r => {
      const safeTitle = `"${(r.movieTitle || '').replace(/"/g, '""')}"`;
      const safeGenre = `"${(r.genre || '').replace(/"/g, '""')}"`;
      const safeText = `"${(r.reviewText || '').replace(/"/g, '""')}"`;
      csvRows.push(`${r.id},${safeTitle},${safeGenre},${r.sentiment},${r.confidence},${r.polarityScore},${safeText}`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinesense_batch_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded analyzed CSV file', 'info');
  };

  const filteredResults = batchResults.filter(item => {
    const matchesSearch = 
      item.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSentiment = 
      sentimentFilter === 'All' ? true : item.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  const batchPositive = batchResults.filter(r => r.sentiment === 'Positive').length;
  const batchNegative = batchResults.filter(r => r.sentiment === 'Negative').length;
  const batchNeutral = batchResults.filter(r => r.sentiment === 'Neutral').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono dark:text-cyan-300 text-purple-800 dark:bg-cyan-950/60 bg-purple-100 dark:border-cyan-800/50 border-purple-200 mb-2">
            <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
            <span>High-Throughput Processing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-cinematic dark:text-white text-slate-900 tracking-tight">
            Batch Movie Review Analysis
          </h1>
          <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mt-1 font-sans">
            Upload CSV datasets to classify hundreds of audience critiques simultaneously with sentiment metrics.
          </p>
        </div>

        <button
          onClick={handleLoadSampleCSV}
          className="px-4 py-2 rounded-xl dark:bg-purple-950/60 bg-purple-100 border dark:border-purple-500/40 border-purple-300 dark:text-purple-300 text-purple-900 hover:opacity-90 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
          <span>Load Demo 8-Review CSV</span>
        </button>
      </div>

      {/* Upload Zone & Mapping Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono dark:text-cyan-400 text-purple-700 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>1. Dataset Upload & Column Mapping</span>
            </h2>

            {/* Drag and Drop Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed dark:border-slate-700 border-slate-300 hover:border-purple-500 dark:hover:border-cyan-400 rounded-2xl p-8 text-center cursor-pointer transition-all dark:bg-slate-900/40 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900/80 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl dark:bg-slate-800 bg-white border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-cyan-400 group-hover:scale-110 transition-transform flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold dark:text-white text-slate-900">
                Click to browse or drop CSV file here
              </p>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
                Standard CSV format with headers (e.g. movie_title, genre, review_text)
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl dark:bg-rose-950/50 bg-rose-50 border dark:border-rose-500/40 border-rose-300 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Column Mapping Selectors */}
            {headers.length > 0 && (
              <div className="space-y-3 pt-3 border-t dark:border-slate-800/80 border-slate-200">
                <span className="text-xs font-mono font-bold dark:text-slate-300 text-slate-800 uppercase">
                  Map CSV Columns:
                </span>

                <div>
                  <label className="block text-xs dark:text-slate-400 text-slate-700 mb-1 font-semibold">
                    Review Text Column <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedTextCol}
                    onChange={e => setSelectedTextCol(e.target.value)}
                    className="w-full p-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
                  >
                    {headers.map(h => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs dark:text-slate-400 text-slate-700 mb-1 font-semibold">Movie Title Column</label>
                    <select
                      value={selectedTitleCol}
                      onChange={e => setSelectedTitleCol(e.target.value)}
                      className="w-full p-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">(None)</option>
                      {headers.map(h => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs dark:text-slate-400 text-slate-700 mb-1 font-semibold">Genre Column</label>
                    <select
                      value={selectedGenreCol}
                      onChange={e => setSelectedGenreCol(e.target.value)}
                      className="w-full p-2.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">(None)</option>
                      {headers.map(h => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Run Button */}
                <button
                  onClick={handleRunBatchAnalysis}
                  disabled={isProcessing || !selectedTextCol}
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Processing Batch ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Batch Inference ({rows.length} Reviews)</span>
                    </>
                  )}
                </button>

                {isProcessing && (
                  <div className="w-full dark:bg-slate-800 bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results & Inspection Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {batchResults.length > 0 ? (
            <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-4">
                <div>
                  <h2 className="text-base font-bold font-cinematic dark:text-white text-slate-900 flex items-center gap-2">
                    <Table className="w-4 h-4 text-purple-600 dark:text-cyan-400" />
                    <span>Inference Results ({batchResults.length} Processed)</span>
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{batchPositive} Positive</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{batchNeutral} Neutral</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">{batchNegative} Negative</span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadAnalyzedCSV}
                  className="px-3.5 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 dark:text-cyan-300 text-purple-700 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm hover:border-slate-400"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Analyzed CSV</span>
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search reviews or titles..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={sentimentFilter}
                    onChange={e => setSentimentFilter(e.target.value as any)}
                    className="p-2 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 text-xs dark:text-white text-slate-900 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="All">All Sentiments</option>
                    <option value="Positive">Positive Only</option>
                    <option value="Negative">Negative Only</option>
                    <option value="Neutral">Neutral Only</option>
                  </select>
                </div>
              </div>

              {/* Table View */}
              <div className="border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden max-h-[460px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="dark:bg-slate-900/90 bg-slate-100 sticky top-0 border-b dark:border-slate-800 border-slate-200 dark:text-slate-400 text-slate-700 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Film / Title</th>
                      <th className="p-3">Sentiment</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Review Excerpt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 font-sans">
                    {filteredResults.map(item => {
                      const isPos = item.sentiment === 'Positive';
                      const isNeg = item.sentiment === 'Negative';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 font-semibold dark:text-white text-slate-900 whitespace-nowrap">
                            <div>{item.movieTitle}</div>
                            <span className="text-[10px] dark:text-slate-400 text-slate-600 font-normal">{item.genre}</span>
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
                          <td className="p-3 dark:text-slate-300 text-slate-700 line-clamp-2 max-w-xs font-sans">
                            {item.reviewText}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : rows.length > 0 ? (
            <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b dark:border-slate-800/80 border-slate-200 pb-3">
                <h3 className="text-sm font-bold font-mono uppercase dark:text-slate-300 text-slate-800">
                  Data Preview ({rows.length} Rows Found)
                </h3>
                <span className="text-xs dark:text-cyan-400 text-purple-700 font-mono font-semibold">
                  Ready for Batch Classification
                </span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-600">
                Click <strong>"Start Batch Inference"</strong> on the left to process all {rows.length} rows.
              </p>
              <div className="border dark:border-slate-800 border-slate-200 rounded-xl overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs">
                  <thead className="dark:bg-slate-900 bg-slate-100 border-b dark:border-slate-800 border-slate-200 dark:text-slate-400 text-slate-700 font-mono uppercase text-[10px]">
                    <tr>
                      {headers.map(h => (
                        <th key={h} className="p-2.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800/50 divide-slate-200">
                    {rows.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {headers.map(h => (
                          <td key={h} className="p-2.5 dark:text-slate-300 text-slate-800 max-w-xs truncate">
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-dashed dark:border-slate-800 border-slate-300 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="w-14 h-14 rounded-2xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 flex items-center justify-center text-purple-600 dark:text-cyan-400 shadow-sm">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="max-w-md">
                <h3 className="font-cinematic font-bold text-lg dark:text-white text-slate-900">
                  No Batch Dataset Loaded
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-2 leading-relaxed">
                  Upload a CSV file containing movie review text, or click <strong>"Load Demo 8-Review CSV"</strong> at the top to test batch inference instantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
