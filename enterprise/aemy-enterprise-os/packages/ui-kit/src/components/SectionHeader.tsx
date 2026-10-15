import React from 'react';
import { BaseComponentProps } from '../types';

export interface SectionHeaderProps extends BaseComponentProps {
  title: string;
  description?: string;
  badgeText?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  badgeText,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          {badgeText && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {badgeText}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
