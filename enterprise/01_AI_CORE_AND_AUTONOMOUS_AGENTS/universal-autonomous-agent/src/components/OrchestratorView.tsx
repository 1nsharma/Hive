import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Brain, 
  Calendar, 
  Send, 
  Check, 
  Layers,
  ArrowRight,
  Clock,
  Fingerprint,
  RefreshCw,
  Sliders,
  Eye,
  Activity,
  ChevronRight
} from 'lucide-react';
import { 
  OrchestratorStage, 
  OrchestratorRunTrace, 
  OperatingMode,
  DigitalTwinProfile,
  PolicyEvaluationResult
} from '../types';

interface OrchestratorViewProps {
  profile: DigitalTwinProfile;
  operatingMode: OperatingMode;
  onRunFullLoop: () => Promise<void>;
  onNavigateToReview: () => void;
  onNavigateToPolicy: () => void;
  onNavigateToToolRuntime?: () => void;
}

export const OrchestratorView: React.FC<OrchestratorViewProps> = ({
  profile,
  operatingMode,
  onRunFullLoop,
  onNavigateToReview,
  onNavigateToPolicy,
  onNavigateToToolRuntime
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(6); // Default to completed state showing full loop
  const [selectedNode, setSelectedNode] = useState<OrchestratorStage>('POLICY_CHECK');

  const stages: {
    id: OrchestratorStage;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    details: {
      input: string;
      operation: string;
      output: string;
      invariant: string;
    };
  }[] = [
    {
      id: 'OBSERVE',
      label: '1. Observe',
      description: 'Perceive web, GitHub, and academic repositories',
      icon: Search,
      color: 'cyan',
      details: {
        input: 'Target queries: "Amit Sharma" + "Agent OS" + "MCP Orchestrator"',
        operation: 'Invokes public_web.search_mentions & github.read_repository via BullMQ cron',
        output: 'Discovered 1 Hacker News thread (85+ points) and 68 new repository stars',
        invariant: 'Read-only external observation with strict rate limits'
      }
    },
    {
      id: 'UNDERSTAND',
      label: '2. Understand',
      description: 'State comparison and identity delta extraction',
      icon: Brain,
      color: 'indigo',
      details: {
        input: 'Previous identity snapshot (Day T-1) + Newly perceived events',
        operation: 'Disambiguates name collisions; calculates delta: "What changed today in Amit’s digital footprint?"',
        output: 'Identified traction surge in MCP streaming latency discussion and speaking invitation',
        invariant: 'Reconciliation score must be >= 90% confidence to mark CONFIRMED'
      }
    },
    {
      id: 'PLAN',
      label: '3. Plan',
      description: 'Formulate structured action proposals',
      icon: Layers,
      color: 'purple',
      details: {
        input: 'Today’s delta + Profile tone (Visionary) + Heuristic weights',
        operation: 'LLM synthesizes draft article on memory recalibration and identifies targeted AI founder prospects',
        output: 'Structured Proposal: Publish LinkedIn article + Send warm intro to Dr. Vikram Sethi',
        invariant: 'LLM outputs structured JSON proposals; LLM justification is NOT permission'
      }
    },
    {
      id: 'POLICY_CHECK',
      label: '4. Policy Gate',
      description: 'Deterministic 3-way permission check (Option A)',
      icon: ShieldCheck,
      color: 'amber',
      details: {
        input: 'Proposed action + Resource (linkedin.publish_post) + 6D Risk Matrix',
        operation: 'Evaluates Whitelist Rule: linkedin.publish_post requires explicit human review (Brand reputation)',
        output: 'VERDICT: ALLOW_WITH_APPROVAL. Idempotency Key issued: idemp_identity_linkedin_1726388',
        invariant: 'Strict Deny-by-default. Actions with external impact MUST pass human confirmation'
      }
    },
    {
      id: 'ACT',
      label: '5. Act / Enqueue',
      description: 'Dispatch safe actions or enqueue to HITL Review',
      icon: Send,
      color: 'emerald',
      details: {
        input: 'Approved execution plan or Pending HITL review token',
        operation: 'Safe drafts saved locally; Outbound post placed in Control Plane Review queue',
        output: 'Control Item #ctrl-8891 enqueued. Review badge incremented on dashboard.',
        invariant: 'Execution token proxies through Credential Vault; zero API key leakage'
      }
    },
    {
      id: 'VERIFY',
      label: '6. Verify',
      description: 'Execution telemetry and health verification',
      icon: CheckCircle2,
      color: 'blue',
      details: {
        input: 'Execution payload receipt and HTTP response signatures',
        operation: 'Verifies external action idempotency key match and state checkpointing',
        output: 'Return status: 200 OK. Compensating rollback snapshot generated.',
        invariant: 'Guarantees exactly-once execution semantics across network retries'
      }
    },
    {
      id: 'LEARN',
      label: '7. Learn',
      description: 'Feedback reflection and heuristic recalibration',
      icon: Sparkles,
      color: 'pink',
      details: {
        input: 'Operator decision telemetry (Approved/Modified) + Inbound post reactions',
        operation: 'Updates Semantic Memory with lesson: "Technical benchmark posts convert 2.4x higher"',
        output: 'Heuristic weights updated: Thoroughness +1, Learning Adaptability +1',
        invariant: 'Self-adjusting heuristics prevent long-running drift'
      }
    }
  ];

  const handleStepThrough = async () => {
    setIsRunning(true);
    setActiveStep(0);
    setSelectedNode('OBSERVE');

    for (let i = 0; i <= 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveStep(i);
      setSelectedNode(stages[i].id);
    }

    await onRunFullLoop();
    setIsRunning(false);
  };

  const selectedStageData = stages.find(s => s.id === selectedNode) || stages[3];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Core Orchestrator & State Machine
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Option B • Execution Brain
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous loop: <code>Observe &rarr; Understand &rarr; Plan &rarr; Policy Gate &rarr; Act &rarr; Verify &rarr; Learn</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isRunning}
              onClick={handleStepThrough}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-purple-950/40 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              {isRunning ? 'Stepping Through Loop...' : 'Execute Identity Loop v0.1'}
            </button>
          </div>
        </div>

        {/* State Machine Node Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCurrent = activeStep === idx && isRunning;
              const isPassed = activeStep >= idx;
              const isSelected = selectedNode === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedNode(stage.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/30'
                      : isPassed
                      ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${
                      isPassed ? 'text-purple-400' : 'text-slate-500'
                    }`} />
                    <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                  </div>

                  <p className="font-bold text-xs text-white truncate">{stage.label.split('. ')[1]}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{stage.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Detail & Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Stage Inspector */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Active Node Inspection
              </span>
              <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                {selectedStageData.label}: {selectedStageData.description}
              </h3>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              Deterministic Stage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Stage Input:
              </span>
              <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                {selectedStageData.details.input}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Core Operation & Tools:
              </span>
              <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                {selectedStageData.details.operation}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Stage Output State:
              </span>
              <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                {selectedStageData.details.output}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Safety & Integrity Invariant:
              </span>
              <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                {selectedStageData.details.invariant}
              </p>
            </div>
          </div>

          {/* Special Stage Callouts */}
          {selectedStageData.id === 'POLICY_CHECK' && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Policy Engine Interception in Action
                </span>
                <button
                  onClick={onNavigateToPolicy}
                  className="text-amber-400 hover:text-amber-300 underline text-[11px] font-semibold flex items-center gap-1"
                >
                  Inspect in Policy Engine Studio &rarr;
                </button>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Notice how the LLM proposed to broadcast the article directly to LinkedIn, but the Deterministic Engine intercepted it with <strong>ALLOW_WITH_APPROVAL</strong> because <code>externalCommunication = 3</code> and <code>reputationImpact = 2</code>. The action cannot proceed until confirmed by Amit in the Review Control Plane.
              </p>
            </div>
          )}

          {selectedStageData.id === 'ACT' && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Human Review Gating & Idempotency
                </span>
                <div className="flex items-center gap-3">
                  {onNavigateToToolRuntime && (
                    <button
                      onClick={onNavigateToToolRuntime}
                      className="text-cyan-400 hover:text-cyan-300 underline text-[11px] font-semibold flex items-center gap-1"
                    >
                      ToolRuntime & MCP &rarr;
                    </button>
                  )}
                  <button
                    onClick={onNavigateToReview}
                    className="text-emerald-400 hover:text-emerald-300 underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    Review Queue &rarr;
                  </button>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The action is stamped with a unique <code>idempotencyKey</code> (<code>idemp_identity_linkedin_1726388</code>). If the network times out or the server restarts, duplicate posting is mathematically impossible.
              </p>
            </div>
          )}
        </div>

        {/* Quick System Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              State Machine Telemetry
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Target Tenant:</span>
                <span className="font-semibold text-white font-mono">{profile.name}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Primary Instance:</span>
                <span className="font-semibold text-cyan-300 font-mono">Identity Agent v0.1</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Scheduler Daemon:</span>
                <span className="font-mono text-emerald-400">BullMQ Daily 08:00 AM</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Memory Storage:</span>
                <span className="font-mono text-slate-300">pgvector + Redis KV</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Audit Status:</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Hash-chained Immutable
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-2 text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              Amit Identity Agent: Production Instance #1
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              This loop is not a one-off script. It runs on the unified Agent OS Runtime. Any new tenant (e.g. <em>DukaanMitra Pvt Ltd</em> or <em>KubeMesh</em>) runs the exact same state machine with their isolated identity and credential vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
