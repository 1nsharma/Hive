import React, { useState, useEffect, useRef } from 'react';
import { Shop, UserProfile, Order, OrderStatus, MenuItem, FraudReview, StaffRole } from '../../types/database';
import { notificationService } from '../../lib/notificationAudio';
import { printThermalKOT } from '../../lib/thermalPrinter';
import { printA4Poster } from '../../lib/printableA4Poster';
import { WaitingApprovalBanner } from '../m03/WaitingApprovalBanner';
import { StaffControlPanel } from '../m03/StaffControlPanel';
import { AIBoostBanner } from '../m03/AIBoostBanner';
import { AISupportBotDrawer } from '../m03/AISupportBotDrawer';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Radio, 
  Bell, 
  Printer, 
  Check, 
  Clock, 
  Utensils, 
  QrCode, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Lock, 
  Search, 
  FileText,
  Volume2,
  Share2,
  Copy,
  ChevronRight,
  ShieldAlert,
  XCircle,
  Eye,
  ShieldCheck,
  Users
} from 'lucide-react';

interface MerchantDashboardProps {
  currentShop: Shop;
  currentUser: UserProfile;
  isShopOwner: boolean;
  isStaff: boolean;
  onOpenPublicMenu: (slug: string) => void;
  onOpenOrderTracking: (orderId: string) => void;
  onOpenAdminApprovals?: () => void;
  onOpenStaffPortal?: (role?: StaffRole) => void;
  onRefreshShop?: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  currentShop,
  currentUser,
  isShopOwner,
  isStaff,
  onOpenPublicMenu,
  onOpenOrderTracking,
  onOpenAdminApprovals,
  onOpenStaffPortal,
  onRefreshShop,
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'menu' | 'qrcode' | 'fraud' | 'staff'>('board');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [fraudReviews, setFraudReviews] = useState<FraudReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [boardLoading, setBoardLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  
  // Notification states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  
  // Menu management state
  const [isAddingDish, setIsAddingDish] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishCategory, setNewDishCategory] = useState<string>('Superfood Bowls');
  const [newDishDesc, setNewDishDesc] = useState<string>('');
  const [newDishPrice, setNewDishPrice] = useState<string>('12.00');
  const [newDishIsVeg, setNewDishIsVeg] = useState<boolean>(true);
  const [newDishPhotoUrl, setNewDishPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Keep track of previous incoming order IDs to detect NEW arrivals (MRC-06)
  const prevIncomingIdsRef = useRef<Set<string>>(new Set());

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Fetch live orders for realtime board
  const fetchLiveOrders = async (silent = false) => {
    if (!silent) setBoardLoading(true);
    try {
      const res = await fetch(`/api/dashboard/orders?shopId=${currentShop.id}`);
      if (res.ok) {
        const data = await res.json();
        const liveOrders: Order[] = data.allLive || [];

        // Check for newly arrived INCOMING orders (MRC-06)
        const incomingOrders = liveOrders.filter(o => o.status === 'INCOMING');
        const currentIncomingIds = new Set(incomingOrders.map(o => o.id));

        // If not initial load and a new order ID appeared
        if (prevIncomingIdsRef.current.size > 0) {
          const hasNewOrder = incomingOrders.some(o => !prevIncomingIdsRef.current.has(o.id));
          if (hasNewOrder) {
            const newest = incomingOrders.find(o => !prevIncomingIdsRef.current.has(o.id));
            if (soundEnabled) {
              notificationService.playOrderChime();
            }
            if (newest) {
              notificationService.showOrderNotification(
                newest.token,
                newest.mode,
                `$${(newest.total_cents / 100).toFixed(2)}`
              );
            }
          }
        }

        prevIncomingIdsRef.current = currentIncomingIds;
        setOrders(liveOrders);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch live orders:', err);
    } finally {
      if (!silent) setBoardLoading(false);
      setLoading(false);
    }
  };

  // Fetch menu items for toggle
  const fetchMenu = async () => {
    try {
      const res = await fetch(`/api/public/shop/${currentShop.slug}/menu`);
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  // Fetch fraud reviews (RSK-08)
  const fetchFraudReviews = async () => {
    try {
      const res = await fetch(`/api/dashboard/fraud-reviews?shopId=${currentShop.id}`);
      if (res.ok) {
        const data = await res.json();
        setFraudReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch fraud reviews:', err);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
    fetchMenu();
    fetchFraudReviews();

    // Realtime polling every 2.5 seconds (simulates Firestore collection listener)
    const interval = setInterval(() => {
      fetchLiveOrders(true);
      fetchFraudReviews();
    }, 2500);

    return () => clearInterval(interval);
  }, [currentShop.id, currentShop.slug]);

  // Handle fraud review merchant action (Confirm Paid or Reject Fraud)
  const handleFraudReviewAction = async (review: FraudReview, action: 'CONFIRM' | 'REJECT') => {
    try {
      setActionError(null);
      const res = await fetch('/api/dashboard/fraud-reviews/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          orderId: review.order_id,
          paymentId: review.payment_id,
          action,
          notes: action === 'CONFIRM' ? 'Merchant verified payment receipt' : 'Flagged as fraudulent transaction',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(
        action === 'CONFIRM'
          ? `Order ${review.order_token || review.order_id} verified and moved to Preparation queue!`
          : `Order ${review.order_token || review.order_id} rejected and cancelled as Fraud.`
      );
      setTimeout(() => setActionSuccess(null), 3500);
      fetchFraudReviews();
      fetchLiveOrders(true);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Handle order status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setActionError(null);
      const res = await fetch(`/api/dashboard/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(`Order updated to ${newStatus}. Cloud SQL & Firestore synchronized.`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchLiveOrders(true);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Handle instant menu availability toggle
  const handleToggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      const nextAvailability = !currentAvailability;
      const res = await fetch(`/api/dashboard/menu/${itemId}/toggle-availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: currentShop.id,
          isAvailable: nextAvailability,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Local state update
      setMenuItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, is_available: nextAvailability } : i))
      );

      setActionSuccess(`Availability for "${data.item.name}" updated instantly in Cloud SQL.`);
      setTimeout(() => setActionSuccess(null), 2500);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Handle Cloud Storage photo upload simulation
  const handleUploadDishPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const res = await fetch('/api/dashboard/upload-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: currentShop.id,
          filename: file.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewDishPhotoUrl(data.publicUrl);
      setActionSuccess(`Uploaded photo to Cloud Storage: ${data.storageUri}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle add new dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dashboard/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: currentShop.id,
          name: newDishName,
          category: newDishCategory,
          description: newDishDesc,
          photoUrl: newDishPhotoUrl,
          priceCents: Math.round(parseFloat(newDishPrice) * 100),
          isVeg: newDishIsVeg,
          addOns: [
            { id: `ao-${Date.now()}-1`, name: 'Special Sauce / Dip', price_cents: 100 },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsAddingDish(false);
      setNewDishName('');
      setNewDishDesc('');
      setActionSuccess(`Dish "${data.name}" published to Cloud SQL menu!`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchMenu();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Print A4 Standee Handler
  const handlePrintA4Standee = () => {
    const canvas = document.getElementById('shop-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      printA4Poster(currentShop.name, currentShop.slug, dataUrl);
    }
  };

  // Filter 3 columns
  const incoming = orders.filter(o => o.status === 'INCOMING');
  const preparing = orders.filter(o => o.status === 'PREPARING');
  const ready = orders.filter(o => o.status === 'READY');

  const menuUrl = typeof window !== 'undefined' ? `${window.location.origin}/s/${currentShop.slug}` : `/s/${currentShop.slug}`;

  // Requirement A: Merchant Approval Flow Gate
  const isTeamMember = currentUser.email.toLowerCase() === 'amitsharma99976@gmail.com' || currentUser.email.includes('admin') || currentUser.system_role === 'super_admin';
  const isShopApproved = currentShop.status === 'ACTIVE' || currentShop.status === 'active' || Boolean(currentShop.is_internal_test);

  if (!isShopApproved) {
    return (
      <div className="space-y-6">
        <WaitingApprovalBanner
          shop={currentShop}
          currentUser={currentUser}
          isTeamMember={isTeamMember}
          onRefreshShop={() => {
            if (onRefreshShop) onRefreshShop();
            fetchLiveOrders();
          }}
          onOpenAdminApprovals={onOpenAdminApprovals}
        />
        <AISupportBotDrawer currentShop={currentShop} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Requirement E: AI Boost Intelligence Banner */}
      <AIBoostBanner currentShop={currentShop} />

      {/* Top Banner / Dashboard Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base font-bold text-zinc-100 tracking-tight">
                {currentShop.name} · Merchant Control Dashboard
              </h2>
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Firestore Realtime Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Live Order Board (MRC-03), KOT 58mm Thermal Printing (MRC-05), Instant Menu Toggles, and QR Posters (ORD-01).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Audio Chime Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) notificationService.playOrderChime();
              }}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                soundEnabled
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
              title="Toggle audio alert chime on incoming orders"
            >
              <Volume2 className={`h-3.5 w-3.5 ${soundEnabled ? 'text-indigo-400' : 'text-zinc-600'}`} />
              <span>{soundEnabled ? 'Audio Chime ON' : 'Muted'}</span>
            </button>

            {/* Test Audio Button */}
            <button
              onClick={() => notificationService.playOrderChime()}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono"
            >
              Test Bell
            </button>

            {/* Browser Notification Button */}
            {notificationPermission !== 'granted' && (
              <button
                onClick={async () => {
                  const granted = await notificationService.requestNotificationPermission();
                  if (granted) setNotificationPermission('granted');
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5"
              >
                <Bell className="h-3.5 w-3.5" />
                <span>Enable Desktop Alerts</span>
              </button>
            )}

            {/* View Customer QR Menu */}
            <button
              onClick={() => onOpenPublicMenu(currentShop.slug)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Customer QR Menu ➔</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'board'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-indigo-400" />
            <span>Realtime Order Board ({orders.length} Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Utensils className="h-3.5 w-3.5 text-emerald-400" />
            <span>Menu & Instant Toggles ({menuItems.length} Dishes)</span>
          </button>

          <button
            onClick={() => setActiveTab('qrcode')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'qrcode'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <QrCode className="h-3.5 w-3.5 text-amber-400" />
            <span>QR Code & A4 Printable Standee</span>
          </button>

          <button
            onClick={() => setActiveTab('fraud')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fraud'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>
              Fraud Review Queue ({fraudReviews.filter(r => r.status === 'PENDING').length} Pending)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span>Staff & Roles (MRC-04)</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* TAB 1: Realtime Order Board (MRC-03, MRC-05, MRC-06) */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-500">Firestore Collection:</span>
              <code className="text-zinc-300 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                shop_{currentShop.id}_live_orders
              </code>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Synced: {lastSyncTime.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* 3-Column Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: INCOMING */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex flex-col">
              <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/60 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                    Incoming ({incoming.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Needs Action
                </span>
              </div>

              <div className="p-3 space-y-3 flex-1 min-h-[350px] overflow-y-auto max-h-[600px]">
                {incoming.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-zinc-600">
                    No new orders pending
                  </div>
                ) : (
                  incoming.map((order) => (
                    <div
                      key={order.id}
                      className="bg-zinc-950 border border-amber-500/40 rounded-xl p-3.5 shadow-md space-y-3 relative overflow-hidden"
                    >
                      {/* Token and Mode Banner */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-2xl font-black font-mono text-amber-300">
                            {order.token}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-medium">
                            {order.mode === 'DINE_IN'
                              ? `Dine-In · ${order.table_number}`
                              : order.mode === 'PARCEL'
                              ? `Takeaway · ${order.customer_name}`
                              : `Counter Token`}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-xs text-zinc-100">
                            ${(order.total_cents / 100).toFixed(2)}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 pt-1 border-t border-zinc-900 text-xs">
                        {order.items.map((itm, i) => (
                          <div key={i} className="text-zinc-300">
                            <span className="font-bold text-amber-300/90">{itm.quantity}x</span>{' '}
                            <span>{itm.name}</span>
                            {itm.selected_add_ons?.length > 0 && (
                              <div className="text-[10px] text-zinc-500 pl-4">
                                {itm.selected_add_ons.map(a => `+ ${a.name}`).join(', ')}
                              </div>
                            )}
                            {itm.notes && (
                              <div className="text-[10px] text-indigo-400 font-mono pl-4">
                                NOTE: {itm.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                        <button
                          onClick={() => printThermalKOT(order, currentShop.name)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] flex items-center gap-1"
                          title="Print 58mm Thermal KOT"
                        >
                          <Printer className="h-3 w-3" />
                          <span>KOT</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>Accept & Prepare</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: PREPARING */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex flex-col">
              <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/60 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse" />
                  <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                    Preparing ({preparing.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Kitchen Active
                </span>
              </div>

              <div className="p-3 space-y-3 flex-1 min-h-[350px] overflow-y-auto max-h-[600px]">
                {preparing.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-zinc-600">
                    No items in preparation
                  </div>
                ) : (
                  preparing.map((order) => (
                    <div
                      key={order.id}
                      className="bg-zinc-950 border border-indigo-500/30 rounded-xl p-3.5 shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-2xl font-black font-mono text-indigo-300">
                            {order.token}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-medium">
                            {order.mode === 'DINE_IN'
                              ? `Dine-In · ${order.table_number}`
                              : order.mode === 'PARCEL'
                              ? `Takeaway · ${order.customer_name}`
                              : `Counter Token`}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-xs text-zinc-100">
                            ${(order.total_cents / 100).toFixed(2)}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-zinc-900 text-xs">
                        {order.items.map((itm, i) => (
                          <div key={i} className="text-zinc-300">
                            <span className="font-bold text-indigo-300">{itm.quantity}x</span>{' '}
                            <span>{itm.name}</span>
                            {itm.selected_add_ons?.length > 0 && (
                              <div className="text-[10px] text-zinc-500 pl-4">
                                {itm.selected_add_ons.map(a => `+ ${a.name}`).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                        <button
                          onClick={() => printThermalKOT(order, currentShop.name)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          <span>KOT</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(order.id, 'READY')}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>Mark Ready</span>
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: READY */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex flex-col">
              <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/60 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                    Ready for Pickup ({ready.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready to Serve
                </span>
              </div>

              <div className="p-3 space-y-3 flex-1 min-h-[350px] overflow-y-auto max-h-[600px]">
                {ready.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-zinc-600">
                    No orders waiting for pickup
                  </div>
                ) : (
                  ready.map((order) => (
                    <div
                      key={order.id}
                      className="bg-zinc-950 border border-emerald-500/40 rounded-xl p-3.5 shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-2xl font-black font-mono text-emerald-300">
                            {order.token}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-medium">
                            {order.mode === 'DINE_IN'
                              ? `Table ${order.table_number}`
                              : order.mode === 'PARCEL'
                              ? `Takeaway · ${order.customer_name}`
                              : `Counter Token`}
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenOrderTracking(order.id)}
                          className="text-[10px] font-mono text-indigo-400 hover:underline"
                        >
                          Customer View ➔
                        </button>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-zinc-900 text-xs">
                        {order.items.map((itm, i) => (
                          <div key={i} className="text-zinc-300">
                            <span className="font-bold text-emerald-400">{itm.quantity}x</span>{' '}
                            <span>{itm.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                        <button
                          onClick={() => printThermalKOT(order, currentShop.name)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-zinc-700"
                        >
                          <span>Complete & Fulfill</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Menu & Instant Toggles (MRC-02) */}
      {activeTab === 'menu' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Menu Items & Instant Stock Toggles
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Toggle dish availability in real time. Items marked Sold Out are instantly disabled on the public QR menu.
              </p>
            </div>

            <button
              onClick={() => setIsAddingDish(true)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Dishes Table with instant toggle switch */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-3">Photo</th>
                    <th className="py-2.5 px-3">Item Details</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Dietary</th>
                    <th className="py-2.5 px-3 text-right">Instant Availability (Toggle)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-850/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="h-12 w-12 rounded-lg bg-zinc-950 overflow-hidden border border-zinc-800">
                          <img
                            src={item.photo_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-zinc-100">{item.name}</div>
                        <div className="text-[11px] text-zinc-400 line-clamp-1">{item.description}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-zinc-200">
                        ${(item.price_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            item.is_veg ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${item.is_veg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{item.is_veg ? 'Vegetarian' : 'Non-Veg'}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item.id, item.is_available)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            item.is_available ? 'bg-emerald-600' : 'bg-zinc-800'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.is_available ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <div className="text-[10px] font-mono mt-0.5">
                          {item.is_available ? (
                            <span className="text-emerald-400">Available</span>
                          ) : (
                            <span className="text-rose-400">Sold Out</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Dish Modal */}
          {isAddingDish && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateDish}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-5 text-xs space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-100">Add New Dish to Cloud SQL Menu</h3>
                  <button type="button" onClick={() => setIsAddingDish(false)} className="text-zinc-400 hover:text-zinc-200">
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Dish Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Truffle Avocado Melt"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={newDishCategory}
                      onChange={(e) => setNewDishCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newDishPrice}
                      onChange={(e) => setNewDishPrice(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    placeholder="Describe fresh ingredients and culinary preparation..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Cloud Storage Photo Upload */}
                <div>
                  <label className="block text-zinc-400 mb-1">
                    Dish Photo (Cloud Storage Bucket Upload)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadDishPhoto}
                      className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
                    />
                    {uploadingPhoto && <span className="text-[11px] text-indigo-400">Uploading to Cloud Storage...</span>}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-zinc-500 truncate">
                    Storage URL: {newDishPhotoUrl}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={newDishIsVeg}
                      onChange={() => setNewDishIsVeg(true)}
                      className="accent-emerald-500"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={!newDishIsVeg}
                      onChange={() => setNewDishIsVeg(false)}
                      className="accent-rose-500"
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDish(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                  >
                    Publish to Menu
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QR Code & Printable Standee (ORD-01) */}
      {activeTab === 'qrcode' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Live QR Code with qrcode.react */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center justify-center gap-2">
                <QrCode className="h-4 w-4 text-amber-400" />
                <span>Shop QR Code (ORD-01)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Customers scan this QR code with their mobile device camera to open the instant digital menu.
              </p>

              {/* QR Canvas rendered via qrcode.react */}
              <div className="my-6 p-4 bg-white rounded-2xl inline-block shadow-xl border-4 border-zinc-800">
                <QRCodeCanvas
                  id="shop-qr-canvas"
                  value={menuUrl}
                  size={200}
                  level="H"
                  marginSize={2}
                />
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 font-mono text-xs text-zinc-300 flex items-center justify-between gap-2 max-w-sm mx-auto">
                <span className="truncate">{menuUrl}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(menuUrl)}
                  className="text-zinc-400 hover:text-zinc-200 p-1"
                  title="Copy Link"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 w-full flex flex-col sm:flex-row gap-2">
              <button
                onClick={handlePrintA4Standee}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="h-4 w-4" />
                <span>Print A4 Tent Card / Standee</span>
              </button>

              <button
                onClick={() => onOpenPublicMenu(currentShop.slug)}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open Menu</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Print Spec & Standee Information */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between text-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Printer className="h-4 w-4 text-indigo-400" />
                <span>Printing & Hardware Specifications</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Pre-configured for standard restaurant table cards and thermal receipt printers:
              </p>

              <div className="mt-4 space-y-3">
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-zinc-200">58mm Thermal Kitchen Printer (MRC-05)</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    Generates compact 58mm POS receipt layout with prominent token number (<code className="text-indigo-300 font-mono">K-XX</code>), 
                    order mode, items, customized add-ons, cooking notes, and tear line.
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-zinc-200">Printable A4 Table Standee (ORD-01)</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    Generates high-resolution A4 portrait poster with scan instructions and tent-card folding lines.
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                  <div className="font-semibold text-zinc-200">GCP Cloud Storage Dish Photos</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    Uploads high-definition food photography to <code className="text-zinc-300 font-mono">gs://aether-dishes-prod</code> and 
                    distributes via Google Cloud CDN public URLs.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-indigo-300 text-[11px]">
              Ready for production deployment on Google Cloud Run with Cloud SQL PostgreSQL.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Fraud Review Queue & Risk Engine (RSK-08) */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
            <div>
              <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>Suspicious Payment & Fraud Review Queue (RSK-08)</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Multi-tenant payment risk engine flags duplicate UTRs, amount discrepancies, and rapid velocities before kitchen dispatch.
              </p>
            </div>

            <button
              onClick={fetchFraudReviews}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors self-start sm:self-auto"
            >
              Refresh Queue ({fraudReviews.length})
            </button>
          </div>

          {fraudReviews.length === 0 ? (
            <div className="py-12 bg-zinc-900/40 border border-zinc-800 rounded-xl text-center space-y-2">
              <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-zinc-200">No Flagged or Suspicious Payments</div>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                All incoming transactions have passed risk score evaluation and idempotency checks.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {fraudReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-zinc-900 border rounded-xl p-4 transition-all space-y-3 ${
                    rev.status === 'PENDING'
                      ? 'border-rose-500/40 bg-zinc-900/90 shadow-md'
                      : rev.status === 'CONFIRMED'
                      ? 'border-emerald-500/30 bg-zinc-900/40 opacity-75'
                      : 'border-zinc-800 bg-zinc-900/30 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-mono font-black text-white">
                        {rev.order_token || 'Token'}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Order #{rev.order_id}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          rev.status === 'PENDING'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : rev.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-zinc-100">
                          Claimed: ${(rev.amount_cents / 100).toFixed(2)}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          Due: ${(rev.order_total_cents / 100).toFixed(2)}
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-center min-w-[70px]">
                        <div className="text-[10px] font-mono text-zinc-500">Risk Score</div>
                        <div
                          className={`text-xs font-mono font-bold ${
                            rev.risk_score >= 70
                              ? 'text-rose-400'
                              : rev.risk_score >= 40
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {rev.risk_score} / 100
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flagged Reasons & Provider Ref */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[11px] font-mono text-zinc-400 mb-1">
                        Flagged Reasons:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {rev.reasons.map((reason, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30"
                          >
                            ⚠ {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono text-zinc-400 mb-1">
                        Transaction Ref / UTR:
                      </div>
                      <code className="text-xs font-mono text-indigo-300 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 inline-block">
                        {rev.provider_ref || 'NO_REF_PROVIDED'}
                      </code>
                    </div>
                  </div>

                  {/* Merchant Actions for Pending items */}
                  {rev.status === 'PENDING' && (
                    <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenOrderTracking(rev.order_id)}
                        className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect Customer Tracker</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFraudReviewAction(rev, 'REJECT')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-rose-950/60 hover:text-rose-300 text-zinc-300 text-xs font-medium transition-colors border border-zinc-750 flex items-center gap-1.5"
                        >
                          <XCircle className="h-3.5 w-3.5 text-rose-400" />
                          <span>Mark Fraud (Cancel Order)</span>
                        </button>

                        <button
                          onClick={() => handleFraudReviewAction(rev, 'CONFIRM')}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Confirm Paid (Move to Prep)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Staff Control & Roles (MRC-04) */}
      {activeTab === 'staff' && (
        <StaffControlPanel
          currentShop={currentShop}
          currentUser={currentUser}
          isShopOwner={isShopOwner}
          onOpenStaffPortal={onOpenStaffPortal}
        />
      )}

      {/* Floating AI Support Bot */}
      <AISupportBotDrawer currentShop={currentShop} />
    </div>
  );
};
