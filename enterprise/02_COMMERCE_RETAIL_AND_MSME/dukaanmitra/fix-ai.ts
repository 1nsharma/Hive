import fs from 'fs';

const content = `import { useState } from "react";
import { Sparkles, Sun, Bell, MessageSquare, Loader2 } from "lucide-react";
import { parseAIMunim } from "../utils";

export default function AIChatTab({ shopId, onAction, onRefreshDB }: any) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', text: "नमस्ते! मैं मुनीम AI हूँ। आप मुझे बोलकर या लिखकर इन्वेंटरी, उधारी और बिक्री का काम सौंप सकते हैं।" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input.trim();
    setMessages(m => [...m, { role: 'user', text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await parseAIMunim(userText);
      setMessages(m => [...m, { role: 'assistant', text: response.hindiSummary || "मैंने आपका निर्देश दर्ज कर लिया है।" }]);
      if (onRefreshDB) onRefreshDB();
    } catch (err: any) {
      setMessages(m => [...m, { role: 'assistant', text: "माफ़ करें, " + (err.message || "कुछ गड़बड़ हो गई।") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 bg-slate-50 gap-4">
      {/* Top Widgets */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            <Sun className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Morning Summary</span>
          </div>
          <p className="text-sm text-slate-600 font-medium">आपका AI असिस्टेंट तैयार है।</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-rose-500 mb-3">
            <Bell className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Active Alerts</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5" />
            <p className="text-sm text-slate-600 font-medium">मुनीम AI सक्रिय है।</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800">Munim AI Assistant</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={\`flex \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
              <div className={\`max-w-[80%] p-3 rounded-2xl text-sm font-medium \${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}\`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="max-w-[80%] p-3 rounded-2xl text-sm font-medium bg-slate-100 text-slate-800 rounded-tl-sm flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> सोच रहा हूँ...
               </div>
             </div>
          )}
        </div>

        <div className="p-3 bg-white border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask the OS or issue a command..." 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
            />
            <button onClick={handleSend} disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/AIChatTab.tsx', content);
