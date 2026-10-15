
import React, { useState, useRef, useEffect } from 'react';
import { Message, Resource } from '../types';
import { getAssistantResponse } from '../services/geminiService';

interface AIChatProps {
  resources: Resource[];
}

const AIChat: React.FC<AIChatProps> = ({ resources }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you find the best open-source AI tools. What are you looking to build today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await getAssistantResponse(newMessages, resources);
    setMessages([...newMessages, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 text-white"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[500px] glass rounded-3xl flex flex-col shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-xs">AI</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Nexus Librarian</h3>
              <p className="text-[10px] text-gray-400">Powered by Gemini 3 Flash</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-100 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400/60"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400/30"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for recommendations..."
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
