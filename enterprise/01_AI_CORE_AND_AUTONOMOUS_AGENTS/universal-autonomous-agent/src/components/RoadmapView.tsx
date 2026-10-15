import React from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Repeat, 
  Sparkles,
  Layers,
  Code2
} from 'lucide-react';
import { ROADMAP_PHASES } from '../data/mockData';

export const RoadmapView: React.FC = () => {
  const getPhaseIcon = (phase: number) => {
    switch (phase) {
      case 1:
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 2:
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 3:
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 4:
        return <Repeat className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current_live':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active in Sandbox (Phase 1 Live)
          </span>
        );
      case 'next_phase':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Next Milestone (Weeks 3-4)
          </span>
        );
      case 'planned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            Planned Architecture
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            AGI Horizon Vision
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Evolution Trajectory</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 font-medium">Multi-Tenant AGI Framework Roadmap</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">From Sandbox Core to Universal Autonomous Swarms</h2>
        <p className="text-sm text-slate-400 mt-1">
          Full developmental roadmap mapping current Phase 1 capabilities (Orchestrator, LangGraph DAG, MCP Tools, HITL Gateways) into future distributed memory, multi-agent swarms, and self-improving code synthesis.
        </p>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {ROADMAP_PHASES.map((phase) => (
          <div 
            key={phase.phase} 
            className={`bg-slate-900 border rounded-xl p-6 transition-all ${
              phase.status === 'current_live'
                ? 'border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  phase.status === 'current_live'
                    ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {getPhaseIcon(phase.phase)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Phase {phase.phase} • {phase.timeline}
                    </span>
                    {getStatusBadge(phase.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{phase.name}</h3>
                </div>
              </div>

              <span className="text-xs font-medium text-slate-400 italic">
                "{phase.tagline}"
              </span>
            </div>

            {/* Content: Core Pillars & Technical Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              {/* Core Pillars */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Functional Capabilities</span>
                </h4>
                <ul className="space-y-2">
                  {phase.corePillars.map((pillar, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <span>{pillar}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Stack & Specs */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Technical Architecture & Stack</span>
                </h4>
                <ul className="space-y-2">
                  {phase.technicalSpecs.map((spec, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start space-x-2 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
