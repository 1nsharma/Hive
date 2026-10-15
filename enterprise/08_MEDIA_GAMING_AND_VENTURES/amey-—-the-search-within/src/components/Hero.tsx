import React from 'react';
import { Language } from '../types';
import { BRAND_INFO } from '../data/researchData';
import { Compass, BookOpen, ArrowRight, Binary, Cpu, ShieldCheck } from 'lucide-react';

interface HeroProps {
  language: Language;
  onExplorePillars: () => void;
  onReadSeries: () => void;
  onLaunchPlaybook: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onExplorePillars,
  onReadSeries,
  onLaunchPlaybook,
}) => {
  const isHi = language === 'hi';

  const pipeline = [
    { en: 'Question', hi: 'प्रश्न' },
    { en: 'Evidence', hi: 'साक्ष्य' },
    { en: 'Experiment', hi: 'प्रयोग' },
    { en: 'Result', hi: 'परिणाम' },
    { en: 'Revision', hi: 'परिमार्जन' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-stone-800/60 bg-stone-950 px-4 pt-16 pb-20 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(180,83,9,0.15),transparent)]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Curatorial Header Line */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400">
          <span className="text-amber-400 font-semibold tracking-wider uppercase">
            {BRAND_INFO.name}
          </span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span>{isHi ? `द्वारा ${BRAND_INFO.founder}` : `By ${BRAND_INFO.founder}`}</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span className="text-stone-300 font-medium">{isHi ? BRAND_INFO.positioningHi : BRAND_INFO.positioningEn}</span>
        </div>

        {/* Brand Display Title */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-stone-100 leading-[1.1] text-balance">
          {BRAND_INFO.name}
          <span className="block font-serif italic text-stone-400 mt-2 font-normal text-2xl sm:text-4xl lg:text-5xl">
            {isHi ? BRAND_INFO.taglineHi : BRAND_INFO.taglineEn}
          </span>
        </h1>

        {/* Subtitle / Positioning Statement */}
        <p className="mt-6 max-w-3xl text-lg sm:text-xl text-stone-300 font-light leading-relaxed">
          {isHi ? BRAND_INFO.publicPositioningHi : BRAND_INFO.publicPositioningEn}
        </p>

        {/* Studio Wings Badges */}
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-stone-500 uppercase tracking-widest mr-1">
            {isHi ? 'प्रभाग' : 'Studio Wings'}:
          </span>
          {['Research', 'Labs', 'Products', 'Media', 'Publications'].map((wing, i, arr) => (
            <React.Fragment key={wing}>
              <span className="text-stone-300 font-medium hover:text-amber-300 transition-colors">
                {wing}
              </span>
              {i < arr.length - 1 && <span className="text-stone-600">/</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Intellectual Principle Bar */}
        <div className="mt-8 rounded-lg border border-stone-800 bg-stone-900/60 p-4 sm:p-5 backdrop-blur-sm">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 mb-3">
            {isHi ? 'बौद्धिक कार्यप्रणाली' : 'Intellectual Principle'}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-stone-200">
            {pipeline.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="inline-flex items-center rounded border border-stone-700/60 bg-stone-800/80 px-2.5 py-1 text-stone-200">
                  <span className="mr-1.5 font-mono text-xs text-amber-400">0{idx + 1}.</span>
                  {isHi ? step.hi : step.en}
                </span>
                {idx < pipeline.length - 1 && (
                  <span className="text-stone-600 font-mono">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Epistemic Creed Quote */}
          <div className="mt-4 border-t border-stone-800/80 pt-3 text-xs sm:text-sm italic text-stone-400 font-serif leading-relaxed">
            "{isHi ? BRAND_INFO.coreRuleHi : BRAND_INFO.coreRuleEn}"
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={onLaunchPlaybook}
            className="flex items-center gap-2 rounded bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 transition-all hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-950/20"
          >
            <Compass className="h-4 w-4" />
            <span>{isHi ? '8-चरणीय शोध शुरू करें' : 'Launch 8-Step Investigation'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('labs');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 rounded border border-stone-700 bg-stone-900/60 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-800/80"
          >
            <Cpu className="h-4 w-4 text-sky-400" />
            <span>{isHi ? 'एआई लैब्स एवं सैंडबॉक्स' : 'Live Labs & Agent Sandbox'}</span>
          </button>

          <button
            onClick={onReadSeries}
            className="flex items-center gap-2 rounded border border-stone-800 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-200"
          >
            <BookOpen className="h-4 w-4 text-stone-500" />
            <span>{isHi ? 'शोध शृंखला (001 - 007)' : 'Publications Series'}</span>
          </button>
        </div>

        {/* Quantitative Institutional Baseline */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-stone-800/80 pt-8 sm:grid-cols-4">
          <div>
            <div className="font-mono text-2xl font-light text-stone-100 tabular-nums">05</div>
            <div className="text-xs text-stone-400 mt-1">
              {isHi ? 'संरचित स्टूडियो प्रभाग' : 'Integrated Studio Wings'}
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-light text-stone-100 tabular-nums">03</div>
            <div className="text-xs text-stone-400 mt-1">
              {isHi ? 'सक्रिय एआई लैब्स' : 'Live AI Lab Sandboxes'}
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-light text-stone-100 tabular-nums">12</div>
            <div className="text-xs text-stone-400 mt-1">
              {isHi ? 'द सर्च विदिन अध्याय' : 'The Search Within Chapters'}
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-light text-amber-400 tabular-nums">10-Yr</div>
            <div className="text-xs text-stone-400 mt-1">
              {isHi ? 'संचित बौद्धिक लक्ष्य' : 'Canon Horizon (Amit Sharma)'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
