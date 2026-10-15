import React, { useState, useMemo } from 'react';
import { 
  FileNode, 
  MONOREPO_TREE 
} from '../data/monorepoTree';
import { 
  Folder, 
  FolderOpen, 
  FileCode2, 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';

interface MonorepoExplorerProps {
  hinglishMode?: boolean;
}

export const MonorepoExplorer: React.FC<MonorepoExplorerProps> = ({ hinglishMode = false }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['root-apps', 'app-web', 'root-services', 'service-recruit', 'root-packages', 'root-integrations', 'integ-mcp'])
  );
  const [selectedFileId, setSelectedFileId] = useState<string>('recruit-matching');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Flatten helper to find selected file
  const allFiles = useMemo(() => {
    const list: FileNode[] = [];
    const traverse = (nodes: FileNode[]) => {
      for (const node of nodes) {
        list.push(node);
        if (node.children) traverse(node.children);
      }
    };
    traverse(MONOREPO_TREE);
    return list;
  }, []);

  const activeNode = useMemo(() => {
    return allFiles.find(n => n.id === selectedFileId) || allFiles.find(n => n.type === 'file') || allFiles[0];
  }, [allFiles, selectedFileId]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleCopyCode = () => {
    if (activeNode.content) {
      navigator.clipboard.writeText(activeNode.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (activeNode.content) {
      const blob = new Blob([activeNode.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeNode.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Render tree node recursively
  const renderTreeItem = (node: FileNode, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFileId === node.id;

    // Filter check
    if (searchQuery) {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.path.toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingChild = node.children?.some(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!matchesSearch && !hasMatchingChild) return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.id);
            } else {
              setSelectedFileId(node.id);
            }
          }}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`flex items-center gap-2 py-1.5 pr-3 rounded-lg text-xs cursor-pointer transition-colors ${
            isSelected
              ? 'bg-indigo-600/30 text-white font-medium border-l-2 border-indigo-500'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          {isFolder ? (
            <span className="text-slate-500 shrink-0">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          ) : (
            <span className="w-3.5" />
          )}

          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
            )
          ) : (
            <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
          )}

          <span className="truncate font-mono">{node.name}</span>

          {node.language && (
            <span className="ml-auto text-[10px] uppercase font-mono text-slate-500">
              {node.language}
            </span>
          )}
        </div>

        {isFolder && isExpanded && node.children && (
          <div className="border-l border-slate-800/80 ml-3">
            {node.children.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span>REPOSITORY ROOT: hiresaathi-ai/</span>
            <span>·</span>
            <span>MODULAR MONOREPO (TURBOREPO + UV)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Enterprise Monorepo Blueprint (5 to 500 Devs)
          </h2>
          <p className="text-xs text-slate-400">
            {hinglishMode
              ? 'Ek hi repository mein frontend, backend, AI orchestration, MCP integrations aur shared libraries—magar har module ki strict boundary.'
              : 'Unified codebase with independent package boundaries, shared type contracts, and isolated service environments.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-850 text-slate-300 border border-slate-700">
            {allFiles.length} Monorepo Nodes Indexed
          </span>
        </div>
      </div>

      {/* Explorer Workspace (Split Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tree Navigator (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-h-[750px] flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              hiresaathi-ai/
            </span>
            <button
              onClick={() => {
                setExpandedFolders(new Set(allFiles.filter(n => n.type === 'folder').map(n => n.id)));
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300"
            >
              Expand All
            </button>
          </div>

          {/* Tree Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter file or folder path..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Scrollable Tree Items */}
          <div className="overflow-y-auto flex-1 space-y-0.5 pr-1 font-mono">
            {MONOREPO_TREE.map(node => renderTreeItem(node, 0))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>TypeScript + Python uv</span>
            <span>pnpm workspaces</span>
          </div>
        </div>

        {/* Right: File Code Preview & Architectural Annotation (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* File Meta Header Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{activeNode.path}</span>
                {activeNode.teamOwner && (
                  <>
                    <span>·</span>
                    <span className="text-indigo-400">Owner: {activeNode.teamOwner}</span>
                  </>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 font-mono">{activeNode.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              {activeNode.content && (
                <>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadFile}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Architectural Importance Callout */}
          {activeNode.whyImportant && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-indigo-200 uppercase tracking-wider font-mono">
                  Why this file is vital for 5 to 500 developers:
                </span>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {activeNode.whyImportant}
                </p>
              </div>
            </div>
          )}

          {/* Code Viewer Panel */}
          {activeNode.content ? (
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{activeNode.name}</span>
                <span className="font-mono">{activeNode.language?.toUpperCase() || 'CODE'}</span>
              </div>

              <div className="p-4 overflow-x-auto max-h-[500px]">
                <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                  {activeNode.content.split('\n').map((line, idx) => (
                    <div key={idx} className="table-row">
                      <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-8">
                        {idx + 1}
                      </span>
                      <span className="table-cell">{line}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Folder className="w-10 h-10 text-indigo-400 mx-auto opacity-70" />
              <div>
                <h4 className="text-base font-bold text-white font-mono">{activeNode.path}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {activeNode.description}
                </p>
              </div>
              {activeNode.teamOwner && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Team Owner: {activeNode.teamOwner}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
