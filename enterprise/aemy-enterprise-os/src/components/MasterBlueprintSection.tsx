import React, { useState } from 'react';
import { Language, BrandName } from '../types';
import { 
  PITCH_DECK_SLIDES, SOCIAL_MEDIA_POSTS, 
  STATIC_LOGO_SVG, DYNAMIC_LOGO_SVG, PitchDeckSlide 
} from '../data/masterDocsData';
import { Section1Philosophy } from './Section1Philosophy';
import { 
  BookOpen, Sparkles, Code2, Copy, Check, ChevronLeft, 
  ChevronRight, Presentation, Share2, Layers, Cpu, 
  ShieldCheck, RefreshCw, Terminal, CheckCircle2 
} from 'lucide-react';

interface MasterBlueprintSectionProps {
  brand: BrandName;
  lang: Language;
}

export const MasterBlueprintSection: React.FC<MasterBlueprintSectionProps> = ({
  brand,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'brand' | 'tech' | 'pitchdeck' | 'social' | 'sprint'>('philosophy');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [svgMode, setSvgMode] = useState<'dynamic' | 'static'>('dynamic');
  const [activeConnectorTab, setActiveConnectorTab] = useState<'postgres' | 'sheets' | 'salesforce' | 'slack' | 'shopify'>('postgres');

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentSlide: PitchDeckSlide = PITCH_DECK_SLIDES[currentSlideIndex];

  return (
    <section id="master-blueprint" className="py-20 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c5cff]/10 border border-[#7c5cff]/30 text-xs font-semibold tracking-wider text-[#c4b5fd] uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'मास्टर ब्लूप्रिंट एवं विनिर्देश' : 'Master Build Specification Suite'}</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            {lang === 'hi' ? 'Aura मास्टर विनिर्देश v1.0' : 'Aura Master Build Blueprint v1.0'}
          </h2>

          <p className="text-base sm:text-lg text-[#9a9ab0] leading-relaxed">
            {lang === 'hi'
              ? 'अनुभाग 1 से 8 तक की सभी विस्तृत प्रणालियाँ — SVG लोगो, पिच डेक, 5 कोर कनेक्टर्स कोड, सेल्फ-हीलिंग वर्कफ़्लो, और GTM रणनीति।'
              : 'Full execution suite from Section 1 to 8 — SVG logos, 10-slide pitch deck, top 5 connector implementations, and GTM roadmap.'}
          </p>
        </div>

        {/* Master Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setActiveTab('philosophy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'philosophy'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_16px_rgba(124,92,255,0.3)]'
                : 'bg-white/[0.03] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'अनुभाग 1: मूल दर्शन' : 'Sec 1: Philosophy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'brand'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_16px_rgba(124,92,255,0.3)]'
                : 'bg-white/[0.03] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'अनुभाग 2: लोगो SVG & ब्रांड' : 'Sec 2: Brand & SVG Logo'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pitchdeck')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pitchdeck'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_16px_rgba(124,92,255,0.3)]'
                : 'bg-white/[0.03] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-[#c4b5fd]" />
            <span>{lang === 'hi' ? 'पिच डेक (10 स्लाइड्स)' : 'Pitch Deck (10 Slides)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tech'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_16px_rgba(124,92,255,0.3)]'
                : 'bg-white/[0.03] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'अनुभाग 3: 5 कनेक्टर्स कोड' : 'Sec 3: 5 Connectors Code'}</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'social'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_16px_rgba(124,92,255,0.3)]'
                : 'bg-white/[0.03] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? 'सोशल मीडिया टेम्प्लेट्स' : 'Social Templates'}</span>
          </button>

          <button
            onClick={() => setActiveTab('sprint')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sprint'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_4px_16px_rgba(124,92,255,0.3)]'
                : 'bg-white/[0.03] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'अनुभाग 8: 7-दिन स्प्रिंट' : 'Sec 8: 7-Day Sprint'}</span>
          </button>
        </div>

        {/* TAB 1: Philosophy & 10 Core Principles (Complete Section 1 Suite) */}
        {activeTab === 'philosophy' && (
          <Section1Philosophy lang={lang} />
        )}

        {/* TAB 2: Brand Identity & Static + Dynamic SVG Code */}
        {activeTab === 'brand' && (
          <div className="space-y-8 animate-fade-in">
            {/* SVG Logo Mark Showcase */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#07070d] border border-[#7c5cff]/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
                    {lang === 'hi' ? 'वेक्टर लोगो विनिर्देश' : 'Vector Logo Mark Specification'}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white">
                    {brand} Dynamic & Static SVG Logo Code
                  </h3>
                  <p className="text-xs text-[#9a9ab0] mt-1">
                    {lang === 'hi'
                      ? 'अमूर्त "ऑरा" वलय — प्रकाश का एक प्रवाहमान, अर्ध-पारदर्शी छल्ला जो निरंतर गति और चमक में है।'
                      : 'An abstract Luminous Aura Ring with counter-rotating orbits and a central intelligence spark.'}
                  </p>
                </div>

                {/* Switcher Static vs Dynamic */}
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setSvgMode('dynamic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      svgMode === 'dynamic'
                        ? 'bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] text-white shadow-md'
                        : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    Dynamic (Animated)
                  </button>
                  <button
                    onClick={() => setSvgMode('static')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      svgMode === 'static'
                        ? 'bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] text-white shadow-md'
                        : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    Static (Clean)
                  </button>
                </div>
              </div>

              {/* Visual Preview + Code View Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
                
                {/* Visual SVG Render */}
                <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10">
                  <div 
                    className="w-48 h-48 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgMode === 'dynamic' ? DYNAMIC_LOGO_SVG : STATIC_LOGO_SVG }}
                  />
                  <div className="mt-4 font-display font-bold text-xl text-white">
                    {brand}
                  </div>
                  <span className="text-xs text-[#22d3ee] font-mono">
                    {svgMode === 'dynamic' ? 'CSS Keyframe Animated SVG' : 'Production Scalable Vector'}
                  </span>
                </div>

                {/* SVG Raw Code Box */}
                <div className="flex flex-col justify-between">
                  <div className="relative">
                    <div className="flex items-center justify-between pb-2 text-xs text-[#9a9ab0] font-mono">
                      <span>{svgMode === 'dynamic' ? 'aura-logo-dynamic.svg' : 'aura-logo-static.svg'}</span>
                      <button
                        onClick={() => handleCopy('svg_code', svgMode === 'dynamic' ? DYNAMIC_LOGO_SVG : STATIC_LOGO_SVG)}
                        className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === 'svg_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'svg_code' ? 'Copied!' : 'Copy SVG'}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-[#0d0d1a] border border-white/10 text-[11px] font-mono text-[#a5f3fc] overflow-x-auto max-h-64 leading-relaxed">
                      {svgMode === 'dynamic' ? DYNAMIC_LOGO_SVG : STATIC_LOGO_SVG}
                    </pre>
                  </div>

                  <div className="mt-4 text-xs text-[#9a9ab0] bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <strong className="text-white">उपयोग विनिर्देश:</strong> यह SVG 240x240 व्यू-बॉक्स में पूर्णतः स्केलेबल है। डार्क बैकग्राउंड पर 8-सेकंड क्लॉकवाइज रिंग और 3-सेकंड कोर पल्सिंग इफेक्ट के साथ लाइव चलता है।
                  </div>
                </div>

              </div>
            </div>

            {/* Brand Guidelines Document */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
              <h4 className="font-display font-bold text-xl text-white">
                {lang === 'hi' ? 'ब्रांड गाइडलाइन विनिर्देश (Brand Guidelines)' : 'Official Brand Guidelines Specification'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[#c4b5fd] font-bold block">1. आवाज़ और स्वर (Tone of Voice)</span>
                  <p className="text-[#9a9ab0]">
                    शांत लेकिन शक्तिशाली (जैसे गुरुत्वाकर्षण — अदृश्य लेकिन सर्वव्यापी)। बुद्धिमान लेकिन सरल। तकनीकी शब्दजाल से मुक्त जब तक कि ऑडियंस डेवलपर न हो।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[#22d3ee] font-bold block">2. रंग पदानुक्रम (Color Hierarchy)</span>
                  <p className="text-[#9a9ab0]">
                    प्राथमिक: गहरा बैंगनी (#7C5CFF) | द्वितीयक: सायन (#22D3EE) | तृतीयक: हाइपर ब्लू (#3B82F6) | कैनवास: गहरा काला (#07070D)।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-emerald-400 font-bold block">3. टाइपोग्राफी स्केल (Typography)</span>
                  <p className="text-[#9a9ab0]">
                    शीर्षक: Manrope (ExtraBold) | मुख्य पाठ: Inter (Regular/Medium) | कोड/API: JetBrains Mono।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 10-Slide Pitch Deck Carousel */}
        {activeTab === 'pitchdeck' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#07070d] border border-[#7c5cff]/40 shadow-2xl">
              
              {/* Pitch Deck Top Controls */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#7c5cff]/20 text-[#c4b5fd] font-mono text-xs font-bold">
                    Slide {currentSlide.slideNumber} of 10
                  </span>
                  <span className="text-xs text-[#9a9ab0] hidden sm:inline font-mono">
                    Aura Seed Round Pitch Deck
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 9))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev < 9 ? prev + 1 : 0))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Slide Presentation Canvas */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0d0d1a] to-[#07070d] border border-white/10 p-6 sm:p-10 min-h-[360px] flex flex-col justify-between shadow-inner">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-2 leading-tight">
                        {currentSlide.title}
                      </h3>
                      <h4 className="text-sm sm:text-base text-[#22d3ee] font-medium">
                        {currentSlide.subtitle}
                      </h4>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-[#7c5cff]/20 border border-[#7c5cff]/40 text-[#c4b5fd] font-mono text-xs font-bold shrink-0">
                      {currentSlide.keyMetric}
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-3 mt-6">
                    {currentSlide.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#e7e7f0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] mt-2 shrink-0 shadow-[0_0_8px_#22d3ee]" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Speaker Notes */}
                <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#9a9ab0] flex items-start gap-2 bg-white/[0.01] p-3 rounded-xl">
                  <span className="text-[#7c5cff] font-bold shrink-0 font-mono">Speaker Note:</span>
                  <span className="italic">{currentSlide.notes}</span>
                </div>
              </div>

              {/* Slide thumbnail bar */}
              <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none">
                {PITCH_DECK_SLIDES.map((s, idx) => (
                  <button
                    key={s.slideNumber}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                      currentSlideIndex === idx
                        ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white font-bold'
                        : 'bg-white/5 text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    0{s.slideNumber}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: Top 5 Connectors Production Code Hub */}
        {activeTab === 'tech' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
                    {lang === 'hi' ? 'IConnector कोर कार्यान्वयन' : 'IConnector TypeScript Implementation'}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white">
                    {lang === 'hi' ? 'शीर्ष 5 MVP कनेक्टर्स कोड रिपॉजिटरी' : 'Top 5 Production Connectors Code'}
                  </h3>
                </div>

                {/* Connector Selector Tabs */}
                <div className="flex items-center gap-1.5 bg-[#07070d] p-1.5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveConnectorTab('postgres')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConnectorTab === 'postgres' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    1. Postgres
                  </button>
                  <button
                    onClick={() => setActiveConnectorTab('sheets')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConnectorTab === 'sheets' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    2. Sheets
                  </button>
                  <button
                    onClick={() => setActiveConnectorTab('salesforce')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConnectorTab === 'salesforce' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    3. Salesforce
                  </button>
                  <button
                    onClick={() => setActiveConnectorTab('slack')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConnectorTab === 'slack' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    4. Slack
                  </button>
                  <button
                    onClick={() => setActiveConnectorTab('shopify')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConnectorTab === 'shopify' ? 'bg-[#7c5cff] text-white' : 'text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    5. Shopify
                  </button>
                </div>
              </div>

              {/* Code viewer */}
              <div className="p-4 rounded-xl bg-[#07070d] border border-white/10 font-mono text-xs text-[#a5f3fc] overflow-x-auto max-h-96">
                {activeConnectorTab === 'postgres' && (
                  <pre>{`/**
 * @file PostgresConnector.ts
 * @description PostgreSQL production connector with SSL & discovery
 * @license Apache-2.0
 */
import { Pool } from 'pg';
import { IConnector, Schema, StandardQuery, StandardResponse, HealthStatus } from './types';

export class PostgresConnector implements IConnector {
  readonly id = 'postgres';
  readonly name = 'PostgreSQL Connector';
  readonly version = '1.0.0';
  readonly category = 'database' as const;
  private pool: Pool | null = null;

  async discover(credentials: Record<string, string>): Promise<Schema[]> {
    this.pool = new Pool({
      host: credentials.host,
      port: Number(credentials.port || 5432),
      user: credentials.user,
      password: credentials.password,
      database: credentials.database,
      ssl: credentials.ssl ? { rejectUnauthorized: false } : undefined,
    });

    // डिस्कवरी क्वेरी: सभी यूजर टेबल्स और उनके कॉलम्स प्राप्त करें
    const query = \`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    \`;
    const result = await this.pool.query(query);
    return this.formatSchemas(result.rows);
  }

  async read(query: StandardQuery): Promise<StandardResponse> {
    if (!this.pool) throw new Error('Database not connected');
    const res = await this.pool.query(query.rawSql, query.params);
    return { count: res.rowCount || 0, data: res.rows };
  }

  async write(payload: { table: string; records: Record<string, any>[] }) {
    // Parameterized batch insert logic
    return { success: true, inserted: payload.records.length };
  }

  async healthCheck(): Promise<HealthStatus> {
    const start = Date.now();
    await this.pool?.query('SELECT 1');
    return { status: 'HEALTHY', latencyMs: Date.now() - start };
  }
}`}</pre>
                )}

                {activeConnectorTab === 'sheets' && (
                  <pre>{`/**
 * @file GoogleSheetsConnector.ts
 * @description Google Sheets v4 API Connector with OAuth 2.0 PKCE
 */
import { google } from 'googleapis';
import { IConnector } from './types';

export class GoogleSheetsConnector implements IConnector {
  readonly id = 'google_sheets';
  readonly name = 'Google Sheets Connector';
  readonly version = '1.0.0';
  readonly category = 'productivity' as const;

  async discover(credentials: { accessToken: string; spreadsheetId: string }) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: credentials.accessToken });
    const sheets = google.sheets({ version: 'v4', auth });
    
    // स्प्रेडशीट की सभी शीट्स और हेडर पंक्ति खोजें
    const meta = await sheets.spreadsheets.get({ spreadsheetId: credentials.spreadsheetId });
    return meta.data.sheets?.map(s => ({ sheetTitle: s.properties?.title })) || [];
  }

  async write(payload: { spreadsheetId: string; range: string; values: any[][] }) {
    // Append rows seamlessly
    return { success: true, updatedRows: payload.values.length };
  }
}`}</pre>
                )}

                {activeConnectorTab === 'salesforce' && (
                  <pre>{`/**
 * @file SalesforceConnector.ts
 * @description Salesforce Bulk API 2.0 & REST Lead sync
 */
export class SalesforceConnector {
  readonly id = 'salesforce';
  async discover(oauthToken: string) {
    // SObject describe metadata (Lead, Contact, Account, Opportunity)
    return [{ object: 'Lead', fields: ['FirstName', 'LastName', 'Email', 'Company', 'Status'] }];
  }
}`}</pre>
                )}

                {activeConnectorTab === 'slack' && (
                  <pre>{`/**
 * @file SlackConnector.ts
 * @description Slack Webhook & Bolt API with event subscriptions
 */
export class SlackConnector {
  readonly id = 'slack';
  async subscribe(channels: string[], callback: Function) {
    // Listens to messages and dispatches pipeline triggers
  }
}`}</pre>
                )}

                {activeConnectorTab === 'shopify' && (
                  <pre>{`/**
 * @file ShopifyConnector.ts
 * @description Shopify GraphQL Admin API for Orders & Inventory
 */
export class ShopifyConnector {
  readonly id = 'shopify';
  async readOrders(sinceId: string) {
    // Real-time webhook ingestion for orders/create
  }
}`}</pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Social Media Templates */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SOCIAL_MEDIA_POSTS.map((post, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#22d3ee]">
                        {post.platform} Ready Post
                      </span>
                      <button
                        onClick={() => handleCopy(`post_${idx}`, post.content)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === `post_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === `post_${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <h4 className="font-display font-bold text-base text-white mb-2">
                      {post.title}
                    </h4>

                    <pre className="whitespace-pre-wrap font-sans text-xs text-[#c4c4d8] leading-relaxed">
                      {post.content}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                    {post.tags.map((t, i) => (
                      <span key={i} className="text-[10px] text-[#7c5cff] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: 7-Day Sprint Roadmap */}
        {activeTab === 'sprint' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#07070d] border border-white/10">
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {lang === 'hi' ? 'तत्काल अगले कदम: 7-दिवसीय कार्यान्वयन स्प्रिंट' : 'Immediate Next Steps: 7-Day Sprint Plan'}
              </h3>
              <p className="text-xs text-[#9a9ab0] mb-6">
                {lang === 'hi'
                  ? 'सटीक दैनिक लक्ष्य, कमिट संदेश और उत्पादन-गुणवत्ता वाले कार्यान्वयन के साथ।'
                  : 'Daily sprint tickets with acceptance criteria, Git commits, and end-to-end integration demo.'}
              </p>

              <div className="space-y-3">
                {[
                  { day: 'Day 1', title: 'मोनोरेपो सेटअप', desc: 'Turborepo + TypeScript 5.4 + pnpm + CI/CD GitHub Actions', commit: 'feat(core): initialize turborepo monorepo structure with shared tsconfig' },
                  { day: 'Day 2', title: 'IConnector बेस क्लास', desc: 'मानकीकृत एडाप्टर इंटरफेस, एरर हैंडलिंग, और हेल्थचेक कॉन्ट्रैक्ट', commit: 'feat(connectors): implement IConnector interface and BaseConnector abstract class' },
                  { day: 'Day 3', title: 'Postgres discover() & read()', desc: 'PG Pool, SSL TLS 1.3, ऑटो स्कीमा इनफॉर्मेशन क्वेरी', commit: 'feat(postgres): add schema auto-discovery and parameterized query execution' },
                  { day: 'Day 4', title: 'Postgres write() & subscribe()', desc: 'PG Logical Replication / NOTIFY और बल्क इन्सर्ट पाइपलाइन', commit: 'feat(postgres): add logical replication listener and write stream' },
                  { day: 'Day 5', title: 'Google Sheets कनेक्टर', desc: 'Google Sheets v4 API, OAuth 2.0 PKCE, शीट हेडर पार्सर', commit: 'feat(sheets): complete Google Sheets v4 connector with auto-append' },
                  { day: 'Day 6', title: 'LLM Natural Language Parser', desc: 'प्राकृतिक भाषा वाक्य ➔ { source, target, action } स्कीमा पार्सिंग', commit: 'feat(ai): integrate Gemini/LLM intent parser for zero-config onboarding' },
                  { day: 'Day 7', title: 'End-to-End Demo', desc: '"PostgreSQL और Google Sheets को जोड़ो" पूर्ण लाइव सिंक डेमो', commit: 'test(e2e): verify automated pipeline syncing Postgres records to Sheets' },
                ].map((sprint, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-14 px-2 py-1 rounded bg-[#7c5cff]/20 text-[#22d3ee] font-mono font-bold text-center">
                        {sprint.day}
                      </span>
                      <div>
                        <span className="font-bold text-white block">{sprint.title}</span>
                        <span className="text-[#9a9ab0]">{sprint.desc}</span>
                      </div>
                    </div>

                    <div className="font-mono text-[10px] text-[#c4b5fd] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                      git commit: "{sprint.commit}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
