import React from 'react';
import { 
  X, 
  Radar, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Layers
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              DA
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Desi Arcade Studios: Autonomous Architecture Map</h3>
              <p className="text-xs text-slate-400">Self-Updating Research & LiveOps Pipeline Data Flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Closed-Loop Pipeline Flow Diagram */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 relative">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Radar className="w-4 h-4" />
                <span>1. Ingestion (12h)</span>
              </div>
              <h4 className="text-xs font-bold text-white">Trend Radar Daemon</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Scrapes <code className="text-amber-300">r/IndianGaming</code>, Steam India, and Play Store casual charts. Saves to <code className="text-slate-300">trend_data.json</code>.
              </p>
              <div className="text-[10px] font-mono text-amber-400/80 bg-amber-950/40 p-1.5 rounded">
                research/trend_scraper.py
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-orange-500/30 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>2. Synthesis (Daily)</span>
              </div>
              <h4 className="text-xs font-bold text-white">AI Synthesizer Agent</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Reads trend signals, prompts LLM (Gemini 3.7 Flash) to write Godot 4 GDScript, and opens automated GitHub PR.
              </p>
              <div className="text-[10px] font-mono text-orange-400/80 bg-orange-950/40 p-1.5 rounded">
                server/agents/research_agent.js
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Self-Healing CI/CD</span>
              </div>
              <h4 className="text-xs font-bold text-white">GUT Test & Repair</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automated Godot unit tests catch bugs. If a test fails, AI inspects error logs, generates a patch commit, and re-tests.
              </p>
              <div className="text-[10px] font-mono text-sky-400/80 bg-sky-950/40 p-1.5 rounded">
                .github/workflows/ai_self_heal.yml
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Radio className="w-4 h-4" />
                <span>4. Live Delivery</span>
              </div>
              <h4 className="text-xs font-bold text-white">LiveOps Remote Config</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Godot game instances consume <code className="text-emerald-300">/api/liveops/trends</code> dynamically for weather, recipes & events with 0 client patch required.
              </p>
              <div className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 p-1.5 rounded">
                games/.../LiveOpsManager.gd
              </div>
            </div>

          </div>

          {/* Key Advantages Matrix */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Autonomous Agency Architectural Tenets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Manual Prompting:</strong> Background research daemon continuously feeds the AI synthesizer.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Instant Live Delivery:</strong> Dynamic remote config changes weather, stadium, and multipliers without app store rebuilds.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Self-Healing Safety Net:</strong> Godot unit tests detect broken GDScript and trigger automatic bug repair commits.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Desi Market Grounding:</strong> Specifically tuned for IPL seasons, monsoon moods, festival food rushes, and regional gaming nuances.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
