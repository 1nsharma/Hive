import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Layers, 
  Database, 
  Fingerprint, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw,
  Sliders,
  Scale,
  Zap,
  FileCode
} from 'lucide-react';
import { 
  AgentPermissionRule, 
  TenantConnection, 
  PolicyEvaluationResult, 
  OperatingMode,
  PermissionDecision,
  AgentWorker
} from '../types';
import { PRISMA_SCHEMA_SPEC } from '../data/mockData';
import { evaluatePolicy } from '../lib/policyEngine';

interface PolicyEngineViewProps {
  permissionRules: AgentPermissionRule[];
  connections: TenantConnection[];
  workers: AgentWorker[];
  operatingMode: OperatingMode;
  onSimulateActionDispatched?: (evaluation: PolicyEvaluationResult) => void;
}

export const PolicyEngineView: React.FC<PolicyEngineViewProps> = ({
  permissionRules,
  connections,
  workers,
  operatingMode,
  onSimulateActionDispatched
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'rules' | 'connections' | 'schema'>('simulator');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Policy Simulator State
  const [selectedAgentId, setSelectedAgentId] = useState<string>(workers[0]?.id || 'worker-identity');
  const [selectedResource, setSelectedResource] = useState<string>('linkedin');
  const [selectedCapability, setSelectedCapability] = useState<string>('publish_post');
  const [customActionTitle, setCustomActionTitle] = useState<string>('Publish Technical Article to LinkedIn Network');
  const [simResult, setSimResult] = useState<PolicyEvaluationResult | null>(null);

  const selectedAgent = workers.find(w => w.id === selectedAgentId) || workers[0];

  const handleRunSimulation = () => {
    const result = evaluatePolicy(
      selectedAgent.id,
      selectedAgent.name,
      selectedResource,
      selectedCapability,
      customActionTitle,
      operatingMode
    );
    setSimResult(result);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(PRISMA_SCHEMA_SPEC);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const quickPresets = [
    {
      label: 'Publish LinkedIn Post (Identity Agent)',
      agentId: 'worker-identity',
      resource: 'linkedin',
      capability: 'publish_post',
      title: 'Publish Thought Leadership Article'
    },
    {
      label: 'Read Public Mentions (Identity Agent)',
      agentId: 'worker-identity',
      resource: 'public_web',
      capability: 'search_mentions',
      title: 'Scan Hacker News & arXiv citations'
    },
    {
      label: 'Send Mass WhatsApp (Growth Agent)',
      agentId: 'worker-growth',
      resource: 'whatsapp',
      capability: 'send_bulk_broadcast',
      title: 'Send Mass Outreach Broadcast'
    },
    {
      label: 'Drop Production DB Table (Coding Agent)',
      agentId: 'worker-coding',
      resource: 'database',
      capability: 'drop_table',
      title: 'Execute DROP TABLE users_backup'
    },
    {
      label: 'Create Pull Request (Coding Agent)',
      agentId: 'worker-coding',
      resource: 'github',
      capability: 'create_pull_request',
      title: 'Create PR: MCP JSON-RPC Streaming'
    },
    {
      label: 'Send Outbound Email (Growth Agent)',
      agentId: 'worker-growth',
      resource: 'email',
      capability: 'send_outreach',
      title: 'Send Warm Partnership Pitch'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Notice */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Deterministic Permission & Policy Engine
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Option A • Zero-Trust
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rule of law for autonomous agents: <strong>Strict Deny-by-Default</strong>. LLM justification is NOT policy. Multi-dimensional risk matrix & token vault.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active OS Mode:</span>
              <strong className="text-white font-mono">{operatingMode}</strong>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'simulator'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Policy Interception Simulator
          </button>

          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'rules'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Active Whitelist Rules ({permissionRules.length})
          </button>

          <button
            onClick={() => setActiveSubTab('connections')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'connections'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Connections & Credential Vault ({connections.length})
          </button>

          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'schema'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Production Prisma Schema Spec (6 Improvements)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: POLICY INTERCEPTOR SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulation Input Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Action Interception Prover
              </h3>
              <p className="text-xs text-slate-400">
                Test how the deterministic engine gates, permits, or blocks agent attempts before executing in external tools.
              </p>

              {/* Quick Presets */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Quick Simulation Presets:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedAgentId(preset.agentId);
                        setSelectedResource(preset.resource);
                        setSelectedCapability(preset.capability);
                        setCustomActionTitle(preset.title);
                      }}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 truncate transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Requesting Agent Worker:
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Target Resource:
                    </label>
                    <input
                      type="text"
                      value={selectedResource}
                      onChange={(e) => setSelectedResource(e.target.value)}
                      placeholder="e.g. linkedin, github"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Capability Name:
                    </label>
                    <input
                      type="text"
                      value={selectedCapability}
                      onChange={(e) => setSelectedCapability(e.target.value)}
                      placeholder="e.g. publish_post, drop_table"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Action Description / Proposed Title:
                  </label>
                  <input
                    type="text"
                    value={customActionTitle}
                    onChange={(e) => setCustomActionTitle(e.target.value)}
                    placeholder="Describe what the agent is attempting..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-950/40 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Evaluate Deterministic Policy
                </button>
              </div>
            </div>

            {/* Architecture Invariant Callout */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Deterministic Invariant Guaranteed</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                An LLM’s claim that an action is <em>"in the user's best interest"</em> is discarded by the engine. Policy is evaluated via hardcoded capability tables, multi-vector risk math, and active mode gates.
              </p>
            </div>
          </div>

          {/* Simulation Output Panel */}
          <div className="lg:col-span-7">
            {simResult ? (
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Interception Verdict • {simResult.timestamp}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {simResult.proposedAction}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      {simResult.agentName} &rarr; <span className="text-cyan-300">{simResult.resource}.{simResult.capability}</span>
                    </p>
                  </div>

                  {/* Big Verdict Badge */}
                  <div className={`px-4 py-2 rounded-xl font-bold text-sm border flex items-center gap-2 ${
                    simResult.decision === 'DENY'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : simResult.decision === 'ALLOW_WITH_APPROVAL'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {simResult.decision === 'DENY' ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : simResult.decision === 'ALLOW_WITH_APPROVAL' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    <span>{simResult.decision}</span>
                  </div>
                </div>

                {/* Analysis Message */}
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  simResult.decision === 'DENY'
                    ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                    : simResult.decision === 'ALLOW_WITH_APPROVAL'
                    ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                }`}>
                  <strong className="font-mono uppercase block text-[10px] mb-1">
                    Reason Code: {simResult.reasonCode}
                  </strong>
                  {simResult.detailedAnalysis}
                </div>

                {/* 6-Dimensional Risk Matrix Visualizer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Scale className="w-4 h-4 text-cyan-400" />
                      Multi-Dimensional Risk Matrix
                    </h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      Composite Risk: <strong className={
                        simResult.riskMatrix.compositeScore >= 60 ? 'text-rose-400' :
                        simResult.riskMatrix.compositeScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                      }>{simResult.riskMatrix.compositeScore} / 100</strong> ({simResult.riskMatrix.riskLevel.toUpperCase()})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Data Sensitivity', val: simResult.riskMatrix.dataSensitivity, max: 3, notes: ['Public', 'Internal', 'Confidential', 'Secret'][simResult.riskMatrix.dataSensitivity] },
                      { label: 'External Comm', val: simResult.riskMatrix.externalCommunication, max: 3, notes: ['None', 'Internal Team', 'Draft External', 'Direct Outbound'][simResult.riskMatrix.externalCommunication] },
                      { label: 'Financial Impact', val: simResult.riskMatrix.financialImpact, max: 3, notes: ['Zero ($0)', 'Micro (<$1)', 'Transactional', 'Uncapped'][simResult.riskMatrix.financialImpact] },
                      { label: 'Reputation Impact', val: simResult.riskMatrix.reputationImpact, max: 3, notes: ['None', 'Low', 'Public Brand', 'High-Profile'][simResult.riskMatrix.reputationImpact] },
                      { label: 'Destructiveness', val: simResult.riskMatrix.destructiveness, max: 3, notes: ['Read-only', 'Append', 'Modify', 'Drop/Delete'][simResult.riskMatrix.destructiveness] },
                      { label: 'Reversibility', val: simResult.riskMatrix.reversibility, max: 3, notes: ['Reversible', 'Compensable', 'Difficult', 'Irreversible'][simResult.riskMatrix.reversibility] },
                    ].map((dim, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>{dim.label}</span>
                          <span className="font-mono text-white font-bold">{dim.val}/3</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              dim.val >= 3 ? 'bg-rose-500' : dim.val === 2 ? 'bg-amber-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${(dim.val / dim.max) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono truncate">{dim.notes}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Idempotency & Rate Limit Telemetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      Idempotency & Execution State
                    </span>
                    <p className="font-mono text-[11px] text-cyan-300 truncate">
                      Key: {simResult.idempotencyKey}
                    </p>
                    <p className="font-mono text-[11px] text-slate-400 truncate">
                      Exec ID: {simResult.executionId}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      Prevents duplicate external API calls on retry/timeout
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      Rate Limits & Cost Cap
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Calls this hour:</span>
                      <span className="font-mono font-bold text-white">
                        {simResult.rateLimitStatus.callsThisHour} / {simResult.rateLimitStatus.hourlyLimit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Daily Cost Cap:</span>
                      <span className="font-mono text-emerald-400">
                        ${simResult.budgetStatus.dailyCapUsd.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                {simResult.decision === 'ALLOW_WITH_APPROVAL' && onSimulateActionDispatched && (
                  <button
                    onClick={() => onSimulateActionDispatched(simResult)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Dispatch to Review (Control Plane) Queue
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[380px]">
                <ShieldCheck className="w-12 h-12 text-slate-700 mb-3" />
                <p className="font-semibold text-slate-300 text-sm">Policy Interceptor Ready</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Choose a preset or enter any tool capability on the left to verify deterministic permission enforcement.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACTIVE RULES TABLE */}
      {activeSubTab === 'rules' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                Configured Capability Rules (Deny By Default)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every agent action must explicitly match an approved rule or is blocked automatically.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {permissionRules.length} explicit rules
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Agent</th>
                  <th className="py-2.5 px-3">Resource & Capability</th>
                  <th className="py-2.5 px-3">Decision</th>
                  <th className="py-2.5 px-3">Hourly Rate Limit</th>
                  <th className="py-2.5 px-3">Daily Cap</th>
                  <th className="py-2.5 px-3">Policy Rationale / HITL Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {permissionRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white">{rule.agentName}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{rule.agentId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-cyan-300 font-semibold">{rule.resource}</span>
                      <span className="font-mono text-slate-400 block text-[11px]">.{rule.capability}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                        rule.decision === 'DENY'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : rule.decision === 'ALLOW_WITH_APPROVAL'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {rule.decision}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {rule.rateLimitPerHour > 0 ? `${rule.rateLimitPerHour}/hr` : '0 (BLOCKED)'}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400">
                      ${rule.costCapUsdPerDay.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs">
                      {rule.requiresApprovalReason || rule.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CONNECTIONS & CREDENTIAL VAULT */}
      {activeSubTab === 'connections' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              Separated Connection & Vault Layer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Core Security Architectural Rule:</strong> Agents are NEVER given direct OAuth tokens or API keys. The Agent requests an abstract capability (e.g. <code className="text-cyan-300 font-mono">github.read_repository</code>), the Policy Engine authorizes it, and the Tool Runtime uses the KMS Vault pointer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {conn.provider.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      CONNECTED
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">{conn.displayName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{conn.accountIdentifier}</p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      Granted Capabilities (Whitelisted):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {conn.capabilitiesGranted.map((cap) => (
                        <span key={cap} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Vault Ref:</span>
                    <span className="font-mono text-[10px] text-amber-300 truncate max-w-[160px]">
                      {conn.vaultSecretRef}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rotated:</span>
                    <span className="text-slate-400">{conn.lastRotated}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PRODUCTION PRISMA SCHEMA SPEC */}
      {activeSubTab === 'schema' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Multi-Tenant Prisma Schema Reference (PostgreSQL + pgvector)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Implements the 6 critical enhancements: 3-way permissions, credential vault separation, idempotency keys, immutable hash chaining, multi-dimensional risk, and deterministic enforcement.
              </p>
            </div>

            <button
              onClick={handleCopySchema}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSchema ? 'Copied to Clipboard' : 'Copy Prisma Schema'}
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 p-4 max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre">{PRISMA_SCHEMA_SPEC}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
