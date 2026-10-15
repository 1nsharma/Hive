import React, { useState } from 'react';
import { Wrench, Upload, Image as ImageIcon, X, Send, Loader2, CheckSquare, Square } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WORKSHOP_CONFIG } from '../data/servicesData';
import { submitLead } from '../utils/analytics';

interface RepairFormProps {
  language: Language;
  onSuccess: (leadId: string, formType: string) => void;
  selectedServicePreFill?: string;
}

export const RepairForm: React.FC<RepairFormProps> = ({
  language,
  onSuccess,
  selectedServicePreFill
}) => {
  const t = TRANSLATIONS[language];
  const [services, setServices] = useState<string[]>(
    selectedServicePreFill ? [selectedServicePreFill] : ['Engine']
  );
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableServices = [
    { id: 'Engine', en: 'Engine & Turbo', hi: 'इंजन व टर्बो' },
    { id: 'Gearbox', en: 'Gearbox & Transmission', hi: 'गियरबॉक्स व ट्रांसमिशन' },
    { id: 'Clutch', en: 'Clutch & Pressure Plate', hi: 'क्लच व प्रेशर प्लेट' },
    { id: 'Brake', en: 'Air Brakes & Wabco Valve', hi: 'एयर ब्रेक व वाबको वाल्व' },
    { id: 'Electrical', en: 'Electrical & 24V Starter', hi: 'इलेक्ट्रिकल व स्टार्टर' },
    { id: 'Diagnostics', en: 'BS-4 / BS-6 Laptop Scanning', hi: 'BS-4 / BS-6 लैपटॉप जांच' },
    { id: 'Suspension', en: 'Kamani (Leaf Spring) & Axle', hi: 'कमानी व एक्सल सस्पेंशन' },
    { id: 'FleetService', en: 'Scheduled Oil & Lube Service', hi: 'ऑयल चेंज व ग्रीसिंग' }
  ];

  const toggleService = (id: string) => {
    setServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

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

  const clearPhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (services.length === 0) {
      alert(language === 'hi' ? 'कृपया कम से कम एक काम चुनें।' : 'Please select at least one service type.');
      return;
    }

    setIsSubmitting(true);
    try {
      const lead = await submitLead({
        formType: 'repair',
        services,
        vehicleNumber: vehicleNumber.toUpperCase().trim() || 'NOT_SPECIFIED',
        phone: contactPhone.trim() || WORKSHOP_CONFIG.phoneDisplay,
        problem: notes.trim() || services.join(', '),
        hasPhoto: !!photoPreview,
        photoName: photoFileName || undefined,
        urgency: 'normal'
      });

      onSuccess(lead.id, 'repair');
      // Reset
      setVehicleNumber('');
      setContactPhone('');
      setNotes('');
      clearPhoto();
    } catch {
      alert('Failed to submit repair request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="repair-form" className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gray-50 rounded-3xl shadow-xl border border-gray-200/80 p-7 sm:p-10 relative overflow-hidden">
          
          {/* Top blue stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t.repairFormTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              {t.repairFormSub}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Service Type multi-select checkboxes */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                {t.selectServicesLabel} <span className="text-blue-600">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {availableServices.map((srv) => {
                  const isChecked = services.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition select-none ${
                        isChecked 
                          ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs' 
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <span>{language === 'hi' ? srv.hi : srv.en}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Number & Contact Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.vehicleNumberLabel}
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="UP32 AB 1234"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.driverPhoneLabel}
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            {/* Specific Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'hi' ? 'अतिरिक्त विवरण / लक्षण (Optional)' : 'Additional Notes / Symptoms'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                placeholder={language === 'hi' ? 'उदा. 4th गियर में कंपन है, 50,000 किमी पर मेजर सर्विस करानी है...' : 'E.g., vibration in 4th gear, need major overhaul at 50,000 km...'}
              />
            </div>

            {/* Upload Photo / Defect preview */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.uploadPhotoLabel}
              </label>

              {!photoPreview ? (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl bg-white cursor-pointer transition">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-gray-700">
                    {t.photoUploadHint}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 10MB</span>
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
                    alt="Upload Preview"
                    className="h-32 w-auto object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-md"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-gray-500 mt-1 font-mono truncate max-w-[200px]">
                    {photoFileName}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 transition active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting Request...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.submitRepairBtn}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
