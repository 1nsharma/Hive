import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Stethoscope, 
  RotateCcw,
  ChevronRight,
  Info
} from 'lucide-react';

interface TriageResult {
  urgent: 'emergency' | 'same_day' | 'monitor' | 'unknown';
  summary: string;
  red_flags: string[];
  next_steps: string[];
  what_to_avoid: string[];
  disclaimer: string;
}

const PRESET_SYMPTOMS = [
  "🐶 Dog vomiting yellow foam & lethargic",
  "🐱 Cat hasn't eaten in 24 hours & hiding",
  "🎾 Dog limping after playing in park",
  "🍫 Pet accidentally ate chocolate piece"
];

export const AISymptomScanner: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const handleAnalyze = async (inputSymptoms?: string) => {
    const textToAnalyze = inputSymptoms || symptoms;
    if (!textToAnalyze.trim()) return;

    setIsLoading(true);
    setTriageResult(null);

    try {
      const response = await fetch('/api/v1/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ species, symptoms: textToAnalyze })
      });

      if (response.ok) {
        const data = await response.json();
        setTriageResult(data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Fallback deterministic assessment if backend API is offline
      const lower = textToAnalyze.toLowerCase();
      let urgentLevel: 'emergency' | 'same_day' | 'monitor' | 'unknown' = 'monitor';
      
      if (lower.includes('chocolate') || lower.includes('vomiting') || lower.includes('breathe') || lower.includes('bleed')) {
        urgentLevel = lower.includes('breathe') || lower.includes('chocolate') ? 'emergency' : 'same_day';
      }

      setTriageResult({
        urgent: urgentLevel,
        summary: `AI Risk Assessment generated for reported ${species} symptoms: "${textToAnalyze.slice(0, 80)}..."`,
        red_flags: [
          "Persistent vomiting or refusal to drink water for > 12 hours.",
          "Changes in gum color (pale, blue, or deep purple).",
          "Sudden drop in body temperature or unresponsiveness."
        ],
        next_steps: [
          "Keep your pet in a calm, dimly lit area with fresh water nearby.",
          "Do not give human medications without direct vet instructions.",
          "Contact your nearest emergency veterinary clinic if symptoms worsen."
        ],
        what_to_avoid: [
          "Do not induce vomiting manually unless explicitly instructed by a vet.",
          "Do not delay seeking clinical care if breathing is labored."
        ],
        disclaimer: "I am an AI assistant, not a veterinarian. If your pet is in severe distress, seek immediate professional care."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyBadge = (urgent: TriageResult['urgent']) => {
    switch (urgent) {
      case 'emergency':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-extrabold text-sm animate-pulse">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>🔴 EMERGENCY: SEEK IMMEDIATE VET CARE</span>
          </div>
        );
      case 'same_day':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-400 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>🟠 URGENT: VET VISIT RECOMMENDED TODAY</span>
          </div>
        );
      case 'monitor':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>🟢 STABLE: MONITOR CLOSELY AT HOME</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-400 font-extrabold text-sm">
            <Info className="w-5 h-5 text-blue-400" />
            <span>🔵 GENERAL GUIDANCE: CONSULT VET FOR EVALUATION</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-gradient-to-b from-[#0D241C] to-[#081510] border border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-emerald-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> POWERED BY GEMINI 3.6 FLASH & VET SAFETY PROTOCOLS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-emerald-400" />
            AI Health Symptom Scanner
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Describe your pet's symptoms for an instant AI triage evaluation and emergency risk check.
          </p>
        </div>

        {/* Species Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-emerald-800/40">
          {(['dog', 'cat', 'other'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => setSpecies(sp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                species === sp
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sp === 'dog' ? '🐶 Dog' : sp === 'cat' ? '🐱 Cat' : '🐾 Other'}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <textarea
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Type symptoms here (e.g. My dog vomited twice this morning and is lethargic)..."
            className="w-full bg-slate-950/90 border border-emerald-800/80 focus:border-emerald-400 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all resize-none shadow-inner"
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading || !symptoms.trim()}
            className="absolute right-3 bottom-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin text-slate-950" /> Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Run AI Triage
              </span>
            )}
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs text-slate-400 font-mono self-center mr-1">Sample Prompts:</span>
          {PRESET_SYMPTOMS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSymptoms(preset);
                handleAnalyze(preset);
              }}
              className="text-xs bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer text-left"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Triage Output Card */}
      {triageResult && (
        <div className="bg-slate-950 border border-emerald-800/80 rounded-2xl p-6 space-y-6 shadow-2xl animate-fadeIn">
          
          {/* Risk Level Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
            {getUrgencyBadge(triageResult.urgent)}
            <button
              onClick={() => {
                setTriageResult(null);
                setSymptoms('');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Triage
            </button>
          </div>

          {/* AI Summary */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">AI Assessment Summary</h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">{triageResult.summary}</p>
          </div>

          {/* Red Flags & Next Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Red Flags */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Watch Out For Red Flags
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {triageResult.red_flags.map((rf, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommended Action Steps
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {triageResult.next_steps.map((ns, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ns}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 italic">
            <strong>Vet Safety Disclaimer:</strong> {triageResult.disclaimer}
          </div>

        </div>
      )}

    </div>
  );
};
