import React, { useState } from 'react';
import {
  Volume2,
  Copy,
  Check,
  Sparkles,
  Heart,
  Shield,
  Layers,
  Palette,
  Quote,
  Eye,
} from 'lucide-react';
import { JorvishEmblem } from '../common/JorvishEmblem';

export const BrandKitView: React.FC = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedTagline, setSelectedTagline] = useState<string>('More Than Code. More Human.');
  const [activeFullForm, setActiveFullForm] = useState<'humanity' | 'technical'>('humanity');
  const [isSpeakingPhonetic, setIsSpeakingPhonetic] = useState(false);

  const colors = [
    {
      name: 'Electric Blue',
      hex: '#00A8FF',
      rgb: 'rgb(0, 168, 255)',
      description: 'The core intelligence, neural synapses, and active telemetry.',
      role: 'Primary Accent (10%)',
    },
    {
      name: 'Titanium Silver',
      hex: '#C0C5CE',
      rgb: 'rgb(192, 197, 206)',
      description: 'The stylized "J" monogram, armor chamfers, and outer ring.',
      role: 'Structural Bevels',
    },
    {
      name: 'Deep Space',
      hex: '#0A0E1A',
      rgb: 'rgb(10, 14, 26)',
      description: 'Quantum canvas background, boundless void of human inquiry.',
      role: 'Dominant Canvas (60%)',
    },
    {
      name: 'Cyan Plasma',
      hex: '#00F0FF',
      rgb: 'rgb(0, 240, 255)',
      description: 'High-energy nodal clusters and synaptic orbital rings.',
      role: 'Energy Highlights',
    },
    {
      name: 'Obsidian Plate',
      hex: '#0E1424',
      rgb: 'rgb(14, 20, 36)',
      description: 'Structural container surfaces and elevated HUD glass cards.',
      role: 'Surface Depth (30%)',
    },
  ];

  const taglines = [
    {
      title: 'More Than Code. More Human.',
      context: 'Highlights emotional intelligence and personal dedication to human builders.',
    },
    {
      title: 'Intelligence, With Heart.',
      context: 'Emphasizes ethics, warmth, and non-sycophantic guidance.',
    },
    {
      title: 'Built for Humanity.',
      context: 'The ultimate contrast to Stark-only isolationism. Open, democratic, empowering.',
    },
  ];

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const playPronunciation = () => {
    if (!('speechSynthesis' in window)) return;
    setIsSpeakingPhonetic(true);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('JOR-vish');
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.name.includes('Daniel') || v.lang.startsWith('en')) ||
      voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsSpeakingPhonetic(false);
    utterance.onerror = () => setIsSpeakingPhonetic(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Brand Identity Banner */}
      <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A8FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="shrink-0">
            <JorvishEmblem size={130} showGlow={true} isPulsing={true} />
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-mono text-[#00A8FF] bg-[#00A8FF]/10 px-2.5 py-1 rounded border border-[#00A8FF]/20">
                Official Brand Kit
              </span>
              <span className="text-xs text-slate-500 font-mono">v1.0.0</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              J.O.R.V.I.S.H
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-slate-300">
              <span className="font-mono text-cyan-400 font-semibold">/ ˈdʒɔːr.vɪʃ /</span>
              <span className="text-slate-600">·</span>
              <button
                onClick={playPronunciation}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors border border-slate-700"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeakingPhonetic ? 'text-cyan-400 animate-pulse' : ''}`} />
                <span>Hear Pronunciation</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 font-serif italic max-w-xl">
              "{selectedTagline}"
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Official Full Form & Philosophy Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Form Card */}
        <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
              1. The Official Full Form
            </h3>
            <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveFullForm('humanity')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeFullForm === 'humanity'
                    ? 'bg-[#00A8FF] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Humanity's Helper
              </button>
              <button
                onClick={() => setActiveFullForm('technical')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeFullForm === 'technical'
                    ? 'bg-[#00A8FF] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Technical Hub
              </button>
            </div>
          </div>

          {activeFullForm === 'humanity' ? (
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-mono text-[#00A8FF]">RECOMMENDED OFFICIAL FULL FORM</div>
              <p className="text-base font-bold text-slate-100">
                <span className="text-[#00A8FF]">J</span>ust{' '}
                <span className="text-[#00A8FF]">O</span>ne{' '}
                <span className="text-[#00A8FF]">R</span>ather{' '}
                <span className="text-[#00A8FF]">V</span>ery{' '}
                <span className="text-[#00A8FF]">I</span>ntelligent{' '}
                <span className="text-[#00A8FF]">S</span>ystem,{' '}
                <span className="text-white underline decoration-[#00A8FF] decoration-2">
                  <span className="text-[#00A8FF]">H</span>umanity's Helper
                </span>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Human, ambitious, and democratic. It honors the conversational wit and loyalty of traditional Jarvis, while shifting the locus of service from a single billionaire to all humankind.
              </p>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-mono text-cyan-400">ALTERNATE TECHNICAL FULL FORM</div>
              <p className="text-base font-bold text-slate-100">
                <span className="text-cyan-400">J</span>oint{' '}
                <span className="text-cyan-400">O</span>perative{' '}
                <span className="text-cyan-400">R</span>esponsive{' '}
                <span className="text-cyan-400">V</span>irtual{' '}
                <span className="text-cyan-400">I</span>ntelligent{' '}
                <span className="text-cyan-400">S</span>ystem{' '}
                <span className="text-cyan-400">H</span>ub
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Architectural and network-native. Ideal for enterprise infrastructure, robotics hubs, or distributed agent topologies.
              </p>
            </div>
          )}
        </div>

        {/* Philosophy Comparison Table */}
        <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            Philosophy Upgrade
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                J
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300">J.A.R.V.I.S. (The Predecessor)</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  "Just A Rather Very Intelligent System" — Built exclusively for Tony Stark. Proprietary, isolated, serving one hero in a tower.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#00A8FF]/10 border border-[#00A8FF]/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#00A8FF] text-slate-950 flex items-center justify-center shrink-0 text-xs font-extrabold font-mono">
                H
              </div>
              <div>
                <span className="text-xs font-bold text-white">J.O.R.V.I.S.H (The Evolution)</span>
                <p className="text-xs text-slate-300 mt-0.5">
                  "Humanity's Helper" — Open, democratic, personal to every builder. Dedicated to science, compassion, and human uplift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Color Palette Inspector */}
      <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#00A8FF]" />
              <span>Official Color Palette</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict 60-30-10 distribution matching titanium cybernetic specifications. Click any swatch to copy HEX.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {colors.map((c) => (
            <div
              key={c.hex}
              onClick={() => copyHex(c.hex)}
              className="group cursor-pointer bg-slate-950 border border-slate-800 hover:border-[#00A8FF] rounded-xl p-3 transition-all hover:scale-[1.02]"
            >
              <div
                className="w-full h-16 rounded-lg mb-3 shadow-inner relative flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono font-bold flex items-center gap-1">
                  {copiedColor === c.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedColor === c.hex ? 'Copied' : 'Copy'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">{c.name}</div>
              <div className="text-[11px] font-mono text-[#00A8FF]">{c.hex}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{c.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Taglines & Brand Voice */}
      <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
          <Quote className="w-4 h-4 text-cyan-400" />
          <span>Curated Tagline Options</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taglines.map((t) => {
            const isSelected = selectedTagline === t.title;
            return (
              <div
                key={t.title}
                onClick={() => setSelectedTagline(t.title)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-[#00A8FF] ring-1 ring-[#00A8FF]/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#00A8FF]">Tagline</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">"{t.title}"</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t.context}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
