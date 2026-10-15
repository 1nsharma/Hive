import React, { useState } from "react";
import { Wrench, Monitor, ShieldCheck, Truck, CheckCircle2, ChevronRight, Eye } from "lucide-react";

interface EvidenceItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  specs: string[];
  badge: string;
  badgeColor: string;
  icon: "wrench" | "monitor" | "truck" | "shield";
}

const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: "ev-1",
    title: "Official Truck Wala 24×7 Workshop Signboard",
    subtitle: "Tata & Cummins Commercial Vehicle Specialist",
    category: "Physical Brand Verification",
    description:
      "Our verified physical workshop signboards display our registered trade identity, verified telephone lines (9140889473, 9140109825, 7070709082), and specialized commercial vehicle divisions.",
    specs: ["BS-III, BS-IV, BS-VI Coverage", "Verified Signage on NH Highway Junction", "Clear Role-Numbered Helplines"],
    badge: "Physical Facility",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    icon: "shield",
  },
  {
    id: "ev-2",
    title: "Laptop Computerized OBD Diagnostics in Driver Cabin",
    subtitle: "Cummins INSITE & Tata Diagnostic Tool (TDT)",
    category: "Electronic Diagnostics",
    description:
      "Direct ECU diagnostics connected under the dashboard to read active DTCs, balance common rail injectors, check NOx sensors, and resolve DEF/AdBlue dosing derates.",
    specs: ["Cummins INSITE & Calterm", "Tata TDT Diagnostic Tool", "Live Telemetry & DPF Regeneration"],
    badge: "Computerized Testing",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    icon: "monitor",
  },
  {
    id: "ev-3",
    title: "Heavy Engine Rebuild & Mechanical Overhaul Bench",
    subtitle: "Tata 697 & Cummins ISBe 5.9 / 6.7 Engines",
    category: "Engine Engineering",
    description:
      "Precision teardown, crankshaft journal micrometer measurement, cylinder liner honing, valve seat grinding, and high-pressure Bosch CRDI pump balancing.",
    specs: ["Crankshaft Micrometer Tolerances", "Torqued Cylinder Head Studs", "OEM Gasket & Seal Sets"],
    badge: "Heavy Overhaul",
    badgeColor: "bg-red-100 text-red-900 border-red-300",
    icon: "wrench",
  },
  {
    id: "ev-4",
    title: "Workshop Service Pit Bays for Multi-Axle Haulers",
    subtitle: "Underbody Air Brakes, Suspension & Axle Alignment",
    category: "Pit Floor & Bays",
    description:
      "Full-length reinforced pit lanes capable of handling 16-wheel, 22-wheel container haulers and heavy trailers for pneumatic brake testing and leaf spring replacements.",
    specs: ["Heavy 50-Ton Hydraulic Floor Jacks", "Pneumatic Impact Wrenches", "Wabco Air Valve Calibration"],
    badge: "Bay Infrastructure",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    icon: "truck",
  },
  {
    id: "ev-5",
    title: "100% Genuine Spare Parts Storage & Shelf Inventory",
    subtitle: "Wabco, Fleetguard, Tata Motors & Bosch",
    category: "Authentic Parts Stock",
    description:
      "Organized barcode inventory racks storing clutch pressure plates, air dryer cartridges, water separators, turbochargers, and alternator starter assemblies.",
    specs: ["Factory Sealed Packaging", "Barcoded Stock Movement", "Itemized GST Tax Invoices"],
    badge: "Genuine Spares",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    icon: "shield",
  },
  {
    id: "ev-6",
    title: "24×7 Highway Emergency Mobile Repair Patrol Vans",
    subtitle: "Rapid Breakdown Dispatch across NH-48, NH-19 & NH-44",
    category: "Emergency Mobile Unit",
    description:
      "Equipped with 5 kVA onboard silent generators, heavy-duty air compressors, welding/gas torch kits, safety highway cones, and fast-moving replacement parts.",
    specs: ["Average 38-Minute Highway Arrival", "Onboard Compressor & Power", "GPS-Linked Live ETA Dispatch"],
    badge: "24×7 Highway SOS",
    badgeColor: "bg-red-100 text-red-900 border-red-300",
    icon: "truck",
  },
];

export const RealEvidenceGallery: React.FC = () => {
  const [activeItem, setActiveItem] = useState<EvidenceItem>(EVIDENCE_ITEMS[0]);

  return (
    <section id="evidence" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle mechanical background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Grounded Physical Workshop Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Real Workshop. Real Parts. Real People.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Truck Wala 24×7 is an authentic physical commercial vehicle enterprise—with actual diagnostic laptops, heavy pit bays, genuine spares inventory, and emergency mobile highway vans.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">4 Bays Active • 4 Mobile Patrol Vans</span>
          </div>
        </div>

        {/* Evidence Grid & Spotlight Showcase */}
        <div className="grid lg:grid-cols-3 gap-6">
          {EVIDENCE_ITEMS.map((item) => {
            const isSelected = activeItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`p-6 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-800/90 border-red-500 shadow-xl shadow-red-950/30 ring-2 ring-red-500/30"
                    : "bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/70 hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 space-y-1.5">
                  {item.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-800/90 to-slate-900 border border-red-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">Non-Misleading Service Transparency</h4>
              <p className="text-xs sm:text-sm text-slate-300">
                All claims are grounded in our actual workshop capabilities: Tata & Cummins specialists, genuine parts, itemized tax invoices, and real-time photos of replaced parts.
              </p>
            </div>
          </div>
          <a
            href="tel:9140889473"
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Speak with Head Office (9140889473)</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
