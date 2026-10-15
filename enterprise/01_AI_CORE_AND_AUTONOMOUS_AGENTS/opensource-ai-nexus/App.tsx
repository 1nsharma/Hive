
import React, { useState, useMemo } from 'react';
import { RESOURCES } from './constants';
import { ResourceCategory } from './types';
import ResourceCard from './components/ResourceCard';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(RESOURCES.map(r => r.region)));
    return ['All', ...uniqueRegions];
  }, []);

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          resource.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesRegion = selectedRegion === 'All' || resource.region === selectedRegion;
      
      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [searchTerm, selectedCategory, selectedRegion]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header Section */}
      <header className="relative pt-20 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-600/5 blur-[100px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/5 mb-8 text-[11px] font-bold text-blue-400 uppercase tracking-widest">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Global Open Source Index
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            WORLD <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AI TOOLS</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Discovery engine for the world's best free and open-source models. 
            From DeepSeek in China to Mistral in Europe.
          </p>
        </div>
      </header>

      {/* Main Controls */}
      <div className="sticky top-0 z-40 py-4 glass border-y border-white/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, tech, or region (e.g. 'China coding')..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500/30 text-white placeholder-gray-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Type:</span>
                {['All', ...Object.values(ResourceCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap text-xs font-semibold ${
                      selectedCategory === cat
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Region:</span>
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap text-xs font-semibold ${
                      selectedRegion === reg
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tools match your criteria</h3>
            <p className="text-gray-500 text-sm max-w-sm">Try clearing your filters or search for something more general like 'LLM' or 'USA'.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedRegion('All'); }}
              className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-bold underline underline-offset-4"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* AI Assistant Button & Drawer */}
      <AIChat resources={RESOURCES} />

      {/* Footer */}
      <footer className="mt-32 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">
            A Globally Distributed AI Registry
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-xs font-bold text-white">US</span>
            </div>
            <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-xs font-bold text-white">CHINA</span>
            </div>
            <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-xs font-bold text-white">INDIA</span>
            </div>
            <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs font-bold text-white">EU</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            Built to provide free access to the world's most powerful AI knowledge.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
