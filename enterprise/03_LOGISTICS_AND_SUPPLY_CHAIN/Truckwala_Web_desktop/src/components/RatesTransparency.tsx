import React from 'react';
import { ShieldCheck, Info, Check, Calculator } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RatesTransparencyProps {
  language: Language;
}

export const RatesTransparency: React.FC<RatesTransparencyProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const rateItems = [
    {
      jobEn: 'BS-IV / BS-VI Laptop Diagnostic Scan',
      jobHi: 'BS-IV / BS-VI लैपटॉप डायग्नोस्टिक स्कैन',
      rate: '₹750 – ₹1,200',
      timeEn: '30 – 60 min',
      timeHi: '30 – 60 मिनट',
      includesEn: 'Full ECU fault code readout, sensor live data check, AdBlue dosing test',
      includesHi: 'पूरा ECU स्कैन, लाइव सेंसर डेटा रिपोर्ट और AdBlue सिस्टम जांच'
    },
    {
      jobEn: 'Heavy Clutch Overhaul (Twin Plate)',
      jobHi: 'हेवी क्लच ओवरहाल (ट्विन प्लेट 380/430mm)',
      rate: '₹2,200 – ₹3,500',
      timeEn: '3 – 5 hours',
      timeHi: '3 – 5 घंटे',
      includesEn: 'Propeller shaft removal, gearbox drop, flywheel resurfacing check, release bearing fitting',
      includesHi: 'गियरबॉक्स खोलना, फ्लाईव्हील जांच, रिलीज बेयरिंग व क्लच बूस्टर फिटिंग'
    },
    {
      jobEn: 'Complete 6-Cylinder Diesel Engine Overhaul',
      jobHi: '6-सिलेंडर डीजल इंजन पूर्ण ओवरहाल (कमिंस/टाटा)',
      rate: '₹14,000 – ₹22,000',
      timeEn: '3 – 5 days',
      timeHi: '3 – 5 दिन',
      includesEn: 'Tear-down, machine shop machining supervision, crankshaft fitting, timing gear & test bench run',
      includesHi: 'पूरा इंजन खोलना, बोरिंग व क्रैंक ग्राइंडिंग, पिस्टन रिंग फिटिंग और टेस्ट रन'
    },
    {
      jobEn: 'Wheel Hub Greasing & Bearing Inspection',
      jobHi: 'हब ग्रीसिंग व बेयरिंग जांच (प्रति एक्सल)',
      rate: '₹800 – ₹1,400',
      timeEn: '1.5 hours / axle',
      timeHi: '1.5 घंटे / एक्सल',
      includesEn: 'Hub wash, high-temp AP3/Lithium grease pack, oil seal replacement, brake shoe adjustment',
      includesHi: 'हब धुलाई, हाई-टेम्परेचर ग्रीस पैकिंग, ऑयल सील बदलना और ब्रेक शू एडजस्टमेंट'
    },
    {
      jobEn: 'Air Brake Relining & Chamber Servicing',
      jobHi: 'एयर ब्रेक शू लेदर बदलना व चैंबर सर्विस',
      rate: '₹600 – ₹950',
      timeEn: '1 hour / wheel',
      timeHi: '1 घंटा / पहिया',
      includesEn: 'Brake drum removal, heavy duty rivet lining, S-cam greasing, Wabco valve air leak check',
      includesHi: 'ड्रम खोलना, रीवेटिंग, एस-कैम ग्रीसिंग और वाबको वाल्व एयर लीक जांच'
    },
    {
      jobEn: '24V Heavy Starter Motor Overhaul',
      jobHi: '24V हेवी सेल्फ स्टार्टर मोटर रिपेयर',
      rate: '₹650 – ₹1,200',
      timeEn: '1 – 2 hours',
      timeHi: '1 – 2 घंटे',
      includesEn: 'Carbon brush set, solenoid switch cleaning, pinion gear testing, bench test under 24V load',
      includesHi: 'कार्बन ब्रश, सोलेनोइड स्विच जांच, पिनियन गियर और 24V लोड पर टेस्ट'
    }
  ];

  return (
    <section id="rates-section" className="py-20 bg-[#080B10] text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'पारदर्शी वर्कशॉप लेबर बेंचमार्क' : 'Owner-Approved Transparent Labor Benchmarks'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
            {t.ratesTitle}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-300 font-medium">
            {t.ratesSub}
          </p>
        </div>

        {/* Rates Table / Card Grid */}
        <div className="bg-[#0E121B] rounded-3xl shadow-xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/5">
            {rateItems.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 hover:bg-white/5 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 md:max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-gray-500 font-mono">0{idx + 1}.</span>
                    <h3 className="font-extrabold text-base sm:text-lg text-white font-heading">
                      {language === 'hi' ? item.jobHi : item.jobEn}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center space-x-1.5 pl-6">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'hi' ? item.includesHi : item.includesEn}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 shrink-0 pl-6 md:pl-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">{language === 'hi' ? 'समय' : 'Est. Time'}</span>
                    <span className="text-xs font-semibold text-gray-300">{language === 'hi' ? item.timeHi : item.timeEn}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">{language === 'hi' ? 'मानक लेबर' : 'Benchmark Labor'}</span>
                    <span className="text-base sm:text-lg font-black text-[#FF5A1F] font-mono">{item.rate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-5 bg-white/5 border-t border-white/10 text-xs text-gray-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.ratesNotice}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
