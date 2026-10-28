import React from 'react';
import { 
  Globe2, 
  Lightbulb, 
  Server, 
  ShieldCheck, 
  Database, 
  TrendingUp, 
  Sparkles, 
  Cpu, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export const SdgIntegration: React.FC = () => {
  const pillars = [
    {
      title: '1. Practical AI & NLP Innovation',
      desc: 'Applies modern Natural Language Processing (transformer attention networks & semantic tokenizers) to automate sentiment classification of complex unstructured human prose, replacing labor-intensive manual auditing.',
      icon: Lightbulb,
      tag: 'Technological Innovation'
    },
    {
      title: '2. Unstructured Text to Actionable Data',
      desc: 'Entertainment media generates petabytes of scattered reviews across forums, tickets, and social networks. CineSense extracts structured polarity matrices, aspect scores, and emotional vectors directly into queryable databases.',
      icon: Database,
      tag: 'Information Architecture'
    },
    {
      title: '3. Digital Infrastructure for Media & Creators',
      desc: 'Independent directors, film festivals, and small production studios rarely have the computational infrastructure of mega-studios. CineSense democratizes audience intelligence tools for the entire creative ecosystem.',
      icon: Server,
      tag: 'Inclusive Industry'
    },
    {
      title: '4. High-Throughput Scalable Analytics',
      desc: 'Demonstrates resilient web service design with asynchronous batch processing, capable of streaming and processing thousands of movie reviews without performance degradation.',
      icon: TrendingUp,
      tag: 'Scalable Infrastructure'
    },
    {
      title: '5. Responsible & Explainable AI',
      desc: 'Prioritizes explainable AI (XAI) over opaque black boxes. Every sentiment score is backed by visible linguistic signals, attention weights, token metrics, and confidence intervals.',
      icon: ShieldCheck,
      tag: 'Ethical Governance'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner with Official SDG 9 Palette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br dark:from-[#FD6925]/20 dark:via-slate-900 dark:to-slate-950 from-amber-50 via-white to-slate-50 border border-[#FD6925]/40 p-8 sm:p-12 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FD6925]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#FD6925] text-white font-bold shadow-md">
              <Globe2 className="w-3.5 h-3.5" />
              <span>United Nations Sustainable Development Goal 9</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-cinematic dark:text-white text-slate-900 leading-tight">
              AI for Industry, Innovation & Infrastructure
            </h1>

            <p className="text-sm sm:text-base dark:text-slate-300 text-slate-700 leading-relaxed font-sans">
              How CineSense bridges Natural Language Processing research with digital infrastructure for 
              the global entertainment, film, and streaming sectors.
            </p>
          </div>

          {/* Official Style SDG 9 Block */}
          <div className="shrink-0 p-6 rounded-2xl dark:bg-slate-950/90 bg-white border border-[#FD6925]/50 shadow-xl flex flex-col items-center text-center w-full md:w-64">
            <div className="w-20 h-20 rounded-2xl bg-[#FD6925] text-white flex flex-col items-center justify-center shadow-lg shadow-[#FD6925]/30 mb-3">
              <span className="text-xs font-mono font-bold tracking-tight">SDG</span>
              <span className="text-3xl font-black leading-none">9</span>
            </div>
            <span className="text-xs font-bold dark:text-white text-slate-900 uppercase tracking-wider">
              Industry, Innovation & Infrastructure
            </span>
            <span className="text-[10px] dark:text-amber-300/80 text-amber-800 mt-1 font-mono font-semibold">
              UN Target 9.5 & 9.B
            </span>
          </div>
        </div>
      </div>

      {/* 5 Architectural Pillars Grid */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono dark:text-cyan-400 text-purple-700 uppercase tracking-wider mb-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Five Pillars of Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinematic dark:text-white text-slate-900">
            Transforming Unstructured Sentiment into Resilient Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 hover:border-[#FD6925]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FD6925]/15 border border-[#FD6925]/30 flex items-center justify-center text-[#FD6925]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full dark:bg-slate-900 bg-slate-100 dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700 font-semibold">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-cinematic font-bold text-base dark:text-white text-slate-900">
                    {pillar.title}
                  </h3>

                  <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 border-t dark:border-slate-800/80 border-slate-200 flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-600 font-mono">
                  <span>Pillar Status:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5" /> Integrated
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Breakdown Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <h3 className="text-lg font-bold font-cinematic dark:text-white text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-600 dark:text-cyan-400" />
          <span>SDG 9 Target Mapping Matrix</span>
        </h3>

        <div className="border dark:border-slate-800 border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="dark:bg-slate-900 bg-slate-100 text-slate-700 dark:text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">UN SDG 9 Target</th>
                <th className="p-3.5">Standard Description</th>
                <th className="p-3.5">CineSense Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 divide-slate-200 font-sans">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3.5 font-bold font-mono text-amber-600 dark:text-amber-400 whitespace-nowrap">Target 9.5</td>
                <td className="p-3.5 dark:text-slate-300 text-slate-700">
                  Enhance scientific research and upgrade the technological capabilities of industrial sectors.
                </td>
                <td className="p-3.5 dark:text-slate-200 text-slate-800">
                  Integrates cutting-edge transformer LLMs and lexical sentiment scoring pipelines into the creative arts and media analytics sector.
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3.5 font-bold font-mono text-purple-700 dark:text-cyan-400 whitespace-nowrap">Target 9.B</td>
                <td className="p-3.5 dark:text-slate-300 text-slate-700">
                  Support domestic technology development, research and innovation in developing digital infrastructures.
                </td>
                <td className="p-3.5 dark:text-slate-200 text-slate-800">
                  Provides a modular, open full-stack reference architecture enabling local teams and researchers to deploy NLP inference without proprietary walled gardens.
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="p-3.5 font-bold font-mono text-indigo-700 dark:text-purple-400 whitespace-nowrap">Target 9.C</td>
                <td className="p-3.5 dark:text-slate-300 text-slate-700">
                  Significantly increase access to information and communications technology.
                </td>
                <td className="p-3.5 dark:text-slate-200 text-slate-800">
                  Democratizes access through an accessible, responsive web interface requiring no complex client-side hardware or specialized GPU clusters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Academic Disclaimer Banner */}
      <div className="p-5 rounded-2xl dark:bg-amber-950/30 bg-amber-50 border border-amber-600/40 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs dark:text-amber-200/90 text-amber-900 leading-relaxed font-sans">
          <strong className="dark:text-white text-slate-900 block font-semibold">
            Educational Prototype Disclaimer:
          </strong>
          This application was conceived as an academic engineering demonstration for the university project
          titled <em>“Movie Review Sentiment Analysis Using NLP & AI”</em>. While it exemplifies the technical concepts
          of Sustainable Development Goal 9 (Industry, Innovation and Infrastructure), it is an educational software prototype
          and does not itself establish formal or measurable real-world progress toward official United Nations indicators.
        </div>
      </div>
    </div>
  );
};
