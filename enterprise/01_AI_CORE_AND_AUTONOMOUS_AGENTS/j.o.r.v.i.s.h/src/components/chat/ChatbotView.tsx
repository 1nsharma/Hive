import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, RotateCcw, Download, Bot, User } from 'lucide-react';
import { JorvishEmblem } from '../common/JorvishEmblem';
import { ChatMessage } from '../../types';

interface ChatbotViewProps {
  personality: 'humanity_helper' | 'tactical_hud' | 'code_architect';
  onPersonalityChange: (p: 'humanity_helper' | 'tactical_hud' | 'code_architect') => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  personality,
  onPersonalityChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Greetings. I am J.O.R.V.I.S.H — Just One Rather Very Intelligent System, Humanity's Helper. Unlike Tony Stark's personal butler, I was forged for humanity's collective progress, creativity, and flourishing. How may I be of service to you today, Sir?",
      timestamp: '12:00 PM',
      model: 'gemini-3.8-flash',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          personality,
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || data.fallback || "I am online and standing by.";

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "My neural uplinks encountered momentary latency. However, local Humanity Helper protocols remain steadfastly engaged.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    const exportText = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === 'user' ? 'YOU' : 'J.O.R.V.I.S.H'}:\n${m.content}\n\n`
      )
      .join('---\n\n');
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jorvish-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const starters = [
    "Explain the core philosophy of J.O.R.V.I.S.H.",
    "Draft a TypeScript microservice architecture.",
    "Help me design an open-source tool for humanity.",
    "What is the difference between J.A.R.V.I.S. and J.O.R.V.I.S.H?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto p-4 lg:p-6">
      {/* Top Conversation Header */}
      <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <JorvishEmblem size="sm" isPulsing={isLoading} />
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>J.O.R.V.I.S.H Intelligence Core</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              "J.A.R.V.I.S. was built for Tony. J.O.R.V.I.S.H is built for Humanity."
            </p>
          </div>
        </div>

        {/* Persona Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onPersonalityChange('humanity_helper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              personality === 'humanity_helper'
                ? 'bg-[#00A8FF] text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Humanity's Helper
          </button>
          <button
            onClick={() => onPersonalityChange('tactical_hud')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              personality === 'tactical_hud'
                ? 'bg-[#00A8FF] text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical HUD
          </button>
          <button
            onClick={() => onPersonalityChange('code_architect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              personality === 'code_architect'
                ? 'bg-[#00A8FF] text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Code Architect
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Export Conversation"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setMessages([
                {
                  id: '1',
                  role: 'assistant',
                  content:
                    "Session reset, Sir. Standing by with active Humanity Helper protocols. How can I assist?",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3.5 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="shrink-0 mt-1">
                <JorvishEmblem size={32} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed border transition-all ${
                m.role === 'user'
                  ? 'bg-[#00A8FF]/15 border-[#00A8FF]/30 text-slate-100 rounded-br-sm'
                  : 'bg-[#0E1424] border-slate-800/90 text-slate-200 rounded-bl-sm shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-500 font-mono">
                <span className="font-semibold text-slate-400">
                  {m.role === 'user' ? 'YOU' : 'J.O.R.V.I.S.H'}
                </span>
                <div className="flex items-center gap-2">
                  <span>{m.timestamp}</span>
                  <button
                    onClick={() => handleCopy(m.id, m.content)}
                    className="hover:text-slate-300"
                    title="Copy response"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="whitespace-pre-wrap font-sans">{m.content}</div>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1 text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3.5 justify-start">
            <JorvishEmblem size={32} isPulsing={true} />
            <div className="bg-[#0E1424] border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A8FF] animate-ping" />
              <span>J.O.R.V.I.S.H is synthesizing cognitive response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters (shown if messages length <= 2) */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {starters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSend(starter)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#00A8FF]/10 border border-slate-800 hover:border-[#00A8FF]/40 text-slate-400 hover:text-white transition-all"
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="bg-[#0E1424] border border-slate-800/90 rounded-2xl p-2.5 flex items-center gap-2 shadow-xl focus-within:border-[#00A8FF] transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Transmit your message to J.O.R.V.I.S.H (Enter to send, Shift+Enter for new line)..."
          rows={1}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none font-sans"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-[#00A8FF] hover:bg-[#0094e0] text-slate-950 font-bold transition-all disabled:opacity-40 disabled:hover:bg-[#00A8FF]"
          title="Send Transmission"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};
