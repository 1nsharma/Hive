import React, { useState } from 'react';
import { Shield, QrCode, AlertTriangle, Bell, Phone, Check, ArrowRight, Lock, Zap, Wifi, MapPin } from 'lucide-react';

interface SafetyViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenPreorder: (type: string, price: string) => void;
}

const PILLARS = [
  {
    icon: '🪪',
    title: 'Digital Pet ID Passport',
    desc: "Your pet's online profile stores photo, breed, age, medical conditions, allergies, and emergency contacts. Privacy controls keep your address hidden while giving finders quick access.",
    detail: 'Public URL: petsjanu.com/p/PET-IND-9021',
    accent: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100 text-[#175741]',
  },
  {
    icon: '🏷️',
    title: 'QR & NFC Smart Collar Tags',
    desc: "Lightweight, waterproof tags engraved with QR and embedded with NFC. Anyone with a smartphone can scan to instantly view your pet's safety page and contact you.",
    detail: 'QR Sticker (₹149) · NFC Tag (₹499) · Metal Tag (₹999)',
    accent: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-900',
  },
  {
    icon: '🚨',
    title: 'Hyper-Local SOS Alert System',
    desc: 'One toggle marks your pet as Lost. The system broadcasts to 148 nearby pet parents and 6 vet partner clinics within your selected radius — instantly.',
    detail: 'Coverage: 1km / 3km / 5km configurable radius',
    accent: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100 text-red-800',
  },
  {
    icon: '💉',
    title: 'Vaccination & Health Records',
    desc: 'Store all vaccine certificates, deworming dates, vet prescriptions, and annual checkup reports. Share a single link with any vet clinic in India.',
    detail: 'Auto-reminders via WhatsApp & SMS — free',
    accent: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100 text-blue-800',
  },
];

const SECURITY_FEATURES = [
  { icon: Lock,  title: 'Phone Number Masking',    desc: 'Your real number is never shown. Finders contact you through our secure relay.' },
  { icon: Wifi,  title: 'Zero App for Finders',    desc: "Any smartphone camera or NFC tap opens Bruno's page — no download required." },
  { icon: Zap,   title: 'Real-Time Scan Alerts',   desc: "You get a WhatsApp & SMS the moment anyone scans your pet's tag, anywhere in India." },
  { icon: MapPin, title: 'Sighting Reports Map',   desc: 'Community members file geotagged sighting reports to help you locate your lost pet.' },
];

export const SafetyView: React.FC<SafetyViewProps> = ({ onNavigateTab, onOpenAuth, onOpenPreorder }) => {
  const [activeSecIdx, setActiveSecIdx] = useState(0);

  return (
    <div className="view-enter pb-16">
      {/* Dark hero header */}
      <div
        className="dark-section -mx-4 px-4 py-16 text-center relative mb-12"
        style={{ marginTop: '-1rem' }}
      >
        <div className="absolute top-0 right-1/4 w-96 h-64 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #175741, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #F0A21E, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <Shield className="w-3.5 h-3.5" /> PET SAFETY SYSTEM
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            Never worry about <br /><span className="text-amber-400">losing your pet</span> again
          </h1>
          <p className="text-slate-300 text-base font-medium leading-relaxed max-w-lg mx-auto">
            Digital ID, QR/NFC smart tags, lost pet SOS alerts, and automated vaccine tracking designed for India.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button onClick={onOpenAuth} className="px-7 py-3 rounded-2xl font-black text-sm text-white cursor-pointer" style={{ background: '#175741' }}>
              Protect My Pet Free <ArrowRight className="inline w-4 h-4 text-amber-400 ml-1" />
            </button>
            <button onClick={() => onOpenPreorder('NFC + QR Collar Tag', '₹499')} className="px-7 py-3 rounded-2xl font-black text-sm text-amber-300 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer transition-all">
              Pre-order Tag (₹499)
            </button>
          </div>
        </div>

        <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 48L480 16L960 40L1440 4V48H0Z" fill="#FBF6EC" />
        </svg>
      </div>

      {/* 4 Pillars bento grid */}
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[#175741] text-xs font-bold rounded-full border border-emerald-200">
            4 PILLARS OF PET SAFETY
          </div>
          <h2 className="text-3xl font-serif font-black text-stone-900">Complete protection, <span className="text-[#175741] italic">built in layers.</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PILLARS.map(({ icon, title, desc, detail, accent, iconBg }) => (
            <div key={title} className={`card-premium p-6 space-y-3 border ${accent}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${iconBg}`}>{icon}</div>
              <h3 className="font-serif font-bold text-lg text-stone-900">{title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">{desc}</p>
              <div className="text-[11px] font-mono font-bold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                {detail}
              </div>
            </div>
          ))}
        </div>

        {/* Security deep-dive interactive section */}
        <div
          className="rounded-3xl p-8 space-y-6 border"
          style={{ background: 'linear-gradient(145deg, #071410, #0A1F17)', borderColor: 'rgba(23,87,65,0.4)' }}
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/25">
              <Lock className="w-3.5 h-3.5" /> SECURITY & PRIVACY DESIGN
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">Built to protect <span className="text-amber-400">you & Bruno.</span></h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SECURITY_FEATURES.map(({ icon: Icon, title }, i) => (
              <button
                key={title}
                onClick={() => setActiveSecIdx(i)}
                className={`p-3 rounded-2xl text-xs font-bold text-center cursor-pointer transition-all border ${
                  activeSecIdx === i
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1.5" />
                {title}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-white/10 text-slate-200 text-sm leading-relaxed font-medium" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong className="block text-white mb-1">{SECURITY_FEATURES[activeSecIdx].title}</strong>
            {SECURITY_FEATURES[activeSecIdx].desc}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl font-black text-stone-900">Your pet deserves a <span className="text-[#175741]">safety net.</span></h2>
          <button onClick={onOpenAuth} className="px-8 py-4 rounded-2xl font-black text-white text-sm cursor-pointer shadow-lg" style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}>
            Create Free Pet Profile <ArrowRight className="inline w-4 h-4 text-amber-400 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
