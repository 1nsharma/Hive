import React, { useState } from 'react';
import { Language, BookChapter } from '../types';
import { BOOK_CHAPTERS } from '../data/researchData';
import { BookOpen, Bookmark, ChevronRight, Share2, Copy, Check, Eye } from 'lucide-react';

interface BookPreviewProps {
  language: Language;
}

export const BookPreview: React.FC<BookPreviewProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [readerTheme, setReaderTheme] = useState<'obsidian' | 'parchment'>('obsidian');
  const [copied, setCopied] = useState<boolean>(false);

  const activeChapter =
    BOOK_CHAPTERS.find((ch) => ch.number === selectedChapterNum) || BOOK_CHAPTERS[0];

  const handleCopyCitation = () => {
    const citation = `AMEY. (2026). The Search Within: Humanity, Intelligence and the Machine We Built to Understand Ourselves. Chapter ${activeChapter.number}: "${isHi ? activeChapter.titleHi : activeChapter.titleEn}".`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isParchment = readerTheme === 'parchment';

  return (
    <section id="book" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">
            {isHi ? 'प्रमुख मोनोग्राफ' : 'Flagship Monograph'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            THE SEARCH WITHIN
          </h2>
          <div className="font-serif italic text-stone-400 text-lg sm:text-xl mt-1">
            {isHi
              ? 'मानवता, बुद्धिमत्ता और वह मशीन जिसे हमने खुद को समझने के लिए बनाया'
              : 'Humanity, Intelligence and the Machine We Built to Understand Ourselves'}
          </div>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? '12 अध्यायों का एक समग्र अन्वेषण। यह पुस्तक किसी अंतिम उत्तर का दावा नहीं करती; यह हमें उस दर्पण के सामने खड़ा करती है जिसे हमने सिलिकॉन में गढ़ा है।'
              : 'A 12-chapter comprehensive synthesis. This volume does not assert dogma; it positions humanity before the mirror we cast in silicon.'}
          </p>
        </div>

        {/* 2-Column Monograph Inspection Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Table of Contents Rail */}
          <div className="lg:col-span-4 space-y-1.5 border-r border-stone-800/80 pr-0 lg:pr-6 max-h-[750px] overflow-y-auto">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3 px-2 sticky top-0 bg-stone-950/90 py-1 backdrop-blur-sm z-10 flex items-center justify-between">
              <span>{isHi ? 'अनुक्रमणिका' : 'Table of Contents'}</span>
              <span>12 Chapters</span>
            </div>

            {BOOK_CHAPTERS.map((ch) => {
              const isSelected = ch.number === selectedChapterNum;
              return (
                <button
                  key={ch.number}
                  onClick={() => setSelectedChapterNum(ch.number)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-stone-900 border border-amber-500/50 text-stone-100'
                      : 'border border-transparent hover:bg-stone-900/40 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-amber-500">
                      CHAPTER {ch.number < 10 ? `0${ch.number}` : ch.number}
                    </div>
                    <div className="font-serif text-sm font-medium leading-snug line-clamp-2">
                      {isHi ? ch.titleHi : ch.titleEn}
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-stone-700'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Editorial Chapter Canvas */}
          <div
            className={`lg:col-span-8 rounded-xl border p-6 sm:p-10 transition-colors duration-200 ${
              isParchment
                ? 'bg-[#f7f4ee] text-stone-900 border-[#e5dec9] shadow-xl'
                : 'bg-stone-900/40 text-stone-100 border-stone-800 backdrop-blur-sm'
            }`}
          >
            {/* Top Toolbar: Chapter Metadata & Reading Canvas Toggle */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b text-xs font-mono ${
                isParchment ? 'border-[#e0d7c0] text-stone-600' : 'border-stone-800 text-stone-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-semibold tracking-wider">
                  CHAPTER {activeChapter.number < 10 ? `0${activeChapter.number}` : activeChapter.number}
                </span>
                <span aria-hidden="true">·</span>
                <span>VOL. I MONOGRAPH</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Theme Switcher (Obsidian / Archival Parchment) */}
                <div className="flex items-center gap-1 rounded border border-stone-700/60 p-0.5 text-[10px]">
                  <button
                    onClick={() => setReaderTheme('obsidian')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      !isParchment ? 'bg-stone-800 text-amber-400 font-semibold' : 'text-stone-500'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setReaderTheme('parchment')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      isParchment ? 'bg-stone-200 text-stone-900 font-semibold' : 'text-stone-400'
                    }`}
                  >
                    Paper
                  </button>
                </div>

                <button
                  onClick={handleCopyCitation}
                  className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                  title="Copy Chapter Reference"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Cite Chapter'}</span>
                </button>
              </div>
            </div>

            {/* Chapter Heading */}
            <h3
              className={`mt-6 font-serif text-3xl sm:text-4xl font-light leading-tight ${
                isParchment ? 'text-stone-900' : 'text-stone-100'
              }`}
            >
              {isHi ? activeChapter.titleHi : activeChapter.titleEn}
            </h3>

            {/* Key Penetrating Question */}
            <div
              className={`my-6 border-l-2 p-5 rounded-r ${
                isParchment
                  ? 'border-amber-700 bg-[#efe9dc]'
                  : 'border-amber-500 bg-stone-950/80'
              }`}
            >
              <div
                className={`text-xs font-mono uppercase tracking-widest mb-1 ${
                  isParchment ? 'text-amber-800' : 'text-amber-400'
                }`}
              >
                {isHi ? 'अध्याय का मूल प्रश्न' : 'Chapter Core Question'}
              </div>
              <p
                className={`font-serif italic text-lg sm:text-xl leading-relaxed ${
                  isParchment ? 'text-stone-800' : 'text-stone-200'
                }`}
              >
                "{isHi ? activeChapter.keyQuestionHi : activeChapter.keyQuestionEn}"
              </p>
            </div>

            {/* Core Thesis */}
            <div className="space-y-2">
              <div
                className={`text-xs font-mono uppercase tracking-widest ${
                  isParchment ? 'text-stone-600' : 'text-stone-400'
                }`}
              >
                {isHi ? 'केंद्रीय तर्क / परिकल्पना' : 'Governing Thesis'}
              </div>
              <p
                className={`text-base sm:text-lg font-serif leading-relaxed ${
                  isParchment ? 'text-stone-900' : 'text-stone-200'
                }`}
              >
                {isHi ? activeChapter.thesisHi : activeChapter.thesisEn}
              </p>
            </div>

            {/* Executive Abstract */}
            <div className="mt-6 space-y-2">
              <div
                className={`text-xs font-mono uppercase tracking-widest ${
                  isParchment ? 'text-stone-600' : 'text-stone-400'
                }`}
              >
                {isHi ? 'विस्तृत सारांश (Abstract)' : 'Chapter Abstract'}
              </div>
              <p
                className={`text-sm sm:text-base font-light leading-relaxed ${
                  isParchment ? 'text-stone-700' : 'text-stone-300'
                }`}
              >
                {isHi ? activeChapter.abstractHi : activeChapter.abstractEn}
              </p>
            </div>

            {/* Margin Notes & Epistemic Cross-References (Pattern D) */}
            <div
              className={`mt-8 rounded-lg border p-4 space-y-2 text-xs font-mono ${
                isParchment
                  ? 'border-[#e0d7c0] bg-[#f0ebd9] text-stone-700'
                  : 'border-stone-800 bg-stone-950/70 text-stone-400'
              }`}
            >
              <div className="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                {isHi ? 'शोध नोट्स व संदर्भ' : 'Authorial Notes & Scientific Cross-References'}
              </div>
              <div className="leading-relaxed">
                {isHi ? activeChapter.draftNotesHi : activeChapter.draftNotesEn}
              </div>
            </div>

            {/* Next Chapter Quick Nav */}
            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between text-xs font-mono ${
                isParchment ? 'border-[#e0d7c0] text-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              <button
                onClick={() => setSelectedChapterNum((prev) => Math.max(1, prev - 1))}
                disabled={activeChapter.number === 1}
                className="hover:text-amber-500 disabled:opacity-30 transition-colors"
              >
                ← PREV CHAPTER
              </button>
              <span>{activeChapter.number} / 12</span>
              <button
                onClick={() => setSelectedChapterNum((prev) => Math.min(12, prev + 1))}
                disabled={activeChapter.number === 12}
                className="hover:text-amber-500 disabled:opacity-30 transition-colors"
              >
                NEXT CHAPTER →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
