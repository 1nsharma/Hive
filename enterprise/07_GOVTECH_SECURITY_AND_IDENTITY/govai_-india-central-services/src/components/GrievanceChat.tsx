import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { govService } from '../services/govService';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

export const GrievanceChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Namaste! I am GovAssist. How can I help you with your government service grievances today?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await govService.handleGrievanceChat(userMsg.content, history);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] glass-card overflow-hidden">
      <div className="bg-gov-primary p-4 text-white flex items-center gap-2">
        <Bot size={20} />
        <h3 className="font-semibold">GovAssist: AI Grievance Support</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-gov-accent text-white" : "bg-gov-primary text-white"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm shadow-sm",
                msg.role === 'user' ? "bg-gov-primary text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gov-primary text-white flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 text-sm italic">
              GovAssist is typing...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your grievance here..."
          className="gov-input"
        />
        <button type="submit" disabled={isLoading} className="gov-button flex items-center justify-center">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
