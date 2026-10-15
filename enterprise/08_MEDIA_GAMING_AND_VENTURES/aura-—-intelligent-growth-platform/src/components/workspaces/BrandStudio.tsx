import React, { useState } from 'react';
import { BrandName, Language } from '../../types';
import { Sparkles, Palette, Copy, Check, Eye, Type, MessageSquare, Play, ShieldAlert, Cpu } from 'lucide-react';

interface BrandStudioProps {
  brand: BrandName;
  onBrandChange: (brand: BrandName) => void;
  lang: Language;
}

export const BrandStudio: React.FC<BrandStudioProps> = ({
  brand,
  onBrandChange,
  lang,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedTagline, setSelectedTagline] = useState<number>(0);

  const colors = [
    { name: 'Deep Space Obsidian', hex: '#07070d', role: 'Background Canvas' },
    { name: 'Electric Violet', hex: '#7c5cff', role: 'Primary Accent & Gradient' },
    { name: 'Hyper Blue', hex: '#3b82f6', role: 'Secondary Accent & Flow' },
    { name: 'Neon Cyan', hex: '#22d3ee', role: 'Tertiary Spark & Pulse' },
    { name: 'Starlight Silver', hex: '#e7e7f0', role: 'High Contrast Body' },
    { name: 'Muted Twilight', hex: '#9a9ab0', role: 'Subtle Metadata' },
  ];

  const taglines = [
    {
      en: 'The Invisible Force Behind Your Growth',
      hi: 'आपकी वृद्धि के पीछे की अदृश्य शक्ति',
      context: 'Emphasizes seamless, frictionless automation.'
    },
    {
      en: 'Where Data Meets Intelligence',
      hi: 'जहाँ डेटा मिलता है बुद्धिमत्ता से',
      context: 'Highlights cognitive synthesis & unified understanding.'
    }
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Brand Selector Toggle */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
              {lang === 'hi' ? 'ब्रांड पहचान चयनकर्ता' : 'Brand Archetype Selector'}
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              {brand === 'Aura' ? 'Aura (ऑरा)' : 'Synapse (सिनैप्स)'}
            </h3>
            <p className="text-xs text-[#9a9ab0] mt-1">
              {brand === 'Aura'
                ? 'अदृश्य शक्ति, स्मार्टनेस, और सहजता को दर्शाने वाला प्रीमियम नाम।'
                : 'कनेक्टिविटी, गति, और बुद्धिमत्ता (मस्तिष्क के न्यूरॉन्स जैसा नेटवर्क)।'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#07070d] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => onBrandChange('Aura')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                brand === 'Aura'
                  ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-lg'
                  : 'text-[#9a9ab0] hover:text-white'
              }`}
            >
              Aura
            </button>
            <button
              onClick={() => onBrandChange('Synapse')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                brand === 'Synapse'
                  ? 'bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-white shadow-lg'
                  : 'text-[#9a9ab0] hover:text-white'
              }`}
            >
              Synapse
            </button>
          </div>
        </div>
      </div>

      {/* Visual Identity & Logo Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dynamic Logo Mark Display */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider">
                {lang === 'hi' ? 'डायनामिक लोगो मार्क' : 'Dynamic Logo Concept'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7c5cff]/20 text-[#c4b5fd]">
                Conic Gradient Core
              </span>
            </div>

            <div className="py-8 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] p-[3px] shadow-[0_0_50px_rgba(124,92,255,0.6)] animate-pulse-glow">
                <div className="w-full h-full bg-[#07070d] rounded-[21px] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="font-display font-extrabold text-3xl text-white mt-6 tracking-wide">
                {brand}
              </div>
              <div className="text-xs text-[#22d3ee] font-mono mt-1">
                {taglines[selectedTagline].en}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-[#9a9ab0] flex items-center justify-between">
            <span>{lang === 'hi' ? 'डिज़ाइन दर्शन: प्रवाह (Flow) & न्यूरल कनेक्शन' : 'Design Philosophy: Flow & Neural Cohesion'}</span>
            <span className="text-white font-mono">SVG / Figma Ready</span>
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span>{lang === 'hi' ? 'रंग पैलेट (Design System Colors)' : 'Color Palette System'}</span>
              </span>
              <span className="text-[10px] text-[#9a9ab0]">
                {lang === 'hi' ? 'क्लिक करके HEX कॉपी करें' : 'Click to copy HEX'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {colors.map((c) => (
                <div
                  key={c.hex}
                  onClick={() => handleCopy(c.hex)}
                  className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div
                    className="w-full h-10 rounded-lg mb-2 shadow-inner border border-white/10 flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {copiedHex === c.hex && (
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white">{c.hex}</span>
                    <Copy className="w-3 h-3 text-[#9a9ab0] group-hover:text-white" />
                  </div>
                  <div className="text-[10px] text-[#9a9ab0] mt-0.5 truncate">{c.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Spec */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#7c5cff]" />
              <span>{lang === 'hi' ? 'टाइपोग्राफी पदानुक्रम' : 'Typography Pairings'}</span>
            </div>
            <p className="text-xs text-[#9a9ab0]">
              Display Headings: <span className="text-white font-semibold">Manrope (ExtraBold)</span> · Body & Interface: <span className="text-white font-semibold">Inter</span> · Code: <span className="text-white font-semibold">JetBrains Mono</span>
            </p>
          </div>
        </div>

      </div>

      {/* Taglines & Brand Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tagline Selection */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-3">
            {lang === 'hi' ? 'टैगलाइन विकल्प' : 'Tagline Strategy Options'}
          </span>

          <div className="space-y-3">
            {taglines.map((t, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTagline(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTagline === idx
                    ? 'bg-[#7c5cff]/15 border-[#7c5cff]/60 text-white'
                    : 'bg-white/[0.02] border-white/10 text-[#9a9ab0] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span>"{t.en}"</span>
                  {selectedTagline === idx && <Check className="w-4 h-4 text-[#22d3ee]" />}
                </div>
                <div className="text-xs text-[#c4c4d8] mt-1">"{t.hi}"</div>
                <div className="text-[11px] text-[#9a9ab0] mt-1.5">{t.context}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Partner Philosophy */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7c5cff]/10 via-white/[0.02] to-[#22d3ee]/10 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider block mb-2">
              {lang === 'hi' ? 'ब्रांड दर्शन (Brand Philosophy)' : 'Brand Philosophy'}
            </span>

            <h4 className="font-display font-bold text-lg text-white mb-2">
              "{brand} एक टूल नहीं, एक सजीव भागीदार है।"
            </h4>

            <p className="text-xs sm:text-sm text-[#9a9ab0] leading-relaxed mb-4">
              {lang === 'hi'
                ? 'यह केवल डेटा को जोड़ता नहीं, बल्कि उसे समझता, विश्लेषण करता और स्वायत्त रूप से कार्यवाही करता है। ग्राहक को शून्य कॉन्फ़िगरेशन की आवश्यकता होगी — सिस्टम स्वयं सब कुछ संभालेगा।'
                : 'It is not a mere passive integration pipe; it perceives business intent, synthesizes cross-tool memory, and takes preemptive action autonomously.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#07070d]/60 border border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#22d3ee] font-medium">
              {lang === 'hi' ? 'सजीव भागीदार का सिद्धांत: शून्य रुकावट' : 'Zero-Config Autonomous Agent'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Ready for UI
            </span>
          </div>
        </div>

      </div>

      {/* Live Interactive UI/UX Wireframe Preview */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#07070d] border border-[#7c5cff]/30 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#22d3ee]" />
            <span className="text-sm font-bold text-white">
              {lang === 'hi' ? 'लाइव UI/UX वायरफ्रेम डेमो (Aura Dashboard Preview)' : 'Live UI/UX Wireframe Preview'}
            </span>
          </div>
          <span className="text-xs text-[#9a9ab0] font-mono">Figma Wireframe v1.0</span>
        </div>

        {/* Embedded Mock Dashboard */}
        <div className="rounded-xl border border-white/10 bg-[#0d0d1a] p-4 sm:p-6 space-y-6">
          
          {/* Mock Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c5cff] to-[#22d3ee] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="font-display font-bold text-white text-base">Aura Intelligence OS</span>
            </div>

            {/* Zero-Config Search Bar */}
            <div className="flex-1 max-w-md mx-auto w-full">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#9a9ab0] flex items-center justify-between">
                <span>"मेरे Salesforce और Google Sheets को जोड़ दो..."</span>
                <span className="px-1.5 py-0.5 rounded bg-[#7c5cff]/30 text-[#c4b5fd] text-[10px] font-mono">AI Search</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>25 Connectors Online</span>
            </div>
          </div>

          {/* Mock Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Widget 1: Unified Data Feed */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#c4b5fd] mb-3">
                <span>Unified Data Stream</span>
                <span className="text-[#22d3ee]">GraphQL Live</span>
              </div>
              <div className="space-y-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#07070d] text-[#e7e7f0] border border-white/5">
                  <span className="text-[#7c5cff]">● [PostgreSQL]</span> 1,240 records synced
                </div>
                <div className="p-2 rounded bg-[#07070d] text-[#e7e7f0] border border-white/5">
                  <span className="text-[#3b82f6]">● [Salesforce]</span> New lead "Acme Corp"
                </div>
              </div>
            </div>

            {/* Widget 2: AI Voice Dialer Preview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between items-center text-xs font-semibold text-[#22d3ee] mb-3">
                <span>AI Voice Agent</span>
                <span className="text-emerald-400">Idle / Ready</span>
              </div>
              <div className="p-2.5 rounded bg-[#07070d] text-[11px] text-[#9a9ab0] border border-white/5 mb-2">
                "Hi Amit, I saw your enquiry about enterprise connector pipelines. Can I book a 15-min demo for Thursday?"
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#9a9ab0]">
                <span>Twilio Media Stream</span>
                <span className="text-[#c4b5fd]">STT 98.4% Accuracy</span>
              </div>
            </div>

            {/* Widget 3: Self-Healing Telemetry */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between items-center text-xs font-semibold text-emerald-400 mb-3">
                <span>Self-Healing Engine</span>
                <span className="text-white">Active</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#9a9ab0]">
                  <span>Redis Queue buffer:</span>
                  <span className="text-white font-mono">0 pending</span>
                </div>
                <div className="flex justify-between text-[#9a9ab0]">
                  <span>Circuit Breaker:</span>
                  <span className="text-emerald-400 font-mono">CLOSED (Healthy)</span>
                </div>
                <div className="flex justify-between text-[#9a9ab0]">
                  <span>Auto-Retries today:</span>
                  <span className="text-[#22d3ee] font-mono">14 resolved</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
