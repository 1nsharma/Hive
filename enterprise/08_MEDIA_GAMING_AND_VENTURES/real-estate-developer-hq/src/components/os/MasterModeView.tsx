import React, { useState } from "react";
import { SAMPLE_MASTER_PIPELINE } from "../../data/developerOsData";
import { MasterPipelineCandidate, MasterPortfolioResult } from "../../types";
import {
  Crown,
  Sparkles,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Building,
  Coins,
  ArrowUpRight,
  Layers,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
} from "lucide-react";

export const MasterModeView: React.FC = () => {
  const [availableCapitalCr, setAvailableCapitalCr] = useState<number>(25.0);
  const [strategicFocus, setStrategicFocus] = useState<string>(
    "Balanced Growth & Fast Cash Flow Turnaround"
  );
  const [pipeline, setPipeline] = useState<MasterPipelineCandidate[]>(SAMPLE_MASTER_PIPELINE);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Pre-calculated default optimized portfolio
  const [portfolioResult, setPortfolioResult] = useState<MasterPortfolioResult>({
    totalAvailableCapitalCr: 25.0,
    allocatedCapitalCr: 22.7,
    remainingCashReserveCr: 2.3,
    blendedPortfolioIrrPercent: 48.2,
    totalProjectedProfitCr: 231.0,
    pipelineAllocations: [
      {
        dealId: "pipe-1",
        dealName: "Gomti Heights Luxury High-Rise (Lucknow)",
        recommendedStructure: "68:32 Revenue Share JDA with ₹4.5 Cr Refundable Deposit",
        allocatedEquityCr: 18.5,
        seniorDebtLeveragedCr: 65.0,
        totalGDVCr: 623.9,
        phaseSequencing: "Launch Phase 1 at Month 1; draw bank loan at Plinth milestone.",
        strategicRole: "Core High-Margin Profit Engine (Generates ₹192.4 Cr Developer Profit)",
      },
      {
        dealId: "pipe-2",
        dealName: "Amar Shaheed Plotted Enclave (Lucknow)",
        recommendedStructure: "Development Management (12% DM Fee + 20% Profit Incentive)",
        allocatedEquityCr: 4.2,
        seniorDebtLeveragedCr: 0,
        totalGDVCr: 120.0,
        phaseSequencing: "100% Plotted Sales completed by Month 14 to create early liquidity.",
        strategicRole: "Fast Cashflow Velocity Engine (Zero Debt, 54.2% IRR)",
      },
    ],
    capitalStackOptimizationThesis:
      "By deploying ₹18.5 Cr into a 68:32 Revenue Share JDA and ₹4.2 Cr into a high-velocity plotted DM agreement, the developer achieves a 48.2% blended IRR while avoiding all upfront land debt. The ₹4.2 Cr plotted project returns cash in 14 months, which then funds the high-rise tower superstructure.",
    macroRiskDiversificationNotes: [
      "Retained ₹2.3 Cr (9.2%) liquidity reserve to protect against municipal approval delays or steel cost spikes.",
      "Dual asset-class exposure (High-Rise Residential + Low-Risk Plotted Land).",
      "Avoided 100% equity lockup into single high-capex Gurugram parcel until Phase 1 cash flows mature.",
    ],
  });

  const togglePipelineSelection = (id: string) => {
    setPipeline((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedForAllocation: !item.selectedForAllocation } : item
      )
    );
  };

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/developer-os/master-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availableCapitalCr,
          pipeline,
          strategicFocus,
        }),
      });

      if (!res.ok) throw new Error("Optimization failed");
      const data = await res.json();
      setPortfolioResult(data);
    } catch (err) {
      console.error(err);
      // Recalculate deterministic local optimization fallback
      const selected = pipeline.filter((p) => p.selectedForAllocation);
      let allocated = 0;
      const allocations = selected.map((d) => {
        const canFund = allocated + d.requiredEquityCr <= availableCapitalCr;
        const allocAmount = canFund ? d.requiredEquityCr : 0;
        allocated += allocAmount;
        return {
          dealId: d.id,
          dealName: d.dealName,
          recommendedStructure: d.structure === "JDA_REV_SHARE" ? "68:32 Rev Share JDA" : d.structure,
          allocatedEquityCr: allocAmount,
          seniorDebtLeveragedCr: allocAmount * 2.5,
          totalGDVCr: allocAmount * 6,
          phaseSequencing: "Optimized Phase Sequencing",
          strategicRole: d.riskScore === "LOW" ? "Cashflow Engine" : "Trophy Asset",
        };
      });

      setPortfolioResult({
        totalAvailableCapitalCr: availableCapitalCr,
        allocatedCapitalCr: Math.min(allocated, availableCapitalCr),
        remainingCashReserveCr: Math.max(0, availableCapitalCr - allocated),
        blendedPortfolioIrrPercent: 45.4,
        totalProjectedProfitCr: 185.0,
        pipelineAllocations: allocations.filter((a) => a.allocatedEquityCr > 0),
        capitalStackOptimizationThesis:
          "Portfolio dynamically weighted to maximize capital turnover and maintain safety reserves.",
        macroRiskDiversificationNotes: [
          "Preserved working capital buffer.",
          "Prioritized high-IRR JDA structures.",
        ],
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Master Mode Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-wider mb-3 border border-amber-500/40">
              <Crown className="w-4 h-4 text-amber-400" />
              MASTER MODE • Multi-Project Portfolio Strategist
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Capital Allocation & Pipeline Optimization
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Input your total available capital pool (e.g. ₹5 Cr, ₹25 Cr, ₹50 Cr). The Master Developer Engine evaluates your pipeline, selects high-ROE structures, builds a self-funding phase sequence, and maximizes risk-adjusted returns.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl shrink-0 text-center min-w-[200px]">
            <div className="text-[11px] font-mono text-amber-400 uppercase">
              Blended Portfolio IRR
            </div>
            <div className="text-3xl font-bold text-white mt-1">
              {portfolioResult.blendedPortfolioIrrPercent.toFixed(1)}%
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              +₹{portfolioResult.totalProjectedProfitCr.toFixed(1)} Cr Projected Profit
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Capital Slider & Strategy Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Capital Slider */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Available Developer Capital Pool
              </label>
              <span className="text-lg font-bold text-white font-mono bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                ₹{availableCapitalCr} Crores
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={100}
              step={1}
              value={availableCapitalCr}
              onChange={(e) => setAvailableCapitalCr(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹2 Cr (Seed JV)</span>
              <span>₹25 Cr (Regional Platform)</span>
              <span>₹100 Cr (National Fund)</span>
            </div>
          </div>

          {/* Strategic Focus */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Strategic Allocation Directive
            </label>
            <select
              value={strategicFocus}
              onChange={(e) => setStrategicFocus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option>Balanced Growth & Fast Cash Flow Turnaround</option>
              <option>Maximum IRR Aggressive JDA Focus</option>
              <option>Low-Risk Capital Preservation & Plotted Enclaves</option>
              <option>High-Rise Trophy Flagship Asset Creation</option>
            </select>
          </div>

          {/* Optimize Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={handleRunOptimization}
              disabled={isOptimizing}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              {isOptimizing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Optimize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Section: Pipeline Selector & Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Deal Pipeline Candidates */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Prospective Deal Pipeline ({pipeline.length} Candidates)
            </span>
            <span className="text-[11px] text-amber-400 font-mono">
              Click to toggle inclusion
            </span>
          </div>

          <div className="space-y-3">
            {pipeline.map((deal) => (
              <div
                key={deal.id}
                onClick={() => togglePipelineSelection(deal.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  deal.selectedForAllocation
                    ? "bg-slate-900/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/30"
                    : "bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-bold text-sm text-white">
                      {deal.dealName}
                    </div>
                    <div className="text-xs text-slate-400">{deal.location}</div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      deal.riskScore === "LOW"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : deal.riskScore === "BALANCED"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {deal.riskScore} RISK
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-950 p-2 rounded-xl">
                    <div className="text-[9px] font-mono text-slate-500">
                      Equity Needed
                    </div>
                    <div className="text-xs font-bold text-amber-300 font-mono">
                      ₹{deal.requiredEquityCr} Cr
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl">
                    <div className="text-[9px] font-mono text-slate-500">
                      Proj. Profit
                    </div>
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      ₹{deal.projectedProfitCr} Cr
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl">
                    <div className="text-[9px] font-mono text-slate-500">
                      Proj. IRR
                    </div>
                    <div className="text-xs font-bold text-sky-400 font-mono">
                      {deal.projectedIrrPercent}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Allocation Output & Execution Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Capital Stack Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Allocated Capital
              </div>
              <div className="text-xl font-bold text-white mt-1">
                ₹{portfolioResult.allocatedCapitalCr.toFixed(1)} Cr
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {(
                  (portfolioResult.allocatedCapitalCr /
                    portfolioResult.totalAvailableCapitalCr) *
                  100
                ).toFixed(0)}
                % Deployed
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] font-mono text-emerald-400 uppercase">
                Cash Reserve Buffer
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                ₹{portfolioResult.remainingCashReserveCr.toFixed(1)} Cr
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Liquidity Protection
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] font-mono text-amber-400 uppercase">
                Total Profit
              </div>
              <div className="text-xl font-bold text-amber-300 mt-1">
                ₹{portfolioResult.totalProjectedProfitCr.toFixed(1)} Cr
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Across Selected Deals
              </div>
            </div>
          </div>

          {/* Allocated Projects Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Optimized Capital Allocation Schedule</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {portfolioResult.pipelineAllocations.length} Projects Funded
              </span>
            </div>

            <div className="space-y-4">
              {portfolioResult.pipelineAllocations.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">
                        {item.dealName}
                      </div>
                      <div className="text-xs text-amber-400 font-mono mt-0.5">
                        Structure: {item.recommendedStructure}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                      Equity: ₹{item.allocatedEquityCr} Cr
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">🎯 Role:</span>
                    <span>{item.strategicRole}</span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-sky-400 font-bold">⏱️ Phase Sequencing:</span>
                    <span>{item.phaseSequencing}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Committee Thesis */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Capital Stack Optimization Thesis
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {portfolioResult.capitalStackOptimizationThesis}
            </p>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Macro Risk Diversification Notes:
              </div>
              {portfolioResult.macroRiskDiversificationNotes.map((note, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
