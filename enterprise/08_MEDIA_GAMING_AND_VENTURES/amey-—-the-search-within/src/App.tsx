/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, Pillar, ResearchSeriesItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StudioWingsOverview } from './components/StudioWingsOverview';
import { PillarsSection } from './components/PillarsSection';
import { PlaybookWorkbench } from './components/PlaybookWorkbench';
import { StudioLabsView } from './components/StudioLabsView';
import { StudioProductsView } from './components/StudioProductsView';
import { ContentFunnelView } from './components/ContentFunnelView';
import { ConnectorsHub } from './components/ConnectorsHub';
import { ResearchSeriesReader } from './components/ResearchSeriesReader';
import { BookPreview } from './components/BookPreview';
import { AgencyAuditTool } from './components/AgencyAuditTool';
import { BrandEcosystemMap } from './components/BrandEcosystemMap';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [presetPlaybookQuestion, setPresetPlaybookQuestion] = useState<string | undefined>();
  const [presetPlaybookPillar, setPresetPlaybookPillar] = useState<string | undefined>();
  const [presetFunnelInquiry, setPresetFunnelInquiry] = useState<string | undefined>();
  const [presetConnectorsTitle, setPresetConnectorsTitle] = useState<string | undefined>();
  const [presetConnectorsInquiry, setPresetConnectorsInquiry] = useState<string | undefined>();
  const [presetConnectorsTab, setPresetConnectorsTab] = useState<'connectors' | 'mcp' | 'installer'>('connectors');

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'installer') {
      setPresetConnectorsTab('installer');
      const element = document.getElementById('connectors');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateWing = (wingId: string) => {
    const targetMap: Record<string, string> = {
      research: 'pillars',
      labs: 'labs',
      products: 'products',
      media: 'funnel',
      connectors: 'connectors',
      installer: 'installer',
      publications: 'series',
    };
    handleNavigate(targetMap[wingId] || wingId);
  };

  const handleSendToConnectors = (title: string, inquiry: string) => {
    setPresetConnectorsTitle(title);
    setPresetConnectorsInquiry(inquiry);
    setPresetConnectorsTab('connectors');
    handleNavigate('connectors');
  };

  const handleSelectPillarForPlaybook = (pillar: Pillar) => {
    const q = language === 'hi' ? pillar.coreQuestionHi : pillar.coreQuestionEn;
    setPresetPlaybookQuestion(q);
    setPresetPlaybookPillar(pillar.titleEn);
    handleNavigate('playbook');
  };

  const handleSendSeriesToPlaybook = (item: ResearchSeriesItem) => {
    const q = language === 'hi' ? item.questionHi : item.questionEn;
    setPresetPlaybookQuestion(q);
    setPresetPlaybookPillar(item.category);
    handleNavigate('playbook');
  };

  const handleSendToFunnel = (inquiryText: string) => {
    setPresetFunnelInquiry(inquiryText);
    handleNavigate('funnel');
  };

  const handleAgencyAuditResult = (theme: string) => {
    setPresetPlaybookQuestion(theme);
    setPresetPlaybookPillar('Human Agency');
    handleNavigate('playbook');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-900/40 selection:text-amber-200">
      {/* 3-Zone Top Bar */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenLab={() => handleNavigate('labs')}
      />

      <main>
        {/* Curatorial Hero with Aemy AI Studio by Amit Sharma */}
        <Hero
          language={language}
          onExplorePillars={() => handleNavigate('pillars')}
          onReadSeries={() => handleNavigate('series')}
          onLaunchPlaybook={() => handleNavigate('playbook')}
        />

        {/* Studio Wings Directory (5 Wings Overview) */}
        <StudioWingsOverview
          language={language}
          onNavigateWing={handleNavigateWing}
        />

        {/* Wing 01: Research (01 - 05 Core Pillars) */}
        <PillarsSection
          language={language}
          onSelectPillarForPlaybook={handleSelectPillarForPlaybook}
        />

        {/* Wing 01: Research Playbook Workbench (8-Step Scientific Protocol) */}
        <PlaybookWorkbench
          language={language}
          presetQuestion={presetPlaybookQuestion}
          presetPillar={presetPlaybookPillar}
          onClearPreset={() => {
            setPresetPlaybookQuestion(undefined);
            setPresetPlaybookPillar(undefined);
          }}
          onSendToFunnel={handleSendToFunnel}
          onBroadcastConnectors={handleSendToConnectors}
        />

        {/* Wing 02: Labs (Live Autonomous Agent Sandbox & Explainability Testbeds) */}
        <StudioLabsView language={language} />

        {/* Wing 03: Products (Applied AI Tools & SaaS Prototypes) */}
        <StudioProductsView
          language={language}
          onLaunchTool={handleNavigate}
        />

        {/* Wing 04: Media (Cascading Content Machine & Multi-Platform Funnel) */}
        <ContentFunnelView
          language={language}
          initialInquiry={presetFunnelInquiry}
          onBroadcastConnectors={handleSendToConnectors}
        />

        {/* Wing 04 Distribution: Social Connectors & Model Context Protocol (MCP) Hub & Auto-Installer */}
        <ConnectorsHub
          language={language}
          initialTab={presetConnectorsTab}
          presetTitle={presetConnectorsTitle}
          presetInquiry={presetConnectorsInquiry}
        />

        {/* Wing 05: Publications (Research Series 001 - 007) */}
        <ResearchSeriesReader
          language={language}
          onSendToFunnel={handleSendToFunnel}
          onSendToPlaybook={handleSendSeriesToPlaybook}
        />

        {/* Wing 05: Publications (The Search Within 12-Chapter Monograph) */}
        <BookPreview language={language} />

        {/* Interactive Human Agency Diagnostic */}
        <AgencyAuditTool
          language={language}
          onLaunchPlaybookWithResult={handleAgencyAuditResult}
        />

        {/* 10-Year Institutional Architecture Tree */}
        <BrandEcosystemMap language={language} />
      </main>

      {/* Epistemic Creed & Footer */}
      <Footer language={language} onNavigate={handleNavigate} />
    </div>
  );
}
