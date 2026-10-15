import React, { useState } from "react";
import { SAMPLE_DEALS } from "../data/sampleDeals";
import { calculateDealFinancials } from "../utils/realEstateMath";
import { DealInput, CalculatedFinancials } from "../types";
import {
  Calculator,
  TrendingUp,
  Building,
  DollarSign,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";

interface DealModelerViewProps {
  initialDeal?: DealInput;
  onOpenCopilotWithDeal: (deal: DealInput) => void;
  onOpenStructuring: (deal: DealInput) => void;
}

export const DealModelerView: React.FC<DealModelerViewProps> = ({
  initialDeal,
  onOpenCopilotWithDeal,
  onOpenStructuring,
}) => {
  const [deal, setDeal] = useState<DealInput>(initialDeal || SAMPLE_DEALS[0]);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "cashflow" | "sensitivity" | "ai-memo">("summary");

  const calc: CalculatedFinancials = calculateDealFinancials(deal);

  const handleInputChange = (field: keyof DealInput, val: any) => {
    setDeal((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSelectPreset = (preset: DealInput) => {
    setDeal(preset);
    setAiReport(null);
    setAnalysisError(null);
  };

  // Run AI Feasibility Teardown
  const runAiFeasibilityAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setActiveTab("ai-memo");
    try {
      const response = await fetch("/api/gemini/analyze-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealData: {
            ...deal,
            calculated: calc,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      setAiReport(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "Failed to generate AI analysis. Please check your connection or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chart data: Cost Stack Breakdown
  const costBreakdownData = [
    { name: "Land & Stamp Duty", value: calc.actualLandCost + calc.stampDutyCost, color: "#f59e0b" },
    { name: "Civil Construction", value: calc.hardConstructionCost, color: "#3b82f6" },
    { name: "MEP & Finishes", value: calc.mepCost, color: "#06b6d4" },
    { name: "Approvals & Liaison", value: calc.approvalCost, color: "#8b5cf6" },
    { name: "Contingency Buffer", value: calc.contingencyCost, color: "#ef4444" },
    { name: "Finance IDC", value: calc.financeCostEst, color: "#ec4899" },
    { name: "Marketing & Brokerage", value: calc.marketingCost, color: "#10b981" },
  ];

  // Chart data: Revenue vs Cost vs Profit
  const comparisonData = [
    {
      category: "Project Economics",
      "Gross Revenue (GDV)": calc.expectedGrossRevenue,
      "Total Cost (TDC)": calc.totalProjectCost,
      "Net Developer Profit": Math.max(0, calc.netDeveloperProfit),
    },
  ];

  // S-Curve Cash Flow Simulation (monthly forecast)
  const durationMonths = deal.projectDurationMonths || 24;
  const cashFlowTimeline = [];
  let cumulativeCost = 0;
  let cumulativeRevenue = 0;
  for (let m = 1; m <= durationMonths; m++) {
    // S-curve spending progress
    const progressFactor = Math.sin((m / durationMonths) * (Math.PI / 2));
    const monthlyCost = (calc.totalProjectCost / durationMonths) * (0.4 + 1.2 * progressFactor);
    cumulativeCost = Math.min(calc.totalProjectCost, cumulativeCost + monthlyCost);

    // Sales milestone progress (starts after month 3)
    let monthlyRev = 0;
    if (m >= 3) {
      const salesFactor = Math.sin(((m - 2) / (durationMonths - 2)) * Math.PI);
      monthlyRev = (calc.expectedGrossRevenue / (durationMonths - 2)) * (0.5 + 1.0 * salesFactor);
    }
    cumulativeRevenue = Math.min(calc.expectedGrossRevenue, cumulativeRevenue + monthlyRev);

    cashFlowTimeline.push({
      month: `M${m}`,
      "Cumulative Cost": Number(cumulativeCost.toFixed(2)),
      "Cumulative Collections": Number(cumulativeRevenue.toFixed(2)),
      "Net Cash Position": Number((cumulativeRevenue - cumulativeCost).toFixed(2)),
    });
  }

  // Sensitivity Matrix: Price vs Construction Cost
  const priceVariations = [-10, -5, 0, 5, 10];
  const costVariations = [-10, 0, 10];

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              <span>Institutional Pro-Forma Modeling Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Real Estate Feasibility & Deal Modeler
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Calculate permissible FAR, full-stack construction costs, financing costs (IDC), developer margins, and annualized IRR.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenStructuring(deal)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <span>Compare Deal Structures</span>
            </button>

            <button
              onClick={runAiFeasibilityAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? "Analyzing Deal..." : "AI Feasibility Teardown"}</span>
            </button>
          </div>
        </div>

        {/* Preset Deal Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Load Preset Deal:</span>
          {SAMPLE_DEALS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
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

      {/* Main Studio Grid: Left Inputs / Right Metrics & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Information Card */}
          <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>1. Property & Zoning Parameters</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Project Name</label>
                <input
                  type="text"
                  value={deal.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Location / Micro-Market</label>
                  <input
                    type="text"
                    value={deal.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Asset Class</label>
                  <select
                    value={deal.assetType}
                    onChange={(e) => handleInputChange("assetType", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="residential">Residential High/Mid-Rise</option>
                    <option value="commercial">Commercial Office / Retail</option>
                    <option value="plotted">Gated Plotted Subdivision</option>
                    <option value="mixed-use">Mixed-Use Development</option>
                    <option value="industrial">Industrial / Warehousing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Plot Area (Sq.Ft)</label>
                  <input
                    type="number"
                    value={deal.plotAreaSqFt}
                    onChange={(e) => handleInputChange("plotAreaSqFt", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500">
                    ≈ {(deal.plotAreaSqFt / 43560).toFixed(2)} Acres
                  </span>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Base FAR + Purchasable</label>
                  <div className="flex space-x-2 mt-1">
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Base"
                      value={deal.baseFar}
                      onChange={(e) => handleInputChange("baseFar", Number(e.target.value))}
                      className="w-1/2 px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Purchasable"
                      value={deal.purchasableFar}
                      onChange={(e) => handleInputChange("purchasableFar", Number(e.target.value))}
                      className="w-1/2 px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Total FAR: {(deal.baseFar + deal.purchasableFar).toFixed(2)}x
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Efficiency / Loading %</label>
                  <input
                    type="number"
                    value={deal.superBuiltUpEfficiencyPercent}
                    onChange={(e) => handleInputChange("superBuiltUpEfficiencyPercent", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500">Super built-up multiplier</span>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Ground Coverage %</label>
                  <input
                    type="number"
                    value={deal.groundCoveragePercent}
                    onChange={(e) => handleInputChange("groundCoveragePercent", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Land & Construction Cost Inputs */}
          <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>2. Land & Construction Budget</span>
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Land Asking Price (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={deal.marketAskPriceTotal}
                    onChange={(e) => handleInputChange("marketAskPriceTotal", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Govt Circle Rate (₹/sqft)</label>
                  <input
                    type="number"
                    value={deal.circleRatePerSqFt}
                    onChange={(e) => handleInputChange("circleRatePerSqFt", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400">Approvals (₹/sqft)</label>
                  <input
                    type="number"
                    value={deal.approvalAndLiaisonCostPerSqFt}
                    onChange={(e) => handleInputChange("approvalAndLiaisonCostPerSqFt", Number(e.target.value))}
                    className="w-full mt-1 px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Civil Cost (₹/sqft)</label>
                  <input
                    type="number"
                    value={deal.constructionCostPerSqFt}
                    onChange={(e) => handleInputChange("constructionCostPerSqFt", Number(e.target.value))}
                    className="w-full mt-1 px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">MEP/Finish (₹/sqft)</label>
                  <input
                    type="number"
                    value={deal.mepAndFinishingPerSqFt}
                    onChange={(e) => handleInputChange("mepAndFinishingPerSqFt", Number(e.target.value))}
                    className="w-full mt-1 px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Contingency Buffer %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={deal.contingencyPercent}
                    onChange={(e) => handleInputChange("contingencyPercent", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Marketing / Broker %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={deal.marketingBrokeragePercent}
                    onChange={(e) => handleInputChange("marketingBrokeragePercent", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue & Financing Inputs */}
          <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>3. Sales Realisation & Capital Stack</span>
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Expected Sale Price (₹/sqft)</label>
                  <input
                    type="number"
                    value={deal.expectedSalePricePerSqFt}
                    onChange={(e) => handleInputChange("expectedSalePricePerSqFt", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Project Timeline (Months)</label>
                  <input
                    type="number"
                    value={deal.projectDurationMonths}
                    onChange={(e) => handleInputChange("projectDurationMonths", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Equity Share % (vs Debt)</label>
                  <input
                    type="number"
                    value={deal.equityContributionPercent}
                    onChange={(e) => handleInputChange("equityContributionPercent", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500">Debt: {100 - deal.equityContributionPercent}%</span>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Debt Interest Rate % p.a.</label>
                  <input
                    type="number"
                    step="0.5"
                    value={deal.debtInterestRateAnnualPercent}
                    onChange={(e) => handleInputChange("debtInterestRateAnnualPercent", Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Metrics, Visualizations & AI Memo (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 shadow-lg">
              <span className="text-xs text-slate-400">Total Project Cost</span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                ₹{calc.totalProjectCost} Cr
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                ₹{calc.costPerSqFtSaleable.toLocaleString()}/sq.ft
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 shadow-lg">
              <span className="text-xs text-slate-400">Gross Realisation (GDV)</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                ₹{calc.expectedGrossRevenue} Cr
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {calc.totalSaleableAreaSqFt.toLocaleString()} sq.ft
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 shadow-lg">
              <span className="text-xs text-slate-400">Developer Net Profit</span>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                ₹{calc.netDeveloperProfit} Cr
              </div>
              <span className="text-[10px] text-amber-400/90 font-mono">
                Margin: {calc.developerMarginPercent}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 shadow-lg">
              <span className="text-xs text-slate-400">Annualized Equity IRR</span>
              <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                {calc.annualizedIrrPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                MOIC: {calc.equityMultiple}x
              </span>
            </div>
          </div>

          {/* Tab Navigation for Visuals */}
          <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-6">
              <div className="flex space-x-2">
                {[
                  { id: "summary", label: "Cost & Economics" },
                  { id: "cashflow", label: "S-Curve Cash Flow" },
                  { id: "sensitivity", label: "Sensitivity Matrix" },
                  { id: "ai-memo", label: "AI Investment Memo" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === t.id
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "ai-memo" && !aiReport && (
                <button
                  onClick={runAiFeasibilityAnalysis}
                  disabled={isAnalyzing}
                  className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Memo</span>
                </button>
              )}
            </div>

            {/* Tab 1: Cost & Economics Charts */}
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cost Stack Pie */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                      Cost Stack Distribution (Total: ₹{calc.totalProjectCost} Cr)
                    </h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(val: any) => [`₹${val} Cr`, "Amount"]}
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Waterfall Comparison Bar */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                      Revenue vs Cost vs Developer Profit (₹ Cr)
                    </h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                          <Bar dataKey="Gross Revenue (GDV)" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Total Cost (TDC)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Net Developer Profit" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Key Viability Check Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400">Breakeven Sale Price</span>
                    <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
                      ₹{calc.breakevenSalePricePerSqFt.toLocaleString()}/sq.ft
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400">Breakeven Inventory %</span>
                    <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                      {calc.breakevenSalePercent}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400">Project ROI</span>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {calc.projectRoiPercent}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400">Equity Capital Required</span>
                    <div className="text-sm font-bold font-mono text-blue-400 mt-0.5">
                      ₹{calc.equityAmount} Cr
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: S-Curve Cash Flow Timeline */}
            {activeTab === "cashflow" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Project S-Curve: Cumulative Spend vs Collections ({durationMonths} Months)
                  </h4>
                  <span className="text-[11px] text-slate-500">Amounts in ₹ Crores</span>
                </div>
                <div className="h-64 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowTimeline} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Area type="monotone" dataKey="Cumulative Cost" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="Cumulative Collections" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-400">
                  Notice how collections cross cumulative expenses around Month {Math.round(durationMonths * (calc.breakevenSalePercent / 100))}, marking the point where the project reaches cash neutrality.
                </p>
              </div>
            )}

            {/* Tab 3: Sensitivity Matrix */}
            {activeTab === "sensitivity" && (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Net Profit & IRR Sensitivity Matrix (Price vs Cost Fluctuations)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800">
                        <th className="p-2 text-left text-slate-400">Sale Price Variation</th>
                        {costVariations.map((cv) => (
                          <th key={cv} className="p-2 text-slate-300 font-mono">
                            Cost {cv > 0 ? `+${cv}%` : `${cv}%`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {priceVariations.map((pv) => {
                        const adjustedPrice = deal.expectedSalePricePerSqFt * (1 + pv / 100);
                        return (
                          <tr key={pv} className={pv === 0 ? "bg-amber-500/10 font-semibold" : ""}>
                            <td className="p-2.5 text-left font-mono text-slate-300">
                              Price {pv > 0 ? `+${pv}%` : `${pv}%`} (₹{Math.round(adjustedPrice)})
                            </td>
                            {costVariations.map((cv) => {
                              const adjustedCost = calc.totalProjectCost * (1 + cv / 100);
                              const adjustedRev = (calc.totalSaleableAreaSqFt * adjustedPrice) / 10000000;
                              const simProfit = Number((adjustedRev - adjustedCost).toFixed(2));
                              const simIrr = ((simProfit / calc.equityAmount) * 100) / (durationMonths / 12);
                              const isPositive = simProfit > 0;

                              return (
                                <td key={cv} className="p-2.5 font-mono">
                                  <div className={isPositive ? "text-emerald-400" : "text-red-400"}>
                                    ₹{simProfit} Cr
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    IRR: {simIrr.toFixed(1)}%
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: AI Investment Memo */}
            {activeTab === "ai-memo" && (
              <div className="space-y-6">
                {isAnalyzing ? (
                  <div className="py-12 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-white">
                      Evaluating Deal Feasibility with Chief Investment Officer Engine...
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Auditing zoning density, cost escalations, capital stack options, and RERA risk factors.
                    </p>
                  </div>
                ) : analysisError ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-red-400 font-semibold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{analysisError}</span>
                    </div>
                    <button
                      onClick={runAiFeasibilityAnalysis}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Analysis</span>
                    </button>
                  </div>
                ) : aiReport ? (
                  <div className="space-y-6 text-sm">
                    {/* Score & Summary */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 gap-4">
                      <div>
                        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                          Deal Feasibility Rating
                        </span>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-3xl font-display font-bold font-mono text-amber-400">
                            {aiReport.feasibilityScore}
                            <span className="text-lg text-slate-500">/100</span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {aiReport.feasibilityScore >= 75 ? "Highly Viable" : "Moderate Risk"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                        {aiReport.executiveSummary}
                      </p>
                    </div>

                    {/* Optimal Structure Recommendation */}
                    {aiReport.optimalStructure && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs font-mono uppercase">
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>Optimal Structure: {aiReport.optimalStructure.structure}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {aiReport.optimalStructure.rationale}
                        </p>
                        {aiReport.optimalStructure.recommendedSplit && (
                          <div className="mt-2 text-xs font-mono text-amber-200">
                            Suggested Commercial Split: {aiReport.optimalStructure.recommendedSplit}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Risk Audit */}
                    {aiReport.riskAudit && aiReport.riskAudit.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
                          Risk Audit & Mitigation Protocol
                        </h5>
                        <div className="space-y-2">
                          {aiReport.riskAudit.map((r: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white">{r.risk}</span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                                    r.severity === "HIGH"
                                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                      : r.severity === "MEDIUM"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  }`}
                                >
                                  {r.severity} RISK
                                </span>
                              </div>
                              <p className="text-slate-400">
                                <strong className="text-slate-300">Mitigation: </strong>
                                {r.mitigation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Master Developer Strategic Advice */}
                    {aiReport.masterDeveloperAdvice && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-mono font-semibold uppercase text-emerald-400 block mb-1">
                          👑 Master Developer Value Creation Strategy:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiReport.masterDeveloperAdvice}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-xs text-slate-400">
                      No AI analysis generated yet for this property.
                    </p>
                    <button
                      onClick={runAiFeasibilityAnalysis}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 mx-auto"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI Feasibility Analysis Now</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
