import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ScrollTimeline from './components/ScrollTimeline';
import ModelViewer from './components/ModelViewer';
import Scene from './components/Scene';
import Timeline from './components/Timeline';
import MediaPopup from './components/MediaPopup';
import SocialFeed from './components/SocialFeed';
import HeaderOverlay from './components/HeaderOverlay';
import ModeToggle from './components/ModeToggle';
import BrandedPreloader from './components/BrandedPreloader';
import { scrollSections } from './utils/scrollData';
import { timelineData } from './utils/timelineData';
import './styles/scrollTimeline.css';

export default function App() {
  const [mode, setMode] = useState('story'); // 'story' | 'explore'
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // Explore mode states
  const [activeExploreEvent, setActiveExploreEvent] = useState(timelineData[0]);
  const [showExplorePopup, setShowExplorePopup] = useState(true);
  const [isExplorePopupMinimized, setIsExplorePopupMinimized] = useState(false);
  const [isExplorePlaying, setIsExplorePlaying] = useState(false);
  const [exploreCategory, setExploreCategory] = useState('all');
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Common states
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const audioCtxRef = useRef(null);
  const filterNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Web Audio ambient drone synthesizer with dynamic velocity filter modulation
  const toggleAudio = () => {
    if (!audioEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
          masterGain.connect(ctx.destination);
          gainNodeRef.current = masterGain;

          // Main low-pass filter for harmonic warmness
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);
          filter.connect(masterGain);
          filterNodeRef.current = filter;

          // Harmonic Indian classical drone chords (D3, A3, D4)
          const freqs = [146.83, 220.00, 293.66];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = idx === 0 ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            oscGain.gain.setValueAtTime(idx === 0 ? 0.05 : 0.08, ctx.currentTime);

            osc.connect(oscGain);
            oscGain.connect(filter);
            osc.start();
          });
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        setAudioEnabled(true);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setAudioEnabled(false);
    }
  };

  // Dynamically modulate audio filter cutoff with scroll velocity
  const handleVelocityChange = (vel) => {
    setScrollVelocity(vel);
    if (audioEnabled && filterNodeRef.current && audioCtxRef.current) {
      const baseFreq = 450;
      const boost = Math.min(Math.abs(vel) * 45, 600);
      filterNodeRef.current.frequency.setTargetAtTime(
        baseFreq + boost,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  };

  // Global keyboard shortcuts (M: Mode Toggle, A: Audio, Left/Right: Milestones in Explore)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMode((prev) => (prev === 'story' ? 'explore' : 'story'));
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        toggleAudio();
      } else if (mode === 'explore') {
        const curIdx = timelineData.findIndex((i) => i.id === activeExploreEvent?.id);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIdx = (curIdx + 1) % timelineData.length;
          setActiveExploreEvent(timelineData[nextIdx]);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIdx = (curIdx - 1 + timelineData.length) % timelineData.length;
          setActiveExploreEvent(timelineData[prevIdx]);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [mode, activeExploreEvent, audioEnabled]);

  const currentScrollSection = scrollSections[activeSectionIndex] || scrollSections[0];

  const handleSelectExploreEvent = (event) => {
    setActiveExploreEvent(event);
    if (!isFocusMode) {
      setShowExplorePopup(true);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0e1a',
        overflowX: 'hidden',
        overflowY: mode === 'story' ? 'visible' : 'hidden',
        height: mode === 'story' ? 'auto' : '100vh'
      }}
    >
      {/* Branded Preloader */}
      <BrandedPreloader onLoaded={() => setIsAppLoaded(true)} />

      {/* Universal Header */}
      <HeaderOverlay
        mode={mode}
        onToggleSocial={() => setIsSocialOpen(!isSocialOpen)}
        isSocialOpen={isSocialOpen}
        audioEnabled={audioEnabled}
        onToggleAudio={toggleAudio}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
      />

      {/* Mode Switcher Pill */}
      <ModeToggle mode={mode} onToggle={setMode} />

      {/* MODE 1: STORY MODE (Scroll-Driven Cinematic Narrative) */}
      {mode === 'story' && (
        <>
          {/* Fixed 3D Background Canvas */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            <Canvas
              camera={{ position: [0, 1.8, 7.5], fov: 46 }}
              style={{ width: '100%', height: '100%' }}
              dpr={[1, 2]}
            >
              <color attach="background" args={['#0a0e1a']} />
              <fog attach="fog" args={['#0a0e1a', 20, 60]} />
              <ambientLight intensity={0.75} />
              <directionalLight position={[15, 25, 20]} intensity={1.6} color="#FFF6E8" />
              <Suspense fallback={null}>
                <ModelViewer
                  currentSectionData={currentScrollSection}
                  scrollVelocity={scrollVelocity}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Smooth Scroll Content Container */}
          <ScrollTimeline
            activeSectionIndex={activeSectionIndex}
            onSectionChange={(index) => setActiveSectionIndex(index)}
            onVelocityChange={handleVelocityChange}
          />
        </>
      )}

      {/* MODE 2: EXPLORE MODE (Interactive 3D Spline & Free Orbit) */}
      {mode === 'explore' && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Suspense fallback={null}>
            <Scene
              activeMarker={activeExploreEvent?.id}
              onMarkerClick={handleSelectExploreEvent}
              filteredIds={
                exploreCategory === 'all'
                  ? null
                  : timelineData.filter((i) => i.category === exploreCategory).map((i) => i.id)
              }
              hasPopup={showExplorePopup && !isExplorePopupMinimized && !isFocusMode}
            />
          </Suspense>

          <Timeline
            onSelectEvent={handleSelectExploreEvent}
            activeEvent={activeExploreEvent}
            isPlaying={isExplorePlaying}
            setIsPlaying={setIsExplorePlaying}
            selectedCategory={exploreCategory}
            setSelectedCategory={setExploreCategory}
          />

          {!isFocusMode && showExplorePopup && activeExploreEvent && (
            <MediaPopup
              event={activeExploreEvent}
              onClose={() => setShowExplorePopup(false)}
              isMinimized={isExplorePopupMinimized}
              setIsMinimized={setIsExplorePopupMinimized}
            />
          )}
        </div>
      )}

      {/* Universal Social Feed Drawer */}
      <SocialFeed
        isOpen={isSocialOpen}
        onClose={() => setIsSocialOpen(false)}
      />
    </div>
  );
}
