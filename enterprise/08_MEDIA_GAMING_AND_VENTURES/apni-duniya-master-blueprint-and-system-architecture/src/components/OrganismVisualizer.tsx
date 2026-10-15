import React, { useState } from 'react';
import { ORGAN_NODES } from '../data/canonicalBlueprint';
import { OrganNode } from '../types/blueprint';
import { 
  Cpu, 
  Flame, 
  Heart, 
  Activity, 
  ShieldCheck, 
  Users, 
  Radio, 
  Sparkles, 
  Compass,
  ArrowRight,
  Database,
  Lock,
  Layers
} from 'lucide-react';

interface OrganismVisualizerProps {
  activeLanguage: 'en' | 'hi';
}

export const OrganismVisualizer: React.FC<OrganismVisualizerProps> = ({ activeLanguage }) => {
  const [selectedOrganId, setSelectedOrganId] = useState<string>('organ-brain');
  const selectedOrgan = ORGAN_NODES.find(o => o.id === selectedOrganId) || ORGAN_NODES[0];

  const getOrganIcon = (type: OrganNode['type']) => {
    switch (type) {
      case 'soul': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'brain': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'body': return <Layers className="w-5 h-5 text-blue-400" />;
      case 'nervous': return <Radio className="w-5 h-5 text-indigo-400" />;
      case 'citizens': return <Users className="w-5 h-5 text-emerald-400" />;
      case 'heart': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'immune': return <ShieldCheck className="w-5 h-5 text-yellow-400" />;
      case 'culture': return <Compass className="w-5 h-5 text-teal-400" />;
      default: return <Activity className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-cyan-950/40 border border-cyan-500/30 p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
              THE LIVING ORGANISM MODEL
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? 'सजीव तकनीकी अंग तंत्र (The Complete Living Organism)' : 'Biological & Technical Organ Architecture'}
          </h2>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            {activeLanguage === 'hi'
              ? 'Apni Duniya एक सॉफ्टवेयर प्रोग्राम नहीं, बल्कि एक स्व-विनियमित सजीव सभ्यता अंग (Living Organism) है जहाँ प्रत्येक तकनीकी अंग का एक विशिष्ट जैविक कार्य है।'
              : 'Every subsystem maps to a biological organ. The Soul anchors the DNA, the Brain contextualizes, the Heart pumps value, and the Immune System defends truth.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Visual Map & Organ Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Organism Architecture Map */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 px-1">
            Interactive Organ Map (Click to Inspect)
          </h3>

          <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            {/* Flow representation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ORGAN_NODES.map((organ) => {
                const isSelected = selectedOrganId === organ.id;
                return (
                  <button
                    key={organ.id}
                    id={`organ-btn-${organ.id}`}
                    onClick={() => setSelectedOrganId(organ.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-stone-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                        : 'bg-stone-900/60 border-stone-800 hover:bg-stone-900 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                          {getOrganIcon(organ.type)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">
                            {organ.name}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            {organ.hindiName}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2">
                      {organ.description}
                    </p>

                    <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono text-stone-400">
                      <span>Telemetry: Active</span>
                      <span className="text-cyan-400">Inspect &rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Signal Flow Diagram */}
            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                Continuous Biological Signal Flow:
              </div>
              <div className="text-xs font-mono text-stone-300 leading-relaxed overflow-x-auto py-1">
                SOUL ➔ BRAIN (Intelligence) ➔ BODY (Injector) ➔ CITIZENS ➔ HEART (Economy) ➔ IMMUNE SYSTEM ➔ CULTURE ↺
              </div>
            </div>
          </div>
        </div>

        {/* Selected Organ Inspector Panel */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 px-1">
            Organ Telemetry & Fail-Safe Hook
          </h3>

          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                  Organ Type: {selectedOrgan.type.toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedOrgan.name}
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  {selectedOrgan.hindiName}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                {getOrganIcon(selectedOrgan.type)}
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              {selectedOrgan.description}
            </p>

            {/* Technical Manifestation */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
              <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Technical Manifestation</span>
              </div>
              <p className="text-xs text-stone-200 font-mono leading-relaxed">
                {selectedOrgan.techManifestation}
              </p>
            </div>

            {/* Inputs and Outputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800 space-y-1">
                <div className="text-[10px] font-mono text-stone-400 uppercase">Inputs (Nutrients)</div>
                {selectedOrgan.inputs.map((inItem, i) => (
                  <div key={i} className="text-xs text-stone-300 flex items-center gap-1">
                    <span className="text-cyan-400">&bull;</span> {inItem}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800 space-y-1">
                <div className="text-[10px] font-mono text-stone-400 uppercase">Outputs (Utility)</div>
                {selectedOrgan.outputs.map((outItem, i) => (
                  <div key={i} className="text-xs text-stone-300 flex items-center gap-1">
                    <span className="text-emerald-400">&bull;</span> {outItem}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Metrics */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-stone-400 uppercase">Live Subsystem Metrics</div>
              <div className="grid grid-cols-3 gap-2">
                {selectedOrgan.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[10px] text-stone-400 truncate">{metric.label}</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fail-Safe Invariant Rule */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/30 space-y-1">
              <div className="text-[11px] font-mono text-rose-400 uppercase font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Organ Fail-Safe Invariant Rule</span>
              </div>
              <p className="text-xs text-rose-200 leading-relaxed">
                {selectedOrgan.failSafeRule}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
