import React from 'react';
import { BrandName, Language } from '../types';
import { Sparkles, ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  brand: BrandName;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ brand, lang }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#050509] py-12 text-[#9a9ab0] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c5cff] to-[#22d3ee] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_16px_rgba(124,92,255,0.4)]">
              {brand.charAt(0)}
            </div>
            <div>
              <span className="font-display font-bold text-white text-base block">
                {brand}
              </span>
              <span className="text-[11px] text-[#9a9ab0]">
                {lang === 'hi' ? 'The Invisible Force Behind Your Growth' : 'The Invisible Force Behind Your Growth'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a href="#phases" className="hover:text-white transition-colors">
              {lang === 'hi' ? 'रोडमैप' : 'Roadmap'}
            </a>
            <a href="#connectors" className="hover:text-white transition-colors">
              {lang === 'hi' ? '25+ कनेक्टर्स' : '25+ Connectors'}
            </a>
            <a href="#revenue" className="hover:text-white transition-colors">
              {lang === 'hi' ? 'राजस्व मॉडल' : 'Revenue Model'}
            </a>
            <a href="#options" className="hover:text-white transition-colors">
              {lang === 'hi' ? 'क्रियान्वयन स्टूडियो' : 'Execution Studio'}
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white transition-colors cursor-pointer"
          >
            <span>{lang === 'hi' ? 'शीर्ष पर जाएं' : 'Back to Top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9a9ab0]">
          <div>
            © {new Date().getFullYear()} {brand} Inc. All rights reserved. Zero Configuration & Self-Healing Architecture.
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-[#22d3ee]" />
            <span>Zero-Trust Architecture · AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
