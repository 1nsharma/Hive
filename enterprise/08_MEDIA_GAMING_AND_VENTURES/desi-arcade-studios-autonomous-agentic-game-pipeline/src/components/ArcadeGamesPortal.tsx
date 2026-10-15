import React, { useState } from 'react';
import { 
  Gamepad2, 
  ExternalLink, 
  Maximize2, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Radio
} from 'lucide-react';

export const ArcadeGamesPortal: React.FC = () => {
  const [activeGameId, setActiveGameId] = useState<string>('kanche');

  const games = [
    {
      id: 'kanche',
      name: 'Kanche / Goli',
      genre: 'Marble Precision Shooter',
      icon: '🔮',
      path: '/games/kanche/index.html',
      badge: '2D Physics & WebAudio',
      desc: 'Dusty street chalk circle arena with slingshot impulse aiming, realistic glass clink audio synthesis, and ring-out scoring.'
    },
    {
      id: 'gilli_danda',
      name: 'Gilli Danda',
      genre: 'Timing Arcade Strike',
      icon: '🪵',
      path: '/games/gilli_danda/index.html',
      badge: 'Sweet-Spot Precision',
      desc: 'Flick the tapered wooden gilli in mid-air and time your danda swing at the apex for maximum mohalla distance records.'
    },
    {
      id: 'pitthu_lagori',
      name: 'Pitthu / Lagori',
      genre: '7 Stones Action & Dodge',
      icon: '🧱',
      path: '/games/pitthu_lagori/index.html',
      badge: 'Action & Dodgeball',
      desc: 'Aim rubber projectile ball to topple 7 flat stones, then sprint and dodge roll while re-stacking the tower to shout LAGORI!'
    },
    {
      id: 'rasoi_rush',
      name: 'Rasoi Rush',
      genre: 'Indian Festive Kitchen',
      icon: '🍲',
      path: '/games/rasoi_rush/index.html',
      badge: 'Cooking Sim & LiveOps',
      desc: 'Brew ginger masala chai, fry crispy onion pakoras, and steam festive modaks during high-patience customer rush hours.'
    },
    {
      id: 'gully_cricket',
      name: 'Gully Cricket Pro',
      genre: 'Super-Over Chase',
      icon: '🏏',
      path: '/games/gully_cricket/index.html',
      badge: 'Street Night Match',
      desc: 'Chase 24 runs in 1 over! Time your batting swings for 4s and 6s over the terrace while avoiding car windshield penalties.'
    },
    {
      id: 'auto_rickshaw_drift',
      name: 'Auto Rickshaw Drift',
      genre: 'Marine Drive Racer',
      icon: '🛺',
      path: '/games/auto_rickshaw_drift/index.html',
      badge: 'High-Speed NOS',
      desc: 'Weave your yellow-and-green auto rickshaw through Mumbai Marine Drive traffic, hit nitro boosts, and rack up meter fares.'
    },
    {
      id: 'chaiwala_tycoon',
      name: 'Chaiwala Tycoon',
      genre: 'Street Stall Economic Sim',
      icon: '☕',
      path: '/games/chaiwala_tycoon/index.html',
      badge: 'Idle Tycoon & Upgrades',
      desc: 'Tap the brass kettle to brew cutting chai, hire auto-brewers, add bun maska combos, and expand your street empire.'
    }
  ];

  const activeGame = games.find(g => g.id === activeGameId) || games[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Gamepad2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>DESI ARCADE // PLAYABLE HTML5 WEB SUITE</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-medium">
                  7 GAMES LIVE
                </span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Authentic Indian street and heritage games built with client-side HTML5 Canvas, Web Audio API sound synthesis, and real-time LiveOps synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/games/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Standalone Portal</span>
            </a>
            <a
              href="/downloads/desi-arcade-html5-games.zip"
              download
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Packaged ZIP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Game Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {games.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGameId(g.id)}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
              activeGameId === g.id
                ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:border-slate-700'
            }`}
          >
            <div className="text-2xl mb-1">{g.icon}</div>
            <div className="text-xs font-bold truncate">{g.name}</div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5 truncate">{g.badge}</div>
          </button>
        ))}
      </div>

      {/* Embedded Playable Iframe Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeGame.icon}</span>
            <div>
              <span className="text-sm font-bold text-white mr-2">{activeGame.name}</span>
              <span className="text-xs text-slate-400">({activeGame.genre})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">{activeGame.desc}</span>
            <a
              href={activeGame.path}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 flex items-center gap-1 border border-slate-700/80"
              title="Launch in New Fullscreen Window"
            >
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>Fullscreen</span>
            </a>
          </div>
        </div>

        {/* Embedded Game Iframe */}
        <div className="w-full aspect-[16/10] max-h-[660px] rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
          <iframe
            key={activeGame.path}
            src={activeGame.path}
            title={activeGame.name}
            className="w-full h-full border-0"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
};
