import { useState, useEffect } from "react";
import { Search, Package, Users, IndianRupee, Settings, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatRupees } from "../../utils";

export default function Omnibar({ customers, products, transactions, onNavigate }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const res = [];
    
    // Search Customers
    const custMatches = customers.filter((c: any) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    custMatches.forEach((c: any) => res.push({ type: 'customer', data: c, title: c.name, subtitle: `Balance: ${formatRupees(c.balance)}`, icon: Users, tab: 'ledger' }));

    // Search Products
    const prodMatches = products.filter((p: any) => p.name.toLowerCase().includes(q));
    prodMatches.forEach((p: any) => res.push({ type: 'product', data: p, title: p.name, subtitle: `Stock: ${p.stock} | Price: ${formatRupees(p.price)}`, icon: Package, tab: 'inventory' }));

    // Settings / Commands
    if ("settings".includes(q) || "configuration".includes(q)) {
      res.push({ type: 'command', title: 'Open Settings', subtitle: 'Configure business details', icon: Settings, tab: 'settings' });
    }
    if ("pos".includes(q) || "sale".includes(q)) {
      res.push({ type: 'command', title: 'New Sale (POS)', subtitle: 'Record a new transaction', icon: IndianRupee, tab: 'pos' });
    }

    setResults(res.slice(0, 5));
  }, [query, customers, products]);

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100 relative z-40">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search customers, products, or type a command..."
          className="w-full bg-[#F8FAFC] border border-gray-200 pl-11 pr-4 py-3 rounded-2xl text-[15px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all placeholder:text-gray-400"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && query && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <button 
                      key={i}
                      onClick={() => {
                        onNavigate(r.tab);
                        setQuery("");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors text-left"
                    >
                      <div className="p-2 bg-[#16A34A]/10 text-[#16A34A] rounded-xl">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#0F172A] text-sm">{r.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{r.subtitle}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
