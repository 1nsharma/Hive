import React from "react";
import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MessageSquare,
  Truck,
  LayoutDashboard,
  Split,
  Sparkles,
  Search,
  Receipt,
  Lock,
  Shield,
} from "lucide-react";

interface NavbarProps {
  activeView: "dashboard" | "whatsapp" | "job-flow" | "blueprint" | "purchase-orders" | "audit-queue" | "discovery" | "shelf-scanner" | "evidence" | "vehicles" | "learning" | "data-trust";
  setActiveView: (view: any) => void;
  splitMode: boolean;
  setSplitMode: (split: boolean) => void;
  pendingAuditsCount: number;
  missingBillsCount: number;
  emergencyCount: number;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  splitMode,
  setSplitMode,
  pendingAuditsCount,
  missingBillsCount,
  emergencyCount,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Top Banner / Status Line */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300">Truck Wala 24×7</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-medium">WhatsApp-First Ingestion Active</span>
          <span className="hidden sm:inline text-slate-500">• Month 1 Data Discovery & Reality Audit</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="nav-quick-blueprint"
            onClick={() => {
              setSplitMode(false);
              setActiveView("blueprint");
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/70 text-amber-300 hover:bg-amber-900/80 transition-colors shadow-sm"
            title="Master Blueprint: Handwritten Bill AI + DB Schema (8 Modules) + Roadmap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">📋 Master Blueprint</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          <button
            id="nav-quick-job-flow"
            onClick={() => {
              setSplitMode(false);
              setActiveView("job-flow");
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/80 transition-colors"
            title="Truck Wala Private Operations Engine (Estimate → Work → Final)"
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">🚛 Operations Engine</span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
          </button>

          <button
            id="nav-quick-data-privacy"
            onClick={() => {
              setSplitMode(false);
              setActiveView("data-trust");
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/80 transition-colors"
            title="Truck Wala Data Privacy Core (Zero Leakage Enforced)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">🔒 Data Trust Core</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </button>

          <button
            id="nav-quick-pending-audits"
            onClick={() => {
              setSplitMode(false);
              setActiveView("audit-queue");
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/60 text-amber-300 hover:bg-amber-900/70 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{pendingAuditsCount} Pending Audits</span>
          </button>

          <button
            id="nav-quick-missing-bills"
            onClick={() => {
              setSplitMode(false);
              setActiveView("discovery");
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/60 text-rose-300 hover:bg-rose-900/70 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>{missingBillsCount} Missing Bills</span>
          </button>

          {emergencyCount > 0 && (
            <button
              id="nav-quick-emergencies"
              onClick={() => {
                setSplitMode(false);
                setActiveView("vehicles");
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-semibold animate-pulse hover:bg-red-500 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{emergencyCount} 24x7 Breakdown</span>
            </button>
          )}

          <div className="text-slate-400 border-l border-slate-800 pl-3">
            <span className="text-slate-200 font-medium">Rajesh Sharma</span>
            <span className="text-slate-500 text-[11px] ml-1">(Owner)</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveView("dashboard")}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  TRUCK WALA <span className="text-amber-400">24×7</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Data Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Data Capture • Evidence Audit • Owner Admin
              </p>
            </div>
          </div>

          {/* Split Mode Toggle Button for Mobile */}
          <button
            id="toggle-split-mode-btn"
            onClick={() => setSplitMode(!splitMode)}
            className={`md:hidden px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              splitMode
                ? "bg-amber-500 text-slate-950 border-amber-400"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{splitMode ? "Single View" : "Split View"}</span>
          </button>
        </div>

        {/* Global Search & Split Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bills, parts, vehicle NL01, RJ14..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
            />
          </div>

          {/* Split View Toggle */}
          <button
            id="btn-split-toggle"
            onClick={() => setSplitMode(!splitMode)}
            className={`hidden md:flex px-3 py-1.5 rounded-lg border text-xs font-medium items-center gap-2 transition-all ${
              splitMode
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold"
                : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
            title="View WhatsApp Feed & Admin Portal side by side"
          >
            <Split className="w-3.5 h-3.5" />
            <span>{splitMode ? "Exit Split View" : "Split Screen (WhatsApp + Admin)"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1">
        <button
          id="nav-tab-dashboard"
          onClick={() => {
            setSplitMode(false);
            setActiveView("dashboard");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "dashboard" && !splitMode
              ? "text-amber-400 border-amber-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          id="nav-tab-whatsapp"
          onClick={() => {
            setSplitMode(false);
            setActiveView("whatsapp");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 relative ${
            activeView === "whatsapp" && !splitMode
              ? "text-emerald-400 border-emerald-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp Operations Feed</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        </button>

        <button
          id="nav-tab-blueprint"
          onClick={() => {
            setSplitMode(false);
            setActiveView("blueprint");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "blueprint" && !splitMode
              ? "text-amber-400 border-amber-400 bg-slate-800/40 font-bold"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Master Blueprint & Parchi AI</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">SQL + OCR</span>
        </button>

        <button
          id="nav-tab-job-flow"
          onClick={() => {
            setSplitMode(false);
            setActiveView("job-flow");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "job-flow" && !splitMode
              ? "text-indigo-400 border-indigo-400 bg-slate-800/40 font-bold"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-indigo-400" />
          <span>Job Flow (Estimate → Final)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">8 Stages</span>
        </button>

        <button
          id="nav-tab-purchase-orders"
          onClick={() => {
            setSplitMode(false);
            setActiveView("purchase-orders");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "purchase-orders" && !splitMode
              ? "text-amber-400 border-amber-400 bg-slate-800/40 font-bold"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-amber-400" />
          <span>PO Audit & Tracking</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">PO-001 (17 Parts)</span>
        </button>

        <button
          id="nav-tab-audit-queue"
          onClick={() => {
            setSplitMode(false);
            setActiveView("audit-queue");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "audit-queue" && !splitMode
              ? "text-amber-400 border-amber-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Audit Review Queue</span>
          {pendingAuditsCount > 0 && (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-1.5 rounded-full">
              {pendingAuditsCount}
            </span>
          )}
        </button>

        <button
          id="nav-tab-discovery"
          onClick={() => {
            setSplitMode(false);
            setActiveView("discovery");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "discovery" && !splitMode
              ? "text-sky-400 border-sky-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span>Month 1 Reality Report</span>
          <span className="text-[10px] px-1 rounded bg-sky-500/20 text-sky-300 font-mono">Day 18</span>
        </button>

        <button
          id="nav-tab-shelf-scanner"
          onClick={() => {
            setSplitMode(false);
            setActiveView("shelf-scanner");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "shelf-scanner" && !splitMode
              ? "text-indigo-400 border-indigo-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Old Inventory Photo Discovery</span>
        </button>

        <button
          id="nav-tab-evidence"
          onClick={() => {
            setSplitMode(false);
            setActiveView("evidence");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "evidence" && !splitMode
              ? "text-purple-400 border-purple-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-purple-400" />
          <span>Evidence Lineage (Audit Trail)</span>
        </button>

        <button
          id="nav-tab-vehicles"
          onClick={() => {
            setSplitMode(false);
            setActiveView("vehicles");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "vehicles" && !splitMode
              ? "text-red-400 border-red-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-red-400" />
          <span>24x7 Emergency & Vehicles</span>
        </button>

        <button
          id="nav-tab-learning"
          onClick={() => {
            setSplitMode(false);
            setActiveView("learning");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "learning" && !splitMode
              ? "text-teal-400 border-teal-400 bg-slate-800/40"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Improve Every Time (Rules)</span>
        </button>

        <button
          id="nav-tab-data-trust"
          onClick={() => {
            setSplitMode(false);
            setActiveView("data-trust");
          }}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
            activeView === "data-trust" && !splitMode
              ? "text-emerald-400 border-emerald-400 bg-slate-800/40 font-bold"
              : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>🔒 Data Privacy Core</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Zero Leakage</span>
        </button>
      </nav>
    </header>
  );
};
