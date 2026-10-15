import React, { useState, useEffect } from 'react';
import { Language, PlaybookAnalysis, ResearchSeriesItem, Pillar } from '../types';
import {
  DEFAULT_PLAYBOOK_ANALYSIS_EN,
  DEFAULT_PLAYBOOK_ANALYSIS_HI,
} from '../data/researchData';
import {
  Compass,
  TestTube,
  HelpCircle,
  ShieldAlert,
  Check,
  RefreshCw,
  Copy,
  BookmarkPlus,
  Trash2,
  Download,
  AlertCircle,
  Sparkles,
  Share2,
} from 'lucide-react';

interface PlaybookWorkbenchProps {
  language: Language;
  presetQuestion?: string;
  presetPillar?: string;
  onClearPreset?: () => void;
  onSendToFunnel: (question: string) => void;
  onBroadcastConnectors?: (title: string, inquiry: string) => void;
}

const PRESET_QUESTIONS = [
  {
    en: 'Do humans genuinely understand their own cognitive architecture?',
    hi: 'क्या इंसान खुद को वास्तव में समझता है?',
    pillar: 'Human Intelligence',
  },
  {
    en: 'Will autonomous AI agents enhance or dismantle human sovereign agency?',
    hi: 'क्या स्वायत्त AI एजेंट्स मानव की स्वतंत्र इच्छाशक्ति को बढ़ाएंगे या समाप्त करेंगे?',
    pillar: 'Human Agency',
  },
  {
    en: 'Why did biological organisms engineer synthetic intelligence in the first place?',
    hi: 'मनुष्य ने सिलिकॉन में बुद्धिमत्ता क्यों डाली?',
    pillar: 'Artificial Intelligence',
  },
  {
    en: 'Can high-dimensional neural representations achieve genuine semantic understanding?',
    hi: 'क्या उच्च-आयामी गणितीय मॉडल वास्तविक अर्थ और चेतना को समझ सकते हैं?',
    pillar: 'The Search Within',
  },
];

