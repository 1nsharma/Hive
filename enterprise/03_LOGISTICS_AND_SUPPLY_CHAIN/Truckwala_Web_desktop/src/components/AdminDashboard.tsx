import React from "react";
import {
  Truck,
  Wrench,
  Package,
  Users,
  AlertTriangle,
  FileQuestion,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  MapPin,
  ExternalLink,
  Receipt,
  Lock,
} from "lucide-react";
import { IngestionMessage, EmergencyJob } from "../types";

interface AdminDashboardProps {
  onOpenAudit: (msg: IngestionMessage) => void;
  onNavigateTab: (tab: any) => void;
  pendingMessages: IngestionMessage[];
  emergencyJobs: EmergencyJob[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenAudit,
  onNavigateTab,
  pendingMessages,
  emergencyJobs,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome & Mode Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
                Control Center
              </span>
              <span className="text-slate-400 text-xs">• Month 1 Discovery Active (Day 18/30)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Owner Operations Portal — <span className="text-amber-400">Truck Wala 24×7</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Data is automatically ingested from your WhatsApp operations channel (bills, photos, voice notes, chat).
              Review and audit behind-the-scenes extractions before items enter permanent inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-quick-blueprint-btn"
              onClick={() => onNavigateTab("blueprint")}
              className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-amber-600/70 shadow-lg shadow-amber-950/40 transition-all hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>📋 Master Blueprint & Parchi AI</span>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            </button>

            <button
              id="dash-quick-job-flow-btn"
              onClick={() => onNavigateTab("job-flow")}
              className="px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-indigo-700/60 shadow-lg shadow-indigo-950/40 transition-all hover:scale-102 active:scale-98"
            >
              <Wrench className="w-4 h-4 text-indigo-400" />
              <span>🚛 Job Flow (Estimate → Final)</span>
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            </button>

            <button
              id="dash-quick-data-trust-btn"
              onClick={() => onNavigateTab("data-trust")}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-emerald-700/60 shadow-lg shadow-emerald-950/40 transition-all hover:scale-102 active:scale-98"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>🔒 Data Privacy Core</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              id="dash-quick-po-btn"
              onClick={() => onNavigateTab("purchase-orders")}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98"
            >
              <Receipt className="w-4 h-4" />
              <span>PO-2024-001 Audit (₹50,600)</span>
            </button>

            <button
              id="dash-quick-audit-btn"
              onClick={() => onNavigateTab("audit-queue")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Review 19 Pending Audits</span>
            </button>

            <button
              id="dash-quick-shelf-btn"
              onClick={() => onNavigateTab("shelf-scanner")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Photo Shelf Discovery</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI 7-Grid Cards (Exact metrics from User Prompt: 127 vehicles, 8 jobs, 1,284 inventory, 37 dealers, 19 audits, 12 missing bills, 34 unverified) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* Vehicles */}
        <div
          onClick={() => onNavigateTab("vehicles")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Vehicles</span>
            <Truck className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
            127
          </div>
          <p className="text-[10px] text-slate-400 mt-1">4 in breakdown / service</p>
        </div>

        {/* Active Jobs */}
        <div
          onClick={() => onNavigateTab("vehicles")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Jobs</span>
            <Wrench className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
            8
          </div>
          <p className="text-[10px] text-red-400 mt-1 font-semibold">2 Highway Breakdowns</p>
        </div>

        {/* Inventory Items */}
        <div
          onClick={() => onNavigateTab("shelf-scanner")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inventory</span>
            <Package className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
            1,284
          </div>
          <p className="text-[10px] text-slate-400 mt-1">412 verified • 872 discovery</p>
        </div>

        {/* Dealers */}
        <div
          onClick={() => onNavigateTab("discovery")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dealers</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
            37
          </div>
          <p className="text-[10px] text-slate-400 mt-1">3 new identified this week</p>
        </div>

        {/* Pending Audits */}
        <div
          onClick={() => onNavigateTab("audit-queue")}
          className="bg-amber-950/40 hover:bg-amber-950/60 border border-amber-800/60 hover:border-amber-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Audits</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            19
          </div>
          <p className="text-[10px] text-amber-400/90 mt-1 font-semibold">⚠️ Needs 1-Click Verification</p>
        </div>

        {/* Missing Bills */}
        <div
          onClick={() => onNavigateTab("discovery")}
          className="bg-rose-950/40 hover:bg-rose-950/60 border border-rose-800/60 hover:border-rose-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Missing Bills</span>
            <FileQuestion className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-300">
            12
          </div>
          <p className="text-[10px] text-rose-400/90 mt-1 font-semibold">₹64,200 pending invoice</p>
        </div>

        {/* Unverified Records */}
        <div
          onClick={() => onNavigateTab("discovery")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all shadow group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unverified</span>
            <ClipboardCheck className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
            34
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Old loose stock items</p>
        </div>
      </div>

      {/* Principle #9: Weekly Owner Audit Summary Banner */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 sm:p-5 shadow">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Truck Wala Weekly Audit Report — Week 36
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              Auto-Generated for Owner
            </span>
          </div>
          <button
            onClick={() => onNavigateTab("discovery")}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Full Reality Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-3 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Purchases</span>
            <span className="font-bold text-sm text-emerald-400">₹1,12,000</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Sales</span>
            <span className="font-bold text-sm text-sky-400">₹84,500</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Inventory Changes</span>
            <span className="font-bold text-sm text-slate-200">47 parts</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">New Dealers</span>
            <span className="font-bold text-sm text-slate-200">3 vendors</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Missing Bills</span>
            <span className="font-bold text-sm text-rose-400">4 this week</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Unverified Entries</span>
            <span className="font-bold text-sm text-amber-400">8 items</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Emergency Jobs</span>
            <span className="font-bold text-sm text-red-400">11 roadside</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Major Issues</span>
            <span className="font-bold text-sm text-amber-300">6 heavy repair</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Pending Review Queue & 24x7 Emergency Highway Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Review Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Audit Review Queue (Requires Human Approval)
                </h3>
                <p className="text-xs text-slate-400">
                  AI estimates captured from WhatsApp — will not affect stock until verified.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("audit-queue")}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All 19 →
            </button>
          </div>

          <div className="space-y-3">
            {pendingMessages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    {msg.mediaType === "bill" ? "🧾" : msg.mediaType === "voice" ? "🎤" : "📸"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {msg.classification}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{msg.sender}</span>
                      <span className="text-xs text-slate-500">• {msg.timestamp}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100">
                      {msg.extracted.partName || msg.rawText}
                    </h4>

                    <p className="text-xs text-amber-300/90 mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{msg.extracted.reviewNotes}</span>
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                      {msg.extracted.quantity && <span>Qty: {msg.extracted.quantity}</span>}
                      {msg.extracted.rate && <span>Rate: ₹{msg.extracted.rate}</span>}
                      {msg.extracted.dealerName && <span>Dealer: {msg.extracted.dealerName}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onOpenAudit(msg)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Audit & Verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 24×7 Emergency Highway Radar (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white">
                24×7 Emergency Highway Radar
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("vehicles")}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              Breakdown Hub →
            </button>
          </div>

          <div className="space-y-3">
            {emergencyJobs.map((job) => (
              <div
                key={job.id}
                className="bg-red-950/20 border border-red-800/50 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-700/60">
                    {job.vehicleNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                    {job.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-slate-200">{job.vehicleModel}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span>{job.highwayLocation}</span>
                  </p>
                </div>

                <div className="bg-slate-900/80 p-2 rounded text-[11px] text-slate-300 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Problem:</span>
                  {job.problemSummary}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Assigned: <strong className="text-slate-200">{job.level2TechnicianAssigned}</strong></span>
                  <button
                    onClick={() => onNavigateTab("vehicles")}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    View 3-Tier Escalation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
