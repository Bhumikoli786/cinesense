import React, { useState } from 'react';
import { PIPELINE_STEPS } from '../data/mockData';
import { cleanText, tokenize, removeStopwords, calculateTokenMetrics } from '../utils/sentimentEngine';
import { 
  Layers, 
  Code2, 
  Sparkles, 
  Cpu, 
  FileText, 
  Network, 
  BarChart3, 
  RotateCcw
} from 'lucide-react';

export const PipelineVisualization: React.FC = () => {
  const [selectedStepId, setSelectedStepId] = useState<string>('step-1');
  const [interactiveInput, setInteractiveInput] = useState<string>(
    'The cinematography was absolutely breathtaking, but the screenplay was somewhat uninspired!'
  );

  const selectedStep = PIPELINE_STEPS.find(s => s.id === selectedStepId) || PIPELINE_STEPS[0];

  // Dynamic live processing of interactiveInput
  const cleanedText = cleanText(interactiveInput);
  const rawTokens = tokenize(cleanedText);
  const filteredTokens = removeStopwords(rawTokens);
  const metrics = calculateTokenMetrics(interactiveInput);

  const iconsMap: Record<string, React.ElementType> = {
    FileText,
    Sparkles,
    Cpu,
    Network,
    Layers,
    BarChart3
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono dark:text-cyan-300 text-purple-800 dark:bg-cyan-950/60 bg-purple-100 dark:border-cyan-800/50 border-purple-200">
          <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400" />
          <span>Interactive Architectural Walkthrough</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-cinematic dark:text-white text-slate-900">
          How Our AI Thinks: The NLP Pipeline
        </h1>
        <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 leading-relaxed font-sans">
          Step inside the machine learning transformation pipeline. From raw unstructured audience text 
          to normalized tokens, contextual vectors, and explainable sentiment classification.
        </p>
      </div>

      {/* Connected Pipeline Stepper (Clickable Nodes) */}
      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-indigo-500/30 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {PIPELINE_STEPS.map((step, index) => {
            const isSelected = step.id === selectedStepId;
            const IconComponent = iconsMap[step.iconName] || Cpu;

            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'dark:bg-slate-900 bg-white border-2 border-purple-600 dark:border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105'
                    : 'dark:bg-slate-950/80 bg-white border dark:border-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-md'
                      : 'dark:bg-slate-900 bg-slate-100 dark:text-slate-400 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase dark:text-slate-400 text-slate-500 mb-0.5">
                  Stage 0{index + 1}
                </span>
                <span
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'dark:text-white text-slate-900' : 'dark:text-slate-300 text-slate-700'
                  }`}
                >
                  {step.title.split('. ')[1] || step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Step Details Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800/80 border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold dark:text-cyan-400 text-purple-700 uppercase tracking-wider px-2 py-0.5 rounded dark:bg-cyan-950/80 bg-purple-100 dark:border-cyan-800/50 border-purple-200">
                Selected Stage
              </span>
              <h2 className="text-xl font-bold font-cinematic dark:text-white text-slate-900">{selectedStep.title}</h2>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 font-sans">{selectedStep.shortDesc}</p>
          </div>
        </div>

        {/* Technical Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold font-mono uppercase dark:text-slate-400 text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Algorithmic Mechanism</span>
              </h3>
              <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-700 leading-relaxed font-sans">
                {selectedStep.technicalDetails}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold font-mono uppercase dark:text-slate-400 text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Reference Code Implementation</span>
              </h3>
              <pre className="p-3.5 rounded-xl dark:bg-slate-950 bg-slate-900 border dark:border-slate-800/90 border-slate-700 text-cyan-300 text-xs font-mono overflow-x-auto">
                <code>{selectedStep.codeSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Example Input / Output for this Step */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl dark:bg-slate-900/80 bg-slate-100 border dark:border-slate-800 border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-rose-600 dark:text-rose-300">
                Input To This Stage:
              </span>
              <div className="p-3 rounded-xl dark:bg-slate-950/80 bg-white text-xs font-mono dark:text-slate-300 text-slate-800 border dark:border-slate-800 border-slate-300">
                {selectedStep.exampleRaw}
              </div>
            </div>

            <div className="p-4 rounded-2xl dark:bg-slate-900/80 bg-slate-100 border dark:border-slate-800 border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-300">
                Output Produced By This Stage:
              </span>
              <div className="p-3 rounded-xl dark:bg-slate-950/80 bg-white text-xs font-mono text-emerald-700 dark:text-emerald-300 border dark:border-slate-800 border-slate-300">
                {selectedStep.exampleProcessed}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Sandbox */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-cyan-500/30 border-purple-300 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-800/80 border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-cyan-400" />
              <h2 className="text-lg font-bold font-cinematic dark:text-white text-slate-900">
                Live NLP Pipeline Sandbox
              </h2>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 font-sans">
              Type or paste any custom sentence below to watch the NLP engine clean, tokenize, and score it dynamically in real-time.
            </p>
          </div>

          <button
            onClick={() => setInteractiveInput('The cinematography was absolutely breathtaking, but the screenplay was somewhat uninspired!')}
            className="text-xs font-mono dark:text-cyan-400 text-purple-700 hover:opacity-80 flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Text</span>
          </button>
        </div>

        {/* Custom Input */}
        <div>
          <input
            type="text"
            value={interactiveInput}
            onChange={e => setInteractiveInput(e.target.value)}
            placeholder="Type any test sentence..."
            className="w-full p-3.5 rounded-xl dark:bg-slate-900/90 bg-white border dark:border-slate-700/80 border-slate-300 dark:text-white text-slate-900 text-sm focus:outline-none focus:border-cyan-400 transition-colors font-sans"
          />
        </div>

        {/* Real-Time Processing Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cleaned text */}
          <div className="p-4 rounded-2xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase dark:text-slate-400 text-slate-600">
              1. Sanitized Text:
            </span>
            <p className="text-xs dark:text-slate-200 text-slate-800 font-mono break-words">
              "{cleanedText || '(empty)'}"
            </p>
          </div>

          {/* Tokens */}
          <div className="p-4 rounded-2xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase dark:text-slate-400 text-slate-600">
                2. Extracted Tokens:
              </span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-cyan-400 font-bold">{rawTokens.length} tokens</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {rawTokens.map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded dark:bg-slate-800 bg-slate-200 text-[10px] font-mono dark:text-cyan-300 text-slate-800">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Filtered Stopwords & Lexical metrics */}
          <div className="p-4 rounded-2xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase dark:text-slate-400 text-slate-600">
              3. Sentiment Vocabulary:
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {filteredTokens.map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded dark:bg-purple-950 bg-purple-100 text-[10px] font-mono dark:text-purple-300 text-purple-900 border dark:border-purple-800/50 border-purple-200">
                  {t}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600 flex justify-between font-mono">
              <span>Lexical Diversity:</span>
              <span className="dark:text-white text-slate-900 font-bold">{metrics.lexicalDiversity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
