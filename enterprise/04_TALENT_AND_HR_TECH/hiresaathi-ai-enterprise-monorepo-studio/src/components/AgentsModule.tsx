import React, { useState, useRef, useEffect } from 'react';
import { AgentItem, INITIAL_AGENTS } from '../data/workspaceData';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Sliders, 
  Terminal, 
  ArrowRight,
  Shield,
  Activity,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useToast } from './Toast';

export const AgentsModule: React.FC = () => {
  const { showToast } = useToast();
  const [agents, setAgents] = useState<AgentItem[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-recruiter');
  const [taskPrompt, setTaskPrompt] = useState(
    'Audit candidate Aarav Sharma against Senior AI Platform Engineer job and verify GitHub repo artifacts.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<{
    step: string;
    detail: string;
    type: 'think' | 'tool' | 'output';
  }[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const presetGoals = [
    'Audit Aarav Sharma against Senior AI Platform Engineer requirements',
    'Execute anti-bias blinding check on 5 latest applicants',
    'Scan HuggingFace open-source contributors for PyTorch talent',
    'Draft WhatsApp assessment reminder with zero demographic bias'
  ];

  const handleRunAgent = () => {
    setIsRunning(true);
    setExecutionSteps([]);

    const stepsTimeline = [
      {
        step: 'Agent Reasoning Engine Initialized',
        detail: `Loaded model: ${activeAgent.model}. Bound tools: [${activeAgent.boundMcpTools.join(', ')}]. Verification temperature: 0.1 (low variance).`,
        type: 'think' as const
      },
      {
        step: 'Tool Invocation: GitHub Profiler MCP',
        detail: 'Queried candidate repositories: found distributed-llm-router (382 stars) and mcp-postgres-cache (94 stars). High code quality verified.',
        type: 'tool' as const
      },
      {
        step: 'Tool Invocation: Postgres Candidate DB MCP',
        detail: 'Retrieved masked talent profile cand_***42. Verified 6.5 years production engineering experience. Anti-bias check passed.',
        type: 'tool' as const
      },
      {
        step: 'Synthesis & Recommendation Generated',
        detail: 'Candidate Aarav Sharma is a 94.8% match for Senior AI Platform Engineer. Recommendation: Proceed to Technical Screen. Drafted WhatsApp notification template.',
        type: 'output' as const
      }
    ];

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    stepsTimeline.forEach((item, index) => {
      const tid = setTimeout(() => {
        setExecutionSteps(prev => [...prev, item]);
        if (index === stepsTimeline.length - 1) {
          setIsRunning(false);
          setAgents(prev => prev.map(a => a.id === activeAgent.id ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a));
          showToast('Agent Task Completed', `${activeAgent.name} concluded ReAct reasoning with confidence ${activeAgent.confidenceScore}%.`, 'success');
        }
      }, (index + 1) * 600);
      timeoutsRef.current.push(tid);
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>RUNTIME: services/agent-runtime</span>
            <span>·</span>
            <span>ORCHESTRATION: ReAct Loops + MCP Tools</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Autonomous AI Agent Fleet</h2>
          <p className="text-xs text-slate-400">
            Dedicated recruitment and workflow agents equipped with approved tool bindings and memory states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-950/70 text-amber-300 border border-amber-800/80">
            {agents.length} Enterprise Agents Online
          </span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => {
                setSelectedAgentId(agent.id);
                setExecutionSteps([]);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-300">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {agent.status.toUpperCase()}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-white mt-2.5">{agent.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[150px]">{agent.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasks Completed:</span>
                  <span className="font-mono text-amber-300 font-bold">{agent.tasksCompleted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Inspector & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Config (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">{activeAgent.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activeAgent.model}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-400 font-mono font-bold">{activeAgent.confidenceScore}%</span>
              <p className="text-[10px] text-slate-500">Confidence</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              System Prompt &amp; Ethical Guardrails:
            </label>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
              {activeAgent.systemPrompt}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Bound MCP Tools ({activeAgent.boundMcpTools.length}):
            </label>
            <div className="space-y-1.5">
              {activeAgent.boundMcpTools.map((tool) => (
                <div
                  key={tool}
                  className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-amber-300">{tool}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">AUTHORIZED</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Last Telemetry Action:</span>
            <p className="text-xs text-slate-400 mt-1 italic">&quot;{activeAgent.lastAction}&quot;</p>
          </div>
        </div>

        {/* Live Execution Sandbox (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Agent Execution Sandbox</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Dispatch a high-level goal to the agent and observe real-time ReAct loop reasoning.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Task Prompt / Mission:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                placeholder="Give task instructions to agent..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleRunAgent}
                disabled={isRunning}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Loop...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Dispatch Task</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick goal presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {presetGoals.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setTaskPrompt(p)}
                  className="text-[11px] text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-750 transition-colors"
                >
                  {p.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          {/* Execution Trace Stream */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs min-h-[220px] max-h-[300px] overflow-y-auto space-y-2.5">
            {executionSteps.length > 0 ? (
              executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border transition-all animate-fadeIn ${
                    step.type === 'think'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                      : step.type === 'tool'
                      ? 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-300">
                      {step.type}
                    </span>
                    <span>{step.step}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300 pl-2 border-l border-slate-700">
                    {step.detail}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-slate-600 text-center">
                <Bot className="w-8 h-8 mb-2 opacity-40" />
                <span>Click &quot;Dispatch Task&quot; to observe the agent call MCP tools and synthesize results</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
