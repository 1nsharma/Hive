import React, { useState } from "react";
import { OperatingMode } from "../types";
import { LearnModeView } from "./os/LearnModeView";
import { DeveloperPipelineView } from "./os/DeveloperPipelineView";
import { MasterModeView } from "./os/MasterModeView";
import {
  GraduationCap,
  Layers,
  Crown,
  Sparkles,
  ShieldCheck,
  Building,
  ArrowRight,
} from "lucide-react";

export const DeveloperOSView: React.FC = () => {
  const [operatingMode, setOperatingMode] = useState<OperatingMode>(
    "DEVELOPER_MODE"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Top OS Master Mode Selector Bar */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                  AI Developer OS
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v3.7 PROVENANCE ENGINE
                </span>
              </div>
              <div className="text-sm font-bold text-white tracking-tight">
                Real Estate Developer Operating System
              </div>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setOperatingMode("LEARN_MODE")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                operatingMode === "LEARN_MODE"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learn Mode</span>
            </button>

            <button
              onClick={() => setOperatingMode("DEVELOPER_MODE")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                operatingMode === "DEVELOPER_MODE"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Developer Mode</span>
            </button>

            <button
              onClick={() => setOperatingMode("MASTER_MODE")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                operatingMode === "MASTER_MODE"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md shadow-amber-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Master Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Canvas */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {operatingMode === "LEARN_MODE" && <LearnModeView />}
        {operatingMode === "DEVELOPER_MODE" && <DeveloperPipelineView />}
        {operatingMode === "MASTER_MODE" && <MasterModeView />}
      </div>
    </div>
  );
};
