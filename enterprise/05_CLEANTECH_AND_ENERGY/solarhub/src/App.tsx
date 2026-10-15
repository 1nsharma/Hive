import React from 'react';
import { categories } from './data';
import { OpsCard } from './components/OpsCard';
import { ComparisonTable } from './components/ComparisonTable';
import { AnalogySection } from './components/Analogy';
import { Layers } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-indigo-500/10 via-slate-950/0 to-transparent pointer-events-none blur-[100px] -z-10"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
        
        {/* Header Unit */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium tracking-wide shadow-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Operational Disciplines</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight leading-tight">
            AIOps <span className="opacity-40 font-light mx-2">vs</span> 
            LLMOps <span className="opacity-40 font-light mx-2">vs</span> 
            MLOps
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-medium leading-relaxed">
            Comparing the three core operational disciplines in modern AI and data systems.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <OpsCard key={category.id} data={category} />
          ))}
        </section>

        {/* Comparison Table */}
        <section>
          <ComparisonTable />
        </section>

        {/* Analogy & Convergence */}
        <section>
          <AnalogySection />
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-12 text-center text-slate-500 text-sm font-medium">
        <p>A comprehensive overview of AI Operations Lifecycle.</p>
      </footer>
    </div>
  );
}
