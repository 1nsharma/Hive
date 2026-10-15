import React from 'react';
import {
  Sprout,
  ShieldCheck,
  Wallet,
  Terminal,
  Cpu,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Globe
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS, isRTL } from '../data/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onOpenExport: () => void;
  onOpenIntegrityAudit: () => void;
  treasuryBalanceINR: number;
  emergencyHalted: boolean;
  onToggleEmergencyHalt: () => void;
  onResetState: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenExport,
  onOpenIntegrityAudit,
  treasuryBalanceINR,
  emergencyHalted,
  onToggleEmergencyHalt,
  onResetState
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const rtl = isRTL(language);

  const tabs = [
    { id: 'deep_dive', label: t.tabs.deepDive, icon: Sprout },
    { id: 'simulator', label: t.tabs.simulator, icon: Cpu },
    { id: 'constitution', label: t.tabs.constitution, icon: ShieldCheck },
    { id: 'treasury', label: t.tabs.treasury, icon: Wallet },
    { id: 'micro_business', label: t.tabs.microBusiness, icon: Terminal },
    { id: 'tech_stack', label: t.tabs.techStack, icon: FileCode },
    { id: 'roadmap', label: t.tabs.roadmap, icon: CheckCircle2 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#ECEBE8] border-b border-[#141414] text-[#141414] shadow-xs" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Top Banner / High Density Concept Motto */}
      <div className="bg-[#141414] text-[#E4E3E0] px-4 py-1.5 border-b border-[#141414] text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#E4E3E0] text-[11px]">
          <Sprout className="w-3.5 h-3.5 text-[#E4E3E0] shrink-0" />
          <span className="truncate max-w-xl">
            {t.motto}
          </span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse text-[11px]">
          {/* Emergency indicator */}
          {emergencyHalted && (
            <div className="flex items-center space-x-1 bg-red-700 text-white px-2 py-0.5 text-[10px] font-bold border border-red-900 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>EMERGENCY FROZEN</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5 bg-[#2A2A2A] border border-[#444] px-2 py-0.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="text-[#E4E3E0] font-semibold">AST GUARDRAILS: ENFORCED (₹5k CAP)</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 bg-[#2A2A2A] border border-[#444] px-2 py-0.5 text-[10px]">
            <Wallet className="w-3 h-3 text-[#f59e0b]" />
            <span>AI OPS: <strong className="text-white">₹{treasuryBalanceINR.toLocaleString('en-IN')}</strong> / ₹20k</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer shrink-0" onClick={() => setActiveTab('deep_dive')}>
            <div className="w-8 h-8 bg-[#141414] text-[#E4E3E0] flex items-center justify-center border border-[#141414] shadow-xs font-serif font-bold text-sm">
              §
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[#141414]">
                  {t.appTitle}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 border border-[#141414] bg-white font-mono uppercase tracking-wider text-[#141414]">
                  v1.1 PERSISTENT
                </span>
              </div>
              <p className="text-[10px] text-[#575653] font-mono leading-none mt-0.5 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* 10-Point Integrity Audit Button */}
            <button
              type="button"
              onClick={onOpenIntegrityAudit}
              className="flex items-center space-x-1.5 bg-white hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] px-2.5 py-1 text-xs font-mono font-bold transition shadow-xs"
              title="Inspect 10-Point Intellectual Integrity Audit"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="hidden md:inline">{t.actions.integrityAudit}</span>
              <span className="md:hidden">10-Point Audit</span>
            </button>

            {/* Language Switcher Selector (en, hi, de, ja, ar) */}
            <div className="flex items-center border border-[#141414] bg-white text-xs font-mono">
              <Globe className="w-3.5 h-3.5 ml-2 text-[#575653]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-[#141414] px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="hi">हिंदी (HI)</option>
                <option value="en">English (EN)</option>
                <option value="de">Deutsch (DE)</option>
                <option value="ja">日本語 (JA)</option>
                <option value="ar">العربية (AR)</option>
              </select>
            </div>

            {/* Export Code Button */}
            <button
              type="button"
              onClick={onOpenExport}
              className="hidden lg:flex items-center space-x-1.5 bg-white hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] px-2.5 py-1 text-xs font-mono font-medium transition shadow-xs"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{t.actions.exportCode}</span>
            </button>

            {/* Reset State Utility */}
            <button
              type="button"
              onClick={onResetState}
              className="text-[#575653] hover:text-[#141414] p-1.5 border border-transparent hover:border-[#141414]/30 transition"
              title="Reset Local State & Cashflow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex space-x-1 rtl:space-x-reverse overflow-x-auto no-scrollbar py-1.5 border-t border-[#141414]/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 text-xs font-mono font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                    : 'bg-transparent text-[#575653] border-transparent hover:border-[#141414]/30 hover:text-[#141414] hover:bg-black/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E4E3E0]' : 'text-[#575653]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
