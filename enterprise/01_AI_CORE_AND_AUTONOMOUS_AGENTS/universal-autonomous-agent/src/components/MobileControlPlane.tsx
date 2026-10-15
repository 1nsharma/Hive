import React, { useState } from 'react';
import { 
  Smartphone, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Mic, 
  Send, 
  Clock, 
  Zap, 
  Activity, 
  Lock, 
  ChevronRight,
  Fingerprint,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ReviewControlItem, OperatingMode, AgentWorker } from '../types';

interface MobileControlPlaneProps {
  operatingMode: OperatingMode;
  pendingItems: ReviewControlItem[];
  workers: AgentWorker[];
  onAction: (itemId: string, action: 'approve' | 'reject') => Promise<void>;
  onModeChange: (mode: OperatingMode) => void;
  onQuickVoiceCommand: (text: string) => Promise<void>;
}

export const MobileControlPlane: React.FC<MobileControlPlaneProps> = ({
  operatingMode,
  pendingItems,
  workers,
  onAction,
  onModeChange,
  onQuickVoiceCommand
}) => {
  const [quickInput, setQuickInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const currentItem = pendingItems[activeItemIndex];

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setQuickInput('Approve current LinkedIn draft and pause growth outreach');
      }, 1500);
    } else {
      setIsRecording(false);
    }
  };

  const handleDispatch = async () => {
    if (!quickInput.trim()) return;
    await onQuickVoiceCommand(quickInput);
    setQuickInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Mobile Remote Control Plane
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Founder Pocket Device
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                On-the-go supervisor viewport for low-friction one-tap approvals, voice memos, and emergency locks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Mobile Device Frame Mockup */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-slate-950 rounded-[40px] border-4 border-slate-800 p-4 shadow-2xl shadow-cyan-950/20 relative overflow-hidden">
          {/* Phone Top Notch */}
          <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
          </div>

          <div className="space-y-4">
            {/* Header / Emergency Switch */}
            <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Operating Mode</span>
                <span className={`text-xs font-mono font-bold ${
                  operatingMode === 'LOCKDOWN' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {operatingMode}
                </span>
              </div>

              <button
                onClick={() => onModeChange(operatingMode === 'LOCKDOWN' ? 'AUTONOMOUS' : 'LOCKDOWN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  operatingMode === 'LOCKDOWN'
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-md shadow-rose-900/40'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {operatingMode === 'LOCKDOWN' ? 'Unlock Swarm' : 'EMERGENCY LOCK'}
              </button>
            </div>

            {/* Quick Worker Swarm Status Bar */}
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Active Workers:</span>
              <div className="flex items-center gap-1">
                {workers.map((w) => (
                  <span
                    key={w.id}
                    title={`${w.name}: ${w.status}`}
                    className={`w-2.5 h-2.5 rounded-full ${
                      w.status === 'running' ? 'bg-emerald-400' :
                      w.status === 'locked' ? 'bg-rose-500' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* One-Tap Review Card */}
            <div className="bg-slate-900 rounded-2xl border border-cyan-500/40 p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-300 uppercase font-semibold">
                  Pending Decision ({pendingItems.length})
                </span>
                {currentItem && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    currentItem.riskLevel === 'high' || currentItem.riskLevel === 'critical'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {currentItem.riskLevel.toUpperCase()}
                  </span>
                )}
              </div>

              {currentItem ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                      {currentItem.proposedAction}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {currentItem.reason}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg text-[10px] font-mono text-slate-300 truncate">
                    Tool: {currentItem.toolUsed}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onAction(currentItem.id, 'reject')}
                      className="py-2.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => onAction(currentItem.id, 'approve')}
                      className="py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-950/40"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-slate-300">All queues clear</p>
                  <p className="text-[11px]">No pending actions need your intervention.</p>
                </div>
              )}
            </div>

            {/* Quick Dispatch / Voice Memo */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Quick Command / Voice
              </span>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Tell Agent OS..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                  }`}
                  title="Dictate voice memo"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDispatch}
                  disabled={!quickInput.trim()}
                  className="p-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
