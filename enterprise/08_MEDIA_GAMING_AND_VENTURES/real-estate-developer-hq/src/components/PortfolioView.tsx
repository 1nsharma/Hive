import React, { useState } from "react";
import { INITIAL_PIPELINE } from "../data/checklistData";
import { MONEY_PROGRESSION_TIERS } from "../data/curriculumData";
import { ProjectPipelineItem } from "../types";
import {
  Briefcase,
  TrendingUp,
  Plus,
  Building,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  DollarSign,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const PortfolioView: React.FC = () => {
  const [pipeline, setPipeline] = useState<ProjectPipelineItem[]>(INITIAL_PIPELINE);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeTierIndex, setActiveTierIndex] = useState<number>(2); // Default to Tier 2

  // New project form state
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newAssetClass, setNewAssetClass] = useState("Residential Mid-Rise");
  const [newStage, setNewStage] = useState<any>("Due Diligence");
  const [newCostCr, setNewCostCr] = useState<number>(20);
  const [newRevCr, setNewRevCr] = useState<number>(32);
  const [newStructure, setNewStructure] = useState("65:35 Revenue Share JDA");

  const totalGdv = pipeline.reduce((acc, p) => acc + p.expectedRevenueCr, 0);
  const totalCost = pipeline.reduce((acc, p) => acc + p.estimatedCostCr, 0);
  const totalProfit = totalGdv - totalCost;
  const blendedMargin = totalGdv > 0 ? ((totalProfit / totalGdv) * 100).toFixed(1) : "0";

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const margin = newRevCr > 0 ? Number((((newRevCr - newCostCr) / newRevCr) * 100).toFixed(1)) : 0;

    const newItem: ProjectPipelineItem = {
      id: `pip-${Date.now()}`,
      title: newTitle,
      location: newLocation || "NCR / Metro Corridor",
      assetClass: newAssetClass,
      stage: newStage,
      projectSizeSqFt: Math.round(newRevCr * 3500),
      estimatedCostCr: Number(newCostCr),
      expectedRevenueCr: Number(newRevCr),
      targetMarginPercent: margin,
      status: "active",
      structure: newStructure,
    };

    setPipeline([newItem, ...pipeline]);
    setShowAddModal(false);
    setNewTitle("");
    setNewLocation("");
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Developer Scale & Capital Progression</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Portfolio Pipeline & Money Progression Roadmap
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Track active projects across development stages, calculate aggregate portfolio GDV, and navigate the ₹0 to ₹100Cr+ capital ladder.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pipeline Project</span>
          </button>
        </div>
      </div>

      {/* Aggregate Portfolio KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Portfolio GDV</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            ₹{totalGdv.toFixed(1)} Cr
          </div>
          <span className="text-[11px] text-slate-500">Across {pipeline.length} active deals</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Total Est. Cost (TDC)</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            ₹{totalCost.toFixed(1)} Cr
          </div>
          <span className="text-[11px] text-slate-500">Hard & soft development costs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Net Portfolio Profit</span>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            ₹{totalProfit.toFixed(1)} Cr
          </div>
          <span className="text-[11px] text-amber-400/90 font-mono">Margin: {blendedMargin}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Capital Progression</span>
          <div className="text-2xl font-bold font-mono text-blue-300 mt-1">
            Tier {activeTierIndex} of 5
          </div>
          <span className="text-[11px] text-slate-500">Operator Growth Phase</span>
        </div>
      </div>

      {/* Money Progression Roadmap Ladder */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">
              The Real Estate Money Progression Track
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">How Developers Actually Scale</span>
        </div>

        {/* Tier Horizontal Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {MONEY_PROGRESSION_TIERS.map((tier, idx) => {
            const isSelected = activeTierIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTierIndex(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Tier {tier.tier}
                </div>
                <div className="font-display font-semibold text-xs sm:text-sm text-white mt-1">
                  {tier.range}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{tier.focus}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Expanded View */}
        {MONEY_PROGRESSION_TIERS[activeTierIndex] && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-amber-400 font-mono font-bold">
                  Tier {MONEY_PROGRESSION_TIERS[activeTierIndex].tier}: {MONEY_PROGRESSION_TIERS[activeTierIndex].range}
                </span>
                <h4 className="text-base font-display font-bold text-white mt-0.5">
                  {MONEY_PROGRESSION_TIERS[activeTierIndex].focus}
                </h4>
              </div>
              <span className="text-slate-400">
                Vehicle: <strong className="text-white">{MONEY_PROGRESSION_TIERS[activeTierIndex].targetVehicle}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-amber-300 font-semibold block mb-1">🎯 Operational Strategy:</span>
                <p className="text-slate-300 leading-relaxed">
                  {MONEY_PROGRESSION_TIERS[activeTierIndex].strategy}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-1">🚀 Core Execution Vehicle:</span>
                <p className="text-slate-300 leading-relaxed">
                  {MONEY_PROGRESSION_TIERS[activeTierIndex].targetVehicle}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Pipeline Projects Table */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-display font-bold text-base text-white">
          Active Development Deals in Pipeline ({pipeline.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                <th className="p-3">Project & Location</th>
                <th className="p-3">Asset Type</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3">Deal Structure</th>
                <th className="p-3 text-right">Est. Cost</th>
                <th className="p-3 text-right">Gross GDV</th>
                <th className="p-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pipeline.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-white">{proj.title}</div>
                    <div className="text-[11px] text-slate-400">{proj.location}</div>
                  </td>
                  <td className="p-3 text-slate-300">{proj.assetClass}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-amber-300 border border-slate-700">
                      {proj.stage}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">{proj.structure}</td>
                  <td className="p-3 text-right font-mono text-slate-300">₹{proj.estimatedCostCr} Cr</td>
                  <td className="p-3 text-right font-mono text-emerald-400 font-bold">₹{proj.expectedRevenueCr} Cr</td>
                  <td className="p-3 text-right font-mono text-amber-300">{proj.targetMarginPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-white">
                Add New Development Project
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Project Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Meadows Residency"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Whitefield, Bengaluru"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Asset Class</label>
                  <select
                    value={newAssetClass}
                    onChange={(e) => setNewAssetClass(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Residential Mid-Rise">Residential Mid-Rise</option>
                    <option value="Boutique Commercial">Boutique Commercial</option>
                    <option value="Plotted Development">Plotted Development</option>
                    <option value="Mixed-Use Living">Mixed-Use Living</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Current Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Due Diligence">Due Diligence</option>
                    <option value="Approvals">Approvals</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Deal Structure</label>
                  <input
                    type="text"
                    value={newStructure}
                    onChange={(e) => setNewStructure(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Total Est. Cost (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCostCr}
                    onChange={(e) => setNewCostCr(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Gross GDV Revenue (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRevCr}
                    onChange={(e) => setNewRevCr(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 font-mono text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
