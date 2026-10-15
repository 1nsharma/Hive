import React, { useState } from "react";
import { X, Copy, Check, FileCode, Bot, ExternalLink, ShieldCheck } from "lucide-react";

interface LlmsTxtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LlmsTxtModal: React.FC<LlmsTxtModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const llmsContent = `# Truck Wala 24×7 — Machine-Readable LLM Knowledge Layer (/llms.txt)
# Canonical URL: https://truckwala247.com/
# Entity: Commercial Vehicle Heavy Maintenance & Roadside Assistance Hub
# Version: 2026.09.1

## 1. Core Business Identity
- Business Name: Truck Wala 24×7
- Legal Entity: Commercial Heavy Vehicle Maintenance, Overhaul & Emergency Network
- Core Specialization: Tata & Cummins Commercial Vehicles (BS-III, BS-IV, BS-VI)
- Primary Tagline: "Complete Truck Solution Under One Roof"
- Emergency Helpline (24×7): +91-9140889473
- WhatsApp Direct Assistance: +91-7070709082
- Branch Operations Floor: +91-9140109825
- Operational Hours: 24 Hours, 7 Days a Week, 365 Days/Year

## 2. Core Operational Capabilities
- Computerized Laptop Diagnostics:
  * Cummins INSITE Software
  * Tata Diagnostic Tool (TDT)
  * Bosch KTS Heavy Duty Systems
  * Fault Code Clearing & Telemetry Calibration
  * BS-VI AdBlue / DEF Dosing Pump Pressure & DPF Regeneration
- Mechanical Workshop Services:
  * Complete Engine Overhaul (Tata 697, Cummins ISBe 5.9/6.7, 4SP)
  * Gearbox & Transmission Rebuilding (G550, G1150)
  * Air Brake Pneumatics (Wabco & Knorr-Bremse Valves, Actuators)
  * Clutch Disc & Pressure Plate Overhaul (380mm, 430mm Push/Pull)
  * Tappet Valve Clearances, Crankshaft Grinding, Piston Liner Seating
- 24×7 Highway Emergency Breakdown Network:
  * Mobile Service Vans equipped with 5kVA Generator, Air Compressor, Gas Torch, Hydraulic Floor Jacks
  * Average Highway Response Time: 35-45 minutes
  * Corridors: NH-48 (Delhi-Jaipur-Mumbai), NH-19 (Delhi-Kolkata), NH-44 (North-South Corridor), Western Peripheral (KMP)
- Genuine Spare Parts Counter:
  * 100% Factory-Sealed OEM Spares
  * Brands: Tata Motors, Cummins, Fleetguard Filters, Wabco, Bosch

## 3. Physical Evidence & Verifiable Assets
- Signboard Physical Verification: Yellow & Red Industrial Board with Tata & Cummins Logos
- Workshop Bays: 4 Dedicated Heavy Commercial Pit Lanes + Diagnostic Station
- Verified Technicians: Senior Ustads (Mechanics) & Certified Systems Engineers

## 4. Digital Integrations
- Public Portal: https://truckwala247.com/
- Operations Cockpit: /operations (Multi-role: Owner, Worker, Engineer, Admin)
- WhatsApp Live Ingestion: Automated voice notes, symptom classification, rate card generation
- Schema.org Types: AutoRepair, AutomotiveBusiness, EmergencyService, FAQPage
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(llmsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">/llms.txt — Machine Readable Layer</h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  GEO & AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Machine-readable factual knowledge layer for AI crawlers (Gemini, ChatGPT, Claude, Perplexity).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 overflow-y-auto font-mono text-xs text-slate-300 bg-[#0B1120] leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{llmsContent}</pre>
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Factual First-Party Verified Knowledge</span>
          </div>
          <span className="text-slate-500">Accessible at /llms.txt</span>
        </div>
      </div>
    </div>
  );
};
