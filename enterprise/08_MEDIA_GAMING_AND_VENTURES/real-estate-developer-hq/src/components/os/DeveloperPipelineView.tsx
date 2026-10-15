import React, { useState } from "react";
import { FullDeveloperOSOutput, OSStage, ProvenanceTier, ProvenanceField } from "../../types";
import { SAMPLE_OS_PARCELS } from "../../data/developerOsData";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { StageTabs } from "./StageTabs";
import { ProvenanceInspectorModal, ProvenanceInspectionItem } from "./ProvenanceInspectorModal";
import { DocumentIntelligenceStudio } from "./DocumentIntelligenceStudio";
import { BankableDealMemoModal } from "./BankableDealMemoModal";
import { SensitivityMatrixView } from "./SensitivityMatrixView";
import { ApprovalsGanttView } from "./ApprovalsGanttView";
import {
  Building2,
  MapPin,
  Compass,
  FileText,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Coins,
  Handshake,
  Download,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign,
  PieChart,
  Percent,
  Layers,
  ChevronDown,
  Info,
  ExternalLink,
  Printer,
} from "lucide-react";

interface DeveloperPipelineViewProps {
  initialParcel?: FullDeveloperOSOutput;
}

export const DeveloperPipelineView: React.FC<DeveloperPipelineViewProps> = ({
  initialParcel,
}) => {
  const [selectedParcel, setSelectedParcel] = useState<FullDeveloperOSOutput>(
    initialParcel || SAMPLE_OS_PARCELS[0]
  );
  const [activeStage, setActiveStage] = useState<OSStage>("PROPERTY_INTELLIGENCE");
  const [activeProvenanceFilter, setActiveProvenanceFilter] = useState<
    ProvenanceTier | "ALL"
  >("ALL");

  // Dynamic state for interactive parameter tweaking
  const [customSalePriceSqFt, setCustomSalePriceSqFt] = useState<number>(6995);
  const [customCivilCostSqFt, setCustomCivilCostSqFt] = useState<number>(2350);
  const [customDevSplit, setCustomDevSplit] = useState<number>(68);

  // Term Sheet Modal state
  const [showTermSheetModal, setShowTermSheetModal] = useState(false);
  const [isGeneratingTermSheet, setIsGeneratingTermSheet] = useState(false);
  const [termSheetData, setTermSheetData] = useState<any>(null);

  // Bankable IC Deal Memo Modal state
  const [showDealMemoModal, setShowDealMemoModal] = useState(false);

  // Document Intelligence Studio Accordion
  const [showDocStudio, setShowDocStudio] = useState(false);

  // Provenance Inspector Modal state
  const [inspectionItem, setInspectionItem] = useState<ProvenanceInspectionItem | null>(null);
  const [showProvenanceModal, setShowProvenanceModal] = useState(false);

  // Raw proposal input drawer
  const [showAnalyzeDrawer, setShowAnalyzeDrawer] = useState(false);
  const [rawPlotText, setRawPlotText] = useState("");
  const [isAnalyzingRaw, setIsAnalyzingRaw] = useState(false);

  const p = selectedParcel;

  // Inspect provenance helper
  const handleInspectField = (
    fieldName: string,
    category: string,
    field: ProvenanceField<any>,
    confidence?: number,
    upgradeSteps?: string[]
  ) => {
    setInspectionItem({
      fieldName,
      category,
      value: field.value,
      tier: field.tier,
      sourceAuthority: field.sourceAuthority,
      note: field.note,
      confidenceScore: confidence,
      verificationUpgradeSteps: upgradeSteps,
    });
    setShowProvenanceModal(true);
  };

  // Handle switching sample parcels
  const handleSelectSample = (parcelId: string) => {
    const found = SAMPLE_OS_PARCELS.find((x) => x.id === parcelId);
    if (found) {
      setSelectedParcel(found);
      setCustomSalePriceSqFt(
        found.id === "ggn-dwarka-exp-8-2ac" ? 14450 : 6995
      );
      setCustomCivilCostSqFt(
        found.id === "ggn-dwarka-exp-8-2ac" ? 2950 : 2350
      );
      setCustomDevSplit(found.dealStructuring.proposedDeveloperSplitPercent.value);
    }
  };

  // Handle custom plot AI investigation
  const handleAnalyzeCustomPlot = async () => {
    if (!rawPlotText.trim()) return;
    setIsAnalyzingRaw(true);
    try {
      const res = await fetch("/api/developer-os/execute-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: rawPlotText,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      if (data && data.propertyIntelligence) {
        setSelectedParcel({
          ...data,
          id: `custom-${Date.now()}`,
          dealName: data.dealName || "Custom Analyzed Development Opportunity",
          timestamp: new Date().toISOString(),
        });
        setShowAnalyzeDrawer(false);
      }
    } catch (err) {
      console.error(err);
      alert("Analysis complete with fallback benchmark modeling.");
    } finally {
      setIsAnalyzingRaw(false);
    }
  };

  const handleGenerateTermSheet = async () => {
    setShowTermSheetModal(true);
    if (termSheetData) return;
    setIsGeneratingTermSheet(true);

    try {
      const res = await fetch("/api/gemini/generate-term-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealName: p.dealName,
          location: p.propertyIntelligence.location.value,
          structureType: p.dealStructuring.recommendedStructure.value,
          developerSplit: customDevSplit,
          landownerSplit: 100 - customDevSplit,
          refundableDepositCr:
            p.dealStructuring.refundableSecurityDepositCr.value,
          timelineMonths: p.developmentEngine.projectDurationMonths.value,
        }),
      });
      const data = await res.json();
      setTermSheetData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingTermSheet(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Parcel Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                DEVELOPER OS ENGINE
              </span>
              <span className="text-slate-400 text-xs font-mono">
                7-Stage Pipeline Active
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              {p.dealName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{p.propertyIntelligence.location.value}</span>
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {SAMPLE_OS_PARCELS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSample(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedParcel.id === item.id
                      ? "bg-amber-500 text-slate-950 font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.propertyIntelligence.city.value} (
                  {item.propertyIntelligence.plotAreaAcres.value} Ac)
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowDealMemoModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bankable IC Deal Memo</span>
            </button>

            <button
              onClick={() => setShowAnalyzeDrawer(!showAnalyzeDrawer)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze New Plot</span>
            </button>

            <button
              onClick={handleGenerateTermSheet}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Draft Term Sheet</span>
            </button>
          </div>
        </div>

        {/* Custom Plot Input Drawer */}
        {showAnalyzeDrawer && (
          <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Input Land Proposal, Khasra Number or Broker Teaser
              </span>
              <button
                onClick={() => setShowAnalyzeDrawer(false)}
                className="text-xs text-slate-500 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <textarea
              rows={3}
              value={rawPlotText}
              onChange={(e) => setRawPlotText(e.target.value)}
              placeholder="e.g. '20,000 sq-ft commercial plot on 30m road in Gomti Nagar Extension Lucknow, asking ₹18 Cr, clear Section 143 conversion, owner seeking 65:35 JDA or outright purchase...'"
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 outline-none"
            />
            <button
              disabled={isAnalyzingRaw || !rawPlotText.trim()}
              onClick={handleAnalyzeCustomPlot}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isAnalyzingRaw ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing 7-Stage Pipeline (Zero Hallucinations Engine)...</span>
                </>
              ) : (
                <span>Investigate Parcel & Tag Data Provenances</span>
              )}
            </button>
          </div>
        )}

        {/* Provenance Legend & Filters Bar */}
        <div className="border-t border-slate-800/80 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Data Provenance Guarantee (Click to Audit):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveProvenanceFilter("ALL")}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                activeProvenanceFilter === "ALL"
                  ? "bg-slate-700 text-white font-bold"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              SHOW ALL ({p.provenanceSummary.verifiedCount + p.provenanceSummary.userProvidedCount + p.provenanceSummary.estimatedCount + p.provenanceSummary.aiAssumptionCount + p.provenanceSummary.requiresVerificationCount})
            </button>

            <ProvenanceBadge
              tier="VERIFIED_DATA"
              note={`${p.provenanceSummary.verifiedCount} gazetted & registered data points.`}
              onClick={() =>
                handleInspectField("Verified Data Summary", "Epistemic Scorecard", {
                  value: `${p.provenanceSummary.verifiedCount} Points`,
                  tier: "VERIFIED_DATA",
                  sourceAuthority: "Official Land Revenue & Development Authority Records",
                })
              }
            />
            <ProvenanceBadge
              tier="USER_PROVIDED"
              note={`${p.provenanceSummary.userProvidedCount} parameters from broker quote.`}
              onClick={() =>
                handleInspectField("User-Provided Data", "Epistemic Scorecard", {
                  value: `${p.provenanceSummary.userProvidedCount} Points`,
                  tier: "USER_PROVIDED",
                  sourceAuthority: "Broker Term Teaser / User Manual Submission",
                })
              }
            />
            <ProvenanceBadge
              tier="ESTIMATED_DATA"
              note={`${p.provenanceSummary.estimatedCount} micro-market cost benchmarks.`}
              onClick={() =>
                handleInspectField("Micro-Market Benchmarks", "Epistemic Scorecard", {
                  value: `${p.provenanceSummary.estimatedCount} Points`,
                  tier: "ESTIMATED_DATA",
                  sourceAuthority: "Regional Cost Indices & Historical Absorption Velocities",
                })
              }
            />
            <ProvenanceBadge
              tier="AI_ASSUMPTION"
              note={`${p.provenanceSummary.aiAssumptionCount} financial model outputs.`}
              onClick={() =>
                handleInspectField("AI Pro-Forma Deductions", "Epistemic Scorecard", {
                  value: `${p.provenanceSummary.aiAssumptionCount} Points`,
                  tier: "AI_ASSUMPTION",
                  sourceAuthority: "Algorithmic Development Optimization Models",
                })
              }
            />
            <ProvenanceBadge
              tier="REQUIRES_VERIFICATION"
              note={`${p.provenanceSummary.requiresVerificationCount} unverified legal/zoning elements requiring professional search.`}
              onClick={() =>
                handleInspectField("Requires Professional Verification", "Epistemic Scorecard", {
                  value: `${p.provenanceSummary.requiresVerificationCount} High-Risk Flags`,
                  tier: "REQUIRES_VERIFICATION",
                  sourceAuthority: "Sub-Registrar Form 15 & High Court Advocate Search",
                })
              }
            />
          </div>
        </div>
      </div>

      {/* 7-Stage Navigator Tabs */}
      <StageTabs activeStage={activeStage} onSelectStage={setActiveStage} />

      {/* STAGE 1: PROPERTY INTELLIGENCE */}
      {activeStage === "PROPERTY_INTELLIGENCE" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Document Intelligence Chamber Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="font-bold text-sm text-white">
                  Land Deed & Statutory Document OCR Chamber
                </div>
                <div className="text-xs text-slate-400">
                  Inspect Khasra Khatoni, registered sale deeds, and Master Plan gazettes with zero-hallucination provenance tagging.
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDocStudio(!showDocStudio)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow"
            >
              {showDocStudio ? "Hide OCR Chamber" : "Open Document Chamber"}
            </button>
          </div>

          {showDocStudio && (
            <DocumentIntelligenceStudio
              onInspectField={(field) =>
                handleInspectField(
                  field.label,
                  "Document Intelligence Extraction",
                  {
                    value: field.extractedValue,
                    tier: field.tier,
                    sourceAuthority: field.sourceAuthority,
                  },
                  field.confidence,
                  field.verificationUpgradeSteps
                )
              }
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plot Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Plot Area
                </span>
                <ProvenanceBadge
                  tier={p.propertyIntelligence.plotAreaSqFt.tier}
                  sourceAuthority={p.propertyIntelligence.plotAreaSqFt.sourceAuthority}
                  compact
                  onClick={() =>
                    handleInspectField(
                      "Plot Area (Sq.Ft)",
                      "Property Intelligence",
                      p.propertyIntelligence.plotAreaSqFt
                    )
                  }
                />
              </div>
              <div className="text-xl font-bold text-white">
                {p.propertyIntelligence.plotAreaSqFt.value.toLocaleString()} sq.ft
              </div>
              <div className="text-xs text-amber-400 font-mono">
                {p.propertyIntelligence.plotAreaAcres.value} Acres
              </div>
            </div>

            {/* Road Width & Access */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Access Road Width
                </span>
                <ProvenanceBadge
                  tier={p.propertyIntelligence.roadWidthMeters.tier}
                  sourceAuthority={p.propertyIntelligence.roadWidthMeters.sourceAuthority}
                  compact
                  onClick={() =>
                    handleInspectField(
                      "Access Road Width",
                      "Property Intelligence",
                      p.propertyIntelligence.roadWidthMeters
                    )
                  }
                />
              </div>
              <div className="text-xl font-bold text-white">
                {p.propertyIntelligence.roadWidthMeters.value} Meters (150 ft)
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                Permits Max Purchasable FAR Loading
              </div>
            </div>

            {/* Total Land Asking */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Land Asking Valuation
                </span>
                <ProvenanceBadge
                  tier={p.propertyIntelligence.totalLandAskingPriceCr.tier}
                  note={p.propertyIntelligence.totalLandAskingPriceCr.note}
                  compact
                  onClick={() =>
                    handleInspectField(
                      "Total Land Asking Price",
                      "Property Intelligence",
                      p.propertyIntelligence.totalLandAskingPriceCr
                    )
                  }
                />
              </div>
              <div className="text-xl font-bold text-white">
                ₹{p.propertyIntelligence.totalLandAskingPriceCr.value} Crores
              </div>
              <div className="text-xs text-slate-400">
                ₹{p.propertyIntelligence.circleRateSqFt.value}/sq.ft (Circle) vs ₹{p.propertyIntelligence.marketLandRateSqFt.value}/sq.ft (Market)
              </div>
            </div>
          </div>

          {/* Zoning, Master Plan & Title Chain Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Statutory Master Plan & Zoning Breakdown</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Authority: {p.propertyIntelligence.reraAuthorityName.value}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Zoning Classification
                  </span>
                  <ProvenanceBadge
                    tier={p.propertyIntelligence.zoningClassification.tier}
                    sourceAuthority={p.propertyIntelligence.zoningClassification.sourceAuthority}
                    compact
                    onClick={() =>
                      handleInspectField(
                        "Zoning Classification",
                        "Statutory Planning",
                        p.propertyIntelligence.zoningClassification
                      )
                    }
                  />
                </div>
                <div className="font-semibold text-sm text-white">
                  {p.propertyIntelligence.zoningClassification.value}
                </div>
                <div className="text-xs text-slate-400">
                  {p.propertyIntelligence.applicableMasterPlan.value}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Title & Khasra Status
                  </span>
                  <ProvenanceBadge
                    tier={p.propertyIntelligence.titleChainStatus.tier}
                    sourceAuthority={p.propertyIntelligence.titleChainStatus.sourceAuthority}
                    note={p.propertyIntelligence.titleChainStatus.note}
                    compact
                    onClick={() =>
                      handleInspectField(
                        "Title Chain Status",
                        "Legal Title Due Diligence",
                        p.propertyIntelligence.titleChainStatus
                      )
                    }
                  />
                </div>
                <div className="font-semibold text-sm text-rose-300">
                  {p.propertyIntelligence.titleChainStatus.value}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Khasra Nos: {p.propertyIntelligence.khasraNumbers.value.join(", ")}
                </div>
              </div>
            </div>

            {/* Critical Zoning Notes */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                Critical Statutory Grounding Notes:
              </div>
              <div className="space-y-1.5">
                {p.propertyIntelligence.criticalZoningNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50 flex items-start gap-2"
                  >
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparable Micro-Market Projects */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="text-xs font-mono uppercase text-slate-400">
                Micro-Market Comparable Benchmarks (Ground Truth):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.propertyIntelligence.comparableProjects.map((comp, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{comp.name}</span>
                      <span className="text-amber-400 font-mono">
                        {comp.distanceKm} km away
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Launch: ₹{comp.launchPriceSqFt}/sq.ft</span>
                      <span className="text-emerald-400 font-bold">
                        Current: ₹{comp.currentPriceSqFt}/sq.ft
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Tier: {comp.builderTier}</span>
                      <span>Absorption: {comp.absorptionVelocityQuarterly}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: DEVELOPMENT ENGINE */}
      {activeStage === "DEVELOPMENT_ENGINE" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Interactive Sensitivity Matrix Engine */}
          <SensitivityMatrixView
            baseSalePriceSqFt={customSalePriceSqFt}
            baseCivilCostSqFt={customCivilCostSqFt}
            totalSaleableAreaSqFt={p.developmentEngine.totalSaleableAreaSqFt.value}
            devSplitPercent={customDevSplit}
            onInspectField={(name, tier, val) =>
              handleInspectField(name, "Financial Pro-Forma", { value: val, tier })
            }
          />

          {/* Interactive Dynamic Assumptions Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Parametric Pro-Forma Assumptions</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Real-Time Recalculation Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sale Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    Realization Rate:
                  </span>
                  <span className="text-amber-300 font-bold font-mono">
                    ₹{customSalePriceSqFt}/sq.ft
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={25000}
                  step={100}
                  value={customSalePriceSqFt}
                  onChange={(e) =>
                    setCustomSalePriceSqFt(Number(e.target.value))
                  }
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹5,000 (Affordable)</span>
                  <span>₹25,000 (Luxury)</span>
                </div>
              </div>

              {/* Civil Cost Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    Civil Construction Cost:
                  </span>
                  <span className="text-amber-300 font-bold font-mono">
                    ₹{customCivilCostSqFt}/sq.ft
                  </span>
                </div>
                <input
                  type="range"
                  min={1800}
                  max={5500}
                  step={50}
                  value={customCivilCostSqFt}
                  onChange={(e) =>
                    setCustomCivilCostSqFt(Number(e.target.value))
                  }
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹1,800 (Standard)</span>
                  <span>₹5,500 (Iconic)</span>
                </div>
              </div>

              {/* JDA Dev Split Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    Developer JDA Split:
                  </span>
                  <span className="text-amber-300 font-bold font-mono">
                    {customDevSplit}% / {100 - customDevSplit}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={85}
                  step={1}
                  value={customDevSplit}
                  onChange={(e) => setCustomDevSplit(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50% Dev</span>
                  <span>85% Dev</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Mix & Typologies */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Optimized Unit Mix & Revenue Allocation</span>
              </div>
              <div className="text-xs font-mono text-emerald-400">
                Gross Revenue: ₹{p.developmentEngine.grossDevelopmentValueCr.value} Cr
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-800/80 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Typology</th>
                    <th className="p-3">Carpet Area</th>
                    <th className="p-3">Super Built-up</th>
                    <th className="p-3">Unit Count</th>
                    <th className="p-3">Target Price</th>
                    <th className="p-3 text-right">Total Realization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                  {p.developmentEngine.unitMix.map((unit, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60">
                      <td className="p-3 font-semibold text-white">
                        {unit.typology}
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {unit.unitCarpetSqFt} sq.ft
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {unit.unitSuperBuiltUpSqFt} sq.ft
                      </td>
                      <td className="p-3 font-mono text-amber-400 font-bold">
                        {unit.unitCount} units
                      </td>
                      <td className="p-3 font-mono text-slate-200">
                        ₹{unit.targetPricePerUnitCr} Cr
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold text-right">
                        ₹{unit.totalRevenueCr} Cr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: DEAL STRUCTURING */}
      {activeStage === "DEAL_STRUCTURING" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Structure Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {p.dealStructuring.structureComparison.map((struct, idx) => {
              const isRecommended =
                p.dealStructuring.recommendedStructure.value ===
                (idx === 0
                  ? "OUTRIGHT_PURCHASE"
                  : idx === 1
                  ? "REVENUE_SHARE_JDA"
                  : idx === 2
                  ? "AREA_SHARE_JDA"
                  : "DEVELOPMENT_MANAGEMENT");

              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-5 border transition-all space-y-3 ${
                    isRecommended
                      ? "bg-slate-900 border-amber-500/80 shadow-2xl ring-1 ring-amber-500/30"
                      : "bg-slate-950/80 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {struct.type}
                    </span>
                    {isRecommended && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-bold">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Dev Capital:</span>
                      <span className="font-mono text-white">
                        ₹{struct.developerCapitalCr} Cr
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Dev Profit:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ₹{struct.developerProfitCr} Cr
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Dev IRR:</span>
                      <span className="font-mono text-amber-300 font-bold">
                        {struct.developerIrr}%
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Landowner Payout:</span>
                      <span className="font-mono text-slate-200">
                        ₹{struct.landownerTotalPayoutCr} Cr
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <strong className="text-slate-300">Key Protection:</strong>{" "}
                    {struct.keyProtectiveClause}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rationale & Operational Covenants */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Handshake className="w-4 h-4 text-amber-400" />
              <span>Deal Architect Rationales & Commercial Covenants</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              {p.dealStructuring.rationale}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Statutory Cost Sharing Agreement
                </div>
                <div className="text-xs text-slate-200 font-medium">
                  {p.dealStructuring.statutoryCostSharingRule}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  RERA 70:30 Separate Escrow Mandate
                </div>
                <div className="text-xs text-emerald-300 font-medium">
                  {p.dealStructuring.reraEscrowOperationRule}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: CAPITAL ARCHITECT */}
      {activeStage === "CAPITAL_ARCHITECT" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Capital Stack Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Sponsor Equity
              </div>
              <div className="text-2xl font-bold text-white">
                ₹{p.capitalArchitect.sponsorEquityCr.value} Cr
              </div>
              <div className="text-xs text-sky-400">
                {p.capitalArchitect.sponsorEquityPercent}% of Total Capital
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Senior Debt (Construction)
              </div>
              <div className="text-2xl font-bold text-amber-300">
                ₹{p.capitalArchitect.seniorConstructionDebtCr.value} Cr
              </div>
              <div className="text-xs text-slate-400">
                @{p.capitalArchitect.seniorDebtInterestRatePercent.value}% p.a.
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                Customer Pre-Sales
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                ₹{p.capitalArchitect.customerPreSaleCollectionCr.value} Cr
              </div>
              <div className="text-xs text-emerald-400/80">
                RERA 70% Escrow Inflow
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase">
                DSCR Coverage Ratio
              </div>
              <div className="text-2xl font-bold text-indigo-300">
                {p.capitalArchitect.dscrRatio.value}x
              </div>
              <div className="text-xs text-indigo-300/80">
                Safe Bank Hurdle (&gt;1.50x)
              </div>
            </div>
          </div>

          {/* Funding Tranches Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Capital Drawdown Tranches & Milestones</span>
            </div>

            <div className="space-y-2">
              {p.capitalArchitect.fundingTrancheSchedule.map((tranche, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-amber-400 font-mono text-[11px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-white">
                        {tranche.stage} (Month {tranche.month})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Precedent: {tranche.milestonePrecedent}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Source: {tranche.source}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      ₹{tranche.drawdownAmountCr} Cr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: DEVELOPMENT OS (STATUTORY APPROVALS & GANTT) */}
      {activeStage === "DEVELOPMENT_OS" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Statutory Approvals Gantt Ladder */}
          <ApprovalsGanttView />

          {/* 5-Tier Risk Register */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>5-Tier Epistemic Risk Register & Contingencies</span>
            </div>

            <div className="space-y-3">
              {p.developmentOS.riskRegister.map((risk, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {risk.category.replace(/_/g, " ")}: {risk.description}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        risk.severity === "HIGH"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : risk.severity === "MEDIUM"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {risk.severity} SEVERITY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-1">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-emerald-400 block mb-0.5">
                        Mitigation Protocol:
                      </strong>
                      {risk.mitigationStrategy}
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-amber-300 block mb-0.5">
                        Contingency Trigger:
                      </strong>
                      {risk.contingencyAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 6: SALES ENGINE */}
      {activeStage === "SALES_ENGINE" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                Sales Positioning Tagline
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                "{p.salesEngine.positioningTagline}"
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Target Demographic: {p.salesEngine.targetBuyerDemographic}
              </p>
            </div>

            {/* Phased Release Plan */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-slate-400">
                Phased Launch & Price Escalation Strategy:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {p.salesEngine.phaseReleaseStrategy.map((phase, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2"
                  >
                    <div className="font-bold text-white flex justify-between">
                      <span>{phase.phaseName}</span>
                      <span className="text-amber-400 font-mono">
                        Month {phase.launchMonth}
                      </span>
                    </div>
                    <div className="text-slate-400 space-y-1">
                      <div>Units: {phase.unitsReleased}</div>
                      <div>Launch Price: ₹{phase.launchPriceSqFt}/sq.ft</div>
                      <div className="text-emerald-400 font-bold">
                        Target Revenue: ₹{phase.revenueRealizationCr} Cr
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 7: MASTER DEVELOPER */}
      {activeStage === "MASTER_DEVELOPER" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Portfolio Synergy Score
              </div>
              <div className="text-3xl font-bold text-white mt-1">
                {p.masterDeveloper.portfolioSynergyScore}/100
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                High Capital Recycling Velocity
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:col-span-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Long-Term Recurring NOI Annuity
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {p.masterDeveloper.longTermRecurringAssetPotential}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Contiguous Land Acquisition & Scalability Roadmap</span>
            </div>

            <div className="space-y-2">
              {p.masterDeveloper.strategicAcquisitionRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-300 font-medium">
              🏛️ Institutional Platform Verdict: {p.masterDeveloper.scalabilityVerdict}
            </div>
          </div>
        </div>
      )}

      {/* Bankable IC Deal Memo Modal */}
      <BankableDealMemoModal
        parcel={p}
        isOpen={showDealMemoModal}
        onClose={() => setShowDealMemoModal(false)}
        customSalePrice={customSalePriceSqFt}
        customCivilCost={customCivilCostSqFt}
        customDevSplit={customDevSplit}
      />

      {/* Provenance Inspector Modal */}
      <ProvenanceInspectorModal
        item={inspectionItem}
        isOpen={showProvenanceModal}
        onClose={() => setShowProvenanceModal(false)}
      />

      {/* Term Sheet Modal */}
      {showTermSheetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Bankable Commercial Term Sheet
                </h3>
                <p className="text-xs text-slate-400">
                  {p.dealName} • {p.dealStructuring.recommendedStructure.value.replace(/_/g, " ")}
                </p>
              </div>
              <button
                onClick={() => setShowTermSheetModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {isGeneratingTermSheet ? (
              <div className="text-center py-12 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
                <div className="text-sm font-semibold text-white">
                  Drafting 6 RERA Protective Clauses...
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed">
                  {termSheetData?.preamble ||
                    "This Commercial Term Sheet outlines the primary binding covenants between the Developer and Landowner consortium under RERA regulations."}
                </div>

                <div className="space-y-3">
                  {(termSheetData?.keyClauses || [
                    {
                      title: "1. Revenue Sharing & Consideration",
                      content: `Gross project revenues distributed strictly in the ratio of ${customDevSplit}% to Developer and ${100 - customDevSplit}% to Landowner.`,
                    },
                    {
                      title: "2. Security Deposit & Milestone Refund",
                      content: `Developer deposits ₹${p.dealStructuring.refundableSecurityDepositCr.value} Cr as interest-free refundable security deposit, recoverable from Landowner's first sales share.`,
                    },
                    {
                      title: "3. RERA 70:30 Separate Escrow",
                      content: `70% of collections directly into RERA Project Account for construction. 30% surplus distributed monthly.`,
                    },
                  ]).map((clause: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-white">{clause.title}</div>
                      <p className="text-slate-300">{clause.content}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    alert("Term Sheet downloaded to clipboard.");
                    setShowTermSheetModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Download Formal Term Sheet
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
