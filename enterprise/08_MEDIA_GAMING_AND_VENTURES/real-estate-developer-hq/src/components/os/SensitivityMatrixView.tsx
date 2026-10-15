import React, { useState } from "react";
import { ProvenanceTier } from "../../types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { Sliders, TrendingUp, DollarSign, Activity, ArrowRight, ShieldAlert } from "lucide-react";

interface SensitivityMatrixViewProps {
  baseSalePriceSqFt: number;
  baseCivilCostSqFt: number;
  totalSaleableAreaSqFt: number;
  devSplitPercent: number;
  onInspectField?: (fieldName: string, tier: ProvenanceTier, value: any) => void;
}

export const SensitivityMatrixView: React.FC<SensitivityMatrixViewProps> = ({
  baseSalePriceSqFt,
  baseCivilCostSqFt,
  totalSaleableAreaSqFt,
  devSplitPercent,
  onInspectField,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<
    "CONSERVATIVE" | "BASE" | "OPTIMISTIC"
  >("BASE");

  // Multipliers
  const priceVariations = [-0.15, -0.1, 0, 0.1, 0.15];
  const costVariations = [-0.1, 0, 0.1, 0.2];

  // Helper to compute metrics for a cell
  const computeCell = (priceDelta: number, costDelta: number) => {
    const salePrice = baseSalePriceSqFt * (1 + priceDelta);
    const civilCost = baseCivilCostSqFt * (1 + costDelta);
    const totalRevenueCr = (salePrice * totalSaleableAreaSqFt) / 10000000;
    const totalCostCr = (civilCost * 1.35 * totalSaleableAreaSqFt) / 10000000; // includes soft costs
    const devGrossRevenueCr = (totalRevenueCr * devSplitPercent) / 100;
    const devProfitCr = devGrossRevenueCr - totalCostCr;
    const devProfitMarginPercent = (devProfitCr / totalCostCr) * 100;
    // Approximated IRR based on 3-year project
    const estimatedIrr = Math.max(0, Math.min(85, devProfitMarginPercent * 0.95 + 10));

    return {
      salePrice: Math.round(salePrice),
      civilCost: Math.round(civilCost),
      devProfitCr: Number(devProfitCr.toFixed(1)),
      estimatedIrr: Number(estimatedIrr.toFixed(1)),
      breakevenAbsorption: Math.min(
        100,
        Math.max(20, Math.round((totalCostCr / devGrossRevenueCr) * 100))
      ),
    };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
              STAGE 2 FINANCIAL CORE
            </span>
            <span className="text-slate-400 text-xs font-mono">
              2D Sensitivity & Stress Testing Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Parametric Pro-Forma Sensitivity Matrix</span>
          </h3>
        </div>

        {/* Scenario Switchers */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedScenario("CONSERVATIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === "CONSERVATIVE"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Bearish (-10% Price, +10% Cost)
          </button>
          <button
            onClick={() => setSelectedScenario("BASE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === "BASE"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Base Case
          </button>
          <button
            onClick={() => setSelectedScenario("OPTIMISTIC")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === "OPTIMISTIC"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Bullish (+10% Price, -5% Cost)
          </button>
        </div>
      </div>

      {/* Scenario Highlights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const scenarioDeltas =
            selectedScenario === "CONSERVATIVE"
              ? { p: -0.1, c: 0.1 }
              : selectedScenario === "OPTIMISTIC"
              ? { p: 0.1, c: -0.05 }
              : { p: 0, c: 0 };
          const res = computeCell(scenarioDeltas.p, scenarioDeltas.c);

          return (
            <>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  {selectedScenario} Projected IRR
                </div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    res.estimatedIrr >= 28
                      ? "text-emerald-400"
                      : res.estimatedIrr >= 20
                      ? "text-amber-300"
                      : "text-rose-400"
                  }`}
                >
                  {res.estimatedIrr}% IRR
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Target Hurdle: 25.0%
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Net Developer Profit
                </div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    res.devProfitCr >= 20
                      ? "text-emerald-400"
                      : res.devProfitCr > 0
                      ? "text-amber-300"
                      : "text-rose-400"
                  }`}
                >
                  ₹{res.devProfitCr} Crores
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  At ₹{res.salePrice}/sq.ft realization
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Breakeven Absorption
                </div>
                <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
                  {res.breakevenAbsorption}% of Inventory
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Profitable after {Math.round(res.breakevenAbsorption * 0.36)} months
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* 2D Sensitivity Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>SENSITIVITY MATRIX: SALE PRICE (COLUMNS) vs. CONSTRUCTION COST (ROWS)</span>
          <span className="text-amber-400">Values shown: [Projected IRR% | Developer Profit ₹Cr]</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border border-slate-800 rounded-2xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3 text-left border-r border-slate-800">
                  Civil Cost \ Sale Price
                </th>
                {priceVariations.map((pv, i) => (
                  <th key={i} className="p-3 border-r border-slate-800">
                    <div>{pv > 0 ? `+${pv * 100}%` : `${pv * 100}%`}</div>
                    <div className="text-slate-300 font-bold text-[11px]">
                      ₹{Math.round(baseSalePriceSqFt * (1 + pv))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-mono text-xs">
              {costVariations.map((cv, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-800/40">
                  <td className="p-3 text-left bg-slate-950 text-slate-300 font-bold border-r border-slate-800">
                    <div className="text-[10px] text-slate-500">
                      {cv > 0 ? `+${cv * 100}%` : cv === 0 ? "Base Cost" : `${cv * 100}%`}
                    </div>
                    <div>₹{Math.round(baseCivilCostSqFt * (1 + cv))}/sq.ft</div>
                  </td>

                  {priceVariations.map((pv, colIdx) => {
                    const cell = computeCell(pv, cv);
                    const isBase = pv === 0 && cv === 0;

                    return (
                      <td
                        key={colIdx}
                        className={`p-3 border-r border-slate-800 transition-all ${
                          isBase
                            ? "bg-amber-500/20 ring-1 ring-amber-500/50"
                            : cell.devProfitCr < 0
                            ? "bg-rose-950/30"
                            : cell.estimatedIrr >= 30
                            ? "bg-emerald-950/20"
                            : ""
                        }`}
                      >
                        <div
                          className={`font-bold text-xs ${
                            cell.estimatedIrr >= 28
                              ? "text-emerald-400"
                              : cell.estimatedIrr >= 20
                              ? "text-amber-300"
                              : "text-rose-400"
                          }`}
                        >
                          {cell.estimatedIrr}% IRR
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ₹{cell.devProfitCr} Cr
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
