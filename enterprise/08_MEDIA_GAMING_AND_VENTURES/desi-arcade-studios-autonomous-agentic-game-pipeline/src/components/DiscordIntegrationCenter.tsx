import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sliders, 
  Bot, 
  Hash, 
  Volume2, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Code2, 
  GitPullRequest, 
  GitMerge, 
  Flame, 
  Terminal, 
  Bell, 
  Settings,
  Smile,
  AtSign,
  Gift,
  HelpCircle,
  Pin
} from 'lucide-react';
import { DiscordNotificationMessage, DiscordWebhookConfig, GitHubPR } from '../types';

interface DiscordIntegrationCenterProps {
  discordConfig: DiscordWebhookConfig;
  discordMessages: DiscordNotificationMessage[];
  prs: GitHubPR[];
  onUpdateConfig: (config: Partial<DiscordWebhookConfig>) => Promise<void>;
  onSendTestNotification: () => Promise<void>;
  onManualDispatchPR: (pr: GitHubPR) => Promise<void>;
  onNavigateToPR?: (prId: string) => void;
}

export const DiscordIntegrationCenter: React.FC<DiscordIntegrationCenterProps> = ({
  discordConfig,
  discordMessages,
  prs,
  onUpdateConfig,
  onSendTestNotification,
  onManualDispatchPR,
  onNavigateToPR
}) => {
  const [activeChannel, setActiveChannel] = useState<string>('ai-pr-merges');
  const [webhookUrlInput, setWebhookUrlInput] = useState<string>(discordConfig.webhookUrl || '');
  const [botUsernameInput, setBotUsernameInput] = useState<string>(discordConfig.botUsername || 'Desi Arcade AI Pipeline [BOT]');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);
  const [reactionsState, setReactionsState] = useState<Record<string, Record<string, number>>>({
    'disc-msg-104': { '🚀': 24, '🔥': 18, '🥘': 12, '🇮🇳': 31 },
    'disc-msg-103': { '🏏': 42, '🚀': 19, '⚡': 15, '🌧️': 8 }
  });
  const [customChatMessage, setCustomChatMessage] = useState<string>('');

  const channels = [
    { id: 'ai-pr-merges', name: 'ai-pr-merges', topic: 'Automated AI feature merges & commit broadcasts', unread: discordMessages.length },
    { id: 'liveops-deployments', name: 'liveops-deployments', topic: 'Remote config dynamic balance changes', unread: 0 },
    { id: 'trend-radar-alerts', name: 'trend-radar-alerts', topic: 'High engagement cultural trend spikes (>90 score)', unread: 3 },
    { id: 'community-lounge', name: 'community-lounge', topic: 'General game development and player discussions', unread: 0 },
  ];

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await onUpdateConfig({
        webhookUrl: webhookUrlInput,
        botUsername: botUsernameInput
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestBroadcast = async () => {
    setIsSendingTest(true);
    try {
      await onSendTestNotification();
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setReactionsState(prev => {
      const msgReactions = prev[msgId] || {};
      const currentCount = msgReactions[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...msgReactions,
          [emoji]: currentCount + 1
        }
      };
    });
  };

  const handleSendCustomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customChatMessage.trim()) return;
    
    // Send test ping / simulated broadcast
    setIsSendingTest(true);
    try {
      await onSendTestNotification();
      setCustomChatMessage('');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Integration Concept Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-purple-950/50 border border-indigo-900/50 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Bot className="w-4 h-4" />
              <span>Community & Autonomous LiveOps Integration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Discord Notification Bridge — "Desi Arcade" Guild</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Webhook Ready
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Automatically broadcasts rich embed cards with <strong className="text-amber-400">PR links</strong>, <strong className="text-sky-400">commit SHAs</strong>, GUT unit test results, and LiveOps telemetry directly to the <span className="text-indigo-300 font-semibold font-mono">#ai-pr-merges</span> channel whenever new AI features are approved and merged.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>{showConfigDrawer ? 'Hide Webhook Settings' : 'Configure Webhook URL'}</span>
            </button>

            <button
              onClick={handleTestBroadcast}
              disabled={isSendingTest}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
              <span>{isSendingTest ? 'Sending to Discord...' : 'Test Discord Webhook Ping'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-900/40">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/30">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Connected Guild</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">{discordConfig.serverName}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/30">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Broadcast Channel</span>
            <span className="text-base font-bold text-indigo-300 font-mono mt-0.5 block">{discordConfig.channelName}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/30">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Total Dispatches</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">{discordMessages.length} Messages</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-900/30">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Auto-Merge Trigger</span>
            <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">Enabled (100% Active)</span>
          </div>
        </div>
      </div>

      {/* Webhook Configuration Drawer */}
      {showConfigDrawer && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-800/60 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Discord Webhook & Notification Dispatch Engine Settings
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live HTTP POST Integration
            </span>
          </div>

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                Discord Webhook URL (Paste your server's incoming webhook):
              </label>
              <input
                type="url"
                value={webhookUrlInput}
                onChange={(e) => setWebhookUrlInput(e.target.value)}
                placeholder="https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500">
                If provided, real HTTP requests will be delivered directly to your Discord guild when AI features merge. Otherwise, the simulated preview feed displays all dispatches accurately.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Bot Username Display:
              </label>
              <input
                type="text"
                value={botUsernameInput}
                onChange={(e) => setBotUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Target Guild Name:
              </label>
              <input
                type="text"
                disabled
                value="Desi Arcade (Official Server)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Notify on AI PR Merge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                  <span>Notify on Self-Healing Auto-Fix</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSavingConfig}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {isSavingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save Webhook Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Discord Guild UI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Server Channels & Category Navigator (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            {/* Server Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                  DA
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Desi Arcade</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    2,410 Online • 14.8k Members
                  </span>
                </div>
              </div>

              <Bell className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
            </div>

            {/* Channels List */}
            <div className="p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block pt-1">
                Text Channels
              </span>

              {channels.map((ch) => {
                const isActive = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>

                    {ch.unread > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold font-mono">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                );
              })}

              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block pt-3">
                Voice Lounges
              </span>

              <div className="px-2.5 py-1.5 text-xs text-slate-400 flex items-center gap-2 hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-800">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span>🔊 Game Design Jam</span>
              </div>
              <div className="px-2.5 py-1.5 text-xs text-slate-400 flex items-center gap-2 hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-800">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span>🔊 LiveOps War Room</span>
              </div>
            </div>

            {/* Quick Dispatch Panel for Open PRs */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                <span>Manual PR Broadcast</span>
              </span>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {prs.map((pr) => (
                  <div key={pr.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="truncate mr-2">
                      <span className="font-mono font-bold text-white">#{pr.number}</span>
                      <span className="text-slate-400 truncate block text-[10px]">{pr.title.replace('🤖 Auto-Research: ', '')}</span>
                    </div>

                    <button
                      onClick={() => onManualDispatchPR(pr)}
                      className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-semibold text-[10px] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>Post</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Center Col: Real-time Discord Channel Stream (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          
          <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[640px] shadow-2xl overflow-hidden">
            
            {/* Channel Top Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">#{activeChannel}</span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
                  {channels.find(c => c.id === activeChannel)?.topic}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Pin className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                <Users className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Messages Feed Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#0f131f]/95">
              
              {/* Channel Welcome Notice */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                  <Hash className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white pt-1">Welcome to #{activeChannel}!</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                  This is the start of the <span className="text-indigo-300 font-semibold font-mono">#{activeChannel}</span> channel for the <strong>Desi Arcade Studios</strong> autonomous agent fleet.
                </p>
              </div>

              {/* Render Discord Messages */}
              {discordMessages.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No notifications recorded yet. Merge a PR or send a test ping to populate the feed!
                </div>
              ) : (
                discordMessages.map((msg) => {
                  const msgReactions = reactionsState[msg.id] || { '🚀': 12, '🔥': 8 };

                  return (
                    <div key={msg.id} className="flex items-start gap-3 group">
                      
                      {/* Bot Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-sm flex-shrink-0 shadow-md">
                        🤖
                      </div>

                      {/* Message Body */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 hover:underline cursor-pointer">
                            {msg.embed?.author?.name || discordConfig.botUsername || 'Desi Arcade AI Pipeline'}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-mono font-bold tracking-wider">
                            BOT
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {msg.timestamp}
                          </span>
                          {msg.delivered && (
                            <span className="text-[10px] text-emerald-400 font-mono ml-auto flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Delivered</span>
                            </span>
                          )}
                        </div>

                        {/* Rich Discord Embed Card */}
                        {msg.embed && (
                          <div 
                            className="rounded-xl bg-[#1e1f22] border border-slate-700/60 p-4 space-y-3 shadow-lg relative overflow-hidden"
                            style={{
                              borderLeftWidth: '4px',
                              borderLeftColor: msg.embed.color ? `#${msg.embed.color.toString(16).padStart(6, '0')}` : '#F59E0B'
                            }}
                          >
                            {/* Embed Header */}
                            <div>
                              <a
                                href={msg.embed.url || msg.prUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs sm:text-sm font-bold text-sky-400 hover:underline flex items-center gap-1.5"
                              >
                                <span>{msg.embed.title}</span>
                                <ExternalLink className="w-3 h-3 text-sky-400 flex-shrink-0" />
                              </a>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                                {msg.embed.description}
                              </p>
                            </div>

                            {/* Embed Fields 2-Col Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-700/50">
                              {msg.embed.fields.map((field, idx) => (
                                <div key={idx} className={field.inline === false ? 'sm:col-span-2' : ''}>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {field.name}
                                  </span>
                                  <div className="text-[11px] font-mono text-slate-200 mt-0.5 break-words">
                                    {field.value}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Embed Footer */}
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-700/40">
                              <span>{msg.embed.footer?.text || 'Desi Arcade Autonomous Engine'}</span>
                              <span>Target: {msg.targetGame}</span>
                            </div>
                          </div>
                        )}

                        {/* Interactive Reaction Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {Object.entries(msgReactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-mono flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] text-slate-300 font-bold">{count}</span>
                            </button>
                          ))}

                          <button
                            onClick={() => handleToggleReaction(msg.id, '🔥')}
                            className="p-1 rounded-md bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-xs cursor-pointer"
                            title="Add reaction"
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}

            </div>

            {/* Message Input Box */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex-shrink-0">
              <form onSubmit={handleSendCustomMessage} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customChatMessage}
                    onChange={(e) => setCustomChatMessage(e.target.value)}
                    placeholder={`Message #${activeChannel} (e.g., /dispatch-pr-alert or test message)...`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-10"
                  />
                  <Smile className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white" />
                </div>

                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Right Col: Server Members & Ingestion Bot Status (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Studio Guild Members</span>
            </h3>

            {/* Member List */}
            <div className="space-y-2">
              
              {/* Bot 1: Autonomous Synthesizer */}
              <div className="p-2 rounded-xl bg-slate-950 border border-indigo-900/40 flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xs text-slate-950 font-black">
                    🤖
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">Desi Arcade Bot</span>
                    <span className="px-1 py-0.2 rounded bg-indigo-600 text-white text-[8px] font-mono font-bold">BOT</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">Playing Godot 4.3 Engine</span>
                </div>
              </div>

              {/* Bot 2: CI/CD Self-Healing Runner */}
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-sky-950 border border-sky-500/40 flex items-center justify-center text-xs text-sky-400 font-black">
                    🧪
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">GUT CI/CD Runner</span>
                    <span className="px-1 py-0.2 rounded bg-indigo-600 text-white text-[8px] font-mono font-bold">BOT</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block truncate">● 100% Tests Passing</span>
                </div>
              </div>

              {/* Bot 3: Trend Radar Daemon */}
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-500/40 flex items-center justify-center text-xs text-amber-400 font-black">
                    🛰️
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">Trend Radar Ingest</span>
                    <span className="px-1 py-0.2 rounded bg-indigo-600 text-white text-[8px] font-mono font-bold">BOT</span>
                  </div>
                  <span className="text-[10px] text-amber-400 block truncate">Polling r/IndianGaming</span>
                </div>
              </div>

              {/* Human: Studio Lead Producer */}
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-xs text-purple-300 font-black">
                    👑
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute bottom-0 right-0"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">Lead Producer</span>
                    <span className="px-1 py-0.2 rounded bg-purple-600 text-white text-[8px] font-mono font-bold">LEAD</span>
                  </div>
                  <span className="text-[10px] text-purple-300 block truncate">Reviewing Autonomous PRs</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Discord Webhook Code Snippet */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discord Embed API Contract</span>
              </span>
            </div>

            <pre className="text-[10px] text-indigo-200 leading-relaxed overflow-x-auto p-2 bg-slate-900 rounded-lg">
{`POST /api/webhooks/128492...
{
  "username": "Desi Arcade Bot",
  "embeds": [{
    "title": "🚀 Feature Merged",
    "color": 0xF59E0B,
    "fields": [
      { "name": "PR", "value": "#104" },
      { "name": "GUT", "value": "PASS" }
    ]
  }]
}`}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
