import React, { useState, useRef, useEffect } from 'react';
import { Shop, SupportMessage } from '../../types/database';
import { 
  Bot, 
  Send, 
  X, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  Printer, 
  ShieldAlert, 
  FileText, 
  Users, 
  RefreshCw 
} from 'lucide-react';

interface AISupportBotDrawerProps {
  currentShop: Shop;
}

export const AISupportBotDrawer: React.FC<AISupportBotDrawerProps> = ({ currentShop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Hello! I am your AI Merchant Operations Assistant for ${currentShop.name}. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      quick_replies: [
        'How to setup 58mm printer?',
        'How does Duplicate UTR fraud work?',
        'How to invite kitchen staff?',
        'Why is my shop pending approval?',
        'GST bill breakdown'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || loading) return;

    const userMsg: SupportMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, shopId: currentShop.id }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: SupportMessage = {
          id: `msg-b-${Date.now()}`,
          sender: 'bot',
          text: data.reply || 'I am looking into that operational requirement for your shop.',
          timestamp: new Date().toISOString(),
          quick_replies: data.quickReplies || [],
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: SupportMessage = {
          id: `msg-err-${Date.now()}`,
          sender: 'bot',
          text: 'Unable to reach support service right now. Please try again in a moment.',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: SupportMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'bot',
        text: 'Network connection interrupted. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher button at bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        title="AI Support Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[92vw] sm:w-[400px] h-[520px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Drawer Header */}
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Merchant AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-zinc-400">Cloud Run POS 24/7 Operations Support</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick replies chips */}
                {msg.quick_replies && msg.quick_replies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.quick_replies.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 bg-zinc-800/90 hover:bg-zinc-750 text-indigo-300 text-[11px] rounded-lg border border-zinc-700/80 transition-colors text-left cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>AI assistant is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about KOT printer, duplicate UTR, GST..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
