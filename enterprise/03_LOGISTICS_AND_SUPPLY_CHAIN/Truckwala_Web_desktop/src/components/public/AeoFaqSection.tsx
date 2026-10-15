import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

interface FaqItem {
  id: string;
  category: "breakdown" | "bs6" | "diagnostics" | "parts";
  questionEn: string;
  questionHi: string;
  directAnswer: string;
  detail: string;
  meta: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "breakdown",
    questionEn: "What should I do immediately when my truck breaks down on the highway?",
    questionHi: "हाईवे पर ट्रक अचानक बंद या खराब होने पर सबसे पहले क्या करें?",
    directAnswer:
      "Safely park the vehicle on the highway shoulder, turn on hazard lights, place reflective triangles 50m behind, and call Truck Wala 24×7 Highway SOS at 9140889473 or WhatsApp live GPS location to 7070709082.",
    detail:
      "गाड़ी को तुरंत सड़क के बाईं ओर सुरक्षित शोल्डर पर रोकें और पार्किंग/हैज़र्ड लाइट जलाएं। इसके बाद तुरंत Truck Wala 24×7 हेल्पलाइन (9140889473) पर कॉल करें या 7070709082 पर व्हाट्सएप लोकेशन भेजें। हमारी नजदीकी मोबाइल रिपेयर वैन औसतन 38 मिनट में मौके पर पहुंचती है।",
    meta: "Direct AEO Answer • Emergency SOP",
  },
  {
    id: "faq-2",
    category: "bs6",
    questionEn: "How do you fix BS-VI AdBlue / DEF dosing errors and engine derate on the road?",
    questionHi: "BS-VI ट्रक में DEF (AdBlue) लाइट जलने या पिकअप डाउन (Derate) होने पर क्या समाधान है?",
    directAnswer:
      "Our technicians connect computerized diagnostic laptops with Cummins INSITE / Tata TDT to scan SCR fault codes (SPN 4364 / SPN 3364), test the AdBlue dosing injector & pump pressure, check DEF quality, and perform stationary forced DPF regeneration on-site.",
    detail:
      "BS-VI ट्रकों में जब DEF क्वालिटी खराब होती है या नोजल चोक होता है, तो इंजन 50% पिकअप गिरा देता है। हमारे इंजीनियर लैपटॉप से OBD पोर्ट स्कैन करके फ़ॉल्ट कोड क्लियर करते हैं, AdBlue पंप प्रेशर टेस्ट करते हैं और जरूरत पड़ने पर मौके पर ही रीजेनरेशन पूरा करते हैं।",
    meta: "BS-VI SCR & DPF Diagnostics",
  },
  {
    id: "faq-3",
    category: "diagnostics",
    questionEn: "How long does a computerized laptop diagnostic scan take on a Tata or Cummins truck?",
    questionHi: "टाटा या कमिंस ट्रक की लैपटॉप डायग्नोस्टिक्स में कितना समय लगता है?",
    directAnswer:
      "A complete OBD-II electronic diagnostic health scan takes 15 to 25 minutes. It reads active and inactive fault codes, checks injector balancing, boost pressure, fuel rail pressure, and ECU calibration.",
    detail:
      "हमारे पास Tata Diagnostic Tool (TDT), Cummins INSITE और Bosch KTS उपलब्ध हैं। 15-25 मिनट के भीतर गाड़ी का पूरा इलेक्ट्रॉनिक हेल्थ कार्ड और सेंसर डेटा स्क्रीन पर आ जाता है जिससे बिना अंदाजे के सही रिपेयर होती है।",
    meta: "OBD Electronics & ECU Scan",
  },
  {
    id: "faq-4",
    category: "parts",
    questionEn: "Do you supply 100% genuine OEM spare parts for heavy commercial vehicles?",
    questionHi: "क्या ट्रक वाला पर केवल 100% असली (Genuine) पार्ट्स ही इस्तेमाल होते हैं?",
    directAnswer:
      "Yes. Truck Wala 24×7 supplies 100% genuine factory-sealed spare parts for Tata Motors, Cummins, Fleetguard, Wabco, Knorr-Bremse, and Bosch with tax invoices and manufacturer warranty.",
    detail:
      "हम किसी भी डुप्लीकेट या री-पैक्ड लोकल पार्ट्स का इस्तेमाल नहीं करते। क्लच प्लेट, एयर ब्रेक वॉल्व, क्रैंकशाफ्ट बेयरिंग, वाटर सेपरेटर और सेंसर सीधे अधिकृत वितरक से आते हैं और हर पार्ट का बारकोड बिल पर दर्ज होता है।",
    meta: "100% OEM Guarantee",
  },
  {
    id: "faq-5",
    category: "breakdown",
    questionEn: "What is your emergency mobile repair van arrival time on major highways?",
    questionHi: "हाईवे पर आपकी मोबाइल इमरजेंसी वैन कितनी देर में पहुंचती है?",
    directAnswer:
      "Our average arrival time along NH-48, NH-19, NH-44, and national freight corridors is 35 to 45 minutes, tracked with live GPS updates.",
    detail:
      "हमारी मोबाइल वैन में एयर कंप्रेसर, जनरेटर, हैवी हाइड्रोलिक जैक, गैस कटर, और बेसिक रनिंग स्पेयर पार्ट्स (बेयरिंग, फैन बेल्ट, ब्रेक पाइप, फ्यूल पाइप) हमेशा रेडी रहते हैं ताकि 90% केस में मौके पर ही गाड़ी चालू हो जाए।",
    meta: "National Highway Patrol Coverage",
  },
  {
    id: "faq-6",
    category: "parts",
    questionEn: "Which heavy commercial vehicle brands and models are supported at the workshop?",
    questionHi: "वर्कशॉप पर किन-किन कमर्शियल गाड़ियों और मॉडल्स का काम होता है?",
    directAnswer:
      "We specialize in Tata Motors (Signa, Prima, LPT 1613, 2518, 3118, 4018) and Cummins Engines. We also service Ashok Leyland (AVTR, Ecomet), Eicher Pro series, BharatBenz, and Mahindra Blazo.",
    detail:
      "मैकेनिकल, न्यूमैटिक्स, एयर ब्रेक और इलेक्ट्रिकल काम सभी 6-टायर से 22-टायर मल्टी-एक्सल ट्रकों, ट्रेलर्स और टैंकरों के लिए 24 घंटे उपलब्ध है।",
    meta: "Multi-Brand Commercial Fleet",
  },
];

