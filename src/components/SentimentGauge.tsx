import React from 'react';
import { SentimentType } from '../types';
import { ThumbsUp, ThumbsDown, Minus, ShieldCheck } from 'lucide-react';

interface SentimentGaugeProps {
  sentiment: SentimentType;
  confidence: number;
  polarityScore: number; // -1.0 to +1.0
  size?: 'sm' | 'md' | 'lg';
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  sentiment,
  confidence,
  polarityScore,
}) => {
  // Normalize polarity (-1 to 1) into an angle (0 to 180 degrees)
  const clampedPolarity = Math.max(-1, Math.min(1, polarityScore));
  const angleDegrees = ((clampedPolarity + 1) / 2) * 180;

  const isPositive = sentiment === 'Positive';
  const isNegative = sentiment === 'Negative';
  const isNeutral = sentiment === 'Neutral';

  const themeColors = {
    badgeBg: isPositive
      ? 'dark:bg-emerald-500/15 bg-emerald-100 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
      : isNegative
      ? 'dark:bg-rose-500/15 bg-rose-100 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30'
      : 'dark:bg-amber-500/15 bg-amber-100 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
    glow: isPositive
      ? 'dark:shadow-[0_0_30px_rgba(16,185,129,0.3)]'
      : isNegative
      ? 'dark:shadow-[0_0_30px_rgba(244,63,94,0.3)]'
      : 'dark:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    textGradient: isPositive
      ? 'from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300'
      : isNegative
      ? 'from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-500'
      : 'from-amber-600 to-yellow-500 dark:from-amber-400 dark:to-yellow-300'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Semi-Circle SVG Gauge */}
      <div className="relative w-64 h-36 flex items-center justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="40%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            className="dark:text-slate-800 text-slate-200"
          />

          {/* Colored Gradient Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="opacity-90"
          />

          {/* Center Pivot Point */}
          <circle cx="100" cy="100" r="8" className="dark:fill-slate-900 fill-slate-100 dark:stroke-slate-500 stroke-slate-400" strokeWidth="3" />

          {/* Needle Pointer */}
          <g
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(${angleDegrees - 90}deg)`,
              transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <polygon points="97,100 103,100 100,28" className="dark:fill-white fill-slate-800 drop-shadow-md" />
            <circle cx="100" cy="100" r="5" className="fill-purple-600 dark:fill-purple-500" />
          </g>

          {/* Tick Labels */}
          <text x="14" y="115" className="text-[9px] fill-rose-600 dark:fill-rose-400 font-bold">-1.0 Neg</text>
          <text x="92" y="15" className="text-[9px] fill-amber-600 dark:fill-amber-300 font-bold">0.0</text>
          <text x="162" y="115" className="text-[9px] fill-emerald-600 dark:fill-emerald-400 font-bold">+1.0 Pos</text>
        </svg>

        {/* Polarity Numeric Value Float */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-xs uppercase font-mono tracking-wider dark:text-slate-400 text-slate-600 font-semibold">Polarity Index</span>
          <span className={`text-2xl font-black font-mono tracking-tight bg-gradient-to-r ${themeColors.textGradient} bg-clip-text text-transparent`}>
            {clampedPolarity > 0 ? `+${clampedPolarity.toFixed(2)}` : clampedPolarity.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Sentiment Badge & Confidence Box */}
      <div className="mt-3 flex items-center gap-3">
        <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 shadow-md ${themeColors.badgeBg} ${themeColors.glow}`}>
          {isPositive && <ThumbsUp className="w-4 h-4 stroke-[2.5]" />}
          {isNegative && <ThumbsDown className="w-4 h-4 stroke-[2.5]" />}
          {isNeutral && <Minus className="w-4 h-4 stroke-[2.5]" />}
          <span className="tracking-wide uppercase text-xs">{sentiment} Sentiment</span>
        </div>

        <div className="px-3 py-1.5 rounded-full dark:bg-slate-900/80 bg-white border dark:border-slate-700/60 border-slate-300 dark:text-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span><strong className="dark:text-white text-slate-900">{confidence}%</strong> Confidence</span>
        </div>
      </div>
    </div>
  );
};
