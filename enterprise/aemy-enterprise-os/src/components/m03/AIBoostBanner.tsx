import React, { useState, useEffect } from 'react';
import { Shop, ShopStats } from '../../types/database';
import { 
  Sparkles, 
  Lock, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Database,
  BarChart3
} from 'lucide-react';

interface AIBoostBannerProps {
  currentShop: Shop;
}

export const AIBoostBanner: React.FC<AIBoostBannerProps> = ({ currentShop }) => {
  const [stats, setStats] = useState<ShopStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [aiEvents, setAiEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/ai/stats?shopId=${currentShop.id}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load AI stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentShop.id]);

  const fetchAIEvents = async () => {
    try {
      const res = await fetch(`/api/ai/events?shopId=${currentShop.id}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        setAiEvents(data.events || []);
        setShowEventsModal(true);
      }
    } catch (err) {
      console.error('Failed to load AI events:', err);
    }
  };

  if (loading || !stats) return null;

  // Requirement E: If active_since > 90 days (or eligible), show banner
  const isEligible = stats.ai_boost_eligible || stats.days_active >= 90;

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden my-4">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  M03 AI DATA LAYER • PREVIEW FOR M05
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Active {stats.days_active} Days (&gt;90 Days Milestone Met)
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-1">
                Unlock AI Boost — Predictive Customer Intelligence
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5 max-w-2xl leading-relaxed">
                Know repeat customer habits, today's projected bill volume, and highest-margin preparation recommendations trained on anonymized <code className="text-indigo-300 font-mono">ai_events</code>.
              </p>
            </div>
          </div>

          {/* Stats Preview & Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Locked / Unlocked Stats Pills */}
            <div className="flex items-center gap-2 bg-zinc-950/70 border border-zinc-800 rounded-xl px-3 py-2 text-xs">
              <div className="text-center px-1">
                <p className="text-[10px] text-zinc-400">Unique Users Today</p>
                <p className="font-bold font-mono text-white flex items-center justify-center gap-1">
                  {unlocked ? stats.unique_visitors_today : <span className="blur-xs select-none">38</span>}
                  {!unlocked && <Lock className="w-3 h-3 text-amber-400 inline" />}
                </p>
              </div>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="text-center px-1">
                <p className="text-[10px] text-zinc-400">Repeat Customers</p>
                <p className="font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
                  {unlocked ? `${stats.repeat_customers_count} orders` : <span className="blur-xs select-none">18</span>}
                  {!unlocked && <Lock className="w-3 h-3 text-amber-400 inline" />}
                </p>
              </div>
            </div>

            <button
              onClick={() => setUnlocked(!unlocked)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{unlocked ? 'Lock Insights' : 'Unlock AI Boost ($19/mo)'}</span>
            </button>

            <button
              onClick={fetchAIEvents}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inspect ai_events</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Events Modal */}
      {showEventsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Anonymized ai_events Table Stream</h3>
              </div>
              <button onClick={() => setShowEventsModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-zinc-400">
              Every API route continuously appends to <code className="text-indigo-300 font-mono">ai_events</code>. PII (phone, customer name, email) is stripped before ingestion for clean ML training in M05.
            </p>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {aiEvents.map((evt) => (
                <div key={evt.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-indigo-400">{evt.event_type}</span>
                    <span className="text-zinc-500">{new Date(evt.created_at).toLocaleTimeString()}</span>
                  </div>
                  <pre className="text-[11px] text-zinc-300 overflow-x-auto p-2 bg-zinc-900/50 rounded-lg">
                    {JSON.stringify(evt.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowEventsModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
