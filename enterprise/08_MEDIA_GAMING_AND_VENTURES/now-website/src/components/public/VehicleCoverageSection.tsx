import React, { useState } from "react";
import { Truck, CheckCircle2, Shield, Settings, ChevronRight, Layers } from "lucide-react";

interface VehicleCategory {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  popularModels: string[];
  supportedSystems: string[];
}

const VEHICLE_DATA: VehicleCategory[] = [
  {
    id: "tata",
    name: "Tata Commercial Vehicles",
    badge: "Specialist Division",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    description:
      "Full factory-grade support for all Tata Motors Medium & Heavy Commercial Vehicles (M&HCV) and Intermediate Commercial Vehicles (ICV).",
    popularModels: ["Tata Signa 4825.TK / 3523.T", "Tata Prima 5530.S Tractor", "Tata LPT 1613 / 2518 / 3118", "Tata Ultra T.7 / T.9 ICV"],
    supportedSystems: ["Tata Diagnostic Tool (TDT)", "G550 & G1150 6/9-Speed Gearbox", "Tata 697 & 5.0L Turbotronn Engines", "Bendix & Wabco Air Brake Boosters"],
  },
  {
    id: "cummins",
    name: "Cummins Engine Platforms",
    badge: "Official Expertise",
    badgeColor: "bg-red-100 text-red-900 border-red-300",
    description:
      "Specialized overhaul, calibration, and electronic ECU diagnostic testing for all Cummins B-Series, ISBe, and electronic commercial diesel powerplants.",
    popularModels: ["Cummins 6BT 5.9 Mechanical", "Cummins ISBe 5.9 CRDI (BS-III/IV)", "Cummins ISBe 6.7 Electronic (BS-VI)", "Cummins 4BTAA 3.9 Engines"],
    supportedSystems: ["Cummins INSITE Software Diagnostics", "Calterm Parameter Tuning & Speed Governor", "Holset Turbocharger Calibration", "High-Pressure Bosch CRDI Common Rail"],
  },
  {
    id: "bs6",
    name: "BS-VI Aftertreatment & DEF Systems",
    badge: "Advanced Electronics",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    description:
      "Dedicated troubleshooting for SCR (Selective Catalytic Reduction), DPF (Diesel Particulate Filter), DOC, and AdBlue dosing pump issues.",
    popularModels: ["All BS-VI Heavy Haulers", "SCR Dosing Pump Assemblies", "Upstream / Downstream NOx Sensors", "DEF Quality & Tank Heating Units"],
    supportedSystems: ["Stationary Forced DPF Regeneration", "AdBlue Dosing Pressure Test", "NOx Sensor Replacement & Reset", "ECU Derate & Torque Limiter Fix"],
  },
  {
    id: "multi-brand",
    name: "Ashok Leyland, BharatBenz & Eicher",
    badge: "Multi-Fleet Division",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description:
      "Comprehensive mechanical, transmission, suspension, and brake service for leading commercial fleet operators across India.",
    popularModels: ["Ashok Leyland AVTR / Ecomet / Captain", "BharatBenz 3528R / 2823R / 1617R", "Eicher Pro 6035 / Pro 3019", "Mahindra Blazo X Heavy Trucks"],
    supportedSystems: ["Heavy Differential & Crown Wheel", "Air Compressor & Air Dryer Overhaul", "Kingpin, Spindle & Hub Greasing", "Suspension Leaf Spring Bushing"],
  },
];

export const VehicleCoverageSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("tata");

  const currentCategory =
    VEHICLE_DATA.find((c) => c.id === selectedCategory) || VEHICLE_DATA[0];

  return (
    <section id="vehicles" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-xs font-black uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>Commercial Vehicle Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Specialized in Tata & Cummins Platforms
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From vintage mechanical BS-III haulers to modern BS-VI electronically managed common-rail heavy freight carriers.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {VEHICLE_DATA.map((cat) => {
              const isActive = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Feature Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentCategory.badgeColor}`}>
                  {currentCategory.badge}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{currentCategory.name}</h3>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl">{currentCategory.description}</p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <a
                href="tel:9140889473"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                Inquire Model Fitment
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-600" />
                <span>Primary Models Handled</span>
              </h4>
              <ul className="space-y-2.5">
                {currentCategory.popularModels.map((model, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-600" />
                <span>Diagnostic & Technical Systems</span>
              </h4>
              <ul className="space-y-2.5">
                {currentCategory.supportedSystems.map((sys, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{sys}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Future Expansion Note */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Also extending to: Heavy Bus Fleets, LCVs, Pickups, and Multi-Axle Tankers.</span>
            <span className="font-bold text-slate-700">Dedicated Fleet AMC Contracts Available</span>
          </div>
        </div>
      </div>
    </section>
  );
};
