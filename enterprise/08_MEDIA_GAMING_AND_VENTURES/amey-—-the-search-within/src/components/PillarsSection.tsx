import React, { useState } from 'react';
import { Language, Pillar } from '../types';
import { CORE_PILLARS } from '../data/researchData';
import { ArrowUpRight, Compass, HelpCircle, Sparkles } from 'lucide-react';

interface PillarsSectionProps {
  language: Language;
  onSelectPillarForPlaybook: (pillar: Pillar) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({
  language,
  onSelectPillarForPlaybook,
}) => {
  const isHi = language === 'hi';
  const [selectedPillarId, setSelectedPillarId] = useState<string>(CORE_PILLARS[0].id);

  const activePillar = CORE_PILLARS.find((p) => p.id === selectedPillarId) || CORE_PILLARS[0];

  return (
    <section id="pillars" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">
            {isHi ? 'बौद्धिक आधार' : 'Foundational Architecture'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            {isHi ? 'पाँच मूलभूत स्तम्भ' : 'The Five Core Pillars'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'AMEY का संपूर्ण अनुसंधान इन 5 परस्पर जुड़े आयामों पर आधारित है। कोई भी प्रश्न अकेला नहीं है—मन, मशीन और समाज एक ही समीकरण के हिस्से हैं।'
              : 'The complete research architecture rests upon these five interrelated dimensions. In our inquiry, mind, machine, and civilization are treated as coupled dynamic systems.'}
          </p>
        </div>

        {/* Pillar Selector Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CORE_PILLARS.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-amber-500/70 bg-stone-900 shadow-md shadow-amber-950/20'
                    : 'border-stone-800/80 bg-stone-900/30 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber-400 font-medium">
                    {pillar.number}
                  </span>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
                </div>
                <div className="mt-2 font-serif text-base font-medium text-stone-100">
                  {isHi ? pillar.titleHi : pillar.titleEn}
                </div>
                <div className="mt-1 text-xs text-stone-400 line-clamp-2 leading-snug">
                  {isHi ? pillar.coreQuestionHi : pillar.coreQuestionEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Pillar Inspection Canvas */}
        <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Core Identity & Questions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                  <span>Pillar {activePillar.number}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400">{isHi ? 'गहन अन्वेषण' : 'Deep Inquiry'}</span>
                </div>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-stone-100">
                  {isHi ? activePillar.titleHi : activePillar.titleEn}
                </h3>
              </div>

              {/* Core Question Card */}
              <div className="border-l-2 border-amber-500/80 pl-4 py-1">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  {isHi ? 'मूल असुविधाजनक प्रश्न' : 'The Core Uncomfortable Question'}
                </div>
                <div className="font-serif italic text-lg sm:text-xl text-stone-200 leading-relaxed">
                  "{isHi ? activePillar.coreQuestionHi : activePillar.coreQuestionEn}"
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
                {isHi ? activePillar.descriptionHi : activePillar.descriptionEn}
              </p>

              {/* Sub-Themes (Zero-Pill formatting with typographic dots) */}
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
                  {isHi ? 'अनुसंधान उप-विषय' : 'Investigative Sub-Themes'}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-stone-300">
                  {(isHi ? activePillar.themesHi : activePillar.themesEn).map((theme, i, arr) => (
                    <React.Fragment key={theme}>
                      <span className="hover:text-amber-300 transition-colors">{theme}</span>
                      {i < arr.length - 1 && (
                        <span aria-hidden="true" className="text-stone-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Epistemic Tension & Interactive Action */}
            <div className="lg:col-span-5 rounded-lg border border-stone-800 bg-stone-950/60 p-5 space-y-5">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 mb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{isHi ? 'संज्ञानात्मक विरोधाभास' : 'Fundamental Epistemic Tension'}</span>
                </div>
                <p className="font-serif text-sm text-stone-300 italic leading-relaxed">
                  "{isHi ? activePillar.epistemicTensionHi : activePillar.epistemicTensionEn}"
                </p>
              </div>

              <div className="border-t border-stone-800 pt-4 space-y-3">
                <div className="text-xs text-stone-400 leading-normal">
                  {isHi
                    ? 'इस स्तम्भ पर 8-चरणीय शोध प्लेबुक (Question → Evidence → Experiment → Result → Revision) चलाएं।'
                    : 'Execute the full 8-Step Research Playbook on this pillar to map evidence, steelman counter-theses, and formulate experiments.'}
                </div>

                <button
                  onClick={() => onSelectPillarForPlaybook(activePillar)}
                  className="w-full flex items-center justify-center gap-2 rounded bg-amber-500/90 hover:bg-amber-400 px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 transition-colors shadow-sm"
                >
                  <Compass className="h-4 w-4" />
                  <span>
                    {isHi
                      ? `इस स्तम्भ पर शोध शुरू करें`
                      : `Investigate ${activePillar.titleEn}`}
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
