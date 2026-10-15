import React from 'react';
import { BaseComponentProps } from '../types';

export const Card: React.FC<BaseComponentProps> = ({ children, className = '' }) => (
  <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<BaseComponentProps> = ({ children, className = '' }) => (
  <div className={`mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<BaseComponentProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-white tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<BaseComponentProps> = ({ children, className = '' }) => (
  <div className={`text-slate-300 text-sm leading-relaxed ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<BaseComponentProps> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3 ${className}`}>
    {children}
  </div>
);
