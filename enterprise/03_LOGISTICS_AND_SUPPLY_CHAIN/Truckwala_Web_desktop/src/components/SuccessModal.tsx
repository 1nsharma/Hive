import React from 'react';
import { CheckCircle, Phone, MessageCircle, X } from 'lucide-react';
import { Language } from '../types';
import { WORKSHOP_CONFIG } from '../data/servicesData';
import { trackClick } from '../utils/analytics';

interface SuccessModalProps {
  leadId: string | null;
  formType: string | null;
  onClose: () => void;
  language: Language;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  leadId,
  formType,
  onClose,
  language
}) => {
  if (!leadId) return null;

  const isBreakdown = formType === 'breakdown';

  const handlePhone = () => {
    trackClick('phone', `success_modal_${leadId}`);
    window.location.href = `tel:${WORKSHOP_CONFIG.phoneClean}`;
  };

  const handleWhatsApp = () => {
    trackClick('whatsapp', `success_modal_${leadId}`);
    const msg = `Hello TruckWala 24x7, I just submitted an emergency request (Lead ID: ${leadId}). Please dispatch assistance.`;
    window.open(`https://wa.me/${WORKSHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
          {language === 'hi' ? 'अनुरोध सफलतापूर्वक प्राप्त हुआ!' : 'Request Successfully Received!'}
        </h3>
        
        <p className="text-xs text-gray-500 font-mono mb-4">
          Reference ID: <span className="font-bold text-gray-800">{leadId}</span>
        </p>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {language === 'hi'
            ? isBreakdown
              ? 'हमारी ऑन-रोड आपातकालीन यूनिट सक्रिय हो चुकी है। तुरंत सहायता के लिए आप नीचे दिए गए नंबर पर सीधा कॉल भी कर सकते हैं।'
              : 'आपकी सर्विस रिक्वेस्ट वर्कशॉप टीम को भेज दी गई है। जल्द ही आपसे संपर्क किया जाएगा।'
            : isBreakdown
              ? 'Our emergency on-road response unit has been notified. For priority immediate dispatch, you may also call directly.'
              : 'Your service request has been logged. Our workshop coordinator will get in touch shortly.'}
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePhone}
            className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl font-black text-sm flex items-center justify-center space-x-2 shadow-md transition"
          >
            <Phone className="w-4 h-4" />
            <span>{language === 'hi' ? 'सीधा हेल्पलाइन पर कॉल करें' : 'Call 24×7 Hotline Now'}</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'hi' ? 'व्हाट्सएप पर स्टेटस पूछें' : 'Check Status on WhatsApp'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 font-semibold"
          >
            {language === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
