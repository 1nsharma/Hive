import React, { useState, useEffect } from 'react';
import { Shop, UserProfile, Order, OrderStatus, StaffRole } from '../../types/database';
import { printThermalKOT } from '../../lib/thermalPrinter';
import { 
  ChefHat, 
  CreditCard, 
  Truck, 
  Crown, 
  Clock, 
  Check, 
  ArrowRight, 
  AlertTriangle, 
  Printer, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  Store,
  CheckCircle2,
  Bell,
  Utensils
} from 'lucide-react';

interface StaffOrdersViewProps {
  currentShop: Shop;
  currentUser: UserProfile;
  initialRole?: StaffRole;
  onNavigateToInvoice?: (orderId: string) => void;
  onBackToDashboard: () => void;
}

export const StaffOrdersView: React.FC<StaffOrdersViewProps> = ({
  currentShop,
  currentUser,
  initialRole = 'kitchen',
  onNavigateToInvoice,
  onBackToDashboard,
}) => {
  const [selectedRole, setSelectedRole] = useState<StaffRole>(initialRole);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchStaffOrders = async () => {
    try {
      const res = await fetch(`/api/dashboard/orders?shopId=${currentShop.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.allLive || []);
      }
    } catch (err) {
      console.error('Failed to load staff orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffOrders();
    const interval = setInterval(fetchStaffOrders, 2500);
    return () => clearInterval(interval);
  }, [currentShop.id]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      setActionError(null);
      setActionSuccess(null);

      const res = await fetch(`/api/dashboard/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          staffRole: selectedRole,
        }),
      });

      if (res.ok) {
        setActionSuccess(`Order updated to ${nextStatus}.`);
        await fetchStaffOrders();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Status update prohibited for role');
      }
    } catch (err: any) {
      setActionError(err.message || 'Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders according to staff role
  const getFilteredOrders = () => {
    if (selectedRole === 'kitchen') {
      // Kitchen only sees active preparation: INCOMING and PREPARING
      return orders.filter(o => o.status === 'INCOMING' || o.status === 'PREPARING');
    }
    if (selectedRole === 'staff') {
      // Dispatch staff runner sees orders that are READY for pickup / table delivery
      return orders.filter(o => o.status === 'READY');
    }
    // Cashier and Owner see all active orders
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="space-y-6">
      {/* Top Header & Role Switcher */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
              STAFF APP / PWA (/staff)
            </span>
            <span className="text-xs font-mono text-zinc-400">{currentShop.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Staff Terminal</span>
            <span className="text-xs font-mono font-normal text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
              Active Role: <span className="uppercase text-amber-400 font-bold">{selectedRole}</span>
            </span>
          </h1>
        </div>

        {/* Role Selector Tabs (Allows test switching between all 4 roles) */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setSelectedRole('kitchen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedRole === 'kitchen' 
                ? 'bg-amber-500 text-zinc-950 shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen (KDS)</span>
          </button>

          <button
            onClick={() => setSelectedRole('cashier')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedRole === 'cashier' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cashier (POS)</span>
          </button>

          <button
            onClick={() => setSelectedRole('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedRole === 'staff' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Runner (Dispatch)</span>
          </button>

          <button
            onClick={() => setSelectedRole('owner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedRole === 'owner' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Owner</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Role explanation banner */}
      <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          {selectedRole === 'kitchen' && (
            <span>
              <strong>Kitchen Display Mode:</strong> Only shows active cooking orders. You can strictly transition orders from <code className="text-amber-300 font-mono">INCOMING → PREPARING → READY</code>. Skipping statuses or changing payment is blocked by Cloud Run server logic.
            </span>
          )}
          {selectedRole === 'cashier' && (
            <span>
              <strong>Cashier Register Mode:</strong> You can inspect manual UPI proofs, print 58mm KOT thermal receipts with barcodes, and download GST tax invoices.
            </span>
          )}
          {selectedRole === 'staff' && (
            <span>
              <strong>Runner Dispatch Mode:</strong> Shows orders freshly marked <code className="text-emerald-300 font-mono">READY</code> for delivery to tables or customer handoff.
            </span>
          )}
          {selectedRole === 'owner' && (
            <span>
              <strong>Owner Admin Mode:</strong> Complete unrestricted operational authority.
            </span>
          )}
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-xs text-zinc-400 hover:text-white underline whitespace-nowrap cursor-pointer"
        >
          Exit to Dashboard
        </button>
      </div>

      {/* Live Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center">
          <Utensils className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Active Orders for {selectedRole.toUpperCase()}</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
            New customer orders placed via the public QR menu (/s/{currentShop.slug}) will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const isIncoming = order.status === 'INCOMING';
            const isPreparing = order.status === 'PREPARING';
            const isReady = order.status === 'READY';

            return (
              <div
                key={order.id}
                className={`bg-zinc-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                  isIncoming
                    ? 'border-amber-500/50 shadow-amber-500/5'
                    : isPreparing
                    ? 'border-blue-500/40 shadow-blue-500/5'
                    : 'border-emerald-500/50 shadow-emerald-500/5'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black font-mono text-white tracking-wider">
                        #{order.token}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isIncoming
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : isPreparing
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-zinc-300">
                        {order.mode === 'DINE_IN' ? (order.table_number || 'Dine-In') : order.mode}
                      </span>
                      <p className="text-[10px] text-zinc-500">
                        Wait: {order.estimated_wait_mins || 12}m
                      </p>
                    </div>
                  </div>

                  {/* Customer line */}
                  <div className="py-2 text-xs text-zinc-400 flex items-center justify-between">
                    <span>{order.customer_name || 'Guest Customer'}</span>
                    <span className="font-mono text-zinc-300">${(order.total_cents / 100).toFixed(2)}</span>
                  </div>

                  {/* Items List */}
                  <div className="py-3 border-t border-zinc-800/80 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex items-start justify-between font-medium text-zinc-200">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-zinc-800 text-amber-400 text-center leading-5 font-bold text-[11px]">
                              {item.quantity}×
                            </span>
                            <span>{item.name}</span>
                          </span>
                        </div>
                        {item.selected_add_ons?.length > 0 && (
                          <p className="text-[11px] text-zinc-400 pl-6">
                            + {item.selected_add_ons.map(a => a.name).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-amber-300/90 pl-6 italic font-mono mt-0.5">
                            Note: "{item.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Specific Actions */}
                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  {/* KITCHEN ACTIONS: Can strictly transition INCOMING -> PREPARING -> READY */}
                  {selectedRole === 'kitchen' && (
                    <>
                      {isIncoming && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          disabled={updatingId === order.id}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {updatingId === order.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChefHat className="w-4 h-4" />}
                          <span>Start Preparing</span>
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'READY')}
                          disabled={updatingId === order.id}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {updatingId === order.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          <span>Mark Ready for Pickup</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* CASHIER ACTIONS */}
                  {(selectedRole === 'cashier' || selectedRole === 'owner') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => printThermalKOT(order, currentShop)}
                        className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-zinc-400" />
                        <span>58mm KOT</span>
                      </button>

                      {onNavigateToInvoice && (
                        <button
                          onClick={() => onNavigateToInvoice(order.id)}
                          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>GST Bill</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* STAFF / RUNNER ACTIONS */}
                  {(selectedRole === 'staff' || selectedRole === 'owner') && isReady && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      disabled={updatingId === order.id}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {updatingId === order.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Hand Off to Customer / Table</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
