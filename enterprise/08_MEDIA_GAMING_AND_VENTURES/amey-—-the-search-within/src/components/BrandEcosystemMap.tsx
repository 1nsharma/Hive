import React, { useState } from 'react';
import { Language } from '../types';
import { BRAND_INFO, STUDIO_WINGS } from '../data/researchData';
import { Network, Layers, GitBranch, Shield, Sparkles, Milestone, UserCheck } from 'lucide-react';

interface BrandEcosystemMapProps {
  language: Language;
}

export const BrandEcosystemMap: React.FC<BrandEcosystemMapProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [activeBranch, setActiveBranch] = useState<string>('all');

  const roadmap10Years = [
    { year: 'Phase 1', itemEn: 'Seed Questions & Atomic Inquiries (X / Discourse)', itemHi: 'गहन प्रश्न और संक्षिप्त पोस्ट्स' },
    { year: 'Phase 2', itemEn: 'The 8-Step Research Playbook & Empirical Lab Dossiers', itemHi: '8-चरणीय शोध प्लेबुक और साक्ष्य संग्रह' },
    { year: 'Phase 3', itemEn: 'Aemy AI Studio Labs & Reproducible Agent Sandboxes', itemHi: 'प्रयोगात्मक कोड और एजेंट सैंडबॉक्स' },
    { year: 'Phase 4', itemEn: 'Experimental AI Tools & SaaS Prototypes (Products)', itemHi: 'प्रायोगिक एआई उपकरण और सास' },
    { year: 'Phase 5', itemEn: 'THE SEARCH WITHIN Long-Form Video Essays (YouTube)', itemHi: 'वीडियो निबंध शृंखला (द सर्च विदिन)' },
    { year: 'Phase 6', itemEn: 'Formal Whitepapers & Policy Architecture', itemHi: 'औपचारिक शोध पत्र और नीति रिपोर्ट' },
    { year: 'Phase 7', itemEn: 'Flagship Monograph: THE SEARCH WITHIN (12 Chapters)', itemHi: 'प्रमुख मोनोग्राफ पुस्तक (12 अध्याय)' },
    { year: '10-Year', itemEn: 'Enduring Autonomous Think-Tank & Studio Canon', itemHi: 'स्थायी स्वतंत्र बौद्धिक थिंक-टैंक' },
  ];

  return (
    <section id="ecosystem" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            <span>{isHi ? 'ब्रांड संरचना' : 'Brand Architecture & Ecosystem'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            AEMY AI STUDIO
          </h2>
          <div className="text-xs font-mono text-stone-400 mt-1">
            {isHi ? `संस्थापक: ${BRAND_INFO.founder}` : `By ${BRAND_INFO.founder}`} · {isHi ? BRAND_INFO.positioningHi : BRAND_INFO.positioningEn}
          </div>
          <p className="mt-3 text-sm sm:text-base text-stone-300 font-serif italic leading-relaxed">
            "{isHi ? BRAND_INFO.publicLineHi : BRAND_INFO.publicLineEn}"
          </p>
        </div>

        {/* Identity & Studio Dual Synthesis Card */}
        <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <UserCheck className="h-4 w-4" />
              <span>{isHi ? 'व्यक्तिगत पहचान + स्वतंत्र ब्रांड का सामंजस्य' : 'Personal Identity & Independent Studio Bridge'}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl leading-relaxed">
              {isHi
                ? 'यह संरचना आपकी व्यक्तिगत पहचान (अमित शर्मा) और स्वतंत्र प्रौद्योगिकी/अनुसंधान ब्रांड (Aemy AI Studio) को अलग भी रखती है और जोड़ती भी है। अमित शर्मा विचारक और शोधकर्ता हैं; Aemy AI Studio वह संस्थान है जो उत्पादों, प्रयोगों और प्रकाशनों का निर्माण करता है।'
                : 'This architecture cleanly delineates and connects Amit Sharma (the personal researcher, thinker, and founder) with Aemy AI Studio (the independent technology laboratory, software studio, and publishing canon).'}
            </p>
          </div>
          <div className="rounded-lg border border-stone-700 bg-stone-950 p-4 text-xs font-mono space-y-1 shrink-0">
            <div className="text-amber-400 font-semibold">Amit Sharma</div>
            <div className="text-stone-400">Independent Researcher</div>
            <div className="text-stone-600">↓ anchors</div>
            <div className="text-stone-200 font-semibold">Aemy AI Studio</div>
          </div>
        </div>

        {/* Studio Tree Architecture Visualizer */}
        <div className="mt-12 rounded-xl border border-stone-800 bg-stone-900/40 p-6 sm:p-10 backdrop-blur-sm">
          <div className="text-xs font-mono text-stone-400 uppercase tracking-widest text-center mb-8">
            {isHi ? '5-शाखीय स्टूडियो वास्तुकला' : 'Five-Branch Institutional Matrix'}
          </div>

          {/* Root Header */}
          <div className="text-center">
            <div className="inline-block rounded-xl border border-amber-500/70 bg-stone-900 px-8 py-3.5 shadow-xl shadow-amber-950/20">
              <div className="font-serif text-2xl sm:text-3xl font-light text-stone-100">
                AEMY AI STUDIO
              </div>
              <div className="text-[11px] font-mono text-amber-400 mt-1">
                By Amit Sharma · {isHi ? BRAND_INFO.positioningHi : BRAND_INFO.positioningEn}
              </div>
            </div>
          </div>

          {/* Down Connector */}
          <div className="w-0.5 h-8 bg-stone-700 mx-auto" />

          {/* 5 Branches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            {/* Branch 1: Research */}
            <div className="rounded-lg border border-stone-800 bg-stone-950/80 p-4 space-y-2">
              <div className="font-mono text-xs text-amber-400 font-semibold">
                ├── RESEARCH
              </div>
              <ul className="space-y-1 text-xs text-stone-300 font-mono">
                <li>• AI</li>
                <li>• Human Intelligence</li>
                <li>• Future Systems</li>
              </ul>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-800">
                {isHi ? '8-चरणीय शोध प्लेबुक' : '8-Step Empirical Playbook'}
              </div>
            </div>

            {/* Branch 2: Labs */}
            <div className="rounded-lg border border-stone-800 bg-stone-950/80 p-4 space-y-2">
              <div className="font-mono text-xs text-sky-400 font-semibold">
                ├── LABS
              </div>
              <ul className="space-y-1 text-xs text-stone-300 font-mono">
                <li>• AI Experiments</li>
                <li>• Autonomous Agents</li>
                <li>• Sandbox & Telemetry</li>
              </ul>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-800">
                {isHi ? 'मैकेनिस्टिक व्याख्यात्मकता' : 'Explainability Testbeds'}
              </div>
            </div>

            {/* Branch 3: Products */}
            <div className="rounded-lg border border-stone-800 bg-stone-950/80 p-4 space-y-2">
              <div className="font-mono text-xs text-emerald-400 font-semibold">
                ├── PRODUCTS
              </div>
              <ul className="space-y-1 text-xs text-stone-300 font-mono">
                <li>• AI Tools & SaaS</li>
                <li>• Playbook Engine</li>
                <li>• Agency Diagnostic</li>
              </ul>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-800">
                {isHi ? 'व्यावहारिक सॉफ्टवेयर' : 'Deployed Applied Utilities'}
              </div>
            </div>

            {/* Branch 4: Media */}
            <div className="rounded-lg border border-stone-800 bg-stone-950/80 p-4 space-y-2">
              <div className="font-mono text-xs text-indigo-400 font-semibold">
                ├── MEDIA
              </div>
              <ul className="space-y-1 text-xs text-stone-300 font-mono">
                <li>• YouTube (Video Essays)</li>
                <li>• X (Intellectual Threads)</li>
                <li>• LinkedIn (Systems Strategy)</li>
              </ul>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-800">
                {isHi ? 'संरचित वितरण फ़नल' : 'Cascading Content Funnel'}
              </div>
            </div>

            {/* Branch 5: Publications */}
            <div className="rounded-lg border border-stone-800 bg-stone-950/80 p-4 space-y-2">
              <div className="font-mono text-xs text-amber-500 font-semibold">
                └── PUBLICATIONS
              </div>
              <ul className="space-y-1 text-xs text-stone-300 font-mono">
                <li>• Whitepapers</li>
                <li>• The Search Within (12 Ch)</li>
                <li>• Public Inquiries (001-007)</li>
              </ul>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-800">
                {isHi ? 'स्थायी मोनोग्राफ परंपरा' : 'Permanent Epistemic Canon'}
              </div>
            </div>
          </div>
        </div>

        {/* 10-Year Accumulated Horizon Track */}
        <div className="mt-14 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 flex items-center gap-2">
            <Milestone className="h-4 w-4" />
            <span>{isHi ? '10-वर्षीय संचित कार्य-योजना (Amit Sharma)' : 'The 10-Year Cumulative Canon Pathway (Amit Sharma)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {roadmap10Years.map((phase, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-stone-800 bg-stone-900/30 p-4 space-y-1.5 hover:border-stone-700 transition-colors"
              >
                <div className="text-xs font-mono text-amber-500">{phase.year}</div>
                <div className="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed">
                  {isHi ? phase.itemHi : phase.itemEn}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-stone-800 bg-stone-900/50 p-5 text-xs text-stone-400 font-serif italic text-center leading-relaxed">
            "{isHi ? BRAND_INFO.coreRuleHi : BRAND_INFO.coreRuleEn}"
          </div>
        </div>
      </div>
    </section>
  );
};
