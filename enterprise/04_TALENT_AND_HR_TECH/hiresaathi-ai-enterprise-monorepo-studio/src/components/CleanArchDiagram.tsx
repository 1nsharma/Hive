import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDown, 
  ArrowUp, 
  CheckCircle2, 
  FileCode2, 
  Cpu, 
  Database, 
  ShieldAlert, 
  Sparkles,
  Info
} from 'lucide-react';

export const CleanArchDiagram: React.FC<{ hinglishMode?: boolean }> = ({ hinglishMode = false }) => {
  const [selectedLayer, setSelectedLayer] = useState<'domain' | 'application' | 'api' | 'infrastructure'>('domain');

  const layersInfo = {
    api: {
      name: 'API / Presentation Layer',
      path: 'src/recruit/api/',
      tools: 'FastAPI, Pydantic, HTTP Routers, OpenAPI Docs',
      responsibility: 'Receives HTTP/REST requests, verifies JWT workspace session, validates JSON payloads, and calls Application use-cases. No business decisions happen here.',
      responsibilityHindi: 'Sirf HTTP request receive karta hai aur response serialize karta hai. Yahan koi matching logic ya business rules nahi hote.',
      files: ['routes/jobs.py', 'routes/candidates.py', 'dependencies.py']
    },
    application: {
      name: 'Application Layer (Use Cases)',
      path: 'src/recruit/application/',
      tools: 'Pure Python Orchestrators',
      responsibility: 'Implements workflow use cases (e.g., CreateJob, ParseResume, RankCandidates). Coordinates between Domain logic and Infrastructure interfaces.',
      responsibilityHindi: 'Har business action (e.g. Resume parse karna, Job create karna) ka ek specific use case file hota hai.',
      files: ['create_job.py', 'parse_resume.py', 'rank_candidates.py']
    },
    domain: {
      name: 'Domain Layer (Core Entities & Rules)',
      path: 'src/recruit/domain/',
      tools: 'Pure Python Data Classes & Functions (0 Dependencies)',
      responsibility: 'The HEART of HireSaathi AI. Contains matching formulas, bias-auditing rules, and scoring thresholds. ZERO import of FastAPI, SQLAlchemy, or OpenAI.',
      responsibilityHindi: 'Sabse important layer! Yahan actual matching formula aur bias screening code hai. Yeh bina kisi database ya AI API ke 2ms mein test ho sakta hai.',
      files: ['models.py', 'matching.py', 'policies.py']
    },
    infrastructure: {
      name: 'Infrastructure Layer (Adapters & External Systems)',
      path: 'src/recruit/infrastructure/',
      tools: 'SQLAlchemy 2.0, PostgreSQL, Asyncpg, OpenAI / Gemini Clients',
      responsibility: 'Communicates with the outside world: databases, message queues, vector search, and LLM APIs. Can be swapped without touching domain logic.',
      responsibilityHindi: 'Database queries aur external AI model calls yahan hote hain. Agar kal OpenAI se Claude par shift karna ho, toh sirf yeh file badlegi.',
      files: ['database.py', 'resume_parser.py', 'model_client.py']
    }
  };

  const active = layersInfo[selectedLayer];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span>SERVICE DEEP DIVE: services/recruit-service/</span>
            <span>·</span>
            <span>CLEAN ARCHITECTURE / HEXAGONAL</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Service Internal Architecture &amp; Layered Isolation
          </h2>
          <p className="text-xs text-slate-400">
            {hinglishMode 
              ? 'Sirf folder ke naam achhe hone se architecture scalable nahi hota. Har service ke andar consistent internal structure hona chahiye.'
              : 'Scalable services require strict internal separation of concerns so domain business logic is never tightly coupled to LLMs or databases.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
            Pure Dependency Inversion
          </span>
        </div>
      </div>

      {/* Visual Hexagonal / Layered Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Layer Stack (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Layer 1: API */}
          <div
            onClick={() => setSelectedLayer('api')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedLayer === 'api'
                ? 'bg-blue-950/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-blue-900/60 text-blue-300 text-xs font-mono flex items-center justify-center font-bold">
                  1
                </span>
                <span className="text-sm font-bold text-white">API / Presentation (FastAPI)</span>
              </div>
              <span className="text-xs font-mono text-slate-400">src/recruit/api/</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-8">
              HTTP endpoints, request models, auth context dependencies.
            </p>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 2: Application */}
          <div
            onClick={() => setSelectedLayer('application')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedLayer === 'application'
                ? 'bg-purple-950/50 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-purple-900/60 text-purple-300 text-xs font-mono flex items-center justify-center font-bold">
                  2
                </span>
                <span className="text-sm font-bold text-white">Application Layer (Use Cases)</span>
              </div>
              <span className="text-xs font-mono text-slate-400">src/recruit/application/</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-8">
              Orchestrates single business operations: CreateJob, ParseResume, RankCandidates.
            </p>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 3: Domain (The Center) */}
          <div
            onClick={() => setSelectedLayer('domain')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedLayer === 'domain'
                ? 'bg-indigo-950/80 border-indigo-500 shadow-lg ring-2 ring-indigo-500/40'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-mono flex items-center justify-center font-bold">
                  ★
                </span>
                <div>
                  <span className="text-sm font-bold text-white">Domain Core (Pure Business Logic)</span>
                  <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300">
                    ZERO DEPENDENCIES
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">src/recruit/domain/</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 pl-8">
              Candidate matching algorithms, scoring ratios, ethical anti-bias policies.
            </p>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowUp className="w-4 h-4" />
          </div>

          {/* Layer 4: Infrastructure */}
          <div
            onClick={() => setSelectedLayer('infrastructure')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedLayer === 'infrastructure'
                ? 'bg-emerald-950/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-emerald-900/60 text-emerald-300 text-xs font-mono flex items-center justify-center font-bold">
                  4
                </span>
                <span className="text-sm font-bold text-white">Infrastructure &amp; External Drivers</span>
              </div>
              <span className="text-xs font-mono text-slate-400">src/recruit/infrastructure/</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 pl-8">
              PostgreSQL, Asyncpg, OpenAI client, PDF resume parsers.
            </p>
          </div>
        </div>

        {/* Layer Deep-Dive Explainer Card (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-indigo-400">LAYER INSPECTOR</span>
              <h3 className="text-base font-bold text-white mt-0.5">{active.name}</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {active.path}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300">Responsibility:</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
              {hinglishMode ? active.responsibilityHindi : active.responsibility}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300">Tooling &amp; Technologies:</span>
            <p className="text-xs font-mono text-indigo-300 mt-1">
              {active.tools}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300">Files In This Layer:</span>
            <div className="space-y-1.5 mt-2">
              {active.files.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs font-mono text-slate-300 p-2 rounded bg-slate-950 border border-slate-850">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{active.path}{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why this matters callout */}
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-2.5 text-xs text-indigo-200">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              {hinglishMode
                ? 'Is separation ka sabse bada fayda: Matching logic ko AI provider ya database se independent test kiya ja sakta hai bina kisi mock server ke.'
                : 'Key benefit: The candidate scoring formula can be unit tested in CI in under 2ms without requiring a live Postgres instance or burning OpenAI credits.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
