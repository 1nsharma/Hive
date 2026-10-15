import { describe, it, expect } from 'vitest';
import { PassportCardData } from '../passportCardGenerator';

describe('Emergency Digital Health Passport Generator', () => {
  it('validates passport card data structure', () => {
    const cardData: PassportCardData = {
      petName: 'Bruno',
      slug: 'IND-PET-10293',
      species: 'Dog',
      breed: 'Indian Pariah / Desi Dog',
      age: '3 yrs',
      gender: 'Male',
      weight: '18 kg',
      allergies: 'Chicken protein allergy',
      rabiesStatus: '✓ Valid till Oct 2026',
      coreVaccineDue: 'Nov 2026',
      emergencyContact: {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210'
      }
    };

    expect(cardData.petName).toBe('Bruno');
    expect(cardData.emergencyContact.phone).toContain('+91');
    expect(cardData.rabiesStatus).toContain('Valid');
  });
});
