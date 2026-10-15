import React, { useState } from 'react';
import { Language, AgencyAuditQuestion } from '../types';
import { AGENCY_AUDIT_QUESTIONS } from '../data/researchData';
import { ShieldCheck, AlertCircle, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface AgencyAuditToolProps {
  language: Language;
  onLaunchPlaybookWithResult: (theme: string) => void;
}

export const AgencyAuditTool: React.FC<AgencyAuditToolProps> = ({
  language,
  onLaunchPlaybookWithResult,
}) => {
  const isHi = language === 'hi';
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, score: number) => {
    const updated = { ...answers, [questionId]: score };
    setAnswers(updated);
    if (Object.keys(updated).length === AGENCY_AUDIT_QUESTIONS.length) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setIsCompleted(false);
  };

  // Calculate score (out of 100)
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = AGENCY_AUDIT_QUESTIONS.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100) || 0;

  const getTier = () => {
    if (percentage >= 85) {
      return {
        titleEn: 'Sovereign Contemplative Mind',
        titleHi: 'संप्रभु चिंतनशील चेतना',
        descEn: 'Exceptional cognitive agency. You treat algorithms as subordinated utilities while maintaining sovereign authorship over attention and belief.',
        descHi: 'असाधारण संज्ञानात्मक संप्रभुता। आप एल्गोरिदम को केवल अधीनस्थ उपकरण मानते हैं और अपने ध्यान तथा निर्णयों पर पूर्ण नियंत्रण रखते हैं।',
        color: 'text-emerald-400',
      };
    }
    if (percentage >= 60) {
      return {
        titleEn: 'Bounded Operational Agency',
        titleHi: 'सीमित कार्यात्मक स्वायत्तता',
        descEn: 'Moderate sovereignty. You frequently exercise independent judgment, but ambient algorithms steadily erode your peripheral discovery and attention.',
        descHi: 'मध्यम स्वायत्तता। आप स्वतंत्र निर्णय लेते हैं, लेकिन सिफारिश करने वाले एल्गोरिदम धीरे-धीरे आपके ध्यान और रुचियों को संकुचित कर रहे हैं।',
        color: 'text-amber-400',
      };
    }
    return {
      titleEn: 'Algorithmic Subjugation Risk',
      titleHi: 'एल्गोरिद्मिक निर्भरता का गंभीर जोखिम',
      descEn: 'Severe agency erosion. Your intellectual diet, attention transitions, and problem formulations are largely pre-architected by unseen optimizers.',
      descHi: 'गंभीर निर्भरता। आपके विचार, ध्यान और निर्णय लगभग पूरी तरह से बाहरी एल्गोरिदम और सुविधा तंत्र द्वारा संचालित हो रहे हैं।',
      color: 'text-rose-400',
    };
  };

  const tier = getTier();

  return (
    <section id="audit" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-2">
            {isHi ? 'मानव संप्रभुता डायग्नोस्टिक' : 'Human Agency Self-Audit'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            {isHi ? 'क्या तकनीक आपकी स्वतंत्रता बढ़ा रही है या घटा रही है?' : 'The Algorithmic Dependency Diagnostic'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'एजेंसी केवल सुविधा नहीं है। यह 5 मूलभूत आयामों (ध्यान, निर्णय, खोज, रचनात्मकता और स्मृति) में आपकी संज्ञानात्मक स्वतंत्रता का एक कठोर मापन है।'
              : 'Assess your sovereign autonomy across five cognitive vectors: attention capture, decision delegation, discovery entropy, creative authorship, and long-term synthesis.'}
          </p>
        </div>

        {/* Audit Questions Matrix */}
        <div className="mt-10 space-y-8">
          {AGENCY_AUDIT_QUESTIONS.map((q: AgencyAuditQuestion, idx: number) => {
            const selectedScore = answers[q.id];
            return (
              <div
                key={q.id}
                className="rounded-xl border border-stone-800 bg-stone-900/40 p-6 sm:p-8 backdrop-blur-sm space-y-4"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                  <span className="text-amber-400 font-semibold">VECTOR 0{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase">{q.dimension}</span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-100">
                  {isHi ? q.questionHi : q.questionEn}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt: AgencyAuditQuestion['options'][number], oIdx: number) => {
                    const isSelected = selectedScore === opt.score;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, opt.score)}
                        className={`text-left p-4 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-amber-500/80 bg-stone-900 shadow-md text-stone-100'
                            : 'border-stone-800/80 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-900/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-medium leading-relaxed">
                            {isHi ? opt.labelHi : opt.labelEn}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                        <div className="mt-2 text-[11px] font-mono text-stone-500 italic">
                          {isHi ? opt.implicationHi : opt.implicationEn}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Results Dossier */}
        {isCompleted && (
          <div className="mt-12 rounded-xl border border-amber-500/40 bg-stone-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-stone-800 pb-6 lg:pb-0 lg:pr-8">
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  {isHi ? 'मानव संप्रभुता स्कोर' : 'Agency Quotient Score'}
                </div>
                <div className="font-mono text-5xl sm:text-6xl font-light text-amber-400 tabular-nums">
                  {percentage}<span className="text-2xl text-stone-600">/100</span>
                </div>
                <div className={`font-serif text-xl font-medium ${tier.color}`}>
                  {isHi ? tier.titleHi : tier.titleEn}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                  {isHi ? 'संज्ञानात्मक मूल्यांकन' : 'Cognitive Synthesis & Assessment'}
                </div>
                <p className="text-sm sm:text-base text-stone-200 font-light leading-relaxed">
                  {isHi ? tier.descHi : tier.descEn}
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      onLaunchPlaybookWithResult(
                        isHi
                          ? 'क्या एल्गोरिद्मिक सुविधा मानव इच्छाशक्ति और संप्रभुता को नष्ट कर रही है?'
                          : 'Is technological convenience structurally eroding human sovereign volition?'
                      )
                    }
                    className="flex items-center gap-2 rounded bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
                  >
                    <span>{isHi ? 'इस परिणाम पर 8-चरणीय शोध करें' : 'Investigate in Research Playbook'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded border border-stone-700 px-3 py-2 text-xs text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>{isHi ? 'पुनः परीक्षण करें' : 'Reset Audit'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
