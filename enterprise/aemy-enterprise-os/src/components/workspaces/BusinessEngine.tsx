import React, { useState } from 'react';
import { Language } from '../../types';
import { 
  TrendingUp, Users, Target, Rocket, DollarSign, 
  BarChart3, Globe, Sparkles, CheckCircle2, FileText 
} from 'lucide-react';

interface BusinessEngineProps {
  lang: Language;
  onExport: () => void;
}

export const BusinessEngine: React.FC<BusinessEngineProps> = ({ lang, onExport }) => {
  const [activeSegment, setActiveSegment] = useState<'smb' | 'mid' | 'enterprise'>('mid');

  const gtmPhases = [
    {
      phase: 'बीटा लॉन्च (Beta Launch)',
      phaseEn: 'Beta Launch (Days 1 - 30)',
      target: '100-200 Early Adopters',
      channels: 'Hacker News, ProductHunt, Reddit (r/webdev), Twitter/X Tech',
      goals: 'बग्स फिक्स करना, 99% कनेक्टर स्टेबिलिटी, उपयोगकर्ता केस स्टडीज'
    },
    {
      phase: 'आधिकारिक लॉन्च (Official Launch)',
      phaseEn: 'Commercial Launch (Days 31 - 90)',
      target: '1,000+ भुगतानकर्ता ग्राहक ($80k+ MRR)',
      channels: 'Google Search Ads, LinkedIn InMail, Tech Conferences (AWS re:Invent)',
      goals: 'सेल्फ-सर्व प्रो प्लान एक्टिवेशन, स्ट्राइप रिकरिंग बिलिंग, 99.9% SLA'
    },
    {
      phase: 'ग्लोबल स्केलिंग (Global Scaling)',
      phaseEn: 'Enterprise Scaling (Months 4 - 12)',
      target: '10,000+ ग्राहक ($1M+ ARR)',
      channels: 'AWS Marketplace, Azure AppSource, Google Cloud Partner Directory',
      goals: 'यूरोप (GDPR) व एशिया विस्तार, कस्टम एंटरप्राइज़ कॉन्ट्रैक्ट्स'
    }
  ];

  const channels = [
    { name: 'Developer & Tech Communities', share: '35%', cac: '$24', ltv: '$980', conversion: '6.2%' },
    { name: 'SEO & Inbound Content', share: '25%', cac: '$18', ltv: '$850', conversion: '4.8%' },
    { name: 'Cloud Partner Marketplaces', share: '20%', cac: '$120', ltv: '$14,200', conversion: '12.4%' },
    { name: 'Targeted LinkedIn & B2B Ads', share: '20%', cac: '$95', ltv: '$3,400', conversion: '5.1%' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Overview */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
            {lang === 'hi' ? 'व्यापार योजना एवं GTM इंजन' : 'Business & Go-To-Market Engine'}
          </span>
          <h3 className="font-display font-bold text-2xl text-white">
            {lang === 'hi' ? '$1M+ ARR की स्पष्ट वाणिज्यिक रूपरेखा' : '$1,000,000 ARR Commercial Blueprint'}
          </h3>
          <p className="text-xs sm:text-sm text-[#9a9ab0] mt-1">
            {lang === 'hi'
              ? 'Freemium से लेकर Enterprise तक — ग्राहक अर्जन लागत (CAC) और लाइफटाइम वैल्यू (LTV) का संतुलित गणित।'
              : 'Calibrated customer acquisition economics balancing frictionless freemium with high-retention enterprise ARR.'}
          </p>
        </div>

        <button
          onClick={onExport}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-[0_4px_16px_rgba(124,92,255,0.3)]"
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'hi' ? 'पूरी योजना एक्सपोर्ट करें' : 'Export Full Plan'}</span>
        </button>
      </div>

      {/* 3-Phase GTM Timeline */}
      <div className="p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'चरणबद्ध गो-टू-मार्केट (GTM) रोडमैप' : 'Phased Go-To-Market Execution'}</span>
          </h4>
          <span className="text-xs text-[#c4b5fd] font-mono">90-Day Velocity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gtmPhases.map((phase, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#7c5cff]/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-[#7c5cff]/20 text-[#22d3ee] font-bold text-xs flex items-center justify-center font-mono">
                  0{idx + 1}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-[#9a9ab0]">
                  {lang === 'hi' ? phase.target : phase.target}
                </span>
              </div>

              <h5 className="font-bold text-sm text-white">
                {lang === 'hi' ? phase.phase : phase.phaseEn}
              </h5>

              <div className="space-y-1.5 text-xs text-[#9a9ab0]">
                <div>
                  <span className="text-[#c4c4d8] font-medium">चैनल्स: </span>
                  <span>{phase.channels}</span>
                </div>
                <div>
                  <span className="text-[#22d3ee] font-medium">प्राथमिक लक्ष्य: </span>
                  <span>{phase.goals}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Channel Matrix & Unit Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Channel Economics Table */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#7c5cff]" />
              <span>{lang === 'hi' ? 'मार्केटिंग चैनल एवं यूनिट इकोनॉमिक्स' : 'Channel Unit Economics'}</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">Avg CAC: $38</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#9a9ab0]">
                  <th className="pb-2 font-medium">चैनल</th>
                  <th className="pb-2 font-medium">हिस्सेदारी</th>
                  <th className="pb-2 font-medium">CAC</th>
                  <th className="pb-2 font-medium">LTV</th>
                  <th className="pb-2 font-medium">कन्वर्जन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {channels.map((ch, i) => (
                  <tr key={i} className="text-[#e7e7f0] hover:bg-white/[0.02]">
                    <td className="py-2.5 font-sans font-medium text-white">{ch.name}</td>
                    <td className="py-2.5 text-[#22d3ee]">{ch.share}</td>
                    <td className="py-2.5">{ch.cac}</td>
                    <td className="py-2.5 text-emerald-400">{ch.ltv}</td>
                    <td className="py-2.5">{ch.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Segmentation Targets */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#22d3ee]" />
                <span>{lang === 'hi' ? 'लक्षित ग्राहक प्रोफाइल' : 'Customer Segmentation'}</span>
              </h4>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveSegment('smb')}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    activeSegment === 'smb' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] bg-white/5'
                  }`}
                >
                  SMBs
                </button>
                <button
                  onClick={() => setActiveSegment('mid')}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    activeSegment === 'mid' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] bg-white/5'
                  }`}
                >
                  Mid-Market
                </button>
                <button
                  onClick={() => setActiveSegment('enterprise')}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    activeSegment === 'enterprise' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] bg-white/5'
                  }`}
                >
                  Enterprise
                </button>
              </div>
            </div>

            {activeSegment === 'smb' && (
              <div className="space-y-2.5 text-xs text-[#9a9ab0]">
                <p className="text-white font-medium">स्टार्टअप्स एवं छोटे व्यवसाय (1 - 20 कर्मचारी)</p>
                <p>मूल्य बिंदु: $0 (Freemium) ➔ $29/माह। मुख्य उपयोग: Google Sheets, Slack, Shopify को तुरंत ऑटोमेट करना।</p>
                <div className="p-3 rounded-xl bg-[#07070d] border border-white/5 font-mono text-[11px] text-[#22d3ee]">
                  LTV: $680 · Monthly Churn: &lt; 2.5% · Payback: 1.4 months
                </div>
              </div>
            )}

            {activeSegment === 'mid' && (
              <div className="space-y-2.5 text-xs text-[#9a9ab0]">
                <p className="text-white font-medium">बढ़ते मध्यम व्यवसाय (20 - 250 कर्मचारी)</p>
                <p>मूल्य बिंदु: $79 - $299/माह। मुख्य उपयोग: Salesforce CRM, PostgreSQL, AI Voice Dialer और सेल्फ-हीलिंग वर्कफ़्लो।</p>
                <div className="p-3 rounded-xl bg-[#07070d] border border-white/5 font-mono text-[11px] text-[#22d3ee]">
                  LTV: $3,800 · Monthly Churn: &lt; 0.9% · Payback: 2.1 months
                </div>
              </div>
            )}

            {activeSegment === 'enterprise' && (
              <div className="space-y-2.5 text-xs text-[#9a9ab0]">
                <p className="text-white font-medium">बड़ी कंपनियाँ एवं ग्लोबल एंटरप्राइज़ (250+ कर्मचारी)</p>
                <p>मूल्य बिंदु: $1,200+/माह। मुख्य उपयोग: Connect Gateway ऑन-प्रिमाइसेस, जीरो-ट्रस्ट अनुपालन, 24/7 SLA।</p>
                <div className="p-3 rounded-xl bg-[#07070d] border border-white/5 font-mono text-[11px] text-[#22d3ee]">
                  ACV: $18,000+ · Net Dollar Retention: 128% · Contract: 12-36 mo
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-[#9a9ab0] flex items-center justify-between">
            <span>{lang === 'hi' ? 'राजस्व विविधीकरण: सुरक्षित व स्केलेबल' : 'Monetization Architecture: Secure & Scalable'}</span>
            <span className="text-emerald-400 font-bold">$1M ARR Target: Q4</span>
          </div>
        </div>

      </div>

    </div>
  );
};
