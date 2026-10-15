import React from "react";
import { Phone, MessageSquare, AlertTriangle, Clock, MapPin, CheckCircle, ArrowRight, Shield } from "lucide-react";

interface EmergencyWorkflowSectionProps {
  onOpenEmergency: () => void;
}

export const EmergencyWorkflowSection: React.FC<EmergencyWorkflowSectionProps> = ({
  onOpenEmergency,
}) => {
  const STEPS = [
    {
      step: 1,
      title: "Immediate Contact",
      hindi: "कॉल या व्हाट्सएप करें",
      desc: "Call 9140889473 / 7070709082 or send WhatsApp message for immediate priority queue.",
      icon: Phone,
    },
    {
      step: 2,
      title: "Live GPS Location",
      hindi: "लाइव लोकेशन भेजें",
      desc: "Share your exact highway pin, milestone number, or nearest toll plaza landmark.",
      icon: MapPin,
    },
    {
      step: 3,
      title: "Vehicle & Symptom Details",
      hindi: "गाड़ी और समस्या बताएं",
      desc: "Tell us vehicle model (Tata Signa/Prima, Cummins), symptom (clutch, DEF light, air leak).",
      icon: AlertTriangle,
    },
    {
      step: 4,
      title: "Rapid Mobile Van Dispatch",
      hindi: "मोबाइल वैन रवाना (ETA ~38 Min)",
      desc: "Nearest equipped emergency van departs with generator, compressor, torch & technician.",
      icon: Clock,
    },
    {
      step: 5,
      title: "On-Site Computer/Mechanical Diagnosis",
      hindi: "मौके पर लैपटॉप जांच",
      desc: "Technician arrives, sets safety cones, runs laptop OBD scan or physical inspection.",
      icon: CheckCircle,
    },
    {
      step: 6,
      title: "Genuine Parts & Field Repair",
      hindi: "असली पार्ट्स से मरम्मत",
      desc: "Factory-sealed parts installed on the spot with transparent pre-approved labor rates.",
      icon: Shield,
    },
    {
      step: 7,
      title: "Vehicle Restored to Haul Freight",
      hindi: "गाड़ी तुरंत चालू",
      desc: "Engine trial, temperature/pressure verification, driver signs digital road clearance.",
      icon: ArrowRight,
    },
    {
      step: 8,
      title: "Digital Invoice & Lifetime Record",
      hindi: "पक्का जीएसटी बिल व रिकॉर्ड",
      desc: "Service ledger updated with part serial numbers and transparent tax invoice via WhatsApp.",
      icon: CheckCircle,
    },
  ];

  return (
    <section id="emergency" className="py-16 sm:py-24 bg-gradient-to-b from-red-950 via-slate-900 to-slate-900 text-white relative overflow-hidden">
      {/* Visual Emergency Warning Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-red-600 rounded-3xl p-6 sm:p-10 shadow-2xl border border-red-500 flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>🚨 24×7 Rapid Highway SOS Response</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Truck Breakdown on Highway Right Now?
            </h2>
            <p className="text-red-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Don’t stay stranded in the dark. Mobile rescue vans on patrol along NH-48, NH-19, NH-44, and national corridors with generator, air compressor, diagnostic laptop, and genuine spares.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onOpenEmergency}
              className="w-full sm:w-auto px-6 py-4 bg-white text-red-600 hover:bg-slate-100 rounded-2xl font-black text-base transition shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
              <span>Request Highway SOS</span>
            </button>
            <a
              href="tel:9140889473"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base transition shadow-xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Call 9140889473</span>
            </a>
            <a
              href="https://wa.me/917070709082?text=EMERGENCY:%20My%20truck%20is%20broken%20down%20on%20the%20highway.%20Please%20send%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-base transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>WhatsApp Live SOS</span>
            </a>
          </div>
        </div>

        {/* 8-Step Breakdown Resolution Timeline */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
            Our 8-Step Emergency Breakdown SOP
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            From your distress call to vehicle roll-out: transparent, rapid, and grounded in standard operating procedures.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.step}
                className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between hover:border-red-500/80 hover:bg-slate-800 transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black flex items-center justify-center">
                      0{s.step}
                    </span>
                    <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-red-300 transition">
                    {s.title}
                  </h4>
                  <p className="text-xs text-amber-400 font-semibold mb-2">
                    {s.hindi}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
