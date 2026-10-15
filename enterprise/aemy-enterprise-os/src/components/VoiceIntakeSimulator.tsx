import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { CulturalClaim } from '../types';

interface VoiceIntakeSimulatorProps {
  claims: CulturalClaim[];
  setClaims: React.Dispatch<React.SetStateAction<CulturalClaim[]>>;
  lang: 'hi' | 'en';
}

interface AudioSnippet {
  id: string;
  speaker: string;
  role: string;
  location: string;
  claimEntity: string;
  hindiTranscript: string;
  englishSummary: string;
  extractedEntities: {
    year: string;
    ingredientsOrCraft: string;
    historicalContext: string;
    confidence: number;
  };
}

export const VoiceIntakeSimulator: React.FC<VoiceIntakeSimulatorProps> = ({
  claims,
  setClaims,
  lang,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>('S-1');
  const [transcriptionState, setTranscriptionState] = useState<'idle' | 'processing' | 'done'>('done');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  const sampleSnippets: AudioSnippet[] = [
    {
      id: 'S-1',
      speaker: 'आदर्श तिवारी (Adarsh Tiwari)',
      role: 'तीसरी पीढ़ी के संचालक, ठग्गू के लड्डू',
      location: 'मेस्टन रोड, कानपुर',
      claimEntity: 'Thaggu Ke Laddu',
      hindiTranscript:
        'हमारे बाबा जी प्रकाश राम तिवारी 1945 में कानपुर आए थे। गांधी जी का भाषण जब उन्होंने सुना, तो उन्होंने तय किया कि सफेद मिल वाली चीनी का बहिष्कार करेंगे। उन्होंने सूजी, गोंद, खोया और देसी खांड मिलाकर यह अनूठा लड्डू बनाया। नारा रखा "ऐसा कोई सगा नहीं जिसको हमने ठगा नहीं"।',
      englishSummary:
        'Founder Prakash Ram Tiwari was inspired by Mahatma Gandhi in 1945 to boycott refined sugar, crafting laddus using semolina, acacia gum, and indigenous raw khandsari.',
      extractedEntities: {
        year: '1945 (Verified in 1968 Gazetteer)',
        ingredientsOrCraft: 'Suji, Gond, Khoya, Raw Khandsari',
        historicalContext: 'Swadeshi Sugar Boycott movement, Kanpur',
        confidence: 0.95
      }
    },
    {
      id: 'S-2',
      speaker: 'उस्ताद रफीक अहमद (Ustad Rafiq Ahmed)',
      role: 'वरिष्ठ मास्टर मोची व काठी निर्माता (आयु 74)',
      location: 'जाजमऊ पुरानी बस्ती, कानपुर',
      claimEntity: 'Jajmau Vegetable Tanning & Saddlery Cluster',
      hindiTranscript:
        'जाजमऊ में हमारा काम अंग्रेजों के समय 1890 के दशक से है। बबूल की छाल और हरड़ के पानी में 40 दिन तक चमड़ा पकता था। उसमें कोई केमिकल क्रोमियम नहीं होता। हाथ से मोम के धागे की डबल सुई वाली सिलाई 50 साल तक नहीं टूटती।',
      englishSummary:
        'Authentic babul bark natural vegetable tanning dating to 1890s saddlery contracts, using hand-stitched double needle beeswax thread.',
      extractedEntities: {
        year: '1890s (Verified in 1908 Imperial Gazetteer)',
        ingredientsOrCraft: 'Babul/Acacia bark, Beeswax Thread, Saddle Stitch',
        historicalContext: 'Cawnpore Cavalry Harness & Saddlery trade',
        confidence: 0.89
      }
    },
    {
      id: 'S-3',
      speaker: 'राम चरन निषाद (Ram Charan Nishad)',
      role: '82 वर्षीय वरिष्ठ नाविक व मौखिक कथाकार',
      location: 'ब्रह्मावर्त घाट, बिठूर',
      claimEntity: 'Bithoor Brahmavart Ghat Riverine Chants',
      hindiTranscript:
        'हम लोग जब सुबह गंगा में नाव निकालते हैं तो राग मल्हार में गाते हैं—"गंगा की लहर बोले, नाना का झंडा डोले"। 1857 में जब नाना साहब और लक्ष्मीबाई रात में नदी पार करते थे, हमारे पुरखे ही नाव खेते थे। यह गीत किसी किताब में नहीं, हमारे सीने में है।',
      englishSummary:
        'Oral rowing ballad preserved by boatmen documenting 1857 revolutionary night river crossings of Peshwa Nana Saheb and Rani Lakshmibai.',
      extractedEntities: {
        year: '1857 (Corroborated with CSJMU Folklore Archives)',
        ingredientsOrCraft: 'Metric rowing cadence in Rag Malhar',
        historicalContext: '1857 Revolt riverine transport, Bithoor',
        confidence: 0.92
      }
    }
  ];

  const currentSnippet =
    sampleSnippets.find((s) => s.id === selectedSnippetId) || sampleSnippets[0];

  const handleToggleLiveRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      setTranscriptionState('processing');
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      clearInterval(timerRef.current);
      setTimeout(() => {
        setTranscriptionState('done');
      }, 800);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleApproveIntoCVR = () => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.entityName.toLowerCase().includes(currentSnippet.claimEntity.toLowerCase())) {
          return {
            ...c,
            status: 'VERIFIED',
            confidenceScore: Math.min(0.98, Number((c.confidenceScore + 0.03).toFixed(2))),
            communityReviews: [
              ...c.communityReviews,
              {
                id: `VOICE-${Date.now().toString().slice(-4)}`,
                name: currentSnippet.speaker,
                designation: currentSnippet.role,
                locality: currentSnippet.location,
                action: 'CONFIRMED',
                notes: currentSnippet.hindiTranscript,
                timestamp: new Date().toISOString().slice(0, 10)
              }
            ]
          };
        }
        return c;
      })
    );

    setFeedbackMessage(
      lang === 'hi'
        ? `मौखिक गवाही सफलतापूर्वक CVR साक्ष्य शृंखला में संलग्न की गई!`
        : `Oral testimony successfully appended to Cultural Verification Record!`
    );

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
              <Mic className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'मौखिक ज्ञान संकलन प्रणाली' : 'Oral Knowledge Intake Protocol'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-100 mt-2">
              {lang === 'hi' ? 'बोलिए (Boliye): शून्य-घर्षण आवाज-आधारित सांस्कृतिक गवाही' : 'Boliye: Frictionless Voice-First Cultural Attestation'}
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl mt-1 leading-relaxed">
              {lang === 'hi'
                ? 'स्थानीय हलवाई, मोची और नाविक फॉर्म नहीं भरते। वे बोलते हैं। यह मॉड्यूल उनकी स्थानीय भाषा में बोली गई गवाही को सीधे साक्ष्य ग्राफ़, संरचित संस्थाओं (Entities) एवं CVR सत्यापन में बदलता है।'
                : 'Traditional artisans and shopkeepers do not fill out digital web forms—they speak. This module processes spoken dialect audio directly into verified claims, structured entities, and auditable evidence.'}
            </p>
          </div>

          {/* Big Mic Recorder Control */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 shrink-0">
            <button
              id="live-record-toggle-btn"
              onClick={handleToggleLiveRecord}
              className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                  : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
              }`}
            >
              {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
            </button>
            <span className="text-xs font-mono font-semibold text-stone-300 mt-2">
              {isRecording
                ? `Recording: 00:0${recordingSeconds}s`
                : lang === 'hi'
                ? 'बोलकर गवाही दें'
                : 'Click to Record Voice'}
            </span>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Snippet Picker & Audio Player Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pre-recorded Field Recordings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center justify-between">
            <span>{lang === 'hi' ? 'कानपुर पायलट फील्ड ऑडियो रिकॉर्डिंग्स' : 'Kanpur Pilot Spoken Field Tapes'}</span>
            <span className="text-stone-500 font-mono">3 Tapes</span>
          </div>

          {sampleSnippets.map((snippet) => {
            const isSelected = snippet.id === selectedSnippetId;
            return (
              <button
                key={snippet.id}
                id={`snippet-select-${snippet.id}`}
                onClick={() => {
                  setSelectedSnippetId(snippet.id);
                  setTranscriptionState('done');
                  setIsPlayingAudio(false);
                }}
                className={`w-full text-left rounded-xl p-4 border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-stone-900 shadow-md ring-1 ring-amber-500/20'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                      <FileAudio className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-stone-100">{snippet.speaker}</div>
                      <div className="text-xs text-stone-400">{snippet.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono rounded bg-stone-800 px-2 py-0.5 text-stone-300">
                    {snippet.location}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Audio Player + Transcription + Entity Extraction */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-5 shadow-xl">
            {/* Player Simulation Bar */}
            <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    id="audio-play-simulation-btn"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="h-10 w-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center hover:bg-amber-400 shadow transition-colors"
                  >
                    {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-stone-200">
                      {isPlayingAudio
                        ? lang === 'hi'
                          ? 'ऑडियो प्ले हो रहा है (स्थानीय बोली)...'
                          : 'Playing Spoken Hindi Testimony...'
                        : currentSnippet.speaker}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      FieldTape_Kanpur_{currentSnippet.id}.wav • 44.1kHz 16-bit
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                  <Volume2 className="h-4 w-4" />
                  <span>01:42</span>
                </div>
              </div>

              {/* Fake Audio Waveform */}
              <div className="flex items-center gap-1 h-8 px-2 overflow-hidden">
                {[40, 60, 20, 80, 95, 45, 30, 70, 85, 90, 65, 40, 55, 75, 90, 30, 50, 65, 80, 45, 60, 70, 85, 90, 40].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-stone-700'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* AI Devanagari Transcript */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  {lang === 'hi' ? 'स्वचालित देवनागरी मौखिक प्रतिलेखन' : 'AI Devanagari Speech Transcript'}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  WER &lt; 4.2% (Kanpuriya Hindi)
                </span>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950/60 p-4 text-sm text-stone-200 leading-relaxed font-serif">
                "{currentSnippet.hindiTranscript}"
              </div>
              <p className="text-xs text-stone-400 italic">
                Summary: "{currentSnippet.englishSummary}"
              </p>
            </div>

            {/* Extracted Structured Entities */}
            <div className="space-y-3 pt-2 border-t border-stone-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {lang === 'hi' ? 'स्वतः निष्कर्षित संस्थाएँ व साक्ष्य बिंदु' : 'Extracted Entities & Provenance Points'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-stone-800 bg-stone-950/40 p-3">
                  <div className="text-stone-400">{lang === 'hi' ? 'कालखंड / स्थापना' : 'Era / Established'}</div>
                  <div className="font-semibold text-stone-200 mt-0.5">
                    {currentSnippet.extractedEntities.year}
                  </div>
                </div>

                <div className="rounded-lg border border-stone-800 bg-stone-950/40 p-3">
                  <div className="text-stone-400">{lang === 'hi' ? 'सामग्री अथवा शिल्प विधि' : 'Ingredients / Method'}</div>
                  <div className="font-semibold text-stone-200 mt-0.5">
                    {currentSnippet.extractedEntities.ingredientsOrCraft}
                  </div>
                </div>

                <div className="rounded-lg border border-stone-800 bg-stone-950/40 p-3 sm:col-span-2">
                  <div className="text-stone-400">{lang === 'hi' ? 'ऐतिहासिक संदर्भ' : 'Historical Context'}</div>
                  <div className="font-semibold text-amber-300 mt-0.5">
                    {currentSnippet.extractedEntities.historicalContext}
                  </div>
                </div>
              </div>
            </div>

            {/* Elder / Guild Review Buttons */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-stone-400">
                {lang === 'hi' ? 'गवाही की समीक्षा करें:' : 'Community Elder Stamp:'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="approve-voice-cvr-btn"
                  onClick={handleApproveIntoCVR}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{lang === 'hi' ? 'CVR में पुष्ट व संलग्न करें' : 'Confirm & Append to CVR'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
