/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewMode } from './types/blueprint';
import { NavigationHeader } from './components/NavigationHeader';
import { CivilizationOverview } from './components/CivilizationOverview';
import { ConstitutionViewer } from './components/ConstitutionViewer';
import { OrganismVisualizer } from './components/OrganismVisualizer';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { ContextInjectorSimulator } from './components/ContextInjectorSimulator';
import { LensStudio } from './components/LensStudio';
import { DeathValleySimulator } from './components/DeathValleySimulator';
import { FlywheelEngine } from './components/FlywheelEngine';
import { MemoryIsolationVisualizer } from './components/MemoryIsolationVisualizer';
import { GovernanceProtocolView } from './components/GovernanceProtocolView';
import { ComplianceChecker } from './components/ComplianceChecker';
import { BLUEPRINT_VOLUMES } from './data/canonicalBlueprint';
import { MASTER_AXIOM, WHAT_WE_REFUSE, CONSTITUTIONAL_ARTICLES } from './data/soulConstitution';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi'>('en');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const toggleLanguage = () => {
    setActiveLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleExportFullSpecification = (format: 'markdown' | 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = 'Apni-Duniya-Canonical-Specification';

    if (format === 'markdown') {
      filename += '.md';
      mimeType = 'text/markdown';
      content = `# APNI DUNIYA — CANONICAL SYSTEM ARCHITECTURE & MASTER BLUEPRINT v1.0\n\n` +
        `> **Master Axiom:** ${MASTER_AXIOM.visionEn}\n` +
        `> **External Promise:** ${MASTER_AXIOM.externalPromise}\n` +
        `> **Internal Long-term Thesis:** ${MASTER_AXIOM.internalThesis}\n\n` +
        `---\n\n` +
        `# VOLUME 01: SOUL CONSTITUTION v1.0\n\n` +
        CONSTITUTIONAL_ARTICLES.map(art => 
          `## ${art.number}: ${art.title}\n\n` +
          art.clauses.map(c => 
            `### Section ${c.clauseNumber}\n` +
            `*${c.text}*\n\n` +
            `- **Invariant:** \`${c.architecturalInvariant}\`\n` +
            `- **Code Hook:** \`${c.codeVerificationHook}\`\n` +
            `- **Enforcement:** ${c.enforcementMechanism}\n\n`
          ).join('\n')
        ).join('\n') +
        `\n## THE 9 PROHIBITIONS (WHAT WE REFUSE)\n\n` +
        WHAT_WE_REFUSE.map(p => 
          `### ${p.title}\n` +
          `- **Ban Reason:** ${p.banReason}\n` +
          `- **Industry Practice Banned:** ${p.industryPractice}\n` +
          `- **Apni Duniya Alternative:** ${p.apniDuniyaAlternative}\n` +
          `- **Guardrail Rule:** \`${p.architecturalGuardrail}\`\n\n`
        ).join('\n') +
        `\n---\n\n` +
        `# THE 12-VOLUME MASTER BLUEPRINT\n\n` +
        BLUEPRINT_VOLUMES.map(vol => 
          `## ${vol.number}: ${vol.title}\n*${vol.tagline}*\n\n` +
          vol.chapters.map(ch => 
            `### Chapter ${ch.id}: ${ch.title} — ${ch.subtitle}\n\n` +
            `> **Key Axiom:** ${ch.keyAxiom}\n\n` +
            `**Summary:** ${ch.summary}\n\n` +
            `**Canonical Architecture:**\n${ch.content}\n\n` +
            `**Architectural Rule:** \`${ch.architecturalRule}\`\n\n` +
            `**Tags:** ${ch.tags.join(', ')}\n\n`
          ).join('\n')
        ).join('\n');
    } else {
      filename += '.json';
      mimeType = 'application/json';
      content = JSON.stringify({
        masterAxiom: MASTER_AXIOM,
        soulConstitution: {
          articles: CONSTITUTIONAL_ARTICLES,
          whatWeRefuse: WHAT_WE_REFUSE
        },
        blueprintVolumes: BLUEPRINT_VOLUMES
      }, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Fixed Navigation Header */}
      <NavigationHeader
        currentView={currentView}
        onSelectView={setCurrentView}
        activeLanguage={activeLanguage}
        onToggleLanguage={toggleLanguage}
        onExportBlueprint={() => setShowExportModal(true)}
      />

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <CivilizationOverview
            onSelectView={setCurrentView}
            activeLanguage={activeLanguage}
          />
        )}

        {currentView === 'constitution' && (
          <ConstitutionViewer activeLanguage={activeLanguage} />
        )}

        {currentView === 'organism' && (
          <OrganismVisualizer activeLanguage={activeLanguage} />
        )}

        {currentView === 'blueprint' && (
          <BlueprintExplorer activeLanguage={activeLanguage} />
        )}

        {currentView === 'context-injector' && (
          <ContextInjectorSimulator activeLanguage={activeLanguage} />
        )}

        {currentView === 'lens-studio' && (
          <LensStudio activeLanguage={activeLanguage} />
        )}

        {currentView === 'governance' && (
          <GovernanceProtocolView activeLanguage={activeLanguage} />
        )}

        {currentView === 'death-valley' && (
          <DeathValleySimulator activeLanguage={activeLanguage} />
        )}

        {currentView === 'flywheels' && (
          <FlywheelEngine activeLanguage={activeLanguage} />
        )}

        {currentView === 'memory-isolation' && (
          <MemoryIsolationVisualizer activeLanguage={activeLanguage} />
        )}

        {currentView === 'compliance-checker' && (
          <ComplianceChecker activeLanguage={activeLanguage} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-800/80 bg-stone-950 py-8 text-center text-xs text-stone-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-mono text-stone-400">
          <span>🌍 APNI DUNIYA &bull; CANONICAL SYSTEM ARCHITECTURE v1.0</span>
          <span>&bull;</span>
          <span className="text-amber-400">IMMUTABLE SOUL ANCHOR</span>
        </div>
        <p className="max-w-2xl mx-auto px-4 text-stone-400">
          “Attention → Intelligence → Utility → Trust → Network → Creation → Economy → Identity → Governance → Infrastructure → Culture → Ecosystem”
        </p>
      </footer>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Export Canonical Architecture
              </h3>
              <p className="text-xs text-stone-400">
                Download the complete 12-Volume Master Blueprint, Soul Constitution, 9 Prohibitions, and Invariants.
              </p>
            </div>

            <div className="space-y-3">
              <button
                id="export-full-md-btn"
                onClick={() => handleExportFullSpecification('markdown')}
                className="w-full p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-between transition-colors shadow-lg shadow-amber-500/20"
              >
                <span>Download Comprehensive Markdown (.MD)</span>
                <span className="font-mono text-[10px]">85 Chapters</span>
              </button>

              <button
                id="export-full-json-btn"
                onClick={() => handleExportFullSpecification('json')}
                className="w-full p-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center justify-between border border-stone-700 transition-colors"
              >
                <span>Download Machine-Readable Schema (.JSON)</span>
                <span className="font-mono text-[10px]">Full Tree</span>
              </button>
            </div>

            <button
              id="close-export-modal-btn"
              onClick={() => setShowExportModal(false)}
              className="w-full py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
