import React from 'react';

export type SystemStatus = 'online' | 'offline' | 'busy' | 'idle';

export interface StatusIndicatorProps {
  status: SystemStatus;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className = ''
}) => {
  const statusStyles: Record<SystemStatus, { dot: string; ping: string; text: string }> = {
    online: { dot: 'bg-emerald-500', ping: 'bg-emerald-400', text: 'text-emerald-400' },
    offline: { dot: 'bg-slate-500', ping: 'bg-slate-400', text: 'text-slate-400' },
    busy: { dot: 'bg-amber-500', ping: 'bg-amber-400', text: 'text-amber-400' },
    idle: { dot: 'bg-cyan-500', ping: 'bg-cyan-400', text: 'text-cyan-400' }
  };

  const current = statusStyles[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ping}`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${current.dot}`} />
      </span>
      {label && <span className={`text-xs font-medium uppercase tracking-wider ${current.text}`}>{label}</span>}
    </div>
  );
};
