import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Calendar,
  DollarSign,
  Layers,
  ChevronRight,
} from "lucide-react";

interface ApprovalStep {
  id: string;
  stepNumber: number;
  category: "TITLE_CONVERSION" | "PLAN_SANCTION" | "ENVIRONMENTAL_NOC" | "RERA_REGISTRATION";
  name: string;
  authority: string;
  typicalDurationDays: number;
  statutoryFeeLakhs: number;
  mandatoryPrecedent: string;
  status: "CLEARED" | "IN_PROGRESS" | "HIGH_RISK" | "NOT_STARTED";
  statutoryRegulation: string;
}

const STATUTORY_APPROVALS_MASTER: ApprovalStep[] = [
  // Phase 1
  {
    id: "sec-143",
    stepNumber: 1,
    category: "TITLE_CONVERSION",
    name: "Section 143 / Non-Agricultural Land Conversion",
    authority: "Sub-Divisional Magistrate (SDM) / Tehsil",
    typicalDurationDays: 45,
    statutoryFeeLakhs: 4.5,
    mandatoryPrecedent: "Clear 1359 Fasli Ancestral Title",
    status: "CLEARED",
    statutoryRegulation: "UP Revenue Code 2006, Section 143",
  },
  {
    id: "mutation-order",
    stepNumber: 2,
    category: "TITLE_CONVERSION",
    name: "Revenue Khasra Mutation & DGPS Demarcation",
    authority: "Tehsildar & Revenue Kanungo Survey",
    typicalDurationDays: 30,
    statutoryFeeLakhs: 1.2,
    mandatoryPrecedent: "Registered Title Deed / JDA",
    status: "CLEARED",
    statutoryRegulation: "Land Revenue Act Section 34",
  },
  {
    id: "form-15-nec",
    stepNumber: 3,
    category: "TITLE_CONVERSION",
    name: "30-Year Non-Encumbrance Certificate (NEC)",
    authority: "Sub-Registrar Office IV",
    typicalDurationDays: 15,
    statutoryFeeLakhs: 0.8,
    mandatoryPrecedent: "Tehsil Index Search",
    status: "IN_PROGRESS",
    statutoryRegulation: "Registration Act 1908, Rule 15",
  },

  // Phase 2
  {
    id: "lda-zonal-sanction",
    stepNumber: 4,
    category: "PLAN_SANCTION",
    name: "Zonal Plan Sanction & Max FAR Approval",
    authority: "Development Authority (LDA / DTCP)",
    typicalDurationDays: 90,
    statutoryFeeLakhs: 65.0,
    mandatoryPrecedent: "Sec 143 Order + Betterment Charges",
    status: "IN_PROGRESS",
    statutoryRegulation: "Urban Planning & Development Act 1973",
  },
  {
    id: "aai-noc",
    stepNumber: 5,
    category: "PLAN_SANCTION",
    name: "AAI Airport Height Clearance NOC",
    authority: "Airport Authority of India (NOCAS)",
    typicalDurationDays: 45,
    statutoryFeeLakhs: 0.5,
    mandatoryPrecedent: "Building Coordinates & Top Elevation",
    status: "CLEARED",
    statutoryRegulation: "Ministry of Civil Aviation GSR 751(E)",
  },
  {
    id: "fire-noc",
    stepNumber: 6,
    category: "PLAN_SANCTION",
    name: "Provisional Fire Fighting & Evacuation NOC",
    authority: "State Fire & Emergency Services",
    typicalDurationDays: 40,
    statutoryFeeLakhs: 3.5,
    mandatoryPrecedent: "Hydraulic Calculation & Access Road Width",
    status: "IN_PROGRESS",
    statutoryRegulation: "National Building Code (NBC) 2016 Part 4",
  },

  // Phase 3
  {
    id: "seiaa-env",
    stepNumber: 7,
    category: "ENVIRONMENTAL_NOC",
    name: "SEIAA Environmental Clearance (Category B2)",
    authority: "State Environment Impact Assessment Authority",
    typicalDurationDays: 120,
    statutoryFeeLakhs: 15.0,
    mandatoryPrecedent: "Baseline EIA, STP & RWH Calculations",
    status: "HIGH_RISK",
    statutoryRegulation: "MoEFCC Notification 2006 (BUA > 20,000 sq.m)",
  },
  {
    id: "cgwa-water",
    stepNumber: 8,
    category: "ENVIRONMENTAL_NOC",
    name: "CGWA Ground Water & Municipal Water NOC",
    authority: "Central Ground Water Authority / Jal Sansthan",
    typicalDurationDays: 60,
    statutoryFeeLakhs: 2.0,
    mandatoryPrecedent: "Recharge Well Master Layout",
    status: "NOT_STARTED",
    statutoryRegulation: "CGWA Guidelines 2020",
  },
  {
    id: "pcb-cte",
    stepNumber: 9,
    category: "ENVIRONMENTAL_NOC",
    name: "Consent to Establish (CTE) Air & Water",
    authority: "State Pollution Control Board (UPPCB)",
    typicalDurationDays: 45,
    statutoryFeeLakhs: 4.0,
    mandatoryPrecedent: "SEIAA Environmental Clearance",
    status: "NOT_STARTED",
    statutoryRegulation: "Water Act 1974 & Air Act 1981",
  },

  // Phase 4
  {
    id: "advocate-title-cert",
    stepNumber: 10,
    category: "RERA_REGISTRATION",
    name: "Empanelled Advocate 30-Yr Legal Title Report",
    authority: "High Court Empanelled Legal Counsel",
    typicalDurationDays: 15,
    statutoryFeeLakhs: 2.5,
    mandatoryPrecedent: "Search of Revenue, Sub-Registrar & Court Records",
    status: "IN_PROGRESS",
    statutoryRegulation: "RERA Section 4(2)(l) Title Guarantee",
  },
  {
    id: "rera-escrow-account",
    stepNumber: 11,
    category: "RERA_REGISTRATION",
    name: "RERA 70:30 Separate Escrow Bank Account",
    authority: "Scheduled Commercial Bank (SBI / HDFC / ICICI)",
    typicalDurationDays: 10,
    statutoryFeeLakhs: 0.2,
    mandatoryPrecedent: "CA/Architect Estimation Certificate Form 1-3",
    status: "NOT_STARTED",
    statutoryRegulation: "RERA Act 2016, Section 4(2)(l)(D)",
  },
  {
    id: "state-rera-final",
    stepNumber: 12,
    category: "RERA_REGISTRATION",
    name: "State RERA Project Registration Certificate",
    authority: "Real Estate Regulatory Authority (UP-RERA)",
    typicalDurationDays: 30,
    statutoryFeeLakhs: 8.5,
    mandatoryPrecedent: "All 11 Sanctions & Escrow Agreement Uploaded",
    status: "NOT_STARTED",
    statutoryRegulation: "RERA Act 2016 Section 5 (Mandatory Pre-Launch)",
  },
];

