
import React, { useState, useEffect, useCallback } from 'react';
import Visualizer from './components/Visualizer';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [load, setLoad] = useState(12);
  const [isStealth, setIsStealth] = useState(false);

  // Toggle Stealth Protocol
  const toggleStealth = useCallback(() => {
    setIsStealth(prev => !prev);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleStealth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleStealth]);

  useEffect(() => {
    const logs = [
      "SYNAPTIC BURST...",
      "GHOST_PROTOCOL READY.",
      "ENCRYPTION: QUANTUM_SECURED.",
      "USER: ROOT.",
      "SPEED: MAXIMIZED.",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setSystemLogs(prev => [...prev.slice(-3), `[SYS] ${logs[i]}`]);
        i++;
      } else {
        setSystemLogs(prev => [...prev.slice(-3), `[TICK] CORE_${(Math.random()*100).toFixed(0)}`]);
      }
      setLoad(prev => Math.max(5, Math.min(99, prev + (Math.random() - 0.5) * 10)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isStealth ? 'bg-black' : 'bg-[#01040a]'} text-slate-100 selection:bg-cyan-500/50 relative overflow-hidden`}>
      
      {/* Stealth Overlay */}
      {isStealth && (
        <div className="fixed top-2 right-4 z-50 animate-pulse text-[10px] font-mono text-slate-800 pointer-events-none">
          GHOST_PROTOCOL_ACTIVE (ESC to reveal)
        </div>
      )}

      {/* Background HUD Layers */}
      {!isStealth && (
        <div className="fixed inset-0 pointer-events-none transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#0ea5e911_0%,_transparent_70%)]"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 blur-[120px]"></div>
        </div>
      )}

      <main className={`relative z-10 container mx-auto px-4 h-screen py-4 flex flex-col gap-4 overflow-hidden transition-all duration-500 ${isStealth ? 'scale-[0.98] blur-[1px]' : ''}`}>
        
        {/* Top Navigation / Status HUD */}
        <header className={`flex justify-between items-center glass-panel px-6 py-2 rounded-xl border-cyan-500/10 transition-all ${isStealth ? 'opacity-10' : 'opacity-100'}`}>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="font-orbitron text-md font-black tracking-[0.3em] flex items-center gap-2">
                <span className="text-cyan-500">ZENITH</span>
                <span className="text-white border-l border-slate-700 pl-2">AGI</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={toggleStealth}
                className="px-3 py-1 rounded border border-slate-800 hover:border-cyan-500 text-[9px] font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-all"
             >
               {isStealth ? 'INIT_REVEAL' : 'GHOST_PROTOCOL'}
             </button>
             <div className="h-6 w-px bg-slate-800"></div>
             <div className="flex flex-col items-end">
                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Logic Engine</span>
                <span className="text-[10px] font-mono text-emerald-500">ULTRA_LITE</span>
             </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
          
          {/* Sidebar Modules */}
          <aside className={`md:w-1/5 flex flex-col gap-4 transition-all duration-500 ${isStealth ? 'opacity-5 w-0 md:w-0 overflow-hidden' : 'opacity-100'}`}>
            
            {/* Visualizer Module */}
            <div className="flex-[3] glass-panel rounded-2xl overflow-hidden flex flex-col relative group">
              <div className="p-2 bg-slate-950 border-b border-cyan-950 flex items-center justify-between">
                <span className="text-[8px] font-orbitron text-cyan-400 uppercase font-bold tracking-widest">Topology</span>
              </div>
              <div className="flex-1 min-h-[150px]">
                <Visualizer />
              </div>
            </div>

            {/* System Logs */}
            <div className="flex-[2] glass-panel rounded-2xl p-3 font-mono overflow-hidden flex flex-col bg-black/40">
              <div className="flex-1 space-y-1 overflow-hidden">
                {systemLogs.map((log, i) => (
                  <div key={i} className="text-[8px] text-slate-500 leading-tight">
                    <span className="text-cyan-900 mr-1">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Chat Module */}
          <section className="flex-1 flex flex-col min-h-0">
            <ChatInterface isStealth={isStealth} />
          </section>
        </div>

        {/* Footer Metrics Overlay */}
        <footer className={`h-6 flex items-center justify-between px-4 text-[7px] font-bold text-slate-700 uppercase tracking-widest transition-opacity ${isStealth ? 'opacity-0' : 'opacity-100'}`}>
          <div>FAST_PROTOCOL :: NO_WAIT :: CACHE_HIT_99%</div>
          <div>ZENITH_CORE :: VERSION_SPEED_X</div>
        </footer>
      </main>

      {/* Grid Pattern Background */}
      {!isStealth && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      )}
    </div>
  );
};

export default App;
