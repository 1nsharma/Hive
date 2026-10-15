import React, { useState } from 'react';
import { 
  Bot, 
  Fingerprint, 
  Search, 
  PenTool, 
  TrendingUp, 
  Code2, 
  Briefcase, 
  ShieldAlert, 
  CalendarClock, 
  Play, 
  Pause, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Lock,
  FileCode,
  Terminal,
  Zap
} from 'lucide-react';
import { AgentWorker, OperatingMode } from '../types';

interface AgentsDashboardProps {
  workers: AgentWorker[];
  operatingMode: OperatingMode;
  onToggleWorker: (workerId: string, status: AgentWorker['status']) => void;
  onRunWorker: (workerId: string) => Promise<void>;
  onSelectAgentTab: (agentType: string) => void;
}

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'identity':
      return Fingerprint;
    case 'research':
      return Search;
    case 'content':
      return PenTool;
    case 'growth':
      return TrendingUp;
    case 'coding':
      return Code2;
    case 'business':
      return Briefcase;
    case 'security':
      return ShieldAlert;
    case 'assistant':
    default:
      return CalendarClock;
  }
};

export const AgentsDashboard: React.FC<AgentsDashboardProps> = ({
  workers,
  operatingMode,
  onToggleWorker,
  onRunWorker,
  onSelectAgentTab
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || 'worker-identity');
  const [runningWorkerId, setRunningWorkerId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const selectedWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  const handleRun = async (workerId: string) => {
    setRunningWorkerId(workerId);
    try {
      await onRunWorker(workerId);
    } finally {
      setTimeout(() => setRunningWorkerId(null), 600);
    }
  };

  const filteredWorkers = filterType === 'all' 
    ? workers 
    : workers.filter(w => w.status === filterType);

  const activeCount = workers.filter(w => w.status === 'running').length;
  const totalTasks = workers.reduce((acc, w) => acc + w.metrics.tasksCompleted, 0);
  const totalHours = workers.reduce((acc, w) => acc + w.metrics.hoursSaved, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Agent OS Architecture Overview */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Autonomous Worker Swarm
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    8 Dedicated Agents
                  </span>
                </h2>
                <p className="text-sm text-slate-400">
                  Specialized autonomous agents operating under the strict loop: <span className="text-cyan-300 font-mono">Observe → Understand → Plan → Act → Verify → Learn</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 text-xs text-slate-300">
            <div className="px-3 py-1 border-r border-slate-700">
              <span className="text-slate-400 block text-[11px]">Active Workers</span>
              <span className="text-emerald-400 font-bold text-base">{activeCount} / {workers.length}</span>
            </div>
            <div className="px-3 py-1 border-r border-slate-700">
              <span className="text-slate-400 block text-[11px]">Autonomous Tasks</span>
              <span className="text-cyan-400 font-bold text-base">{totalTasks}</span>
            </div>
            <div className="px-3 py-1">
              <span className="text-slate-400 block text-[11px]">Human Hours Saved</span>
              <span className="text-indigo-400 font-bold text-base">{totalHours}h</span>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Filter by status:</span>
            {['all', 'running', 'idle', 'paused'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterType(st)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  filterType === st
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span>Enforced Mode:</span>
            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
              operatingMode === 'LOCKDOWN' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              operatingMode === 'AUTONOMOUS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
              operatingMode === 'COPILOT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {operatingMode}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Agent Cards + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workers List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredWorkers.map((worker) => {
            const IconComponent = getAgentIcon(worker.type);
            const isSelected = selectedWorker?.id === worker.id;
            const isRunning = runningWorkerId === worker.id;

            return (
              <div
                key={worker.id}
                onClick={() => setSelectedWorkerId(worker.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      worker.type === 'identity' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      worker.type === 'security' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      worker.type === 'growth' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      worker.type === 'research' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{worker.name}</h3>
                        <span className="text-[11px] text-slate-400 font-normal">({worker.role})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          worker.status === 'running' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          worker.status === 'locked' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {worker.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{worker.description}</p>

                      {worker.activeWorkload && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40">
                          <Activity className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                          <span className="truncate">{worker.activeWorkload}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {worker.type === 'identity' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAgentTab('identity_agent');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-600/30 text-cyan-300 hover:bg-cyan-600/50 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
                        title="Open Dedicated Showcase Pipeline"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Showcase</span>
                      </button>
                    )}

                    <button
                      disabled={operatingMode === 'LOCKDOWN' || isRunning}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRun(worker.id);
                      }}
                      className={`p-2 rounded-lg text-xs font-medium border flex items-center justify-center transition-all ${
                        isRunning 
                          ? 'bg-cyan-500 text-slate-900 border-cyan-400 animate-pulse'
                          : 'bg-slate-800 hover:bg-cyan-950/60 text-cyan-400 border-slate-700 hover:border-cyan-500/50'
                      }`}
                      title="Dispatch Worker Now"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWorker(worker.id, worker.status === 'running' ? 'paused' : 'running');
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
                      title={worker.status === 'running' ? 'Pause Worker' : 'Resume Worker'}
                    >
                      {worker.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Worker Detailed Capability Inspector */}
        <div className="lg:col-span-5">
          {selectedWorker ? (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5 sticky top-24">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{selectedWorker.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      {selectedWorker.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedWorker.role}</p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-500 block">Accuracy</span>
                  <span className="text-emerald-400 font-bold text-sm">{selectedWorker.metrics.accuracyScore}%</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                {selectedWorker.description}
              </p>

              {/* Capability Policy Section (User requested principle: Autonomy ≠ unrestricted access) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Capability & Permission Policy
                  </span>
                  <span className="text-[11px] text-slate-400">Zero-Trust Scopes</span>
                </div>

                {/* Read Permissions */}
                <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    READ SCOPES ({selectedWorker.policy.read.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorker.policy.read.map((scope) => (
                      <span key={scope} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-700">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Create Permissions */}
                <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    CREATE ARTIFACTS ({selectedWorker.policy.create.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorker.policy.create.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-mono text-[11px] border border-indigo-800/50">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Execute Permissions */}
                <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    EXECUTE SCOPES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorker.policy.execute.map((e) => (
                      <span key={e} className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 font-mono text-[11px] border border-purple-800/50">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requires Approval */}
                <div className="bg-amber-950/30 rounded-xl p-3 border border-amber-800/50 space-y-1.5">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    REQUIRES APPROVAL ({selectedWorker.policy.requires_approval.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorker.policy.requires_approval.map((req) => (
                      <span key={req} className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-mono text-[11px] border border-amber-700/50">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Tasks Completed</span>
                  <span className="text-white font-bold text-sm">{selectedWorker.metrics.tasksCompleted}</span>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Last Invocation</span>
                  <span className="text-slate-300 font-semibold">{selectedWorker.lastActive}</span>
                </div>
              </div>

              {/* Deep Link Action */}
              {selectedWorker.type === 'identity' && (
                <button
                  onClick={() => onSelectAgentTab('identity_agent')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Amit Identity & Growth Production Instance
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select an agent worker from the list to view capability policies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
