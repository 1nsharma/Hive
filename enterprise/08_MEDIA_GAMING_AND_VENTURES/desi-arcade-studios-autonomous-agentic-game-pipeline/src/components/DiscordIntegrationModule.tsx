import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Settings, 
  Radio, 
  Layers, 
  Check, 
  Copy, 
  MessageSquare,
  GitPullRequest,
  GitMerge,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { DiscordNotificationMessage, DiscordWebhookConfig } from '../types';

interface DiscordIntegrationModuleProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const DiscordIntegrationModule: React.FC<DiscordIntegrationModuleProps> = ({ onShowToast }) => {
  const [config, setConfig] = useState<DiscordWebhookConfig>({
    webhookUrl: 'https://discord.com/api/webhooks/1283948291029384920/desi-arcade-evolution-secret-key',
    serverName: 'Desi Arcade (Official)',
    channelName: '#pr-deployments',
    botUsername: 'Desi Arcade Autonomous Agent',
    enabled: true,
    notifyOnPrCreation: true,
    notifyOnPrMerge: true,
    notifyOnSelfHealing: true
  });

  const [messages, setMessages] = useState<DiscordNotificationMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch Discord data from backend
  const fetchDiscordState = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/integrations/discord');
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (data.messages) setMessages(data.messages);
    } catch (e) {
      console.warn('Failed to load discord state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscordState();
  }, []);

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/integrations/discord/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(`✅ Discord integration settings saved for server '${config.serverName}'!`);
      }
    } catch (e) {
      onShowToast('Settings saved locally.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestWebhook = async () => {
    try {
      setIsTesting(true);
      const res = await fetch('/api/integrations/discord/test', { method: 'POST' });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
      onShowToast(`🚀 Test webhook dispatched to '${config.serverName}' (${config.channelName})!`);
    } catch (e) {
      onShowToast('Test webhook simulated.', 'info');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Bell className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Pipeline Integration: Discord Server Webhooks</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Desi Arcade Discord Notification Hub</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono font-medium">
                Live Webhooks Active
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Whenever the autonomous pipeline tests and merges an AI-generated GDScript feature into the <code className="text-amber-300">main</code> branch, a high-priority rich embed is automatically broadcasted to your community Discord server with full PR links, commit SHA hashes, test metrics, and LiveOps status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSendTestWebhook}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Dispatching...' : 'Send Test Notification'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Config Settings + Discord Live Preview Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Webhook Settings & Trigger Rules (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span>Webhook Configuration</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Connected
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Server Name */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Discord Server</label>
                <input
                  type="text"
                  value={config.serverName}
                  onChange={(e) => setConfig({ ...config, serverName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="Desi Arcade (Official)"
                />
              </div>

              {/* Channel Name */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Broadcast Channel</label>
                <input
                  type="text"
                  value={config.channelName}
                  onChange={(e) => setConfig({ ...config, channelName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="#pr-deployments"
                />
              </div>

              {/* Bot Identity Username */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Bot Sender Username</label>
                <input
                  type="text"
                  value={config.botUsername}
                  onChange={(e) => setConfig({ ...config, botUsername: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="Desi Arcade Autonomous Agent"
                />
              </div>

              {/* Webhook URL */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Discord Webhook Endpoint URL
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[11px] focus:border-indigo-500 focus:outline-none pr-10"
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                  <button
                    onClick={() => handleCopy(config.webhookUrl, 'url')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    title="Copy Webhook URL"
                  >
                    {copiedId === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Create a Webhook in Discord Server Settings → Integrations → Webhooks.
                </p>
              </div>

              {/* Notification Trigger Rules */}
              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-300 block">Autonomous Trigger Conditions:</span>
                
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-300">
                    <GitMerge className="w-3.5 h-3.5 text-purple-400" />
                    <span>Notify on PR Approved & Merged</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={config.notifyOnPrMerge}
                    onChange={(e) => setConfig({ ...config, notifyOnPrMerge: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Notify on AI Feature Synthesis</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={config.notifyOnPrCreation}
                    onChange={(e) => setConfig({ ...config, notifyOnPrCreation: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Notify on Self-Healing CI/CD Fix</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={config.notifyOnSelfHealing}
                    onChange={(e) => setConfig({ ...config, notifyOnSelfHealing: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaving ? 'Saving Settings...' : 'Save Discord Configuration'}</span>
              </button>

            </div>
          </div>

          {/* Integration Stats Badge */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Target: {config.serverName} ({config.channelName})</span>
            </div>
            <span className="text-indigo-400 font-bold">{messages.length} Dispatches Logged</span>
          </div>

        </div>

        {/* Right Column: Live Discord Client Simulation & Message Logs (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-4 rounded-2xl bg-[#313338] border border-[#232428] shadow-2xl text-slate-200">
            
            {/* Simulated Discord Channel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#232428] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#80848E] font-bold text-base">#</span>
                <span className="font-bold text-white tracking-wide">{config.channelName.replace('#', '')}</span>
                <span className="text-[11px] text-[#80848E] hidden sm:inline">| Desi Arcade Autonomous Git & LiveOps Deployments</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#232428] text-[#949BA4] font-mono">
                  {config.serverName}
                </span>
              </div>
            </div>

            {/* Simulated Discord Message Stream */}
            <div className="space-y-4 pt-4 max-h-[580px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-[#949BA4] space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-indigo-400 opacity-60" />
                  <p className="text-xs">No Discord notifications sent yet.</p>
                  <button
                    onClick={handleSendTestWebhook}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    Click here to send a test deployment alert
                  </button>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#2e3035] transition-colors group">
                    
                    {/* Bot Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-base font-black shadow-md flex-shrink-0">
                      🕹️
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Bot Header Line */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                          {config.botUsername}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5865F2] text-white uppercase tracking-wider font-mono">
                          BOT
                        </span>
                        <span className="text-[10px] text-[#949BA4] font-mono">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Bot Callout text */}
                      <p className="text-xs text-[#DBDEE1]">
                        🚀 **[Desi Arcade Evolution Alert]** New autonomous feature merged to `main` branch!
                      </p>

                      {/* Rich Discord Embed */}
                      <div className="mt-2 rounded bg-[#2B2D31] border-l-4 border-amber-500 p-3.5 space-y-2.5 max-w-xl shadow-md">
                        
                        <div className="flex items-start justify-between gap-2">
                          <a
                            href={msg.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm font-bold text-[#00A8FC] hover:underline flex items-center gap-1.5"
                          >
                            <span>{msg.embed.title}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>

                        <p className="text-[11px] text-[#DBDEE1] leading-relaxed">
                          {msg.embed.description}
                        </p>

                        {/* Embed 2-Col Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          {msg.embed.fields.map((field, fIdx) => (
                            <div key={fIdx} className={`space-y-0.5 ${field.inline ? '' : 'sm:col-span-2'}`}>
                              <span className="text-[10px] font-bold uppercase text-[#949BA4]">
                                {field.name}
                              </span>
                              <div className="text-[#DBDEE1] font-mono text-[11px] break-words">
                                {field.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Embed Footer */}
                        {msg.embed.footer && (
                          <div className="pt-2 border-t border-[#35373C] text-[10px] text-[#949BA4] flex items-center justify-between">
                            <span>{msg.embed.footer.text}</span>
                            <span className="font-mono text-[#00A8FC]">PR #{msg.prNumber}</span>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
