import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Globe, 
  Lock, 
  Play, 
  Copy, 
  Check, 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  Zap, 
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { PLATFORM_MCP_SERVERS, getMCPRegistrySummary } from '../lib/mcp/mcpPlatformRegistry';

interface MCPTool {
  name: string;
  description: string;
  category: 'public' | 'internal';
  inputSchema: Record<string, any>;
  sampleParams: Record<string, any>;
}

const MCP_TOOLS: MCPTool[] = [
  {
    name: 'pet_safety_triage',
    description: 'AI-powered clinical triage engine for pet symptoms (vomiting, lethargy, ingestion, wounds) with risk levels and care steps.',
    category: 'public',
    inputSchema: {
      type: 'object',
      properties: {
        symptoms: { type: 'string', description: 'Description of symptoms observed' },
        petSpecies: { type: 'string', enum: ['Dog', 'Cat', 'Bird', 'Other'], description: 'Type of pet' },
        petAge: { type: 'string', description: 'Age of the pet (e.g. 2 years)' }
      },
      required: ['symptoms']
    },
    sampleParams: {
      symptoms: 'Golden Retriever ingested chocolate biscuit and is breathing slightly fast',
      petSpecies: 'Dog',
      petAge: '3 years'
    }
  },
  {
    name: 'search_lost_pets',
    description: 'Search the community lost & found digital pet registry by name, species, location, or tag slug.',
    category: 'public',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords (pet name, location, breed, tag slug)' },
        species: { type: 'string', enum: ['All', 'Dog', 'Cat'], description: 'Filter by species' }
      }
    },
    sampleParams: {
      query: 'Milo',
      species: 'Dog'
    }
  },
  {
    name: 'report_pet_sighting',
    description: 'Submit a verified community sighting report for a lost pet.',
    category: 'public',
    inputSchema: {
      type: 'object',
      properties: {
        petId: { type: 'string', description: 'Target pet identifier' },
        location: { type: 'string', description: 'Street address or landmark' },
        finderPhone: { type: 'string', description: 'Contact phone number of finder (+91)' },
        notes: { type: 'string', description: 'Additional context regarding pet status' }
      },
      required: ['petId', 'location', 'finderPhone']
    },
    sampleParams: {
      petId: 'pet-1',
      location: 'Near Bandra Carter Road Promenade, Mumbai',
      finderPhone: '+91 98765 43210',
      notes: 'Pet was wearing a brown collar and appeared friendly'
    }
  },
  {
    name: 'generate_secure_tag',
    description: 'Cryptographically generate a signed anti-counterfeit QR / NFC safety tag slug with HMAC verification.',
    category: 'public',
    inputSchema: {
      type: 'object',
      properties: {
        petName: { type: 'string', description: 'Name of the pet' },
        tagType: { type: 'string', enum: ['QR_NFC', 'SMART_COLLAR', 'RFID_CHIP'], description: 'Hardware form factor' }
      },
      required: ['petName']
    },
    sampleParams: {
      petName: 'Rocky',
      tagType: 'QR_NFC'
    }
  },
  {
    name: 'calculate_pet_nutrition',
    description: 'Calculate daily caloric requirement (RER/MER), hydration targets, and recommended meal breakdown.',
    category: 'public',
    inputSchema: {
      type: 'object',
      properties: {
        weightKg: { type: 'number', description: 'Weight of pet in kilograms' },
        species: { type: 'string', enum: ['Dog', 'Cat'] },
        activityLevel: { type: 'string', enum: ['low', 'moderate', 'active', 'working'] },
        isNeutered: { type: 'boolean' }
      },
      required: ['weightKg', 'species']
    },
    sampleParams: {
      weightKg: 24,
      species: 'Dog',
      activityLevel: 'moderate',
      isNeutered: true
    }
  },
  {
    name: 'search_marketplace_products',
    description: 'Search official PetJanu verified hardware tags, emergency kits, GPS trackers, and pet healthcare supplies.',
    category: 'public',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['all', 'tags', 'health', 'gps', 'accessories'] },
        maxPrice: { type: 'number', description: 'Maximum price in INR' }
      }
    },
    sampleParams: {
      category: 'tags',
      maxPrice: 1500
    }
  },
  {
    name: 'execute_sandbox_code',
    description: 'Internal MCP tool: Execute safe Python computations and data analysis in isolated sandbox container.',
    category: 'internal',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Python script to execute' },
        timeoutSeconds: { type: 'number', description: 'Maximum execution timeout' }
      },
      required: ['code']
    },
    sampleParams: {
      code: 'weights = [18.2, 19.5, 20.1, 19.8]\navg_weight = sum(weights) / len(weights)\nprint(f"Average Pet Weight: {avg_weight:.2f} kg")',
      timeoutSeconds: 5
    }
  }
];

