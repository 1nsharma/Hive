import React, { useState } from 'react';
import { 
  Radar, 
  Search, 
  Flame, 
  TrendingUp, 
  Clock, 
  Terminal, 
  Play, 
  Pause, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  Code2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { GamingTrend, ScraperDaemonState, ScraperLog } from '../types';

interface TrendRadarModuleProps {
  trends: GamingTrend[];
  scraperStatus: ScraperDaemonState;
  logs: ScraperLog[];
  onTriggerScrape: (keyword?: string) => Promise<void>;
  onToggleDaemon: () => void;
  onSelectTrendForSynthesis: (trend: GamingTrend) => void;
  isScraping: boolean;
}

export const TrendRadarModule: React.FC<TrendRadarModuleProps> = ({
  trends,
  scraperStatus,
  logs,
  onTriggerScrape,
  onToggleDaemon,
  onSelectTrendForSynthesis,
  isScraping
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customKeyword, setCustomKeyword] = useState<string>('');
  const [showCodePreview, setShowCodePreview] = useState<boolean>(false);

  const categories = ['all', 'Cricket', 'Cooking/Cozy', 'Regional Culture', 'Monetization', 'Mechanics', 'Multiplayer'];

  const filteredTrends = trends.filter(trend => {
    const matchesCat = selectedCategory === 'all' || trend.category === selectedCategory;
    const matchesSearch = trend.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trend.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          trend.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleManualScrape = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerScrape(customKeyword);
    setCustomKeyword('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Radar className="w-4 h-4" />
              <span>Module 1: The "Trend Radar" (Automated Data Scraper)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              24/7 Market Intelligence & Gaming Culture Ingestion
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              A Python background daemon running on a 12-hour cadence, harvesting conversations from <span className="text-amber-300 font-medium">r/IndianGaming</span>, Steam India leaderboards, and mobile casual store revenue spikes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>{showCodePreview ? 'Hide Python Daemon' : 'View trend_scraper.py'}</span>
            </button>

            <button
              onClick={onToggleDaemon}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                scraperStatus.isRunning
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              {scraperStatus.isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daemon: Running (12h)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daemon: Paused</span>
                </>
              )}
            </button>

            <button
              onClick={() => onTriggerScrape()}
              disabled={isScraping}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-orange-500/10 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? 'Scraping Live Trends...' : 'Trigger Research Cycle Now'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Total Trends Ingested</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{trends.length} Records</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Research Cycle Cadence</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">Every 12 Hours</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Last Ingest Time</span>
            <span className="text-xl font-bold text-slate-200 font-mono mt-0.5 block">{scraperStatus.lastScraped || 'Active now'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Active Radar Sources</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">5 Portals Live</span>
          </div>
        </div>
      </div>

      {/* Optional Python Scraper Daemon Code Inspection */}
      {showCodePreview && (
        <div className="rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="text-xs font-mono text-slate-300 ml-2">research/trend_scraper.py (Python 3.11 Daemon)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              schedule.every(12).hours.do(scrape_indian_gaming_trends)
            </span>
          </div>
          <pre className="p-4 text-xs font-mono text-amber-200 bg-slate-950 overflow-x-auto leading-relaxed max-h-72">
{`import json
import time
import schedule
import requests
from bs4 import BeautifulSoup

def scrape_indian_gaming_trends():
    """
    Scrapes r/IndianGaming, Steam India charts, and mobile game trends 
    to find what mechanics/monetization are currently working.
    """
    print("🔍 Starting Daily Trend Research...")
    
    # 1. Scrape Reddit r/IndianGaming for trending topics
    headers = {'User-Agent': 'DesiArcadeBot/1.0'}
    reddit_url = "https://old.reddit.com/r/IndianGaming/top/?t=week"
    response = requests.get(reddit_url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    trends = []
    for thing in soup.find_all('div', class_='thing'):
        title = thing.find('a', class_='title').text
        if any(keyword in title.lower() for keyword in ['cricket', 'kabaddi', 'cozy', 'ludo', 'carrom', 'multiplayer']):
            trends.append({"source": "Reddit", "topic": title, "sentiment": "high_engagement"})

    # 2. Mock App Store / Play Store API call for top grossing India casual games
    top_india_casual = [
        {"game": "Ludo King", "mechanic": "Daily Tournaments", "monetization": "Cosmetics"},
        {"game": "Teen Patti Gold", "mechanic": "Live Dealers", "monetization": "Chips IAP"}
    ]
    trends.extend(top_india_casual)

    # Save to JSON for the AI Agent to read
    with open('research/trend_data.json', 'w') as f:
        json.dump(trends, f, indent=2)
    
    print(f"✅ Found {len(trends)} new trends. Saved to trend_data.json")

schedule.every(12).hours.do(scrape_indian_gaming_trends)`}
          </pre>
        </div>
      )}

      {/* Main Content Layout: Trends List & Live Scraper Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Trend Explorer */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Search, Filter Bar & Manual Query Injector */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search scraped trends, keywords, or source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Custom Scrape Input Form */}
              <form onSubmit={handleManualScrape} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scrape specific theme (e.g. IPL, Biryani)..."
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 min-w-[200px]"
                />
                <button
                  type="submit"
                  disabled={isScraping}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Scrape</span>
                </button>
              </form>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Trends' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Trend Cards Feed */}
          <div className="space-y-3">
            {filteredTrends.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                <Radar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No matching gaming trends found</p>
                <p className="text-xs text-slate-500 mt-1">Try triggering a new scrape cycle or altering your filter.</p>
              </div>
            ) : (
              filteredTrends.map(trend => (
                <div
                  key={trend.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    {/* Trend Information */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          trend.source === 'Reddit' ? 'bg-orange-950 text-orange-400 border border-orange-500/30' :
                          trend.source === 'Steam India' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' :
                          trend.source === 'Google Play' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          trend.source === 'App Store' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                          'bg-sky-950 text-sky-400 border border-sky-500/30'
                        }`}>
                          {trend.source}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                          {trend.category}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          <span>{trend.engagementScore}/100 Momentum</span>
                        </span>

                        <span className="text-[11px] text-slate-500 font-mono ml-auto">
                          {trend.timestamp}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {trend.topic}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {trend.sampleSnippet}
                      </p>

                      {/* Suggested Game & Mechanic */}
                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                        <div className="text-[11px] text-amber-400/90 font-semibold mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Suggested Feature Target ({trend.suggestedGame.replace('_', ' ').toUpperCase()}):</span>
                        </div>
                        <p className="text-slate-300 font-medium">
                          {trend.suggestedFeature}
                        </p>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {trend.keywords.map(kw => (
                          <span key={kw} className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 font-mono border border-slate-800/60">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Synthesize Action Button */}
                    <div className="sm:self-center flex-shrink-0">
                      <button
                        onClick={() => onSelectTrendForSynthesis(trend)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm group/btn"
                      >
                        <span>Synthesize GDScript</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Live Daemon Telemetry & Logs */}
        <div className="space-y-4">
          
          {/* Active Scraping Portals Radar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Radar className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Active Ingestion Feeds</span>
            </h3>

            <div className="space-y-2">
              {[
                { name: 'Reddit r/IndianGaming', status: '200 OK', count: '14 hot threads', speed: '48ms' },
                { name: 'Steam India Charts API', status: '200 OK', count: '50 top grossing', speed: '120ms' },
                { name: 'Google Play Casual (India)', status: '200 OK', count: '100 casual ranks', speed: '85ms' },
                { name: 'Apple App Store (India)', status: '200 OK', count: 'Top Action & Food', speed: '92ms' },
                { name: 'Desi Gaming Discord Channels', status: 'STREAMING', count: '8 active guilds', speed: 'Live' }
              ].map((feed, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                  <div>
                    <div className="font-semibold text-slate-200 text-[11px]">{feed.name}</div>
                    <div className="text-[10px] text-slate-400">{feed.count}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      {feed.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{feed.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scraper Daemon Log Console */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>daemon_stdout.log</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                POLLING
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] max-h-80 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="leading-relaxed flex items-start gap-2">
                  <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-400' :
                    log.type === 'error' ? 'text-red-400' :
                    'text-slate-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
