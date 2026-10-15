import React, { useState } from 'react';
import {
  Sparkles,
  Instagram,
  Linkedin,
  Facebook,
  Video,
  Code2,
  Calendar,
  Send,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Layers,
  Volume2,
  Play,
  RotateCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { AdaptedCampaign, BrandKit, Platform } from '../types';

interface CampaignPipelineProps {
  currentBrand: BrandKit;
  campaigns: AdaptedCampaign[];
  onCampaignCreated: (campaign: AdaptedCampaign) => void;
  onSchedulePost: (campaign: AdaptedCampaign, platform: Platform) => void;
}

export const CampaignPipeline: React.FC<CampaignPipelineProps> = ({
  currentBrand,
  campaigns,
  onCampaignCreated,
  onSchedulePost,
}) => {
  const [activeCampaign, setActiveCampaign] = useState<AdaptedCampaign>(campaigns[0]);
  const [selectedChannel, setSelectedChannel] = useState<Platform>('instagram');

  // Input states for new adaptation
  const [masterPrompt, setMasterPrompt] = useState('');
  const [targetAudience, setTargetAudience] = useState(currentBrand.targetAudience);
  const [campaignGoal, setCampaignGoal] = useState('App Downloads & Merchant Onboarding');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAdaptEverywhere = async () => {
    if (!masterPrompt.trim()) {
      setErrorMessage('Please enter a core campaign message or concept.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterPrompt,
          targetAudience,
          goal: campaignGoal,
          brandKitName: currentBrand.name,
        }),
      });

      const responseData = await res.json();
      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to adapt campaign across platforms.');
      }

      const generated = responseData.data;

      const newCampaign: AdaptedCampaign = {
        id: `camp-${Date.now()}`,
        masterPrompt,
        campaignTitle: generated.campaignTitle || 'New Multi-Platform Campaign',
        targetAudience,
        goal: campaignGoal,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'draft',
        brandKitName: currentBrand.name,
        instagram: generated.instagram,
        tiktok: generated.tiktok,
        linkedin: generated.linkedin,
        facebook: generated.facebook,
        headless: generated.headless,
        abTesting: generated.abTesting,
      };

      onCampaignCreated(newCampaign);
      setActiveCampaign(newCampaign);
      setMasterPrompt('');
    } catch (err: any) {
      console.error('Error adapting campaign:', err);
      setErrorMessage(err.message || 'Error communicating with Gemini server.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner: Philosophy & Concept */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/40 p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span>Core Philosophy: Create Once, Adapt Everywhere</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Unified Content Engine & Multi-Platform Distribution
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Enter a single core brand message for <span className="text-teal-300 font-semibold">{currentBrand.name}</span>. Dupperai’s specialized engines will automatically tailor, reformat, and generate channel-native posts for Instagram, TikTok, LinkedIn, Facebook, and Headless Apps.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center w-full sm:w-auto">
            <div className="text-2xl font-black text-teal-400">5 Platforms</div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Simultaneous Adaptation</div>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center w-full sm:w-auto">
            <div className="text-2xl font-black text-emerald-400">100% Brand Kit</div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Auto Token Compliance</div>
          </div>
        </div>
      </div>

      {/* Creation Studio Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Master Campaign Concept Studio</h3>
              <p className="text-xs text-slate-400">Type your high-level product announcement, promotion, or story</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Target Brand: <span className="text-teal-400 font-semibold">{currentBrand.name}</span>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Master Message / Campaign Concept
            </label>
            <textarea
              rows={3}
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
              placeholder="e.g., Launch Dukaanmitra AI POS: Local shopkeepers can scan inventory items with their phone camera and generate a 24/7 WhatsApp online catalog in 60 seconds."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Target Audience Context
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Target Audience (e.g., Small shop owners, retail vendors)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Campaign Goal
              </label>
              <select
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="App Downloads & Merchant Onboarding">App Downloads & Merchant Onboarding</option>
                <option value="Brand Awareness & Community Reach">Brand Awareness & Community Reach</option>
                <option value="Lead Generation & Product Demos">Lead Generation & Product Demos</option>
                <option value="Customer Retention & Feature Adoption">Customer Retention & Feature Adoption</option>
              </select>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setMasterPrompt('Dukaanmitra Summer Special: Zero commission on WhatsApp orders for local shopkeepers for 30 days!')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                Zero Commission Promo
              </button>
              <button
                type="button"
                onClick={() => setMasterPrompt('Introduce Voice AI Inventory Search: Merchants can speak product names to find stock instantly.')}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                Voice AI Feature
              </button>
            </div>

            <button
              onClick={handleAdaptEverywhere}
              disabled={isGenerating}
              className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-teal-500/20 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Gemini AI Orchestrating Adaptations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Adapt Everywhere (5 Channels)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Selector Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-teal-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Active Multi-Platform Campaign</h4>
            <p className="text-xs text-slate-400">{activeCampaign.campaignTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {campaigns.map((camp) => (
            <button
              key={camp.id}
              onClick={() => setActiveCampaign(camp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCampaign.id === camp.id
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {camp.campaignTitle.length > 28 ? camp.campaignTitle.substring(0, 28) + '...' : camp.campaignTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'instagram' as Platform, label: 'Instagram Studio', icon: Instagram, color: 'text-pink-400' },
            { id: 'tiktok' as Platform, label: 'TikTok Video Engine', icon: Video, color: 'text-cyan-400' },
            { id: 'linkedin' as Platform, label: 'LinkedIn Leadership', icon: Linkedin, color: 'text-blue-400' },
            { id: 'facebook' as Platform, label: 'Facebook Community', icon: Facebook, color: 'text-indigo-400' },
            { id: 'headless' as Platform, label: 'Headless Web / App CMS', icon: Code2, color: 'text-emerald-400' },
          ].map((ch) => {
            const Icon = ch.icon;
            const isSelected = selectedChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-teal-500/40 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${ch.color}`} />
                <span>{ch.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              </button>
            );
          })}
        </div>

        {/* Channel Specific Detail Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {/* INSTAGRAM TAB */}
          {selectedChannel === 'instagram' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Instagram Feed / Story Card Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Visual Feed & Reel Concept</span>
                  </h4>
                  <span className="text-xs bg-pink-950 text-pink-300 border border-pink-800 px-2.5 py-0.5 rounded-full font-semibold">
                    Ratio 1:1 & 9:16
                  </span>
                </div>

                {/* Mock Phone Frame */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-2xl max-w-md mx-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-xs">
                        DM
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">dukaanmitra.ai</div>
                        <div className="text-[10px] text-slate-400">Sponsored • Local Business</div>
                      </div>
                    </div>
                    <span className="text-xs text-teal-400 font-bold">100% Brand Compliant</span>
                  </div>

                  {/* Visual Box */}
                  <div className="aspect-square bg-gradient-to-tr from-teal-900 via-slate-900 to-emerald-900 rounded-xl border border-teal-700/30 p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0a67e5842823?auto=format&fit=crop&w=600&q=80')` }}></div>
                    <div className="relative z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-500/30 text-[11px] font-extrabold text-teal-300 self-start">
                      {activeCampaign.instagram.visualOverlayText}
                    </div>

                    <div className="relative z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200">
                      <p className="font-semibold text-white">AI Image Concept Prompt:</p>
                      <p className="text-[11px] text-slate-300 italic mt-1">{activeCampaign.instagram.imagePrompt}</p>
                    </div>
                  </div>

                  {/* Caption & Hashtags */}
                  <div className="space-y-2 text-xs text-slate-200">
                    <p className="whitespace-pre-line leading-relaxed">{activeCampaign.instagram.caption}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeCampaign.instagram.hashtags.map((tag, i) => (
                        <span key={i} className="text-teal-400 font-semibold text-[11px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sidebar for Instagram */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Call To Action</h5>
                    <p className="text-sm text-teal-300 font-semibold">{activeCampaign.instagram.callToAction}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Automated DM Trigger</h5>
                    <p className="text-xs text-slate-400">
                      When a user comments "STORE", Dupperai Chatbot engine will automatically send the app link to their Instagram DM.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCopy(activeCampaign.instagram.caption, 'ig-caption')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {copiedKey === 'ig-caption' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'ig-caption' ? 'Copied Instagram Post!' : 'Copy Caption & Tags'}</span>
                  </button>

                  <button
                    onClick={() => onSchedulePost(activeCampaign, 'instagram')}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Queue for Instagram</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TIKTOK TAB */}
          {selectedChannel === 'tiktok' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* TikTok Video Storyboard & Script */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span>TikTok Short Clip Storyboard</span>
                  </h4>
                  <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
                    {activeCampaign.tiktok.estimatedDurationSec}s Duration
                  </span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-teal-500/30">
                    <div className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider">3-Second Hook (Critical)</div>
                    <p className="text-sm font-extrabold text-white mt-1">"{activeCampaign.tiktok.scriptHook}"</p>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1">Body Script:</div>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {activeCampaign.tiktok.videoBodyScript}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-2">Visual Scene Cues:</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeCampaign.tiktok.visualCues.map((cue, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg">
                          <span className="text-teal-400 font-bold">{idx + 1}.</span>
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* TikTok Voiceover & Audio Engine Integration */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-teal-400" />
                        <span>AI Studio Voiceover Text</span>
                      </h5>
                      <span className="text-[10px] text-teal-400 font-mono">Gemini TTS Ready</span>
                    </div>
                    <p className="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                      "{activeCampaign.tiktok.voiceoverText}"
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Recommended Soundtrack Vibe</h5>
                    <p className="text-xs text-cyan-300 font-semibold">{activeCampaign.tiktok.audioSoundtrack}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCopy(activeCampaign.tiktok.videoBodyScript, 'tk-script')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {copiedKey === 'tk-script' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Script & Prompts</span>
                  </button>

                  <button
                    onClick={() => onSchedulePost(activeCampaign, 'tiktok')}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Queue for TikTok</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LINKEDIN TAB */}
          {selectedChannel === 'linkedin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn Executive Article & Carousel</span>
                  </h4>
                  <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full font-semibold">
                    B2B & Enterprise
                  </span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="text-base font-extrabold text-white leading-snug">{activeCampaign.linkedin.headline}</h5>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed border-t border-slate-800/80 pt-3">
                    {activeCampaign.linkedin.body}
                  </p>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Key Executive Takeaways</div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {activeCampaign.linkedin.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Carousel Slides & Dispatch */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Generated Carousel Slides Deck</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeCampaign.linkedin.carouselSlides.map((slide) => (
                      <div key={slide.slideNumber} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="text-[10px] font-extrabold text-blue-400">Slide #{slide.slideNumber}</div>
                        <div className="text-xs font-bold text-white leading-tight">{slide.title}</div>
                        <p className="text-[10px] text-slate-400 leading-tight">{slide.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCopy(`${activeCampaign.linkedin.headline}\n\n${activeCampaign.linkedin.body}`, 'li-copy')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {copiedKey === 'li-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Post Content</span>
                  </button>

                  <button
                    onClick={() => onSchedulePost(activeCampaign, 'linkedin')}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Queue for LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FACEBOOK TAB */}
          {selectedChannel === 'facebook' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-indigo-400" />
                    <span>Facebook Post & Link Card Preview</span>
                  </h4>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <p className="text-xs text-slate-200 leading-relaxed">{activeCampaign.facebook.mainText}</p>

                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                    <div className="h-32 bg-gradient-to-r from-teal-900 to-indigo-900 flex items-center justify-center p-4 text-center">
                      <span className="text-xs font-bold text-white">{activeCampaign.facebook.bannerConcept}</span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-[10px] uppercase text-slate-500 font-bold">dukaanmitra.ai</div>
                      <div className="text-xs font-bold text-white">{activeCampaign.facebook.linkPreviewTitle}</div>
                      <p className="text-[11px] text-slate-400">{activeCampaign.facebook.linkPreviewDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-between">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Community Engagement Question</h5>
                  <p className="text-xs text-teal-300 font-semibold bg-slate-900 p-3 rounded-lg border border-slate-800">
                    "{activeCampaign.facebook.communityQuestionHook}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCopy(activeCampaign.facebook.mainText, 'fb-copy')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {copiedKey === 'fb-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Facebook Post</span>
                  </button>

                  <button
                    onClick={() => onSchedulePost(activeCampaign, 'facebook')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Queue for Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HEADLESS WEB & APP CMS TAB */}
          {selectedChannel === 'headless' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Real React Component & Code Export</span>
                  </h4>
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                    Deployable React / JSX
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Generated React Banner Component:</div>
                    <pre className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                      {activeCampaign.headless.reactComponentSnippet}
                    </pre>
                  </div>
                </div>
              </div>

              {/* JSON Payload & Headless API Dispatch */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">REST API JSON Payload</h5>
                    <span className="text-[10px] text-teal-400 font-mono">GET /api/v1/posts</span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    {JSON.stringify(
                      {
                        title: activeCampaign.headless.title,
                        summary: activeCampaign.headless.summary,
                        campaign_id: activeCampaign.id,
                        brand: currentBrand.name,
                        target_goal: activeCampaign.goal,
                        status: 'published',
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCopy(activeCampaign.headless.reactComponentSnippet, 'code-copy')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {copiedKey === 'code-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy React JSX Code</span>
                  </button>

                  <button
                    onClick={() => onSchedulePost(activeCampaign, 'headless')}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish via Headless API</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
