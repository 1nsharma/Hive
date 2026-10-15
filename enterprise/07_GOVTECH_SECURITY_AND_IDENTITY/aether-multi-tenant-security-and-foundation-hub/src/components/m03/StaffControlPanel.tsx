import React, { useState, useEffect } from 'react';
import { Shop, UserProfile, StaffMembership, StaffRole } from '../../types/database';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield, 
  Trash2, 
  Check, 
  Copy, 
  AlertCircle, 
  CheckCircle2, 
  ChefHat, 
  CreditCard, 
  Truck, 
  Crown,
  RefreshCw,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface StaffControlPanelProps {
  currentShop: Shop;
  currentUser: UserProfile;
  isShopOwner: boolean;
  onOpenStaffPortal?: (role?: StaffRole) => void;
}

export const StaffControlPanel: React.FC<StaffControlPanelProps> = ({
  currentShop,
  currentUser,
  isShopOwner,
  onOpenStaffPortal
}) => {
  const [staffList, setStaffList] = useState<StaffMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<StaffRole>('kitchen');

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/shops/${currentShop.id}/staff`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch staff members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentShop.id]);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setActionError(null);
      const res = await fetch(`/api/shops/${currentShop.id}/staff/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          phone: invitePhone,
          name: inviteName,
          role: inviteRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActionSuccess(`Invitation dispatched to ${inviteEmail} for role "${inviteRole}".`);
        setInviteEmail('');
        setInvitePhone('');
        setInviteName('');
        setInviteModalOpen(false);
        await fetchStaff();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to invite staff member');
      }
    } catch (err: any) {
      setActionError(err.message || 'Network error');
    }
  };

  const handleSimulateAccept = async (staff: StaffMembership) => {
    try {
      const res = await fetch(`/api/shops/${currentShop.id}/staff/${staff.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: staff.invited_email,
          userId: `usr-${staff.invited_email.split('@')[0]}`,
        }),
      });

      if (res.ok) {
        setActionSuccess(`Staff invitation accepted for ${staff.invited_email}. Role is now ACTIVE.`);
        await fetchStaff();
      }
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleRevokeStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to revoke this staff member access?')) return;

    try {
      const res = await fetch(`/api/shops/${currentShop.id}/staff/${staffId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setActionSuccess('Staff access revoked.');
        await fetchStaff();
      } else {
        const data = await res.json();
        setActionError(data.error || 'Failed to revoke staff');
      }
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const copyInviteLink = (staffId: string) => {
    const url = `${window.location.origin}/staff?invite=${staffId}&shop=${currentShop.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(staffId);
    setTimeout(() => setCopiedLink(null), 3000);
  };

  const getRoleIcon = (role: StaffRole) => {
    switch (role) {
      case 'kitchen':
        return <ChefHat className="w-4 h-4 text-amber-400" />;
      case 'cashier':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'staff':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'owner':
        return <Crown className="w-4 h-4 text-purple-400" />;
    }
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case 'kitchen':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'cashier':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      case 'staff':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      case 'owner':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
              MRC-04 SPEC
            </span>
            <span className="text-xs font-mono text-zinc-400">Role-Based Staff Access</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Storefront Team & Staff Control
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Invite kitchen cooks, front cashiers, and runners. Roles restrict operational capabilities strictly across Cloud Run server endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenStaffPortal && (
            <button
              onClick={() => onOpenStaffPortal('kitchen')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Staff Portal (/staff)</span>
            </button>
          )}

          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Staff Member</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Role Definitions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-zinc-900/60 border border-amber-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <ChefHat className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-amber-300">Kitchen Display</h4>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Can ONLY advance order statuses from <span className="font-mono text-zinc-300">INCOMING</span> → <span className="font-mono text-zinc-300">PREPARING</span> → <span className="font-mono text-zinc-300">READY</span>. Blocked from refunds or cancellations.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-emerald-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-emerald-300">Cashier POS</h4>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Verifies manual UPI proofs, checks duplicate UTR flags in Payment Review, prints 58mm KOT, and inspects GST invoices.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-blue-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Truck className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold text-blue-300">Dispatch / Runner</h4>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Sees orders marked <span className="font-mono text-zinc-300">READY</span>. Dispatches to dine-in table numbers or hands off parcel tokens.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-purple-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-purple-300">Store Owner</h4>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Full administrative control: toggles menu items, configures GST rates & HSN codes, and invites/revokes staff members.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Active Members & Invitations ({staffList.length})</h3>
          </div>
          <button
            onClick={fetchStaff}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  {getRoleIcon(member.role)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white">
                      {member.name || member.invited_email.split('@')[0]}
                    </h4>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRoleColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      <span className="uppercase">{member.role}</span>
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      member.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {member.invited_email} {member.invited_phone ? `• ${member.invited_phone}` : ''}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Invited: {new Date(member.invited_at).toLocaleDateString()} {member.accepted_at ? `• Active since: ${new Date(member.accepted_at).toLocaleDateString()}` : ''}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {member.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleSimulateAccept(member)}
                      className="px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/40 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Simulate staff opening invite link and joining"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simulate Accept</span>
                    </button>

                    <button
                      onClick={() => copyInviteLink(member.id)}
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink === member.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink === member.id ? 'Copied' : 'Invite Link'}</span>
                    </button>
                  </>
                )}

                {onOpenStaffPortal && member.status === 'ACTIVE' && (
                  <button
                    onClick={() => onOpenStaffPortal(member.role)}
                    className="px-2.5 py-1.5 bg-indigo-950/50 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-800/40 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test as {member.role}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                {member.role !== 'owner' && (
                  <button
                    onClick={() => handleRevokeStaff(member.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-950/30 cursor-pointer"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <span>Invite New Staff Member</span>
              </h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleInviteStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Staff Member Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address (Required)</label>
                <input
                  type="email"
                  required
                  placeholder="staff@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number (Optional for SMS invite)</label>
                <input
                  type="tel"
                  placeholder="+1 555-0199"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Assigned Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteRole('kitchen')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      inviteRole === 'kitchen' 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ChefHat className="w-4 h-4 mb-1 text-amber-400" />
                    <div className="text-xs font-bold">Kitchen</div>
                    <div className="text-[10px] text-zinc-500">Cook / KDS</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole('cashier')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      inviteRole === 'cashier' 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1 text-emerald-400" />
                    <div className="text-xs font-bold">Cashier</div>
                    <div className="text-[10px] text-zinc-500">POS / Bills</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole('staff')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      inviteRole === 'staff' 
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1 text-blue-400" />
                    <div className="text-xs font-bold">Runner</div>
                    <div className="text-[10px] text-zinc-500">Dispatch</div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Send Staff Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
