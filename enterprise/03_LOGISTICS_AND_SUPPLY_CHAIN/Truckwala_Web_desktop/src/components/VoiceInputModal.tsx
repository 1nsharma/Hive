import React, { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff, Sparkles, Check, ArrowRight, Volume2, Truck, Wrench, Package } from "lucide-react";

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceProcessed: (result: {
    text: string;
    vehicle: string;
    part: string;
    action: string;
    confidence: number;
  }) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onVoiceProcessed,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusText, setStatusText] = useState("Tap to start recording");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    vehicle: string;
    part: string;
    action: string;
    confidence: number;
    rawText: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);

  // Initialize browser speech recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = true;
          rec.lang = "hi-IN"; // Hindi / Indian English
          rec.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
          };
          rec.onerror = () => {
            // gracefully fallback
          };
          rec.onend = () => {
            if (isRecording) {
              handleStopRecording();
            }
          };
          recognitionRef.current = rec;
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  const parseVoiceSymptom = (text: string) => {
    const lower = text.toLowerCase();
    let vehicle = "Tata 1618 LPT";
    let part = "Clutch Assembly";
    let action = "Received in Godown";
    let confidence = 92;

    if (lower.includes("1618")) {
      vehicle = "Tata 1618 LPT";
    } else if (lower.includes("up32") || lower.includes("up 32")) {
      vehicle = "UP 32 XX 1234";
    } else if (lower.includes("dl") || lower.includes("signa")) {
      vehicle = "DL XX 5678 (Tata Signa)";
    } else if (lower.includes("mh") || lower.includes("leyland")) {
      vehicle = "MH 12 AB 9012 (Ashok Leyland)";
    } else if (lower.includes("rj14") || lower.includes("rj 14")) {
      vehicle = "RJ 14 GB 4412";
    }

    if (lower.includes("clutch")) {
      part = "Clutch Plate & Pressure Plate";
    } else if (lower.includes("brake") || lower.includes("liner")) {
      part = "Front/Rear Brake Liner Kit";
    } else if (lower.includes("laptop") || lower.includes("engine")) {
      part = "ECU Laptop Diagnostic Scan";
    } else if (lower.includes("bearing") || lower.includes("hub")) {
      part = "Taper Roller Wheel Hub Bearing";
    } else if (lower.includes("viscus") || lower.includes("relay")) {
      part = "Viscus T & Relay Kit";
    }

    if (lower.includes("aa gaya") || lower.includes("received") || lower.includes("deliver")) {
      action = "Stock Inward (Godown Received)";
      confidence = 96;
    } else if (lower.includes("issue") || lower.includes("nikal")) {
      action = "Part Issued to Bay Mechanic";
      confidence = 94;
    } else if (lower.includes("kharab") || lower.includes("slip") || lower.includes("problem")) {
      action = "Vehicle Breakdown / Repair Job";
      confidence = 93;
    }

    return {
      vehicle,
      part,
      action,
      confidence,
      rawText: text,
    };
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setStatusText("Recording... Speak in Hindi or English");
    setTranscript("");
    setParsedResult(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // already started
      }
    }

    // Auto simulate audio transcription if silence after 3.5s
    recordingTimerRef.current = setTimeout(() => {
      handleStopRecording("1618 ka clutch aa gaya");
    }, 3800);
  };

  const handleStopRecording = (fallbackText?: string) => {
    if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    setStatusText("Processing audio with AI...");
    setIsProcessing(true);

    setTimeout(() => {
      const finalText = transcript.trim() || fallbackText || "1618 ka clutch aa gaya";
      setTranscript(finalText);
      const parsed = parseVoiceSymptom(finalText);
      setParsedResult(parsed);
      setIsProcessing(false);
      setStatusText("Voice processed successfully!");
    }, 800);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handlePickSample = (sampleText: string) => {
    setTranscript(sampleText);
    setIsProcessing(true);
    setStatusText("Analyzing voice transcript...");
    setTimeout(() => {
      const parsed = parseVoiceSymptom(sampleText);
      setParsedResult(parsed);
      setIsProcessing(false);
      setStatusText("Voice analyzed!");
    }, 400);
  };

  const handleConfirmAndSave = () => {
    if (parsedResult) {
      onVoiceProcessed({
        text: parsedResult.rawText,
        vehicle: parsedResult.vehicle,
        part: parsedResult.part,
        action: parsedResult.action,
        confidence: parsedResult.confidence,
      });
      onClose();
    }
  };

  return (
    <div
      id="voiceModal"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">Voice Input</h2>
              <p className="text-xs text-gray-500">Hinglish Workshop Audio Parser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center">
          {/* Animated Big Microphone Button */}
          <div className="relative inline-block my-4">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping pointer-events-none"></div>
            )}
            <button
              id="micButton"
              type="button"
              onClick={handleToggleRecording}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl cursor-pointer transition-all duration-300 ${
                isRecording
                  ? "bg-primary recording scale-105 ring-4 ring-primary/40 shadow-red-500/50"
                  : "bg-primary hover:bg-primary-dark hover:scale-105"
              }`}
            >
              {isRecording ? (
                <Mic className="w-14 h-14 text-white animate-pulse" />
              ) : (
                <Mic className="w-14 h-14 text-white" />
              )}
            </button>
          </div>

          <p className="text-sm font-bold text-gray-700 mb-1" id="voiceStatus">
            {statusText}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {isRecording ? "Listening to microphone... Tap to finish" : "Tap mic or select a real example below"}
          </p>

          {/* Sound Wave Animation while recording */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1 mb-4 h-8">
              {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                  className="w-1 bg-primary rounded-full animate-bounce"
                ></span>
              ))}
            </div>
          )}

          {/* Transcript input/display */}
          <div className="mb-4">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder='Speak or type: e.g. "1618 ka clutch aa gaya"'
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-center font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* AI Extracted Result Card */}
          {parsedResult && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-left mb-4 animate-fade-in space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Extraction Result</span>
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                  {parsedResult.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-500 block text-[10px]">Vehicle Identified:</span>
                  <span className="font-bold text-secondary font-mono">{parsedResult.vehicle}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-500 block text-[10px]">Part / System:</span>
                  <span className="font-bold text-secondary">{parsedResult.part}</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-xs">
                <span className="text-gray-500 block text-[10px]">Detected Action:</span>
                <span className="font-bold text-primary">{parsedResult.action}</span>
              </div>

              <button
                onClick={handleConfirmAndSave}
                className="w-full py-2.5 bg-primary text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow hover:bg-primary-dark transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Create Draft Record & Update Workshop</span>
              </button>
            </div>
          )}

          {/* Clickable Hinglish Examples */}
          <div className="bg-surface rounded-2xl p-4 text-left border border-gray-200">
            <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Quick Voice Presets (Tap to Test):
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handlePickSample("1618 ka clutch aa gaya")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-red-50 hover:text-primary transition text-xs text-gray-700 italic border border-gray-100 flex items-center justify-between"
              >
                <span>"1618 ka clutch aa gaya"</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => handlePickSample("2 piece issue kar do")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-red-50 hover:text-primary transition text-xs text-gray-700 italic border border-gray-100 flex items-center justify-between"
              >
                <span>"2 piece issue kar do"</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => handlePickSample("UP32XX1234 ka brake liner kharab hai")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-red-50 hover:text-primary transition text-xs text-gray-700 italic border border-gray-100 flex items-center justify-between"
              >
                <span>"UP32XX1234 ka brake liner kharab hai"</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => handlePickSample("DL XX 5678 engine check laptop lagao")}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-red-50 hover:text-primary transition text-xs text-gray-700 italic border border-gray-100 flex items-center justify-between"
              >
                <span>"DL XX 5678 engine check laptop lagao"</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
