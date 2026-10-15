import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Plus, 
  Tag, 
  Search, 
  Check, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  Database,
  Sliders
} from 'lucide-react';
import { DigitalTwinProfile, MemoryNode } from '../types';

interface DigitalTwinMemoryProps {
  activeProfile: DigitalTwinProfile;
  memories: MemoryNode[];
  onAddMemory: (node: Partial<MemoryNode>) => Promise<void>;
  onUpdateProfileWeights: (tenantId: string, updates: Partial<DigitalTwinProfile>) => Promise<void>;
}

export const DigitalTwinMemory: React.FC<DigitalTwinMemoryProps> = ({
  activeProfile,
  memories,
  onAddMemory,
  onUpdateProfileWeights
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<MemoryNode['type']>('semantic_rag');
  const [newTags, setNewTags] = useState('');

  const [weights, setWeights] = useState({ ...activeProfile.heuristicWeights });

  const filteredMemories = memories.filter((m) => {
    const matchesQuery = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesQuery && matchesType;
  });

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    onUpdateProfileWeights(activeProfile.id, { heuristicWeights: updated });
  };

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    await onAddMemory({
      title: newTitle,
      content: newContent,
      type: newType,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowAddModal(false);
  };

  const getTypeBadge = (type: MemoryNode['type']) => {
    switch (type) {
      case 'learned_heuristic':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">LEARNED HEURISTIC</span>;
      case 'semantic_rag':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">SEMANTIC RAG</span>;
      case 'episodic':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">EPISODIC MISSION</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">SHORT TERM</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Digital Twin Identity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-950">
              {activeProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">{activeProfile.name}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Digital Twin ID: {activeProfile.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">{activeProfile.role} • {activeProfile.organization}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{activeProfile.bio}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="add-memory-btn"
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Knowledge Node</span>
            </button>
          </div>
        </div>

        {/* Persona Tone & Guardrails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Core Strategic Goals:</span>
            <ul className="space-y-1.5">
              {activeProfile.primaryGoals.map((goal, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Safety Guardrails & Policies:</span>
            <ul className="space-y-1.5">
              {activeProfile.guardrails.map((rule, idx) => (
                <li key={idx} className="text-xs text-rose-300 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dynamic Heuristic Weights Calibration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Dynamic Heuristic Weights (Self-Learning Calibration)</h3>
          </div>
          <span className="text-xs text-slate-400">Autonomously recalibrated after every target reflection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {/* Autonomy */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300">Autonomy Threshold</span>
              <span className="text-xs font-bold text-cyan-400">{weights.autonomyThreshold}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={weights.autonomyThreshold}
              onChange={(e) => handleWeightChange('autonomyThreshold', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Higher = Acts without asking</span>
          </div>

          {/* Risk Tolerance */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300">Risk Tolerance</span>
              <span className="text-xs font-bold text-amber-400">{weights.riskTolerance}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={weights.riskTolerance}
              onChange={(e) => handleWeightChange('riskTolerance', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Controls threshold for HITL gate</span>
          </div>

          {/* Thoroughness */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300">Thoroughness</span>
              <span className="text-xs font-bold text-emerald-400">{weights.thoroughness}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={weights.thoroughness}
              onChange={(e) => handleWeightChange('thoroughness', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Depth of research & verification steps</span>
          </div>

          {/* Learning Adaptability */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300">Learning Adaptability</span>
              <span className="text-xs font-bold text-indigo-400">{weights.learningAdaptability}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={weights.learningAdaptability}
              onChange={(e) => handleWeightChange('learningAdaptability', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Speed of strategy weight adjustments</span>
          </div>
        </div>
      </div>

      {/* Memory Bank List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Digital Twin Vector Memory Bank</h3>
            <span className="text-xs text-slate-500">({memories.length} indexed nodes)</span>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              aria-label="Filter memory by category"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="learned_heuristic">Learned Heuristics</option>
              <option value="semantic_rag">Semantic RAG</option>
              <option value="episodic">Episodic History</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => (
            <div key={mem.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{mem.title}</h4>
                  {getTypeBadge(mem.type)}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{mem.content}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {mem.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">
                  Cosine Match: {(mem.relevanceScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Ingest Knowledge Entity into Digital Twin</h3>
            <p className="text-xs text-slate-400 mb-4">
              Embed domain knowledge, personal style rules, or past performance lessons into the agent's vector database.
            </p>

            <form onSubmit={handleSaveMemory} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Memory Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="semantic_rag">Semantic RAG (Domain Knowledge / Facts)</option>
                  <option value="learned_heuristic">Learned Heuristic (Strategy & Tone Rules)</option>
                  <option value="episodic">Episodic Mission (Past Project Outcomes)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rule: High-converting LinkedIn Hooks"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Content / Knowledge Entity</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the knowledge or heuristic rule in detail..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. strategy, outreach, benchmarks"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
                >
                  Save into Vector Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
