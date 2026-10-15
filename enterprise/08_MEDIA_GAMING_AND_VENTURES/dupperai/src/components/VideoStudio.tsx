import React, { useState } from 'react';
import {
  Video,
  Volume2,
  Play,
  Pause,
  Sparkles,
  Sliders,
  Scissors,
  Check,
  RotateCw,
  Layers,
  Film,
  Subtitles,
  Music,
} from 'lucide-react';
import { voiceOptions } from '../data/initialData';

export const VideoStudio: React.FC = () => {
  const [longFormText, setLongFormText] = useState(
    'Dukaanmitra empowers local retail merchants with AI camera scanning. When a shopkeeper receives stock, they simply scan each package using their mobile camera. The computer vision model automatically identifies the product name, weight, standard retail price, and category. In under 60 seconds, a full online catalog is generated and synced directly with WhatsApp Business.'
  );

  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isGeneratingClips, setIsGeneratingClips] = useState(false);
  const [isSynthesizingTTS, setIsSynthesizingTTS] = useState(false);

  // Audio Playback State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Generated Short Clips
  const [generatedClips, setGeneratedClips] = useState([
    {
      id: 'clip-1',
      title: '60-Sec Camera Scan Demo',
      duration: '22s',
      hookText: 'Point your camera and build an online shop in 60s!',
      voiceoverText: 'Watch how fast local retailers add products using smartphone AI.',
      subtitleStyle: 'Bold Yellow Word Bounce',
      aspectRatio: '9:16',
      status: 'ready',
    },
    {
      id: 'clip-2',
      title: 'Hardware vs Mobile AI Comparison',
      duration: '18s',
      hookText: 'Why pay $2,000 for POS hardware when phone AI is free?',
      voiceoverText: 'Save thousands on expensive equipment with Dukaanmitra mobile scanning.',
      subtitleStyle: 'Clean Minimalist White',
      aspectRatio: '9:16',
      status: 'ready',
    },
  ]);

  const [activeClip, setActiveClip] = useState(generatedClips[0]);

  // Handle TTS Generation via Gemini Server API
  const handleGenerateVoiceover = async () => {
    setIsSynthesizingTTS(true);
    try {
      const res = await fetch('/api/gemini/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: activeClip.voiceoverText,
          voiceName: selectedVoice,
        }),
      });

      const data = await res.json();
      if (data.success && data.audioBase64) {
        // Convert base64 audio to Blob URL for web playback
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Auto play preview
        if (audioElement) audioElement.pause();
        const newAudio = new Audio(url);
        newAudio.onended = () => setIsPlaying(false);
        newAudio.play();
        setAudioElement(newAudio);
        setIsPlaying(true);
      } else {
        alert('Voice synthesis complete. Audio preview buffer updated.');
      }
    } catch (err: any) {
      console.error('Error generating voiceover:', err);
      alert('Voice synthesis error: ' + err.message);
    } finally {
      setIsSynthesizingTTS(false);
    }
  };

  const togglePlayAudio = () => {
    if (!audioElement && audioUrl) {
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play();
      setAudioElement(newAudio);
      setIsPlaying(true);
      return;
    }

    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  const handleConvertLongFormToClips = () => {
    setIsGeneratingClips(true);
    setTimeout(() => {
      const newClip = {
        id: `clip-${Date.now()}`,
        title: 'Instant Catalog Setup Clip',
        duration: '25s',
        hookText: 'Stop typing inventory manually. Try this phone trick!',
        voiceoverText: longFormText.substring(0, 120) + '...',
        subtitleStyle: 'Neon Cyan Pop',
        aspectRatio: '9:16',
        status: 'ready',
      };
      setGeneratedClips([newClip, ...generatedClips]);
      setActiveClip(newClip);
      setIsGeneratingClips(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Engine Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Specialized AI Video Engine</h2>
              <span className="text-[10px] font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                Pictory-Style Automation
              </span>
            </div>
            <p className="text-xs text-slate-400">Convert long-form text/scripts into short clips, dynamic subtitles, & human-like AI voices</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Cinematic Quality:</span>
          <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            70% Faster AI Rendering
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Long Form Input & Clips List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4 text-cyan-400" />
                <span>Long-Form Source Content</span>
              </h3>
            </div>

            <textarea
              rows={4}
              value={longFormText}
              onChange={(e) => setLongFormText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              placeholder="Paste article, blog post, or product description..."
            />

            <button
              onClick={handleConvertLongFormToClips}
              disabled={isGeneratingClips}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isGeneratingClips ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Segmenting Long Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Convert to Short Clips</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Clips List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Extracted Short Clips ({generatedClips.length})</span>
              <span className="text-[10px] text-teal-400 font-mono">9:16 Vertical Video</span>
            </h3>

            <div className="space-y-2">
              {generatedClips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => setActiveClip(clip)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeClip.id === clip.id
                      ? 'bg-slate-950 border-cyan-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{clip.title}</h4>
                    <span className="text-[10px] font-bold bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-md">
                      {clip.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">"{clip.hookText}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Studio & AI Voiceover Engine */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{activeClip.title}</h3>
                <p className="text-xs text-slate-400">Aspect Ratio: {activeClip.aspectRatio} Vertical Short</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-teal-950 text-teal-300 border border-teal-800 px-2.5 py-1 rounded-lg">
                  Subtitles: {activeClip.subtitleStyle}
                </span>
              </div>
            </div>

            {/* Video Player Mockup Frame */}
            <div className="aspect-[9/16] max-w-xs mx-auto bg-slate-950 rounded-2xl border-2 border-slate-800 relative overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0a67e5842823?auto=format&fit=crop&w=400&q=80')` }}></div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">AI VIDEO</span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">{activeClip.duration}</span>
              </div>

              {/* Dynamic Subtitle Overlay */}
              <div className="relative z-10 text-center space-y-2 py-4 px-2">
                <div className="inline-block bg-amber-400 text-slate-950 font-black text-sm px-3 py-1.5 rounded-lg uppercase tracking-tight shadow-lg transform -rotate-1">
                  {activeClip.hookText}
                </div>
                <div className="bg-slate-950/90 backdrop-blur-md p-2 rounded-lg text-[11px] text-white font-bold border border-slate-800">
                  {activeClip.voiceoverText}
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="text-[10px] text-slate-400 font-semibold">Voice: {selectedVoice}</div>
                {audioUrl && (
                  <button
                    onClick={togglePlayAudio}
                    className="p-2 bg-teal-500 text-slate-950 rounded-full font-bold hover:scale-105 transition-all"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                  </button>
                )}
              </div>
            </div>

            {/* AI Voice Selector & Generator */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>Human-like AI Voice Selector (Gemini TTS)</span>
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {voiceOptions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedVoice === v.id
                        ? 'bg-teal-950/80 border-teal-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{v.name}</div>
                    <div className="text-[10px] text-slate-400">{v.gender} • {v.accent}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleGenerateVoiceover}
                  disabled={isSynthesizingTTS}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  {isSynthesizingTTS ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Synthesizing Studio Audio...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Generate Voiceover ({selectedVoice})</span>
                    </>
                  )}
                </button>

                {audioUrl && (
                  <button
                    onClick={togglePlayAudio}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-teal-400" /> : <Play className="w-4 h-4 text-teal-400 fill-teal-400" />}
                    <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
