import React from 'react';
import { Language, StudioWing } from '../types';
import { STUDIO_WINGS, BRAND_INFO } from '../data/researchData';
import { ArrowUpRight, Compass, TestTube, Cpu, Share2, BookOpen, Layers } from 'lucide-react';

interface StudioWingsOverviewProps {
  language: Language;
  onNavigateWing: (wingId: string) => void;
}

export const StudioWingsOverview: React.FC<StudioWingsOverviewProps> = ({
  language,
  onNavigateWing,
}) => {
  const isHi = language === 'hi';

  const wingIcons: Record<string, React.ReactNode> = {
    research: <Compass className="h-5 w-5 text-amber-400" />,
    labs: <TestTube className="h-5 w-5 text-sky-400" />,
    products: <Cpu className="h-5 w-5 text-emerald-400" />,
    media: <Share2 className="h-5 w-5 text-indigo-400" />,
    publications: <BookOpen className="h-5 w-5 text-amber-500" />,
  };

  return (
    <section id="wings" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>{isHi ? 'स्टूडियो संरचना' : 'Studio Architecture'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            {isHi ? 'Aemy AI Studio के पाँच प्रभाग' : 'The Five Studio Wings'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'Aemy AI Studio केवल एक अवधारणा नहीं, बल्कि 5 संरचित प्रभागों (Research, Labs, Products, Media, Publications) की एक एकीकृत संस्थागत वास्तुकला है।'
              : 'A unified structural matrix separating foundational inquiry from technical sandboxes, applied products, media transmission, and formal publications.'}
          </p>
        </div>

        {/* 5-Wing Studio Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {STUDIO_WINGS.map((wing) => (
            <div
              key={wing.id}
              className="rounded-xl border border-stone-800 bg-stone-900/40 p-5 flex flex-col justify-between hover:border-stone-700 transition-all hover:bg-stone-900/60 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-stone-950 border border-stone-800">
                    {wingIcons[wing.id]}
                  </div>
                  <span className="font-mono text-xs text-stone-500">
                    {wing.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-100 group-hover:text-amber-200 transition-colors">
                    {isHi ? wing.titleHi : wing.titleEn}
                  </h3>
                  <div className="text-xs font-mono text-amber-400/90 mt-0.5">
                    {isHi ? wing.subtitleHi : wing.subtitleEn}
                  </div>
                </div>

                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isHi ? wing.descriptionHi : wing.descriptionEn}
                </p>

                {/* Subtracks */}
                <div className="pt-2 border-t border-stone-800/80">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
                    {isHi ? 'उप-धाराएँ' : 'Active Tracks'}
                  </div>
                  <ul className="space-y-1 text-xs text-stone-300 font-sans">
                    {(isHi ? wing.subTracksHi : wing.subTracksEn).map((track, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{track}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-800/80 space-y-1.5">
                <button
                  onClick={() => onNavigateWing(wing.id)}
                  className="w-full flex items-center justify-between text-xs font-mono text-stone-400 group-hover:text-amber-400 transition-colors"
                >
                  <span>{isHi ? 'प्रभाग खोलें' : 'Enter Wing'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                {wing.id === 'media' && (
                  <button
                    onClick={() => onNavigateWing('connectors')}
                    className="w-full flex items-center justify-between text-[11px] font-mono text-amber-500 hover:text-amber-300 transition-colors pt-1 border-t border-stone-800/40"
                  >
                    <span>{isHi ? 'कनेक्टर्स व MCP हब →' : 'Connectors & MCP Hub →'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Personal Identity to Brand Bridge Note */}
        <div className="mt-10 rounded-lg border border-stone-800/80 bg-stone-900/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-amber-500 uppercase tracking-widest">
              {isHi ? 'संस्थापक एवं ब्रांड समन्वय' : 'Identity & Brand Synthesis'}
            </span>
            <p className="text-stone-300 font-serif italic text-sm">
              "{isHi ? BRAND_INFO.bridgeHi : BRAND_INFO.bridgeEn}"
            </p>
          </div>
          <div className="text-stone-500 font-mono shrink-0">
            Founded by Amit Sharma · Independent Lab
          </div>
        </div>
      </div>
    </section>
  );
};
