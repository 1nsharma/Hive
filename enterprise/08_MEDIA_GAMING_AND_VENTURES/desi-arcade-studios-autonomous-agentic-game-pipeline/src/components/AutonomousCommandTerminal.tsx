import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Code2, 
  Copy, 
  Check, 
  Server, 
  BookOpen, 
  CreditCard, 
  Trophy, 
  Send, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { AgencyCommand } from '../types';

interface AutonomousCommandTerminalProps {
  commands: AgencyCommand[];
  onExecuteCommand: (commandId?: string, customPrompt?: string) => Promise<{ success: boolean; commandName: string; logs: string[] }>;
  isExecutingCommand: boolean;
}

export const AutonomousCommandTerminal: React.FC<AutonomousCommandTerminalProps> = ({
  commands,
  onExecuteCommand,
  isExecutingCommand
}) => {
  const [customCommandInput, setCustomCommandInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[Desi Arcade Autonomous Agent Fleet v4.8 Initialized]',
    '[Ingestion Daemon] 24/7 Trend Radar polling active.',
    '[Synthesizer Engine] Connected to Gemini 3.7 Flash.',
    '[LiveOps Core] Express endpoints bound on port 3000.',
    'System ready. Enter an autonomous directive or select a preset agency command below.'
  ]);
  const [selectedArtifact, setSelectedArtifact] = useState<{ filename: string; language: string; content: string } | null>(null);
  const [copiedArtifact, setCopiedArtifact] = useState<boolean>(false);

  const handleRunPreset = async (cmd: AgencyCommand) => {
    setTerminalLogs(prev => [
      ...prev,
      `\n$ desi-arcade-agent dispatch --preset="${cmd.commandName}"`
    ]);

    const result = await onExecuteCommand(cmd.id);
    if (result && result.logs) {
      setTerminalLogs(prev => [...prev, ...result.logs, `✔ Action "${cmd.commandName}" completed successfully.`]);
    }
    if (cmd.artifacts && cmd.artifacts.length > 0) {
      setSelectedArtifact(cmd.artifacts[0]);
    }
  };

  const handleRunCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommandInput.trim()) return;

    const prompt = customCommandInput.trim();
    setCustomCommandInput('');
    setTerminalLogs(prev => [
      ...prev,
      `\n$ desi-arcade-agent run "${prompt}"`
    ]);

    const result = await onExecuteCommand(undefined, prompt);
    if (result && result.logs) {
      setTerminalLogs(prev => [...prev, ...result.logs, `✔ Custom directive executed by autonomous agent fleet.`]);
    }
  };

  const handleCopyArtifact = () => {
    if (!selectedArtifact) return;
    navigator.clipboard.writeText(selectedArtifact.content);
    setCopiedArtifact(true);
    setTimeout(() => setCopiedArtifact(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Terminal className="w-4 h-4" />
              <span>Autonomous Agency Command & Orchestration Terminal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              What is the Next Command for the Autonomous Agency?
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Command your agent fleet to deploy infrastructure, tune Godot style guides, connect dynamic payment rails, or ingest live sports streams into your games.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Autonomous Authority</span>
            </span>
          </div>
        </div>
      </div>

      {/* Preset Agency Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {commands.map((cmd) => {
          const categoryIcons: Record<string, React.ReactNode> = {
            Infrastructure: <Server className="w-4 h-4 text-emerald-400" />,
            'AI Training': <BookOpen className="w-4 h-4 text-amber-400" />,
            Monetization: <CreditCard className="w-4 h-4 text-purple-400" />,
            LiveOps: <Trophy className="w-4 h-4 text-sky-400" />,
          };

          return (
            <div
              key={cmd.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    {categoryIcons[cmd.category] || <Terminal className="w-4 h-4" />}
                    <span>{cmd.category}</span>
                  </span>
                  {cmd.status === 'completed' && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">
                  {cmd.commandName}
                </h4>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {cmd.description}
                </p>
              </div>

              <button
                onClick={() => handleRunPreset(cmd)}
                disabled={isExecutingCommand}
                className="w-full py-2 rounded-lg bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-slate-950 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                <span>Execute Command</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Command Line Terminal & Artifact Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Live Shell & Custom Prompt Form (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="text-slate-300 font-bold ml-1">desi-arcade-cli --autonomous</span>
              </div>
              <span className="text-[10px] text-emerald-400">STATUS: READY</span>
            </div>

            {/* Terminal Screen */}
            <div className="h-72 overflow-y-auto space-y-1 text-slate-300 leading-relaxed pr-1">
              {terminalLogs.map((log, index) => (
                <div 
                  key={index}
                  className={
                    log.startsWith('$') ? 'text-purple-400 font-bold pt-1' :
                    log.startsWith('✔') ? 'text-emerald-400 font-bold' :
                    log.includes('FAIL') ? 'text-red-400' :
                    'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            {/* Command Input Bar */}
            <form onSubmit={handleRunCustom} className="pt-2 border-t border-slate-800 flex gap-2">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3 text-purple-400 font-bold">$</span>
                <input
                  type="text"
                  value={customCommandInput}
                  onChange={(e) => setCustomCommandInput(e.target.value)}
                  placeholder="Enter custom command (e.g., 'Add Razorpay UPI discount engine')..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isExecutingCommand || !customCommandInput.trim()}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Side: Generated Code Artifact Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>{selectedArtifact?.filename || 'Command Artifact Output'}</span>
              </span>

              {selectedArtifact && (
                <button
                  onClick={handleCopyArtifact}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedArtifact ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedArtifact ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="p-4 bg-slate-950 min-h-[300px] max-h-[340px] overflow-y-auto">
              {selectedArtifact ? (
                <pre className="text-xs font-mono text-purple-200 leading-relaxed">
                  {selectedArtifact.content}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-center p-4 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-700" />
                  <p className="text-xs font-bold text-slate-400">No artifact generated yet</p>
                  <p className="text-[11px] text-slate-600 max-w-xs">
                    Execute a preset command on the left (e.g. AWS Lambda deployment or Razorpay Bridge) to view generated scripts here.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
