/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrandName, Language, Phase } from './types';
import { 
  PHASES as initialPhases, 
  CONNECTORS as connectors, 
  EXECUTION_OPTIONS as executionOptions, 
  REVENUE_TIERS as revenueTiers 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OptionsSection } from './components/OptionsSection';
import { PhasesSection } from './components/PhasesSection';
import { ConnectorsSection } from './components/ConnectorsSection';
import { RevenueSection } from './components/RevenueSection';
import { MasterBlueprintSection } from './components/MasterBlueprintSection';
import { ProductionOrchestrator } from './components/ProductionOrchestrator';
import { ExportModal } from './components/ExportModal';
import { Footer } from './components/Footer';

export default function App() {
  // Brand state with local storage
  const [brand, setBrand] = useState<BrandName>(() => {
    const saved = localStorage.getItem('aura_brand');
    return (saved === 'Synapse' ? 'Synapse' : 'Aura') as BrandName;
  });

  // Language state (Hindi default as per conversation, with English toggle)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('aura_lang');
    return (saved === 'en' ? 'en' : 'hi') as Language;
  });

  // Selected execution path: 1 (Brand), 2 (Tech MVP), 3 (Business)
  const [selectedOptionId, setSelectedOptionId] = useState<'1' | '2' | '3'>(() => {
    const saved = localStorage.getItem('aura_selected_option');
    return (saved === '1' || saved === '3' ? saved : '2') as '1' | '2' | '3';
  });

  // Phase tasks state
  const [phases, setPhases] = useState<Phase[]>(() => {
    const saved = localStorage.getItem('aura_phases_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialPhases;
      }
    }
    return initialPhases;
  });

  // Export modal state
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aura_brand', brand);
  }, [brand]);

  useEffect(() => {
    localStorage.setItem('aura_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('aura_selected_option', selectedOptionId);
  }, [selectedOptionId]);

  useEffect(() => {
    localStorage.setItem('aura_phases_state', JSON.stringify(phases));
  }, [phases]);

  const handleToggleTask = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((p) => {
        if (p.id !== phaseId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        };
      })
    );
  };

  const handleSelectOptionAndScroll = (optionId: '1' | '2' | '3') => {
    setSelectedOptionId(optionId);
    const el = document.getElementById('options');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToConnectors = () => {
    const el = document.getElementById('connectors');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToPhases = () => {
    const el = document.getElementById('phases');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#e7e7f0] selection:bg-[#7c5cff]/30 selection:text-[#22d3ee]">
      {/* Top Navigation */}
      <Navbar
        brand={brand}
        onBrandChange={setBrand}
        lang={lang}
        onLangChange={setLang}
        onSelectNextStep={() => handleSelectOptionAndScroll(selectedOptionId)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          brand={brand}
          lang={lang}
          onSelectOption={handleSelectOptionAndScroll}
          onExploreConnectors={handleScrollToConnectors}
          onViewPhases={handleScrollToPhases}
        />

        {/* Real Production Orchestrator & Live Operating System */}
        <ProductionOrchestrator
          brand={brand}
          lang={lang}
        />

        {/* The 3 Options Focal Section + Dedicated Interactive Studio */}
        <OptionsSection
          options={executionOptions}
          selectedOptionId={selectedOptionId}
          onSelectOption={setSelectedOptionId}
          brand={brand}
          onBrandChange={setBrand}
          lang={lang}
          onExport={() => setIsExportOpen(true)}
        />

        {/* 3-Phase Systematic Roadmap */}
        <PhasesSection
          phases={phases}
          lang={lang}
          onToggleTask={handleToggleTask}
          onSelectOption={handleSelectOptionAndScroll}
        />

        {/* Top 25 MVP Connectors Section */}
        <ConnectorsSection
          connectors={connectors}
          lang={lang}
        />

        {/* Revenue Model & ARR Calculator */}
        <RevenueSection
          tiers={revenueTiers}
          lang={lang}
          onSelectOption={handleSelectOptionAndScroll}
        />

        {/* Master Build Prompt Specifications Suite (Section 1 to 8) */}
        <MasterBlueprintSection
          brand={brand}
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer brand={brand} lang={lang} />

      {/* Blueprint Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        brand={brand}
        lang={lang}
        selectedOptionId={selectedOptionId}
      />
    </div>
  );
}
