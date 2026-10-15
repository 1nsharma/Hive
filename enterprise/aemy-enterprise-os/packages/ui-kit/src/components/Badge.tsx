import React from 'react';
import { BadgeVariant, BaseComponentProps } from '../types';

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider';

  const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
