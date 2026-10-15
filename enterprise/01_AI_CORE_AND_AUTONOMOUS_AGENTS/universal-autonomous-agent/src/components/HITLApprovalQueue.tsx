import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HITLAction, RiskLevel } from '../types';

interface HITLApprovalQueueProps {
  hitlQueue: HITLAction[];
  onApproveAction: (actionId: string, decision: 'approve' | 'reject' | 'modify', notes?: string) => Promise<void>;
}

export const HITLApprovalQueue: React.FC<HITLApprovalQueueProps> = ({
  hitlQueue,
  onApproveAction
}) => {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingActions = hitlQueue.filter(h => h.status === 'pending');
  const pastActions = hitlQueue.filter(h => h.status !== 'pending');

  const handleDecision = async (actionId: string, decision: 'approve' | 'reject') => {
    setProcessingId(actionId);
    await onApproveAction(actionId, decision, reviewNotes);
    setReviewNotes('');
    setProcessingId(null);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL RISK</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">HIGH RISK (HITL)</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Critical Safeguard Layer</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">Human-in-the-Loop (HITL) Barrier</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Human-in-the-Loop Approval & Verification Gate</h2>
            <p className="text-sm text-slate-400 mt-1">
              Guards against runaway automation. Autonomous agent drafts actions and pauses before publishing, sending emails, or executing code. Only confirmed actions are dispatched.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
              pendingActions.length > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {pendingActions.length > 0 ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{pendingActions.length} Pending Approval</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pending Approval Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Pending High-Risk Actions Requiring Authorization</span>
        </h3>

        {pendingActions.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">All Clear — No Pending Approvals</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              When the autonomous agent plans a public post or external outbound communication, it will appear here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingActions.map((action) => (
              <div 
                key={action.id} 
                className="bg-slate-900 border border-amber-500/40 rounded-xl p-5 shadow-lg shadow-amber-950/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{action.actionTitle}</span>
                      {getRiskBadge(action.riskLevel)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                      <span>Target Mission: <strong>{action.targetId}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-cyan-400">
                        <Terminal className="w-3 h-3" />
                        {action.toolName}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500">{action.createdAt}</span>
                </div>

                {/* Impact Analysis */}
                <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="font-semibold text-amber-300 block mb-0.5">Impact Analysis & Why Approval is Required:</span>
                  <p className="text-slate-300">{action.impactAnalysis}</p>
                </div>

                {/* Diff or Payload Preview */}
                {action.payload && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Execution Payload Preview:</span>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto">
                      {String(action.payload.preview || JSON.stringify(action.payload, null, 2))}
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Optional reviewer notes or instructions..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />

                  <div className="flex items-center space-x-2">
                    <button
                      id={`reject-action-btn-${action.id}`}
                      type="button"
                      disabled={processingId === action.id}
                      onClick={() => handleDecision(action.id, 'reject')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject & Cancel</span>
                    </button>

                    <button
                      id={`approve-action-btn-${action.id}`}
                      type="button"
                      disabled={processingId === action.id}
                      onClick={() => handleDecision(action.id, 'approve')}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all flex items-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History of Past Reviewed Actions */}
      {pastActions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Review History & Authorization Audit
          </h3>

          <div className="space-y-2">
            {pastActions.map((action) => (
              <div key={action.id} className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">{action.actionTitle}</span>
                  <span className="text-slate-400 ml-2">({action.toolName})</span>
                  {action.reviewerNotes && (
                    <span className="text-slate-500 block text-[11px] mt-0.5">Note: "{action.reviewerNotes}"</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    action.status === 'approved' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {action.status}
                  </span>
                  <span className="text-[10px] text-slate-500">{action.reviewedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
