import re

with open("src/components/POSTab.tsx", "r") as f:
    content = f.read()

# Import fetchWithAuth and receipt icons
content = content.replace(
    'import { formatRupees, addTransaction, adjustStock, addCustomer } from "../utils";',
    'import { formatRupees, addTransaction, adjustStock, addCustomer, fetchWithAuth } from "../utils";'
)
content = content.replace(
    'import { ScanBarcode, Camera, CameraOff, X, Plus, Minus, IndianRupee, User, AlertTriangle, Search, UserPlus } from "lucide-react";',
    'import { ScanBarcode, Camera, CameraOff, X, Plus, Minus, IndianRupee, User, AlertTriangle, Search, UserPlus, Printer, Send, MessageCircle } from "lucide-react";'
)

# Add receipt state variables
state_vars = """
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);
"""
content = re.sub(r'const \[selectedDeviceId, setSelectedDeviceId\] = useState<string>\(""\);', r'const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");\n' + state_vars, content)

# Modify processCheckout
new_checkout = """
      // Create Receipt Data
      const billNo = "INV-" + new Date().getTime().toString().slice(-6);
      const receipt = {
        billNo,
        customerName: selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name : "Cash Customer",
        customerPhone: selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.phone : "",
        amount: cartTotal,
        items: cart.map(c => ({
          name: c.product.name,
          quantity: c.quantity,
          price: c.product.price,
          total: c.quantity * c.product.price
        })),
        date: new Date().toLocaleString('en-IN')
      };
      setReceiptData(receipt);
      setShowReceipt(true);
      
      // Clear and Refresh
      setCart([]);
      setCheckoutMode("cash");
      setSelectedCustomer("");
      await onRefreshDB();
"""
content = re.sub(
    r'      // Clear and Refresh\n      setCart\(\[\]\);\n      setCheckoutMode\("cash"\);\n      setSelectedCustomer\(""\);\n      await onRefreshDB\(\);\n      alert\("बिल सफलतापूर्वक बन गया!"\);',
    new_checkout,
    content
)

# Add Receipt Modal UI at the bottom before final closing div
receipt_modal = """
      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && receiptData && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#123824] rounded-2xl w-full max-w-sm overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <button onClick={() => setShowReceipt(false)} className="p-1.5 bg-white/10 text-white rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-white font-bold text-sm">सौदा दर्ज हुआ ✅</h3>
                <div className="w-8"></div>
              </div>
              
              <div className="flex-1 p-5 overflow-y-auto">
                {/* Stitched Receipt Edge Design */}
                <div className="bg-[#FBF7EF] text-[#2A2A22] rounded-md font-mono text-[11px] leading-relaxed p-4 relative" style={{
                  background: 'linear-gradient(to right, #FBF7EF, #FBF7EF)',
                  borderTop: '8px dotted transparent',
                  borderBottom: '8px dotted transparent',
                }}>
                  <div className="text-center font-bold mb-1">श्री गणेश किराना स्टोर</div>
                  <div className="text-center mb-3">सौदा रसीद (DukaanMitra)</div>
                  <div className="border-t border-dashed border-gray-400 my-2"></div>
                  <div>दिनांक: {receiptData.date}</div>
                  <div>रसीद क्र: {receiptData.billNo}</div>
                  <div>ग्राहक: {receiptData.customerName}</div>
                  <div className="border-t border-dashed border-gray-400 my-2"></div>
                  <div className="mb-2 font-bold flex justify-between">
                    <span>विवरण</span>
                    <span>रकम</span>
                  </div>
                  {receiptData.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-start mb-1">
                      <div className="pr-2">
                        <div>{item.name}</div>
                        <div className="text-[9px] text-gray-500">{item.quantity} x ₹{item.price}</div>
                      </div>
                      <div className="font-medium whitespace-nowrap">₹{item.total}</div>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-gray-400 my-2"></div>
                  <div className="font-bold flex justify-between mt-1 text-sm">
                    <span>कुल रकम:</span>
                    <span>₹{receiptData.amount}</span>
                  </div>
                  <div className="text-center mt-4 text-[10px] text-gray-500">धन्यवाद! आपका दिन शुभ हो। 🙏</div>
                </div>
              </div>
              
              <div className="p-4 space-y-3 bg-[#0B2818]">
                <button 
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" /> प्रिंट करें
                </button>
                <button 
                  className="w-full py-3 bg-[#16A34A] hover:bg-[#12883e] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                  disabled={sendingReceipt}
                  onClick={async () => {
                    if (!receiptData.customerPhone) {
                       alert("ग्राहक का मोबाइल नंबर दर्ज नहीं है। कृपया ग्राहक प्रोफ़ाइल अपडेट करें।");
                       return;
                    }
                    setSendingReceipt(true);
                    try {
                      const res = await fetchWithAuth("/api/whatsapp/send-bill", {
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
                        alert("❌ एरर: " + data.error);
                      }
                    } catch (e: any) {
                       alert("❌ नेटवर्क एरर: " + e.message);
                    } finally {
                       setSendingReceipt(false);
                    }
                  }}
                >
                  {sendingReceipt ? "भेज रहे हैं..." : <><MessageCircle className="w-4 h-4" /> WhatsApp पर भेजें</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
"""

# Need ArrowLeft
content = content.replace(
    'import { ScanBarcode, Camera, CameraOff, X, Plus, Minus, IndianRupee, User, AlertTriangle, Search, UserPlus, Printer, Send, MessageCircle } from "lucide-react";',
    'import { ScanBarcode, Camera, CameraOff, X, Plus, Minus, IndianRupee, User, AlertTriangle, Search, UserPlus, Printer, Send, MessageCircle, ArrowLeft } from "lucide-react";'
)

# Insert modal right before the last </div>
content = content.replace("    </div>\n  );\n}", receipt_modal + "\n    </div>\n  );\n}")

with open("src/components/POSTab.tsx", "w") as f:
    f.write(content)
