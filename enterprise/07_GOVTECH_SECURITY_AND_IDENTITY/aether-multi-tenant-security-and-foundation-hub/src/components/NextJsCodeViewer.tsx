import React, { useState } from 'react';
import { NEXTJS_CODE_TEMPLATES } from '../lib/nextjsCodeSnippets';
import { FileCode, Copy, Check, Server, Terminal, ShieldAlert } from 'lucide-react';

export const NextJsCodeViewer: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<keyof typeof NEXTJS_CODE_TEMPLATES>('adminRouteHandler');
  const [copied, setCopied] = useState(false);

  const currentTemplate = NEXTJS_CODE_TEMPLATES[selectedKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTemplate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-zinc-100">
                Next.js 14 App Router & Supabase Implementation Code
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Production-ready Route Handlers, Supabase SSR client configurations, and server-side RBAC guards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {Object.entries(NEXTJS_CODE_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key as any)}
              className={`px-3 py-1.5 rounded-md transition-colors font-mono whitespace-nowrap text-xs ${
                selectedKey === key
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {template.filename}
            </button>
          ))}
        </div>
      </div>

      {/* Code Display Area */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-indigo-400" />
            <span className="font-mono text-zinc-200 font-semibold">{currentTemplate.filename}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 text-[11px]">{currentTemplate.description}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            {currentTemplate.language}
          </span>
        </div>

        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
          {currentTemplate.code}
        </pre>
      </div>
    </div>
  );
};
