import React from 'react';
import { Language } from '../types';
import { STUDIO_PRODUCTS } from '../data/researchData';
import { Cpu, ArrowUpRight, Check, Sparkles } from 'lucide-react';

interface StudioProductsViewProps {
  language: Language;
  onLaunchTool: (toolId: string) => void;
}

export const StudioProductsView: React.FC<StudioProductsViewProps> = ({
  language,
  onLaunchTool,
}) => {
  const isHi = language === 'hi';

  const toolTargets: Record<string, string> = {
    'prod-playbook': 'playbook',
    'prod-agency-audit': 'audit',
    'prod-funnel-compiler': 'funnel',
  };

  return (
    <section id="products" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            <span>{isHi ? 'विंग 03: उत्पाद एवं सॉफ्टवेयर' : 'Wing 03: Aemy AI Studio Products & SaaS'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            {isHi ? 'प्रायोगिक एआई उपकरण एवं सास' : 'Applied AI Tools & Epistemic Software'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'सिद्धांतों को व्यावहारिक औजारों में बदलना। शोधकर्ताओं, विश्लेषकों और संप्रभु विचारकों के लिए डिज़ाइन किए गए विशेष सॉफ़्टवेयर समाधान।'
              : 'Translating cognitive research and safety paradigms into deployable tools for researchers, technical institutions, and sovereign thinkers.'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STUDIO_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="rounded-xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between hover:border-stone-700 transition-all hover:bg-stone-900/60 space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    {isHi ? prod.categoryHi : prod.categoryEn}
                  </span>
                  <span className="text-[10px] font-mono rounded border border-stone-700 px-2 py-0.5 text-stone-400">
                    {prod.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-100">
                    {prod.name}
                  </h3>
                  <p className="mt-1 text-xs text-amber-400/90 font-serif italic">
                    "{isHi ? prod.taglineHi : prod.taglineEn}"
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  {isHi ? prod.descriptionHi : prod.descriptionEn}
                </p>

                {/* Features */}
                <div className="pt-3 border-t border-stone-800/80 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    {isHi ? 'मुख्य विशेषताएं' : 'Core Architecture'}
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {(isHi ? prod.featuresHi : prod.featuresEn).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => onLaunchTool(toolTargets[prod.id] || 'playbook')}
                  className="w-full flex items-center justify-center gap-2 rounded bg-stone-100 hover:bg-amber-100 px-4 py-2.5 text-xs font-medium text-stone-900 transition-all active:scale-95 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isHi ? `टूल लॉन्च करें →` : `Launch ${prod.name}`}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
