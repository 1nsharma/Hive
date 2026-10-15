import React, { useState } from 'react';
import { Send, Sparkles, Activity, AlertCircle, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { ChatMessage, Pet } from '../types';

interface AIChatAssistantProps {
  activePet: Pet;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ activePet }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am your **PetGuardian AI Clinical Care Assistant**. \n\nI am synced with **${activePet.name}** (${activePet.species} · ${activePet.breed}). You can ask me any question about symptoms, food safety, behavior, or vaccination schedules!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    `Vomiting twice in 4 hours, refusing kibble`,
    `Is dark chocolate toxic for ${activePet.name}?`,
    `Deworming schedule & dosage recommendations`,
    `Heavy panting after a short walk`,
    `Scratching ears and shaking head frequently`
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          petName: activePet.name,
          petSpecies: activePet.species
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.text || 'I have recorded your query. Please keep a close watch on your pet.',
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat API Error', err);
      // Fallback
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: `🟢 **PetGuardian Care Advice for ${activePet.name}**\n\nBased on your query: "${query}"\n\n1. Ensure ${activePet.name} stays hydrated with fresh filtered water.\n2. Observe energy levels and monitor for any lethargy over the next 12 hours.\n3. If symptoms persist or worsen, please consult your veterinarian immediately.\n\n*Disclaimer: AI guidance is for general informational triage only.*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      
      {/* Header Banner */}
      <div id="tour-ai-chat-header" className="p-5 rounded-3xl border bg-[#FDFBF7] shadow-xs flex items-center justify-between gap-4" style={{ borderColor: '#E5DFD3' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shrink-0 border border-amber-200">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-extrabold text-[#0E3D2F]">PetGuardian AI Assistant</h2>
              <span id="tour-ai-guardrails-badge" className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                CLINICAL TRIAGE · NO DOSAGE
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Synced with <strong className="text-stone-800">{activePet.name}</strong> ({activePet.breed} · Allergies: {activePet.allergies})
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div id="tour-ai-quick-prompts" className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block px-1">
          Suggested Triage Prompts:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl border bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap shadow-2xs transition-all"
              style={{ borderColor: '#E5DFD3' }}
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="p-4 rounded-3xl border bg-white shadow-xs space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto" style={{ borderColor: '#E5DFD3' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-xl text-xs space-y-2 leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#175741] text-white rounded-tr-none'
                  : 'bg-[#F9F7F1] text-stone-800 rounded-tl-none border'
              }`}
              style={msg.sender === 'ai' ? { borderColor: '#E5DFD3' } : {}}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              <div className={`text-[9px] text-right font-medium opacity-60 ${msg.sender === 'user' ? 'text-white' : 'text-stone-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-2xl border w-fit text-xs text-stone-500" style={{ borderColor: '#E5DFD3' }}>
            <RefreshCw className="w-4 h-4 animate-spin text-[#175741]" />
            <span>AI Assistant is reviewing symptom database...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 rounded-2xl border bg-white shadow-md flex gap-2"
        style={{ borderColor: '#E5DFD3' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Describe ${activePet.name}'s diet, behavior, or symptoms...`}
          className="flex-1 px-4 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:opacity-95 disabled:opacity-50"
          style={{ backgroundColor: '#175741' }}
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>

      {/* Disclaimer */}
      <p className="text-[10px] text-stone-400 text-center italic">
        ⚠️ PetGuardian AI provides preliminary care triage based on clinical algorithms. In emergency situations, visit a licensed veterinary clinic immediately.
      </p>

    </div>
  );
};
