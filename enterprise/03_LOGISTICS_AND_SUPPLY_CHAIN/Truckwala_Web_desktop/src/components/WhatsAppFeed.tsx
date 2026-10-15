import React, { useState } from "react";
import {
  Send,
  Paperclip,
  Mic,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  CheckCheck,
  ShieldAlert,
  Sparkles,
  Info,
  Clock,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { IngestionMessage, ClassificationType } from "../types";

interface WhatsAppFeedProps {
  messages: IngestionMessage[];
  onSendMessage: (msg: {
    text: string;
    mediaType?: "image" | "pdf" | "bill" | "voice" | "video";
    mediaUrl?: string;
    fileName?: string;
    sender?: string;
  }) => Promise<void>;
  onSelectForAudit: (message: IngestionMessage) => void;
  isLoading: boolean;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  searchTerm?: string;
}

export const WhatsAppFeed: React.FC<WhatsAppFeedProps> = ({
  messages,
  onSendMessage,
  onSelectForAudit,
  isLoading,
  selectedFilter,
  setSelectedFilter,
  searchTerm = "",
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<"none" | "bill" | "image" | "voice" | "shelf">("none");
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      selectedFilter === "ALL" ||
      m.classification === selectedFilter ||
      (selectedFilter === "NEEDS_REVIEW" && m.auditStatus === "NEEDS_REVIEW");

    const matchesSearch =
      !searchTerm ||
      m.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.extracted.partName && m.extracted.partName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.extracted.vehicleNumber && m.extracted.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && selectedMediaType === "none") return;

    let mediaType: "image" | "pdf" | "bill" | "voice" | undefined = undefined;
    let mediaUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;

    if (selectedMediaType === "bill") {
      mediaType = "bill";
      mediaUrl = "https://images.unsplash.com/photo-1554415707-9e4c09d48d53?w=800&auto=format&fit=crop&q=60";
      fileName = "tax_invoice_purchase_" + Date.now() + ".jpg";
    } else if (selectedMediaType === "image") {
      mediaType = "image";
      mediaUrl = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=60";
      fileName = "vehicle_breakdown_photo.jpg";
    } else if (selectedMediaType === "shelf") {
      mediaType = "image";
      mediaUrl = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60";
      fileName = "rack_godown_photo.jpg";
    } else if (selectedMediaType === "voice") {
      mediaType = "voice";
    }

    const currentText = inputText.trim() || (selectedMediaType === "bill" ? "Aaj ye maal aaya hai bill photo bhej raha hu" : "Operational voice / photo update");
    setInputText("");
    setSelectedMediaType("none");

    await onSendMessage({
      text: currentText,
      mediaType,
      mediaUrl,
      fileName,
      sender: "Rajesh Sharma (Owner)",
    });
  };

  const applyScenario = async (scenarioKey: string) => {
    if (scenarioKey === "bill") {
      await onSendMessage({
        text: "Aaj ye maal aaya hai Sharma Auto Spares se. 4 Clutch plate aur 2 pressure plate.",
        mediaType: "bill",
        mediaUrl: "https://images.unsplash.com/photo-1554415707-9e4c09d48d53?w=800&auto=format&fit=crop&q=60",
        fileName: "bill_sharma_auto_912.jpg",
        sender: "Ramesh Ustad (Head Mechanic)",
      });
    } else if (scenarioKey === "po-delivery") {
      await onSendMessage({
        text: "PO-2024-001 maal aa gaya! 17/17 items received from Sharma Auto Spares. Viscus T, UC Visvus, Relay sab check kiya. Bill attached.",
        mediaType: "bill",
        mediaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
        fileName: "po_2024_001_delivery_bill.jpg",
        sender: "Ramesh Ustad (Head Mechanic)",
      });
    } else if (scenarioKey === "breakdown") {
      await onSendMessage({
        text: "Emergency breakdown: Truck RJ14-GB-4412 NH-48 Dharuhera flyover par khada hai. Wheel hub bearing jam ho gaya.",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=60",
        fileName: "dharuhera_breakdown_hub.jpg",
        sender: "Mahesh Driver",
      });
    } else if (scenarioKey === "shelf") {
      await onSendMessage({
        text: "Godown shelf Rack 3 photo. Dusty boxes hain, 14 bearing lag rahe hain bina bill ke.",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
        fileName: "shelf_rack3_boxes.jpg",
        sender: "Sonu Technician",
      });
    } else if (scenarioKey === "sale") {
      await onSendMessage({
        text: "Gadi NL01-K-8821 ko 2 brake liner cash me bech diya. ₹1,700 mila.",
        mediaType: "voice",
        fileName: "voice_note_cash_sale.opus",
        sender: "Guddu (Shop Boy)",
      });
    } else if (scenarioKey === "dealer") {
      await onSendMessage({
        text: "Bajrang Spares se 10 pails grease aaya hai, challan par sign kiya hai bill kal aayega.",
        mediaType: "bill",
        mediaUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=60",
        fileName: "challan_bajrang_spares.jpg",
        sender: "Rajesh Sharma (Owner)",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* WhatsApp Header */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 p-3 sm:p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-base shadow-md">
              🚛
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-emerald-100 flex items-center gap-1.5">
                Truck Wala 24×7 — Owner Operations
              </h2>
              <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                WhatsApp Live
              </span>
            </div>
            <p className="text-xs text-emerald-300/80">
              Owner, Ramesh Ustad, Sonu Tech, Guddu, Drivers (6 members)
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded-md border border-emerald-700/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Background Classifier Active</span>
          </span>
        </div>
      </div>

      {/* Core Principle Callout Banner */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 text-xs flex items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">Design Principle:</span>
          <span className="text-slate-400 italic">
            "Owner wahi kaam kare jo wo aaj karta hai — System uske kaam se data samjhe."
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden lg:inline">
          Original never destroyed • Human verification before inventory
        </span>
      </div>

      {/* Classification Filter Bar */}
      <div className="bg-slate-950/60 p-2.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1 pr-1">
          Filter:
        </span>
        {[
          { id: "ALL", label: "All Activity" },
          { id: "NEEDS_REVIEW", label: "⚠️ Needs Review" },
          { id: "PURCHASE", label: "🧾 Purchases" },
          { id: "EMERGENCY", label: "🚨 Emergencies" },
          { id: "INVENTORY", label: "📦 Inventory/Shelves" },
          { id: "SALE", label: "💰 Sales" },
          { id: "VEHICLE_ISSUE", label: "🚛 Vehicle Issues" },
        ].map((btn) => (
          <button
            key={btn.id}
            id={`filter-${btn.id.toLowerCase()}`}
            onClick={() => setSelectedFilter(btn.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedFilter === btn.id
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/90">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Info className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-medium">No messages match your search or filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try sending a message or clicking one of the sample scenarios below.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isOwner = msg.sender.includes("Owner");
            return (
              <div
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`flex flex-col ${isOwner ? "items-end" : "items-start"}`}
              >
                {/* Sender Pill */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400 font-medium">
                  <span className={isOwner ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {msg.sender}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Chat Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-md transition-all ${
                    isOwner
                      ? "bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700/60"
                      : "bg-slate-850 text-slate-100 rounded-tl-none border border-slate-800/80"
                  }`}
                >
                  {/* Media Content if attached */}
                  {msg.mediaUrl && (
                    <div className="mb-2.5 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 group relative">
                      <img
                        src={msg.mediaUrl}
                        alt="Evidence"
                        className="w-full max-h-56 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[11px] font-mono text-slate-300 flex items-center gap-1">
                        {msg.mediaType === "bill" ? "🧾 Invoice / Bill" : "📸 Workshop Photo"}
                        {msg.fileName && ` • ${msg.fileName}`}
                      </div>
                    </div>
                  )}

                  {/* Voice Note Player if voice */}
                  {msg.mediaType === "voice" && (
                    <div className="mb-2 p-2.5 rounded-lg bg-slate-950 border border-slate-700 flex items-center gap-3">
                      <button
                        id={`btn-play-voice-${msg.id}`}
                        onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                        className="h-8 w-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center hover:bg-emerald-400 transition-colors"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4 fill-slate-950" />
                        ) : (
                          <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-emerald-400">🎤 Voice Note ({msg.voiceDuration || "0:18"})</span>
                          <span className="font-mono text-[10px]">{playingAudioId === msg.id ? "Playing..." : "Transcribed"}</span>
                        </div>
                        {/* Audio Wave Bars */}
                        <div className="flex items-center gap-0.5 h-4">
                          {[30, 60, 45, 80, 100, 75, 40, 60, 90, 40, 70, 85, 30, 50, 80, 60, 40].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-all ${
                                playingAudioId === msg.id ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw Text Content */}
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-100 whitespace-pre-wrap">
                    {msg.rawText}
                  </p>

                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <CheckCheck className="w-3.5 h-3.5 text-sky-400 inline" />
                  </div>

                  {/* --- BACKEND INTELLIGENCE CHIP --- */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 bg-slate-950/80 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {msg.classification}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {msg.confidence}% AI Confidence
                        </span>
                      </div>

                      {msg.auditStatus === "NEEDS_REVIEW" ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Needs Review
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Extracted Snapshot */}
                    <div className="text-xs space-y-1 text-slate-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                      {msg.extracted.partName && (
                        <div className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-400">Part:</span>
                          <span className="font-medium text-slate-200 truncate max-w-[200px]">
                            {msg.extracted.partName}
                          </span>
                        </div>
                      )}
                      {msg.extracted.quantity !== null && (
                        <div className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-400">Qty / Rate:</span>
                          <span className="font-medium text-slate-200">
                            {msg.extracted.quantity} units {msg.extracted.rate ? `@ ₹${msg.extracted.rate}` : ""}
                            {msg.extracted.totalAmount ? ` (₹${msg.extracted.totalAmount.toLocaleString()})` : ""}
                          </span>
                        </div>
                      )}
                      {msg.extracted.dealerName && (
                        <div className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-400">Supplier/Dealer:</span>
                          <span className="font-medium text-slate-200 truncate max-w-[180px]">
                            {msg.extracted.dealerName}
                          </span>
                        </div>
                      )}
                      {msg.extracted.vehicleNumber && (
                        <div className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-400">Vehicle:</span>
                          <span className="font-semibold text-amber-400 font-mono">
                            {msg.extracted.vehicleNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Review warning or audit trigger button */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] text-amber-300/90 italic truncate">
                        {msg.extracted.reviewNotes}
                      </p>
                      <button
                        id={`btn-open-audit-${msg.id}`}
                        onClick={() => onSelectForAudit(msg)}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow transition-colors whitespace-nowrap"
                      >
                        <span>Audit Record</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Scenarios Launcher Bar (For easy realistic testing) */}
      <div className="bg-slate-950 border-t border-slate-800 p-2 text-xs">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
            <PlusCircle className="w-3 h-3 text-amber-400" />
            <span>Quick 1-Click Operational Simulation:</span>
          </span>
          <span className="text-[10px] text-slate-400">Simulate real workshop WhatsApp messages</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            id="scenario-po-delivery"
            onClick={() => applyScenario("po-delivery")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 whitespace-nowrap border border-amber-500/40 font-semibold transition-colors"
          >
            <span>📦 "PO-2024-001 Maal Aa Gaya" (17 Parts)</span>
          </button>
          <button
            id="scenario-bill"
            onClick={() => applyScenario("bill")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 whitespace-nowrap border border-slate-700 transition-colors"
          >
            <span>🧾 "आज ये माल आया है" (Bill Photo)</span>
          </button>
          <button
            id="scenario-breakdown"
            onClick={() => applyScenario("breakdown")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-900/70 text-red-200 text-xs flex items-center gap-1.5 whitespace-nowrap border border-red-800/70 transition-colors"
          >
            <span>🚨 "Highway Breakdown" (NH-48)</span>
          </button>
          <button
            id="scenario-shelf"
            onClick={() => applyScenario("shelf")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 whitespace-nowrap border border-slate-700 transition-colors"
          >
            <span>📦 "Godown Rack Photo" (Discovery)</span>
          </button>
          <button
            id="scenario-sale"
            onClick={() => applyScenario("sale")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 whitespace-nowrap border border-slate-700 transition-colors"
          >
            <span>💰 "Ye part bech diya" (Cash Voice)</span>
          </button>
          <button
            id="scenario-dealer"
            onClick={() => applyScenario("dealer")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 whitespace-nowrap border border-slate-700 transition-colors"
          >
            <span>🏢 "Dealer Challan Slip"</span>
          </button>
        </div>
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="bg-slate-900 border-t border-slate-800 p-2.5 sm:p-3 flex flex-col gap-2">
        {/* Selected Attachment Indicator */}
        {selectedMediaType !== "none" && (
          <div className="flex items-center justify-between bg-slate-800/90 px-3 py-1.5 rounded-lg text-xs text-amber-300 border border-amber-800/50">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Attached:</span>
              {selectedMediaType === "bill" && "🧾 Purchase Tax Invoice #912 (Simulated)"}
              {selectedMediaType === "image" && "📸 Truck Wheel Hub Photo"}
              {selectedMediaType === "shelf" && "📦 Godown Rack Shelves Photo"}
              {selectedMediaType === "voice" && "🎤 Audio Voice Recording (0:18)"}
            </div>
            <button
              type="button"
              onClick={() => setSelectedMediaType("none")}
              className="text-slate-400 hover:text-white"
            >
              ✕ Remove
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Attachment button menu */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="attach-bill-btn"
              onClick={() => setSelectedMediaType("bill")}
              title="Attach Bill / Invoice Photo"
              className={`p-2 rounded-lg transition-colors ${
                selectedMediaType === "bill" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="attach-photo-btn"
              onClick={() => setSelectedMediaType("image")}
              title="Attach Part or Truck Photo"
              className={`p-2 rounded-lg transition-colors ${
                selectedMediaType === "image" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="attach-voice-btn"
              onClick={() => setSelectedMediaType("voice")}
              title="Simulate Voice Note"
              className={`p-2 rounded-lg transition-colors ${
                selectedMediaType === "voice" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            id="whatsapp-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Type message in Hindi/Hinglish (e.g., "Ye maal aaya hai", "Truck 1618 me ye problem hai")...'
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
          />

          <button
            type="submit"
            id="whatsapp-send-btn"
            disabled={isLoading || (!inputText.trim() && selectedMediaType === "none")}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 flex items-center justify-center font-bold shadow-md transition-transform active:scale-95"
          >
            {isLoading ? (
              <span className="animate-spin text-xs">⌛</span>
            ) : (
              <Send className="w-4 h-4 fill-slate-950" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
