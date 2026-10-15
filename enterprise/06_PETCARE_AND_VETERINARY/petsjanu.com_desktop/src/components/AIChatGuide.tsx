import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, TriageReport } from "../types";

interface AIChatGuideProps {
  triggerToast: (msg: string) => void;
}

const PRESET_QUERIES = [
  "Mera kutta khana nahi kha raha",
  "He is vomiting since morning",
  "He seems tired and scratching a lot",
  "Kaunsa food best hai for indie dogs?",
  "Vaccination schedule kya hai?",
];

// Reliable local fallback engine if backend API fails or GEMINI_API_KEY is missing
function clientSideTriageFallback(text: string): TriageReport {
  const query = text.toLowerCase();
  
  const hasKeywords = (...words: string[]) => 
    words.some(word => query.includes(word));

  // Urgent triage check
  if (hasKeywords("seizure", "fit", "breath", "chok", "bleed", "poison", "collapse", "unresponsive", "bloat", "belly", "heatstroke", "eye", "labor", "labour", "urinate", "accident", "hit", "fracture", "blood")) {
    return {
      riskLevel: "URGENT",
      indicator: "Critical emergency indicators detected.",
      immediateSteps: [
        "Contact a vet or go to an emergency animal clinic right now.",
        "Keep your pet warm, calm, and as still as possible during travel.",
        "Do not offer food, water, or any home remedies.",
        "Ensure their breathing passage is clear.",
      ],
      why: "These clinical signs are life-threatening and require professional medical intervention. Do not delay going to a doctor.",
      watchFor: "Onset of shock, shallow breathing, sudden gums turning pale, or loss of consciousness.",
      disclaimer: "⚠️ This is automated triage. In all emergency scenarios, consult an in-person veterinarian immediately.",
    };
  }

  // Vet Recommended check
  if (hasKeywords("vomit", "ulti", "diarrhea", "loose", "wound", "fever", "pain", "cry", "limp", "refus")) {
    return {
      riskLevel: "VET RECOMMENDED",
      indicator: "Moderate symptoms that require a professional veterinary assessment.",
      immediateSteps: [
        "Plan a vet clinic visit within the next 24 hours.",
        "Keep vaccination and medical history papers handy.",
        "Strictly avoid self-medicating with human drugs (such as paracetamol).",
        "Offer tiny sips of water; withhold food for 4-6 hours if vomiting.",
      ],
      why: "Persistent vomiting, severe diarrhea, limp, or continuous pain indicates underlying inflammation, infection, or distress that needs proper diagnostics.",
      watchFor: "Symptoms worsening, lethargy increasing, or total refusal of hydration.",
      disclaimer: "⚠️ Triage recommendation only. Do not replace vet visits with AI advice.",
    };
  }

  // Monitor check
  if (hasKeywords("eat", "khana", "lethar", "tired", "active", "scratch", "itch", "sneez", "cough", "dull", "appetite")) {
    return {
      riskLevel: "MONITOR",
      indicator: "Mild, non-critical symptoms observed. Suitable for home observation.",
      immediateSteps: [
        "Monitor your pet's dietary intake and physical activity over 12-24 hours.",
        "Prepare a bland home-cooked meal (such as plain rice and boiled pumpkin).",
        "Ensure they have access to pristine, fresh drinking water.",
        "Keep them in a peaceful, comfortable space to rest.",
      ],
      why: "Mild lethargy, temporary changes in appetite, or scratching can often resolve with rest, but require close monitoring to ensure they do not develop into moderate/severe symptoms.",
      watchFor: "Onset of vomiting, severe dullness, or complete refusal to stand.",
      disclaimer: "⚠️ General care advice. If symptoms persist beyond 24 hours, consult a vet.",
    };
  }

  // General low risk or general queries
  if (hasKeywords("vaccin", "schedule", "booster", "anti", "rabies")) {
    return {
      riskLevel: "LOW",
      indicator: "General vaccination information query.",
      immediateSteps: [
        "Annual boosters (DHPPi and Rabies) are mandatory to maintain immunity.",
        "Keep pet vaccination logs updated in your PetGuardian Dashboard.",
        "Consult your local vet if a vaccine booster schedule is overdue.",
      ],
      why: "Vaccination is a preventative measure. Keeping active reminders prevents viral outbreaks.",
      watchFor: "Due dates coming up on your dashboard reminders panel.",
      disclaimer: "⚠️ Triage is active. Consult your vaccination record cards.",
    };
  }

  if (hasKeywords("food", "diet", "nutrition", "eat", "chicken", "allergy")) {
    return {
      riskLevel: "LOW",
      indicator: "General canine or feline dietary guidance.",
      immediateSteps: [
        "For an active indie dog, aim for balanced portions of cooked rice, healthy proteins, and safe vegetables.",
        "Completely avoid dangerous human foods: onions, garlic, chocolate, grapes, and raisins.",
        "If you notice an allergy to chicken (like Bruno has), stick to alternative single-protein diets.",
      ],
      why: "Proper diet and allergen avoidance are the pillars of long-term immune and digestive system health.",
      watchFor: "Itchy skin, hot spots, or gas after food changes.",
      disclaimer: "⚠️ Triage recommendation. Discuss custom diets with an animal nutritionist.",
    };
  }

  return {
    riskLevel: "LOW",
    indicator: "No immediate emergency markers detected. General care advice applies.",
    immediateSteps: [
      "Keep standard daily care, feeding, and hydration schedules.",
      "Observe changes in daily habits, energy, or stool quality.",
      "Log any health update inside the dashboard history planner.",
    ],
    why: "The symptoms described appear mild or represent general pet care queries.",
    watchFor: "Any new symptoms like coughing, itching, or lethargy.",
    disclaimer: "⚠️ Automated AI companion guidance only. Always prioritize your vet's direct instructions.",
  };
}

