import React, { useState } from 'react';
import { Package, MessageCircle, Camera, X, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WORKSHOP_CONFIG } from '../data/servicesData';
import { submitLead, trackClick } from '../utils/analytics';

interface PartsFormProps {
  language: Language;
  onSuccess: (leadId: string, formType: string) => void;
}

export const PartsForm: React.FC<PartsFormProps> = ({ language, onSuccess }) => {
  const t = TRANSLATIONS[language];
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [partName, setPartName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);

  const commonParts = language === 'hi' ? [
    '380mm ट्विन क्लच प्लेट सेट',
    'वाबको ब्रेक रिले वाल्व',
    'बॉश कॉमन रेल इंजेक्टर',
    'डीजल फ्यूल वाटर सेपरेटर',
    'अल्टरनेटर 24V 55A',
    'हब बेयरिंग सेट'
  ] : [
    '380mm Twin Clutch Plate Kit',
    'Wabco Air Brake Relay Valve',
    'Bosch Common Rail Injector',
    'Diesel Fuel Water Separator Filter',
    '24V 55A Heavy Alternator',
    'Wheel Hub Bearing Set'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim()) {
      alert(language === 'hi' ? 'कृपया पार्ट का नाम या नंबर लिखें।' : 'Please enter the part name or part number.');
      return;
    }

    // Save lead first
    const lead = await submitLead({
      formType: 'parts',
      vehicleNumber: vehicleNumber.toUpperCase().trim() || 'NOT_SPECIFIED',
      partName: `${partName} (${vehicleModel || 'Model unspecified'})`,
      phone: contactPhone.trim() || WORKSHOP_CONFIG.phoneDisplay,
      hasPhoto: !!photoPreview,
      urgency: 'normal'
    });

    trackClick('whatsapp', `parts_${partName}`);

    // Pre-format WhatsApp message with exact vehicle and part details
    const textMsg = `*TruckWala 24x7 Spare Parts Enquiry*\n• Part Name: ${partName}\n• Truck Model: ${vehicleModel || 'N/A'}\n• Vehicle Reg: ${vehicleNumber || 'N/A'}\n• Contact Phone: ${contactPhone || 'N/A'}\n• Lead ID: ${lead.id}\nPlease confirm availability and price.`;
    
    window.open(`https://wa.me/${WORKSHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(textMsg)}`, '_blank');
    onSuccess(lead.id, 'parts');
  };

  return (
    <section id="parts-form" className="py-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-7 sm:p-10 relative overflow-hidden">
          
          {/* Top green stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-emerald-600 via-green-500 to-emerald-700"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t.partsFormTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              {t.partsFormSub}
            </p>

            {/* Authenticity tag */}
            <div className="inline-flex items-center space-x-1.5 mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine OEM • Tata • Cummins • Wabco • Bosch • GST Invoice</span>
            </div>
          </div>

          <form onSubmit={handleWhatsAppEnquiry} className="space-y-6">
            
            {/* Part Name / Number */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                {t.partNameLabel} <span className="text-emerald-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  placeholder={t.partNamePlaceholder}
                  required
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Quick Part Suggestions */}
              <div className="mt-2.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  {language === 'hi' ? 'ज्यादातर पूछे जाने वाले पार्ट्स:' : 'Frequently Requested Genuine Parts:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commonParts.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPartName(item)}
                      className="text-[11px] font-medium bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Model & Registration */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.vehicleModelLabel}
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  placeholder={t.vehicleModelPlaceholder}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.vehicleNumberLabel}
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  placeholder={t.vehicleNumberPlaceholder}
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.driverPhoneLabel}
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
                placeholder={t.driverPhonePlaceholder}
              />
            </div>

            {/* Upload Part Photo (Optional) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'hi' ? 'पुराने पार्ट या नेमप्लेट की फोटो (वैकल्पिक)' : 'Upload Old Part / Nameplate Photo (Optional)'}
              </label>

              {!photoPreview ? (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl bg-gray-50/50 cursor-pointer transition">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-gray-700">
                    {language === 'hi' ? 'पार्ट नंबर या पुराने पार्ट की फोटो लें' : 'Take photo of part number stamping'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative inline-block border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white p-2">
                  <img
                    src={photoPreview}
                    alt="Part preview"
                    className="h-28 w-auto object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoFileName(null);
                    }}
                    className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-gray-500 mt-1 font-mono truncate max-w-[200px]">
                    {photoFileName}
                  </p>
                </div>
              )}
            </div>

            {/* WhatsApp Enquiry Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-black text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-lg shadow-green-700/25 transition active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.whatsappPartsBtn}</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
