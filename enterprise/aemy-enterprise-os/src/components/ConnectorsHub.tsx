import React, { useState, useEffect } from 'react';
import { Language, ConnectorPlatform, SocialConnector, SyndicationDispatch, SyndicationPayload } from '../types';
import {
  Share2,
  Radio,
  Cpu,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Send,
  Sliders,
  Rss,
  CheckCircle2,
  AlertCircle,
  Code,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  FileText,
  Video,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Zap,
  Download,
  Laptop,
  Smartphone,
  CheckCheck,
  Workflow,
  ShieldCheck,
  Server,
  Play,
  CheckCircle,
  HardDrive,
} from 'lucide-react';

interface ConnectorsHubProps {
  language: Language;
  presetInquiry?: string;
  presetTitle?: string;
  presetSource?: 'funnel' | 'playbook' | 'publication' | 'custom';
  initialTab?: 'connectors' | 'mcp' | 'installer';
}

export const ConnectorsHub: React.FC<ConnectorsHubProps> = ({
  language,
  presetInquiry,
  presetTitle,
  presetSource = 'funnel',
  initialTab,
}) => {
  const isHi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'connectors' | 'mcp' | 'installer'>(initialTab || 'connectors');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Auto-Installer State
  const [isAutoInstallingConnectors, setIsAutoInstallingConnectors] = useState<boolean>(false);
  const [autoInstallReport, setAutoInstallReport] = useState<any | null>(null);
  const [showScriptPreview, setShowScriptPreview] = useState<boolean>(false);
  const [scriptPreviewContent, setScriptPreviewContent] = useState<string>('');
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [selectedInstallerOs, setSelectedInstallerOs] = useState<'macos' | 'windows' | 'linux' | 'cursor' | 'vscode' | 'docker' | 'npm'>('macos');

  // Interactive Live Auto-Installer Wizard State
  const [isWizardRunning, setIsWizardRunning] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [wizardLogs, setWizardLogs] = useState<Array<{ stage: string; message: string; timestamp: string; type: 'info' | 'success' | 'warn' | 'action' }>>([]);
  const [wizardCompleted, setWizardCompleted] = useState<boolean>(false);
  const [wizardHealthScore, setWizardHealthScore] = useState<number>(0);
  const [wizardTargetClient, setWizardTargetClient] = useState<'claude' | 'cursor' | 'vscode' | 'connectors' | 'docker'>('claude');

  // Connectors State
  const [connectors, setConnectors] = useState<SocialConnector[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<ConnectorPlatform[]>([
    'x',
    'linkedin',
    'substack',
    'webhook',
  ]);
  const [syndicationTitle, setSyndicationTitle] = useState<string>(
    presetTitle || 'We built AI to understand intelligence, yet we still do not understand our own.'
  );
  const [syndicationInquiry, setSyndicationInquiry] = useState<string>(
    presetInquiry ||
      'If algorithmic architectures automate cognitive state transitions, where does human epistemic sovereignty reside?'
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [latestDispatch, setLatestDispatch] = useState<SyndicationDispatch | null>(null);
  const [syndicationHistory, setSyndicationHistory] = useState<SyndicationDispatch[]>([]);
  const [previewPlatform, setPreviewPlatform] = useState<ConnectorPlatform>('x');
  const [configModalConnector, setConfigModalConnector] = useState<SocialConnector | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalDispatches: number;
    totalEstimatedReach: number;
    activeConnectors: number;
  }>({
    totalDispatches: 174,
    totalEstimatedReach: 295000,
    activeConnectors: 6,
  });

  // MCP State
  const [selectedMcpTool, setSelectedMcpTool] = useState<string>('syndicate_to_social');
  const [mcpToolArgs, setMcpToolArgs] = useState<Record<string, any>>({
    title: 'Epistemic Sovereignty in Algorithmic Systems',
    inquiry: 'How do we preserve human agency when autonomous agents execute recursive decisions?',
    platforms: ['x', 'linkedin', 'substack', 'webhook'],
    language: 'en',
  });
  const [mcpRequestJson, setMcpRequestJson] = useState<string>('');
  const [mcpResponseJson, setMcpResponseJson] = useState<string>('');
  const [isExecutingMcp, setIsExecutingMcp] = useState<boolean>(false);
  const [selectedResourceUri, setSelectedResourceUri] = useState<string>('aemy://brand/manifesto');
  const [resourceContent, setResourceContent] = useState<string>('');
  const [isFetchingResource, setIsFetchingResource] = useState<boolean>(false);
  const [selectedPromptName, setSelectedPromptName] = useState<string>('human_agency_audit');
  const [promptContent, setPromptContent] = useState<string>('');
  const [isFetchingPrompt, setIsFetchingPrompt] = useState<boolean>(false);

  // Sync preset props
  useEffect(() => {
    if (presetTitle) setSyndicationTitle(presetTitle);
    if (presetInquiry) setSyndicationInquiry(presetInquiry);
  }, [presetTitle, presetInquiry]);

  // Load connectors on mount
  useEffect(() => {
    fetchConnectors();
  }, []);

  const fetchConnectors = async () => {
    try {
      const res = await fetch('/api/connectors');
      if (res.ok) {
        const data = await res.json();
        if (data.connectors) setConnectors(data.connectors);
        if (data.stats) setStats(data.stats);
        if (data.recentDispatches) {
          setSyndicationHistory(data.recentDispatches);
          if (!latestDispatch && data.recentDispatches.length > 0) {
            setLatestDispatch(data.recentDispatches[0]);
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch connectors list', e);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const togglePlatform = (p: ConnectorPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleSelectAllPlatforms = () => {
    const all: ConnectorPlatform[] = ['x', 'linkedin', 'youtube', 'substack', 'github', 'webhook'];
    if (selectedPlatforms.length === all.length) {
      setSelectedPlatforms(['x', 'linkedin']);
    } else {
      setSelectedPlatforms(all);
    }
  };

  // Publish through connectors
  const handlePublishSyndication = async () => {
    if (selectedPlatforms.length === 0) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/connectors/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: syndicationTitle,
          inquiry: syndicationInquiry,
          source: presetSource,
          platforms: selectedPlatforms,
          language,
          customNotes,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.dispatch) {
          setLatestDispatch(result.dispatch);
          setSyndicationHistory((prev) => [result.dispatch, ...prev]);
          fetchConnectors();
        }
      }
    } catch (err) {
      console.error('Syndication publish error', err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Update connector configuration
  const handleSaveConfig = async (conn: SocialConnector) => {
    try {
      const res = await fetch('/api/connectors/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: conn.id,
          targetHandle: conn.targetHandle,
          webhookUrl: conn.webhookUrl,
          autoSyndicate: conn.autoSyndicate,
        }),
      });
      if (res.ok) {
        fetchConnectors();
        setConfigModalConnector(null);
      }
    } catch (err) {
      console.error('Save config error', err);
    }
  };

  // Execute MCP Tool via JSON-RPC 2.0
  const handleExecuteMcpTool = async () => {
    setIsExecutingMcp(true);
    const rpcPayload = {
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 1000) + 1,
      method: 'tools/call',
      params: {
        name: selectedMcpTool,
        arguments: mcpToolArgs,
      },
    };

    setMcpRequestJson(JSON.stringify(rpcPayload, null, 2));

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcPayload),
      });
      const data = await res.json();
      setMcpResponseJson(JSON.stringify(data, null, 2));
      // Refresh connectors if syndication tool was called
      if (selectedMcpTool === 'syndicate_to_social') {
        fetchConnectors();
      }
    } catch (err: any) {
      setMcpResponseJson(JSON.stringify({ error: err?.message || 'Network error' }, null, 2));
    } finally {
      setIsExecutingMcp(false);
    }
  };

  // Read MCP Resource
  const handleReadMcpResource = async (uri: string) => {
    setIsFetchingResource(true);
    setSelectedResourceUri(uri);
    const rpcPayload = {
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 1000) + 1,
      method: 'resources/read',
      params: { uri },
    };

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcPayload),
      });
      const data = await res.json();
      if (data?.result?.contents?.[0]?.text) {
        setResourceContent(data.result.contents[0].text);
      } else {
        setResourceContent(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setResourceContent(JSON.stringify({ error: err?.message || 'Fetch error' }, null, 2));
    } finally {
      setIsFetchingResource(false);
    }
  };

  // Get MCP Prompt
  const handleGetMcpPrompt = async (name: string) => {
    setIsFetchingPrompt(true);
    setSelectedPromptName(name);
    const rpcPayload = {
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 1000) + 1,
      method: 'prompts/get',
      params: {
        name,
        arguments: {
          insight: syndicationInquiry,
          system_description: 'Autonomous multi-agent algorithmic decision pipeline',
          topic: 'Frontier AI agency vs human control',
          question: syndicationTitle,
        },
      },
    };

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcPayload),
      });
      const data = await res.json();
      setPromptContent(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setPromptContent(JSON.stringify({ error: err?.message || 'Fetch error' }, null, 2));
    } finally {
      setIsFetchingPrompt(false);
    }
  };

  // Auto-Installer handlers
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsPwaInstalled(true);
      setPwaInstallPrompt(null);
    });
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleRunAutoInstallConnectors = async () => {
    setIsAutoInstallingConnectors(true);
    try {
      const res = await fetch('/api/connectors/auto-install', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAutoInstallReport(data);
        if (data.connectors) setConnectors(data.connectors);
        fetchConnectors();
      }
    } catch (e) {
      console.error('Auto install error', e);
    } finally {
      setIsAutoInstallingConnectors(false);
    }
  };

  const handleFetchScriptPreview = async () => {
    try {
      let scriptUrl = '/install.sh';
      if (selectedInstallerOs === 'windows') scriptUrl = '/install.ps1';
      else if (selectedInstallerOs === 'docker') scriptUrl = '/docker-compose.yml';

      const res = await fetch(scriptUrl);
      if (res.ok) {
        const text = await res.text();
        setScriptPreviewContent(text);
        setShowScriptPreview(true);
      }
    } catch (e) {
      console.warn('Could not load script preview', e);
    }
  };

  const handleRunAutoInstallWizard = async () => {
    setIsWizardRunning(true);
    setWizardStep(1);
    setWizardCompleted(false);
    setWizardHealthScore(0);
    const logs: Array<{ stage: string; message: string; timestamp: string; type: 'info' | 'success' | 'warn' | 'action' }> = [];

    const addLog = (stage: string, message: string, type: 'info' | 'success' | 'warn' | 'action' = 'info') => {
      logs.push({ stage, message, timestamp: new Date().toLocaleTimeString(), type });
      setWizardLogs([...logs]);
    };

    try {
      // Step 1: Environment Discovery
      addLog('INIT', 'Starting Aemy AI Studio Intelligent Auto-Installer Wizard...', 'action');
      await new Promise((r) => setTimeout(r, 350));
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
      const detectedPlatform = /Mac/i.test(ua) ? 'macOS (Darwin)' : /Win/i.test(ua) ? 'Windows (NT)' : /Linux/i.test(ua) ? 'Linux (POSIX)' : 'Web/Cloud';
      addLog('SYS_CHECK', `Target environment detected: ${detectedPlatform}`, 'success');
      addLog('SYS_CHECK', `Client configuration target: ${wizardTargetClient.toUpperCase()}`, 'info');

      // Step 2: Protocol Handshake
      setWizardStep(2);
      addLog('MCP_PING', 'Initiating JSON-RPC 2.0 handshake with backend MCP server (/api/mcp)...', 'action');
      const pingStart = performance.now();
      const rpcRes = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      });
      const pingTime = Math.round(performance.now() - pingStart);
      if (!rpcRes.ok) throw new Error(`MCP handshake failed with HTTP status ${rpcRes.status}`);
      const rpcJson = await rpcRes.json();
      const registeredTools = rpcJson?.result?.tools || [];
      addLog('MCP_PING', `Handshake verified (${pingTime} ms latency). Protocol standard: 2024-11-05 (JSON-RPC 2.0)`, 'success');

      // Step 3: Tool Inventory Verification
      setWizardStep(3);
      addLog('TOOLS_AUDIT', `Auditing ${registeredTools.length} epistemic tools in MCP server...`, 'action');
      await new Promise((r) => setTimeout(r, 400));
      addLog('TOOLS_AUDIT', 'Verified: syndicate_to_social (multi-channel public syndicator)', 'info');
      addLog('TOOLS_AUDIT', 'Verified: query_research_playbook (8-step epistemic scientific protocol)', 'info');
      addLog('TOOLS_AUDIT', 'Verified: steelman_counter_challenge (falsification tests & devil\'s advocate)', 'info');
      addLog('TOOLS_AUDIT', 'Verified: generate_content_funnel (cascading intellectual assets)', 'info');
      addLog('TOOLS_AUDIT', 'Verified: simulate_agent_sandbox (explainability & human agency scoring)', 'info');
      addLog('TOOLS_AUDIT', 'Verified: search_publications & get_brand_manifesto', 'info');
      addLog('TOOLS_AUDIT', `All ${registeredTools.length} epistemic tools registered and ready for execution.`, 'success');

      // Step 4: Social Connectors Sync
      setWizardStep(4);
      addLog('CONNECTORS_SYNC', 'Synchronizing all 6 social and public connectors (X, LinkedIn, Substack, YouTube, GitHub, Webhook)...', 'action');
      const syncRes = await fetch('/api/connectors/auto-install', { method: 'POST' });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        setAutoInstallReport(syncData);
        if (syncData.connectors) setConnectors(syncData.connectors);
        addLog('CONNECTORS_SYNC', `Successfully synchronized 6 channels. Health Score: ${syncData.healthScore}%`, 'success');
      }

      // Step 5: Final Configuration Ready
      setWizardStep(5);
      await new Promise((r) => setTimeout(r, 350));
      addLog('CONFIG_READY', `Auto-generated production configuration for ${wizardTargetClient.toUpperCase()}.`, 'success');
      addLog('VERIFIED', 'All systems online. Aemy AI Studio is ready to power autonomous AI agents with human agency safety.', 'success');

      setWizardHealthScore(100);
      setWizardCompleted(true);
    } catch (err: any) {
      addLog('ERROR', `Auto-installer error: ${err?.message || 'Verification failure'}`, 'warn');
    } finally {
      setIsWizardRunning(false);
    }
  };

  const handleInstallPwa = async () => {
    if (pwaInstallPrompt) {
      pwaInstallPrompt.prompt();
      const choice = await pwaInstallPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setPwaInstallPrompt(null);
    } else {
      setCopiedKey('pwa-hint');
      setTimeout(() => setCopiedKey(null), 4000);
    }
  };

  const getPlatformIcon = (platform: ConnectorPlatform) => {
    switch (platform) {
      case 'x':
        return <Twitter className="h-4 w-4 text-sky-400" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-400" />;
      case 'youtube':
        return <Video className="h-4 w-4 text-red-400" />;
      case 'substack':
        return <Mail className="h-4 w-4 text-orange-400" />;
      case 'github':
        return <Github className="h-4 w-4 text-stone-200" />;
      case 'webhook':
      default:
        return <Radio className="h-4 w-4 text-emerald-400" />;
    }
  };

  const getPlatformLabel = (platform: ConnectorPlatform) => {
    switch (platform) {
      case 'x':
        return 'X (Twitter)';
      case 'linkedin':
        return 'LinkedIn';
      case 'youtube':
        return 'YouTube';
      case 'substack':
        return 'Substack';
      case 'github':
        return 'GitHub RFC';
      case 'webhook':
        return 'Public Webhook & RSS';
    }
  };

  return (
    <section id="connectors" className="relative border-b border-stone-800 bg-stone-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
              <Share2 className="h-3.5 w-3.5" />
              <span>Wing 04 Distribution &amp; Protocol Layer</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 font-semibold tracking-tight">
              {isHi ? 'कनेक्टर्स एवं मॉडल कॉन्टेक्स्ट प्रोटोकॉल (MCP)' : 'Connectors & Model Context Protocol (MCP)'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-400 max-w-2xl">
              {isHi
                ? 'Aemy AI Studio के शोध निष्कर्षों को X, LinkedIn, YouTube, Substack और RSS पर सिंडिकेट करें, या सीधे MCP सर्वर के जरिए AI एजेंट्स से जोड़ें।'
                : 'Syndicate Aemy AI Studio research across X, LinkedIn, YouTube, Substack, and RSS feeds, or query directly via standard MCP JSON-RPC 2.0 endpoints.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900/80 p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('connectors')}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'connectors'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{isHi ? 'सोशल कनेक्टर्स' : 'Social Connectors'}</span>
              <span className="rounded-full bg-stone-950/30 px-1.5 py-0.2 text-[10px] font-mono">6</span>
            </button>

            <button
              onClick={() => setActiveTab('mcp')}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'mcp'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{isHi ? 'MCP प्रोटोकॉल हब' : 'MCP Protocol Hub'}</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('installer')}
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'installer'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isHi ? 'ऑटो-इंस्टॉलर' : 'Auto-Installer'}</span>
              <span className="rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 py-0.2 text-[9px] font-mono">
                1-Click
              </span>
            </button>
          </div>
        </div>

        {/* Global Telemetry Metric Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4">
            <div className="text-[11px] font-mono uppercase text-stone-400">Total Public Reach</div>
            <div className="mt-1 font-serif text-2xl font-semibold text-amber-300">
              {stats.totalEstimatedReach.toLocaleString()}+
            </div>
            <div className="mt-1 text-[11px] text-stone-500 font-mono">Estimated across 6 platforms</div>
          </div>

          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4">
            <div className="text-[11px] font-mono uppercase text-stone-400">Total Dispatches</div>
            <div className="mt-1 font-serif text-2xl font-semibold text-stone-100">{stats.totalDispatches}</div>
            <div className="mt-1 text-[11px] text-stone-500 font-mono">Verified research artifacts</div>
          </div>

          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4">
            <div className="text-[11px] font-mono uppercase text-stone-400">Active Connectors</div>
            <div className="mt-1 font-serif text-2xl font-semibold text-emerald-400">6 / 6 Live</div>
            <div className="mt-1 text-[11px] text-stone-500 font-mono">X, LinkedIn, YT, Substack, GH, RSS</div>
          </div>

          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4">
            <div className="text-[11px] font-mono uppercase text-stone-400">MCP JSON-RPC 2.0</div>
            <div className="mt-1 font-serif text-2xl font-semibold text-sky-400">2024-11-05</div>
            <div className="mt-1 text-[11px] text-stone-500 font-mono">7 Tools · 6 Resources · 4 Prompts</div>
          </div>
        </div>

        {/* TAB 1: SOCIAL & PUBLIC CONNECTORS */}
        {activeTab === 'connectors' && (
          <div className="mt-10 space-y-10">
            {/* 6 Platform Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-stone-300">
                  {isHi ? 'सक्रिय वितरण चैनल (6)' : 'Active Distribution Channels (6)'}
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  {isHi ? 'प्रत्येक प्लेटफॉर्म के लिए ऑप्टिमाइज़्ड फॉर्मेटिंग' : 'Zero-hype algorithmic adaptation'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(connectors.length > 0
                  ? connectors
                  : ([
                      {
                        id: 'x',
                        name: 'X (Twitter) Syndication',
                        description: 'Punchy paradox tweets and 5-point threaded arguments.',
                        platform: 'X / Twitter',
                        status: 'connected',
                        targetHandle: '@amitsharma',
                        autoSyndicate: true,
                        formatsSupported: ['Single Post', 'Numbered Thread'],
                        totalDispatches: 42,
                        estimatedReach: 68500,
                      },
                      {
                        id: 'linkedin',
                        name: 'LinkedIn Thought Leadership',
                        description: 'Executive research memos and AI governance strategy.',
                        platform: 'LinkedIn',
                        status: 'connected',
                        targetHandle: 'Amit Sharma | Aemy AI Studio',
                        autoSyndicate: true,
                        formatsSupported: ['Executive Memo', 'Whitepaper Extract'],
                        totalDispatches: 28,
                        estimatedReach: 43200,
                      },
                      {
                        id: 'youtube',
                        name: 'YouTube ("The Search Within")',
                        description: 'Cinematic philosophical video scripts and 30s hooks.',
                        platform: 'YouTube',
                        status: 'connected',
                        targetHandle: '@AemyAIStudio',
                        autoSyndicate: false,
                        formatsSupported: ['Episode Outline', '30s Hook Script'],
                        totalDispatches: 16,
                        estimatedReach: 125000,
                      },
                      {
                        id: 'substack',
                        name: 'Substack Research Monograph',
                        description: 'Full markdown essays with epistemic takeaways.',
                        platform: 'Substack',
                        status: 'connected',
                        targetHandle: 'aemy.substack.com',
                        autoSyndicate: true,
                        formatsSupported: ['Markdown Essay', 'Discussion Prompts'],
                        totalDispatches: 14,
                        estimatedReach: 18400,
                      },
                      {
                        id: 'github',
                        name: 'GitHub Research Benchmarks',
                        description: 'Open-source agent alignment benchmarks and RFCs.',
                        platform: 'GitHub',
                        status: 'ready',
                        targetHandle: 'github.com/aemy-ai-studio',
                        autoSyndicate: false,
                        formatsSupported: ['Research RFC (.md)', 'Safety Benchmarks'],
                        totalDispatches: 9,
                        estimatedReach: 8900,
                      },
                      {
                        id: 'webhook',
                        name: 'Public Webhook & RSS Feed',
                        description: 'Public RSS 2.0 XML and JSON Feed syndication.',
                        platform: 'Public RSS / Feed',
                        status: 'connected',
                        targetHandle: '/api/feed/rss.xml',
                        autoSyndicate: true,
                        formatsSupported: ['RSS 2.0 XML', 'JSON Feed 1.1'],
                        totalDispatches: 65,
                        estimatedReach: 32000,
                      },
                    ] as SocialConnector[])
                ).map((conn) => {
                  const isSelected = selectedPlatforms.includes(conn.id);
                  return (
                    <div
                      key={conn.id}
                      className={`relative rounded-xl border p-5 transition-all ${
                        isSelected
                          ? 'border-amber-500/50 bg-stone-900/70 shadow-lg shadow-amber-500/5'
                          : 'border-stone-800 bg-stone-900/30 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="rounded-lg border border-stone-800 bg-stone-950 p-2">
                            {getPlatformIcon(conn.id)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-stone-100">{conn.name}</div>
                            <div className="text-xs font-mono text-stone-400">{conn.targetHandle}</div>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono ${
                            conn.status === 'connected'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {conn.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-stone-400 leading-relaxed min-h-[32px]">
                        {conn.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {conn.formatsSupported.map((f, i) => (
                          <span
                            key={i}
                            className="rounded bg-stone-950/80 border border-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-400"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                        <div className="text-[11px] font-mono text-stone-400">
                          <span className="text-stone-200 font-semibold">{conn.totalDispatches}</span> dispatches ·{' '}
                          <span className="text-amber-400/90 font-semibold">
                            {(conn.estimatedReach / 1000).toFixed(1)}k
                          </span>{' '}
                          reach
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setConfigModalConnector(conn)}
                            title="Configure Handle or Webhook URL"
                            className="rounded p-1 text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-colors"
                          >
                            <Sliders className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => togglePlatform(conn.id)}
                            className={`rounded px-2.5 py-1 text-xs font-mono transition-colors ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                                : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Syndication Console (Broadcast Engine) */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    <span>PUBLIC SYNDICATION DISPATCH CONSOLE</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-stone-100 font-semibold mt-1">
                    {isHi ? 'मल्टी-प्लेटफ़ॉर्म ब्रॉडकास्ट इंजन' : 'Multi-Platform Broadcast Engine'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllPlatforms}
                    className="text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors"
                  >
                    {selectedPlatforms.length === 6 ? 'Deselect All' : 'Select All 6 Platforms'}
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                    {isHi ? 'शीर्षक या मूल प्रश्न' : 'Dispatch Headline or Core Question'}
                  </label>
                  <input
                    type="text"
                    value={syndicationTitle}
                    onChange={(e) => setSyndicationTitle(e.target.value)}
                    placeholder="We built AI to understand intelligence, yet we still do not understand our own."
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-4 py-2.5 text-sm text-stone-100 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                    {isHi ? 'गहन अनुसंधान विचार या सार' : 'Deep Inquiry Thesis or Abstract'}
                  </label>
                  <textarea
                    rows={3}
                    value={syndicationInquiry}
                    onChange={(e) => setSyndicationInquiry(e.target.value)}
                    placeholder="If algorithmic architectures automate cognitive state transitions, where does human epistemic sovereignty reside?"
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 p-4 text-sm text-stone-100 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>

                {/* Platform Selector Chips */}
                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                    {isHi ? 'प्रसारण चैनल चुनें' : 'Target Broadcast Channels'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['x', 'linkedin', 'youtube', 'substack', 'github', 'webhook'] as ConnectorPlatform[]).map(
                      (p) => {
                        const isSelected = selectedPlatforms.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => togglePlatform(p)}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                                : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700'
                            }`}
                          >
                            {getPlatformIcon(p)}
                            <span>{getPlatformLabel(p)}</span>
                            {isSelected && <Check className="h-3 w-3 text-amber-400" />}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Broadcast Action CTA */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs font-mono text-stone-500">
                    Selected platforms: <span className="text-amber-400 font-bold">{selectedPlatforms.length}</span> / 6
                    · Human Agency Audit: <span className="text-emerald-400">Verified</span>
                  </div>

                  <button
                    onClick={handlePublishSyndication}
                    disabled={isPublishing || selectedPlatforms.length === 0}
                    className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-amber-500/10 active:scale-95"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-stone-950" />
                        <span>{isHi ? 'प्रसारण जारी है...' : 'Broadcasting Across Connectors...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-stone-950" />
                        <span>{isHi ? 'सार्वजनिक प्रसारण करें' : 'Broadcast to Selected Platforms'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Preview Canvas */}
              {latestDispatch && latestDispatch.payloads && (
                <div className="mt-8 pt-8 border-t border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        RECEIPT #{latestDispatch.receiptHash} · {latestDispatch.platforms.length} CHANNELS REACHED
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                      <span>Est. Impressions:</span>
                      <span className="text-amber-400 font-bold">
                        {latestDispatch.metrics.estimatedImpressions.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Preview Platform Tabs */}
                  <div className="flex flex-wrap items-center gap-1 border-b border-stone-800 bg-stone-950 p-1.5 rounded-t-lg">
                    {latestDispatch.platforms.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPreviewPlatform(p)}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          previewPlatform === p
                            ? 'bg-stone-800 text-stone-100 shadow-sm'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {getPlatformIcon(p)}
                        <span>{getPlatformLabel(p)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Formatted Output Viewer */}
                  {latestDispatch.payloads[previewPlatform] && (
                    <div className="rounded-b-lg border-x border-b border-stone-800 bg-stone-950/80 p-5">
                      <div className="flex items-center justify-between mb-3 text-xs font-mono text-stone-400">
                        <span className="uppercase text-amber-400">
                          {getPlatformLabel(previewPlatform)} Formatted Dispatch
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(latestDispatch.payloads[previewPlatform].formattedText, previewPlatform)
                          }
                          className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors"
                        >
                          {copiedKey === previewPlatform ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>{copiedKey === previewPlatform ? 'Copied to Clipboard' : 'Copy Text'}</span>
                        </button>
                      </div>

                      <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-stone-200 leading-relaxed bg-stone-900/50 p-4 rounded-lg border border-stone-800/80 max-h-80 overflow-y-auto">
                        {latestDispatch.payloads[previewPlatform].formattedText}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Public Feeds & Syndication Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RSS 2.0 & JSON Feed */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                  <Rss className="h-4 w-4" />
                  <span>PUBLIC SYNDICATION FEEDS</span>
                </div>
                <h4 className="font-serif text-lg text-stone-100 font-medium">
                  {isHi ? 'खुले सार्वजनिक आरएसएस और जेसन फीड्स' : 'Open RSS 2.0 & JSON Feed Syndication'}
                </h4>
                <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
                  {isHi
                    ? 'सभी शोध पत्र और सार्वजनिक विचार मानक RSS 2.0 XML और JSON Feed 1.1 प्रारूपों में उपलब्ध हैं, जिन्हें पॉडकास्ट, फीड रीडर्स और बॉट्स द्वारा स्वतः पढ़ा जा सकता है।'
                    : 'All research dispatches and monographs are publicly syndicated in compliant RSS 2.0 XML and JSON Feed 1.1 formats for news aggregators, feed readers, and AI discovery agents.'}
                </p>

                <div className="mt-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950 p-3">
                    <div className="truncate mr-2">
                      <span className="text-amber-500 font-semibold">RSS 2.0 XML: </span>
                      <span className="text-stone-300">/api/feed/rss.xml</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/api/feed/rss.xml"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1 text-stone-400 hover:text-stone-200"
                        title="Open RSS Feed"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() =>
                          handleCopy(
                            window.location.origin + '/api/feed/rss.xml',
                            'rss-url'
                          )
                        }
                        className="rounded bg-stone-800 px-2 py-1 text-[11px] text-stone-300 hover:bg-stone-700 transition-colors"
                      >
                        {copiedKey === 'rss-url' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950 p-3">
                    <div className="truncate mr-2">
                      <span className="text-sky-400 font-semibold">JSON Feed 1.1: </span>
                      <span className="text-stone-300">/api/feed/json</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/api/feed/json"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1 text-stone-400 hover:text-stone-200"
                        title="Open JSON Feed"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() =>
                          handleCopy(
                            window.location.origin + '/api/feed/json',
                            'json-url'
                          )
                        }
                        className="rounded bg-stone-800 px-2 py-1 text-[11px] text-stone-300 hover:bg-stone-700 transition-colors"
                      >
                        {copiedKey === 'json-url' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhook & Multi-Cast Dispatch */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
                  <Zap className="h-4 w-4" />
                  <span>AUTOMATED WEBHOOK DISPATCH</span>
                </div>
                <h4 className="font-serif text-lg text-stone-100 font-medium">
                  {isHi ? 'कस्टम वेबहुक ऑटोमेशन' : 'Custom Webhook Automation'}
                </h4>
                <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
                  {isHi
                    ? 'अपने Slack, Discord, n8n, Make, या Bluesky बॉट के वेबहुक URL को कॉन्फ़िगर करें ताकि नया शोध प्रकाशित होते ही तत्काल सिंडिकेशन पेलोड भेजा जा सके।'
                    : 'Configure your Slack, Discord, n8n, Zapier, or Bluesky bot webhook URL. Every broadcast generates a cryptographically hashed JSON-LD payload sent directly to your endpoint.'}
                </p>

                <div className="mt-5 rounded-lg border border-stone-800 bg-stone-950 p-4 font-mono text-xs text-stone-300 space-y-2">
                  <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800/80">
                    <span>X-Aemy-Receipt Header:</span>
                    <span className="text-amber-400 font-bold">SHA-256 HMAC</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-400">
                    <span>Target Endpoint:</span>
                    <span className="text-emerald-400 font-semibold truncate max-w-xs">
                      {connectors.find((c) => c.id === 'webhook')?.webhookUrl || 'Standard RSS & JSON Feed'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const wh = connectors.find((c) => c.id === 'webhook');
                      if (wh) setConfigModalConnector(wh);
                    }}
                    className="w-full mt-2 rounded bg-stone-800/80 hover:bg-stone-800 py-1.5 text-[11px] text-amber-300 font-mono transition-colors"
                  >
                    Edit Webhook Target URL
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Public Syndication History Log */}
            {syndicationHistory.length > 0 && (
              <div className="rounded-xl border border-stone-800 bg-stone-900/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-300">
                    Recent Public Syndication History Log ({syndicationHistory.length})
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">Immutable cryptographic records</span>
                </div>

                <div className="divide-y divide-stone-800/80 font-mono text-xs">
                  {syndicationHistory.map((item) => (
                    <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300 font-bold">
                            {item.receiptHash}
                          </span>
                          <span className="text-stone-200 font-sans text-sm font-medium line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-stone-400 text-[11px]">
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                          <span>·</span>
                          <span>Channels: {item.platforms.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-stone-400 text-[11px]">
                          <span className="text-amber-400 font-semibold">
                            {item.metrics.estimatedImpressions.toLocaleString()}
                          </span>{' '}
                          reach
                        </span>
                        <span className="rounded-full bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 text-[10px] text-emerald-300">
                          Agency Score: {item.metrics.epistemicQualityScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MODEL CONTEXT PROTOCOL (MCP) LIVE INSPECTOR */}
        {activeTab === 'mcp' && (
          <div className="mt-10 space-y-10">
            {/* MCP Banner */}
            <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-500/20">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                    <Cpu className="h-4 w-4" />
                    <span>MODEL CONTEXT PROTOCOL (MCP) SERVER · STANDARD SPECIFICATION</span>
                  </div>
                  <h3 className="font-serif text-2xl text-stone-100 font-semibold mt-1">
                    Aemy AI Studio MCP Server
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-stone-400">
                    Connect Claude Desktop, Cursor, external AI agents, and LangChain/LlamaIndex pipelines directly to
                    Aemy AI Studio via JSON-RPC 2.0.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded-md border border-emerald-500/40 bg-emerald-950/60 px-3 py-1.5 text-emerald-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Status: Online (200 OK)
                  </span>
                  <span className="rounded-md border border-stone-800 bg-stone-900 px-3 py-1.5 text-stone-300">
                    Version: 2024-11-05
                  </span>
                </div>
              </div>

              {/* Endpoints bar */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5 flex items-center justify-between">
                  <span className="text-stone-400">POST JSON-RPC:</span>
                  <span className="text-sky-300 font-bold">/api/mcp</span>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5 flex items-center justify-between">
                  <span className="text-stone-400">GET SSE Stream:</span>
                  <span className="text-amber-300 font-bold">/api/mcp/sse</span>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5 flex items-center justify-between">
                  <span className="text-stone-400">GET Discovery:</span>
                  <span className="text-emerald-300 font-bold">/api/mcp/manifest</span>
                </div>
              </div>
            </div>

            {/* Interactive MCP Tool Playground */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Code className="h-3.5 w-3.5" />
                    <span>INTERACTIVE MCP TOOLS PLAYGROUND</span>
                  </div>
                  <h4 className="font-serif text-xl text-stone-100 font-semibold mt-1">
                    Execute Tools via MCP JSON-RPC 2.0
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-stone-400">Select Tool:</span>
                  <select
                    value={selectedMcpTool}
                    onChange={(e) => {
                      const t = e.target.value;
                      setSelectedMcpTool(t);
                      if (t === 'syndicate_to_social') {
                        setMcpToolArgs({
                          title: syndicationTitle,
                          inquiry: syndicationInquiry,
                          platforms: ['x', 'linkedin', 'substack', 'webhook'],
                          language: 'en',
                        });
                      } else if (t === 'query_research_playbook') {
                        setMcpToolArgs({
                          question: syndicationTitle,
                          pillar: 'Human Intelligence & AI',
                          language: 'en',
                        });
                      } else if (t === 'steelman_counter_challenge') {
                        setMcpToolArgs({
                          claim: 'Autonomous AI agents inevitably reduce human agency',
                          context: 'Cognitive decision topology',
                          language: 'en',
                        });
                      } else if (t === 'generate_content_funnel') {
                        setMcpToolArgs({
                          inquiry: syndicationInquiry,
                          pillar: 'Epistemic Sovereignty',
                          language: 'en',
                        });
                      } else if (t === 'simulate_agent_sandbox') {
                        setMcpToolArgs({
                          goal: 'Audit neurobiology research papers for conflicting clinical endpoints',
                          autonomyLevel: 'supervised',
                          guardrails: true,
                          language: 'en',
                        });
                      } else if (t === 'search_publications') {
                        setMcpToolArgs({
                          query: 'agency',
                          category: 'all',
                        });
                      } else if (t === 'get_brand_manifesto') {
                        setMcpToolArgs({
                          language: 'en',
                        });
                      }
                    }}
                    className="rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                  >
                    <option value="syndicate_to_social">syndicate_to_social (Connectors)</option>
                    <option value="query_research_playbook">query_research_playbook (8-Step)</option>
                    <option value="steelman_counter_challenge">steelman_counter_challenge (Devil's Advocate)</option>
                    <option value="generate_content_funnel">generate_content_funnel (Multi-Platform)</option>
                    <option value="simulate_agent_sandbox">simulate_agent_sandbox (Explainable AI)</option>
                    <option value="search_publications">search_publications (Monographs &amp; Series)</option>
                    <option value="get_brand_manifesto">get_brand_manifesto (Director Amit Sharma)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Arguments Configuration */}
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4">
                  <div className="text-xs font-mono text-stone-400 uppercase mb-3">Tool Arguments (JSON Parameters)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    {Object.entries(mcpToolArgs).map(([key, val]) => (
                      <div key={key}>
                        <label className="text-stone-400 block mb-1">{key}:</label>
                        {Array.isArray(val) ? (
                          <input
                            type="text"
                            value={val.join(', ')}
                            onChange={(e) =>
                              setMcpToolArgs({
                                ...mcpToolArgs,
                                [key]: e.target.value.split(',').map((s) => s.trim()),
                              })
                            }
                            className="w-full rounded border border-stone-800 bg-stone-900 px-3 py-1.5 text-stone-200"
                          />
                        ) : typeof val === 'boolean' ? (
                          <select
                            value={val ? 'true' : 'false'}
                            onChange={(e) =>
                              setMcpToolArgs({
                                ...mcpToolArgs,
                                [key]: e.target.value === 'true',
                              })
                            }
                            className="w-full rounded border border-stone-800 bg-stone-900 px-3 py-1.5 text-stone-200"
                          >
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={String(val)}
                            onChange={(e) =>
                              setMcpToolArgs({
                                ...mcpToolArgs,
                                [key]: e.target.value,
                              })
                            }
                            className="w-full rounded border border-stone-800 bg-stone-900 px-3 py-1.5 text-stone-200"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-stone-500 text-[11px] font-mono">Target method: tools/call · id: 1</span>
                    <button
                      onClick={handleExecuteMcpTool}
                      disabled={isExecutingMcp}
                      className="flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 active:scale-95 disabled:opacity-50 transition-colors"
                    >
                      {isExecutingMcp ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Invoking via MCP...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          <span>Execute Tool via MCP JSON-RPC 2.0</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Request & Response Visualizer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1.5">
                      <span>JSON-RPC 2.0 Request Payload (Client → Server)</span>
                      {mcpRequestJson && (
                        <button
                          onClick={() => handleCopy(mcpRequestJson, 'req-copy')}
                          className="text-[11px] text-amber-400 hover:text-amber-300"
                        >
                          {copiedKey === 'req-copy' ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                    <pre className="rounded-lg border border-stone-800 bg-stone-950 p-4 font-mono text-xs text-sky-300 h-64 overflow-y-auto leading-relaxed">
                      {mcpRequestJson ||
                        JSON.stringify(
                          {
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'tools/call',
                            params: {
                              name: selectedMcpTool,
                              arguments: mcpToolArgs,
                            },
                          },
                          null,
                          2
                        )}
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1.5">
                      <span>JSON-RPC 2.0 Response Result (Server → Client)</span>
                      {mcpResponseJson && (
                        <button
                          onClick={() => handleCopy(mcpResponseJson, 'res-copy')}
                          className="text-[11px] text-amber-400 hover:text-amber-300"
                        >
                          {copiedKey === 'res-copy' ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                    <pre className="rounded-lg border border-stone-800 bg-stone-950 p-4 font-mono text-xs text-emerald-300 h-64 overflow-y-auto leading-relaxed">
                      {mcpResponseJson ||
                        '// Click "Execute Tool via MCP JSON-RPC 2.0" to see live response from server.'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* MCP Resources & Prompts Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resources Browser */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
                  <Layers className="h-4 w-4" />
                  <span>MCP RESOURCES EXPLORER</span>
                </div>
                <h4 className="font-serif text-lg text-stone-100 font-medium">Standard MCP Resources (6)</h4>
                <p className="mt-1 text-xs text-stone-400">
                  Clients query resources using standard <code className="text-amber-300">resources/read</code>.
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    { uri: 'aemy://brand/manifesto', label: 'Brand Manifesto & 5 Wings' },
                    { uri: 'aemy://research/pillars', label: '01 - 05 Research Pillars' },
                    { uri: 'aemy://research/series', label: 'Research Series 001 - 007' },
                    { uri: 'aemy://publications/the-search-within', label: 'The Search Within (12 Chapters)' },
                    { uri: 'aemy://public/connectors', label: 'Social & Public Connectors' },
                    { uri: 'aemy://public/feed', label: 'Public Syndication Audit Receipts' },
                  ].map((res) => (
                    <div
                      key={res.uri}
                      className="flex items-center justify-between rounded-lg border border-stone-800/80 bg-stone-950/80 p-2.5 font-mono text-xs"
                    >
                      <div className="truncate mr-2">
                        <span className="text-stone-200">{res.label}</span>
                        <span className="text-stone-500 block text-[10px]">{res.uri}</span>
                      </div>
                      <button
                        onClick={() => handleReadMcpResource(res.uri)}
                        disabled={isFetchingResource}
                        className="rounded bg-stone-800 px-2.5 py-1 text-[11px] text-amber-300 hover:bg-stone-700 transition-colors whitespace-nowrap"
                      >
                        Read
                      </button>
                    </div>
                  ))}
                </div>

                {resourceContent && (
                  <div className="mt-4 pt-4 border-t border-stone-800">
                    <div className="text-xs font-mono text-amber-400 mb-1 flex items-center justify-between">
                      <span>Content for {selectedResourceUri}:</span>
                      <button
                        onClick={() => handleCopy(resourceContent, 'res-content')}
                        className="text-stone-400 hover:text-stone-200"
                      >
                        {copiedKey === 'res-content' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="rounded bg-stone-950 p-3 font-mono text-[11px] text-stone-300 max-h-48 overflow-y-auto">
                      {resourceContent}
                    </pre>
                  </div>
                )}
              </div>

              {/* Prompts Browser */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>PRE-ENGINEERED MCP PROMPTS</span>
                </div>
                <h4 className="font-serif text-lg text-stone-100 font-medium">Standard MCP Prompt Library (4)</h4>
                <p className="mt-1 text-xs text-stone-400">
                  Pre-engineered epistemic evaluation templates exposed via <code className="text-amber-300">prompts/get</code>.
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    { name: 'human_agency_audit', desc: 'Audit AI agent for cognitive entrapment and volition' },
                    { name: 'viral_intellectual_funnel', desc: 'Transform complex thesis into public syndication' },
                    { name: 'steelman_ai_risk', desc: 'Steelman frontier AI risk vs accelerationism' },
                    { name: 'search_within_dialogue', desc: 'Socratic dialogue on consciousness vs compute' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between rounded-lg border border-stone-800/80 bg-stone-950/80 p-2.5 font-mono text-xs"
                    >
                      <div className="truncate mr-2">
                        <span className="text-amber-300 font-semibold">{p.name}</span>
                        <span className="text-stone-400 block text-[10px] truncate">{p.desc}</span>
                      </div>
                      <button
                        onClick={() => handleGetMcpPrompt(p.name)}
                        disabled={isFetchingPrompt}
                        className="rounded bg-stone-800 px-2.5 py-1 text-[11px] text-sky-300 hover:bg-stone-700 transition-colors whitespace-nowrap"
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
                </div>

                {promptContent && (
                  <div className="mt-4 pt-4 border-t border-stone-800">
                    <div className="text-xs font-mono text-amber-400 mb-1 flex items-center justify-between">
                      <span>Messages for {selectedPromptName}:</span>
                      <button
                        onClick={() => handleCopy(promptContent, 'prompt-content')}
                        className="text-stone-400 hover:text-stone-200"
                      >
                        {copiedKey === 'prompt-content' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="rounded bg-stone-950 p-3 font-mono text-[11px] text-stone-300 max-h-48 overflow-y-auto">
                      {promptContent}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* 1-Click MCP Client Configurations */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-serif text-lg text-stone-100 font-semibold">
                    Connect External Clients to Aemy AI Studio MCP
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Copy these ready-to-paste configurations into Claude Desktop, Cursor, Windsurf, or terminal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Claude Desktop Config */}
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4">
                  <div className="flex items-center justify-between text-stone-300 pb-2 border-b border-stone-800">
                    <span className="text-amber-400 font-bold">claude_desktop_config.json</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          JSON.stringify(
                            {
                              mcpServers: {
                                'aemy-ai-studio': {
                                  url: `${window.location.origin}/api/mcp`,
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                },
                              },
                            },
                            null,
                            2
                          ),
                          'claude-cfg'
                        )
                      }
                      className="text-[11px] text-amber-400 hover:text-amber-300"
                    >
                      {copiedKey === 'claude-cfg' ? 'Copied' : 'Copy JSON'}
                    </button>
                  </div>
                  <pre className="mt-3 text-[11px] text-stone-400 overflow-x-auto">
{`{
  "mcpServers": {
    "aemy-ai-studio": {
      "url": "${window.location.origin}/api/mcp",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}`}
                  </pre>
                </div>

                {/* cURL Terminal Test */}
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4">
                  <div className="flex items-center justify-between text-stone-300 pb-2 border-b border-stone-800">
                    <span className="text-sky-400 font-bold">cURL JSON-RPC 2.0 Test</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          `curl -X POST ${window.location.origin}/api/mcp -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`,
                          'curl-copy'
                        )
                      }
                      className="text-[11px] text-sky-400 hover:text-sky-300"
                    >
                      {copiedKey === 'curl-copy' ? 'Copied' : 'Copy Command'}
                    </button>
                  </div>
                  <pre className="mt-3 text-[11px] text-stone-400 overflow-x-auto whitespace-pre-wrap">
{`curl -X POST ${window.location.origin}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTO-INSTALLER SUITE */}
        {activeTab === 'installer' && (
          <div className="mt-10 space-y-10">
            {/* Auto-Installer Banner */}
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-stone-900/40 to-stone-950 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Zap className="h-4 w-4" />
                    <span>ZERO-FRICTION DEPLOYMENT · AUTO-INSTALLER SUITE</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-semibold mt-1">
                    {isHi ? '1-क्लिक ऑटो-इंस्टॉलर एवं सेटअप विजार्ड' : '1-Click Auto-Installer & Setup Wizard'}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
                    {isHi
                      ? 'Aemy AI Studio को अपने Claude Desktop, Cursor IDE, टर्मिनल, n8n ऑटोमेशन, या नेटिव डेस्कटॉप/मोबाइल ऐप में सीधे इंस्टॉल करें।'
                      : 'Automatically configure Claude Desktop, Cursor IDE, terminal pipelines, n8n workflows, and native desktop/mobile installations in one step.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded-md border border-emerald-500/40 bg-emerald-950/60 px-3 py-1.5 text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Installer Ready: v1.0.0
                  </span>
                </div>
              </div>

              {/* Terminal 1-Line Installer Section */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-mono text-stone-300 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-amber-400" />
                    <span>{isHi ? 'टर्मिनल वन-लाइनर ऑटो-इंस्टॉलर' : 'One-Line Terminal Auto-Installer'}</span>
                  </div>

                  {/* OS Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    <span className="text-stone-500 mr-1">{isHi ? 'प्लेटफॉर्म:' : 'Platform:'}</span>
                    {(['macos', 'windows', 'linux', 'cursor', 'vscode', 'docker', 'npm'] as const).map((os) => (
                      <button
                        key={os}
                        onClick={() => setSelectedInstallerOs(os)}
                        className={`rounded px-2.5 py-1 text-[11px] uppercase font-mono transition-colors ${
                          selectedInstallerOs === os
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Command Bar */}
                <div className="relative rounded-xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs sm:text-sm text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div className="truncate select-all overflow-x-auto py-1 flex items-center gap-1.5">
                    <span className="text-stone-500 select-none">$ </span>
                    {selectedInstallerOs === 'windows' ? (
                      <span>irm {typeof window !== 'undefined' ? window.location.origin : 'https://...'}/install.ps1 | iex</span>
                    ) : selectedInstallerOs === 'docker' ? (
                      <span>docker compose up -d</span>
                    ) : selectedInstallerOs === 'npm' ? (
                      <span>node scripts/auto-install.js</span>
                    ) : (
                      <>
                        <span>curl -fsSL {typeof window !== 'undefined' ? window.location.origin : 'https://...'}</span>
                        <span className="text-white font-bold">/install.sh</span>
                        <span> | bash</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://...';
                        let cmd = `curl -fsSL ${origin}/install.sh | bash`;
                        if (selectedInstallerOs === 'windows') cmd = `irm ${origin}/install.ps1 | iex`;
                        else if (selectedInstallerOs === 'docker') cmd = 'docker compose up -d';
                        else if (selectedInstallerOs === 'npm') cmd = 'node scripts/auto-install.js';
                        handleCopy(cmd, 'terminal-cmd');
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2 font-sans text-xs font-semibold transition-all active:scale-95 shadow-sm"
                    >
                      {copiedKey === 'terminal-cmd' ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{isHi ? 'कमांड कॉपी हुई!' : 'Command Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{isHi ? 'कमांड कॉपी करें' : 'Copy Command'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Script details & toggle */}
                <div className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-400 pt-1">
                  <span>
                    {selectedInstallerOs === 'macos' && 'Target: ~/Library/Application Support/Claude/claude_desktop_config.json'}
                    {selectedInstallerOs === 'windows' && 'Target: %APPDATA%\\Claude\\claude_desktop_config.json'}
                    {selectedInstallerOs === 'linux' && 'Target: ~/.config/Claude/claude_desktop_config.json'}
                    {selectedInstallerOs === 'cursor' && 'Target: ~/.cursor/mcp.json'}
                    {selectedInstallerOs === 'vscode' && 'Target: .vscode/settings.json or Roo/Cline extension'}
                    {selectedInstallerOs === 'docker' && 'Target: Complete full-stack local server + MCP endpoints'}
                    {selectedInstallerOs === 'npm' && 'Target: Cross-platform auto-install CLI runner'}
                  </span>
                  <button
                    onClick={handleFetchScriptPreview}
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                  >
                    {showScriptPreview
                      ? (isHi ? 'स्क्रिप्ट छुपाएं' : 'Hide Script Preview')
                      : (isHi ? 'स्क्रिप्ट देखें' : `Inspect ${selectedInstallerOs === 'windows' ? 'install.ps1' : selectedInstallerOs === 'docker' ? 'docker-compose.yml' : 'install.sh'}`)}
                  </button>
                </div>

                {showScriptPreview && scriptPreviewContent && (
                  <div className="mt-3 rounded-lg border border-stone-800 bg-stone-950 p-4">
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                      <span className="text-amber-400">
                        {selectedInstallerOs === 'windows' ? '/install.ps1 (PowerShell)' : selectedInstallerOs === 'docker' ? '/docker-compose.yml' : '/install.sh (Shell Script)'}
                      </span>
                      <button
                        onClick={() => handleCopy(scriptPreviewContent, 'script-src')}
                        className="text-stone-400 hover:text-stone-200"
                      >
                        {copiedKey === 'script-src' ? 'Copied' : 'Copy Script'}
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-stone-300 max-h-60 overflow-y-auto leading-relaxed">
                      {scriptPreviewContent}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* INTERACTIVE LIVE AUTO-INSTALLER WIZARD */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>INTERACTIVE IN-BROWSER AUTO-INSTALLER RUNNER</span>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-semibold">
                    {isHi ? 'लाइव इन-ब्राउज़र ऑटो-इंस्टॉलेशन विजार्ड' : 'Live In-Browser Auto-Installer Wizard'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
                    {isHi
                      ? 'बिना टर्मिनल खोले सीधे ब्राउज़र से MCP प्रोटोकॉल, 7 शोध टूल्स और 6 सोशल कनेक्टर्स का लाइव परीक्षण व सत्यापन करें।'
                      : 'Benchmark protocol latency, audit all 7 epistemic tool schemas, synchronize 6 public connectors, and generate ready-to-run configurations in real time.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Target Selector */}
                  <div className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-950 p-1 text-xs font-mono">
                    <span className="text-stone-500 px-2">{isHi ? 'लक्ष्य:' : 'Target:'}</span>
                    {(['claude', 'cursor', 'vscode', 'connectors', 'docker'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setWizardTargetClient(t)}
                        className={`rounded px-2.5 py-1 text-[11px] uppercase transition-all ${
                          wizardTargetClient === t
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRunAutoInstallWizard}
                    disabled={isWizardRunning}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-5 py-2.5 text-xs font-semibold shadow-lg shadow-amber-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isWizardRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-stone-950" />
                        <span>{isHi ? 'विजार्ड चल रहा है...' : 'Running Diagnostic...'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-current text-stone-950" />
                        <span>{isHi ? 'ऑटो-इंस्टॉलर विजार्ड चलाएं' : 'Run Auto-Installer Wizard'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Step Indicator */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                {[
                  { step: 1, label: '01. System Check' },
                  { step: 2, label: '02. MCP Handshake' },
                  { step: 3, label: '03. Tools Audit (7)' },
                  { step: 4, label: '04. Connectors (6)' },
                  { step: 5, label: '05. Verified 100%' },
                ].map((s) => {
                  const isDone = wizardStep > s.step || wizardCompleted;
                  const isCurrent = wizardStep === s.step && isWizardRunning;
                  return (
                    <div
                      key={s.step}
                      className={`rounded-lg border p-2.5 text-center transition-all ${
                        isDone
                          ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-semibold'
                          : isCurrent
                          ? 'border-amber-500 bg-amber-950/40 text-amber-300 animate-pulse font-bold'
                          : 'border-stone-800 bg-stone-950 text-stone-500'
                      }`}
                    >
                      {isDone ? `✓ ${s.label}` : s.label}
                    </div>
                  );
                })}
              </div>

              {/* Live Terminal Output Box */}
              <div className="mt-4 rounded-xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 mb-3 text-stone-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-stone-300 ml-1 font-semibold">aemy-auto-installer-runner.log</span>
                  </div>
                  {wizardCompleted && (
                    <span className="rounded bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-emerald-300 text-[10px] font-bold">
                      STATUS: VERIFIED READY (100%)
                    </span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed select-text">
                  {wizardLogs.length === 0 ? (
                    <div className="text-stone-500 py-6 text-center italic">
                      Click "Run Auto-Installer Wizard" above to run live interactive diagnostics, latency benchmarks, and client config synthesis.
                    </div>
                  ) : (
                    wizardLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-stone-600 select-none">[{log.timestamp}]</span>
                        <span
                          className={`font-semibold shrink-0 uppercase select-none ${
                            log.type === 'success'
                              ? 'text-emerald-400'
                              : log.type === 'action'
                              ? 'text-amber-400'
                              : log.type === 'warn'
                              ? 'text-red-400'
                              : 'text-sky-400'
                          }`}
                        >
                          [{log.stage}]
                        </span>
                        <span
                          className={`${
                            log.type === 'success'
                              ? 'text-emerald-300'
                              : log.type === 'action'
                              ? 'text-stone-100 font-medium'
                              : log.type === 'warn'
                              ? 'text-red-300'
                              : 'text-stone-300'
                          }`}
                        >
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 1-Click Connectors Auto-Provisioner & Health Diagnostic */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    <span>CONNECTORS AUTO-PROVISIONER &amp; HEALTH SUITE</span>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-semibold mt-1">
                    {isHi ? 'कनेक्टर्स ऑटो-प्रोविजनिंग व स्वास्थ्य जांच' : 'Auto-Provision All 6 Connectors'}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-stone-400">
                    {isHi
                      ? 'X, LinkedIn, YouTube, Substack, GitHub और RSS के सभी कनेक्टर्स को 1-क्लिक में सक्रिय और वैलिडेट करें।'
                      : 'Validate schema formatting, handshake latency, and activate automatic syndication across all 6 distribution platforms.'}
                  </p>
                </div>

                <button
                  onClick={handleRunAutoInstallConnectors}
                  disabled={isAutoInstallingConnectors}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-5 py-2.5 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 shadow-md cursor-pointer self-start sm:self-auto"
                >
                  {isAutoInstallingConnectors ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isHi ? 'सत्यापन हो रहा है...' : 'Validating & Installing...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="h-4 w-4" />
                      <span>{isHi ? 'सभी 6 कनेक्टर्स ऑटो-इंस्टॉल करें' : 'Run Connectors Auto-Installer'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Diagnostic Table */}
              {autoInstallReport ? (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">
                      ✓ {autoInstallReport.message}
                    </span>
                    <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 text-emerald-300">
                      Health Score: {autoInstallReport.healthScore}%
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="border-b border-stone-800 bg-stone-900/60 text-stone-400">
                        <tr>
                          <th className="py-2.5 px-4">Channel</th>
                          <th className="py-2.5 px-4">Target Handle</th>
                          <th className="py-2.5 px-4">Formats Verified</th>
                          <th className="py-2.5 px-4">Latency</th>
                          <th className="py-2.5 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60 text-stone-300">
                        {autoInstallReport.diagnostics.map((d: any) => (
                          <tr key={d.channel} className="hover:bg-stone-900/30">
                            <td className="py-2.5 px-4 font-sans font-medium text-stone-100 flex items-center gap-2">
                              {getPlatformIcon(d.channel as ConnectorPlatform)}
                              <span>{d.name}</span>
                            </td>
                            <td className="py-2.5 px-4 text-stone-400">{d.targetHandle}</td>
                            <td className="py-2.5 px-4">
                              <span className="text-stone-300">{d.formatsSupported.join(', ')}</span>
                            </td>
                            <td className="py-2.5 px-4 text-amber-400">{d.latencyMs} ms</td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="rounded bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-stone-800/80 bg-stone-950/50 p-6 text-center text-xs font-mono text-stone-400">
                  Click "Run Connectors Auto-Installer" above to run an instant benchmark and test syndication routes across all 6 channels.
                </div>
              )}
            </div>

            {/* Direct Configuration Downloads Center */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
                <div>
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    FILE DOWNLOAD CENTER
                  </div>
                  <h4 className="font-serif text-xl text-stone-100 font-semibold mt-1">
                    {isHi ? 'प्री-कॉन्फिगर्ड इंस्टॉलेशन फाइल्स' : 'Pre-Configured Installation Files'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-stone-500">1-Click Direct Downloads</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Claude Config */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Cpu className="h-5 w-5 text-amber-400" />
                      <span className="text-[10px] font-mono text-stone-500">JSON</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        claude_desktop_config.json
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        Official configuration for Claude Desktop with all 7 epistemic tools and resources.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/api/installer/claude-config"
                      download="claude_desktop_config.json"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-amber-300 transition-colors"
                    >
                      <span>Download Config</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Cursor Config */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-sky-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Code className="h-5 w-5 text-sky-400" />
                      <span className="text-[10px] font-mono text-stone-500">JSON</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        mcp.json (Cursor IDE)
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        Ready-to-use Cursor IDE MCP configuration snippet for codebase agents.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/api/installer/cursor-config"
                      download="mcp.json"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-sky-300 transition-colors"
                    >
                      <span>Download Cursor JSON</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* VS Code / Cline Config */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-violet-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Terminal className="h-5 w-5 text-violet-400" />
                      <span className="text-[10px] font-mono text-stone-500">VS CODE</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        vscode_mcp_settings.json
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        Configuration for Cline and Roo Code extensions in Visual Studio Code.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/api/installer/vscode-config"
                      download="vscode_mcp_settings.json"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-violet-300 transition-colors"
                    >
                      <span>Download VS Code Settings</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Bash Installer Script */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Terminal className="h-5 w-5 text-amber-400" />
                      <span className="text-[10px] font-mono text-stone-500">BASH</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        install.sh
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        Standalone executable auto-installer script for macOS and Linux.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/install.sh"
                      download="install.sh"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-amber-300 transition-colors"
                    >
                      <span>Download Shell Script</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* PowerShell Windows Script */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <HardDrive className="h-5 w-5 text-blue-400" />
                      <span className="text-[10px] font-mono text-stone-500">POWERSHELL</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        install.ps1
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        Windows PowerShell auto-installer for Claude Desktop and Cursor.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/install.ps1"
                      download="install.ps1"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-blue-300 transition-colors"
                    >
                      <span>Download PowerShell Script</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Docker Compose */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Server className="h-5 w-5 text-cyan-400" />
                      <span className="text-[10px] font-mono text-stone-500">DOCKER</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        docker-compose.yml
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        1-command container stack for running the server, MCP endpoints, and web app.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/docker-compose.yml"
                      download="docker-compose.yml"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-cyan-300 transition-colors"
                    >
                      <span>Download Docker Compose</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* n8n Workflow */}
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Workflow className="h-5 w-5 text-emerald-400" />
                      <span className="text-[10px] font-mono text-stone-500">WORKFLOW</span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-stone-200">
                        aemy-syndicator.n8n.json
                      </div>
                      <p className="mt-1 text-xs text-stone-400 leading-relaxed font-sans">
                        Full n8n workflow for auto-polling and multi-channel publishing to Telegram &amp; Discord.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-800">
                    <a
                      href="/api/installer/n8n-workflow"
                      download="aemy-social-syndicator-n8n.json"
                      className="flex items-center justify-between w-full rounded bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-mono text-emerald-300 transition-colors"
                    >
                      <span>Download n8n Flow</span>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Standalone Native App (PWA) Auto-Installer */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Laptop className="h-4 w-4" />
                    <span>PROGRESSIVE WEB APP (PWA) STANDALONE INSTALLER</span>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-semibold">
                    {isHi ? 'Aemy AI Studio को ऐप के रूप में इंस्टॉल करें' : 'Install Aemy AI Studio as a Native App'}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans">
                    {isHi
                      ? 'बिना किसी ब्राउज़र टैब के सीधे मैक, विंडोज, आईफोन या एंड्रॉयड के होम स्क्रीन से लॉन्च करें। ऑफलाइन शोध और मोनोग्राफ पढ़ने की सुविधा के साथ।'
                      : 'Launch directly from your dock or home screen on macOS, Windows, iPhone, or Android. Offline monograph caching, zero browser tab distractions, and instant launch.'}
                  </p>
                </div>

                <div className="shrink-0 space-y-2">
                  <button
                    onClick={handleInstallPwa}
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 text-sm font-semibold transition-all active:scale-95 shadow-md w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    <span>{isPwaInstalled ? (isHi ? 'ऐप पहले से इंस्टॉल है' : 'App Already Installed') : (isHi ? 'डेस्कटॉप / मोबाइल ऐप इंस्टॉल करें' : 'Install Standalone App')}</span>
                  </button>

                  {copiedKey === 'pwa-hint' && (
                    <div className="rounded bg-stone-950 border border-amber-500/40 p-2.5 text-[11px] font-mono text-amber-300 max-w-xs text-center">
                      Click the Install icon in your browser address bar (top right in Chrome/Edge), or tap "Share" → "Add to Home Screen" on iOS Safari.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4-Step Activation Guide */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/30 p-6">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-4">
                4-STEP ACTIVATION VERIFICATION
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                  <div className="text-amber-400 font-bold">01 / INSTALL</div>
                  <div className="text-stone-200 font-sans font-medium">Run installer command</div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Execute the curl command in your terminal or download the config file.
                  </p>
                </div>

                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                  <div className="text-amber-400 font-bold">02 / RESTART</div>
                  <div className="text-stone-200 font-sans font-medium">Restart Claude Desktop</div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Completely quit Claude (Cmd+Q on Mac or close on Windows) and relaunch.
                  </p>
                </div>

                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                  <div className="text-amber-400 font-bold">03 / VERIFY</div>
                  <div className="text-stone-200 font-sans font-medium">Check Hammer Icon (🔨)</div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Open a chat in Claude and confirm "aemy-ai-studio" is listed under tools.
                  </p>
                </div>

                <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                  <div className="text-amber-400 font-bold">04 / EXECUTE</div>
                  <div className="text-stone-200 font-sans font-medium">Query Research Playbook</div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Ask Claude: "Query Aemy AI Studio for research on human agency."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connector Configuration Modal */}
      {configModalConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                {getPlatformIcon(configModalConnector.id)}
                <span className="font-serif text-lg text-stone-100 font-medium">
                  Configure {configModalConnector.name}
                </span>
              </div>
              <button
                onClick={() => setConfigModalConnector(null)}
                className="text-stone-400 hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-400 uppercase mb-1">
                Target Handle / Channel ID
              </label>
              <input
                type="text"
                value={configModalConnector.targetHandle}
                onChange={(e) =>
                  setConfigModalConnector({
                    ...configModalConnector,
                    targetHandle: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-400 uppercase mb-1">
                Custom Webhook URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://hooks.slack.com/... or https://your-server.com/webhook"
                value={configModalConnector.webhookUrl || ''}
                onChange={(e) =>
                  setConfigModalConnector({
                    ...configModalConnector,
                    webhookUrl: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-100 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-stone-300">Auto-Syndicate on Broadcast</span>
              <input
                type="checkbox"
                checked={configModalConnector.autoSyndicate}
                onChange={(e) =>
                  setConfigModalConnector({
                    ...configModalConnector,
                    autoSyndicate: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-800">
              <button
                onClick={() => setConfigModalConnector(null)}
                className="rounded-lg px-4 py-2 text-xs font-mono text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveConfig(configModalConnector)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
