import React, { useState } from 'react';
import { DEATH_VALLEY_STAGES_DATA } from '../data/sampleLenses';
import { DeathValleyStage } from '../types/blueprint';
import { 
  Skull, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Activity, 
  TrendingUp, 
  Flame, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface DeathValleySimulatorProps {
  activeLanguage: 'en' | 'hi';
}

export const DeathValleySimulator: React.FC<DeathValleySimulatorProps> = ({ activeLanguage }) => {
  const [selectedStage, setSelectedStage] = useState<DeathValleyStage>('A');
  const [stressSimulated, setStressSimulated] = useState<string | null>(null);

  const currentStageData = DEATH_VALLEY_STAGES_DATA.find(s => s.stage === selectedStage) || DEATH_VALLEY_STAGES_DATA[0];

  const handleRunStressTest = (type: string) => {
    setStressSimulated(type);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 border border-rose-600/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-rose-400" />
              SECTION XX &bull; MANDATORY RESILIENCE SYSTEM
            </span>
            <span className="text-stone-400 text-xs font-mono">
              12-MONTH SURVIVAL PROTOCOL
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? 'डेथ वैली लचीलापन और अस्तित्व आर्किटेक्चर ☠️' : 'Death Valley Architecture & Survival Modes ☠️'}
          </h2>
          <p className="text-stone-300 text-sm">
            {activeLanguage === 'hi'
              ? '“Design everything. Build only what the current stage can support.” यदि अगले 12 महीने परिस्थितियाँ विपरीत हों, तो भी यह सजीव तंत्र जीवित रहेगा।'
              : '“Design everything. Build only what the current stage can support.” Ensuring the platform survives extreme economic downturns, cloud price spikes, and scale crises.'}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-stone-950 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Active Runway: {currentStageData.runwayMonths}</span>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DEATH_VALLEY_STAGES_DATA.map((stage) => {
          const isSelected = selectedStage === stage.stage;
          return (
            <button
              key={stage.stage}
              id={`stage-btn-${stage.stage}`}
              onClick={() => {
                setSelectedStage(stage.stage);
                setStressSimulated(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-rose-400">
                  STAGE {stage.stage}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                  {stage.status}
                </span>
              </div>
              <div className="font-bold text-sm text-stone-100">
                {stage.name.split('—')[1]?.trim() || stage.name}
              </div>
              <div className="text-[11px] text-stone-400 truncate mt-1">
                {stage.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Operational Rules & Priorities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-mono text-rose-400 font-semibold uppercase">
                  Current Operational Profile: Stage {currentStageData.stage}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {currentStageData.name}
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  {currentStageData.tagline}
                </p>
              </div>
            </div>

            {/* Trigger Conditions */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-stone-400 uppercase">
                Stage Activation Trigger Conditions:
              </div>
              <div className="space-y-1.5">
                {currentStageData.triggerConditions.map((cond, cIdx) => (
                  <div key={cIdx} className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 flex items-center gap-2">
                    <span className="text-rose-400 font-mono font-bold">&gt;</span>
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Crisis Priority Hierarchy */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Survival Priority Hierarchy (Immutable Ordering)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStageData.survivalPriority.map((prio, pIdx) => (
                  <div key={pIdx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 font-mono">
                    {prio}
                  </div>
                ))}
              </div>
            </div>

            {/* Allowed vs Frozen Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active & Funded Components</span>
                </div>
                <div className="space-y-1">
                  {currentStageData.allowedComponents.map((item, aIdx) => (
                    <div key={aIdx} className="text-xs text-stone-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-rose-500/30 space-y-2">
                <div className="text-xs font-mono text-rose-400 uppercase font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Frozen / Deferred Components</span>
                </div>
                <div className="space-y-1">
                  {currentStageData.frozenComponents.map((item, fIdx) => (
                    <div key={fIdx} className="text-xs text-stone-400 flex items-start gap-1.5">
                      <span className="text-rose-400 mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Automated Kill Switch Policy */}
            <div className="p-4 rounded-xl bg-stone-950 border border-rose-800/40 space-y-1.5">
              <div className="text-xs font-mono text-rose-400 uppercase font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Automated Fail-Safe / Kill Switch Policy</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-mono">
                {currentStageData.killSwitchPolicy}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Stress Test Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <span>12-Month Resilience Stress Tester</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Simulate catastrophic external shocks to observe automated organism survival reflexes.
              </p>
            </div>

            <div className="space-y-3">
              <button
                id="stress-test-llm-surge"
                onClick={() => handleRunStressTest('llm_surge')}
                className="w-full p-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-200">1. AI Compute Spike (10x Token Cost)</div>
                  <div className="text-[11px] text-stone-400">Viral content creates surge in LLM summarizer calls</div>
                </div>
                <Zap className="w-4 h-4 text-amber-400" />
              </button>

              <button
                id="stress-test-runway-drop"
                onClick={() => handleRunStressTest('runway_drop')}
                className="w-full p-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-200">2. Sudden Runway Shock (&lt; 4 Months)</div>
                  <div className="text-[11px] text-stone-400">Revenue decline triggers emergency priority preservation</div>
                </div>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </button>

              <button
                id="stress-test-extension-ban"
                onClick={() => handleRunStressTest('extension_ban')}
                className="w-full p-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-200">3. Host Browser Store Delisting</div>
                  <div className="text-[11px] text-stone-400">Proprietary store blocks extension distribution</div>
                </div>
                <Lock className="w-4 h-4 text-purple-400" />
              </button>
            </div>

            {/* Stress Test Reaction Output */}
            {stressSimulated && (
              <div className="p-4 rounded-xl bg-stone-950 border border-rose-500/40 space-y-3 animate-fadeIn">
                <div className="text-xs font-mono text-rose-400 uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Automated System Reaction Triggered:</span>
                </div>

                {stressSimulated === 'llm_surge' && (
                  <div className="space-y-1.5 text-xs text-stone-300 font-mono">
                    <div className="text-emerald-400">✓ Stage B Auto-Throttle activated.</div>
                    <div>&bull; Edge Semantic Redis Cache locked to 90%+ TTL.</div>
                    <div>&bull; Fallback to static verified MoSPI/PubMed database lookup.</div>
                    <div>&bull; Token invoice capped: $0 variable overage.</div>
                  </div>
                )}

                {stressSimulated === 'runway_drop' && (
                  <div className="space-y-1.5 text-xs text-stone-300 font-mono">
                    <div className="text-rose-400">✓ Stage C Crisis Protocol activated.</div>
                    <div>&bull; Priority 1 (Soul) & Priority 2 (User data export) fully preserved.</div>
                    <div>&bull; All secondary marketplace daemons paused.</div>
                    <div>&bull; Operating cost reduced by 82% in &lt; 30 seconds.</div>
                  </div>
                )}

                {stressSimulated === 'extension_ban' && (
                  <div className="space-y-1.5 text-xs text-stone-300 font-mono">
                    <div className="text-sky-400">✓ Decentralized Surface Protocol activated.</div>
                    <div>&bull; Users seamlessly served via native Progressive Web App (PWA).</div>
                    <div>&bull; Sovereign Desktop Proxy activated.</div>
                    <div>&bull; Zero platform lock-in constraint preserved.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
