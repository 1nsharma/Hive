import React, { useState } from "react";
import { SAMPLE_DEALS } from "../data/sampleDeals";
import { calculateDealFinancials, generateDealStructureOptions } from "../utils/realEstateMath";
import { DealInput, DealStructureOption } from "../types";
import {
  Scale,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface DealStructuringViewProps {
  currentDeal?: DealInput;
  onOpenModelerWithDeal: (deal: DealInput) => void;
  onAskCopilotAboutStructuring: (structureName: string) => void;
}

export const DealStructuringView: React.FC<DealStructuringViewProps> = ({
  currentDeal,
  onOpenModelerWithDeal,
  onAskCopilotAboutStructuring,
}) => {
  const [deal, setDeal] = useState<DealInput>(currentDeal || SAMPLE_DEALS[0]);
  const [customJdaShare, setCustomJdaShare] = useState<number>(62); // Developer %
  const [customRevShare, setCustomRevShare] = useState<number>(68); // Developer %

  const calc = calculateDealFinancials(deal);
  const structures: DealStructureOption[] = generateDealStructureOptions(deal, calc);

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scale className="w-4 h-4" />
            <span>Level 3 Mastery: Deal Structuring Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Control Valuable Opportunities Without Putting All Capital at Risk
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            You don't always need to purchase the land yourself. Compare Outright Freehold Purchase vs Joint Development Agreements (JDA) vs Revenue Share vs Net Profit JV vs Development Management (DM).
          </p>
        </div>

        {/* Preset Selector */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Analyze Property:</span>
          {SAMPLE_DEALS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setDeal(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                deal.id === preset.id
                  ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Property Baseline Card */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400">Target Asset & Location:</span>
          <div className="font-display font-bold text-white text-base">
            {deal.name} ({deal.location})
          </div>
        </div>
        <div className="flex items-center space-x-6 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px]">Land Valuation</span>
            <span className="text-amber-300 font-bold">₹{calc.actualLandCost} Cr</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Gross Revenue (GDV)</span>
            <span className="text-emerald-400 font-bold">₹{calc.expectedGrossRevenue} Cr</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Construction & Soft Costs</span>
            <span className="text-white font-bold">
              ₹{(calc.approvalCost + calc.hardConstructionCost + calc.mepCost + calc.contingencyCost + calc.marketingCost).toFixed(2)} Cr
            </span>
          </div>
        </div>
      </div>

      {/* 5 Deal Structures Side-by-Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {structures.map((s) => {
          const isJda = s.type === "jda_area_share";
          const isRev = s.type === "revenue_share";
          const isDm = s.type === "development_management";

          return (
            <div
              key={s.type}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isJda || isRev
                  ? "bg-slate-850 border-amber-500/40 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/20"
                  : "bg-slate-850/80 border-slate-700/80 hover:border-slate-600 shadow-lg"
              }`}
            >
              <div className="space-y-4">
                {/* Header & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-lg text-white">
                    {s.title}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider shrink-0 ${
                      s.riskProfile === "High"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : s.riskProfile === "Low"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {s.riskProfile} Risk
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[3rem]">
                  {s.description}
                </p>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Developer Capital</span>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      ₹{s.developerCapitalRequired} Cr
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Developer Profit</span>
                    <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                      ₹{s.developerExpectedProfit} Cr
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Developer IRR</span>
                    <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
                      {s.developerIrr}%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Landowner Return</span>
                    <div className="text-base font-bold font-mono text-blue-300 mt-0.5">
                      ₹{s.landownerReturn} Cr
                    </div>
                  </div>
                </div>

                {/* Best For Box */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-0.5">Ideal Scenario:</span>
                  <p className="text-slate-300 text-[11px]">{s.bestFor}</p>
                </div>

                {/* Key Safeguard Clause */}
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs">
                  <span className="text-amber-400 font-semibold block mb-0.5 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Contractual Safeguard:</span>
                  </span>
                  <p className="text-slate-300 text-[11px]">{s.keySafeguard}</p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onAskCopilotAboutStructuring(s.title)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Draft JDA / Term Sheet Clause</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Advice Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
          <Info className="w-4 h-4" />
          <span>Strategic Takeaway for Beginners & Growing Operators:</span>
        </div>
        <p className="leading-relaxed">
          If you have ₹2 Cr in equity, an Outright Purchase restricts you to a single small ₹5 Cr project with high risk. Structuring a <strong className="text-white">65:35 Revenue Share JDA</strong> allows that same ₹2 Cr to act as working capital for a ₹35 Cr project, multiplying your track record and return on equity (ROE) by 4x to 6x.
        </p>
      </div>
    </div>
  );
};
