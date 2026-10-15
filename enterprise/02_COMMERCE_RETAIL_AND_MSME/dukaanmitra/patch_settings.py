import re
with open("src/components/SettingsTab.tsx", "w") as f:
    f.write("""import { useState, useEffect } from "react";
import { User, Users, CreditCard, MessageCircle, Bell, DownloadCloud, HelpCircle, Info, ChevronRight, LogOut, X, Loader2, CheckCircle2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SettingsTabProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

type ModalType = "profile" | "staff" | "billing" | "notifications" | "backup" | "help" | "about" | null;

export default function SettingsTab({ onLogout, onNavigate }: SettingsTabProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile State
  const [shopName, setShopName] = useState("My Shop");
  const [ownerName, setOwnerName] = useState("Amit Sharma");
  const [phone, setPhone] = useState("9876543210");

  // Staff State
  const [staffList, setStaffList] = useState([{ id: 1, name: "Raju", role: "Cashier" }]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Cashier");

  // Notifications State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Clear messages when modal changes
  useEffect(() => {
    setError("");
    setSuccess("");
    setLoading(false);
  }, [activeModal]);

  const handleSaveProfile = async () => {
    if (!shopName.trim() || !ownerName.trim() || !phone.trim()) {
      setError("Please fill all fields");
      return;
    }
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate random failure (10% chance) for edge case handling demonstration
      if (Math.random() < 0.1) throw new Error("Network timeout while saving");
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => setActiveModal(null), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaffName.trim()) {
      setError("Staff name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStaffList([...staffList, { id: Date.now(), name: newStaffName, role: newStaffRole }]);
      setNewStaffName("");
      setSuccess("Staff added successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStaff = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStaffList(staffList.filter(s => s.id !== id));
      setSuccess("Staff removed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to remove staff");
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess("Backup exported successfully to your downloads folder!");
    } catch (err) {
      setError("Backup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const settingItems = [
    { icon: User, label: "Shop Profile", id: "profile" as ModalType },
    { icon: Users, label: "Staff Management", id: "staff" as ModalType },
    { icon: CreditCard, label: "Billing & Subscription", id: "billing" as ModalType },
    { icon: MessageCircle, label: "WhatsApp Settings", id: "whatsapp" as any },
    { icon: Bell, label: "Notifications", id: "notifications" as ModalType },
    { icon: DownloadCloud, label: "Backup & Export", id: "backup" as ModalType },
    { icon: HelpCircle, label: "Help & Support", id: "help" as ModalType },
    { icon: Info, label: "About DukaanMitra", id: "about" as ModalType },
  ];

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 relative">
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="mt-4 bg-white border-y border-gray-100">
        {settingItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.id}>
              <button 
                onClick={() => {
                  if (item.id === "whatsapp") {
                    onNavigate("whatsapp_connection");
                  } else {
                    setActiveModal(item.id);
                  }
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                disabled={activeModal !== null}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900 font-medium text-sm">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              {index < settingItems.length - 1 && (
                <div className="h-px bg-gray-50 ml-12"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 px-4">
        <button 
          onClick={onLogout}
          className="w-full py-3.5 bg-rose-50 text-rose-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-100 disabled:opacity-50"
          disabled={activeModal !== null}
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                <h3 className="text-lg font-bold text-gray-900">
                  {settingItems.find(i => i.id === activeModal)?.label}
                </h3>
                <button 
                  onClick={() => !loading && setActiveModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                {/* Status Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 bg-rose-50 text-rose-600 p-3 rounded-xl flex items-start gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 bg-emerald-50 text-emerald-600 p-3 rounded-xl flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Profile Modal */}
                {activeModal === "profile" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                      <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} disabled={loading} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                      <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} disabled={loading} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50" />
                    </div>
                    <button onClick={handleSaveProfile} disabled={loading} className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 mt-6 disabled:bg-emerald-400">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                    </button>
                  </div>
                )}

                {/* Staff Modal */}
                {activeModal === "staff" && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-900 text-sm">Add New Staff</h4>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Staff Name" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} disabled={loading} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                        <select value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)} disabled={loading} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                          <option value="Cashier">Cashier</option>
                          <option value="Manager">Manager</option>
                          <option value="Helper">Helper</option>
                        </select>
                      </div>
                      <button onClick={handleAddStaff} disabled={loading} className="w-full py-2 bg-emerald-100 text-emerald-700 font-bold rounded-lg hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Current Staff</h4>
                      {staffList.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No staff added yet.</p>
                      ) : (
                        staffList.map(staff => (
                          <div key={staff.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{staff.name}</p>
                              <p className="text-xs text-gray-500">{staff.role}</p>
                            </div>
                            <button onClick={() => handleRemoveStaff(staff.id)} disabled={loading} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Billing Modal */}
                {activeModal === "billing" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-emerald-100 text-sm font-medium">Current Plan</p>
                          <h3 className="text-2xl font-bold mt-1">Free Tier</h3>
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                      </div>
                      <p className="text-emerald-100 text-sm">You have used 45/100 free AI credits this month.</p>
                    </div>

                    <div className="border border-emerald-100 bg-emerald-50 rounded-2xl p-5">
                      <h4 className="font-bold text-gray-900 mb-2">Upgrade to Pro</h4>
                      <ul className="space-y-2 mb-4 text-sm text-gray-600">
                        <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited AI Credits</li>
                        <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> WhatsApp Auto-Reply</li>
                        <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-device Sync</li>
                      </ul>
                      <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                        Upgrade at ₹499/mo
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Modal */}
                {activeModal === "notifications" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-xs text-gray-500 mt-1">Get alerts for new WhatsApp orders</p>
                      </div>
                      <button 
                        onClick={() => setPushEnabled(!pushEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${pushEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <span className={`w-5 h-5 bg-white rounded-full absolute transition-transform shadow-sm ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Daily SMS Reports</h4>
                        <p className="text-xs text-gray-500 mt-1">Receive daily sales summary via SMS</p>
                      </div>
                      <button 
                        onClick={() => setSmsEnabled(!smsEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${smsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <span className={`w-5 h-5 bg-white rounded-full absolute transition-transform shadow-sm ${smsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Backup Modal */}
                {activeModal === "backup" && (
                  <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DownloadCloud className="w-10 h-10 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Export Your Data</h4>
                      <p className="text-sm text-gray-500 mt-2 px-4">
                        Download a complete copy of your inventory, ledger, and transactions in CSV/Excel format.
                      </p>
                    </div>
                    <button onClick={handleExportBackup} disabled={loading} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-6">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Preparing Export...
                        </>
                      ) : (
                        "Generate Backup File"
                      )}
                    </button>
                  </div>
                )}

                {/* Help Modal */}
                {activeModal === "help" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <h4 className="font-bold text-emerald-900 flex gap-2 items-center"><MessageCircle className="w-5 h-5" /> Chat Support</h4>
                      <p className="text-sm text-emerald-700 mt-2 mb-3">Our team is available from 9 AM to 8 PM daily.</p>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold w-full hover:bg-emerald-700 transition-colors cursor-pointer">Start Chat</button>
                    </div>
                    
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h5 className="font-medium text-gray-900 text-sm">How to add stock?</h5>
                        <p className="text-xs text-gray-500 mt-1">Go to Inventory tab and tap the + button at the bottom.</p>
                      </div>
                      <div className="p-4 border-b border-gray-100">
                        <h5 className="font-medium text-gray-900 text-sm">How AI Munim works?</h5>
                        <p className="text-xs text-gray-500 mt-1">Use the mic button or type in natural language to record sales, e.g. "Sold 2 milk for ₹60".</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* About Modal */}
                {activeModal === "about" && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white font-bold text-2xl">DM</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">DukaanMitra</h3>
                    <p className="text-gray-500 text-sm mt-1">Version 1.0.0 (Build 42)</p>
                    <p className="text-gray-400 text-xs mt-6 px-8 leading-relaxed">
                      Made with ❤️ in India.<br />
                      Empowering local businesses with simple technology.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
""")
