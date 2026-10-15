import React, { useState, useRef, useEffect } from 'react';
import { WorkflowItem, INITIAL_WORKFLOWS } from '../data/workspaceData';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  Activity, 
  Plus, 
  Settings,
  Code2,
  FileCheck
} from 'lucide-react';
import { useToast } from './Toast';

export const AutomationModule: React.FC = () => {
  const { showToast } = useToast();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-1');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState<number>(-1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const activeWf = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const stepPayloads: Record<string, Record<number, any>> = {
    'wf-1': {
      0: {
        step: 'Extract & Anonymize Resume',
        input: 'Raw PDF text of Devashish Verma (5.5 yrs exp)',
        output: {
          candidateId: 'cand_***42',
          anonymizedToken: 'ANON_TOKEN_8921_BLIND',
          name: '[MASKED_IDENTITY]',
          gender: '[MASKED_DEMOGRAPHIC]',
          collegeTier: '[MASKED_EDUCATION]',
          skills: ['Python', 'FastAPI', 'Docker', 'Postgres', 'Redis', 'PyTorch', 'Kubernetes'],
          experienceYears: 5.5
        }
      },
      1: {
        step: 'Domain Skill & Experience Scoring',
        input: 'Candidate skills + Job Requirements (Senior AI Platform Engineer)',
        output: {
          mandatorySkillsRequired: ['Python', 'FastAPI', 'PyTorch', 'Postgres', 'Docker'],
          mandatoryMatched: ['Python', 'FastAPI', 'PyTorch', 'Postgres', 'Docker'],
          skillCoverageRatio: 1.0,
          experienceFitRatio: 1.0,
          calculatedDomainScore: 94.8,
          screeningVerdict: 'AUTO_PASS_THRESHOLD_MET'
        }
      },
      2: {
        step: 'GitHub & Project Verification',
        input: 'Candidate public repositories',
        output: {
          mcpServer: 'integrations/mcp/github',
          verifiedRepositories: 2,
          qualityScore: 'High (0 security leaks, pytest suites passing)',
          mcpStatus: 200
        }
      },
      3: {
        step: 'Automated Interview Scheduling',
        input: 'Candidate phone masked token + Calendar link',
        output: {
          transport: 'WhatsApp MCP API',
          templateId: 'WH_RECRUIT_492',
          slotReserved: 'Tomorrow at 4:00 PM IST',
          deliveryConfirmed: true
        }
      }
    },
    'wf-2': {
      0: {
        step: 'Generate SOC2 Audit Record',
        input: 'Candidate decision event',
        output: {
          auditId: 'soc2_audit_98124',
          immutableHash: 'sha256:4f8e...91b2',
          tokenBlinded: true,
          modelSignature: 'deterministic_domain_engine_v2'
        }
      },
      1: {
        step: 'Push Scorecard to Greenhouse',
        input: 'Candidate Scorecard',
        output: {
          atsTarget: 'Greenhouse API v1',
          syncedStatus: 'Advance to Technical Screen',
          scorecardAttached: true,
          httpStatus: 201
        }
      }
    }
  };

  const handleTestRun = () => {
    if (isRunningPipeline) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsRunningPipeline(true);
    setPipelineProgress(0);
    setActiveStepIndex(0);

    let currentStep = 0;
    const totalSteps = activeWf.steps.length;

    timerRef.current = setInterval(() => {
      currentStep += 1;
      if (currentStep >= totalSteps) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setPipelineProgress(totalSteps);
        setIsRunningPipeline(false);
        showToast(
          'Workflow Simulation Completed',
          `All ${totalSteps} steps executed with durable state persistence.`,
          'success'
        );
      } else {
        setPipelineProgress(currentStep);
        setActiveStepIndex(currentStep);
      }
    }, 700);
  };

  const currentPayload = stepPayloads[activeWf.id]?.[activeStepIndex] || {
    step: activeWf.steps[activeStepIndex]?.title,
    output: { status: 'Awaiting execution' }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>SERVICE: services/workflow-engine</span>
            <span>·</span>
            <span>TEMPORAL / CADENCE DURABLE ORCHESTRATION</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Hiring Workflows &amp; Schedules</h2>
          <p className="text-xs text-slate-400">
            Resilient event-driven automation chaining resume parsing, candidate scoring, and multi-channel outreach.
          </p>
        </div>

        <button
          onClick={handleTestRun}
          disabled={isRunningPipeline}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          {isRunningPipeline ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Executing Step {Math.min(pipelineProgress + 1, activeWf.steps.length)}...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Candidate Event</span>
            </>
          )}
        </button>
      </div>

      {/* Workflows Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {workflows.map((wf) => {
          const isSelected = wf.id === selectedWorkflowId;
          return (
            <button
              key={wf.id}
              onClick={() => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
                setIsRunningPipeline(false);
                setSelectedWorkflowId(wf.id);
                setPipelineProgress(-1);
                setActiveStepIndex(0);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex-1 ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{wf.name}</span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {wf.runsToday} runs today
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{wf.trigger}</p>
            </button>
          );
        })}
      </div>

      {/* Visual Workflow Pipeline DAG */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              TRIGGER EVENT
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">{activeWf.trigger}</h4>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            DURABLE EXECUTION GUARANTEE
          </span>
        </div>

        {/* Steps Pipeline Horizontal Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {activeWf.steps.map((step, idx) => {
            const isCompleted = pipelineProgress > idx;
            const isCurrent = pipelineProgress === idx;
            const isSelected = activeStepIndex === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/80'
                    : isSelected
                    ? 'bg-slate-800 border-indigo-500'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">Step {idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <h5 className="font-semibold text-xs text-white mt-2">{step.title}</h5>
                <p className="text-[11px] font-mono text-emerald-300 mt-1">{step.executor}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.details}</p>
              </div>
            );
          })}
        </div>

        {/* Live Step State Inspector & JSON Payload */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                Step #{activeStepIndex + 1} Execution State &amp; Immutable Checkpoint:
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Executor: {activeWf.steps[activeStepIndex]?.executor}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block mb-1">Incoming Input:</span>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-slate-300">
                {currentPayload.input || 'Initial trigger payload'}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block mb-1">Step Checkpoint Data (JSON):</span>
              <pre className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-emerald-300 text-[11px] overflow-x-auto max-h-36">
                {JSON.stringify(currentPayload.output, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
