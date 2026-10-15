import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, DeveloperTag, DealInput } from "../types";
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Building,
  Scale,
  DollarSign,
  ShieldCheck,
  Hammer,
  TrendingUp,
  LineChart,
  Compass,
  Crown,
  BookOpen,
  ShieldAlert,
  Briefcase,
} from "lucide-react";

interface CopilotChatViewProps {
  initialTopic?: string;
  initialTag?: DeveloperTag;
  activeDeal?: DealInput;
}

const TAG_CONFIG: Record<
  DeveloperTag,
  { label: string; icon: React.ReactNode; color: string; desc: string; samplePrompt: string }
> = {
  LEARN: {
    label: "[LEARN]",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    desc: "Teach me development concepts & formulas",
    samplePrompt: "Explain the exact difference between RERA Carpet Area, Built-Up Area, and Super Built-Up loading with a numerical example.",
  },
  DEAL: {
    label: "[DEAL]",
    icon: <Building className="w-3.5 h-3.5" />,
    color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    desc: "Evaluate & teardown a real property opportunity",
    samplePrompt: "Analyze this 1-acre plot: Land ask ₹10 Cr, FAR 2.5, Construction ₹2,400/sq.ft, Expected sales ₹7,500/sq.ft. What is my profit and risk?",
  },
  LAND: {
    label: "[LAND]",
    icon: <Compass className="w-3.5 h-3.5" />,
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    desc: "Land economics, zoning, road width & FAR potential",
    samplePrompt: "How does road width (40ft vs 60ft vs 80ft) impact permissible FAR and commercial ground floor retail viability in city master plans?",
  },
  MONEY: {
    label: "[MONEY]",
    icon: <DollarSign className="w-3.5 h-3.5" />,
    color: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    desc: "Capital stack, debt vs equity, LP/GP waterfalls",
    samplePrompt: "How do I structure a 12% preferred return hurdle with an 80/20 GP/LP catch-up for family office equity investors?",
  },
  LEGAL: {
    label: "[LEGAL]",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    color: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    desc: "Title DD, RERA compliance, JDA clauses & encumbrances",
    samplePrompt: "What are the 5 non-negotiable clauses I must include in a registered JDA to protect against landowner delay or title dispute?",
  },
  BUILD: {
    label: "[BUILD]",
    icon: <Hammer className="w-3.5 h-3.5" />,
    color: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    desc: "Construction scheduling, EPC contracts & cost control",
    samplePrompt: "How do I structure retention money and material price escalation clauses in an item-rate contractor tender?",
  },
  SELL: {
    label: "[SELL]",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    desc: "Pricing escalation curves, brokers & launch velocity",
    samplePrompt: "Design a 4-phase launch pricing curve: Soft launch (loyalty) → Grand Launch → Slab Milestones → Ready Possession premium.",
  },
  FINANCE: {
    label: "[FINANCE]",
    icon: <LineChart className="w-3.5 h-3.5" />,
    color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    desc: "Cash flow pro-forma, IRR, breakeven & IDC",
    samplePrompt: "How do I calculate Interest During Construction (IDC) on a 24-month draw-down schedule and determine exact breakeven sales velocity?",
  },
  STRATEGY: {
    label: "[STRATEGY]",
    icon: <Scale className="w-3.5 h-3.5" />,
    color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    desc: "Company scaling & money progression roadmap",
    samplePrompt: "I have ₹20 Lakhs in capital. Give me the step-by-step roadmap to scale to a ₹20 Cr development portfolio in 36 months.",
  },
  MASTER: {
    label: "[MASTER]",
    icon: <Crown className="w-3.5 h-3.5" />,
    color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    desc: "Large-scale urban platforms, PPPs & city building",
    samplePrompt: "How do master developers integrate district cooling, solar micro-grids, and fiber utilities into 30-year perpetual recurring revenue?",
  },
  RISK: {
    label: "[RISK]",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    color: "bg-red-500/15 text-red-300 border-red-500/30",
    desc: "RERA non-compliance, litigation stays & construction overruns",
    samplePrompt: "What are the most common penal liabilities under Section 59 & 60 of RERA, and how can developers insulate themselves?",
  },
  PORTFOLIO: {
    label: "[PORTFOLIO]",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    desc: "Multi-project pipeline, capital allocation & risk concentration",
    samplePrompt: "How should a mid-market developer balance a 3-project pipeline across residential high-rise, plotted development, and commercial retail?",
  },
};

