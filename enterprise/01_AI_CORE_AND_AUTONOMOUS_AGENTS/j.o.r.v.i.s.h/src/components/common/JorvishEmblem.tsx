import React from 'react';

interface JorvishEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;
  className?: string;
  isPulsing?: boolean;
  variant?: 'full' | 'minimal_j' | 'sphere';
  showGlow?: boolean;
}

export const JorvishEmblem: React.FC<JorvishEmblemProps> = ({
  size = 'md',
  className = '',
  isPulsing = false,
  variant = 'full',
  showGlow = true,
}) => {
  const sizeMap = {
    xs: 24,
    sm: 36,
    md: 48,
    lg: 72,
    xl: 120,
    hero: 220,
  };

  const dimension = typeof size === 'number' ? size : sizeMap[size];

  if (variant === 'sphere') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        {showGlow && (
          <div
            className={`absolute inset-0 rounded-full bg-[#00A8FF]/30 blur-xl transition-all duration-700 ${
              isPulsing ? 'scale-125 opacity-100' : 'scale-90 opacity-40'
            }`}
          />
        )}
        <svg
          viewBox="0 0 100 100"
          className="relative z-10 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="sphereCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#00F0FF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#00A8FF" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#005B9E" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0.95" />
            </radialGradient>
            <filter id="sphereGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Energy Shell */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="url(#sphereCoreGrad)"
            stroke="#00F0FF"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            className={isPulsing ? 'animate-spin' : ''}
            style={{ animationDuration: '18s' }}
          />

          {/* Inner Constellation Nodes */}
          <g filter="url(#sphereGlow)">
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
            <circle cx="38" cy="42" r="2.2" fill="#00F0FF" />
            <circle cx="62" cy="40" r="2.5" fill="#00F0FF" />
            <circle cx="35" cy="58" r="2" fill="#00A8FF" />
            <circle cx="65" cy="56" r="2.2" fill="#00A8FF" />
            <circle cx="48" cy="68" r="2.5" fill="#00F0FF" />
            <circle cx="52" cy="30" r="2" fill="#FFFFFF" />

            {/* Neural Synapses */}
            <line x1="50" y1="50" x2="38" y2="42" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.8" />
            <line x1="50" y1="50" x2="62" y2="40" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.8" />
            <line x1="50" y1="50" x2="35" y2="58" stroke="#00A8FF" strokeWidth="1" strokeOpacity="0.7" />
            <line x1="50" y1="50" x2="65" y2="56" stroke="#00A8FF" strokeWidth="1" strokeOpacity="0.7" />
            <line x1="50" y1="50" x2="48" y2="68" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.8" />
            <line x1="50" y1="50" x2="52" y2="30" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.9" />
            <line x1="38" y1="42" x2="52" y2="30" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="62" y1="40" x2="52" y2="30" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="35" y1="58" x2="48" y2="68" stroke="#00A8FF" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="65" y1="56" x2="48" y2="68" stroke="#00A8FF" strokeWidth="0.8" strokeOpacity="0.6" />
          </g>

          {/* Luminous Core Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="40"
            ry="18"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1.2"
            strokeOpacity="0.7"
            transform="rotate(-25 50 50)"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'minimal_j') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        {showGlow && (
          <div
            className={`absolute inset-0 rounded-2xl bg-[#00A8FF]/20 blur-lg transition-all duration-500 ${
              isPulsing ? 'scale-115 opacity-80' : 'scale-95 opacity-30'
            }`}
          />
        )}
        <svg
          viewBox="0 0 100 100"
          className="relative z-10 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="titaniumMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="65%" stopColor="#C0C5CE" />
              <stop offset="90%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="electricBlueNeon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#00A8FF" />
              <stop offset="100%" stopColor="#0066CC" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Titanium Beveled Frame */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="20"
            fill="#0F1422"
            stroke="url(#titaniumMetalGrad)"
            strokeWidth="2.5"
          />

          {/* Chiseled Titanium "J" Monogram */}
          <path
            d="M 52 24 L 68 24 L 68 62 C 68 74 58 80 44 80 C 30 80 24 71 24 62 L 36 62 C 36 67 40 70 44 70 C 50 70 54 66 54 60 L 54 24 Z"
            fill="url(#titaniumMetalGrad)"
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />

          {/* Inner Electric Blue Neon Conduit */}
          <path
            d="M 61 28 L 61 62 C 61 70 54 75 44 75 C 38 75 32 72 30 67"
            stroke="url(#electricBlueNeon)"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#neonGlow)"
          />
        </svg>
      </div>
    );
  }

  // Full Official JORVISH Emblem (matching user's uploaded logo)
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {/* Background Radial Glow */}
      {showGlow && (
        <div
          className={`absolute inset-0 rounded-full bg-[#00A8FF]/25 blur-xl transition-all duration-700 pointer-events-none ${
            isPulsing ? 'scale-125 opacity-90' : 'scale-90 opacity-30'
          }`}
        />
      )}

      <svg
        viewBox="0 0 200 200"
        className="relative z-10 w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Titanium Silver Bevel Gradient */}
          <linearGradient id="titaniumOuterRing" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#E6EAF0" />
            <stop offset="50%" stopColor="#C0C5CE" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="90%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="titaniumInnerJ" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#DDE2EC" />
            <stop offset="65%" stopColor="#B0B7C6" />
            <stop offset="100%" stopColor="#7E8799" />
          </linearGradient>

          {/* Glowing Electric Blue Sphere */}
          <radialGradient id="energyCoreSphere" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#00F0FF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#00A8FF" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#0066CC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0.95" />
          </radialGradient>

          {/* Electric Blue Circuit Line Gradient */}
          <linearGradient id="circuitBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#00A8FF" />
          </linearGradient>

          {/* Filters for glowing neon */}
          <filter id="coreGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Titanium Circular Ring Arc */}
        <path
          d="M 100 16 C 146.4 16 184 53.6 184 100 C 184 146.4 146.4 184 100 184 C 53.6 184 16 146.4 16 100 C 16 53.6 53.6 16 100 16 Z"
          fill="none"
          stroke="url(#titaniumOuterRing)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Inner Shadow / Bevel Accent */}
        <circle
          cx="100"
          cy="100"
          r="86"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r="77"
          stroke="#1E293B"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          fill="none"
        />

        {/* Cybernetic Circuit Traces on Rim */}
        <g stroke="url(#circuitBlue)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
          <path d="M 134 38 L 134 115" />
          <path d="M 140 48 L 140 105" strokeWidth="1" />
          <circle cx="134" cy="40" r="2" fill="#00F0FF" />
          <circle cx="140" cy="50" r="1.5" fill="#00A8FF" />

          {/* Bottom Left Traces leading to Sphere */}
          <path d="M 52 145 L 80 158 L 96 158" />
          <path d="M 40 132 L 68 148 L 88 148" strokeWidth="1" />
          <circle cx="52" cy="145" r="1.8" fill="#00F0FF" />
          <circle cx="40" cy="132" r="1.5" fill="#00A8FF" />
        </g>

        {/* Chiseled Titanium "J" Shape */}
        <path
          d="M 98 32 C 122 32 128 42 128 58 L 128 120 C 128 136 118 146 102 146 C 88 146 82 136 82 124 L 98 124 C 98 129 100 132 102 132 C 108 132 112 128 112 118 L 112 56 C 112 48 108 46 98 46 C 68 46 44 70 44 100 C 44 116 52 130 64 140 L 52 148 C 36 134 26 116 26 96 C 26 56 58 32 98 32 Z"
          fill="url(#titaniumInnerJ)"
          stroke="#FFFFFF"
          strokeWidth="1"
        />

        {/* Electric Blue Inner Vertical Conduit inside the J's stem */}
        <path
          d="M 120 48 L 120 118"
          stroke="url(#circuitBlue)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#coreGlowFilter)"
        />

        {/* The Luminous Energy Core Sphere at the bottom curve */}
        <g filter="url(#coreGlowFilter)" className={isPulsing ? 'animate-pulse' : ''}>
          {/* Base Glowing Sphere */}
          <circle
            cx="110"
            cy="142"
            r="26"
            fill="url(#energyCoreSphere)"
            stroke="#00F0FF"
            strokeWidth="1.5"
          />

          {/* Constellation Nodes inside the Sphere */}
          <circle cx="110" cy="142" r="2.8" fill="#FFFFFF" />
          <circle cx="100" cy="136" r="2" fill="#00F0FF" />
          <circle cx="120" cy="134" r="2.2" fill="#00F0FF" />
          <circle cx="98" cy="148" r="1.8" fill="#FFFFFF" />
          <circle cx="122" cy="148" r="2" fill="#00A8FF" />
          <circle cx="108" cy="156" r="2" fill="#00F0FF" />
          <circle cx="112" cy="128" r="1.8" fill="#FFFFFF" />

          {/* Interconnecting Neural Lines */}
          <line x1="110" y1="142" x2="100" y2="136" stroke="#FFFFFF" strokeWidth="0.9" strokeOpacity="0.9" />
          <line x1="110" y1="142" x2="120" y2="134" stroke="#00F0FF" strokeWidth="0.9" strokeOpacity="0.8" />
          <line x1="110" y1="142" x2="98" y2="148" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.8" />
          <line x1="110" y1="142" x2="122" y2="148" stroke="#00A8FF" strokeWidth="0.9" strokeOpacity="0.8" />
          <line x1="110" y1="142" x2="108" y2="156" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.7" />
          <line x1="110" y1="142" x2="112" y2="128" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.9" />
          <line x1="100" y1="136" x2="112" y2="128" stroke="#00F0FF" strokeWidth="0.7" strokeOpacity="0.6" />
          <line x1="120" y1="134" x2="112" y2="128" stroke="#00F0FF" strokeWidth="0.7" strokeOpacity="0.6" />
          <line x1="98" y1="148" x2="108" y2="156" stroke="#00A8FF" strokeWidth="0.7" strokeOpacity="0.6" />
          <line x1="122" y1="148" x2="108" y2="156" stroke="#00A8FF" strokeWidth="0.7" strokeOpacity="0.6" />

          {/* Orbital Latitudinal Ring */}
          <ellipse
            cx="110"
            cy="142"
            rx="24"
            ry="11"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1"
            strokeOpacity="0.75"
            transform="rotate(-20 110 142)"
          />
        </g>
      </svg>
    </div>
  );
};
