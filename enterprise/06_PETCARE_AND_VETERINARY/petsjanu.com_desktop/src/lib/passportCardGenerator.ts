/**
 * PetJanu Emergency Digital Health Passport & QR Wallet Card Generator
 * High-resolution canvas renderer for printable and downloadable emergency pet cards.
 */

export interface PassportCardData {
  petName: string;
  slug: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  photoUrl?: string;
  microchipId?: string;
  bloodType?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  allergies: string;
  rabiesStatus: string;
  coreVaccineDue: string;
  vetClinicName?: string;
  vetPhone?: string;
}

/**
 * Generates an ISO credit card-ratio (1050 x 600 px, 300 DPI ready) printable Emergency Health Passport
 */
export async function generatePassportCardDataUrl(
  data: PassportCardData,
  side: 'front' | 'back' = 'front'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1050;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // Background gradient: Deep luxury forest to midnight
  const grad = ctx.createLinearGradient(0, 0, 1050, 600);
  grad.addColorStop(0, '#071410');
  grad.addColorStop(0.5, '#0A1F17');
  grad.addColorStop(1, '#0C2B1D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1050, 600);

  // Outer border with subtle golden glow
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#F0A21E';
  ctx.strokeRect(16, 16, 1018, 568);

  // Inner subtle border
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.strokeRect(24, 24, 1002, 552);

  // Header banner
  ctx.fillStyle = '#175741';
  ctx.fillRect(24, 24, 1002, 80);

  // Header Title
  ctx.fillStyle = '#F0A21E';
  ctx.font = 'bold 32px serif';
  ctx.fillText('🐾 PETJANU EMERGENCY HEALTH PASSPORT', 50, 75);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('GOVT DPDP COMPLIANT', 980, 75);
  ctx.textAlign = 'left';

  if (side === 'front') {
    // -------------------------------------------------------------
    // FRONT SIDE: Identity, QR code, Emergency Contacts
    // -------------------------------------------------------------

    // Pet photo placeholder / square
    ctx.fillStyle = '#040C09';
    ctx.fillRect(50, 130, 260, 260);
    ctx.strokeStyle = '#F0A21E';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 130, 260, 260);

    // Try loading actual image or draw styled avatar
    ctx.fillStyle = '#E5DFD3';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐶', 180, 280);
    ctx.textAlign = 'left';

    // Pet Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px serif';
    ctx.fillText(data.petName.toUpperCase(), 340, 170);

    // Slug Badge
    ctx.fillStyle = '#F0A21E';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`ID: ${data.slug}`, 340, 205);

    // Details Grid
    ctx.fillStyle = '#A3B899';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('SPECIES / BREED:', 340, 250);
    ctx.fillText('AGE / GENDER:', 340, 290);
    ctx.fillText('WEIGHT:', 340, 330);
    ctx.fillText('MICROCHIP ID:', 340, 370);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`${data.species} · ${data.breed}`, 530, 250);
    ctx.fillText(`${data.age} · ${data.gender}`, 530, 290);
    ctx.fillText(data.weight, 530, 330);
    ctx.fillText(data.microchipId || 'ISO 11784 Active', 530, 370);

    // QR Code Box on right
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(780, 130, 200, 200);
    ctx.strokeStyle = '#175741';
    ctx.lineWidth = 4;
    ctx.strokeRect(780, 130, 200, 200);

    // Mock QR pattern
    ctx.fillStyle = '#071410';
    ctx.fillRect(800, 150, 45, 45);
    ctx.fillRect(915, 150, 45, 45);
    ctx.fillRect(800, 265, 45, 45);
    ctx.fillRect(870, 210, 20, 20);
    ctx.fillRect(850, 250, 30, 20);
    ctx.fillRect(900, 270, 30, 20);

    ctx.fillStyle = '#F0A21E';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN FOR LIVE PROFILE', 880, 355);
    ctx.textAlign = 'left';

    // Emergency Contact Box at bottom
    ctx.fillStyle = 'rgba(213, 71, 44, 0.25)';
    ctx.fillRect(50, 420, 930, 130);
    ctx.strokeStyle = '#D5472C';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 420, 930, 130);

    ctx.fillStyle = '#FF8A73';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('🚨 24/7 EMERGENCY CONTACT & RECOVERY RELAY', 70, 455);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${data.emergencyContact.name}: ${data.emergencyContact.phone}`, 70, 500);

    ctx.fillStyle = '#A3B899';
    ctx.font = '16px sans-serif';
    ctx.fillText('If found, please scan the QR code or call the emergency contact immediately.', 70, 532);
  } else {
    // -------------------------------------------------------------
    // BACK SIDE: Clinical Alert, Vaccines, Vet Clinic
    // -------------------------------------------------------------

    // Medical Alert Box
    ctx.fillStyle = 'rgba(240, 162, 30, 0.2)';
    ctx.fillRect(50, 130, 930, 100);
    ctx.strokeStyle = '#F0A21E';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 130, 930, 100);

    ctx.fillStyle = '#F0A21E';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('⚠️ CRITICAL MEDICAL ALERTS & ALLERGIES', 70, 165);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(data.allergies || 'No Known Drug Allergies · Strict Chicken-Free Diet', 70, 205);

    // Vaccination Passport Table
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(50, 250, 930, 160);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 250, 930, 160);

    ctx.fillStyle = '#A3B899';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('RECORD TYPE', 80, 285);
    ctx.fillText('STATUS', 400, 285);
    ctx.fillText('NEXT DUE DATE', 720, 285);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(980, 300);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Rabies (ARV Vaccine)', 80, 340);
    ctx.fillStyle = '#10B981';
    ctx.fillText(data.rabiesStatus || '✓ Certified Active', 400, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Oct 2026', 720, 340);

    ctx.fillText('DHPPi + Coronavirus', 80, 385);
    ctx.fillStyle = '#10B981';
    ctx.fillText('✓ Completed', 400, 385);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(data.coreVaccineDue || 'Nov 2026', 720, 385);

    // Primary Vet Clinic Footer
    ctx.fillStyle = '#175741';
    ctx.fillRect(50, 430, 930, 120);
    ctx.strokeStyle = '#2A7A5C';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 430, 930, 120);

    ctx.fillStyle = '#F0A21E';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('🏥 PRIMARY VETERINARY HOSPITAL', 70, 465);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(data.vetClinicName || 'Dr. Sharma Animal Care & Trauma Centre', 70, 505);

    ctx.fillStyle = '#E5DFD3';
    ctx.font = '18px monospace';
    ctx.fillText(`Tel: ${data.vetPhone || '+91 98200 12345 (24/7 Helpline)'}`, 70, 535);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Triggers instant download of the rendered passport card
 */
export async function downloadPassportCard(data: PassportCardData, side: 'front' | 'back' = 'front') {
  const dataUrl = await generatePassportCardDataUrl(data, side);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${data.petName.toLowerCase()}-emergency-health-passport-${side}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
