import React from 'react';
import { 
  Wrench, 
  Terminal, 
  ShieldCheck, 
  Key, 
  ExternalLink, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Layers 
} from 'lucide-react';
import { MCPTool, RiskLevel } from '../types';

interface MCPToolMarketplaceProps {
  mcpTools: MCPTool[];
  onToggleTool: (toolId: string, isEnabled: boolean) => Promise<void>;
}

export const MCPToolMarketplace: React.FC<MCPToolMarketplaceProps> = ({
  mcpTools,
  onToggleTool
}) => {
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL RISK</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">HIGH RISK (HITL)</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Pillar 4: Action & Execution Layer</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">Model Context Protocol (MCP)</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">MCP Tool & Server Registry</h2>
            <p className="text-sm text-slate-400 mt-1">
              Standardized Model Context Protocol client allowing the autonomous agent to securely query repositories, browse web intelligence, draft messages, and interact with external systems.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span className="font-mono text-cyan-400">MCP Spec 1.0</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{mcpTools.filter(t => t.isEnabled).length} Enabled</span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mcpTools.map((tool) => (
          <div 
            key={tool.id} 
            className={`bg-slate-900 border rounded-xl p-5 transition-all flex flex-col justify-between ${
              tool.isEnabled 
                ? 'border-slate-800 hover:border-slate-700' 
                : 'border-slate-900 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{tool.name}</h3>
                    {getRiskBadge(tool.riskLevel)}
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 mt-0.5 block">
                    {tool.serverUri}
                  </span>
                </div>

                <button
                  id={`toggle-tool-${tool.id}`}
                  type="button"
                  onClick={() => onToggleTool(tool.id, !tool.isEnabled)}
                  className={`p-1 rounded transition-all ${
                    tool.isEnabled ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-500'
                  }`}
                  title={tool.isEnabled ? 'Disable Tool' : 'Enable Tool'}
                >
                  {tool.isEnabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{tool.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              {/* OAuth Scopes (Least Privilege) */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Key className="w-3 h-3 text-slate-400" />
                  OAuth Scopes:
                </span>
                <div className="flex flex-wrap gap-1">
                  {tool.requiredScopes.map((scope, idx) => (
                    <span key={idx} className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schema parameters preview */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  Parameters:
                </span>
                <span className="font-mono text-[10px] text-slate-400 truncate">
                  {Object.entries(tool.parametersSchema).map(([k, v]) => `${k}:${v}`).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
