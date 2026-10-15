import React from 'react';
import { motion } from 'motion/react';
import { Zap, Train, Cloud, Globe, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { govService } from '../services/govService';
import { cn } from '../lib/utils';

interface Props {
  isCrisisActive?: boolean;
}

export const NationalInfrastructure: React.FC<Props> = ({ isCrisisActive }) => {
  const infra = govService.getMockInfrastructure().map(item => 
    isCrisisActive && (item.type === 'Power' || item.type === 'Railways') 
      ? { ...item, status: 'Under Attack' as const, load: 98 } 
      : item
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'Power': return <Zap size={18} />;
      case 'Railways': return <Train size={18} />;
      case 'Cloud': return <Cloud size={18} />;
      default: return <Globe size={18} />;
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-gov-primary" size={20} />
          <h3 className="font-bold text-gov-primary">Critical Infrastructure Protection</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">System Health:</span>
          <span className="text-[10px] font-bold text-gov-success uppercase">94.2% Optimal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infra.map((item) => (
          <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  item.status === 'Under Attack' ? "bg-gov-danger text-white" : "bg-gov-primary text-white"
                )}>
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">{item.type} Infrastructure</div>
                </div>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[8px] font-bold uppercase flex items-center gap-1",
                item.status === 'Operational' ? "bg-gov-success/10 text-gov-success" :
                item.status === 'Under Attack' ? "bg-gov-danger/10 text-gov-danger animate-pulse" : "bg-gov-warning/10 text-gov-warning"
              )}>
                {item.status === 'Operational' ? <CheckCircle2 size={8} /> : <AlertTriangle size={8} />}
                {item.status}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                <span>Network Load</span>
                <span>{item.load}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.load}%` }}
                  className={cn(
                    "h-full transition-all duration-500",
                    item.load > 90 ? "bg-gov-danger" : item.load > 70 ? "bg-gov-warning" : "bg-gov-success"
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono">
              <span>ID: {item.id}</span>
              <span>SYNC: {new Date(item.lastCheck).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gov-accent/5 rounded-xl border border-gov-accent/20 flex items-center gap-4">
        <div className="w-10 h-10 bg-gov-accent text-white rounded-full flex items-center justify-center shrink-0">
          <Globe size={20} className="animate-spin-slow" />
        </div>
        <div>
          <div className="text-xs font-bold text-gov-primary uppercase">SovereignShield National Mesh</div>
          <div className="text-[10px] text-slate-500">Cross-ministry threat intelligence sharing active. 14.2M nodes monitored.</div>
        </div>
      </div>
    </div>
  );
};