export const PlaybookWorkbench: React.FC<PlaybookWorkbenchProps> = ({
  language,
  presetQuestion,
  presetPillar,
  onClearPreset,
  onSendToFunnel,
  onBroadcastConnectors,
}) => {
  const isHi = language === 'hi';
  const defaultAnalysis = isHi ? DEFAULT_PLAYBOOK_ANALYSIS_HI : DEFAULT_PLAYBOOK_ANALYSIS_EN;
  const [question, setQuestion] = useState<string>(presetQuestion || (isHi ? PRESET_QUESTIONS[0].hi : PRESET_QUESTIONS[0].en));
  const [selectedPillar, setSelectedPillar] = useState<string>(presetPillar || 'Human Intelligence');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PlaybookAnalysis>(defaultAnalysis);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [savedEntries, setSavedEntries] = useState<{ id: string; title: string; date: string; data: PlaybookAnalysis }[]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [adversarialClaim, setAdversarialClaim] = useState<string>('');
  const [adversarialResult, setAdversarialResult] = useState<any | null>(null);
  const [isAdversarialLoading, setIsAdversarialLoading] = useState<boolean>(false);

  // Sync default analysis on language change if showing default question
  useEffect(() => {
    if (!presetQuestion) {
      setQuestion(isHi ? PRESET_QUESTIONS[0].hi : PRESET_QUESTIONS[0].en);
      setAnalysis(isHi ? DEFAULT_PLAYBOOK_ANALYSIS_HI : DEFAULT_PLAYBOOK_ANALYSIS_EN);
    }
  }, [language]);

  // Load saved entries from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('amey_research_journal');
      if (stored) {
        setSavedEntries(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read journal from localStorage', e);
    }
  }, []);

  // Update question if preset changes
  useEffect(() => {
    if (presetQuestion) {
      setQuestion(presetQuestion);
      if (presetPillar) setSelectedPillar(presetPillar);
    }
  }, [presetQuestion, presetPillar]);

  // Execute the 8-Step Investigation
  const handleRunInvestigation = async (customQ?: string) => {
    const targetQ = customQ || question;
    if (!targetQ.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/research/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: targetQ,
          pillar: selectedPillar,
          language,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAnalysis(json.data);
        setActiveStepTab(1);
      }
    } catch (err) {
      console.warn('Playbook execution fallback', err);
      // Graceful local fallback
      setAnalysis(isHi ? DEFAULT_PLAYBOOK_ANALYSIS_HI : DEFAULT_PLAYBOOK_ANALYSIS_EN);
    } finally {
      setIsLoading(false);
    }
  };

  // Save current investigation to local journal
  const handleSaveToJournal = () => {
    if (!analysis) return;
    const newEntry = {
      id: Date.now().toString(),
      title: analysis.step1_question,
      date: new Date().toLocaleDateString(),
      data: analysis,
    };
    const updated = [newEntry, ...savedEntries.slice(0, 19)];
    setSavedEntries(updated);
    try {
      localStorage.setItem('amey_research_journal', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Delete saved entry
  const handleDeleteEntry = (id: string) => {
    const updated = savedEntries.filter((e) => e.id !== id);
    setSavedEntries(updated);
    try {
      localStorage.setItem('amey_research_journal', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Copy as Markdown
  const handleCopyMarkdown = () => {
    if (!analysis) return;
    const md = `# AMEY RESEARCH PLAYBOOK
## Step 1: Question
${analysis.step1_question}

## Step 2: Working Claim (Hypothesis)
${analysis.step2_claim}

## Step 3: Empirical Evidence
${analysis.step3_evidence?.map((e) => `- ${e}`).join('\n')}

## Step 4: Mandatory Counter-Evidence (Steelmanned)
${analysis.step4_counter_evidence?.map((ce) => `- ${ce}`).join('\n')}

## Step 5: Measurable Experiment
${analysis.step5_experiment}

## Step 6: Empirical Result
${analysis.step6_result}

## Step 7: Epistemic Unknown
${analysis.step7_unknown}

## Step 8: Revision
${analysis.step8_revision}

— AMEY | The Search Within (Question → Evidence → Experiment → Result → Revision)`;

    navigator.clipboard.writeText(md);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Run Epistemic Steelmanning
  const handleRunCounterChallenge = async () => {
    const targetClaim = adversarialClaim || analysis?.step2_claim;
    if (!targetClaim) return;

    setIsAdversarialLoading(true);
    try {
      const res = await fetch('/api/research/counter-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: targetClaim,
          context: selectedPillar,
          language,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAdversarialResult(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdversarialLoading(false);
    }
  };

  const stepsList = [
    { num: 1, nameEn: 'Question', nameHi: 'प्रश्न', descEn: 'Uncomfortable Inquiry', descHi: 'कठिन सवाल' },
    { num: 2, nameEn: 'Claim', nameHi: 'दावा', descEn: 'Working Hypothesis', descHi: 'परिकल्पना' },
    { num: 3, nameEn: 'Evidence', nameHi: 'साक्ष्य', descEn: 'Empirical Grounding', descHi: 'वैज्ञानिक आधार' },
    { num: 4, nameEn: 'Counter-Evidence', nameHi: 'जवाबी साक्ष्य', descEn: 'Mandatory Steelmanning', descHi: 'अनिवार्य खंडन' },
    { num: 5, nameEn: 'Experiment', nameHi: 'प्रयोग', descEn: 'Measurable Test', descHi: 'परीक्षण' },
    { num: 6, nameEn: 'Result', nameHi: 'परिणाम', descEn: 'Observed Finding', descHi: 'निष्कर्ष' },
    { num: 7, nameEn: 'Unknown', nameHi: 'अज्ञात', descEn: 'Epistemic Boundary', descHi: 'ज्ञान की सीमा' },
    { num: 8, nameEn: 'Revision', nameHi: 'परिमार्जन', descEn: 'Updated Model', descHi: 'सिद्धांत बदलाव' },
  ];

  return (
    <section id="playbook" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">
            {isHi ? '8-चरणीय वैज्ञानिक कार्यप्रणाली' : 'The 8-Step Scientific Protocol'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            {isHi ? 'AMEY रिसर्च प्लेबुक' : 'The Research Playbook'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'हमारा नियम: "मैं सत्य जानता हूँ" कभी नहीं कहना। असुविधाजनक प्रश्न पूछना, साक्ष्य खोजना, अपने ही विचार के विरुद्ध जवाबी साक्ष्य खोजना और जहाँ साक्ष्य समाप्त हों वहाँ अनिश्चितता स्वीकार करना।'
              : 'Our core protocol: Reject dogma. Formulate penetrating questions, assemble empirical proof, mandate adversarial counter-evidence, and openly delineate where certainty ends.'}
          </p>
        </div>

        {/* Question Input Console */}
        <div className="mt-10 rounded-xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-400 mb-3">
            <span className="text-amber-400 uppercase tracking-widest">
              {isHi ? 'चरण 1: असुविधाजनक प्रश्न दर्ज करें' : 'Step 1: Enter Uncomfortable Question'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-stone-500">{isHi ? 'स्तम्भ' : 'Pillar'}:</span>
              <select
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value)}
                className="bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Human Intelligence">01. Human Intelligence</option>
                <option value="Artificial Intelligence">02. Artificial Intelligence</option>
                <option value="Human Agency">03. Human Agency</option>
                <option value="Future of Civilization">04. Future of Civilization</option>
                <option value="The Search Within">05. The Search Within</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={isHi ? 'यहाँ कोई दार्शनिक या तकनीकी प्रश्न लिखें...' : 'Formulate a penetrating research inquiry...'}
              className="w-full rounded-lg border border-stone-700 bg-stone-950 px-4 py-3 text-sm sm:text-base text-stone-100 placeholder-stone-600 focus:border-amber-500 focus:outline-none font-serif"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunInvestigation();
              }}
            />
          </div>

          {/* Quick presets */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-stone-500">
              {isHi ? 'उदाहरण प्रश्न:' : 'Example Inquiries:'}
            </span>
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const q = isHi ? pq.hi : pq.en;
                  setQuestion(q);
                  setSelectedPillar(pq.pillar);
                  handleRunInvestigation(q);
                }}
                className="text-xs text-stone-400 hover:text-amber-300 transition-colors font-serif italic truncate max-w-xs"
              >
                "{isHi ? pq.hi : pq.en}"
              </button>
            ))}
          </div>

          {/* Trigger Button */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800/80 pt-4">
            <div className="text-xs text-stone-500">
              {isHi
                ? 'सिस्टम स्वचालित रूप से 8 चरणों में परिकल्पना, साक्ष्य, खंडन और अज्ञात सीमाएं तैयार करेगा।'
                : 'Generates hypothesis, empirical evidence, steelmanned counter-arguments, and delineated unknowns.'}
            </div>
            <button
              onClick={() => handleRunInvestigation()}
              disabled={isLoading || !question.trim()}
              className="flex items-center gap-2 rounded bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? (isHi ? 'शोध हो रहा है...' : 'Investigating...') : (isHi ? '8-चरणीय प्लेबुक चलाएं' : 'Execute 8-Step Playbook')}</span>
            </button>
          </div>
        </div>

        {/* 8-Step Stepper Navigation */}
        <div className="mt-10 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {stepsList.map((step) => {
              const isActive = activeStepTab === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStepTab(step.num)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500/20 border border-amber-500 text-amber-200 font-semibold'
                      : 'border border-stone-800 bg-stone-900/40 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <span className="font-mono text-amber-400">0{step.num}</span>
                  <span>{isHi ? step.nameHi : step.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The 8-Step Interactive Dossier Canvas */}
        {analysis && (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8 backdrop-blur-sm">
            {/* Header with actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <div className="text-xs font-mono text-stone-500">
                  <span>STEP 0{activeStepTab} OF 08</span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span className="text-amber-400">{stepsList[activeStepTab - 1].descEn}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-100 mt-1">
                  {isHi ? stepsList[activeStepTab - 1].nameHi : stepsList[activeStepTab - 1].nameEn}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToJournal}
                  className="flex items-center gap-1.5 rounded border border-stone-700 px-3 py-1.5 text-xs text-stone-300 hover:border-stone-600 hover:text-white transition-colors"
                  title="Save to Personal Research Journal"
                >
                  <BookmarkPlus className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isHi ? 'जर्नल में सहेजें' : 'Save to Journal'}</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 rounded border border-stone-700 px-3 py-1.5 text-xs text-stone-300 hover:border-stone-600 hover:text-white transition-colors"
                  title="Copy 8-Step Markdown"
                >
                  {copySuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copySuccess ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'मार्कडाउन' : 'Markdown')}</span>
                </button>

                <button
                  onClick={() => onSendToFunnel(analysis.step1_question)}
                  className="flex items-center gap-1.5 rounded bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-amber-100 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isHi ? 'कंटेंट बनाएं' : 'Build Content'}</span>
                </button>

                {onBroadcastConnectors && (
                  <button
                    onClick={() => onBroadcastConnectors(analysis.step1_question, analysis.step2_claim)}
                    className="flex items-center gap-1.5 rounded border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition-colors cursor-pointer"
                    title="Syndicate finding across Connectors & MCP"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{isHi ? 'सिंडिकेट करें' : 'Syndicate via Connectors'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step-Specific Deep Content Presentation */}
            <div className="py-6 min-h-[220px]">
              {activeStepTab === 1 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    {isHi ? 'कठिन असुविधाजनक प्रश्न' : 'The Penetrating Uncomfortable Question'}
                  </div>
                  <blockquote className="font-serif italic text-2xl sm:text-3xl text-stone-100 border-l-2 border-amber-500 pl-4 py-1 leading-relaxed">
                    "{analysis.step1_question}"
                  </blockquote>
                  <p className="text-xs sm:text-sm text-stone-400 font-light max-w-2xl leading-relaxed">
                    {isHi
                      ? 'यह सवाल किसी भी पूर्व-निर्धारित उत्तर की संतुष्टि को चुनौती देता है। शोध की विश्वसनीयता उत्तर की गति से नहीं, बल्कि सवाल की गहराई से आंकी जाती है।'
                      : 'This question cuts through superficial consensus. In the AMEY framework, credibility begins by identifying what most commentators take for granted.'}
                  </p>
                </div>
              )}

              {activeStepTab === 2 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    {isHi ? 'कार्यकारी परिकल्पना / दावा' : 'Working Hypothesis & Epistemic Claim'}
                  </div>
                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-5 text-base sm:text-lg text-stone-200 font-serif leading-relaxed">
                    {analysis.step2_claim}
                  </div>
                  <div className="text-xs text-stone-500 italic">
                    {isHi
                      ? 'नोट: यह दावा अंतिम सत्य नहीं है। यह केवल एक परीक्षण योग्य मॉडल है जिसे अगले चरण में साक्ष्य और खंडन के सामने रखा जाएगा।'
                      : 'Note: This claim is deliberately framed as falsifiable. It is a working model subjected to immediate counter-investigation.'}
                  </div>
                </div>
              )}

              {activeStepTab === 3 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>{isHi ? 'वैज्ञानिक और ऐतिहासिक साक्ष्य' : 'Empirical, Cognitive & Historical Evidence'}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.step3_evidence?.map((item, idx) => (
                      <div key={idx} className="rounded-lg border border-stone-800 bg-stone-950/80 p-4 space-y-2">
                        <span className="font-mono text-xs text-emerald-400">EVIDENCE [{idx + 1}]</span>
                        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStepTab === 4 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{isHi ? 'अनिवार्य खंडन (Steelmanned Counter-Evidence)' : 'Mandatory Counter-Evidence (Steelmanning)'}</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {isHi
                      ? 'अपने विचार के खिलाफ सबसे मजबूत तर्क खोजना अनिवार्य है। यदि हम अपने ही विचार को चुनौती नहीं देंगे, तो वह शोध नहीं केवल हठधर्मिता बन जाएगा।'
                      : 'Mandatory intellectual rule: We must state the strongest opposing arguments with absolute fairness before drawing any conclusions.'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.step4_counter_evidence?.map((item, idx) => (
                      <div key={idx} className="rounded-lg border border-stone-800/80 bg-rose-950/10 p-4 space-y-2">
                        <span className="font-mono text-xs text-rose-400">COUNTER-POINT [{idx + 1}]</span>
                        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStepTab === 5 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <TestTube className="h-3.5 w-3.5" />
                    <span>{isHi ? 'प्रस्तावित मापने योग्य प्रयोग' : 'Measurable Test & Experimental Benchmark'}</span>
                  </div>
                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-5 space-y-3">
                    <p className="text-sm sm:text-base text-stone-200 font-mono leading-relaxed">
                      {analysis.step5_experiment}
                    </p>
                    <div className="text-xs text-stone-500 font-sans">
                      {isHi
                        ? 'प्रस्तावित पद्धति: नियंत्रित कोहोर्ट, व्यवहारिक सैंडबॉक्स या मैकेनिस्टिक न्यूरल वेट विश्लेषण।'
                        : 'Methodology: Controlled behavioral sandbox, longitudinal telemetry, or causal mediation analysis.'}
                    </div>
                  </div>
                </div>
              )}

              {activeStepTab === 6 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                    {isHi ? 'साक्ष्य परिणाम' : 'Empirical Result & Current Findings'}
                  </div>
                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-5">
                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif">
                      {analysis.step6_result}
                    </p>
                  </div>
                </div>
              )}

              {activeStepTab === 7 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{isHi ? 'ज्ञान की सीमा (The Essential Unknown)' : 'The Horizon of Epistemic Humility (Unknowns)'}</span>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 p-5 space-y-2">
                    <p className="font-serif italic text-base sm:text-lg text-amber-100 leading-relaxed">
                      "{analysis.step7_unknown}"
                    </p>
                    <div className="text-xs text-stone-400">
                      {isHi
                        ? 'जहाँ साक्ष्य समाप्त होते हैं, वहाँ हम अज्ञानता स्वीकार करते हैं। यही AMEY की विश्वसनीयता का मूल आधार है।'
                        : 'Where evidence terminates, we openly accept uncertainty. This boundary is our commitment to intellectual honesty.'}
                    </div>
                  </div>
                </div>
              )}

              {activeStepTab === 8 && (
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{isHi ? 'सिद्धांत का परिमार्जन (Model Revision)' : 'Theory & Mental Model Revision'}</span>
                  </div>
                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-5 space-y-2">
                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif">
                      {analysis.step8_revision}
                    </p>
                    <div className="text-xs text-stone-500 pt-2 border-t border-stone-800">
                      {isHi
                        ? 'नई जानकारी आने पर सिद्धांत बदलना कमजोरी नहीं, बल्कि सच्चे अनुसंधान की पहचान है।'
                        : 'Updating one’s thesis when presented with disconfirming evidence is the pinnacle of scientific integrity.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="flex items-center justify-between border-t border-stone-800 pt-4 text-xs font-mono text-stone-400">
              <button
                onClick={() => setActiveStepTab((prev) => Math.max(1, prev - 1))}
                disabled={activeStepTab === 1}
                className="hover:text-stone-200 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
              >
                ← PREV STEP
              </button>
              <span>{activeStepTab} / 8</span>
              <button
                onClick={() => setActiveStepTab((prev) => Math.min(8, prev + 1))}
                disabled={activeStepTab === 8}
                className="hover:text-stone-200 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
              >
                NEXT STEP →
              </button>
            </div>
          </div>
        )}

        {/* Epistemic Adversary Tool (Steelman Counter-Arguments) */}
        <div className="mt-12 rounded-xl border border-stone-800 bg-stone-900/30 p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-widest text-rose-400 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{isHi ? 'विपरीत-साक्ष्य परीक्षक (Steelmanning Engine)' : 'Adversarial Epistemic Steelmanning'}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-light text-stone-100">
              {isHi ? 'अपने ही दावे को चुनौती दें' : 'Stress-Test Any Claim with Counter-Evidence'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
              {isHi
                ? 'कोई भी दावा लिखें (उदाहरण: "AI मानव एजेंसी को घटा रहा है" या "चेतना केवल एक गणना है")। सिस्टम उसके विरुद्ध सबसे मजबूत वैज्ञानिक और दार्शनिक तर्क प्रस्तुत करेगा।'
                : 'Input any thesis regarding AI, consciousness, or human agency. The engine will construct the most formidable counter-argument to test your cognitive blind spots.'}
            </p>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={adversarialClaim}
              onChange={(e) => setAdversarialClaim(e.target.value)}
              placeholder={analysis?.step2_claim || (isHi ? 'जांचने के लिए कोई दावा लिखें...' : 'Enter a hypothesis to steelman opposing evidence...')}
              className="flex-1 rounded-lg border border-stone-700 bg-stone-950 px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-400"
            />
            <button
              onClick={handleRunCounterChallenge}
              disabled={isAdversarialLoading}
              className="flex items-center justify-center gap-2 rounded bg-rose-500/90 hover:bg-rose-500 px-4 py-2.5 text-xs font-semibold text-stone-950 transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{isAdversarialLoading ? (isHi ? 'विश्लेषण...' : 'Steelmanning...') : (isHi ? 'जवाबी साक्ष्य खोजें' : 'Generate Counter-Thesis')}</span>
            </button>
          </div>

          {/* Adversarial Result */}
          {adversarialResult && (
            <div className="mt-6 rounded-lg border border-rose-900/40 bg-stone-950 p-5 space-y-4">
              <div>
                <div className="text-xs font-mono text-rose-400 uppercase tracking-widest">
                  {isHi ? 'सबसे मजबूत विरोधी दृष्टिकोण' : 'The Formidable Opposing Thesis'}
                </div>
                <div className="mt-1 font-serif text-base sm:text-lg text-stone-200 italic leading-relaxed">
                  "{adversarialResult.steelmanned_counter_thesis}"
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div>
                  <div className="text-xs font-mono text-stone-400 mb-1">
                    {isHi ? 'विरोधी साक्ष्य बिंदु' : 'Contradictory Empirical Points'}
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {adversarialResult.contradictory_evidence?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-mono text-stone-400 mb-1">
                    {isHi ? 'छिपे हुए पूर्वाग्रह' : 'Hidden Assumptions Identified'}
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {adversarialResult.hidden_biases_assumptions?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-3 text-xs text-stone-400">
                <span className="font-mono text-stone-500">{isHi ? 'संतुलित निष्कर्ष: ' : 'Epistemic Balance: '}</span>
                <span>{adversarialResult.synthesized_epistemic_verdict}</span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Research Journal Entries */}
        {savedEntries.length > 0 && (
          <div className="mt-12 border-t border-stone-800 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                {isHi ? 'व्यक्तिगत शोध जर्नल (Saved Inquiries)' : 'Research Journal Archive'} ({savedEntries.length})
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(savedEntries, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `amey_research_journal_${Date.now()}.json`;
                  a.click();
                }}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isHi ? 'जर्नल डाउनलोड करें (JSON)' : 'Export Journal (JSON)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-stone-800 bg-stone-900/40 p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                      <span>{entry.date}</span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-stone-600 hover:text-rose-400 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="font-serif text-sm text-stone-200 line-clamp-2">
                      {entry.title}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAnalysis(entry.data);
                      setQuestion(entry.title);
                      setActiveStepTab(1);
                    }}
                    className="text-left text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors pt-2 border-t border-stone-800/60"
                  >
                    {isHi ? 'दोबारा खोलें →' : 'Load in Dossier →'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
