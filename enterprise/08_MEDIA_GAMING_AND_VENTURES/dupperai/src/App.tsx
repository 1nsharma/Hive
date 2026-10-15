import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { PublicDupperApp } from './components/PublicDupperApp';
import { CampaignPipeline } from './components/CampaignPipeline';
import { VideoStudio } from './components/VideoStudio';
import { VisualGraphicEngine } from './components/VisualGraphicEngine';
import { AvatarPersonaEngine } from './components/AvatarPersonaEngine';
import { ChatbotEngine } from './components/ChatbotEngine';
import { AdaptiveDesign } from './components/AdaptiveDesign';
import { BrandHub } from './components/BrandHub';
import { HeadlessDistribution } from './components/HeadlessDistribution';
import { PredictiveABTest } from './components/PredictiveABTest';
import { UnifiedAnalytics } from './components/UnifiedAnalytics';
import { PipelineArchitectureDiagram } from './components/PipelineArchitectureDiagram';

import {
  initialBrandKit,
  sampleCampaigns,
  samplePersonas,
  sampleAccounts,
  sampleScheduledPosts,
} from './data/initialData';

import { BrandKit, AdaptedCampaign, ChatbotPersona, ScheduledPost, Platform } from './types';

export default function App() {
  const [currentBrand, setCurrentBrand] = useState<BrandKit>(initialBrandKit);
  const [brandList, setBrandList] = useState<BrandKit[]>([initialBrandKit]);
  const [activeTab, setActiveTab] = useState<TabType>('publicApp');
  const [activeAccountScope, setActiveAccountScope] = useState<'all' | 'personal' | 'public'>('all');

  const [campaigns, setCampaigns] = useState<AdaptedCampaign[]>(sampleCampaigns);
  const [personas, setPersonas] = useState<ChatbotPersona[]>(samplePersonas);
  const [accounts, setAccounts] = useState(sampleAccounts);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(sampleScheduledPosts);

  const handleCampaignCreated = (newCampaign: AdaptedCampaign) => {
    setCampaigns([newCampaign, ...campaigns]);
  };

  const handleSchedulePost = (campaign: AdaptedCampaign, platform: Platform) => {
    const newScheduled: ScheduledPost = {
      id: `sched-${Date.now()}`,
      campaignTitle: campaign.campaignTitle,
      platform,
      scheduledTime: 'Tomorrow at 10:00 AM',
      status: 'queued',
      accountName: `${currentBrand.name} ${platform.toUpperCase()} Node`,
      accountType: 'public',
      postPreview: campaign.instagram?.caption || campaign.masterPrompt,
    };
    setScheduledPosts([newScheduled, ...scheduledPosts]);
    setActiveTab('distribution');
  };

  const filteredAccounts = accounts.filter((acc) => {
    if (activeAccountScope === 'all') return true;
    return acc.type === activeAccountScope;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      {/* Top Desktop Navigation Header */}
      <Header
        currentBrand={currentBrand}
        onBrandChange={setCurrentBrand}
        brandList={brandList}
        activeAccountScope={activeAccountScope}
        setActiveAccountScope={setActiveAccountScope}
        onNewCampaignClick={() => setActiveTab('pipeline')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          campaignCount={campaigns.length}
          scheduledCount={scheduledPosts.length}
        />

        {/* Primary Main Content View */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 pb-16">
          {activeTab === 'publicApp' && <PublicDupperApp />}

          {activeTab === 'pipeline' && (
            <CampaignPipeline
              currentBrand={currentBrand}
              campaigns={campaigns}
              onCampaignCreated={handleCampaignCreated}
              onSchedulePost={handleSchedulePost}
            />
          )}

          {activeTab === 'video' && <VideoStudio />}

          {activeTab === 'graphic' && <VisualGraphicEngine currentBrand={currentBrand} />}

          {activeTab === 'avatar' && <AvatarPersonaEngine currentBrand={currentBrand} />}

          {activeTab === 'chatbot' && (
            <ChatbotEngine personas={personas} onPersonaUpdated={setPersonas} />
          )}

          {activeTab === 'adaptive' && <AdaptiveDesign />}

          {activeTab === 'brand' && (
            <BrandHub currentBrand={currentBrand} onBrandUpdated={setCurrentBrand} />
          )}

          {activeTab === 'distribution' && (
            <HeadlessDistribution scheduledPosts={scheduledPosts} accounts={filteredAccounts} />
          )}

          {activeTab === 'abtest' && (
            <PredictiveABTest activeCampaign={campaigns[0]} />
          )}

          {activeTab === 'analytics' && <UnifiedAnalytics />}

          {activeTab === 'architecture' && <PipelineArchitectureDiagram />}
        </main>
      </div>
    </div>
  );
}
