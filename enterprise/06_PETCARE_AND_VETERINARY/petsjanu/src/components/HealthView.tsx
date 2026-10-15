import React, { useState } from 'react';
import { Sparkles, Calendar, Stethoscope, Scissors, Check, AlertCircle, ArrowRight, Phone } from 'lucide-react';

interface HealthViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const HealthView: React.FC<HealthViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vet' | 'grooming' | 'ai'>('all');

  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F0A21E]/20 text-amber-900 border border-[#F0A21E]/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 24/7 PET HEALTH &amp; CARE
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Expert <span className="text-[#175741]">Healthcare &amp; Grooming</span> for Your Pet
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-medium">
          Combine instant AI symptom guidance with trusted tele-vets, home grooming, and medical history tracking.
        </p>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        {/* Card 1: AI Health Assistant */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-2xl">
              🤖
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1C2B23]">AI Health Guidance</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Ask anything about symptoms, diet, vomiting, tick fever, or food allergies. Get instant 4-level risk triage (Low, Monitor, See Vet, Urgent) with vet guardrails.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Free 24/7 access</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Hinglish &amp; English support</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Emergency clinic locator</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('ai')}
            className="w-full py-2.5 rounded-xl bg-[#175741] text-white font-extrabold text-xs hover:bg-[#175741]/90 shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            Chat with AI Health Assistant <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Vet Consultations */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-2xl">
              🩺
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif font-bold text-xl text-[#1C2B23]">Vet Consultation</h3>
              <span className="font-black text-[#175741] text-lg">₹500</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Book a video or home consultation with licensed Indian veterinarians. Get digital prescriptions sent directly to your phone via WhatsApp.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Verified VCI-registered doctors</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Follow-up chat included</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Prescription PDF generation</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('services')}
            className="w-full py-2.5 rounded-xl bg-[#175741] text-white font-extrabold text-xs hover:bg-[#175741]/90 shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            Book Vet Consultation (₹500) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Grooming Sessions */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-2xl">
              ✂️
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif font-bold text-xl text-[#1C2B23]">Pet Grooming</h3>
              <span className="font-black text-[#175741] text-lg">₹800</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Professional bath, haircut, nail clipping, and anti-tick treatment at your doorstep or partner grooming salons in major Indian cities.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Gentle, stress-free handling</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Medicated shampoo for sensitive skin</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741]" /> Ear cleaning &amp; paw butter bath</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('services')}
            className="w-full py-2.5 rounded-xl bg-[#175741] text-white font-extrabold text-xs hover:bg-[#175741]/90 shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            Book Grooming Session (₹800) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Vaccination Schedule Table */}
      <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B23]">Recommended Vaccination Schedule for Dogs in India</h2>
          <p className="text-xs text-stone-500">Vet-approved schedule following Indian Veterinary Association guidelines.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5DFD3] text-stone-500 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Vaccine Name</th>
                <th className="py-3 px-4">Protects Against</th>
                <th className="py-3 px-4">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              <tr>
                <td className="py-3 px-4 font-bold text-[#175741]">6 – 8 Weeks</td>
                <td className="py-3 px-4">DHPPi Booster #1</td>
                <td className="py-3 px-4">Distemper, Hepatitis, Parvovirus, Parainfluenza</td>
                <td className="py-3 px-4">Initial Dose</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#175741]">10 – 12 Weeks</td>
                <td className="py-3 px-4">DHPPi Booster #2 + Corona</td>
                <td className="py-3 px-4">Core viral diseases &amp; Coronavirus</td>
                <td className="py-3 px-4">Second Dose</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#175741]">14 – 16 Weeks</td>
                <td className="py-3 px-4">Rabies Vaccine (ARV)</td>
                <td className="py-3 px-4">Rabies Virus (Mandatory by Indian law)</td>
                <td className="py-3 px-4">First Dose</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#175741]">Annual (Every 1 Year)</td>
                <td className="py-3 px-4">DHPPi + Anti-Rabies Annual Booster</td>
                <td className="py-3 px-4">Full immunity renewal</td>
                <td className="py-3 px-4">Yearly Renewal</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#175741]">Every 3 Months</td>
                <td className="py-3 px-4">Deworming Tablet</td>
                <td className="py-3 px-4">Tapeworms, Hookworms, Roundworms</td>
                <td className="py-3 px-4">Quarterly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
