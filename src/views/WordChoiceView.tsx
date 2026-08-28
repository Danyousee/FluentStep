import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WORD_CHOICE_PAIRS } from '../data/wordChoiceData';
import { soundService } from '../services/soundService';

export const WordChoiceView: React.FC = () => {
  const { addXP } = useApp();

  const [pairs] = useState(WORD_CHOICE_PAIRS);
  const [selectedPairId, setSelectedPairId] = useState<string>(pairs[0]?.id || 'wc_say_tell');
  const [quizAnswers, setQuizAnswers] = useState<{ [pairId: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [pairId: string]: boolean }>({});

  const activePair = pairs.find((p) => p.id === selectedPairId) || pairs[0];

  const handleSelectQuizOption = (pairId: string, option: string) => {
    if (quizSubmitted[pairId]) return;
    setQuizAnswers((prev) => ({ ...prev, [pairId]: option }));
  };

  const handleCheckQuiz = (pair: typeof activePair) => {
    const selected = quizAnswers[pair.id];
    if (!selected) return;

    setQuizSubmitted((prev) => ({ ...prev, [pair.id]: true }));

    if (selected.toLowerCase() === pair.quiz.correctAnswer.toLowerCase()) {
      soundService.playSuccess();
      addXP(15, 'Correct Word Choice Nuance!');
    } else {
      soundService.playWrong();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-violet-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Precise Vocabulary Nuance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Word Choice & Subtle Nuances
          </h1>
          <p className="text-violet-100/90 text-sm max-w-2xl leading-relaxed">
            Never mix up <em>say vs. tell</em>, <em>make vs. do</em>, or <em>listen vs. hear</em> again. Master precision in word choice with clear rules and quick interactive drills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Confusable Pairs List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Commonly Confused Pairs ({pairs.length})
          </div>

          <div className="space-y-2">
            {pairs.map((pair) => {
              const isSelected = activePair.id === pair.id;
              const hasPassedQuiz =
                quizSubmitted[pair.id] &&
                quizAnswers[pair.id]?.toLowerCase() === pair.quiz.correctAnswer.toLowerCase();

              return (
                <div
                  key={pair.id}
                  onClick={() => setSelectedPairId(pair.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-violet-500 shadow-md ring-2 ring-violet-500/20'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                      {pair.title}
                    </span>
                    {hasPassedQuiz && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">{pair.keyDifference}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deep Dive Breakdown & Interactive Quiz */}
        <div className="lg:col-span-8">
          <motion.div
            key={activePair.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-700 pb-4">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                Nuance Breakdown
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activePair.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Core Rule:</strong> {activePair.keyDifference}
              </p>
            </div>

            {/* Two Side-by-Side Word Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePair.words.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-violet-50/40 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-violet-700 dark:text-violet-300">
                      {item.word}
                    </span>
                    <button
                      onClick={() => soundService.speak(item.example)}
                      className="text-violet-500 hover:text-violet-700 p-1"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">When to use:</strong>
                    {item.usage}
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 italic">
                    "{item.example}"
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Drill Quiz */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
                  Quick Intuition Quiz: Fill in the blank
                </span>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">+15 XP</span>
              </div>

              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                "{activePair.quiz.question}"
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activePair.quiz.options.map((opt) => {
                  const isSelected = quizAnswers[activePair.id] === opt;
                  const isChecked = quizSubmitted[activePair.id];
                  const isCorrect = opt.toLowerCase() === activePair.quiz.correctAnswer.toLowerCase();

                  let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                  if (isSelected && !isChecked) {
                    btnStyle = 'bg-violet-600 text-white border-violet-600';
                  } else if (isChecked && isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                  } else if (isChecked && isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-600 text-white border-rose-600';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectQuizOption(activePair.id, opt)}
                      className={`p-3 rounded-xl border font-bold text-xs transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Check Action or Explanation */}
              {!quizSubmitted[activePair.id] ? (
                <button
                  onClick={() => handleCheckQuiz(activePair)}
                  disabled={!quizAnswers[activePair.id]}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
                >
                  Check Answer
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {quizAnswers[activePair.id]?.toLowerCase() === activePair.quiz.correctAnswer.toLowerCase()
                      ? ' Correct!'
                      : ' Not quite!'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{activePair.quiz.explanation}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
