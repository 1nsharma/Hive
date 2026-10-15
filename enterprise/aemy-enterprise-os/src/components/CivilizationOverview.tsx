import React from 'react';
import { ViewMode } from '../types/blueprint';
import { BLUEPRINT_VOLUMES } from '../data/canonicalBlueprint';
import { MASTER_AXIOM } from '../data/soulConstitution';
import { 
  Globe, 
  Flame, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Skull, 
  RotateCw, 
  Database, 
  BookOpen, 
  ArrowRight,
  Gavel,
  Layers,
  Heart
} from 'lucide-react';

interface CivilizationOverviewProps {
  onSelectView: (view: ViewMode) => void;
  activeLanguage: 'en' | 'hi';
}

export const CivilizationOverview: React.FC<CivilizationOverviewProps> = ({
  onSelectView,
  activeLanguage
}) => {
  return (
    <div className="space-y-8">
      {/* Master Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              APNI DUNIYA &bull; MASTER BLUEPRINT v1.0
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-xs font-mono">
              OPERATING CIVILIZATION ARCHITECTURE
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {activeLanguage === 'hi' ? 'अपनी दुनिया — महा-प्रारूप एवं सिस्टम आर्किटेक्चर' : 'Apni Duniya — Canonical System Architecture'}
            </h1>
            <p className="text-stone-400 font-mono text-sm md:text-base">
              “Design everything. Build only what the current stage can support.”
            </p>
          </div>

          <p className="text-base md:text-lg text-stone-200 font-light leading-relaxed">
            {activeLanguage === 'hi'
              ? 'एक ऐसा डिजिटल पारिस्थितिकी तंत्र (Digital Ecosystem) जहाँ लोग केवल उपभोग (Consume) न करें, बल्कि सीखें, सृजन करें, सहयोग करें, कमाएँ और अपनी संप्रभु पहचान (Sovereign Identity) विकसित करें।'
              : 'A self-sustaining digital civilization and platform architecture. Combining an immutable Soul Constitution, living biological organs, a 12-volume canonical specification, and a resilient 4-stage Death Valley survival engine.'}
          </p>

          {/* External Promise & Internal Thesis Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 space-y-1.5">
              <div className="text-xs font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>External Promise</span>
              </div>
              <p className="text-stone-100 font-serif italic text-base">
                “{MASTER_AXIOM.externalPromise}”
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/80 border border-cyan-500/30 space-y-1.5">
              <div className="text-xs font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Fundamental AI Axiom</span>
              </div>
              <p className="text-stone-100 font-serif italic text-base">
                “{MASTER_AXIOM.aiPhilosophy}”
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="cta-constitution-btn"
              onClick={() => onSelectView('constitution')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Explore Soul Constitution v1.0</span>
            </button>

            <button
              id="cta-context-injector-btn"
              onClick={() => onSelectView('context-injector')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Context Injector Sandbox</span>
            </button>

            <button
              id="cta-blueprint-btn"
              onClick={() => onSelectView('blueprint')}
              className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm border border-stone-700 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Browse 12 Volumes (85 Chapters)</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
          <div className="text-xs font-mono text-stone-400 uppercase">Canonical Volumes</div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">12</div>
          <div className="text-[10px] text-stone-500">Vol 01 to 12</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
          <div className="text-xs font-mono text-stone-400 uppercase">Architecture Chapters</div>
          <div className="text-2xl font-extrabold font-mono text-indigo-400">85</div>
          <div className="text-[10px] text-stone-500">Fully Documented</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
          <div className="text-xs font-mono text-stone-400 uppercase">The 9 Prohibitions</div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">9</div>
          <div className="text-[10px] text-stone-500">Hardcoded Invariants</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
          <div className="text-xs font-mono text-stone-400 uppercase">Memory Isolation</div>
          <div className="text-2xl font-extrabold font-mono text-teal-400">3 Worlds</div>
          <div className="text-[10px] text-stone-500">Private/Public/Community</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
          <div className="text-xs font-mono text-stone-400 uppercase">Death Valley Stages</div>
          <div className="text-2xl font-extrabold font-mono text-yellow-400">A &rarr; D</div>
          <div className="text-[10px] text-stone-500">12-Mo Survival Mode</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-1">
          <div className="text-xs font-mono text-stone-400 uppercase">Creator Split</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">70%</div>
          <div className="text-[10px] text-stone-500">Verifiable Revenue</div>
        </div>
      </div>

      {/* The 12 Canonical Volumes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>The 12 Canonical Volumes</span>
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Complete architectural hierarchy of the civilization
            </p>
          </div>

          <button
            onClick={() => onSelectView('blueprint')}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Chapters</span> &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLUEPRINT_VOLUMES.map((vol) => (
            <div
              key={vol.id}
              onClick={() => onSelectView('blueprint')}
              className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-indigo-500/40 hover:bg-stone-900 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">{vol.number}</span>
                  <span className="text-stone-500 group-hover:text-indigo-400 transition-colors">
                    {vol.chapters.length} Chapters &rarr;
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {vol.title}
                </h3>

                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {vol.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex flex-wrap gap-1.5">
                {vol.chapters.slice(0, 2).map((ch) => (
                  <span key={ch.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 text-stone-400 truncate max-w-[140px]">
                    {ch.title}
                  </span>
                ))}
                {vol.chapters.length > 2 && (
                  <span className="text-[10px] font-mono text-stone-500">
                    +{vol.chapters.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Deep Dive Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div 
          onClick={() => onSelectView('organism')}
          className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-cyan-950/40 border border-cyan-500/30 cursor-pointer hover:scale-[1.01] transition-transform space-y-3"
        >
          <Cpu className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Living Organism Model</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Inspect the technical biological organs: Soul, Brain, Body, Heart, Immune System, and Culture.
          </p>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-1 font-semibold">
            Inspect Organism &rarr;
          </div>
        </div>

        <div 
          onClick={() => onSelectView('death-valley')}
          className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-rose-950/40 border border-rose-500/30 cursor-pointer hover:scale-[1.01] transition-transform space-y-3"
        >
          <Skull className="w-6 h-6 text-rose-400" />
          <h3 className="text-lg font-bold text-white">Death Valley Architecture ☠️</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Test Stage A-D resilience protocols and the 12-month survival health check under economic distress.
          </p>
          <div className="text-xs font-mono text-rose-400 flex items-center gap-1 font-semibold">
            Test Resilience Modes &rarr;
          </div>
        </div>

        <div 
          onClick={() => onSelectView('lens-studio')}
          className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-sky-950/40 border border-sky-500/30 cursor-pointer hover:scale-[1.01] transition-transform space-y-3"
        >
          <Terminal className="w-6 h-6 text-sky-400" />
          <h3 className="text-lg font-bold text-white">Lens Studio & CLI</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Simulate <code>npx context-lens create</code> and build custom context lenses with Sandboxed QuickJS Wasm.
          </p>
          <div className="text-xs font-mono text-sky-400 flex items-center gap-1 font-semibold">
            Launch Workbench &rarr;
          </div>
        </div>
      </div>
    </div>
  );
};
