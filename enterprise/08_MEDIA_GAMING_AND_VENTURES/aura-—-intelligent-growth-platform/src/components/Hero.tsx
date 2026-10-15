import React from 'react';
import { BrandName, Language } from '../types';
import { ArrowRight, Sparkles, Layers, Cpu, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  brand: BrandName;
  lang: Language;
  onSelectOption: (optionId: '1' | '2' | '3') => void;
  onExploreConnectors: () => void;
  onViewPhases: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  brand,
  lang,
  onSelectOption,
  onExploreConnectors,
  onViewPhases,
}) => {
  return (
    <header className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#7c5cff]/20 via-[#3b82f6]/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-[10%] w-[400px] h-[350px] bg-[#22d3ee]/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Readiness Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#7c5cff]/10 border border-[#7c5cff]/30 text-xs sm:text-sm text-[#c4b5fd] mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(124,92,255,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_10px_#22d3ee] animate-pulse" />
          <span className="font-medium">
            {lang === 'hi' 
              ? 'व्यवस्थित क्रियान्वयन योजना तैयार है' 
              : 'Systematic Execution Plan Ready'}
          </span>
          <span className="text-[#7c5cff] font-bold">•</span>
          <span className="text-[#9a9ab0] hidden sm:inline">
            {lang === 'hi' ? '3 चरण · 25 कनेक्टर्स · $1M ARR' : '3 Phases · 25 Connectors · $1M ARR'}
          </span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight text-white leading-[1.08] mb-6">
          {brand} — The <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] bg-clip-text text-transparent">
            Invisible Force
          </span>{' '}
          Behind Your Growth
        </h1>

        {/* Lead description */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-[#9a9ab0] leading-relaxed mb-10">
          {lang === 'hi' ? (
            <>
              <strong className="text-white font-semibold">{brand}</strong> एक सजीव भागीदार है — न कि केवल एक टूल। 
              यह डेटा को जोड़ता है, समझता है, विश्लेषण करता है, और स्वचालित रूप से कार्यवाही करता है —{' '}
              <span className="text-[#22d3ee] font-medium">शून्य कॉन्फ़िगरेशन</span> के साथ।
            </>
          ) : (
            <>
              <strong className="text-white font-semibold">{brand}</strong> is an autonomous active partner — not just a passive tool. 
              It interconnects data, perceives operational context, forecasts trends, and takes autonomous actions — with{' '}
              <span className="text-[#22d3ee] font-medium">zero configuration</span>.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#production-engine"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 shadow-[0_10px_32px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{lang === 'hi' ? '🚀 लाइव प्रोडक्शन इंजन' : '🚀 Launch Production Engine'}</span>
          </a>

          <button
            id="hero-start-btn"
            onClick={() => onSelectOption('2')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:from-[#8b6fff] hover:to-[#4f92ff] shadow-[0_10px_32px_rgba(124,92,255,0.4)] transform hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>{lang === 'hi' ? 'क्रियान्वयन विकल्प' : 'Execution Options'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-connectors-btn"
            onClick={onExploreConnectors}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm sm:text-base text-[#e7e7f0] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#22d3ee]" />
            <span>{lang === 'hi' ? '25+ कनेक्टर्स देखें' : 'Explore 25+ Connectors'}</span>
          </button>

          <button
            id="hero-phases-btn"
            onClick={onViewPhases}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm sm:text-base text-[#9a9ab0] hover:text-white bg-transparent hover:bg-white/[0.03] border border-transparent hover:border-white/10 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#7c5cff]" />
            <span>{lang === 'hi' ? '3-चरणीय रोडमैप' : '3-Phase Roadmap'}</span>
          </button>
        </div>

        {/* 4-Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-md shadow-2xl">
          
          <div 
            onClick={onExploreConnectors}
            className="text-center p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="font-display font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              25+
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#e7e7f0] mt-1">
              {lang === 'hi' ? 'MVP कनेक्टर्स' : 'MVP Connectors'}
            </div>
            <div className="text-[11px] text-[#9a9ab0] mt-0.5">
              {lang === 'hi' ? 'Postgres, Salesforce, Slack...' : 'Postgres, Salesforce, Slack...'}
            </div>
          </div>

          <div 
            onClick={onViewPhases}
            className="text-center p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="font-display font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              3
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#e7e7f0] mt-1">
              {lang === 'hi' ? 'मुख्य चरण' : 'Core Phases'}
            </div>
            <div className="text-[11px] text-[#9a9ab0] mt-0.5">
              {lang === 'hi' ? 'ब्रांड → MVP → वैश्विक स्केल' : 'Brand → MVP → Global Scale'}
            </div>
          </div>

          <div 
            onClick={() => {
              const el = document.getElementById('revenue');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-center p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="font-display font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-[#3b82f6] to-[#7c5cff] bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              $1M+
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#e7e7f0] mt-1">
              {lang === 'hi' ? 'लक्षित ARR' : 'Target ARR'}
            </div>
            <div className="text-[11px] text-[#9a9ab0] mt-0.5">
              {lang === 'hi' ? 'Freemium + SaaS + Enterprise' : 'Freemium + SaaS + Enterprise'}
            </div>
          </div>

          <div 
            onClick={() => onSelectOption('2')}
            className="text-center p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="font-display font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-[#22d3ee] to-[#7c5cff] bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              0
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#e7e7f0] mt-1">
              {lang === 'hi' ? 'कॉन्फ़िगरेशन' : 'Configuration'}
            </div>
            <div className="text-[11px] text-[#9a9ab0] mt-0.5">
              {lang === 'hi' ? 'प्राकृतिक भाषा द्वारा ऑटो-डिस्कवरी' : 'Natural Language Auto-Discovery'}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
