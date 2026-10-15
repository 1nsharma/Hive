import React, { useState } from 'react';
import { Shop, UserProfile } from '../../types/database';
import { 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  CreditCard, 
  ExternalLink, 
  RefreshCw, 
  Lock, 
  ArrowRight,
  AlertTriangle,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface WaitingApprovalBannerProps {
  shop: Shop;
  currentUser: UserProfile;
  isTeamMember: boolean;
  onRefreshShop: () => void;
  onOpenAdminApprovals?: () => void;
}

export const WaitingApprovalBanner: React.FC<WaitingApprovalBannerProps> = ({
  shop,
  currentUser,
  isTeamMember,
  onRefreshShop,
  onOpenAdminApprovals
}) => {
  const [payingSubscription, setPayingSubscription] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaySubscription = async () => {
    try {
      setPayingSubscription(true);
      setError(null);
      const res = await fetch(`/api/shops/${shop.id}/pay-subscription`, {
        method: 'POST'
      });
      if (res.ok) {
        setPaymentSuccess(true);
        onRefreshShop();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to process subscription payment');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setPayingSubscription(false);
    }
  };

  const isSubscriptionActive = shop.subscription_status === 'ACTIVE';
  const isRejected = shop.status === 'REJECTED';
  const isSuspended = shop.status === 'SUSPENDED';

  return (
    <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-6">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {isRejected ? (
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            ) : (
              <Clock className="w-6 h-6 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                isRejected 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {isRejected ? 'APPLICATION REJECTED' : 'WAITING FOR ADMIN APPROVAL'}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Shop ID: {shop.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {shop.name}
            </h2>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          {isRejected ? (
            'Your storefront application was not approved during administrative verification. Please review verification criteria or contact support.'
          ) : isSuspended ? (
            'This shop storefront has been temporarily suspended by platform operations.'
          ) : (
            'To protect our marketplace from fraudulent merchants, every new storefront undergoes security verification by a verified platform administrator before live orders and payments can be received.'
          )}
        </p>

        {/* 3-Step Approval Pipeline Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-emerald-500/40 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400">Step 1: Shop Created</p>
              <p className="text-[11px] text-zinc-400">Store registered via Firebase Auth</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-3.5 rounded-xl bg-zinc-950/70 border flex items-start gap-3 ${
            isSubscriptionActive ? 'border-emerald-500/40' : 'border-amber-500/40'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isSubscriptionActive 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isSubscriptionActive ? <CheckCircle2 className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
            </div>
            <div>
              <p className={`text-xs font-semibold ${isSubscriptionActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                Step 2: Subscription ({isSubscriptionActive ? 'ACTIVE' : 'PENDING'})
              </p>
              <p className="text-[11px] text-zinc-400">
                {isSubscriptionActive ? 'Razorpay test checkout paid' : 'Requires active merchant plan'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-amber-500/40 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400">Step 3: Admin Review</p>
              <p className="text-[11px] text-zinc-400">Requires verified team approval</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800">
          {!isSubscriptionActive && !isRejected && (
            <button
              onClick={handlePaySubscription}
              disabled={payingSubscription}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {payingSubscription ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Razorpay Test Link...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay Subscription ($29/mo Razorpay Test Link)
                </>
              )}
            </button>
          )}

          <button
            onClick={onRefreshShop}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl border border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Check Approval Status
          </button>

          {/* Admin shortcut if current logged in user is on team_members */}
          {isTeamMember && onOpenAdminApprovals && (
            <button
              onClick={onOpenAdminApprovals}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl border border-indigo-400/30 transition-all flex items-center gap-2 shadow-md cursor-pointer ml-auto"
            >
              <ShieldAlert className="w-4 h-4 text-indigo-200" />
              <span>Open Admin Approvals Panel (/admin/approvals)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {paymentSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Subscription payment simulated successfully via Razorpay test link! Shop is now queued in the platform Admin Approvals Panel.</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Note on Security Rules */}
        <div className="mt-4 text-[11px] text-zinc-400 flex items-center gap-2 bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800/80">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>
            Security Constraint: Storefront operations remain strictly blocked by Cloud Run server-side middleware until an administrator with verified team credentials approves this shop.
          </span>
        </div>
      </div>
    </div>
  );
};
