import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Users, UserPlus, Shield, Activity, ShieldCheck, Trash2, X, Check, Loader2, Briefcase, IndianRupee, TrendingUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Transaction } from "../../types";
import { formatRupees } from "../../utils";

interface StaffTabProps {
  onBack: () => void;
  transactions: Transaction[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  permissions: {
    posAccess: boolean;
    inventoryAccess: boolean;
    deleteAccess: boolean;
  };
  joinDate: string;
}

export default function StaffTab({ onBack, transactions }: StaffTabProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    role: "Cashier",
    permissions: { posAccess: true, inventoryAccess: false, deleteAccess: false }
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("bazaarsync_staff");
    if (saved) {
      setStaffList(JSON.parse(saved));
    } else {
      const defaultStaff: StaffMember[] = [
        {
          id: "1",
          name: "Raju Bhai",
          role: "Cashier",
          permissions: { posAccess: true, inventoryAccess: false, deleteAccess: false },
          joinDate: new Date().toISOString()
        }
      ];
      setStaffList(defaultStaff);
      localStorage.setItem("bazaarsync_staff", JSON.stringify(defaultStaff));
    }
  }, []);

  const saveStaff = (list: StaffMember[]) => {
    setStaffList(list);
    localStorage.setItem("bazaarsync_staff", JSON.stringify(list));
  };

  const handleAddStaff = () => {
    if (!newStaff.name?.trim()) return;
    
    const staff: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name,
      role: newStaff.role || "Cashier",
      permissions: newStaff.permissions || { posAccess: true, inventoryAccess: false, deleteAccess: false },
      joinDate: new Date().toISOString()
    };
    
    saveStaff([...staffList, staff]);
    setNewStaff({ name: "", role: "Cashier", permissions: { posAccess: true, inventoryAccess: false, deleteAccess: false } });
    setShowAddModal(false);
  };

  const handleUpdatePermissions = (id: string, key: keyof StaffMember['permissions']) => {
    const updated = staffList.map(s => {
      if (s.id === id) {
        return { ...s, permissions: { ...s.permissions, [key]: !s.permissions[key] } };
      }
      return s;
    });
    saveStaff(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      saveStaff(staffList.filter(s => s.id !== id));
      if (selectedStaff?.id === id) setSelectedStaff(null);
    }
  };

  // Performance simulation: Since transactions don't strictly have a staffId yet,
  // we deterministically split the shop's total transactions among staff for demo purposes.
  const performanceStats = useMemo(() => {
    const stats: Record<string, { count: number, totalValue: number }> = {};
    staffList.forEach(s => { stats[s.id] = { count: 0, totalValue: 0 }; });
    
    if (staffList.length > 0) {
      transactions.forEach((tx, idx) => {
        // Assign to a staff based on transaction ID or index modulo staff length
        const staffIdx = idx % staffList.length;
        const s = staffList[staffIdx];
        if (s && stats[s.id]) {
          stats[s.id].count += 1;
          stats[s.id].totalValue += tx.amount;
        }
      });
    }
    return stats;
  }, [transactions, staffList]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col pb-safe">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-900 rounded-full hover:bg-gray-50 cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Employee Area</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-100 text-[#15803D] px-3 py-1.5 rounded-full font-bold text-sm hover:bg-emerald-200 transition-colors">
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Top Summary Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Active Team Members</p>
            <h2 className="text-3xl font-extrabold">{staffList.length}</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Staff List */}
        <h3 className="font-bold text-gray-900 text-lg mt-6 mb-2 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#16A34A]" /> Manage Staff
        </h3>
        
        <div className="space-y-3">
          {staffList.map((staff) => (
            <motion.div 
              key={staff.id}
              layout
              className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${selectedStaff?.id === staff.id ? 'border-indigo-500 shadow-md' : 'border-slate-200 hover:border-indigo-300'}`}
            >
              <div 
                className="p-4 flex items-center justify-between"
                onClick={() => setSelectedStaff(selectedStaff?.id === staff.id ? null : staff)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-100">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{staff.name}</h4>
                    <p className="text-xs font-medium text-[#16A34A] bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1">{staff.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex -space-x-1">
                      {staff.permissions.posAccess && <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-white" title="POS Access"><ShieldCheck className="w-3 h-3 text-[#15803D]" /></div>}
                      {staff.permissions.inventoryAccess && <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-white" title="Inventory Access"><PackageIcon className="w-3 h-3 text-blue-700" /></div>}
                      {staff.permissions.deleteAccess && <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center border border-white" title="Delete Access"><Trash2 className="w-3 h-3 text-rose-700" /></div>}
                   </div>
                </div>
              </div>

              {/* Expandable Details Section */}
              <AnimatePresence>
                {selectedStaff?.id === staff.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 bg-[#F8FAFC]"
                  >
                    <div className="p-4 space-y-5">
                      {/* Performance Metrics */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Activity className="w-4 h-4" /> Performance Overview</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 font-medium mb-1">Bills Generated</p>
                            <p className="text-lg font-bold text-gray-900">{performanceStats[staff.id]?.count || 0}</p>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 font-medium mb-1">Revenue Handled</p>
                            <p className="text-lg font-bold text-[#16A34A]">{formatRupees(performanceStats[staff.id]?.totalValue || 0)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Access Controls */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Shield className="w-4 h-4" /> Access & Permissions</h5>
                        <div className="space-y-2">
                          <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                            <div>
                              <p className="font-bold text-sm text-gray-900">Point of Sale (POS)</p>
                              <p className="text-xs text-slate-500">Can create new bills and sales</p>
                            </div>
                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${staff.permissions.posAccess ? 'bg-[#16A34A]/100' : 'bg-slate-300'}`} onClick={() => handleUpdatePermissions(staff.id, 'posAccess')}>
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${staff.permissions.posAccess ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                          </label>
                          <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                            <div>
                              <p className="font-bold text-sm text-gray-900">Inventory Management</p>
                              <p className="text-xs text-slate-500">Can add or edit stock items</p>
                            </div>
                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${staff.permissions.inventoryAccess ? 'bg-[#16A34A]/100' : 'bg-slate-300'}`} onClick={() => handleUpdatePermissions(staff.id, 'inventoryAccess')}>
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${staff.permissions.inventoryAccess ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                          </label>
                          <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                            <div>
                              <p className="font-bold text-sm text-rose-600">Delete Rights</p>
                              <p className="text-xs text-slate-500">Can delete ledgers or products</p>
                            </div>
                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${staff.permissions.deleteAccess ? 'bg-rose-500' : 'bg-slate-300'}`} onClick={() => handleUpdatePermissions(staff.id, 'deleteAccess')}>
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${staff.permissions.deleteAccess ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button onClick={() => handleDelete(staff.id)} className="w-full py-3 bg-rose-50 text-rose-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors">
                          <Trash2 className="w-4 h-4" /> Terminate Staff
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {staffList.length === 0 && (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700">No Staff Members</h3>
              <p className="text-sm text-slate-500 mt-1">Add staff to track their performance.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                <h3 className="text-lg font-bold text-gray-900">Add New Staff</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newStaff.name} 
                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} 
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    placeholder="E.g., Raju Bhai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
                  <select 
                    value={newStaff.role} 
                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} 
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-[#16A34A] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Company Admin">Company Admin</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Staff">Staff</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Partner">Partner</option>
                    <option value="Franchise">Franchise</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddStaff} 
                  disabled={!newStaff.name?.trim()}
                  className="w-full py-3.5 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-5 h-5" /> Save Staff Member
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline replacement for Package icon if it conflicts with lucide
const PackageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
