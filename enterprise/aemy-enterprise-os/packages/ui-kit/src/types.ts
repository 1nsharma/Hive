import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
