import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  User,
  Mic,
  Video,
  Check,
  ShieldCheck,
  RefreshCw,
  Wand2,
  Play,
  Pause,
  MapPin,
  Globe,
  Share2,
  Shirt,
  Copy,
} from 'lucide-react';
import { BrandKit } from '../types';

interface AvatarPersonaEngineProps {
  currentBrand: BrandKit;
}

export const AvatarPersonaEngine: React.FC<AvatarPersonaEngineProps> = ({ currentBrand }) => {
  const [digitalTwinName, setDigitalTwinName] = useState('Amit (Founder Dupper)');
  const [voiceTone, setVoiceTone] = useState('Confident, Energetic Indian SaaS Founder');
  const [faceModelStatus, setFaceModelStatus] = useState<'trained' | 'training'>('trained');
  const [similarityScore, setSimilarityScore] = useState(99.8);
  const [accentRegion, setAccentRegion] = useState('Indian English / Hinglish Blend');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // World Spaces & Selective Modification State
  const [selectedLocation, setSelectedLocation] = useState<'paris' | 'santorini' | 'tokyo' | 'dubai' | 'maldives' | 'nyc'>('paris');
  const [selectedOutfit, setSelectedOutfit] = useState('Chic Travel Outfit / Trench Coat');
  const [lightingPreset, setLightingPreset] = useState('Golden Hour Sunset');
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const locationsData = {
    paris: {
      name: 'Paris, France',
      space: 'Trocadéro Plaza & Eiffel Tower',
      bgImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
      caption: 'Golden hour in Paris! 🗼 Expanding Dukaanmitra to global retail markets while keeping kirana heart intact.',
      hashtags: '#Paris #GlobalRetail #Dukaanmitra #SaaSFounder #TechTravel',
    },
    santorini: {
      name: 'Santorini, Greece',
      space: 'Oia Cliffside Blue Domes & Aegean Sea',
      bgImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80',
      caption: 'Clear skies and blue seas in Santorini. 🌊 Building tech that works from anywhere in the world.',
      hashtags: '#Santorini #RemoteWork #StartupLife #AIApp #GlobalFounder',
    },
    tokyo: {
      name: 'Tokyo, Japan',
      space: 'Shibuya Crossing & Cyber Neon Night',
      bgImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      caption: 'Late night inspiration in Tokyo! ⚡ Computer vision scanning inspired by Japanese retail precision.',
      hashtags: '#TokyoTech #ComputerVision #AIInnovation #Shibuya #Dukaanmitra',
    },
    dubai: {
      name: 'Dubai, UAE',
      space: 'Burj Khalifa Skyline & Marina Sunset',
      bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Dubai skyline views! 🏙️ Scaling retail automation for merchant ecosystems across Middle East & Asia.',
      hashtags: '#DubaiTech #StartupGrowth #RetailTech #MiddleEastBusiness',
    },
    maldives: {
      name: 'Maldives Islands',
      space: 'Overwater Bungalows & Lagoon',
      bgImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
      caption: 'Unplugging in Maldives 🌴 while AI handles automated social posts and WhatsApp catalog sync.',
      hashtags: '#Maldives #WorkLifeBalance #Automation #AISolutions',
    },
    nyc: {
      name: 'New York City, USA',
      space: 'Times Square & Midtown Rooftop',
      bgImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Big lights in NYC! 🗽 Presenting our 60-second AI camera store setup on Broadway.',
      hashtags: '#NYC #TechStars #VentureCapital #AIRevolution',
    },
  };

  const activeScene = locationsData[selectedLocation];

  const handleRetrainAvatar = () => {
    setFaceModelStatus('training');
    setTimeout(() => {
      setFaceModelStatus('trained');
      setSimilarityScore(99.9);
    }, 1800);
  };

  const handleGenerateWorldPost = () => {
    setIsGeneratingScene(true);
    setTimeout(() => {
      setIsGeneratingScene(false);
    }, 1200);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${activeScene.caption}\n\n${activeScene.hashtags}`);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Avatar / Digital Twin Engine (The "Dupper" Core)</h2>
              <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                Zero Degradation Face Lock
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Your face remains a 100% exact duplicate. Only selective enhancements (dress, location, background, lighting) are applied with zero quality drop.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Identity Locked ({similarityScore}% Precision)</span>
          </span>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Twin Setup & Selective Modification Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Avatar Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <span>Active Creator Avatar Twin</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                Model v3.6
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Creator Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
              />
              <div className="space-y-1">
                <div className="text-sm font-black text-white">{digitalTwinName}</div>
                <div className="text-[11px] text-slate-400">Linked to Brand: {currentBrand.name}</div>
                <div className="text-[10px] text-teal-400 font-mono font-bold">1080p Ultra-Realistic Live Photorealism</div>
              </div>
            </div>

            <button
              onClick={handleRetrainAvatar}
              disabled={faceModelStatus === 'training'}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              {faceModelStatus === 'training' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Fine-Tuning Visual Expressions...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-teal-400" />
                  <span>Re-Train Visual Identity Model</span>
                </>
              )}
            </button>
          </div>

          {/* Voice Clone Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Cloned Voice Signature</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Voice Tone & Style Preset</label>
                <input
                  type="text"
                  value={voiceTone}
                  onChange={(e) => setVoiceTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Accent & Cadence Model</label>
                <input
                  type="text"
                  value={accentRegion}
                  onChange={(e) => setAccentRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Voice Clone Sample</div>
                  <div className="text-[10px] text-slate-400">12-sec speech sample loaded</div>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="p-2 bg-teal-500 text-slate-950 rounded-full font-bold hover:scale-105 transition-all"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                </button>
              </div>
            </div>
          </div>

          {/* Selective Location & Scene Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>World Spaces & Global Locations</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(locationsData) as Array<keyof typeof locationsData>).map((key) => {
                const loc = locationsData[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedLocation(key)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedLocation === key
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{loc.name.split(',')[0]}</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1">{loc.space}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selective Dress, Colors, & Lighting */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-400" />
              <span>Selective Modifications (Dress & Lighting)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Wardrobe Outfit Style</label>
                <select
                  value={selectedOutfit}
                  onChange={(e) => setSelectedOutfit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Chic Travel Outfit / Trench Coat">Chic Travel Outfit / Trench Coat</option>
                  <option value="Summer Linen Suit / Resort Casual">Summer Linen Suit / Resort Casual</option>
                  <option value="Casual Tech Founder (Black Hoodie)">Casual Tech Founder (Black Hoodie)</option>
                  <option value="Formal Executive Blazer">Formal Executive Blazer</option>
                  <option value="Modern Streetwear & Sneakers">Modern Streetwear & Sneakers</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Lighting & Color Enhancement</label>
                <select
                  value={lightingPreset}
                  onChange={(e) => setLightingPreset(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Golden Hour Sunset">Golden Hour Sunset (Warm Luminous)</option>
                  <option value="Cinematic High-Contrast">Cinematic High-Contrast (Crisp Shadows)</option>
                  <option value="Daylight Vivid Blue">Daylight Vivid Blue (Natural Sunlight)</option>
                  <option value="Cyber Neon Night Glow">Cyber Neon Night Glow (Tokyo Night)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateWorldPost}
                disabled={isGeneratingScene}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-95 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
              >
                {isGeneratingScene ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Rendering Photorealistic World Scene...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Generate Realistic World Avatar Scene</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live World Scene Canvas & Ready Social Media Post */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>{activeScene.name} — Photorealistic Live Avatar</span>
                </h3>
                <p className="text-xs text-slate-400">{activeScene.space}</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-lg">
                Face Duplicate Locked
              </span>
            </div>

            {/* Live Render Canvas Frame */}
            <div className="aspect-[4/5] max-w-sm mx-auto bg-slate-950 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex flex-col justify-between p-5 shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url('${activeScene.bgImage}')` }}
              ></div>

              {/* Avatar Overlay with Face Preservation */}
              <div className="absolute bottom-0 right-4 w-44 h-64 rounded-t-3xl overflow-hidden border-2 border-teal-500 shadow-2xl backdrop-blur-sm bg-slate-950/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Avatar Face Preserved"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top Watermark */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-teal-500/30">
                  DUPPER REALISTIC WORLD SCENE
                </span>
                <span className="bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-800/50">
                  {lightingPreset}
                </span>
              </div>

              {/* Bottom Details Card */}
              <div className="relative z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs text-white space-y-1">
                <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Wardrobe: {selectedOutfit}
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Selective Enhancements Active: Enhanced Lighting & Vibrant Colors • Zero Facial Drops
                </p>
              </div>
            </div>

            {/* Ready Social Media Post Output */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-teal-400" />
                  <span>Today's Auto-Generated Social Media Post</span>
                </h4>

                <button
                  onClick={handleCopyCaption}
                  className="text-xs text-teal-400 hover:underline font-bold flex items-center gap-1"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? 'Copied Post & Hashtags!' : 'Copy Post Text'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="text-white font-medium leading-relaxed">{activeScene.caption}</p>
                <div className="text-teal-400 font-mono text-[11px]">{activeScene.hashtags}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Creator Style Fingerprint Guardrails</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-900 text-teal-300 border border-slate-800 text-xs px-3 py-1 rounded-lg">High Energy Hooks</span>
                <span className="bg-slate-900 text-teal-300 border border-slate-800 text-xs px-3 py-1 rounded-lg">Founder Perspective</span>
                <span className="bg-slate-900 text-teal-300 border border-slate-800 text-xs px-3 py-1 rounded-lg">No Buzzwords</span>
                <span className="bg-slate-900 text-teal-300 border border-slate-800 text-xs px-3 py-1 rounded-lg">Direct Problem-Solving</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

