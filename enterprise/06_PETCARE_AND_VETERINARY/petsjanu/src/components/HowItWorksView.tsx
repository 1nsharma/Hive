import React from 'react';
import { ArrowRight, QrCode, Shield, Sparkles, CheckCircle2, PhoneCall, AlertTriangle, Heart } from 'lucide-react';

interface HowItWorksViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F0A21E]/20 text-amber-900 border border-[#F0A21E]/30">
          ✨ SIMPLE &amp; DEPENDABLE
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          How <span className="text-[#175741]">PetJanu</span> Keeps Your Pet Safe
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Four easy steps to give your dog or cat a lifelong digital safety net in India.
        </p>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Step 1 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-6 font-serif text-5xl font-black text-[#175741]/10">01</div>
          <div className="w-12 h-12 rounded-2xl bg-[#175741] text-white flex items-center justify-center font-bold text-xl">
            🐕
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">1. Create Pet Profile (Free)</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Fill in your pet's name, photo, breed, age, allergies, and emergency phone number (+91). Your pet gets a unique public link e.g. <span className="font-mono text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[#175741]">petsjanu.com/p/BRUNO-1029</span>.
          </p>
          <ul className="text-xs text-stone-600 space-y-2 pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> 100% Free digital ID card</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> Medical notes &amp; food allergies log</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> Owner phone masking for privacy</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-6 font-serif text-5xl font-black text-[#F0A21E]/20">02</div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0A21E] text-stone-900 flex items-center justify-center font-bold text-xl">
            🏷️
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">2. Get a Smart QR Tag (₹149)</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Order a durable, waterproof collar tag. Comes in QR sticker, NFC tap tag, or engraved metal finish. Delivered anywhere in India within 3–5 days.
          </p>
          <ul className="text-xs text-stone-600 space-y-2 pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> Scannable by any camera phone</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> No app required for finder</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> Free replacement if damaged</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-6 font-serif text-5xl font-black text-[#175741]/10">03</div>
          <div className="w-12 h-12 rounded-2xl bg-[#175741] text-white flex items-center justify-center font-bold text-xl">
            🤖
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">3. Stay Protected (AI + Reminders)</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Our 24/7 AI health assistant answers symptom queries in simple Hindi/English. Automated reminders notify you before vaccination or deworming due dates.
          </p>
          <ul className="text-xs text-stone-600 space-y-2 pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> 4-Level AI Risk Triage (Low to Urgent)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> Rabies &amp; DHPPi booster reminders</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#175741]" /> Instant tele-vet dispatch</li>
          </ul>
        </div>

        {/* Step 4 */}
        <div className="p-8 rounded-3xl bg-[#175741] text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-4 right-6 font-serif text-5xl font-black text-amber-400/20">04</div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0A21E] text-stone-900 flex items-center justify-center font-bold text-xl">
            🚨
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">4. If Lost, Anyone Scans → Reunites</h3>
          <p className="text-sm text-stone-200 leading-relaxed font-medium">
            Toggle "Lost Mode" on your phone. Anyone who scans the collar tag sees your emergency contact button, WhatsApp relay, and can drop a live GPS pin report.
          </p>
          <ul className="text-xs text-stone-200 space-y-2 pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F0A21E]" /> Immediate SMS &amp; WhatsApp alerts</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F0A21E]" /> Finder map pin &amp; photo report</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F0A21E]" /> Safe reunion in hours</li>
          </ul>
        </div>

      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#F0A21E]/20 border border-[#F0A21E] text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-[#1C2B23]">
          Ready to protect your furry family member?
        </h2>
        <p className="text-xs text-stone-700 max-w-lg mx-auto">
          It takes less than 60 seconds to create your pet's free digital profile on PetJanu.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-xl bg-[#175741] text-white font-extrabold text-xs hover:bg-[#175741]/90 shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            Create Free Profile Now <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab('pricing')}
            className="px-6 py-3 rounded-xl bg-white border border-[#E5DFD3] text-[#1C2B23] font-extrabold text-xs hover:bg-stone-50 transition-all cursor-pointer"
          >
            View Smart Tags (from ₹149)
          </button>
        </div>
      </div>

    </div>
  );
};
