import React, { useState } from "react";
import { CURRICULUM_LEVELS } from "../data/curriculumData";
import { CurriculumLevel, CurriculumTopic, DeveloperTag } from "../types";
import {
  Compass,
  Search,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface CurriculumViewProps {
  onOpenChatWithTopic: (topicTitle: string, tag: DeveloperTag) => void;
  onOpenModeler: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  onOpenChatWithTopic,
  onOpenModeler,
}) => {
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>("l0-t1");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [completedTopics, setCompletedTopics] = useState<string[]>(["l0-t1"]);

  const currentLevel: CurriculumLevel = CURRICULUM_LEVELS[selectedLevelIndex];

  // Filter topics based on search
  const filteredLevels = CURRICULUM_LEVELS.filter((lvl) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lvl.title.toLowerCase().includes(q) ||
      lvl.subtitle.toLowerCase().includes(q) ||
      lvl.topics.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.keyInsights.some((k) => k.toLowerCase().includes(q))
      )
    );
  });

  const handleTopicToggle = (topicId: string) => {
    setExpandedTopicId(expandedTopicId === topicId ? null : topicId);
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics([...completedTopics, topicId]);
    }
  };

  const handleQuizSelect = (topicId: string, optionIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [topicId]: optionIndex,
    });
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>The Complete 11-Level Developer Master Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Real Estate Developer → Master Developer Curriculum
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              A comprehensive operational curriculum spanning deal analysis, land economics, capital stacks, RERA due diligence, and city-scale master development.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAR, JDA, RERA, IRR..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Level Horizontal Selector */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex space-x-2 overflow-x-auto no-scrollbar">
          {CURRICULUM_LEVELS.map((lvl, idx) => {
            const isSelected = selectedLevelIndex === idx;
            return (
              <button
                key={lvl.level}
                onClick={() => setSelectedLevelIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700"
                }`}
              >
                <span>Level {lvl.level}</span>
                <span className="opacity-70 text-[10px]">
                  ({lvl.code.substring(0, 4)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Level Header & Details */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                {currentLevel.code}
              </span>
              <span className="text-xs text-slate-400">
                Capital Scope: <strong className="text-slate-200">{currentLevel.estimatedCapitalRange}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              {currentLevel.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1">{currentLevel.subtitle}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-md">
            <span className="text-amber-400 font-semibold uppercase tracking-wider block mb-1">
              🎯 Level Goal & Outcome:
            </span>
            <p className="text-slate-300">{currentLevel.goal}</p>
            <p className="text-emerald-400 font-medium mt-1">✓ {currentLevel.outcome}</p>
          </div>
        </div>

        {/* Motto banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 italic flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>"{currentLevel.keyMotto}"</span>
        </div>

        {/* Topics List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Core Modules in Level {currentLevel.level} ({currentLevel.topics.length} Lessons)
          </h3>

          {currentLevel.topics.map((topic: CurriculumTopic, tIdx: number) => {
            const isExpanded = expandedTopicId === topic.id;
            const isCompleted = completedTopics.includes(topic.id);

            return (
              <div
                key={topic.id}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isExpanded
                    ? "bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Topic Header */}
                <button
                  onClick={() => handleTopicToggle(topic.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {tIdx + 1}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-base text-white">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {topic.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isCompleted && (
                      <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline-block">
                        Completed
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-6 text-sm">
                    {/* Summary */}
                    <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                      {topic.summary}
                    </p>

                    {/* Key Insights */}
                    <div>
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono mb-2.5">
                        Key Developer Principles
                      </h5>
                      <ul className="space-y-2">
                        {topic.keyInsights.map((insight, iIdx) => (
                          <li key={iIdx} className="flex items-start space-x-2 text-slate-300 text-xs sm:text-sm">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Formula or Rule */}
                    {topic.formulaOrRule && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                          Mathematical Rule / Formula:
                        </span>
                        <div className="text-amber-300 font-mono font-medium text-xs sm:text-sm mt-1">
                          {topic.formulaOrRule}
                        </div>
                      </div>
                    )}

                    {/* Real World Example */}
                    <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80">
                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                        🏢 Real-World Execution Scenario:
                      </span>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {topic.realWorldExample}
                      </p>
                    </div>

                    {/* Action Checklist */}
                    {topic.actionChecklist && topic.actionChecklist.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                          Developer Action Steps
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {topic.actionChecklist.map((act, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quiz Check */}
                    {topic.quiz && (
                      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold uppercase text-amber-400 flex items-center space-x-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Knowledge Check</span>
                          </span>
                        </div>
                        <p className="font-medium text-white text-xs sm:text-sm">
                          {topic.quiz.question}
                        </p>

                        <div className="space-y-2 pt-1">
                          {topic.quiz.options.map((opt, oIdx) => {
                            const hasAnswered = quizAnswers[topic.id] !== undefined;
                            const isSelected = quizAnswers[topic.id] === oIdx;
                            const isCorrect = topic.quiz?.correctIndex === oIdx;

                            let btnStyle = "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700";
                            if (hasAnswered) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-950/60 border-emerald-500/80 text-emerald-300 font-semibold";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-red-950/60 border-red-500/80 text-red-300";
                              } else {
                                btnStyle = "bg-slate-900/50 text-slate-500 border-slate-850";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={hasAnswered}
                                onClick={() => handleQuizSelect(topic.id, oIdx)}
                                className={`w-full p-3 rounded-lg border text-left text-xs sm:text-sm transition-all ${btnStyle}`}
                              >
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {quizAnswers[topic.id] !== undefined && (
                          <div className="pt-2 text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <strong className="text-amber-400">Analysis: </strong>
                            {topic.quiz.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Ask AI Copilot Action */}
                    <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                      <button
                        onClick={() =>
                          onOpenChatWithTopic(
                            topic.title,
                            currentLevel.level <= 1 ? "LEARN" : "STRATEGY"
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-slate-700"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Discuss with AI Developer HQ Copilot</span>
                      </button>

                      {currentLevel.level === 1 && (
                        <button
                          onClick={onOpenModeler}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <span>Open Financial Modeler</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
