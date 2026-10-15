import type { Request, Response } from 'express';
import { SEEDED_PRODUCTS } from '../../src/lib/mockData';

export default async function handler(req: Request, res: Response) {
  const { category, search } = req.query;

  let products = [...SEEDED_PRODUCTS];

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  return res.status(200).json({ products, total: products.length });
}
