import React from 'react';
import { AlertTriangle, Wrench, Package, Laptop, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { trackClick } from '../utils/analytics';

interface HowCanWeHelpProps {
  language: Language;
  onSelectServiceTab?: (serviceId: string) => void;
}

export const HowCanWeHelp: React.FC<HowCanWeHelpProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight">
            {t.howCanWeHelp}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600 font-medium">
            {t.howCanWeHelpSub}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Card 1: Breakdown */}
          <a
            href="#breakdown-form"
            onClick={() => trackClick('internal-link', '#breakdown-form')}
            className="group relative bg-linear-to-br from-[#D32F2F] to-[#B71C1C] text-white rounded-2xl p-7 sm:p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition">
                <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-sm">
                  Priority 1
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {t.breakdownCardTitle}
                </h3>
              </div>
            </div>
            <p className="text-red-100 text-sm sm:text-base font-medium">
              {t.breakdownCardSub}
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-white group-hover:underline">
              <span>{language === 'hi' ? 'तुरंत मदद मांगें' : 'Get Instant Roadside Help'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </a>

          {/* Card 2: Workshop Repair */}
          <a
            href="#repair-form"
            onClick={() => trackClick('internal-link', '#repair-form')}
            className="group relative bg-linear-to-br from-[#1E88E5] to-[#1565C0] text-white rounded-2xl p-7 sm:p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition">
                <Wrench className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-sm">
                  Priority 2
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {t.repairCardTitle}
                </h3>
              </div>
            </div>
            <p className="text-blue-100 text-sm sm:text-base font-medium">
              {t.repairCardSub}
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-white group-hover:underline">
              <span>{language === 'hi' ? 'रिपेयर स्लॉट बुक करें' : 'Book Workshop Repair Slot'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </a>

          {/* Card 3: Spare Parts */}
          <a
            href="#parts-form"
            onClick={() => trackClick('internal-link', '#parts-form')}
            className="group relative bg-linear-to-br from-[#2E7D32] to-[#1B5E20] text-white rounded-2xl p-7 sm:p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition">
                <Package className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-sm">
                  Genuine OEM
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {t.partsCardTitle}
                </h3>
              </div>
            </div>
            <p className="text-green-100 text-sm sm:text-base font-medium">
              {t.partsCardSub}
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-white group-hover:underline">
              <span>{language === 'hi' ? 'ओरिजिनल पार्ट इन्क्वायरी' : 'Inquire Part Availability'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </a>

          {/* Card 4: Diagnostics */}
          <a
            href="#repair-form"
            onClick={() => trackClick('internal-link', '#repair-form')}
            className="group relative bg-linear-to-br from-purple-700 to-indigo-900 text-white rounded-2xl p-7 sm:p-8 shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition">
                <Laptop className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-sm">
                  BS-III / IV / VI
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {t.diagCardTitle}
                </h3>
              </div>
            </div>
            <p className="text-purple-100 text-sm sm:text-base font-medium">
              {t.diagCardSub}
            </p>
            <div className="mt-5 flex items-center text-xs font-bold text-white group-hover:underline">
              <span>{language === 'hi' ? 'लैपटॉप स्कैनिंग शेड्यूल करें' : 'Schedule Computer Diagnosis'}</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </a>

        </div>

      </div>
    </section>
  );
};
