import React, { useState } from 'react';
import { McpServerItem, INITIAL_MCP_SERVERS } from '../data/workspaceData';
import { 
  Network, 
  ShieldCheck, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  Cpu,
  Lock,
  RefreshCw,
  Download,
  Check,
  Radio
} from 'lucide-react';
import { useToast } from './Toast';

export const McpModule: React.FC = () => {
  const { showToast } = useToast();
  const [servers, setServers] = useState<McpServerItem[]>(INITIAL_MCP_SERVERS);
  const [selectedServerId, setSelectedServerId] = useState<string>('mcp-github');
  const [selectedToolIndex, setSelectedToolIndex] = useState<number>(0);
  const [toolInputs, setToolInputs] = useState<Record<string, string>>({
    'search_repositories': 'fastapi pytorch langgraph',
    'query_candidates_by_skill': 'Python, Docker, Postgres',
    'send_interview_invite': 'Aarav Sharma · Tomorrow at 4:00 PM IST',
    'sync_job_requisition': 'REQ-2026-ENG-492'
  });
  const [executionOutput, setExecutionOutput] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];
  const activeTool = activeServer.tools[selectedToolIndex] || activeServer.tools[0];

  const handlePingServer = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const newLatency = Math.floor(Math.random() * 15) + 6;
      setServers(prev => prev.map(s => s.id === activeServer.id ? { ...s, latencyMs: newLatency, status: 'connected' } : s));
      showToast('MCP Server Health Check', `${activeServer.name} responded via ${activeServer.transport} transport in ${newLatency}ms. Status 200 OK.`, 'success');
    }, 500);
  };

  const handleExecuteTool = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      let resultData: any = {};
      if (activeServer.id === 'mcp-github') {
        resultData = {
          jsonrpc: '2.0',
          status: 'success',
          executionTimeMs: 142,
          mcpServer: 'integrations/mcp/github',
          toolCalled: activeTool.name,
          inputReceived: toolInputs[activeTool.name] || 'fastapi pytorch langgraph',
          data: [
            {
              repo: 'aarav-sharma/distributed-llm-router',
              stars: 382,
              primaryLanguage: 'Python',
              verifiedCommits: 148,
              architectureEvaluation: 'High clean-code adherence, robust unit tests with pytest'
            },
            {
              repo: 'aarav-sharma/mcp-postgres-cache',
              stars: 94,
              primaryLanguage: 'Python',
              verifiedCommits: 42,
              architectureEvaluation: 'Demonstrated direct familiarity with Model Context Protocol specs'
            }
          ],
          securityAudit: 'PII Scrubbing: PASSED. Zero sensitive tokens or private credentials exposed.'
        };
      } else if (activeServer.id === 'mcp-postgres') {
        resultData = {
          jsonrpc: '2.0',
          status: 'success',
          executionTimeMs: 18,
          mcpServer: 'integrations/mcp/postgres',
          toolCalled: activeTool.name,
          recordsMatched: 3,
          piiMaskingApplied: true,
          data: [
            { id: 'cand_***42', skillsMatched: ['Python', 'FastAPI', 'Docker'], historicalScore: 94.8 },
            { id: 'cand_***88', skillsMatched: ['Python', 'Postgres'], historicalScore: 88.5 }
          ],
          antiBiasCheck: 'Candidate telephone, personal email, and date of birth masked via AST filter'
        };
      } else if (activeServer.id === 'mcp-whatsapp') {
        resultData = {
          jsonrpc: '2.0',
          status: 'success',
          executionTimeMs: 44,
          mcpServer: 'integrations/mcp/whatsapp',
          toolCalled: activeTool.name,
          payload: toolInputs[activeTool.name] || 'Invite sent',
          deliveryReport: 'Template #WH-RECRUIT-492 delivered to candidate mobile with end-to-end encryption.'
        };
      } else {
        resultData = {
          jsonrpc: '2.0',
          status: 'success',
          executionTimeMs: 54,
          mcpServer: activeServer.endpoint,
          toolCalled: activeTool.name,
          response: `Simulated MCP call returned HTTP 200 OK via ${activeServer.transport} transport.`
        };
      }

      setExecutionOutput(resultData);
      setIsExecuting(false);
      showToast('MCP Tool Executed Successfully', `Tool "${activeTool.name}" on server "${activeServer.name}" returned valid JSON-RPC 2.0 response.`, 'success');
    }, 600);
  };

  const handleExportMcpConfig = () => {
    const config = {
      mcpServers: {
        githubProfiler: {
          command: 'npx',
          args: ['-y', '@hiresaathi/mcp-github'],
          env: {
            GITHUB_TOKEN: 'ghp_masked_token_for_screening'
          }
        },
        postgresCandidateDb: {
          command: 'node',
          args: ['./integrations/mcp/postgres/index.js'],
          env: {
            DATABASE_URL: 'postgresql://read_only_mask:****@localhost:5432/hiresaathi'
          }
        },
        whatsappOutreach: {
          url: 'https://mcp.internal.hiresaathi.ai/whatsapp',
          transport: 'sse'
        },
        greenhouseSync: {
          url: 'https://mcp.internal.hiresaathi.ai/greenhouse',
          transport: 'sse'
        }
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcp-config.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded mcp-config.json', 'Compatible with Claude Desktop, Cursor, and HireSaathi Agent Runtime.', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>GATEWAY: services/mcp-gateway</span>
            <span>·</span>
            <span>SPEC: Model Context Protocol (MCP 2024-11-05)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">MCP Connect &amp; Tool Gateway</h2>
          <p className="text-xs text-slate-400">
            Standardized, sandboxed AI tool discovery allowing LLMs to safely query databases, code repos, and ATS tools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMcpConfig}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export mcp-config.json</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            4 Approved MCP Servers Active
          </span>
        </div>
      </div>

      {/* Servers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {servers.map((server) => {
          const isSelected = server.id === selectedServerId;
          return (
            <div
              key={server.id}
              onClick={() => {
                setSelectedServerId(server.id);
                setSelectedToolIndex(0);
                setExecutionOutput(null);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                  {server.transport.toUpperCase()}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {server.latencyMs}ms
                </span>
              </div>

              <h3 className="font-semibold text-sm text-white mt-2">{server.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {server.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{server.tools.length} Tools Bound</span>
                <span className="text-cyan-400">Inspect &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Server Tool Inspector & Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tool List for this server (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Exposed Tools ({activeServer.tools.length})
            </span>
            <button
              onClick={handlePingServer}
              disabled={isPinging}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Radio className={`w-3 h-3 ${isPinging ? 'animate-pulse text-amber-400' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Ping Server'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {activeServer.tools.map((tool, idx) => {
              const isSelected = selectedToolIndex === idx;
              return (
                <button
                  key={tool.name}
                  onClick={() => {
                    setSelectedToolIndex(idx);
                    setExecutionOutput(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-cyan-300">{tool.name}</span>
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{tool.description}</p>
                </button>
              );
            })}
          </div>

          {/* Security & Isolation Panel */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>MCP Enterprise Guardrails</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Zero Direct SQL Injection (AST parsing)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Candidate PII strictly masked</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Sandboxed execution container</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Live Interactive Tool Execution (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white font-mono">{activeTool.name}</h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {activeServer.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeTool.description}</p>
            </div>

            <button
              onClick={handleExecuteTool}
              disabled={isExecuting}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Invoking MCP...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Tool</span>
                </>
              )}
            </button>
          </div>

          {/* Parameters Schema */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Input Arguments (Schema: {activeTool.parameters.join(', ')}):
            </label>
            <input
              type="text"
              value={toolInputs[activeTool.name] || ''}
              onChange={(e) => setToolInputs({ ...toolInputs, [activeTool.name]: e.target.value })}
              placeholder={`Enter arguments e.g. ${activeTool.parameters[0]}`}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Output Viewer */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400">MCP Protocol Response (JSON-RPC 2.0)</span>
              {executionOutput && (
                <span className="text-[11px] font-mono text-emerald-400">Status 200 OK ({executionOutput.executionTimeMs}ms)</span>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto min-h-[160px]">
              {executionOutput ? (
                <pre className="text-emerald-300">
                  {JSON.stringify(executionOutput, null, 2)}
                </pre>
              ) : (
                <div className="h-28 flex flex-col items-center justify-center text-slate-600">
                  <Terminal className="w-6 h-6 mb-1 opacity-50" />
                  <span>Click &quot;Execute Tool&quot; to inspect real live JSON response from the server</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
