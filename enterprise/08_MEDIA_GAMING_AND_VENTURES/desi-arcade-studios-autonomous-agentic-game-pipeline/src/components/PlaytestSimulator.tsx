import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Flame, 
  Utensils, 
  Trophy, 
  Activity, 
  Radio,
  Target,
  Layers,
  Award
} from 'lucide-react';
import { LiveOpsConfig } from '../types';

interface PlaytestSimulatorProps {
  liveOpsConfig: LiveOpsConfig;
}

export const PlaytestSimulator: React.FC<PlaytestSimulatorProps> = ({ liveOpsConfig }) => {
  const [activeGame, setActiveGame] = useState<'kanche' | 'gilli' | 'pitthu' | 'rasoi' | 'cricket'>('kanche');
  const [score, setScore] = useState<number>(0);
  const [lastActionLog, setLastActionLog] = useState<string>('LiveOps Manager synchronized with server.');

  // Kanche (Marbles) State
  const [marblesRemaining, setMarblesRemaining] = useState<number>(5);
  const [kancheJackpotWon, setKancheJackpotWon] = useState<boolean>(false);

  // Gilli Danda State
  const [gilliState, setGilliState] = useState<'ground' | 'airborne' | 'hit'>('ground');
  const [gilliDistance, setGilliDistance] = useState<number>(0);

  // Pitthu (7 Stones) State
  const [stonesKnocked, setStonesKnocked] = useState<number>(0);
  const [stonesRebuilt, setStonesRebuilt] = useState<number>(0);

  // Cricket & Rasoi State
  const [isHitting, setIsHitting] = useState<boolean>(false);
  const [cricketOutcome, setCricketOutcome] = useState<{ runs: number; text: string; swing: number } | null>(null);
  const [rasoiOrders, setRasoiOrders] = useState<{ id: string; name: string; bonus: number; timer: number }[]>([
    { id: '1', name: liveOpsConfig.rasoi_rush?.trending_recipe || 'Modak', bonus: 150, timer: 25 },
    { id: '2', name: 'Special Masala Dosa', bonus: 80, timer: 18 }
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync orders with LiveOps recipe updates
  useEffect(() => {
    if (liveOpsConfig.rasoi_rush) {
      setRasoiOrders(prev => [
        { 
          id: '1', 
          name: liveOpsConfig.rasoi_rush.trending_recipe, 
          bonus: Math.round(100 * (liveOpsConfig.rasoi_rush.multiplier || 1.5)), 
          timer: liveOpsConfig.rasoi_rush.customer_patience_sec || 25 
        },
        ...prev.filter(o => o.id !== '1')
      ]);
    }
  }, [liveOpsConfig.rasoi_rush]);

  // Canvas 2D Animated Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeGame === 'kanche') {
        // Indian Street Dirt Ground & Chalk Circle
        ctx.fillStyle = '#78350f'; // Warm sandy dirt
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Chalk Ring
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + 10;
        const radius = (liveOpsConfig.kanche?.circle_radius_cm || 60) * 1.5;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Chalk Ring Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px monospace';
        ctx.fillText(`KANCHA CIRCLE (${liveOpsConfig.kanche?.circle_radius_cm || 60}cm) - REBOUND: ${liveOpsConfig.kanche?.glass_rebound_coefficient || 0.88}`, centerX - 110, centerY - radius - 10);

        // Target Glass Marbles inside Ring
        const marbleColors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
        for (let i = 0; i < marblesRemaining; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const mx = centerX + Math.cos(angle) * (radius * 0.5);
          const my = centerY + Math.sin(angle) * (radius * 0.5);

          const grad = ctx.createRadialGradient(mx - 3, my - 3, 2, mx, my, 12);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, marbleColors[i % marbleColors.length]);
          grad.addColorStop(1, '#064e3b');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(mx, my, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Striker Goli (at the bottom)
        const strikerGrad = ctx.createRadialGradient(centerX - 4, canvas.height - 35, 3, centerX, canvas.height - 30, 16);
        strikerGrad.addColorStop(0, '#ffffff');
        strikerGrad.addColorStop(0.4, '#ef4444');
        strikerGrad.addColorStop(1, '#7f1d1d');

        ctx.fillStyle = strikerGrad;
        ctx.beginPath();
        ctx.arc(centerX, canvas.height - 30, 15, 0, Math.PI * 2);
        ctx.fill();

        // Aim Trajectory Line
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX, canvas.height - 30);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

      } else if (activeGame === 'gilli') {
        // Gilli Danda Street / Ground
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Horizon Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 120);
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#fed7aa');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, 120);

        // Ground / Mud Trench
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 120, canvas.width, canvas.height - 120);

        // The Danda (Wooden Bat)
        ctx.fillStyle = '#d97706';
        ctx.fillRect(canvas.width / 2 - 120, 180, 80, 14);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 120, 180, 80, 14);

        // The Gilli (Tapered wood cylinder)
        const gilliY = gilliState === 'airborne' ? 70 : 185;
        const gilliX = gilliState === 'airborne' ? canvas.width / 2 : canvas.width / 2 + 10;
        
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.ellipse(gilliX, gilliY, 24, 7, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.stroke();

      } else if (activeGame === 'pitthu') {
        // Pitthu 7 Stones Canvas
        ctx.fillStyle = '#065f46';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const baseY = 210;

        // Draw 7 Stones Stack
        const stoneWidths = [70, 60, 52, 44, 36, 28, 20];
        const stonesStanding = 7 - stonesKnocked + stonesRebuilt;

        for (let i = 0; i < Math.max(0, Math.min(7, stonesStanding)); i++) {
          const w = stoneWidths[i];
          const y = baseY - (i * 14);
          ctx.fillStyle = i % 2 === 0 ? '#d97706' : '#b45309';
          ctx.fillRect(centerX - w / 2, y, w, 12);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.strokeRect(centerX - w / 2, y, w, 12);
        }

        // Projectile Rubber Ball
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(80, 180, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

      } else if (activeGame === 'cricket') {
        // Cricket Ground
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Turf
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 140, canvas.width, canvas.height - 140);

        // Pitch Strip
        ctx.fillStyle = '#78350f';
        ctx.fillRect(canvas.width / 2 - 40, 160, 80, canvas.height - 160);

      } else {
        // Rasoi Rush Canvas
        const kitchenGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        kitchenGrad.addColorStop(0, '#1e1b4b');
        kitchenGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = kitchenGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 150, canvas.width, canvas.height - 150);

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2 - 80, 200, 45, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(canvas.width / 2 + 80, 200, 45, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGame, liveOpsConfig, marblesRemaining, gilliState, stonesKnocked, stonesRebuilt]);

  // Kanche Strike Action
  const handleStrikeKanche = () => {
    const rebound = liveOpsConfig.kanche?.glass_rebound_coefficient || 0.88;
    const bonus = liveOpsConfig.kanche?.tournament_jackpot_coins || 500;

    if (marblesRemaining > 0) {
      setMarblesRemaining(prev => prev - 1);
      const points = Math.round(100 * rebound);
      setScore(prev => prev + points);
      setLastActionLog(
        `🔮 GDScript: Marble struck out of chalk ring! Rebound: ${rebound} | Points: +${points}`
      );
      if (marblesRemaining === 1) {
        setKancheJackpotWon(true);
        setScore(prev => prev + bonus);
        setLastActionLog(`🏆 JACKPOT CLEARED! Clean sweep bonus: +${bonus} coins.`);
      }
    } else {
      setMarblesRemaining(5);
      setKancheJackpotWon(false);
      setLastActionLog('Ring reset with 5 colorful glass marbles.');
    }
  };

  // Gilli Danda Action
  const handleFlipGilli = () => {
    setGilliState('airborne');
    setLastActionLog('🪵 Gilli flicked in the air! Click "SMASH DANDA" to strike!');
  };

  const handleSmashDanda = () => {
    const power = liveOpsConfig.gilli_danda?.danda_strike_power_multiplier || 1.5;
    const dist = Math.round((70 + Math.random() * 80) * power);
    setGilliDistance(dist);
    setGilliState('hit');
    setScore(prev => prev + dist);
    setLastActionLog(
      `💥 DANDA SMASH: Hit distance ${dist} meters! (Power Multiplier: ${power}x applied)`
    );
    setTimeout(() => setGilliState('ground'), 2000);
  };

  // Pitthu (7 Stones) Action
  const handleThrowPitthuBall = () => {
    if (stonesKnocked < 7) {
      setStonesKnocked(7);
      setStonesRebuilt(0);
      setScore(prev => prev + 150);
      setLastActionLog('🧱 TOWER TOPPLED! All 7 stones knocked down! Sprint to rebuild before dodgeball hits!');
    }
  };

  const handleRebuildStone = () => {
    if (stonesRebuilt < 7) {
      const nextCount = stonesRebuilt + 1;
      setStonesRebuilt(nextCount);
      setScore(prev => prev + 50);
      if (nextCount === 7) {
        setLastActionLog('🎉 LAGORI / PITTHU COMPLETE! Rebuilt 7-stone tower successfully!');
        setScore(prev => prev + 300);
      } else {
        setLastActionLog(`🧱 Rebuilt Stone ${nextCount}/7... Keep stacking!`);
      }
    }
  };

  // Cricket & Rasoi Actions
  const handleBowlAndBat = () => {
    setIsHitting(true);
    const swingFactor = liveOpsConfig.gully_cricket?.swing_multiplier || 1.2;
    const isRain = liveOpsConfig.gully_cricket?.weather_override?.toLowerCase().includes('rain');
    
    setTimeout(() => {
      const outcomes = [
        { runs: 6, text: 'MASSIVE SIX OVER EXTRA COVER! 🚀', swing: 14.2 * swingFactor },
        { runs: 4, text: 'CRACKING FOUR TO SQUARE LEG! 💥', swing: 11.5 * swingFactor },
        { runs: 2, text: 'Steal 2 runs in the alley! 🏃', swing: 8.0 * swingFactor },
        { runs: 1, text: 'Quick single pushed into deep cover.', swing: 9.4 * swingFactor },
      ];
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      setScore(prev => prev + result.runs);
      setCricketOutcome(result);
      setIsHitting(false);
      setLastActionLog(
        `Godot Physics: Bowl speed 138kph | Swing: ${result.swing.toFixed(1)}° (${isRain ? 'Wet Ball Dew Active' : 'Dry Tarmac'}) -> Result: ${result.runs} Runs`
      );
    }, 350);
  };

  const handleCookOrder = (orderName: string, baseBonus: number) => {
    const multiplier = liveOpsConfig.rasoi_rush?.multiplier || 1.5;
    const earned = Math.round(baseBonus * multiplier);
    setScore(prev => prev + earned);
    setLastActionLog(
      `GDScript Signal: festive_dish_plated("${orderName}", ${earned} coins) | LiveOps Multiplier: ${multiplier}x applied!`
    );
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
      {/* Playtest Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Desi Heritage Games • PC Playtest Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how AI-generated GDScript mechanics execute alongside live remote config <code className="text-amber-300 font-mono">/api/liveops/trends</code>.
          </p>
        </div>

        {/* Game Switcher Tabs for all Heritage Games */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveGame('kanche')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'kanche'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔮 Kanche (Marbles)
          </button>
          <button
            onClick={() => setActiveGame('gilli')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'gilli'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🪵 Gilli Danda
          </button>
          <button
            onClick={() => setActiveGame('pitthu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'pitthu'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🧱 Pitthu (7 Stones)
          </button>
          <button
            onClick={() => setActiveGame('rasoi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'rasoi'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🥘 Rasoi Rush
          </button>
          <button
            onClick={() => setActiveGame('cricket')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'cricket'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏏 Gully Cricket
          </button>
        </div>
      </div>

      {/* Simulator Canvas & Live Overlay */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={720}
          height={240}
          className="w-full h-56 block"
        />

        {/* Live HUD Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Score: {score}</span>
          </div>

          {activeGame === 'kanche' && (
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-emerald-300 shadow-lg">
              Marbles in Ring: {marblesRemaining}/5
            </div>
          )}

          {activeGame === 'gilli' && gilliDistance > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-lg">
              Last Hit: {gilliDistance}m
            </div>
          )}

          {activeGame === 'pitthu' && (
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-amber-300 shadow-lg">
              Stack: {stonesRebuilt}/7 Rebuilt
            </div>
          )}
        </div>
      </div>

      {/* Game Interactive Controls */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        
        {/* Kanche Controls */}
        {activeGame === 'kanche' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Precision Marble Shooter (Carrom / 8-Ball Physics)</span>
              <p className="text-[11px] text-slate-400">Aim striker goli into the chalk ring. Dislodge marbles without bouncing out.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStrikeKanche}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>{marblesRemaining > 0 ? 'Flick Striker Goli' : 'Reset Chalk Circle'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Gilli Danda Controls */}
        {activeGame === 'gilli' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Gilli Danda Street Strike</span>
              <p className="text-[11px] text-slate-400">Step 1: Flip the gilli into mid-air. Step 2: Timing-smash with the danda for max distance.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFlipGilli}
                disabled={gilliState === 'airborne'}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>1. Flip Gilli</span>
              </button>
              <button
                onClick={handleSmashDanda}
                disabled={gilliState !== 'airborne'}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer ${
                  gilliState === 'airborne' ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>2. SMASH DANDA!</span>
              </button>
            </div>
          </div>
        )}

        {/* Pitthu (7 Stones) Controls */}
        {activeGame === 'pitthu' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Pitthu / Lagori (7 Stones 3D Action)</span>
              <p className="text-[11px] text-slate-400">Throw rubber projectile to topple tower, then stack stones before opponent hits you.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleThrowPitthuBall}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Throw Ball (Topple)</span>
              </button>
              <button
                onClick={handleRebuildStone}
                disabled={stonesKnocked === 0 || stonesRebuilt >= 7}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Stack Stone ({stonesRebuilt}/7)</span>
              </button>
            </div>
          </div>
        )}

        {/* Rasoi Rush Controls */}
        {activeGame === 'rasoi' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Cozy Kitchen Orders (LiveOps Multiplier: {liveOpsConfig.rasoi_rush?.multiplier || 1.5}x)</span>
              <p className="text-[11px] text-slate-400">Trending Festival: {liveOpsConfig.rasoi_rush?.festival_event || 'Festival Season'}</p>
            </div>
            <div className="flex items-center gap-2">
              {rasoiOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => handleCookOrder(order.name, order.bonus)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cook {order.name} (+{Math.round(order.bonus * (liveOpsConfig.rasoi_rush?.multiplier || 1.5))})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gully Cricket Controls */}
        {activeGame === 'cricket' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Wankhede Super-Over Batting</span>
              <p className="text-[11px] text-slate-400">Swing multiplier: {liveOpsConfig.gully_cricket?.swing_multiplier || 1.2}x</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBowlAndBat}
                disabled={isHitting}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
              >
                <span>{isHitting ? 'Bowling Speed 140kph...' : 'Play Shot'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Log Output */}
        <div className="pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <span className="truncate">{lastActionLog}</span>
        </div>

      </div>
    </div>
  );
};
