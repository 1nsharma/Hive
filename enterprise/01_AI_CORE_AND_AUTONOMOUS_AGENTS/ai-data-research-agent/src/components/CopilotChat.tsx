import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface CopilotChatProps {
  activeSubDomainId: string | null;
  subDomainsList: Array<{ id: string; name: string }>;
  onJumpToSubDomain: (id: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  activeSubDomainId,
  subDomainsList,
  onJumpToSubDomain
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **Master Knowledge Map Copilot** backed by **Gemini 3.6 Flash**. 

I have full semantic visibility into all 8 engineering domains, your custom connections, and sub-domain specifications. Ask me to trace security patterns, analyze database bottlenecks, or outline deployment pipelines.`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/knowledge/ask-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          activeSubDomainId: activeSubDomainId
        })
      });

      if (!response.ok) throw new Error('Copilot response error');

      const data = await response.json();
      if (data.success && data.answer) {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Copilot chat failed:", error);
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered an error trying to connect to my brain. Please verify that your Gemini API Key is loaded in AI Studio.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetPrompts = [
    {
      title: "Trace Security",
      query: "Analyze how API Gateways and Authentication coordinate to protect our core databases. Trace the structural security boundary."
    },
    {
      title: "Scale Optimization",
      query: "Explain the connection between Query Optimization and Scalability Planning. Suggest indices and load testing strategies."
    },
    {
      title: "Disaster Blueprint",
      query: "How should Disaster Recovery planning align with our Cloud Architecture? Outline standard RTO and RPO benchmarks."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Bot className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-tight">AI Engineering Copilot</h3>
            <p className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Grounded in active specifications</span>
            </p>
          </div>
        </div>

        {messages.length > 1 && (
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[460px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className="text-[9px] text-slate-500 font-mono mb-1">
              {msg.sender === 'user' ? 'You' : 'System Architect'}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                  : 'bg-slate-800 border border-slate-800 text-slate-200 rounded-bl-none prose-invert'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <MarkdownRenderer
                  content={msg.text}
                  onSubDomainLinkClick={onJumpToSubDomain}
                  subDomainsList={subDomainsList}
                />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="text-[9px] text-slate-500 font-mono mb-1">System Architect</div>
            <div className="p-3.5 rounded-2xl bg-slate-800 text-slate-400 rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Presets and Input Field */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        {/* Presets */}
        {messages.length === 1 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Presets</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer text-[11px] group text-slate-300"
                >
                  <span className="font-bold">{p.title}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input area */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-shadow">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ask AI Copilot (e.g. How do APIs secure schemas?)..."
            className="flex-1 bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none px-2"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
