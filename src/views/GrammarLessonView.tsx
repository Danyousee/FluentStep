import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GRAMMAR_TOPICS } from '../data/grammarData';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { soundService } from '../services/soundService';

export const GrammarLessonView: React.FC = () => {
  const { selectedGrammarTopicId, setCurrentView, recordGrammarMastery } = useApp();

  const topic =
    GRAMMAR_TOPICS.find((t) => t.id === selectedGrammarTopicId) || GRAMMAR_TOPICS[0];

  const [activeTab, setActiveTab] = useState<'rules' | 'mistakes' | 'quiz'>('rules');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    soundService.playPop();
  };

  const handleGradeQuiz = () => {
    let correctCount = 0;
    topic.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / topic.quizQuestions.length) * 100);
    setQuizScore(percent);
    setQuizSubmitted(true);

    if (percent >= 70) {
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
    recordGrammarMastery(topic.id, percent);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('grammar')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={16} />
          <span>Back to Grammar Topics</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
          Level {topic.level}
        </span>
      </div>

      {/* Main Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8">
        {/* Title */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <GraduationCap size={16} />
            <span>Grammar Rulebook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {topic.title}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            {topic.summary}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          {[
            { id: 'rules', label: `1. Rules & Formulas (${topic.rules.length})` },
            { id: 'mistakes', label: `2. Common Mistakes (${topic.commonMistakes.length})` },
            { id: 'quiz', label: `3. Practice Quiz (${topic.quizQuestions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Rules & Formulas */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            {topic.rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                    Rule {idx + 1}: {rule.ruleTitle}
                  </h3>
                  <div className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-800 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                    {rule.formula}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {rule.explanation}
                </p>

                {/* Examples */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    Real Examples
                  </span>
                  {rule.examples.map((ex, eIdx) => (
                    <div
                      key={eIdx}
                      className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-200/60 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          "{ex.correct}"
                        </p>
                        {ex.note && (
                          <span className="text-zinc-500 italic mt-0.5 block">
                            Note: {ex.note}
                          </span>
                        )}
                      </div>
                      <AudioPlayerButton text={ex.correct} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Common Mistakes */}
        {activeTab === 'mistakes' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Why Learners Make These Mistakes & How to Fix Them:
            </span>

            <div className="space-y-4">
              {topic.commonMistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200">
                      <span className="font-bold flex items-center gap-1 mb-1">
                        <XCircle size={14} className="text-rose-600" />
                        Incorrect English:
                      </span>
                      <p className="line-through italic font-mono">{m.wrong}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                      <span className="font-bold flex items-center gap-1 mb-1">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Correct English:
                      </span>
                      <p className="font-bold font-mono">{m.right}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300">
                    <strong>Reason:</strong> {m.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Topic Mastery Quiz
                </h3>
                <p className="text-xs text-zinc-500">
                  Test your understanding to earn XP and solidify your grammar knowledge.
                </p>
              </div>

              {quizSubmitted && (
                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-amber-600 font-bold hover:underline"
                >
                  Retake Quiz
                </button>
              )}
            </div>

            <div className="space-y-6">
              {topic.quizQuestions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4"
                >
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      let style =
                        'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100';

                      if (isSelected) {
                        style = 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-900 dark:text-amber-200 font-semibold';
                      }

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          style = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold';
                        } else if (isSelected && optIdx !== q.correctIndex) {
                          style = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-950 dark:text-rose-100 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          id={`grammar_quiz_q${qIdx}_opt${optIdx}`}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Quiz */}
            {!quizSubmitted ? (
              <button
                id="btn_submit_grammar_quiz"
                disabled={Object.keys(quizAnswers).length < topic.quizQuestions.length}
                onClick={handleGradeQuiz}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz & Grade Answers
              </button>
            ) : (
              <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-2">
                <h4 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Quiz Score: {quizScore}%
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {quizScore >= 80
                    ? '🎉 Outstanding! You have mastered this grammar concept.'
                    : 'Good attempt! Review the rules above and try once more.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
