import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  Sparkles,
  BarChart2,
  RefreshCw,
  Zap,
  Check,
  Layout,
  Layers,
} from 'lucide-react';

export const AdaptiveDesign: React.FC = () => {
  const [platformStats, setPlatformStats] = useState([
    {
      platform: 'Instagram Reels',
      currentCTR: '3.4%',
      optimalLength: '15s - 20s',
      suggestion: 'Hook length is 4.2s (too long). Shorten opening hook by 1.8s to prevent 3-second drop-off.',
      applied: false,
    },
    {
      platform: 'TikTok',
      currentCTR: '5.8%',
      optimalLength: '22s',
      suggestion: 'Add yellow high-contrast subtitle background on scenes 2 & 3. Predictive watch time increases by +24%.',
      applied: true,
    },
    {
      platform: 'LinkedIn',
      currentCTR: '4.1%',
      optimalLength: '3-Slide Carousel',
      suggestion: 'Insert numerical stat callout ("45,000 Kiranas") in Slide 1 headline to double executive slide swipes.',
      applied: false,
    },
  ]);

  const toggleApply = (index: number) => {
    const updated = [...platformStats];
    updated[index].applied = !updated[index].applied;
    setPlatformStats(updated);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Adaptive Design Engine</h2>
              <span className="text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                Real-Time Interaction Tuning
              </span>
            </div>
            <p className="text-xs text-slate-400">Move beyond static layouts. AI suggests continuous variations based on simulated and live interaction feedback</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Adaptive Layout Feedback Active
          </span>
        </div>
      </div>

      {/* Adaptive Suggestions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformStats.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{item.platform}</h3>
                <span className="text-xs font-mono font-bold text-teal-400 bg-slate-950 px-2 py-0.5 rounded">
                  CTR: {item.currentCTR}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">
                Optimal Format: <span className="text-slate-200 font-semibold">{item.optimalLength}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Variation Suggestion</span>
                </div>
                {item.suggestion}
              </div>
            </div>

            <button
              onClick={() => toggleApply(idx)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                item.applied
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
              }`}
            >
              {item.applied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Variation Applied</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Auto-Adapt Layout</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
