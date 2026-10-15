import React, { useState } from 'react';
import {
  CoreState,
  CoreReview,
  ReviewerType,
  ReviewDecision
} from '../../types';
import { uuid, nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CoreReviewsViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
}

export const CoreReviewsView: React.FC<CoreReviewsViewProps> = ({ state, updateState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [reviewerType, setReviewerType] = useState<ReviewerType>('COMMUNITY_ELDER');
  const [decision, setDecision] = useState<ReviewDecision>('CONFIRMS');
  const [correction, setCorrection] = useState('');
  const [rationale, setRationale] = useState('');

  const reviewerTypes: ReviewerType[] = [
    'COMMUNITY_ELDER',
    'PRACTITIONER',
    'DOMAIN_EXPERT',
    'HISTORIAN',
    'PEER_REVIEWER'
  ];

  const decisions: ReviewDecision[] = [
    'CONFIRMS',
    'CORRECTS',
    'DISPUTES',
    'REQUESTS_CLARIFICATION',
    'RESTRICTS'
  ];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClaimId = claimId || (state.claims[0] ? state.claims[0].claim_id : '');
    if (!targetClaimId || !rationale.trim()) return;

    const newReview: CoreReview = {
      review_id: uuid(),
      claim_id: targetClaimId,
      reviewer_id: 'researcher_01',
      reviewer_type: reviewerType,
      decision,
      correction: correction.trim() || null,
      rationale: rationale.trim(),
      reviewed_at: nowISO()
    };

    const updatedState: CoreState = {
      ...state,
      reviews: [newReview, ...state.reviews]
    };

    const logged = appendAuditLog(
      updatedState,
      'REVIEW',
      newReview.review_id,
      'CREATED',
      null,
      { claim_id: newReview.claim_id, decision: newReview.decision },
      'Human review submitted'
    );

    updateState(logged);
    setIsModalOpen(false);
    setCorrection('');
    setRationale('');
  };

  const handleDeleteReview = (id: string) => {
    if (!window.confirm('Delete this review record?')) return;
    const target = state.reviews.find((r) => r.review_id === id);
    const updatedState: CoreState = {
      ...state,
      reviews: state.reviews.filter((r) => r.review_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'REVIEW',
      id,
      'DELETED',
      target,
      null,
      'Deleted review via UI'
    );
    updateState(logged);
  };

  const getDecisionBadge = (d: ReviewDecision) => {
    switch (d) {
      case 'CONFIRMS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'DISPUTES':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'CORRECTS':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'RESTRICTS':
        return 'bg-stone-200 text-stone-800 border-stone-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Human Peer &amp; Community Reviews</h1>
          <p className="text-sm text-stone-600">
            Authoritative decisions on claims by elders, practitioners, and historians.
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
          + Add Review
        </button>
      </div>

      <div className="space-y-3">
        {state.reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No reviews logged yet.
          </div>
        ) : (
          state.reviews.map((r) => {
            const linkedClaim = state.claims.find((c) => c.claim_id === r.claim_id);

            return (
              <div
                key={r.review_id}
                className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:border-stone-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {r.reviewer_type}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getDecisionBadge(
                        r.decision
                      )}`}
                    >
                      {r.decision}
                    </span>
                    {linkedClaim && (
                      <span className="text-xs font-mono text-stone-500">
                        &rarr; {linkedClaim.claim_id}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteReview(r.review_id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>

                {r.correction && (
                  <div className="text-sm bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-950 mb-2">
                    <strong>Correction Note:</strong> {r.correction}
                  </div>
                )}

                <div className="text-sm text-stone-800 italic bg-stone-50 p-2.5 rounded border border-stone-200">
                  {r.rationale}
                </div>

                <div className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span>Reviewed: {new Date(r.reviewed_at).toLocaleString()}</span>
                  <span className="font-mono">Reviewer: {r.reviewer_id}</span>
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
            <h2 className="text-xl font-bold text-stone-900">Add Human Review</h2>
            <form onSubmit={handleAddReview} className="space-y-3.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Reviewer Type *</label>
                  <select
                    value={reviewerType}
                    onChange={(e) => setReviewerType(e.target.value as ReviewerType)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {reviewerTypes.map((rt) => (
                      <option key={rt} value={rt}>
                        {rt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Decision *</label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as ReviewDecision)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {decisions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Correction (if any)
                </label>
                <input
                  value={correction}
                  onChange={(e) => setCorrection(e.target.value)}
                  placeholder="e.g., Satpaita is cooked in mustard oil, not ghee in historical Nayaganj recipes..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Detailed Rationale *</label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  required
                  rows={3}
                  placeholder="Justify why this decision is made based on lived knowledge, lineage, or primary sources..."
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
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
