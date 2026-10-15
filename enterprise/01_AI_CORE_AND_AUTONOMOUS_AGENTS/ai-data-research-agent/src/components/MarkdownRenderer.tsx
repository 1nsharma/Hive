import React, { useState } from 'react';
import { CheckSquare, Square, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  onSubDomainLinkClick?: (subDomainId: string) => void;
  onToggleCheck?: (taskText: string, isChecked: boolean) => void;
  subDomainsList: Array<{ id: string; name: string }>;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onSubDomainLinkClick,
  onToggleCheck,
  subDomainsList
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm italic">
        No documentation content generated yet. Click "Generate with AI" to build this module.
      </div>
    );
  }

  // Parse lines of markdown to render them elegantly with custom elements
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLanguage = '';

  const renderedElements: React.ReactNode[] = [];

  const renderTextWithSubDomainLinks = (text: string) => {
    // Look for matching subdomain names in the text to make them interactive links!
    // Sort longest names first so we don't match substrings incorrectly
    const sortedSubDomains = [...subDomainsList].sort((a, b) => b.name.length - a.name.length);
    
    let parts: React.ReactNode[] = [text];

    sortedSubDomains.forEach(sd => {
      const regex = new RegExp(`\\b(${sd.name})\\b`, 'gi');
      const nextParts: React.ReactNode[] = [];

      parts.forEach(part => {
        if (typeof part !== 'string') {
          nextParts.push(part);
          return;
        }

        const segments = part.split(regex);
        if (segments.length === 1) {
          nextParts.push(part);
          return;
        }

        segments.forEach((seg, index) => {
          if (index % 2 === 1) {
            nextParts.push(
              <button
                key={`${sd.id}-${index}`}
                onClick={() => onSubDomainLinkClick?.(sd.id)}
                className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                {seg}
              </button>
            );
          } else if (seg) {
            nextParts.push(seg);
          }
        });
      });

      parts = nextParts;
    });

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        inCodeBlock = false;
        const codeText = codeLines.join('\n');
        const blockLang = codeLanguage;
        renderedElements.push(
          <div key={`code-${i}`} className="relative my-4 rounded-lg bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
            <div className="absolute right-3 top-3 flex items-center gap-2">
              {blockLang && (
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-sans font-bold select-none">
                  {blockLang}
                </span>
              )}
              <button
                onClick={() => handleCopyCode(codeText)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedText === codeText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="mt-1">{codeText}</pre>
          </div>
        );
        codeLines = [];
        codeLanguage = '';
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Handle Headings
    if (line.startsWith('# ')) {
      renderedElements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-extrabold text-slate-900 tracking-tight mt-6 mb-4 border-b border-slate-100 pb-2">
          {line.slice(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-slate-800 tracking-tight mt-6 mb-3 flex items-center">
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-base font-semibold text-slate-800 tracking-tight mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // Handle Horizontal Rules
    if (line.trim() === '---') {
      renderedElements.push(<hr key={`hr-${i}`} className="my-6 border-t border-slate-100" />);
      continue;
    }

    // Handle Checkboxes (Interactions)
    const checkboxRegex = /^-\s*\[([ xX])\]\s*(.*)/;
    const checkboxMatch = line.match(checkboxRegex);
    if (checkboxMatch) {
      const isChecked = checkboxMatch[1].toLowerCase() === 'x';
      const taskText = checkboxMatch[2].trim();
      renderedElements.push(
        <div
          key={`check-${i}`}
          onClick={() => onToggleCheck?.(taskText, !isChecked)}
          className="flex items-start gap-3 my-2.5 px-3 py-2 rounded-lg border border-slate-100/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer select-none"
        >
          <span className="mt-0.5 text-slate-500 shrink-0">
            {isChecked ? (
              <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Square className="w-5 h-5 text-slate-400" />
            )}
          </span>
          <span className={`text-sm leading-snug font-medium ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
            {renderTextWithSubDomainLinks(taskText)}
          </span>
        </div>
      );
      continue;
    }

    // Handle Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listContent = line.slice(2).trim();
      renderedElements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1.5 pl-4">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
          <span className="text-sm text-slate-600 leading-relaxed">
            {renderTextWithSubDomainLinks(listContent)}
          </span>
        </div>
      );
      continue;
    }

    // Handle Numbered lists
    const numListRegex = /^(\d+)\.\s*(.*)/;
    const numListMatch = line.match(numListRegex);
    if (numListMatch) {
      const num = numListMatch[1];
      const listContent = numListMatch[2];
      renderedElements.push(
        <div key={`ol-${i}`} className="flex items-start gap-3 my-1.5 pl-2">
          <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
            {num}
          </span>
          <span className="text-sm text-slate-600 leading-relaxed">
            {renderTextWithSubDomainLinks(listContent)}
          </span>
        </div>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      renderedElements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraph text
    renderedElements.push(
      <p key={`p-${i}`} className="text-sm text-slate-600 leading-relaxed my-2">
        {renderTextWithSubDomainLinks(line)}
      </p>
    );
  }

  return <div className="space-y-1">{renderedElements}</div>;
};
