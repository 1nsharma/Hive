import React, { useState } from 'react';
import {
  CoreState,
  CoreConsent,
  CoreContributor,
  ContributorRole,
  ConsentScope,
  ConsentAccessLevel,
  ConsentGrantedVia
} from '../../types';
import { uuid, nowISO, appendAuditLog } from '../../utils/coreStorage';

interface CoreConsentViewProps {
  state: CoreState;
  updateState: (newState: CoreState) => void;
}

export const CoreConsentView: React.FC<CoreConsentViewProps> = ({ state, updateState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributorRole, setContributorRole] = useState<ContributorRole>('PRACTITIONER');
  const [anonymized, setAnonymized] = useState(false);
  const [scope, setScope] = useState<ConsentScope>('SPECIFIC_CLAIM');
  const [aiProcessing, setAiProcessing] = useState(true);
  const [publicAttribution, setPublicAttribution] = useState(true);
  const [commercialUse, setCommercialUse] = useState(false);
  const [accessLevel, setAccessLevel] = useState<ConsentAccessLevel>('PUBLIC');
  const [grantedVia, setGrantedVia] = useState<ConsentGrantedVia>('verbal_recorded');

  const handleRecordConsent = (e: React.FormEvent) => {
    e.preventDefault();

    const contributorId = uuid();
    const newContributor: CoreContributor = {
      contributor_id: contributorId,
      role: contributorRole,
      anonymized,
      contact_reference: '[offline-verified-registry]',
      first_contribution_at: nowISO()
    };

    const consentId = uuid();
    const newConsent: CoreConsent = {
      consent_id: consentId,
      contributor_id: contributorId,
      scope,
      ai_processing: aiProcessing,
      public_attribution: publicAttribution,
      commercial_use: commercialUse,
      access_level: accessLevel,
      granted_at: nowISO(),
      granted_via: grantedVia,
      withdrawal_status: 'ACTIVE',
      withdrawal_at: null
    };

    const updatedState: CoreState = {
      ...state,
      contributors: [...state.contributors, newContributor],
      consent: [newConsent, ...state.consent]
    };

    const logged = appendAuditLog(
      updatedState,
      'CONSENT',
      newConsent.consent_id,
      'CONSENT_GRANTED',
      null,
      { contributor_id: contributorId, scope: newConsent.scope },
      'Consent record established with granular permissions'
    );

    updateState(logged);
    setIsModalOpen(false);
  };

  const handleWithdrawConsent = (id: string) => {
    if (!window.confirm('Withdraw this consent? Linked testimonies will be flagged.')) return;
    const target = state.consent.find((c) => c.consent_id === id);
    if (!target) return;

    const beforeState = { withdrawal_status: target.withdrawal_status };
    const afterState = { withdrawal_status: 'WITHDRAWN', withdrawal_at: nowISO() };

    const updatedConsents = state.consent.map((c) =>
      c.consent_id === id
        ? { ...c, withdrawal_status: 'WITHDRAWN' as const, withdrawal_at: nowISO() }
        : c
    );

    const updatedState: CoreState = {
      ...state,
      consent: updatedConsents
    };

    const logged = appendAuditLog(
      updatedState,
      'CONSENT',
      id,
      'CONSENT_WITHDRAWN',
      beforeState,
      afterState,
      'Consent revoked by contributor / community request'
    );

    updateState(logged);
  };

  const handleDeleteConsent = (id: string) => {
    if (!window.confirm('Permanently delete this consent record?')) return;
    const target = state.consent.find((c) => c.consent_id === id);
    const updatedState: CoreState = {
      ...state,
      consent: state.consent.filter((c) => c.consent_id !== id)
    };

    const logged = appendAuditLog(
      updatedState,
      'CONSENT',
      id,
      'DELETED',
      target,
      null,
      'Deleted consent via UI'
    );
    updateState(logged);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Consent Register</h1>
          <p className="text-sm text-stone-600">
            Granular contributor consent management. Principle 2: No person-data without consent.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          + Record Consent
        </button>
      </div>

      {/* Verbal Script Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <span>📜</span>
          <span>Field Verbal Consent Protocol (Hindi):</span>
        </div>
        <p className="font-serif italic text-amber-900 text-sm leading-relaxed bg-white/70 p-3 rounded-lg border border-amber-200/60">
          &ldquo;मैं आपकी बात रिकॉर्ड करना चाहूँगा। क्या आप सहमत हैं कि: (1) आपकी बात AI processing
          के लिए उपयोग हो सकती है? (2) आपका नाम सार्वजनिक रूप से दिख सकता है? (3) इसका व्यावसायिक
          उपयोग हो सकता है? आप किसी भी समय सहमति वापस ले सकते हैं।&rdquo;
        </p>
      </div>

      <div className="space-y-3">
        {state.consent.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No consent records registered. You must record consent before capturing testimonies.
          </div>
        ) : (
          state.consent.map((c) => {
            const contrib = state.contributors.find((co) => co.contributor_id === c.contributor_id);
            const isActive = c.withdrawal_status === 'ACTIVE';

            return (
              <div
                key={c.consent_id}
                className={`bg-white border rounded-lg p-5 shadow-sm transition-colors ${
                  !isActive ? 'opacity-65 bg-stone-50 border-rose-200' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-stone-500">
                      {c.consent_id.substring(0, 16)}&hellip;
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {c.withdrawal_status}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                      Scope: {c.scope}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isActive && (
                      <button
                        onClick={() => handleWithdrawConsent(c.consent_id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
                      >
                        Withdraw Consent
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteConsent(c.consent_id)}
                      className="text-xs text-stone-400 hover:text-stone-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-3">
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">
                    <div className="text-stone-500">AI Processing</div>
                    <div className="font-semibold text-stone-900">
                      {c.ai_processing ? '✅ Allowed' : '❌ Prohibited'}
                    </div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">
                    <div className="text-stone-500">Attribution</div>
                    <div className="font-semibold text-stone-900">
                      {c.public_attribution ? '✅ Public' : '❌ Anonymous'}
                    </div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">
                    <div className="text-stone-500">Commercial Use</div>
                    <div className="font-semibold text-stone-900">
                      {c.commercial_use ? '✅ Permitted' : '❌ Excluded'}
                    </div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded border border-stone-200">
                    <div className="text-stone-500">Access Level</div>
                    <div className="font-semibold text-stone-900">{c.access_level}</div>
                  </div>
                </div>

                <div className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3">
                  <span>
                    Contributor:{' '}
                    <strong className="text-stone-700">
                      {contrib ? `${contrib.role} ${contrib.anonymized ? '(Anonymized)' : ''}` : 'Elder'}
                    </strong>
                  </span>
                  <span>&middot;</span>
                  <span>Granted Via: {c.granted_via}</span>
                  <span>&middot;</span>
                  <span>Date: {new Date(c.granted_at).toLocaleDateString()}</span>
                  {c.withdrawal_at && (
                    <>
                      <span>&middot;</span>
                      <span className="text-rose-600 font-medium">
                        ⛔ Revoked: {new Date(c.withdrawal_at).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-stone-900">Record Contributor Consent</h2>

            <form onSubmit={handleRecordConsent} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Contributor Role *</label>
                  <select
                    value={contributorRole}
                    onChange={(e) => setContributorRole(e.target.value as ContributorRole)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PRACTITIONER">Practitioner</option>
                    <option value="ELDER">Elder / Family Head</option>
                    <option value="HISTORIAN">Historian</option>
                    <option value="RESEARCHER">Researcher</option>
                    <option value="BUSINESS_OWNER">Business / Maker Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Anonymity Mode *</label>
                  <select
                    value={anonymized ? 'true' : 'false'}
                    onChange={(e) => setAnonymized(e.target.value === 'true')}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="false">Attributed (Name may be displayed)</option>
                    <option value="true">Strictly Anonymous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Consent Scope *</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as ConsentScope)}
                  required
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="SPECIFIC_CLAIM">Specific Claim Only</option>
                  <option value="ALL_CONTRIBUTIONS">All Contributions in this Cluster</option>
                  <option value="ENTITY_LEVEL">Entity-Level Knowledge</option>
                </select>
              </div>

              {/* Granular Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={aiProcessing}
                    onChange={(e) => setAiProcessing(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-stone-800">AI Processing</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={publicAttribution}
                    onChange={(e) => setPublicAttribution(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-stone-800">Attribution</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={commercialUse}
                    onChange={(e) => setCommercialUse(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-stone-800">Commercial Use</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Access Level *</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as ConsentAccessLevel)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="RESTRICTED">Restricted</option>
                    <option value="SACRED_PRIVATE">Sacred / Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700">Granted Via *</label>
                  <select
                    value={grantedVia}
                    onChange={(e) => setGrantedVia(e.target.value as ConsentGrantedVia)}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="verbal_recorded">Verbal Recorded (Audio tape)</option>
                    <option value="written">Written / Signed Paper</option>
                    <option value="digital_form">Digital Form</option>
                  </select>
                </div>
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
                  Record Consent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
