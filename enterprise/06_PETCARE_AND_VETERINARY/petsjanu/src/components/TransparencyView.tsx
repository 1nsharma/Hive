import React from 'react';
import { DollarSign, Award, Users, ShieldCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface TransparencyViewProps {
  onNavigateTab: (tab: string) => void;
}

export const TransparencyView: React.FC<TransparencyViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-stone-200 text-stone-900 border border-stone-300">
          <FileText className="w-4 h-4 text-[#175741]" /> PUBLIC TRANSPARENCY REPORT
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Openness &amp; Business <span className="text-[#175741]">Ethics</span>
        </h1>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-medium">
          We believe pet care platforms must be completely honest about how they make money, select partners, and handle user feedback.
        </p>
      </div>

      {/* Business Model Breakdown */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#175741] flex items-center justify-center text-xl font-bold">
            💰
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C2B23]">1. How PetJanu Makes Money (Business Model)</h2>
            <p className="text-xs text-stone-500">Zero banner ads. Zero sponsored medical rankings. Zero data selling.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 font-medium">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
            <h4 className="font-bold text-[#175741] text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct Revenue (Hardware &amp; Care)
            </h4>
            <p className="text-[11px] text-stone-600">
              We charge direct, transparent prices for physical smart QR collar tags (₹299–₹699) and optional premium AI pet care subscriptions (₹149/mo).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vet &amp; Groomer Commissions
            </h4>
            <p className="text-[11px] text-stone-500">
              When you book a clinic appointment or grooming session through PetJanu, we charge service providers a standard 5% platform service fee.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Network & Vendor Vetting */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <h2 className="font-serif text-xl font-bold text-[#1C2B23] border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
          2. Partner Vetting &amp; Conflict of Interest Policy
        </h2>
        <div className="space-y-4 text-xs text-stone-600 font-medium leading-relaxed">
          <p>
            <strong>Veterinary Verification:</strong> Every veterinary clinic listed on PetJanu must submit valid Veterinary Council of India (VCI) registration numbers and facility safety licenses.
          </p>
          <p>
            <strong>Conflict of Interest Guarantee:</strong> Clinic recommendations in our AI assistant and marketplace are strictly based on proximity, user ratings, and medical suitability — never paid sponsorship or hidden placement auctions.
          </p>
        </div>
      </div>

      {/* Complaint & Dispute Resolution */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <h2 className="font-serif text-xl font-bold text-[#1C2B23] border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
          3. Public Complaint Handling &amp; SLA Commitment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="font-extrabold text-2xl text-[#175741]">&lt; 2 Hours</div>
            <p className="text-[10px] text-stone-600 font-bold mt-1">Lost Pet Emergency Response</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="font-extrabold text-2xl text-[#175741]">&lt; 24 Hours</div>
            <p className="text-[10px] text-stone-600 font-bold mt-1">General Support SLA</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="font-extrabold text-2xl text-[#175741]">100% Refund</div>
            <p className="text-[10px] text-stone-600 font-bold mt-1">7-Day Tag Guarantee</p>
          </div>
        </div>
      </div>

    </div>
  );
};
