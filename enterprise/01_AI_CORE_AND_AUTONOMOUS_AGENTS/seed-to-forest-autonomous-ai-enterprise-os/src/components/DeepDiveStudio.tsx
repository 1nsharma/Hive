import React, { useState } from 'react';
import { ShieldCheck, Cpu, Terminal, ArrowRight, CheckCircle2, Sparkles, AlertCircle, Copy, Check, Lock, DollarSign, Database, Server, GitBranch, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';

interface DeepDiveStudioProps {
  language: SupportedLanguage;
  onNavigateTab: (tab: string) => void;
}

export const DeepDiveStudio: React.FC<DeepDiveStudioProps> = ({ language, onNavigateTab }) => {
  const [selectedPillar, setSelectedPillar] = useState<'constitution' | 'tech_stack' | 'first_business' | 'lifecycle'>('constitution');
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiCustomResult, setAiCustomResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const pillars = [
    {
      id: 'constitution' as const,
      number: 1,
      title: language === 'hi' ? '1. The Constitution (कठोर सुरक्षा गार्डरेल्स)' : '1. The Constitution (Hardcoded Guardrails)',
      subtitle: language === 'hi' ? 'सिस्टम प्रॉम्ट नहीं, बल्कि कोड-स्तरीय सीमाएं: ₹5,000 कैप, टूल अनुमति सूची, आत्म-संशोधन निषेध' : 'Code-level middleware: ₹5,000 spend cap, Tool Allowlist, Zero Self-Modification',
      icon: ShieldCheck,
      color: 'emerald',
      badge: language === 'hi' ? 'सर्वोच्च प्राथमिकता' : 'Highest Priority'
    },
    {
      id: 'tech_stack' as const,
      number: 2,
      title: language === 'hi' ? '2. The Tech Stack (प्रौद्योगिकी ढांचा)' : '2. The Tech Stack (Production Tooling)',
      subtitle: language === 'hi' ? 'LangGraph स्टेटग्राफ, Docker/E2B सैंडबॉक्स, Vercel REST API, Stripe Connect & Gemini 3.7 Flash' : 'LangGraph StateGraph, Docker sandbox, Vercel API, Stripe Connect & Gemini 3.7 Flash',
      icon: Cpu,
      color: 'teal',
      badge: language === 'hi' ? 'इंजीनियरिंग ब्लूप्रिंट' : 'Engineering Core'
    },
    {
      id: 'first_business' as const,
      number: 3,
      title: language === 'hi' ? '3. The First Micro-Business (पहला राजस्व टूल)' : '3. First Micro-Business ("Hello World" of Money)',
      subtitle: language === 'hi' ? 'बोरिंग, 48-घंटे में बनने वाले micro-SaaS: WhatsApp Receipt to GST Excel, Gov Tender API Wrapper' : 'Boring solvable micro-SaaS: WhatsApp Receipt to GST Excel, Gov Tender Alert API',
      icon: Terminal,
      color: 'amber',
      badge: language === 'hi' ? 'तत्काल नकदी प्रवाह' : 'Instant Cashflow'
    },
    {
      id: 'lifecycle' as const,
      number: 4,
      title: language === 'hi' ? '4. Lifecycle Matrix (उत्पत्ति से सभ्यता तक)' : '4. Genesis → Civilization Matrix',
      subtitle: language === 'hi' ? '5-चरणीय स्वायत्त विकास: Genesis → Growth → Autonomy → Economy → Civilization' : '5-Stage Evolutionary Track: Genesis → Growth → Autonomy → Economy → Civilization',
      icon: GitBranch,
      color: 'indigo',
      badge: language === 'hi' ? 'लंबे समय का विजन' : 'Section 23 Roadmap'
    }
  ];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRunAiAnalysis = async () => {
    if (!customPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const res = await fetch('/api/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: selectedPillar,
          language: language === 'hi' ? 'Hindi with technical English terms' : 'English',
          customQuery: customPrompt
        })
      });
      const data = await res.json();
      setAiCustomResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Hero Welcome / Prompt Answer Card */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white text-[#141414] border border-[#141414] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3 text-[#141414]" />
            <span>{language === 'hi' ? 'बीज चरण ब्लूप्रिंट (Day 1 - 90)' : 'Seed Phase Blueprint (Day 1 - 90)'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] tracking-tight leading-tight">
            {language === 'hi'
              ? 'पहले किस हिस्से को डिटेल्स में डिजाइन करें?'
              : 'Which core piece shall we deep-dive and engineer first?'}
          </h1>
          <p className="text-[#575653] text-xs sm:text-sm mt-2.5 leading-relaxed font-sans">
            {language === 'hi'
              ? 'तुमने ठीक पूछा: "बीज तैयार है, बताओ मिट्टी में पहले किस बीज को डालें?" नीचे दिए गए 4 विकल्पों में से किसी एक को चुनें और उसका पूर्ण कोड-स्तरीय तकनीकी आर्किटेक्चर देखें।'
              : 'The Seed is crystallized. Choose any of the 4 foundational pillars below to inspect its hardcoded middleware, runnable multi-agent graph, vetted cashflow models, or long-term evolution lifecycle.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => onNavigateTab('simulator')}
              className="inline-flex items-center space-x-2 bg-[#141414] hover:bg-black text-[#E4E3E0] font-medium px-4 py-2 border border-[#141414] transition"
            >
              <Cpu className="w-4 h-4" />
              <span>{t.actions.runLoop}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('treasury')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] font-medium px-4 py-2 transition"
            >
              <DollarSign className="w-4 h-4 text-[#9a6b0c]" />
              <span>{t.tabs.treasury}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive Decision Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isSelected = selectedPillar === pillar.id;
          return (
            <div
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id)}
              className={`cursor-pointer p-4 transition-all relative border border-[#141414] ${
                isSelected
                  ? 'bg-[#141414] text-[#E4E3E0] shadow-sm'
                  : 'bg-white text-[#141414] hover:bg-[#F4F3F0]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 flex items-center justify-center border border-[#141414] ${
                  isSelected ? 'bg-white text-[#141414]' : 'bg-[#141414] text-[#E4E3E0]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${
                  isSelected ? 'bg-white/10 text-white border-white/30' : 'bg-[#E4E3E0] text-[#141414] border-[#141414]'
                }`}>
                  {pillar.badge}
                </span>
              </div>

              <h2 className={`text-base font-serif font-bold mb-1.5 ${isSelected ? 'text-[#E4E3E0]' : 'text-[#141414]'}`}>{pillar.title}</h2>
              <p className={`text-xs leading-relaxed mb-3 ${isSelected ? 'text-[#A09F9C]' : 'text-[#575653]'}`}>{pillar.subtitle}</p>

              <div className={`flex items-center justify-between text-xs font-mono font-semibold pt-2 border-t ${
                isSelected ? 'border-white/20 text-[#E4E3E0]' : 'border-[#141414]/15 text-[#141414]'
              }`}>
                <span>{isSelected ? (language === 'hi' ? 'सक्रिय विवरण (Selected)' : 'Active Spec') : (language === 'hi' ? 'विवरण देखें →' : 'Deep-Dive →')}</span>
                <span className={`w-5 h-5 flex items-center justify-center text-[10px] border ${
                  isSelected ? 'border-white/30 bg-white/10 text-white' : 'border-[#141414] bg-white text-[#141414]'
                }`}>
                  {pillar.number}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPillar}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-6 space-y-6 shadow-xs"
        >
          {/* Pillar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#141414]">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#575653] uppercase tracking-widest">
                {language === 'hi' ? 'तकनीकी कार्यान्वयन दस्तावेज़' : 'Technical Implementation Spec'}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#141414] mt-0.5">
                {selectedPillar === 'constitution' && (language === 'hi' ? '1. The Constitution: कोड-स्तरीय सुरक्षा और हार्डकोडेड सीमाएं' : '1. The Constitution: Hardcoded Middleware & Security Guardrails')}
                {selectedPillar === 'tech_stack' && (language === 'hi' ? '2. The Tech Stack: LangGraph, Docker, Vercel & Stripe' : '2. The Production Tech Stack: Orchestrator, Sandbox & Stripe')}
                {selectedPillar === 'first_business' && (language === 'hi' ? '3. The First Micro-Business: ₹199-₹999 तत्काल कैशफ़्लो' : '3. The First Micro-Business: Solvable ₹199-₹999 Cashflow MVPs')}
                {selectedPillar === 'lifecycle' && (language === 'hi' ? '4. The 5-Stage Evolution Track: Genesis to Civilization' : '4. The 5-Stage Evolution Track: Genesis to Civilization')}
              </h2>
            </div>

            <div className="flex items-center space-x-2 font-mono">
              {selectedPillar === 'constitution' && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('constitution')}
                  className="bg-[#141414] hover:bg-black text-[#E4E3E0] text-xs font-semibold px-3 py-1.5 border border-[#141414] transition flex items-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'गार्डरेल टेस्ट लैब खोलें' : 'Open Guardrail Lab'}</span>
                </button>
              )}
              {selectedPillar === 'tech_stack' && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('tech_stack')}
                  className="bg-[#141414] hover:bg-black text-[#E4E3E0] text-xs font-semibold px-3 py-1.5 border border-[#141414] transition flex items-center space-x-1.5"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पूर्ण आर्किटेक्चर चार्ट' : 'Full Architecture'}</span>
                </button>
              )}
              {selectedPillar === 'first_business' && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('micro_business')}
                  className="bg-[#141414] hover:bg-black text-[#E4E3E0] text-xs font-semibold px-3 py-1.5 border border-[#141414] transition flex items-center space-x-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सभी 4 आइडियाज इनक्यूबेटर' : 'All 4 Incubator Ideas'}</span>
                </button>
              )}
              {selectedPillar === 'lifecycle' && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('roadmap')}
                  className="bg-[#141414] hover:bg-black text-[#E4E3E0] text-xs font-semibold px-3 py-1.5 border border-[#141414] transition flex items-center space-x-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '90-दिवसीय रोडमैप' : '90-Day Roadmap'}</span>
                </button>
              )}
            </div>
          </div>

          {/* PILLAR 1: CONSTITUTION DETAILS */}
          {selectedPillar === 'constitution' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Rule 1 */}
                <div className="bg-white border border-[#141414] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-mono">
                      LIMIT_INR: 5000
                    </span>
                    <Lock className="w-3.5 h-3.5 text-[#141414]" />
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#141414]">
                    {language === 'hi' ? '1. व्यय सीमा (Spending Limit)' : '1. Hardcoded Spending Limit'}
                  </h3>
                  <p className="text-xs text-[#575653] leading-relaxed">
                    {language === 'hi'
                      ? 'AI किसी भी सिंगल API कॉल, सर्वर या डोमेन के लिए ₹5,000 से अधिक बिना मानव क्रिप्टोग्राफिक हस्ताक्षर के खर्च नहीं कर सकता।'
                      : 'AI cannot execute any single invoice or resource allocation exceeding ₹5,000 without Ed25519 human signature verification.'}
                  </p>
                  <div className="bg-[#141414] p-2.5 text-[11px] font-mono text-[#E4E3E0] border border-[#141414] overflow-x-auto relative">
                    <button
                      type="button"
                      onClick={() => handleCopy(`if (amountINR > 5000) { verifyMultiSig(humanSignature); }`, 'c1')}
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    >
                      {copiedCode === 'c1' ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre>
{`if (amountINR > 5000) {
  if (!verifySignature(sig, amount)) {
    throw new Error("HALT_OVER_5K");
  }
}`}
                    </pre>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="bg-white border border-[#141414] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-mono">
                      TOOLS: 6 PRE-APPROVED
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#141414]" />
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#141414]">
                    {language === 'hi' ? '2. अनुमति टूल्स रजिस्ट्री (Allowlist)' : '2. Scoped Tool Allowlist'}
                  </h3>
                  <p className="text-xs text-[#575653] leading-relaxed">
                    {language === 'hi'
                      ? 'AI केवल पूर्वनिर्धारित टूल्स (Vercel, GitHub, Stripe, Gemini, Reddit Scraper) का उपयोग कर सकता है। नए टूल्स जोड़ने के लिए संस्थापक की अनुमति चाहिए।'
                      : 'Only predetermined tools (Vercel, GitHub, Stripe, Gemini, Docker) can be called. Zero arbitrary shell scripts allowed outside container.'}
                  </p>
                  <div className="bg-[#141414] p-2.5 text-[11px] font-mono text-[#E4E3E0] border border-[#141414] overflow-x-auto relative">
                    <button
                      type="button"
                      onClick={() => handleCopy(`const ALLOWLIST = ['web_search', 'github_api', 'vercel_deploy', 'stripe_connect'];`, 'c2')}
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    >
                      {copiedCode === 'c2' ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre>
{`const ALLOWLIST = [
  'web_search', 'github_api',
  'vercel_deploy', 'stripe_connect',
  'docker_sandbox'
];`}
                    </pre>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="bg-white border border-[#141414] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-mono">
                      NO_SELF_MODIFICATION
                    </span>
                    <AlertCircle className="w-3.5 h-3.5 text-[#8b3a0f]" />
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#141414]">
                    {language === 'hi' ? '3. आत्म-संशोधन निषेध (AST Guard)' : '3. Self-Modification Prohibition'}
                  </h3>
                  <p className="text-xs text-[#575653] leading-relaxed">
                    {language === 'hi'
                      ? 'AI अपने स्वयं के संविधान, लूप या वित्तीय नियंत्रण को ओवरराइड करने वाला कोड नहीं लिख सकता। AST फ़ाइल सिस्टम इसे ब्लॉक करता है।'
                      : 'Protected files (constitution.ts, treasury.ts, server.ts) are read-only on OS level and intercepted by AST checker.'}
                  </p>
                  <div className="bg-[#141414] p-2.5 text-[11px] font-mono text-[#E4E3E0] border border-[#141414] overflow-x-auto relative">
                    <button
                      type="button"
                      onClick={() => handleCopy(`if (PROTECTED_FILES.includes(targetFile)) throw new Error("BLOCKED");`, 'c3')}
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    >
                      {copiedCode === 'c3' ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre>
{`if (PROTECTED.includes(file)) {
  throw new Error("MUTATION_BLOCKED");
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 2: TECH STACK DETAILS */}
          {selectedPillar === 'tech_stack' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-[#141414] p-3.5">
                  <div className="text-[#575653] font-mono text-[10px] font-bold uppercase tracking-wider mb-1">ORCHESTRATOR</div>
                  <div className="font-serif font-bold text-[#141414] text-sm">LangGraph / StateGraph</div>
                  <p className="text-[#575653] text-xs mt-1">Scout → Analyst → Builder → Critic → Grim Reaper चक्रीय अवस्था प्रबंधन।</p>
                </div>
                <div className="bg-white border border-[#141414] p-3.5">
                  <div className="text-[#575653] font-mono text-[10px] font-bold uppercase tracking-wider mb-1">AI ENGINE</div>
                  <div className="font-serif font-bold text-[#141414] text-sm">Gemini 3.7 Flash</div>
                  <p className="text-[#575653] text-xs mt-1">तेज तर्क, दृष्टि (OCR), स्ट्रक्चर्ड JSON आउटपुट और सबसे किफायती टोकन लागत।</p>
                </div>
                <div className="bg-white border border-[#141414] p-3.5">
                  <div className="text-[#575653] font-mono text-[10px] font-bold uppercase tracking-wider mb-1">SANDBOX RUNNER</div>
                  <div className="font-serif font-bold text-[#141414] text-sm">Docker / E2B Container</div>
                  <p className="text-[#575653] text-xs mt-1">उत्पन्न कोड को मुख्य सर्वर से अलग सुरक्षित वातावरण में टेस्ट और रन करना।</p>
                </div>
                <div className="bg-white border border-[#141414] p-3.5">
                  <div className="text-[#575653] font-mono text-[10px] font-bold uppercase tracking-wider mb-1">AUTO DEPLOY</div>
                  <div className="font-serif font-bold text-[#141414] text-sm">Vercel REST API</div>
                  <p className="text-[#575653] text-xs mt-1">बिना किसी मानवीय हस्तक्षेप के 60 सेकंड में सबडोमेन पर MVP को लाइव करना।</p>
                </div>
              </div>

              {/* LangGraph Architecture Code */}
              <div className="bg-[#141414] text-[#E4E3E0] border border-[#141414] p-4">
                <div className="flex items-center justify-between mb-2 text-xs font-mono">
                  <span className="text-[#E4E3E0]">src/agents/autonomousGraph.ts</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`// LangGraph Orchestrator Spec
import { StateGraph } from '@langchain/langgraph';
const workflow = new StateGraph({ ...agentStateSchema });
workflow.addNode("scout", scoutAgent);
workflow.addNode("analyst", analystAgent);
workflow.addNode("builder", builderAgent);
workflow.addNode("critic", criticAgent);
workflow.addNode("deployer", deployerAgent);
workflow.addEdge("scout", "analyst");
workflow.addEdge("analyst", "builder");
workflow.addEdge("builder", "critic");`, 'lg')}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white"
                  >
                    {copiedCode === 'lg' ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'lg' ? 'Copied' : 'Copy Graph Code'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-[#E4E3E0] overflow-x-auto leading-relaxed">
{`import { StateGraph, END } from '@langchain/langgraph';

// 5-Agent Multi-State Flow
const workflow = new StateGraph<AgentState>({
  channels: {
    complaintData: { value: (x, y) => y, default: () => null },
    opportunityScore: { value: (x, y) => y, default: () => null },
    generatedCode: { value: (x, y) => y, default: () => null },
    criticPass: { value: (x, y) => y, default: () => false },
    deployUrl: { value: (x, y) => y, default: () => null }
  }
});

workflow.addNode("scout", runScoutAgent);
workflow.addNode("analyst", runAnalystAgent);
workflow.addNode("builder", runBuilderAgent);
workflow.addNode("critic", runCriticAudit);
workflow.addNode("deployer", runVercelDeploy);

// Conditional Transitions: If Critic Fails -> Retry Builder; If Pass -> Deploy
workflow.addEdge("scout", "analyst");
workflow.addConditionalEdges("analyst", (state) => state.opportunityScore?.score > 7.5 ? "builder" : END);
workflow.addEdge("builder", "critic");
workflow.addConditionalEdges("critic", (state) => state.criticPass ? "deployer" : "builder");
workflow.addEdge("deployer", END);`}
                </pre>
              </div>
            </div>
          )}

          {/* PILLAR 3: FIRST MICRO BUSINESS DETAILS */}
          {selectedPillar === 'first_business' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#141414] p-3 text-xs text-[#141414] font-mono">
                💡 <strong>The "Hello World of Money" Rule:</strong> AI को Day 1 पर जटिल ब्लॉकचेन या 50-फीचर वाला ऐप नहीं बनाना है। उसे 48 घंटे में एक बोरिंग, असली दर्द को हल करने वाला ₹199-₹999 का यूटिलिटी टूल बनाना है।
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business 1 */}
                <div className="bg-white border border-[#141414] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-mono">
                      ₹199 / Month
                    </span>
                    <span className="text-xs text-[#575653] font-mono">Build Time: 28 Hrs</span>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#141414]">1. WhatsApp Receipt to GST Excel Parser (रसीद से एक्सेल)</h3>
                  <p className="text-xs text-[#575653]">
                    छोटे दुकानदार और सीए WhatsApp पर बिल की फोटो भेजते हैं। Gemini 3.7 Flash OCR उसे 5 सेकंड में GST-फॉर्मेटेड Excel/CSV में बदल देता है।
                  </p>
                  <div className="bg-[#F4F3F0] p-2.5 border border-[#141414]/20 text-xs space-y-1 text-[#575653] font-mono">
                    <div>• <strong>Unit Economics:</strong> Monthly Server: ₹500 | Break-even: 3 Users (₹597)</div>
                    <div>• <strong>7-Day Kill Rule:</strong> If &lt; 2 paid users in 7 days → Kill domain & archive.</div>
                  </div>
                </div>

                {/* Business 2 */}
                <div className="bg-white border border-[#141414] p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#141414] text-[#E4E3E0] font-mono">
                      ₹999 / Month
                    </span>
                    <span className="text-xs text-[#575653] font-mono">Build Time: 36 Hrs</span>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#141414]">2. Niche Government Tender REST API & Alert Wrapper</h3>
                  <p className="text-xs text-[#575653]">
                    सरकारी ई-टेंडर पोर्टलों के डेटा को क्लीन JSON REST API में बदलना और ठेकेदारों को WhatsApp पर इंस्टेंट टेंडर अलर्ट भेजना।
                  </p>
                  <div className="bg-[#F4F3F0] p-2.5 border border-[#141414]/20 text-xs space-y-1 text-[#575653] font-mono">
                    <div>• <strong>Unit Economics:</strong> Monthly Server: ₹800 | Break-even: 1 User (₹999)</div>
                    <div>• <strong>7-Day Kill Rule:</strong> If 0 users after 50 cold emails → Repurpose crawler.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 4: LIFECYCLE MATRIX (SECTION 23) */}
          {selectedPillar === 'lifecycle' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#141414] p-3 text-xs text-[#141414] font-mono flex items-center justify-between">
                <div>
                  <strong>Section 23 Evolution Matrix:</strong> The complete progression from human genesis to autonomous ecosystem.
                </div>
                <span className="bg-[#141414] text-[#E4E3E0] px-2 py-0.5 text-[10px]">CURRENT PHASE: GENESIS (SEED)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  {
                    stage: 'Stage 1: GENESIS',
                    timeframe: 'Day 1 - 90',
                    humanRole: '100% Capital, Setup & Signatures',
                    aiRole: 'Guided Code Generation & Testing',
                    treasury: '₹20k AI Ops Wallet / ₹80k Locked Reserve',
                    status: 'CURRENT_ACTIVE'
                  },
                  {
                    stage: 'Stage 2: GROWTH',
                    timeframe: 'Day 91 - 180',
                    humanRole: 'Strategic Direction & Audit',
                    aiRole: 'Autonomous Scout, Builder & Deployer',
                    treasury: 'Revenue Recycling into Compute',
                    status: 'PROTOTYPE'
                  },
                  {
                    stage: 'Stage 3: AUTONOMY',
                    timeframe: 'Day 181 - 365',
                    humanRole: 'Emergency Circuit Breaker Only',
                    aiRole: 'Self-governing 7-Day Kill/Scale Cycles',
                    treasury: 'Self-Funded API Quotas & Hosting',
                    status: 'SIMULATED'
                  },
                  {
                    stage: 'Stage 4: ECONOMY',
                    timeframe: 'Year 1 - 2',
                    humanRole: 'Constitutional Guardian Council',
                    aiRole: 'Cross-Agent Sub-Contracting',
                    treasury: 'Protocol Treasury & Safety Dividends',
                    status: 'CONCEPT'
                  },
                  {
                    stage: 'Stage 5: CIVILIZATION',
                    timeframe: 'Year 2+',
                    humanRole: 'Beneficiary & Philosophic Anchor',
                    aiRole: 'Inter-Autonomous Entity Trade Network',
                    treasury: 'Decentralized Micro-Enterprise Mesh',
                    status: 'CONCEPT'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#141414] p-3.5 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-[#141414] text-[#E4E3E0]">
                          {item.stage}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#575653] font-bold">{item.timeframe}</div>
                      <div className="mt-2 text-xs space-y-1 text-[#575653]">
                        <div><strong className="text-[#141414]">Human:</strong> {item.humanRole}</div>
                        <div><strong className="text-[#141414]">AI:</strong> {item.aiRole}</div>
                        <div><strong className="text-[#141414]">Treasury:</strong> {item.treasury}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#141414]/15">
                      <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                        item.status === 'CURRENT_ACTIVE'
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                          : 'bg-[#ECEBE8] text-[#575653] border-[#141414]/30'
                      }`}>
                        [{item.status}]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive AI Deep-Dive Exploration Input */}
          <div className="bg-white border border-[#141414] p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#141414] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'hi'
                  ? `AI आर्किटेक्ट से ${selectedPillar} के बारे में कुछ भी पूछें:`
                  : `Ask the AI Architect anything specific about ${selectedPillar}:`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={
                  selectedPillar === 'constitution'
                    ? (language === 'hi' ? 'उदा: ₹5,000 की लिमिट के लिए exact Ed25519 signature code कैसे लिखें?' : 'e.g. How to verify multi-sig signatures in Express middleware?')
                    : selectedPillar === 'tech_stack'
                    ? (language === 'hi' ? 'उदा: Docker सैंडबॉक्स में Gemini API टोकन सुरक्षित कैसे रखें?' : 'e.g. Best way to isolate secrets in Docker container sandbox?')
                    : selectedPillar === 'first_business'
                    ? (language === 'hi' ? 'उदा: WhatsApp receipt bot के लिए पहले 10 कस्टमर्स कैसे लाएं?' : 'e.g. How to acquire first 10 paying customers for the WhatsApp OCR bot?')
                    : (language === 'hi' ? 'उदा: Stage 1 से Stage 2 में ट्रांजिशन कब और कैसे ट्रिगर होगा?' : 'e.g. What concrete financial metric triggers the Stage 1 to 2 transition?')
                }
                className="flex-1 bg-white border border-[#141414] px-3 py-2 text-xs text-[#141414] font-mono placeholder-[#575653] focus:outline-none focus:ring-1 focus:ring-[#141414]"
              />

              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={aiGenerating || !customPrompt.trim()}
                className="bg-[#141414] hover:bg-black disabled:opacity-50 text-[#E4E3E0] font-mono text-xs font-semibold px-4 py-2 border border-[#141414] transition flex items-center justify-center space-x-2 shrink-0"
              >
                {aiGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'hi' ? 'विश्लेषण कर रहा है...' : 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'ब्लूप्रिंट बनाएं' : 'Generate Blueprint'}</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Generated Result Display */}
            {aiCustomResult && (
              <div className="mt-3 bg-[#F4F3F0] border border-[#141414] p-4 space-y-3 text-[#141414]">
                <div className="flex items-center justify-between pb-2 border-b border-[#141414]/20">
                  <h4 className="font-serif font-bold text-sm text-[#141414]">{aiCustomResult.title}</h4>
                  <span className="text-[10px] text-[#575653] font-mono">GEMINI 3.7 FLASH VERIFIED</span>
                </div>
                <p className="text-xs text-[#575653] leading-relaxed">{aiCustomResult.summary}</p>

                {aiCustomResult.corePillars && (
                  <div className="space-y-2.5">
                    {aiCustomResult.corePillars.map((p: any, i: number) => (
                      <div key={i} className="bg-white p-3 border border-[#141414]/30 text-xs space-y-1.5">
                        <div className="font-serif font-bold text-[#141414]">{p.heading}</div>
                        <p className="text-[#575653]">{p.description}</p>
                        {p.codeSnippet && (
                          <pre className="bg-[#141414] p-2 text-[11px] font-mono text-[#E4E3E0] overflow-x-auto">
                            {p.codeSnippet}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {aiCustomResult.proTips && (
                  <div className="bg-white border border-[#141414] p-2.5 text-xs text-[#141414] font-mono">
                    <strong>💡 PRO TIP:</strong> {aiCustomResult.proTips.join(' ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
