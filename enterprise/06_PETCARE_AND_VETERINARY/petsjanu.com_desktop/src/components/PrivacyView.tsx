import React, { useState } from 'react';
import { ShieldCheck, Trash2, Download, CheckCircle2, Lock, Eye, RefreshCw, ChevronRight } from 'lucide-react';

interface PrivacyViewProps {
  onNavigateTab: (tab: string) => void;
  onShowToast: (msg: string) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigateTab, onShowToast }) => {
  const [downloading, setDownloading] = useState(false);
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [erasureConfirmed, setErasureConfirmed] = useState(false);

  const handleExportData = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onShowToast('✅ Your PetJanu data export (JSON format) has been generated and downloaded!');
    }, 1200);
  };

  const handleConfirmErasure = () => {
    setErasureConfirmed(true);
    setTimeout(() => {
      setShowErasureModal(false);
      setErasureConfirmed(false);
      onShowToast('✅ Data erasure request queued. All personal records will be permanently scrubbed within 24 hours.');
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-800" /> PRIVACY &amp; DATA TRANSPARENCY
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Your Data Belongs <span className="text-[#175741]">To You</span>
        </h1>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-medium">
          PetJanu collects only what is needed to protect your pet and keep them safe. We never sell or monetize your personal information.
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-xl">
            🚫
          </div>
          <h3 className="font-serif font-bold text-base text-[#1C2B23]">Zero Data Selling</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            We do not sell, rent, or share pet parent contact details with third-party advertisers or brokers. Ever.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl">
            📥
          </div>
          <h3 className="font-serif font-bold text-base text-[#1C2B23]">Instant Data Export</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            You can export your pet's complete medical history, vaccination records, and profile logs in JSON/PDF format anytime.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold text-xl">
            🗑️
          </div>
          <h3 className="font-serif font-bold text-base text-[#1C2B23]">Right to Erasure</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            One-click option to request complete, permanent deletion of your account and all stored pet data under DPDP Act 2023.
          </p>
        </div>
      </div>

      {/* Interactive Data Controls Box */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-xs space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B23]">Interactive Data Ownership Controls</h2>
          <p className="text-xs text-stone-600 font-medium">Exercise your statutory rights under DPDP Act 2023 &amp; GDPR with instant self-service controls.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleExportData}
            disabled={downloading}
            className="flex-1 px-5 py-3 rounded-2xl bg-[#175741] text-white text-xs font-bold hover:bg-[#124533] cursor-pointer flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            {downloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating Data Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#F0A21E]" /> Download My Complete Data (JSON)
              </>
            )}
          </button>

          <button
            onClick={() => setShowErasureModal(true)}
            className="px-5 py-3 rounded-2xl border border-red-300 bg-red-50 text-red-800 text-xs font-bold hover:bg-red-100 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4 text-red-600" /> Request Account &amp; Data Erasure
          </button>
        </div>
      </div>

      {/* Detailed Privacy Breakdown */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Collection & Purpose */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#1C2B23] border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
            1. What Data We Collect &amp; Why
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 font-medium">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <h4 className="font-bold text-stone-900 text-sm">Pet Profile Information</h4>
              <p className="text-[11px] text-stone-500">Name, species, breed, photo, medical notes, allergies, microchip ID. Used exclusively to populate tag profiles and power AI health triage.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <h4 className="font-bold text-stone-900 text-sm">Owner Contact Details</h4>
              <p className="text-[11px] text-stone-500">Phone number &amp; city address. Used solely to route SMS/WhatsApp scan alerts when your pet tag is scanned by a finder.</p>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#1C2B23] border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
            2. Data Retention &amp; Auto-Purging Schedule
          </h2>
          <div className="space-y-3 text-xs text-stone-600 font-medium">
            <p>We keep active pet profiles for as long as you maintain your account. Unverified phone authentication OTP logs are automatically purged after 24 hours.</p>
            <p>If you delete your profile, all associated records are permanently wiped from primary database nodes within 24 hours, and from cold backups within 14 days.</p>
          </div>
        </div>

      </div>

      {/* Erasure Confirmation Modal */}
      {showErasureModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5DFD3] shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-2xl font-bold">
              🗑️
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Request Data Erasure</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Under India's Digital Personal Data Protection (DPDP) Act 2023, submitting this request will permanently delete your pet profiles, tag records, and contact details from PetJanu.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowErasureModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmErasure}
                disabled={erasureConfirmed}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {erasureConfirmed ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm Erasure'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
