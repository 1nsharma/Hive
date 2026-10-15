import React from 'react';
import { Phone, MessageCircle, ShieldAlert } from 'lucide-react';
import { WorkshopConfig } from '../types';
import { trackClick, trackEvent } from '../utils/analytics';

interface MobileActionBarProps {
  workshopConfig: WorkshopConfig;
  onRequestService: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  workshopConfig,
  onRequestService
}) => {
  const handleCall = () => {
    trackClick('phone', 'mobile_bottom_bar');
    window.location.href = `tel:${workshopConfig.phoneClean}`;
  };

  const handleWhatsApp = () => {
    trackClick('whatsapp', 'mobile_bottom_bar');
    const msg = encodeURIComponent('Hello TruckWala 24×7, I have an urgent commercial vehicle breakdown on the highway.');
    window.open(`https://wa.me/${workshopConfig.whatsappNumber}?text=${msg}`, '_blank');
  };

  const handleRequestService = () => {
    trackEvent('REQUEST_STARTED', 'mobile_bottom_bar');
    onRequestService();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-[#080A0F]/95 backdrop-blur-lg border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        
        {/* Button 1: CALL */}
        <button
          id="mobile-bottom-call"
          onClick={handleCall}
          className="h-12 bg-[#FF5A1F] active:bg-[#E04810] text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span className="tracking-wide">CALL</span>
        </button>

        {/* Button 2: WHATSAPP */}
        <button
          id="mobile-bottom-whatsapp"
          onClick={handleWhatsApp}
          className="h-12 bg-[#25D366] active:bg-[#1EBE5D] text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-green-500/20 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="tracking-wide">WHATSAPP</span>
        </button>

        {/* Button 3: REQUEST SERVICE */}
        <button
          id="mobile-bottom-sos"
          onClick={handleRequestService}
          className="h-12 bg-linear-to-r from-red-600 to-[#FF5A1F] active:opacity-90 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1 shadow-md shadow-red-500/20 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="tracking-wide">REQUEST</span>
        </button>

      </div>
    </div>
  );
};
