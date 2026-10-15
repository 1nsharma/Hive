import type { Request, Response } from 'express';
import { SEEDED_PETS, SEEDED_SIGHTINGS } from '../../src/lib/mockData';

export default async function handler(req: Request, res: Response) {
  const { slug } = req.query;
  const slugStr = String(slug || '').toUpperCase();

  const pet = SEEDED_PETS.find(
    p => p.slug.toUpperCase() === slugStr || p.id.toUpperCase() === slugStr
  ) || SEEDED_PETS[0];

  const sightings = SEEDED_SIGHTINGS.filter(s => s.petId === pet.id);

  return res.status(200).json({
    pet,
    sightings,
    publicUrl: `/p/${pet.slug}`
  });
}
