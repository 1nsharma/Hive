import { describe, it, expect } from 'vitest';
import { FuzzySearcher, fuzzyScore, SearchableItem } from '../fuzzySearch';

describe('FuzzySearch Engine (Fuse.js pattern)', () => {
  it('calculates 0 score for exact matches', () => {
    expect(fuzzyScore('bruno', 'bruno')).toBe(0);
    expect(fuzzyScore('COLLAR', 'collar')).toBe(0);
  });

  it('calculates low score for prefix and substring matches', () => {
    const prefixScore = fuzzyScore('bru', 'bruno');
    expect(prefixScore).toBeLessThanOrEqual(0.2);

    const subScore = fuzzyScore('tag', 'smart tag collar');
    expect(subScore).toBeLessThanOrEqual(0.3);
  });

  it('tolerates single-character typos', () => {
    // "brnuo" instead of "bruno"
    const typoScore = fuzzyScore('brnuo', 'bruno');
    expect(typoScore).toBeLessThan(0.6);
  });

  it('ranks items properly in a multi-item search index', () => {
    const items: SearchableItem[] = [
      {
        id: '1',
        title: 'Smart Collar Tag',
        category: 'product',
        description: 'NFC QR smart pet recovery collar',
        tags: ['collar', 'tag', 'nfc']
      },
      {
        id: '2',
        title: 'Emergency Vet Clinic',
        category: 'service',
        description: '24/7 animal hospital and emergency room',
        tags: ['vet', 'clinic', 'emergency']
      },
      {
        id: '3',
        title: 'Dog Walking Service',
        category: 'service',
        description: 'Daily morning and evening pet exercise',
        tags: ['walk', 'dog']
      }
    ];

    const searcher = new FuzzySearcher(items);

    const collarResults = searcher.search('collar');
    expect(collarResults.length).toBeGreaterThan(0);
    expect(collarResults[0].item.id).toBe('1');

    const vetResults = searcher.search('emergency');
    expect(vetResults.length).toBeGreaterThan(0);
    expect(vetResults[0].item.id).toBe('2');

    const emptyResults = searcher.search('');
    expect(emptyResults).toEqual([]);
  });
});