export default function AIChatGuide({ triggerToast }: AIChatGuideProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Namaste! 🐾 I'm Bruno's AI care companion. Tell me a symptom (e.g. 'khana nahi kha raha', vomiting, deworming) or ask about food, vaccines, or training. I will triage the risk levels instantly.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call server-side Express endpoint /api/triage
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error("Triage API error");
      }

      const report: TriageReport = await response.json();
      
      // Delay slightly for natural chat feeling
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            sender: "ai",
            text: report.indicator,
            triage: report,
            timestamp: new Date().toISOString(),
          },
        ]);
        setIsTyping(false);
      }, 500);

    } catch (err) {
      console.warn("Using smart client-side triage fallback due to API offline/unconfigured.");
      
      // Calculate offline fallback triage result
      const offlineReport = clientSideTriageFallback(text);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            sender: "ai",
            text: offlineReport.indicator,
            triage: offlineReport,
            timestamp: new Date().toISOString(),
          },
        ]);
        setIsTyping(false);
      }, 600);
    }
  };

  const getBadgeClass = (lvl: string) => {
    switch (lvl) {
      case "URGENT":
        return "rbadge rb-urg";
      case "VET RECOMMENDED":
        return "rbadge rb-vet";
      case "MONITOR":
        return "rbadge rb-mon";
      default:
        return "rbadge rb-low";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <div className="chatbox bg-[#FFFDF6] border border-[#E3D9C4] rounded-2xl p-6 shadow-sm">
      <div className="chatlog h-[420px] overflow-y-auto mb-4 border-b border-gray-100 pb-4">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.sender}`}>
            {m.sender === "ai" && !m.triage && (
              <>
                <span className="rbadge rb-low">PETGUARDIAN AI · CARE ASSISTANT</span>
                <p className="text-sm font-normal text-gray-800">{m.text}</p>
              </>
            )}

            {m.sender === "user" && (
              <p className="text-sm">{m.text}</p>
            )}

            {m.sender === "ai" && m.triage && (
              <div className="text-gray-800">
                <span className={getBadgeClass(m.triage.riskLevel)}>
                  RISK LEVEL · {m.triage.riskLevel}
                </span>
                
                <p className="text-sm font-semibold mb-3 mt-1 text-gray-900">{m.triage.indicator}</p>
                
                <h6 className="font-mono text-[10px] uppercase tracking-wider text-green-800 font-bold mb-1.5">
                  Immediate Care Steps
                </h6>
                <ul className="list-disc pl-5 text-xs text-gray-700 flex flex-col gap-1 mb-3">
                  {m.triage.immediateSteps.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ul>

                <h6 className="font-mono text-[10px] uppercase tracking-wider text-green-800 font-bold mb-1">
                  clinical analysis
                </h6>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{m.triage.why}</p>

                <h6 className="font-mono text-[10px] uppercase tracking-wider text-green-800 font-bold mb-1">
                  watch out for
                </h6>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{m.triage.watchFor}</p>

                <p className="disc text-[10.5px] border-t border-dashed border-gray-200 pt-2 mt-2 text-amber-800 italic">
                  {m.triage.disclaimer}
                </p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="msg ai">
            <span className="typing">
              <i></i>
              <i></i>
              <i></i>
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chatchips flex flex-wrap gap-2 mb-4 justify-start">
        {PRESET_QUERIES.map((q, idx) => (
          <button 
            key={idx} 
            onClick={() => handleSend(q)}
            className="chatchip text-xs border border-gray-300 rounded-full px-3 py-1.5 bg-white text-gray-700 hover:border-green-800 hover:text-green-800 font-medium transition cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      <form className="chatin flex gap-2" onSubmit={handleSubmit}>
        <input 
          id="chatInput" 
          placeholder="Describe a symptom or ask a care question…" 
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800"
        />
        <button 
          className="btn sm cursor-pointer bg-green-800 text-white font-bold px-4 rounded-xl hover:bg-green-900 transition" 
          type="submit"
        >
          Ask →
        </button>
      </form>
    </div>
  );
}
