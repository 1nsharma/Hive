import React from 'react';
import { Film, Compass } from 'lucide-react';

export default function ModeToggle({ mode, onToggle }) {
  return (
    <div
      className="mode-toggle-container"
      role="toolbar"
      aria-label="Experience Mode Switcher"
    >
      <div className="mode-toggle-pill">
        <button
          onClick={() => onToggle('story')}
          className={`mode-toggle-btn ${mode === 'story' ? 'active' : ''}`}
          role="tab"
          aria-selected={mode === 'story'}
          aria-label="Story Mode: Scroll-driven cinematic narrative (Press M to toggle)"
          title="Story Mode (Scroll-Driven Narrative) - Press M"
        >
          <Film size={14} />
          <span>Story Mode</span>
        </button>

        <button
          onClick={() => onToggle('explore')}
          className={`mode-toggle-btn ${mode === 'explore' ? 'active' : ''}`}
          role="tab"
          aria-selected={mode === 'explore'}
          aria-label="Explore Mode: Interactive 3D spline and orbit controls (Press M to toggle)"
          title="3D Explore Mode (Free Orbit Controls) - Press M"
        >
          <Compass size={14} />
          <span>3D Explore Mode</span>
        </button>
      </div>
    </div>
  );
}
