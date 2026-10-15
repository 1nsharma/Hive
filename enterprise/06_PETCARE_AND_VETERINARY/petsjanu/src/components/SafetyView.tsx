import React from 'react';
import { Shield, QrCode, AlertTriangle, Bell, Phone, MapPin, Check, ArrowRight, Lock } from 'lucide-react';

interface SafetyViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenPreorder: (type: string, price: string) => void;
}

export const SafetyView: React.FC<SafetyViewProps> = ({ onNavigateTab, onOpenAuth, onOpenPreorder }) => {
  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-[#175741] border border-emerald-200">
          <Shield className="w-3.5 h-3.5" /> PET SAFETY SYSTEM
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Never Worry About <span className="text-[#175741]">Losing Your Pet</span> Again
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-medium">
          Digital ID, QR/NFC smart tags, lost pet SOS alerts, and automated vaccine tracking designed specifically for pet parents in India.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Pillar 1: Digital Pet ID */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-xl">
            🪪
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1C2B23]">Digital Pet ID Passport</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Your pet's online profile stores photo, breed, age, medical conditions, allergies, and emergency contacts. Privacy controls keep your address hidden while giving finders quick access to call or message you.
          </p>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-mono text-[#175741] font-bold">
            Public URL: petsjanu.com/p/PET-IND-9021
          </div>
        </div>

        {/* Pillar 2: QR / NFC Smart Tags */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl">
            🏷️
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1C2B23]">QR &amp; NFC Smart Collar Tags</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Lightweight, waterproof tags engraved with a QR code and embedded with NFC. Anyone with a smartphone can scan or tap the tag to instantly view your pet's safety page and contact you.
          </p>
          <div className="flex gap-2 text-[11px] font-bold text-stone-700">
            <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">QR Sticker (₹149)</span>
            <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">NFC Tag (₹499)</span>
          </div>
        </div>

        {/* Pillar 3: Lost Pet SOS Alerts */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold text-xl">
            🚨
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1C2B23]">1-Tap Lost Pet SOS Broadcast</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            If your pet slips out, flip the Lost toggle in your dashboard. The public profile instantly updates to an emergency red banner, allowing finders to submit photo sightings with real-time map locations.
          </p>
          <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> Live WhatsApp &amp; Phone notification when scanned
          </div>
        </div>

        {/* Pillar 4: Vaccine & Health Reminders */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-xl">
            💉
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1C2B23]">Vaccination &amp; Deworming Tracker</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Keep track of Rabies, DHPPi, anti-tick treatments, and deworming. Automated notifications alert you 7 days before due dates so your pet stays healthy and compliant.
          </p>
          <div className="p-2.5 bg-emerald-50 text-[#175741] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" /> Verified schedule for Indian dogs &amp; cats
          </div>
        </div>

      </div>

      {/* Hardware Options Pre-order */}
      <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-[#175741] text-white space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold">Choose the Right Tag for Your Pet</h2>
          <p className="text-xs text-stone-200">Free pan-India delivery. 100% money back guarantee if you're not satisfied.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
            <h4 className="font-bold text-base text-amber-300">QR Sticker Pack</h4>
            <p className="text-2xl font-black">₹149 <span className="text-xs font-normal text-stone-300">/ 3 stickers</span></p>
            <p className="text-xs text-stone-200">Weatherproof stick-ons for collar tags, harnesses, or crates.</p>
            <button
              onClick={() => onOpenPreorder("QR Sticker Pack", "₹149")}
              className="w-full py-2 rounded-xl bg-[#F0A21E] text-stone-900 text-xs font-extrabold hover:bg-amber-400 cursor-pointer"
            >
              Order QR Stickers
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white/20 border-2 border-[#F0A21E] space-y-3 relative">
            <span className="absolute -top-3 right-4 bg-[#F0A21E] text-stone-900 text-[10px] font-black px-2 py-0.5 rounded">POPULAR</span>
            <h4 className="font-bold text-base text-amber-300">NFC + QR Smart Tag</h4>
            <p className="text-2xl font-black">₹499 <span className="text-xs font-normal text-stone-300">/ tag</span></p>
            <p className="text-xs text-stone-200">Durable, waterproof acrylic collar tag with NFC tap + QR code.</p>
            <button
              onClick={() => onOpenPreorder("NFC + QR Smart Tag", "₹499")}
              className="w-full py-2 rounded-xl bg-[#F0A21E] text-stone-900 text-xs font-extrabold hover:bg-amber-400 cursor-pointer"
            >
              Order Smart Tag
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
            <h4 className="font-bold text-base text-amber-300">Metal Premium Tag</h4>
            <p className="text-2xl font-black">₹999 <span className="text-xs font-normal text-stone-300">/ tag</span></p>
            <p className="text-xs text-stone-200">Laser-engraved solid brass/steel body for active dogs.</p>
            <button
              onClick={() => onOpenPreorder("Metal Premium Tag", "₹999")}
              className="w-full py-2 rounded-xl bg-[#F0A21E] text-stone-900 text-xs font-extrabold hover:bg-amber-400 cursor-pointer"
            >
              Order Metal Tag
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
