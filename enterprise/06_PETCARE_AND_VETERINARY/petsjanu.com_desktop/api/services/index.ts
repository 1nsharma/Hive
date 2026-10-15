import type { Request, Response } from 'express';
import { SEEDED_SERVICES } from '../../src/lib/mockData';

export default async function handler(req: Request, res: Response) {
  return res.status(200).json({ services: SEEDED_SERVICES });
}
