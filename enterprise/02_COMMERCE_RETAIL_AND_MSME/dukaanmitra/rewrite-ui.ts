import fs from 'fs';

// 1. Rewrite POSTab.tsx to be "Scanner, Cart, Payment, Suggestions"
const posTabContent = `import { useState } from "react";
import { Search, ShoppingCart, CreditCard, Sparkles, Plus, Minus, X } from "lucide-react";
import { Product } from "../types";
import { formatRupees } from "../utils";

export default function POSTab({ products, onTransactionComplete, shopId }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product: Product) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden bg-slate-50">
      {/* Scanner & Suggestions */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Scanner / Search items..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((p: any) => (
            <div key={p.id} onClick={() => addToCart(p)} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between active:scale-95">
              <span className="font-bold text-slate-800">{p.name}</span>
              <div className="flex justify-between items-end mt-4">
                <span className="text-slate-500 text-xs">{p.stock} in stock</span>
                <span className="font-black text-indigo-600">{formatRupees(p.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart & Payment */}
      <div className="w-full md:w-96 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <h2 className="font-bold text-lg">Cart</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <p>Cart is empty</p>
             </div>
          ) : cart.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">{formatRupees(item.price)} x {item.qty}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-800">{formatRupees(item.price * item.qty)}</span>
                <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="p-1 text-rose-500 bg-rose-50 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium text-sm">Total Amount</span>
            <span className="text-3xl font-black text-slate-900">{formatRupees(total)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <CreditCard className="w-5 h-5" /> Collect Payment
          </button>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/POSTab.tsx', posTabContent);

// 2. Rewrite LedgerTab.tsx to be "Risk, Collection, Due, Insights, Customers"
const ledgerTabContent = `import { Users, AlertTriangle, TrendingUp, IndianRupee, ShieldAlert } from "lucide-react";
import { formatRupees } from "../utils";

export default function LedgerTab({ customers, transactions }: any) {
  const totalDue = customers.reduce((sum: number, c: any) => sum + (c.balance || 0), 0);
  const highRisk = customers.filter((c: any) => c.balance > 5000);

  return (
    <div className="h-full overflow-hidden flex flex-col p-4 bg-slate-50 gap-4">
      {/* Insights Row */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-3xl border border-rose-100 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <ShieldAlert className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">High Risk</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{highRisk.length}</span>
          <span className="text-xs text-slate-500 mt-1">Customers > ₹5000</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-indigo-100 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <IndianRupee className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Total Due</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{formatRupees(totalDue)}</span>
          <span className="text-xs text-slate-500 mt-1">Pending Collection</span>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-3xl text-white flex flex-col shadow-sm shadow-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-100 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Collection</span>
          </div>
          <span className="text-3xl font-black">Run AI</span>
          <span className="text-xs text-emerald-100 mt-1">Auto-send reminders</span>
        </div>
      </div>

      {/* Customers List */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Customer Dues</h3>
          <input type="text" placeholder="Search..." className="px-3 py-1.5 rounded-xl border border-slate-200 text-sm" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {customers.sort((a:any, b:any) => b.balance - a.balance).map((c: any) => (
            <div key={c.id} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.phone || "No phone"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={\`font-black \${c.balance > 0 ? "text-rose-600" : "text-emerald-600"}\`}>
                  {formatRupees(Math.abs(c.balance))} {c.balance > 0 ? "Due" : "Adv"}
                </p>
                {c.balance > 5000 && <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">RISK</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/LedgerTab.tsx', ledgerTabContent);

// 3. Rewrite AIChatTab.tsx to be "Morning summary, Tasks, Alerts, Suggestions, Chat"
const aiChatTabContent = `import { useState } from "react";
import { Sparkles, Sun, Bell, CheckCircle2, MessageSquare } from "lucide-react";

export default function AIChatTab({ shopId, onAction }: any) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', text: "Good morning! Here is your business OS summary." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', text: "I have recorded that in the OS." }]);
    }, 1000);
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
          <p className="text-sm text-slate-600 font-medium">Sales are up 12% this week. Maggi is running low on stock.</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-rose-500 mb-3">
            <Bell className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Active Alerts</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5" />
            <p className="text-sm text-slate-600 font-medium">Inventory Agent requests approval for PO #102.</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800">OS Command Assistant</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={\`flex \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
              <div className={\`max-w-[80%] p-3 rounded-2xl text-sm font-medium \${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}\`}>
                {m.text}
              </div>
            </div>
          ))}
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
            <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/AIChatTab.tsx', aiChatTabContent);
