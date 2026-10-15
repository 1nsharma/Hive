import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  RefreshCw,
  Plus,
  Bot
} from 'lucide-react';
import { AutomationWorkflow } from '../types';

interface AutomationsViewProps {
  workflows: AutomationWorkflow[];
  onToggleWorkflow: (workflowId: string, isEnabled: boolean) => Promise<void>;
  onRunWorkflow: (workflowId: string) => Promise<void>;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  workflows,
  onToggleWorkflow,
  onRunWorkflow
}) => {
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRun = async (id: string) => {
    setRunningId(id);
    try {
      await onRunWorkflow(id);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Automations & Recurring Workflows
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {workflows.length} Configured
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                CRON schedules, git webhook triggers, and event-driven sentinels driving long-running autonomous execution loops.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => {
          const isRunning = runningId === wf.id;

          return (
            <div
              key={wf.id}
              className={`bg-slate-900/90 rounded-2xl border p-5 space-y-4 transition-all ${
                wf.isEnabled
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {wf.triggerType.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {wf.triggerSchedule}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-1.5">{wf.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleWorkflow(wf.id, !wf.isEnabled)}
                    className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                      wf.isEnabled
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                    title={wf.isEnabled ? 'Pause Automation' : 'Enable Automation'}
                  >
                    {wf.isEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                {wf.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Assigned Agent:</span>
                  <span className="text-cyan-300">{wf.assignedAgent}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Executions:</span>
                  <span className="text-white font-bold">{wf.totalExecutions} runs</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Last Run: {wf.lastRun}
                </span>

                <button
                  disabled={isRunning || !wf.isEnabled}
                  onClick={() => handleRun(wf.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950/40 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <Zap className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Running...' : 'Run Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
