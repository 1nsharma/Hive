import React, { useState } from "react";

interface PreOrderCardsProps {
  triggerToast: (msg: string) => void;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  unit: string;
  badge?: string;
  image?: string;
  specs: string[];
}

export default function PreOrderCards({ triggerToast }: PreOrderCardsProps) {
  const [reservedPlans, setReservedPlans] = useState<Record<string, boolean>>({});

  const plans: Plan[] = [
    {
      id: "qr-sticker",
      name: "QR Sticker Pack",
      price: "₹149",
      unit: "/ pack of 3",
      specs: [
        "Weatherproof stickers for collar & gate",
        "Unique pet URL per sticker",
        "Public page + SOS included",
        "Works on every smartphone camera",
      ],
    },
    {
      id: "nfc-collar",
      name: "NFC + QR Collar Tag",
      price: "₹499",
      unit: "/ tag",
      badge: "MOST LOVED",
      image: "/assets/smart-qr-tag.png",
      specs: [
        "Tap-to-open on NFC phones, QR fallback",
        "Engraved paw ID, lifetime binding",
        "Lost-mode banner + sighting alerts",
        "Free replacement if tag breaks",
      ],
    },
    {
      id: "metal-premium",
      name: "Metal Premium Tag",
      price: "₹999",
      unit: "/ tag",
      specs: [
        "CNC-milled brass or steel body",
        "Dual NFC + laser-etched QR",
        "Waterproof, adventure-proof",
        "Gift box + founding pet parent badge",
      ],
    },
  ];

  const handlePreOrder = (planId: string, planName: string) => {
    setReservedPlans((prev) => ({ ...prev, [planId]: true }));
    triggerToast(`🏷️ ${planName} reserved! We'll WhatsApp you as soon as tags ship.`);
  };

  return (
    <div className="tagcards grid md:grid-cols-3 gap-6">
      {plans.map((p) => {
        const isReserved = reservedPlans[p.id];
        const isFeat = p.badge !== undefined;
        return (
          <div key={p.id} className={`tcard ${isFeat ? "feat" : ""} ${isReserved ? "opacity-90" : ""}`}>
            {p.badge && <span className="ribbon">{p.badge}</span>}
            <h3>{p.name}</h3>
            <div className="price text-4xl font-extrabold my-2">
              {p.price} <small className={isFeat ? "text-green-200" : "text-gray-500"}>{p.unit}</small>
            </div>
            
            {p.image && (
              <div className="timg rounded-xl overflow-hidden my-4 aspect-[2.4/1]">
                <img referrerPolicy="no-referrer" src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
            )}

            <ul className="mb-6">
              {p.specs.map((spec, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-left">
                  {spec}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePreOrder(p.id, p.name)}
              disabled={isReserved}
              className={`btn ${isFeat ? "amber" : "ghost"} cursor-pointer w-full text-center`}
            >
              {isReserved ? "Reserved ✓" : "Pre-order"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
