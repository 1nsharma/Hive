import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Smartphone, 
  Globe, 
  Hash, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Terminal,
  Paperclip,
  Activity
} from 'lucide-react';
import { BotChannel, BotChatMessage, OperatingMode } from '../types';

interface BotChannelsViewProps {
  channels: BotChannel[];
  messages: BotChatMessage[];
  operatingMode: OperatingMode;
  onSendMessage: (channelId: string, text: string) => Promise<void>;
  onTriggerModeChange: (mode: OperatingMode) => void;
}

export const BotChannelsView: React.FC<BotChannelsViewProps> = ({
  channels,
  messages,
  operatingMode,
  onSendMessage,
  onTriggerModeChange
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || 'chan-whatsapp');
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === selectedChannelId);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(selectedChannelId, text);
      if (!textToSend) setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  const getChannelIcon = (name: BotChannel['name']) => {
    switch (name) {
      case 'whatsapp':
        return Smartphone;
      case 'telegram':
        return Send;
      case 'slack':
        return Hash;
      case 'web':
      default:
        return Globe;
    }
  };

  const quickPrompts = [
    'System status and worker swarm health',
    '🚨 Freeze all operations: Emergency Lockdown',
    'Run today\'s Amit Identity & Growth loop',
    'Summarize top 3 AI founders identified today',
    'Draft post: Operating Systems for Autonomous Work'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Multi-Channel Bot Hub
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  4 Omnichannel Gateways
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dispatch goals, grant approvals, and query worker states via WhatsApp, Telegram, Slack, or Web.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Policy:</span>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
              operatingMode === 'LOCKDOWN' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {operatingMode}
            </span>
          </div>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          {channels.map((chan) => {
            const Icon = getChannelIcon(chan.name);
            const isSelected = chan.id === selectedChannelId;

            return (
              <button
                key={chan.id}
                onClick={() => setSelectedChannelId(chan.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {chan.displayName}
                    </span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    chan.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                  }`} />
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{chan.botHandle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Conversation Console */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col h-[520px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                {selectedChannel.displayName} Dispatcher
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {selectedChannel.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" />
                Zero-latency agent gateway active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerModeChange('LOCKDOWN')}
              className="px-3 py-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Quick Lockdown
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40 font-sans">
          {channelMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
              <p>No messages yet on {selectedChannel.displayName}.</p>
              <p className="text-[11px] text-slate-600">Send an instruction below or select a quick prompt.</p>
            </div>
          ) : (
            channelMessages.map((msg) => {
              const isAgent = msg.sender === 'agent' || msg.sender === 'system';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 ${
                    isAgent
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                      : 'bg-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-950/30'
                  }`}>
                    <div className="flex items-center justify-between gap-4 text-[11px] opacity-80 mb-0.5">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] text-slate-500 uppercase font-semibold shrink-0">Quick Dispatch:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700 hover:border-slate-600 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message Agent OS on ${selectedChannel.displayName}...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/40 disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
