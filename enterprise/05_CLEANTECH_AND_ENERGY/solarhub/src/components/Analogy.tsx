import React from 'react';
import { Lightbulb, Network } from 'lucide-react';

export const AnalogySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Analogy */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-100">Simple Analogy</h3>
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center space-y-6">
          <div className="flex items-start gap-4">
            <div className="text-emerald-400 font-mono font-bold mt-1">MLOps</div>
            <div className="text-slate-300 text-lg leading-relaxed"><span className="text-emerald-500/50 mr-2">→</span> Runs <strong>predictive</strong> AI systems</div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-fuchsia-400 font-mono font-bold mt-1">LLMOps</div>
            <div className="text-slate-300 text-lg leading-relaxed"><span className="text-fuchsia-500/50 mr-2">→</span> Runs <strong>conversational/genAI</strong> systems</div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-blue-400 font-mono font-bold mt-1">AIOps</div>
            <div className="text-slate-300 text-lg leading-relaxed"><span className="text-blue-500/50 mr-2">→</span> Uses AI to manage <strong>IT systems themselves</strong></div>
          </div>
        </div>
      </div>

      {/* Modern AI Companies */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden relative isolate">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 relative z-10">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-100">In Modern AI Companies</h3>
        </div>
        
        <div className="p-6 md:p-8 space-y-6 relative z-10 flex-1 flex flex-col">
          <p className="text-lg text-slate-300 font-medium">These disciplines often work together:</p>
          
          <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <p className="text-slate-200"><strong>MLOps</strong> trains recommendation models</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
              <p className="text-slate-200"><strong>LLMOps</strong> powers AI assistants/chat interfaces</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <p className="text-slate-200"><strong>AIOps</strong> monitors the infrastructure running both</p>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800/80">
            <p className="text-slate-400 text-sm leading-relaxed">
              This convergence is becoming critical in AI-native companies and autonomous agent ecosystems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
