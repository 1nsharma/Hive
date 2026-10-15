import React from 'react';
import { govService } from '../services/govService';
import { cn } from '../lib/utils';
import { Building2, ShieldCheck, MessageSquare, AlertTriangle } from 'lucide-react';

export const MinistryOverview: React.FC = () => {
  const ministries = govService.getMockMinistries();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="text-gov-primary" size={20} />
          <h3 className="font-bold text-gov-primary">Ministry Compliance & Performance</h3>
        </div>
        <button className="text-[10px] font-bold text-gov-primary hover:underline uppercase">View Full Audit</button>
      </div>

      <div className="space-y-4">
        {ministries.map((m) => (
          <div key={m.id} className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-sm text-slate-900">{m.name}</div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                m.compliance > 95 ? "bg-gov-success text-white" : "bg-gov-warning text-white"
              )}>
                {m.compliance}% Compliance
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gov-primary/10 text-gov-primary rounded-md">
                  <MessageSquare size={12} />
                </div>
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold">Grievances</div>
                  <div className="text-xs font-bold text-slate-700">{m.activeGrievances}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gov-danger/10 text-gov-danger rounded-md">
                  <AlertTriangle size={12} />
                </div>
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold">Fraud Alerts</div>
                  <div className="text-xs font-bold text-slate-700">{m.fraudAlerts}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gov-success/10 text-gov-success rounded-md">
                  <ShieldCheck size={12} />
                </div>
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold">Security</div>
                  <div className="text-xs font-bold text-slate-700">Optimal</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
