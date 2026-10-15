import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap, Lock, Activity, AlertCircle } from 'lucide-react';
import { securityService } from '../services/securityService';
import { SecurityEvent } from '../types';
import { cn } from '../lib/utils';

interface Props {
  isCrisisActive?: boolean;
}

export const SecurityMonitor: React.FC<Props> = ({ isCrisisActive }) => {
  const [events, setEvents] = useState<SecurityEvent[]>(securityService.getSecurityEvents());

  useEffect(() => {
    if (isCrisisActive) {
      const crisisEvents: SecurityEvent[] = [
        {
          id: 'CRISIS-001',
          type: 'Intrusion',
          severity: 'Critical',
          message: 'Coordinated APT attack detected on POSOCO & IRCTC nodes',
          timestamp: new Date().toISOString(),
          status: 'Blocked'
        },
        {
          id: 'CRISIS-002',
          type: 'Anomaly',
          severity: 'Critical',
          message: 'Sovereign AI initiating National Lockdown Protocol',
          timestamp: new Date().toISOString(),
          status: 'Monitoring'
        },
        ...securityService.getSecurityEvents()
      ];
      setEvents(crisisEvents.slice(0, 5));
    } else {
      setEvents(securityService.getSecurityEvents());
    }
  }, [isCrisisActive]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-gov-danger" size={20} />
          <h3 className="font-bold text-gov-primary">Autonomous Cyber-Sentinel</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gov-success"></span>
          </span>
          <span className="text-[10px] font-bold text-gov-success uppercase">Self-Healing Active</span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "p-3 rounded-lg border flex gap-3 items-start",
                event.severity === 'Critical' ? "bg-gov-danger/5 border-gov-danger/20" :
                event.severity === 'High' ? "bg-gov-warning/5 border-gov-warning/20" : "bg-slate-50 border-slate-100"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg shrink-0",
                event.severity === 'Critical' ? "bg-gov-danger text-white" :
                event.severity === 'High' ? "bg-gov-warning text-white" : "bg-gov-primary text-white"
              )}>
                {event.type === 'Intrusion' ? <Lock size={14} /> : 
                 event.type === 'Anomaly' ? <Zap size={14} /> : <Activity size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{event.type}</span>
                  <span className="text-[8px] text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{event.message}</p>
                {event.automated_response && (
                  <div className="mt-1.5 p-1.5 bg-gov-primary/5 border border-gov-primary/10 rounded text-[9px] text-gov-primary italic">
                    <span className="font-bold uppercase mr-1">Auto-Response:</span>
                    {event.automated_response}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                    event.status === 'Blocked' ? "bg-gov-success/10 text-gov-success" : 
                    event.status === 'Patched' ? "bg-gov-primary/10 text-gov-primary" :
                    "bg-gov-warning/10 text-gov-warning"
                  )}>
                    {event.status}
                  </span>
                  {event.patch_status === 'Applied' && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase bg-gov-success/10 text-gov-success">
                      Patch Applied
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 p-4 bg-gov-primary/5 rounded-xl border border-gov-primary/10 flex items-center gap-4">
        <div className="w-10 h-10 bg-gov-primary text-white rounded-full flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <div className="text-xs font-bold text-gov-primary">Security Posture: EXCELLENT</div>
          <div className="text-[10px] text-slate-500">Zero-Trust Protocol v4.0 active across all ministries.</div>
        </div>
      </div>
    </div>
  );
};
