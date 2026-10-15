import React, { useState } from 'react';
import { Palette, ShieldCheck, Check, Layers, Type, FileCode, Figma } from 'lucide-react';
import { BrandKit } from '../types';

interface BrandHubProps {
  currentBrand: BrandKit;
  onBrandUpdated: (brand: BrandKit) => void;
}

export const BrandHub: React.FC<BrandHubProps> = ({ currentBrand, onBrandUpdated }) => {
  const [primaryColor, setPrimaryColor] = useState(currentBrand.tokens.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(currentBrand.tokens.secondaryColor);
  const [accentColor, setAccentColor] = useState(currentBrand.tokens.accentColor);
  const [tagline, setTagline] = useState(currentBrand.tagline);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveBrandKit = () => {
    const updated: BrandKit = {
      ...currentBrand,
      tagline,
      tokens: {
        ...currentBrand.tokens,
        primaryColor,
        secondaryColor,
        accentColor,
      },
    };
    onBrandUpdated(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Centralized Brand Hub</h2>
              <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                Design System & Figma Tokens
              </span>
            </div>
            <p className="text-xs text-slate-400">Maintain one single Brand Kit across all merged posts to guarantee brand compliance and prevent visual inconsistencies</p>
          </div>
        </div>

        <button
          onClick={handleSaveBrandKit}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
        >
          {isSaved ? <Check className="w-4 h-4 text-slate-950" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{isSaved ? 'Brand Tokens Enforced!' : 'Save & Enforce Tokens'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Color Palette & Tokens */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-teal-400" />
              <span>Design Token Color Swatches</span>
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Primary Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">{primaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Secondary Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">{secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400">Accent Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Tagline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-teal-400" />
              <span>Brand Guidelines & Tagline</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Tone of Voice Guidelines</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentBrand.toneOfVoice.map((tone, i) => (
                  <span key={i} className="bg-slate-950 text-teal-300 border border-slate-800 text-xs px-3 py-1 rounded-lg font-medium">
                    {tone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Figma Token Sync Simulation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Figma className="w-4 h-4 text-purple-400" />
                <span>Figma Tokens Integration</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Synced</span>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-teal-300 border border-slate-800 overflow-x-auto">
              {JSON.stringify(
                {
                  brand_id: currentBrand.id,
                  tokens: {
                    color: {
                      primary: primaryColor,
                      secondary: secondaryColor,
                      accent: accentColor,
                    },
                    fontFamily: currentBrand.tokens.fontFamily,
                    borderRadius: currentBrand.tokens.borderRadius,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
