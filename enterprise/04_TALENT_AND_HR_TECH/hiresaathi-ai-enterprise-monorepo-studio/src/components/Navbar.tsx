import React from 'react';
import { 
  Building2, 
  FolderGit2, 
  Layers, 
  TrendingUp, 
  Terminal, 
  Sparkles, 
  Languages, 
  Search,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export type AppViewMode = 'workspace' | 'google-chat' | 'reverse-eng' | 'explorer' | 'clean-arch' | 'evolution' | 'scaffolder';

interface NavbarProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  hinglishMode: boolean;
  onToggleHinglish: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  hinglishMode,
  onToggleHinglish
}) => {
  const navItems: { id: AppViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'workspace',
      label: 'Workspace',
      icon: <Building2 className="w-4 h-4" />,
      badge: 'Product'
    },
    {
      id: 'google-chat',
      label: 'Google Chat & Community',
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      badge: 'Support'
    },
    {
      id: 'reverse-eng',
      label: 'Reverse Engineering',
      icon: <Search className="w-4 h-4 text-cyan-400" />,
      badge: 'Diagnostics'
    },
    {
      id: 'explorer',
      label: 'Monorepo Explorer',
      icon: <FolderGit2 className="w-4 h-4" />,
      badge: '5 to 500'
    },
    {
      id: 'clean-arch',
      label: 'Clean Architecture',
      icon: <Layers className="w-4 h-4" />,
      badge: 'Deep-Dive'
    },
    {
      id: 'evolution',
      label: 'Scale Roadmap',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: 'Stages 1-4'
    },
    {
      id: 'scaffolder',
      label: 'CLI & Scaffolding',
      icon: <Terminal className="w-4 h-4" />,
      badge: 'Bootstrap'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Meta */}
          <div 
            onClick={() => onSelectView('workspace')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-white">HireSaathi AI</span>
                <span className="text-[11px] text-cyan-300 font-mono bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  v2.0 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Enterprise AI Recruitment &amp; Modular Monorepo Architecture
              </p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-950/70 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <span className={active ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Hinglish / English Toggle */}
            <button
              onClick={onToggleHinglish}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                hinglishMode
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
              title="Toggle Hinglish / English architectural notes"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes:</span>
              <span>{hinglishMode ? 'Hinglish' : 'English'}</span>
            </button>

            <button
              onClick={() => onSelectView('reverse-eng')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Reverse Engineering</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 gap-1 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                  active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
