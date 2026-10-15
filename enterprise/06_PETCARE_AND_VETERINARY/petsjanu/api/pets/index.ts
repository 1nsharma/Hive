import type { Request, Response } from 'express';
import { SEEDED_PETS } from '../../src/lib/mockData';

let pets = [...SEEDED_PETS];

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    return res.status(200).json({ pets });
  }

  if (req.method === 'POST') {
    const { name, species, breed, age, gender, weight, color, photoUrl, allergies, conditions, emergencyContact } = req.body;
    
    if (!name || !breed || !age) {
      return res.status(400).json({ error: 'Name, breed, and age are required' });
    }

    const slug = `PG-${name.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPet = {
      id: `pet-${Date.now()}`,
      slug,
      name,
      species: species || 'Dog',
      breed,
      age,
      gender: gender || 'Male',
      weight: weight || '10 kg',
      color: color || 'Brown',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
      allergies: allergies || 'None declared',
      conditions: conditions || 'None declared',
      isLost: false,
      emergencyContact: emergencyContact || { name: 'Amit Sharma (Junior Founder)', phone: '+91 63937 41171' },
      vaccinations: [
        { id: `v-${Date.now()}`, name: 'Initial Health Checkup', due: 'Immediate', done: true, type: 'checkup' as const }
      ],
      createdAt: new Date().toISOString()
    };

    pets.unshift(newPet);
    return res.status(201).json({ success: true, pet: newPet });
  }

  if (req.method === 'PUT') {
    const { petId, isLost } = req.body;
    const pet = pets.find(p => p.id === petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    pet.isLost = Boolean(isLost);
    return res.status(200).json({ success: true, pet });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
