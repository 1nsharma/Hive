import React from 'react';
import { Language } from '../types';
import { Compass, Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenLab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeSection,
  onNavigate,
  onOpenLab,
}) => {
  const isHi = language === 'hi';

  const navLinks = [
    { id: 'wings', labelEn: 'Studio Wings', labelHi: 'प्रभाग' },
    { id: 'pillars', labelEn: 'Research', labelHi: 'शोध' },
    { id: 'labs', labelEn: 'Labs & Sandbox', labelHi: 'प्रयोगशाला' },
    { id: 'products', labelEn: 'Products', labelHi: 'उत्पाद' },
    { id: 'funnel', labelEn: 'Media', labelHi: 'मीडिया' },
    { id: 'connectors', labelEn: 'Connectors & MCP', labelHi: 'कनेक्टर्स व MCP' },
    { id: 'series', labelEn: 'Publications', labelHi: 'प्रकाशन' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark (Top Bar Contract) */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left font-serif text-lg sm:text-xl font-semibold tracking-tight text-stone-100 transition-colors hover:text-amber-200"
        >
          <span>Aemy AI Studio</span>
          <span className="ml-2 font-sans text-[11px] font-normal tracking-wider text-stone-400">
            {isHi ? 'द्वारा अमित शर्मा' : 'by Amit Sharma'}
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-xs font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isHi ? item.labelHi : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            title={isHi ? 'Switch to English' : 'हिंदी में देखें'}
            className="flex items-center gap-1 rounded border border-stone-800 px-2.5 py-1 text-xs font-mono text-stone-300 transition-colors hover:border-stone-700 hover:text-white"
          >
            <span className={language === 'en' ? 'text-amber-400 font-semibold' : 'text-stone-500'}>EN</span>
            <span className="text-stone-600">/</span>
            <span className={language === 'hi' ? 'text-amber-400 font-semibold' : 'text-stone-500'}>हिन्दी</span>
          </button>

          {/* Auto-Installer Action Button */}
          <button
            onClick={() => onNavigate('installer')}
            title={isHi ? 'MCP एवं कनेक्टर्स ऑटो-इंस्टॉलर' : 'MCP & Connectors Auto-Installer'}
            className="hidden sm:flex items-center gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20 active:scale-95 whitespace-nowrap"
          >
            <Terminal className="h-3.5 w-3.5 text-amber-400" />
            <span>{isHi ? 'ऑटो-इंस्टॉलर' : 'Auto Installer'}</span>
            <span className="rounded bg-amber-400/20 px-1 py-0.2 text-[9px] font-mono font-bold text-amber-300">
              1-Click
            </span>
          </button>

          {/* Primary CTA: Launch Studio Labs */}
          <button
            onClick={onOpenLab}
            className="flex items-center gap-2 rounded bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-stone-950 transition-all hover:bg-amber-400 active:scale-95 whitespace-nowrap shadow-sm"
          >
            <Compass className="h-3.5 w-3.5 text-stone-950" />
            <span>{isHi ? 'स्टूडियो लैब्स' : 'Studio Labs'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
