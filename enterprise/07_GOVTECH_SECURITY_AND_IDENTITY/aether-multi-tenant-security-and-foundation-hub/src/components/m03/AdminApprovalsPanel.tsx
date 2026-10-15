import React, { useState, useEffect } from 'react';
import { Shop, UserProfile, TeamMember } from '../../types/database';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Clock, 
  CreditCard, 
  Store, 
  Building2, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Plus,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';

interface AdminApprovalsPanelProps {
  currentUser: UserProfile;
  currentShop: Shop;
  onSelectShop: (shopId: string) => void;
  onNavigateToDashboard: () => void;
}

export const AdminApprovalsPanel: React.FC<AdminApprovalsPanelProps> = ({
  currentUser,
  currentShop,
  onSelectShop,
  onNavigateToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'internal'>('pending');
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [activeShops, setActiveShops] = useState<Shop[]>([]);
  const [internalShops, setInternalShops] = useState<Shop[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // New shop modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopSlug, setNewShopSlug] = useState('');
  const [isInternalTest, setIsInternalTest] = useState(false);

  // Check if current user email is verified team member
  const [isTeamMember, setIsTeamMember] = useState(false);

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      setActionError(null);
      const res = await fetch(`/api/admin/approvals?email=${encodeURIComponent(currentUser.email)}`);
      
      if (res.ok) {
        const data = await res.json();
        setPendingShops(data.pendingShops || []);
        setActiveShops(data.activeShops || []);
        setInternalShops(data.internalShops || []);
        setIsTeamMember(true);
      } else {
        setIsTeamMember(false);
        const data = await res.json();
        setActionError(data.error || 'Access denied');
      }

      // Fetch team members metadata
      const metaRes = await fetch('/api/internal/test-payments/meta');
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        setTeamMembers(metaData.teamMembers || []);
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalData();
  }, [currentUser.email]);

  const handleApprove = async (shopId: string) => {
    try {
      setActionLoading(shopId);
      setActionError(null);
      const res = await fetch(`/api/admin/approvals/${shopId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: currentUser.email }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage(data.message);
        await fetchApprovalData();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to approve shop');
      }
    } catch (err: any) {
      setActionError(err.message || 'Network error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (shopId: string) => {
    const reason = prompt('Please enter rejection reason:', 'Verification criteria not satisfied');
    if (!reason) return;

    try {
      setActionLoading(shopId);
      setActionError(null);
      const res = await fetch(`/api/admin/approvals/${shopId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: currentUser.email, reason }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionMessage(data.message);
        await fetchApprovalData();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to reject shop');
      }
    } catch (err: any) {
      setActionError(err.message || 'Network error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName || !newShopSlug) return;

    try {
      setActionLoading('create');
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newShopName,
          slug: newShopSlug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          isInternalTest,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewShopName('');
        setNewShopSlug('');
        setIsInternalTest(false);
        setActionMessage('Storefront successfully provisioned. Check status below.');
        await fetchApprovalData();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to create shop');
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to create shop');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  PLATFORM ADMIN GATEWAY
                </span>
                <span className="text-xs font-mono text-zinc-400">/admin/approvals</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                Merchant Approval & Storefront Governance
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Multi-Tenant security approval pipeline. Enforces strict zero-leakage RBAC and verified administrative sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Test Shop</span>
            </button>
            <button
              onClick={fetchApprovalData}
              disabled={loading}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Current Admin Identity Pill */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-zinc-400">Authenticated Admin:</span>
            <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-indigo-300 border border-zinc-700">
              {currentUser.email}
            </span>
            {isTeamMember ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED TEAM MEMBER
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" />
                UNAUTHORIZED EMAIL
              </span>
            )}
          </div>

          <div className="text-[11px] text-zinc-400">
            Approved shops stamped with <code className="text-zinc-300">approved_by</code> and <code className="text-zinc-300">approved_at</code>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approval ({pendingShops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'active'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active Stores ({activeShops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('internal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'internal'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Internal Sandbox Labs ({internalShops.length})</span>
        </button>
      </div>

      {/* Tab Content: Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingShops.length === 0 ? (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">All Clear! No Pending Merchant Stores</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                Every merchant application has been verified. New tenant signups requiring administrative review will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingShops.map((s) => (
                <div
                  key={s.id}
                  className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">{s.name}</h3>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            /{s.slug}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            PENDING_APPROVAL
                          </span>
                          {s.subscription_status === 'ACTIVE' ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              SUBSCRIPTION: ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              SUBSCRIPTION: PENDING
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          {s.address || 'Standard Storefront Address'} • Plan: <span className="capitalize text-zinc-300">{s.plan}</span> • GSTIN: <span className="font-mono text-zinc-300">{s.gstin || 'None'}</span>
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Registered: {new Date(s.created_at).toLocaleString()} • Owner UID: <span className="font-mono">{s.owner_id}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(s.id)}
                        disabled={actionLoading === s.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading === s.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Approve Storefront</span>
                      </button>

                      <button
                        onClick={() => handleReject(s.id)}
                        disabled={actionLoading === s.id}
                        className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectShop(s.id);
                          onNavigateToDashboard();
                        }}
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Active Stores */}
      {activeTab === 'active' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeShops.map((s) => (
              <div
                key={s.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start justify-between gap-3 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.name}</h4>
                    <p className="text-xs font-mono text-zinc-400">/{s.slug}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
                      <span>Approved by: {s.approved_by || 'platform_admin'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectShop(s.id);
                    onNavigateToDashboard();
                  }}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Internal Sandbox Labs */}
      {activeTab === 'internal' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-indigo-300 text-xs flex items-center gap-3">
            <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              Internal Sandbox Labs have <code className="text-white">is_internal_test = true</code>. They bypass subscription payments, auto-activate immediately upon creation, and are strictly invisible to non-team users.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internalShops.map((s) => (
              <div
                key={s.id}
                className="bg-zinc-900 border border-indigo-500/30 rounded-xl p-4 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{s.name}</h4>
                    <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                      INTERNAL TEST
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">/{s.slug}</p>
                  <p className="text-[11px] text-zinc-500 mt-1">UPI: {s.upi_id}</p>
                </div>

                <button
                  onClick={() => {
                    onSelectShop(s.id);
                    onNavigateToDashboard();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  Switch & Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Test Storefront */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                <span>Provision New Storefront</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShop} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Bottle Artisan Cafe"
                  value={newShopName}
                  onChange={(e) => {
                    setNewShopName(e.target.value);
                    if (!newShopSlug) {
                      setNewShopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Slug URL (/s/[slug])</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. blue-bottle-cafe"
                  value={newShopSlug}
                  onChange={(e) => setNewShopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalTest}
                    onChange={(e) => setIsInternalTest(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-zinc-900 border-zinc-700 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-zinc-200">
                    Mark as Internal Test Shop (Auto ACTIVE, bypass payment)
                  </span>
                </label>
                <p className="text-[11px] text-zinc-400 pl-6 leading-relaxed">
                  Internal test shops bypass the subscription & approval pipeline and are only visible to verified team members ({teamMembers.map(t => t.email.split('@')[0]).join(', ')}).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === 'create' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Provision Storefront</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
