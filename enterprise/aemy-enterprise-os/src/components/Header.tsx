import React from 'react';
import { ShieldCheck, Sparkles, Download, RefreshCw, Layers } from 'lucide-react';
import { KillGoMetrics } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  metrics: KillGoMetrics;
  onExport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  metrics,
  onExport,
  onReset,
}) => {
  const isGo =
    metrics.truthApprovalRate >= 80 &&
    metrics.trustPreferenceRate >= 70 &&
    metrics.conversionLift >= 20 &&
    metrics.sustainabilityRetention >= 60;

  const tabs = [
    {
      id: 'core_v01',
      labelEn: 'Cultural Core v0.1',
      labelHi: 'सांस्कृतिक कोर v0.1 (प्रोटोटाइप)',
      icon: '🏛️',
    },
    {
      id: 'home_food',
      labelEn: 'Kanpur Home-Food Pilot',
      labelHi: 'कानपुर घरेलू भोजन पायलट (Day 1-7)',
      icon: '🍲',
    },
    {
      id: 'ai_engine',
      labelEn: 'AI Studio Structuring Engine',
      labelHi: 'AI Studio स्ट्रक्चरिंग इंजन',
      icon: '✨',
    },
    {
      id: 'claims',
      labelEn: 'Cultural Records (CVR)',
      labelHi: 'सांस्कृतिक रिकॉर्ड (CVR)',
      icon: '📜',
    },
    {
      id: 'voice_intake',
      labelEn: 'Voice Intake ("बोलिए")',
      labelHi: 'मौखिक गवाही ("बोलिए")',
      icon: '🎙️',
    },
    {
      id: 'health_index',
      labelEn: 'Cultural Health Index',
      labelHi: 'सांस्कृतिक स्वास्थ्य सूचकांक',
      icon: '📊',
    },
    {
      id: 'competitive',
      labelEn: 'Competitive Audit v1.1',
      labelHi: 'प्रतिस्पर्धी विश्लेषण v1.1',
      icon: '🔍',
    },
    {
      id: 'roadmap',
      labelEn: '2028+ Roadmap & Identity',
      labelHi: '२०२८+ रोडमैप व पहचान',
      icon: '👤',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-tight text-stone-100 text-lg sm:text-xl">
                  {lang === 'hi' ? 'संस्कृति सत्यापन ओएस' : 'Cultural Verification OS'}
                </span>
                <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  v1.1 Pilot
                </span>
              </div>
              <p className="hidden md:block text-xs text-stone-400">
                {lang === 'hi'
                  ? 'सामुदायिक सत्ता • साक्ष्य ग्राफ़ • सत्य-से-आर्थिक रूपांतरण प्रणाली'
                  : 'Community Governance • Provenance Graph • Economic Loop'}
              </p>
            </div>
          </div>

          {/* Quick Kill/Go Status Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isGo
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isGo ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isGo ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span>{isGo ? (lang === 'hi' ? 'स्थिति: GO (स्वीकृत)' : 'Status: GO') : (lang === 'hi' ? 'स्थिति: समीक्षा' : 'Status: REVIEW')}</span>
            </div>

            {/* Language switch */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1 text-xs font-medium text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
              title="Toggle Language / भाषा बदलें"
            >
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {/* Export Report button */}
            <button
              id="export-report-btn"
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Export Audit Report (JSON)"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'रिपोर्ट निर्यात' : 'Export Audit'}</span>
            </button>

            {/* Reset dataset */}
            <button
              id="reset-data-btn"
              onClick={onReset}
              className="rounded-lg border border-stone-800 bg-stone-900 p-1.5 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-colors"
              title="Reset to default experiment state"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2.5 scrollbar-none border-t border-stone-800/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
