import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Mic, Camera, ArrowRight, IndianRupee, Users, Package, Command, CheckCircle2, ChevronRight, X } from "lucide-react";
import { parseAIMunim, addCustomer, addProduct, addTransaction, adjustStock } from "../../utils";

export default function UniversalDataEntry({ customers, products, onRefreshDB }: any) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [parsedData, setParsedData] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleParse = async (e?: any) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const data = await parseAIMunim(query);
      setParsedData(data);
      setStep("confirm");
    } catch (err) {
      console.error("Failed to parse", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (parsedData.type === 'customer') {
        await addCustomer(parsedData.name, "", parsedData.amount || 0);
      } else if (parsedData.type === 'sale') {
        let pId = "misc";
        if (parsedData.product) {
          const prod = products.find((p:any) => p.name.toLowerCase().includes(parsedData.product.toLowerCase()));
          if (prod) pId = prod.id;
          else {
            const newP = await addProduct(parsedData.product, 0, "pcs", 0, 0, 10);
            pId = newP.id;
          }
        }
        await addTransaction("", parsedData.amount || 0, "cash_sale", pId, undefined, "AI Entry");
      }
      onRefreshDB();
      setStep("success");
      setTimeout(() => {
        setStep("input");
        setQuery("");
        setParsedData(null);
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 font-sans h-full flex flex-col">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-[#16A34A] rounded-2xl mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Universal Command</h1>
        <p className="text-slate-500 mt-2 font-medium">Type anything. We'll handle the rest.</p>
      </div>

      <div className={`relative bg-white rounded-3xl shadow-xl border-2 transition-colors duration-300 ${isFocused ? 'border-indigo-500 shadow-indigo-100' : 'border-slate-100'}`}>
        <form onSubmit={handleParse} className="flex items-center p-2 relative z-10">
          <div className="pl-4 pr-2 text-indigo-500">
            {loading ? (
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Command className="w-6 h-6" />
            )}
          </div>
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g., Sold 2 Paracetamol for ₹150..."
            className="flex-1 bg-transparent py-5 px-2 text-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            disabled={loading || step !== "input"}
          />
          <div className="flex items-center gap-2 pr-2">
            <button type="button" className="p-3 text-slate-400 hover:text-[#16A34A] hover:bg-indigo-50 rounded-xl transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button type="button" className="p-3 text-slate-400 hover:text-[#16A34A] hover:bg-[#16A34A]/10 rounded-xl transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <button type="submit" disabled={!query || loading} className="p-3 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803d] disabled:opacity-50 disabled:hover:bg-[#16A34A] transition-colors shadow-md">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <AnimatePresence>
          {step === "input" && query.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 bg-[#F8FAFC] rounded-b-3xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Suggestions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={() => setQuery("Add ₹500 to Rahul's khata")} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left group">
                    <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600 group-hover:scale-110 transition-transform"><Users className="w-5 h-5" /></div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Udhaar Entry</div>
                      <div className="text-xs text-slate-500">"Add ₹500 to Rahul's khata"</div>
                    </div>
                  </button>
                  <button onClick={() => setQuery("Sold 2 items for ₹1500")} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left group">
                    <div className="bg-[#16A34A]/10 p-2.5 rounded-xl text-[#16A34A] group-hover:scale-110 transition-transform"><IndianRupee className="w-5 h-5" /></div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Quick Sale</div>
                      <div className="text-xs text-slate-500">"Sold 2 items for ₹1500"</div>
                    </div>
                  </button>
                  <button onClick={() => setQuery("Added 50 boxes of Paracetamol")} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left group">
                    <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 group-hover:scale-110 transition-transform"><Package className="w-5 h-5" /></div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Stock Update</div>
                      <div className="text-xs text-slate-500">"Added 50 boxes of Paracetamol"</div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "confirm" && parsedData && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 bg-white rounded-b-3xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Confirm Action</h3>
                  <p className="text-sm text-slate-500">AI parsed your request. Please verify.</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${parsedData.type === 'sale' ? 'bg-emerald-100 text-[#15803D]' : 'bg-rose-100 text-rose-700'}`}>
                  {parsedData.type}
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-100 space-y-3 mb-6">
                {parsedData.amount !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-sm">Amount</span>
                    <span className="text-xl font-black text-slate-900">₹{parsedData.amount}</span>
                  </div>
                )}
                {parsedData.name && (
                  <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                    <span className="text-slate-500 font-medium text-sm">Customer</span>
                    <span className="font-bold text-slate-800">{parsedData.name}</span>
                  </div>
                )}
                {parsedData.product && (
                  <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                    <span className="text-slate-500 font-medium text-sm">Product</span>
                    <span className="font-bold text-slate-800">{parsedData.product}</span>
                  </div>
                )}
                {parsedData.hindiExplanation && (
                  <div className="mt-4 p-3 bg-indigo-50 text-indigo-800 rounded-xl text-sm font-medium border border-indigo-100">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    {parsedData.hindiExplanation}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("input")} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                  Edit
                </button>
                <button onClick={handleConfirm} className="flex-1 py-3.5 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-[#15803d] shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Confirm Save
                </button>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-t border-slate-100 bg-[#16A34A]/10 rounded-b-3xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#16A34A]/100 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-1">Successfully Saved!</h3>
              <p className="text-[#15803D] font-medium text-sm">Your data has been securely updated.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
