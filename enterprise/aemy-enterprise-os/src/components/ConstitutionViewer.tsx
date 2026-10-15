import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Code2, 
  Lock, 
  Terminal, 
  Scale, 
  AlertTriangle, 
  FileText,
  Sparkles,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MASTER_AXIOM, WHAT_WE_REFUSE, CONSTITUTIONAL_ARTICLES, GOVERNANCE_STAGES } from '../data/soulConstitution';

interface ConstitutionViewerProps {
  activeLanguage: 'en' | 'hi';
}

export const ConstitutionViewer: React.FC<ConstitutionViewerProps> = ({ activeLanguage }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>('ART_01');
  const [selectedProhibitionId, setSelectedProhibitionId] = useState<string>('REFUSE_01');
  const [activeTab, setActiveTab] = useState<'articles' | 'prohibitions' | 'governance-protocol' | 'axioms'>('articles');
  const [ratified, setRatified] = useState<boolean>(false);
  const [ratificationTime, setRatificationTime] = useState<string | null>(null);

  const selectedArticle = CONSTITUTIONAL_ARTICLES.find(a => a.id === selectedArticleId) || CONSTITUTIONAL_ARTICLES[0];
  const selectedProhibition = WHAT_WE_REFUSE.find(p => p.id === selectedProhibitionId) || WHAT_WE_REFUSE[0];

  const handleRatify = () => {
    setRatified(true);
    setRatificationTime(new Date().toLocaleTimeString());
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-950/70 via-stone-900 to-stone-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              VOLUME 01 — CANONICAL CANON
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs">
              STATUS: IMMUTABLE SOUL ANCHOR v1.0
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            {activeLanguage === 'hi' ? 'आत्मा संविधान — SOUL CONSTITUTION v1.0' : 'SOUL CONSTITUTION v1.0 & GOVERNANCE PROTOCOL'}
          </h1>

          <p className="text-base md:text-lg text-stone-300 font-light leading-relaxed">
            {activeLanguage === 'hi'
              ? 'यह केवल एक नैतिक घोषणापत्र नहीं है, बल्कि कानूनी और तकनीकी रूप से बाध्यकारी आर्किटेक्चरल कॉन्ट्रैक्ट है।'
              : 'The immutable foundation of Apni Duniya. Translating sovereign human rights, epistemic honesty, and economic fairness into hardcoded architectural invariants.'}
          </p>

          {/* Master Axiom Callout */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-500/40 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>THE MASTER AXIOM</span>
            </div>
            <p className="text-stone-200 font-serif italic text-base md:text-lg leading-snug">
              {activeLanguage === 'hi' ? MASTER_AXIOM.visionStatement : MASTER_AXIOM.visionEn}
            </p>
            <div className="text-xs text-amber-300/80 font-mono pt-1">
              External Promise: {MASTER_AXIOM.externalPromise}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        <button
          id="tab-articles"
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Constitutional Articles (I – V)</span>
        </button>

        <button
          id="tab-prohibitions"
          onClick={() => setActiveTab('prohibitions')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'prohibitions'
              ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>What We Refuse (9 Prohibitions)</span>
        </button>

        <button
          id="tab-governance-protocol"
          onClick={() => setActiveTab('governance-protocol')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'governance-protocol'
              ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4 text-purple-300" />
          <span>Governance & Decentralization Protocol</span>
        </button>

        <button
          id="tab-axioms"
          onClick={() => setActiveTab('axioms')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'axioms'
              ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
        >
          <BookMarked className="w-4 h-4 text-emerald-300" />
          <span>12-Step Chain of Value</span>
        </button>
      </div>

      {/* TAB 1: Constitutional Articles */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Article Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 px-1">
              Articles of Governance & Rights
            </h3>
            <div className="space-y-2">
              {CONSTITUTIONAL_ARTICLES.map((article) => {
                const isSelected = selectedArticleId === article.id;
                return (
                  <button
                    key={article.id}
                    id={`article-btn-${article.id}`}
                    onClick={() => setSelectedArticleId(article.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
                      <span>{article.number}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                        {article.clauses.length} Invariants
                      </span>
                    </div>
                    <div className="font-semibold text-sm leading-tight text-stone-100">
                      {article.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ratification Badge */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400">Citizen Ratification</span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  ratified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-stone-800 text-stone-400'
                }`}>
                  {ratified ? 'RATIFIED' : 'PENDING'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Cryptographically sign this version of the Soul Constitution to anchor client-side verification.
              </p>
              <button
                id="ratify-constitution-btn"
                onClick={handleRatify}
                disabled={ratified}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  ratified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                }`}
              >
                {ratified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ratified at {ratificationTime}</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    <span>Sign & Ratify Constitution v1.0</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Article Detail View */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-6">
              <div className="border-b border-stone-800 pb-4">
                <div className="text-xs font-mono text-amber-400 font-semibold mb-1">
                  {selectedArticle.number}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Clauses */}
              <div className="space-y-6">
                {selectedArticle.clauses.map((clause, idx) => (
                  <div 
                    key={clause.clauseNumber}
                    className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/90 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        Section {clause.clauseNumber}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {clause.architecturalInvariant}
                      </span>
                    </div>

                    <p className="text-stone-200 text-sm md:text-base leading-relaxed font-serif">
                      "{clause.text}"
                    </p>

                    {/* Technical & Architectural Translation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                        <div className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5 uppercase">
                          <Code2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Code Verification Hook</span>
                        </div>
                        <code className="text-xs font-mono text-sky-300 block bg-stone-950 p-2 rounded overflow-x-auto">
                          {clause.codeVerificationHook}
                        </code>
                      </div>

                      <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                        <div className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5 uppercase">
                          <Terminal className="w-3.5 h-3.5 text-amber-400" />
                          <span>Enforcement Mechanism</span>
                        </div>
                        <p className="text-xs text-stone-300 leading-normal">
                          {clause.enforcementMechanism}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: What We Refuse (9 Prohibitions) */}
      {activeTab === 'prohibitions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-stone-200 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300">The 9 Red Lines of Apni Duniya: </span>
              These are inviolable negative constraints. What we refuse to build defines the sovereignty of our ecosystem far more than any promotional feature.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar list */}
            <div className="lg:col-span-4 space-y-2">
              {WHAT_WE_REFUSE.map((item, index) => {
                const isSelected = selectedProhibitionId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`prohibition-btn-${item.id}`}
                    onClick={() => setSelectedProhibitionId(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-950/70 border-rose-500 text-white shadow-md'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
                      <span>PROHIBITION 0{index + 1}</span>
                    </div>
                    <div className="font-semibold text-sm text-stone-100">
                      {item.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Prohibition Detail View */}
            <div className="lg:col-span-8">
              <div className="p-6 rounded-2xl bg-stone-900 border border-rose-900/40 space-y-6">
                <div>
                  <span className="text-xs font-mono text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                    INVIOLABLE NEGATIVE CONSTRAINT
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">
                    {selectedProhibition.title}
                  </h2>
                  <p className="text-rose-200/90 text-sm mt-1">
                    {selectedProhibition.banReason}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                    <div className="text-xs font-mono text-stone-400 uppercase">
                      Predatory Industry Practice (Banned)
                    </div>
                    <p className="text-stone-300 text-sm">
                      {selectedProhibition.industryPractice}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                    <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                      Apni Duniya Architectural Solution
                    </div>
                    <p className="text-emerald-200 text-sm">
                      {selectedProhibition.apniDuniyaAlternative}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-1.5">
                    <div className="text-xs font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Hardcoded Architectural Guardrail</span>
                    </div>
                    <code className="text-xs font-mono text-stone-200 block bg-stone-900 p-2 rounded">
                      {selectedProhibition.architecturalGuardrail}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Governance & Decentralization Protocol */}
      {activeTab === 'governance-protocol' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-stone-200 space-y-2">
            <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>3-Phase Progressive Decentralization Protocol</span>
            </h3>
            <p className="text-sm text-stone-300">
              Apni Duniya does not pretend to be a fully decentralized protocol on Day 1. We operate on a realistic, milestone-gated evolution path: from lean Guardian Stewardship to sovereign polycentric federation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GOVERNANCE_STAGES.map((stage, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      PHASE 0{idx + 1}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-white">
                    {stage.phase}
                  </h4>

                  <p className="text-xs text-stone-400 italic">
                    {stage.subtitle}
                  </p>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-stone-800">
                    <div className="text-[11px] font-mono text-stone-400 uppercase">
                      Safeguards Active:
                    </div>
                    {stage.safeguards.map((item, sIdx) => (
                      <div key={sIdx} className="text-xs text-stone-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800/80 text-[11px] font-mono text-stone-400 space-y-1 bg-stone-950/60 p-3 rounded-lg">
                  <div>Council: <span className="text-stone-200">{stage.councilStructure}</span></div>
                  <div>Voting: <span className="text-purple-300">{stage.votingMechanism}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Epistemic Integrity Invariant */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
              <Scale className="w-4 h-4" />
              <span>The Invariant of Epistemic Integrity</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Constraint: Popularity ≠ Truth (Voting Cannot Override Empirical Reality)
            </h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Standard democratic DAOs fail because 51% of users can vote that the Earth is flat or that a false medical claim is true. In Apni Duniya, <strong>Democratic Voting</strong> governs budget allocations and UI preferences, while <strong>Empirical Fact Disputation</strong> is strictly isolated and evaluated by domain peer juries with verified primary citations.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: 12-Step Chain of Value */}
      {activeTab === 'axioms' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-sm">
            <span className="font-semibold text-amber-400">The Internal Long-Term Thesis: </span>
            How Apni Duniya compounds value from the first moment of conscious attention to an enduring digital civilization.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MASTER_AXIOM.chainOfValue.map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="font-mono text-sm font-bold text-amber-400">
                  {item.step}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