export const ApprovalsGanttView: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalStep[]>(STATUTORY_APPROVALS_MASTER);
  const [selectedCategory, setSelectedCategory] = useState<
    "ALL" | "TITLE_CONVERSION" | "PLAN_SANCTION" | "ENVIRONMENTAL_NOC" | "RERA_REGISTRATION"
  >("ALL");

  const totalStatutoryCost = approvals.reduce((acc, curr) => acc + curr.statutoryFeeLakhs, 0);
  const clearedCount = approvals.filter((a) => a.status === "CLEARED").length;
  const inProgressCount = approvals.filter((a) => a.status === "IN_PROGRESS").length;
  const highRiskCount = approvals.filter((a) => a.status === "HIGH_RISK").length;

  const filteredApprovals =
    selectedCategory === "ALL"
      ? approvals
      : approvals.filter((a) => a.category === selectedCategory);

  const toggleStepStatus = (id: string) => {
    setApprovals((prev) =>
      prev.map((step) => {
        if (step.id === id) {
          const nextStatus =
            step.status === "NOT_STARTED"
              ? "IN_PROGRESS"
              : step.status === "IN_PROGRESS"
              ? "CLEARED"
              : step.status === "CLEARED"
              ? "HIGH_RISK"
              : "NOT_STARTED";
          return { ...step, status: nextStatus };
        }
        return step;
      })
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
              STAGE 5 EXECUTION OS
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Indian Statutory Approvals & RERA Track
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>32-Step Statutory Clearances & Approval Gantt Ladder</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            Total Statutory Fees: <strong className="text-amber-300">₹{totalStatutoryCost.toFixed(1)} Lakhs</strong>
          </div>
        </div>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Cleared Sanctions</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{clearedCount} / 12</div>
          <div className="text-[10px] text-slate-500">Legal milestones secured</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">In-Progress Filings</div>
          <div className="text-xl font-bold text-amber-300 mt-0.5">{inProgressCount}</div>
          <div className="text-[10px] text-slate-500">Active authority scrutiny</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Critical Path / High Risk</div>
          <div className="text-xl font-bold text-rose-400 mt-0.5">{highRiskCount}</div>
          <div className="text-[10px] text-slate-500">Requires liaison focus (SEIAA)</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Critical Lead Time</div>
          <div className="text-xl font-bold text-sky-400 mt-0.5">5.5 Months</div>
          <div className="text-[10px] text-slate-500">Parallel tracked workflow</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === "ALL"
              ? "bg-amber-500 text-slate-950 font-bold"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          All 12 Checkpoints
        </button>
        <button
          onClick={() => setSelectedCategory("TITLE_CONVERSION")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === "TITLE_CONVERSION"
              ? "bg-indigo-600 text-white font-bold"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          Phase 1: Title & Conversion
        </button>
        <button
          onClick={() => setSelectedCategory("PLAN_SANCTION")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === "PLAN_SANCTION"
              ? "bg-indigo-600 text-white font-bold"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          Phase 2: Master Plan & Sanctions
        </button>
        <button
          onClick={() => setSelectedCategory("ENVIRONMENTAL_NOC")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === "ENVIRONMENTAL_NOC"
              ? "bg-indigo-600 text-white font-bold"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          Phase 3: Environmental (SEIAA)
        </button>
        <button
          onClick={() => setSelectedCategory("RERA_REGISTRATION")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedCategory === "RERA_REGISTRATION"
              ? "bg-indigo-600 text-white font-bold"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          Phase 4: RERA & Launch
        </button>
      </div>

      {/* Approvals Step List */}
      <div className="space-y-3">
        {filteredApprovals.map((step) => (
          <div
            key={step.id}
            className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                {step.stepNumber}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>{step.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-normal">
                    ({step.statutoryRegulation})
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex flex-wrap items-center gap-3">
                  <span>🏛️ {step.authority}</span>
                  <span>⏱️ ~{step.typicalDurationDays} Days</span>
                  <span>💰 Fee: ₹{step.statutoryFeeLakhs} Lakhs</span>
                </div>
                <div className="text-slate-500 text-[10px]">
                  <strong className="text-slate-400">Precedent:</strong> {step.mandatoryPrecedent}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <button
                onClick={() => toggleStepStatus(step.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                  step.status === "CLEARED"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : step.status === "IN_PROGRESS"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : step.status === "HIGH_RISK"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                    : "bg-slate-900 text-slate-500 border-slate-800"
                }`}
              >
                {step.status === "CLEARED" && "✓ CLEARED"}
                {step.status === "IN_PROGRESS" && "⏳ IN PROGRESS"}
                {step.status === "HIGH_RISK" && "⚠️ HIGH RISK"}
                {step.status === "NOT_STARTED" && "NOT STARTED"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
