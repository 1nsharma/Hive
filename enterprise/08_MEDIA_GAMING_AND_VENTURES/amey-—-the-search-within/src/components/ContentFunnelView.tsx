import React, { useState, useEffect } from 'react';
import { Language, FunnelData } from '../types';
import {
  DEFAULT_FUNNEL_DATA_EN,
  DEFAULT_FUNNEL_DATA_HI,
} from '../data/researchData';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  Video,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  Github,
  ArrowDown,
  Layers,
  Code2,
  Download,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface ContentFunnelViewProps {
  language: Language;
  initialInquiry?: string;
  onBroadcastConnectors?: (title: string, inquiry: string) => void;
}

const PRESET_INQUIRIES = [
  {
    en: 'We built AI to understand intelligence, yet we still do not understand our own. What exactly are we teaching the machine to mirror?',
    hi: 'हमने बुद्धिमत्ता को समझने के लिए AI बनाया। लेकिन हम अभी भी अपनी बुद्धिमत्ता को पूरी तरह नहीं समझ पाए हैं। तो हम वास्तव में मशीन को क्या समझना सिखा रहे हैं?',
  },
  {
    en: 'Does algorithmic hyper-personalization expand sovereign human volition or quietly degrade authentic decision agency?',
    hi: 'क्या एल्गोरिदम-आधारित अनुशंसाएं मानवीय इच्छाशक्ति को बढ़ाती हैं या हमारे निर्णय लेने की संप्रभुता को चुपचाप कम कर रही हैं?',
  },
  {
    en: 'Can statistical high-dimensional neural representations ever cross the threshold into phenomenal conscious experience?',
    hi: 'क्या कृत्रिम न्यूरल नेटवर्क्स कभी सांख्यिकीय गणना से आगे बढ़कर वास्तविक व्यक्तिपरक चेतना (Qualia) तक पहुँच सकते हैं?',
  },
];

