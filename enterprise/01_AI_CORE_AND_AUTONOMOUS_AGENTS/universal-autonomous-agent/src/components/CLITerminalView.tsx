import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Trash2, 
  CornerDownLeft, 
  HelpCircle, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CLICommandResponse } from '../types';

interface CLITerminalViewProps {
  onExecCommand: (command: string) => Promise<CLICommandResponse>;
}

export const CLITerminalView: React.FC<CLITerminalViewProps> = ({
  onExecCommand
}) => {
  const [inputCommand, setInputCommand] = useState<string>('');
  const [history, setHistory] = useState<CLICommandResponse[]>([
    {
      command: 'agent status',
      output: `Agent OS Core: ONLINE
Tenant: Amit Sharma (Founder & Principal AI Architect)
Operating Mode: SUPERVISED
Active Workers: 8/8 running
Pending Control Items: 1
Uptime: 14.8h | Compute Load: 28%`,
      status: 'success',
      timestamp: '10:00:00 AM'
    }
  ]);
  const [commandListHistory, setCommandListHistory] = useState<string[]>(['agent status']);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async (cmdToRun?: string) => {
    const raw = cmdToRun || inputCommand;
    if (!raw.trim() || isExecuting) return;

    if (raw.trim() === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    setIsExecuting(true);
    try {
      const res = await onExecCommand(raw);
      setHistory(prev => [...prev, res]);
      setCommandListHistory(prev => [...prev, raw]);
      setHistoryIndex(-1);
      if (!cmdToRun) setInputCommand('');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandListHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandListHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputCommand(commandListHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandListHistory.length) {
          setHistoryIndex(nextIdx);
          setInputCommand(commandListHistory[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputCommand('');
        }
      }
    }
  };

  const sampleCommands = [
    'agent status',
    'agent policy',
    'agent memory',
    'agent logs',
    'agent mode AUTONOMOUS',
    'agent connect github',
    'agent deploy'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Agent OS CLI & Shell Runtime
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                  v2.4.0
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Low-level developer interface: inspect permissions, memory footprints, live daemon logs, and cloud deployments.
              </p>
            </div>
          </div>

          <button
            onClick={() => setHistory([])}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Terminal
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-[11px] ml-2 font-mono">
              agent-os@cloud-run:~/orchestrator
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-sans">
            bash • Node.js v20 • TypeScript
          </span>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div className="text-slate-500 leading-relaxed">
            Welcome to <span className="text-cyan-400">Agent OS CLI</span> [v2.4.0-cloudrun-production].<br />
            Type <span className="text-white">help</span> for command reference or click sample commands below.
          </div>

          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-cyan-400 font-bold">$</span>
                <span className="text-white font-semibold">{item.command}</span>
                <span className="text-slate-600 text-[10px] ml-auto">{item.timestamp}</span>
              </div>

              <pre className={`p-3 rounded-xl whitespace-pre-wrap leading-relaxed ${
                item.status === 'error'
                  ? 'bg-rose-950/30 text-rose-300 border border-rose-900/50'
                  : 'bg-slate-900/70 text-slate-300 border border-slate-800/80'
              }`}>
                {item.output}
              </pre>
            </div>
          ))}

          <div ref={terminalEndRef} />
        </div>

        {/* Preset click shortcuts */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">Presets:</span>
          {sampleCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(cmd)}
              className="px-2 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-mono shrink-0 border border-slate-700 transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <span className="text-cyan-400 font-bold text-sm">$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'agent status', 'agent policy', 'help'..."
            className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-none placeholder-slate-600"
            autoFocus
          />

          <button
            type="submit"
            disabled={isExecuting || !inputCommand.trim()}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 font-sans font-semibold text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            Exec
          </button>
        </form>
      </div>
    </div>
  );
};
