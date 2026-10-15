import React from 'react';
import { 
  Radar, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Terminal, 
  Workflow, 
  Sparkles, 
  Zap, 
  Layers,
  Bell,
  Gamepad2,
  Film
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunFullPipeline: () => void;
  isRunningPipeline: boolean;
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRunFullPipeline,
  isRunningPipeline,
  onOpenArchitecture,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner / Studio Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Agency Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-black text-xl tracking-tighter">
              DA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>DESI ARCADE STUDIOS</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-medium">
                    v4.8 AUTONOMOUS
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <span>Self-Updating Research & LiveOps Pipeline</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  24/7 Research Daemon Active
                </span>
              </p>
            </div>
          </div>

          {/* Real-time Status Micro-Indicators & Master Trigger */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            <button
              onClick={onOpenArchitecture}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="View Architecture Pipeline Diagram"
            >
              <Workflow className="w-3.5 h-3.5 text-amber-400" />
              <span>Architecture Map</span>
            </button>

            <button
              onClick={onRunFullPipeline}
              disabled={isRunningPipeline}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isRunningPipeline
                  ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-orange-500/20 active:scale-95'
              }`}
            >
              {isRunningPipeline ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Full Auto-Loop</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-4 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Radar className="w-4 h-4 text-amber-400" />
            <span>1. Trend Radar</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">12h</span>
          </button>

          <button
            onClick={() => setActiveTab('synthesizer')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'synthesizer'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-orange-400" />
            <span>2. AI Synthesizer</span>
            <span className="px-1.5 py-0.2 rounded bg-orange-950/60 text-orange-400 text-[10px] font-mono border border-orange-500/20">Godot 4</span>
          </button>

          <button
            onClick={() => setActiveTab('liveops')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'liveops'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>3. LiveOps & Playtest</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">Active</span>
          </button>

          <button
            onClick={() => setActiveTab('cicd')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cicd'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>4. CI/CD & PRs</span>
            <span className="px-1.5 py-0.2 rounded bg-sky-950/60 text-sky-400 text-[10px] font-mono border border-sky-500/20">GUT</span>
          </button>

          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'heritage'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>5. Heritage Games</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 text-[10px] font-mono border border-amber-500/30">Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('discord')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'discord'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>6. Discord Hub</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-400 text-[10px] font-mono border border-indigo-500/30">#ai-pr-merges</span>
          </button>

          <button
            onClick={() => setActiveTab('arcade')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'arcade'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>7. HTML5 Arcade</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 text-[10px] font-mono border border-amber-500/30">7 Games</span>
          </button>

          <button
            onClick={() => setActiveTab('vox')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'vox'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Film className="w-4 h-4 text-orange-400" />
            <span>8. Vox Motion Studio</span>
            <span className="px-1.5 py-0.2 rounded bg-orange-950/60 text-orange-400 text-[10px] font-mono border border-orange-500/30">Folder 0</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>9. Agency CLI</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-400 text-[10px] font-mono border border-purple-500/20">Terminal</span>
          </button>

        </div>
      </div>
    </header>
  );
};
