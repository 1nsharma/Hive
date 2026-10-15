import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  X, 
  Edit3, 
  RotateCcw, 
  Clock, 
  Wrench, 
  Database, 
  Target, 
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  FileCode,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ReviewControlItem, RiskLevel, OperatingMode } from '../types';

interface AgentControlPlaneProps {
  items: ReviewControlItem[];
  operatingMode: OperatingMode;
  onAction: (itemId: string, action: 'approve' | 'reject' | 'modify' | 'rollback', notes?: string, modifiedPayload?: Record<string, unknown>) => Promise<void>;
}

export const AgentControlPlane: React.FC<AgentControlPlaneProps> = ({
  items,
  operatingMode,
  onAction
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editPayloadJson, setEditPayloadJson] = useState<string>('');
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL RISK
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> HIGH RISK
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            MEDIUM RISK
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            LOW RISK
          </span>
        );
    }
  };

  const getStatusBadge = (status: ReviewControlItem['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> REJECTED
          </span>
        );
      case 'modified':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
            <Edit3 className="w-3.5 h-3.5" /> MODIFIED & EXECUTED
          </span>
        );
      case 'rolled_back':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> ROLLED BACK
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> AWAITING APPROVAL
          </span>
        );
    }
  };

  const handleExecuteAction = async (itemId: string, action: 'approve' | 'reject' | 'modify' | 'rollback') => {
    setIsProcessingId(itemId);
    try {
      if (action === 'modify') {
        let parsed: Record<string, unknown> | undefined;
        try {
          parsed = JSON.parse(editPayloadJson);
        } catch {
          // ignore
        }
        await onAction(itemId, action, editNotes, parsed);
        setActiveEditingId(null);
      } else {
        await onAction(itemId, action);
      }
    } finally {
      setIsProcessingId(null);
    }
  };

  const startEditing = (item: ReviewControlItem) => {
    setActiveEditingId(item.id);
    setEditNotes(item.reviewerNotes || '');
    setEditPayloadJson(JSON.stringify(item.payload, null, 2));
  };

  const filteredItems = filterStatus === 'all'
    ? items
    : items.filter(i => i.status === filterStatus);

  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Agent Control Plane (HITL Review)
                  {pendingCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                      {pendingCount} Pending Decision{pendingCount > 1 ? 's' : ''}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deterministic safeguard inspection: Review proposed action, risk rating, reason, data used, tool used, expected result, and actual execution outcome.
                </p>
              </div>
            </div>
          </div>

          {/* Mode indicator */}
          <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400">Current Mode:</span>
            <span className={`font-mono font-bold ${
              operatingMode === 'LOCKDOWN' ? 'text-rose-400' :
              operatingMode === 'AUTONOMOUS' ? 'text-purple-400' :
              operatingMode === 'COPILOT' ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {operatingMode}
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">Filter:</span>
          {['all', 'pending', 'approved', 'rejected', 'rolled_back'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Control Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center text-slate-400 space-y-2">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-semibold text-sm">No control plane items match the selected filter.</p>
            <p className="text-xs text-slate-500">Autonomous actions will appear here whenever an agent proposes an action requiring verification.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isProcessing = isProcessingId === item.id;
            const isEditing = activeEditingId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-slate-900/90 rounded-2xl border transition-all p-5 space-y-4 ${
                  item.status === 'pending'
                    ? 'border-amber-500/40 shadow-lg shadow-amber-950/10'
                    : 'border-slate-800'
                }`}
              >
                {/* Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-mono border border-slate-700">
                        {item.agentWorkerName}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {item.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                      {item.proposedAction}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getRiskBadge(item.riskLevel)}
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Structured Inspection Grid (Requested by User) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left Column: Reason + Data Used */}
                  <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wide text-[11px] block mb-1">
                        Reason & Intent:
                      </span>
                      <p className="text-slate-200 leading-relaxed">{item.reason}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wide text-[11px] block mb-1 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-cyan-400" />
                        Data Used ({item.dataUsed.length} sources):
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.dataUsed.map((data, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px] border border-slate-700">
                            {data}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Tool Used + Expected Result */}
                  <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60">
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wide text-[11px] block mb-1 flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                        Tool Invocation:
                      </span>
                      <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-700 block truncate">
                        {item.toolUsed}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wide text-[11px] block mb-1 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-emerald-400" />
                        Expected Result:
                      </span>
                      <p className="text-slate-200 leading-relaxed">{item.expectedResult}</p>
                    </div>
                  </div>
                </div>

                {/* Diff / Action Payload Preview */}
                {item.diffPreview && (
                  <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3 text-xs font-mono text-slate-300 overflow-x-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Execution Payload Diff Preview
                    </span>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{item.diffPreview}</pre>
                  </div>
                )}

                {/* Actual Result (if executed) */}
                {item.actualResult && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    item.status === 'approved' || item.status === 'modified'
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                      : item.status === 'rolled_back'
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                  }`}>
                    <span className="font-bold uppercase tracking-wider block text-[11px] mb-0.5">
                      Actual Execution Result:
                    </span>
                    {item.actualResult}
                    {item.reviewerNotes && (
                      <p className="mt-1 text-slate-400 text-[11px]">
                        Reviewer Note: "{item.reviewerNotes}" (Reviewed at: {item.reviewedAt})
                      </p>
                    )}
                  </div>
                )}

                {/* Inline Edit Form */}
                {isEditing && (
                  <div className="bg-slate-800/90 rounded-xl p-4 border border-cyan-500/50 space-y-3">
                    <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4" /> Edit Execution Parameters & Reviewer Directives
                    </h4>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Reviewer Note / Justification:</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="e.g. Authorized with modified recipient list"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Payload JSON:</label>
                      <textarea
                        rows={4}
                        value={editPayloadJson}
                        onChange={(e) => setEditPayloadJson(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveEditingId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleExecuteAction(item.id, 'modify')}
                        className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save & Execute Modified Payload
                      </button>
                    </div>
                  </div>
                )}

                {/* Control Action Buttons (Approve, Reject, Edit, Rollback) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="text-slate-400">
                    Target ID: <span className="font-mono text-slate-300">{item.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <>
                        <button
                          disabled={isProcessing}
                          onClick={() => startEditing(item)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          Edit Payload
                        </button>

                        <button
                          disabled={isProcessing}
                          onClick={() => handleExecuteAction(item.id, 'reject')}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>

                        <button
                          disabled={isProcessing}
                          onClick={() => handleExecuteAction(item.id, 'approve')}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/30 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve & Execute
                        </button>
                      </>
                    )}

                    {/* Rollback capability if already executed */}
                    {(item.status === 'approved' || item.status === 'modified') && item.canRollback && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleExecuteAction(item.id, 'rollback')}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-950/40 text-amber-300 border border-amber-800/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Issue compensating rollback transaction"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Rollback State
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
