import React from "react";
import { Loader2, CheckCircle2, AlertCircle, Play, Eye, ClipboardCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { AgentStage } from "../types";

interface AgentStatusBoardProps {
  stage: AgentStage;
  query: string;
  errorMessage?: string;
}

interface StepInfo {
  id: AgentStage;
  title: string;
  description: string;
  activeMessage: string;
  icon: React.ReactNode;
}

const STEPS: StepInfo[] = [
  {
    id: "planning",
    title: "1. Strategic Planning",
    description: "Formulates search plans, keywords, and analytical query steps.",
    activeMessage: "Deconstructing user criteria & preparing optimized search schemas...",
    icon: <Play className="w-4 h-4" />
  },
  {
    id: "searching",
    title: "2. Grounded Web Discovery",
    description: "Queries search engines and retrieves verified web references.",
    activeMessage: "Querying Google Search grounding engine & aggregating citations...",
    icon: <Eye className="w-4 h-4" />
  },
  {
    id: "scraping",
    title: "3. Raw Scraping & Extraction",
    description: "Parses target text blocks and extracts records for the requested fields.",
    activeMessage: "Extracting structured schemas from raw page textual content...",
    icon: <ClipboardCheck className="w-4 h-4" />
  },
  {
    id: "validating",
    title: "4. Strict Data Validation",
    description: "Removes duplicates, validates facts, and grades completeness.",
    activeMessage: "Evaluating record credibility, link relevance, and deduplicating...",
    icon: <ShieldCheck className="w-4 h-4" />
  },
  {
    id: "formatting",
    title: "5. Structured Packaging",
    description: "Wraps clean data in the user's chosen format (JSON, CSV, Table).",
    activeMessage: "Assembling valid syntax rows and finalized schema outputs...",
    icon: <ArrowRight className="w-4 h-4" />
  }
];

export default function AgentStatusBoard({ stage, query, errorMessage }: AgentStatusBoardProps) {
  if (stage === "idle") return null;

  const getStepStatus = (stepId: AgentStage, currentStage: AgentStage) => {
    const stageOrder: AgentStage[] = ["planning", "searching", "scraping", "validating", "formatting", "completed"];
    const stepIndex = stageOrder.indexOf(stepId);
    const currentIndex = stageOrder.indexOf(currentStage);

    if (currentStage === "error" && stepId === currentStage) {
      return "error";
    }

    if (currentIndex > stepIndex) return "completed";
    if (currentStage === stepId) return "active";
    return "pending";
  };

  return (
    <div id="agent-status-card" className="bg-slate-900 text-white border border-slate-850 rounded-xl p-6 shadow-xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {stage !== "completed" && stage !== "error" ? (
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            ) : stage === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide uppercase text-indigo-300">Agent Status Board</h3>
            <p className="text-xs text-slate-400 truncate max-w-[280px] md:max-w-md">Target: &quot;{query}&quot;</p>
          </div>
        </div>
        <div className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-full">
          {stage}
        </div>
      </div>

      {stage === "error" && errorMessage && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg flex gap-3 text-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Execution Failed</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="space-y-4">
        {STEPS.map((step) => {
          const status = getStepStatus(step.id, stage);
          return (
            <div
              key={step.id}
              className={`flex gap-4 p-3 rounded-lg transition-all ${
                status === "active"
                  ? "bg-slate-800/80 border border-slate-700/60"
                  : "bg-transparent border border-transparent"
              }`}
            >
              {/* Left Indicator Dot/Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all ${
                    status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : status === "active"
                      ? "bg-indigo-600 text-white border border-indigo-500 animate-pulse"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}
                >
                  {status === "completed" ? "✓" : step.icon}
                </div>
                <div className="w-0.5 h-full bg-slate-800 mt-2 min-h-[12px] last:hidden" />
              </div>

              {/* Step Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-semibold ${
                      status === "completed"
                        ? "text-slate-300"
                        : status === "active"
                        ? "text-indigo-400"
                        : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {status === "active" && (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold animate-pulse">
                      Running
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>

                {status === "active" && (
                  <div className="text-xs text-indigo-200 bg-slate-900/50 p-2.5 rounded-md border border-slate-800 font-mono mt-2">
                    <span className="text-indigo-400 mr-1.5">&gt;</span>
                    {step.activeMessage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
