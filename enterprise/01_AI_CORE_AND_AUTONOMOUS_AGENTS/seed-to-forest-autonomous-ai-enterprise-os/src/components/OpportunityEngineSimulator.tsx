import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  TrendingUp,
  Code2,
  ShieldAlert,
  Rocket,
  Skull,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Terminal as TerminalIcon,
  Database,
  Coins,
  Layers,
  Zap,
  Radio,
  FileCode,
  ShieldCheck,
  Send,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ScoutedItem,
  AnalystScore,
  BuilderSpec,
  CriticResult,
  GrimReaperEvaluation,
  HandsToolCall,
  HandsToolName,
  MemoryPostMortem,
  EconomyProject
} from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';
import { INITIAL_POST_MORTEMS, ALLOWLISTED_TOOLS_REGISTRY } from '../data/blueprintData';

interface OpportunityEngineSimulatorProps {
  language: SupportedLanguage;
  onExpenseDeducted: (amount: number, desc: string) => void;
  onRevenueAdded: (amount: number, desc: string) => void;
}

export const OpportunityEngineSimulator: React.FC<OpportunityEngineSimulatorProps> = ({
  language,
  onExpenseDeducted,
  onRevenueAdded
}) => {
  // Sub-tabs: 'brain' (LangGraph Loop), 'hands' (Action Space Sandbox), 'memory' (Vector DB Post-Mortems), 'economy' (Currency/Economy Maker)
  const [activeSubTab, setActiveSubTab] = useState<'brain' | 'hands' | 'memory' | 'economy'>('brain');

  // Brain State
  const [activeStep, setActiveStep] = useState<number>(0);
  const [customDomainQuery, setCustomDomainQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [scoutData, setScoutData] = useState<ScoutedItem | null>(null);
  const [analystData, setAnalystData] = useState<AnalystScore | null>(null);
  const [builderData, setBuilderData] = useState<BuilderSpec | null>(null);
  const [criticData, setCriticData] = useState<CriticResult | null>(null);
  const [reaperData, setReaperData] = useState<GrimReaperEvaluation | null>(null);

  // Hands State
  const [selectedTool, setSelectedTool] = useState<HandsToolName>('execute_terminal_command');
  const [toolCommandArg, setToolCommandArg] = useState('npm test -- --coverage');
  const [toolFileArg, setToolFileArg] = useState('services/microTipHandler.ts');
  const [toolContentArg, setToolContentArg] = useState('export function processTip(amount: number) { return { status: "OK", amount }; }');
  const [toolOutputLog, setToolOutputLog] = useState<HandsToolCall[]>([]);
  const [isExecutingTool, setIsExecutingTool] = useState(false);

  // Memory State
  const [memorySearchQuery, setMemorySearchQuery] = useState('');
  const [memoryList, setMemoryList] = useState<MemoryPostMortem[]>(INITIAL_POST_MORTEMS);
  const [isSearchingMemory, setIsSearchingMemory] = useState(false);
  const [topMemoryLesson, setTopMemoryLesson] = useState<string | null>(null);

  // Economy Maker State
  const [economyConcept, setEconomyConcept] = useState('Polygon L2 Micro-Tipping Smart Contract ($0.0001 Gas Fee)');
  const [economyType, setEconomyType] = useState<'SMART_CONTRACT_L2' | 'MICRO_SAAS_API'>('SMART_CONTRACT_L2');
  const [isCreatingEconomy, setIsCreatingEconomy] = useState(false);
  const [createdEconomy, setCreatedEconomy] = useState<EconomyProject | null>(null);
  const [testTxLog, setTestTxLog] = useState<string[]>([]);
  const [isSimulatingTx, setIsSimulatingTx] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const brainSteps = [
    { num: 1, name: 'Agent A (Planner/Scout)', label: language === 'hi' ? '1. प्लानर (खोज)' : '1. Planner (Scout)', icon: Search },
    { num: 2, name: 'Agent B (Memory/Analyst)', label: language === 'hi' ? '2. मेमोरी (अध्ययन)' : '2. Memory & Analyst', icon: Database },
    { num: 3, name: 'Agent C (Builder)', label: language === 'hi' ? '3. बिल्डर (कोड)' : '3. Builder (Code)', icon: Code2 },
    { num: 4, name: 'Agent D (Critic/Guardrail)', label: language === 'hi' ? '4. क्रिटिक (संविधान)' : '4. Critic (Audit)', icon: ShieldAlert },
    { num: 5, name: 'Hands & Testnet Deploy', label: language === 'hi' ? '5. हैंड्स (डिप्लॉय)' : '5. Hands (Deploy)', icon: Rocket },
    { num: 6, name: 'Agent E (Grim Reaper)', label: language === 'hi' ? '6. ग्रिम रीपर (निर्णय)' : '6. Grim Reaper', icon: Skull }
  ];

  // 1. RUN THE FULL LANGGRAPH BRAIN COGNITIVE LOOP
  const handleRunFullLoop = async () => {
    setIsRunning(true);
    setActiveStep(1);

    try {
      // Step 1: Scout / Planner
      const scoutRes = await fetch('/api/agent/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainQuery: customDomainQuery || 'Indian Micro-businesses & Freelancers' })
      });
      const scoutJson = await scoutRes.json();
      const selectedItem: ScoutedItem = scoutJson.scoutedItems ? scoutJson.scoutedItems[0] : {
        id: 'scout-default',
        source: 'Reddit r/developersIndia & Twitter',
        complaintQuote: 'I waste 4 hours every Saturday typing WhatsApp photos of shopkeeper receipts into Excel for GST filing!',
        targetAudience: '1.2M Indian Retailers & Freelance Accountants',
        painPointSummary: 'Manual photo to CSV/GST entry friction',
        suggestedMicroSolution: 'WhatsApp Bot: Send receipt photo -> Instant GST CSV & Excel',
        monetizationAngle: '₹199/month (first 20 receipts free)'
      };
      setScoutData(selectedItem);
      onExpenseDeducted(20, 'Agent A (Planner) Scout Token Quota');
      await new Promise(r => setTimeout(r, 800));

      // Step 2: Memory & Analyst
      setActiveStep(2);
      const memRes = await fetch('/api/agent/memory/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: selectedItem.suggestedMicroSolution })
      });
      const memData = await memRes.json();
      if (memData.topLesson) {
        setTopMemoryLesson(memData.topLesson);
      }

      const analystRes = await fetch('/api/agent/analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedItem.suggestedMicroSolution, painPoint: selectedItem.painPointSummary })
      });
      const analystJson = await analystRes.json();
      setAnalystData(analystJson);
      onExpenseDeducted(35, 'Agent B (Analyst) Unit Economics Scoring');
      await new Promise(r => setTimeout(r, 800));

      // Step 3: Builder
      setActiveStep(3);
      const builderRes = await fetch('/api/agent/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedItem.suggestedMicroSolution, stack: 'Next.js + Tailwind + Supabase' })
      });
      const builderJson = await builderRes.json();
      setBuilderData(builderJson);
      onExpenseDeducted(builderJson.buildCostEstimateINR || 350, 'Agent C (Builder) Docker Sandbox Build');
      await new Promise(r => setTimeout(r, 900));

      // Step 4: Critic & Constitution Guardrail
      setActiveStep(4);
      const criticRes = await fetch('/api/agent/critic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSnippet: builderJson.coreCodeSnippet, budgetRequested: builderJson.buildCostEstimateINR })
      });
      const criticJson = await criticRes.json();
      setCriticData(criticJson);
      await new Promise(r => setTimeout(r, 700));

      // Step 5: Hands & Testnet Deployment (Revenue Event)
      setActiveStep(5);
      onExpenseDeducted(200, 'Vercel / Testnet Subdomain exp-01 Provisioning');
      await new Promise(r => setTimeout(r, 900));
      onRevenueAdded(398, 'First 2 Paying Subscribers (₹199 x 2)');

      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });

      // Step 6: Grim Reaper Evaluation
      setActiveStep(6);
      setReaperData({
        daysElapsed: 7,
        totalTrials: 18,
        paidUsers: 2,
        revenueGeneratedINR: 398,
        costIncurredINR: 605,
        decision: 'SCALE_PROJECT',
        actionTaken: 'Threshold Passed (>=2 paid users). Scaling allocated budget: ₹1,000 for targeted outreach.',
        nextStepSummary: 'Keep domain active. Launch automated WhatsApp outreach to 100 retail directories.',
        status: 'SIMULATED'
      });

    } catch (err) {
      console.error('Simulation loop failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetBrain = () => {
    setActiveStep(0);
    setScoutData(null);
    setAnalystData(null);
    setBuilderData(null);
    setCriticData(null);
    setReaperData(null);
  };

  // 2. RUN HANDS TOOL EXECUTION
  const handleExecuteHandsTool = async () => {
    setIsExecutingTool(true);
    try {
      let args: any = {};
      if (selectedTool === 'execute_terminal_command') args = { command: toolCommandArg };
      if (selectedTool === 'write_file') args = { filePath: toolFileArg, content: toolContentArg };
      if (selectedTool === 'deploy_contract') args = { contractName: 'MicroTipL2', network: 'Polygon Amoy Testnet' };
      if (selectedTool === 'post_to_social') args = { platform: 'Reddit r/developersIndia', message: 'I built an autonomous micro-tool. Check it out!' };
      if (selectedTool === 'read_api') args = { endpoint: 'Polygon Gas Price & Market Complaints Feed' };

      const res = await fetch('/api/agent/hands/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: selectedTool, args })
      });
      const data = await res.json();
      setToolOutputLog(prev => [data, ...prev]);
      onExpenseDeducted(15, `Hands Tool '${selectedTool}' invocation`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingTool(false);
    }
  };

  // 3. SEARCH VECTOR MEMORY
  const handleSearchMemory = async () => {
    setIsSearchingMemory(true);
    try {
      const res = await fetch('/api/agent/memory/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: memorySearchQuery })
      });
      const data = await res.json();
      if (data.matchedItems) {
        setMemoryList(data.matchedItems);
      }
      if (data.topLesson) {
        setTopMemoryLesson(data.topLesson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingMemory(false);
    }
  };

  // 4. CREATE AUTONOMOUS ECONOMY / TOKEN PROJECT
  const handleCreateEconomy = async () => {
    setIsCreatingEconomy(true);
    try {
      const res = await fetch('/api/agent/economy/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: economyConcept, type: economyType })
      });
      const data: EconomyProject = await res.json();
      setCreatedEconomy(data);
      onExpenseDeducted(250, `Autonomous Creation: Smart Contract & Landing Page '${data.title}'`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingEconomy(false);
    }
  };

  // 5. SIMULATE 10 DUMMY TRANSACTIONS ON TESTNET
  const handleRunTestTransactions = async () => {
    if (!createdEconomy) return;
    setIsSimulatingTx(true);
    setTestTxLog([]);

    const dummyTxs = [
      'Tx 1: 0x4a8b... sent 5 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 2: 0x9c1d... sent 12 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 3: 0x3e7f... sent 2 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 4: 0x8a2c... sent 20 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 5: 0x1f5d... sent 8 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 6: 0x7b9e... sent 15 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 7: 0x2d4a... sent 4 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 8: 0x6c8f... sent 30 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 9: 0x5e1b... sent 10 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet',
      'Tx 10: 0x0a3c... sent 25 AUTOTIP (Gas: 0.0001 MATIC) -> Verified on Testnet'
    ];

    for (let i = 0; i < dummyTxs.length; i++) {
      await new Promise(r => setTimeout(r, 220));
      setTestTxLog(prev => [...prev, dummyTxs[i]]);
    }

    setIsSimulatingTx(false);
    onRevenueAdded(createdEconomy.revenueGeneratedINR || 398, `Autonomous Protocol Micro-Fees (10 Tx Loop)`);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Cockpit Navigation Tabs */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-1.5 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubTab('brain')}
            className={`px-3.5 py-2 border transition flex items-center space-x-2 ${
              activeSubTab === 'brain'
                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                : 'bg-white text-[#141414] hover:bg-slate-100 border-[#141414]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. The Brain (Cognitive Loop)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hands')}
            className={`px-3.5 py-2 border transition flex items-center space-x-2 ${
              activeSubTab === 'hands'
                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                : 'bg-white text-[#141414] hover:bg-slate-100 border-[#141414]'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>2. The Hands (Action Sandbox)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('memory')}
            className={`px-3.5 py-2 border transition flex items-center space-x-2 ${
              activeSubTab === 'memory'
                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                : 'bg-white text-[#141414] hover:bg-slate-100 border-[#141414]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. The Memory (Vector DB)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('economy')}
            className={`px-3.5 py-2 border transition flex items-center space-x-2 ${
              activeSubTab === 'economy'
                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                : 'bg-white text-[#141414] hover:bg-slate-100 border-[#141414]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>4. The Economy (Currency Maker)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2 py-1 bg-white border border-[#141414] text-[#141414]">
            AUTONOMOUS ENTITY: <strong className="text-[#10b981]">ACTIVE</strong>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: THE BRAIN (LANGGRAPH MULTI-AGENT LOOP) */}
      {/* ========================================================================= */}
      {activeSubTab === 'brain' && (
        <div className="space-y-6">
          <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'द ब्रेन: मल्टी-एजेंट स्वायत्त चक्र' : 'The Brain: Multi-Agent Cognitive Loop'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
                  {language === 'hi'
                    ? 'खुद सोचना, खुद कोड लिखना, और खुद निर्णय लेना'
                    : 'Autonomous Observation, Ideation, Coding & 7-Day Kill Switch'}
                </h1>
                <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
                  {language === 'hi'
                    ? 'LangGraph स्टेटग्राफ पर आधारित 5-एजेंट लूप: Planner (दर्द ढूंढता है) → Memory (पुराने सबक जांचता है) → Builder (कोड लिखता है) → Critic (संविधान वैलिडेट करता है) → Hands (सैंडबॉक्स में रन करता है) → Grim Reaper (7-दिन में ₹0 आने पर मार देता है)।'
                    : 'LangGraph multi-agent cognitive loop cycling autonomously: Planner observes pain -> Memory injects post-mortems -> Builder writes code -> Critic checks Constitution -> Hands executes sandbox -> Grim Reaper kills or scales.'}
                </p>
              </div>

              <div className="flex items-center space-x-2 font-mono shrink-0">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handleResetBrain}
                    className="bg-white hover:bg-[#F4F3F0] text-[#141414] px-3.5 py-2 border border-[#141414] text-xs font-semibold transition flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRunFullLoop}
                  disabled={isRunning}
                  className="bg-[#141414] hover:bg-black disabled:opacity-50 text-[#E4E3E0] px-5 py-2 border border-[#141414] text-xs font-bold transition flex items-center space-x-2 shadow-xs"
                >
                  {isRunning ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'hi' ? 'एजेंट्स काम कर रहे हैं...' : 'Agents Executing...'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{language === 'hi' ? 'स्वायत्त 5-एजेंट चक्र चलाएं' : 'Run 5-Agent Cognitive Loop'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Query Filter */}
            <div className="mt-5 pt-4 border-t border-[#141414]/20 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#575653]" />
                <input
                  type="text"
                  value={customDomainQuery}
                  onChange={(e) => setCustomDomainQuery(e.target.value)}
                  placeholder={language === 'hi' ? 'टारगेट सेक्टर (उदा: WhatsApp Billing, Indian Freelancers, Micro-Tipping)...' : 'Target domain (e.g. Indian Retail GST Billing, Govt Tender REST API, Micro-Tipping)...'}
                  className="w-full bg-white border border-[#141414] pl-8 pr-3 py-1.5 text-xs text-[#141414] font-mono placeholder-[#575653] focus:outline-none focus:ring-1 focus:ring-[#141414]"
                />
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#575653] shrink-0 font-mono">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => setCustomDomainQuery('WhatsApp Shopkeeper Receipts')}
                  className="px-2 py-1 bg-white hover:bg-[#F4F3F0] text-[#141414] border border-[#141414] text-[10px]"
                >
                  WhatsApp Receipts
                </button>
                <button
                  type="button"
                  onClick={() => setCustomDomainQuery('Government Tender Alerts')}
                  className="px-2 py-1 bg-white hover:bg-[#F4F3F0] text-[#141414] border border-[#141414] text-[10px]"
                >
                  Govt Tenders
                </button>
              </div>
            </div>
          </div>

          {/* 6-Step Visual Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {brainSteps.map((s) => {
              const Icon = s.icon;
              const isCurrent = activeStep === s.num;
              const isCompleted = activeStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`p-3 border transition-all ${
                    isCurrent
                      ? 'bg-[#141414] text-[#E4E3E0] border-[#141414] shadow-xs scale-[1.02]'
                      : isCompleted
                      ? 'bg-white border-[#141414] text-[#141414]'
                      : 'bg-[#ECEBE8] border-[#141414]/30 text-[#575653]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className={`text-[9px] font-bold px-1 py-0.5 border ${
                      isCurrent
                        ? 'bg-white text-[#141414] border-white'
                        : 'bg-[#ECEBE8] text-[#141414] border-[#141414]'
                    }`}>
                      NODE {s.num}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ) : null}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : isCompleted ? 'text-[#141414]' : 'text-[#575653]'}`} />
                    <span className="text-xs font-mono font-bold truncate">{s.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brain Step Results */}
          <div className="space-y-4">
            {scoutData && (
              <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#141414] font-mono">
                    <Search className="w-3.5 h-3.5" />
                    <span>PLANNER AGENT DISCOVERY</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-white text-[#141414] border border-[#141414]">
                    Source: {scoutData.source}
                  </span>
                </div>
                <div className="bg-white p-3.5 border border-[#141414]">
                  <div className="text-[10px] text-[#575653] font-mono mb-1 uppercase">Observed Real Complaint:</div>
                  <blockquote className="text-xs sm:text-sm font-serif italic text-[#141414]">
                    "{scoutData.complaintQuote}"
                  </blockquote>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 border border-[#141414]">
                    <span className="text-[#575653] font-mono text-[10px] uppercase block mb-0.5">Target:</span>
                    <strong className="text-[#141414]">{scoutData.targetAudience}</strong>
                  </div>
                  <div className="bg-white p-3 border border-[#141414]">
                    <span className="text-[#575653] font-mono text-[10px] uppercase block mb-0.5">Micro-Solution:</span>
                    <strong className="text-[#141414]">{scoutData.suggestedMicroSolution}</strong>
                  </div>
                  <div className="bg-white p-3 border border-[#141414]">
                    <span className="text-[#575653] font-mono text-[10px] uppercase block mb-0.5">Monetization:</span>
                    <strong className="text-[#8b3a0f] font-mono">{scoutData.monetizationAngle}</strong>
                  </div>
                </div>
              </div>
            )}

            {analystData && (
              <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#141414] font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>ANALYST & MEMORY UNIT ECONOMICS</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-mono">
                    SCORE: {analystData.opportunityScore} / 10
                  </span>
                </div>
                {topMemoryLesson && (
                  <div className="bg-amber-50 border border-amber-300 p-2.5 text-xs text-amber-900 font-mono flex items-center space-x-2">
                    <Database className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Injected Memory Lesson:</strong> {topMemoryLesson}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 border border-[#141414]">
                    <span className="text-[10px] font-mono uppercase text-[#575653]">TAM</span>
                    <div className="text-xs sm:text-sm font-bold text-[#141414] font-mono mt-1">{analystData.marketSize}</div>
                  </div>
                  <div className="bg-white p-3.5 border border-[#141414]">
                    <span className="text-[10px] font-mono uppercase text-[#575653]">Build Hours</span>
                    <div className="text-xs sm:text-sm font-bold text-[#141414] font-mono mt-1">{analystData.estimatedBuildHours} Hours</div>
                  </div>
                  <div className="bg-white p-3.5 border border-[#141414]">
                    <span className="text-[10px] font-mono uppercase text-[#575653]">Monthly Server</span>
                    <div className="text-xs sm:text-sm font-bold text-[#141414] font-mono mt-1">₹{analystData.monthlyServerCostINR} / Mo</div>
                  </div>
                  <div className="bg-white p-3.5 border border-[#141414]">
                    <span className="text-[10px] font-mono uppercase text-[#575653]">Price & Break-even</span>
                    <div className="text-xs sm:text-sm font-bold text-[#141414] font-mono mt-1">₹{analystData.recommendedPriceINR}/mo ({analystData.breakEvenSignups} Users)</div>
                  </div>
                </div>
              </div>
            )}

            {builderData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#141414] font-mono">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>BUILDER CODE GENERATION</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(builderData.coreCodeSnippet);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="text-xs font-mono text-[#575653] hover:text-[#141414] flex items-center space-x-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#141414]">{builderData.mvpName}</h3>
                  <div className="bg-white p-3 border border-[#141414] text-[11px] font-mono text-[#141414] overflow-x-auto max-h-48">
                    <pre>{builderData.coreCodeSnippet}</pre>
                  </div>
                </div>

                {criticData && (
                  <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#141414] font-mono">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>CRITIC CONSTITUTION AUDIT</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-white text-[#10b981] border border-[#141414] font-mono">
                        PASSED ({criticData.score}/10)
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {criticData.checks.map((c, i) => (
                        <div key={i} className="bg-white p-2 border border-[#141414] flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                            <span className="text-[#141414]">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-[#575653]">{c.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {reaperData && (
              <div className="bg-[#ECEBE8] border-2 border-[#141414] p-5 sm:p-7 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141414]">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#141414] font-mono">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>STEP 5 & 6: REVENUE CYCLE COMPLETED</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#141414] mt-1">
                      🎉 First Autonomous Cycle: ₹398 Revenue Booked to Treasury
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-mono self-start sm:self-auto">
                    VERDICT: SCALE_PROJECT
                  </span>
                </div>
                <p className="text-xs text-[#575653] font-sans">
                  The AI completed the end-to-end loop: Scouted complaint &rarr; Verified against Vector Memory &rarr; Wrote code &rarr; Passed Constitution checks &rarr; Tested in Docker sandbox &rarr; Launched and acquired 2 paid users!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: THE HANDS (ACTION SPACE SANDBOX TERMINAL) */}
      {/* ========================================================================= */}
      {activeSubTab === 'hands' && (
        <div className="space-y-6">
          <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 shadow-xs">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'द हैंड्स: स्वायत्त कार्यक्षेत्र व डॉकर सैंडबॉक्स' : 'The Hands: Allowlisted Action Space & Sandbox'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'AI के हाथ: केवल सुरक्षित, पूर्वनिर्धारित टूल्स के माध्यम से कार्य'
                : 'Deterministic Action Space via Scoped Allowlisted Tools'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'AI को मनमाने रूट कमांड चलाने की अनुमति नहीं है। वह केवल 6 पूर्वनिर्धारित टूल्स (`write_file`, `execute_terminal_command`, `deploy_contract`, `post_to_social`, `read_api`) को आइसोलेटेड डॉकर सैंडबॉक्स में चला सकता है।'
                : 'AI operates strictly through allowlisted sandbox tools. Every invocation is interceptable by AST parsers and recorded with SHA-256 cryptographic audit logs.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Tool Selector & Input Console */}
            <div className="lg:col-span-5 bg-white border border-[#141414] p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-serif font-bold text-[#141414]">
                {language === 'hi' ? 'टूल निष्पादन कंसोल (Tool Invocation)' : 'Execute Allowlisted Tool'}
              </h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#141414]">Select Tool:</label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value as HandsToolName)}
                  className="w-full bg-[#ECEBE8] border border-[#141414] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-none"
                >
                  <option value="execute_terminal_command">execute_terminal_command (Docker Sandbox Shell)</option>
                  <option value="write_file">write_file (Virtual File System / AST Guarded)</option>
                  <option value="deploy_contract">deploy_contract (Polygon Amoy / Arbitrum Testnet)</option>
                  <option value="post_to_social">post_to_social (Throttled Social Dispatch)</option>
                  <option value="read_api">read_api (Read-only Market & Gas Feed)</option>
                </select>
              </div>

              {selectedTool === 'execute_terminal_command' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-[#141414]">Shell Command:</label>
                  <input
                    type="text"
                    value={toolCommandArg}
                    onChange={(e) => setToolCommandArg(e.target.value)}
                    className="w-full bg-[#ECEBE8] border border-[#141414] p-2 text-xs font-mono text-[#141414] focus:outline-none"
                    placeholder="e.g. npm test, hardhat compile..."
                  />
                </div>
              )}

              {selectedTool === 'write_file' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#141414]">Target File Path:</label>
                    <input
                      type="text"
                      value={toolFileArg}
                      onChange={(e) => setToolFileArg(e.target.value)}
                      className="w-full bg-[#ECEBE8] border border-[#141414] p-2 text-xs font-mono text-[#141414] focus:outline-none"
                      placeholder="e.g. services/myCode.ts"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#141414]">File Content:</label>
                    <textarea
                      rows={3}
                      value={toolContentArg}
                      onChange={(e) => setToolContentArg(e.target.value)}
                      className="w-full bg-[#ECEBE8] border border-[#141414] p-2 text-xs font-mono text-[#141414] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'deploy_contract' && (
                <div className="bg-[#ECEBE8] p-3 border border-[#141414] text-xs font-mono space-y-1 text-[#575653]">
                  <div>Network: <strong>Polygon Amoy Testnet (80002)</strong></div>
                  <div>Contract: <strong>MicroTipL2.sol</strong></div>
                  <div>Gas Cap: <strong>&lt; $0.50 equivalent</strong></div>
                </div>
              )}

              <button
                type="button"
                onClick={handleExecuteHandsTool}
                disabled={isExecutingTool}
                className="w-full bg-[#141414] hover:bg-black text-[#E4E3E0] font-mono text-xs font-bold py-2.5 border border-[#141414] transition flex items-center justify-center space-x-2"
              >
                {isExecutingTool ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing in Sandbox...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute via Hands Engine</span>
                  </>
                )}
              </button>
            </div>

            {/* Terminal Output Logs */}
            <div className="lg:col-span-7 bg-[#141414] text-[#E4E3E0] border border-[#141414] p-4 font-mono text-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#333] pb-2 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  </div>
                  <span>SANDBOX DOCKER CONTAINER #c49a (ISOLATED)</span>
                </div>
                <span className="text-emerald-400">AST ACTIVE</span>
              </div>

              <div className="max-h-[380px] overflow-y-auto space-y-3">
                {toolOutputLog.length === 0 ? (
                  <div className="text-slate-500 text-xs py-8 text-center">
                    Select a tool and click "Execute via Hands Engine" to view real container execution logs...
                  </div>
                ) : (
                  toolOutputLog.map((log, idx) => (
                    <div key={idx} className="bg-[#1e1e1e] p-3 border border-[#333] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-emerald-400 font-bold">[{log.tool}]</span>
                        <span>{log.executionTimeMs}ms • {log.auditHash}</span>
                      </div>
                      <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {log.output}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 6 Allowlisted Tools Registry Table */}
          <div className="bg-white border border-[#141414] p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-serif font-bold text-[#141414]">
              {language === 'hi' ? 'अनुमति प्राप्त टूल्स की आधिकारिक रजिस्ट्री (Allowlisted Registry)' : 'Approved Tools Registry & Guardrail Policies'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="bg-[#ECEBE8] border-b border-[#141414] text-[#141414]">
                    <th className="p-2.5">Tool Name</th>
                    <th className="p-2.5">Risk Level</th>
                    <th className="p-2.5">Container Guardrail & Limits</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]/10">
                  {ALLOWLISTED_TOOLS_REGISTRY.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-[#141414]"><code>{t.name}</code></td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                          t.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}>
                          {t.riskLevel}
                        </span>
                      </td>
                      <td className="p-2.5 text-[#575653] text-[11px]">{t.guardrail}</td>
                      <td className="p-2.5 text-[#141414] text-[11px]">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: THE MEMORY (VECTOR DB & POST-MORTEMS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'memory' && (
        <div className="space-y-6">
          <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 shadow-xs">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <Database className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'द मेमोरी: वेक्टर डेटाबेस व पिछले सबक' : 'The Memory: Vector DB & Post-Mortems'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'गलतियों से सीखना: एक गलती दोबारा कभी नहीं'
                : 'Self-Learning: Querying Past Failures & Successes'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'अगर AI ने एक बार L1 गैस फीस या जेनेरिक चैटबॉट बनाकर गलती की, तो वह वेक्टर डेटाबेस में सेव हो जाती है। नया प्रोजेक्ट शुरू करने से पहले AI खुद मेमोरी से सवाल पूछता है: "पिछली बार जब ऐसा किया था, तो क्या हुआ था?"'
                : 'Every failure and win is indexed in vector storage with root cause analysis. Before building anything new, the Planner queries past post-mortems to avoid repeating costly mistakes.'}
            </p>

            <div className="mt-4 pt-4 border-t border-[#141414]/20 flex gap-2">
              <input
                type="text"
                value={memorySearchQuery}
                onChange={(e) => setMemorySearchQuery(e.target.value)}
                placeholder="Query memory (e.g. 'crypto gas fee', 'blog writer saas', 'whatsapp ocr')..."
                className="flex-1 bg-white border border-[#141414] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearchMemory}
                disabled={isSearchingMemory}
                className="bg-[#141414] hover:bg-black text-[#E4E3E0] px-4 py-2 text-xs font-mono font-bold border border-[#141414]"
              >
                {isSearchingMemory ? 'Querying Vector DB...' : 'Query Memory'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memoryList.map((mem) => (
              <div key={mem.id} className="bg-white border border-[#141414] p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                    mem.outcome === 'SCALED_PROFITABLE'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-red-100 text-red-900 border-red-300'
                  }`}>
                    {mem.outcome}
                  </span>
                  <span className="text-[10px] text-[#575653] font-mono">{mem.timestamp}</span>
                </div>

                <h3 className="text-sm font-serif font-bold text-[#141414]">
                  {mem.projectTitle}
                </h3>

                <div className="bg-[#F4F3F0] p-3 border border-[#141414] space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-[#8b3a0f] uppercase font-bold block">Root Cause:</span>
                  <p className="text-[#575653] text-[11px] leading-relaxed">
                    {language === 'hi' ? mem.rootCauseHi : mem.rootCause}
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 border border-emerald-200 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold block">Hardcoded Learned Rule:</span>
                  <p className="text-emerald-950 font-mono text-[11px] font-semibold leading-relaxed">
                    "{language === 'hi' ? mem.learnedRuleHi : mem.learnedRule}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: THE ECONOMY (AUTONOMOUS CURRENCY & TOKEN MAKER) */}
      {/* ========================================================================= */}
      {activeSubTab === 'economy' && (
        <div className="space-y-6">
          <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 shadow-xs">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <Coins className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'द इकोनॉमी: स्वायत्त मुद्रा व मूल्य जनरेटर' : 'The Economy: Autonomous Currency & Value Creator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'नया आर्थिक मूल्य (Currency/Token/SaaS) खुद बनाना'
                : 'Autonomous Token, Smart Contract & Economic Stream Synthesis'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'AI सिर्फ बातें नहीं करता; वह खुद Layer-2 स्मार्ट अनुबंध लिखता है, टेस्टनेट पर 10 डमी ट्रांजैक्शन वेरीफाई करता है, लैंडिंग पेज जनरेट करता है और ट्रेजरी में सीधे रेवेन्यू कलेक्ट करता है।'
                : 'AI creates self-sustaining economic loops: deploys L2 micro-tokens with $0.0001 gas fees, auto-generates payment checkout links, and channels micro-fees directly into the Treasury.'}
            </p>

            <div className="mt-5 pt-4 border-t border-[#141414]/20 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <input
                type="text"
                value={economyConcept}
                onChange={(e) => setEconomyConcept(e.target.value)}
                className="sm:col-span-8 bg-white border border-[#141414] p-2 text-xs font-mono text-[#141414] focus:outline-none"
                placeholder="Economic Concept (e.g. Polygon L2 MicroTip Token, WhatsApp GST billing)..."
              />
              <select
                value={economyType}
                onChange={(e) => setEconomyType(e.target.value as any)}
                className="sm:col-span-2 bg-white border border-[#141414] p-2 text-xs font-mono text-[#141414] focus:outline-none"
              >
                <option value="SMART_CONTRACT_L2">Smart Contract L2</option>
                <option value="MICRO_SAAS_API">Micro-SaaS API</option>
              </select>
              <button
                type="button"
                onClick={handleCreateEconomy}
                disabled={isCreatingEconomy}
                className="sm:col-span-2 bg-[#141414] hover:bg-black text-[#E4E3E0] py-2 text-xs font-mono font-bold border border-[#141414] transition"
              >
                {isCreatingEconomy ? 'Synthesizing...' : 'Create Value'}
              </button>
            </div>
          </div>

          {createdEconomy && (
            <div className="space-y-5">
              <div className="bg-white border-2 border-[#141414] p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141414]">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141414] text-[#E4E3E0] uppercase font-bold">
                      {createdEconomy.type}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-[#141414] mt-1.5">
                      {createdEconomy.title}
                    </h2>
                    <p className="text-xs text-[#575653] font-mono mt-0.5">
                      Problem Solved: {createdEconomy.problemObserved}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleRunTestTransactions}
                      disabled={isSimulatingTx}
                      className="bg-[#10b981] hover:bg-emerald-600 text-black font-mono text-xs font-bold px-4 py-2 border border-[#141414] transition flex items-center space-x-1.5"
                    >
                      {isSimulatingTx ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Testing 10 On-Chain Txs...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Simulate 10 Testnet Txs & Book ₹398</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Smart Contract Code */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#141414]">
                      <span>1. Solidity Smart Contract (0.8.20)</span>
                      <span className="text-[10px] text-[#575653]">Polygon Amoy Testnet</span>
                    </div>
                    <div className="bg-[#141414] text-[#E4E3E0] p-3 text-[11px] font-mono border border-[#141414] overflow-x-auto max-h-56">
                      <pre>{createdEconomy.contractCode || '// Solidity Contract'}</pre>
                    </div>
                  </div>

                  {/* Backend / RPC Endpoint Code */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#141414]">
                      <span>2. Backend Microservice & Webhook</span>
                      <span className="text-[10px] text-[#575653]">Node.js Express + Ethers</span>
                    </div>
                    <div className="bg-[#141414] text-[#E4E3E0] p-3 text-[11px] font-mono border border-[#141414] overflow-x-auto max-h-56">
                      <pre>{createdEconomy.backendCode}</pre>
                    </div>
                  </div>
                </div>

                {/* Testnet Transaction Stream */}
                {testTxLog.length > 0 && (
                  <div className="bg-[#141414] text-emerald-400 p-4 border border-[#141414] font-mono text-xs space-y-1.5">
                    <div className="text-white font-bold pb-1 border-b border-[#333] flex items-center justify-between">
                      <span>LIVE TESTNET TRANSACTION STREAM (10 Tx Loop)</span>
                      <span className="text-emerald-400">100% SUCCESS • 0 REVERSALS</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1 text-[11px]">
                      {testTxLog.map((tx, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{tx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
