import React, { useState } from "react";
import { Code, BookOpen, Settings, Zap, Copy, Check, Terminal, ExternalLink } from "lucide-react";

export default function SdkIntegrationGuide() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const codeInstall = `npm install @google/genai express dotenv`;

  const codeBackend = `import { GoogleGenAI, Type } from "@google/genai";

// 1. Initialize modern SDK client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. Perform Grounded Web Search (Autonomous Research)
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Find high-growth remote B2B SaaS companies globally in 2026",
  config: {
    // Enable real-time Google Search grounding
    tools: [{ googleSearch: {} }],
  },
});

// 3. Extract verified grounding chunks & citations
const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
const citations = chunks.map(chunk => ({
  title: chunk.web?.title,
  url: chunk.web?.uri
}));`;

  const codeJsonFormat = `{
  "model": "gemini-2.5-flash",
  "contents": "Extract specific fields cleanly into standard database entities...",
  "config": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "OBJECT",
      "properties": {
        "records": { "type": "ARRAY", "items": { "type": "OBJECT" } }
      }
    }
  }
}`;

  return (
    <div id="sdk-integration-card" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-8">
      {/* Header */}
      <div className="border-b border-slate-150 p-6 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Google GenAI SDK & ADK Guide</h3>
            <p className="text-xs text-slate-500">Learn how this autonomous scraping and grounding system was developed.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/google-gemini/generative-ai-js"
            target="_blank"
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            SDK Docs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Conceptual Steps */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Architecture (Agent Workflow)</h4>
          
          <div className="relative border-l border-indigo-100 pl-6 ml-3 space-y-6">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-9 top-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600">
                1
              </span>
              <h5 className="text-xs font-bold text-slate-700">Autonomous Query Generator</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                The user inputs raw instructions. The agent calls <code className="bg-slate-50 px-1 py-0.5 rounded text-indigo-600">gemini-2.5-flash</code> to plan targeted search queries that target listings, directories, and authentic source indexes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-9 top-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600">
                2
              </span>
              <h5 className="text-xs font-bold text-slate-700">Search Grounding Engine</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Using Google Search Grounding capabilities, the backend crawls live indices. This guarantees the scraped records are real and verifiable rather than hallucinated models.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-9 top-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600">
                3
              </span>
              <h5 className="text-xs font-bold text-slate-700">Strict JSON Data Parsing</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                The retrieved grounded text is formatted with strict JSON Schema. The agent cleanses formatting, deletes redundant rows, matches targets, and reports accuracy.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              Environment Variables Required
            </div>
            <p className="text-[11px] text-slate-500">
              Make sure to provide your API credentials to allow grounding searches to execute successfully:
            </p>
            <pre className="text-[10px] font-mono bg-slate-900 text-slate-300 p-2.5 rounded border border-slate-800">
              GEMINI_API_KEY=&quot;your_api_key_here&quot;
            </pre>
          </div>
        </div>

        {/* Right Column: Code Playgrounds */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">GenAI SDK Snippets</h4>
            <span className="text-[10px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Node.js ESM / TS</span>
          </div>

          {/* Installation snippet */}
          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-850 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
              <span>Install SDK</span>
              <button
                onClick={() => handleCopy(codeInstall, "install")}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedText === "install" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-nowrap">
              $ {codeInstall}
            </div>
          </div>

          {/* Core code snippet */}
          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-850 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
              <span>Grounded Research Code</span>
              <button
                onClick={() => handleCopy(codeBackend, "backend")}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedText === "backend" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-3 text-[10px] font-mono text-slate-300 overflow-y-auto max-h-[220px] whitespace-pre-wrap leading-relaxed">
              {codeBackend}
            </pre>
          </div>

          {/* JSON Schema formatting */}
          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-850 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
              <span>Structured Schema Extraction</span>
              <button
                onClick={() => handleCopy(codeJsonFormat, "json")}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedText === "json" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="p-3 text-[10px] font-mono text-slate-300 overflow-y-auto max-h-[140px] whitespace-pre-wrap leading-relaxed">
              {codeJsonFormat}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
