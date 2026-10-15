
import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, language, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-700/50">
        <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-slate-300">{title}</span>
            <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-sm text-slate-400 hover:text-white transition-colors flex items-center"
        >
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
             <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
             </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
