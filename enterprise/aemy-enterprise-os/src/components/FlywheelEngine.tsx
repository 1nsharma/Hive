import React, { useState } from 'react';
import { 
  RotateCw, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Users, 
  HeartHandshake, 
  Cpu, 
  Globe,
  Compass,
  ArrowRight
} from 'lucide-react';

interface FlywheelEngineProps {
  activeLanguage: 'en' | 'hi';
}

export const FlywheelEngine: React.FC<FlywheelEngineProps> = ({ activeLanguage }) => {
  const [activeFlywheel, setActiveFlywheel] = useState<'product' | 'creation' | 'economic' | 'ecosystem'>('product');
  const [velocity, setVelocity] = useState<number>(3); // 1 to 5 scale

  const flywheels = [
    {
      id: 'product' as const,
      name: 'Product Flywheel',
      hindiName: 'उत्पाद चक्रव्यूह',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500',
      description: 'Intelligence compounds into effortless utility and intuitive context comprehension.',
      steps: [
        { label: 'Better Intelligence', desc: 'Precision semantic parsing and accurate source retrieval' },
        { label: 'Better Experience', desc: 'Non-intrusive context pills with zero lag' },
        { label: 'More Utility', desc: 'Actionable cognitive clarity per session' },
        { label: 'More Users', desc: 'Organic word-of-mouth adoption without ads' },
        { label: 'More Feedback', desc: 'Rich ground-truth signals and edge cases' }
      ]
    },
    {
      id: 'creation' as const,
      name: 'Creation Flywheel',
      hindiName: 'सृजन चक्रव्यूह',
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500',
      description: 'Curious consumers transition into domain lens authors, researchers, and tool builders.',
      steps: [
        { label: 'Users & Citizens', desc: 'Engaged community exploring context' },
        { label: 'Creators & Researchers', desc: 'Domain experts authoring specialized lenses' },
        { label: 'Lenses & Knowledge Packs', desc: 'Rich library of perspectives across subjects' },
        { label: 'More Utility', desc: 'Deep multi-disciplinary comprehension' },
        { label: 'More Users', desc: 'Audience influx seeking trustworthy context' }
      ]
    },
    {
      id: 'economic' as const,
      name: 'Economic Flywheel (Heart)',
      hindiName: 'आर्थिक चक्रव्यूह',
      color: 'from-rose-500 to-pink-600',
      borderColor: 'border-rose-500',
      description: 'Value creation recirculates 70%+ of revenue directly to creators and developers.',
      steps: [
        { label: 'Value Created', desc: 'Real clarity delivered to citizens' },
        { label: 'Transparent Revenue', desc: 'Citizen Pro subscriptions & patron tips' },
        { label: 'Creator & Dev Rewards', desc: '70% direct split payout' },
        { label: 'More Creation', desc: 'Full-time livelihoods for researchers' },
        { label: 'Better Product', desc: 'Timeless software durability' }
      ]
    },
    {
      id: 'ecosystem' as const,
      name: 'Ecosystem Civilization Flywheel',
      hindiName: 'सभ्यता चक्रव्यूह',
      color: 'from-purple-500 to-violet-600',
      borderColor: 'border-purple-500',
      description: 'The holistic macro flywheel connecting infrastructure, culture, and new institutions.',
      steps: [
        { label: 'Product & Intelligence', desc: 'Foundational context runtime' },
        { label: 'Network & Creation', desc: 'Active guilds of builders' },
        { label: 'Economy & Infra', desc: 'Self-sustaining public good servers' },
        { label: 'Institutions & Culture', desc: 'Truth-seeking norms and open standards' },
        { label: 'New Products & Civilization', desc: 'Ambient spatial OS & lifelong learning' }
      ]
    }
  ];

  const currentFlywheel = flywheels.find(f => f.id === activeFlywheel) || flywheels[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-indigo-950/40 to-stone-900 border border-indigo-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              SECTION XXI &bull; 4 INTERCONNECTED FLYWHEELS
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? '4 परस्पर जुड़े चक्रव्यूह (Flywheel Momentum Engine)' : 'The 4 Interconnected Flywheel Systems'}
          </h2>
          <p className="text-stone-300 text-sm">
            Compounding momentum across Product, Creation, Economics, and Civilization without artificial dopamine traps.
          </p>
        </div>

        {/* Velocity Dial */}
        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span>Flywheel Velocity:</span>
            <span className="text-indigo-400 font-bold">{velocity}x Momentum</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={velocity}
            onChange={(e) => setVelocity(parseInt(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Flywheel Selectors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {flywheels.map((fw) => {
          const isSelected = activeFlywheel === fw.id;
          return (
            <button
              key={fw.id}
              id={`flywheel-tab-${fw.id}`}
              onClick={() => setActiveFlywheel(fw.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? `bg-stone-900 ${fw.borderColor} shadow-lg ring-1 ring-indigo-500/40 text-white`
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <div className="font-bold text-sm text-stone-100">
                {fw.name}
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                {fw.hindiName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Flywheel Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Step Cycle */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="text-xl font-bold text-white">
                {currentFlywheel.name}
              </h3>
              <p className="text-stone-300 text-sm mt-1">
                {currentFlywheel.description}
              </p>
            </div>

            {/* Steps in loop */}
            <div className="space-y-3 relative">
              {currentFlywheel.steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">
                        {step.label}
                      </div>
                      <div className="text-xs text-stone-400">
                        {step.desc}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-emerald-400 shrink-0">
                    +{(velocity * 18.5).toFixed(0)}% Speed
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-center text-xs font-mono text-indigo-300">
                ↺ Infinite Compounding Loop (Zero Artificial Friction)
              </div>
            </div>
          </div>
        </div>

        {/* Right: Compounding Metrics Dashboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Compounded Ecosystem Impact</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="text-[11px] text-stone-400 font-mono">Cognitive Utility Score</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {(velocity * 94.2).toFixed(1)} / 500
                </div>
                <div className="text-[10px] text-stone-500">Based on verified source citations</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="text-[11px] text-stone-400 font-mono">Creator Value Distributed</div>
                <div className="text-2xl font-bold font-mono text-sky-400">
                  ${(velocity * 48200).toLocaleString()}
                </div>
                <div className="text-[10px] text-stone-500">70% direct settlement share</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="text-[11px] text-stone-400 font-mono">Hallucination Defense Rate</div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  99.8%
                </div>
                <div className="text-[10px] text-stone-500">Strict grounding threshold active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
