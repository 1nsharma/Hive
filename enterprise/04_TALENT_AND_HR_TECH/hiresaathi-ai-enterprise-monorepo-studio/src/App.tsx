import React, { useState } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { WorkspaceView } from './components/WorkspaceView';
import { ReverseEngineeringView } from './components/ReverseEngineeringView';
import { GoogleCommunitySupportModule } from './components/GoogleCommunitySupportModule';
import { MonorepoExplorer } from './components/MonorepoExplorer';
import { CleanArchDiagram } from './components/CleanArchDiagram';
import { EvolutionMatrix } from './components/EvolutionMatrix';
import { Scaffolder } from './components/Scaffolder';
import { ToastProvider } from './components/Toast';
import { Sparkles, GitBranch, ShieldCheck, Heart, Search } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('workspace');
  const [hinglishMode, setHinglishMode] = useState<boolean>(true);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {/* Top Navigation */}
        <Navbar
          currentView={currentView}
          onSelectView={setCurrentView}
          hinglishMode={hinglishMode}
          onToggleHinglish={() => setHinglishMode(!hinglishMode)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'workspace' && <WorkspaceView onSelectView={setCurrentView} />}
          {currentView === 'google-chat' && <GoogleCommunitySupportModule hinglishMode={hinglishMode} />}
          {currentView === 'reverse-eng' && <ReverseEngineeringView hinglishMode={hinglishMode} />}
          {currentView === 'explorer' && <MonorepoExplorer hinglishMode={hinglishMode} />}
          {currentView === 'clean-arch' && <CleanArchDiagram hinglishMode={hinglishMode} />}
          {currentView === 'evolution' && <EvolutionMatrix hinglishMode={hinglishMode} />}
          {currentView === 'scaffolder' && <Scaffolder hinglishMode={hinglishMode} />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">HireSaathi AI</span>
              <span>·</span>
              <span>Enterprise Monorepo &amp; AI Recruitment Platform</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EU AI Act &amp; Anti-Bias Compliant</span>
              </span>
              <span>·</span>
              <span>Scale: 5 to 500 Devs</span>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
