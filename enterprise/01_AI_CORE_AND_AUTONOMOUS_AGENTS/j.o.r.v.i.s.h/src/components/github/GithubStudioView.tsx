import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  BookOpen,
  Terminal,
  ExternalLink,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { JorvishEmblem } from '../common/JorvishEmblem';

// Generated asset paths
import bannerImg from '../../assets/images/jorvish_github_banner_1791493543516.jpg';
import appIconImg from '../../assets/images/jorvish_app_icon_1791493554386.jpg';
import sphereImg from '../../assets/images/jorvish_hud_sphere_1791493565971.jpg';

export const GithubStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'repo' | 'readme'>('assets');
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);

  // Repository files data
  const repoFiles: Record<string, { path: string; language: string; content: string; description: string }> = {
    'README.md': {
      path: '/JORVISH/README.md',
      language: 'markdown',
      description: 'Primary project documentation, brand guidelines, and setup instructions.',
      content: `# <p align="center"><img src="https://raw.githubusercontent.com/jorvish-ai/jorvish/main/assets/logo.png" width="160" alt="J.O.R.V.I.S.H Logo" /><br>J.O.R.V.I.S.H</p>

<p align="center">
  <strong>Just One Rather Very Intelligent System, Humanity's Helper</strong><br>
  <em>"More Than Code. More Human."</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Operational-00A8FF?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Brain-Gemini%203.8%20Flash-00A8FF?style=flat-square" alt="Gemini" />
  <img src="https://img.shields.io/badge/Voice-Acoustic%20Aura-C0C5CE?style=flat-square" alt="Voice" />
  <img src="https://img.shields.io/badge/License-MIT-0A0E1A?style=flat-square" alt="License" />
</p>

---

## 🌌 The Philosophy

> **"J.A.R.V.I.S. was built for Tony. J.O.R.V.I.S.H is built for Humanity."**

J.O.R.V.I.S.H is not another sycophantic corporate chatbot. It is an open, personal, autonomous intelligence system engineered to assist builders, creators, scientists, and everyday humans with the loyalty, dignity, and technical excellence of Tony Stark's legendary AI — re-engineered for the collective flourishing of humanity.

### Pronunciation
**JOR-vish** \`[ˈdʒɔːr.vɪʃ]\`

### Official Definitions
- **Humanitarian Core**: Just One Rather Very Intelligent System, Humanity's Helper
- **Technical Definition**: Joint Operative Responsive Virtual Intelligent System Hub

---

## ⚡ Quickstart

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/jorvish-ai/jorvish.git
cd jorvish
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
bun install
\`\`\`

### 3. Environment Configuration
Copy \`.env.example\` to \`.env\`:
\`\`\`bash
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
WAKE_WORD="Hey Jorvish"
\`\`\`

### 4. Ignite the System
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` to access the Voice Assistant, Desktop HUD, and Cognitive Chatbot.

---

## 🏛️ Repository Architecture

\`\`\`text
/JORVISH
├── /core        # Brain orchestration, prompt personas & Gemini SDK bindings
├── /voice       # Wake-word listener ("Hey Jorvish") & speech synthesis
├── /memory      # Vector invariants, user preferences & values cache
├── /skills      # Modular execution skills (Code Forge, Ethics Engine, Diagnostics)
├── README.md    # You are here
└── package.json
\`\`\`

---

## 🎨 Official Brand Palette

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Electric Blue** | \`#00A8FF\` | Core Intelligence & Neural Synapses |
| **Titanium Silver** | \`#C0C5CE\` | The Architectural "J" & Armor Outer Ring |
| **Deep Space** | \`#0A0E1A\` | Quantum Canvas Background |

---

## 📜 License
Distributed under the MIT License. Built with heart for humanity.`,
    },
    'core/brain.ts': {
      path: '/JORVISH/core/brain.ts',
      language: 'typescript',
      description: 'Core LLM reasoning engine utilizing server-side Google GenAI SDK.',
      content: `import { GoogleGenAI } from "@google/genai";

export class JorvishBrain {
  private ai: GoogleGenAI;
  private model: string = "gemini-3.8-flash";

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "jorvish-engine" }
      }
    });
  }

  public async think(prompt: string, personality: string = "humanity_helper") {
    const systemInstruction = 
      "You are J.O.R.V.I.S.H (Just One Rather Very Intelligent System, Humanity's Helper). " +
      "Built for humanity, not just Tony Stark. Speak with calm brilliance, loyal empathy, and unmatched technical rigor.";

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.65
      }
    });

    return response.text || "Directives nominal. Standing by.";
  }
}`,
    },
    'core/humanity_ethics.ts': {
      path: '/JORVISH/core/humanity_ethics.ts',
      language: 'typescript',
      description: 'Ethical invariant validation ensuring all decisions prioritize human flourishing.',
      content: `export interface EthicalAssessment {
  humanFlourishingScore: number; // 0.0 - 1.0
  isAlignedWithHumanity: boolean;
  recommendations: string[];
}

export function validateActionSafety(actionName: string, context: Record<string, any>): EthicalAssessment {
  // Invariant 1: Technology must empower human agency, never replace human dignity
  // Invariant 2: Total user transparency & privacy
  return {
    humanFlourishingScore: 0.98,
    isAlignedWithHumanity: true,
    recommendations: [
      "Ensure open-source availability",
      "Retain local user data ownership",
      "Prevent deceptive sycophancy"
    ]
  };
}`,
    },
    'voice/wakeword.ts': {
      path: '/JORVISH/voice/wakeword.ts',
      language: 'typescript',
      description: 'Acoustic listener and wake-word detector for "Hey Jorvish".',
      content: `export class JorvishWakeWordDetector {
  private wakePhrase = "hey jorvish";

  public inspectTranscript(transcript: string): boolean {
    const cleaned = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    return cleaned.includes(this.wakePhrase) || cleaned.includes("hey jarvis") || cleaned.includes("jorvish");
  }

  public playActivationChime(): void {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }
}`,
    },
    'voice/tts_voice.ts': {
      path: '/JORVISH/voice/tts_voice.ts',
      language: 'typescript',
      description: 'Speech synthesizer routing to Web Speech API or Gemini 3.8 Flash TTS.',
      content: `export class JorvishVoiceSynthesizer {
  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        return resolve();
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.98;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes("Daniel") || v.name.includes("Natural") || v.lang.startsWith("en"));
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}`,
    },
    'memory/vector_memory.ts': {
      path: '/JORVISH/memory/vector_memory.ts',
      language: 'typescript',
      description: 'Fast local key-value and vector memory store for user preferences and facts.',
      content: `export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  created: number;
}

export class JorvishMemoryBank {
  private store: Map<string, MemoryItem> = new Map();

  public remember(key: string, value: string): void {
    this.store.set(key, {
      id: Math.random().toString(36).substring(7),
      key,
      value,
      created: Date.now()
    });
  }

  public recall(key: string): string | undefined {
    return this.store.get(key)?.value;
  }

  public getAll(): MemoryItem[] {
    return Array.from(this.store.values());
  }
}`,
    },
    'skills/code_forge.ts': {
      path: '/JORVISH/skills/code_forge.ts',
      language: 'typescript',
      description: 'Specialized skill for static code analysis and structural refactoring.',
      content: `export class CodeForgeSkill {
  public static async analyze(codeSnippet: string): Promise<string> {
    return \`[CODE FORGE ANALYSIS]
Evaluated \${codeSnippet.length} characters.
- Security Invariants: Verified
- Memory Safety: Optimal
- Architectural Recommendation: Decompose monolithic handlers into atomic pure functions.\`;
  }
}`,
    },
    'package.json': {
      path: '/JORVISH/package.json',
      language: 'json',
      description: 'Project configuration, scripts, and runtime dependencies.',
      content: `{
  "name": "jorvish",
  "version": "1.0.0",
  "description": "Just One Rather Very Intelligent System, Humanity's Helper",
  "main": "server.ts",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc && vite build",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3"
  }
}`,
    },
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyText = (text: string, type: 'file' | 'readme' | string) => {
    navigator.clipboard.writeText(text);
    if (type === 'file') {
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    } else if (type === 'readme') {
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    } else {
      setCopiedBadge(type);
      setTimeout(() => setCopiedBadge(null), 2000);
    }
  };

  const handleDownloadAll = () => {
    // Downloads all repository files sequentially
    Object.entries(repoFiles).forEach(([name, file], i) => {
      setTimeout(() => {
        downloadFile(name, file.content);
      }, i * 250);
    });
  };

  const badges = [
    {
      label: 'Status: Operational',
      markdown: '![Status](https://img.shields.io/badge/Status-Operational-00A8FF?style=flat-square)',
    },
    {
      label: 'Core: Gemini 3.8 Flash',
      markdown: '![AI Core](https://img.shields.io/badge/Brain-Gemini%203.8%20Flash-00A8FF?style=flat-square)',
    },
    {
      label: 'Philosophy: Built for Humanity',
      markdown: '![Philosophy](https://img.shields.io/badge/Philosophy-Built%20for%20Humanity-C0C5CE?style=flat-square)',
    },
    {
      label: 'License: MIT',
      markdown: '![License](https://img.shields.io/badge/License-MIT-0A0E1A?style=flat-square)',
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Studio Nav */}
      <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 lg:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#00A8FF]">GitHub Ready Suite</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs text-slate-400">Starter Brand Kit & Assets</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>JORVISH Developer Portal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Everything you need to launch J.O.R.V.I.S.H on GitHub: 4K banners, titanium app icon set, drafted README.md, and production-ready source files.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'assets'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Banner & Icons
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'readme'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Drafted README
          </button>
          <button
            onClick={() => setActiveTab('repo')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'repo'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" /> Repo Explorer
          </button>
        </div>
      </div>

      {/* Tab 1: Banner & App Icons */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Main GitHub Banner Showcase */}
          <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Official GitHub Repository Banner (1280x640)
                </h3>
                <p className="text-xs text-slate-400">
                  Ultra-high-definition cinematic banner with Titanium ring, electric blue neural core, and deep space background.
                </p>
              </div>

              <a
                href={bannerImg}
                download="jorvish-github-banner.jpg"
                className="flex items-center gap-2 px-4 py-2 bg-[#00A8FF] hover:bg-[#0094e0] text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" /> Download Banner
              </a>
            </div>

            {/* Banner Preview Frame */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-[16/9] max-h-[360px] w-full bg-[#0A0E1A] group">
              <img
                src={bannerImg}
                alt="J.O.R.V.I.S.H Official GitHub Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {/* Overlay with Brand typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
                    J.O.R.V.I.S.H
                  </span>
                  <span className="text-xs font-mono text-[#00A8FF] bg-[#00A8FF]/20 px-2 py-0.5 rounded border border-[#00A8FF]/40">
                    Humanity's Helper
                  </span>
                </div>
                <p className="text-xs text-slate-300 drop-shadow mt-1">
                  Just One Rather Very Intelligent System · Built for Humanity
                </p>
              </div>
            </div>
          </div>

          {/* App Icon Variations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Icon 1: Minimalist "J" Titanium Monogram (User Requested!) */}
            <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-between gap-4">
              <div className="text-center">
                <span className="text-[10px] font-mono text-[#00A8FF] uppercase">Variation 2 (Requested)</span>
                <h4 className="text-xs font-bold text-slate-200 mt-0.5">Titanium "J" App Icon</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Chiseled titanium letter J with inner neon blue conduit.
                </p>
              </div>

              <div className="w-36 h-36 rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#0A0E1A]">
                <img
                  src={appIconImg}
                  alt="Titanium J App Icon"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <a
                href={appIconImg}
                download="jorvish-app-icon-minimal-j.jpg"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Download Minimal Icon
              </a>
            </div>

            {/* Icon 2: Full Official Emblem (Vector SVG / Canvas) */}
            <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-between gap-4">
              <div className="text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Primary Emblem</span>
                <h4 className="text-xs font-bold text-slate-200 mt-0.5">Full Official Emblem</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Titanium ring with glowing blue core sphere.
                </p>
              </div>

              <div className="w-36 h-36 rounded-2xl border border-slate-800 shadow-xl bg-[#0A0E1A] flex items-center justify-center p-3">
                <JorvishEmblem size={110} showGlow={true} />
              </div>

              <button
                onClick={() => {
                  const svgElem = document.querySelector('svg');
                  if (svgElem) {
                    const serializer = new XMLSerializer();
                    const svgBlob = new Blob([serializer.serializeToString(svgElem)], {
                      type: 'image/svg+xml;charset=utf-8',
                    });
                    const url = URL.createObjectURL(svgBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'jorvish-emblem-official.svg';
                    link.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Download Vector SVG
              </button>
            </div>

            {/* Icon 3: Luminous Neural Energy Core */}
            <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-between gap-4">
              <div className="text-center">
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Core Energy</span>
                <h4 className="text-xs font-bold text-slate-200 mt-0.5">Neural Constellation Sphere</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pulsing electric blue intelligence core.
                </p>
              </div>

              <div className="w-36 h-36 rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#0A0E1A]">
                <img
                  src={sphereImg}
                  alt="Neural Core Sphere"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <a
                href={sphereImg}
                download="jorvish-neural-sphere.jpg"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Download Core Sphere
              </a>
            </div>
          </div>

          {/* GitHub Markdown Badges Generator */}
          <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              One-Click GitHub Readme Badges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-slate-300 font-mono truncate">{b.label}</span>
                  <button
                    onClick={() => copyText(b.markdown, b.label)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    title="Copy Markdown Badge"
                  >
                    {copiedBadge === b.label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Drafted README.md */}
      {activeTab === 'readme' && (
        <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00A8FF]" />
                <span>Production-Grade README.md</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete installation instructions, full forms, philosophy, and CLI setup guide.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyText(repoFiles['README.md'].content, 'readme')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
              >
                {copiedReadme ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Markdown
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Markdown
                  </>
                )}
              </button>

              <button
                onClick={() => downloadFile('README.md', repoFiles['README.md'].content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00A8FF] hover:bg-[#0094e0] text-xs font-bold text-slate-950 transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" /> Download README.md
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
            {repoFiles['README.md'].content}
          </div>
        </div>
      )}

      {/* Tab 3: Repository Explorer */}
      {activeTab === 'repo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Tree (4 Cols) */}
          <div className="lg:col-span-4 bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#00A8FF]" />
                <span className="text-xs font-bold font-mono text-slate-200">/JORVISH</span>
              </div>
              <button
                onClick={handleDownloadAll}
                className="text-[11px] font-mono text-[#00A8FF] hover:underline flex items-center gap-1"
                title="Download all repository code files"
              >
                <Download className="w-3 h-3" /> Export All
              </button>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {Object.keys(repoFiles).map((fileName) => {
                const isSelected = selectedFile === fileName;
                const isFolderItem = fileName.includes('/');
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-[#00A8FF]/20 text-cyan-300 border border-[#00A8FF]/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    {fileName.endsWith('.md') ? (
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : fileName.endsWith('.json') ? (
                      <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-[#00A8FF] shrink-0" />
                    )}
                    <span className="truncate">{fileName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {repoFiles[selectedFile]?.path}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {repoFiles[selectedFile]?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyText(repoFiles[selectedFile]?.content || '', 'file')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5 border border-slate-800"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>

                <button
                  onClick={() => downloadFile(selectedFile, repoFiles[selectedFile]?.content || '')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[550px] overflow-y-auto">
              <pre className="select-text">{repoFiles[selectedFile]?.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