export const AeoFaqSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItem, setOpenItem] = useState<string>("faq-1");

  const filteredItems =
    selectedCategory === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-primary text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AEO / Search Direct Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Commercial Transport FAQs & Direct Answers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Factual, machine-readable answers regarding highway breakdown rescue, BS-VI electronics, laptop OBD diagnostics, and genuine commercial spare parts.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Topics ({FAQ_ITEMS.length})
            </button>
            <button
              onClick={() => setSelectedCategory("breakdown")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === "breakdown"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Highway Breakdown
            </button>
            <button
              onClick={() => setSelectedCategory("bs6")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === "bs6"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              BS-VI & DEF
            </button>
            <button
              onClick={() => setSelectedCategory("diagnostics")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === "diagnostics"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Laptop OBD
            </button>
            <button
              onClick={() => setSelectedCategory("parts")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === "parts"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Genuine Parts
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredItems.map((item) => {
            const isOpen = openItem === item.id;
            return (
              <div
                key={item.id}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:border-slate-300 transition"
              >
                <button
                  onClick={() => setOpenItem(isOpen ? "" : item.id)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none bg-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.meta}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {item.questionEn}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500">
                      {item.questionHi}
                    </p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-red-50 text-primary border-red-200" : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 space-y-3">
                    {/* Direct Answer Box (AEO Pattern) */}
                    <div className="p-4 rounded-xl bg-white border-l-4 border-red-600 border border-slate-200 shadow-xs">
                      <p className="text-xs font-black uppercase tracking-wider text-red-600 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Direct Answer</span>
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                        {item.directAnswer}
                      </p>
                    </div>

                    {/* Ground Hindi Explanation */}
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 leading-relaxed">
                      <span className="font-bold text-amber-900 block mb-1">विस्तृत जानकारी (Ground Details):</span>
                      {item.detail}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Help Box */}
        <div className="max-w-4xl mx-auto mt-10 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold">Have a specific breakdown query right now?</h4>
              <p className="text-xs text-slate-300">Talk directly to our Senior Technical Officer on duty.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:9140889473"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              📞 9140889473
            </a>
            <a
              href="https://wa.me/917070709082?text=Hello%20Truck%20Wala%2024x7,%20I%20have%20a%20technical%20question%20about%20my%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