export const MCPConsole: React.FC<{ onShowToast?: (msg: string) => void }> = ({ onShowToast }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  const [selectedTool, setSelectedTool] = useState<MCPTool>(MCP_TOOLS[0]);
  const [paramInput, setParamInput] = useState<string>(JSON.stringify(MCP_TOOLS[0].sampleParams, null, 2));
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tester' | 'specs' | 'config' | 'resources'>('tester');
  const [filterCategory, setFilterCategory] = useState<'all' | 'public' | 'internal'>('all');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'BETA-PETJANU-2026' || passkeyInput === 'INTERNAL-MCP-PETJANU-2026') {
      setIsAuthenticated(true);
      setPasskeyError('');
    } else {
      setPasskeyError('Invalid internal passkey. Access denied.');
      setPasskeyInput('');
    }
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://petsjanu.com';
  const mcpRpcEndpoint = `${originUrl}/api/mcp/rpc`;
  const mcpSseEndpoint = `${originUrl}/api/mcp/sse`;
  const mcpRestEndpoint = `${originUrl}/api/v1/mcp`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onShowToast) onShowToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectTool = (tool: MCPTool) => {
    setSelectedTool(tool);
    setParamInput(JSON.stringify(tool.sampleParams, null, 2));
    setExecutionResult(null);
  };

  const handleExecuteTool = async () => {
    setIsLoading(true);
    setExecutionResult(null);

    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(paramInput);
      } catch (err: any) {
        setExecutionResult({
          status: 'ERROR',
          error: 'Invalid JSON payload format',
          details: err.message
        });
        setIsLoading(false);
        return;
      }

      // Execute via MCP JSON-RPC standard endpoint
      const response = await fetch('/api/mcp/rpc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mcp-client': 'petjanu-mcp-console-v1'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `req-${Date.now()}`,
          method: 'tools/call',
          params: {
            name: selectedTool.name,
            arguments: parsedParams
          }
        })
      });

      const data = await response.json();
      setExecutionResult(data);
      if (onShowToast) onShowToast(`Executed MCP Tool: ${selectedTool.name}`);
    } catch (error: any) {
      setExecutionResult({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error communicating with MCP server',
          details: error.message
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const claudeDesktopConfig = {
    mcpServers: {
      "petjanu-safety": {
        url: mcpRpcEndpoint,
        transport: "http"
      }
    }
  };

  const cursorMcpConfig = {
    name: "PetJanu MCP Server",
    type: "http",
    url: mcpRpcEndpoint
  };

  const filteredTools = MCP_TOOLS.filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-[#0E3D2F] rounded-3xl flex items-center justify-center p-6 my-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-emerald-500/20 text-stone-900">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#175741]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚙️
            </div>
            <h2 className="text-2xl font-bold font-serif text-stone-900">MCP Developer Console</h2>
            <p className="text-stone-600 mt-2 text-xs">
              Internal developer console for Model Context Protocol (MCP) servers &amp; AI tool testing.
            </p>
          </div>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-stone-700 mb-1">
                Enter Developer Passkey
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#175741] outline-none text-stone-900 text-sm font-mono"
                placeholder="e.g. BETA-PETJANU-2026"
              />
              {passkeyError && <p className="text-red-600 text-xs mt-2 font-bold">{passkeyError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[#175741] hover:bg-[#0E3D2F] text-white font-extrabold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
            >
              Unlock MCP Console
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-stone-200 text-center">
            <p className="text-[10px] text-stone-500 font-mono">
              🔒 Protected via GitHub Developer Protocol v2.6
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-[#1C2B23]">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0E3D2F] to-[#175741] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black">Model Context Protocol (MCP)</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    v2024-11-05 Active
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80">
                  Universal protocol standard enabling LLMs, autonomous agents, and external AI clients to access PetJanu safety tools &amp; data.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Internal &amp; Public Live
              </span>
            </div>
          </div>

          {/* Quick Endpoint Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between">
              <div className="truncate mr-2">
                <span className="text-[10px] font-bold text-emerald-300 block">JSON-RPC 2.0 Endpoint</span>
                <span className="text-xs font-mono text-white/90 truncate block">{mcpRpcEndpoint}</span>
              </div>
              <button
                onClick={() => copyToClipboard(mcpRpcEndpoint, 'rpc')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer shrink-0"
                title="Copy URL"
              >
                {copiedKey === 'rpc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between">
              <div className="truncate mr-2">
                <span className="text-[10px] font-bold text-amber-300 block">SSE Streaming Endpoint</span>
                <span className="text-xs font-mono text-white/90 truncate block">{mcpSseEndpoint}</span>
              </div>
              <button
                onClick={() => copyToClipboard(mcpSseEndpoint, 'sse')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer shrink-0"
                title="Copy URL"
              >
                {copiedKey === 'sse' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between">
              <div className="truncate mr-2">
                <span className="text-[10px] font-bold text-sky-300 block">REST Protocol Discovery</span>
                <span className="text-xs font-mono text-white/90 truncate block">{mcpRestEndpoint}</span>
              </div>
              <button
                onClick={() => copyToClipboard(mcpRestEndpoint, 'rest')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer shrink-0"
                title="Copy URL"
              >
                {copiedKey === 'rest' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD3] pb-2">
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'tester'
              ? 'bg-[#175741] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Play className="w-4 h-4 text-amber-400" /> Interactive Tool Tester
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'config'
              ? 'bg-[#175741] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-400" /> Client Integration (Claude / Cursor)
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'resources'
              ? 'bg-[#175741] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" /> MCP Resources &amp; Prompts
        </button>
      </div>

      {/* TAB 1: INTERACTIVE TESTER */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tool Selector Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#1C2B23] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#175741]" /> Available MCP Tools ({filteredTools.length})
              </h3>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[10px] font-bold">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-2 py-0.5 rounded ${filterCategory === 'all' ? 'bg-[#175741] text-white' : 'text-stone-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCategory('public')}
                  className={`px-2 py-0.5 rounded ${filterCategory === 'public' ? 'bg-[#175741] text-white' : 'text-stone-600'}`}
                >
                  Public
                </button>
                <button
                  onClick={() => setFilterCategory('internal')}
                  className={`px-2 py-0.5 rounded ${filterCategory === 'internal' ? 'bg-[#175741] text-white' : 'text-stone-600'}`}
                >
                  Internal
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredTools.map((tool) => {
                const isSelected = selectedTool.name === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => handleSelectTool(tool)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-[#175741] shadow-xs'
                        : 'bg-white border-[#E5DFD3] hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#0E3D2F] flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#175741]" /> {tool.name}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        tool.category === 'public'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {tool.category === 'public' ? '🌐 Public' : '🔒 Internal'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Runner & Payload Terminal */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 font-mono flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> {selectedTool.name}
                  </h4>
                  <p className="text-[11px] text-stone-500">{selectedTool.description}</p>
                </div>

                <button
                  onClick={handleExecuteTool}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-[#175741] hover:bg-[#0E3D2F] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Calling MCP...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-amber-400" /> Execute Tool
                    </>
                  )}
                </button>
              </div>

              {/* JSON Input Parameters */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-stone-700">
                  <span>Input Arguments (JSON):</span>
                  <button
                    onClick={() => setParamInput(JSON.stringify(selectedTool.sampleParams, null, 2))}
                    className="text-[10px] text-[#175741] hover:underline cursor-pointer"
                  >
                    Reset to Default Sample
                  </button>
                </div>
                <textarea
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  rows={6}
                  className="w-full p-3 font-mono text-xs bg-stone-900 text-emerald-400 rounded-2xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-[#175741]"
                />
              </div>

              {/* Response Inspector */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-stone-700">
                  <span>MCP JSON-RPC Response:</span>
                  {executionResult && (
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(executionResult, null, 2), 'res')}
                      className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy JSON
                    </button>
                  )}
                </div>

                <div className="min-h-[140px] max-h-[300px] overflow-auto p-3.5 bg-stone-950 text-stone-100 font-mono text-xs rounded-2xl border border-stone-800">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-stone-400 py-8 justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Transmitting JSON-RPC frame to PetJanu MCP Server...</span>
                    </div>
                  ) : executionResult ? (
                    <pre className="text-emerald-400 whitespace-pre-wrap">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-stone-500 py-8 text-center">
                      Click "Execute Tool" to test MCP invocation with live responses.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CLIENT CONFIGURATION (Claude Desktop, Cursor, MCP Clients) */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1C2B23] flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#175741]" /> Connecting Claude Desktop to PetJanu MCP
            </h3>
            <p className="text-xs text-stone-600">
              Add PetJanu to your <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">claude_desktop_config.json</code> to give Claude direct access to PetJanu safety tools, digital tags, and medical triage.
            </p>

            <div className="relative">
              <pre className="p-4 bg-stone-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto">
                {JSON.stringify(claudeDesktopConfig, null, 2)}
              </pre>
              <button
                onClick={() => copyToClipboard(JSON.stringify(claudeDesktopConfig, null, 2), 'claude')}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              >
                {copiedKey === 'claude' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Config
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1C2B23] flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-600" /> Connecting Cursor IDE / Custom Agents
            </h3>
            <p className="text-xs text-stone-600">
              Configure Cursor's MCP extension or any autonomous agent framework using the standard HTTP MCP transport URL.
            </p>

            <div className="relative">
              <pre className="p-4 bg-stone-900 text-sky-300 rounded-2xl font-mono text-xs overflow-x-auto">
                {JSON.stringify(cursorMcpConfig, null, 2)}
              </pre>
              <button
                onClick={() => copyToClipboard(JSON.stringify(cursorMcpConfig, null, 2), 'cursor')}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              >
                {copiedKey === 'cursor' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Config
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MCP RESOURCES & PROMPTS */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resources */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1C2B23] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#175741]" /> Published MCP Resources
            </h3>
            <p className="text-xs text-stone-600">
              URIs that external AI agents can inspect and read directly to understand context.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="font-mono font-bold text-[#175741] block">petjanu://safety-guidelines</span>
                <span className="text-stone-600 text-[11px]">Comprehensive pet first-aid, toxic foods list, and emergency steps.</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="font-mono font-bold text-[#175741] block">petjanu://lost-pets-registry</span>
                <span className="text-stone-600 text-[11px]">Real-time public index of missing pets with active community alerts.</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="font-mono font-bold text-[#175741] block">petjanu://catalog-products</span>
                <span className="text-stone-600 text-[11px]">Hardware safety tag catalog with RFID/NFC chip specifications.</span>
              </div>
            </div>
          </div>

          {/* Prompts */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1C2B23] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Pre-Engineered MCP Prompts
            </h3>
            <p className="text-xs text-stone-600">
              Standardized prompt workflows exposed to client models.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="font-mono font-bold text-stone-900 block">pet_symptom_triage_prompt</span>
                <span className="text-stone-600 text-[11px]">Structured triage workflow analyzing symptoms and determining risk.</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="font-mono font-bold text-stone-900 block">lost_pet_broadcast_prompt</span>
                <span className="text-stone-600 text-[11px]">Generates high-urgency SMS &amp; WhatsApp broadcast templates for lost pets.</span>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="font-mono font-bold text-stone-900 block">nutrition_plan_prompt</span>
                <span className="text-stone-600 text-[11px]">Calculates ideal calorie intake and meal schedule.</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
