import React, { useState } from 'react';
import { Terminal, DollarSign, Clock, Users, ArrowRight, CheckCircle2, Skull, Sparkles, Calculator, Copy, Check, Tag } from 'lucide-react';
import { MICRO_BUSINESS_IDEAS } from '../data/blueprintData';
import { MicroBusinessIdea } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';

interface MicroBusinessIncubatorProps {
  language: SupportedLanguage;
  onSelectForSimulation: (idea: MicroBusinessIdea) => void;
}

export const MicroBusinessIncubator: React.FC<MicroBusinessIncubatorProps> = ({
  language,
  onSelectForSimulation
}) => {
  const [selectedIdea, setSelectedIdea] = useState<MicroBusinessIdea>(MICRO_BUSINESS_IDEAS[0]);
  const [subscriberCount, setSubscriberCount] = useState<number>(15);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const monthlyGrossRevenueINR = subscriberCount * selectedIdea.pricePerMonthINR;
  const netMonthlyProfitINR = monthlyGrossRevenueINR - selectedIdea.monthlyHostingINR;

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Hero Card */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'घटक 5: पहला राजस्व टूल (Hello World of Money)' : 'Component 5: The First Micro-Business Incubator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'बोरिंग, 48-घंटे में बनने वाले तत्काल कैशफ़्लो टूल्स'
                : 'Boring, Solvable Micro-SaaS for Day 1 Monetization'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'AI को "अगला Facebook" नहीं बनाना है। उसे एक ऐसा सरल, यूटिलिटी टूल बनाना है जो तुरंत ₹199-₹999 कमा सके। अगर 7 दिन में 0 यूजर्स आते हैं तो ग्रिम रीपर प्रोजेक्ट को डिलीट कर नए आइडिया पर जाता है।'
                : 'Zero fluff or bloated moonshots. Autonomous AI starts with high-utility, boring micro-SaaS priced at ₹199 to ₹999/mo, governed by a strict 7-day kill switch.'}
            </p>
          </div>

          <div className="bg-white border border-[#141414] px-4 py-3 flex items-center space-x-3 shrink-0 shadow-xs">
            <DollarSign className="w-5 h-5 text-[#141414]" />
            <div>
              <div className="text-[10px] font-mono font-bold text-[#575653] uppercase">TARGET FIRST REVENUE</div>
              <div className="text-xs text-[#141414] font-mono font-bold">₹500 - ₹1,000 in Week 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Micro-Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {MICRO_BUSINESS_IDEAS.map((idea) => {
          const isSelected = selectedIdea.id === idea.id;
          return (
            <div
              key={idea.id}
              onClick={() => setSelectedIdea(idea)}
              className={`cursor-pointer p-4 border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-xs'
                  : 'bg-white border-[#141414] hover:bg-[#F4F3F0] text-[#141414]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 border ${
                    isSelected
                      ? 'bg-white text-[#141414] border-white'
                      : 'bg-[#ECEBE8] text-[#141414] border-[#141414]'
                  }`}>
                    ₹{idea.pricePerMonthINR}/mo
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-1 border ${
                    isSelected ? 'border-white/30 text-white/80' : 'border-[#141414]/30 text-[#575653]'
                  }`}>
                    [{idea.integrityStatus || 'PROTOTYPE'}]
                  </span>
                </div>
                <h2 className="text-sm font-serif font-bold mb-1 leading-snug">
                  {language === 'hi' ? idea.titleHi : idea.title}
                </h2>
                <p className={`text-xs line-clamp-2 ${isSelected ? 'text-[#c2c0bb]' : 'text-[#575653]'}`}>{idea.tagline}</p>
              </div>

              <div className={`text-xs font-mono font-semibold flex items-center justify-between pt-2 border-t ${
                isSelected ? 'border-white/20 text-white' : 'border-[#141414]/15 text-[#141414]'
              }`}>
                <span>{isSelected ? (language === 'hi' ? 'चयनित (Active)' : 'Selected') : (language === 'hi' ? 'डिटेल्स देखें →' : 'View Spec →')}</span>
                <span className={`text-[10px] ${isSelected ? 'text-[#a8a6a1]' : 'text-[#575653]'}`}>Break-even: {idea.breakEvenPaidUsers} users</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Idea Deep Dive Workspace & Interactive Unit Economics Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spec Overview (2 cols) */}
        <div className="lg:col-span-2 bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#141414]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-[#575653] uppercase">SPECIFICATION BLUEPRINT</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white border border-[#141414] text-[#141414]">
                  STATUS: {selectedIdea.integrityStatus || 'PROTOTYPE'}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#141414] mt-0.5">
                {language === 'hi' ? selectedIdea.titleHi : selectedIdea.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onSelectForSimulation(selectedIdea)}
              className="bg-[#141414] hover:bg-black text-[#E4E3E0] text-xs font-mono font-bold px-4 py-2 border border-[#141414] transition flex items-center space-x-1.5 shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'इस आइडिया को इंजन में चलाएं' : 'Simulate in Agent Engine'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Problem Quote */}
          <div className="bg-white p-4 border border-[#141414]">
            <span className="text-[10px] text-[#575653] font-mono uppercase block mb-1">Authentic Discovered Pain Point:</span>
            <blockquote className="text-xs sm:text-sm italic font-serif text-[#141414]">
              "{selectedIdea.problemQuote}"
            </blockquote>
          </div>

          {/* Features Checklist */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#141414] mb-2.5">Core Functional MVP Scope (48-Hour Build)</h3>
            <div className="space-y-1.5">
              {selectedIdea.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-[#141414]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acquisition & Kill Switch Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 border border-[#141414] space-y-1">
              <span className="font-bold text-[#141414] font-mono flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Zero-CAC Growth Channel:</span>
              </span>
              <p className="text-[#575653] font-sans">{selectedIdea.growthChannel}</p>
            </div>

            <div className="bg-white p-3.5 border border-[#141414] space-y-1">
              <span className="font-bold text-[#8b3a0f] font-mono flex items-center space-x-1.5">
                <Skull className="w-3.5 h-3.5" />
                <span>7-Day Grim Reaper Kill Rule:</span>
              </span>
              <p className="text-[#8b3a0f] font-sans">{selectedIdea.killSwitchCriteria}</p>
            </div>
          </div>

          {/* Code Sample */}
          <div className="bg-white p-3.5 border border-[#141414] relative">
            <div className="flex justify-between items-center text-xs text-[#575653] mb-1.5 font-mono">
              <span className="text-[10px] uppercase font-bold text-[#141414]">Core Service Code (TypeScript)</span>
              <button
                type="button"
                onClick={() => handleCopyCode(selectedIdea.codeSample, selectedIdea.id)}
                className="hover:text-[#141414] flex items-center space-x-1"
              >
                {copiedId === selectedIdea.id ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedIdea.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-[#141414] overflow-x-auto max-h-48">
              {selectedIdea.codeSample}
            </pre>
          </div>
        </div>

        {/* Interactive Unit Economics Calculator (1 col) */}
        <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#141414] font-mono">
              <Calculator className="w-3.5 h-3.5" />
              <span>UNIT ECONOMICS CALCULATOR</span>
              <span className="text-[9px] bg-white px-1 border border-[#141414]">SIMULATED</span>
            </div>

            <h3 className="text-base font-serif font-bold text-[#141414]">Monthly Cashflow Forecast</h3>

            {/* Slider for subscribers */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#141414] font-mono">
                <span>Active Paid Subscribers:</span>
                <span className="font-bold text-sm">{subscriberCount} Users</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={subscriberCount}
                onChange={(e) => setSubscriberCount(Number(e.target.value))}
                className="w-full accent-[#141414] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#575653] font-mono">
                <span>1 user (MVP test)</span>
                <span>100 users (Micro-Scale)</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="bg-white p-4 border border-[#141414] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#575653]">Subscription Price:</span>
                <span className="text-[#141414]">₹{selectedIdea.pricePerMonthINR} / month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#575653]">Gross MRR:</span>
                <span className="text-[#141414] font-bold">₹{monthlyGrossRevenueINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#575653]">Server & API Cost:</span>
                <span className="text-[#8b3a0f]">-₹{selectedIdea.monthlyHostingINR}</span>
              </div>
              <div className="pt-2 border-t border-[#141414]/20 flex justify-between text-sm">
                <span className="text-[#141414] font-sans font-bold">Net Monthly Profit:</span>
                <span className="text-[#10b981] font-bold">₹{netMonthlyProfitINR.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 border border-[#141414] text-xs text-[#575653] space-y-1 font-mono">
            <div className="font-bold text-[#141414]">⚡ Break-even Point:</div>
            <p className="font-sans">
              Just <strong>{selectedIdea.breakEvenPaidUsers} paid users</strong> (₹{selectedIdea.breakEvenPaidUsers * selectedIdea.pricePerMonthINR}) fully covers the monthly server and Gemini API bills!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
