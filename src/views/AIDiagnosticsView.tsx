import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle,
  Award,
  Layers,
  Repeat,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiagnosticItem, DetectedErrorPattern } from '../types';

export const AIDiagnosticsView: React.FC = () => {
  const {
    diagnostics,
    errorPatterns,
    resolveErrorPattern,
    thinkingMode,
    setThinkingMode,
    setCurrentView,
    addXP,
  } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activePatternQuiz, setActivePatternQuiz] = useState<string | null>(null);
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const averageScore = Math.round(
    diagnostics.reduce((acc, curr) => acc + curr.score, 0) / (diagnostics.length || 1)
  );

  const handleStartPatternPractice = (pattern: DetectedErrorPattern) => {
    setActivePatternQuiz(pattern.id);
    setQuizSelection(null);
    setQuizSubmitted(false);
  };

  const handleAnswerSubmit = (pattern: DetectedErrorPattern) => {
    if (quizSelection === null) return;
    setQuizSubmitted(true);
    if (quizSelection === pattern.correctIndex) {
      resolveErrorPattern(pattern.id);
      addXP(30, `Mastered pattern: ${pattern.patternTitle}!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Activity size={14} className="text-indigo-400" />
              AI Root-Cause Diagnostic Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Skill Diagnostics & Weakness Detection
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Beyond simple percentage test scores: the diagnostic engine analyzes <em>why</em> errors occur, identifies recurring cognitive patterns, and prescribes targeted micro-drills to fix them at the root.
            </p>
          </div>

          {/* Overall Health Gauge */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 text-center shrink-0 min-w-[200px]">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Overall English Mastery
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white">
              {averageScore}<span className="text-2xl text-indigo-300">/100</span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-2">
              <TrendingUp size={14} />
              +5.4% this month
            </div>
          </div>
        </div>

        {/* Thinking in English Mode Pill Selector */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles size={16} className="text-amber-400" />
            <span>
              <strong>Thinking in English Mode:</strong> Adjusts cognitive scaffolding to train thinking directly in English without internal translation.
            </span>
          </div>
          <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-white/15 shrink-0">
            {(['Beginner Support', 'Balanced', 'English Only'] as const).map((mode) => (
              <button
                key={mode}
                id={`btn_thinking_mode_${mode.toLowerCase().replace(/\s+/g, '_')}`}
                onClick={() => setThinkingMode(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  thinkingMode === mode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 8 Core Competencies Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            8 Core Language Competencies
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Real-time evaluation updated every session
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnostics.map((item: DiagnosticItem) => (
            <div
              key={item.skill}
              id={`card_diagnostic_${item.skill.toLowerCase().replace(/\s+/g, '_')}`}
              className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.skill}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        item.trend === 'improving'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.trend === 'improving' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.trendDelta}
                    </span>
                    <span className="text-xs text-slate-400">
                      Assessed: {item.lastAssessedDate}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {item.score}%
                  </div>
                  <div className="w-20 bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 80
                          ? 'bg-emerald-500'
                          : item.score >= 60
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Strength vs Root-Cause Weakness Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Demonstrated Strength:</strong> {item.strength}
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200">
                  <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Root-Cause Weakness:</strong> {item.rootCauseWeakness}
                  </div>
                </div>
              </div>

              {/* Recommended Action CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  Fix: {item.recommendedAction}
                </span>
                <button
                  id={`btn_practice_diagnostic_${item.skill.toLowerCase().replace(/\s+/g, '_')}`}
                  onClick={() => setCurrentView((item.practiceModuleId as any) || 'smart_review')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                >
                  <span>Practice</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Error Patterns with Live On-Card Workout */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              Detected Error Patterns ({errorPatterns.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Recurring linguistic friction points isolated from your answers. Complete the targeted micro-workout to eliminate each error pattern.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {errorPatterns.map((pattern) => (
            <div
              key={pattern.id}
              id={`pattern_card_${pattern.id}`}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      {pattern.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {pattern.patternTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <strong>Root Cause:</strong> {pattern.rootCause}
                  </p>
                </div>

                <button
                  id={`btn_workout_pattern_${pattern.id}`}
                  onClick={() => handleStartPatternPractice(pattern)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
                >
                  <Repeat size={14} />
                  {activePatternQuiz === pattern.id ? 'Active Practice' : 'Quick Micro-Workout'}
                </button>
              </div>

              {/* Contrast Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                  <div className="font-bold text-rose-700 dark:text-rose-400 mb-1">
                    ✕ Typical Common Mistake:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-mono">
                    "{pattern.wrongExamples[0]}"
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    ✓ Correct Natural Structure:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-mono">
                    "{pattern.correctExamples[0]}"
                  </div>
                </div>
              </div>

              {/* Tutor Remedy Tip */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Tutor Rule:</strong> {pattern.remedyTip}
                </div>
              </div>

              {/* Interactive In-Card Practice Drill */}
              {activePatternQuiz === pattern.id && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Zap size={14} />
                    Micro-Drill: Choose the Correct Natural English Phrasing
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {pattern.practicePrompt}
                  </div>

                  <div className="space-y-2">
                    {pattern.practiceOptions.map((opt, oIdx) => {
                      const isSelected = quizSelection === oIdx;
                      const isCorrect = oIdx === pattern.correctIndex;
                      let btnStyle =
                        'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`btn_option_${pattern.id}_${oIdx}`}
                          disabled={quizSubmitted}
                          onClick={() => setQuizSelection(oIdx)}
                          className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 size={16} />}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      id={`btn_submit_quiz_${pattern.id}`}
                      disabled={quizSelection === null}
                      onClick={() => handleAnswerSubmit(pattern)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                      <div className="font-bold">
                        {quizSelection === pattern.correctIndex ? '🎉 Spot on!' : '💡 Tutor Insight:'}
                      </div>
                      <p>{pattern.practiceExplanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
