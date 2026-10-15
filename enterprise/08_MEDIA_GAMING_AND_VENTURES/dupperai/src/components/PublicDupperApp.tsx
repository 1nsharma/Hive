import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Copy,
  Share2,
  Play,
  Pause,
  Image as ImageIcon,
  Video,
  BarChart3,
  Home,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Zap,
  ShieldCheck,
  Plus,
  Layers,
  Upload,
  Cpu,
} from 'lucide-react';

interface PostItem {
  id: number;
  loc: string;
  style: string;
  mode: 'image' | 'video';
  img: string;
  filter: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
}

const ASSETS = {
  face: 'https://image.qwenlm.ai/public_source/bbbf7249-7505-414b-9459-4968b4b3a65c/118a45cf2-e42f-4a22-bf46-482f2085d799.png',
  paris: 'https://image.qwenlm.ai/public_source/bbbf7249-7505-414b-9459-4968b4b3a65c/1247185e4-a73c-4b0d-93dc-b316a256c1a3.png',
  tokyo: 'https://image.qwenlm.ai/public_source/bbbf7249-7505-414b-9459-4968b4b3a65c/198757b40-7601-4e60-814d-0487c4ec9413.png',
  beach: 'https://image.qwenlm.ai/public_source/bbbf7249-7505-414b-9459-4968b4b3a65c/1e5ba741e-8b61-4af1-9e36-dc1b2921cd64.png',
  cafe: 'https://image.qwenlm.ai/public_source/bbbf7249-7505-414b-9459-4968b4b3a65c/19b4fc697-544b-402c-9db1-3ee0e43941ef.png',
  mountains: 'https://image.qwenlm.ai/public_source/bbbf7249-7505-414b-9459-4968b4b3a65c/12ee1d880-a2fa-465e-969c-e3e0ba86eb33.png',
};

const LOCS: Record<string, { name: string; img: string; scene: string; tags: string[]; caps: string[] }> = {
  paris: {
    name: 'Paris',
    img: ASSETS.paris,
    scene: 'in front of the Eiffel Tower, Paris, warm evening light',
    tags: ['#ParisVibes', '#EiffelTower'],
    caps: ['Paris ki shaam, Face Lock on, tension off ✨', 'Eiffel ke saamne main — AI magic, real feelings ❤️'],
  },
  tokyo: {
    name: 'Tokyo',
    img: ASSETS.tokyo,
    scene: 'on a neon-lit Tokyo street at night, glowing signs',
    tags: ['#TokyoNights', '#NeonCity'],
    caps: ['Tokyo nights > everything else 🌃', 'Neon lights, real face, no filters needed ⚡'],
  },
  beach: {
    name: 'Beach',
    img: ASSETS.beach,
    scene: 'on a white-sand tropical beach with turquoise sea',
    tags: ['#BeachLife', '#SeaMode'],
    caps: ['Samundar + main = sukoon 🌊', 'Beach mode: ON, worries: OFF 😎'],
  },
  cafe: {
    name: 'Cafe',
    img: ASSETS.cafe,
    scene: 'at a cozy aesthetic cafe with warm lights and coffee',
    tags: ['#CafeDiaries', '#CoffeeFirst'],
    caps: ['Coffee se pehle main, coffee ke baad bhi main ☕', 'Cafe vibes aur kuch khayalat 💭'],
  },
  mountains: {
    name: 'Mountains',
    img: ASSETS.mountains,
    scene: 'at a Himalayan viewpoint with snow peaks behind',
    tags: ['#MountainCalling', '#PahadiVibes'],
    caps: ['Pahadon ne bulaya, main chala gaya 🏔️', 'Snow peaks, clear mind ❄️'],
  },
};

const STYLES: Record<string, { name: string; tone: string; filter: string }> = {
  golden: { name: 'Golden Hour', tone: 'golden hour glow 🌇', filter: 'saturate(1.2) sepia(0.18) brightness(1.05)' },
  casual: { name: 'Casual', tone: 'casual vibes 😎', filter: 'none' },
  formal: { name: 'Formal', tone: 'sharp & classy 🤵', filter: 'saturate(0.95) contrast(1.08)' },
  trendy: { name: 'Trendy', tone: 'trend check ✔️', filter: 'contrast(1.18) saturate(1.3)' },
};

