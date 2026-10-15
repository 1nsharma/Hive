import React, { useState } from 'react';
import { Split, Sparkles, TrendingUp, CheckCircle2, Trophy, BarChart3, RotateCw } from 'lucide-react';
import { AdaptedCampaign } from '../types';

interface PredictiveABTestProps {
  activeCampaign: AdaptedCampaign;
}

export const PredictiveABTest: React.FC<PredictiveABTestProps> = ({ activeCampaign }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [testData, setTestData] = useState(activeCampaign.abTesting);

  const handleRunNewSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setTestData({
        variantA: {
          label: 'Variant A (Speed & Camera Tech)',
          hook: 'Scan your entire retail store in 60 seconds using phone camera AI!',
          score: 89,
          predictedCTR: '5.1%',
          predictedConversion: '13.2%',
        },
        variantB: {
          label: 'Variant B (Direct Loss Aversion)',
          hook: 'Stop losing 40% of customer orders to online competitors!',
          score: 96,
          predictedCTR: '6.8%',
          predictedConversion: '16.5%',
        },
        recommendedWinner: 'variantB',
        reasoning: 'Loss aversion hooks trigger 1.9x higher immediate click-through on mobile feeds for business owners.',
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Predictive A/B Testing Lab</h2>
              <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                Pre-Publish AI Engagement Scoring
              </span>
            </div>
            <p className="text-xs text-slate-400">Use AI to automatically test different hook variations and identify which post design drives the highest CTR before going public</p>
          </div>
        </div>

        <button
          onClick={handleRunNewSimulation}
          disabled={isSimulating}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
        >
          {isSimulating ? <RotateCw className="w-4 h-4 animate-spin text-slate-950" /> : <Sparkles className="w-4 h-4 fill-slate-950" />}
          <span>Re-Simulate Predictive Engagement</span>
        </button>
      </div>

      {/* Winner Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/60 p-5 rounded-2xl shadow-xl flex items-start gap-4">
        <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-bold shrink-0">
          <Trophy className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <span>AI Winner Recommendation: {testData.recommendedWinner === 'variantA' ? 'Variant A' : 'Variant B'}</span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">{testData.reasoning}</p>
        </div>
      </div>

      {/* Variant Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Variant A Card */}
        <div className={`bg-slate-900 border rounded-2xl p-6 space-y-5 shadow-xl transition-all ${
          testData.recommendedWinner === 'variantA' ? 'border-emerald-500 shadow-emerald-950/50' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">{testData.variantA.label}</h3>
            <span className="text-xs font-extrabold text-teal-400 bg-slate-950 px-2.5 py-1 rounded-lg">
              Score: {testData.variantA.score} / 100
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400">Tested Hook</div>
            <p className="text-xs text-white font-semibold">"{testData.variantA.hook}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-lg font-black text-teal-400">{testData.variantA.predictedCTR}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Predicted CTR</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-lg font-black text-emerald-400">{testData.variantA.predictedConversion}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Conversion Prob</div>
            </div>
          </div>
        </div>

        {/* Variant B Card */}
        <div className={`bg-slate-900 border rounded-2xl p-6 space-y-5 shadow-xl transition-all ${
          testData.recommendedWinner === 'variantB' ? 'border-emerald-500 shadow-emerald-950/50' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">{testData.variantB.label}</h3>
            <span className="text-xs font-extrabold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg">
              Score: {testData.variantB.score} / 100
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400">Tested Hook</div>
            <p className="text-xs text-white font-semibold">"{testData.variantB.hook}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-lg font-black text-teal-400">{testData.variantB.predictedCTR}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Predicted CTR</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-lg font-black text-emerald-400">{testData.variantB.predictedConversion}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Conversion Prob</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
