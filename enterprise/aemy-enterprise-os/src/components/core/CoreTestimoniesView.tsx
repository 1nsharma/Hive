import React, { useState } from 'react';
import { CoreState, CoreTestimony } from '../../types';
import { uuid, nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CoreTestimoniesViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
  onNavigateToConsent: () => void;
}

export const CoreTestimoniesView: React.FC<CoreTestimoniesViewProps> = ({
  state,
  updateState,
  onNavigateToConsent
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [consentId, setConsentId] = useState('');
  const [statement, setStatement] = useState('');
  const [language, setLanguage] = useState('hi');

  const activeConsents = state.consent.filter((c) => c.withdrawal_status === 'ACTIVE');

  const handleRecordTestimony = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClaimId = claimId || (state.claims[0] ? state.claims[0].claim_id : '');
    const targetConsentId = consentId || (activeConsents[0] ? activeConsents[0].consent_id : '');

    if (!targetClaimId || !targetConsentId || !statement.trim()) {
      alert('Active consent and testimony statement are required.');
      return;
    }

    const consent = state.consent.find((c) => c.consent_id === targetConsentId);
    if (!consent || consent.withdrawal_status !== 'ACTIVE') {
      alert('Cannot record testimony without an active consent record.');
      return;
    }

    const newTestimony: CoreTestimony = {
      testimony_id: uuid(),
      claim_id: targetClaimId,
      contributor_id: consent.contributor_id,
      statement: statement.trim(),
      language: language.trim() || 'hi',
      captured_at: nowISO(),
      captured_by: 'researcher_01',
      consent_id: consent.consent_id
    };

    const updatedState: CoreState = {
      ...state,
      testimonies: [newTestimony, ...state.testimonies]
    };

    const logged = appendAuditLog(
      updatedState,
      'TESTIMONY',
      newTestimony.testimony_id,
      'CREATED',
      null,
      { claim_id: newTestimony.claim_id, consent_id: newTestimony.consent_id },
      'Testimony recorded with verified active consent'
    );

    updateState(logged);
    setIsModalOpen(false);
    setStatement('');
  };

  const handleDeleteTestimony = (id: string) => {
    if (!window.confirm('Delete this testimony record?')) return;
    const target = state.testimonies.find((t) => t.testimony_id === id);
    const updatedState: CoreState = {
      ...state,
      testimonies: state.testimonies.filter((t) => t.testimony_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'TESTIMONY',
      id,
      'DELETED',
      target,
      null,
      'Deleted testimony via UI'
    );
    updateState(logged);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Community Testimonies</h1>
          <p className="text-sm text-stone-600">
            Oral statements from practitioners and elders. Strictly gated by{' '}
            <strong>active consent</strong> (Principle 2).
          </p>
        </div>
        <button
          onClick={() => {
            if (state.claims.length === 0) {
              alert('Please create at least one claim first.');
              return;
            }
            if (activeConsents.length === 0) {
              alert('No active consent records found. Please create a Consent record first.');
              onNavigateToConsent();
              return;
            }
            setClaimId(state.claims[0].claim_id);
            setConsentId(activeConsents[0].consent_id);
            setIsModalOpen(true);
          }}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          + Record Testimony
        </button>
      </div>

      <div className="space-y-3">
        {state.testimonies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No testimonies recorded yet. An active Consent record must be established before capturing testimony.
          </div>
        ) : (
          state.testimonies.map((t) => {
            const linkedClaim = state.claims.find((c) => c.claim_id === t.claim_id);
            const consent = state.consent.find((cn) => cn.consent_id === t.consent_id);
            const contributor = state.contributors.find((co) => co.contributor_id === t.contributor_id);
            const isWithdrawn = consent && consent.withdrawal_status === 'WITHDRAWN';

            return (
              <div
                key={t.testimony_id}
                className={`bg-white border rounded-lg p-5 shadow-sm transition-colors ${
                  isWithdrawn ? 'border-rose-300 opacity-60 bg-stone-50' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-stone-400">
                      {t.testimony_id.substring(0, 16)}&hellip;
                    </span>
                    {linkedClaim && (
                      <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        &rarr; {linkedClaim.claim_id}
                      </span>
                    )}
                    {isWithdrawn ? (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        CONSENT WITHDRAWN
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        CONSENT ACTIVE
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTestimony(t.testimony_id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <blockquote className="text-stone-900 font-serif text-sm italic leading-relaxed mt-1">
                  &ldquo;{t.statement}&rdquo;
                </blockquote>

                <div className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3">
                  <span>
                    👤 Contributor:{' '}
                    <strong className="text-stone-700">
                      {contributor ? (contributor.anonymized ? 'Anonymous Elder' : contributor.role) : 'Verified Elder'}
                    </strong>
                  </span>
                  <span>&middot;</span>
                  <span>🌐 Language: {t.language.toUpperCase()}</span>
                  <span>&middot;</span>
                  <span>📅 Recorded: {new Date(t.captured_at).toLocaleString()}</span>
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
            <h2 className="text-xl font-bold text-stone-900">Record Practitioner Testimony</h2>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-950">
              <strong>Principle 2 Enforced:</strong> No person-data without consent. This testimony
              must be linked to an active, verified consent record with clear permissions.
            </div>

            <form onSubmit={handleRecordTestimony} className="space-y-3.5">
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
                <label className="block text-sm font-medium text-stone-700">Active Consent Record *</label>
                <select
                  value={consentId}
                  onChange={(e) => setConsentId(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {activeConsents.map((c) => {
                    const contrib = state.contributors.find((co) => co.contributor_id === c.contributor_id);
                    return (
                      <option key={c.consent_id} value={c.consent_id}>
                        {c.consent_id.substring(0, 14)}&hellip; &middot; {contrib ? contrib.role : 'Elder'} &middot; Scope: {c.scope}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Testimony Statement *</label>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  rows={3}
                  placeholder="Exact words or paraphrase of the community contributor..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Language (ISO code) *</label>
                <input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  placeholder="hi"
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
                  Record Testimony
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
