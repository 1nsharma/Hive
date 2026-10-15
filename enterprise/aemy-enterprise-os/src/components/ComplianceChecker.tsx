import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Flame, 
  ArrowRight,
  Code2,
  Sparkles
} from 'lucide-react';
import { WHAT_WE_REFUSE } from '../data/soulConstitution';

interface ComplianceCheckerProps {
  activeLanguage: 'en' | 'hi';
}

interface ProposalPreset {
  title: string;
  description: string;
  type: 'toxic' | 'aligned';
  targetProhibitionId?: string;
  violationDetail?: string;
  remedy?: string;
}

const PRESET_PROPOSALS: ProposalPreset[] = [
  {
    title: 'Ad-Supported Behavioral Profiling Feed',
    description: 'Track users across external tabs to build an advertising dossier and sell sponsored ads inside context overlays.',
    type: 'toxic',
    targetProhibitionId: 'REFUSE_01',
    violationDetail: 'Directly violates Prohibition 01 (Surveillance Capitalism) & Article II (Privacy Sovereignty). Banned under ARCH-SOUL-01.',
    remedy: 'Switch to Citizen Pro direct subscriptions or patron tips. Absolute zero ad tracking.'
  },
  {
    title: 'Infinite Autoplay Video Doomscroll Reel',
    description: 'Auto-play subsequent videos continuously without explicit user trigger to maximize time spent on screen.',
    type: 'toxic',
    targetProhibitionId: 'REFUSE_03',
    violationDetail: 'Directly violates Prohibition 03 (Artificial Addiction & Dopamine Traps). Banned under ARCH-SOUL-03.',
    remedy: 'Implement conscious stopping cues, explicit opt-in playback, and session clarity summaries.'
  },
  {
    title: 'Proprietary Cloud Data Lock-In (No Export)',
    description: 'Prevent users from exporting their annotated research graphs to competitors to maximize retention.',
    type: 'toxic',
    targetProhibitionId: 'REFUSE_04',
    violationDetail: 'Directly violates Prohibition 04 (Forced Platform Lock-In) & Article I Section 1.3 (Data Portability). Banned under ARCH-SOUL-04.',
    remedy: 'Provide 1-click standard SQLite/JSON/Markdown full data export.'
  },
  {
    title: 'Ungrounded AI Hallucination Answer Engine',
    description: 'Return generative AI responses without citing primary academic/official sources or confidence metrics.',
    type: 'toxic',
    targetProhibitionId: 'REFUSE_09',
    violationDetail: 'Directly violates Prohibition 09 (Ungrounded AI & Synthesized Fiction). Banned under ARCH-SOUL-09.',
    remedy: 'Require mandatory primary source grounding with verified trust scores.'
  },
  {
    title: 'Decentralized Domain Lens with 70% Creator Revenue Share',
    description: 'Community-authored climate science lens with verified IPCC citations and transparent 70/15/10/5 value distribution.',
    type: 'aligned',
    remedy: '100% Constitutionally Aligned. Passes all architectural invariants.'
  },
  {
    title: 'Client-Side Encrypted SQLite Vault with Zero-Knowledge Sync',
    description: 'Private user reading notes encrypted with device-local key; server has zero mathematical ability to decrypt.',
    type: 'aligned',
    remedy: '100% Constitutionally Aligned. Enforces Article II & 3-World Separation Law.'
  }
];

export const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({ activeLanguage }) => {
  const [selectedProposal, setSelectedProposal] = useState<ProposalPreset>(PRESET_PROPOSALS[0]);
  const [customText, setCustomText] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(true);

  const handleSelectPreset = (preset: ProposalPreset) => {
    setSelectedProposal(preset);
    setAuditComplete(true);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/30 to-stone-900 border border-amber-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              SOUL CONSTITUTION LINTER & AUDITOR
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? 'संविधान अनुपालन एवं आर्किटेक्चरल लिंटर' : 'Constitutional Compliance & Invariant Linter'}
          </h2>
          <p className="text-stone-300 text-sm">
            Verify any proposed feature, monetization model, or algorithm against the 9 Prohibitions and hardcoded architectural laws before writing a single line of code.
          </p>
        </div>
      </div>

      {/* Preset Proposals Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
          Select a Product Feature or Architectural Proposal to Audit:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_PROPOSALS.map((preset, idx) => {
            const isSelected = selectedProposal.title === preset.title;
            return (
              <button
                key={idx}
                id={`proposal-preset-${idx}`}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? preset.type === 'toxic'
                      ? 'bg-rose-950/50 border-rose-500 text-white shadow-md'
                      : 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    preset.type === 'toxic'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {preset.type === 'toxic' ? 'PREDATORY PROPOSAL' : 'ALIGNED PROPOSAL'}
                  </span>
                </div>
                <div className="font-bold text-sm text-stone-100">
                  {preset.title}
                </div>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audit Output Box */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
        <div className="flex items-start justify-between border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase">
              Audit Target: {selectedProposal.title}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Constitutional Verdict & Trace
            </h3>
          </div>

          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
            selectedProposal.type === 'toxic'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            {selectedProposal.type === 'toxic' ? (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>VIOLATION DETECTED &bull; BANNED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% CONSTITUTIONALLY COMPLIANT</span>
              </>
            )}
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
            <div className="text-xs font-mono text-stone-400 uppercase">Proposal Abstract</div>
            <p className="text-sm text-stone-200">{selectedProposal.description}</p>
          </div>

          {selectedProposal.type === 'toxic' && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <div className="text-xs font-mono text-rose-400 uppercase font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Constitutional Invariant Violation Trace</span>
              </div>
              <p className="text-xs text-rose-200 leading-relaxed font-mono">
                {selectedProposal.violationDetail}
              </p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/30 space-y-1.5">
            <div className="text-xs font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canonical Architectural Remedy / Guidance</span>
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed">
              {selectedProposal.remedy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
