import React, { useState } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  RotateCw,
  User,
  Sliders,
  CheckCircle2,
  Zap,
  Globe,
} from 'lucide-react';
import { ChatbotPersona } from '../types';

interface ChatbotEngineProps {
  personas: ChatbotPersona[];
  onPersonaUpdated: (personas: ChatbotPersona[]) => void;
}

export const ChatbotEngine: React.FC<ChatbotEngineProps> = ({ personas, onPersonaUpdated }) => {
  const [activePersona, setActivePersona] = useState<ChatbotPersona>(personas[0]);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>(
    activePersona.sampleConvos
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Persona Edit States
  const [personaName, setPersonaName] = useState(activePersona.name);
  const [tone, setTone] = useState(activePersona.tone);
  const [systemPrompt, setSystemPrompt] = useState(activePersona.systemPrompt);
  const [triggerKeywords, setTriggerKeywords] = useState(activePersona.triggerKeywords.join(', '));

  const handleSelectPersona = (p: ChatbotPersona) => {
    setActivePersona(p);
    setPersonaName(p.name);
    setTone(p.tone);
    setSystemPrompt(p.systemPrompt);
    setTriggerKeywords(p.triggerKeywords.join(', '));
    setChatMessages(p.sampleConvos);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    const newHistory = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(newHistory);
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaSystemPrompt: systemPrompt,
          tone,
          userMessage: userMsg,
          history: chatMessages,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages([...newHistory, { role: 'assistant', text: data.reply }]);
      } else {
        setChatMessages([
          ...newHistory,
          { role: 'assistant', text: 'Hello! I am your AI assistant. How can I help you today?' },
        ]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setChatMessages([
        ...newHistory,
        { role: 'assistant', text: 'I am online and ready to assist you on social media DMs and comments!' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Interactive Chatbot Engine</h2>
              <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                Dopple.ai Persona Integration
              </span>
            </div>
            <p className="text-xs text-slate-400">Handle personal or public interactions through intelligent AI chatbots across Instagram, LinkedIn, & Facebook DMs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Auto DM & Comment Handler Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Persona Configurator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Active Chatbot Persona</h3>
            <div className="space-y-2">
              {personas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPersona(p)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    activePersona.id === p.id
                      ? 'bg-slate-950 border-teal-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.avatarUrl} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="text-xs font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.platform.toUpperCase()} • Auto-Reply Active</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${activePersona.id === p.id ? 'text-teal-400' : 'text-slate-700'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Persona Tuning Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Persona System Prompt & Keywords</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Bot Name</label>
                <input
                  type="text"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Tone & Voice Persona</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Knowledge & Instructions Prompt</label>
                <textarea
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Trigger Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={triggerKeywords}
                  onChange={(e) => setTriggerKeywords(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[560px] justify-between shadow-xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={activePersona.avatarUrl} alt={activePersona.name} className="w-10 h-10 rounded-full border border-teal-500/40" />
                <div>
                  <h3 className="text-sm font-bold text-white">{personaName}</h3>
                  <p className="text-[11px] text-teal-400 font-mono">Live Gemini Test Simulator</p>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            {/* Chat Log Window */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center shrink-0 font-bold text-[10px] text-slate-950">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-bold text-[10px] text-slate-300">
                      You
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="flex gap-2.5 items-center text-xs text-teal-400 font-mono">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{personaName} is typing response...</span>
                </div>
              )}
            </div>

            {/* Message Input Form */}
            <div className="pt-3 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Test a customer comment or DM e.g. 'How much does it cost?'"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Test Bot</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
