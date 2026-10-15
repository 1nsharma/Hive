import React from 'react';
import { ShieldCheck, Wrench, Package, Zap, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface AboutSectionProps {
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const highlights = [
    {
      title: '24×7 Breakdown Support',
      desc: 'Day or night emergency assistance dispatched to highway breakdown points.',
      icon: Zap,
      color: 'text-[#FF5A1F]',
      bg: 'bg-[#FF5A1F]/10'
    },
    {
      title: 'Skilled Commercial Mechanics',
      desc: 'Trained specialists for Cummins, Tata, Leyland, BharatBenz & BS-VI ECUs.',
      icon: Wrench,
      color: 'text-[#2563EB]',
      bg: 'bg-[#2563EB]/10'
    },
    {
      title: 'Genuine Spare Parts',
      desc: 'OEM filters, clutch boosters, Wabco brake valves, belts and lubricants in stock.',
      icon: Package,
      color: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/10'
    },
    {
      title: 'Fast Highway Reach',
      desc: 'Dedicated rapid-response patrol vans covering Kanpur, Unnao & NH corridors.',
      icon: ShieldCheck,
      color: 'text-[#00D2FF]',
      bg: 'bg-[#00D2FF]/10'
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#080A0F] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Story & Mission */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#2563EB]/15 border border-[#2563EB]/30 rounded-full text-xs font-black text-[#38BDF8] uppercase tracking-wider">
              <span>Built for Indian Logistics</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-tight">
              TRUCKWALA 24×7
            </h2>

            <p className="text-base sm:text-lg text-gray-200 font-semibold leading-relaxed">
              TruckWala 24×7 is a dedicated commercial-vehicle solution built to keep India’s transport and logistics moving without delay across the <span className="text-[#FF5A1F]">Kanpur → Unnao → Lucknow Highway</span> corridor.
            </p>

            <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed">
              From 24×7 emergency highway breakdowns to preventive fleet maintenance, OEM spare parts, laptop ECU diagnostics, and 40T heavy under-lift recovery — we provide a complete commercial vehicle solution under one roof.
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-[#1E293B] border-2 border-[#080A0F] flex items-center justify-center text-xs font-bold text-white">Tata</div>
                <div className="w-10 h-10 rounded-full bg-[#1E293B] border-2 border-[#080A0F] flex items-center justify-center text-xs font-bold text-[#FF5A1F]">AL</div>
                <div className="w-10 h-10 rounded-full bg-[#1E293B] border-2 border-[#080A0F] flex items-center justify-center text-xs font-bold text-[#38BDF8]">BB</div>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Certified coverage for all major Indian commercial OEMs
              </span>
            </div>
          </div>

          {/* Right Column: 4 Supporting Highlights in Glassmorphic Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel glass-card-hover rounded-2xl sm:rounded-3xl p-6 border border-white/10 relative flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} border border-white/10 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>

                    <h3 className="text-base font-black font-heading text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/5 flex items-center text-[11px] font-bold text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] mr-1.5" />
                    <span>Verified Highway Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
