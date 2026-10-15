import React, { useState } from "react";
import { ProvenanceTier, ProvenanceField } from "../../types";
import {
  ShieldCheck,
  CheckCircle2,
  User,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Upload,
  Check,
  FileText,
  X,
  Info,
} from "lucide-react";

export interface ProvenanceInspectionItem {
  fieldName: string;
  category: string;
  value: any;
  tier: ProvenanceTier;
  sourceAuthority?: string;
  note?: string;
  confidenceScore?: number;
  verificationUpgradeSteps?: string[];
}

interface ProvenanceInspectorModalProps {
  item: ProvenanceInspectionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpgradeToVerified?: (fieldName: string, refDoc: string) => void;
}

export const ProvenanceInspectorModal: React.FC<ProvenanceInspectorModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpgradeToVerified,
}) => {
  const [refDocInput, setRefDocInput] = useState("");
  const [isUpgraded, setIsUpgraded] = useState(false);

  if (!isOpen || !item) return null;

  const getTierDetails = (tier: ProvenanceTier) => {
    switch (tier) {
      case "VERIFIED_DATA":
        return {
          label: "VERIFIED DATA",
          code: "[V]",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: CheckCircle2,
          defaultConfidence: 98,
          description:
            "Sourced directly from gazetted master plans, registered land revenue deeds, or official statutory RERA records.",
        };
      case "USER_PROVIDED":
        return {
          label: "USER-PROVIDED DATA",
          code: "[U]",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: User,
          defaultConfidence: 75,
          description:
            "Entered manually or extracted from broker teasers / seller proposals. Requires independent legal & physical confirmation.",
        };
      case "ESTIMATED_DATA":
        return {
          label: "ESTIMATED DATA (BENCHMARK)",
          code: "[E]",
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: HelpCircle,
          defaultConfidence: 65,
          description:
            "Derived using regional micro-market construction cost benchmarks, CPWD indices, or historical sub-market absorption rates.",
        };
      case "AI_ASSUMPTION":
        return {
          label: "AI ASSUMPTION",
          code: "[A]",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          icon: Sparkles,
          defaultConfidence: 50,
          description:
            "Algorithmic deduction or pro-forma model assumption where empirical market data was missing or ambiguous.",
        };
      case "REQUIRES_VERIFICATION":
        return {
          label: "REQUIRES PROFESSIONAL VERIFICATION",
          code: "[!]",
          badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse",
          icon: AlertTriangle,
          defaultConfidence: 25,
          description:
            "CRITICAL LEGAL / TECHNICAL FLAG. High potential for title defect, zoning restriction, or statutory litigation. Expert sign-off mandatory.",
        };
    }
  };

  const tierInfo = getTierDetails(item.tier);
  const Icon = tierInfo.icon;
  const confidence = item.confidenceScore || tierInfo.defaultConfidence;

  // Default upgrade steps if not provided
  const upgradeSteps = item.verificationUpgradeSteps || [
    `Request certified Khatoni / 7/12 Extract from the relevant Tehsil Revenue Office.`,
    `Obtain official Zonal Master Plan excerpt and FAR sanction letter from Development Authority.`,
    `Execute 30-year non-encumbrance title search via an empanelled High Court advocate.`,
    `Conduct DGPS total-station physical boundary demarcation survey on site.`,
  ];

  const handleUpgradeSubmit = () => {
    if (!refDocInput.trim()) return;
    if (onUpgradeToVerified) {
      onUpgradeToVerified(item.fieldName, refDocInput);
    }
    setIsUpgraded(true);
    setTimeout(() => {
      setIsUpgraded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {item.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono text-amber-400">
              Epistemic Discipline Protocol
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {item.fieldName}
          </h3>
          <div className="text-sm font-mono text-emerald-400 font-bold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">
            Current Value:{" "}
            {typeof item.value === "object"
              ? JSON.stringify(item.value)
              : String(item.value)}
          </div>
        </div>

        {/* Tier Classification Card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${tierInfo.badgeColor}`}
            >
              <Icon className="w-4 h-4" />
              <span>
                {tierInfo.code} {tierInfo.label}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Confidence Level
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  confidence >= 80
                    ? "text-emerald-400"
                    : confidence >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {confidence}%
              </span>
            </div>
          </div>

          {/* Confidence Meter Bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                confidence >= 80
                  ? "bg-emerald-500"
                  : confidence >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {tierInfo.description}
          </p>
        </div>

        {/* Source Authority & Evidence Citation */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            Cited Source Authority & Grounding
          </span>
          <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-xs text-slate-200">
            <div className="font-semibold text-amber-300">
              {item.sourceAuthority || "Authority Citation Unspecified"}
            </div>
            {item.note && (
              <div className="text-slate-400 mt-1 text-[11px] leading-relaxed">
                {item.note}
              </div>
            )}
          </div>
        </div>

        {/* Protocol to Upgrade to Verified Data */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              How to Upgrade This Field to [V] VERIFIED DATA:
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2.5">
            {upgradeSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Verification Proof Attestation */}
        <div className="bg-slate-950 border border-indigo-500/30 p-4 rounded-2xl space-y-3">
          <div className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Attest Document / Certificate Reference Number
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={refDocInput}
              onChange={(e) => setRefDocInput(e.target.value)}
              placeholder="e.g. Khatoni Reg #2024/9912 or Sanction Order #LDA/BP/4412"
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none font-mono"
            />
            <button
              onClick={handleUpgradeSubmit}
              disabled={!refDocInput.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              {isUpgraded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Upgraded!</span>
                </>
              ) : (
                <span>Verify Field</span>
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Attesting a statutory document updates this field to{" "}
            <strong className="text-emerald-400">[VERIFIED DATA]</strong> and recalculates the deal's Epistemic Quality Scorecard.
          </p>
        </div>
      </div>
    </div>
  );
};
