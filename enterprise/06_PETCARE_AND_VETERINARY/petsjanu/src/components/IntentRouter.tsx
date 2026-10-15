import React, { useState } from "react";

interface IntentRouterProps {
  onRouteAction: (intentKey: string) => void;
}

interface IntentData {
  n: string;
  d: string;
  m: string[];
}

const INTENTS: Record<string, IntentData> = {
  protect: {
    n: "Protect My Pet",
    d: "Lost pet guidance, tag activation, public SOS broadcasting, real-time scanning notifications and emergency backup contacts — activated instantly.",
    m: ["Mark Lost / SOS Trigger", "Public Pet Profile Update", "Smart Tag Scanner Activation", "Emergency contacts backup", "Sighting report triggers"],
  },
  healthy: {
    n: "Keep My Pet Healthy",
    d: "Automated symptom triage, professional food allergy matching, custom vaccination scheduler and wellness records logs — linked to vet routing.",
    m: ["AI Care Chatbot", "Urgency symptom check", "Vaccination schedule timeline", "Deworming alerts", "Veterinary clinic dispatch"],
  },
  train: {
    n: "Train My Pet",
    d: "Step-by-step behavior charts, positive reinforcement tips, custom puppy progress boards, and - coming soon - a professional local trainer dispatch.",
    m: ["Training advice", "Positive reinforcement plans", "Trainer marketplace match (soon)"],
  },
  vet: {
    n: "Find the Best Vet",
    d: "Verified nearby clinics and hospital locations with reviews and instant booking, linked to your pet's vaccination passport history.",
    m: ["Clinic geographic listings", "Review boards", "Appointment scheduler (soon)"],
  },
  food: {
    n: "Buy Pet Food",
    d: "Curated nutrition shop offering customized AI food picks that respect your dog's breed, age, weight, and existing allergies.",
    m: ["Marketplace cart (soon)", "Allergy-aware dietary checks", "Subscription deliveries"],
  },
  life: {
    n: "Manage My Pet's Entire Life",
    d: "The unified pet cloud — medical files passport, pet insurance coverage, professional grooming booking, and city safety network.",
    m: ["Lifetime records repository", "Insurance binders", "Grooming & daycare planner", "Municipal pet net"],
  },
};

export default function IntentRouter({ onRouteAction }: IntentRouterProps) {
  const [inputValue, setInputValue] = useState("");
  const [detectedKey, setDetectedKey] = useState<string>("protect");

  const chips = [
    { label: "Mera pet kho gaya hai", query: "Mera pet kho gaya hai" },
    { label: "Khana nahi kha raha", query: "Mera kutta khana nahi kha raha" },
    { label: "Train my puppy", query: "Puppy ko train karna hai" },
    { label: "Best vet nearby", query: "Best vet chahiye nearby" },
    { label: "Order pet food", query: "Pet food order karna hai" },
    { label: "Manage entire life", query: "Manage my pet's entire life" },
  ];

  const detectIntent = (text: string): string => {
    const t = text.toLowerCase();
    const has = (...keys: string[]) => keys.some((k) => t.includes(k));

    if (has("kho", "lost", "missing", "gum", "sos", "scan", "tag", "reunite")) return "protect";
    if (has("train", "trick", "behav", "bite", "naughty", "bark")) return "train";
    if (has("vet", "doctor", "clinic", "hospital", "dispensary")) return "vet";
    if (has("order", "buy", "kharid", "treat", "food", "khareed", "ration", "shop")) return "food";
    if (has("manage", "entire", "record", "everything", "life", "insurance", "groom")) return "life";
    if (has("khana", "eat", "vaccin", "sick", "health", "vomit", "ulti", "weight", "bimar", "tired", "fever", "diarrhea")) return "healthy";
    return "protect";
  };

  const handleRoute = (queryText: string) => {
    const key = detectIntent(queryText);
    setDetectedKey(key);
    onRouteAction(key);
  };

  const currentIntent = INTENTS[detectedKey];

  return (
    <div className="ir-box reveal in">
      <div className="ir-input mb-4">
        <input
          id="intentInput"
          type="text"
          placeholder='Type anything… e.g. "Mera pet kho gaya hai"'
          aria-label="Type an intent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRoute(inputValue || "Mera pet kho gaya hai");
            }
          }}
          className="bg-green-950/40 border border-green-800 rounded-xl p-3 text-white placeholder-green-600 outline-none w-full focus:border-amber-500"
        />
        <button
          id="intentGo"
          onClick={() => handleRoute(inputValue || "Mera pet kho gaya hai")}
          className="btn bg-amber-500 border-amber-500 text-green-950 font-bold px-6 rounded-xl hover:bg-amber-400 cursor-pointer"
        >
          Route →
        </button>
      </div>

      <div className="ir-chips flex flex-wrap gap-2 mb-6">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputValue(chip.query);
              handleRoute(chip.query);
            }}
            className="text-xs border border-green-800 hover:border-amber-500 hover:text-amber-500 rounded-full px-3 py-1 bg-transparent text-gray-300 transition cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="ir-out border-t border-dashed border-green-800 pt-4">
        <span className="tag bg-amber-500 text-green-950 font-bold text-[10px] tracking-wider rounded px-2.5 py-1 mb-2 inline-block">
          INTENT DETECTED
        </span>
        <h4 className="text-xl font-bold font-serif mb-1 text-white">{currentIntent.n}</h4>
        <p className="text-sm text-green-200/85 mb-4">{currentIntent.d}</p>
        
        <div className="ir-mods flex flex-wrap gap-2">
          {currentIntent.m.map((mod, mIdx) => (
            <span
              key={mIdx}
              className="text-xs bg-amber-500/10 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg font-semibold animate-fadeIn"
              style={{ animationDelay: `${mIdx * 80}ms` }}
            >
              {mod}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
