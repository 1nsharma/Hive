import { Product, RequestItem } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'The Lost 1998 Pilot Script',
    description: 'An original, unproduced pilot script for a sci-fi series that never aired. Only 3 physical copies exist. Found in a closed-down studio lot.',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800',
    category: 'Media',
    stock: 1
  },
  {
    id: 'p2',
    title: 'Analog Dream Synthesizer (Prototype)',
    description: 'A hand-wired synthesizer built by an anonymous engineer in the late 70s. Produces tones that digital synths cannot replicate.',
    price: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1598508905848-35beab0cb13c?auto=format&fit=crop&q=80&w=800',
    category: 'Instruments',
    stock: 1,
    affiliateLink: 'https://amazon.com',
    affiliateName: 'Amazon'
  },
  {
    id: 'p3',
    title: 'Hand-Forged Damascus Chef Knife',
    description: 'Created by a hermit blacksmith in the mountains of Kyoto. Not listed in any online registry or catalog.',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800',
    category: 'Culinary',
    stock: 2
  },
  {
    id: 'p4',
    title: 'Unlabeled Vintage Cassette Tape',
    description: 'Contains a complete, unreleased acoustic set from a legendary 90s alternative band. Sourced directly from a former sound engineer.',
    price: 200,
    imageUrl: 'https://images.unsplash.com/photo-1570534293967-0c7f216867ff?auto=format&fit=crop&q=80&w=800',
    category: 'Media',
    stock: 1,
    affiliateLink: 'https://ebay.com',
    affiliateName: 'eBay'
  },
  {
    id: 'p5',
    title: 'First-Edition "Invisible" Playing Cards',
    description: 'A deck of cards printed with specialized ink that only reveals the suits and numbers under a specific UV light (included).',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800',
    category: 'Curiosities',
    stock: 5
  },
  {
    id: 'p6',
    title: 'Hand-Bound Leather Grimoire (Blank)',
    description: 'Crafted using medieval bookbinding techniques. The paper is hand-pressed and the leather is sourced ethically. No barcode, no brand.',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    category: 'Artifacts',
    stock: 3
  }
];

export const MOCK_REQUESTS: RequestItem[] = [
  {
    id: 'r1',
    title: 'Discontinued "Moonlight" Perfume (1994)',
    description: 'Looking for a half-empty or full bottle of this specific discontinued perfume from a local Parisian brand.',
    status: 'searching',
    dateRequested: '2026-06-20'
  },
  {
    id: 'r2',
    title: 'Childhood Wooden Train (Handmade, 1980s)',
    description: 'Trying to find the exact model of a wooden train sold in a small boutique in Maine around 1985.',
    status: 'pending',
    dateRequested: '2026-06-25'
  }
];
