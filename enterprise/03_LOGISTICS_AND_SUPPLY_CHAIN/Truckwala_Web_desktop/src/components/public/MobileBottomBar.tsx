import React from "react";
import { Phone, MessageSquare, AlertTriangle } from "lucide-react";

interface MobileBottomBarProps {
  onOpenEmergency: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenEmergency }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Now */}
        <a
          href="tel:9140889473"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95 border border-slate-700 text-center"
        >
          <Phone className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span className="text-[11px] font-bold leading-tight">Call Now</span>
          <span className="text-[9px] text-slate-400">9140889473</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/917070709082?text=Hello%20Truck%20Wala%2024x7,%20I%20need%20commercial%20vehicle%20support."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 text-center shadow-sm"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-bold leading-tight">WhatsApp</span>
          <span className="text-[9px] text-emerald-200">7070709082</span>
        </a>

        {/* Emergency SOS */}
        <button
          onClick={onOpenEmergency}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-red-600 hover:bg-red-700 text-white transition active:scale-95 text-center shadow-sm cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-300 mb-0.5 animate-bounce" />
          <span className="text-[11px] font-black leading-tight">Highway SOS</span>
          <span className="text-[9px] text-red-200">24×7 Rapid</span>
        </button>
      </div>
    </div>
  );
};
