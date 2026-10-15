import React, { useState, useEffect } from 'react';
import { UserProfile, Shop, Order } from '../../types/database';
import { 
  ShieldAlert, 
  Terminal, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  RefreshCw, 
  Lock, 
  Key, 
  Zap, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface InternalTestPaymentsPortalProps {
  currentUser: UserProfile;
  currentShop: Shop;
  onOpenFraudQueue?: () => void;
  onOpenOrderTracking?: (orderId: string) => void;
}

export const InternalTestPaymentsPortal: React.FC<InternalTestPaymentsPortalProps> = ({
  currentUser,
  currentShop,
  onOpenFraudQueue,
  onOpenOrderTracking,
}) => {
  const [metaLoading, setMetaLoading] = useState<boolean>(true);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<Array<{ email: string; role: string; name: string }>>([]);
  const [testShops, setTestShops] = useState<Shop[]>([]);

  // Execution states
  const [executing, setExecuting] = useState<string | null>(null);
  const [resultsLog, setResultsLog] = useState<Array<{
    id: string;
    scenario: string;
    status: 'success' | 'flagged' | 'error';
    timestamp: string;
    message: string;
    details: any;
  }>>([]);

  // Webhook custom tester state
  const [webhookOrderId, setWebhookOrderId] = useState<string>('ord-001');
  const [webhookAmountPaise, setWebhookAmountPaise] = useState<number>(2430); // $24.30
  const [webhookSecret, setWebhookSecret] = useState<string>('rzp_wh_secret_test_2026');

  const fetchMeta = async () => {
    try {
      setMetaLoading(true);
      const res = await fetch('/api/internal/test-payments/meta');
      if (res.ok) {
        const data = await res.json();
        setIsTeamMember(data.isTeamMember);
        setTeamMembers(data.teamMembers || []);
        setTestShops(data.internalShops || []);
      }
    } catch (err) {
      console.error('Failed to fetch internal test meta:', err);
    } finally {
      setMetaLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, [currentUser.email]);

  const runScenario = async (scenarioType: 'DUPLICATE_UTR' | 'AMOUNT_MISMATCH' | 'VELOCITY') => {
    try {
      setExecuting(scenarioType);
      const res = await fetch('/api/internal/test-payments/simulate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioType,
          orderId: 'ord-001',
          shopId: currentShop.id,
        }),
      });

      const data = await res.json();
      
      const newLog = {
        id: `test-${Date.now()}`,
        scenario: scenarioType,
        status: (data.result?.fraudReview?.risk_score > 50 ? 'flagged' : 'success') as 'flagged' | 'success',
        timestamp: new Date().toLocaleTimeString(),
        message: data.message || `Scenario ${scenarioType} executed`,
        details: data.result,
      };

      setResultsLog(prev => [newLog, ...prev]);
    } catch (err: any) {
      setResultsLog(prev => [{
        id: `test-${Date.now()}`,
        scenario: scenarioType,
        status: 'error',
        timestamp: new Date().toLocaleTimeString(),
        message: err.message || 'Execution error',
        details: null,
      }, ...prev]);
    } finally {
      setExecuting(null);
    }
  };

  const runRazorpayWebhookTest = async (isDuplicate = false) => {
    try {
      setExecuting('WEBHOOK_TEST');
      const rzpPaymentId = isDuplicate ? 'pay_rzp_mock_duplicate_01' : `pay_rzp_${Date.now().toString(36)}`;
      
      const payload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: rzpPaymentId,
              amount: webhookAmountPaise,
              status: 'captured',
              notes: {
                order_id: webhookOrderId,
                shop_id: currentShop.id,
              },
            },
          },
        },
      };

      // In real backend, signature is HMAC SHA256 of rawBody with secret
      // We pass simulated signature header for test route
      const res = await fetch('/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'simulated_valid_hmac_sha256_sig',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setResultsLog(prev => [{
        id: `wh-${Date.now()}`,
        scenario: isDuplicate ? 'WEBHOOK_IDEMPOTENCY' : 'WEBHOOK_VERIFY',
        status: data.status === 'ok' ? 'success' : 'flagged',
        timestamp: new Date().toLocaleTimeString(),
        message: data.message || (data.status === 'ok' ? 'Razorpay Webhook Verified' : data.status),
        details: data,
      }, ...prev]);
    } catch (err: any) {
      setResultsLog(prev => [{
        id: `wh-${Date.now()}`,
        scenario: 'WEBHOOK_ERROR',
        status: 'error',
        timestamp: new Date().toLocaleTimeString(),
        message: err.message,
        details: null,
      }, ...prev]);
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-base font-bold text-zinc-100">
                Internal Payment Testing & Security Lab (RSK-01 to RSK-10)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Internal sandbox accessible exclusively by authorized engineering & QA team accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isTeamMember ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>TEAM AUTHORIZED: {currentUser.email}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Lock className="h-3.5 w-3.5" />
                <span>NON-TEAM ACCOUNT: {currentUser.email}</span>
              </span>
            )}
          </div>
        </div>

        {/* Authorized Team Roster */}
        <div className="mt-4 pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="text-zinc-500 uppercase">Authorized Team Emails:</span>
          {teamMembers.map(m => (
            <span
              key={m.email}
              className={`px-2 py-0.5 rounded border ${
                m.email === currentUser.email
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              {m.name} ({m.email})
            </span>
          ))}
        </div>
      </div>

      {/* Test Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1: Duplicate UTR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                RSK-02
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Duplicate Check</span>
            </div>
            <h3 className="text-xs font-bold text-zinc-100 mt-2">Duplicate UTR Injection</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Submits previously utilized UTR <code className="text-indigo-300">428192019283</code> to test immediate collision detection.
            </p>
          </div>

          <button
            onClick={() => runScenario('DUPLICATE_UTR')}
            disabled={executing !== null}
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700/60 flex items-center justify-center gap-2"
          >
            {executing === 'DUPLICATE_UTR' ? (
              <div className="h-3.5 w-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 text-rose-400" />
            )}
            <span>Inject Duplicate UTR</span>
          </button>
        </div>

        {/* Scenario 2: Amount Mismatch */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                RSK-04
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Value Audit</span>
            </div>
            <h3 className="text-xs font-bold text-zinc-100 mt-2">Amount Mismatch Injection</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Submits payment for $1.00 against an order with total $24.30 to verify fraud queue escalation.
            </p>
          </div>

          <button
            onClick={() => runScenario('AMOUNT_MISMATCH')}
            disabled={executing !== null}
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700/60 flex items-center justify-center gap-2"
          >
            {executing === 'AMOUNT_MISMATCH' ? (
              <div className="h-3.5 w-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>Inject Mismatch</span>
          </button>
        </div>

        {/* Scenario 3: Velocity Flood */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                RSK-01
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Rate Limiter</span>
            </div>
            <h3 className="text-xs font-bold text-zinc-100 mt-2">Velocity Flood (6 Injections)</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Simulates 6 rapid UTR submissions from the same device ID to test bot and velocity mitigation rules.
            </p>
          </div>

          <button
            onClick={() => runScenario('VELOCITY')}
            disabled={executing !== null}
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700/60 flex items-center justify-center gap-2"
          >
            {executing === 'VELOCITY' ? (
              <div className="h-3.5 w-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 text-purple-400" />
            )}
            <span>Execute Velocity Flood</span>
          </button>
        </div>
      </div>

      {/* Razorpay Webhook Simulation Console (PAY-03, PAY-06) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span>Server-Side Razorpay Webhook Simulator (PAY-03, PAY-06)</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Simulates POST /api/webhooks/razorpay with HMAC verification and idempotency cache.
            </p>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Cloud Run Native Route
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 block mb-1">Target Order ID</label>
            <input
              type="text"
              value={webhookOrderId}
              onChange={e => setWebhookOrderId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-400 block mb-1">Amount (Paise / Cents)</label>
            <input
              type="number"
              value={webhookAmountPaise}
              onChange={e => setWebhookAmountPaise(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-400 block mb-1">GCP Secret Manager Key</label>
            <input
              type="text"
              value={webhookSecret}
              disabled
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-500 truncate"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => runRazorpayWebhookTest(false)}
            disabled={executing !== null}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Send Verified Webhook (HMAC Valid)</span>
          </button>

          <button
            onClick={() => runRazorpayWebhookTest(true)}
            disabled={executing !== null}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors border border-zinc-700 flex items-center gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Test Idempotency (Re-send Same ID)</span>
          </button>

          {onOpenFraudQueue && (
            <button
              onClick={onOpenFraudQueue}
              className="ml-auto text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Live Fraud Queue</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Execution Results Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-zinc-400" />
            <span>Test Execution Audit Trail ({resultsLog.length})</span>
          </h3>
          <button
            onClick={() => setResultsLog([])}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300"
          >
            Clear Log
          </button>
        </div>

        {resultsLog.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-zinc-500">
            No scenario executions yet. Click any injection button above to test.
          </div>
        ) : (
          <div className="space-y-2.5">
            {resultsLog.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 flex items-start justify-between text-xs font-mono gap-3"
              >
                <div className="flex items-start gap-2.5">
                  {log.status === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : log.status === 'flagged' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-zinc-200">
                      [{log.scenario}] - {log.message}
                    </div>
                    {log.details && (
                      <div className="text-[11px] text-zinc-400 mt-1 truncate max-w-xl">
                        Risk Score: {log.details.fraudReview?.risk_score ?? '0'} | Reasons: {log.details.fraudReview?.reasons?.join(', ') || 'NONE'}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
