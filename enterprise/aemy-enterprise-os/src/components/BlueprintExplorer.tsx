import React, { useState, useMemo } from 'react';
import { BLUEPRINT_VOLUMES } from '../data/canonicalBlueprint';
import { VolumeChapter, BlueprintVolume } from '../types/blueprint';
import { 
  Search, 
  BookOpen, 
  Layers, 
  Tag, 
  Download, 
  ArrowLeft, 
  ArrowRight,
  Code2,
  Sparkles,
  Flame,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface BlueprintExplorerProps {
  activeLanguage: 'en' | 'hi';
}

export const BlueprintExplorer: React.FC<BlueprintExplorerProps> = ({ activeLanguage }) => {
  const [selectedVolumeId, setSelectedVolumeId] = useState<number>(1);
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedChapters, setBookmarkedChapters] = useState<number[]>([1, 10, 25, 67, 85]);

  const selectedVolume = BLUEPRINT_VOLUMES.find(v => v.id === selectedVolumeId) || BLUEPRINT_VOLUMES[0];
  
  // All chapters flat list for global search
  const allChapters = useMemo(() => {
    return BLUEPRINT_VOLUMES.flatMap(v => v.chapters);
  }, []);

  const selectedChapter = useMemo(() => {
    return allChapters.find(c => c.id === selectedChapterId) || allChapters[0];
  }, [allChapters, selectedChapterId]);

  // Filtered chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedVolume.chapters;
    }
    const query = searchQuery.toLowerCase();
    return allChapters.filter(c => 
      c.title.toLowerCase().includes(query) ||
      c.subtitle.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query) ||
      c.content.toLowerCase().includes(query) ||
      c.tags.some(t => t.toLowerCase().includes(query)) ||
      c.volumeName.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedVolume, allChapters]);

  const toggleBookmark = (id: number) => {
    if (bookmarkedChapters.includes(id)) {
      setBookmarkedChapters(bookmarkedChapters.filter(b => b !== id));
    } else {
      setBookmarkedChapters([...bookmarkedChapters, id]);
    }
  };

  const handleExportVolumeMarkdown = () => {
    const text = `# APNI DUNIYA — ${selectedVolume.number}: ${selectedVolume.title}\n\n${selectedVolume.tagline}\n\n` +
      selectedVolume.chapters.map(ch => 
        `## ${ch.title}: ${ch.subtitle}\n\n` +
        `> **Key Axiom:** ${ch.keyAxiom}\n\n` +
        `### Summary\n${ch.summary}\n\n` +
        `### Canonical Architecture\n${ch.content}\n\n` +
        `**Architectural Rule:** \`${ch.architecturalRule}\`\n\n` +
        `**Tags:** ${ch.tags.join(', ')}\n\n---\n`
      ).join('\n');

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apni-Duniya-${selectedVolume.number}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-indigo-950/40 to-stone-900 border border-indigo-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
              THE 12-VOLUME MASTER BLUEPRINT
            </span>
            <span className="text-stone-400 text-xs font-mono">
              85 CANONICAL CHAPTERS
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? '12 खंड महा-प्रारूप अन्वेषक' : 'Canonical System Architecture & Specification'}
          </h2>
          <p className="text-stone-300 text-sm">
            Complete, unambiguous documentation covering every layer from Soul to Long-Term Civilization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="export-volume-md-btn"
            onClick={handleExportVolumeMarkdown}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Volume {selectedVolume.id} (.MD)</span>
          </button>
        </div>
      </div>

      {/* Search & Volume Selector Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="blueprint-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all 85 chapters, architectural rules, tags (e.g., 'zero-knowledge', 'death-valley', 'lens')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Volume Quick Pills (if not searching globally) */}
      {!searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
          {BLUEPRINT_VOLUMES.map((vol) => {
            const isSelected = selectedVolumeId === vol.id;
            return (
              <button
                key={vol.id}
                id={`vol-pill-${vol.id}`}
                onClick={() => {
                  setSelectedVolumeId(vol.id);
                  if (vol.chapters.length > 0) {
                    setSelectedChapterId(vol.chapters[0].id);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                {vol.number}: {vol.title.split('—')[0].trim()}
              </button>
            );
          })}
        </div>
      )}

      {/* Main 2-Column Split: Chapter Index & Full Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chapter Index Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 px-1">
            <span>
              {searchQuery ? `Search Results (${filteredChapters.length})` : `Volume ${selectedVolume.id} Chapters (${filteredChapters.length})`}
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-indigo-400 hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
            {filteredChapters.length === 0 ? (
              <div className="p-6 text-center text-stone-500 text-sm bg-stone-900/50 rounded-xl border border-stone-800">
                No chapters matched your search query.
              </div>
            ) : (
              filteredChapters.map((chapter) => {
                const isSelected = selectedChapter.id === chapter.id;
                const isBookmarked = bookmarkedChapters.includes(chapter.id);
                return (
                  <button
                    key={chapter.id}
                    id={`chapter-item-${chapter.id}`}
                    onClick={() => {
                      setSelectedChapterId(chapter.id);
                      setSelectedVolumeId(chapter.volumeId);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-indigo-400 mb-1">
                      <span>{chapter.volumeName}</span>
                      {isBookmarked && (
                        <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <div className="font-semibold text-sm text-stone-100">
                      {chapter.title}
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-1 font-light">
                      {chapter.subtitle}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Deep Chapter Reading Pane */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 md:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
            {/* Chapter Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    VOLUME {selectedChapter.volumeId} &bull; {selectedChapter.volumeName}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white pt-1">
                  {selectedChapter.title}
                </h1>
                <p className="text-stone-400 text-sm md:text-base font-light">
                  {selectedChapter.subtitle}
                </p>
              </div>

              <button
                onClick={() => toggleBookmark(selectedChapter.id)}
                className={`p-2 rounded-xl border transition-colors shrink-0 ${
                  bookmarkedChapters.includes(selectedChapter.id)
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
                title="Bookmark chapter"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Key Axiom Box */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <div className="text-[11px] font-mono uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Core Axiom</span>
              </div>
              <p className="text-indigo-200 font-serif italic text-sm md:text-base leading-relaxed">
                "{selectedChapter.keyAxiom}"
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Executive Summary
              </h3>
              <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                {selectedChapter.summary}
              </p>
            </div>

            {/* Full Canonical Content */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Canonical Architecture & Specification
              </h3>
              <div className="text-stone-200 text-sm md:text-base leading-relaxed space-y-4 font-light whitespace-pre-line bg-stone-950/60 p-5 rounded-xl border border-stone-800/80">
                {selectedChapter.content}
              </div>
            </div>

            {/* Architectural Rule Callout */}
            <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/40 space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Hardcoded Architectural Invariant Rule</span>
              </div>
              <code className="text-xs font-mono text-amber-300 block bg-stone-900 p-2.5 rounded overflow-x-auto">
                {selectedChapter.architecturalRule}
              </code>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
              <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags:
              </span>
              {selectedChapter.tags.map((tag, tIdx) => (
                <span 
                  key={tIdx}
                  className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-xs border border-stone-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Next / Previous Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800 text-xs font-mono">
              <button
                disabled={selectedChapter.id <= 1}
                onClick={() => {
                  const prevId = selectedChapter.id - 1;
                  const prevCh = allChapters.find(c => c.id === prevId);
                  if (prevCh) {
                    setSelectedChapterId(prevId);
                    setSelectedVolumeId(prevCh.volumeId);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-stone-300 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Chapter
              </button>

              <span className="text-stone-500">
                Chapter {selectedChapter.id} of {allChapters.length}
              </span>

              <button
                disabled={selectedChapter.id >= allChapters.length}
                onClick={() => {
                  const nextId = selectedChapter.id + 1;
                  const nextCh = allChapters.find(c => c.id === nextId);
                  if (nextCh) {
                    setSelectedChapterId(nextId);
                    setSelectedVolumeId(nextCh.volumeId);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-stone-300 flex items-center gap-1.5"
              >
                Next Chapter <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
