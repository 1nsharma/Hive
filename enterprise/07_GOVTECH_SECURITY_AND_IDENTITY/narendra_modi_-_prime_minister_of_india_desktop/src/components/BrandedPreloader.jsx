import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export default function BrandedPreloader({ onLoaded }) {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Smooth progress increment
  useEffect(() => {
    const target = Math.max(Math.floor(progress || 0), active ? 20 : 100);

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < target) {
          return prev + 3;
        }
        if (!active && prev < 100) {
          return prev + 5;
        }
        return prev;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [progress, active]);

  // Guaranteed safety auto-complete fallback within 1.2s max
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setDisplayProgress(100);
    }, 1200);

    return () => clearTimeout(safetyTimer);
  }, []);

  // When reached 100%, trigger smooth fade-out and unmount
  useEffect(() => {
    if (displayProgress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        const doneTimer = setTimeout(() => {
          setIsDone(true);
          onLoaded?.();
        }, 600);
        return () => clearTimeout(doneTimer);
      }, 250);

      return () => clearTimeout(fadeTimer);
    }
  }, [displayProgress, onLoaded]);

  if (isDone) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.min(displayProgress, 100)}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading The Years of Modi 3D Experience"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0e1a',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Tricolor Animated Core */}
      <div style={{ position: 'relative', width: '85px', height: '85px', marginBottom: '24px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(255, 153, 51, 0.2)',
            borderTopColor: '#FF9933',
            animation: 'spin 1s linear infinite'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRightColor: '#FFFFFF',
            animation: 'spin 1.5s linear infinite reverse'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            borderRadius: '50%',
            border: '2px solid rgba(19, 136, 8, 0.2)',
            borderBottomColor: '#138808',
            animation: 'spin 1.2s linear infinite'
          }}
        />
        {/* Center Percentage */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '15px',
            fontWeight: 800,
            color: '#FFD700'
          }}
        >
          {Math.min(displayProgress, 100)}%
        </div>
      </div>

      {/* Brand Title */}
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '0.02em',
          margin: '0 0 6px 0',
          textAlign: 'center'
        }}
      >
        The Years of Modi
      </h2>

      <p
        style={{
          fontSize: '12px',
          color: '#A0AEC0',
          fontFamily: "'Inter', sans-serif",
          margin: '0 0 18px 0',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        {displayProgress < 45
          ? 'Loading 3D Geometry & Assets...'
          : displayProgress < 85
          ? 'Synthesizing Atmosphere & Shaders...'
          : 'Ready'}
      </p>

      {/* Slim Progress Bar */}
      <div
        style={{
          width: '220px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${Math.min(displayProgress, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF9933, #FFD700, #138808)',
            boxShadow: '0 0 10px #FF9933',
            transition: 'width 0.1s ease-out'
          }}
        />
      </div>
    </div>
  );
}
