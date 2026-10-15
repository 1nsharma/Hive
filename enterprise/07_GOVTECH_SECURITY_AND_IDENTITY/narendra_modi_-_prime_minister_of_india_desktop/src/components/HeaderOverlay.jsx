import React, { useState } from 'react';
import {
  Globe,
  Volume2,
  VolumeX,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

export default function HeaderOverlay({
  mode = 'story',
  onToggleSocial,
  isSocialOpen,
  audioEnabled,
  onToggleAudio,
  isFocusMode,
  onToggleFocusMode
}) {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 70,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(8, 10, 15, 0.9) 0%, transparent 100%)'
        }}
      >
        {/* Left Branding */}
        <div
          className="glass-panel"
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            pointerEvents: 'auto',
            border: '1px solid rgba(255, 153, 51, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Tricolor Indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px', width: '4px', height: '32px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#FF9933' }} />
            <div style={{ flex: 1, background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: '#138808' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '17px',
                  fontWeight: 800,
                  margin: 0,
                  color: '#ffffff'
                }}
              >
                The Years of Modi
              </h1>
              <span
                style={{
                  background: mode === 'story' ? 'rgba(230, 126, 34, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                  color: mode === 'story' ? '#E67E22' : '#2ECC71',
                  padding: '2px 7px',
                  borderRadius: '8px',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  border: mode === 'story' ? '1px solid rgba(230, 126, 34, 0.4)' : '1px solid rgba(46, 204, 113, 0.4)',
                  textTransform: 'uppercase'
                }}
              >
                {mode === 'story' ? 'Story Mode' : '3D Explore'}
              </span>
            </div>
            <p style={{ margin: '1px 0 0 0', fontSize: '10.5px', color: '#A0AEC0' }}>
              {mode === 'story' ? 'Scroll down to journey through time' : 'Free 3D orbit & spline walking'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto'
          }}
        >
          {/* In Explore Mode: Focus Model Toggle */}
          {mode === 'explore' && onToggleFocusMode && (
            <button
              onClick={onToggleFocusMode}
              className="btn-secondary"
              style={{
                background: isFocusMode ? 'rgba(255, 153, 51, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                borderColor: isFocusMode ? '#FF9933' : 'rgba(255, 255, 255, 0.15)',
                color: isFocusMode ? '#FF9933' : '#ffffff'
              }}
              title={isFocusMode ? 'Exit Unobstructed Model View' : 'Focus 3D Model'}
            >
              {isFocusMode ? <EyeOff size={14} /> : <Eye size={14} />}
              <span style={{ fontSize: '11.5px' }}>{isFocusMode ? 'Show Info' : 'Focus Model'}</span>
            </button>
          )}

          {/* Social Pulse Drawer Toggle */}
          <button
            onClick={onToggleSocial}
            className="btn-secondary"
            style={{
              background: isSocialOpen ? 'rgba(0, 191, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              borderColor: isSocialOpen ? '#00BFFF' : 'rgba(255, 255, 255, 0.15)',
              color: isSocialOpen ? '#00BFFF' : '#ffffff'
            }}
            title="Digital Footprint Social Reach"
          >
            <Globe size={14} />
            <span style={{ fontSize: '11.5px' }}>Social Pulse</span>
          </button>

          {/* Ambient Sound Toggle */}
          <button
            onClick={onToggleAudio}
            className="btn-secondary"
            style={{
              background: audioEnabled ? 'rgba(255, 153, 51, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              borderColor: audioEnabled ? '#FF9933' : 'rgba(255, 255, 255, 0.15)',
              color: audioEnabled ? '#FF9933' : '#CBD5E0'
            }}
            title="Ambient Music Synth (Web Audio API)"
          >
            {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span style={{ fontSize: '11.5px' }}>{audioEnabled ? 'Sound ON' : 'Mute'}</span>
          </button>

          {/* Info Modal */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="btn-secondary"
            style={{ padding: '8px 10px' }}
            title="Project Information & Credits"
          >
            <Info size={14} />
          </button>
        </div>
      </header>

      {/* About & Attribution Modal */}
      {showAboutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="glass-panel animate-fade-in"
            style={{
              width: '480px',
              maxWidth: '90vw',
              padding: '26px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 153, 51, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', color: '#FF9933', marginBottom: '8px' }}>
              The Years of Modi — Hybrid Cinematic Experience
            </h2>
            <p style={{ fontSize: '13px', color: '#CBD5E0', lineHeight: '1.6', marginBottom: '14px' }}>
              An award-winning hybrid narrative combining scroll-triggered cinematic storytelling with interactive 3D WebGL exploration, tracing the life and legacy of Prime Minister Narendra Modi.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', fontSize: '11.5px', color: '#A0AEC0', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>3D Model Attribution</div>
              <div>
                Based on <em>"Narendra Modi - Prime Minister of INDIA"</em> by <strong>bhagathartworks</strong> on Sketchfab, licensed under CC-BY-4.0.
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
