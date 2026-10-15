import Omnibar from "./features/dashboard/Omnibar";
import { useState, useEffect, FormEvent } from "react";
import LoginScreen from "./features/auth/LoginScreen";
import ShopHeader from "./features/dashboard/ShopHeader";
import WorkspaceOS from "./features/dashboard/WorkspaceOS";
import LedgerTab from "./features/ledger/LedgerTab";
import InventoryTab from "./features/inventory/InventoryTab";
import ReportsTab from "./features/reports/ReportsTab";
import SettingsTab from "./features/settings/SettingsTab";
import VisitsTab from "./features/staff/VisitsTab";
import StaffTab from "./features/staff/StaffTab";
import WhatsAppOrders from "./features/whatsapp/WhatsAppOrders";
import WhatsAppConnection from "./features/whatsapp/WhatsAppConnection";
import AdminConsole from "./features/admin/AdminConsole";
import POSTab from "./features/pos/POSTab";
import OnboardingWizard from "./features/auth/OnboardingWizard";
import PurchasesTab from "./features/purchases/PurchasesTab";
import RoadmapTab from "./features/roadmap/RoadmapTab";
import { fetchDB, addTransaction, adjustStock, formatRupees, mergeGuestDataWithServer, fetchWithAuth } from "./utils";
import { Customer, Product, Transaction, Supplier, Purchase } from "./types";
import { Plus, X, IndianRupee, Package, ArrowUp, ArrowDown, Sparkles, Home, Users, LineChart, MoreHorizontal, Store, Settings, ShieldAlert, LogOut, Bell, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<{ 
    shopName: string; 
    phone: string; 
    isGuest?: boolean; 
    isAdmin?: boolean;
    businessConfig?: any;
    role?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Database states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");

  // Quick actions modal states
  const [showQuickTxModal, setShowQuickTxModal] = useState(false);
  const [showQuickStockModal, setShowQuickStockModal] = useState(false);

  // Quick transaction form fields
  const [qTxCustId, setQTxCustId] = useState("");
  const [qTxType, setQTxType] = useState<'credit' | 'payment'>('credit');
  const [qTxAmount, setQTxAmount] = useState<number>(0);
  const [qTxProduct, setQTxProduct] = useState("");
  const [qTxQuantity, setQTxQuantity] = useState("");
  const [qTxNotes, setQTxNotes] = useState("");

  // Quick stock form fields
  const [qStockProdId, setQStockProdId] = useState("");
  const [qStockType, setQStockType] = useState<'in' | 'out'>('in');
  const [qStockQty, setQStockQty] = useState<number>(0);
  const [qStockNotes, setQStockNotes] = useState("");

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);

  // Load user from local session storage if available
  useEffect(() => {
    const savedUser = localStorage.getItem("bazaarsync_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.isGuest) {
        localStorage.removeItem("bazaarsync_user");
      } else {
        if (!parsedUser.role) {
          parsedUser.role = "Owner";
        }
        setUser(parsedUser);
      }
    }
  }, []);

  // Fetch complete database from custom server on mount and refreshes
  const handleRefreshDB = async () => {
    setDbLoading(true);
    setDbError("");
    try {
      const db = await fetchDB();
      setCustomers(db.customers || []);
      setProducts(db.products || []);
      setTransactions(db.transactions || []);
      setSuppliers(db.suppliers || []);
      setPurchases(db.purchases || []);
    } catch (err: any) {
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
         localStorage.removeItem("bazaarsync_auth");
         localStorage.removeItem("bazaarsync_user");
         setUser(null);
         return;
      }
      console.error(err);
      setDbError("सर्वर से डेटा लोड करने में त्रुटि: " + err.message);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      handleRefreshDB();
      
      const interval = setInterval(() => {
        fetchDB().then(db => {
          setCustomers(db.customers || []);
          setProducts(db.products || []);
          setTransactions(db.transactions || []);
          setSuppliers(db.suppliers || []);
          setPurchases(db.purchases || []);
        }).catch(err => {
          if (err.message.includes("401") || err.message.includes("Unauthorized")) {
             localStorage.removeItem("bazaarsync_auth");
             localStorage.removeItem("bazaarsync_user");
             setUser(null);
          } else {
             console.warn("Auto-refresh failed", err);
          }
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [user]);


  const handleLoginSuccess = async (shopName: string, phone: string, isGuest?: boolean, role?: string) => {
    // Small delay to ensure localStorage is flushed
    await new Promise(r => setTimeout(r, 100));
    let isAdmin = false;
    let businessConfig = undefined;
    let finalShopName = shopName;
    const finalRole = role || "Owner";
    
    if (!isGuest) {
      // Check admin status and fetch existing data
      const token = localStorage.getItem("bazaarsync_auth");
      if (token) {
        try {
          const authData = JSON.parse(token);
          
          const [meRes, settingsRes] = await Promise.all([
             fetchWithAuth("/api/auth/me").catch(() => null),
             fetchWithAuth("/api/settings").catch(() => null)
          ]);
          
          if (meRes && meRes.ok) {
            const data = await meRes.json();
            isAdmin = data.isAdmin;
          }
          
          if (settingsRes && settingsRes.ok) {
             const settingsData = await settingsRes.json();
             if (settingsData.settings && settingsData.settings.businessName) {
                finalShopName = settingsData.settings.businessName;
                businessConfig = {
                   businessName: settingsData.settings.businessName,
                   phone: settingsData.settings.phone,
                   skipOnboarding: true
                };
             } else {
                 // Try to fetch DB right now to see if we have an existing shop name / config (for backward compatibility before settings table)
                 try {
                     const db = await fetchDB();
                     if ((db.customers && db.customers.length > 0) || (db.products && db.products.length > 0)) {
                         businessConfig = { businessName: shopName, skipOnboarding: true };
                     }
                 } catch(e) {}
             }
          }
          
        } catch (e) {
          console.error("Failed to fetch user configuration", e);
        }
      }
    }

    const newUser = { shopName: finalShopName, phone, isGuest: !!isGuest, isAdmin, businessConfig, role: finalRole };
    localStorage.setItem("bazaarsync_user", JSON.stringify(newUser));

    
    if (!isGuest) {
      // If logging into a real account, check if we have any offline guest data
      const hasGuestData = localStorage.getItem("bazaarsync_guest_db");
      if (hasGuestData) {
        // Auto-sync in preview iframe instead of window.confirm
        setDbLoading(true);
        try {
          await mergeGuestDataWithServer();
          // Provide silent sync, no alerts which can block iframe
        } catch (err) {
          console.error("Failed to merge guest data:", err);
        } finally {
          setDbLoading(false);
        }
      }
    }

    setUser(newUser);
    if (isAdmin) {
      setActiveTab("admin");
    }

    if (!isGuest) {
      const token = localStorage.getItem("bazaarsync_auth");
      if (token) {
        try {
          const authData = JSON.parse(token);
          fetchWithAuth("/api/auth/session-log", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ eventType: "login", metadata: { phone, shopName } })
          });
        } catch (e) {
          console.error("Failed to log session:", e);
        }
      }
    }
  };

  const handleLogout = () => {
    if (!user?.isGuest) {
      const token = localStorage.getItem("bazaarsync_auth");
      if (token) {
        try {
          const authData = JSON.parse(token);
          fetchWithAuth("/api/auth/session-log", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ eventType: "logout", metadata: { phone: user.phone, shopName: user.shopName } })
          });
        } catch (e) {
          console.error("Failed to log session:", e);
        }
      }
    }

    localStorage.removeItem("bazaarsync_user");
    localStorage.removeItem("bazaarsync_auth");
    localStorage.removeItem("bazaarsync_demo_id"); // clear demo ID
    setUser(null);
    setActiveTab("dashboard");
  };

  // Submit quick transaction
  const handleQuickTxSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!qTxCustId || qTxAmount <= 0) return;
    setModalLoading(true);
    setModalError("");
    try {
      await addTransaction(
        qTxCustId,
        qTxAmount,
        qTxType,
        qTxProduct,
        qTxQuantity,
        qTxNotes || `त्वरित बहीखाता प्रविष्टि`
      );
      await handleRefreshDB();
      setShowQuickTxModal(false);
      // Reset
      setQTxAmount(0);
      setQTxProduct("");
      setQTxQuantity("");
      setQTxNotes("");
    } catch (err: any) {
      setModalError(err.message || "Failed to record transaction");
    } finally {
      setModalLoading(false);
    }
  };

  // Submit quick stock adjust
  const handleQuickStockSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!qStockProdId || qStockQty <= 0) return;
    setModalLoading(true);
    setModalError("");
    try {
      await adjustStock(
        qStockProdId,
        qStockQty,
        qStockType,
        qStockNotes || `त्वरित स्टॉक समायोजन`
      );
      await handleRefreshDB();
      setShowQuickStockModal(false);
      // Reset
      setQStockQty(0);
      setQStockNotes("");
    } catch (err: any) {
      setModalError(err.message || "Failed to adjust stock");
    } finally {
      setModalLoading(false);
    }
  };

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (!user.businessConfig && !user.isAdmin) {
    return (
      <OnboardingWizard 
        shopName={user.shopName} 
        phone={user.phone}
        onComplete={async (config) => {
          const updatedUser = { ...user, businessConfig: config, shopName: config.businessName };
          setUser(updatedUser);
          localStorage.setItem("bazaarsync_user", JSON.stringify(updatedUser));
          
          if (!user.isGuest) {
            // Save settings to backend
            try {
              const authData = localStorage.getItem("bazaarsync_auth");
              const token = authData ? JSON.parse(authData).token : "";
              if (token) {
                await fetch("/api/settings", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(config)
                });
              }
            } catch (err) {
              console.error("Failed to save settings", err);
            }
          }
        }} 
      />
    );
  }

  return (
    <div className="relative h-[100dvh] flex flex-col font-sans select-none overflow-hidden" style={{background: 'var(--paper)', backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, var(--paper-line) 27px, var(--paper-line) 28px)'}}>
      <ShopHeader
        isGuest={user.isGuest}
        onNotificationClick={() => setShowNotifications(true)}
        showBack={activeTab !== "dashboard"}
        onBack={() => setActiveTab("dashboard")}
        onSettingsClick={() => setActiveTab("settings")}
      />
      {activeTab !== "ai_ocr" && <Omnibar customers={customers} products={products} transactions={transactions} onNavigate={setActiveTab} />}

      {/* Notifications */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-16 right-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="p-8 text-center text-slate-500 text-sm">
                No new notifications
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-hidden px-3 pt-2 pb-24 relative flex flex-col min-h-0">
        {dbError && (
          <div className="mb-3 mx-2 p-3 bg-[#16A34A]/10 text-[#16A34A]0/10 backdrop-blur-md border border-rose-500/20 rounded-[20px] flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-sm font-medium">डेटा सिंक नहीं हो पा रहा है।</span>
            </div>
            <button
              onClick={handleRefreshDB}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              फिर कोशिश करें
            </button>
          </div>
        )}

        {/* Dynamic Tab Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.96, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: -15, filter: 'blur(4px)' }}
            transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.9 }}
            className={`flex-1 h-full min-h-0 flex flex-col ${activeTab === "dashboard" ? "overflow-hidden" : "overflow-y-auto"}`}
          >
            {activeTab === "dashboard" && (
              <WorkspaceOS
                user={user}
                customers={customers}
                products={products}
                transactions={transactions}
                setActiveTab={setActiveTab}
                onOpenQuickTx={() => setShowQuickTxModal(true)}
                onOpenQuickStock={() => setShowQuickStockModal(true)}
                onRefreshDB={handleRefreshDB}
              />
            )}

            

            

            {activeTab === "pos" && (
              <POSTab
                products={products}
                customers={customers}
                onRefreshDB={handleRefreshDB}
              />
            )}

            {activeTab === "ledger" && (
              <LedgerTab
                customers={customers}
                transactions={transactions}
                onRefreshDB={handleRefreshDB}
              />
            )}

            {activeTab === "inventory" && (
              <InventoryTab
                products={products}
                onRefreshDB={handleRefreshDB}
              />
            )}

            {activeTab === "purchases" && (
              <PurchasesTab
                suppliers={suppliers}
                purchases={purchases}
                products={products}
                onRefreshDB={handleRefreshDB}
              />
            )}

            {activeTab === "reports" && (
              <ReportsTab
                customers={customers}
                products={products}
                transactions={transactions}
              />
            )}
            {activeTab === "roadmap" && (
              <RoadmapTab />
            )}
            {activeTab === "settings" && (
              <SettingsTab user={user} transactions={transactions} customers={customers} onLogout={handleLogout} setActiveTab={setActiveTab} />
            )}
            {activeTab === "visits" && (
              <VisitsTab onBack={() => setActiveTab("settings")} />
            )}
            {activeTab === "staff" && (
              <StaffTab onBack={() => setActiveTab("settings")} transactions={transactions} />
            )}
            {activeTab === "whatsapp_connection" && (
              <WhatsAppConnection onBack={() => setActiveTab("settings")} />
            )}
            {activeTab === "whatsapp_orders" && (
              <WhatsAppOrders onBack={() => setActiveTab("settings")} />
            )}

            {activeTab === "admin" && (
              <AdminConsole />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Buttons or Footer credits */}
      <footer className="text-center text-slate-400 text-xs mt-12 py-4 select-none flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <span>© 2026 BazaarSync • </span>
          <span className="font-hindi text-[#16A34A] font-semibold">भरोसेमंद डिजिटल मुनीम बहीखाता</span>
        </div>
        {(user.isAdmin || user.role === 'Accountant') && (
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin')}
            className="text-slate-500 hover:text-[#16A34A] font-semibold uppercase tracking-widest text-[10px] transition-colors"
          >
            {activeTab === 'admin' ? 'Exit Console' : 'Founder / Accountant Console'}
          </button>
        )}
      </footer>

      {/* 1. Dashboard Modal: Quick Transaction Entry */}
      <AnimatePresence>
        {showQuickTxModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-md w-full border border-white/50 shadow-2xl shadow-indigo-500/10 relative overflow-hidden"
            >
              <button
                onClick={() => setShowQuickTxModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold font-brand-title text-slate-800 mb-4 flex items-center gap-1.5">
                ⚡ त्वरित बहीखाता सौदा (Quick Ledger Entry)
              </h3>

              {modalError && (
                <div className="bg-[#16A34A]/10 text-[#16A34A] border border-rose-200 text-rose-700 p-3 rounded-xl text-xs mb-4">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleQuickTxSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">ग्राहक चुनें (Select Customer) *</label>
                  <select
                    required
                    value={qTxCustId}
                    onChange={(e) => setQTxCustId(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="">-- ग्राहक चुनें --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({formatRupees(c.balance)} बकाया)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-2">सौदा का प्रकार (Type)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQTxType('credit')}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center ${
                        qTxType === 'credit'
                          ? "bg-[#16A34A]/10 text-[#16A34A] border-amber-300 text-amber-800 ring-2 ring-amber-500/10"
                          : "bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      उधारी दिया (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQTxType('payment')}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center ${
                        qTxType === 'payment'
                          ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30 text-[#166534] ring-2 ring-[#16A34A]/10"
                          : "bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      भुगतान मिला (-)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">कुल रकम (Rupees Amount) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={qTxAmount || ""}
                    onChange={(e) => setQTxAmount(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                    placeholder="₹ 0"
                  />
                </div>

                {qTxType === 'credit' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-xs font-bold mb-1">उत्पाद / सामान</label>
                      <input
                        type="text"
                        value={qTxProduct}
                        onChange={(e) => setQTxProduct(e.target.value)}
                        className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="जैसे: चीनी, तेल"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-xs font-bold mb-1">मात्रा (Quantity)</label>
                      <input
                        type="text"
                        value={qTxQuantity}
                        onChange={(e) => setQTxQuantity(e.target.value)}
                        className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="जैसे: 5 किलो"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">टिप्पणी (Optional Notes)</label>
                  <input
                    type="text"
                    value={qTxNotes}
                    onChange={(e) => setQTxNotes(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="कोई अतिरिक्त याद रखने योग्य विवरण"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-3.5 bg-gradient-to-tr from-[#16A34A] to-[#15803d] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-[15px] cursor-pointer shadow-lg shadow-indigo-500/30"
                >
                  {modalLoading ? "सहेजा जा रहा है..." : "खाते में सहेजें"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Dashboard Modal: Quick Stock Adjustment */}
      <AnimatePresence>
        {showQuickStockModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-md w-full border border-white/50 shadow-2xl shadow-indigo-500/10 relative overflow-hidden"
            >
              <button
                onClick={() => setShowQuickStockModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold font-brand-title text-slate-800 mb-4 flex items-center gap-1.5">
                ⚡ त्वरित स्टॉक अपडेट (Quick Stock Entry)
              </h3>

              {modalError && (
                <div className="bg-[#16A34A]/10 text-[#16A34A] border border-rose-200 text-rose-700 p-3 rounded-xl text-xs mb-4">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleQuickStockSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">उत्पाद चुनें (Select Item) *</label>
                  <select
                    required
                    value={qStockProdId}
                    onChange={(e) => setQStockProdId(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  >
                    <option value="">-- उत्पाद चुनें --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.stock} {p.unit} उपलब्ध)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-2">अपडेट प्रकार</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQStockType('in')}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        qStockType === 'in'
                          ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30 text-[#166534] ring-2 ring-[#16A34A]/10"
                          : "bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" /> स्टॉक जोड़ें (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQStockType('out')}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        qStockType === 'out'
                          ? "bg-[#16A34A]/10 text-[#16A34A] border-rose-350 text-rose-800 ring-2 ring-rose-500/10"
                          : "bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <ArrowDown className="w-4 h-4" /> स्टॉक निकालें (-)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">मात्रा (Quantity) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={qStockQty || ""}
                    onChange={(e) => setQStockQty(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-1">विवरण / टिप्पणी</label>
                  <input
                    type="text"
                    value={qStockNotes}
                    onChange={(e) => setQStockNotes(e.target.value)}
                    className="w-full bg-[#F8FAFC]/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="जैसे: थोक खरीद, स्टॉक मिलान, आदि"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-3.5 bg-gradient-to-tr from-[#16A34A] to-[#15803d] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-[15px] cursor-pointer shadow-lg shadow-indigo-500/30"
                >
                  {modalLoading ? "सहेजा जा रहा है..." : "स्टॉक सहेजें"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      

      {/* NEW TAB BAR DESIGN */}
      <div className="tabbar z-50">
        <div className={`tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          <div className="dot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>
          </div>
          Home
        </div>
        
        {user?.businessConfig?.requiresUdhaar !== false && (
          <div className={`tab ${activeTab === "ledger" ? "active" : ""}`} onClick={() => setActiveTab("ledger")}>
            <div className="dot">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z"/><path d="M9 9h7M9 13h7"/></svg>
            </div>
            Khata
          </div>
        )}

        <div className={`tab ${activeTab === "pos" ? "active" : ""}`} onClick={() => setActiveTab("pos")}>
          <div className="dot" style={activeTab === "pos" ? {color: 'var(--gold)'} : {}}>
            {activeTab === "pos" ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--gold)"><circle cx="12" cy="12" r="11"/></svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11"/></svg>
            )}
          </div>
        </div>

        {user?.businessConfig?.requiresInventory !== false && (
          <div className={`tab ${activeTab === "inventory" ? "active" : ""}`} onClick={() => setActiveTab("inventory")}>
            <div className="dot">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3.3 8.5l8.7 5 8.7-5"/><path d="M12 21.5V13"/></svg>
            </div>
            Stock
          </div>
        )}

        <div className={`tab ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
          <div className="dot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
          </div>
          More
        </div>
      </div>
    </div>
  );
}