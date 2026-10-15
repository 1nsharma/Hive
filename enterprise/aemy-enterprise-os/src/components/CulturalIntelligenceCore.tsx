import React, { useState, useEffect } from 'react';
import { CoreState } from '../types';
import {
  loadCoreState,
  saveCoreState,
  seedKanpurPilotData,
  STORAGE_KEY
} from '../utils/coreStorage';

import { CoreDashboard } from './core/CoreDashboard';
import { CoreEntitiesView } from './core/CoreEntitiesView';
import { CoreClaimsView } from './core/CoreClaimsView';
import { CoreEvidenceView } from './core/CoreEvidenceView';
import { CoreTestimoniesView } from './core/CoreTestimoniesView';
import { CoreReviewsView } from './core/CoreReviewsView';
import { CoreConsentView } from './core/CoreConsentView';
import { CorePluralityView } from './core/CorePluralityView';
import { CoreAuditView } from './core/CoreAuditView';
import { CoreStateMachineView } from './core/CoreStateMachineView';

interface CulturalIntelligenceCoreProps {
  onOpenAIEngine?: (claimStatement: string) => void;
  lang?: 'hi' | 'en';
}

export const CulturalIntelligenceCore: React.FC<CulturalIntelligenceCoreProps> = ({
  onOpenAIEngine
}) => {
  const [coreState, setCoreState] = useState<CoreState>(() => loadCoreState());
  const [currentView, setCurrentView] = useState<string>('dashboard');

  useEffect(() => {
    saveCoreState(coreState);
  }, [coreState]);

  const handleResetData = () => {
    if (!window.confirm('Reset ALL data to initial Kanpur pilot baseline? This cannot be undone.')) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    const freshState = seedKanpurPilotData();
    saveCoreState(freshState);
    setCoreState(freshState);
    setCurrentView('dashboard');
  };

  const totalRecords =
    coreState.entities.length +
    coreState.claims.length +
    coreState.evidence.length +
    coreState.testimonies.length +
    coreState.reviews.length +
    coreState.consent.length +
    coreState.plurality.length +
    coreState.auditLog.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'entities', label: 'Cultural Entities', icon: '🏛️' },
    { id: 'claims', label: 'Claims', icon: '📜' },
    { id: 'evidence', label: 'Evidence', icon: '🔍' },
    { id: 'testimonies', label: 'Testimonies', icon: '🗣️' },
    { id: 'reviews', label: 'Reviews', icon: '👥' },
    { id: 'consent', label: 'Consent Records', icon: '🔐' },
    { id: 'plurality', label: 'Plurality', icon: '🌿' },
    { id: 'audit', label: 'Audit Log', icon: '📋' },
    { id: 'statemachine', label: 'State Machine', icon: '⚙️' }
  ];

  return (
    <div className="flex flex-col bg-stone-100 text-stone-900 rounded-2xl overflow-hidden border border-stone-300 shadow-xl min-h-[780px]">
      {/* TOP BANNER */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border-b-2 border-dashed border-amber-500 px-4 py-2.5 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold bg-amber-300/80 px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider text-amber-900 border border-amber-400">
            ⚠️ EXPERIMENT PROTOTYPE — NOT FOR PRODUCTION
          </span>
          <span className="font-semibold text-amber-900">
            Cultural Intelligence Core v0.1 &middot; Kanpur Pilot
          </span>
        </div>
        <div className="font-mono text-xs text-amber-900/80 flex items-center gap-3">
          <span>Build: 2026-09-16</span>
          <span>&middot;</span>
          <span className="bg-amber-400/50 px-1.5 py-0.5 rounded font-bold">
            Status: PRE-VALIDATION
          </span>
        </div>
      </div>

      {/* FOUR PRINCIPLES BAR */}
      <div className="bg-stone-900 text-stone-100 px-4 py-3 text-xs border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold font-mono">P1:</span>
            <span className="text-stone-300">No claim without provenance.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold font-mono">P2:</span>
            <span className="text-stone-300">No person-data without consent.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold font-mono">P3:</span>
            <span className="text-stone-300">No AI assertion without traceable evidence.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold font-mono">P4:</span>
            <span className="text-stone-300">No single &quot;truth&quot; where legitimate variants exist.</span>
          </div>
        </div>
      </div>

      {/* WORKSPACE LAYOUT */}
      <div className="flex flex-col md:flex-row flex-1 min-h-[640px]">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-stone-200">
            <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
              Research Workspace
            </div>
            <div className="font-bold text-sm text-stone-900 mt-0.5">
              Core Ledger v0.1
            </div>
          </div>

          <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-stone-200 text-xs text-stone-500 bg-stone-50 space-y-2">
            <div className="flex justify-between items-center">
              <span>Data Engine:</span>
              <span className="font-mono text-stone-800 font-medium">{totalRecords} records</span>
            </div>
            <button
              onClick={handleResetData}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline block"
            >
              Reset All Data (Seed Baseline)
            </button>
          </div>
        </aside>

        {/* MAIN VIEW AREA */}
        <main className="flex-1 p-6 overflow-y-auto bg-stone-50/70">
          {currentView === 'dashboard' && (
            <CoreDashboard state={coreState} onNavigate={setCurrentView} />
          )}
          {currentView === 'entities' && (
            <CoreEntitiesView state={coreState} updateState={setCoreState} />
          )}
          {currentView === 'claims' && (
            <CoreClaimsView
              state={coreState}
              updateState={setCoreState}
              onSendToAI={onOpenAIEngine}
            />
          )}
          {currentView === 'evidence' && (
            <CoreEvidenceView state={coreState} updateState={setCoreState} />
          )}
          {currentView === 'testimonies' && (
            <CoreTestimoniesView
              state={coreState}
              updateState={setCoreState}
              onNavigateToConsent={() => setCurrentView('consent')}
            />
          )}
          {currentView === 'reviews' && (
            <CoreReviewsView state={coreState} updateState={setCoreState} />
          )}
          {currentView === 'consent' && (
            <CoreConsentView state={coreState} updateState={setCoreState} />
          )}
          {currentView === 'plurality' && (
            <CorePluralityView state={coreState} updateState={setCoreState} />
          )}
          {currentView === 'audit' && <CoreAuditView state={coreState} />}
          {currentView === 'statemachine' && <CoreStateMachineView />}
        </main>
      </div>
    </div>
  );
};
