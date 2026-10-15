/**
 * Client-Side Fuzzy Search Engine (Fuse.js pattern)
 * Zero-dependency algorithm supporting Levenshtein distance, multi-field weighting,
 * and token-based partial matching.
 */

export interface FuzzySearchResult<T> {
  item: T;
  score: number; // 0 is perfect match, 1 is no match
  matches: string[];
}

export interface SearchableItem {
  id: string;
  title: string;
  category: 'pet' | 'product' | 'service' | 'job' | 'guide' | 'clinic';
  description?: string;
  tags?: string[];
  meta?: string;
  actionUrl?: string;
  badge?: string;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const row = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 1; i <= m; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      if (a[i - 1] === b[j - 1]) {
        row[j] = prev;
      } else {
        row[j] = Math.min(prev + 1, row[j] + 1, row[j - 1] + 1);
      }
      prev = temp;
    }
  }

  return row[n];
}

export function fuzzyScore(pattern: string, text: string): number {
  const p = pattern.toLowerCase().trim();
  const t = text.toLowerCase().trim();

  if (!p) return 0;
  if (t === p) return 0; // exact match
  if (t.startsWith(p)) return 0.1; // prefix match
  if (t.includes(p)) return 0.25; // substring match

  // Token match
  const pTokens = p.split(/\s+/);
  const tTokens = t.split(/\s+/);
  let matchedTokens = 0;

  for (const pt of pTokens) {
    for (const tt of tTokens) {
      if (tt.includes(pt)) {
        matchedTokens++;
        break;
      }
      // Check typo distance
      if (pt.length >= 3 && levenshtein(pt, tt) <= 1) {
        matchedTokens += 0.8;
        break;
      }
    }
  }

  if (matchedTokens > 0) {
    return Math.max(0.2, 1 - (matchedTokens / pTokens.length) * 0.7);
  }

  // Full string Levenshtein distance fallback
  const dist = levenshtein(p, t.slice(0, Math.max(p.length + 3, 10)));
  const normalized = dist / Math.max(p.length, t.length);
  return Math.min(normalized, 1);
}

export class FuzzySearcher<T extends SearchableItem> {
  private items: T[] = [];

  constructor(items: T[] = []) {
    this.items = items;
  }

  public setItems(items: T[]): void {
    this.items = items;
  }

  public search(query: string, threshold = 0.55): FuzzySearchResult<T>[] {
    const q = query.trim();
    if (!q) return [];

    const results: FuzzySearchResult<T>[] = [];

    for (const item of this.items) {
      const matchFields: string[] = [];
      
      // Calculate weighted score
      const titleScore = fuzzyScore(q, item.title) * 0.45;
      const descScore = item.description ? fuzzyScore(q, item.description) * 0.35 : 0.4;
      const tagsScore = item.tags && item.tags.length > 0 
        ? Math.min(...item.tags.map(t => fuzzyScore(q, t))) * 0.2 
        : 0.3;

      if (titleScore < 0.35) matchFields.push('title');
      if (descScore < 0.35) matchFields.push('description');
      if (tagsScore < 0.35) matchFields.push('tags');

      const totalScore = titleScore + descScore * 0.5 + tagsScore * 0.5;

      if (totalScore <= threshold || matchFields.length > 0) {
        results.push({
          item,
          score: totalScore,
          matches: matchFields
        });
      }
    }

    return results.sort((a, b) => a.score - b.score);
  }
}
