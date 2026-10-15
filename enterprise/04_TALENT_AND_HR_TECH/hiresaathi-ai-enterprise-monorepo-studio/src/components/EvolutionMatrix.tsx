import React, { useState } from 'react';
import { 
  EVOLUTION_STAGES, 
  ESSENTIAL_FILES_TABLE, 
  EvolutionStage 
} from '../data/stagesData';
import { 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  AlertCircle, 
  ShieldCheck, 
  FileCode2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const EvolutionMatrix: React.FC<{ hinglishMode?: boolean }> = ({ hinglishMode = false }) => {
  const [selectedStageNumber, setSelectedStageNumber] = useState<number>(1);

  // Interactive "Should We Split?" Decision Calculator
  const [teamSize, setTeamSize] = useState<number>(12);
  const [deploysPerDay, setDeploysPerDay] = useState<number>(5);
  const [aiHeavyWorkload, setAiHeavyWorkload] = useState<number>(40);
  const [multiRegionNeeded, setMultiRegionNeeded] = useState<boolean>(false);

  // Calculate recommendation
  const calculateRecommendation = () => {
    if (multiRegionNeeded || teamSize >= 150) {
      return {
        stage: 4,
        title: 'Stage 4: Enterprise Multi-Region Platform',
        verdict: 'Decouple into cell-based regional pods and full microservices.',
        rationale: 'With enterprise data residency needs or 150+ engineers, tenant isolation and cell deployment are strictly required.'
      };
    }
    if (teamSize >= 40 || deploysPerDay >= 20) {
      return {
        stage: 3,
        title: 'Stage 3: Selective Microservices',
        verdict: 'Selectively decouple AI Gateway and Agent Runtime, retain Monorepo.',
        rationale: 'Multiple independent domain teams need autonomous release cadences without blocking core web apps.'
      };
    }
    if (aiHeavyWorkload >= 30 || teamSize >= 10) {
      return {
        stage: 2,
        title: 'Stage 2: Growth with Asynchronous Workers',
        verdict: 'Stay in Modular Monolith, but offload AI parsing to Celery / Redis workers.',
        rationale: 'Do NOT break into microservices yet! Simply isolate long-running resume extraction and vector calculations into background queue workers.'
      };
    }
    return {
      stage: 1,
      title: 'Stage 1: Modular Monolith (Recommended MVP)',
      verdict: 'Keep 1 backend service, 1 database, shared types, fast shipping.',
      rationale: 'Minimal infrastructure complexity. A small team will move 5x faster in a single modular codebase.'
    };
  };

  const rec = calculateRecommendation();
  const currentStage = EVOLUTION_STAGES.find(s => s.stageNumber === selectedStageNumber) || EVOLUTION_STAGES[0];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span>SCALING STRATEGY: 5 TO 500 DEVELOPERS</span>
            <span>·</span>
            <span>PRAGMATIC EVOLUTION</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Company Badi Hone Par Architecture Kaise Evolve Karega?
          </h2>
          <p className="text-xs text-slate-400">
            {hinglishMode
              ? 'Microservices ki taraf migration tabhi honi chahiye jab uska operational benefit uski complexity se zyada ho.'
              : 'Evolution happens in deliberate stages based on engineering throughput and team autonomy, not fashion.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
            4 Pragmatic Milestones
          </span>
        </div>
      </div>

      {/* 4 Stages Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {EVOLUTION_STAGES.map((stg) => {
          const isSelected = stg.stageNumber === selectedStageNumber;
          return (
            <div
              key={stg.stageNumber}
              onClick={() => setSelectedStageNumber(stg.stageNumber)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-7 h-7 rounded-lg text-xs font-mono flex items-center justify-center font-bold ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {stg.stageNumber}
                </span>
                <span className="text-[11px] font-mono text-indigo-300">{stg.headcountRange}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{stg.name}</h3>
              <p className="text-xs font-medium text-indigo-400 mt-0.5">{stg.subtitle}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {hinglishMode ? stg.descriptionHindi : stg.descriptionEnglish}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Cost: {stg.infrastructureCost}</span>
                <span className="text-indigo-400">Details &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Deep-Dive Details */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{currentStage.name} — {currentStage.subtitle}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {currentStage.headcountRange}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentStage.architectureType}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-500">Cloud Cost:</span>
              <p className="text-slate-200">{currentStage.infrastructureCost}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Complexity:</span>
              <p className="text-slate-200">{currentStage.deploymentComplexity}</p>
            </div>
          </div>
        </div>

        {/* Characteristics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Architectural Characteristics
            </h4>
            <ul className="space-y-2">
              {currentStage.characteristics.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Key Engineering Milestones
            </h4>
            <ul className="space-y-2">
              {currentStage.keyMilestones.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>

            {/* When to Graduate */}
            <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">When to evolve to next stage: </span>
                <span className="text-amber-300/90">{currentStage.whenToGraduate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive "Should We Split?" Decision Calculator */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Architecture Decision Calculator: Should HireSaathi Split a Service?
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Adjust your current company parameters to receive an objective, anti-hype architectural recommendation.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Engineering Team Size</span>
              <span className="font-mono font-bold text-indigo-400">{teamSize} Devs</span>
            </div>
            <input
              type="range"
              min="1"
              max="300"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Deployments Per Day</span>
              <span className="font-mono font-bold text-indigo-400">{deploysPerDay} Deploys</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={deploysPerDay}
              onChange={(e) => setDeploysPerDay(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>AI Heavy Batch Workloads</span>
              <span className="font-mono font-bold text-indigo-400">{aiHeavyWorkload}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={aiHeavyWorkload}
              onChange={(e) => setAiHeavyWorkload(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <span className="block text-xs text-slate-300 mb-2">Multi-Region Compliance (India/EU)</span>
            <button
              onClick={() => setMultiRegionNeeded(!multiRegionNeeded)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                multiRegionNeeded
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {multiRegionNeeded ? 'Required (EU AI Act & Data Residency)' : 'Not Required Yet (Single Region)'}
            </button>
          </div>
        </div>

        {/* Calculated Result Output */}
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                ENGINEERING VERDICT:
              </span>
              <span className="text-sm font-bold text-white">{rec.title}</span>
            </div>
            <p className="text-xs text-emerald-300 font-medium mt-1">{rec.verdict}</p>
            <p className="text-xs text-slate-400 mt-1">{rec.rationale}</p>
          </div>

          <button
            onClick={() => setSelectedStageNumber(rec.stage)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-sm transition-colors"
          >
            Inspect Stage {rec.stage} Blueprint &rarr;
          </button>
        </div>
      </div>

      {/* Essential Files Table from Prompt */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white">
            Kaun-Si Files Sabse Zyada Important Hongi?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key root configuration and architectural contracts for scalable team collaboration.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">File / Path</th>
                <th className="py-2.5 px-3">Responsibility</th>
                <th className="py-2.5 px-3">Lifecycle Stage</th>
                <th className="py-2.5 px-3">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {ESSENTIAL_FILES_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-indigo-300">
                    {row.file}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {row.responsibility}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {row.stage}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      row.priority === 'Critical' 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}>
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
