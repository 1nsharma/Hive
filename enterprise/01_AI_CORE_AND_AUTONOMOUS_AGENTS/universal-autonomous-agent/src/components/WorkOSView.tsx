import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw, 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Terminal, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  FileText, 
  Database, 
  Key, 
  FolderArchive, 
  Mail, 
  Calendar, 
  Share2, 
  MessageCircle, 
  Sliders, 
  Check, 
  Info,
  ChevronRight,
  Layers,
  Plus,
  Server,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { OperatingMode } from '../types';
import { ConnectorCapability } from '../lib/connectors';
import { UniversalWorkResult, WorkStepExecution } from '../lib/universalWorkOrchestrator';

interface WorkOSViewProps {
  operatingMode: OperatingMode;
  onNavigateToReview?: () => void;
  onNavigateToPolicy?: () => void;
}

interface ConnectorCardData {
  id: string;
  name: string;
  category: string;
  connectorType?: string;
  authType?: string;
  iconName: string;
  description: string;
  capabilities: ConnectorCapability[];
  connected: boolean;
  connectedAt?: string;
  scopes: string[];
}

export const WorkOSView: React.FC<WorkOSViewProps> = ({
  operatingMode,
  onNavigateToReview,
  onNavigateToPolicy
}) => {
  const [connectors, setConnectors] = useState<ConnectorCardData[]>([]);
  const [isLoadingConnectors, setIsLoadingConnectors] = useState(true);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorCardData | null>(null);

  // AI Provider State
  const [currentProvider, setCurrentProvider] = useState<string>('ollama');
  const [providers, setProviders] = useState<Array<{ id: string; name: string; isLocal: boolean }>>([
    { id: 'ollama', name: 'Local Ollama (Qwen 2.5 14B)', isLocal: true },
    { id: 'gemini', name: 'Cloud Gemini (2.5 Flash)', isLocal: false }
  ]);

  // Work Terminal State
  const [workPrompt, setWorkPrompt] = useState<string>(
    'मेरे GitHub project (1nsharma) में आज जो changes हुए हैं, उनका summary बनाकर मुझे Gmail draft में रख दो।'
  );
  const [isExecutingWork, setIsExecutingWork] = useState<boolean>(false);
  const [workResult, setWorkResult] = useState<UniversalWorkResult | null>(null);

  // Setup / Docker Script Modal
  const [showDockerModal, setShowDockerModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Category Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Custom MCP Server Registration Modal State
  const [showMcpModal, setShowMcpModal] = useState<boolean>(false);
  const [mcpServerName, setMcpServerName] = useState<string>('Brave Search MCP');
  const [mcpServerId, setMcpServerId] = useState<string>('mcp-brave-search');
  const [mcpEndpointUrl, setMcpEndpointUrl] = useState<string>('http://localhost:3001/mcp/sse');
  const [mcpDescription, setMcpDescription] = useState<string>('Community-driven MCP server providing open web indexing and realtime verification.');
  const [isRegisteringMcp, setIsRegisteringMcp] = useState<boolean>(false);

  const filteredConnectors = connectors.filter(c => {
    if (selectedCategory === 'ALL') return true;
    return c.category === selectedCategory;
  });

  const handleRegisterMcp = async () => {
    if (!mcpServerName || !mcpServerId) return;
    setIsRegisteringMcp(true);
    try {
      const res = await fetch('/api/agent/connectors/register-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mcpServerId.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
          name: mcpServerName,
          description: mcpDescription,
          capabilities: [
            {
              id: `${mcpServerId.toLowerCase()}.query`,
              displayName: `${mcpServerName} Query Tool`,
              description: `Autonomous query execution against ${mcpServerName}`,
              resource: 'query',
              action: 'read',
              requiresApproval: false
            }
          ]
        })
      });

      if (res.ok) {
        await loadData();
        setShowMcpModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegisteringMcp(false);
    }
  };

  // Fetch connectors and providers
  const loadData = async () => {
    try {
      setIsLoadingConnectors(true);
      const [connRes, provRes] = await Promise.all([
        fetch('/api/agent/connectors'),
        fetch('/api/agent/llm/providers')
      ]);

      if (connRes.ok) {
        const data = await connRes.json();
        setConnectors(data.connectors || []);
        if (data.connectors && data.connectors.length > 0 && !selectedConnector) {
          setSelectedConnector(data.connectors[0]);
        }
      }

      if (provRes.ok) {
        const provData = await provRes.json();
        setCurrentProvider(provData.currentProvider || 'ollama');
        if (provData.providers) setProviders(provData.providers);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingConnectors(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleConnector = async (connectorId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/agent/connectors/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectorId, connected: !currentStatus })
      });
      if (res.ok) {
        setConnectors(prev =>
          prev.map(c => (c.id === connectorId ? { ...c, connected: !currentStatus } : c))
        );
        if (selectedConnector?.id === connectorId) {
          setSelectedConnector(prev => (prev ? { ...prev, connected: !currentStatus } : null));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchProvider = async (provId: string) => {
    try {
      const res = await fetch('/api/agent/llm/provider/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: provId })
      });
      if (res.ok) {
        setCurrentProvider(provId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteWork = async (promptToRun?: string) => {
    const query = promptToRun || workPrompt;
    if (!query.trim()) return;

    setIsExecutingWork(true);
    setWorkResult(null);

    try {
      const res = await fetch('/api/agent/work/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      if (res.ok) {
        const data = await res.json();
        setWorkResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingWork(false);
    }
  };

  const sampleWorkQueries = [
    {
      title: 'GitHub Commits → Gmail Draft',
      query: 'मेरे GitHub project (1nsharma) में आज जो changes हुए हैं, उनका summary बनाकर मुझे Gmail draft में रख दो।'
    },
    {
      title: 'Calendar Events → WhatsApp Brief',
      query: 'मेरी Google Calendar के upcoming events देखकर WhatsApp पर team summary draft तैयार करो।'
    },
    {
      title: 'GitHub Issue + Drive Spec',
      query: 'GitHub पर नया issue बनाओ: "Add AES-256 local vault encryption" और Drive में specification doc save करो।'
    },
    {
      title: 'Latest Research → LinkedIn Staging',
      query: 'Latest research highlights का summary बनाकर LinkedIn founder post draft में stage करो।'
    }
  ];

  const getConnectorIcon = (id: string) => {
    switch (id) {
      case 'github':
        return <FolderArchive className="w-5 h-5 text-purple-400" />;
      case 'gmail':
        return <Mail className="w-5 h-5 text-blue-400" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 text-emerald-400" />;
      case 'drive':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-green-400" />;
      case 'linkedin':
        return <Share2 className="w-5 h-5 text-cyan-400" />;
      case 'slack':
        return <MessageSquare className="w-5 h-5 text-pink-400" />;
      case 'notion':
        return <BookOpen className="w-5 h-5 text-amber-300" />;
      case 'postgres':
        return <Database className="w-5 h-5 text-blue-400" />;
      default:
        return <Server className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ─────────────────────────────────────────────
          1. HEADER & LOCAL WORK OS HERO
      ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Universal AI Work OS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                Local-First + Zero Cloud Lock-in
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                AES-256 Vault Encrypted
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              One Universal Interface Over Your Entire Workspace
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              आपको हर app अलग-अलग खोलकर काम करने की ज़रूरत नहीं है। आप अपने tools connect कीजिए; Agent OS 
              उनके बीच का काम (GitHub → LLM → Policy Check → Gmail/Drive) खुद सुरक्षित orchestrate करेगा।
            </p>
          </div>

          {/* Quick Actions & Docker Script button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowDockerModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              Docker & setup.sh
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Connector State"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingConnectors ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* AI Provider Switcher & Privacy Telemetry Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI Cognitive Engine:
            </span>
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              {providers.map(p => {
                const isActive = p.id === currentProvider;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSwitchProvider(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.isLocal && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Cost: <strong>$0.00</strong> (Local Hardware)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Policy Boundary: <strong>Deterministic</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          2. CROSS-APP NATURAL LANGUAGE TERMINAL ("मेरा काम कर दो")
      ───────────────────────────────────────────── */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Natural Language Work Terminal ("मेरा काम कर दो")
            </h2>
            <p className="text-slate-400 text-xs">
              Write any multi-app command in natural Hindi or English. Agent OS handles intent, connections, policy gating, and execution.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-[11px] font-mono self-start sm:self-auto">
            Intent → Plan → Policy → Connector
          </span>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-2xl p-2.5 shadow-inner focus-within:border-purple-500 transition-all">
            <Sparkles className="w-5 h-5 text-purple-400 ml-2 shrink-0" />
            <input
              type="text"
              value={workPrompt}
              onChange={e => setWorkPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleExecuteWork();
              }}
              placeholder="e.g., मेरे GitHub commits का summary बनाकर Gmail draft में रख दो..."
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500 font-sans px-2"
            />
            <button
              onClick={() => handleExecuteWork()}
              disabled={isExecutingWork || !workPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-purple-950/50 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isExecutingWork ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              {isExecutingWork ? 'Orchestrating...' : 'Execute Work'}
            </button>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            High-Value Workflows:
          </span>
          {sampleWorkQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setWorkPrompt(sample.query);
                handleExecuteWork(sample.query);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{sample.title}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>

        {/* ─────────────────────────────────────────────
            3. LIVE STEP-BY-STEP WORK EXECUTION PIPELINE
        ───────────────────────────────────────────── */}
        {workResult && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Work Orchestration Completed: Run #{workResult.runId.slice(-6)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Zero Cloud Leakage: {workResult.summary.zeroCloudLeakage ? 'YES (100% On-Device)' : 'Cloud'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  {workResult.summary.sourceApp.toUpperCase()} ({workResult.summary.sourceDataExtracted}) &rarr;{' '}
                  <strong className="text-purple-300">{workResult.llmProvider}</strong> &rarr;{' '}
                  {workResult.summary.targetApp.toUpperCase()} ({workResult.summary.targetActionCompleted})
                </p>
              </div>

              {workResult.summary.draftUrlOrLink && (
                <a
                  href={workResult.summary.draftUrlOrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Staged Draft
                </a>
              )}
            </div>

            {/* Step execution breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {workResult.steps.map(step => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      Step {step.stepNumber}: {step.phase}
                    </span>
                    <span className="text-[10px] text-slate-400">{step.durationMs}ms</span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">{step.description}</p>

                  {step.output && (
                    <div className="bg-slate-900/90 rounded-lg p-2 font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          4. "CONNECT YOUR APPS" INTERACTIVE HUB
      ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Connected Applications & Universal Connectors
            </h2>
            <p className="text-slate-400 text-xs">
              Credentials remain in your local AES-256 Vault. The agent requests abstract capabilities — never raw OAuth tokens.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMcpModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Plug Custom MCP Server
            </button>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Active: <strong className="text-emerald-400">{connectors.filter(c => c.connected).length}</strong> / {connectors.length}
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'CODE', 'EMAIL', 'CALENDAR', 'STORAGE', 'MESSAGING', 'DATABASE', 'CUSTOM'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Platforms' : cat}
            </button>
          ))}
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnectors.map(c => {
            const isSelected = selectedConnector?.id === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedConnector(c)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 relative ${
                  isSelected
                    ? 'bg-slate-900 border-purple-500/80 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center">
                      {getConnectorIcon(c.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {c.name}
                        {c.connected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
                        )}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.category}
                        </span>
                        {c.connectorType && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                            c.connectorType === 'MCP_SERVER' 
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                              : c.connectorType === 'LOCAL_TOOL'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {c.connectorType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connect / Disconnect Toggle */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleConnector(c.id, c.connected);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      c.connected
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {c.connected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Connected
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Connect
                      </>
                    )}
                  </button>
                </div>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{c.description}</p>

                {/* Capability badges preview */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  {c.capabilities.slice(0, 2).map(cap => (
                    <span
                      key={cap.id}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {cap.displayName}
                    </span>
                  ))}
                  {c.capabilities.length > 2 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      +{c.capabilities.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          5. SELECTED CONNECTOR CAPABILITY INSPECTOR
      ───────────────────────────────────────────── */}
      {selectedConnector && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                {getConnectorIcon(selectedConnector.id)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {selectedConnector.name} Capability Registry
                  <span className="text-xs font-mono text-purple-400">
                    ({selectedConnector.capabilities.length} Exposed Capabilities)
                  </span>
                </h3>
                <p className="text-slate-400 text-xs">
                  Review how the Policy Engine restricts each capability before ToolRuntime invokes it.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToPolicy && (
                <button
                  onClick={onNavigateToPolicy}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                >
                  Configure In Policy Engine &rarr;
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Capability ID</th>
                  <th className="py-2.5 px-3">Action & Resource</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Review Policy</th>
                  <th className="py-2.5 px-3">Rate Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedConnector.capabilities.map(cap => (
                  <tr key={cap.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-purple-300 font-semibold">
                      {cap.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {cap.action.toUpperCase()} : {cap.resource}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs">{cap.description}</td>
                    <td className="py-3 px-3">
                      {cap.requiresApproval ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80 flex items-center gap-1 w-fit">
                          <Lock className="w-3 h-3" />
                          Requires Approval
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Autonomous Allowed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {cap.rateLimitPerHour} / hr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          7. CUSTOM MCP SERVER REGISTRATION MODAL
      ───────────────────────────────────────────── */}
      {showMcpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Plug Custom MCP Server / Toolchain
                </h3>
              </div>
              <button
                onClick={() => setShowMcpModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Attach any community-built Model Context Protocol server (Brave, Linear, Jira, Postgres, or custom local scripts) into the Universal Capability Registry.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">MCP Server Display Name</label>
                <input
                  type="text"
                  value={mcpServerName}
                  onChange={e => setMcpServerName(e.target.value)}
                  placeholder="e.g. Linear Issue Tracker MCP"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Identifier Slug</label>
                <input
                  type="text"
                  value={mcpServerId}
                  onChange={e => setMcpServerId(e.target.value)}
                  placeholder="e.g. mcp-linear"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">MCP Endpoint / Transport (SSE or stdio)</label>
                <input
                  type="text"
                  value={mcpEndpointUrl}
                  onChange={e => setMcpEndpointUrl(e.target.value)}
                  placeholder="e.g. http://localhost:3001/mcp/sse or npx -y @linear/mcp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-cyan-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <textarea
                  value={mcpDescription}
                  onChange={e => setMcpDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
                <strong>Policy Safeguard:</strong> Newly registered MCP tools are automatically bound to the Deterministic Policy Engine. Destructive operations still mandate Human-in-the-Loop review.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowMcpModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterMcp}
                disabled={isRegisteringMcp || !mcpServerName.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {isRegisteringMcp ? 'Registering...' : 'Register MCP Server'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          6. DOCKER COMPOSE & SETUP.SH MODAL
      ───────────────────────────────────────────── */}
      {showDockerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Local-First Deployment: docker-compose.yml & setup.sh
                </h3>
              </div>
              <button
                onClick={() => setShowDockerModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              आप इस पूरे Work OS को अपनी लोकल मशीन या सर्वर पर एक कमांड से चला सकते हैं। इसमें Ollama (Qwen 2.5 14B),
              PostgreSQL (pgvector), Redis और Local Encrypted Vault शामिल हैं।
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-y-auto flex-1">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                <span>Run command in terminal:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('./setup.sh');
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedCode ? 'Copied' : 'Copy'}
                </button>
              </div>

              <code className="block text-emerald-400 py-1">
                chmod +x ./setup.sh &amp;&amp; ./setup.sh
              </code>

              <div className="pt-2 text-slate-400 border-t border-slate-800 text-[11px]">
                <strong>Docker Compose Services:</strong>
                <ul className="list-disc pl-4 space-y-0.5 mt-1 text-slate-300">
                  <li><strong>agent-os-ollama</strong>: Free local LLM on port 11434 (Qwen 2.5 14B)</li>
                  <li><strong>agent-os-postgres</strong>: pgvector storage on port 5432</li>
                  <li><strong>agent-os-redis</strong>: Memory cache &amp; execution locks on port 6379</li>
                  <li><strong>agent-os-embeddings</strong>: HuggingFace BGE-small inference on port 8080</li>
                  <li><strong>agent-os-runtime</strong>: Unified Work OS React/Express interface on port 3000</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowDockerModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