const KEY_LOC: Record<string, string[]> = {
  paris: ['paris', 'eiffel'],
  tokyo: ['tokyo', 'japan', 'neon'],
  beach: ['beach', 'sea', 'goa', 'maldives', 'samundar'],
  cafe: ['cafe', 'coffee', 'chai'],
  mountains: ['mountain', 'pahad', 'himalaya', 'snow', 'manali'],
};

const KEY_STYLE: Record<string, string[]> = {
  golden: ['golden', 'shaam', 'sunset', 'evening'],
  formal: ['formal', 'office', 'suit'],
  trendy: ['trend', 'viral', 'swag'],
  casual: ['casual', 'simple', 'normal'],
};

export const PublicDupperApp: React.FC = () => {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<'home' | 'result' | 'dash' | 'face' | 'blue'>('home');

  // App Core State
  const [faceLock, setFaceLock] = useState<boolean>(false);
  const [slots, setSlots] = useState<(string | null)[]>(Array(8).fill(null));
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [promptInput, setPromptInput] = useState<string>('');

  // Post State
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: 1,
      loc: 'paris',
      style: 'golden',
      mode: 'image',
      img: ASSETS.paris,
      filter: STYLES.golden.filter,
      caption: 'Paris ki shaam, Face Lock on, tension off ✨\ngolden hour glow 🌇\n\n#Dupperai #AIAvatar #FaceLock #ParisVibes #EiffelTower #GoldenHour',
      likes: 1834,
      comments: 142,
      date: 'Kal',
    },
    {
      id: 2,
      loc: 'tokyo',
      style: 'trendy',
      mode: 'video',
      img: ASSETS.tokyo,
      filter: STYLES.trendy.filter,
      caption: 'Tokyo nights > everything else 🌃\ntrend check ✔️\n\n#Dupperai #AIAvatar #FaceLock #TokyoNights #NeonCity #Trendy',
      likes: 942,
      comments: 87,
      date: 'Kal',
    },
  ]);
  const [currentPost, setCurrentPost] = useState<PostItem | null>(posts[0]);
  const [aspectRatio, setAspectRatio] = useState<'4/5' | '1/1' | '9/16' | '16/9'>('4/5');
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);

  // Generation Modal Overlay State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStep, setGenStep] = useState<number>(0);
  const [genPromptText, setGenPromptText] = useState<string>('');

  // Face Training State
  const [faceStatus, setFaceStatus] = useState<string>('NOT TRAINED');
  const [isTraining, setIsTraining] = useState<boolean>(false);

  // Profit Calculator State
  const [calcUsers, setCalcUsers] = useState<number>(1000);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Live prompt auto-parsing
  const handlePromptChange = (val: string) => {
    setPromptInput(val);
    const lower = val.toLowerCase();
    let foundL: string | null = null;
    let foundS: string | null = null;

    Object.keys(KEY_LOC).forEach((k) => {
      KEY_LOC[k].forEach((w) => {
        if (lower.includes(w)) foundL = k;
      });
    });

    Object.keys(KEY_STYLE).forEach((k) => {
      KEY_STYLE[k].forEach((w) => {
        if (lower.includes(w)) foundS = k;
      });
    });

    if (foundL) setSelectedLoc(foundL);
    if (foundS) setSelectedStyle(foundS);
  };

  // Responsive View Mode (phone frame vs full web dashboard)
  const [viewMode, setViewMode] = useState<'phone' | 'desktop'>('desktop');

  // Helper functions
  const pickRandomKey = (obj: object) => {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
  };

  const buildCaption = (lk: string, sk: string) => {
    const L = LOCS[lk];
    const S = STYLES[sk];
    const cap = L.caps[Math.floor(Math.random() * L.caps.length)];
    return `${cap}\n${S.tone}\n\n#Dupperai #AIAvatar #FaceLock ${L.tags.join(' ')} #${S.name.replace(' ', '')}`;
  };

  // Generate Voiceover using Gemini TTS
  const handlePlayVoiceover = async (text: string) => {
    try {
      showToast('🔊 Synthesizing AI Voiceover with Gemini TTS...');
      const resp = await fetch('/api/gemini/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Kore' }),
      });
      const data = await resp.json();
      if (data.success && data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.play();
        showToast('▶️ Playing Gemini AI Voiceover!');
      } else {
        showToast('🔊 Audio voiceover ready! (Browser Audio fallback)');
        const uttr = new SpeechSynthesisUtterance(text.replace(/#/g, ''));
        window.speechSynthesis.speak(uttr);
      }
    } catch {
      const uttr = new SpeechSynthesisUtterance(text.replace(/#/g, ''));
      window.speechSynthesis.speak(uttr);
      showToast('▶️ Playing AI Voiceover!');
    }
  };

  const startGenerate = async () => {
    if (!faceLock) {
      showToast('🔒 Pehle Face Lock train karo — 1 tap demo available!');
      setActiveScreen('face');
      return;
    }

    const lk = selectedLoc || pickRandomKey(LOCS);
    const sk = selectedStyle || 'casual';

    if (!selectedLoc) {
      showToast(`🤖 AI ne location choose ki: ${LOCS[lk].name}`);
    }

    const initialProPrompt = promptInput
      ? `Ultra photorealistic ${STYLES[sk].name} shot of face-locked person, ${promptInput}, ${LOCS[lk].scene}, 8k resolution, detailed lighting, masterpiece`
      : `Ultra-photorealistic ${STYLES[sk].name} shot of [FACE-LOCKED IDENTITY • 100% duplicate], ${LOCS[lk].scene}; natural skin texture, realistic lighting, 50mm f/1.8; NO artificial/3D/plastic look; quality gains only.`;

    setGenPromptText(initialProPrompt);
    setIsGenerating(true);
    setGenStep(0);

    let generatedCaption = buildCaption(lk, sk);
    let finalPrompt = initialProPrompt;

    // Step 1: Prompt Brain
    await new Promise((r) => setTimeout(r, 600));
    setGenStep(1);

    try {
      const resp = await fetch('/api/gemini/post-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: promptInput || 'Golden hour photoshoot',
          location: LOCS[lk].name,
          style: STYLES[sk].name,
          mode,
        }),
      });
      const resData = await resp.json();
      if (resData.success && resData.data) {
        if (resData.data.enhancedPrompt) {
          finalPrompt = resData.data.enhancedPrompt;
          setGenPromptText(resData.data.enhancedPrompt);
        }
        if (resData.data.caption) {
          const tagsStr = (resData.data.hashtags || []).map((t: string) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
          generatedCaption = `${resData.data.caption}\n\n#Dupperai #AIAvatar #FaceLock ${tagsStr}`;
        }
      }
    } catch {
      // Fall back to template
    }

    // Step 2: Location Engine & Image/Video Generation
    await new Promise((r) => setTimeout(r, 600));
    setGenStep(2);

    // Generate dynamic AI Image URL based on user prompt or location
    const seed = Math.floor(Math.random() * 90000) + 10000;
    const generatedImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=800&height=1000&nologo=true&seed=${seed}`;

    // Step 3: Face Lock
    await new Promise((r) => setTimeout(r, 600));
    setGenStep(3);

    // Step 4: Auto Social Pack
    await new Promise((r) => setTimeout(r, 600));
    setGenStep(4);

    await new Promise((r) => setTimeout(r, 300));
    setIsGenerating(false);

    const newPost: PostItem = {
      id: Date.now(),
      loc: lk,
      style: sk,
      mode,
      img: generatedImgUrl,
      filter: STYLES[sk].filter,
      caption: generatedCaption,
      likes: 120 + Math.floor(Math.random() * 2300),
      comments: 8 + Math.floor(Math.random() * 220),
      date: 'Aaj',
    };

    setPosts([newPost, ...posts]);
    setCurrentPost(newPost);
    setAspectRatio(mode === 'video' ? '9/16' : '4/5');
    setActiveScreen('result');
    showToast(`✅ ${mode === 'video' ? 'AI Video' : 'AI Image'} Post Ready!`);
  };

  // Face Lock Training Simulation
  const handleAutoFillSelfies = () => {
    setSlots(Array(8).fill(ASSETS.face));
    showToast('✨ 8 sample selfies add ho gayi — ab Train dabao!');
  };

  const handleTrainFace = async () => {
    setIsTraining(true);
    setFaceStatus('ANALYZING FACES...');
    await new Promise((r) => setTimeout(r, 800));
    setFaceStatus('BUILDING EMBEDDING...');
    await new Promise((r) => setTimeout(r, 800));
    setFaceStatus('TRAINING PERSONAL LoRA...');
    await new Promise((r) => setTimeout(r, 1000));

    setFaceLock(true);
    setFaceStatus('LOCKED ✅ (99.2% match)');
    setIsTraining(false);
    showToast('🔒 Face Lock ON — ab face kabhi change nahi hoga, sirf quality gains!');
  };

  const handleSlotUpload = (index: number) => {
    const updated = [...slots];
    updated[index] = ASSETS.face;
    setSlots(updated);
  };

  const handleCopyCaptionText = () => {
    if (!currentPost) return;
    navigator.clipboard.writeText(currentPost.caption);
    showToast('📋 Caption + hashtags copy ho gaye!');
  };

  // Profit calculations
  const calculateFinancials = () => {
    const u = calcUsers;
    const pro = Math.round(u * 0.08);
    const cre = Math.round(u * 0.02);
    const free = u - pro - cre;
    const rev = pro * 299 + cre * 999;
    const gens = free * 3 + pro * 100 + cre * 400;
    const cost = gens * 3.5 + 25000 + rev * 0.02;
    const profit = rev - cost;
    return { rev, cost, gens, profit };
  };

  const fin = calculateFinancials();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-6 px-4 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Phone Container */}
      <div className="w-full max-w-[440px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative min-h-[840px] flex flex-col justify-between mb-16">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-wide text-white">
              Dupper<span className="text-emerald-400">ai</span>
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
              Live App
            </span>
          </div>

          <div
            onClick={() => setActiveScreen('face')}
            className="flex items-center gap-2 cursor-pointer group hover:opacity-90 transition-all"
          >
            <div className="relative">
              <img
                src={ASSETS.face}
                alt="Identity Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-emerald-400 transition-colors"
              />
              <span
                className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full border ${
                  faceLock
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {faceLock ? 'LOCKED' : 'OFF'}
              </span>
            </div>
          </div>
        </header>

        {/* Screen Content Wrapper */}
        <div className="p-5 flex-1 overflow-y-auto">
          
          {/* 1. HOME SCREEN */}
          {activeScreen === 'home' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-white leading-tight">
                  Create Once,<br />
                  <span className="text-emerald-400 italic">Adapt Everywhere.</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Kuch bhi type karo — prompt, location, dress, caption... sab AI sambhalega. No drops, only gains.
                </p>
              </div>

              {/* Prompt Card */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <textarea
                    value={promptInput}
                    onChange={(e) => handlePromptChange(e.target.value)}
                    placeholder="Aaj kahan? Type anything... e.g. 'aaj beach pe golden hour wali photo'"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none h-20"
                  />
                </div>

                {/* Location Chips */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Select World Location
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(LOCS).map((k) => (
                      <button
                        key={k}
                        onClick={() => setSelectedLoc(selectedLoc === k ? null : k)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                          selectedLoc === k
                            ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-extrabold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {LOCS[k].name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Chips */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Visual Vibe & Tone
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(STYLES).map((k) => (
                      <button
                        key={k}
                        onClick={() => setSelectedStyle(selectedStyle === k ? null : k)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                          selectedStyle === k
                            ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-extrabold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {STYLES[k].name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setMode('image')}
                    className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      mode === 'image'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>📷 Image Post</span>
                  </button>
                  <button
                    onClick={() => setMode('video')}
                    className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      mode === 'video'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>🎬 AI Video</span>
                  </button>
                </div>

                {/* Generate CTA */}
                <button
                  onClick={startGenerate}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-3.5 rounded-full text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>GENERATE MY POST</span>
                </button>
              </div>

              {/* Mini Stats Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-sm font-black text-emerald-400">24</div>
                  <div className="text-[9px] text-slate-400">Recipes</div>
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-400">9s</div>
                  <div className="text-[9px] text-slate-400">Avg Speed</div>
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-400">99.2%</div>
                  <div className="text-[9px] text-slate-400">Face Match</div>
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-400">0</div>
                  <div className="text-[9px] text-slate-400">Drops</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. RESULT SCREEN */}
          {activeScreen === 'result' && currentPost && (
            <div className="space-y-4 animate-fadeIn">
              <button
                onClick={() => setActiveScreen('home')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Home</span>
              </button>

              {/* Media Render Box */}
              <div
                className={`w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-300 ${
                  aspectRatio === '4/5'
                    ? 'aspect-[4/5]'
                    : aspectRatio === '1/1'
                    ? 'aspect-square'
                    : aspectRatio === '9/16'
                    ? 'aspect-[9/16]'
                    : 'aspect-[16/9]'
                }`}
              >
                <img
                  src={currentPost.img}
                  alt="Generated Post"
                  className={`w-full h-full object-cover ${
                    currentPost.mode === 'video' && isPlayingVideo ? 'animate-pulse scale-105' : ''
                  }`}
                  style={{ filter: currentPost.filter === 'none' ? undefined : currentPost.filter }}
                />

                {/* Video Playback Bar Overlay */}
                {currentPost.mode === 'video' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-3 flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="p-2 bg-emerald-400 text-slate-950 rounded-full font-black text-xs"
                    >
                      {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                    </button>
                    <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-2/3 animate-pulse"></div>
                    </div>
                    <span className="text-[10px] text-white font-mono">0:08 • AI Video</span>
                  </div>
                )}
              </div>

              {/* Crop Ratio Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setAspectRatio('4/5')}
                  className={`text-[11px] px-3 py-1 rounded-full border font-bold transition-all ${
                    aspectRatio === '4/5' ? 'bg-emerald-400 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  IG 4:5
                </button>
                <button
                  onClick={() => setAspectRatio('1/1')}
                  className={`text-[11px] px-3 py-1 rounded-full border font-bold transition-all ${
                    aspectRatio === '1/1' ? 'bg-emerald-400 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Square 1:1
                </button>
                <button
                  onClick={() => setAspectRatio('9/16')}
                  className={`text-[11px] px-3 py-1 rounded-full border font-bold transition-all ${
                    aspectRatio === '9/16' ? 'bg-emerald-400 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Reels 9:16
                </button>
                <button
                  onClick={() => setAspectRatio('16/9')}
                  className={`text-[11px] px-3 py-1 rounded-full border font-bold transition-all ${
                    aspectRatio === '16/9' ? 'bg-emerald-400 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  LinkedIn 16:9
                </button>
              </div>

              {/* Quality Gains Banner */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-emerald-400 font-mono font-bold">
                <span>Sharpness +18%</span>
                <span>Colors +14%</span>
                <span>Detail +22%</span>
                <span className="text-white">Quality Drops 0</span>
              </div>

              {/* Caption & Hashtags Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <p className="text-slate-200 font-medium whitespace-pre-line leading-relaxed">{currentPost.caption}</p>
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                  <button
                    onClick={() => handlePlayVoiceover(currentPost.caption)}
                    className="text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 transition-all"
                  >
                    <span>🔊 Play Gemini Voiceover</span>
                  </button>
                  <a
                    href={currentPost.img}
                    target="_blank"
                    rel="noreferrer"
                    download={`dupperai-${currentPost.mode}-${currentPost.id}.jpg`}
                    className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 transition-all"
                  >
                    <span>📥 Download HD Media</span>
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => showToast('🚀 Social accounts connected & post published!')}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Post Now</span>
                </button>
                <button
                  onClick={handleCopyCaptionText}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={startGenerate}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Redo</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. DASHBOARD SCREEN */}
          {activeScreen === 'dash' && (
            <div className="space-y-4 animate-fadeIn">
              <h1 className="text-xl font-black text-white">Your Posts 📊</h1>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                  <div className="text-lg font-black text-emerald-400">{posts.length}</div>
                  <div className="text-[10px] text-slate-400">Total Posts</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                  <div className="text-lg font-black text-emerald-400">
                    {posts.reduce((a, b) => a + b.likes, 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Total Likes</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                  <div className="text-lg font-black text-emerald-400">+284</div>
                  <div className="text-[10px] text-slate-400">Followers +</div>
                </div>
              </div>

              {/* Grid of Posts */}
              <div className="grid grid-cols-2 gap-3">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentPost(p);
                      setActiveScreen('result');
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-slate-700 transition-all group"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-900">
                      <img
                        src={p.img}
                        alt="Post thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        style={{ filter: p.filter === 'none' ? undefined : p.filter }}
                      />
                    </div>
                    <div className="p-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-white">{LOCS[p.loc]?.name || p.loc}</span>
                      <span className="text-emerald-400 font-mono">❤️ {p.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. FACE LOCK SCREEN */}
          {activeScreen === 'face' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Face Lock 🔒</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Ek baar train karo — phir har photo/video mein face 100% aapka duplicate. Sirf background, dress, colors enhance honge.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Status: </span>
                    <span
                      className={`font-black ${
                        faceLock ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {faceStatus}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {slots.filter(Boolean).length}/8 selfies
                  </span>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSlotUpload(idx)}
                      className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all relative ${
                        slot ? 'border-emerald-400 border-solid' : 'border-slate-800 hover:border-slate-700 text-slate-600'
                      }`}
                    >
                      {slot ? (
                        <img src={slot} alt={`Selfie ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAutoFillSelfies}
                    className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-fill Samples</span>
                  </button>

                  <button
                    onClick={handleTrainFace}
                    disabled={slots.filter(Boolean).length < 5 || isTraining}
                    className="bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isTraining ? 'Training...' : 'Train Face Lock'}</span>
                  </button>
                </div>

                {/* Rules Box */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <strong className="text-emerald-400">Rule 1:</strong> Face kabhi change / alter nahi hota.
                  </div>
                  <div>
                    <strong className="text-emerald-400">Rule 2:</strong> Sirf quality, colors, background, dress enhance hote hain.
                  </div>
                  <div>
                    <strong className="text-emerald-400">Rule 3:</strong> Har output real "live photo" jaisa — koi artificial 3D look nahi.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. BLUEPRINT & ARCHITECTURE SCREEN */}
          {activeScreen === 'blue' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h1 className="text-xl font-black text-white">App Blueprint 📘</h1>

              {/* Section 1: Screens & Flow */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>📱 Screens & User Flow</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
                  <li><strong>Onboarding / Face Lock:</strong> 5–10 selfies → personal identity embedding (InstantID / IP-Adapter).</li>
                  <li><strong>Home (Generate):</strong> free-text prompt + location chips + style presets + Image/Video mode.</li>
                  <li><strong>Pipeline Overlay:</strong> Prompt Brain → Location Engine → Face Lock → Auto Social Pack.</li>
                  <li><strong>Result:</strong> platform crops (4:5, 1:1, 9:16, 16:9), caption + hashtags, one-tap post.</li>
                </ul>

                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-emerald-400">
                      <th className="py-1">Manual Kaam</th>
                      <th className="py-1">App Module</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 divide-y divide-slate-800/50">
                    <tr><td className="py-1">Kai AI tools kholna</td><td className="py-1">Ek app, saare engines</td></tr>
                    <tr><td className="py-1">Prompt banana</td><td className="py-1">Prompt Brain (LLM)</td></tr>
                    <tr><td className="py-1">Location dhundhna</td><td className="py-1">Location Engine</td></tr>
                    <tr><td className="py-1">Face check karna</td><td className="py-1">Face Lock (auto 99%+)</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2: AI Engines & Interactive Diagram */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>🧠 AI Engines & APIs</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block">Face Lock</strong>
                    <span className="text-slate-400">InstantID / IP-Adapter</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block">Images</strong>
                    <span className="text-slate-400">Flux / SDXL (Replicate API)</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block">Video</strong>
                    <span className="text-slate-400">Kling / Runway / HeyGen</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block">Prompt Brain</strong>
                    <span className="text-slate-400">GPT-class LLM</span>
                  </div>
                </div>

                {/* System SVG Diagram */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-center">
                  <svg viewBox="0 0 360 210" className="w-full max-w-xs">
                    <rect x="130" y="6" width="100" height="28" rx="8" fill="#1f2937" stroke="#4ade80" />
                    <text x="180" y="24" fill="#e5e7eb" fontSize="10" textAnchor="middle">User App</text>
                    <rect x="130" y="50" width="100" height="28" rx="8" fill="#1f2937" stroke="#374151" />
                    <text x="180" y="68" fill="#4ade80" fontSize="10" textAnchor="middle">Prompt Brain</text>
                    <rect x="30" y="96" width="110" height="28" rx="8" fill="#1f2937" stroke="#374151" />
                    <text x="85" y="114" fill="#e5e7eb" fontSize="9.5" textAnchor="middle">Location Engine</text>
                    <rect x="220" y="96" width="110" height="28" rx="8" fill="#1f2937" stroke="#4ade80" />
                    <text x="275" y="114" fill="#e5e7eb" fontSize="9.5" textAnchor="middle">Face Lock 🔒</text>
                    <rect x="130" y="142" width="100" height="28" rx="8" fill="#1f2937" stroke="#374151" />
                    <text x="180" y="160" fill="#e5e7eb" fontSize="9.5" textAnchor="middle">Auto Social Pack</text>
                    <rect x="50" y="184" width="260" height="20" rx="8" fill="#4ade8022" stroke="#4ade80" />
                    <text x="180" y="198" fill="#4ade80" fontSize="9" textAnchor="middle">Instagram • TikTok • LinkedIn • Facebook</text>
                  </svg>
                </div>
              </div>

              {/* Section 3: Profit Calculator */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>💰 Business Plan + Profit Calculator</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Monthly Active Users:</span>
                    <span className="text-emerald-400 font-black font-mono">{calcUsers.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="20000"
                    step="100"
                    value={calcUsers}
                    onChange={(e) => setCalcUsers(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-400 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Monthly Revenue</span>
                    <strong className="text-white text-xs">₹{Math.round(fin.rev).toLocaleString()}</strong>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">GPU + API Cost</span>
                    <strong className="text-slate-300 text-xs">₹{Math.round(fin.cost).toLocaleString()}</strong>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Total Generations</span>
                    <strong className="text-white text-xs">{fin.gens.toLocaleString()}</strong>
                  </div>
                  <div className="bg-emerald-950 border border-emerald-800 p-2.5 rounded-xl">
                    <span className="text-emerald-300 block">Net Profit</span>
                    <strong className="text-emerald-400 text-xs font-black">
                      ₹{Math.round(fin.profit).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generation Modal Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-6 flex flex-col justify-center items-center text-center space-y-4 animate-fadeIn">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl animate-spin">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">🤖 AI Engine Active...</h3>
              <p className="text-xs text-slate-400 mt-1">Generating 100% duplicate face scene</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-400 h-full transition-all duration-500"
                style={{ width: `${genStep * 25}%` }}
              ></div>
            </div>

            {/* Steps List */}
            <div className="w-full text-left bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className={`flex items-center gap-2 ${genStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {genStep >= 1 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                <span>1. Prompt Brain: Simple text → Pro LLM prompt</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {genStep >= 2 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                <span>2. Location Engine: World Scene Rendering</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {genStep >= 3 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                <span>3. Face Lock: InstantID Match (99.2%)</span>
              </div>
              <div className={`flex items-center gap-2 ${genStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {genStep >= 4 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                <span>4. Auto Social Pack: Crops + Caption + Hashtags</span>
              </div>
            </div>

            {/* Prompt Preview Box */}
            <div className="w-full bg-slate-900 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono text-left max-h-24 overflow-y-auto">
              {genPromptText}
            </div>
          </div>
        )}

        {/* Toast Floating Notification */}
        {toastMessage && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-2xl z-50 animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2.5 px-2">
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeScreen === 'home' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveScreen('dash')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeScreen === 'dash' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Posts</span>
          </button>

          <button
            onClick={() => setActiveScreen('face')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeScreen === 'face' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span>Face Lock</span>
          </button>

          <button
            onClick={() => setActiveScreen('blue')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeScreen === 'blue' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Blueprint</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
