import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  trend = 'neutral',
  icon,
  subtitle,
  className = ''
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
            {change && (
              <Badge variant={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'neutral'}>
                {change}
              </Badge>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-3 bg-slate-800/80 rounded-xl text-emerald-400 border border-slate-700/50">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
