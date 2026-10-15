import React, { useState, useEffect } from 'react';
import { SubDomain, Domain, Connection } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { 
  Sparkles, 
  BookOpen, 
  FileEdit, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Save, 
  Trash,
  ArrowRight,
  RefreshCw,
  Gauge
} from 'lucide-react';

interface DocumentEditorProps {
  subDomain: SubDomain | null;
  domain: Domain | null;
  subDomainsList: Array<{ id: string; name: string }>;
  onUpdateContent: (content: string) => void;
  onUpdateStatus: (status: 'draft' | 'review' | 'completed') => void;
  onDeleteSubDomain?: () => void;
  onSubDomainLinkClick: (id: string) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  subDomain,
  domain,
  subDomainsList,
  onUpdateContent,
  onUpdateStatus,
  onDeleteSubDomain,
  onSubDomainLinkClick
}) => {
  const [activeTab, setActiveTab] = useState<'read' | 'edit' | 'ai'>('read');
  const [editText, setEditText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');

  useEffect(() => {
    if (subDomain) {
      setEditText(subDomain.content || '');
      setActiveTab('read');
    }
  }, [subDomain]);

  if (!subDomain || !domain) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">No Module Selected</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
          Select any subdomain node on the map to view, edit, or auto-generate interconnected engineering specifications.
        </p>
      </div>
    );
  }

  // Calculate checklist completion progress
  const calculateChecklistProgress = () => {
    if (!subDomain.content) return { completed: 0, total: 0, percent: 0 };
    const checkboxRegex = /^-\s*\[([ xX])\]/gm;
    const matches = [...subDomain.content.matchAll(checkboxRegex)];
    const total = matches.length;
    if (total === 0) return { completed: 0, total: 0, percent: 0 };
    
    const completed = matches.filter(m => m[1].toLowerCase() === 'x').length;
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100)
    };
  };

  const progress = calculateChecklistProgress();

  const handleSave = () => {
    onUpdateContent(editText);
    setActiveTab('read');
  };

  // Call server API to generate documentation using Gemini
  const handleAIGenerate = async (promptType: 'generate' | 'enhance' | 'checklist') => {
    setIsGenerating(true);
    setGenerationProgress('Orchestrating engineering structures...');
    
    try {
      let promptDesc = subDomain.description;
      if (promptType === 'enhance') {
        promptDesc += " (Focus on highly granular microservices flows, exact schema columns, and production configurations)";
      } else if (promptType === 'checklist') {
        promptDesc += " (Focus heavily on building a comprehensive, step-by-step audit checklist for operational readiness)";
      }

      setGenerationProgress('Consulting Gemini AI API...');
      
      const response = await fetch('/api/knowledge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subDomainId: subDomain.id,
          domainName: domain.name,
          subDomainName: subDomain.name,
          description: promptDesc,
          connections: [] // connections context added server-side
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status during generation');
      }

      const data = await response.json();
      if (data.success && data.content) {
        onUpdateContent(data.content);
        setEditText(data.content);
        setActiveTab('read');
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Failed to compile with Gemini. Please ensure your API key is correctly configured.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  // Toggle tasks inside the markdown file dynamically and write back
  const handleToggleTaskCheck = (taskText: string, isChecked: boolean) => {
    if (!subDomain.content) return;
    
    // Find the task line and toggle the bracket content
    const lines = subDomain.content.split('\n');
    const updatedLines = lines.map(line => {
      if (line.includes(taskText) && (line.startsWith('- [ ]') || line.startsWith('- [x]') || line.startsWith('- [X]'))) {
        return `- [${isChecked ? 'x' : ' '}] ${taskText}`;
      }
      return line;
    });

    const updatedContent = updatedLines.join('\n');
    onUpdateContent(updatedContent);
    setEditText(updatedContent);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header Profile */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/20">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600`}>
              {domain.name}
            </span>
            <span className={`w-2 h-2 rounded-full ${
              subDomain.status === 'completed' ? 'bg-emerald-500' :
              subDomain.status === 'review' ? 'bg-amber-500' : 'bg-slate-300'
            }`} />
            <span className="text-xs text-slate-400 capitalize font-medium">{subDomain.status}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium">Updated: {formatDate(subDomain.lastUpdated)}</span>
          </div>
        </div>

        <h2 className="text-lg font-black text-slate-900 tracking-tight">{subDomain.name}</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subDomain.description}</p>

        {/* Task Progress Bar */}
        {progress.total > 0 && (
          <div className="mt-4 bg-slate-100 h-2 rounded-full overflow-hidden relative flex items-center">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress.percent}%` }}
            />
            <span className="absolute right-2 text-[9px] font-bold text-slate-500 font-mono">
              {progress.completed}/{progress.total} Tasks ({progress.percent}%)
            </span>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('read')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'read'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation</span>
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'edit'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Edit Specs</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'ai'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Architect</span>
        </button>
      </div>

      {/* Scrollable Content Pane */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'read' && (
          <div className="prose prose-slate max-w-none">
            <MarkdownRenderer
              content={subDomain.content}
              onSubDomainLinkClick={onSubDomainLinkClick}
              onToggleCheck={handleToggleTaskCheck}
              subDomainsList={subDomainsList}
            />
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="flex flex-col h-full space-y-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 w-full min-h-[300px] p-4 text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y"
              placeholder="Write your markdown specifications here..."
            />
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Module Status:</span>
                <select
                  value={subDomain.status}
                  onChange={(e) => onUpdateStatus(e.target.value as any)}
                  className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {onDeleteSubDomain && (
                  <button
                    onClick={onDeleteSubDomain}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Module"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-indigo-50 bg-indigo-50/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-bold text-slate-800">Gemini 3.6 Flash Copilot</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect directly to Google GenAI to synthesize robust, interconnected developer documentation, actionable checklists, and physical software architecture models custom-mapped to your system specifications.
              </p>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-8 border border-slate-100 rounded-xl bg-slate-50/50 space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  <Sparkles className="w-5 h-5 text-indigo-600 absolute animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700 animate-pulse">{generationProgress}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Please wait. AI is gathering architectural context.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Operations</div>
                
                <button
                  onClick={() => handleAIGenerate('generate')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-left transition-all cursor-pointer group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Flesh out Standard Specification</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Generate a complete baseline spec with standard patterns.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleAIGenerate('enhance')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-left transition-all cursor-pointer group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Audit & Deepen Architectural Specs</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Augment with complex microservice details and database design.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleAIGenerate('checklist')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-left transition-all cursor-pointer group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Build Interactive Readiness Checklists</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Populate the document with targeted checklist checkboxes.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
