import React, { useState } from 'react';
import { Language } from '../types';
import { 
  PRODUCT_THESIS, ORCHESTRATION_LOOP, TEN_PRINCIPLES, 
  THREE_MEMORY_LAYERS, RISK_CATEGORIES, WORKFLOW_STATES, 
  DESIGN_RULES, PrincipleDetail 
} from '../data/philosophyData';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, 
  Database, Cpu, Layers, Activity, ArrowRight, 
  Zap, EyeOff, RotateCcw, Lock, Check, Copy, 
  Workflow, GitBranch, Terminal, HelpCircle
} from 'lucide-react';

interface Section1PhilosophyProps {
  lang: Language;
}

export const Section1Philosophy: React.FC<Section1PhilosophyProps> = ({ lang }) => {
  const [activeLoopStep, setActiveLoopStep] = useState<number>(0);
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<string>('p01');
  const [memoryTab, setMemoryTab] = useState<'Layer A' | 'Layer B' | 'Layer C'>('Layer A');
  const [stateCategory, setStateCategory] = useState<'All' | 'Normal Flow' | 'Failure State' | 'Terminal State'>('All');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedPrinciple: PrincipleDetail = TEN_PRINCIPLES.find(p => p.id === selectedPrincipleId) || TEN_PRINCIPLES[0];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredStates = stateCategory === 'All' 
    ? WORKFLOW_STATES 
    : WORKFLOW_STATES.filter(s => s.category === stateCategory);

  return (
    <div className="space-y-12 animate-fade-in text-[#e7e7f0]">
      
      {/* 1. Core Thesis & Promise Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c5cff]/15 via-[#0d0d1a] to-[#22d3ee]/10 border border-[#7c5cff]/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#7c5cff]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#22d3ee]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c5cff]/20 border border-[#7c5cff]/40 text-xs font-semibold tracking-wider text-[#c4b5fd] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? 'अनुभाग 1: उत्पाद दर्शन और मूल सिद्धांत' : 'Section 1: Product Philosophy & Core Principles'}</span>
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
            "{lang === 'hi' ? PRODUCT_THESIS.thesis : PRODUCT_THESIS.thesisEn}"
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[#22d3ee] font-bold block uppercase tracking-wider text-[11px]">
                {lang === 'hi' ? 'मूल प्रतिज्ञा (Core Promise)' : 'Core Promise'}
              </span>
              <p className="text-white font-medium text-sm sm:text-base">
                "{PRODUCT_THESIS.corePromise}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[#c4b5fd] font-bold block uppercase tracking-wider text-[11px]">
                {lang === 'hi' ? 'नॉर्थ स्टार (North Star)' : 'North Star Axiom'}
              </span>
              <p className="text-white font-medium text-sm sm:text-base">
                "Users define outcomes; Aura manages the systems required to achieve them."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 1.1 "Aura वास्तव में क्या है?" & 9-Step Product Loop */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#07070d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
              {lang === 'hi' ? '1.1 उत्पाद परिभाषा एवं नियंत्रण चक्र' : '1.1 Product Definition & Orchestration Loop'}
            </span>
            <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
              {lang === 'hi' ? 'Aura का 9-चरणीय स्वायत्त नियंत्रण लूप' : 'Aura 9-Step Autonomous Control Loop'}
            </h4>
          </div>
          <div className="text-xs text-[#9a9ab0] font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            Intent In ➔ Verified Action Out
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#9a9ab0] leading-relaxed">
          {lang === 'hi'
            ? 'Aura केवल iPaaS, चैटबॉट या वर्कफ़्लो बिल्डर नहीं है — यह एक AI-native बिजनेस ऑर्केस्ट्रेशन लेयर है जो इरादे को समझता है, सिस्टम्स को जोड़ता है, संदर्भ याद रखता है, और क्रियान्वयन करता है।'
            : 'Aura is an AI-native business orchestration layer that understands intent, connects systems, moves data, remembers context, and takes action.'}
        </p>

        {/* Stepper Navigation */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 pt-2">
          {ORCHESTRATION_LOOP.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => setActiveLoopStep(idx)}
              className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                activeLoopStep === idx
                  ? 'bg-gradient-to-br from-[#7c5cff]/30 to-[#3b82f6]/20 border-[#7c5cff] shadow-[0_0_16px_rgba(124,92,255,0.3)]'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              <span className={`text-[10px] font-mono block mb-1 ${activeLoopStep === idx ? 'text-[#22d3ee] font-bold' : 'text-[#9a9ab0]'}`}>
                Step {step.step}
              </span>
              <span className="text-xs font-semibold text-white truncate block">
                {lang === 'hi' ? step.titleHi : step.titleEn}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Details Showcase */}
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-white/[0.02] to-[#7c5cff]/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#c4b5fd]">
              Step {ORCHESTRATION_LOOP[activeLoopStep].step}: {ORCHESTRATION_LOOP[activeLoopStep].titleEn}
            </span>
            <h5 className="font-bold text-base sm:text-lg text-white">
              {ORCHESTRATION_LOOP[activeLoopStep].desc}
            </h5>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#07070d] border border-[#7c5cff]/40 text-xs font-mono text-[#22d3ee] shrink-0">
            {activeLoopStep === 0 && 'User Input: "Sync Salesforce leads to Sheets"'}
            {activeLoopStep === 1 && 'NLP: Intent="CONNECT", Source=["SFDC", "Sheets"]'}
            {activeLoopStep === 2 && 'API: SObject Describe ➔ Lead Schema'}
            {activeLoopStep === 3 && 'OAuth: PKCE Browser Token Acquired'}
            {activeLoopStep === 4 && 'Mapping: Lead.Email ➔ Sheets.ColA'}
            {activeLoopStep === 5 && 'Engine: Postgres BullMQ Job Dispatched'}
            {activeLoopStep === 6 && 'Telemetry: p95 latency = 84ms, 0 dropped'}
            {activeLoopStep === 7 && 'Self-Healing: Circuit Breaker Verified'}
            {activeLoopStep === 8 && 'Memory: Vector Embeddings Updated'}
          </div>
        </div>
      </div>

      {/* 3. 10 Core Principles Interactive Catalog */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-[#7c5cff] uppercase tracking-wider block mb-1">
              {lang === 'hi' ? '1.2 से 1.12 मूल सिद्धांत' : 'Principles 01 to 10'}
            </span>
            <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
              {lang === 'hi' ? 'Aura के 10 अटल मूल सिद्धांत' : 'Aura 10 Foundational Principles'}
            </h4>
          </div>
          <span className="text-xs text-[#9a9ab0]">
            {lang === 'hi' ? 'विस्तार और वास्तविक उदाहरण देखने के लिए किसी भी सिद्धांत पर क्लिक करें' : 'Click any principle to view rule & real-world example'}
          </span>
        </div>

        {/* Principles Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TEN_PRINCIPLES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPrincipleId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                selectedPrincipleId === p.id
                  ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white border-transparent shadow-[0_2px_12px_rgba(124,92,255,0.4)]'
                  : 'bg-white/[0.02] text-[#9a9ab0] hover:text-white border-white/5'
              }`}
            >
              <span className="font-mono text-[11px] opacity-80">{p.number}</span>
              <span>{p.titleEn}</span>
            </button>
          ))}
        </div>

        {/* Active Principle Deep Dive Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0d0d1a] to-[#07070d] border border-[#7c5cff]/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-[#7c5cff]/20 text-[#22d3ee] flex items-center justify-center font-mono font-bold text-sm">
                  {selectedPrinciple.number}
                </span>
                <h5 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                  {lang === 'hi' ? selectedPrinciple.titleHi : selectedPrinciple.titleEn}
                </h5>
              </div>
              <p className="text-sm text-[#9a9ab0]">
                {lang === 'hi' ? selectedPrinciple.shortDescHi : selectedPrinciple.shortDescEn}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedPrinciple.tags.map((tag, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 text-[#c4b5fd] border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Core Rule Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#7c5cff]/10 via-transparent to-[#22d3ee]/10 border border-[#7c5cff]/30 text-xs sm:text-sm text-[#e7e7f0]">
            <strong className="text-[#22d3ee] block mb-1 uppercase tracking-wider font-mono text-xs">
              {lang === 'hi' ? 'आर्किटेक्चर नियम (Core Rule):' : 'Architectural Rule:'}
            </strong>
            {selectedPrinciple.coreRule}
          </div>

          {/* User Experience vs Internal Action Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* User Perspective */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#22d3ee]">
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'उपयोगकर्ता अनुभव (User Experience)' : 'User Experience'}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#07070d] text-xs font-mono text-white border border-white/5">
                <span className="text-[#9a9ab0] block text-[10px] mb-1">User Command:</span>
                "{selectedPrinciple.userFacingExample.userInput}"
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-xs font-mono text-emerald-300 border border-emerald-500/20">
                <span className="text-emerald-400 block text-[10px] mb-1">Aura Response:</span>
                "{selectedPrinciple.userFacingExample.userFacingMessage}"
              </div>
            </div>

            {/* Internal Plumbing */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c4b5fd]">
                <Terminal className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'आंतरिक तंत्र (Under The Hood Plumbing)' : 'Under The Hood Plumbing'}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#07070d] text-[11px] font-mono text-[#a5f3fc] border border-white/5 leading-relaxed overflow-x-auto">
                <span className="text-[#9a9ab0] block text-[10px] mb-1">Internal Pipeline:</span>
                {selectedPrinciple.userFacingExample.internalAction}
              </div>
              <ul className="space-y-1 text-xs text-[#9a9ab0] pt-1">
                {selectedPrinciple.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#22d3ee] shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* 4. 1.7 Three Memory Layers & 1.9 Human Authority Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Memory Layers */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-[#22d3ee]" />
              <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider">
                {lang === 'hi' ? '1.7 मेमोरी का 3-परतीय विभाजन' : '1.7 Three Memory Layers'}
              </span>
            </div>
            <h4 className="font-display font-bold text-xl text-white">
              {lang === 'hi' ? 'स्मृति का रणनीतिक वर्गीकरण' : 'Memory Architecture Tiers'}
            </h4>
            <p className="text-xs text-[#9a9ab0] mt-1">
              Aura की मेमोरी को एक एकल वेक्टर डेटाबेस नहीं बनाया गया है; इसे स्थिरता, ऑडिट और स्पीड के आधार पर 3 परतों में बांटा गया है।
            </p>
          </div>

          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            {THREE_MEMORY_LAYERS.map((m) => (
              <button
                key={m.layer}
                onClick={() => setMemoryTab(m.layer)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  memoryTab === m.layer
                    ? 'bg-[#7c5cff] text-white shadow-md'
                    : 'text-[#9a9ab0] hover:text-white bg-white/5'
                }`}
              >
                {m.layer}
              </button>
            ))}
          </div>

          {/* Active Memory Layer View */}
          {(() => {
            const currentMem = THREE_MEMORY_LAYERS.find(m => m.layer === memoryTab) || THREE_MEMORY_LAYERS[0];
            return (
              <div className="space-y-4 p-4 rounded-xl bg-[#07070d] border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{currentMem.nameEn}</span>
                  <span className="font-mono text-[#22d3ee] bg-[#22d3ee]/10 px-2 py-0.5 rounded border border-[#22d3ee]/20">
                    {currentMem.storage}
                  </span>
                </div>
                <p className="text-[#9a9ab0] leading-relaxed">
                  {currentMem.purpose}
                </p>
                <div>
                  <span className="text-[#c4b5fd] font-bold block mb-1.5">संग्रहीत डेटा प्रकार (Stored State):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMem.contents.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[#e7e7f0] font-mono text-[11px] border border-white/5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Human Authority Risk Hierarchy */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {lang === 'hi' ? '1.9 मानवीय अधिकार और 3-स्तरीय जोखिम' : '1.9 Human Authority & Risk Categories'}
              </span>
            </div>
            <h4 className="font-display font-bold text-xl text-white">
              {lang === 'hi' ? 'जोखिम पदानुक्रम नीति' : 'Action Risk Governance Matrix'}
            </h4>
            <p className="text-xs text-[#9a9ab0] mt-1">
              "Aura can automate execution; it cannot silently redefine authority."
            </p>
          </div>

          <div className="space-y-3">
            {RISK_CATEGORIES.map((cat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#07070d] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                    />
                    <span className="font-bold text-white">{cat.actionTypeEn}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#c4b5fd]">
                    {cat.executionPolicy}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.examples.map((ex, j) => (
                    <span key={j} className="text-[10px] text-[#9a9ab0] bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. 1.10 Deterministic Core vs Probabilistic Intelligence */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0d0d1a] to-[#07070d] border border-[#7c5cff]/30 space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider block mb-1">
            {lang === 'hi' ? '1.10 हाइब्रिड आर्किटेक्चर' : '1.10 Deterministic Core vs Probabilistic Intelligence'}
          </span>
          <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
            "LLM decides 'what', deterministic systems enforce 'how'."
          </h4>
          <p className="text-xs text-[#9a9ab0] mt-1">
            LLM संभाव्य (Probabilistic) होता है, जबकि वित्तीय लेनदेन, डेटाबेस म्यूटेशन और ऑथराइजेशन डिटरमिनिस्टिक होना अनिवार्य है।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-5 rounded-xl bg-white/[0.02] border border-[#7c5cff]/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-sm text-[#c4b5fd]">LLM Intelligence (Probabilistic)</span>
              <span className="text-[10px] font-mono text-[#7c5cff] bg-[#7c5cff]/10 px-2 py-0.5 rounded">Decides WHAT</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#9a9ab0]">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7c5cff]" /> <span>प्राकृतिक भाषा इरादा समझना (Understand intent)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7c5cff]" /> <span>फ़ील्ड्स मैपिंग का स्वतः अनुमान (Infer mapping)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7c5cff]" /> <span>डेटा विसंगतियों का वर्गीकरण (Classify anomalies)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7c5cff]" /> <span>कार्य योजना का निर्माण (Plan execution path)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7c5cff]" /> <span>प्राकृतिक भाषा प्रतिक्रिया उत्पन्न करना (Generate response)</span></li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-[#22d3ee]/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-sm text-[#22d3ee]">Deterministic Engine (Safe Core)</span>
              <span className="text-[10px] font-mono text-[#22d3ee] bg-[#22d3ee]/10 px-2 py-0.5 rounded">Enforces HOW</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#9a9ab0]">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#22d3ee]" /> <span>प्रमाणीकरण व अनुमति (OAuth / Token refresh)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#22d3ee]" /> <span>डेटाबेस में सुरक्षित लेखन (ACID DB transactions)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#22d3ee]" /> <span>आइडमपोटेंसी व डुप्लीकेट रोकथाम (Idempotent keys)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#22d3ee]" /> <span>कतार प्रबंधन व पुनः प्रयास (Redis BullMQ retries)</span></li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#22d3ee]" /> <span>सख्त ऑडिट लॉग्स व बिलिंग (Audit logs & limits)</span></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 6. 1.12 Lifecycle States Simulator (Failure Should Be a State, Not a Crash) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#07070d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-[#7c5cff]" />
              <span className="text-xs font-semibold text-[#7c5cff] uppercase tracking-wider">
                {lang === 'hi' ? '1.12 विफलता एक स्थिति है, क्रैश नहीं' : '1.12 Failure as a Formal Lifecycle State'}
              </span>
            </div>
            <h4 className="font-display font-bold text-xl text-white">
              {lang === 'hi' ? '16 औपचारिक कार्यप्रवाह स्थितियाँ (Formal State Machine)' : '16 Formal Workflow Lifecycle States'}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {(['All', 'Normal Flow', 'Failure State', 'Terminal State'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setStateCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  stateCategory === cat
                    ? 'bg-[#7c5cff] text-white shadow-sm'
                    : 'text-[#9a9ab0] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* State Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredStates.map((s, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs" style={{ color: s.color }}>
                  {s.state}
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              </div>
              <p className="text-[11px] text-[#9a9ab0] leading-tight">
                {lang === 'hi' ? s.descriptionHi : s.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 1.15 Product Design Rules & 1.16 Architectural Correction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Design Rules Checklist */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h4 className="font-display font-bold text-lg text-white">
            {lang === 'hi' ? '1.15 उत्पाद डिज़ाइन नियम (Checklist)' : '1.15 Product Design Rules Compliance'}
          </h4>
          <p className="text-xs text-[#9a9ab0]">
            इंजीनियरिंग और UI समीक्षा के लिए 12 अनिवार्य अनुपालन चेकलिस्ट नियम।
          </p>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {DESIGN_RULES.map((rule, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#07070d] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22d3ee]" />
                  <span className="text-white font-medium">{rule.rule}</span>
                </div>
                <span className="font-mono text-[11px] text-[#c4b5fd]">
                  {rule.auraRequirement}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Architectural Correction & Zapier vs Aura */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.02] to-[#7c5cff]/5 border border-[#7c5cff]/30 space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              {lang === 'hi' ? '1.16 सबसे महत्वपूर्ण आर्किटेक्चरल सुधार' : '1.16 Key Architectural Correction'}
            </span>
            <h4 className="font-display font-bold text-lg text-white">
              सच्ची स्वायत्तता और पारदर्शी विश्वसनीयता
            </h4>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                <span className="font-bold block text-red-300 mb-0.5">❌ भ्रामक दृष्टिकोण (Wrong):</span>
                "Everything is fine" कहना जब डेटा वास्तव में सिंक नहीं हुआ है।
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                <span className="font-bold block text-emerald-300 mb-0.5">✅ Aura का नियम (Right):</span>
                "The user should never be forced to understand infrastructure failures. But the user must be informed when the business outcome is materially affected."
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#07070d] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-[#22d3ee] block uppercase">
              Zapier बनाम Aura का सार
            </span>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-[#9a9ab0]">Zapier: "Workflows बनाओ"</span>
              <span className="text-[#c4b5fd] font-bold">Aura: "काम बताओ, हम करेंगे"</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
