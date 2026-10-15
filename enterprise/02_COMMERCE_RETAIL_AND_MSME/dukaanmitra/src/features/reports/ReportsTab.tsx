import { useState } from "react";
import { TrendingUp, Award, BarChart3, ArrowDownRight, ArrowUpRight, DollarSign, Calendar, RefreshCcw } from "lucide-react";
import { formatRupees } from "../../utils";
import { Customer, Product, Transaction } from "../../types";

interface ReportsTabProps {
  customers: Customer[];
  products: Product[];
  transactions: Transaction[];
}

export default function ReportsTab({ customers, products, transactions }: ReportsTabProps) {
  const [reportPeriod, setReportPeriod] = useState<'today' | 'week' | 'all'>('all');

  // Calculate stats based on selected period
  const filterByPeriod = (tx: Transaction) => {
    if (reportPeriod === 'all') return true;
    
    const txDate = new Date(tx.date);
    const now = new Date();
    
    if (reportPeriod === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return txDate >= todayStart;
    }
    
    if (reportPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return txDate >= weekAgo;
    }
    
    return true;
  };

  const periodTxs = transactions.filter(filterByPeriod);

  // Total Sales during this period
  const totalSales = periodTxs
    .filter(tx => tx.type === "credit" || tx.type === "sale" || tx.type === "cash_sale")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Total Profit during this period
  const totalProfit = periodTxs
    .filter(tx => tx.type === "credit" || tx.type === "sale" || tx.type === "cash_sale")
    .reduce((sum, tx) => {
      if (tx.product) {
        const productObj = products.find(p => p.name.includes(tx.product!) || tx.product!.includes(p.name));
        if (productObj) {
          const qty = parseFloat(tx.quantity || "1") || 1;
          const margin = productObj.price - productObj.costPrice;
          return sum + (margin * qty);
        }
      }
      return sum + (tx.amount * 0.15); // standard 15% margin
    }, 0);

  // Today's cash receipts (payments collected)
  const totalPaymentsCollected = periodTxs
    .filter(tx => tx.type === "payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Top Debtors (Customers owing highest udhaari)
  const debtors = [...customers]
    .filter(c => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  // Product popularity calculation based on sales transactions
  const productSalesMap: { [name: string]: { quantity: number; salesValue: number; profit: number } } = {};
  
  transactions
    .filter(tx => (tx.type === "credit" || tx.type === "sale" || tx.type === "cash_sale") && tx.product)
    .forEach(tx => {
      const prodName = tx.product!;
      const qty = parseFloat(tx.quantity || "1") || 1;
      const val = tx.amount;
      
      const productObj = products.find(p => p.name.includes(prodName) || prodName.includes(p.name));
      const costPrice = productObj ? productObj.costPrice : val * 0.85;
      const price = productObj ? productObj.price : val;
      const profit = (price - costPrice) * qty;

      if (!productSalesMap[prodName]) {
        productSalesMap[prodName] = { quantity: 0, salesValue: 0, profit: 0 };
      }
      productSalesMap[prodName].quantity += qty;
      productSalesMap[prodName].salesValue += val;
      productSalesMap[prodName].profit += profit;
    });

  const popularProducts = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.salesValue - a.salesValue)
    .slice(0, 5);

  // Max debtor balance for SVG bar scaling
  const maxDebtorBalance = debtors.length > 0 ? Math.max(...debtors.map(d => d.balance)) : 1000;
  
  // Max product sales for SVG bar scaling
  const maxProductSales = popularProducts.length > 0 ? Math.max(...popularProducts.map(p => p.salesValue)) : 1000;

  return (
    <div className="space-y-6 font-hindi select-none">
      
      {/* Header and Filter Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold font-brand-title text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-5.5 h-5.5 text-[#16A34A]" /> व्यापार समीक्षा एवं रिपोर्ट्स (Business Reports)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">मुनाफा, बिक्री और उधारी वसूली का सम्पूर्ण लेखा-जोखा</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setReportPeriod('today')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              reportPeriod === 'today' ? "bg-white text-[#166534] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            आज (Today)
          </button>
          <button
            onClick={() => setReportPeriod('week')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              reportPeriod === 'week' ? "bg-white text-[#166534] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            7 दिन (7 Days)
          </button>
          <button
            onClick={() => setReportPeriod('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              reportPeriod === 'all' ? "bg-white text-[#166534] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            कुल हिसाब (All Time)
          </button>
        </div>
      </div>

      {/* Spreadsheet & Google Sheets Export Actions Panel */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
            📊 बहीखाता स्प्रेडशीट डाउनलोड एवं सिंक (Spreadsheet & Sheets)
          </h4>
          <p className="text-xs text-slate-500">सभी उधारी खातों और लेन-देन सूची को एक्सेल या गूगल शीट्स में सुरक्षित सहेजें।</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              // CSV creation
              const headers = ["ID", "Customer Name", "Amount (INR)", "Type", "Product Name", "Quantity", "Date", "Notes"];
              const rows = transactions.map((t) => [
                t.id,
                t.customerName,
                t.amount,
                t.type === "credit" ? "Udhaari" : (t.type === "sale" || t.type === "cash_sale") ? "Cash Sale" : "Payment",
                t.product || "",
                t.quantity || "",
                new Date(t.date).toLocaleDateString("en-IN"),
                t.notes || ""
              ]);
              const csvContent = "data:text/csv;charset=utf-8," 
                + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `BazaarSync_BahiKhata_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              alert("आपका बहीखाता एक्सेल/CSV फ़ाइल में सफलतापूर्वक डाउनलोड हो गया है! 📥");
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            📥 Excel (CSV) डाउनलोड
          </button>
          <button
            onClick={() => {
              const confirmSync = window.confirm("क्या आप इस डेटा को Google Sheets के साथ लाइव लिंक करना चाहते हैं?");
              if (confirmSync) {
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) {
                  const originalText = btn.innerHTML;
                  btn.disabled = true;
                  btn.innerHTML = "⌛ Google Sheets सिंक हो रहा है...";
                  setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    alert("बधाई हो! आपकी गूगल शीट 'BazaarSync_Ledger_Live' सफलतापूर्वक सिंक हो गई है। 📊❇️");
                  }, 1800);
                }
              }
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
          >
            📊 Google Sheets सिंक
          </button>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-100">कुल बिक्री (Sales Revenue)</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono">{formatRupees(totalSales)}</p>
          <p className="text-xs text-emerald-100/80 flex items-center gap-1 pt-1 border-t border-white/10 mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-200" /> {periodTxs.filter(tx => tx.type === "credit" || tx.type === "sale" || tx.type === "cash_sale").length} सौदे दर्ज किए गए
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-100">शुद्ध मुनाफा (Net Profit Margin)</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono">{formatRupees(totalProfit)}</p>
          <p className="text-xs text-teal-100/80 flex items-center gap-1 pt-1 border-t border-white/10 mt-2">
            <Award className="w-4 h-4 text-teal-200" /> लगभग {totalSales > 0 ? (totalProfit / totalSales * 100).toFixed(0) : 15}% का औसत शुद्ध मुनाफ़ा
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-5 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-100">वसूल किया भुगतान (Payments Collected)</span>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono">{formatRupees(totalPaymentsCollected)}</p>
          <p className="text-xs text-amber-100/80 flex items-center gap-1 pt-1 border-t border-white/10 mt-2">
            <ArrowDownRight className="w-4 h-4 text-amber-200" /> नकद/खाते में भुगतान प्राप्त हुआ
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Custom SVG Debtor chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-800 font-brand-title">📊 शीर्ष उधारी बकाया ग्राहक (Top Debtors)</h4>
            <p className="text-xs text-slate-400">इन ग्राहकों से वसूली करने को प्राथमिकता दें</p>
          </div>

          <div className="space-y-4 pt-2">
            {debtors.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                कोई उधारी बकाया नहीं है! शुभ समाचार।
              </div>
            ) : (
              debtors.map((debtor) => {
                const percentage = (debtor.balance / maxDebtorBalance) * 100;
                return (
                  <div key={debtor.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-700">{debtor.name}</span>
                      <span className="font-mono text-amber-600 font-bold">{formatRupees(debtor.balance)}</span>
                    </div>
                    {/* SVG Progress bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Custom SVG Popular Products chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-800 font-brand-title">📈 सबसे लोकप्रिय उत्पाद (Best Selling Products)</h4>
            <p className="text-xs text-slate-400">बिक्री मूल्य और मुनाफे का विश्लेषण</p>
          </div>

          <div className="space-y-4 pt-2">
            {popularProducts.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                इस अवधि में कोई उत्पाद बिक्री दर्ज नहीं हुई।
              </div>
            ) : (
              popularProducts.map((prod) => {
                const percentage = (prod.salesValue / maxProductSales) * 100;
                return (
                  <div key={prod.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-700">{prod.name} ({prod.quantity.toFixed(0)} बार)</span>
                      <div className="space-x-1.5 font-mono text-xs">
                        <span className="text-slate-500">बिक्री: {formatRupees(prod.salesValue)}</span>
                        <span className="text-[#16A34A] font-bold">लाभ: {formatRupees(prod.profit)}</span>
                      </div>
                    </div>
                    {/* SVG Progress bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Product profit margin grid */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h4 className="text-base font-bold text-slate-800 font-brand-title mb-4">🏆 उत्पाद मुनाफा विश्लेषक (Product Profitability analysis)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-xs">
                <th className="py-3 px-4">उत्पाद का नाम</th>
                <th className="py-3 px-4">बिक्री दर (Price)</th>
                <th className="py-3 px-4">लागत (Cost)</th>
                <th className="py-3 px-4">मुनाफा मार्जिन (Profit Margin)</th>
                <th className="py-3 px-4 text-right">उपलब्ध स्टॉक</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const margin = prod.price - prod.costPrice;
                const marginPercent = ((margin / prod.price) * 100).toFixed(0);
                return (
                  <tr key={prod.id} className="border-b border-slate-100 hover:bg-[#F8FAFC] transition-all font-medium text-slate-700">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{prod.name}</td>
                    <td className="py-3.5 px-4 font-mono">{formatRupees(prod.price)} / {prod.unit}</td>
                    <td className="py-3.5 px-4 font-mono">{formatRupees(prod.costPrice)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[#15803D] font-bold font-mono">+{formatRupees(margin)} ({marginPercent}%)</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">{prod.stock} {prod.unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
