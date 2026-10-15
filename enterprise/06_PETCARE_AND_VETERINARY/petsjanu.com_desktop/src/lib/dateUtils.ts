/**
 * Lightweight, zero-dependency date & time utilities (Day.js / Date-fns pattern)
 * Tailored for pet vaccination schedules, SOS sighting timestamps, and relative time.
 */

export function formatRelativeTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Just now';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 10) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  return `${Math.floor(diffInDays / 365)}y ago`;
}

export function formatDate(dateInput: string | number | Date, formatType: 'short' | 'medium' | 'long' = 'medium'): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid date';

  if (formatType === 'short') {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  if (formatType === 'medium') {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function getDaysUntil(targetDate: string | number | Date): number {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(dueDate: string | number | Date): boolean {
  return getDaysUntil(dueDate) < 0;
}
