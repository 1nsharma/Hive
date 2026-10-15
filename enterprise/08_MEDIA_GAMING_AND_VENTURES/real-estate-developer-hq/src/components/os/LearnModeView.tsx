import React, { useState } from "react";
import { LEARN_ENGINE_LESSONS } from "../../data/developerOsData";
import { OSStage } from "../../types";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Send,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const LearnModeView: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    LEARN_ENGINE_LESSONS[0].id
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Mentor custom question state
  const [customQuestion, setCustomQuestion] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);

  const currentLesson =
    LEARN_ENGINE_LESSONS.find((l) => l.id === selectedLessonId) ||
    LEARN_ENGINE_LESSONS[0];

  const handleSelectOption = (optionIndex: number) => {
    if (quizSubmitted[currentLesson.id]) return;
    setQuizAnswers((prev) => ({ ...prev, [currentLesson.id]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted((prev) => ({ ...prev, [currentLesson.id]: true }));
  };

  const handleAskMentor = async (queryToAsk?: string) => {
    const q = queryToAsk || customQuestion;
    if (!q.trim()) return;
    setMentorLoading(true);
    setMentorResponse(null);

    try {
      const res = await fetch("/api/developer-os/learn-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          stage: currentLesson.stageName,
          topicContext: currentLesson.headline,
        }),
      });
      const data = await res.json();
      setMentorResponse(data.answer || "Mentor response could not be generated.");
    } catch (err: any) {
      setMentorResponse(`Error: ${err.message || "Failed to reach mentor."}`);
    } finally {
      setMentorLoading(false);
    }
  };

  const selectedOption = quizAnswers[currentLesson.id];
  const isSubmitted = quizSubmitted[currentLesson.id];
  const isCorrect = selectedOption === currentLesson.interactiveExercise.correctIndex;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider mb-3 border border-indigo-500/30">
              <GraduationCap className="w-4 h-4" />
              LEARN MODE • 7-Engine Mastery
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Master Developer Mental Models & Economics
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Progressively learn how institutional developers evaluate parcels, structure zero-land-debt JDAs, navigate RERA 70:30 escrows, and scale into multi-city urban platforms.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Teach me how JDA works",
              "How does RERA 70:30 escrow work?",
              "What is Purchasable FAR?",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setCustomQuestion(prompt);
                  handleAskMentor(prompt);
                }}
                className="text-xs bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lesson Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            7 Development Engines Curriculum
          </div>
          {LEARN_ENGINE_LESSONS.map((lesson, idx) => {
            const isSelected = lesson.id === selectedLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonId(lesson.id);
                  setMentorResponse(null);
                }}
                className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-indigo-950/70 border-indigo-500/60 shadow-lg text-white ring-1 ring-indigo-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 text-slate-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  0{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-indigo-400">
                    Engine {idx + 1}
                  </div>
                  <div className="font-bold text-sm text-slate-100 truncate">
                    {lesson.stageName.split(". ")[1]}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {lesson.headline}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 mt-2 shrink-0 ${
                    isSelected ? "text-indigo-400" : "text-slate-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Engine Deep Dive */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Lesson Body */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{currentLesson.stageName}</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
              {currentLesson.headline}
            </h2>

            {/* Core Principle Callout */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-r-2xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase mb-1">
                <Lightbulb className="w-4 h-4" />
                The Core Principle
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {currentLesson.corePrinciple}
              </p>
            </div>

            {/* How Top Developers Think vs Heuristic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs font-mono font-semibold text-emerald-400 uppercase mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  How Top Developers Think
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {currentLesson.howTopDevelopersThink}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs font-mono font-semibold text-sky-400 uppercase mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Indian Market Heuristic
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {currentLesson.indianMarketHeuristic}
                </p>
              </div>
            </div>

            {/* Formula / Rule */}
            <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4">
              <div className="text-[11px] font-mono text-indigo-400 uppercase mb-1">
                Mathematical Formula / Hard Rule
              </div>
              <div className="font-mono text-sm md:text-base text-indigo-200 bg-indigo-950/40 px-3 py-2 rounded-xl border border-indigo-500/20">
                {currentLesson.formulaOrRule}
              </div>
            </div>

            {/* Pitfalls */}
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                Pitfalls That Bankrupt Amateur Developers
              </div>
              <ul className="space-y-2">
                {currentLesson.pitfallsToAvoid.map((pitfall, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-300 bg-rose-500/5 border border-rose-500/20 p-2.5 rounded-xl"
                  >
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real World Case Study */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase">
                  Real-World War Story
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {currentLesson.sampleRealWorldCase.city}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">
                {currentLesson.sampleRealWorldCase.dealScenario}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {currentLesson.sampleRealWorldCase.whatHappened}
              </div>
              <div className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl font-medium">
                💡 Lesson: {currentLesson.sampleRealWorldCase.lessonLearned}
              </div>
            </div>

            {/* Interactive Concept Quiz */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Test Your Developer Instinct
                </span>
                {isSubmitted && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isCorrect
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Review Solution"}
                  </span>
                )}
              </div>

              <div className="text-sm font-medium text-slate-100">
                {currentLesson.interactiveExercise.prompt}
              </div>

              <div className="space-y-2">
                {currentLesson.interactiveExercise.options.map((opt, i) => {
                  let optStyle =
                    "bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300";
                  if (selectedOption === i) {
                    optStyle = "bg-indigo-950 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500";
                  }
                  if (isSubmitted) {
                    if (i === currentLesson.interactiveExercise.correctIndex) {
                      optStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500";
                    } else if (selectedOption === i) {
                      optStyle = "bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <button
                  disabled={selectedOption === undefined}
                  onClick={handleSubmitQuiz}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Verify My Answer
                </button>
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    Explanation & Rationale:
                  </div>
                  <div>{currentLesson.interactiveExercise.explanation}</div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive AI Mentor Drawer */}
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Ask the Lead Developer AI Mentor</span>
            </div>
            <p className="text-xs text-slate-400">
              Ask anything about this engine, specific formulas, RERA clauses, or negotiation scripts.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={`Ask mentor about ${currentLesson.stageName}... (e.g. 'How do I negotiate a 68:32 split with a hesitant landowner?')`}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAskMentor()}
              />
              <button
                disabled={mentorLoading || !customQuestion.trim()}
                onClick={() => handleAskMentor()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                {mentorLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Ask Mentor</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {mentorResponse && (
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-3 text-xs md:text-sm text-slate-200 leading-relaxed">
                <div className="text-xs font-mono text-indigo-400 uppercase flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>Mentor Analysis & Heuristic</span>
                  <span className="text-[10px] text-slate-500">Gemini 3.7 Flash</span>
                </div>
                <div className="whitespace-pre-line text-slate-200">
                  {mentorResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
