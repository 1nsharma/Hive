import React from 'react';
import { BarChart3, TrendingUp, Cpu, Server, Activity, Globe, ShieldCheck } from 'lucide-react';

export const UnifiedAnalytics: React.FC = () => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Unified AI Orchestration & Analytics</h2>
              <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                Enterprise Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-400">Combine data, infrastructure, and distribution deployment into one unified operational dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Infrastructure Healthy (99.98% Uptime)</span>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Multi-Platform Reach</span>
            <Globe className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">191,000</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+28.4% month-over-month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>AI Credits Remaining</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">842,500 / 1M</div>
          <div className="text-[11px] text-slate-400">Server-Side Gemini 3.6 Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Average Adaptation Speed</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">1.2s</div>
          <div className="text-[11px] text-teal-400 font-bold">5 Channels simultaneously</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Brand Compliance</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100%</div>
          <div className="text-[11px] text-slate-400">Design Tokens Enforced</div>
        </div>
      </div>
    </div>
  );
};
