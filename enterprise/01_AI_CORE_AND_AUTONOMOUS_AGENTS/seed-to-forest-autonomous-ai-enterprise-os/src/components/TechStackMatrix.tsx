import React, { useState } from 'react';
import { Cpu, Server, Code2, Database, ShieldCheck, CreditCard, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { TECH_STACK_SPEC } from '../data/blueprintData';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';

interface TechStackMatrixProps {
  language: SupportedLanguage;
}

export const TechStackMatrix: React.FC<TechStackMatrixProps> = ({ language }) => {
  const [activeLayer, setActiveLayer] = useState<keyof typeof TECH_STACK_SPEC>('orchestration');
  const [copied, setCopied] = useState(false);

  const layers = [
    { key: 'orchestration' as const, name: '1. Multi-Agent Orchestrator', tech: 'LangGraph / StateGraph', icon: Cpu, color: 'emerald' },
    { key: 'aiModel' as const, name: '2. AI Engine & Vision', tech: 'Gemini 3.7 Flash', icon: Code2, color: 'teal' },
    { key: 'sandbox' as const, name: '3. Isolated Sandbox', tech: 'Docker / E2B Sandbox', icon: Terminal, color: 'blue' },
    { key: 'hosting' as const, name: '4. Automated Hosting', tech: 'Vercel REST Deploy API', icon: Server, color: 'purple' },
    { key: 'treasuryPayment' as const, name: '5. Programmable Payments', tech: 'Stripe Connect / Safe Gnosis', icon: CreditCard, color: 'amber' },
    { key: 'database' as const, name: '6. Durable Database', tech: 'Supabase / Serverless Postgres', icon: Database, color: 'indigo' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(TECH_STACK_SPEC[activeLayer].codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Hero Header */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <Server className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'घटक 4: प्रौद्योगिकी ढांचा (Production Stack)' : 'Component 4: Production Tech Stack'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'Day 1 प्रोडक्शन इंजीनियरिंग स्टैक आर्किटेक्चर'
                : 'Day 1 Production Engineering Tech Stack'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'जटिल ब्लॉकचेन के बिना सिद्ध, तेज और किफायती टूल्स: LangGraph स्टेटग्राफ, Docker आइसोलेटेड सैंडबॉक्स, Vercel REST API, Stripe Connect और Gemini 3.7 Flash।'
                : 'Battle-tested, lightweight and cost-effective tools ready for immediate execution without infrastructure bloat.'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Flow Pipeline */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-3 shadow-xs">
        <h2 className="text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider">
          Autonomous Execution Pipeline (The Loop)
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="bg-white p-3 border border-[#141414] w-full text-center">
            <span className="text-[#141414] font-mono text-[10px] font-bold block mb-0.5">1. INGESTION</span>
            <span className="text-[#575653]">Reddit/Twitter Scraper</span>
          </div>
          <span className="text-[#141414] font-bold hidden lg:inline">→</span>
          <div className="bg-white p-3 border border-[#141414] w-full text-center">
            <span className="text-[#141414] font-mono text-[10px] font-bold block mb-0.5">2. STATEGRAPH</span>
            <span className="text-[#575653]">LangGraph (Scout & Analyst)</span>
          </div>
          <span className="text-[#141414] font-bold hidden lg:inline">→</span>
          <div className="bg-white p-3 border border-[#141414] w-full text-center">
            <span className="text-[#141414] font-mono text-[10px] font-bold block mb-0.5">3. CODE GEN</span>
            <span className="text-[#575653]">Gemini 3.7 Flash (@google/genai)</span>
          </div>
          <span className="text-[#141414] font-bold hidden lg:inline">→</span>
          <div className="bg-white p-3 border border-[#141414] w-full text-center">
            <span className="text-[#141414] font-mono text-[10px] font-bold block mb-0.5">4. SANDBOX AUDIT</span>
            <span className="text-[#575653]">Docker & Constitution Check</span>
          </div>
          <span className="text-[#141414] font-bold hidden lg:inline">→</span>
          <div className="bg-white p-3 border border-[#141414] w-full text-center">
            <span className="text-[#141414] font-mono text-[10px] font-bold block mb-0.5">5. AUTO-DEPLOY</span>
            <span className="text-[#575653]">Vercel & Stripe Connect</span>
          </div>
        </div>
      </div>

      {/* Layer Tabs & Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Layer Selector */}
        <div className="space-y-2">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === layer.key;
            return (
              <div
                key={layer.key}
                onClick={() => setActiveLayer(layer.key)}
                className={`cursor-pointer p-3.5 border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-xs'
                    : 'bg-white border-[#141414] hover:bg-[#F4F3F0] text-[#141414]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 border flex items-center justify-center ${
                    isSelected ? 'bg-white text-[#141414] border-white' : 'bg-[#ECEBE8] text-[#141414] border-[#141414]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold">{layer.name}</h3>
                    <p className={`text-[11px] font-mono ${isSelected ? 'text-[#a8a6a1]' : 'text-[#575653]'}`}>{layer.tech}</p>
                  </div>
                </div>
                <span className={`text-xs font-mono ${isSelected ? 'text-white' : 'text-[#575653]'}`}>{isSelected ? '●' : '→'}</span>
              </div>
            );
          })}
        </div>

        {/* Code & Architectural Deep Dive */}
        <div className="lg:col-span-2 bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#141414]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#575653] uppercase">LAYER ARCHITECTURE</span>
                <h3 className="text-base font-serif font-bold text-[#141414] mt-0.5">
                  {TECH_STACK_SPEC[activeLayer].name}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-[#F4F3F0] text-[#141414] text-xs font-mono font-semibold px-3 py-1.5 border border-[#141414] transition flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="text-xs text-[#141414] space-y-1.5">
              <p><strong className="font-mono">Functional Role:</strong> <span className="text-[#575653] font-sans">{TECH_STACK_SPEC[activeLayer].role}</span></p>
              <p><strong className="font-mono">Advantage:</strong> <span className="text-[#8b3a0f] font-sans">{TECH_STACK_SPEC[activeLayer].pros}</span></p>
            </div>

            <div className="bg-white p-3.5 border border-[#141414]">
              <pre className="text-xs font-mono text-[#141414] overflow-x-auto leading-relaxed max-h-72">
                {TECH_STACK_SPEC[activeLayer].codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
