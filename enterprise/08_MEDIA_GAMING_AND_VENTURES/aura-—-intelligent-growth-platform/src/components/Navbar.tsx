import React from 'react';
import { BrandName, Language } from '../types';
import { Sparkles, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

interface NavbarProps {
  brand: BrandName;
  onBrandChange: (brand: BrandName) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  onSelectNextStep: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  onBrandChange,
  lang,
  onLangChange,
  onSelectNextStep,
}) => {
  return (
    <nav id="navbar" className="sticky top-0 z-50 backdrop-blur-md bg-[#07070d]/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] p-[2px] shadow-[0_0_24px_rgba(124,92,255,0.45)]">
              <div className="w-full h-full bg-[#07070d] rounded-[10px] flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-[#7c5cff] to-[#22d3ee]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  {brand}
                </span>
                <button
                  id="brand-toggle-btn"
                  onClick={() => onBrandChange(brand === 'Aura' ? 'Synapse' : 'Aura')}
                  title={lang === 'hi' ? 'नाम बदलें (Aura / Synapse)' : 'Toggle Brand (Aura / Synapse)'}
                  className="px-2 py-0.5 text-[11px] font-medium tracking-wide text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 rounded-full hover:bg-[#22d3ee]/20 transition-all cursor-pointer"
                >
                  {brand === 'Aura' ? '⇄ Synapse' : '⇄ Aura'}
                </button>
              </div>
              <span className="text-[11px] text-[#9a9ab0] hidden sm:inline">
                {brand === 'Aura' ? 'The Invisible Force' : 'Neural Connectivity Engine'}
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#production-engine"
              className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'hi' ? 'लाइव प्रोडक्शन' : 'Live Production'}</span>
            </a>
            <a
              href="#phases"
              className="text-[#9a9ab0] hover:text-[#e7e7f0] transition-colors"
            >
              {lang === 'hi' ? 'चरण' : 'Phases'}
            </a>
            <a
              href="#connectors"
              className="text-[#9a9ab0] hover:text-[#e7e7f0] transition-colors"
            >
              {lang === 'hi' ? '25+ कनेक्टर्स' : '25+ Connectors'}
            </a>
            <a
              href="#revenue"
              className="text-[#9a9ab0] hover:text-[#e7e7f0] transition-colors"
            >
              {lang === 'hi' ? 'राजस्व मॉडल' : 'Revenue Model'}
            </a>
            <a
              href="#options"
              className="text-[#c4b5fd] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
              {lang === 'hi' ? 'अगला कदम' : 'Next Steps'}
            </a>
            <a
              href="#master-blueprint"
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/30 hover:bg-[#22d3ee]/20 transition-all"
            >
              {lang === 'hi' ? 'मास्टर ब्लूप्रिंट' : 'Master Blueprint'}
            </a>
          </div>

          {/* Right Action & Language Switcher */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full text-xs text-[#9a9ab0]">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <span>{lang === 'hi' ? 'योजना सक्रिय' : 'Plan Active'}</span>
            </div>

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={() => onLangChange(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#c4c4d8] bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-all cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#7c5cff]" />
              <span>{lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Main Action Button */}
            <button
              id="nav-cta-btn"
              onClick={onSelectNextStep}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:from-[#8b6fff] hover:to-[#4f92ff] rounded-xl shadow-[0_4px_20px_rgba(124,92,255,0.35)] hover:shadow-[0_6px_28px_rgba(124,92,255,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
