import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Terminal, RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import { JorvishEmblem } from '../common/JorvishEmblem';

interface VoiceAssistantViewProps {
  personality: 'humanity_helper' | 'tactical_hud' | 'code_architect';
}

interface SpokenLog {
  id: string;
  sender: 'user' | 'jorvish';
  text: string;
  time: string;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({ personality }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState<string>(
    "Systems online, Sir. J.O.R.V.I.S.H is listening. What assistance does humanity require today?"
  );
  const [logs, setLogs] = useState<SpokenLog[]>([
    {
      id: '1',
      sender: 'jorvish',
      text: "Systems online, Sir. J.O.R.V.I.S.H is listening. What assistance does humanity require today?",
      time: 'Just now',
    },
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [supportedRecognition, setSupportedRecognition] = useState(true);

  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupportedRecognition(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleVoiceQuery(transcript.trim());
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setSupportedRecognition(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [transcript]);

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer articulate British or clear natural English voice
    const preferredVoice =
      voices.find((v) => v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Natural')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const newLogs: SpokenLog[] = [
      ...logs,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: queryText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setLogs(newLogs);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/voice-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: queryText, personality }),
      });
      const data = await res.json();
      const reply = data.spokenText || "Understood, Sir. Telemetry and helper directives confirmed.";

      setCurrentResponse(reply);
      setLogs((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'jorvish',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakText(reply);
    } catch (err) {
      const fallback = "Acknowledged. Communication channel secure and directives nominal.";
      setCurrentResponse(fallback);
      speakText(fallback);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn(e);
        }
      } else {
        // Fallback simulation for unsupported environments
        handleVoiceQuery("Hey Jorvish, run status check.");
      }
    }
  };

  // Canvas Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 75;

      const activeFactor = isListening ? 2.5 : isSpeaking ? 3.0 : isProcessing ? 1.8 : 0.8;
      const bars = 48;

      for (let i = 0; i < bars; i++) {
        const rad = (i * 2 * Math.PI) / bars + angle;
        const wave = Math.sin(angle * 3 + i * 0.4) * 12 * activeFactor;
        const barHeight = Math.max(4, 10 + wave);

        const x1 = centerX + Math.cos(rad) * (baseRadius + 5);
        const y1 = centerY + Math.sin(rad) * (baseRadius + 5);
        const x2 = centerX + Math.cos(rad) * (baseRadius + 5 + barHeight);
        const y2 = centerY + Math.sin(rad) * (baseRadius + 5 + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = isListening
          ? 'rgba(0, 240, 255, 0.9)'
          : isSpeaking
          ? 'rgba(0, 168, 255, 0.95)'
          : isProcessing
          ? 'rgba(255, 200, 50, 0.9)'
          : 'rgba(192, 197, 206, 0.35)';
        ctx.stroke();
      }

      angle += isSpeaking || isListening ? 0.03 : 0.01;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking, isProcessing]);

  const quickPrompts = [
    "Hey Jorvish, what is your primary directive?",
    "Run diagnostic on humanity helper protocols.",
    "Explain how you differ from Tony Stark's Jarvis.",
    "Architect a clean starter repository structure.",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Central Visualizer & Voice Orb */}
      <div className="flex-1 flex flex-col items-center justify-between bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00A8FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Header */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isListening
                  ? 'bg-cyan-400 animate-ping'
                  : isSpeaking
                  ? 'bg-[#00A8FF] animate-pulse'
                  : isProcessing
                  ? 'bg-amber-400 animate-bounce'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              {isListening
                ? 'VOICE INGESTION ACTIVE'
                : isSpeaking
                ? 'SYNTHESIZING SPEECH'
                : isProcessing
                ? 'NEURAL REASONING'
                : 'ACOUSTIC STANDBY'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Audio Speech' : 'Mute Audio Speech'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#00A8FF]" />}
            </button>
          </div>
        </div>

        {/* Central Core & Canvas Waveform */}
        <div className="relative my-8 flex items-center justify-center w-72 h-72">
          {/* Animated Canvas Frequency Ring */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="absolute inset-0 pointer-events-none z-10"
          />

          {/* Central Logo Emblem */}
          <div
            onClick={toggleListening}
            className="cursor-pointer group relative z-20 transition-transform duration-300 hover:scale-105 active:scale-95"
            title="Click to speak with J.O.R.V.I.S.H"
          >
            <JorvishEmblem
              size={140}
              isPulsing={isListening || isSpeaking || isProcessing}
              showGlow={true}
            />
          </div>
        </div>

        {/* Current Active Response Bubble */}
        <div className="w-full max-w-xl z-10 text-center mb-6">
          <p className="text-base lg:text-lg font-medium text-slate-200 leading-relaxed italic px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            "{isProcessing ? 'Synthesizing voice telemetry...' : currentResponse}"
          </p>
          {transcript && (
            <p className="text-xs font-mono text-cyan-400 mt-2 truncate">
              Heard: "{transcript}"
            </p>
          )}
        </div>

        {/* Primary Voice Action Trigger */}
        <div className="flex flex-col items-center gap-3 z-10 w-full max-w-md">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={toggleListening}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                isListening
                  ? 'bg-rose-500 text-white shadow-rose-500/25 animate-pulse'
                  : 'bg-[#00A8FF] hover:bg-[#0094e0] text-slate-950 font-bold shadow-[#00A8FF]/20'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Wake J.O.R.V.I.S.H (Push to Speak)
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700"
                title="Silence current speech"
              >
                Interrupt
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Acoustic engine</span>
            <span aria-hidden="true">·</span>
            <span>Web Speech & Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Wake word: "Hey Jorvish"</span>
          </div>
        </div>
      </div>

      {/* Right Column: Voice Queries & Transcript Log */}
      <div className="w-full lg:w-96 flex flex-col gap-5">
        {/* Quick Voice Triggers Card */}
        <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00A8FF]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Quick Voice Prompts
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">1-Click Test</span>
          </div>
          <div className="flex flex-col gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleVoiceQuery(prompt)}
                disabled={isProcessing}
                className="text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-[#00A8FF]/10 border border-slate-800 hover:border-[#00A8FF]/40 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2">{prompt}</span>
                <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00A8FF] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Transcript History */}
        <div className="flex-1 bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Voice Log Feed
              </h3>
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-[11px] text-slate-500 hover:text-slate-300 font-mono flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 font-mono text-[11px]">
                Awaiting voice transmissions...
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border ${
                    log.sender === 'user'
                      ? 'bg-cyan-950/20 border-cyan-800/30 text-cyan-200 ml-4'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 mr-2'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-mono">
                    <span className="font-semibold text-slate-400">
                      {log.sender === 'user' ? 'YOU (VOICE)' : 'J.O.R.V.I.S.H'}
                    </span>
                    <span>{log.time}</span>
                  </div>
                  <p className="leading-relaxed">{log.text}</p>
                  {log.sender === 'jorvish' && (
                    <button
                      onClick={() => speakText(log.text)}
                      className="mt-2 text-[10px] text-[#00A8FF] hover:underline flex items-center gap-1 font-mono"
                    >
                      <Volume2 className="w-3 h-3" /> Replay Voice
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
