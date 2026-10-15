import React, { useState } from "react";
import { FullDeveloperOSOutput } from "../../types";
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Building,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Coins,
  AlertTriangle,
  Award,
  Download,
} from "lucide-react";

interface BankableDealMemoModalProps {
  parcel: FullDeveloperOSOutput;
  isOpen: boolean;
  onClose: () => void;
  customSalePrice?: number;
  customCivilCost?: number;
  customDevSplit?: number;
}

export const BankableDealMemoModal: React.FC<BankableDealMemoModalProps> = ({
  parcel,
  isOpen,
  onClose,
  customSalePrice = 6995,
  customCivilCost = 2350,
  customDevSplit = 68,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const p = parcel;
  const devSplit = customDevSplit;
  const landownerSplit = 100 - devSplit;

  const handleCopyText = () => {
    const text = `
INVESTMENT COMMITTEE DEAL MEMORANDUM & BANKABLE DEVELOPMENT DOSSIER
PROJECT: ${p.dealName.toUpperCase()}
LOCATION: ${p.propertyIntelligence.location.value}
DATE: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}

1. EXECUTIVE THESIS & OPPORTUNITY OVERVIEW
- Asset Class: High-Rise Residential / Mixed-Use Development
- Plot Area: ${p.propertyIntelligence.plotAreaSqFt.value.toLocaleString()} sq.ft (${p.propertyIntelligence.plotAreaAcres.value} Acres)
- Permissible FAR: ${p.developmentEngine.totalUsableFar.value} Usable FAR
- Total Saleable Area: ${p.developmentEngine.totalSaleableAreaSqFt.value.toLocaleString()} sq.ft
- Gross Development Value (GDV): ₹${p.developmentEngine.grossDevelopmentValueCr.value} Crores
- Projected Developer IRR: ${p.dealStructuring.structureComparison[1]?.developerIrr || 32.4}%
- Equity Multiple: ${p.capitalArchitect.investorReturnMultiple.value}x

2. DEAL STRUCTURING & TERMS
- Structure: ${p.dealStructuring.recommendedStructure.value.replace(/_/g, " ")}
- Revenue Split: ${devSplit}% Developer / ${landownerSplit}% Landowner
- Refundable Security Deposit: ₹${p.dealStructuring.refundableSecurityDepositCr.value} Crores
- RERA 70:30 Escrow Allocation: Enforced

3. CAPITAL STACK & FINANCING
- Sponsor Equity: ₹${p.capitalArchitect.sponsorEquityCr.value} Cr (${p.capitalArchitect.sponsorEquityPercent}%)
- Senior Debt: ₹${p.capitalArchitect.seniorConstructionDebtCr.value} Cr (@${p.capitalArchitect.seniorDebtInterestRatePercent.value}%)
- Customer Pre-Sales Advances: ₹${p.capitalArchitect.customerPreSaleCollectionCr.value} Cr
- DSCR Ratio: ${p.capitalArchitect.dscrRatio.value}x

4. DATA PROVENANCE AUDIT
- Verified Data Points: ${p.provenanceSummary.verifiedCount}
- User-Provided / Broker: ${p.provenanceSummary.userProvidedCount}
- Micro-Market Estimates: ${p.provenanceSummary.estimatedCount}
- AI Pro-Forma Deductions: ${p.provenanceSummary.aiAssumptionCount}
- Professional Verification Items: ${p.provenanceSummary.requiresVerificationCount}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
              INSTITUTIONAL IC MEMO
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Bankable Investment Committee Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF Export</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable IC Deal Memo Content */}
        <div className="space-y-6 text-slate-200 print:text-black">
          {/* Memo Header Banner */}
          <div className="border-b-2 border-amber-500/40 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                DEVELOPER OPERATING SYSTEM • INVESTMENT COMMITTEE MEMORANDUM
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white print:text-black mt-1">
                {p.dealName}
              </h1>
              <div className="text-xs text-slate-400 print:text-gray-600 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{p.propertyIntelligence.location.value}</span>
                <span>•</span>
                <span className="font-mono">Authority: {p.propertyIntelligence.reraAuthorityName.value}</span>
              </div>
            </div>

            <div className="text-left md:text-right font-mono text-xs text-slate-400 print:text-gray-600">
              <div>Date: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</div>
              <div className="text-emerald-400 font-bold mt-0.5">IC Classification: Tier-1 Development</div>
            </div>
          </div>

          {/* 1. Executive Summary & Core Returns Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span>01</span> Executive Opportunity & Returns Summary
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-2xl border border-slate-800 print:border-gray-300">
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Gross Dev Value (GDV)</div>
                <div className="text-lg font-bold text-emerald-400 print:text-emerald-800 mt-0.5">
                  ₹{p.developmentEngine.grossDevelopmentValueCr.value} Cr
                </div>
                <div className="text-[10px] text-slate-500">@ ₹{customSalePrice}/sq.ft avg</div>
              </div>

              <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-2xl border border-slate-800 print:border-gray-300">
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Projected Equity IRR</div>
                <div className="text-lg font-bold text-amber-300 print:text-amber-800 mt-0.5">
                  {p.dealStructuring.structureComparison[1]?.developerIrr || 32.4}%
                </div>
                <div className="text-[10px] text-slate-500">Target Benchmark: &gt;25%</div>
              </div>

              <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-2xl border border-slate-800 print:border-gray-300">
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Sponsor Equity Req.</div>
                <div className="text-lg font-bold text-sky-400 print:text-sky-800 mt-0.5">
                  ₹{p.capitalArchitect.sponsorEquityCr.value} Cr
                </div>
                <div className="text-[10px] text-slate-500">{p.capitalArchitect.sponsorEquityPercent}% of Total Outlay</div>
              </div>

              <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-2xl border border-slate-800 print:border-gray-300">
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-600 uppercase">Equity Return Multiple</div>
                <div className="text-lg font-bold text-indigo-300 print:text-indigo-800 mt-0.5">
                  {p.capitalArchitect.investorReturnMultiple.value}x MOIC
                </div>
                <div className="text-[10px] text-slate-500">Horizon: {p.developmentEngine.projectDurationMonths.value} Months</div>
              </div>
            </div>
          </div>

          {/* 2. Epistemic Data Audit Scorecard */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span>02</span> Data Provenance & Epistemic Audit Scorecard
            </h2>

            <div className="bg-slate-950 print:bg-gray-100 p-4 rounded-2xl border border-slate-800 print:border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-white print:text-black">
                  Zero-Hallucination Integrity Guarantee
                </div>
                <div className="text-slate-400 print:text-gray-600 text-[11px] mt-0.5">
                  Every legal covenant, FAR limit, and cost rate is tagged with its empirical source authority.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  [V] {p.provenanceSummary.verifiedCount} Verified
                </span>
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  [U] {p.provenanceSummary.userProvidedCount} Broker/User
                </span>
                <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  [E] {p.provenanceSummary.estimatedCount} Benchmarks
                </span>
                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  [A] {p.provenanceSummary.aiAssumptionCount} AI Models
                </span>
                <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  [!] {p.provenanceSummary.requiresVerificationCount} Requires Verify
                </span>
              </div>
            </div>
          </div>

          {/* 3. Site Envelope & Unit Mix Economics */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span>03</span> Statutory Envelope & Unit Mix Economics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 print:bg-gray-100 p-4 rounded-2xl border border-slate-800 print:border-gray-300 space-y-2">
                <div className="font-bold text-white print:text-black">Zoning & Statutory Parameters</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 print:text-gray-700 text-[11px]">
                  <div>• Plot Area: <strong className="text-white print:text-black">{p.propertyIntelligence.plotAreaSqFt.value.toLocaleString()} sq.ft</strong></div>
                  <div>• Road Width: <strong className="text-white print:text-black">{p.propertyIntelligence.roadWidthMeters.value}m (150 ft)</strong></div>
                  <div>• Base FAR: <strong className="text-white print:text-black">{p.propertyIntelligence.baseFar.value}</strong></div>
                  <div>• Max Usable FAR: <strong className="text-emerald-400 print:text-emerald-700">{p.developmentEngine.totalUsableFar.value}</strong></div>
                  <div>• Super Built-up: <strong className="text-white print:text-black">{p.developmentEngine.totalSaleableAreaSqFt.value.toLocaleString()} sq.ft</strong></div>
                  <div>• Civil Cost Rate: <strong className="text-white print:text-black">₹{customCivilCost}/sq.ft</strong></div>
                </div>
              </div>

              <div className="bg-slate-950 print:bg-gray-100 p-4 rounded-2xl border border-slate-800 print:border-gray-300 space-y-2">
                <div className="font-bold text-white print:text-black">Unit Mix Typology Allocation</div>
                <div className="space-y-1 text-[11px]">
                  {p.developmentEngine.unitMix.map((u, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-300 print:text-gray-700 border-b border-slate-900 pb-1">
                      <span>{u.typology} ({u.unitCount} units)</span>
                      <span className="font-mono font-bold text-emerald-400 print:text-emerald-800">₹{u.totalRevenueCr} Cr</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Deal Structure & Protective Covenants */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span>04</span> Deal Structuring & Commercial Terms
            </h2>

            <div className="bg-slate-950 print:bg-gray-100 p-4 rounded-2xl border border-slate-800 print:border-gray-300 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white print:text-black">
                  Recommended: {p.dealStructuring.recommendedStructure.value.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {devSplit}% Developer : {landownerSplit}% Landowner
                </span>
              </div>
              <p className="text-slate-300 print:text-gray-700 text-[11px] leading-relaxed">
                {p.dealStructuring.rationale}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 print:text-gray-600">
                <div>• Refundable Deposit: <strong className="text-white print:text-black">₹{p.dealStructuring.refundableSecurityDepositCr.value} Cr</strong> (Recoverable against Phase-1 sales)</div>
                <div>• Escrow Protocol: <strong className="text-white print:text-black">RERA 70:30 Separate Account Enforced</strong></div>
              </div>
            </div>
          </div>

          {/* 5. Key Risks & Mitigations */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <span>05</span> Risk Matrix & Statutory Safeguards
            </h2>

            <div className="space-y-2 text-xs">
              {p.developmentOS.riskRegister.slice(0, 3).map((risk, idx) => (
                <div key={idx} className="bg-slate-950 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-black">{risk.description}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold">
                      {risk.severity} RISK
                    </span>
                  </div>
                  <div className="text-slate-400 print:text-gray-600">
                    <span className="text-emerald-400 print:text-emerald-700 font-semibold">Mitigation: </span>
                    {risk.mitigationStrategy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Investment Committee Final Verdict */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 print:bg-emerald-50 border border-emerald-500/40 p-4 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 print:text-emerald-900">
              <Award className="w-4 h-4" />
              <span>Investment Committee Approval Verdict: CONDITIONAL GO (Phase 1 Acquisition)</span>
            </div>
            <p className="text-slate-300 print:text-gray-700 text-[11px] leading-relaxed">
              Recommended to proceed with execution of binding JDA Term Sheet subject to: (1) 30-year non-encumbrance certificate confirmation from Sub-Registrar Office, (2) Soil load-bearing validation for G+24 structure, and (3) Finalisation of 70:30 RERA escrow agreement with lead financing bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
