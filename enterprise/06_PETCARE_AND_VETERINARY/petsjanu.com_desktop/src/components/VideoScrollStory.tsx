import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import { ShieldCheck, QrCode, Radar, Heart, Info, Sparkles } from 'lucide-react';

interface VideoScrollStoryProps {
  videoUrl?: string;
}

export default function VideoScrollStory({ videoUrl = "/assets/petjanu-story.mp4" }: VideoScrollStoryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [useCanvasFallback, setUseCanvasFallback] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 🚀 60 FPS Spring Physics for buttery smooth video scrubbing
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    mass: 0.5 
  });

  // Draw Canvas Fallback Engine (60 FPS Procedural Renderer with Buddy Golden Glow)
  const drawCanvasFallback = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Scene 1: Meet Buddy Golden Warmth (0.0 - 0.25)
    if (progress < 0.25) {
      const p = progress / 0.25;
      ctx.fillStyle = `#0A1C16`;
      ctx.fillRect(0, 0, width, height);
      
      const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.5);
      grad.addColorStop(0, `rgba(245, 158, 11, ${0.4 + p * 0.2})`); // Golden Amber
      grad.addColorStop(1, 'rgba(10, 28, 22, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
    // Scene 2: Dark Emergency Alert (0.25 - 0.50)
    else if (progress < 0.50) {
      const p = (progress - 0.25) / 0.25;
      ctx.fillStyle = `rgba(15, 20, 18, ${0.8 + p * 0.2})`;
      ctx.fillRect(0, 0, width, height);
      
      const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      grad.addColorStop(0, `rgba(239, 68, 68, ${0.35 * (1 - p)})`); // Red Emergency Glow
      grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } 
    // Scene 3: Expanding Cyan & Emerald SOS Radar (0.50 - 0.75)
    else if (progress < 0.75) {
      const p = (progress - 0.50) / 0.25;
      ctx.fillStyle = '#06120D';
      ctx.fillRect(0, 0, width, height);
      
      const radius = p * (Math.min(width, height) * 0.7);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#06b6d4'; // Intelligent Cyan
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = '#10b981'; // Emerald Safety
      ctx.lineWidth = 2;
      ctx.stroke();
    } 
    // Scene 4: Reunited & Safe Amber Warmth (0.75 - 1.0)
    else {
      const p = (progress - 0.75) / 0.25;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.6);
      gradient.addColorStop(0, `rgba(16, 185, 129, ${p * 0.4})`); // Emerald Safe Reunited Glow
      gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  };

  // Sync motion value to video timeline or canvas
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!useCanvasFallback && videoRef.current && videoLoaded) {
      const duration = videoRef.current.duration;
      if (!isNaN(duration) && duration > 0) {
        videoRef.current.currentTime = duration * latest;
      }
    } else {
      drawCanvasFallback(latest);
    }
  });

  // Opacity transitions for 4 story beats
  const beat1Opacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const beat2Opacity = useTransform(smoothProgress, [0.25, 0.38, 0.50], [0, 1, 0]);
  const beat3Opacity = useTransform(smoothProgress, [0.50, 0.63, 0.75], [0, 1, 0]);
  const beat4Opacity = useTransform(smoothProgress, [0.75, 0.88, 1.0], [0, 1, 1]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#050505]"
      style={{ height: "450vh" }} 
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#0A2C21] to-[#050505]">
        
        {/* Dual-Engine: HTML5 Video Scrubbing */}
        {!useCanvasFallback && (
          <video
            ref={videoRef}
            src={videoUrl}
            poster="/assets/story-poster.jpg" 
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => setVideoLoaded(true)}
            onError={() => {
              console.warn('HTML5 Video player restricted or unavailable, switching to 60 FPS Canvas fallback engine');
              setUseCanvasFallback(true);
            }}
            className="w-full h-full object-cover absolute inset-0 z-0 opacity-90 video-container"
          />
        )}

        {/* Dual-Engine: HTML5 Canvas Fallback Renderer */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className={`absolute inset-0 w-full h-full object-cover z-0 ${useCanvasFallback ? 'block' : 'hidden'}`}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#175741]/20 via-transparent to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10 pointer-events-none" />

        {/* Top Info Banner - Who is Buddy? */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-stone-900/90 backdrop-blur-md rounded-full border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-xl max-w-xl text-center">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Meet Buddy 🐕:</strong> PetJanu ka official Demo Ambassador Pet (Golden Retriever)</span>
        </div>

        {/* Text Overlays - 4 Story Beats */}
        <div className="relative z-20 text-center px-4 max-w-5xl w-full h-full flex items-center justify-center">
          
          {/* BEAT 1: MEET BUDDY */}
          <motion.div style={{ opacity: beat1Opacity }} className="absolute flex flex-col items-center gpu-accelerated max-w-2xl">
            <div className="relative mb-4">
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400" 
                alt="Buddy Golden Retriever" 
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-amber-400 shadow-2xl shadow-amber-500/30"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> DEMO PET
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
              Miliye <span className="text-amber-400 glow-amber-text">Buddy</span> se! 🐶
            </h2>
            <p className="text-lg md:text-xl text-amber-200/90 font-medium mb-3">
              3-Year-Old Golden Retriever · PetJanu Official Demo Ambassador
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-700 text-xs text-stone-300">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Smart QR Tag Code: <strong className="text-white">PG-BUDDY-8821</strong></span>
            </div>
          </motion.div>

          {/* BEAT 2: JAB BUDDY KHO JAAYE */}
          <motion.div style={{ opacity: beat2Opacity }} className="absolute flex flex-col items-center gpu-accelerated max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
              Jab wo rasta bhatak jayein...
            </h2>
            <p className="text-xl md:text-2xl text-red-400 font-bold glow-red-text mb-2">
              Har second keemti hai.
            </p>
            <p className="text-sm md:text-base text-stone-300">
              PetJanu Smart Collar Tag continuously scanning status ready rakhta hai.
            </p>
          </motion.div>

          {/* BEAT 3: INSTANT SOS & RADAR SCAN */}
          <motion.div style={{ opacity: beat3Opacity }} className="absolute flex flex-col items-center gpu-accelerated max-w-2xl">
            <div className="p-3 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 mb-3 animate-pulse">
              <Radar className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
              PetJanu <span className="text-cyan-400 glow-cyan-text">SOS Radar</span> Active!
            </h2>
            <p className="text-lg md:text-xl text-cyan-100 font-medium mb-2">
              Jab koi Buddy ke QR Code ko phone se scan karta hai:
            </p>
            <ul className="text-xs md:text-sm text-stone-300 space-y-1 bg-stone-950/70 p-3 rounded-xl border border-stone-800 text-left">
              <li className="flex items-center gap-2">📍 Live GPS Location instant owner (Amit) ko mil jati hai.</li>
              <li className="flex items-center gap-2">📱 Instant WhatsApp & SMS Notification send ho jata hai.</li>
            </ul>
          </motion.div>

          {/* BEAT 4: SAFE REUNITION & DEMO EXPLANATION */}
          <motion.div style={{ opacity: beat4Opacity }} className="absolute flex flex-col items-center gpu-accelerated max-w-2xl">
            <div className="p-3 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-400 mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
              Buddy Surakshit <span className="text-emerald-400 glow-emerald-text">Ghar Wapas</span>!
            </h2>
            <p className="text-lg md:text-xl text-emerald-200 font-semibold mb-4">
              Suraksha. Hamesha.
            </p>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs md:text-sm text-center max-w-lg space-y-1">
              <div className="font-extrabold flex items-center justify-center gap-1 text-amber-300">
                <Heart className="w-4 h-4 fill-amber-400 text-amber-400" /> Aap bhi apne pet ke liye Buddy jaisa Smart Profile banayein!
              </div>
              <p className="text-stone-300 text-[12px]">
                Dashboard par <strong>Buddy</strong> default demo profile hai jisse aap PetJanu ke sabhi features try kar sakte hain.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Floating Skip & Explore Pill */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              const target = document.getElementById('main-landing-content');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: window.innerHeight * 4.6, behavior: 'smooth' });
              }
            }}
            className="px-5 py-2.5 rounded-full bg-stone-950/90 hover:bg-amber-400 text-stone-200 hover:text-stone-950 font-black text-xs flex items-center gap-2 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-2xl backdrop-blur-md hover:scale-105"
          >
            <span>Explore PetJanu Platform</span>
            <span className="text-amber-400 hover:text-stone-950 font-black">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}

