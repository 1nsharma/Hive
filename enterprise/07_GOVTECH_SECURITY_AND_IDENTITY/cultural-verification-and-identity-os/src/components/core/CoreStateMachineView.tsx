import React from 'react';

export const CoreStateMachineView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Claim State Machine</h1>
        <p className="text-sm text-stone-600">
          Governing transitions for <code className="font-mono text-xs">verification_status</code>.
          Zero ungrounded claims may jump directly to verified status.
        </p>
      </div>

      {/* Visual Flow */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-stone-900 mb-6 text-center text-sm uppercase tracking-wider font-mono">
          Visual State Progression Flow
        </h3>

        <div className="flex flex-col items-center space-y-4">
          {/* Level 1: Initial */}
          <div className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-xs">
            UNVERIFIED (Baseline Hypothesis)
          </div>

          <div className="text-xs font-mono text-stone-500 flex flex-col items-center">
            <span>&darr;</span>
            <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              &ge;1 Evidence OR &ge;1 Testimony (Active Consent)
            </span>
            <span>&darr;</span>
          </div>

          {/* Level 2: Review */}
          <div className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-100 text-blue-900 border-2 border-blue-400 shadow-xs">
            UNDER_REVIEW (Active Field Evaluation)
          </div>

          <div className="text-xs font-mono text-stone-500 flex flex-col items-center">
            <span>&darr;</span>
            <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Multi-Source Peer &amp; Community Evaluation
            </span>
            <span>&darr;</span>
          </div>

          {/* Level 3: Outcomes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full pt-2">
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-center space-y-1.5">
              <div className="text-[11px] font-mono text-emerald-800">
                &ge;2 testimonies + review
              </div>
              <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-400">
                COMMUNITY_CONFIRMED
              </div>
              <p className="text-[11px] text-emerald-900">
                Living cultural practice validated by practitioner lineages.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-3 text-center space-y-1.5">
              <div className="text-[11px] font-mono text-indigo-800">
                Doc Corroboration
              </div>
              <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-400">
                EVIDENCE_SUPPORTED
              </div>
              <p className="text-[11px] text-indigo-900">
                Primary archives &amp; gazetteers corroborate modern claim.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center space-y-1.5">
              <div className="text-[11px] font-mono text-yellow-800">
                Partial / Mixed
              </div>
              <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-400">
                PARTIALLY_SUPPORTED
              </div>
              <p className="text-[11px] text-yellow-900">
                Certain aspects proved, others lack sufficient documentation.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-300 rounded-lg p-3 text-center space-y-1.5">
              <div className="text-[11px] font-mono text-rose-800">
                Conflicting Claims
              </div>
              <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-900 border border-rose-400">
                DISPUTED
              </div>
              <p className="text-[11px] text-rose-900">
                Opposing accounts without decisive primary resolution.
              </p>
            </div>

            <div className="bg-stone-100 border border-stone-300 rounded-lg p-3 text-center space-y-1.5">
              <div className="text-[11px] font-mono text-stone-700">
                Consent Revoked
              </div>
              <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-stone-200 text-stone-800 border border-stone-400">
                RESTRICTED
              </div>
              <p className="text-[11px] text-stone-700">
                Contributor revoked consent or marked sacred/private.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Rules Matrix */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-stone-900 text-sm">Formal Transition Rule Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-stone-800">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase font-mono">
                <th className="text-left p-2.5">From State</th>
                <th className="text-left p-2.5">To State</th>
                <th className="text-left p-2.5">Mandatory Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="p-2.5 font-mono font-bold text-amber-800">UNVERIFIED</td>
                <td className="p-2.5 font-mono font-bold text-blue-800">UNDER_REVIEW</td>
                <td className="p-2.5">
                  &ge; 1 verifiable primary <code className="font-mono text-stone-900 font-bold">EVIDENCE</code> item OR &ge; 1 <code className="font-mono text-stone-900 font-bold">TESTIMONY</code> with valid active consent.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-blue-800">UNDER_REVIEW</td>
                <td className="p-2.5 font-mono font-bold text-emerald-800">COMMUNITY_CONFIRMED</td>
                <td className="p-2.5">
                  &ge; 2 <code className="font-mono text-stone-900 font-bold">TESTIMONIES</code> from distinct elder contributors + &ge; 1 <code className="font-mono text-stone-900 font-bold">REVIEW</code> with decision=<span className="font-bold">CONFIRMS</span>.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-blue-800">UNDER_REVIEW</td>
                <td className="p-2.5 font-mono font-bold text-indigo-800">EVIDENCE_SUPPORTED</td>
                <td className="p-2.5">
                  Documentary evidence (e.g., historical gazetteer, archive record) corroborates modern testimony.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-blue-800">UNDER_REVIEW</td>
                <td className="p-2.5 font-mono font-bold text-yellow-800">PARTIALLY_SUPPORTED</td>
                <td className="p-2.5">
                  Evidence is partial, ambiguous, or lacks complete multi-generational corroboration.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-blue-800">UNDER_REVIEW</td>
                <td className="p-2.5 font-mono font-bold text-rose-800">DISPUTED</td>
                <td className="p-2.5">
                  Conflicting testimonies or contradicting archival evidence without resolution.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-stone-600">ANY</td>
                <td className="p-2.5 font-mono font-bold text-stone-800">RESTRICTED</td>
                <td className="p-2.5">
                  <code className="font-mono text-stone-900 font-bold">CONSENT.withdrawal_status = WITHDRAWN</code> or access classified as sacred/private.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-rose-800">DISPUTED</td>
                <td className="p-2.5 font-mono font-bold text-blue-800">UNDER_REVIEW / ANY</td>
                <td className="p-2.5">
                  New conclusive <code className="font-mono text-stone-900 font-bold">REVIEW</code> or new primary <code className="font-mono text-stone-900 font-bold">EVIDENCE</code> submitted to resolve debate.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
