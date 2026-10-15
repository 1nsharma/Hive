import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatDate, getDaysUntil, isOverdue } from '../dateUtils';

describe('Date & Time Utilities (Day.js / Date-fns pattern)', () => {
  it('formats relative times accurately', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('Just now');

    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinsAgo)).toBe('5m ago');

    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

    const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000);
    expect(formatRelativeTime(yesterday)).toBe('Yesterday');
  });

  it('formats date strings nicely', () => {
    const testDate = new Date('2025-10-15T10:00:00Z');
    const formatted = formatDate(testDate, 'short');
    expect(formatted).toContain('15');
    expect(formatted).toContain('Oct');
  });

  it('calculates days until a due date and overdue status', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    expect(getDaysUntil(futureDate)).toBeGreaterThanOrEqual(4);
    expect(isOverdue(futureDate)).toBe(false);

    const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(isOverdue(pastDate)).toBe(true);
  });
});
