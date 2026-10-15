import React from 'react';
import { CoreState } from '../../types';

interface CoreAuditViewProps {
  state: CoreState;
}

export const CoreAuditView: React.FC<CoreAuditViewProps> = ({ state }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Immutable Audit Log</h1>
        <p className="text-sm text-stone-600">
          Every mutation, status transition, and consent event is strictly recorded and traceable. Total entries: {state.auditLog.length}.
        </p>
      </div>

      <div className="space-y-3">
        {state.auditLog.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200 text-stone-400">
            No audit log entries recorded yet.
          </div>
        ) : (
          state.auditLog.map((a) => (
            <div
              key={a.log_id}
              className="bg-white border-l-4 border-indigo-600 border border-stone-200 rounded-r-lg p-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                    {a.action}
                  </span>
                  <span className="font-mono text-xs text-stone-500">
                    {a.entity_type} &middot; {a.entity_id}
                  </span>
                </div>
                <div className="font-mono text-xs text-stone-400">
                  {new Date(a.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="text-xs text-stone-600 mt-1.5 flex items-center gap-2">
                <span>Actor ID:</span>
                <span className="font-mono font-medium text-stone-800">{a.actor_id}</span>
              </div>

              {a.rationale && (
                <div className="text-sm text-stone-800 italic mt-2 bg-stone-50 p-2.5 rounded border border-stone-200">
                  &ldquo;{a.rationale}&rdquo;
                </div>
              )}

              {/* State Diff Inspector */}
              <details className="mt-3 text-xs">
                <summary className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer select-none">
                  Inspect State Diff (Before &amp; After JSON)
                </summary>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg">
                    <div className="font-semibold text-rose-900 mb-1 flex items-center gap-1">
                      <span>⏮️ Before State:</span>
                    </div>
                    <pre className="font-mono text-[11px] text-rose-950 overflow-x-auto whitespace-pre-wrap">
                      {a.before_state ? JSON.stringify(a.before_state, null, 2) : 'null (initial creation)'}
                    </pre>
                  </div>

                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                    <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-1">
                      <span>⏭️ After State:</span>
                    </div>
                    <pre className="font-mono text-[11px] text-emerald-950 overflow-x-auto whitespace-pre-wrap">
                      {a.after_state ? JSON.stringify(a.after_state, null, 2) : 'null (deleted)'}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
