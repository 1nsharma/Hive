import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Download, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Heart,
  Share2
} from 'lucide-react';
import { PassportCardData, downloadPassportCard } from '../lib/passportCardGenerator';
import { audioService } from '../lib/audioService';

interface DigitalHealthPassportProps {
  pet?: {
    name: string;
    slug: string;
    species: string;
    breed: string;
    age: string;
    gender: 'Male' | 'Female';
    weight: string;
    photoUrl: string;
    microchipId?: string;
    allergies: string;
    emergencyContact: {
      name: string;
      phone: string;
    };
  };
  setToast?: (msg: string) => void;
}

export const DigitalHealthPassport: React.FC<DigitalHealthPassportProps> = ({
  pet = {
    name: 'Bruno',
    slug: 'IND-PET-10293',
    species: 'Dog',
    breed: 'Indian Pariah / Desi Dog',
    age: '3 yrs',
    gender: 'Male',
    weight: '18 kg',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    microchipId: 'ISO-11784-984210',
    allergies: 'Chicken Protein Allergy · Sensitive Gut',
    emergencyContact: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210'
    }
  },
  setToast
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const cardData: PassportCardData = {
    petName: pet.name,
    slug: pet.slug,
    species: pet.species,
    breed: pet.breed,
    age: pet.age,
    gender: pet.gender,
    weight: pet.weight,
    photoUrl: pet.photoUrl,
    microchipId: pet.microchipId,
    bloodType: 'DEA 1.1 Positive',
    emergencyContact: pet.emergencyContact,
    allergies: pet.allergies,
    rabiesStatus: '✓ Valid till Oct 2026',
    coreVaccineDue: 'Nov 2026',
    vetClinicName: 'City Animal Care & Trauma Hospital (Bandra)',
    vetPhone: '+91 98200 12345'
  };

  const handleFlip = () => {
    audioService.playSuccess();
    setIsFlipped(!isFlipped);
  };

  const handleDownload = async (side: 'front' | 'back') => {
    audioService.playSuccess();
    setIsDownloading(true);
    try {
      await downloadPassportCard(cardData, side);
      setToast?.(`📥 Downloaded ${pet.name}'s Health Passport (${side.toUpperCase()}) in High-Res!`);
    } catch (err) {
      setToast?.('Error generating card download.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full card-premium p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8 bg-gradient-to-b from-stone-50/50 to-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono font-bold rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#175741]" /> OFFICIAL DIGITAL WALLET PASSPORT
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
            Emergency Health &amp; <span className="text-[#175741]">Wallet Card</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
            Standard credit card aspect ratio. Store in Apple/Google Wallet or print in physical card format.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleFlip}
            className="px-4 py-2.5 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" /> Flip Card ({isFlipped ? 'Front' : 'Back'})
          </button>
          <button
            onClick={() => handleDownload('front')}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-2xl font-black text-xs text-white cursor-pointer shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
            style={{ background: '#175741' }}
          >
            <Download className="w-3.5 h-3.5 text-amber-400" /> Download Front (PNG)
          </button>
          <button
            onClick={() => handleDownload('back')}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-2xl font-black text-xs text-stone-950 bg-amber-400 hover:bg-amber-300 cursor-pointer shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download Back (PNG)
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-stone-950 border border-stone-800 relative overflow-hidden shadow-2xl min-h-[420px]">
        {/* Ambient Glow */}
        <div
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F0A21E, transparent 70%)', filter: 'blur(80px)' }}
        />

        {/* 3D Flipping Card Container */}
        <div
          onClick={handleFlip}
          className="relative w-full max-w-xl aspect-[1.75/1] rounded-3xl cursor-pointer select-none transition-all duration-700 ease-out shadow-2xl"
          style={{
            transform: isFlipped ? 'rotateY(180deg) scale(1.02)' : 'rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* =========================================================
              CARD FRONT
             ========================================================= */}
          <div
            className={`absolute inset-0 rounded-3xl p-6 sm:p-7 border-2 border-amber-400/40 text-white flex flex-col justify-between overflow-hidden shadow-2xl ${
              isFlipped ? 'pointer-events-none' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #071410 0%, #0A1F17 50%, #0C2B1D 100%)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Front Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐾</span>
                <div>
                  <div className="font-serif font-black text-sm tracking-wider text-amber-400 uppercase">PETJANU HEALTH PASSPORT</div>
                  <div className="text-[9px] font-mono text-emerald-300">INDIA DPDP ACT 2023 COMPLIANT</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">
                  ID: {pet.slug}
                </span>
              </div>
            </div>

            {/* Front Body */}
            <div className="flex items-center gap-4 my-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
                <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1 overflow-hidden">
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wide uppercase truncate">
                  {pet.name}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium">
                  {pet.species} · {pet.breed}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-stone-300 pt-1">
                  <span>{pet.age}</span>
                  <span>·</span>
                  <span>{pet.gender}</span>
                  <span>·</span>
                  <span>{pet.weight}</span>
                </div>
              </div>

              <div className="ml-auto p-2 bg-white rounded-xl border border-white/20 shadow-md shrink-0 hidden sm:block">
                <QrCode className="w-14 h-14 text-stone-900" />
              </div>
            </div>

            {/* Front Footer: Emergency Box */}
            <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-sm">🚨</span>
                <div>
                  <div className="text-[9px] font-mono font-bold text-red-400 uppercase">24/7 EMERGENCY CONTACT</div>
                  <div className="font-bold text-white text-xs sm:text-sm">{pet.emergencyContact.name}: {pet.emergencyContact.phone}</div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-red-300 hidden sm:block">SCAN QR IF FOUND</span>
            </div>
          </div>

          {/* =========================================================
              CARD BACK (Rotated 180 deg)
             ========================================================= */}
          <div
            className={`absolute inset-0 rounded-3xl p-6 sm:p-7 border-2 border-emerald-400/40 text-white flex flex-col justify-between overflow-hidden shadow-2xl ${
              !isFlipped ? 'pointer-events-none' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #0A1F17 0%, #071410 50%, #040C09 100%)',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Back Header: Medical Alert Banner */}
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-200 text-xs truncate">
                  {cardData.allergies}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-400 shrink-0">ALLERGY ALERT</span>
            </div>

            {/* Back Middle: Vaccine Records */}
            <div className="space-y-2 my-auto">
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                VACCINATION &amp; MICROCHIP PASSPORT
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Rabies Vaccine</div>
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active (Oct 2026)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">DHPPi Booster</div>
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done (Nov 2026)
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1">
                <span>Microchip: <strong className="text-white">{pet.microchipId || 'ISO 11784 Active'}</strong></span>
                <span>Blood: <strong className="text-white">{cardData.bloodType}</strong></span>
              </div>
            </div>

            {/* Back Footer: Primary Vet */}
            <div className="p-2.5 rounded-xl bg-[#175741]/40 border border-emerald-500/40 flex items-center justify-between text-xs">
              <div>
                <div className="text-[9px] font-mono text-emerald-300 uppercase">PRIMARY VET CLINIC</div>
                <div className="font-bold text-white text-xs truncate">{cardData.vetClinicName}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono text-amber-400">EMERGENCY LINE</div>
                <div className="font-bold text-white text-xs">{cardData.vetPhone}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-stone-400 text-xs font-mono">
          {isFlipped ? '← Click to view front identity side' : 'Click card to view medical & vaccine back side →'}
        </div>
      </div>
    </div>
  );
};
