import React from 'react';
import { OpsCategory } from '../data';
import { Server, Bot, BrainCircuit, Target, Workflow, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

interface OpsCardProps {
  data: OpsCategory;
}

const themeColors: Record<string, string> = {
  blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400 bg-blue-500/10",
  fuchsia: "from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10",
  emerald: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
};

const iconMap: Record<string, React.ElementType> = {
  server: Server,
  bot: Bot,
  brain: BrainCircuit
};

export const OpsCard: React.FC<OpsCardProps> = ({ data }) => {
  const Icon = iconMap[data.iconName] || Server;
  const themeClasses = themeColors[data.colorTheme] || themeColors.blue;
  
  // Extracting specific classes for different elements
  const borderClass = `border-${data.colorTheme}-500/30`;
  const textClass = `text-${data.colorTheme}-400`;
  const bgSoftClass = `bg-${data.colorTheme}-500/10`;
  const gradientClass = `bg-gradient-to-br from-${data.colorTheme}-500/10 to-${data.colorTheme}-600/5`;

  return (
    <div className={`flex flex-col rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden h-full`}>
      {/* Header */}
      <div className={`p-6 border-b border-slate-800 flex items-start gap-4 ${gradientClass}`}>
        <div className={`p-3 rounded-2xl border ${bgSoftClass} ${borderClass}`}>
          <Icon className={`w-8 h-8 ${textClass}`} />
        </div>
        <div>
          <h2 className={`font-display text-2xl font-bold tracking-tight ${textClass}`}>{data.title}</h2>
          <p className="text-sm font-medium text-slate-300 mt-1">{data.fullName}</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Focus */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Primary Focus</span>
          </div>
          <p className="text-slate-200 font-medium leading-relaxed">{data.focus}</p>
        </div>

        {/* Use Cases */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mainly Used In</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.uses.map((use, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
                {use}
              </span>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
            <Workflow className="w-4 h-4" />
            <span>Core Workflow</span>
          </div>
          <ol className="space-y-2 relative before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-slate-800">
            {data.workflow.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 relative">
                <div className={`w-6 h-6 rounded-full border ${borderClass} ${bgSoftClass} flex items-center justify-center text-[10px] font-bold ${textClass} shrink-0 z-10 mt-0.5`}>
                  {idx + 1}
                </div>
                <span className="text-sm text-slate-300 py-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Important Concepts (LLMOps mostly) */}
        {data.concepts && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Important Concepts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.concepts.map((concept, idx) => (
                <div key={idx} className={`px-3 py-2 rounded-lg border ${borderClass} ${bgSoftClass} text-xs font-medium ${textClass}`}>
                  {concept}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
      {/* Footer / Goal / Tools */}
      <div className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-6 mt-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Main Goal</span>
          </div>
          <p className="text-sm font-semibold text-slate-100">{data.goal}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Popular Tools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.tools.map((tool, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-medium text-slate-400 border border-slate-700">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
