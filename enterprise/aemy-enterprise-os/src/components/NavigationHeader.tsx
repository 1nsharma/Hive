import React from 'react';
import { ViewMode } from '../types/blueprint';
import { 
  Flame, 
  Shield, 
  Cpu, 
  Terminal, 
  Layers, 
  Skull, 
  RotateCw, 
  Database, 
  Gavel, 
  CheckSquare, 
  Globe, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface NavigationHeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeLanguage: 'en' | 'hi';
  onToggleLanguage: () => void;
  onExportBlueprint: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  onSelectView,
  activeLanguage,
  onToggleLanguage,
  onExportBlueprint
}) => {
  const navItems: { id: ViewMode; label: string; hindiLabel: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Civilization Map', hindiLabel: 'सभ्यता मानचित्र', icon: <Globe className="w-4 h-4" /> },
    { id: 'constitution', label: 'Soul Constitution v1.0', hindiLabel: 'आत्मा संविधान', icon: <Flame className="w-4 h-4 text-amber-500" />, badge: 'Vol 01' },
    { id: 'organism', label: 'Living Organism', hindiLabel: 'सजीव अंग तंत्र', icon: <Cpu className="w-4 h-4 text-cyan-500" /> },
    { id: 'blueprint', label: '12-Volume Blueprint', hindiLabel: '12 खंड महा-प्रारूप', icon: <BookOpen className="w-4 h-4 text-indigo-500" />, badge: '85 Ch' },
    { id: 'context-injector', label: 'Context Injector', hindiLabel: 'संदर्भ इंजेक्टर', icon: <Sparkles className="w-4 h-4 text-emerald-500" />, badge: 'Live Organ' },
    { id: 'lens-studio', label: 'Lens Studio & SDK', hindiLabel: 'लेंस स्टूडियो', icon: <Terminal className="w-4 h-4 text-sky-500" /> },
    { id: 'governance', label: 'Governance Protocol', hindiLabel: 'शासन प्रोटोकॉल', icon: <Gavel className="w-4 h-4 text-purple-500" /> },
    { id: 'death-valley', label: 'Death Valley ☠️', hindiLabel: 'डेथ वैली लचीलापन', icon: <Skull className="w-4 h-4 text-rose-500" />, badge: 'Resilience' },
    { id: 'flywheels', label: '4 Flywheels', hindiLabel: '4 चक्रव्यूह फ्लाईव्हील', icon: <RotateCw className="w-4 h-4 text-blue-500" /> },
    { id: 'memory-isolation', label: '3-World Memory', hindiLabel: '3-लोक स्मृति', icon: <Database className="w-4 h-4 text-teal-500" /> },
    { id: 'compliance-checker', label: 'Soul Linter', hindiLabel: 'संविधान अनुपालन', icon: <CheckSquare className="w-4 h-4 text-yellow-500" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-xl">
      {/* Top Banner with Master Axiom */}
      <div className="px-4 py-2 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-stone-400 tracking-wider uppercase text-[11px]">
            APNI DUNIYA CANONICAL PLATFORM ARCHITECTURE v1.0
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px]">
            IMMUTABLE SOUL ANCHORED
          </span>
        </div>

        <div className="flex items-center gap-4 text-stone-400">
          <span className="hidden lg:inline italic text-stone-300 text-xs">
            {activeLanguage === 'hi' 
              ? "“हम लोगों के ध्यान (Attention) को वास्तविक मूल्य में बदलने में मदद करते हैं।”"
              : "“We help people get more value from their attention.”"}
          </span>

          <div className="flex items-center gap-2">
            <button
              id="lang-toggle-btn"
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-medium text-xs transition-colors flex items-center gap-1.5"
              title="Toggle English / Hindi highlights"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeLanguage === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              id="export-blueprint-btn"
              onClick={onExportBlueprint}
              className="px-3 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Export Canonical Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-stone-700">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectView('overview')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20">
              🌍
            </div>
            <div>
              <div className="font-bold tracking-tight text-white flex items-center gap-1.5 text-sm sm:text-base">
                <span>अपनी दुनिया</span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono hidden sm:block">
                Civilization Architecture Engine
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 shrink-0">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-2 border whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm shadow-amber-500/10'
                    : 'bg-stone-800/60 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{activeLanguage === 'hi' ? item.hindiLabel : item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-stone-700 text-stone-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
