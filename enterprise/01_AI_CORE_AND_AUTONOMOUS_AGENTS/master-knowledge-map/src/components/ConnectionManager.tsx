import React, { useState } from 'react';
import { SubDomain, Connection } from '../types';
import { Sparkles, Plus, Trash2, Check, HelpCircle, Activity, Link2, AlertCircle } from 'lucide-react';

interface ConnectionManagerProps {
  subDomains: SubDomain[];
  connections: Connection[];
  onAddConnection: (sourceId: string, targetId: string, type: 'dependency' | 'data-flow' | 'security' | 'integration', desc: string) => void;
  onDeleteConnection: (id: string) => void;
}

interface SuggestedConnection {
  sourceId: string;
  targetId: string;
  description: string;
  type: 'dependency' | 'data-flow' | 'security' | 'integration';
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  subDomains,
  connections,
  onAddConnection,
  onDeleteConnection
}) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [type, setType] = useState<'dependency' | 'data-flow' | 'security' | 'integration'>('dependency');
  const [description, setDescription] = useState('');
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedConnection[]>([]);

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId || !description) return;
    
    // Check if duplicate exists
    const duplicate = connections.some(c => c.sourceId === sourceId && c.targetId === targetId);
    if (duplicate) {
      alert("A relationship already exists between these modules.");
      return;
    }

    onAddConnection(sourceId, targetId, type, description);
    
    // Reset Form
    setSourceId('');
    setTargetId('');
    setDescription('');
  };

  const fetchAISuggestions = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/knowledge/suggest-connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("AI connection suggestion fetch failed:", error);
      alert("Could not fetch suggestions. Verify server configuration.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAcceptSuggestion = (sug: SuggestedConnection) => {
    onAddConnection(sug.sourceId, sug.targetId, sug.type, sug.description);
    setSuggestions(prev => prev.filter(item => !(item.sourceId === sug.sourceId && item.targetId === sug.targetId)));
  };

  const getSubdomainName = (id: string) => {
    return subDomains.find(s => s.id === id)?.name || id;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Col 1: Manual Link establishment and list */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Plus className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-800 text-sm">Create Cross-Domain Link</h3>
          </div>

          <form onSubmit={handleCreateConnection} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Source Module</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  required
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">Select source...</option>
                  {subDomains.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Target Module</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  required
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">Select target...</option>
                  {subDomains.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Link Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="dependency">Dependency</option>
                  <option value="data-flow">Data-Flow</option>
                  <option value="security">Security</option>
                  <option value="integration">Integration</option>
                </select>
              </div>
              <div className="text-[10px] text-slate-400 font-medium flex items-center pl-1 pt-4 leading-normal">
                {type === 'dependency' && '⚠️ Source module requires Target module to operate.'}
                {type === 'data-flow' && '🔄 Information/payload triggers travel between nodes.'}
                {type === 'security' && '🔒 Target module enforces policies on Source.'}
                {type === 'integration' && '🔌 Direct custom third-party integrations.'}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Architectural Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain why these modules are linked and their operational trade-offs..."
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              <span>Establish Relationship Link</span>
            </button>
          </form>
        </div>

        {/* Existing Connections Lists */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-slate-800 text-sm">Active Repository Connections</h4>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
              {connections.length} Links
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {connections.length === 0 ? (
              <p className="text-center text-xs text-slate-400 italic py-6">No links established yet.</p>
            ) : (
              connections.map(conn => (
                <div key={conn.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-bold text-slate-800">{getSubdomainName(conn.sourceId)}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500 font-bold shrink-0">
                        {conn.type}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-slate-800">{getSubdomainName(conn.targetId)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{conn.description}</p>
                  </div>

                  <button
                    onClick={() => onDeleteConnection(conn.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    title="Delete Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Col 2: AI Connection Suggestions */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <h3 className="font-extrabold text-sm text-white tracking-tight">AI Integration Suggestion Engine</h3>
            </div>
            
            <button
              onClick={fetchAISuggestions}
              disabled={isSuggesting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSuggesting ? 'Analyzing...' : 'Analyze Stack'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Unleash Gemini's principal architecture models to analyze your current specifications and suggest high-value, secure cross-domain links with strategic system reasoning.
          </p>

          <hr className="my-4 border-slate-800" />

          {isSuggesting ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <p className="text-xs text-slate-400 font-bold animate-pulse">Running architectural analysis across all subdomains...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 text-slate-500">
              <HelpCircle className="w-8 h-8 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-400">No suggestions rendered yet</p>
                <p className="text-[10px] text-slate-500 mt-1">Click "Analyze Stack" to trigger Gemini's integration heuristics.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proposed Connections</div>
              
              {suggestions.map((sug, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/30 transition-all space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-white">{getSubdomainName(sug.sourceId)}</span>
                    <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
                      {sug.type}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="font-bold text-white">{getSubdomainName(sug.targetId)}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{sug.description}</p>
                  
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleAcceptSuggestion(sug)}
                      className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept proposed Link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
