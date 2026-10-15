import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Tag, Shield, ShoppingBag, Stethoscope, Briefcase, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { FuzzySearcher, SearchableItem, FuzzySearchResult } from '../lib/fuzzySearch';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

const DEFAULT_SEARCH_ITEMS: SearchableItem[] = [
  {
    id: 'tag-collar',
    title: 'PetJanu Smart Dual-Tech Collar (NFC + Dynamic QR)',
    category: 'product',
    description: 'Instant recovery collar with zero app needed for finder, waterproof and durable.',
    tags: ['collar', 'tag', 'nfc', 'qr', 'smart', 'hardware', 'shop'],
    actionUrl: 'marketplace',
    badge: '₹499'
  },
  {
    id: 'vet-consult',
    title: '24/7 Verified Emergency Vet Teleconsultation',
    category: 'service',
    description: 'Connect with certified Indian veterinarians within 10 minutes for acute triage.',
    tags: ['vet', 'doctor', 'clinic', 'emergency', 'medical', 'consultation'],
    actionUrl: 'health',
    badge: '24/7 Available'
  },
  {
    id: 'sos-radar',
    title: 'Live SOS Lost Pet Radar & Community Broadcasting',
    category: 'service',
    description: 'Broadcast instant emergency missing pet alerts to pet parents within 5km.',
    tags: ['sos', 'lost', 'radar', 'missing', 'finder', 'gps', 'broadcast'],
    actionUrl: 'safety',
    badge: 'Emergency'
  },
  {
    id: 'ai-symptom',
    title: 'AI Pet Symptom & Urgency Triage Analyzer',
    category: 'guide',
    description: 'Immediate AI triage for vomiting, toxin ingestion, breathing issues and fever.',
    tags: ['ai', 'symptom', 'triage', 'sick', 'vomit', 'poison', 'emergency'],
    actionUrl: 'health',
    badge: 'AI Powered'
  },
  {
    id: 'job-walker',
    title: 'Professional Pet Walker & Boarding Partner',
    category: 'job',
    description: 'Earn ₹15,000–₹35,000/month providing certified pet walking and daycare in your locality.',
    tags: ['job', 'work', 'walker', 'care', 'boarding', 'earn', 'partner'],
    actionUrl: 'jobs',
    badge: 'Hiring'
  },
  {
    id: 'guide-vaccine',
    title: 'Core Canine & Feline Vaccination Schedule (India)',
    category: 'guide',
    description: 'Complete guide for Rabies, DHPPi, Anti-Corona and annual boosters in India.',
    tags: ['vaccine', 'rabies', 'dhppi', 'schedule', 'shots', 'puppy'],
    actionUrl: 'health',
    badge: 'Guide'
  },
  {
    id: 'pet-translator',
    title: 'AI Pet Voice Translator & Behavioral Training Studio',
    category: 'guide',
    description: 'Speak in Hindi or English, translate voice to pet vocalizations with authentic Web Audio acoustics.',
    tags: ['translator', 'voice', 'sound', 'bark', 'meow', 'training', 'talk', 'ai', 'listen', 'bilingual'],
    actionUrl: 'pet-translator',
    badge: 'AI Flagship'
  },
  {
    id: 'nutrition-planner',
    title: 'AI Veterinary Nutrition & Calorie Planner',
    category: 'guide',
    description: 'Calculate exact daily calories, home-cooked Indian diet portions, and water goals.',
    tags: ['nutrition', 'diet', 'calories', 'food', 'weight', 'meal', 'calculator', 'kibble'],
    actionUrl: 'nutrition',
    badge: 'AI Lab'
  },
  {
    id: 'passport-card',
    title: 'Emergency Digital Health Passport & QR Wallet Card',
    category: 'service',
    description: 'Credit-card sized printable emergency passport with vaccine records and recovery QR.',
    tags: ['passport', 'card', 'wallet', 'emergency', 'medical', 'id', 'print', 'qr'],
    actionUrl: 'passport',
    badge: 'Wallet'
  },
  {
    id: 'sos-live-radar',
    title: 'Live SOS Neighborhood Incident Command Radar',
    category: 'service',
    description: 'Interactive radar sweep with radius controls, volunteer alerts, and emergency vet pins.',
    tags: ['radar', 'incident', 'command', 'map', 'lost', 'sighting', 'broadcast'],
    actionUrl: 'radar',
    badge: 'Live Radar'
  }
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searcher = useMemo(() => new FuzzySearcher(DEFAULT_SEARCH_ITEMS), []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return DEFAULT_SEARCH_ITEMS.filter(
        item => selectedCategory === 'all' || item.category === selectedCategory
      ).map(item => ({ item, score: 0, matches: [] }));
    }

    const raw = searcher.search(query);
    if (selectedCategory === 'all') return raw;
    return raw.filter(r => r.item.category === selectedCategory);
  }, [query, selectedCategory, searcher]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].item);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (item: SearchableItem) => {
    if (item.actionUrl) {
      onNavigateTab(item.actionUrl);
    }
    onClose();
  };

  const getCategoryIcon = (cat: SearchableItem['category']) => {
    switch (cat) {
      case 'product': return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'service': return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'job': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'guide': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <Shield className="w-4 h-4 text-[#175741]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search smart tags, SOS alerts, vet care, jobs, or AI triage..."
            className="w-full bg-transparent text-stone-900 text-sm sm:text-base font-medium focus:outline-none placeholder:text-stone-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex text-[10px] font-mono font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-md border border-stone-200">
            ESC to close
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-stone-100 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'product', label: 'Products' },
            { id: 'service', label: 'Services & Vets' },
            { id: 'guide', label: 'Care Guides' },
            { id: 'job', label: 'Jobs' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#175741] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-stone-100">
          {results.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No matches found for "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for "collar", "vet", "vaccine", or "job"</p>
            </div>
          ) : (
            results.map((res, idx) => {
              const item = res.item;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-emerald-50/80 border border-emerald-200' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-stone-100 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                        Select <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Powered by PetJanu Zero-Latency Fuzzy Index</span>
          <span className="hidden sm:inline">Use ↑ ↓ arrows to navigate</span>
        </div>
      </div>
    </div>
  );
};
