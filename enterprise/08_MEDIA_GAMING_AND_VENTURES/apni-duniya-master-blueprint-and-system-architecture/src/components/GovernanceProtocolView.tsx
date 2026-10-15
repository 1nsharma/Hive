import React, { useState } from 'react';
import { 
  Gavel, 
  Scale, 
  Users, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  Building,
  Vote,
  Sparkles
} from 'lucide-react';

interface GovernanceProtocolViewProps {
  activeLanguage: 'en' | 'hi';
}

export const GovernanceProtocolView: React.FC<GovernanceProtocolViewProps> = ({ activeLanguage }) => {
  const [activeDisputeStage, setActiveDisputeStage] = useState<number>(1);
  const [juryVoted, setJuryVoted] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-purple-950/40 to-stone-900 border border-purple-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5 text-purple-400" />
              SECTION XII &bull; CANONICAL GOVERNANCE
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? 'शासन और विकेंद्रीकरण प्रोटोकॉल (3-स्तरीय प्रणाली)' : 'Governance & Polycentric Decentralization Protocol'}
          </h2>
          <p className="text-stone-300 text-sm">
            A tripartite checks-and-balances model preventing corporate monopoly, authoritarian censorship, and algorithmic manipulation.
          </p>
        </div>
      </div>

      {/* 3 Governance Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: User Governance */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Vote className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-purple-300">TIER 01</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Citizen Governance
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Democratic, quadratic feedback voting on UI customization, feature prioritization, and public roadmap suggestions.
          </p>

          <div className="pt-2 border-t border-stone-800 text-xs font-mono text-stone-400 space-y-1">
            <div>Scope: <span className="text-purple-300">Product Roadmaps & Defaults</span></div>
            <div>Voting: <span className="text-stone-200">1-Person Quadratic Voice</span></div>
          </div>
        </div>

        {/* Tier 2: Community Guilds */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-emerald-300">TIER 02</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Community Domain Guilds
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Specialized peer juries (e.g. Economists, Physicians, Historians) reviewing lens accuracy and resolving factual disputes.
          </p>

          <div className="pt-2 border-t border-stone-800 text-xs font-mono text-stone-400 space-y-1">
            <div>Scope: <span className="text-emerald-300">Epistemic Truth & Citations</span></div>
            <div>Mechanism: <span className="text-stone-200">Peer Jury + Primary Evidence</span></div>
          </div>
        </div>

        {/* Tier 3: Institutional Governance */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-amber-300">TIER 03</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Guardian Stewardship Council
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Time-locked, multisig constitutional custodian enforcing the 9 Prohibitions and defending long-term public interest.
          </p>

          <div className="pt-2 border-t border-stone-800 text-xs font-mono text-stone-400 space-y-1">
            <div>Scope: <span className="text-amber-300">Soul Constitution Safeguard</span></div>
            <div>Enforcement: <span className="text-stone-200">Time-locked Multi-Sig veto</span></div>
          </div>
        </div>
      </div>

      {/* Disputation Jury Interactive Simulator */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-purple-500/30 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
              Live Mechanism Simulation
            </span>
            <h3 className="text-lg font-bold text-white">
              Epistemic Disputation Jury: "Truth ≠ Popularity" in Action
            </h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
            DISPUTE #8492
          </span>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
          <div className="font-semibold text-stone-200">
            Case: User challenges Lens verdict on historical inflation benchmark.
          </div>
          <p className="text-stone-400">
            Rather than putting whether inflation was 4% or 7% to an open social media popularity vote, the system summons 5 randomly selected credentialed peer guild members with primary RBI/MoSPI data sets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs space-y-1">
            <div className="font-mono text-stone-400">1. Evidence Submission</div>
            <div className="text-emerald-400 font-semibold">RBI Gazette #2024-Q3 attached</div>
          </div>

          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs space-y-1">
            <div className="font-mono text-stone-400">2. Blind Peer Review</div>
            <div className="text-sky-400 font-semibold">5 / 5 Jurors verified citation</div>
          </div>

          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs space-y-1">
            <div className="font-mono text-stone-400">3. Resolution Output</div>
            <div className="text-purple-300 font-semibold">Lens Updated with Dual Index</div>
          </div>
        </div>
      </div>
    </div>
  );
};
