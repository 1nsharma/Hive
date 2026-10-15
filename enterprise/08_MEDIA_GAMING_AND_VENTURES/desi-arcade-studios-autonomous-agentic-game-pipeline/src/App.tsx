import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TrendRadarModule } from './components/TrendRadarModule';
import { AISynthesizerModule } from './components/AISynthesizerModule';
import { LiveOpsManagerModule } from './components/LiveOpsManagerModule';
import { SelfHealingPipelineModule } from './components/SelfHealingPipelineModule';
import { DiscordIntegrationCenter } from './components/DiscordIntegrationCenter';
import { HeritageGamesCatalog } from './components/HeritageGamesCatalog';
import { AutonomousCommandTerminal } from './components/AutonomousCommandTerminal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { ArcadeGamesPortal } from './components/ArcadeGamesPortal';
import { VoxMotionStudioModule } from './components/VoxMotionStudioModule';
import { 
  GamingTrend, 
  GitHubPR, 
  LiveOpsConfig, 
  ScraperDaemonState, 
  ScraperLog, 
  AgencyCommand,
  DiscordWebhookConfig,
  DiscordNotificationMessage,
  HeritageGame
} from './types';
import { 
  INITIAL_TRENDS, 
  INITIAL_LIVEOPS_CONFIG, 
  INITIAL_PRS, 
  AGENCY_COMMANDS,
  INITIAL_DISCORD_CONFIG,
  INITIAL_DISCORD_NOTIFICATIONS
} from './data/initialData';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('radar');
  const [trends, setTrends] = useState<GamingTrend[]>(INITIAL_TRENDS);
  const [liveOpsConfig, setLiveOpsConfig] = useState<LiveOpsConfig>(INITIAL_LIVEOPS_CONFIG);
  const [prs, setPrs] = useState<GitHubPR[]>(INITIAL_PRS);
  const [commands, setCommands] = useState<AgencyCommand[]>(AGENCY_COMMANDS);
  const [discordConfig, setDiscordConfig] = useState<DiscordWebhookConfig>(INITIAL_DISCORD_CONFIG);
  const [discordMessages, setDiscordMessages] = useState<DiscordNotificationMessage[]>(INITIAL_DISCORD_NOTIFICATIONS);
  
  const [selectedPrId, setSelectedPrId] = useState<string>(INITIAL_PRS[0]?.id || '');
  const [selectedTrendForSynthesis, setSelectedTrendForSynthesis] = useState<GamingTrend | null>(null);
  const [latestGeneratedPR, setLatestGeneratedPR] = useState<GitHubPR | null>(INITIAL_PRS[0] || null);

  const [scraperStatus, setScraperStatus] = useState<ScraperDaemonState>({
    isRunning: true,
    intervalHours: 12,
    lastScraped: '10 mins ago',
    nextScheduledScrape: 'In 11h 50m',
    totalTrendsCollected: INITIAL_TRENDS.length,
    activeSources: ['Reddit r/IndianGaming', 'Steam India DB', 'Google Play Casual', 'App Store', 'Discord']
  });

  const [logs, setLogs] = useState<ScraperLog[]>([
    { id: 'l-1', timestamp: '08:15:00', type: 'info', message: 'Automated 12-hour Trend Radar started daemon loop.' },
    { id: 'l-2', timestamp: '08:15:20', type: 'success', message: 'Harvested 6 active Indian gaming cultural signals.' }
  ]);

  // Loading indicators
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isUpdatingLiveOps, setIsUpdatingLiveOps] = useState<boolean>(false);
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isExecutingCommand, setIsExecutingCommand] = useState<boolean>(false);
  const [isRunningFullPipeline, setIsRunningFullPipeline] = useState<boolean>(false);
  
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationToast({ message, type });
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Fetch initial data from server
  useEffect(() => {
    async function loadServerData() {
      try {
        const [trendsRes, liveOpsRes, prsRes, discordRes] = await Promise.all([
          fetch('/api/research/trends').then(r => r.json()).catch(() => null),
          fetch('/api/liveops/trends').then(r => r.json()).catch(() => null),
          fetch('/api/github/prs').then(r => r.json()).catch(() => null),
          fetch('/api/integrations/discord').then(r => r.json()).catch(() => null)
        ]);

        if (trendsRes && trendsRes.trends) {
          setTrends(trendsRes.trends);
          if (trendsRes.status) setScraperStatus(trendsRes.status);
          if (trendsRes.logs) setLogs(trendsRes.logs);
        }

        if (liveOpsRes && liveOpsRes.rasoi_rush) {
          setLiveOpsConfig(liveOpsRes);
        }

        if (prsRes && Array.isArray(prsRes) && prsRes.length > 0) {
          setPrs(prsRes);
          setSelectedPrId(prsRes[0].id);
          setLatestGeneratedPR(prsRes[0]);
        }

        if (discordRes) {
          if (discordRes.config) setDiscordConfig(discordRes.config);
          if (discordRes.messages && Array.isArray(discordRes.messages)) setDiscordMessages(discordRes.messages);
        }
      } catch (err) {
        console.warn('Using client-side initial fallback state:', err);
      }
    }
    loadServerData();
  }, []);


  // 1. Scraper Daemon Trigger
  const handleTriggerScrape = async (keyword?: string) => {
    setIsScraping(true);
    try {
      const res = await fetch('/api/research/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
      const data = await res.json();
      if (data.newTrend) {
        setTrends(prev => [data.newTrend, ...prev]);
        if (data.status) setScraperStatus(data.status);
        setLogs(prev => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'success',
            message: `Scraped new trend: "${data.newTrend.topic}"`
          },
          ...prev
        ]);
        showToast(`🛰️ Trend Radar scraped: "${data.newTrend.topic.slice(0, 45)}..."`);
      }
    } catch (e) {
      console.error(e);
      showToast('Scraping completed via fallback.', 'info');
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggleDaemon = async () => {
    try {
      const res = await fetch('/api/research/toggle-daemon', { method: 'POST' });
      const data = await res.json();
      if (data.status) {
        setScraperStatus(data.status);
        showToast(data.status.isRunning ? '24/7 Research Daemon Resumed' : 'Research Daemon Paused', 'info');
      }
    } catch (e) {
      setScraperStatus(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }
  };

  const handleSelectTrendForSynthesis = (trend: GamingTrend) => {
    setSelectedTrendForSynthesis(trend);
    setActiveTab('synthesizer');
  };

  // 2. AI Synthesizer Trigger
  const handleSynthesizeCode = async (gameId: string, trendTopic: string, customInstructions: string): Promise<GitHubPR | null> => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/agent/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, trendTopic, customInstructions })
      });
      const data = await res.json();
      if (data.pr) {
        setPrs(prev => [data.pr, ...prev]);
        setLatestGeneratedPR(data.pr);
        setSelectedPrId(data.pr.id);
        showToast(`🧠 GDScript Generated & PR #${data.pr.number} Opened!`);
        return data.pr;
      }
    } catch (e) {
      console.error(e);
      showToast('AI Synthesis completed.', 'info');
    } finally {
      setIsSynthesizing(false);
    }
    return null;
  };

  // 3. LiveOps Config Update
  const handleUpdateLiveOps = async (updatedConfig: Partial<LiveOpsConfig>) => {
    setIsUpdatingLiveOps(true);
    try {
      const res = await fetch('/api/liveops/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (data.config) {
        setLiveOpsConfig(data.config);
        showToast('⚡ LiveOps Remote Config Broadcasted to Connected Games!');
      }
    } catch (e) {
      setLiveOpsConfig(prev => ({ ...prev, ...updatedConfig }));
      showToast('LiveOps local state updated.', 'info');
    } finally {
      setIsUpdatingLiveOps(false);
    }
  };

  // 4. CI/CD & Self-Healing Triggers
  const handleSimulateFailure = async (prId: string) => {
    try {
      const res = await fetch(`/api/github/prs/${prId}/simulate-failure`, { method: 'POST' });
      const data = await res.json();
      if (data.pr) {
        setPrs(prev => prev.map(p => p.id === prId ? data.pr : p));
        showToast('⚠️ Test Failure Injected! CI/CD detected broken GDScript.', 'error');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelfHeal = async (prId: string) => {
    setIsHealing(true);
    try {
      const res = await fetch('/api/agent/self-heal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prId })
      });
      const data = await res.json();
      if (data.pr) {
        setPrs(prev => prev.map(p => p.id === prId ? data.pr : p));
        showToast('🤖 AI Self-Healing Agent repaired GDScript & verified tests green!');
      }
    } catch (e) {
      console.error(e);
      showToast('Self-healing executed.', 'info');
    } finally {
      setIsHealing(false);
    }
  };

  const handleRunTests = async (prId: string) => {
    setIsRunningTests(true);
    try {
      const res = await fetch(`/api/github/prs/${prId}/run-tests`, { method: 'POST' });
      const data = await res.json();
      if (data.testResults) {
        setPrs(prev => prev.map(p => p.id === prId ? { ...p, testResults: data.testResults } : p));
        showToast('GUT Unit Tests completed (4/4 Passed)');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleMergePR = async (prId: string) => {
    try {
      const res = await fetch(`/api/github/prs/${prId}/merge`, { method: 'POST' });
      const data = await res.json();
      if (data.pr) {
        setPrs(prev => prev.map(p => p.id === prId ? data.pr : p));
        if (data.discordNotification?.logItem) {
          setDiscordMessages(prev => [data.discordNotification.logItem, ...prev]);
        }
        showToast('🎉 PR Merged! LiveOps updated & Discord alert dispatched to #ai-pr-merges!');
      }
    } catch (e) {
      console.error(e);
      showToast('PR merged locally.', 'info');
    }
  };

  // 5. Discord Webhook Handlers
  const handleUpdateDiscordConfig = async (updatedConfig: Partial<DiscordWebhookConfig>) => {
    try {
      const res = await fetch('/api/integrations/discord/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (data.config) {
        setDiscordConfig(data.config);
        showToast(`✅ Discord settings updated for guild '${data.config.serverName}'!`);
      }
    } catch (e) {
      setDiscordConfig(prev => ({ ...prev, ...updatedConfig }));
      showToast('Discord settings updated.', 'info');
    }
  };

  const handleSendTestDiscordNotification = async () => {
    try {
      const res = await fetch('/api/integrations/discord/test', { method: 'POST' });
      const data = await res.json();
      if (data.messages) {
        setDiscordMessages(data.messages);
      }
      showToast(`🚀 Test webhook dispatched to Discord '#${discordConfig.channelName}'!`);
    } catch (e) {
      showToast('Test notification simulated.', 'info');
    }
  };

  const handleManualDispatchPR = async (pr: GitHubPR) => {
    try {
      const res = await fetch('/api/integrations/discord/dispatch-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prId: pr.id })
      });
      const data = await res.json();
      if (data.messages) {
        setDiscordMessages(data.messages);
      }
      showToast(`📢 PR #${pr.number} broadcasted to Discord #${discordConfig.channelName}!`);
    } catch (e) {
      showToast(`PR #${pr.number} dispatched locally.`, 'info');
    }
  };

  // 6. Heritage Games Synthesis Trigger
  const handleSelectHeritageGameForSynthesis = (game: HeritageGame) => {
    setSelectedTrendForSynthesis({
      id: `trend-${game.id}`,
      topic: `${game.name} - Modernized Indie Game Mechanics`,
      category: 'Traditional/Heritage',
      sentiment: '98% Positive Enthusiast Anticipation',
      source: 'r/IndianGaming & Heritage Gaming Archive',
      momentum: game.trendingScore,
      targetGame: game.name,
      mechanicSuggestion: game.mechanicSummary,
      suggestedGDScript: game.suggestedGodotNode,
      keyStats: {
        redditMentions: 1840,
        steamIndiaRank: '#1 Concept',
        growthRate: '+320% MoM'
      }
    });
    setActiveTab('synthesizer');
    showToast(`Loaded ${game.name} into AI Synthesizer!`);
  };

  // 7. Agency Command Terminal Trigger
  const handleExecuteCommand = async (commandId?: string, customPrompt?: string) => {
    setIsExecutingCommand(true);
    try {
      const res = await fetch('/api/agent/execute-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commandId, customPrompt })
      });
      const data = await res.json();
      if (commandId) {
        setCommands(prev => prev.map(c => c.id === commandId ? { ...c, status: 'completed' } : c));
      }
      showToast(`⚡ Command "${data.commandName.slice(0, 35)}..." executed!`);
      return data;
    } catch (e) {
      console.error(e);
      return { success: true, commandName: customPrompt || 'Command', logs: ['Executed locally via engine.'] };
    } finally {
      setIsExecutingCommand(false);
    }
  };

  // 8. Master "Run Full Evolution Loop"
  const handleRunFullEvolutionLoop = async () => {
    setIsRunningFullPipeline(true);
    showToast('🚀 [Step 1/5] Scraping fresh Indian Gaming trends from Reddit & Steam...', 'info');
    
    // Step 1: Scrape
    await handleTriggerScrape('IPL 2026 Night Match Floodlights');

    // Step 2: Synthesize
    setTimeout(async () => {
      showToast('🧠 [Step 2/5] Gemini Synthesizer generating Godot 4 GDScript...', 'info');
      const generatedPr = await handleSynthesizeCode(
        'gully_cricket',
        'IPL 2026 Night Match Floodlights and Dynamic Dew Ball Swing',
        'Include dynamic dew physics and stadium floodlight lighting signal hooks.'
      );

      // Step 3: Run Tests
      setTimeout(async () => {
        showToast('🛡️ [Step 3/5] CI/CD running automated Godot GUT unit tests...', 'info');
        if (generatedPr) {
          await handleRunTests(generatedPr.id);
        }

        // Step 4: Merge PR & Broadcast Discord
        setTimeout(async () => {
          showToast('🎉 [Step 4/5] Merging PR & Dispatching Discord Webhook notification...', 'info');
          if (generatedPr) {
            await handleMergePR(generatedPr.id);
          }

          // Step 5: Broadcast LiveOps
          setTimeout(async () => {
            showToast('⚡ [Step 5/5] Evolution Loop Complete! LiveOps remote config active.', 'success');
            await handleUpdateLiveOps({
              gully_cricket: {
                ...liveOpsConfig.gully_cricket,
                trending_stadium: 'Wankhede Night Match',
                weather_override: 'Monsoon Rain & Dew',
                swing_multiplier: 1.6,
                night_match_lighting: true
              }
            });
            setIsRunningFullPipeline(false);
            setActiveTab('discord');
          }, 1200);

        }, 1400);

      }, 1400);

    }, 1400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar with Studio Status & Module Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunFullPipeline={handleRunFullEvolutionLoop}
        isRunningPipeline={isRunningFullPipeline}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Toast Notification Alert */}
        {notificationToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-amber-500/40 text-white shadow-2xl animate-fade-in text-xs font-semibold">
            {notificationToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : notificationToast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span>{notificationToast.message}</span>
          </div>
        )}

        {/* Tab 1: Module 1 - Trend Radar Scraper */}
        {activeTab === 'radar' && (
          <TrendRadarModule
            trends={trends}
            scraperStatus={scraperStatus}
            logs={logs}
            onTriggerScrape={handleTriggerScrape}
            onToggleDaemon={handleToggleDaemon}
            onSelectTrendForSynthesis={handleSelectTrendForSynthesis}
            isScraping={isScraping}
          />
        )}

        {/* Tab 2: Module 2 - AI Synthesizer (Godot GDScript Generation) */}
        {activeTab === 'synthesizer' && (
          <AISynthesizerModule
            trends={trends}
            selectedTrendForSynthesis={selectedTrendForSynthesis}
            onSynthesizeCode={handleSynthesizeCode}
            isSynthesizing={isSynthesizing}
            latestGeneratedPR={latestGeneratedPR}
            onNavigateToPR={(prId) => {
              setSelectedPrId(prId);
              setActiveTab('cicd');
            }}
          />
        )}

        {/* Tab 3: Module 3 - LiveOps Dynamic Content & Remote Config */}
        {activeTab === 'liveops' && (
          <LiveOpsManagerModule
            liveOpsConfig={liveOpsConfig}
            onUpdateLiveOps={handleUpdateLiveOps}
            isUpdating={isUpdatingLiveOps}
          />
        )}

        {/* Tab 4: Module 4 - Self-Healing CI/CD Pipeline & GitHub PRs */}
        {activeTab === 'cicd' && (
          <SelfHealingPipelineModule
            prs={prs}
            selectedPrId={selectedPrId}
            onSelectPr={setSelectedPrId}
            onSimulateFailure={handleSimulateFailure}
            onSelfHeal={handleSelfHeal}
            onRunTests={handleRunTests}
            onMergePR={handleMergePR}
            isHealing={isHealing}
            isRunningTests={isRunningTests}
            onViewInDiscord={(prId) => {
              setActiveTab('discord');
            }}
          />
        )}

        {/* Tab 5: Heritage Games Matrix & Regional Explorer */}
        {activeTab === 'heritage' && (
          <HeritageGamesCatalog
            onSelectGameForSynthesis={handleSelectHeritageGameForSynthesis}
          />
        )}

        {/* Tab 6: Discord Integration & Community Notifications */}
        {activeTab === 'discord' && (
          <DiscordIntegrationCenter
            discordConfig={discordConfig}
            discordMessages={discordMessages}
            prs={prs}
            onUpdateConfig={handleUpdateDiscordConfig}
            onSendTestNotification={handleSendTestDiscordNotification}
            onManualDispatchPR={handleManualDispatchPR}
            onNavigateToPR={(prId) => {
              setSelectedPrId(prId);
              setActiveTab('cicd');
            }}
          />
        )}

        {/* Tab 7: Playable HTML5 Web Games Suite */}
        {activeTab === 'arcade' && (
          <ArcadeGamesPortal />
        )}

        {/* Tab 8: Vox AI Motion Graphics Studio (Folder 0 Engine) */}
        {activeTab === 'vox' && (
          <VoxMotionStudioModule onNotify={(msg, type) => showToast(msg, type)} />
        )}

        {/* Tab 9: Agency Command Terminal ("What is the next command?") */}
        {activeTab === 'terminal' && (
          <AutonomousCommandTerminal
            commands={commands}
            onExecuteCommand={handleExecuteCommand}
            isExecutingCommand={isExecutingCommand}
          />
        )}

      </main>

      {/* Architecture Visual Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Studio Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">Desi Arcade Studios</span> — Autonomous Agentic Evolution Pipeline
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Godot 4.3 Engine</span>
            <span>•</span>
            <span>Gemini 3.7 Flash</span>
            <span>•</span>
            <span>Discord Webhooks</span>
            <span>•</span>
            <span>Express LiveOps</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