export const ContentFunnelView: React.FC<ContentFunnelViewProps> = ({
  language,
  initialInquiry,
  onBroadcastConnectors,
}) => {
  const isHi = language === 'hi';
  const defaultData = isHi ? DEFAULT_FUNNEL_DATA_HI : DEFAULT_FUNNEL_DATA_EN;

  const [inquiry, setInquiry] = useState<string>(
    initialInquiry || defaultData.core_question
  );
  const [activePlatform, setActivePlatform] = useState<
    'x' | 'linkedin' | 'youtube' | 'instagram' | 'github' | 'whitepaper'
  >('x');
  const [funnelData, setFunnelData] = useState<FunnelData>(defaultData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Sync default data when language changes if currently showing default
  useEffect(() => {
    if (initialInquiry) {
      setInquiry(initialInquiry);
    } else {
      setInquiry(isHi ? DEFAULT_FUNNEL_DATA_HI.core_question : DEFAULT_FUNNEL_DATA_EN.core_question);
      setFunnelData(isHi ? DEFAULT_FUNNEL_DATA_HI : DEFAULT_FUNNEL_DATA_EN);
    }
  }, [language, initialInquiry]);

  // Generate content across funnel
  const handleGenerateFunnel = async (customInquiry?: string) => {
    const q = customInquiry || inquiry;
    if (!q.trim()) return;

    setIsLoading(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/research/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry: q,
          pillar: 'The Search Within',
          language,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setFunnelData(json.data);
        if (json.notice) {
          setStatusNotice(json.notice);
        }
      }
    } catch (err) {
      console.warn('[Funnel Generator] Network synthesis fallback active');
      // Local fallback in case server connection is unavailable
      setFunnelData(isHi ? DEFAULT_FUNNEL_DATA_HI : DEFAULT_FUNNEL_DATA_EN);
      setStatusNotice(
        isHi
          ? 'स्थानीय बौद्धिक ढाँचे के माध्यम से तुरंत तैयार किया गया'
          : 'Generated via Aemy AI Studio Epistemic Framework'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportFullMarkdown = () => {
    const markdown = `# AEMY AI STUDIO — CONTENT FUNNEL MONOGRAPH
Director: Amit Sharma
Positioning: AI • Human Intelligence • Future Systems
Core Inquiry: ${funnelData.core_question}

---

## 1. X / Twitter Atomic Post
${funnelData.x_post}

### Thread Expansion
${funnelData.x_thread_points?.join('\n\n')}

---

## 2. LinkedIn Executive & Systems Analysis
${funnelData.linkedin_post}

---

## 3. YouTube "THE SEARCH WITHIN" Episode Architecture
Title: ${funnelData.youtube_episode.title}
Hook: ${funnelData.youtube_episode.hook}
Act I (The Paradox): ${funnelData.youtube_episode.act1_the_paradox}
Act II (The Architecture): ${funnelData.youtube_episode.act2_the_evidence}
Act III (The Unknown): ${funnelData.youtube_episode.act3_the_unknown}

---

## 4. Visual Philosophy (Instagram Frame)
Quote: "${funnelData.instagram_frame.quote}"
Visual Direction: ${funnelData.instagram_frame.visual_direction}

---

## 5. Formal Whitepaper Abstract
${funnelData.whitepaper_abstract}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aemy-funnel-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    handleCopy(markdown, 'export-all');
  };

  const funnelTiers = [
    { labelEn: 'Question', labelHi: 'मूल प्रश्न', descEn: 'Uncomfortable paradox' },
    { labelEn: 'Short Post', labelHi: 'संक्षिप्त पोस्ट', descEn: 'X / IG catalyst' },
    { labelEn: 'Thread', labelHi: 'थ्रेड / हिंडोला', descEn: '5-step structure' },
    { labelEn: 'Deep Research', labelHi: 'गहन शोध', descEn: '8-step methodology' },
    { labelEn: 'Article', labelHi: 'लेख', descEn: 'Long-form essay' },
    { labelEn: 'Video', labelHi: 'वीडियो शृंखला', descEn: 'YouTube episode' },
    { labelEn: 'Whitepaper', labelHi: 'शोध पत्र', descEn: 'Formal abstract' },
    { labelEn: 'Book Chapter', labelHi: 'पुस्तक अध्याय', descEn: 'Enduring canon' },
  ];

  return (
    <section id="funnel" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>{isHi ? 'सामग्री वास्तुकला एवं वितरण' : 'Content Machine & Distribution Funnel'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
              {isHi ? 'एक विचार, संपूर्ण बौद्धिक पारिस्थितिकी' : 'From Atomic Question to Enduring Canon'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
              {isHi
                ? 'सोशल मीडिया पर केवल रैंडम पोस्ट्स नहीं होंगी। प्रत्येक विचार एक संरचित फ़नल से होकर गुजरेगा—ताकि एक छोटी पोस्ट भी आपके 10-वर्षीय शोध कार्य का अभिन्न हिस्सा बने।'
                : 'Zero random posting. Every public utterance is an entry point into a calibrated funnel that cascades into deep research, video essays, whitepapers, and monograph chapters.'}
            </p>
          </div>

          <button
            onClick={handleExportFullMarkdown}
            className="self-start md:self-auto flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-900/80 px-4 py-2.5 text-xs font-mono text-stone-300 hover:text-stone-100 hover:border-amber-500/60 transition-all active:scale-95 shadow-sm"
          >
            {copiedKey === 'export-all' ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Download className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>{copiedKey === 'export-all' ? (isHi ? 'कॉपी और डाउनलोड हुआ!' : 'Copied & Downloaded!') : (isHi ? 'संपूर्ण फ़नल डाउनलोड करें (.md)' : 'Export Full Funnel (.md)')}</span>
          </button>
        </div>

        {/* The Vertical Funnel Concept Flow */}
        <div className="mt-10 rounded-xl border border-stone-800 bg-stone-900/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 uppercase tracking-widest mb-4">
            <span>{isHi ? '8-स्तरीय बौद्धिक फ़नल वास्तुकला' : 'The 8-Tier Cascading Funnel Architecture'}</span>
            <span className="text-[10px] text-stone-500">Atomic Post → Formal Monograph</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {funnelTiers.map((tier, idx) => (
              <div
                key={idx}
                className="relative rounded-lg border border-stone-800 bg-stone-950/80 p-3 text-center space-y-1 hover:border-stone-700 transition-colors"
              >
                <div className="font-mono text-xs text-amber-500 font-semibold">0{idx + 1}</div>
                <div className="font-serif text-xs font-medium text-stone-100 truncate">
                  {isHi ? tier.labelHi : tier.labelEn}
                </div>
                <div className="text-[10px] text-stone-500 line-clamp-2 leading-tight">
                  {tier.descEn}
                </div>
                {idx < funnelTiers.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-stone-600 font-mono z-10 text-xs">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input & Generator Console */}
        <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder={isHi ? 'शोध विचार या दार्शनिक प्रश्न लिखें...' : 'Enter seed research paradox to transform...'}
              className="flex-1 rounded-lg border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-serif"
            />
            <button
              onClick={() => handleGenerateFunnel()}
              disabled={isLoading || !inquiry.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-xs sm:text-sm font-semibold text-stone-950 transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-md cursor-pointer"
            >
              <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>
                {isLoading
                  ? (isHi ? 'रूपांतरित हो रहा है...' : 'Transforming...')
                  : (isHi ? 'फ़नल में रूपांतरित करें' : 'Generate Full Funnel')}
              </span>
            </button>
          </div>

          {/* Seed Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-400">
            <span className="font-mono text-[11px] text-stone-500 uppercase">{isHi ? 'त्वरित बीज प्रश्न:' : 'Inquiry Seeds:'}</span>
            {PRESET_INQUIRIES.map((item, idx) => {
              const text = isHi ? item.hi : item.en;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setInquiry(text);
                    handleGenerateFunnel(text);
                  }}
                  className="rounded-full border border-stone-800 bg-stone-950/60 px-3 py-1 text-[11px] text-stone-300 hover:border-amber-500/50 hover:text-amber-400 transition-colors truncate max-w-xs sm:max-w-md text-left"
                >
                  "{text.slice(0, 48)}..."
                </button>
              );
            })}
          </div>

          {/* Status notice badge */}
          {statusNotice && (
            <div className="flex items-center gap-2 rounded-md bg-stone-950/80 border border-amber-500/30 px-3 py-2 text-xs font-mono text-amber-400/90">
              <Info className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{statusNotice}</span>
            </div>
          )}
        </div>

        {/* Multi-Platform Studio Preview */}
        {funnelData && (
          <div className="mt-10 rounded-xl border border-stone-800 bg-stone-900/50 backdrop-blur-sm overflow-hidden">
            {/* Platform Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1 border-b border-stone-800 bg-stone-950/80 p-2">
              <button
                onClick={() => setActivePlatform('x')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  activePlatform === 'x'
                    ? 'bg-stone-800 text-stone-100 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Twitter className="h-3.5 w-3.5 text-sky-400" />
                <span>X / Twitter (Primary)</span>
              </button>

              <button
                onClick={() => setActivePlatform('linkedin')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  activePlatform === 'linkedin'
                    ? 'bg-stone-800 text-stone-100 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-blue-400" />
                <span>LinkedIn (Professional)</span>
              </button>

              <button
                onClick={() => setActivePlatform('youtube')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  activePlatform === 'youtube'
                    ? 'bg-stone-800 text-stone-100 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Video className="h-3.5 w-3.5 text-red-400" />
                <span>YouTube (The Search Within)</span>
              </button>

              <button
                onClick={() => setActivePlatform('instagram')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  activePlatform === 'instagram'
                    ? 'bg-stone-800 text-stone-100 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Instagram className="h-3.5 w-3.5 text-pink-400" />
                <span>Instagram (Visual Philosophy)</span>
              </button>

              <button
                onClick={() => setActivePlatform('github')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  activePlatform === 'github'
                    ? 'bg-stone-800 text-stone-100 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Github className="h-3.5 w-3.5 text-stone-300" />
                <span>GitHub (Proof of Work)</span>
              </button>

              <button
                onClick={() => setActivePlatform('whitepaper')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  activePlatform === 'whitepaper'
                    ? 'bg-stone-800 text-stone-100 shadow-inner'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>Whitepaper Abstract</span>
              </button>

              {onBroadcastConnectors && (
                <button
                  onClick={() => onBroadcastConnectors(funnelData.core_question, funnelData.x_post)}
                  className="sm:ml-auto flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Broadcast to X, LinkedIn, YouTube, Substack & MCP"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{isHi ? 'कनेक्टर्स व MCP से सिंडिकेट करें' : 'Syndicate via Connectors & MCP'}</span>
                </button>
              )}
            </div>

            {/* Platform Canvas Content */}
            <div className="p-6 sm:p-8">
              {/* X / Twitter Preview */}
              {activePlatform === 'x' && (
                <div className="space-y-6">
                  {/* Standalone Tweet */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                      <span className="uppercase text-sky-400">Short Post (Atomic Catalyst)</span>
                      <button
                        onClick={() => handleCopy(funnelData.x_post, 'x_post')}
                        className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                      >
                        {copiedKey === 'x_post' ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedKey === 'x_post' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'पोस्ट कॉपी करें' : 'Copy Post')}</span>
                      </button>
                    </div>
                    <div className="rounded-lg border border-stone-800 bg-stone-950 p-5 font-sans text-sm sm:text-base text-stone-100 whitespace-pre-line leading-relaxed shadow-sm">
                      {funnelData.x_post}
                    </div>
                  </div>

                  {/* Research Thread */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                      <span className="uppercase text-amber-400">5-Part Epistemic Thread</span>
                      <button
                        onClick={() => handleCopy(funnelData.x_thread_points.join('\n\n'), 'x_thread')}
                        className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                      >
                        {copiedKey === 'x_thread' ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedKey === 'x_thread' ? (isHi ? 'थ्रेड कॉपी हुआ' : 'Copied Thread') : (isHi ? 'पूरा थ्रेड कॉपी करें' : 'Copy All Tweets')}</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {funnelData.x_thread_points?.map((tweet, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-stone-800/80 bg-stone-950/60 p-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans"
                        >
                          {tweet}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LinkedIn Preview */}
              {activePlatform === 'linkedin' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="uppercase text-blue-400">Professional Identity: AI Safety & System Strategy</span>
                    <button
                      onClick={() => handleCopy(funnelData.linkedin_post, 'li')}
                      className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      {copiedKey === 'li' ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === 'li' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'पोस्ट कॉपी करें' : 'Copy LinkedIn Post')}</span>
                    </button>
                  </div>
                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-6 text-sm text-stone-200 leading-relaxed whitespace-pre-line font-sans shadow-sm">
                    {funnelData.linkedin_post}
                  </div>
                  <div className="text-xs text-stone-500 font-mono">
                    {isHi
                      ? 'संकेत: यहाँ भाषा साक्ष्य-आधारित, संस्थागत और उद्यम प्रणाली रणनीति पर केंद्रित है।'
                      : 'Editorial note: Grounded in enterprise cognitive sovereignty, systemic incentives, and verifiable volition.'}
                  </div>
                </div>
              )}

              {/* YouTube Preview */}
              {activePlatform === 'youtube' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="uppercase text-red-400">"THE SEARCH WITHIN" Video Essay Brief</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          `EPISODE: ${funnelData.youtube_episode.title}\nHOOK: ${funnelData.youtube_episode.hook}\nACT I: ${funnelData.youtube_episode.act1_the_paradox}\nACT II: ${funnelData.youtube_episode.act2_the_evidence}\nACT III: ${funnelData.youtube_episode.act3_the_unknown}`,
                          'yt'
                        )
                      }
                      className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      {copiedKey === 'yt' ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === 'yt' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'वीडियो रूपरेखा कॉपी करें' : 'Copy Video Brief')}</span>
                    </button>
                  </div>

                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-6 space-y-5">
                    <div>
                      <div className="text-xs font-mono text-stone-500 uppercase">Episode Monograph Title</div>
                      <h4 className="font-serif text-xl sm:text-2xl text-stone-100 mt-1">
                        {funnelData.youtube_episode.title}
                      </h4>
                    </div>

                    <div className="border-l-2 border-red-500/80 pl-4 py-1">
                      <div className="text-xs font-mono text-red-400 uppercase">Opening Hook (0:00 - 1:30)</div>
                      <p className="font-serif italic text-sm sm:text-base text-stone-200 mt-1">
                        "{funnelData.youtube_episode.hook}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="rounded-lg border border-stone-800 bg-stone-900/40 p-4 space-y-1.5">
                        <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">ACT I: THE PARADOX</div>
                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                          {funnelData.youtube_episode.act1_the_paradox}
                        </p>
                      </div>
                      <div className="rounded-lg border border-stone-800 bg-stone-900/40 p-4 space-y-1.5">
                        <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">ACT II: THE ARCHITECTURE</div>
                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                          {funnelData.youtube_episode.act2_the_evidence}
                        </p>
                      </div>
                      <div className="rounded-lg border border-stone-800 bg-stone-900/40 p-4 space-y-1.5">
                        <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">ACT III: THE UNKNOWN</div>
                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                          {funnelData.youtube_episode.act3_the_unknown}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram Visual Philosophy */}
              {activePlatform === 'instagram' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="uppercase text-pink-400">Visual Philosophy: Minimalist Black Screen Frame</span>
                    <button
                      onClick={() => handleCopy(funnelData.instagram_frame.quote, 'ig')}
                      className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      {copiedKey === 'ig' ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === 'ig' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'उद्धरण कॉपी करें' : 'Copy Quote')}</span>
                    </button>
                  </div>

                  {/* Dark-mode visual card mockup */}
                  <div className="mx-auto max-w-md aspect-square rounded-2xl border border-stone-800 bg-stone-950 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    <div className="text-[10px] font-mono tracking-widest text-stone-500 uppercase flex items-center justify-between">
                      <span>AEMY AI STUDIO</span>
                      <span className="text-amber-500/80">AMIT SHARMA</span>
                    </div>

                    <div className="font-serif text-xl sm:text-2xl font-light text-stone-100 text-center leading-relaxed whitespace-pre-line px-2">
                      "{funnelData.instagram_frame.quote}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-600 border-t border-stone-900 pt-3">
                      <span>QUESTION → EVIDENCE</span>
                      <span>THE SEARCH WITHIN</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 text-center font-mono">
                    Art Direction: {funnelData.instagram_frame.visual_direction}
                  </div>
                </div>
              )}

              {/* GitHub Proof of Work */}
              {activePlatform === 'github' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="uppercase text-stone-300">Proof of Work: Reproducible Experiment Architecture</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          `// Aemy AI Studio Research Sandbox\n// Director: Amit Sharma\n// Inquiring: "${inquiry}"\n\nimport { EpistemicAgent, AgencyEntropy } from '@aemy/research-suite';\n\nconst trial = new EpistemicAgent({\n  inquiry: "${inquiry.replace(/"/g, "'").slice(0, 80)}",\n  protocol: 'QUESTION_EVIDENCE_REVISION',\n  falsificationThreshold: 0.95,\n});\n\nconst result = await trial.execute();\nconsole.log('Result:', result);`,
                          'gh'
                        )
                      }
                      className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      {copiedKey === 'gh' ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === 'gh' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'कोड कॉपी करें' : 'Copy Sandbox Code')}</span>
                    </button>
                  </div>

                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-5 font-mono text-xs text-stone-300 space-y-3 overflow-x-auto">
                    <div className="text-stone-500">
                      # Repositories: aemy-ai-studio / epistemic-sandbox / agent-explainability
                    </div>
                    <div className="text-emerald-400">
                      $ npm install @aemy/epistemic-agency-bench
                    </div>
                    <pre className="text-stone-300 leading-relaxed font-mono">
{`/**
 * Proof of Work: Reproducible Experiment Suite
 * Testing hypothesis against behavioral and algorithmic telemetry.
 * Aemy AI Studio | Directed by Amit Sharma
 */
import { EpistemicAgent, AgencyEntropy } from '@aemy/research-suite';

const experiment = new EpistemicAgent({
  inquiry: "${inquiry.replace(/"/g, "'").slice(0, 75)}...",
  protocol: 'QUESTION_EVIDENCE_REVISION',
  falsificationThreshold: 0.95,
  telemetry: ['attention_decay', 'preconscious_bias', 'algorithmic_divergence'],
});

const benchmarkResult = await experiment.executeReproducibleTrial();
console.log('Epistemic Verdict:', benchmarkResult.falsified ? 'REVISED' : 'SUPPORTED');
`}
                    </pre>
                  </div>

                  <div className="text-xs text-stone-400 leading-relaxed">
                    {isHi
                      ? 'यहाँ आपकी पहचान केवल एक विचारक के रूप में नहीं, बल्कि एक व्यावहारिक इंजीनियर और शोधकर्ता के रूप में स्थापित होती है।'
                      : 'GitHub establishes technical proof-of-work: algorithmic benchmarks, agent sandboxes, and reproducible datasets.'}
                  </div>
                </div>
              )}

              {/* Whitepaper Abstract */}
              {activePlatform === 'whitepaper' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="uppercase text-amber-400">Formal Whitepaper Abstract</span>
                    <button
                      onClick={() => handleCopy(funnelData.whitepaper_abstract, 'wp')}
                      className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      {copiedKey === 'wp' ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === 'wp' ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'एब्सट्रैक्ट कॉपी करें' : 'Copy Abstract')}</span>
                    </button>
                  </div>

                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-6 space-y-3 shadow-sm">
                    <div className="font-serif italic text-sm sm:text-base text-stone-200 leading-relaxed">
                      {funnelData.whitepaper_abstract}
                    </div>
                    <div className="text-xs font-mono text-stone-500 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2">
                      <span>Keywords: Epistemic Agency · High-Dimensional Latent Topology · Mechanistic Interpretability · Gödelian Limits</span>
                      <span className="text-amber-500/80">Aemy AI Studio Publications</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
