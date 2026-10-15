
import React, { useState } from 'react';
import { Resource } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'connect' | 'compare'>('info');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.howToConnect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col h-full transition-all duration-300 hover:border-blue-500/50 hover:bg-white/5 border border-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            {CATEGORY_ICONS[resource.category]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{resource.name}</h3>
            <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
              {resource.region}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          FREE
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-4 text-xs font-medium">
        <button 
          onClick={() => setActiveTab('info')}
          className={`pb-2 px-1 mr-4 transition-colors ${activeTab === 'info' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Info
        </button>
        <button 
          onClick={() => setActiveTab('connect')}
          className={`pb-2 px-1 mr-4 transition-colors ${activeTab === 'connect' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Connect
        </button>
        <button 
          onClick={() => setActiveTab('compare')}
          className={`pb-2 px-1 transition-colors ${activeTab === 'compare' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Compare
        </button>
      </div>
      
      <div className="flex-grow min-h-[160px] flex flex-col">
        {activeTab === 'info' && (
          <div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
              {resource.description}
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
              <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1">Primary Use Case</span>
              <p className="text-xs text-gray-300">{resource.useCase}</p>
            </div>
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="relative group flex-grow">
            <div className="bg-black/60 rounded-xl p-3 border border-white/10 font-mono text-[11px] text-blue-200 h-full overflow-y-auto max-h-[160px] whitespace-pre-wrap">
              {resource.howToConnect}
            </div>
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 transition-all opacity-0 group-hover:opacity-100"
              title="Copy snippet"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              )}
            </button>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <div className="p-1 rounded bg-blue-500/20 text-blue-400 mt-0.5 shrink-0">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 011.512-.306c.736.06 1.39.391 1.775.868.346.427.501.931.517 1.413.017.492-.113 1.042-.456 1.587-.34.54-.86 1.123-1.636 1.527-.776.404-1.745.59-2.735.495a12.607 12.607 0 01-1.615-.292c-.676-.174-1.285-.45-1.758-.832a1 1 0 00-1.272 1.543c.71.583 1.57.962 2.508 1.203.468.12 1.012.217 1.597.283a15.42 15.42 0 001.761.08c1.332-.012 2.7-.272 3.844-.868 1.144-.596 1.956-1.536 2.454-2.327.498-.79.72-1.722.695-2.618-.024-.897-.282-1.848-.93-2.647-.647-.799-1.64-1.374-2.825-1.47a1.64 1.64 0 00-.54.01c.068-.456.164-.935.295-1.432.132-.497.306-1.01.547-1.513.24-.502.56-.995.961-1.41a1 1 0 00-.384-1.453z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-xs text-gray-400 italic leading-relaxed">"{resource.comparison}"</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5 mt-4">
        {resource.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-blue-500/5 text-blue-300 border border-blue-500/10">
            {tag}
          </span>
        ))}
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors gap-2 mt-auto"
      >
        Access Link
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
};

export default ResourceCard;
