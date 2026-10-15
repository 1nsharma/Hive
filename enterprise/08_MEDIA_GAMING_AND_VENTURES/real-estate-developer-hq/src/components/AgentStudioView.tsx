import React, { useState } from "react";
import {
  INDIAN_CITY_BENCHMARKS,
  SAAS_DATABASE_SCHEMA_SPEC,
  AGENT_PROMPTS_SPEC,
  PRE_SEED_PITCH_DECK,
} from "../data/agentStudioData";
import {
  CityMarketBenchmark,
  PromptTemplateItem,
  PitchDeckSlide,
  DeveloperTag,
} from "../types";
import {
  Sparkles,
  Layers,
  Database,
  Terminal,
  Presentation,
  FileText,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Download,
  Printer,
  Copy,
  Check,
  Send,
  RefreshCw,
  Landmark,
  ChevronRight,
  Cpu,
  MapPin,
  Scale,
  Briefcase,
  Play,
} from "lucide-react";

export function AgentStudioView() {
  const [activeTab, setActiveTab] = useState<
    "memo-generator" | "product-spec" | "prompt-design" | "pitch-deck" | "term-sheet"
  >("memo-generator");

  // 1-Page Memo Generator State
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>("lko-shaheed-path");
  const [plotAreaAcres, setPlotAreaAcres] = useState<number>(4.5);
  const [askingPriceCr, setAskingPriceCr] = useState<number>(38.5);
  const [customFar, setCustomFar] = useState<number>(3.5);
  const [salePricePerSqFt, setSalePricePerSqFt] = useState<number>(6500);
  const [civilCostPerSqFt, setCivilCostPerSqFt] = useState<number>(2350);
  const [isGeneratingMemo, setIsGeneratingMemo] = useState<boolean>(false);
  const [generatedMemo, setGeneratedMemo] = useState<any | null>(null);
  const [memoError, setMemoError] = useState<string | null>(null);

  // Prompt Design State
  const [selectedPromptId, setSelectedPromptId] = useState<string>("deal-analyst-memo");
  const [customPromptInput, setCustomPromptInput] = useState<string>(
    AGENT_PROMPTS_SPEC[0].defaultInput
  );
  const [isExecutingPrompt, setIsExecutingPrompt] = useState<boolean>(false);
  const [agentOutput, setAgentOutput] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Pitch Deck State
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [targetDevelopersY1, setTargetDevelopersY1] = useState<number>(75);
  const [avgArpuPerMonth, setAvgArpuPerMonth] = useState<number>(45000);

  // Term Sheet Generator State
  const [termDealName, setTermDealName] = useState<string>("Gomti Heights Luxury Residency");
  const [termLocation, setTermLocation] = useState<string>("Shaheed Path, Lucknow");
  const [termStructure, setTermStructure] = useState<string>("Revenue Share JDA");
  const [termDevShare, setTermDevShare] = useState<number>(68);
  const [termLandShare, setTermLandShare] = useState<number>(32);
  const [termDepositCr, setTermDepositCr] = useState<number>(4.5);
  const [isGeneratingTerm, setIsGeneratingTerm] = useState<boolean>(false);
  const [generatedTermSheet, setGeneratedTermSheet] = useState<any | null>(null);

  const activeBenchmark =
    INDIAN_CITY_BENCHMARKS.find((b) => b.id === selectedBenchmarkId) ||
    INDIAN_CITY_BENCHMARKS[0];

  const activePromptTemplate =
    AGENT_PROMPTS_SPEC.find((p) => p.id === selectedPromptId) ||
    AGENT_PROMPTS_SPEC[0];

  const activeSlide: PitchDeckSlide = PRE_SEED_PITCH_DECK[currentSlideIndex];

  // Auto-fill when selecting benchmark
  const handleSelectBenchmark = (benchmark: CityMarketBenchmark) => {
    setSelectedBenchmarkId(benchmark.id);
    setCustomFar(benchmark.standardFar + benchmark.purchasableFarMax);
    setSalePricePerSqFt(benchmark.avgApartmentSalePriceSqFt);
    setCivilCostPerSqFt(benchmark.avgCivilMepCostSqFt);
  };

  // Math for instant fast preview
  const plotAreaSqFt = plotAreaAcres * 43560;
  const builtUpAreaSqFt = plotAreaSqFt * customFar;
  const saleableAreaSqFt = builtUpAreaSqFt * 1.3;
  const grossRevenueCr = (saleableAreaSqFt * salePricePerSqFt) / 10000000;
  const hardCostCr = (builtUpAreaSqFt * civilCostPerSqFt) / 10000000;
  const approvalAndSoftCostCr = (builtUpAreaSqFt * 400) / 10000000;
  const totalCostCr = askingPriceCr + hardCostCr + approvalAndSoftCostCr;
  const netProfitCr = grossRevenueCr - totalCostCr;
  const marginPercent = grossRevenueCr > 0 ? (netProfitCr / grossRevenueCr) * 100 : 0;

  // Run AI Memo Generation
  const handleGenerateMemo = async () => {
    setIsGeneratingMemo(true);
    setMemoError(null);
    try {
      const payload = {
        plotSpecs: {
          locality: activeBenchmark.locality,
          city: activeBenchmark.city,
          state: activeBenchmark.state,
          plotAreaAcres,
          plotAreaSqFt,
          askingPriceCr,
          customFar,
          salePricePerSqFt,
          civilCostPerSqFt,
        },
        financialSummary: {
          builtUpAreaSqFt,
          saleableAreaSqFt,
          grossRevenueCr,
          totalCostCr,
          netProfitCr,
          marginPercent,
        },
        localityBenchmark: activeBenchmark,
      };

      const res = await fetch("/api/gemini/generate-memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to generate investment memo.");
      const data = await res.json();
      setGeneratedMemo(data);
    } catch (err: any) {
      setMemoError(err.message || "Failed to contact Gemini API.");
    } finally {
      setIsGeneratingMemo(false);
    }
  };

  // Run AI Prompt Execution
  const handleExecutePrompt = async () => {
    setIsExecutingPrompt(true);
    try {
      const res = await fetch("/api/gemini/run-agent-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag: activePromptTemplate.tag,
          roleTitle: activePromptTemplate.roleTitle,
          customInput: customPromptInput,
          systemPromptOverride: activePromptTemplate.systemPrompt,
        }),
      });
      if (!res.ok) throw new Error("Agent prompt execution failed.");
      const data = await res.json();
      setAgentOutput(data.text);
    } catch (err: any) {
      setAgentOutput("Error: " + err.message);
    } finally {
      setIsExecutingPrompt(false);
    }
  };

  // Run Term Sheet Generation
  const handleGenerateTermSheet = async () => {
    setIsGeneratingTerm(true);
    try {
      const res = await fetch("/api/gemini/generate-term-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealName: termDealName,
          location: termLocation,
          structureType: termStructure,
          developerSplit: termDevShare,
          landownerSplit: termLandShare,
          refundableDepositCr: termDepositCr,
          timelineMonths: 36,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate term sheet.");
      const data = await res.json();
      setGeneratedTermSheet(data);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGeneratingTerm(false);
    }
  };

  const handleCopyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: The First AI Developer Agent */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/40 uppercase tracking-wide font-semibold">
                Product Blueprint & SaaS OS
              </span>
              <span className="text-slate-400 text-xs font-mono">• Multi-Agent Indian PropTech</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-2 tracking-tight">
              The AI Co-Developer <span className="text-amber-400">Agent Studio</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl mt-1 leading-relaxed">
              "Takes any plot or project in India and tells you: what can be built, what it’s worth, how to fund it, how to structure it, and where your profit really is."
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pitch-deck")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Presentation className="w-4 h-4" />
              <span>Investor Pitch Deck</span>
            </button>
            <button
              onClick={() => setActiveTab("memo-generator")}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Deal Memo</span>
            </button>
          </div>
        </div>

        {/* Sub-View Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("memo-generator")}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "memo-generator"
                ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>⚡ 1-Page Deal Memo</span>
          </button>

          <button
            onClick={() => setActiveTab("product-spec")}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "product-spec"
                ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>1) Product Spec</span>
          </button>

          <button
            onClick={() => setActiveTab("prompt-design")}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "prompt-design"
                ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>2) AI Prompts & Agents</span>
          </button>

          <button
            onClick={() => setActiveTab("pitch-deck")}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "pitch-deck"
                ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>3) Investor Pitch</span>
          </button>

          <button
            onClick={() => setActiveTab("term-sheet")}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === "term-sheet"
                ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>📑 JDA Term Sheet</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: 1-PAGE DEAL MEMO GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === "memo-generator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls: Indian Micro-market Benchmarks & Plot Ingestion */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold text-white flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Select Indian Micro-Market Benchmark</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">DCR & Circle Rates</span>
                </div>

                {/* City Benchmark Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INDIAN_CITY_BENCHMARKS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBenchmark(b)}
                      className={`p-2.5 rounded-xl text-left border transition text-xs ${
                        selectedBenchmarkId === b.id
                          ? "bg-amber-500/15 border-amber-500/50 text-white shadow-sm"
                          : "bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                      }`}
                    >
                      <div className="font-semibold text-white truncate">{b.city}</div>
                      <div className="text-[11px] text-slate-400 truncate">{b.locality}</div>
                      <div className="text-[10px] font-mono text-amber-400/90 mt-1">
                        FAR: {b.standardFar} | ₹{b.avgApartmentSalePriceSqFt}/sqft
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Benchmark Insights */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">RERA Authority:</span>
                    <span className="font-mono text-amber-400 font-semibold">{activeBenchmark.reraAuthority}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Standard JDA Split:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{activeBenchmark.typicalJdaRevenueShare}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Govt Circle Rate:</span>
                    <span className="font-mono text-slate-300">₹{activeBenchmark.avgCircleRateSqFt.toLocaleString()}/sq.ft</span>
                  </div>
                </div>

                {/* Plot Input Parameters */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Plot Size (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={plotAreaAcres}
                        onChange={(e) => setPlotAreaAcres(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Land Asking Price (₹ Cr)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={askingPriceCr}
                        onChange={(e) => setAskingPriceCr(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">
                        Target FAR
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={customFar}
                        onChange={(e) => setCustomFar(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">
                        Sale Price (₹/sqft)
                      </label>
                      <input
                        type="number"
                        value={salePricePerSqFt}
                        onChange={(e) => setSalePricePerSqFt(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">
                        Civil Cost (₹/sqft)
                      </label>
                      <input
                        type="number"
                        value={civilCostPerSqFt}
                        onChange={(e) => setCivilCostPerSqFt(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Document Intake Simulator */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-dashed border-slate-700 text-center space-y-1">
                    <p className="text-[11px] text-slate-300 font-medium">
                      📄 Ingest Title Deed / Khasra / Master Plan
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Auto-extracts road width, Khatoni mutation records, and survey coordinates.
                    </p>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateMemo}
                    disabled={isGeneratingMemo}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    {isGeneratingMemo ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Institutional Deal Memo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate 1-Page Investment Memo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Display: 1-Page Deal Memo Canvas */}
            <div className="lg:col-span-7 space-y-4">
              {memoError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{memoError}</span>
                </div>
              )}

              {/* Printable 1-Page Investment Committee Deal Memo */}
              <div
                id="printable-deal-memo"
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
                        Institutional Deal Memo
                      </span>
                      <span className="text-xs text-slate-400">
                        {activeBenchmark.city} • {activeBenchmark.locality}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-1">
                      {plotAreaAcres} Acre Development Opportunity
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center space-x-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Scorecard Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Buildable Area
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white">
                      {(builtUpAreaSqFt / 1000).toFixed(0)}k sq.ft
                    </span>
                    <span className="text-[10px] text-slate-500 block">FAR: {customFar}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Expected GDV
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-amber-400">
                      ₹{grossRevenueCr.toFixed(1)} Cr
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      @ ₹{salePricePerSqFt.toLocaleString()}/sqft
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Total Dev Cost
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-slate-200">
                      ₹{totalCostCr.toFixed(1)} Cr
                    </span>
                    <span className="text-[10px] text-slate-500 block">Land + Civil + Approvals</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Net Developer Margin
                    </span>
                    <span
                      className={`text-sm sm:text-base font-mono font-bold ${
                        marginPercent >= 20 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {marginPercent.toFixed(1)}% (₹{netProfitCr.toFixed(1)}Cr)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {marginPercent >= 20 ? "Healthy Margin" : "Tight Buffer"}
                    </span>
                  </div>
                </div>

                {/* AI Executive Verdict */}
                {generatedMemo ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Investment Committee Recommendation</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                          {generatedMemo.recommendedAction}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {generatedMemo.executiveSummary}
                      </p>
                    </div>

                    {/* Cost Stack & Land Thesis */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center space-x-1">
                          <Building className="w-3.5 h-3.5" />
                          <span>Land & Zoning Thesis</span>
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          {generatedMemo.landAndZoningThesis}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                          <Scale className="w-3.5 h-3.5" />
                          <span>Optimal Deal Structure</span>
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          {generatedMemo.recommendedStructure}
                        </p>
                      </div>
                    </div>

                    {/* Key Downside Risk Register */}
                    {generatedMemo.keyRisks && generatedMemo.keyRisks.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-red-400 flex items-center space-x-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Downside Risk Audit & Regulatory Pitfalls</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {generatedMemo.keyRisks.map((risk: string, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                    <h4 className="text-sm font-semibold text-slate-300">
                      Live Preview: Ready to Synthesize Full Memo
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Click the "Generate 1-Page Investment Memo" button to invoke the Gemini 3.7 Deal Partner AI engine with real-world Indian regulatory heuristics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: PRODUCT SPECIFICATION & ARCHITECTURE */}
      {/* ========================================================================= */}
      {activeTab === "product-spec" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Technical Architecture & Data Engineering
                </span>
                <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-1">
                  1) SaaS Data Model & Multi-Tenant Architecture
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                Engine: PostgreSQL 16 + PostGIS + pgvector
              </span>
            </div>

            {/* Microservice & Workflow Sequence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAAS_DATABASE_SCHEMA_SPEC.apiWorkflows.map((wf) => (
                <div
                  key={wf.step}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Step {wf.step}: {wf.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {wf.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Input:</strong> {wf.input}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Process:</strong> {wf.process}
                  </div>
                  <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-900">
                    <strong>Output:</strong> {wf.output}
                  </div>
                </div>
              ))}
            </div>

            {/* PostgreSQL Schema Tables Viewer */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-display font-bold text-white flex items-center space-x-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Production PostgreSQL Entity Relations</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {SAAS_DATABASE_SCHEMA_SPEC.tables.map((table) => (
                  <div
                    key={table.name}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {table.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          Table
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{table.description}</p>

                    <div className="space-y-1 font-mono text-[11px]">
                      {table.fields.map((f) => (
                        <div
                          key={f.name}
                          className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/60 text-slate-300"
                        >
                          <span className="text-amber-200/90 font-semibold">{f.name}</span>
                          <span className="text-slate-500 text-[10px]">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: PRODUCTION AI PROMPT SYSTEM & LIVE TESTER */}
      {/* ========================================================================= */}
      {activeTab === "prompt-design" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Prompt Template Catalog */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold text-white flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>2) Multi-Agent Production Prompts</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">10 Tags Configured</span>
                </div>

                <div className="space-y-2">
                  {AGENT_PROMPTS_SPEC.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPromptId(p.id);
                        setCustomPromptInput(p.defaultInput);
                        setAgentOutput(null);
                      }}
                      className={`w-full p-3 rounded-xl text-left border transition ${
                        selectedPromptId === p.id
                          ? "bg-amber-500/15 border-amber-500/50 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate">
                          {p.roleTitle}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          [{p.tag}]
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.keyFocusAreas.map((k, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 font-mono"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Agent Execution Sandbox */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                      TAG: [{activePromptTemplate.tag}] • {activePromptTemplate.curriculumLevels}
                    </span>
                    <h3 className="text-base font-display font-bold text-white mt-1">
                      {activePromptTemplate.roleTitle}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyPromptText(activePromptTemplate.systemPrompt)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                    >
                      {copiedPrompt ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
                    </button>
                  </div>
                </div>

                {/* System Prompt Preview */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    System Instruction Directive
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto no-scrollbar">
                    {activePromptTemplate.systemPrompt}
                  </p>
                </div>

                {/* User Input & Test */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Live Deal Input / Question:
                  </label>
                  <textarea
                    rows={4}
                    value={customPromptInput}
                    onChange={(e) => setCustomPromptInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 outline-none font-mono"
                    placeholder="Enter deal parameters..."
                  />

                  <button
                    onClick={handleExecutePrompt}
                    disabled={isExecutingPrompt}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    {isExecutingPrompt ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Agent Orchestrating Deal Reasoning...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Run Live Agent Execution</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Live Output Stream */}
                {agentOutput && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Multi-Agent Response</span>
                    </span>
                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                      {agentOutput}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: PRE-SEED INVESTOR PITCH DECK */}
      {/* ========================================================================= */}
      {activeTab === "pitch-deck" && (
        <div className="space-y-6">
          {/* Slide Presentation Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  SLIDE {activeSlide.id} OF {PRE_SEED_PITCH_DECK.length}
                </span>
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                  {activeSlide.tagline}
                </span>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      prev > 0 ? prev - 1 : PRE_SEED_PITCH_DECK.length - 1
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                >
                  ← Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      prev < PRE_SEED_PITCH_DECK.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Slide Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {activeSlide.title}
              </h2>
              <p className="text-slate-400 text-sm mt-1">{activeSlide.subtitle}</p>
            </div>

            {/* Slide Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeSlide.keyPoints.map((kp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {kp.heading}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{kp.description}</p>
                  {kp.stat && (
                    <div className="pt-2 border-t border-slate-900 text-emerald-400 font-mono text-xs font-bold">
                      {kp.stat}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Slide Metrics Strip */}
            {activeSlide.metricsSummary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeSlide.metricsSummary.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center"
                  >
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {m.label}
                    </span>
                    <span className="text-base sm:text-lg font-mono font-bold text-amber-400">
                      {m.value}
                    </span>
                    {m.sublabel && (
                      <span className="text-[10px] text-slate-400 block">{m.sublabel}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Strategic Takeaway */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Bottom Line:</strong> {activeSlide.strategicTakeaway}
              </span>
            </div>
          </div>

          {/* Slide Mini-Thumbnail Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PRE_SEED_PITCH_DECK.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2.5 rounded-xl text-left border transition text-xs ${
                  currentSlideIndex === idx
                    ? "bg-amber-500/20 border-amber-500 text-white font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <div className="text-[10px] font-mono text-amber-400">Slide {s.id}</div>
                <div className="truncate font-semibold text-white mt-0.5">{s.title}</div>
              </button>
            ))}
          </div>

          {/* Interactive ARR & Customer Growth Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-display font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Interactive SaaS ARR Simulator (Customer Growth vs Revenue)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Year 1 Active Developers: <strong className="text-white">{targetDevelopersY1}</strong>
                </label>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={targetDevelopersY1}
                  onChange={(e) => setTargetDevelopersY1(parseInt(e.target.value) || 20)}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Blended ARPU (₹/mo): <strong className="text-white">₹{avgArpuPerMonth.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="15000"
                  max="125000"
                  step="5000"
                  value={avgArpuPerMonth}
                  onChange={(e) => setAvgArpuPerMonth(parseInt(e.target.value) || 15000)}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Projected Annual ARR
                </span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  ₹{((targetDevelopersY1 * avgArpuPerMonth * 12) / 10000000).toFixed(2)} Crores
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ${(((targetDevelopersY1 * avgArpuPerMonth * 12) / 10000000) * 0.12).toFixed(2)}M USD ARR
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: JDA TERM SHEET & COMMERCIAL CONTRACT DRAFTER */}
      {/* ========================================================================= */}
      {activeTab === "term-sheet" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Parameters */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-display font-bold text-white flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>JDA Term Sheet Parameters</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={termDealName}
                      onChange={(e) => setTermDealName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Location & City</label>
                    <input
                      type="text"
                      value={termLocation}
                      onChange={(e) => setTermLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Developer Split (%)</label>
                      <input
                        type="number"
                        value={termDevShare}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setTermDevShare(val);
                          setTermLandShare(100 - val);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Landowner Split (%)</label>
                      <input
                        type="number"
                        value={termLandShare}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setTermLandShare(val);
                          setTermDevShare(100 - val);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Refundable Security Deposit (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={termDepositCr}
                      onChange={(e) => setTermDepositCr(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateTermSheet}
                    disabled={isGeneratingTerm}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    {isGeneratingTerm ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Drafting Commercial Protective Covenants...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Draft Commercial Term Sheet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Output */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Binding Commercial Term Sheet Draft
                  </span>
                  <h3 className="text-base font-display font-bold text-white mt-1">
                    {termDealName} — {termDevShare}:{termLandShare} Revenue Sharing JDA
                  </h3>
                </div>

                {generatedTermSheet ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 italic">{generatedTermSheet.preamble}</p>

                    <div className="space-y-3">
                      {generatedTermSheet.keyClauses?.map((c: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-amber-300">
                            {c.clauseNumber}. {c.title}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">{c.content}</p>
                          {c.legalSafeguardRationale && (
                            <div className="text-[10px] text-emerald-400 font-mono mt-1">
                              <strong>Protection:</strong> {c.legalSafeguardRationale}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                      {generatedTermSheet.closingNote}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                    <Scale className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                    <h4 className="text-xs font-semibold text-slate-300">Ready to Draft Term Sheet</h4>
                    <p className="text-[11px] text-slate-500">
                      Click "Draft Commercial Term Sheet" to invoke our Senior Advocate RERA drafting model with non-dilution covenants.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
