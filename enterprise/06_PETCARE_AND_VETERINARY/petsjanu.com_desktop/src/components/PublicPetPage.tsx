import React, { useState } from 'react';
import { Shield, AlertTriangle, Phone, MessageSquare, MapPin, Camera, Check, Clock, Send, ShieldCheck, Heart, Lock, Bell, CheckCircle2 } from 'lucide-react';
import { Pet, SightingReport } from '../types';
import { FoundPetPanel } from './FoundPetPanel';

interface PublicPetPageProps {
  pet: Pet;
  sightings: SightingReport[];
  onReportSighting: (report: Omit<SightingReport, 'id' | 'petId' | 'petName' | 'status'>) => void;
  onToggleLostStatus?: () => void;
  isOwner?: boolean;
}

export const PublicPetPage: React.FC<PublicPetPageProps> = ({
  pet,
  sightings,
  onReportSighting,
  onToggleLostStatus,
  isOwner
}) => {
  const [reporterLocation, setReporterLocation] = useState('');
  const [reporterNote, setReporterNote] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Secure Relay Contact Request State (Zero Paywall)
  const [contactReason, setContactReason] = useState('');
  const [finderDirectPhone, setFinderDirectPhone] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccessMessage, setContactSuccessMessage] = useState<string | null>(null);
  const [contactErrorMessage, setContactErrorMessage] = useState<string | null>(null);

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterLocation || !reporterNote) return;

    onReportSighting({
      location: reporterLocation,
      time: 'Just now',
      note: reporterNote,
      phone: reporterPhone || undefined,
      createdAt: new Date().toISOString()
    });

    setReportSubmitted(true);
  };

  const handleSecureContactRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactReason || contactReason.trim().length < 10) {
      setContactErrorMessage('Please provide a reason with at least 10 characters.');
      return;
    }

    setContactSubmitting(true);
    setContactErrorMessage(null);

    try {
      const response = await fetch(`/api/pets/${pet.slug || pet.id}/contact-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: contactReason,
          finderPhone: finderDirectPhone || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact request.');
      }

      setContactSuccessMessage(data.message || 'Secure contact request relayed to the owner successfully!');
      setContactReason('');
      setFinderDirectPhone('');
    } catch (err: any) {
      setContactErrorMessage(err.message || 'Could not connect to the relay service.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* EMERGENCY LOST BANNER */}
      {pet.isLost ? (
        <div className="p-5 rounded-3xl bg-red-600 text-white shadow-lg space-y-2 relative overflow-hidden animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
            <h2 className="text-xl font-black uppercase tracking-wide">🚨 EMERGENCY: LOST PET ALERT</h2>
          </div>
          <p className="text-xs text-red-100 leading-relaxed font-semibold">
            <strong>{pet.name}</strong> has been reported missing by their family! If you have found or seen {pet.name}, send an instant emergency alert below. 100% Free & Secure.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-emerald-800 text-white shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span>SAFE STATUS: Verified PetJanu Protected Tag Active</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-black uppercase">PROTECTED</span>
        </div>
      )}

      {/* Main Pet Profile Identity Card */}
      <div className="p-6 rounded-3xl border bg-[#FDFBF7] shadow-md space-y-5" style={{ borderColor: '#E5DFD3' }}>
        
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
          {/* Avatar */}
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 shadow-md shrink-0" style={{ borderColor: '#175741' }}>
            <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 bg-amber-400 text-stone-900 font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs">
              {pet.slug}
            </span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-stone-900">{pet.name}</h1>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200">
                {pet.species} · {pet.gender}
              </span>
            </div>

            <p className="text-xs text-stone-600 font-semibold">
              {pet.breed} · {pet.age} · {pet.weight} · {pet.color}
            </p>

            {pet.microchipId && (
              <div className="text-[11px] text-stone-500 font-medium bg-stone-100/80 px-2.5 py-1 rounded-lg w-fit mx-auto sm:mx-0 border" style={{ borderColor: '#E5DFD3' }}>
                Microchip ID: <strong className="text-stone-800">{pet.microchipId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Shield Notice & Direct Contact Relay */}
        <div className="p-4 bg-white rounded-2xl border space-y-3 shadow-xs" style={{ borderColor: '#E5DFD3' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Privacy Protected Relay Contact
            </span>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              Anti-Doxxing Enabled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${pet.emergencyContact.phone}`}
              className="py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-emerald-700 hover:bg-emerald-800 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Phone className="w-4 h-4" /> Call Relay ({pet.emergencyContact.name})
            </a>

            <a
              href={`https://wa.me/${pet.emergencyContact.phone.replace(/[^0-9]/g, '')}?text=Hi%2C%20I%20scanned%20the%20PetJanu%20QR%20tag%20for%20${pet.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#175741] hover:opacity-95 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Alert
            </a>
          </div>
        </div>

        {/* SECURE CONTACT REQUEST RELAY FORM (Zero Paywall / Free) */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Send Free Emergency Alert to Owner</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Have you found {pet.name} or have urgent information? Submit a message below. Our encrypted relay delivers it immediately to the owner without exposing your private data.
          </p>

          {contactSuccessMessage ? (
            <div className="p-3 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{contactSuccessMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSecureContactRequest} className="space-y-2.5">
              {contactErrorMessage && (
                <div className="p-2 bg-red-100 border border-red-200 rounded-lg text-[11px] text-red-800 font-semibold">
                  {contactErrorMessage}
                </div>
              )}
              <div>
                <input
                  type="text"
                  required
                  value={contactReason}
                  onChange={(e) => setContactReason(e.target.value)}
                  placeholder={`e.g. Found ${pet.name} safely near the park entrance, staying with guard...`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={finderDirectPhone}
                  onChange={(e) => setFinderDirectPhone(e.target.value)}
                  placeholder="Your phone number (optional)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {contactSubmitting ? 'Relaying...' : 'Send Free Alert'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Medical & Allergy Warning Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-red-950 space-y-1">
            <span className="text-[10px] font-black uppercase text-red-800 block">⚠️ Known Allergies</span>
            <p className="font-bold">{pet.allergies}</p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-800 block">🩺 Medical Conditions</span>
            <p className="font-bold">{pet.conditions}</p>
          </div>
        </div>

        {/* Owner Lost/Safe Toggle */}
        {isOwner && onToggleLostStatus && (
          <div className="p-3 bg-stone-100 rounded-2xl border flex items-center justify-between" style={{ borderColor: '#E5DFD3' }}>
            <span className="text-xs font-bold text-stone-800">Owner Safety Control:</span>
            <button
              onClick={onToggleLostStatus}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-xs cursor-pointer ${
                pet.isLost ? 'bg-emerald-700 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {pet.isLost ? 'Mark Pet as SAFE ✅' : 'Report Pet as LOST 🚨'}
            </button>
          </div>
        )}

      </div>

      {/* FOUND PET CITIZEN RADAR / LOCATION PING & WHATSAPP FALLBACK PANEL */}
      <FoundPetPanel
        petId={pet.slug || pet.id}
        petName={pet.name}
        whatsappEnabled={true}
        whatsappNumber={pet.emergencyContact?.phone || null}
        isLost={pet.isLost}
      />

      {/* CITIZEN SIGHTING REPORT FORM */}
      <div className="p-6 rounded-3xl border bg-white shadow-xs space-y-4" style={{ borderColor: '#E5DFD3' }}>
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-[#0E3D2F]">Spotted {pet.name}? Report Sighting Location</h3>
          <p className="text-xs text-stone-500">Your report immediately alerts the owner with GPS coordinates & time</p>
        </div>

        {reportSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <div className="text-2xl">✅</div>
            <h4 className="text-xs font-bold text-emerald-900">Sighting Report Submitted Successfully!</h4>
            <p className="text-[11px] text-stone-600">The owner has been notified. Thank you for keeping {pet.name} safe!</p>
          </div>
        ) : (
          <form onSubmit={handleSightingSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Sighting Location / Area *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={reporterLocation}
                  onChange={(e) => setReporterLocation(e.target.value)}
                  placeholder="e.g. Bandra Promenade near CCD"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-stone-50 text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Sighting Note & Behavior *
              </label>
              <textarea
                required
                value={reporterNote}
                onChange={(e) => setReporterNote(e.target.value)}
                placeholder="e.g. Sitting under green bench, wearing green tag, seems calm..."
                rows={2}
                className="w-full p-2.5 rounded-xl border bg-stone-50 text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Your Contact Number (Optional)
              </label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+91 98700 11223"
                className="w-full p-2.5 rounded-xl border bg-stone-50 text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 hover:opacity-95"
              style={{ backgroundColor: '#175741' }}
            >
              <Send className="w-4 h-4 text-amber-400" /> Send Instant Sighting Alert to Owner
            </button>
          </form>
        )}
      </div>

      {/* SIGHTING REPORTS LIST */}
      {sightings.length > 0 && (
        <div className="p-6 rounded-3xl border bg-white shadow-xs space-y-3" style={{ borderColor: '#E5DFD3' }}>
          <h3 className="text-sm font-extrabold text-stone-900">Recent Citizen Sightings ({sightings.length})</h3>
          
          <div className="space-y-3">
            {sightings.map((s) => (
              <div key={s.id} className="p-3 bg-stone-50 rounded-2xl border space-y-1 text-xs" style={{ borderColor: '#E5DFD3' }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" /> {s.location}
                  </span>
                  <span className="text-[10px] text-stone-400">{s.time}</span>
                </div>
                <p className="text-stone-600 italic">"{s.note}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
