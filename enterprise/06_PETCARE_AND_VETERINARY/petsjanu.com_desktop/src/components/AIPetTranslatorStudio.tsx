import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RotateCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Dog,
  Cat,
  Bird,
  Shield,
  Send,
  Radio,
  Eye,
  Hand,
  Award,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  Settings,
  BookOpen,
  Database,
  TrendingUp,
  FlaskConical
} from 'lucide-react';
import {
  PetTranslatorProfile,
  PetTranslationResponse,
  PetVocalizationType,
  generateLocalPetTranslation,
  triggerPetAcousticSound,
  REVERSE_PET_BEHAVIORS,
  ReverseDecodeResponse
} from '../lib/petTranslator';
import {
  intentToCommunicationCue,
  playRealPetSound,
  preloadPetSounds,
  type CommunicationCue,
  type PetTrainingRecord,
  saveTrainingRecord,
  getTrainingHistory,
} from '../lib/petSoundLibrary';
import { audioService } from '../lib/audioService';

interface AIPetTranslatorStudioProps {
  initialPet?: Partial<PetTranslatorProfile>;
  setToast?: (msg: string) => void;
  className?: string;
}

export const AIPetTranslatorStudio: React.FC<AIPetTranslatorStudioProps> = ({
  initialPet,
  setToast,
  className = ''
}) => {
  // Active pet profile state
  const [profile, setProfile] = useState<PetTranslatorProfile>({
    name: initialPet?.name || 'Bruno',
    species: initialPet?.species || 'Dog',
    breed: initialPet?.breed || 'Indian Pariah / Desi Dog',
    age: initialPet?.age || '3 years',
    weight: initialPet?.weight || 18,
    temperament: initialPet?.temperament || 'High Energy',
    trainingLevel: initialPet?.trainingLevel || 'Intermediate'
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Navigation mode
  const [mode, setMode] = useState<'human-to-pet' | 'pet-to-human' | 'training'>('human-to-pet');

  // Human-to-Pet speech & input state
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<PetTranslationResponse | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechLang, setSpeechLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [autoPlayToPet, setAutoPlayToPet] = useState(true);

  // Real audio engine state
  const [audioMode, setAudioMode] = useState<'real' | 'synthesis' | 'loading'>('loading');
  const [activeCue, setActiveCue] = useState<CommunicationCue | null>(null);

  // Training state
  const [trainingHistory, setTrainingHistory] = useState<PetTrainingRecord[]>([]);
  const [pendingTrainingId, setPendingTrainingId] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'success' | 'partial' | 'no_response' | 'negative'>('success');


  // Pet-to-Human reverse decode selection
  const [selectedReverse, setSelectedReverse] = useState<ReverseDecodeResponse>(REVERSE_PET_BEHAVIORS[0]);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn('[SPEECH RECOGNITION ERROR]:', err);
          setIsListening(false);
          if (err.error === 'not-allowed') {
            setToast?.('⚠️ Microphone access was blocked. Please enable permissions or type below.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    // Pre-seed initial translation
    const initialTranslation = generateLocalPetTranslation('Come here Bruno, sit down and have your treat!', profile);
    setTranslation(initialTranslation);

    // Preload real pet sounds in background
    preloadPetSounds();
    setAudioMode('synthesis'); // Will update to 'real' on first successful play

    // Load training history
    setTrainingHistory(getTrainingHistory(profile.name));
  }, []);

  const toggleMic = () => {
    if (!speechSupported) {
      setToast?.('Speech recognition is not supported in this browser. Please type your phrase.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputText('');
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = speechLang;
        }
        recognitionRef.current?.start();
        setIsListening(true);
        audioService.playSuccess();
        setToast?.(speechLang === 'hi-IN' ? '🎙️ बोलिए... हम आपकी आवाज़ सुन रहे हैं!' : '🎙️ Listening... Speak your pet command!');
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleTranslate = async (overrideText?: string) => {
    const textToTranslate = (overrideText || inputText).trim();
    if (!textToTranslate) return;

    setIsTranslating(true);
    // Generate a training record ID for this interaction
    const recordId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setPendingTrainingId(recordId);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    try {
      const res = await fetch('/api/v1/ai/pet-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToTranslate,
          petName: profile.name,
          species: profile.species,
          breed: profile.breed,
          age: profile.age,
          weight: profile.weight,
          temperament: profile.temperament
        })
      });

      if (res.ok) {
        const data: PetTranslationResponse = await res.json();
        setTranslation(data);
        if (autoPlayToPet) {
          handlePlaySound(data.petVocalization);
        }
        setToast?.(`🗣️ Translated for ${profile.name}! Playing ${data.vocalizationLabel}`);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Offline fallback
      const fallback = generateLocalPetTranslation(textToTranslate, profile);
      setTranslation(fallback);
      if (autoPlayToPet) {
        handlePlaySound(fallback.petVocalization);
      }
      setToast?.(`🗣️ Translated with onboard neural acoustics engine!`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlaySound = useCallback(async (vocalizationType?: PetVocalizationType) => {
    const voc = vocalizationType || translation?.petVocalization || 'bark_calm';
    setIsPlayingAudio(true);
    setAudioMode('loading');

    // Get the precise communication cue for this intent
    const intent = translation?.intent || 'general';
    const cue = intentToCommunicationCue(intent, profile.species, profile.temperament);
    setActiveCue(cue);

    try {
      const result = await playRealPetSound(
        cue.sampleKey,
        profile,
        () => setIsPlayingAudio(false)
      );
      setAudioMode(result);
      if (result === 'real') {
        setToast?.(`🔊 Real ${profile.species} sound playing for ${profile.name}! (${cue.label})`);
      }
      // Save training record
      if (pendingTrainingId) {
        const record: PetTrainingRecord = {
          id: pendingTrainingId,
          humanCommand: inputText,
          humanIntent: intent,
          timestamp: new Date().toISOString(),
          audioMode: result,
          cue,
        };
        saveTrainingRecord(profile.name, record);
        setTrainingHistory(getTrainingHistory(profile.name));
        setPendingTrainingId(null);
      }
    } catch {
      // Fallback
      triggerPetAcousticSound(voc, profile, () => setIsPlayingAudio(false));
      setAudioMode('synthesis');
      setTimeout(() => setIsPlayingAudio(false), 900);
    }
  }, [translation, profile, inputText, pendingTrainingId]);

  const quickPrompts = [
    `Come on ${profile.name}! / पास आओ`,
    `बैठ जाओ / Sit nicely`,
    `खाना खा लो / Dinner time!`,
    `शाबाश / Good boy ${profile.name}!`,
    `मत करो / No, drop that!`,
    `चलो घूमने / Let's go for a walk!`,
    `शांत हो जाओ / Calm down`,
    `बहुत प्यार / I love you ${profile.name}`
  ];

  return (
    <div className={`w-full card-premium p-6 sm:p-10 border border-stone-200 shadow-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black text-stone-100 rounded-3xl space-y-8 ${className}`}>
      
      {/* ── Top Header & Active Pet Profile Bar ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-3">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            AI BI-DIRECTIONAL PET TRANSLATOR & TRAINING LAB
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white">
            Speak Human. <span className="text-emerald-400 italic">Talk {profile.species}.</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">
            Real-time vocal intent synthesis, species-specific formant acoustics, and behavioral body language coaching.
          </p>
        </div>

        {/* Pet Profile Badge & Quick Switcher */}
        <div className="flex flex-wrap items-center gap-3 bg-stone-900/90 border border-stone-800 p-2.5 rounded-2xl">
          <div className="flex items-center gap-2 px-2">
            {profile.species.toLowerCase().includes('cat') ? (
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Cat className="w-5 h-5" />
              </div>
            ) : profile.species.toLowerCase().includes('bird') ? (
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                <Bird className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <Dog className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-xs font-black text-white leading-tight">{profile.name}</div>
              <div className="text-[10px] font-mono text-stone-400">{profile.breed} · {profile.weight}kg</div>
            </div>
          </div>

          <div className="flex items-center gap-1 border-l border-stone-800 pl-2">
            <button
              onClick={() => setProfile((p) => ({ ...p, species: 'Dog', breed: 'Indian Pariah / Desi Dog', weight: 18 }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                profile.species === 'Dog' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              🐕 Dog
            </button>
            <button
              onClick={() => setProfile((p) => ({ ...p, species: 'Cat', breed: 'Persian Cat', weight: 4.5 }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                profile.species === 'Cat' ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              🐈 Cat
            </button>
            <button
              onClick={() => setProfile((p) => ({ ...p, species: 'Bird', breed: 'Parakeet', weight: 0.2 }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                profile.species === 'Bird' ? 'bg-cyan-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              🦜 Bird
            </button>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ml-1 ${
                isEditingProfile ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
              title="Customize pet profile"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Inline Pet Profile Editor ── */}
      {isEditingProfile && (
        <div className="p-4 sm:p-6 rounded-2xl bg-stone-900 border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Customize Target Pet Profile
            </span>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="text-xs text-stone-400 hover:text-white px-2.5 py-1 rounded-lg bg-stone-800 cursor-pointer"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Pet Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                placeholder="Pet Name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Breed</label>
              <input
                type="text"
                value={profile.breed}
                onChange={(e) => setProfile((p) => ({ ...p, breed: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                placeholder="Breed"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Weight (kg)</label>
              <input
                type="number"
                value={profile.weight || 15}
                onChange={(e) => setProfile((p) => ({ ...p, weight: Number(e.target.value) || 15 }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Temperament</label>
              <select
                value={profile.temperament || 'High Energy'}
                onChange={(e) => setProfile((p) => ({ ...p, temperament: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
              >
                <option value="High Energy">High Energy</option>
                <option value="Calm & Gentle">Calm & Gentle</option>
                <option value="Shy & Sensitive">Shy & Sensitive</option>
                <option value="Protective">Protective</option>
                <option value="Food Motivated">Food Motivated</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Mode Switcher Pills ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-2xl border border-stone-800">
            <button
              onClick={() => { setMode('human-to-pet'); audioService.playSuccess(); }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'human-to-pet' ? 'bg-emerald-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Mic className="w-3 h-3" />
              Human → Pet
            </button>
            <button
              onClick={() => { setMode('pet-to-human'); audioService.playSuccess(); }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'pet-to-human' ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              Pet → Human
            </button>
            <button
              onClick={() => { setMode('training'); audioService.playSuccess(); }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'training' ? 'bg-purple-600 text-white shadow-lg' : 'text-stone-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3 h-3" />
              Training Log
              {trainingHistory.length > 0 && (
                <span className="text-[9px] bg-purple-400 text-stone-950 rounded-full px-1.5 font-black">
                  {trainingHistory.length}
                </span>
              )}
            </button>
          </div>

          {/* Real Audio Engine Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-mono font-black ${
            audioMode === 'real'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : audioMode === 'loading'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              : 'bg-stone-800/60 border-stone-700 text-stone-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              audioMode === 'real' ? 'bg-emerald-400 animate-pulse' :
              audioMode === 'loading' ? 'bg-amber-400 animate-spin' :
              'bg-stone-500'
            }`} />
            {audioMode === 'real' ? '🔊 REAL AUDIO' : audioMode === 'loading' ? 'LOADING...' : '⚡ SYNTHESIS'}
          </div>
        </div>
      </div>

      {/* ── MODE 1: HUMAN TO PET ── */}
      {mode === 'human-to-pet' && (
        <div className="space-y-8">
          {/* Voice Input & Recording Console */}
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-stone-800 relative overflow-hidden shadow-xl space-y-6">
            
            {/* Language & Auto-Play Options Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Voice Language:</span>
                <div className="inline-flex items-center p-0.5 bg-stone-950 border border-stone-800 rounded-xl text-xs">
                  <button
                    onClick={() => {
                      setSpeechLang('hi-IN');
                      if (recognitionRef.current) recognitionRef.current.lang = 'hi-IN';
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      speechLang === 'hi-IN' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🇮🇳 हिन्दी / Hinglish
                  </button>
                  <button
                    onClick={() => {
                      setSpeechLang('en-IN');
                      if (recognitionRef.current) recognitionRef.current.lang = 'en-IN';
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      speechLang === 'en-IN' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🌐 English
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlayToPet}
                    onChange={(e) => setAutoPlayToPet(e.target.checked)}
                    className="rounded accent-emerald-500 cursor-pointer"
                  />
                  <span>Auto-Play Sound to Pet</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMic}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/30 scale-105'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Click to speak to pet'}
                >
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
                <div>
                  <div className="text-base font-black text-white flex items-center gap-2">
                    {isListening ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        Listening to your voice...
                      </>
                    ) : (
                      'Tap to Speak to ' + profile.name
                    )}
                  </div>
                  <div className="text-xs text-stone-400">
                    {isListening ? 'Speak naturally in English, Hindi, or conversational cues' : 'Or type a command below and click Translate'}
                  </div>
                </div>
              </div>

              {/* Sound Waveform Animation */}
              <div className="flex items-end gap-1 h-8 px-4 py-1 bg-stone-950 rounded-xl border border-stone-800">
                {[12, 24, 18, 28, 16, 22, 30, 14, 26, 20].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isListening || isPlayingAudio ? 'bg-emerald-400' : 'bg-stone-700'
                    }`}
                    style={{
                      height: isListening || isPlayingAudio ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '6px',
                      animation: isListening || isPlayingAudio ? `bounce 0.8s ease-in-out infinite ${i * 0.1}s` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Input Text Field & Action */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
                  placeholder={`e.g. "Come here ${profile.name}, sit nicely and get your treat"`}
                  className="w-full px-4 py-3.5 rounded-2xl bg-stone-950 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {inputText && (
                  <button
                    onClick={() => setInputText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={() => handleTranslate()}
                disabled={isTranslating || !inputText.trim()}
                className="px-6 py-3.5 rounded-2xl font-black text-sm text-white cursor-pointer shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}
              >
                {isTranslating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" /> Translate to {profile.species}
                  </>
                )}
              </button>
            </div>

            {/* Quick Command Chips */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Quick Spoken Phrases:</div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(phrase);
                      handleTranslate(phrase);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium border border-stone-700/60 transition-all cursor-pointer"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Translation Output Console ── */}
          {translation && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: Pet Acoustics Player & Communication Cue Engine */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-stone-900 border border-emerald-500/30 space-y-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      audioMode === 'real'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : audioMode === 'loading'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-stone-700/60 text-stone-300 border-stone-600'
                    }`}>
                      {audioMode === 'real' ? `🔊 Real ${profile.species} Recording` :
                       audioMode === 'loading' ? '⏳ Loading Audio...' :
                       `⚡ Acoustic Synthesis`}
                    </span>
                    <span className="text-xs font-mono text-stone-400">{translation.acousticFrequency}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">
                    {activeCue?.label || translation.vocalizationLabel}
                  </h3>

                  <p className="text-xs text-stone-400 italic">
                    "{translation.sourceText}"
                  </p>

                  {/* Scientific Basis Card */}
                  {activeCue && (
                    <div className="p-3 rounded-xl bg-stone-950/70 border border-emerald-900/50 text-[10px] text-stone-400 font-mono">
                      <div className="text-emerald-400 font-black text-[9px] uppercase tracking-widest mb-1">📚 Scientific Basis</div>
                      {activeCue.scientificBasis}
                    </div>
                  )}
                </div>

                {/* Big Audio Play Button */}
                <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col items-center justify-center space-y-4 relative z-10">
                  <button
                    onClick={() => handlePlaySound()}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                      isPlayingAudio
                        ? 'bg-amber-400 text-stone-950 scale-110 ring-8 ring-amber-400/40 animate-pulse'
                        : audioMode === 'real'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white ring-4 ring-emerald-400/40 shadow-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-500/30'
                    }`}
                    title={`Play ${audioMode === 'real' ? 'real recorded' : 'synthesized'} ${profile.species} sound to ${profile.name}`}
                  >
                    {isPlayingAudio ? (
                      <Volume2 className="w-10 h-10 animate-bounce text-stone-950" />
                    ) : (
                      <Play className="w-10 h-10 ml-1.5 text-white" />
                    )}
                  </button>

                  <div className="text-center space-y-1">
                    <div className="text-sm font-mono font-black text-emerald-400 tracking-wide">
                      {isPlayingAudio
                        ? `📡 Transmitting to ${profile.name}... (पेट को सुनाई जा रही है)`
                        : `🔊 Play to ${profile.name} (पेट को सुनाएं)`}
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium">
                      {audioMode === 'real'
                        ? `✅ Real Pre-Recorded ${profile.species} Vocalization`
                        : `⚡ Web Audio Acoustic Synthesis`
                      } · {activeCue?.frequencyNote || translation.acousticFrequency}
                    </div>
                  </div>
                </div>

                {/* Pet Internal Monologue */}
                <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2 relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    What {profile.name} Hears & Feels:
                  </div>
                  <div className="text-xs text-stone-300 italic">
                    "{translation.petThoughtSimulation.internalMonologue}"
                  </div>
                  <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">
                    <strong className="text-stone-300">Expected Reaction:</strong> {translation.petThoughtSimulation.expectedReaction}
                  </div>
                </div>
              </div>

              {/* RIGHT: Human Posture & Behavioral Training Coach */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 space-y-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      Human Posture & Body Language Guide
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      Intent: {translation.intent.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <UserIcon className="w-3.5 h-3.5" /> Body Stance & Posture
                      </div>
                      <div className="text-xs text-stone-300">{translation.humanBodyLanguage.posture}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Hand className="w-3.5 h-3.5" /> Hand Placement
                      </div>
                      <div className="text-xs text-stone-300">{translation.humanBodyLanguage.hands}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Eye className="w-3.5 h-3.5" /> Eye Contact
                      </div>
                      <div className="text-xs text-stone-300">{translation.humanBodyLanguage.eyeContact}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Volume2 className="w-3.5 h-3.5" /> Vocal Pitch Tone
                      </div>
                      <div className="text-xs text-stone-300">{translation.humanBodyLanguage.vocalPitch}</div>
                    </div>
                  </div>
                </div>

                {/* Positive Reinforcement Training Deck */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-emerald-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Training Cue: {translation.trainingCue.commandWord}
                    </div>
                    {translation.trainingCue.clickerMarker && (
                      <button
                        onClick={() => {
                          audioService.playTrainingClicker();
                          setToast?.('🔘 Clicker sounded! Deliver treat immediately.');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Zap className="w-3 h-3 text-amber-400" /> Test Clicker
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-stone-300">
                    <strong className="text-emerald-400">Reward Timing:</strong> {translation.trainingCue.timingAdvice}
                  </div>
                  <div className="text-xs text-stone-300">
                    <strong className="text-emerald-400">Treat Incentive:</strong> {translation.trainingCue.treatRewardAdvice}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MODE 2: PET TO HUMAN (REVERSE DECODER) ── */}
      {mode === 'pet-to-human' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              What Is Your Pet Saying? (Acoustic & Behavior Decoder)
            </h3>
            <p className="text-xs text-stone-400">
              Select a sound or body behavior your pet is exhibiting to uncover their exact emotional intent and recommended human response.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {REVERSE_PET_BEHAVIORS.map((item, idx) => {
                const isSelected = selectedReverse.petSoundType === item.petSoundType;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedReverse(item);
                      audioService.playSuccess();
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/50 shadow-lg'
                        : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.urgencyLevel === 'URGENT'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : item.urgencyLevel === 'NEEDS_ATTENTION'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {item.urgencyLevel}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-2">
                      {item.petSoundType}
                    </div>
                    <div className="text-[11px] text-stone-400 line-clamp-2">
                      {item.observedBehavior}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Decoder Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/30 via-stone-900 to-stone-950 border border-amber-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  DECODED PET THOUGHT
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
                  {selectedReverse.humanInterpretation}
                </h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                selectedReverse.urgencyLevel === 'URGENT'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : selectedReverse.urgencyLevel === 'NEEDS_ATTENTION'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                Urgency: {selectedReverse.urgencyLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="text-xs font-bold text-amber-300">Observed Physical Behavior:</div>
                <div className="text-xs text-stone-300">{selectedReverse.observedBehavior}</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="text-xs font-bold text-emerald-400">Recommended Action for Owner:</div>
                <div className="text-xs text-stone-300">{selectedReverse.recommendedAction}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Interactive Command Soundboard Deck (Clicker, Whistle, Barks) ── */}
      <div className="pt-6 border-t border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Training Soundboard Deck:
          </div>
          <span className="text-[10px] text-stone-500">1-Click Instant Audio Synthesis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <button
            onClick={() => {
              audioService.playTrainingClicker();
              setToast?.('🔘 Clicker: Immediate marker cue');
            }}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-base mb-1">🔘</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Clicker</div>
            <div className="text-[9px] font-mono text-stone-400">3kHz Pulse</div>
          </button>

          <button
            onClick={() => {
              audioService.playUltrasonicWhistle();
              setToast?.('🎺 Ultrasonic Whistle: Emergency recall sounded');
            }}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-base mb-1">🎺</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Whistle</div>
            <div className="text-[9px] font-mono text-stone-400">6.5kHz Recall</div>
          </button>

          <button
            onClick={() => {
              audioService.playPlayfulYip(1.1);
              setToast?.('🐾 Playful Yip: Engagement cue');
            }}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-base mb-1">🐾</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Playful Yip</div>
            <div className="text-[9px] font-mono text-stone-400">540Hz Cadence</div>
          </button>

          <button
            onClick={() => {
              audioService.playCanineBark(1.0, 'calm');
              setToast?.('🐕 Calm Woof: Reassurance tone');
            }}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-base mb-1">🐕</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Calm Woof</div>
            <div className="text-[9px] font-mono text-stone-400">220Hz Formant</div>
          </button>

          <button
            onClick={() => {
              audioService.playCatPurr(1.6);
              setToast?.('🐈 Feline Purr: Calming vibration');
            }}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-base mb-1">🐈</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Feline Purr</div>
            <div className="text-[9px] font-mono text-stone-400">26Hz Tremolo</div>
          </button>

          <button
            onClick={() => {
              audioService.playCatMeow('cheerful');
              setToast?.('🐱 Happy Meow: Greeting chirp');
            }}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-base mb-1">🐱</div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Greeting Meow</div>
            <div className="text-[9px] font-mono text-stone-400">Glide Formant</div>
          </button>
        </div>
      </div>

      {/* ── MODE 3: TRAINING LOG ── */}
      {mode === 'training' && (
        <div className="space-y-6">
          {/* Architecture Overview */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/60 to-stone-900 border border-purple-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-mono text-purple-400 font-black uppercase tracking-widest">Pet Communication Engine v2</div>
                <h3 className="text-lg font-bold text-white">Individual {profile.name} Communication Model</h3>
              </div>
            </div>

            {/* Architecture flow */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-mono">
              {[
                { icon: '🎙️', label: 'Human Speech', sub: 'Hindi / English / Hinglish', color: 'blue' },
                { icon: '🧠', label: 'Intent Layer', sub: 'Gemini + Heuristic', color: 'purple' },
                { icon: '🐾', label: 'Species Policy', sub: `${profile.species} Communication Model`, color: 'emerald' },
                { icon: '🔊', label: 'Real Audio', sub: 'Howler.js + CC0 Samples', color: 'green' },
                { icon: '↩️', label: 'Observe & Learn', sub: 'Training Loop', color: 'amber' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-stone-950/50">
                  <div className="text-2xl">{step.icon}</div>
                  <div className="font-black text-white">{step.label}</div>
                  <div className="text-stone-500">{step.sub}</div>
                  {i < 4 && <div className="hidden sm:block text-purple-400 text-base absolute">→</div>}
                </div>
              ))}
            </div>

            {/* Research citation bar */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Dog2vec', detail: 'Interspeech 2025 · 6000h barking corpus' },
                { label: 'DogSpeak', detail: 'Canine vocalization classification dataset' },
                { label: 'EmotionalCanines', detail: 'Arousal/valence in dog vocalizations' },
                { label: 'NatureLM-audio', detail: 'Earth Species Project multi-species model' },
              ].map(r => (
                <div key={r.label} className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono">
                  <span className="text-purple-300 font-black">{r.label}</span>
                  <span className="text-stone-500 ml-1.5">{r.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Training History List */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-black text-white">{profile.name}'s Interaction History</span>
                <span className="text-xs text-stone-400 font-mono">({trainingHistory.length} records)</span>
              </div>
              {trainingHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all training history?')) {
                      localStorage.removeItem('petjanu_training_' + profile.name.toLowerCase());
                      setTrainingHistory([]);
                    }
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 font-mono cursor-pointer px-2 py-1 rounded-lg hover:bg-red-500/10"
                >
                  Clear All
                </button>
              )}
            </div>

            {trainingHistory.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">📋</div>
                <div className="text-stone-400 text-sm font-medium">No training records yet</div>
                <div className="text-stone-500 text-xs font-mono">
                  Translate a command and play it to {profile.name} to start building the interaction log.
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {trainingHistory.map((record) => (
                  <div key={record.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white">"{record.humanCommand}"</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            {record.humanIntent}
                          </span>
                          {record.audioMode && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                              record.audioMode === 'real'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                                : 'bg-stone-700/40 text-stone-400 border-stone-700'
                            }`}>
                              {record.audioMode === 'real' ? '🔊 Real Audio' : '⚡ Synthesis'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[9px] text-stone-500 font-mono shrink-0">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {record.cue && (
                      <div className="text-[10px] text-stone-400 font-mono">
                        <span className="text-stone-300">{record.cue.label}</span> · {record.cue.frequencyNote}
                      </div>
                    )}
                    {/* Outcome buttons */}
                    {!record.petResponse && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[9px] text-stone-500 font-mono">{profile.name}'s response:</span>
                        {(['success', 'partial', 'no_response', 'negative'] as const).map(outcome => (
                          <button
                            key={outcome}
                            onClick={() => {
                              const updated = { ...record, petResponse: { observedBehavior: outcome, outcome } };
                              saveTrainingRecord(profile.name, updated);
                              setTrainingHistory(getTrainingHistory(profile.name));
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-black cursor-pointer transition-all ${
                              outcome === 'success' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' :
                              outcome === 'partial' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' :
                              outcome === 'no_response' ? 'bg-stone-700/40 text-stone-400 hover:bg-stone-700/60' :
                              'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            {outcome === 'success' ? '✅ Obeyed' : outcome === 'partial' ? '🔄 Partial' : outcome === 'no_response' ? '😐 No response' : '❌ Ignored'}
                          </button>
                        ))}
                      </div>
                    )}
                    {record.petResponse && (
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-mono inline-block ${
                        record.petResponse.outcome === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                        record.petResponse.outcome === 'partial' ? 'bg-amber-500/15 text-amber-400' :
                        record.petResponse.outcome === 'no_response' ? 'bg-stone-700/30 text-stone-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {record.petResponse.outcome === 'success' ? '✅ Obeyed' : record.petResponse.outcome === 'partial' ? '🔄 Partial response' : record.petResponse.outcome === 'no_response' ? '😐 No response' : '❌ Ignored'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Training Stats */}
            {trainingHistory.length > 0 && (() => {
              const responded = trainingHistory.filter(r => r.petResponse);
              const success = responded.filter(r => r.petResponse?.outcome === 'success').length;
              const realAudio = trainingHistory.filter(r => r.audioMode === 'real').length;
              return (
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-800">
                  <div className="text-center p-3 rounded-xl bg-stone-950/60">
                    <div className="text-xl font-black text-emerald-400">{trainingHistory.length}</div>
                    <div className="text-[9px] text-stone-500 font-mono">Total Commands</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-stone-950/60">
                    <div className="text-xl font-black text-amber-400">
                      {responded.length > 0 ? Math.round((success / responded.length) * 100) : 0}%
                    </div>
                    <div className="text-[9px] text-stone-500 font-mono">Success Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-stone-950/60">
                    <div className="text-xl font-black text-purple-400">{realAudio}</div>
                    <div className="text-[9px] text-stone-500 font-mono">Real Audio Plays</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};


function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
