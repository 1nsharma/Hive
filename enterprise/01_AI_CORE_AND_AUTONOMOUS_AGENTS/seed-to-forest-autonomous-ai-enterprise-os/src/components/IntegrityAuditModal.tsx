import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, X, ExternalLink, Filter, Lock, Cpu, Eye, FileText } from 'lucide-react';
import { INTEGRITY_AUDIT_QUESTIONS, PROPOSED_TREASURY_ALLOCATIONS, FOUNDER_COMPENSATION_MODEL } from '../data/integrityAuditData';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';
import { IntegrityStatus } from '../types';

interface IntegrityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const IntegrityAuditModal: React.FC<IntegrityAuditModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(1);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getStatusBadge = (status: IntegrityStatus) => {
    switch (status) {
      case 'IMPLEMENTED':
      case 'PRODUCTION_READY':
        return <span className="bg-[#141414] text-[#E4E3E0] font-mono px-1.5 py-0.5 text-[10px] font-bold border border-[#141414]">IMPLEMENTED</span>;
      case 'TESTED':
      case 'HUMAN_VERIFIED':
        return <span className="bg-white text-[#141414] font-mono px-1.5 py-0.5 text-[10px] font-bold border border-[#141414]">VERIFIED</span>;
      case 'SIMULATED':
        return <span className="bg-[#ECEBE8] text-[#8b3a0f] font-mono px-1.5 py-0.5 text-[10px] font-bold border border-[#8b3a0f]">SIMULATION</span>;
      case 'PROPOSED':
        return <span className="bg-[#ECEBE8] text-[#575653] font-mono px-1.5 py-0.5 text-[10px] font-bold border border-[#575653]">PROPOSED</span>;
      case 'CONCEPT':
      default:
        return <span className="bg-white text-[#575653] font-mono px-1.5 py-0.5 text-[10px] font-bold border border-[#575653]">CONCEPT</span>;
    }
  };

  const filteredQuestions = selectedCategory === 'ALL'
    ? INTEGRITY_AUDIT_QUESTIONS
    : INTEGRITY_AUDIT_QUESTIONS.filter(q => q.category === selectedCategory);

  const activeQuestion = INTEGRITY_AUDIT_QUESTIONS.find(q => q.id === selectedQuestionId) || INTEGRITY_AUDIT_QUESTIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#ECEBE8] border border-[#141414] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#141414] text-[#E4E3E0] px-5 py-4 flex items-center justify-between border-b border-[#141414]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white text-[#141414] flex items-center justify-center font-serif font-bold text-lg">
              §
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif font-bold text-base sm:text-lg">
                  {language === 'hi' ? 'सत्यनिष्ठा व वास्तविकता ऑडिट (10-Point Reality Check)' : 'Reality & Intellectual Integrity Audit'}
                </h2>
                <span className="bg-white text-[#141414] text-[10px] font-mono font-bold px-1.5 py-0.2">
                  SECTION 22-26 COMPLIANT
                </span>
              </div>
              <p className="text-xs text-[#a8a6a1] font-mono mt-0.5">
                Explicit transparency by design: What is Real vs. Simulated vs. Proposed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#a8a6a1] hover:text-white p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Principle Callout */}
        <div className="bg-white px-5 py-3 border-b border-[#141414] text-xs font-mono text-[#575653] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#141414]" />
            <span>
              <strong>Core Principle:</strong> Do not optimize this application to LOOK more autonomous than it is.
            </span>
          </div>
          <div className="text-[11px] text-[#141414] font-bold">
            honest → observable → testable → bounded
          </div>
        </div>

        {/* Content Body (Split Pane) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Questions List */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-[#141414] overflow-y-auto bg-[#F4F3F0] p-3 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#141414]/20">
              <span className="text-[10px] font-mono font-bold text-[#575653] uppercase">Audit Criteria (1-10)</span>
              <div className="flex space-x-1">
                {['ALL', 'REALITY', 'BOUNDS', 'GOVERNANCE'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                      selectedCategory === cat
                        ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]'
                        : 'bg-white text-[#575653] border-[#141414]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {filteredQuestions.map((q) => {
                const isSelected = q.id === selectedQuestionId;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`cursor-pointer p-2.5 border transition flex flex-col space-y-1 text-xs ${
                      isSelected
                        ? 'bg-white border-[#141414] shadow-xs'
                        : 'bg-[#ECEBE8] border-[#141414]/30 hover:border-[#141414] hover:bg-white/80 text-[#575653]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#141414]">ITEM #{q.id}</span>
                      {getStatusBadge(q.status)}
                    </div>
                    <p className="font-serif font-bold text-xs text-[#141414] line-clamp-2">
                      {language === 'hi' ? q.questionHi : q.question}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Answer & Reality Boundary */}
          <div className="w-full md:w-7/12 overflow-y-auto p-5 space-y-4 bg-white">
            <div className="pb-3 border-b border-[#141414] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#575653] uppercase">
                  Audited Item #{activeQuestion.id} • {activeQuestion.category}
                </span>
                <h3 className="text-base font-serif font-bold text-[#141414] mt-0.5">
                  {language === 'hi' ? activeQuestion.questionHi : activeQuestion.question}
                </h3>
              </div>
              {getStatusBadge(activeQuestion.status)}
            </div>

            {/* Answer Explanation */}
            <div className="bg-[#F4F3F0] p-4 border border-[#141414] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#141414] uppercase">Detailed System Audit Response:</span>
              <p className="text-xs text-[#141414] leading-relaxed font-sans font-medium">
                {language === 'hi' ? activeQuestion.answerHi : activeQuestion.answer}
              </p>
            </div>

            {/* Verification Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#ECEBE8] p-3 border border-[#141414] space-y-1">
                <span className="text-[10px] font-bold text-[#575653] uppercase">Current Day 1 State</span>
                <p className="text-[#141414] font-medium">{activeQuestion.currentEnforcement}</p>
              </div>

              <div className="bg-[#ECEBE8] p-3 border border-[#141414] space-y-1">
                <span className="text-[10px] font-bold text-[#575653] uppercase">Target Protocol Future</span>
                <p className="text-[#141414] font-medium">{activeQuestion.futureTarget}</p>
              </div>
            </div>

            {/* Founder Vesting & Protection Specs Callout (If governance related) */}
            {activeQuestion.category === 'GOVERNANCE' && (
              <div className="border border-[#141414] p-3.5 space-y-2 bg-[#ECEBE8]">
                <div className="flex items-center space-x-2 text-[#141414] font-mono text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-[#141414]" />
                  <span>Founder Compensation & Capital Transparency</span>
                </div>
                <div className="text-[11px] font-mono text-[#575653] space-y-1">
                  <p>• <strong>Day 1 Founder Capital Lock:</strong> {FOUNDER_COMPENSATION_MODEL.allocationPercent}% (₹80,000) locked in corporate bank account.</p>
                  <p>• <strong>Vesting Horizon:</strong> {FOUNDER_COMPENSATION_MODEL.vestingDurationMonths}-month linear with {FOUNDER_COMPENSATION_MODEL.vestingCliffMonths}-month cliff for future DAO allocations.</p>
                  <p>• <strong>No Hidden Fees:</strong> {FOUNDER_COMPENSATION_MODEL.hiddenFeeClause}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#ECEBE8] px-5 py-3 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-[#575653] text-[11px]">
            Audited Against Rules 1–26 • Zero Overclaiming Guarantee
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#141414] hover:bg-black text-[#E4E3E0] px-4 py-1.5 font-bold border border-[#141414] transition"
          >
            {t.actions.close}
          </button>
        </div>
      </div>
    </div>
  );
};
