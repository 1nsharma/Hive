import React, { useState } from 'react';
import { 
  ScrollText, 
  Search, 
  Terminal, 
  ShieldAlert, 
  TrendingUp, 
  Info, 
  Code,
  Copy,
  Check
} from 'lucide-react';
import { AuditLogEntry, RiskLevel } from '../types';

interface AuditLogViewerProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ auditLogs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = log.agentMonologue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTaken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.toolUsed && log.toolUsed.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLevelBadge = (level: AuditLogEntry['level']) => {
    switch (level) {
      case 'decision':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">DECISION</span>;
      case 'hitl':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HITL GATE</span>;
      case 'security':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">SECURITY</span>;
      case 'reflection':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">REFLECTION</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Critical Safeguard Layer</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">Immutable Execution Trace</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Autonomous Audit Log & Internal Monologue Trace</h2>
            <p className="text-sm text-slate-400 mt-1">
              Maintains an immutable record of what the agent observed, reasoned, decided, and executed. Every tool call and payload diff is verifiable for compliance and security auditing.
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            {auditLogs.length} Events Ingested
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit logs..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              aria-label="Filter audit logs by event type"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Events</option>
              <option value="decision">Decisions</option>
              <option value="hitl">HITL Gates</option>
              <option value="security">Security</option>
              <option value="reflection">Reflections</option>
              <option value="info">System Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="divide-y divide-slate-800">
          {filteredLogs.map((log) => {
            const isExpanded = expandedId === log.id;
            return (
              <div key={log.id} className="p-4 hover:bg-slate-800/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap mt-0.5">
                      {log.timestamp}
                    </span>
                    {getLevelBadge(log.level)}
                    <div>
                      <span className="text-xs font-semibold text-white block">{log.actionTaken}</span>
                      <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                        <strong className="text-cyan-400">Agent Thought: </strong>
                        {log.agentMonologue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-start">
                    {log.toolUsed && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-cyan-300 border border-slate-800">
                        {log.toolUsed}
                      </span>
                    )}

                    {log.executionPayload && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                      >
                        {isExpanded ? 'Hide Payload' : 'View Payload'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Payload */}
                {isExpanded && log.executionPayload && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-400">EXECUTION_PAYLOAD_DIFF (JSON):</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(log.id, log.executionPayload || '')}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === log.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                      {log.executionPayload}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
