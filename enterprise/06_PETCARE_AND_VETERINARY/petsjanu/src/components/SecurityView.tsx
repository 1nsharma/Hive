import React from 'react';
import { Shield, Lock, Server, FileCheck, EyeOff, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

interface SecurityViewProps {
  onNavigateTab: (tab: string) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-[#175741] border border-emerald-300">
          <Shield className="w-4 h-4 text-[#175741]" /> BANK-GRADE DATA SECURITY
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Security &amp; Infrastructure <span className="text-[#175741]">Architecture</span>
        </h1>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed font-medium">
          How PetJanu protects pet health records, identity tags, and owner contact details across India with end-to-end encryption.
        </p>
      </div>

      {/* Trust Guarantee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="p-5 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-2 text-center">
          <Lock className="w-7 h-7 text-[#175741] mx-auto" />
          <h3 className="font-serif font-bold text-sm text-[#1C2B23]">AES-256 Encryption</h3>
          <p className="text-[11px] text-stone-500">All data encrypted at rest and TLS 1.3 in transit</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-2 text-center">
          <Server className="w-7 h-7 text-[#175741] mx-auto" />
          <h3 className="font-serif font-bold text-sm text-[#1C2B23]">Indian Cloud Servers</h3>
          <p className="text-[11px] text-stone-500">Hosted securely in ISO 27001 Mumbai datacenter</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-2 text-center">
          <EyeOff className="w-7 h-7 text-[#175741] mx-auto" />
          <h3 className="font-serif font-bold text-sm text-[#1C2B23]">Phone Masking</h3>
          <p className="text-[11px] text-stone-500">Tag scanners never see your private personal phone number</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-2 text-center">
          <FileCheck className="w-7 h-7 text-[#175741] mx-auto" />
          <h3 className="font-serif font-bold text-sm text-[#1C2B23]">DPDP Act 2023</h3>
          <p className="text-[11px] text-stone-500">Compliant with Indian Digital Data Protection Act</p>
        </div>
      </div>

      {/* Detailed Technical Security Breakdown */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B23] border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
            1. Encryption &amp; Data Storage Standards
          </h2>
          <div className="space-y-4 text-xs text-stone-600 leading-relaxed font-medium">
            <p>
              Every piece of information stored on PetJanu — including pet vaccination records, microchip IDs, and medical notes — is encrypted using <strong>256-bit Advanced Encryption Standard (AES-256)</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Data in Transit
                </h4>
                <p className="text-[11px] text-stone-500">All browser-to-server traffic uses TLS 1.3 encryption over HTTPS with mandatory HSTS preloading.</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Data at Rest
                </h4>
                <p className="text-[11px] text-stone-500">Stored in encrypted Firebase Firestore and PostgreSQL clusters with automated daily offsite snapshots.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B23] border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
            2. Smart QR Tag Security &amp; Contact Masking
          </h2>
          <div className="space-y-4 text-xs text-stone-600 leading-relaxed font-medium">
            <p>
              When a good Samaritan scans your pet’s physical collar tag, they are routed to a secure, lightweight public profile page.
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Zero Exposure of Full Phone Numbers:</strong> Finders click a "Call Owner" or "WhatsApp Owner" button powered by encrypted proxy relays.</li>
              <li><strong>Optional PIN Protection:</strong> Owners can lock sensitive medical histories behind an owner PIN.</li>
              <li><strong>Instant Scan Alerts:</strong> The moment a tag is scanned, you receive an automated SMS &amp; WhatsApp alert with the scanner’s approximate GPS location (with their consent).</li>
            </ul>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1C2B23] border-b pb-4" style={{ borderColor: '#F0EBE1' }}>
            3. Vulnerability Audits &amp; Incident Response
          </h2>
          <div className="space-y-4 text-xs text-stone-600 leading-relaxed font-medium">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> 24-Hour Public Breach Notification Commitment
              </div>
              <p className="text-[11px] text-stone-600">
                In the unlikely event of a security incident affecting user data, PetJanu commits to notifying affected users via SMS &amp; email within <strong>24 hours</strong> of discovery, detailing the exact nature, scope, and corrective actions taken.
              </p>
            </div>
          </div>
        </div>

        {/* Action Link to Privacy Policy */}
        <div className="p-6 rounded-3xl bg-[#175741] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg">Have questions about your data rights?</h3>
            <p className="text-xs text-stone-200 mt-0.5">Read our full transparent Privacy Policy or request a data export.</p>
          </div>
          <button
            onClick={() => onNavigateTab('privacy')}
            className="px-4 py-2.5 rounded-xl bg-[#F0A21E] text-amber-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            View Privacy Policy <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
