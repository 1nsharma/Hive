import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  Globe,
  Terminal,
  Copy,
  Check,
  Send,
  UserCheck,
  Smartphone,
  RotateCw,
  Code2,
} from 'lucide-react';
import { ScheduledPost, SocialAccount } from '../types';

interface HeadlessDistributionProps {
  scheduledPosts: ScheduledPost[];
  accounts: SocialAccount[];
}

export const HeadlessDistribution: React.FC<HeadlessDistributionProps> = ({ scheduledPosts, accounts }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [apiResponseJson, setApiResponseJson] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const curlCommand = `curl -X GET "https://ais-dev-ue3vl5xhht4qo66to2yn6b-439336978771.asia-southeast1.run.app/api/v1/posts" \\
  -H "Authorization: Bearer dpr_live_key_2026_99" \\
  -H "Content-Type: application/json"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleTestHeadlessEndpoint = async () => {
    setIsLoadingApi(true);
    try {
      const res = await fetch('/api/v1/posts');
      const data = await res.json();
      setApiResponseJson(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Headless CMS & Multi-Account Distribution</h2>
              <span className="text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
                API-First Publisher
              </span>
            </div>
            <p className="text-xs text-slate-400">Headless CMS architecture separates content from UI, serving posts over REST API for simultaneous publish to personal & public profiles</p>
          </div>
        </div>

        <button
          onClick={handleTestHeadlessEndpoint}
          disabled={isLoadingApi}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          {isLoadingApi ? <RotateCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
          <span>Test Headless REST API</span>
        </button>
      </div>

      {/* Grid: Connected Accounts & API Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Connected Personal & Public Social Accounts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Connected Social Media Profiles ({accounts.length})</span>
              <span className="text-[10px] text-teal-400 font-mono">Personal & Public</span>
            </h3>

            <div className="space-y-2.5">
              {accounts.map((acc) => (
                <div key={acc.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={acc.avatarUrl} alt={acc.accountName} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{acc.accountName}</span>
                        <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded ${
                          acc.type === 'personal' ? 'bg-amber-950 text-amber-300' : 'bg-teal-950 text-teal-300'
                        }`}>
                          {acc.type}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">{acc.handle} • {acc.followers} followers</div>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Calendar Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Multi-Platform Dispatch Calendar</span>
              </span>
              <span className="text-[10px] text-teal-400 font-mono">{scheduledPosts.length} Queued</span>
            </h3>

            <div className="space-y-2.5">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-blue-400">{post.platform}</span>
                    <span className="text-[10px] font-bold text-slate-400">{post.scheduledTime}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{post.campaignTitle}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{post.postPreview}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Headless API Inspector & Code Snippet */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>cURL Headless API Request</span>
              </h3>

              <button
                onClick={handleCopyCurl}
                className="text-xs text-teal-400 hover:underline font-bold flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied cURL!' : 'Copy cURL'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
              {curlCommand}
            </pre>

            {apiResponseJson && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Live API Response:</div>
                <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-300 border border-slate-800 max-h-64 overflow-y-auto">
                  {apiResponseJson}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
