import React, { useState } from 'react';
import { Compass, Sparkles, X, ChevronRight, Play } from 'lucide-react';
import { 
  startFullEconomyTour, 
  startRadarTour, 
  startAiSafetyTour, 
  startCommerceTour 
} from '../lib/tour/driverTour';

interface FloatingTourWidgetProps {
  onOpenTourModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const FloatingTourWidget: React.FC<FloatingTourWidgetProps> = ({
  onOpenTourModal,
  onNavigateTab
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2">
      {/* Quick Menu Popup */}
      {menuOpen && (
        <div className="w-72 bg-[#FFFDF6] border border-[#E3D9C4] rounded-2xl shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#0E3D2F]">
              <Sparkles className="w-3.5 h-3.5 text-[#F0A21E]" />
              <span>Guided Economy Tours</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <button
              onClick={() => {
                setMenuOpen(false);
                startFullEconomyTour(onNavigateTab);
              }}
              className="w-full p-2 rounded-xl text-left bg-emerald-50 hover:bg-emerald-100 text-[#175741] font-bold flex items-center justify-between cursor-pointer transition-all"
            >
              <span>✨ Complete 8-Pillar Tour</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#175741]" />
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                startRadarTour(onNavigateTab);
              }}
              className="w-full p-2 rounded-xl text-left hover:bg-stone-100 text-stone-700 font-semibold flex items-center justify-between cursor-pointer transition-all"
            >
              <span>🏷️ Smart Tag &amp; Lost Radar</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                startAiSafetyTour(onNavigateTab);
              }}
              className="w-full p-2 rounded-xl text-left hover:bg-stone-100 text-stone-700 font-semibold flex items-center justify-between cursor-pointer transition-all"
            >
              <span>🤖 AI Clinical Guardrails</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                startCommerceTour(onNavigateTab);
              }}
              className="w-full p-2 rounded-xl text-left hover:bg-stone-100 text-stone-700 font-semibold flex items-center justify-between cursor-pointer transition-all"
            >
              <span>🛍️ Marketplace &amp; Booking</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              onOpenTourModal();
            }}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold text-center cursor-pointer transition-all"
          >
            Browse All Tours &amp; Details
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        id="tour-floating-button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#175741] text-white shadow-xl hover:bg-[#0E3D2F] hover:shadow-2xl transition-all cursor-pointer border border-[#F0A21E]/60 focus:outline-none"
        title="Explore PetJanu Ecosystem Tour"
      >
        <div className="relative">
          <Compass className="w-5 h-5 text-[#F0A21E] group-hover:rotate-45 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F0A21E] animate-ping"></span>
        </div>
        <span className="font-extrabold text-xs tracking-tight hidden sm:inline">
          Economy Tour ✨
        </span>
      </button>
    </div>
  );
};
