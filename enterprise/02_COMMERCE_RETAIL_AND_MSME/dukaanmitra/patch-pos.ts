import fs from 'fs';
let content = fs.readFileSync('src/components/POSTab.tsx', 'utf-8');

// 1. Add `PackagePlus` to lucide-react imports
content = content.replace(
  'User } from "lucide-react";',
  'User, PackagePlus } from "lucide-react";'
);

// 2. Add `addProduct` to utils imports
content = content.replace(
  'scanBillPhoto } from "../utils";',
  'scanBillPhoto, addProduct, fetchWithAuth } from "../utils";'
);

// 3. Add states for Add Product
const statesCode = `
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
`;
content = content.replace(
  /const \[showAddCustomer.*?setIsAddingCustomer\(false\);/s,
  statesCode.trim()
);

// 4. Add handleAddProduct method
const handleMethod = `
  const handleAddCustomer = async (e: any) => {
    e.preventDefault();
    if (!newCustName) return;
    setIsAddingCustomer(true);
    try {
      const cust = await addCustomer(newCustName, newCustPhone, 0, "");
      if (onRefreshDB) onRefreshDB();
      setSelectedCustomer(cust.id);
      setShowAddCustomer(false);
      setNewCustName("");
      setNewCustPhone("");
    } catch (err) {
      alert("ग्राहक जोड़ने में विफल।");
    } finally {
      setIsAddingCustomer(false);
    }
  };

  const handleAddProduct = async (e: any) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    setIsAddingProduct(true);
    try {
      const pPrice = Number(newProdPrice);
      const pStock = Number(newProdStock) || 0;
      await addProduct(newProdName, pStock, "piece", pPrice, pPrice * 0.8, 5);
      if (onRefreshDB) onRefreshDB();
      setShowAddProduct(false);
      setNewProdName("");
      setNewProdPrice("");
      setNewProdStock("");
    } catch (err) {
      alert("उत्पाद जोड़ने में विफल।");
    } finally {
      setIsAddingProduct(false);
    }
  };
`;
content = content.replace(
  /const handleAddCustomer.*?setIsAddingCustomer\(false\);\n  };/s,
  handleMethod.trim()
);

// 5. Add "New Product" Button in header
const headerHTML = `
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <ScanLine className="w-5 h-5 text-indigo-600" />
               सौदा दर्ज करें (POS)
             </h2>
             <button onClick={() => setShowAddProduct(true)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 text-sm font-bold">
                <PackagePlus className="w-4 h-4" /> नया उत्पाद
             </button>
          </div>
`;
content = content.replace(
  /<div className="flex items-center justify-between">.*?<\/div>/s,
  headerHTML.trim()
);

// 6. Add "New Product" Modal JSX right before Receipt Modal
const productModal = `
      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                 <h3 className="text-lg font-bold text-slate-800">नया उत्पाद जोड़ें</h3>
                 <button onClick={() => setShowAddProduct(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">नाम (Name) *</label>
                    <input 
                      type="text" required
                      value={newProdName} onChange={e => setNewProdName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. चीनी 1kg"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">कीमत (₹) *</label>
                      <input 
                        type="number" required
                        value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="e.g. 50"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">स्टॉक</label>
                      <input 
                        type="number"
                        value={newProdStock} onChange={e => setNewProdStock(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="e.g. 10"
                      />
                   </div>
                 </div>
                 <button 
                   type="submit" disabled={isAddingProduct}
                   className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all mt-2"
                 >
                   {isAddingProduct ? "जोड़ा जा रहा है..." : "उत्पाद सुरक्षित करें"}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
`;
content = content.replace('{/* Receipt Modal */}', productModal);

// 7. Fix WhatsApp implementation
const oldWhatsApp = `// In a real app we'd fetch with auth, but since utils has send bill?
                      // We can just alert for now or implement real fetch.
                      alert("✅ WhatsApp पर रसीद भेज दी गई!");`;
const newWhatsApp = `const res = await fetchWithAuth("/api/whatsapp/send-bill", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          customerName: receiptData.customerName,
                          phone: receiptData.customerPhone,
                          amount: receiptData.amount,
                          billNo: receiptData.billNo,
                          items: receiptData.items
                        })
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert("✅ WhatsApp पर रसीद भेज दी गई!");
                      } else {
                        alert("❌ एरर: " + (data.error || "Failed to send"));
                      }`;
content = content.replace(oldWhatsApp, newWhatsApp);

fs.writeFileSync('src/components/POSTab.tsx', content);
