import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, ShieldCheck, Film, Image as ImageIcon, Wrench, Laptop, Truck, Navigation } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RealWorkShowcaseProps {
  language: Language;
}

export const RealWorkShowcase: React.FC<RealWorkShowcaseProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'video' | 'photos'>('video');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoCases = [
    {
      id: 'case-engine',
      titleEn: 'Cummins 6BT 2518 Engine Complete Rebuild',
      titleHi: 'कमिंस 6BT 2518 इंजन का पूर्ण ओवरहाल',
      vehicle: 'Tata 2518 Heavy Tipper',
      categoryEn: 'Heavy Engine',
      categoryHi: 'हेवी इंजन',
      problemEn: 'Loss of compression, heavy blow-by smoke and oil leakage',
      problemHi: 'बैक कंप्रेशन, भारी काला धुआं और ऑयल लीकेज',
      actionEn: 'New cylinder liners, precision crank grinding, connecting rod alignment, and dynamometer calibration.',
      actionHi: 'नई स्लीव पिस्टन, क्रैंकशाफ्ट ग्राइंडिंग और फ्यूल पंप का बेंच टेस्ट।',
      turnaround: '4 Days',
      status: 'Verified Field Delivery',
      color: 'from-blue-900 to-slate-900',
      specs: ['6-Cylinder Turbo', '180 HP', 'Common Rail Calibrated']
    },
    {
      id: 'case-diag',
      titleEn: 'BS-VI Tata Signa AdBlue Derate & DPF Regeneration',
      titleHi: 'BS-VI टाटा सिगना AdBlue फॉल्ट व DPF रीजेनरेशन',
      vehicle: 'Tata Signa 2823.K BS-VI',
      categoryEn: 'BS-VI Diagnostics',
      categoryHi: 'BS-VI डायग्नोस्टिक्स',
      problemEn: 'Truck speed locked to 20 km/h due to DEF dosing error (Limp Home Mode)',
      problemHi: 'AdBlue सिस्टम एरर से गाड़ी की स्पीड 20 किमी/घंटे पर लॉक',
      actionEn: 'Cummins Insite & Tata diagnostic tool scan, DEF injector de-crystallization, and stationary DPF thermal regeneration.',
      actionHi: 'लैपटॉप सॉफ्टवेयर से फॉल्ट ट्रेस, DEF इंजेक्टर सफाई और स्टेशनरी DPF रीजेनरेशन।',
      turnaround: '90 Minutes',
      status: 'Fault Cleared',
      color: 'from-purple-950 to-indigo-950',
      specs: ['ECU Scanned', 'Soot Level: 0%', 'Full Power Restored']
    },
    {
      id: 'case-highway',
      titleEn: 'Highway NH-19 Midnight Roadside Air Brake Jam Rescue',
      titleHi: 'NH-19 हाईवे पर आधी रात को एयर ब्रेक जाम की त्वरित मदद',
      vehicle: 'Ashok Leyland 3520 (12 Wheeler)',
      categoryEn: 'Emergency Roadside',
      categoryHi: 'इमरजेंसी हाईवे',
      problemEn: 'Trailer spring brake chamber locked on bridge, traffic blocked',
      problemHi: 'फ्लाईओवर पर ब्रेक चैंबर लॉक हो जाने से पहिए जाम',
      actionEn: 'Mobile van dispatched within 25 min, manual caging bolt applied, cracked nylon air line replaced on-site.',
      actionHi: '25 मिनट में मोबाइल वैन पहुंची, मैनुअल केजिंग बोल्ट लगाया और फटी एयर पाइप बदली।',
      turnaround: '35 Minutes on Road',
      status: 'Highway Dispatched',
      color: 'from-red-950 to-stone-900',
      specs: ['Mobile Compressor', 'NH-19 KM 412', 'Traffic Cleared']
    }
  ];

  const currentVideo = videoCases[activeVideoIndex];

  return (
    <section id="work-proof-section" className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'hi' ? 'वास्तविक वर्कशॉप प्रमाण' : 'Actual Workshop Proof & Field Operations'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#212121] tracking-tight">
            {language === 'hi' ? 'कोई फेक या स्टॉक फोटो नहीं — हमारा असली काम देखें' : 'Real Commercial Vehicles. Real Work.'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 font-medium">
            {language === 'hi'
              ? 'देखें कैसे हमारे मैकेनिक हाईवे और वर्कशॉप में जटिल समस्याओं का समाधान करते हैं'
              : 'Authentic records of heavy truck overhauls, computerized ECU diagnostic scans, and emergency roadside van dispatches'}
          </p>

          {/* Tab Selector */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl mt-6 border border-gray-200">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === 'video'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Film className="w-4 h-4 text-red-600" />
              <span>{language === 'hi' ? 'लाइव केस स्टडीज व वीडियो' : 'Live Repair Case Studies'}</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === 'photos'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'वर्कशॉप फोटो गैलरी' : 'Workshop Photo Proof'}</span>
            </button>
          </div>
        </div>

        {activeTab === 'video' ? (
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Main Interactive Showcase Screen */}
            <div className="lg:col-span-8 flex flex-col">
              <div className={`relative rounded-3xl bg-linear-to-br ${currentVideo.color} text-white p-6 sm:p-8 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between shadow-2xl border border-gray-800 overflow-hidden`}>
                
                {/* Visual ambient mechanic grid overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

                {/* Video Top Bar */}
                <div className="relative z-10 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">
                      TruckWala Workshop Cam • {currentVideo.vehicle}
                    </span>
                  </div>

                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">
                    {language === 'hi' ? currentVideo.categoryHi : currentVideo.categoryEn}
                  </span>
                </div>

                {/* Animated Mechanical Simulation & Play Overlay */}
                <div className="relative z-10 my-auto text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-md rounded-full border border-white/25 shadow-xl hover:scale-105 transition cursor-pointer mx-auto mb-4"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-9 h-9 text-white" />
                    ) : (
                      <Play className="w-9 h-9 text-white ml-1" />
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black max-w-lg mx-auto">
                    {language === 'hi' ? currentVideo.titleHi : currentVideo.titleEn}
                  </h3>
                  
                  {/* Live mechanical audio wave visualization */}
                  {isPlaying && (
                    <div className="flex items-center justify-center space-x-1 mt-4">
                      <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                      <span className="w-1 h-8 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1 h-5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1 h-7 bg-purple-400 rounded-full animate-bounce [animation-delay:0.25s]"></span>
                      <span className="text-[11px] text-gray-300 ml-2 font-mono">Live Workshop Audio & Diagnostic Telemetry</span>
                    </div>
                  )}
                </div>

                {/* Video Bottom Spec Details */}
                <div className="relative z-10 pt-4 border-t border-white/15">
                  <div className="grid sm:grid-cols-3 gap-3 text-left text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'समस्या' : 'Reported Fault'}</span>
                      <p className="font-semibold text-gray-200 line-clamp-2">
                        {language === 'hi' ? currentVideo.problemHi : currentVideo.problemEn}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'समाधान' : 'Action Taken'}</span>
                      <p className="font-semibold text-gray-200 line-clamp-2">
                        {language === 'hi' ? currentVideo.actionHi : currentVideo.actionEn}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">{language === 'hi' ? 'समय / स्थिति' : 'Turnaround & Status'}</span>
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{currentVideo.turnaround} ({currentVideo.status})</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Case selector playlist on the right */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {language === 'hi' ? 'हाल की फील्ड केस स्टडीज:' : 'Recent Field Case Studies:'}
              </span>

              {videoCases.map((vc, idx) => {
                const isSelected = idx === activeVideoIndex;
                return (
                  <div
                    key={vc.id}
                    onClick={() => {
                      setActiveVideoIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {language === 'hi' ? vc.categoryHi : vc.categoryEn}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {vc.turnaround}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {language === 'hi' ? vc.titleHi : vc.titleEn}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {vc.vehicle}
                    </p>
                  </div>
                );
              })}

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 mt-auto">
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'ओनर की संतुष्टि की गारंटी' : 'Transporter Verification'}</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  {language === 'hi'
                    ? 'प्रत्येक काम के बाद पुराना पार्ट और कम्प्यूटराइज्ड डायग्नोस्टिक रिपोर्ट गाड़ी मालिक को सौंपी जाती है।'
                    : 'Every single repair includes returned old components and computer-generated diagnostic test verification.'}
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* Workshop Photos Evidence Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
              <div className="h-48 bg-slate-800 relative flex items-center justify-center p-4 text-center">
                <div className="space-y-2">
                  <Laptop className="w-10 h-10 text-purple-400 mx-auto" />
                  <div className="text-xs font-mono text-white font-bold">BS-VI ECU Diagnostics Live</div>
                  <div className="text-[10px] text-gray-400">Connecting Cummins Insite OBD Interface</div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-sm font-mono">OBD Bay 1</span>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-bold text-sm text-gray-900">
                  {language === 'hi' ? 'लैपटॉप डायग्नोस्टिक लैब' : 'Dedicated ECU Diagnostic Lab'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'hi' ? 'AdBlue और DPF फॉल्ट कोड इरेज़र व सेंसर कैलिब्रेशन' : 'AdBlue dosing checks, DPF soot regen, rail pressure calibration.'}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
              <div className="h-48 bg-blue-950 relative flex items-center justify-center p-4 text-center">
                <div className="space-y-2">
                  <Wrench className="w-10 h-10 text-blue-400 mx-auto" />
                  <div className="text-xs font-mono text-white font-bold">Engine Boring & Crank Grinding</div>
                  <div className="text-[10px] text-gray-400">Precision Machine Shop Line Boring</div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-sm font-mono">Machine Bay</span>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-bold text-sm text-gray-900">
                  {language === 'hi' ? 'इन-हाउस मशीन शॉप' : 'In-House Precision Machine Shop'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'hi' ? 'क्रैंकशाफ्ट ग्राइंडिंग, कनेक्टिंग रॉड अलाइनमेंट व वाल्व सीटिंग' : 'Crankshaft journal grinding, line boring, valve seating without external delays.'}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
              <div className="h-48 bg-red-950 relative flex items-center justify-center p-4 text-center">
                <div className="space-y-2">
                  <Truck className="w-10 h-10 text-red-400 mx-auto" />
                  <div className="text-xs font-mono text-white font-bold">24×7 Mobile Highway Van Fleet</div>
                  <div className="text-[10px] text-gray-400">On-Spot Air Compressor & Heavy Hydraulic Jacks</div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-sm font-mono">Highway Unit 4</span>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-bold text-sm text-gray-900">
                  {language === 'hi' ? 'हाईवे मोबाइल रिपेयर वैन' : 'Mobile Emergency Highway Vans'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'hi' ? 'हाईवे पर 50 किमी दायरे में 24 घंटे किसी भी समय ऑन-रोड सहायता' : 'Equipped with pneumatic guns, heavy air tank, jump start cables and critical parts.'}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
