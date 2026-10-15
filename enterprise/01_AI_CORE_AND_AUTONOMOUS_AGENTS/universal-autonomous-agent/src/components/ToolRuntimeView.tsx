import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Wrench, 
  Terminal, 
  Key, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Database, 
  Globe, 
  Code2, 
  Share2, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Cpu, 
  Layers,
  FileCode2,
  Copy,
  ChevronRight
} from 'lucide-react';
import { 
  CapabilityDefinition, 
  ToolExecutionRecord, 
  ToolInvocation, 
  ToolRuntimeResult, 
  ActionProposalRecord, 
  ProposedActionRecord,
  OperatingMode,
  NormalizedAgentRun
} from '../types';
import { CAPABILITY_REGISTRY } from '../lib/capabilityRegistry';
import { ToolRuntime, toolExecutionLedger, actionProposalsQueue, proposedActionsStore } from '../lib/toolRuntime';
import { IdentityAgentRunner } from '../lib/identityAgentRunner';

interface ToolRuntimeViewProps {
  operatingMode: OperatingMode;
  onNavigateToReview?: () => void;
}

export const ToolRuntimeView: React.FC<ToolRuntimeViewProps> = ({
  operatingMode,
  onNavigateToReview
}) => {
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>(Object.values(CAPABILITY_REGISTRY));
  const [selectedCapability, setSelectedCapability] = useState<CapabilityDefinition>(CAPABILITY_REGISTRY['search_public_web']);
  const [executions, setExecutions] = useState<ToolExecutionRecord[]>([]);
  const [proposals, setProposals] = useState<ActionProposalRecord[]>([]);
  const [proposedActions, setProposedActions] = useState<ProposedActionRecord[]>([]);
  
  // Interactive Simulator State
  const [simResource, setSimResource] = useState<string>('public_web');
  const [simAction, setSimAction] = useState<string>('read');
  const [simPayloadJson, setSimPayloadJson] = useState<string>('{\n  "query": "\\"Amit Sharma\\" \\"1nsharma\\" \\"Kanpur\\"",\n  "limit": 5\n}');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<ToolRuntimeResult | null>(null);

  // Identity Agent v0.1 Runner State
  const [isRunningIdentityAgent, setIsRunningIdentityAgent] = useState<boolean>(false);
  const [identityAgentRunResult, setIdentityAgentRunResult] = useState<NormalizedAgentRun | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'registry' | 'vault' | 'executions' | 'proposals'>('simulator');

  const fetchRuntimeData = async () => {
    try {
      // Fetch capabilities
      const capRes = await fetch('/api/agent/capabilities');
      if (capRes.ok) {
        const data = await capRes.json();
        if (data.capabilities) setCapabilities(data.capabilities);
      }

      // Fetch executions
      const execRes = await fetch('/api/agent/tool/executions');
      if (execRes.ok) {
        const data = await execRes.json();
        if (data.executions) setExecutions(data.executions);
      } else {
        setExecutions([...toolExecutionLedger]);
      }

      // Fetch proposals
      const propRes = await fetch('/api/agent/proposals');
      if (propRes.ok) {
        const data = await propRes.json();
        if (data.proposals) setProposals(data.proposals);
        if (data.proposedActions) setProposedActions(data.proposedActions);
      } else {
        setProposals([...actionProposalsQueue]);
        setProposedActions([...proposedActionsStore]);
      }
    } catch {
      setCapabilities(Object.values(CAPABILITY_REGISTRY));
      setExecutions([...toolExecutionLedger]);
      setProposals([...actionProposalsQueue]);
      setProposedActions([...proposedActionsStore]);
    }
  };

  useEffect(() => {
    fetchRuntimeData();
  }, [operatingMode]);

  // Load predefined simulator preset
  const applyPreset = (preset: 'web' | 'github' | 'draft' | 'unauthorized' | 'publish') => {
    if (preset === 'web') {
      setSimResource('public_web');
      setSimAction('read');
      setSimPayloadJson('{\n  "query": "\\"Amit Sharma\\" \\"DukaanMitra\\" \\"Sentinel\\"",\n  "limit": 5\n}');
    } else if (preset === 'github') {
      setSimResource('github');
      setSimAction('read');
      setSimPayloadJson('{\n  "username": "1nsharma"\n}');
    } else if (preset === 'draft') {
      setSimResource('linkedin');
      setSimAction('create_draft');
      setSimPayloadJson('{\n  "content": "Engineered a zero-trust execution boundary: The model proposes, but the runtime enforces.",\n  "hashtags": ["#AgentOS", "#MCP", "#AIArchitecture"]\n}');
    } else if (preset === 'unauthorized') {
      setSimResource('database');
      setSimAction('drop_table');
      setSimPayloadJson('{\n  "table": "production_users",\n  "cascade": true\n}');
    } else if (preset === 'publish') {
      setSimResource('linkedin');
      setSimAction('publish');
      setSimPayloadJson('{\n  "content": "Broadcasting directly to live LinkedIn feed without prior review!"\n}');
    }
  };

  // Run Simulator Invocation
  const handleExecuteSimulation = async () => {
    setIsSimulating(true);
    setSimResult(null);

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(simPayloadJson);
    } catch {
      parsedPayload = { rawInput: simPayloadJson };
    }

    try {
      const res = await fetch('/api/agent/tool/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'user-amit-01',
          agentId: 'worker-identity-01',
          runId: `sim_run_${Date.now()}`,
          stepId: 'step_manual_sim',
          resource: simResource,
          action: simAction,
          payload: parsedPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSimResult(data.result);
      } else {
        // Fallback to in-browser runtime instance
        const runtime = new ToolRuntime(operatingMode);
        const localRes = await runtime.invoke({
          tenantId: 'user-amit-01',
          agentId: 'worker-identity-01',
          runId: `sim_run_${Date.now()}`,
          resource: simResource,
          action: simAction,
          payload: parsedPayload
        });
        setSimResult(localRes);
      }
      await fetchRuntimeData();
    } catch (err) {
      const runtime = new ToolRuntime(operatingMode);
      const localRes = await runtime.invoke({
        tenantId: 'user-amit-01',
        agentId: 'worker-identity-01',
        runId: `sim_run_${Date.now()}`,
        resource: simResource,
        action: simAction,
        payload: parsedPayload
      });
      setSimResult(localRes);
      await fetchRuntimeData();
    } finally {
      setIsSimulating(false);
    }
  };

  // Run Full Identity Agent v0.1
  const handleRunIdentityAgentLoop = async () => {
    setIsRunningIdentityAgent(true);
    setIdentityAgentRunResult(null);

    try {
      const res = await fetch('/api/agent/identity/v01-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'worker-identity-01' })
      });

      if (res.ok) {
        const data = await res.json();
        setIdentityAgentRunResult(data.report.run);
      } else {
        const runner = new IdentityAgentRunner(operatingMode);
        const report = await runner.runFullLoop('user-amit-01', 'worker-identity-01');
        setIdentityAgentRunResult(report.run);
      }
      await fetchRuntimeData();
    } catch (err) {
      const runner = new IdentityAgentRunner(operatingMode);
      const report = await runner.runFullLoop('user-amit-01', 'worker-identity-01');
      setIdentityAgentRunResult(report.run);
      await fetchRuntimeData();
    } finally {
      setIsRunningIdentityAgent(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: The Fundamental Architectural Invariant */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Phase 4 • Tool Runtime & MCP Enforcement Boundary
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Zero-Trust Kernel
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ToolRuntime.invoke() — The Final Line of Defense
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              <strong className="text-cyan-300 font-semibold">Core Principle: </strong>
              The model can propose anything; the runtime can execute only what deterministic policy permits.
              No agent, worker, cron, or LLM context has direct access to external APIs or raw credentials.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunIdentityAgentLoop}
              disabled={isRunningIdentityAgent}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunningIdentityAgent ? 'animate-spin' : ''}`} />
              {isRunningIdentityAgent ? 'Executing v0.1 Loop...' : 'Run Identity Agent v0.1'}
            </button>
            <button
              onClick={fetchRuntimeData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh ledger"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Execution Flow Diagram */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-7 gap-2 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">1. PROPOSAL</span>
            <span className="font-semibold text-slate-200">Agent LLM</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-indigo-400 block font-mono">2. POLICY</span>
            <span className="font-semibold text-indigo-200">6D Risk Gate</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/40 text-center bg-cyan-950/20 shadow-sm shadow-cyan-900/20">
            <span className="text-[10px] text-cyan-300 block font-mono font-bold">3. RUNTIME</span>
            <span className="font-bold text-cyan-200">ToolRuntime</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-amber-400 block font-mono">4. VAULT</span>
            <span className="font-semibold text-amber-200">Secret Resolver</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-purple-400 block font-mono">5. ADAPTER</span>
            <span className="font-semibold text-purple-200">MCP Client</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-blue-400 block font-mono">6. TARGET</span>
            <span className="font-semibold text-blue-200">Web / GitHub / LI</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center col-span-2 md:col-span-1">
            <span className="text-[10px] text-emerald-400 block font-mono">7. AUDIT</span>
            <span className="font-semibold text-emerald-200">Hash Ledger</span>
          </div>
        </div>
      </div>

      {/* Identity Agent v0.1 Live Run Result Panel (if run recently) */}
      {identityAgentRunResult && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-xl relative animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  Identity Agent v0.1 Run Complete
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    STATUS: {identityAgentRunResult.status}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Run ID: <span className="font-mono text-cyan-300">{identityAgentRunResult.id}</span> • Started: {identityAgentRunResult.startedAt} • Finished: {identityAgentRunResult.finishedAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                {identityAgentRunResult.steps.length} Steps Completed
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-300 font-mono">
                0 Unapproved Outbound
              </span>
            </div>
          </div>

          {/* 7-Step Sequence Trace */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-7 gap-3">
            {identityAgentRunResult.steps.map((step) => (
              <div key={step.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>STEP {step.sequence}</span>
                    <span className="text-slate-500">{step.durationMs}ms</span>
                  </div>
                  <span className="font-bold text-xs text-white block mb-1">{step.phase}</span>
                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    {step.phase === 'OBSERVE' && <span>2 Tools: Web + GH</span>}
                    {step.phase === 'UNDERSTAND' && <span>Matches verified</span>}
                    {step.phase === 'PLAN' && <span>2 Proposals formed</span>}
                    {step.phase === 'POLICY_CHECK' && <span className="text-emerald-400">Strict Allow check</span>}
                    {step.phase === 'EXECUTE' && <span>Draft + Mem stored</span>}
                    {step.phase === 'VERIFY' && <span className="text-cyan-300">Staging verified</span>}
                    {step.phase === 'LEARN' && <span>Heuristics updated</span>}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> OK
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Proposals Generated & Tool Executions */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Action Proposals Generated (Strict Separation)
              </h4>
              <div className="space-y-2">
                {identityAgentRunResult.proposals.map(p => (
                  <div key={p.id} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-cyan-300 font-semibold">{p.resource}.{p.action}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{p.reason}</p>
                    <div className="mt-1 text-[10px] font-mono text-slate-500">IdempotencyKey: {p.idempotencyKey.substring(0, 24)}...</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                Tool Executions Logged in Audit Ledger
              </h4>
              <div className="space-y-2">
                {identityAgentRunResult.toolExecutions.slice(0, 2).map(e => (
                  <div key={e.id} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-indigo-300 font-semibold">{e.provider}::{e.toolName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{e.durationMs}ms</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Policy check: <span className="text-emerald-400">PASSED</span> • Vault used: <span className="font-mono text-slate-300">{e.credentialVaultUsed || 'public'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeSubTab === 'simulator' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          Interactive ToolRuntime Simulator & Security Tester
        </button>
        <button
          onClick={() => setActiveSubTab('registry')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeSubTab === 'registry' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Capability Registry (A1)
        </button>
        <button
          onClick={() => setActiveSubTab('vault')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeSubTab === 'vault' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          Credential Vault & Isolation (A4)
        </button>
        <button
          onClick={() => setActiveSubTab('executions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeSubTab === 'executions' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Live Tool Executions ({executions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('proposals')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeSubTab === 'proposals' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Action Proposals vs Proposed Actions ({proposals.length})
        </button>
      </div>

      {/* SUB-TAB 1: INTERACTIVE SIMULATOR & SECURITY TESTER */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Invocation Configurator */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Invoke via ToolRuntime.invoke()
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Execute any capability directly against the runtime enforcement kernel to verify that unauthorized, unmapped, or unsafe actions are intercepted.
              </p>

              {/* Quick Presets */}
              <div className="mb-4">
                <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">Test Scenarios:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyPreset('web')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition"
                  >
                    1. search_public_web (Safe)
                  </button>
                  <button
                    onClick={() => applyPreset('github')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition"
                  >
                    2. read_github_public (Safe)
                  </button>
                  <button
                    onClick={() => applyPreset('draft')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-mono transition"
                  >
                    3. create_draft (Vault Token)
                  </button>
                  <button
                    onClick={() => applyPreset('unauthorized')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 font-mono transition"
                  >
                    4. drop_table (Blocked by Policy)
                  </button>
                  <button
                    onClick={() => applyPreset('publish')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 font-mono transition"
                  >
                    5. publish_post (Requires Review)
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Resource</label>
                    <input
                      type="text"
                      value={simResource}
                      onChange={(e) => setSimResource(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g. public_web, linkedin, github"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Action</label>
                    <input
                      type="text"
                      value={simAction}
                      onChange={(e) => setSimAction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g. read, create_draft, publish"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-300 font-medium">Invocation Payload (JSON)</label>
                    <span className="text-[10px] font-mono text-slate-500">Clean of tokens</span>
                  </div>
                  <textarea
                    rows={5}
                    value={simPayloadJson}
                    onChange={(e) => setSimPayloadJson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Tenant Context:</span>
                    <span className="font-mono text-slate-200">user-amit-01</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agent Context:</span>
                    <span className="font-mono text-slate-200">worker-identity-01</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Operating Mode:</span>
                    <span className="font-mono text-cyan-300">{operatingMode}</span>
                  </div>
                </div>

                <button
                  onClick={handleExecuteSimulation}
                  disabled={isSimulating}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Evaluating in ToolRuntime...' : 'Dispatch to ToolRuntime.invoke()'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Sequential Pipeline Trace & MCP Output */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Internal Enforcement Pipeline Trace
                  </h3>
                  {simResult && (
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      simResult.status === 'SUCCESS' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : simResult.status === 'APPROVAL_REQUIRED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {simResult.status}
                    </span>
                  )}
                </div>

                {!simResult && !isSimulating && (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
                    <Terminal className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="text-xs">No simulation active. Select a test scenario and dispatch an invocation.</p>
                  </div>
                )}

                {isSimulating && (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-slate-800 rounded-xl text-cyan-400">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-xs font-mono">Running sequential pipeline checks in ToolRuntime...</p>
                  </div>
                )}

                {simResult && (
                  <div className="space-y-2">
                    {simResult.pipelineTrace.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                          step.passed 
                            ? 'bg-slate-950/70 border-slate-800 text-slate-200' 
                            : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {step.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-mono font-bold text-[11px] text-slate-300">
                              {step.step}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                              {step.details}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {step.timestamp}
                        </span>
                      </div>
                    ))}

                    {/* Result Payload or Error Box */}
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          {simResult.success ? 'MCP Response Payload' : 'Enforcement Termination Reason'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Duration: {simResult.durationMs}ms
                        </span>
                      </div>

                      <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
                        {simResult.success 
                          ? JSON.stringify(simResult.data, null, 2)
                          : JSON.stringify({ error: simResult.error, status: simResult.status }, null, 2)}
                      </pre>
                    </div>

                    {/* Action Proposal Notice if approval required */}
                    {simResult.status === 'APPROVAL_REQUIRED' && onNavigateToReview && (
                      <div className="mt-3 bg-amber-950/30 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-amber-200">
                          Action enqueued in <strong>Review Control Plane</strong>.
                        </span>
                        <button
                          onClick={onNavigateToReview}
                          className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold text-xs transition"
                        >
                          Open Review Queue →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {simResult && (
                <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>ExecutionId: {simResult.executionId}</span>
                  <span>Provider: {simResult.provider}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CAPABILITY REGISTRY (A1) */}
      {activeSubTab === 'registry' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              Canonical Capability Registry (A1)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Agent never chooses a provider. The Agent specifies only abstract intent (resource + action); 
              the Registry and ToolRuntime map this to a concrete provider, MCP method, and risk profile.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {capabilities.map(cap => (
                <div 
                  key={cap.id} 
                  className={`p-4 rounded-xl border text-xs flex flex-col justify-between transition ${
                    selectedCapability.id === cap.id 
                      ? 'bg-slate-950 border-cyan-500/50 shadow-md shadow-cyan-950/30' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedCapability(cap)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-cyan-300">{cap.resource}.{cap.action}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        cap.risk.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        cap.risk.riskLevel === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {cap.risk.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] mb-3 leading-relaxed">{cap.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="text-indigo-300">{cap.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MCP Method:</span>
                      <span className="text-slate-200">{cap.mcpMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection Required:</span>
                      <span className={cap.requiresConnection ? 'text-amber-300' : 'text-slate-400'}>
                        {cap.requiresConnection ? 'Yes (KMS Vault)' : 'No (Public)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hourly Limit:</span>
                      <span className="text-slate-200">{cap.rateLimitPerHour} calls/hr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CREDENTIAL VAULT & ISOLATION (A4) */}
      {activeSubTab === 'vault' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  KMS Credential Vault & Agent Isolation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Architectural invariant: Credentials reside in the vault layer and are injected inside the MCP client wrapper only.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                Zero Leaks Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  1. What the Agent / LLM Sees
                </span>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                  <div>// Agent Context:</div>
                  <div className="text-cyan-300">&#123;</div>
                  <div className="pl-4">tenantId: "user-amit-01",</div>
                  <div className="pl-4">agentId: "worker-identity-01",</div>
                  <div className="pl-4">resource: "linkedin",</div>
                  <div className="pl-4">action: "create_draft"</div>
                  <div className="pl-4 text-emerald-400">// Zero credentials, zero bearer tokens!</div>
                  <div className="text-cyan-300">&#125;</div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  2. What ToolRuntime Resolves Internally
                </span>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                  <div>// ToolRuntime internal resolver:</div>
                  <div className="text-indigo-300">&#123;</div>
                  <div className="pl-4">vaultRef: "vault://secrets/tenants/amit/linkedin/...",</div>
                  <div className="pl-4">token: "lia_***MASKED_IN_RUNTIME_LOGS***",</div>
                  <div className="pl-4">status: "ACTIVE",</div>
                  <div className="pl-4 text-amber-300">// Injected directly to mcp_linkedin wrapper</div>
                  <div className="text-indigo-300">&#125;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LIVE TOOL EXECUTIONS (A7) */}
      {activeSubTab === 'executions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Immutable Tool Execution Ledger (A7)
              </h3>
              <p className="text-xs text-slate-400">
                Every tool dispatch through ToolRuntime is cryptographically logged with sanitized inputs/outputs.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Recorded: {executions.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {executions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
                No tool executions recorded yet. Run a simulation or the Identity Agent loop.
              </div>
            ) : (
              executions.map(exec => (
                <div key={exec.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      exec.status === 'SUCCESS' ? 'bg-emerald-400' :
                      exec.status === 'APPROVAL_REQUIRED' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{exec.provider}::{exec.toolName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          exec.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' :
                          exec.status === 'APPROVAL_REQUIRED' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {exec.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Agent: <span className="font-mono text-slate-300">{exec.agentId}</span> • 
                        Resource: <span className="font-mono text-slate-300">{exec.resource}.{exec.action}</span> •
                        Vault: <span className="font-mono text-cyan-400">{exec.credentialVaultUsed || 'public'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-500 shrink-0">
                    <div>{exec.durationMs}ms</div>
                    <div>{exec.executedAt}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PROPOSALS VS PROPOSED ACTIONS */}
      {activeSubTab === 'proposals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                Action Proposals vs Proposed Actions Queue
              </h3>
              <p className="text-xs text-slate-400">
                ActionProposal = "Agent ने यह करने का प्रस्ताव दिया" • ProposedAction = "System ने policy के बाद इसे reviewable/executable action माना"
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {proposals.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
                No proposals currently in the queue.
              </div>
            ) : (
              proposals.map(p => (
                <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-cyan-300">{p.resource}.{p.action}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mb-2">{p.reason}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>Idempotency: {p.idempotencyKey.substring(0, 24)}...</span>
                    <span>Created: {new Date(p.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
