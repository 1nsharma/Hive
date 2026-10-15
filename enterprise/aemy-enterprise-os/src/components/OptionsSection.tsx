import React from 'react';
import { ExecutionOption, Language, BrandName } from '../types';
import { Sparkles, Check, ArrowRight, Layers, Cpu, TrendingUp, RefreshCw, FileText } from 'lucide-react';
import { BrandStudio } from './workspaces/BrandStudio';
import { TechPlayground } from './workspaces/TechPlayground';
import { BusinessEngine } from './workspaces/BusinessEngine';

interface OptionsSectionProps {
  options: ExecutionOption[];
  selectedOptionId: '1' | '2' | '3';
  onSelectOption: (id: '1' | '2' | '3') => void;
  brand: BrandName;
  onBrandChange: (brand: BrandName) => void;
  lang: Language;
  onExport: () => void;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({
  options,
  selectedOptionId,
  onSelectOption,
  brand,
  onBrandChange,
  lang,
  onExport,
}) => {
  const selectedOption = options.find((o) => o.id === selectedOptionId) || options[0];

  return (
    <section id="options" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c5cff]/10 border border-[#7c5cff]/30 text-xs font-semibold tracking-wider text-[#c4b5fd] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'अगला कदम: क्रियान्वयन दिशा' : 'Next Step: Execution Trajectory'}</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            {lang === 'hi' ? 'किस दिशा से शुरुआत करें?' : 'Which Direction Shall We Begin With?'}
          </h2>

          <p className="text-base sm:text-lg text-[#9a9ab0] leading-relaxed">
            {lang === 'hi'
              ? 'तीन स्पष्ट विकल्प — अपनी सर्वोच्च प्राथमिकता के अनुसार एक चुनें। नीचे उस दिशा का समर्पित क्रियान्वयन स्टूडियो तुरंत सक्रिय हो जाएगा।'
              : 'Three clear options — choose your immediate priority to launch the dedicated execution environment below.'}
          </p>
        </div>

        {/* 3 Option Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <div
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                className={`relative rounded-2xl p-7 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#7c5cff]/15 via-white/[0.04] to-transparent border-[#7c5cff] shadow-[0_16px_50px_rgba(124,92,255,0.25)] ring-1 ring-[#7c5cff]/40'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                }`}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] flex items-center justify-center text-white font-bold text-xs shadow-[0_0_12px_#7c5cff]">
                    ✓
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-extrabold text-4xl bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] bg-clip-text text-transparent">
                      {option.num}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20">
                      {lang === 'hi' ? option.tagHi : option.tagEn}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    {lang === 'hi' ? option.titleHi : option.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9a9ab0] mb-5 leading-relaxed">
                    {lang === 'hi' ? option.descHi : option.descEn}
                  </p>

                  {/* Tasks in this option */}
                  <ul className="space-y-2 mb-6 text-xs text-[#c4c4d8]">
                    {(lang === 'hi' ? option.tasksHi : option.tasksEn).map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#7c5cff] font-bold">→</span>
                        <span className="leading-snug">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_20px_rgba(124,92,255,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {isSelected
                    ? (lang === 'hi' ? '✓ चयनित (सक्रिय स्टूडियो)' : '✓ Selected (Active)')
                    : (lang === 'hi' ? 'इस विकल्प का चयन करें' : 'Select This Option')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Trajectory Confirmation Bar */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#7c5cff]/10 via-[#3b82f6]/10 to-[#22d3ee]/10 border border-[#7c5cff]/40 shadow-xl mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#22d3ee] uppercase tracking-wider mb-1">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'आपका चयन' : 'Active Execution Trajectory'}</span>
              </div>

              <h4 className="font-display font-bold text-xl text-white">
                {lang === 'hi' ? selectedOption.titleHi : selectedOption.titleEn}
              </h4>

              <p className="text-xs sm:text-sm text-[#9a9ab0] max-w-3xl mt-1 leading-relaxed">
                {lang === 'hi' ? selectedOption.longDescHi : selectedOption.longDescEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={onExport}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-[#22d3ee]" />
                <span>{lang === 'hi' ? 'ब्लूप्रिंट एक्सपोर्ट' : 'Export Blueprint'}</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('active-workspace-panel');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(124,92,255,0.3)]"
              >
                <span>{lang === 'hi' ? 'स्टूडियो में कार्य करें ↓' : 'Work in Studio ↓'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Interactive Workspace Panel */}
        <div id="active-workspace-panel" className="scroll-mt-24">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                {selectedOptionId === '1' && (lang === 'hi' ? 'विकल्प 1 स्टूडियो: ब्रांड पहचान और UI/UX' : 'Option 1 Studio: Brand Identity & UI/UX')}
                {selectedOptionId === '2' && (lang === 'hi' ? 'विकल्प 2 स्टूडियो: तकनीकी आर्किटेक्चर एवं MVP' : 'Option 2 Studio: Technical Architecture & MVP')}
                {selectedOptionId === '3' && (lang === 'hi' ? 'विकल्प 3 स्टूडियो: व्यापार योजना एवं मार्केटिंग' : 'Option 3 Studio: Business Plan & Marketing')}
              </h3>
            </div>

            <span className="text-xs font-mono text-[#9a9ab0] hidden sm:inline">
              Live Interactive Workspace
            </span>
          </div>

          {/* Conditional Sub-workspaces */}
          {selectedOptionId === '1' && (
            <BrandStudio
              brand={brand}
              onBrandChange={onBrandChange}
              lang={lang}
            />
          )}

          {selectedOptionId === '2' && (
            <TechPlayground
              lang={lang}
            />
          )}

          {selectedOptionId === '3' && (
            <BusinessEngine
              lang={lang}
              onExport={onExport}
            />
          )}
        </div>

      </div>
    </section>
  );
};
