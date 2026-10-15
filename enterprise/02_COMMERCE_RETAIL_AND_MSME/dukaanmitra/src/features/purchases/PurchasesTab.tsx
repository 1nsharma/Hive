import React, { useState, useMemo } from "react";
import { 
  Supplier, 
  Purchase, 
  Product, 
  PurchaseItem 
} from "../../types";
import { 
  addSupplier, 
  updateSupplier, 
  deleteSupplier, 
  recordSupplierPayment, 
  addPurchase, 
  cancelPurchase, 
  formatRupees 
} from "../../utils";
import { 
  Plus, 
  Search, 
  Trash2, 
  UserPlus, 
  FileText, 
  History, 
  DollarSign, 
  FileCheck, 
  PlusCircle, 
  MinusCircle, 
  X, 
  AlertTriangle, 
  ArrowLeft, 
  Calendar, 
  IndianRupee, 
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PurchasesTabProps {
  suppliers: Supplier[];
  purchases: Purchase[];
  products: Product[];
  onRefreshDB: () => Promise<void>;
}

export default function PurchasesTab({ suppliers, purchases, products, onRefreshDB }: PurchasesTabProps) {
  const [subTab, setSubTab] = useState<'suppliers' | 'new_purchase' | 'history' | 'gst_report'>('suppliers');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  // Supplier Form state
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supName, setSupName] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supGstin, setSupGstin] = useState("");
  const [supStateCode, setSupStateCode] = useState("09"); // Default UP state code
  const [supBalance, setSupBalance] = useState(0);
  const [supNotes, setSupNotes] = useState("");

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payNotes, setPayNotes] = useState("");

  // Purchase Form state
  const [purchaseSupplierId, setPurchaseSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [purchaseNotes, setPurchaseNotes] = useState("");
  const [paymentType, setPaymentType] = useState<'credit' | 'cash'>('credit');
  const [itcStatus, setItcStatus] = useState<'eligible' | 'blocked'>('eligible');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Detailed modal to view a purchase
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);

  // States list helper
  const stateCodes: { [key: string]: string } = {
    "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab", "04": "Chandigarh",
    "05": "Uttarakhand", "06": "Haryana", "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh",
    "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh", "13": "Nagaland", "14": "Manipur",
    "15": "Mizoram", "16": "Tripura", "17": "Meghalaya", "18": "Assam", "19": "West Bengal",
    "20": "Jharkhand", "21": "Odisha", "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
    "27": "Maharashtra", "29": "Karnataka", "30": "Goa", "32": "Kerala", "33": "Tamil Nadu",
    "36": "Telangana", "37": "Andhra Pradesh"
  };

  // Filter suppliers based on search query
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.phone.includes(searchQuery) || 
      (s.gstin && s.gstin.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [suppliers, searchQuery]);

  // Selected supplier details
  const selectedSupplier = useMemo(() => {
    if (!selectedSupplierId) return null;
    return suppliers.find(s => s.id === selectedSupplierId) || null;
  }, [suppliers, selectedSupplierId]);

  // Purchases for the selected supplier
  const supplierPurchases = useMemo(() => {
    if (!selectedSupplierId) return [];
    return purchases.filter(p => p.supplierId === selectedSupplierId);
  }, [purchases, selectedSupplierId]);

  // GST calculation values for new purchase form
  const computedPurchaseTotals = useMemo(() => {
    let taxable = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const supplierDetails = suppliers.find(s => s.id === purchaseSupplierId);
    const isOutofState = supplierDetails && supplierDetails.stateCode !== "09"; // Assume shop is in UP (09) for simple intra/inter state check

    purchaseItems.forEach(item => {
      const lineTaxable = (Number(item.quantity) || 0) * (Number(item.costPrice) || 0);
      const gstRate = Number(item.gstRate) || 0;
      const gstAmount = lineTaxable * (gstRate / 100);

      taxable += lineTaxable;
      if (isOutofState) {
        igst += gstAmount;
      } else {
        cgst += gstAmount / 2;
        sgst += gstAmount / 2;
      }
    });

    const total = taxable + cgst + sgst + igst;

    return { taxable, cgst, sgst, igst, total };
  }, [purchaseItems, purchaseSupplierId, suppliers]);

  // Handle supplier operations
  const handleCreateSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSupplier(supName, supPhone, supGstin, supStateCode, supBalance, supNotes);
      await onRefreshDB();
      setShowAddSupplierModal(false);
      resetSupplierForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleEditSupplierClick = (s: Supplier) => {
    setEditingSupplier(s);
    setSupName(s.name);
    setSupPhone(s.phone);
    setSupGstin(s.gstin || "");
    setSupStateCode(s.stateCode || "09");
    setSupNotes(s.notes || "");
    setShowEditSupplierModal(true);
  };

  const handleUpdateSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;
    try {
      await updateSupplier(editingSupplier.id, supName, supPhone, supGstin, supStateCode, undefined, supNotes);
      await onRefreshDB();
      setShowEditSupplierModal(false);
      setEditingSupplier(null);
      resetSupplierForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteSupplierClick = async (id: string) => {
    if (window.confirm("क्या आप वाकई इस विक्रेता को हटाना चाहते हैं?")) {
      try {
        await deleteSupplier(id);
        await onRefreshDB();
        if (selectedSupplierId === id) setSelectedSupplierId(null);
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || payAmount <= 0) return;
    try {
      await recordSupplierPayment(selectedSupplierId, payAmount);
      await onRefreshDB();
      setShowPaymentModal(false);
      setPayAmount(0);
      setPayNotes("");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDownloadManifest = () => {
    try {
      const headers = [
        "ID",
        "Invoice Date",
        "Invoice Number",
        "Supplier ID",
        "Supplier Name",
        "Taxable Value (INR)",
        "CGST (INR)",
        "SGST (INR)",
        "IGST (INR)",
        "Total Amount (INR)",
        "ITC Status",
        "Payment Type",
        "Status"
      ];

      const csvRows = [headers.join(",")];

      purchases.forEach(p => {
        const sup = suppliers.find(s => s.id === p.supplierId);
        const row = [
          `"${p.id}"`,
          `"${p.invoiceDate}"`,
          `"${p.invoiceNumber}"`,
          `"${p.supplierId}"`,
          `"${(sup?.name || "Unknown").replace(/"/g, '""')}"`,
          `"${p.taxableValue.toFixed(2)}"`,
          `"${p.cgst.toFixed(2)}"`,
          `"${p.sgst.toFixed(2)}"`,
          `"${p.igst.toFixed(2)}"`,
          `"${p.totalAmount.toFixed(2)}"`,
          `"${p.itcStatus}"`,
          `"${p.paymentType}"`,
          `"${p.status}"`
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `bazaarsync_purchase_manifest_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert("मॅनिफ़ेस्ट डाउनलोड करने में त्रुटि: " + err.message);
    }
  };

  const resetSupplierForm = () => {
    setSupName("");
    setSupPhone("");
    setSupGstin("");
    setSupStateCode("09");
    setSupBalance(0);
    setSupNotes("");
  };

  // Handle purchase items entry
  const addPurchaseItemLine = () => {
    setPurchaseItems([
      ...purchaseItems, 
      { productId: "", name: "", quantity: 1, unit: "pcs", costPrice: 0, gstRate: 18, total: 0 }
    ]);
  };

  const removePurchaseItemLine = (idx: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== idx));
  };

  const updatePurchaseItemField = (idx: number, field: keyof PurchaseItem, val: any) => {
    const updated = [...purchaseItems];
    if (field === 'productId') {
      const prod = products.find(p => p.id === val);
      if (prod) {
        updated[idx] = {
          ...updated[idx],
          productId: val,
          name: prod.name,
          unit: prod.unit || "pcs",
          costPrice: prod.costPrice || 0
        };
      } else {
        updated[idx] = { ...updated[idx], productId: "", name: "" };
      }
    } else {
      updated[idx] = { ...updated[idx], [field]: val };
    }

    // Recalculate total for line
    const qty = Number(updated[idx].quantity) || 0;
    const cp = Number(updated[idx].costPrice) || 0;
    const gstRate = Number(updated[idx].gstRate) || 0;
    const subtotal = qty * cp;
    updated[idx].total = subtotal + (subtotal * (gstRate / 100));

    setPurchaseItems(updated);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!purchaseSupplierId) {
      setFormError("कृपया एक विक्रेता चुनें।");
      return;
    }
    if (!invoiceNumber) {
      setFormError("कृपया इनवॉइस नंबर दर्ज करें।");
      return;
    }
    if (purchaseItems.length === 0) {
      setFormError("कृपया कम से कम एक आइटम जोड़ें।");
      return;
    }

    setIsSubmitting(true);
    try {
      await addPurchase({
        supplierId: purchaseSupplierId,
        invoiceNumber,
        invoiceDate,
        taxableValue: computedPurchaseTotals.taxable,
        cgst: computedPurchaseTotals.cgst,
        sgst: computedPurchaseTotals.sgst,
        igst: computedPurchaseTotals.igst,
        itcStatus,
        items: purchaseItems,
        notes: purchaseNotes,
        paymentType,
        totalAmount: computedPurchaseTotals.total
      });
      await onRefreshDB();
      // Reset purchase form
      setPurchaseSupplierId("");
      setInvoiceNumber("");
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setPurchaseItems([]);
      setPurchaseNotes("");
      setSubTab('history');
    } catch (err: any) {
      setFormError(err.message || "पर्चेस दर्ज करने में विफलता।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPurchaseClick = async (id: string) => {
    if (window.confirm("सावधानी! क्या आप वाकई इस पर्चेस इनवॉइस को रद्द/वापस करना चाहते हैं? इससे स्टॉक मात्रा और विक्रेता का बकाया पुनः समायोजित हो जाएगा।")) {
      try {
        await cancelPurchase(id);
        await onRefreshDB();
        if (viewingPurchase) setViewingPurchase(null);
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    }
  };

  // Compute GST Report Values
  const gstReportData = useMemo(() => {
    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalItc = 0;

    purchases.forEach(p => {
      if (p.status === 'cancelled') return;
      totalTaxable += Number(p.taxableValue) || 0;
      totalCgst += Number(p.cgst) || 0;
      totalSgst += Number(p.sgst) || 0;
      totalIgst += Number(p.igst) || 0;
      if (p.itcStatus === 'eligible') {
        totalItc += (Number(p.cgst) || 0) + (Number(p.sgst) || 0) + (Number(p.igst) || 0);
      }
    });

    return { totalTaxable, totalCgst, totalSgst, totalIgst, totalItc };
  }, [purchases]);

  return (
    <div className="flex flex-col h-full overflow-hidden font-hindi">
      
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl mb-4 shrink-0">
        <button
          onClick={() => { setSubTab('suppliers'); setSelectedSupplierId(null); }}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
            subTab === 'suppliers' 
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" 
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          👤 विक्रेता (Suppliers)
        </button>
        <button
          onClick={() => setSubTab('new_purchase')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
            subTab === 'new_purchase' 
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" 
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          📝 नया इनवॉइस
        </button>
        <button
          onClick={() => setSubTab('history')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
            subTab === 'history' 
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" 
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          📜 खरीद इतिहास
        </button>
        <button
          onClick={() => setSubTab('gst_report')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer text-center ${
            subTab === 'gst_report' 
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" 
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          🏛️ GST & ITC
        </button>
      </div>

      {/* PRIMARY VIEWS */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-6 hide-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: SUPPLIER DIRECTORY / VENDOR LEDGER */}
          {subTab === 'suppliers' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {!selectedSupplierId ? (
                <>
                  {/* Search and registration */}
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="विक्रेता का नाम या फोन नंबर ढूंढें..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddSupplierModal(true)}
                      className="px-4 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-1.5 font-bold hover:bg-indigo-700 transition-all text-xs shadow-md shadow-indigo-600/15 cursor-pointer shrink-0"
                    >
                      <UserPlus className="w-4 h-4" /> नया जोड़ें
                    </button>
                  </div>

                  {/* Supplier cards list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredSuppliers.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200/60 rounded-[24px]">
                        <AlertTriangle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        कोई विक्रेता नहीं मिला।
                      </div>
                    ) : (
                      filteredSuppliers.map(s => (
                        <div
                          key={s.id}
                          onClick={() => setSelectedSupplierId(s.id)}
                          className="bg-white hover:bg-slate-50 border border-slate-200/60 rounded-3xl p-4 flex justify-between items-center cursor-pointer transition-all shadow-sm group hover:-translate-y-0.5"
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors">
                              {s.name}
                            </h4>
                            <p className="text-xs text-slate-500 font-mono">{s.phone}</p>
                            {s.gstin && (
                              <p className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md inline-block font-mono font-bold">
                                GST: {s.gstin}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">देय बकाया</span>
                            <span className={`font-mono font-bold text-base block ${s.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                              {formatRupees(s.balance)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block">{stateCodes[s.stateCode || "09"] || "Uttar Pradesh"}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                /* SELECTED SUPPLIER DETAIL / RUNNING BALANCE LEDGER */
                <div className="space-y-4">
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedSupplierId(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> विक्रेताओं की सूची पर लौटें
                  </button>

                  {/* Supplier Card */}
                  <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-48 h-48 bg-white/5 rounded-full" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold font-brand-title">{selectedSupplier?.name}</h3>
                        <p className="text-sm opacity-80 font-mono mt-0.5">{selectedSupplier?.phone}</p>
                        {selectedSupplier?.gstin && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="text-[10px] bg-white/10 text-emerald-400 border border-white/15 px-2 py-0.5 rounded-md font-mono font-bold">
                              GSTIN: {selectedSupplier.gstin}
                            </span>
                            <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-md font-bold">
                              State: {stateCodes[selectedSupplier.stateCode || "09"]}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Balance section */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase opacity-65 tracking-wider block font-bold">कुल देय राशि (Khata Balance)</span>
                        <span className={`text-2xl font-mono font-bold block ${selectedSupplier && selectedSupplier.balance > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                          {selectedSupplier ? formatRupees(selectedSupplier.balance) : "₹0.00"}
                        </span>
                        <span className="text-[10px] text-white/50 block mt-0.5">
                          {selectedSupplier && selectedSupplier.balance > 0 ? "उधारी चुकाना शेष है" : "कोई बकाया नहीं"}
                        </span>
                      </div>
                    </div>

                    {/* Action Panel inside card */}
                    <div className="flex gap-2 mt-6 pt-5 border-t border-white/10 relative z-10">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="flex-1 py-2.5 bg-white text-slate-900 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <DollarSign className="w-4 h-4" /> भुगतान दर्ज करें (Pay Supplier)
                      </button>
                      <button
                        onClick={() => selectedSupplier && handleEditSupplierClick(selectedSupplier)}
                        className="py-2.5 px-4 bg-white/10 text-white hover:bg-white/15 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        संपादित करें
                      </button>
                      <button
                        onClick={() => selectedSupplier && handleDeleteSupplierClick(selectedSupplier.id)}
                        className="py-2.5 px-4 bg-rose-600/30 text-rose-300 hover:bg-rose-600/40 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Supplier Ledger Table (Running balance) */}
                  <div className="bg-white border border-slate-200/60 rounded-[28px] p-5 shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      📖 खाता बही & इतिहास (Supplier Ledger Summary)
                    </h4>

                    {supplierPurchases.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        इस विक्रेता का कोई इनवॉइस इतिहास नहीं है।
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-500 font-bold">
                              <th className="py-2">तारीख</th>
                              <th className="py-2">इनवॉइस / विवरण</th>
                              <th className="py-2 text-right">कुल रकम</th>
                              <th className="py-2 text-center">प्रकार</th>
                              <th className="py-2 text-center">स्थिति</th>
                            </tr>
                          </thead>
                          <tbody>
                            {supplierPurchases.map(p => (
                              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                <td className="py-3 font-mono text-slate-600">{p.invoiceDate}</td>
                                <td className="py-3">
                                  <button 
                                    onClick={() => setViewingPurchase(p)}
                                    className="text-indigo-600 hover:underline font-bold text-left block"
                                  >
                                    Inv #{p.invoiceNumber}
                                  </button>
                                  {p.notes && <span className="text-[10px] text-slate-400 block">{p.notes}</span>}
                                </td>
                                <td className="py-3 text-right font-mono font-bold text-slate-800">
                                  {formatRupees(p.totalAmount)}
                                </td>
                                <td className="py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    p.paymentType === 'credit' ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                                  }`}>
                                    {p.paymentType === 'credit' ? "Khata" : "Cash"}
                                  </span>
                                </td>
                                <td className="py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    p.status === 'cancelled' ? "bg-slate-100 text-slate-600" : "bg-green-50 text-green-700"
                                  }`}>
                                    {p.status === 'cancelled' ? "रद्द" : "सक्रिय"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW 2: NEW PURCHASE INVOICE ENTRY FORM */}
          {subTab === 'new_purchase' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm space-y-6"
            >
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                📝 परचेस बिल प्रविष्टि (Purchase Invoice Entry)
              </h3>

              {formError && (
                <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl text-xs font-bold border border-rose-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {formError}
                </div>
              )}

              <form onSubmit={handlePurchaseSubmit} className="space-y-6 font-hindi">
                
                {/* Header detail row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">विक्रेता चुनें (Select Supplier) *</label>
                    <select
                      required
                      value={purchaseSupplierId}
                      onChange={(e) => setPurchaseSupplierId(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold"
                    >
                      <option value="">-- विक्रेता चुनें --</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">इनवॉइस नंबर (Invoice #) *</label>
                    <input
                      type="text"
                      required
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono font-bold"
                      placeholder="INV-2026-101"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">बिल तिथि (Invoice Date) *</label>
                    <input
                      type="date"
                      required
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono font-bold"
                    />
                  </div>
                </div>

                {/* ITEMS LINES GRID */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">सामान विवरण (Product Items)</label>
                    <button
                      type="button"
                      onClick={addPurchaseItemLine}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> नया आइटम जोड़ें
                    </button>
                  </div>

                  {purchaseItems.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                      इनवॉइस में जोड़ने के लिए सामान जोड़ना शुरू करें।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {purchaseItems.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl grid grid-cols-12 gap-3 items-center relative">
                          {/* Product select */}
                          <div className="col-span-12 md:col-span-4">
                            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">उत्पाद (Product)</span>
                            <select
                              required
                              value={item.productId || ""}
                              onChange={(e) => updatePurchaseItemField(idx, 'productId', e.target.value)}
                              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:outline-none"
                            >
                              <option value="">-- उत्पाद चुनें --</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} (CP: ₹{p.costPrice})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-4 md:col-span-2">
                            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">मात्रा (Qty)</span>
                            <input
                              type="number"
                              required
                              min={1}
                              value={item.quantity || ""}
                              onChange={(e) => updatePurchaseItemField(idx, 'quantity', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs text-center font-bold font-mono"
                            />
                          </div>

                          {/* Cost Price */}
                          <div className="col-span-4 md:col-span-2">
                            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">खरीद मूल्य (Cost Price)</span>
                            <input
                              type="number"
                              required
                              min={0.01}
                              step="any"
                              value={item.costPrice || ""}
                              onChange={(e) => updatePurchaseItemField(idx, 'costPrice', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs text-center font-bold font-mono"
                            />
                          </div>

                          {/* GST Rate */}
                          <div className="col-span-4 md:col-span-2">
                            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">GST %</span>
                            <select
                              value={item.gstRate}
                              onChange={(e) => updatePurchaseItemField(idx, 'gstRate', Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-mono"
                            >
                              <option value={0}>0%</option>
                              <option value={5}>5%</option>
                              <option value={12}>12%</option>
                              <option value={18}>18%</option>
                              <option value={28}>28%</option>
                            </select>
                          </div>

                          {/* Net Subtotal */}
                          <div className="col-span-10 md:col-span-1 text-right">
                            <span className="text-[9px] text-slate-400 block font-bold uppercase">Total</span>
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {formatRupees(item.total)}
                            </span>
                          </div>

                          {/* Delete line */}
                          <div className="col-span-2 md:col-span-1 text-center">
                            <button
                              type="button"
                              onClick={() => removePurchaseItemLine(idx)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional controls and invoice options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-4">
                    {/* Payment type toggle */}
                    <div>
                      <label className="block text-slate-600 text-xs font-bold mb-2">भुगतान प्रकार (Payment Mode)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentType('credit')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            paymentType === 'credit'
                              ? "bg-rose-50 text-rose-700 border-rose-200 ring-2 ring-rose-500/5"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          💸 उधारी (Khata / Credit)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType('cash')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            paymentType === 'cash'
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-emerald-500/5"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          💵 नकद (Cash)
                        </button>
                      </div>
                    </div>

                    {/* ITC Eligibilty Toggle */}
                    <div>
                      <label className="block text-slate-600 text-xs font-bold mb-2">GST इनपुट टैक्स क्रेडिट (ITC) पात्रता</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setItcStatus('eligible')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            itcStatus === 'eligible'
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/5"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          ✅ दावा योग्य (Eligible ITC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setItcStatus('blocked')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            itcStatus === 'blocked'
                              ? "bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-amber-500/5"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          ⚠️ ब्लॉक / अयोग्य (Blocked ITC)
                        </button>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-slate-600 text-xs font-bold mb-1">टिप्पणी (Notes) - Optional</label>
                      <input
                        type="text"
                        value={purchaseNotes}
                        onChange={(e) => setPurchaseNotes(e.target.value)}
                        className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-xs focus:outline-none"
                        placeholder="कोई अन्य अतिरिक्त विवरण जोड़ें"
                      />
                    </div>
                  </div>

                  {/* Calculations total breakdown sidebar card */}
                  <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 space-y-3.5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">कर विवरण और सारांश (Summary)</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500 font-bold">
                          <span>कर योग्य राशि (Taxable Value)</span>
                          <span className="font-mono">{formatRupees(computedPurchaseTotals.taxable)}</span>
                        </div>
                        {computedPurchaseTotals.cgst > 0 && (
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>CGST (केंद्रीय जीएसटी)</span>
                            <span className="font-mono font-bold">{formatRupees(computedPurchaseTotals.cgst)}</span>
                          </div>
                        )}
                        {computedPurchaseTotals.sgst > 0 && (
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>SGST (राज्य जीएसटी)</span>
                            <span className="font-mono font-bold">{formatRupees(computedPurchaseTotals.sgst)}</span>
                          </div>
                        )}
                        {computedPurchaseTotals.igst > 0 && (
                          <div className="flex justify-between text-xs text-[#4F46E5] font-bold">
                            <span>IGST (एकीकृत जीएसटी)</span>
                            <span className="font-mono">{formatRupees(computedPurchaseTotals.igst)}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-slate-200/80 pt-3 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-800">कुल इनवॉइस राशि (Grand Total)</span>
                          <span className="text-lg font-mono font-bold text-indigo-700">
                            {formatRupees(computedPurchaseTotals.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 py-3 bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                      {isSubmitting ? "सहेजा जा रहा है..." : "📦 इनवॉइस दर्ज करें (Stock In)"}
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          )}

          {/* VIEW 3: PURCHASE HISTORY */}
          {subTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-white border border-slate-200/60 rounded-[32px] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" /> खरीद इतिहास (Purchase History & Invoices)
                  </h3>
                  {purchases.length > 0 && (
                    <button
                      onClick={handleDownloadManifest}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> CSV मैनिफेस्ट डाउनलोड
                    </button>
                  )}
                </div>

                {purchases.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    कोई खरीद इतिहास रिकॉर्ड नहीं मिला।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-bold">
                          <th className="py-2">तारीख</th>
                          <th className="py-2">इनवॉइस नंबर</th>
                          <th className="py-2">विक्रेता</th>
                          <th className="py-2 text-right">कुल राशि</th>
                          <th className="py-2 text-center">भुगतान प्रकार</th>
                          <th className="py-2 text-center">ITC status</th>
                          <th className="py-2 text-center">स्थिति</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map(p => {
                          const sup = suppliers.find(s => s.id === p.supplierId);
                          return (
                            <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                              <td className="py-3 font-mono text-slate-600">{p.invoiceDate}</td>
                              <td className="py-3">
                                <button
                                  onClick={() => setViewingPurchase(p)}
                                  className="text-indigo-600 hover:underline font-bold"
                                >
                                  Inv #{p.invoiceNumber}
                                </button>
                              </td>
                              <td className="py-3 font-bold text-slate-800">{sup?.name || "Unknown Supplier"}</td>
                              <td className="py-3 text-right font-mono font-bold text-slate-800">
                                {formatRupees(p.totalAmount)}
                              </td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.paymentType === 'credit' ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                                }`}>
                                  {p.paymentType === 'credit' ? "Khata" : "Cash"}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.itcStatus === 'eligible' ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {p.itcStatus === 'eligible' ? "Eligible" : "Blocked"}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.status === 'cancelled' ? "bg-slate-100 text-slate-600" : "bg-green-50 text-green-700"
                                }`}>
                                  {p.status === 'cancelled' ? "रद्द" : "सक्रिय"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW 4: GST & ITC REPORT PANEL */}
          {subTab === 'gst_report' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">कुल टैक्स योग्य खरीद</span>
                  <span className="text-lg font-mono font-bold text-slate-800">
                    {formatRupees(gstReportData.totalTaxable)}
                  </span>
                </div>
                <div className="bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">केंद्रीय कर (CGST)</span>
                  <span className="text-lg font-mono font-bold text-slate-800">
                    {formatRupees(gstReportData.totalCgst)}
                  </span>
                </div>
                <div className="bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">राज्य कर (SGST)</span>
                  <span className="text-lg font-mono font-bold text-slate-800">
                    {formatRupees(gstReportData.totalSgst)}
                  </span>
                </div>
                <div className="bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm text-center">
                  <span className="text-[10px] text-indigo-500 font-bold uppercase block mb-1">दावा योग्य ITC</span>
                  <span className="text-lg font-mono font-bold text-indigo-700">
                    {formatRupees(gstReportData.totalItc)}
                  </span>
                </div>
              </div>

              {/* GST ITC breakdown detailed card */}
              <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" /> इनपुट टैक्स क्रेडिट (ITC) दावा विवरण
                </h3>

                <p className="text-xs text-slate-500">
                  यह सारांश आपके द्वारा योग्य घोषित की गई खरीदियों पर जीएसटी इनपुट टैक्स क्रेडिट (ITC) दावा विवरण प्रस्तुत करता है। ब्लॉक या अयोग्य (Blocked) क्रेडिट को यहाँ बाहर रखा गया है।
                </p>

                <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-2xl flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-xs text-indigo-900 font-bold">कुल योग्य CGST + SGST + IGST दावा राशि</span>
                    <p className="text-[10px] text-indigo-700">जीएसटी रिटर्न दाखिल करने के लिए उपयोगी सारांश।</p>
                  </div>
                  <span className="text-xl font-mono font-bold text-indigo-700">
                    {formatRupees(gstReportData.totalItc)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- FLOATING & OVERLAY MODALS --- */}

      {/* MODAL 1: ADD SUPPLIER */}
      <AnimatePresence>
        {showAddSupplierModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-md w-full border border-white/50 shadow-2xl relative overflow-hidden space-y-4"
            >
              <button
                onClick={() => setShowAddSupplierModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 pb-1">
                ➕ नया विक्रेता जोड़ें (Add Supplier)
              </h3>

              <form onSubmit={handleCreateSupplierSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">विक्रेता का नाम *</label>
                  <input
                    type="text"
                    required
                    value={supName}
                    onChange={(e) => setSupName(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-bold focus:outline-none"
                    placeholder="जैसे: बालाजी थोक भंडार"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">फोन नंबर *</label>
                    <input
                      type="text"
                      required
                      value={supPhone}
                      onChange={(e) => setSupPhone(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-bold focus:outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">राज्य कोड (State Code) *</label>
                    <select
                      value={supStateCode}
                      onChange={(e) => setSupStateCode(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs focus:outline-none"
                    >
                      {Object.entries(stateCodes).map(([code, name]) => (
                        <option key={code} value={code}>{code} - {name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={supGstin}
                    onChange={(e) => setSupGstin(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-mono focus:outline-none"
                    placeholder="09AAAAA0000A1Z1"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">प्रारंभिक देय उधारी (Opening Balance) - ₹</label>
                  <input
                    type="number"
                    value={supBalance || ""}
                    onChange={(e) => setSupBalance(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-bold focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">अन्य विवरण / टिप्पणी</label>
                  <input
                    type="text"
                    value={supNotes}
                    onChange={(e) => setSupNotes(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs focus:outline-none"
                    placeholder="पता, बैंक विवरण, आदि"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 shadow-lg cursor-pointer"
                >
                  सहेजें (Save Supplier)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT SUPPLIER */}
      <AnimatePresence>
        {showEditSupplierModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-md w-full border border-white/50 shadow-2xl relative overflow-hidden space-y-4"
            >
              <button
                onClick={() => { setShowEditSupplierModal(false); setEditingSupplier(null); }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 pb-1">
                ✏️ विक्रेता विवरण संपादित करें (Edit Supplier)
              </h3>

              <form onSubmit={handleUpdateSupplierSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">विक्रेता का नाम *</label>
                  <input
                    type="text"
                    required
                    value={supName}
                    onChange={(e) => setSupName(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">फोन नंबर *</label>
                    <input
                      type="text"
                      required
                      value={supPhone}
                      onChange={(e) => setSupPhone(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs font-bold mb-1">राज्य कोड (State Code) *</label>
                    <select
                      value={supStateCode}
                      onChange={(e) => setSupStateCode(e.target.value)}
                      className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs focus:outline-none"
                    >
                      {Object.entries(stateCodes).map(([code, name]) => (
                        <option key={code} value={code}>{code} - {name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={supGstin}
                    onChange={(e) => setSupGstin(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">अन्य विवरण / टिप्पणी</label>
                  <input
                    type="text"
                    value={supNotes}
                    onChange={(e) => setSupNotes(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-2.5 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 shadow-lg cursor-pointer"
                >
                  परिवर्तन सहेजें (Save Changes)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: RECORD PAYMENT TO SUPPLIER */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-md w-full border border-white/50 shadow-2xl relative overflow-hidden space-y-4"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 pb-1">
                💸 विक्रेता को भुगतान रिकॉर्ड करें (Record Payment)
              </h3>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">भुगतान राशि (Amount in ₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={payAmount || ""}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] font-bold font-mono focus:outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">टिप्पणी / संदर्भ (जैसे: कैश, चेक, यूपीआई आईडी)</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-xs focus:outline-none"
                    placeholder="जैसे: GPay Ref ID"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-xs hover:bg-indigo-700 shadow-lg cursor-pointer"
                >
                  भुगतान जमा करें (Record Payment)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: DETAILED PURCHASE INVOICE VIEW */}
      <AnimatePresence>
        {viewingPurchase && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-2xl w-full border border-white/50 shadow-2xl relative overflow-hidden space-y-6"
            >
              <button
                onClick={() => setViewingPurchase(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 font-brand-title">
                  🧾 परचेस इनवॉइस विवरण (Purchase Invoice Detail)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {viewingPurchase.id}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-hindi">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">विक्रेता</span>
                  <span className="text-xs font-bold text-slate-800">
                    {suppliers.find(s => s.id === viewingPurchase.supplierId)?.name || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">इनवॉइस नंबर</span>
                  <span className="text-xs font-mono font-bold text-slate-800">#{viewingPurchase.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">बिल तिथि</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{viewingPurchase.invoiceDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">स्थिति</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                    viewingPurchase.status === 'cancelled' ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {viewingPurchase.status === 'cancelled' ? "रद्द (Cancelled)" : "सक्रिय (Active)"}
                  </span>
                </div>
              </div>

              {/* Items List inside viewing purchase */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">सामान सूची (Items Purchased)</span>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs bg-slate-50/50">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-3">सामान</th>
                        <th className="p-3 text-center">मात्रा</th>
                        <th className="p-3 text-right">खरीद मूल्य</th>
                        <th className="p-3 text-center">GST %</th>
                        <th className="p-3 text-right">कुल</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(typeof viewingPurchase.items === 'string' 
                        ? JSON.parse(viewingPurchase.items) 
                        : (viewingPurchase.items || [])
                      ).map((item: any, i: number) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0 text-slate-700">
                          <td className="p-3 font-bold">{item.name || "Unknown Product"}</td>
                          <td className="p-3 text-center font-mono font-bold">{item.quantity} {item.unit || "pcs"}</td>
                          <td className="p-3 text-right font-mono font-bold">{formatRupees(item.costPrice)}</td>
                          <td className="p-3 text-center font-mono">{item.gstRate}%</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-800">{formatRupees(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculations breakdown for viewing purchase */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">भुगतान विवरण</span>
                  <span className="text-xs text-slate-700 block">
                    प्रकार: <strong>{viewingPurchase.paymentType === 'credit' ? "Khata / Credit" : "Cash"}</strong>
                  </span>
                  <span className="text-xs text-slate-700 block">
                    ITC स्थिति: <strong>{viewingPurchase.itcStatus === 'eligible' ? "Eligible" : "Blocked"}</strong>
                  </span>
                  {viewingPurchase.notes && (
                    <span className="text-xs text-slate-500 block mt-1 italic">
                      नोट: "{viewingPurchase.notes}"
                    </span>
                  )}
                </div>

                <div className="text-right space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">कर योग्य (Taxable):</span>
                    <span className="font-mono font-bold">{formatRupees(viewingPurchase.taxableValue)}</span>
                  </div>
                  {(Number(viewingPurchase.cgst) > 0 || Number(viewingPurchase.sgst) > 0) && (
                    <>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>CGST:</span>
                        <span className="font-mono">{formatRupees(viewingPurchase.cgst)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>SGST:</span>
                        <span className="font-mono">{formatRupees(viewingPurchase.sgst)}</span>
                      </div>
                    </>
                  )}
                  {Number(viewingPurchase.igst) > 0 && (
                    <div className="flex justify-between text-[11px] text-indigo-400">
                      <span>IGST:</span>
                      <span className="font-mono">{formatRupees(viewingPurchase.igst)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200/80 pt-2 flex justify-between font-bold text-slate-800">
                    <span>कुल रकम (Total):</span>
                    <span className="font-mono text-indigo-600">{formatRupees(viewingPurchase.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Return / Cancel button if active */}
              {viewingPurchase.status === 'active' && (
                <button
                  onClick={() => handleCancelPurchaseClick(viewingPurchase.id)}
                  className="w-full py-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" /> इस इनवॉइस को रद्द करें / माल वापस करें (Cancel & Return)
                </button>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
