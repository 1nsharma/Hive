import React, { useState } from 'react';
import { Phase, Language, PhaseTask } from '../types';
import { Check, Layers, ChevronRight, Sparkles, CheckCircle2, Circle, Shield, Cpu, Zap } from 'lucide-react';

interface PhasesSectionProps {
  phases: Phase[];
  lang: Language;
  onToggleTask: (phaseId: string, taskId: string) => void;
  onSelectOption: (optionId: '1' | '2' | '3') => void;
}

export const PhasesSection: React.FC<PhasesSectionProps> = ({
  phases,
  lang,
  onToggleTask,
  onSelectOption,
}) => {
  const [activePhaseId, setActivePhaseId] = useState<string>('phase-1');

  return (
    <section id="phases" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-xs font-semibold tracking-wider text-[#22d3ee] uppercase mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'तीन चरणों में क्रियान्वयन' : '3-Phase Systematic Execution'}</span>
          </div>
          
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            {lang === 'hi' ? 'व्यवस्थित विकास रोडमैप' : 'Structured Growth Roadmap'}
          </h2>
          
          <p className="text-base sm:text-lg text-[#9a9ab0] leading-relaxed">
            {lang === 'hi'
              ? 'ब्रांड पहचान से लेकर बाज़ार में लॉन्च और स्केलिंग तक — हर चरण स्पष्ट, मापने योग्य और सीधे क्रियान्वयन योग्य है।'
              : 'From brand positioning to MVP engineering and global scale — each phase is concrete, verifiable, and executable.'}
          </p>
        </div>

        {/* 3-Column Phase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {phases.map((phase, idx) => {
            const completedCount = phase.tasks.filter((t) => t.completed).length;
            const progress = Math.round((completedCount / phase.tasks.length) * 100);
            const isSelected = activePhaseId === phase.id;

            return (
              <div
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`relative rounded-2xl p-6 sm:p-7 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#7c5cff]/15 via-white/[0.04] to-transparent border-[#7c5cff]/60 shadow-[0_12px_40px_rgba(124,92,255,0.2)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                {/* Top Glowing bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] opacity-80" />

                <div>
                  {/* Top metadata row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5cff]/20 to-[#22d3ee]/20 border border-[#7c5cff]/30 flex items-center justify-center font-display font-extrabold text-xl text-[#c4b5fd]">
                      {phase.num}
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#93c5fd]">
                        {lang === 'hi' ? phase.badgeHi : phase.badgeEn}
                      </span>
                      <span className="text-[11px] text-[#9a9ab0] mt-1 font-mono">
                        {lang === 'hi' ? phase.targetMetricHi : phase.targetMetricEn}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-bold text-xl text-white mb-2">
                    {lang === 'hi' ? phase.titleHi : phase.titleEn}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#9a9ab0] leading-relaxed mb-6">
                    {lang === 'hi' ? phase.descriptionHi : phase.descriptionEn}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-[#9a9ab0] mb-1.5 font-mono">
                      <span>{lang === 'hi' ? 'प्रगति' : 'Progress'}</span>
                      <span className="text-[#22d3ee] font-semibold">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="space-y-2.5 mb-6">
                    {phase.tasks.map((task: PhaseTask) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(phase.id, task.id);
                        }}
                        className={`group p-2.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                          task.completed
                            ? 'bg-[#22d3ee]/5 border-[#22d3ee]/20 text-[#e7e7f0]'
                            : 'bg-white/[0.02] border-white/5 text-[#9a9ab0] hover:border-white/15'
                        }`}
                      >
                        <button
                          type="button"
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            task.completed
                              ? 'bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] text-white'
                              : 'border border-white/20 hover:border-[#22d3ee]'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <div className="flex-1">
                          <span className={task.completed ? 'line-through text-[#9a9ab0]' : 'text-white'}>
                            {lang === 'hi' ? task.textHi : task.textEn}
                          </span>
                          {task.techStack && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-[#22d3ee] font-mono">
                              <Cpu className="w-3 h-3" />
                              <span>{task.techStack}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick-Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const targetOption = (idx + 1).toString() as '1' | '2' | '3';
                    onSelectOption(targetOption);
                  }}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>
                    {lang === 'hi'
                      ? `चरण ${phase.num} का क्रियान्वयन स्टूडियो खोलें`
                      : `Open Phase ${phase.num} Studio`}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#22d3ee]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Phase Action Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#7c5cff]/10 via-[#3b82f6]/10 to-[#22d3ee]/10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7c5cff]/20 border border-[#7c5cff]/40 flex items-center justify-center text-[#c4b5fd]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {lang === 'hi' ? 'चरणबद्ध प्रगति ट्रैकर' : 'Milestone Checklist System'}
              </h4>
              <p className="text-xs text-[#9a9ab0]">
                {lang === 'hi'
                  ? 'कार्यों पर क्लिक करके उन्हें पूरा चिन्हित करें। आपकी प्रगति ब्राउज़र में सुरक्षित रहेगी।'
                  : 'Click any task item above to mark as completed. Progress persists automatically.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onSelectOption('2')}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-center"
            >
              {lang === 'hi' ? 'तकनीकी MVP शुरू करें →' : 'Launch Technical MVP →'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
