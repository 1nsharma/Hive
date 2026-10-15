import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Play, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Layers, 
  Zap, 
  Compass, 
  ArrowRight, 
  Flame, 
  Trophy, 
  Dice5, 
  ShieldCheck, 
  Gamepad2, 
  Radio, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { HeritageGame, GamingTrend } from '../types';
import { HERITAGE_GAMES_CATALOG } from '../data/initialData';

interface HeritageGamesCatalogProps {
  onSelectGameForSynthesis: (game: HeritageGame) => void;
}

export const HeritageGamesCatalog: React.FC<HeritageGamesCatalogProps> = ({
  onSelectGameForSynthesis
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedGameId, setSelectedGameId] = useState<string>(HERITAGE_GAMES_CATALOG[0].id);

  // Mini Interactive Canvas Playtest State for Selected Game
  const [interactiveScore, setInteractiveScore] = useState<number>(0);
  const [interactiveStreak, setInteractiveStreak] = useState<number>(1);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Demographics', count: HERITAGE_GAMES_CATALOG.length },
    { id: 'Kids & Teens', label: 'Kids (Bachon ke Liye)', count: 3 },
    { id: 'Ladies / Family', label: 'Ladies & Homemakers', count: 3 },
    { id: 'Teens & Young Adults', label: 'Teens & Competitive Men', count: 4 },
  ];

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'North', label: 'North India' },
    { id: 'South', label: 'South India' },
    { id: 'West & Central', label: 'West & Central' },
  ];

  const filteredGames = HERITAGE_GAMES_CATALOG.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.demographic.includes(selectedCategory);
    const matchesRegion = selectedRegion === 'all' || game.region === selectedRegion;
    return matchesCategory && matchesRegion;
  });

  const selectedGame = HERITAGE_GAMES_CATALOG.find(g => g.id === selectedGameId) || HERITAGE_GAMES_CATALOG[0];

  // Interactive Mini Game Trigger
  const handleSimulateGameAction = (actionName: string) => {
    const points = Math.floor(Math.random() * 80) + 40;
    setInteractiveScore(prev => prev + points * interactiveStreak);
    setInteractiveStreak(prev => Math.min(prev + 1, 8));
    setActiveFeedback(`🎯 ${actionName}! +${points * interactiveStreak} PTS (x${interactiveStreak} Combo)`);
    setTimeout(() => setActiveFeedback(null), 2500);
  };

  const handleResetSimulator = () => {
    setInteractiveScore(0);
    setInteractiveStreak(1);
    setActiveFeedback('Simulator reset.');
    setTimeout(() => setActiveFeedback(null), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-orange-950/30 border border-amber-900/40 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Compass className="w-4 h-4" />
              <span>Desi Heritage & Indigenous Gaming Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Traditional Indian Games Modernized for PC & Mobile</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                Godot 4 Ready
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Transform timeless Indian street games, rural folk sports, and ancient strategy board games into high-retention modern PC & casual arcade experiences tailored for diverse demographics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectGameForSynthesis(selectedGame)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-orange-500/20"
            >
              <Cpu className="w-4 h-4" />
              <span>Synthesize GDScript for {selectedGame.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-800/80">
          
          {/* Demographic Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedCategory === cat.id ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Region:</span>
            </span>
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Games Catalog Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Heritage Game Prototypes ({filteredGames.length})
            </span>
            <span className="text-xs font-mono text-amber-400">
              High Cultural Alignment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredGames.map(game => {
              const isSelected = selectedGame.id === game.id;

              return (
                <div
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                        {game.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                          <span>{game.name}</span>
                        </h4>
                        <span className="text-xs font-serif text-amber-300/80 font-medium">
                          {game.nativeName}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      {game.trendingScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {game.mechanicSummary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-sky-400" />
                      <span>{game.demographic}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{game.region}</span>
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/20 rounded-bl-xl border-l border-b border-amber-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Dive Inspection & Quick Playtest Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            
            {/* Header with Native Script */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedGame.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedGame.name}</h3>
                    <span className="text-xs font-serif text-amber-300 font-bold">{selectedGame.nativeName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Genre Format</span>
                <span className="text-xs font-mono text-sky-400 font-bold">{selectedGame.genre}</span>
              </div>
            </div>

            {/* Cultural Lore & Heritage Context */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Geographic Lore & States: {selectedGame.state}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedGame.culturalLore}
              </p>
            </div>

            {/* Recommended Godot 4 Node Architecture */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1 font-sans">
                <Layers className="w-3 h-3 text-orange-400" />
                <span>Godot 4.3 Node Tree Blueprint:</span>
              </span>
              <div className="text-[11px] text-orange-200 bg-orange-950/30 p-2 rounded border border-orange-500/20">
                <code>{selectedGame.suggestedGodotNode}</code>
              </div>
            </div>

            {/* Interactive Physics & Mechanic Sandbox */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Mechanic Sandbox</span>
                </span>
                <button
                  onClick={handleResetSimulator}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer font-mono"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Dynamic Interactive Simulator Controls per Game */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Score: <strong className="text-emerald-400">{interactiveScore}</strong></span>
                  <span className="text-slate-400">Combo Multiplier: <strong className="text-amber-400">{interactiveStreak}x</strong></span>
                </div>

                {activeFeedback && (
                  <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in font-mono">
                    {activeFeedback}
                  </div>
                )}

                {/* Game specific interactive buttons */}
                {selectedGame.id === 'kanche' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSimulateGameAction('Middle-Finger Flick Impulse')}
                      className="p-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🎯 Glass Ring Flick
                    </button>
                    <button
                      onClick={() => handleSimulateGameAction('Ring-Out Precision Strike')}
                      className="p-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      💥 Target Ring-Out Knock
                    </button>
                  </div>
                )}

                {selectedGame.id === 'gilli_danda' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSimulateGameAction('Gilli Flip in Air')}
                      className="p-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🪵 Stage 1: Tap Flip
                    </button>
                    <button
                      onClick={() => handleSimulateGameAction('Perfect Power Hit (180m)')}
                      className="p-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🚀 Stage 2: Power Swing
                    </button>
                  </div>
                )}

                {selectedGame.id === 'rasoi_rush' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSimulateGameAction('Crispy Butter Masala Dosa')}
                      className="p-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🥞 Serve Masala Dosa
                    </button>
                    <button
                      onClick={() => handleSimulateGameAction('Brew Adrak Elaichi Chai')}
                      className="p-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      ☕ Brew Kulhad Chai
                    </button>
                  </div>
                )}

                {selectedGame.id === 'pitthu_lagori' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSimulateGameAction('7-Stone Tower Knockdown')}
                      className="p-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🎾 Tennis Ball Knockdown
                    </button>
                    <button
                      onClick={() => handleSimulateGameAction('Tower Rebuilt & Lagori Shouted!')}
                      className="p-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🧱 Rebuild 7 Stones
                    </button>
                  </div>
                )}

                {/* Default action button for others */}
                {!['kanche', 'gilli_danda', 'rasoi_rush', 'pitthu_lagori'].includes(selectedGame.id) && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSimulateGameAction('Primary Move Triggered')}
                      className="p-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      🎮 Action Move 1
                    </button>
                    <button
                      onClick={() => handleSimulateGameAction('Special Ability Executed')}
                      className="p-2.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
                    >
                      ⚡ Special Ability
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Synthesize CTA */}
            <button
              onClick={() => onSelectGameForSynthesis(selectedGame)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize GDScript & Push PR for {selectedGame.name}</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
