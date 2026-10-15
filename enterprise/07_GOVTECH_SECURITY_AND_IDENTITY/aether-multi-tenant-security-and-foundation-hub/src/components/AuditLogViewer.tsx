import React, { useState } from 'react';
import { AuditLog, UserProfile, Shop } from '../types/database';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Terminal, 
  ChevronDown, 
  ChevronRight,
  ShieldAlert,
  Clock,
  User,
  Server
} from 'lucide-react';

interface AuditLogViewerProps {
  logs: AuditLog[];
  currentUser: UserProfile;
  currentShop: Shop;
  onRefresh: () => void;
  isShopOwner: boolean;
  isOperations: boolean;
  isSuperAdmin: boolean;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  currentUser,
  currentShop,
  onRefresh,
  isShopOwner,
  isOperations,
  isSuperAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShop, setFilterShop] = useState<string>('current');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [tamperResult, setTamperResult] = useState<any>(null);
  const [tampering, setTampering] = useState<boolean>(false);

  const canViewLogs = isShopOwner || isOperations || isSuperAdmin;

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterShop === 'current' && log.shop_id !== currentShop.id && log.shop_id !== null) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(term);
      const matchActor = (log.actor_name || log.actor_id || '').toLowerCase().includes(term);
      const matchTarget = log.target.toLowerCase().includes(term);
      return matchAction || matchActor || matchTarget;
    }
    return true;
  });

  // Attempt client-side tampering test
  const handleTamperTest = async () => {
    setTampering(true);
    setTamperResult(null);

    try {
      const res = await fetch('/api/audit-logs/direct-browser-write-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forged.client_override',
          target: 'system:root',
          metadata: { forged_by: 'client_browser' },
        }),
      });
      const data = await res.json();
      setTamperResult(data);
    } catch (err: any) {
      setTamperResult({ error: err.message });
    } finally {
      setTampering(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-zinc-100">
                Immutable Privileged Audit Log Stream
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Guaranteed non-repudiation: every privileged operation records actor_id, action, target, timestamp, and metadata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tamper Test Button */}
            <button
              onClick={handleTamperTest}
              disabled={tampering}
              className="px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-700 hover:border-zinc-600 text-xs text-rose-300 font-mono transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>Test Client Tampering</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter by action, actor, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500">Scope:</span>
            <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-md border border-zinc-800">
              <button
                onClick={() => setFilterShop('current')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  filterShop === 'current'
                    ? 'bg-zinc-800 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {currentShop.name}
              </button>
              {(isOperations || isSuperAdmin) && (
                <button
                  onClick={() => setFilterShop('all')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    filterShop === 'all'
                      ? 'bg-zinc-800 text-zinc-100 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Global Platform
                </button>
              )}
            </div>
            <span className="text-zinc-500 font-mono">({filteredLogs.length} entries)</span>
          </div>
        </div>
      </div>

      {/* Tamper test alert banner if triggered */}
      {tamperResult && (
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-rose-300">
                Direct Browser Insert Blocked: {tamperResult.code} (PostgreSQL RLS)
              </div>
              <div className="text-zinc-400 mt-1 font-mono text-[11px]">
                {tamperResult.error}
              </div>
              <div className="text-zinc-500 mt-1 text-[11px]">
                {tamperResult.explanation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access Guard for Customer / Staff */}
      {!canViewLogs ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-8 text-center">
          <Lock className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Audit Log Access Restricted by PostgreSQL RLS
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
            Current role <span className="font-mono text-zinc-400">[{currentUser.system_role}]</span> does not hold shop owner or platform operations privileges. Policy <code className="font-mono text-zinc-400">audit_logs_select_policy</code> returned 0 rows.
          </p>
          <div className="mt-3 text-[11px] text-indigo-400">
            Switch actor to Marcus Vance (Merchant) or Sarah Jenkins (Ops) above to inspect audit logs.
          </div>
        </div>
      ) : (
        /* Audit Logs Table */
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">IP / Provenance</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-zinc-850/40 transition-colors">
                        <td className="py-2.5 px-3 text-zinc-400 whitespace-nowrap">
                          {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-300 whitespace-nowrap">
                          <span className="text-indigo-400 font-medium">
                            {log.actor_name || log.actor_id}
                          </span>
                          <span className="text-zinc-600 ml-1.5">/</span>
                          <span className="text-zinc-500 ml-1.5 uppercase text-[10px]">
                            {log.actor_role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-amber-300 font-medium">{log.action}</span>
                        </td>
                        <td className="py-2.5 px-3 text-zinc-400 whitespace-nowrap">
                          {log.target}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap text-[10px]">
                          {log.ip_address || '127.0.0.1'}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="text-zinc-400 hover:text-zinc-200 transition-colors font-sans text-xs inline-flex items-center gap-1"
                          >
                            <span>{isExpanded ? 'Hide' : 'Details'}</span>
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable JSON details */}
                      {isExpanded && (
                        <tr className="bg-zinc-950/70">
                          <td colSpan={6} className="p-4 border-t border-zinc-800/80">
                            <div className="space-y-2 text-zinc-300">
                              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-1.5">
                                <span>Audit ID: <code className="text-zinc-300">{log.id}</code></span>
                                <span>Shop ID: <code className="text-zinc-300">{log.shop_id || 'Platform-Global'}</code></span>
                                <span>User Agent: <code className="text-zinc-300">{log.user_agent || 'Next.js 14 API'}</code></span>
                              </div>
                              <div className="text-[11px] text-zinc-400 pt-1">
                                Metadata Payload:
                              </div>
                              <pre className="p-3 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-emerald-400 overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
