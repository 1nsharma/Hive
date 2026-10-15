import React, { useState } from 'react';
import { CoreState, CoreEvidence, EvidenceSourceType } from '../../types';
import { uuid, nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CoreEvidenceViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
}

export const CoreEvidenceView: React.FC<CoreEvidenceViewProps> = ({ state, updateState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceSourceType>('ORAL_INTERVIEW');
  const [source, setSource] = useState('');
  const [sourceReference, setSourceReference] = useState('');
  const [notes, setNotes] = useState('');

  const evidenceTypes: EvidenceSourceType[] = [
    'ORAL_INTERVIEW',
    'ARCHIVAL_DOCUMENT',
    'PHOTOGRAPH',
    'AUDIO_RECORDING',
    'VIDEO',
    'GAZETTEER',
    'ACADEMIC_PAPER',
    'GI_DOCUMENTATION',
    'MATERIAL_ARTIFACT'
  ];

  const handleLogEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClaimId = claimId || (state.claims[0] ? state.claims[0].claim_id : '');
    if (!targetClaimId || !source.trim()) return;

    const newEvidence: CoreEvidence = {
      evidence_id: uuid(),
      claim_id: targetClaimId,
      evidence_type: evidenceType,
      source: source.trim(),
      source_reference: sourceReference.trim(),
      captured_at: nowISO(),
      captured_by: 'researcher_01',
      notes: notes.trim()
    };

    const updatedState: CoreState = {
      ...state,
      evidence: [newEvidence, ...state.evidence]
    };

    const logged = appendAuditLog(
      updatedState,
      'EVIDENCE',
      newEvidence.evidence_id,
      'CREATED',
      null,
      { claim_id: newEvidence.claim_id, source: newEvidence.source },
      'Evidence logged via UI'
    );

    updateState(logged);
    setIsModalOpen(false);
    setSource('');
    setSourceReference('');
    setNotes('');
  };

  const handleDeleteEvidence = (id: string) => {
    if (!window.confirm('Delete this evidence record?')) return;
    const target = state.evidence.find((e) => e.evidence_id === id);
    const updatedState: CoreState = {
      ...state,
      evidence: state.evidence.filter((e) => e.evidence_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'EVIDENCE',
      id,
      'DELETED',
      target,
      null,
      'Deleted evidence via UI'
    );
    updateState(logged);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Evidence Ledger</h1>
          <p className="text-sm text-stone-600">
            Traceable primary sources supporting claims. Principle 1: No claim without provenance.
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
          + Log Evidence
        </button>
      </div>

      <div className="space-y-3">
        {state.evidence.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No evidence logged yet. Evidence is required before claims can transition from UNVERIFIED.
          </div>
        ) : (
          state.evidence.map((ev) => {
            const linkedClaim = state.claims.find((c) => c.claim_id === ev.claim_id);
            return (
              <div
                key={ev.evidence_id}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:border-stone-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-stone-400">
                      {ev.evidence_id.substring(0, 16)}&hellip;
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                      {ev.evidence_type}
                    </span>
                    {linkedClaim && (
                      <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        &rarr; {linkedClaim.claim_id}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvidence(ev.evidence_id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <div className="text-sm font-medium text-stone-900">
                  <strong className="text-stone-700">Source:</strong> {ev.source}
                </div>

                {ev.source_reference && (
                  <div className="text-xs font-mono text-stone-600 mt-1 bg-stone-50 p-1.5 rounded border border-stone-200">
                    Ref: {ev.source_reference}
                  </div>
                )}

                {ev.notes && (
                  <div className="text-sm text-stone-700 mt-2 italic bg-amber-50/40 p-2 rounded border border-amber-200/60">
                    &ldquo;{ev.notes}&rdquo;
                  </div>
                )}

                <div className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span>Captured: {new Date(ev.captured_at).toLocaleString()}</span>
                  <span className="font-mono">Actor: {ev.captured_by}</span>
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
            <h2 className="text-xl font-bold text-stone-900">Log Verifiable Evidence</h2>
            <form onSubmit={handleLogEvidence} className="space-y-3.5">
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
                <label className="block text-sm font-medium text-stone-700">Evidence Type *</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value as EvidenceSourceType)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {evidenceTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Source Description *</label>
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                  placeholder="e.g., Interview with Smt. Urmila Shukla (72, Nayaganj, 4th gen family elder)"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Source Reference (URL, Physical Archive ID, or GPS)
                </label>
                <input
                  value={sourceReference}
                  onChange={(e) => setSourceReference(e.target.value)}
                  placeholder="e.g., Audio Tape #KNP-REC-2026-004 / Cawnpore District Gazetteer 1909 p.142"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Notes &amp; Key Excerpt</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Direct observations or key quote..."
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
                  Log Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