export const CopilotChatView: React.FC<CopilotChatViewProps> = ({
  initialTopic,
  initialTag = "LEARN",
  activeDeal,
}) => {
  const [selectedTag, setSelectedTag] = useState<DeveloperTag>(initialTag);
  const [inputMessage, setInputMessage] = useState<string>(initialTopic ? `Teach me about ${initialTopic}` : "");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      tag: "LEARN",
      text: `### 🏗️ Welcome to Real Estate Developer HQ

I am your **Lead Master Developer & Portfolio Investment Strategist**.
Whenever you bring a query, property, or question here, tag it with our classification framework:

- \`[LEARN]\` — Teach me concepts, formulas, and terminology.
- \`[DEAL]\` — Analyze a specific property opportunity & calculate feasibility.
- \`[LAND]\` — Land valuation, FAR/FSI, road width, and zoning potential.
- \`[MONEY]\` — Capital stack, investor protections, debt vs equity waterfalls.
- \`[LEGAL]\` — 30-year title search, RERA 70:30 escrow, JDA agreements.
- \`[BUILD]\` — Construction contracts, MEP, quality control, S-curve delays.
- \`[SELL]\` — Launch pricing curves, broker networks, and sales velocity.
- \`[FINANCE]\` — Pro-forma models, IRR, MOIC, breakeven, and cash flows.
- \`[STRATEGY]\` — Scaling your company from ₹0 to ₹100Cr+ portfolio.
- \`[MASTER]\` — Integrated townships, smart city platforms, and urban ecosystems.

What deal or concept are we analyzing today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      tag: selectedTag,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          tag: selectedTag,
          dealContext: activeDeal,
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reach AI mentor.");
      }

      const botMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "assistant",
        text: data.text,
        tag: selectedTag,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "assistant",
          tag: selectedTag,
          text: `⚠️ **Error Processing Query:** ${err.message || "Please ensure GEMINI_API_KEY is configured."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentTagConfig = TAG_CONFIG[selectedTag];

  return (
    <div className="space-y-6 pb-16 text-slate-100 max-w-5xl mx-auto">
      {/* Classification Tag Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Select Query Tag Classification:</span>
          </div>
          {activeDeal && (
            <span className="text-[11px] text-amber-400 font-mono hidden sm:inline-block">
              Context Synced: {activeDeal.name}
            </span>
          )}
        </div>

        {/* 10 Tag Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {(Object.keys(TAG_CONFIG) as DeveloperTag[]).map((tagKey) => {
            const cfg = TAG_CONFIG[tagKey];
            const isSelected = selectedTag === tagKey;
            return (
              <button
                key={tagKey}
                onClick={() => setSelectedTag(tagKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                  isSelected
                    ? `${cfg.color} ring-2 ring-amber-400/40 font-bold scale-[1.02]`
                    : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                }`}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tag Helper & Starter Prompt */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-400">
            <span className="text-slate-200 font-semibold">{currentTagConfig.label}:</span>{" "}
            {currentTagConfig.desc}
          </div>
          <button
            onClick={() => {
              setInputMessage(currentTagConfig.samplePrompt);
            }}
            className="text-amber-400 hover:text-amber-300 underline text-left sm:text-right"
          >
            Insert prompt template ↗
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl min-h-[480px] flex flex-col justify-between">
        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            const tagCfg = m.tag ? TAG_CONFIG[m.tag] : TAG_CONFIG.LEARN;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Header Tag Badge */}
                <div className="flex items-center space-x-2 mb-1 px-1">
                  {m.tag && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider border ${tagCfg.color}`}
                    >
                      {m.tag}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">{m.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-3xl relative group ${
                    isUser
                      ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg"
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {m.text}
                  </div>

                  {/* Copy Button */}
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-amber-300 max-w-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Real Estate Developer HQ Copilot is analyzing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-6 pt-4 border-t border-slate-700/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask under ${currentTagConfig.label} (e.g. "${currentTagConfig.samplePrompt.substring(0, 45)}...")`}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 transition-all shrink-0"
            >
              <span>Ask HQ</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
