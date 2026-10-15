import React from 'react';
import { CoreState } from '../../types';

interface CoreDashboardProps {
  state: CoreState;
  onNavigate: (view: string) => void;
}

export const CoreDashboard: React.FC<CoreDashboardProps> = ({ state, onNavigate }) => {
  const statusCounts: Record<string, number> = {};
  state.claims.forEach((c) => {
    statusCounts[c.verification_status] = (statusCounts[c.verification_status] || 0) + 1;
  });

  const consentActive = state.consent.filter((c) => c.withdrawal_status === 'ACTIVE').length;
  const consentWithdrawn = state.consent.filter((c) => c.withdrawal_status === 'WITHDRAWN').length;

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Research Dashboard</h1>
        <p className="text-sm text-stone-600 mt-1">
          Kanpur Traditional Home-Food Heritage Pilot — 7-Day Experiment Workspace
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('entities')}
          className="text-left bg-white border border-stone-200 rounded-lg p-4 shadow-sm hover:border-stone-400 transition-colors"
        >
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Entities</div>
          <div className="text-3xl font-bold text-stone-900 mt-1">{state.entities.length}</div>
          <div className="text-xs text-stone-500 mt-1">Cultural Objects</div>
        </button>

        <button
          onClick={() => onNavigate('claims')}
          className="text-left bg-white border border-stone-200 rounded-lg p-4 shadow-sm hover:border-stone-400 transition-colors"
        >
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Claims</div>
          <div className="text-3xl font-bold text-stone-900 mt-1">{state.claims.length}</div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            {statusCounts['UNVERIFIED'] || 0} unverified
          </div>
        </button>

        <button
          onClick={() => onNavigate('evidence')}
          className="text-left bg-white border border-stone-200 rounded-lg p-4 shadow-sm hover:border-stone-400 transition-colors"
        >
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Evidence</div>
          <div className="text-3xl font-bold text-stone-900 mt-1">{state.evidence.length}</div>
          <div className="text-xs text-stone-500 mt-1">Traceable Sources</div>
        </button>

        <button
          onClick={() => onNavigate('testimonies')}
          className="text-left bg-white border border-stone-200 rounded-lg p-4 shadow-sm hover:border-stone-400 transition-colors"
        >
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Testimonies</div>
          <div className="text-3xl font-bold text-stone-900 mt-1">{state.testimonies.length}</div>
          <div className="text-xs text-stone-500 mt-1">Consent-Gated</div>
        </button>
      </div>

      {/* Claim Status & Consent/Plurality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-stone-900 mb-3">Claim Status Distribution</h3>
          {Object.keys(statusCounts).length === 0 ? (
            <div className="text-sm text-stone-400">No claims yet</div>
          ) : (
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(status)}`}>
                    {status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-sm font-semibold text-stone-800">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-stone-900 mb-3">Consent & Plurality Overview</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center text-stone-700">
              <span>Active Consents (Principle 2)</span>
              <span className="font-mono font-semibold text-emerald-700">{consentActive}</span>
            </div>
            <div className="flex justify-between items-center text-stone-700">
              <span>Withdrawn Consents</span>
              <span className="font-mono font-semibold text-stone-500">{consentWithdrawn}</span>
            </div>
            <div className="flex justify-between items-center text-stone-700">
              <span>Cultural Variant Records (Plurality)</span>
              <span className="font-mono font-semibold text-stone-800">{state.plurality.length}</span>
            </div>
            <div className="flex justify-between items-center text-stone-700">
              <span>Human Reviews Logged</span>
              <span className="font-mono font-semibold text-stone-800">{state.reviews.length}</span>
            </div>
            <div className="flex justify-between items-center text-stone-700">
              <span>Immutable Audit Trail Entries</span>
              <span className="font-mono font-semibold text-indigo-700">{state.auditLog.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kill/Go Decision Criteria (Day 7) */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-stone-900 mb-3">Kill/Go Decision Criteria (Day 7 Thresholds)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 mb-1">TRUTH</div>
            <div className="text-stone-600">&ge; 80% claims approved by authentic practitioners</div>
            <div className="mt-2 font-mono text-xs text-amber-700 font-medium">Pending field verification</div>
          </div>
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 mb-1">TRUST</div>
            <div className="text-stone-600">&ge; 70% users prefer Version B verified profile</div>
            <div className="mt-2 font-mono text-xs text-amber-700 font-medium">Pending A/B sandbox test</div>
          </div>
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 mb-1">ACTION</div>
            <div className="text-stone-600">&ge; 20% higher booking/interest in Version B</div>
            <div className="mt-2 font-mono text-xs text-amber-700 font-medium">Pending live experiment</div>
          </div>
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <div className="font-bold text-stone-900 mb-1">ECONOMICS</div>
            <div className="text-stone-600">&ge; 60% households/makers willing to maintain</div>
            <div className="mt-2 font-mono text-xs text-amber-700 font-medium">Pending community feedback</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-stone-900">Recent Audit Activity</h3>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            View Full Audit Log &rarr;
          </button>
        </div>
        <div className="space-y-2">
          {state.auditLog.slice(0, 5).map((a) => (
            <div
              key={a.log_id}
              className="border-l-4 border-indigo-600 bg-stone-50 p-3 rounded-r-lg text-xs"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono font-semibold text-indigo-900">{a.action}</span>
                <span className="text-stone-500 font-mono">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-stone-700 mt-1 font-medium">
                {a.entity_type} &middot; {a.entity_id.substring(0, 16)}&hellip;
              </div>
              {a.rationale && (
                <div className="text-stone-600 italic mt-1 bg-white/60 p-1.5 rounded border border-stone-200">
                  {a.rationale}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
