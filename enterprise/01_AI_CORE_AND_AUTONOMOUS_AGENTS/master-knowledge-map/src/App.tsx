import React, { useState, useEffect } from 'react';
import { Domain, SubDomain, Connection, KnowledgeMapData } from './types';
import { InteractiveGraph } from './components/InteractiveGraph';
import { DocumentEditor } from './components/DocumentEditor';
import { CopilotChat } from './components/CopilotChat';
import { ConnectionManager } from './components/ConnectionManager';
import JSZip from 'jszip';
import { 
  Layers, 
  Search, 
  FileDown, 
  CloudUpload, 
  Sparkles, 
  Plus, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp,
  Activity,
  Compass,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<KnowledgeMapData>({ domains: [], subDomains: [], connections: [] });
  const [selectedSubDomainId, setSelectedSubDomainId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionFilter, setConnectionFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Custom node states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubDomId, setNewSubDomId] = useState('');

  // 1. Fetch active state on mount
  useEffect(() => {
    fetch('/api/knowledge-map')
      .then(res => res.json())
      .then((mapData: KnowledgeMapData) => {
        setData(mapData);
        if (mapData.subDomains.length > 0) {
          // Select system architecture by default
          setSelectedSubDomainId('system-architecture');
        }
      })
      .catch(err => console.error("Failed to load map data on initialization:", err));
  }, []);

  // 2. Synchronize memory state with Express backend database
  const syncDatabaseState = async (updatedData: KnowledgeMapData) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/knowledge-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Database write operation failed');
    } catch (error) {
      console.error("Auto-sync database failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper getters
  const getActiveSubDomain = (): SubDomain | null => {
    return data.subDomains.find(s => s.id === selectedSubDomainId) || null;
  };

  const getActiveDomain = (domainId?: string): Domain | null => {
    const dId = domainId || getActiveSubDomain()?.domainId;
    return data.domains.find(d => d.id === dId) || null;
  };

  // 3. Document Action Handlers
  const handleUpdateDocumentContent = (content: string) => {
    if (!selectedSubDomainId) return;
    const updatedSubs = data.subDomains.map(s => 
      s.id === selectedSubDomainId ? { ...s, content, lastUpdated: new Date().toISOString() } : s
    );
    const updatedData = { ...data, subDomains: updatedSubs };
    setData(updatedData);
    syncDatabaseState(updatedData);
  };

  const handleUpdateDocumentStatus = (status: 'draft' | 'review' | 'completed') => {
    if (!selectedSubDomainId) return;
    const updatedSubs = data.subDomains.map(s => 
      s.id === selectedSubDomainId ? { ...s, status, lastUpdated: new Date().toISOString() } : s
    );
    const updatedData = { ...data, subDomains: updatedSubs };
    setData(updatedData);
    syncDatabaseState(updatedData);
  };

  const handleDeleteSubDomain = () => {
    if (!selectedSubDomainId) return;
    const confirmed = window.confirm("Are you sure you want to delete this subdomain module? This will also remove any active relationship links.");
    if (!confirmed) return;

    const updatedSubs = data.subDomains.filter(s => s.id !== selectedSubDomainId);
    const updatedConns = data.connections.filter(c => c.sourceId !== selectedSubDomainId && c.targetId !== selectedSubDomainId);
    
    const updatedData = { ...data, subDomains: updatedSubs, connections: updatedConns };
    setData(updatedData);
    setSelectedSubDomainId(updatedSubs.length > 0 ? updatedSubs[0].id : null);
    syncDatabaseState(updatedData);
  };

  // 4. Connection Handlers
  const handleAddConnection = (sourceId: string, targetId: string, type: any, desc: string) => {
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      sourceId,
      targetId,
      type,
      description: desc
    };
    const updatedConns = [...data.connections, newConn];
    const updatedData = { ...data, connections: updatedConns };
    setData(updatedData);
    syncDatabaseState(updatedData);
  };

  const handleDeleteConnection = (connId: string) => {
    const updatedConns = data.connections.filter(c => c.id !== connId);
    const updatedData = { ...data, connections: updatedConns };
    setData(updatedData);
    syncDatabaseState(updatedData);
  };

  // 5. Custom Subdomain Creator
  const handleAddCustomSubDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubDomId || !newSubDesc) return;

    const subId = newSubName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    // Check duplicates
    if (data.subDomains.some(s => s.id === subId)) {
      alert("A subdomain module with this name already exists.");
      return;
    }

    const newSub: SubDomain = {
      id: subId,
      domainId: newSubDomId,
      name: newSubName,
      description: newSubDesc,
      content: `# ${newSubName}\n\n## Overview\n${newSubDesc}\n\nThis is a custom module added to the Master Knowledge Map. Click on **AI Architect** to synthesize standard specifications or readiness checklists dynamically.`,
      status: 'draft',
      lastUpdated: new Date().toISOString()
    };

    const updatedSubs = [...data.subDomains, newSub];
    const updatedData = { ...data, subDomains: updatedSubs };
    setData(updatedData);
    setSelectedSubDomainId(subId);
    
    // Clear & Close form
    setNewSubName('');
    setNewSubDesc('');
    setNewSubDomId('');
    setShowAddModal(false);
    
    syncDatabaseState(updatedData);
  };

  // 6. Interactive Zip Exporter using JSZip
  const handleDownloadZipBundle = async () => {
    const zip = new JSZip();
    
    // Create a beautiful master index markdown file
    let indexMarkdown = `# Master Engineering Knowledge Map Index\n\n`;
    indexMarkdown += `Welcome to the multi-layered, interconnected engineering documentation repository. This document serves as the top-level index for all system architectures, designs, protocols, and operational blueprints.\n\n`;
    
    indexMarkdown += `## 📂 Primary Engineering Domains\n`;
    data.domains.forEach(dom => {
      indexMarkdown += `- **${dom.name}**: ${dom.description}\n`;
    });

    indexMarkdown += `\n## 🔗 Inter-Domain Core Architecture Relations\n`;
    if (data.connections.length === 0) {
      indexMarkdown += `*No relationships established in this iteration.*\n`;
    } else {
      data.connections.forEach((conn, idx) => {
        const sourceName = data.subDomains.find(s => s.id === conn.sourceId)?.name || conn.sourceId;
        const targetName = data.subDomains.find(s => s.id === conn.targetId)?.name || conn.targetId;
        indexMarkdown += `${idx + 1}. **${sourceName}** --[${conn.type.toUpperCase()}]--> **${targetName}**: *${conn.description}*\n`;
      });
    }

    indexMarkdown += `\n\n---\n*Compiled and exported dynamically via AI Studio Build.*`;
    zip.file("MASTER_INDEX.md", indexMarkdown);

    // Group markdown files by domain subfolders
    data.domains.forEach(dom => {
      const folder = zip.folder(dom.id);
      const domainSubs = data.subDomains.filter(s => s.domainId === dom.id);
      
      domainSubs.forEach(sub => {
        const safeName = `${sub.id.replace(/-/g, '_')}.md`;
        folder?.file(safeName, sub.content || `# ${sub.name}\n\n*Draft spec - No content written yet.*`);
      });
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'engineering_master_knowledge_map.zip';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("ZIP Generation failed:", error);
      alert("Failed to export documentation package. Please try again.");
    }
  };

  // Global counts
  const totalTasksCount = () => {
    let completed = 0;
    let total = 0;
    data.subDomains.forEach(sub => {
      if (!sub.content) return;
      const checkboxRegex = /^-\s*\[([ xX])\]/gm;
      const matches = [...sub.content.matchAll(checkboxRegex)];
      total += matches.length;
      completed += matches.filter(m => m[1].toLowerCase() === 'x').length;
    });
    return { completed, total };
  };

  const taskStats = totalTasksCount();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Dynamic Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Master Knowledge Map</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-100 text-indigo-700">
                Core Engine v1.0
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Multi-layered architectural blueprints & relations</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          {isSyncing && (
            <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Saving State...</span>
            </span>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>Add Module</span>
          </button>

          <button
            onClick={handleDownloadZipBundle}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download ZIP</span>
          </button>
        </div>
      </header>

      {/* Main Core Dashboard Layout */}
      <main className="flex-1 p-6 space-y-6 max-w-[1500px] mx-auto w-full">
        {/* Metric Summary Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engineering Domains</div>
              <div className="text-lg font-black text-slate-800">{data.domains.length} Core Hubs</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subdomain Modules</div>
              <div className="text-lg font-black text-slate-800">{data.subDomains.length} Active Specs</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Relations</div>
              <div className="text-lg font-black text-slate-800">{data.connections.length} Links Drawn</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready Checklist</div>
              <div className="text-lg font-black text-slate-800">
                {taskStats.completed}/{taskStats.total} Tasks
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Filters Bar */}
        <section className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-1 items-center gap-2 max-w-md bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-shadow">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domain modules (e.g., APIs, threat)..."
              className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">Filter relations:</span>
              <select
                value={connectionFilter}
                onChange={(e) => setConnectionFilter(e.target.value)}
                className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Connections</option>
                <option value="dependency">Dependencies only</option>
                <option value="data-flow">Data-Flows only</option>
                <option value="security">Security boundaries</option>
                <option value="integration">Integrations</option>
              </select>
            </div>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                isChatOpen 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Copilot Chat</span>
            </button>
          </div>
        </section>

        {/* Core Double Layout */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Visual Map Canvas */}
          <div className="xl:col-span-7 h-[640px]">
            <InteractiveGraph
              domains={data.domains}
              subDomains={data.subDomains}
              connections={data.connections}
              selectedSubDomainId={selectedSubDomainId}
              onSelectSubDomain={setSelectedSubDomainId}
              searchQuery={searchQuery}
              connectionFilter={connectionFilter}
            />
          </div>

          {/* Module Specs Reader/Editor */}
          <div className="xl:col-span-5 h-[640px]">
            <DocumentEditor
              subDomain={getActiveSubDomain()}
              domain={getActiveDomain()}
              subDomainsList={data.subDomains.map(s => ({ id: s.id, name: s.name }))}
              onUpdateContent={handleUpdateDocumentContent}
              onUpdateStatus={handleUpdateDocumentStatus}
              onDeleteSubDomain={handleDeleteSubDomain}
              onSubDomainLinkClick={setSelectedSubDomainId}
            />
          </div>
        </section>

        {/* Bottom Modules & AI Connection Manager */}
        <section className="border-t border-slate-200/50 pt-6">
          <h2 className="text-base font-black text-slate-800 tracking-tight mb-4 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Inter-Domain Relationships & Custom Connections</span>
          </h2>
          <ConnectionManager
            subDomains={data.subDomains}
            connections={data.connections}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
          />
        </section>

        {/* Floating Grounded Copilot Drawer */}
        {isChatOpen && (
          <div className="fixed bottom-6 right-6 z-40 w-[420px] h-[520px] shadow-2xl transition-all animate-in slide-in-from-bottom duration-300 pointer-events-auto">
            <div className="relative h-full">
              <button
                onClick={() => setIsChatOpen(false)}
                className="absolute top-4 right-16 z-50 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Close Chat
              </button>
              <CopilotChat
                activeSubDomainId={selectedSubDomainId}
                subDomainsList={data.subDomains.map(s => ({ id: s.id, name: s.name }))}
                onJumpToSubDomain={setSelectedSubDomainId}
              />
            </div>
          </div>
        )}

        {/* Floating chat reopen toggle if closed */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all flex items-center gap-2 cursor-pointer animate-bounce"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold">Ask AI Copilot</span>
          </button>
        )}

        {/* Add Subdomain Drawer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 max-w-md w-full relative animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Plus className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm">Add Custom Subdomain Module</h3>
              </div>

              <form onSubmit={handleAddCustomSubDomain} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Parent Domain Hub</label>
                  <select
                    value={newSubDomId}
                    onChange={(e) => setNewSubDomId(e.target.value)}
                    required
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">Select parent domain...</option>
                    {data.domains.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Module Name</label>
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="e.g., Vector Databases, Auth0 Gateway..."
                    required
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Brief Description</label>
                  <textarea
                    value={newSubDesc}
                    onChange={(e) => setNewSubDesc(e.target.value)}
                    placeholder="Explain what architectural role this custom module fulfills..."
                    required
                    rows={3}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                  >
                    Add Custom Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 mt-12">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Master Knowledge Map Repository. Grounded by server-side Gemini 3.6 Flash.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Architecture Blueprint</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">API References</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
