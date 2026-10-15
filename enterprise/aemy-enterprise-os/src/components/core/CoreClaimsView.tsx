import React, { useState } from 'react';
import {
  CoreState,
  CoreClaim,
  CoreClaimType,
  ClaimVerificationStatus
} from '../../types';
import { nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CoreClaimsViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
  onSendToAI?: (claimStatement: string) => void;
}

export const CoreClaimsView: React.FC<CoreClaimsViewProps> = ({
  state,
  updateState,
  onSendToAI
}) => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [statusModalClaim, setStatusModalClaim] = useState<CoreClaim | null>(null);

  // New claim form state
  const [entityId, setEntityId] = useState('');
  const [statement, setStatement] = useState('');
  const [claimType, setClaimType] = useState<CoreClaimType>('PRACTICE');
  const [geographicScope, setGeographicScope] = useState('Kanpur');

  // Change status form state
  const [newStatus, setNewStatus] = useState<ClaimVerificationStatus>('UNDER_REVIEW');
  const [rationale, setRationale] = useState('');

  const statuses: ClaimVerificationStatus[] = [
    'UNVERIFIED',
    'UNDER_REVIEW',
    'COMMUNITY_CONFIRMED',
    'EVIDENCE_SUPPORTED',
    'PARTIALLY_SUPPORTED',
    'DISPUTED',
    'RESTRICTED'
  ];

  const getStatusBadge = (status: ClaimVerificationStatus) => {
    switch (status) {
      case 'UNVERIFIED':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'COMMUNITY_CONFIRMED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'EVIDENCE_SUPPORTED':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'PARTIALLY_SUPPORTED':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'DISPUTED':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'RESTRICTED':
        return 'bg-stone-200 text-stone-800 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEntityId = entityId || (state.entities[0] ? state.entities[0].entity_id : '');
    if (!targetEntityId || !statement.trim()) return;

    const newClaimId = 'C' + String(state.claims.length + 1).padStart(3, '0');
    const newClaim: CoreClaim = {
      claim_id: newClaimId,
      entity_id: targetEntityId,
      statement: statement.trim(),
      claim_type: claimType,
      geographic_scope: geographicScope.trim(),
      verification_status: 'UNVERIFIED', // strictly UNVERIFIED initially
      created_at: nowISO(),
      created_by: 'researcher_01'
    };

    const updatedState: CoreState = {
      ...state,
      claims: [...state.claims, newClaim]
    };

    const logged = appendAuditLog(
      updatedState,
      'CLAIM',
      newClaim.claim_id,
      'CREATED',
      null,
      { statement: newClaim.statement, type: newClaim.claim_type },
      'Created via UI (enforced UNVERIFIED baseline)'
    );

    updateState(logged);
    setIsNewModalOpen(false);
    setStatement('');
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalClaim || !rationale.trim()) return;

    const beforeState = { verification_status: statusModalClaim.verification_status };
    const afterState = { verification_status: newStatus };

    const updatedClaims = state.claims.map((c) =>
      c.claim_id === statusModalClaim.claim_id ? { ...c, verification_status: newStatus } : c
    );

    const updatedState: CoreState = {
      ...state,
      claims: updatedClaims
    };

    const logged = appendAuditLog(
      updatedState,
      'CLAIM',
      statusModalClaim.claim_id,
      'STATUS_CHANGED',
      beforeState,
      afterState,
      rationale.trim()
    );

    updateState(logged);
    setStatusModalClaim(null);
    setRationale('');
  };

  const handleDeleteClaim = (id: string) => {
    if (!window.confirm('Delete this claim and all associated evidence, testimonies, and reviews?')) {
      return;
    }
    const target = state.claims.find((c) => c.claim_id === id);
    const updatedState: CoreState = {
      ...state,
      claims: state.claims.filter((c) => c.claim_id !== id),
      evidence: state.evidence.filter((e) => e.claim_id !== id),
      testimonies: state.testimonies.filter((t) => t.claim_id !== id),
      reviews: state.reviews.filter((r) => r.claim_id !== id),
      plurality: state.plurality.filter((p) => p.claim_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'CLAIM',
      id,
      'DELETED',
      target,
      null,
      'Deleted claim via UI'
    );
    updateState(logged);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Cultural Claims</h1>
          <p className="text-sm text-stone-600">
            Assertions about cultural entities. Default status is strictly <strong>UNVERIFIED</strong>.
          </p>
        </div>
        <button
          onClick={() => {
            if (state.entities.length === 0) {
              alert('Please register at least one Cultural Entity first.');
              return;
            }
            setEntityId(state.entities[0].entity_id);
            setIsNewModalOpen(true);
          }}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          + New Claim
        </button>
      </div>

      <div className="space-y-3">
        {state.claims.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No claims registered yet.
          </div>
        ) : (
          state.claims.map((c) => {
            const entity = state.entities.find((e) => e.entity_id === c.entity_id);
            const evCount = state.evidence.filter((ev) => ev.claim_id === c.claim_id).length;
            const testCount = state.testimonies.filter((t) => t.claim_id === c.claim_id).length;
            const revCount = state.reviews.filter((r) => r.claim_id === c.claim_id).length;

            return (
              <div
                key={c.claim_id}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {c.claim_id}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(
                        c.verification_status
                      )}`}
                    >
                      {c.verification_status.replace(/_/g, ' ')}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                      {c.claim_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {onSendToAI && (
                      <button
                        onClick={() => onSendToAI(c.statement)}
                        className="text-xs text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded border border-amber-200 font-medium transition-colors"
                      >
                        ⚡ AI Structuring
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setStatusModalClaim(c);
                        setNewStatus(c.verification_status);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Change Status
                    </button>
                    <button
                      onClick={() => handleDeleteClaim(c.claim_id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-stone-900 font-medium text-sm leading-relaxed mt-1">
                  {c.statement}
                </p>

                <div className="text-xs text-stone-500 mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                  <span>📍 {c.geographic_scope}</span>
                  <span>&middot;</span>
                  <span>🏛️ {entity ? entity.name : 'Unknown Entity'}</span>
                  <span>&middot;</span>
                  <span>🔍 {evCount} evidence</span>
                  <span>&middot;</span>
                  <span>🗣️ {testCount} testimonies</span>
                  <span>&middot;</span>
                  <span>👥 {revCount} reviews</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Claim Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Add New Claim (Hypothesis)</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              <strong>Principle 1 &amp; 3:</strong> All new claims are registered strictly as{' '}
              <span className="font-mono font-bold">UNVERIFIED</span> hypotheses. Do not submit
              unverified assertions as established facts.
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-stone-700">Cultural Entity *</label>
                <select
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {state.entities.map((e) => (
                    <option key={e.entity_id} value={e.entity_id}>
                      {e.name} ({e.geographic_scope})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Claim Statement *</label>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  rows={3}
                  placeholder="e.g., Satpaita Kanpur-region की traditional home-food practice है।"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Claim Type *</label>
                  <select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value as CoreClaimType)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="ORIGIN">Origin</option>
                    <option value="PRACTICE">Practice</option>
                    <option value="TEMPORAL">Temporal</option>
                    <option value="TRANSMISSION">Transmission</option>
                    <option value="ASSOCIATION">Association</option>
                    <option value="DIVERSITY">Diversity</option>
                    <option value="EROSION">Erosion</option>
                    <option value="DIGITAL_GAP">Digital Gap</option>
                    <option value="BUSINESS_HYPOTHESIS">Business Hypothesis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Geographic Scope *</label>
                  <input
                    value={geographicScope}
                    onChange={(e) => setGeographicScope(e.target.value)}
                    required
                    placeholder="e.g., Kanpur"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
                >
                  Create (UNVERIFIED)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {statusModalClaim && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Transition Claim Status</h2>
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
              <span className="font-mono font-bold text-stone-700">{statusModalClaim.claim_id}: </span>
              <span className="text-stone-800">{statusModalClaim.statement}</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
              <strong>State Machine Rule:</strong> Status transitions must be justified with
              traceable field evidence or human practitioner review. Provide an audit rationale.
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3.5">
              <div>
                <label className="block text-sm font-medium text-stone-700">Current Status</label>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-semibold border ${getStatusBadge(
                      statusModalClaim.verification_status
                    )}`}
                  >
                    {statusModalClaim.verification_status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">New Target Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ClaimVerificationStatus)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} disabled={s === statusModalClaim.verification_status}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Rationale &amp; Evidence Basis *
                </label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  required
                  rows={3}
                  placeholder="Explain why this status transition is justified (e.g., corroborated by two family elder interviews and 1934 gazetteer reference)..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStatusModalClaim(null)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
                >
                  Confirm Status Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
