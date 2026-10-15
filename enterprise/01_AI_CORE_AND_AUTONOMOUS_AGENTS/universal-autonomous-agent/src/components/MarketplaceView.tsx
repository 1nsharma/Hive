import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Download, 
  Check, 
  Star, 
  ShieldCheck, 
  Search, 
  Layers, 
  Bot, 
  Wrench, 
  Workflow, 
  Sparkles,
  Zap
} from 'lucide-react';
import { MarketplaceItem } from '../types';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  onInstall: (itemId: string) => Promise<void>;
  onToggle: (itemId: string, isEnabled: boolean) => Promise<void>;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  onInstall,
  onToggle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'agent', label: 'Autonomous Agents' },
    { id: 'mcp_server', label: 'MCP Servers' },
    { id: 'workflow', label: 'Workflows' },
    { id: 'skill', label: 'Skills' },
    { id: 'tool', label: 'Tools' },
    { id: 'integration', label: 'Integrations' }
  ];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleInstall = async (id: string) => {
    setProcessingId(id);
    try {
      await onInstall(id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Agent OS Marketplace & Registry
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Extensible Ecosystem
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Install certified agents, community MCP servers, zero-trust tools, and autonomous workflow blueprints.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isProcessing = processingId === item.id;

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-white text-base mt-1.5">{item.name}</h3>
                    <span className="text-[11px] text-slate-500 block">by {item.author} • v{item.version}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Scopes required */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" /> Required Scopes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.requiredScopes.map((scope) => (
                      <span key={scope} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Install / Toggle Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-mono">
                  {item.installsCount.toLocaleString()} installs
                </span>

                {item.isInstalled ? (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Installed
                    </span>
                    <button
                      onClick={() => onToggle(item.id, !item.isEnabled)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        item.isEnabled
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isProcessing}
                    onClick={() => handleInstall(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition-all disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isProcessing ? 'Installing...' : 'Install Module'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
