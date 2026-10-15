import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Palette,
  Maximize2,
  Wand2,
  Download,
  Copy,
  Check,
  RotateCw,
  Layers,
  Type,
  Layout,
} from 'lucide-react';
import { BrandKit } from '../types';

interface VisualGraphicEngineProps {
  currentBrand: BrandKit;
}

export const VisualGraphicEngine: React.FC<VisualGraphicEngineProps> = ({ currentBrand }) => {
  const [prompt, setPrompt] = useState(
    'A proud local retail merchant standing in a modern grocery store holding a glowing smartphone displaying a clean digital store inventory catalog.'
  );
  const [headlineText, setHeadlineText] = useState('SCAN & SELL IN 60 SECONDS');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '1.91:1'>('1:1');
  const [visualStyle, setVisualStyle] = useState<'Cinematic' | 'Modern SaaS' | 'Neo-Brutalism' | 'Minimalist Luxury'>('Modern SaaS');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isMagicRewriting, setIsMagicRewriting] = useState(false);

  // Sample Generated Visual Asset
  const [graphicBgUrl, setGraphicBgUrl] = useState(
    'https://images.unsplash.com/photo-1556742049-0a67e5842823?auto=format&fit=crop&w=800&q=80'
  );

  const handleMagicWriteCopy = () => {
    setIsMagicRewriting(true);
    setTimeout(() => {
      const options = [
        'BUILD YOUR DIGITAL STORE TODAY 📱✨',
        'NO BARCODE SCANNER REQUIRED 🚀',
        'TRANSFORM KIRANA TO E-COMMERCE 🏪',
        'AUTOMATE INVENTORY IN 60 SECONDS ⏱️',
      ];
      const randomHeadline = options[Math.floor(Math.random() * options.length)];
      setHeadlineText(randomHeadline);
      setIsMagicRewriting(false);
    }, 800);
  };

  const handleGenerateImage = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const images = [
        'https://images.unsplash.com/photo-1556742049-0a67e5842823?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      ];
      setGraphicBgUrl(images[Math.floor(Math.random() * images.length)]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-500/10 text-pink-400 border border-pink-500/30 rounded-xl">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Visual Graphic Engine</h2>
              <span className="text-[10px] font-extrabold bg-pink-950 text-pink-300 border border-pink-800 px-2 py-0.5 rounded-full">
                Canva Magic Write & Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">Transform images and generate on-brand graphics tailored to each social platform spec</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Brand Kit Token:</span>
          <span className="text-xs font-bold text-teal-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            {currentBrand.name} ({currentBrand.tokens.primaryColor})
          </span>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls & AI Magic Tools */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-pink-400" />
                <span>AI Image & Graphic Prompt</span>
              </h3>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />

            <button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Graphic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Generate On-Brand Image</span>
                </>
              )}
            </button>
          </div>

          {/* Magic Write Headline Control */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-teal-400" />
                <span>Magic Copywriter Overlay</span>
              </h3>
              <button
                onClick={handleMagicWriteCopy}
                disabled={isMagicRewriting}
                className="text-[11px] text-teal-400 hover:underline font-bold flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                <span>Magic Rewrite</span>
              </button>
            </div>

            <input
              type="text"
              value={headlineText}
              onChange={(e) => setHeadlineText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Platform Aspect Ratio & Style Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-blue-400" />
              <span>Platform Spec Aspect Ratio</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '1:1', label: 'Instagram (1:1)' },
                { id: '9:16', label: 'TikTok / Reel (9:16)' },
                { id: '16:9', label: 'Web / App (16:9)' },
                { id: '1.91:1', label: 'LinkedIn (1.91:1)' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    aspectRatio === r.id
                      ? 'bg-teal-950 border-teal-500 text-teal-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aesthetic Preset</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Modern SaaS">Modern SaaS (Teal & Clean)</option>
                <option value="Cinematic">Cinematic (High Contrast Dark)</option>
                <option value="Neo-Brutalism">Neo-Brutalism (Bold Typography)</option>
                <option value="Minimalist Luxury">Minimalist Luxury (Spacious Elegance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Graphic Canvas Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Adaptive Graphic Canvas ({aspectRatio})</span>
              </h3>
              <span className="text-xs text-teal-400 font-mono">Brand Colors Applied</span>
            </div>

            {/* Render Canvas in selected aspect ratio */}
            <div
              className={`mx-auto bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all max-w-md ${
                aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[1.91/1]'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-500"
                style={{ backgroundImage: `url('${graphicBgUrl}')` }}
              ></div>

              {/* Brand Logo Watermark */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-teal-500/30 text-[11px] font-bold text-teal-300">
                  {currentBrand.name}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                  {visualStyle}
                </span>
              </div>

              {/* Overlay Text Banner */}
              <div className="relative z-10 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
                  {currentBrand.tagline}
                </div>
                <h4 className="text-base font-black text-white leading-tight">
                  {headlineText}
                </h4>
              </div>

              <div className="relative z-10 text-[10px] text-slate-300 font-medium bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
                Automated Multi-Platform Render Engine
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => alert('Exporting high-resolution asset with brand tokens applied...')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Export Platform Graphic</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
