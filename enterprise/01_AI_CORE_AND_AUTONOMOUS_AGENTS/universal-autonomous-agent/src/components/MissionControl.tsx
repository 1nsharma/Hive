import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Terminal, 
  Copy, 
  Check, 
  TrendingUp, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AgentMission, DigitalTwinProfile, RiskLevel } from '../types';

interface MissionControlProps {
  activeProfile: DigitalTwinProfile;
  missions: AgentMission[];
  onRunTarget: (target: string, mode: 'full_auto' | 'hitl_guarded') => Promise<void>;
  isRunning: boolean;
  onNavigateToHitl: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  activeProfile,
  missions,
  onRunTarget,
  isRunning,
  onNavigateToHitl
}) => {
  const [targetInput, setTargetInput] = useState('');
  const [autonomousMode, setAutonomousMode] = useState<'hitl_guarded' | 'full_auto'>('hitl_guarded');
  const [copied, setCopied] = useState(false);

  const activeMission = missions[0];

  const presets = [
    {
      title: 'GitHub to LinkedIn Tech Post',
      target: 'मेरे हालिया GitHub commits का विश्लेषण करो और Model Context Protocol (MCP) आर्किटेक्चर पर एक तकनीकी LinkedIn पोस्ट ड्राफ्ट करो।',
      category: 'Social & Brand'
    },
    {
      title: 'AI Founder Outreach',
      target: 'Agent Orchestration और LangGraph पर काम कर रहे 4 AI संस्थापकों को खोजो और उनके लिए व्यक्तिगत सहयोग ईमेल ड्राफ्ट करो।',
      category: 'Network Growth'
    },
    {
      title: 'Competitor MCP Analysis',
      target: 'बाज़ार में हाल ही में लॉन्च हुए ऑटोनॉमस एजेंट टूल्स का विश्लेषण करो और हमारे डिजिटल ट्विन के लिए रणनीतिक सिफारिशें तैयार करो।',
      category: 'Intelligence'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim() || isRunning) return;
    onRunTarget(targetInput, autonomousMode);
  };

  const handleCopyArtifact = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      {/* Top Banner: Digital Twin Context Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Autonomous Target Hub</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Digital Twin: <strong className="text-slate-200">{activeProfile.name}</strong> ({activeProfile.role})</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Autonomous Target Orchestration & Self-Learning Engine</h2>
            <p className="text-sm text-slate-400 mt-1">
              Provide any objective or target. The agent parses the goal, queries memory & perception, plans execution via MCP tools, invokes HITL safety gates, and self-reflects to upgrade its heuristic weights.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
            <button
              id="mode-hitl-btn"
              type="button"
              onClick={() => setAutonomousMode('hitl_guarded')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                autonomousMode === 'hitl_guarded'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HITL Guarded (Safe)</span>
            </button>
            <button
              id="mode-auto-btn"
              type="button"
              onClick={() => setAutonomousMode('full_auto')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                autonomousMode === 'full_auto'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Full Autonomous</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="relative">
            <textarea
              id="target-input-field"
              rows={3}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Enter your target or goal here (e.g., 'मेरे GitHub commits के आधार पर एक LinkedIn पोस्ट लिखो और founders को ईमेल ड्राफ्ट करो')..."
              className="w-full bg-slate-950/90 border border-slate-700 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Self-Learning: Active
                </span>
                <span>•</span>
                <span>Adaptability Weight: <strong className="text-cyan-400">{activeProfile.heuristicWeights.learningAdaptability}%</strong></span>
              </div>

              <button
                id="execute-target-btn"
                type="submit"
                disabled={isRunning || !targetInput.trim()}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isRunning || !targetInput.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-950'
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Orchestrating Target...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Autonomous Target</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Launch Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Quick Target Presets:</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => setTargetInput(p.target)}
                className="text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-2.5 rounded-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-300">{p.title}</span>
                  <span className="text-[10px] text-slate-500">{p.category}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.target}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Mission Execution View */}
      {activeMission ? (
        <div className="space-y-6">
          {/* Mission Status Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Mission ID: {activeMission.id}
                  </span>
                  <span className="text-xs text-slate-400">{activeMission.createdAt}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">"{activeMission.target}"</h3>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Goal Progress</span>
                  <span className="text-base font-bold text-cyan-400">{activeMission.progressPercentage}%</span>
                </div>
                <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${activeMission.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Perception Grounding Signals Used */}
            {activeMission.perceptionInsights && activeMission.perceptionInsights.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Perception Grounding:</span>
                {activeMission.perceptionInsights.map((insight, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                    {insight}
                  </span>
                ))}
              </div>
            )}

            {/* Execution DAG Steps */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reasoning & Execution DAG Steps</span>
              </h4>

              <div className="space-y-3">
                {activeMission.steps.map((step) => {
                  const isAwaiting = step.status === 'awaiting_approval';
                  return (
                    <div 
                      key={step.id} 
                      className={`p-4 rounded-lg border transition-all ${
                        isAwaiting 
                          ? 'bg-amber-950/20 border-amber-500/50 shadow-sm shadow-amber-950'
                          : 'bg-slate-950/70 border-slate-800/90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start sm:items-center space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isAwaiting
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {step.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : step.order}
                          </span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-white">{step.title}</span>
                              {getRiskBadge(step.riskLevel)}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          {step.assignedToolName && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1">
                              <Terminal className="w-3 h-3 text-cyan-400" />
                              {step.assignedToolName}
                            </span>
                          )}
                          {step.executionDurationMs && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {step.executionDurationMs}ms
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Reasoning justification */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-medium whitespace-nowrap">Agent Rationale:</span>
                        <span>{step.reasoning}</span>
                      </div>

                      {/* If awaiting approval */}
                      {isAwaiting && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-2 text-amber-300 text-xs">
                            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                            <span>Action held in Human-in-the-Loop Security Barrier (Requires Approval to Publish/Send).</span>
                          </div>
                          <button
                            id={`review-hitl-step-btn-${step.id}`}
                            type="button"
                            onClick={onNavigateToHitl}
                            className="px-3 py-1 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center space-x-1"
                          >
                            <span>Inspect & Approve</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Self-Learning & Decision Engine Reflection Card */}
          {activeMission.reflections && activeMission.reflections.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Self-Learning & Self-Decision Reflection</h4>
                    <p className="text-xs text-slate-400">Autonomous evaluation cycle and heuristic weight calibration</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Cycle #{activeMission.reflections[0].cycle} Evaluated
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Agent Critique & Evaluation:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeMission.reflections[0].critique}</p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Autonomous Next Decision:</span>
                    <p className="text-xs text-cyan-300 font-medium">{activeMission.reflections[0].autonomousDecision}</p>
                  </div>
                </div>

                {/* Heuristic Updates */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Heuristic Adaptations:</span>
                  <div className="space-y-2">
                    {activeMission.reflections[0].heuristicAdjustments.map((adj, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-indigo-300">{adj.heuristic}</span>
                          <span className="font-bold text-emerald-400 text-[11px]">
                            {adj.oldValue} ➔ {adj.newValue}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{adj.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final Deliverable Artifact */}
          {activeMission.finalOutcomeArtifact && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Synthesized Deliverable Artifact</h4>
                    <p className="text-xs text-slate-400">{activeMission.finalOutcomeArtifact.summary}</p>
                  </div>
                </div>

                {activeMission.finalOutcomeArtifact.deliverables[0] && (
                  <button
                    id="copy-deliverable-btn"
                    type="button"
                    onClick={() => handleCopyArtifact(activeMission.finalOutcomeArtifact?.deliverables[0]?.content || '')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Deliverable'}</span>
                  </button>
                )}
              </div>

              {/* Metrics Achieved */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {activeMission.finalOutcomeArtifact.metricsAchieved.map((m, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{m.label}</span>
                    <span className="text-sm font-bold text-cyan-400 mt-0.5 block">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Deliverable Content Preview */}
              {activeMission.finalOutcomeArtifact.deliverables.map((deliv, idx) => (
                <div key={idx} className="mt-4 bg-slate-950 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-200">{deliv.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      {deliv.type}
                    </span>
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {deliv.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No active mission running</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Select a quick target preset above or enter any custom goal to watch the Universal Autonomous Agent execute its recursive DAG orchestration.
          </p>
        </div>
      )}
    </div>
  );
};
