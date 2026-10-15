import React, { useState } from 'react';
import { Language, ResearchSeriesItem } from '../types';
import { RESEARCH_SERIES } from '../data/researchData';
import {
  BookOpen,
  Compass,
  Share2,
  Check,
  ChevronRight,
  ShieldAlert,
  TestTube,
  HelpCircle,
  Copy,
} from 'lucide-react';

interface ResearchSeriesReaderProps {
  language: Language;
  onSendToFunnel: (inquiry: string) => void;
  onSendToPlaybook: (item: ResearchSeriesItem) => void;
}

export const ResearchSeriesReader: React.FC<ResearchSeriesReaderProps> = ({
  language,
  onSendToFunnel,
  onSendToPlaybook,
}) => {
  const isHi = language === 'hi';
  const [selectedId, setSelectedId] = useState<string>(RESEARCH_SERIES[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeItem = RESEARCH_SERIES.find((item) => item.id === selectedId) || RESEARCH_SERIES[0];

  const handleCopyCitation = () => {
    const citation = `AMEY — The Search Within (${activeItem.code}): "${isHi ? activeItem.titleHi : activeItem.titleEn}". Epistemic Research Series. https://amey.research/${activeItem.code}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="series" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">
            {isHi ? 'सार्वजनिक शोध शृंखला' : 'Flagship Epistemic Series'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            THE SEARCH WITHIN — 001 to 007
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'यह केवल दार्शनिक बातचीत नहीं, बल्कि 7 औपचारिक शोध-पत्र हैं। प्रत्येक पेपर साक्ष्य, जवाबी साक्ष्य और ज्ञात सीमाओं का निष्पक्ष विश्लेषण करता है।'
              : 'Structured public inquiries replacing vague speculation with empirical rigor, steelmanned counter-arguments, and delineated unknowns.'}
          </p>
        </div>

        {/* 2-Column Editorial Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Paper Navigation Rail */}
          <div className="lg:col-span-4 space-y-2 border-r border-stone-800/80 pr-0 lg:pr-6">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3 px-2">
              {isHi ? 'शोध शृंखला सूची' : 'Inquiry Catalog'}
            </div>
            {RESEARCH_SERIES.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-3.5 rounded-lg transition-all duration-150 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-stone-900 border border-amber-500/50 text-stone-100 shadow-sm'
                      : 'border border-transparent hover:bg-stone-900/50 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-stone-500'}>
                        {item.code}
                      </span>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="text-stone-500">{item.readingTime}</span>
                    </div>
                    <div className="font-serif text-sm font-medium leading-snug line-clamp-2">
                      {isHi ? item.titleHi : item.titleEn}
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-stone-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Full Asymmetric Editorial Reader */}
          <div className="lg:col-span-8 rounded-xl border border-stone-800 bg-stone-900/40 p-6 sm:p-10 backdrop-blur-sm">
            {/* Monograph Top Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-4 text-xs font-mono text-stone-500">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-semibold tracking-wider">PAPER {activeItem.code}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCitation}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors"
                  title="Copy Academic Citation"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'उद्धरण कॉपी करें' : 'Cite')}</span>
                </button>
              </div>
            </div>

            {/* Paper Title */}
            <h3 className="mt-6 font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-stone-100 leading-tight">
              {isHi ? activeItem.titleHi : activeItem.titleEn}
            </h3>

            {/* The Uncomfortable Question (Pull Quote) */}
            <div className="my-6 border-l-2 border-amber-500 bg-stone-950/70 p-5 rounded-r">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
                {isHi ? 'केंद्रीय प्रश्न' : 'The Core Question'}
              </div>
              <p className="font-serif italic text-lg sm:text-xl text-stone-200 leading-relaxed">
                "{isHi ? activeItem.questionHi : activeItem.questionEn}"
              </p>
            </div>

            {/* Working Thesis */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                {isHi ? 'शोध परिकल्पना / दावा' : 'Working Hypothesis / Claim'}
              </div>
              <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed">
                {isHi ? activeItem.thesisHi : activeItem.thesisEn}
              </p>
            </div>

            {/* Evidence vs Counter-Evidence (2-Col Comparison) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-800">
              {/* Supporting Evidence */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>{isHi ? 'समर्थक साक्ष्य (Evidence)' : 'Empirical Supporting Evidence'}</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-300 font-light leading-relaxed">
                  {(isHi ? activeItem.evidenceHi : activeItem.evidenceEn).map((ev, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-stone-600 shrink-0">[{i + 1}]</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Counter-Evidence */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>{isHi ? 'अनिवार्य जवाबी साक्ष्य (Counter-Evidence)' : 'Mandatory Steelmanned Counter-Evidence'}</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-300 font-light leading-relaxed">
                  {(isHi ? activeItem.counterEvidenceHi : activeItem.counterEvidenceEn).map((cev, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-stone-600 shrink-0">[{i + 1}]</span>
                      <span>{cev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Epistemic Unknowns */}
            <div className="mt-8 rounded-lg border border-stone-800 bg-stone-950/80 p-5 space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{isHi ? 'ज्ञान की सीमा (The Crucial Unknown)' : 'The Crucial Epistemic Unknowns'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-stone-400 italic">
                {(isHi ? activeItem.unknownsHi : activeItem.unknownsEn).map((unk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-stone-600">?</span>
                    <span>{unk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Proposed Measurable Experiment */}
            <div className="mt-6 rounded-lg border border-stone-800/80 bg-stone-900/40 p-4 space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                <TestTube className="h-3.5 w-3.5 text-amber-400" />
                <span>{isHi ? 'प्रस्तावित प्रयोग / बेंचमार्क' : 'Proposed Measurable Experiment'}</span>
              </div>
              <p className="text-xs text-stone-300 font-mono">
                {isHi ? activeItem.suggestedExperimentHi : activeItem.suggestedExperimentEn}
              </p>
            </div>

            {/* Reading Excerpt */}
            <div className="mt-8 pt-6 border-t border-stone-800 space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
                {isHi ? 'निबंध अंश (Essay Excerpt)' : 'Essay Excerpt'}
              </div>
              <blockquote className="font-serif text-sm sm:text-base text-stone-300 italic leading-relaxed border-l border-stone-700 pl-4">
                "{isHi ? activeItem.fullEssayExcerptHi : activeItem.fullEssayExcerptEn}"
              </blockquote>
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-stone-800">
              <button
                onClick={() => onSendToPlaybook(activeItem)}
                className="flex items-center gap-2 rounded bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-400"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>{isHi ? '8-चरणीय प्लेबुक में परखें' : 'Audit in 8-Step Playbook'}</span>
              </button>

              <button
                onClick={() => onSendToFunnel(isHi ? activeItem.questionHi : activeItem.questionEn)}
                className="flex items-center gap-2 rounded border border-stone-700 px-4 py-2 text-xs font-medium text-stone-300 transition-colors hover:border-stone-600 hover:text-white"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{isHi ? 'कंटेंट मशीन में भेजें' : 'Transform in Content Machine'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
