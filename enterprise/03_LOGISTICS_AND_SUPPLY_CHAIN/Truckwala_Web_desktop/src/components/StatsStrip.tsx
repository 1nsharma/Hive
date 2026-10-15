import React from 'react';
import { Truck, Clock, Users, MapPin } from 'lucide-react';
import { WorkshopConfig } from '../types';

interface StatsStripProps {
  workshopConfig: WorkshopConfig;
}

export const StatsStrip: React.FC<StatsStripProps> = ({ workshopConfig }) => {
  const stats = [
    {
      value: '500+',
      label: 'VEHICLES HELPED',
      subtext: 'Highway breakdowns resolved',
      icon: Truck,
      color: 'text-[#FF5A1F]',
      glow: 'shadow-orange-500/20'
    },
    {
      value: '24×7',
      label: 'EMERGENCY SUPPORT',
      subtext: 'Round-the-clock rapid dispatch',
      icon: Clock,
      color: 'text-[#22C55E]',
      glow: 'shadow-emerald-500/20'
    },
    {
      value: '1000+',
      label: 'HAPPY CUSTOMERS',
      subtext: 'Commercial drivers & fleet owners',
      icon: Users,
      color: 'text-[#00D2FF]',
      glow: 'shadow-blue-500/20'
    },
    {
      value: 'KANPUR +',
      label: 'HIGHWAY COVERAGE',
      subtext: 'NH-19, NH-27 & Corridor',
      icon: MapPin,
      color: 'text-[#FFB703]',
      glow: 'shadow-amber-500/20'
    }
  ];

  return (
    <section id="why-us" className="relative py-12 bg-[#080A0F] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-card-hover rounded-2xl sm:rounded-3xl p-6 border border-white/10 relative overflow-hidden group text-center flex flex-col items-center justify-center"
              >
                {/* Luminous Top Pip */}
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>

                {/* Big Bold Stat Value */}
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight ${stat.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                  {stat.value}
                </div>

                {/* All-Caps Label */}
                <div className="text-xs sm:text-sm font-black tracking-widest text-white mt-1.5 font-heading">
                  {stat.label}
                </div>

                {/* Subtle Subtext */}
                <div className="text-[11px] text-gray-400 font-medium mt-1">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
