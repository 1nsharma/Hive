import React, { useState } from 'react';
import {
  CoreState,
  CorePlurality,
  PluralityStatus
} from '../../types';
import { uuid, nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CorePluralityViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
}

export const CorePluralityView: React.FC<CorePluralityViewProps> = ({ state, updateState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [traditionVariant, setTraditionVariant] = useState('');
  const [communityScope, setCommunityScope] = useState('');
  const [pluralityStatus, setPluralityStatus] = useState<PluralityStatus>('CONFIRMED');
  const [conflictNotes, setConflictNotes] = useState('');

  const handleRecordVariant = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClaimId = claimId || (state.claims[0] ? state.claims[0].claim_id : '');
    if (!targetClaimId || !traditionVariant.trim()) return;

    const newPlurality: CorePlurality = {
      plurality_id: uuid(),
      claim_id: targetClaimId,
      tradition_variant: traditionVariant.trim(),
      community_scope: communityScope.trim() || 'Kanpur Region Household Lineage',
      supporting_testimonies: [],
      conflict_notes: conflictNotes.trim(),
      plurality_status: pluralityStatus,
      recorded_at: nowISO()
    };

    const updatedState: CoreState = {
      ...state,
      plurality: [newPlurality, ...state.plurality]
    };

    const logged = appendAuditLog(
      updatedState,
      'PLURALITY',
      newPlurality.plurality_id,
      'CREATED',
      null,
      { claim_id: newPlurality.claim_id, status: newPlurality.plurality_status },
      'Cultural variant logged (Principle 4: Non-monolithic heritage)'
    );

    updateState(logged);
    setIsModalOpen(false);
    setTraditionVariant('');
    setCommunityScope('');
    setConflictNotes('');
  };

  const handleDeletePlurality = (id: string) => {
    if (!window.confirm('Delete this plurality record?')) return;
    const target = state.plurality.find((p) => p.plurality_id === id);
    const updatedState: CoreState = {
      ...state,
      plurality: state.plurality.filter((p) => p.plurality_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'PLURALITY',
      id,
      'DELETED',
      target,
      null,
      'Deleted plurality variant via UI'
    );
    updateState(logged);
  };

  const getPluralityBadge = (status: PluralityStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-pink-100 text-pink-900 border-pink-300';
      case 'POSSIBLE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'NO_VARIANTS':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'UNKNOWN':
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Plurality Register</h1>
          <p className="text-sm text-stone-600">
            Legitimate cultural variants. Principle 4: No single &quot;truth&quot; where legitimate
            variants exist. Never force homogenization.
          </p>
        </div>
        <button
          onClick={() => {
            if (state.claims.length === 0) {
              alert('Please create at least one claim first.');
              return;
            }
            setClaimId(state.claims[0].claim_id);
            setIsModalOpen(true);
          }}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          + Record Variant
        </button>
      </div>

      <div className="space-y-3">
        {state.plurality.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No plurality records yet. Default status for all claims is UNKNOWN until field interviews
            reveal household and regional variations.
          </div>
        ) : (
          state.plurality.map((p) => {
            const linkedClaim = state.claims.find((c) => c.claim_id === p.claim_id);

            return (
              <div
                key={p.plurality_id}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:border-stone-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${getPluralityBadge(
                        p.plurality_status
                      )}`}
                    >
                      {p.plurality_status}
                    </span>
                    {linkedClaim && (
                      <span className="text-xs font-mono text-stone-500">
                        &rarr; {linkedClaim.claim_id}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePlurality(p.plurality_id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <div className="text-sm font-semibold text-stone-900 leading-snug">
                  {p.tradition_variant}
                </div>

                <div className="text-xs text-stone-600 mt-1.5 flex items-center gap-1.5">
                  <span>🏘️ Community Scope:</span>
                  <span className="font-medium text-stone-800">{p.community_scope}</span>
                </div>

                {p.conflict_notes && (
                  <div className="text-sm text-stone-700 mt-2 bg-pink-50/50 p-2.5 rounded border border-pink-200/60 italic">
                    <strong className="text-pink-900 not-italic">Variant Analysis: </strong>
                    {p.conflict_notes}
                  </div>
                )}

                <div className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span>Supporting Testimonies: {p.supporting_testimonies.length}</span>
                  <span>Recorded: {new Date(p.recorded_at).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Record Cultural Variant</h2>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-950">
              <strong>Principle 4 Enforced:</strong> Authentic heritage is inherently plural. Do
              not attempt to declare one family&apos;s recipe or story as the sole &quot;canonical&quot; truth.
              Document each variation with its specific lineage context.
            </div>

            <form onSubmit={handleRecordVariant} className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-stone-700">Associated Claim *</label>
                <select
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {state.claims.map((c) => (
                    <option key={c.claim_id} value={c.claim_id}>
                      {c.claim_id}: {c.statement.substring(0, 70)}&hellip;
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Tradition Variant Description *
                </label>
                <textarea
                  value={traditionVariant}
                  onChange={(e) => setTraditionVariant(e.target.value)}
                  required
                  rows={2}
                  placeholder="e.g., Sisamau Kayastha Nimona cooks ground fresh green peas with black pepper and clove paste without tomato..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Community Scope *</label>
                  <input
                    value={communityScope}
                    onChange={(e) => setCommunityScope(e.target.value)}
                    required
                    placeholder="e.g., Nayaganj Shukla household lineage"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Plurality Status *</label>
                  <select
                    value={pluralityStatus}
                    onChange={(e) => setPluralityStatus(e.target.value as PluralityStatus)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="CONFIRMED">CONFIRMED (Multiple valid lineages)</option>
                    <option value="POSSIBLE">POSSIBLE (Field reports suggest divergence)</option>
                    <option value="UNKNOWN">UNKNOWN (Pending multi-family interview)</option>
                    <option value="NO_VARIANTS">NO_VARIANTS (Unified unanimous convention)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Conflict / Comparison Notes</label>
                <textarea
                  value={conflictNotes}
                  onChange={(e) => setConflictNotes(e.target.value)}
                  rows={2}
                  placeholder="Explain differences with other lineages, historical reasons for the divergence, or cooking nuance..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
                >
                  Record Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
