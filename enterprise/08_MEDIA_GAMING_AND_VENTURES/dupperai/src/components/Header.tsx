import React from 'react';
import { Sparkles, Layers, ShieldCheck, Zap, Radio, Globe, UserCheck, Smartphone } from 'lucide-react';
import { BrandKit } from '../types';

interface HeaderProps {
  currentBrand: BrandKit;
  onBrandChange: (brand: BrandKit) => void;
  brandList: BrandKit[];
  activeAccountScope: 'all' | 'personal' | 'public';
  setActiveAccountScope: (scope: 'all' | 'personal' | 'public') => void;
  onNewCampaignClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBrand,
  onBrandChange,
  brandList,
  activeAccountScope,
  setActiveAccountScope,
  onNewCampaignClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Layers className="w-5 h-5 text-teal-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl tracking-tight text-white font-sans">Dupper<span className="text-teal-400">ai</span></h1>
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-teal-950 text-teal-300 border border-teal-800/80 px-2 py-0.5 rounded-full">
              Desktop OS
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Create Once, Adapt Everywhere Distribution Engine</p>
        </div>
      </div>

      {/* Middle Controls: Brand Selector & Account Scope Filter */}
      <div className="flex items-center gap-3 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
        {/* Brand Selector */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 rounded-lg text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 hidden md:inline">Brand Kit:</span>
          <select
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            value={currentBrand.id}
            onChange={(e) => {
              const selected = brandList.find((b) => b.id === e.target.value);
              if (selected) onBrandChange(selected);
            }}
          >
            {brandList.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Personal vs Public Account Toggle */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveAccountScope('all')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeAccountScope === 'all'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 inline mr-1" />
            All Accounts
          </button>
          <button
            onClick={() => setActiveAccountScope('personal')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeAccountScope === 'personal'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 inline mr-1" />
            Personal
          </button>
          <button
            onClick={() => setActiveAccountScope('public')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeAccountScope === 'public'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 inline mr-1" />
            Public / Brand
          </button>
        </div>
      </div>

      {/* Right Controls: System Status & Action */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Headless API:</span>
          <span className="text-emerald-400 font-mono font-semibold">ONLINE</span>
        </div>

        <button
          onClick={onNewCampaignClick}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );
};
