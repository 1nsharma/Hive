
import React, { useState, useRef, useEffect } from 'react';
import { zenithService } from '../services/geminiService';
import { Message } from '../types';

interface Props {
  isStealth?: boolean;
}

const ChatInterface: React.FC<Props> = ({ isStealth }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "ZENITH ONLINE. LATENCY: MINIMAL. PROTOCOL: ACTIVE.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    let streamContent = '';
    const newModelMessage: Message = { role: 'model', content: '', timestamp: Date.now() };
    setMessages(prev => [...prev, newModelMessage]);

    try {
      const stream = zenithService.sendMessageStream(input);
      for await (const chunk of stream) {
        streamContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = streamContent;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${isStealth ? 'grayscale opacity-30 brightness-50' : ''} glass-panel rounded-2xl overflow-hidden border-cyan-500/30`}>
      {/* Terminal Header */}
      <div className="px-4 py-2 border-b border-cyan-500/20 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isStealth ? 'bg-slate-700' : 'bg-red-500/50'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full ${isStealth ? 'bg-slate-700' : 'bg-yellow-500/50'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full ${isStealth ? 'bg-slate-700' : 'bg-green-500/50'}`}></div>
          </div>
          <span className="text-[10px] font-orbitron text-cyan-500 tracking-widest font-bold">
            {isStealth ? 'SYS_IDLE_BACKGROUND' : 'SYNAPTIC TERMINAL :: TRUTH_LAYER_01'}
          </span>
        </div>
        {!isStealth && <div className="text-[9px] text-slate-500 font-mono">BPS: 24.8GB/s</div>}
      </div>

      {/* Message Stream */}
      <div 
        ref={scrollRef}
        className={`flex-1 p-6 overflow-y-auto space-y-8 bg-gradient-to-b ${isStealth ? 'from-black to-slate-950' : 'from-slate-950 to-slate-900/50'}`}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`group flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[8px] uppercase tracking-widest font-bold ${msg.role === 'user' ? 'text-cyan-600' : 'text-emerald-500'}`}>
                {msg.role === 'user' ? 'SOURCE' : 'ZENITH'}
              </span>
              <span className="text-[8px] text-slate-600">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            
            <div className={`relative max-w-[90%] md:max-w-[75%] p-3 rounded-lg font-mono text-sm leading-snug transition-all duration-150 ${
              msg.role === 'user' 
                ? 'bg-cyan-950/10 border border-cyan-500/10 text-cyan-200' 
                : 'bg-slate-900/40 border border-slate-700/20 text-slate-400'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
             <div className="text-[8px] uppercase tracking-widest text-emerald-500 font-bold mb-1">DATA_INBOUND...</div>
          </div>
        )}
      </div>

      {/* Command Injection Form */}
      <form onSubmit={handleSubmit} className={`p-4 bg-slate-950 border-t border-cyan-500/20 relative ${isStealth ? 'opacity-50' : ''}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isStealth ? ">" : "INPUT QUERY..."}
            className="flex-1 bg-slate-900/30 border border-slate-800 rounded py-2 px-3 focus:outline-none focus:border-cyan-400 transition-all text-cyan-50 placeholder-slate-800 font-mono text-xs"
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-4 rounded font-orbitron font-bold text-[10px] tracking-widest transition-all border border-cyan-900"
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
