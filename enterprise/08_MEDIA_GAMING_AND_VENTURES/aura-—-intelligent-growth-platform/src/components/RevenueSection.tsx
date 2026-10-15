import React, { useState } from 'react';
import { RevenueTier, Language } from '../types';
import { DollarSign, Check, TrendingUp, Calculator, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface RevenueSectionProps {
  tiers: RevenueTier[];
  lang: Language;
  onSelectOption: (optionId: '1' | '2' | '3') => void;
}

export const RevenueSection: React.FC<RevenueSectionProps> = ({
  tiers,
  lang,
  onSelectOption,
}) => {
  // Calculator state
  const [freeUsers, setFreeUsers] = useState<number>(4500);
  const [conversionRate, setConversionRate] = useState<number>(4.2); // %
  const [proPrice, setProPrice] = useState<number>(79); // $/month
  const [enterpriseCount, setEnterpriseCount] = useState<number>(18);
  const enterpriseAvgPrice = 1450; // $/month

  // Calculations
  const payingProCount = Math.round((freeUsers * conversionRate) / 100);
  const proMrr = payingProCount * proPrice;
  const enterpriseMrr = enterpriseCount * enterpriseAvgPrice;
  const totalMrr = proMrr + enterpriseMrr;
  const totalArr = totalMrr * 12;
  const targetArr = 1000000;
  const targetProgress = Math.min(100, Math.round((totalArr / targetArr) * 100));

  return (
    <section id="revenue" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-xs font-semibold tracking-wider text-[#93c5fd] uppercase mb-4">
            <DollarSign className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'राजस्व मॉडल' : 'Revenue Model & Unit Economics'}</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            {lang === 'hi' ? 'विविध और स्केलेबल आय मॉडल' : 'Diversified & Scalable Revenue Model'}
          </h2>

          <p className="text-base sm:text-lg text-[#9a9ab0] leading-relaxed">
            {lang === 'hi'
              ? 'हर ग्राहक खंड के लिए अनुकूलित मूल्य निर्धारण — Freemium से लेकर Enterprise तक $1M+ ARR की दिशा में।'
              : 'Tailored pricing tiers optimized for maximum conversion — scaling from zero-friction freemium to high-LTV enterprise.'}
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier, idx) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-7 border transition-all flex flex-col justify-between ${
                idx === 1
                  ? 'bg-gradient-to-b from-[#7c5cff]/15 via-white/[0.04] to-transparent border-[#7c5cff]/60 shadow-[0_12px_40px_rgba(124,92,255,0.2)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {idx === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] text-white text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(124,92,255,0.4)]">
                  {lang === 'hi' ? 'सबसे लोकप्रिय (Recommended)' : 'Core Growth Engine'}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5cff]/20 to-[#3b82f6]/20 border border-[#7c5cff]/30 flex items-center justify-center font-display font-extrabold text-2xl text-[#c4b5fd]">
                    {tier.symbol}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#9a9ab0] font-mono">
                    {tier.price}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-2">
                  {lang === 'hi' ? tier.nameHi : tier.nameEn}
                </h3>

                <p className="text-xs sm:text-sm text-[#9a9ab0] mb-5 leading-relaxed">
                  {lang === 'hi' ? tier.descHi : tier.descEn}
                </p>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
                  <span className="text-[11px] text-[#9a9ab0] block">
                    {lang === 'hi' ? 'लक्षित ग्राहक (Target Audience):' : 'Target Customer:'}
                  </span>
                  <span className="text-xs font-semibold text-[#22d3ee] mt-0.5 block">
                    {lang === 'hi' ? tier.targetHi : tier.targetEn}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6 text-xs text-[#e7e7f0]">
                  {(lang === 'hi' ? tier.highlightsHi : tier.highlightsEn).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#7c5cff]/20 text-[#22d3ee] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectOption('3')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  idx === 1
                    ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_20px_rgba(124,92,255,0.3)] hover:opacity-95'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                {lang === 'hi' ? 'मॉडल रणनीति देखें' : 'Examine Tier Economics'}
              </button>
            </div>
          ))}
        </div>

        {/* Interactive ARR & Revenue Calculator */}
        <div className="rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#22d3ee] uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>{lang === 'hi' ? 'इंटरैक्टिव ARR प्रोजेक्टर' : 'Interactive ARR Projection Engine'}</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                {lang === 'hi' ? '$1M+ ARR लक्ष्य सिमुलेटर' : '$1,000,000 Target ARR Simulator'}
              </h3>
              <p className="text-xs sm:text-sm text-[#9a9ab0] mt-1">
                {lang === 'hi'
                  ? 'उपयोगकर्ताओं की संख्या और रूपांतरण दर समायोजित करके देखें कि Aura $1M ARR लक्ष्य कैसे प्राप्त करेगा।'
                  : 'Tune user acquisition volumes and conversion rates to simulate path to $1M ARR.'}
              </p>
            </div>

            {/* Total ARR Outcome Display */}
            <div className="flex items-center gap-4 bg-[#07070d] p-4 rounded-xl border border-[#7c5cff]/30">
              <div>
                <span className="text-[11px] text-[#9a9ab0] block uppercase tracking-wider">
                  {lang === 'hi' ? 'अनुमानित वार्षिक ARR' : 'Projected ARR'}
                </span>
                <span className="font-display font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] bg-clip-text text-transparent">
                  ${totalArr.toLocaleString()}
                </span>
              </div>
              <div className="pl-4 border-l border-white/10">
                <span className="text-[11px] text-[#9a9ab0] block uppercase tracking-wider">
                  {lang === 'hi' ? 'मासिक MRR' : 'Monthly MRR'}
                </span>
                <span className="font-mono font-bold text-lg text-[#22d3ee]">
                  ${totalMrr.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-white/10">
            
            {/* Slider 1: Free Users */}
            <div>
              <div className="flex justify-between text-xs text-[#9a9ab0] mb-2 font-mono">
                <span>{lang === 'hi' ? 'सक्रिय फ़्री उपयोगकर्ता' : 'Active Free Users'}</span>
                <span className="text-white font-bold">{freeUsers.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="250"
                value={freeUsers}
                onChange={(e) => setFreeUsers(Number(e.target.value))}
                className="w-full accent-[#7c5cff] cursor-pointer"
              />
              <span className="text-[10px] text-[#9a9ab0] mt-1 block">
                {lang === 'hi' ? 'Freemium ऑनबोर्डिंग से' : 'From frictionless onboarding'}
              </span>
            </div>

            {/* Slider 2: Conversion % */}
            <div>
              <div className="flex justify-between text-xs text-[#9a9ab0] mb-2 font-mono">
                <span>{lang === 'hi' ? 'फ़्रीमियम रूपांतरण दर' : 'Conversion Rate'}</span>
                <span className="text-[#22d3ee] font-bold">{conversionRate}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-[#22d3ee] cursor-pointer"
              />
              <span className="text-[10px] text-[#9a9ab0] mt-1 block">
                {payingProCount} {lang === 'hi' ? 'भुगतानकर्ता प्रो ग्राहक' : 'paying Pro users'}
              </span>
            </div>

            {/* Slider 3: Pro Price */}
            <div>
              <div className="flex justify-between text-xs text-[#9a9ab0] mb-2 font-mono">
                <span>{lang === 'hi' ? 'प्रो प्लान शुल्क' : 'Pro Tier Fee'}</span>
                <span className="text-white font-bold">${proPrice}/mo</span>
              </div>
              <input
                type="range"
                min="29"
                max="299"
                step="10"
                value={proPrice}
                onChange={(e) => setProPrice(Number(e.target.value))}
                className="w-full accent-[#3b82f6] cursor-pointer"
              />
              <span className="text-[10px] text-[#9a9ab0] mt-1 block">
                ${proMrr.toLocaleString()}/mo {lang === 'hi' ? 'प्रो MRR' : 'Pro MRR'}
              </span>
            </div>

            {/* Slider 4: Enterprise Count */}
            <div>
              <div className="flex justify-between text-xs text-[#9a9ab0] mb-2 font-mono">
                <span>{lang === 'hi' ? 'एंटरप्राइज़ अनुबंध' : 'Enterprise Contracts'}</span>
                <span className="text-white font-bold">{enterpriseCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={enterpriseCount}
                onChange={(e) => setEnterpriseCount(Number(e.target.value))}
                className="w-full accent-[#7c5cff] cursor-pointer"
              />
              <span className="text-[10px] text-[#9a9ab0] mt-1 block">
                ${enterpriseMrr.toLocaleString()}/mo {lang === 'hi' ? 'एंटरप्राइज़ MRR' : 'Enterprise MRR'}
              </span>
            </div>

          </div>

          {/* Target Progress Bar */}
          <div className="pt-6">
            <div className="flex items-center justify-between text-xs text-[#9a9ab0] mb-2 font-mono">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#22d3ee]" />
                {lang === 'hi' ? '$1,000,000 लक्ष्य की ओर प्रगति:' : 'Progress to $1,000,000 Milestone:'}
              </span>
              <span className="text-white font-bold">{targetProgress}%</span>
            </div>

            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] rounded-full transition-all duration-300"
                style={{ width: `${targetProgress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9a9ab0]">
              <span>
                {totalArr >= targetArr ? (
                  <span className="text-emerald-400 font-semibold">
                    {lang === 'hi' ? '✓ $1M ARR लक्ष्य सफलतापूर्वक पार कर लिया गया है!' : '✓ $1M ARR milestone successfully achieved!'}
                  </span>
                ) : (
                  <span>
                    {lang === 'hi' 
                      ? `$1M लक्ष्य तक पहुँचने के लिए $${(targetArr - totalArr).toLocaleString()} और आवश्यक हैं।` 
                      : `$${(targetArr - totalArr).toLocaleString()} remaining to hit target.`}
                  </span>
                )}
              </span>

              <button
                onClick={() => onSelectOption('3')}
                className="text-[#22d3ee] hover:text-white font-medium flex items-center gap-1 transition-colors"
              >
                <span>{lang === 'hi' ? 'मार्केटिंग और GTM रणनीति खोलें' : 'Open GTM Channel Strategy'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
