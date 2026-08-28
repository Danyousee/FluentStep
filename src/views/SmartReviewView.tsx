import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';

interface ReviewFlashcard {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'A1' | 'A2' | 'B1';
}

const REVIEW_CARDS: ReviewFlashcard[] = [
  {
    id: 'rc_1',
    topic: 'Prepositions of Place',
    question: 'I have been living _____ London for two years.',
    options: ['at', 'in', 'on', 'to'],
    correctAnswer: 'in',
    explanation: 'We use "in" with cities, countries, and large geographical areas.',
    difficulty: 'A2',
  },
  {
    id: 'rc_2',
    topic: 'Stative Verbs & Agreement',
    question: 'Choose the correct sentence to express agreement:',
    options: ['I am agree with you', 'I agree with you', 'I am agreeing with you', 'I agreed you'],
    correctAnswer: 'I agree with you',
    explanation: '"Agree" is already a verb. We say "I agree with you".',
    difficulty: 'A1',
  },
  {
    id: 'rc_3',
    topic: 'Say vs. Tell',
    question: 'Can you _____ me what time the flight departs?',
    options: ['say', 'tell', 'speak', 'talk'],
    correctAnswer: 'tell',
    explanation: '"Tell" requires a personal pronoun/object: "tell ME", whereas "say" does not take a direct personal object.',
    difficulty: 'A2',
  },
  {
    id: 'rc_4',
    topic: 'Present Perfect vs. Simple Past',
    question: 'Yesterday, I _____ my keys and had to wait outside.',
    options: ['lost', 'have lost', 'lose', 'was losing'],
    correctAnswer: 'lost',
    explanation: 'Specific finished time in the past ("Yesterday") takes simple past ("lost").',
    difficulty: 'B1',
  },
  {
    id: 'rc_5',
    topic: 'Collocations (Make vs Do)',
    question: 'She needs to _____ a quick phone call before dinner.',
    options: ['do', 'make', 'give', 'take'],
    correctAnswer: 'make',
    explanation: 'The natural English collocation is "make a phone call", not "do a phone call".',
    difficulty: 'A2',
  },
];

export const SmartReviewView: React.FC = () => {
  const { userStats, addXP } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentCard = REVIEW_CARDS[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsAnswerChecked(true);

    if (selectedOption.toLowerCase() === currentCard.correctAnswer.toLowerCase()) {
      soundService.playSuccess();
      setCorrectCount((prev) => prev + 1);
      addXP(15, 'Smart Review Mastery!');
    } else {
      soundService.playWrong();
    }
  };

  const handleNextCard = () => {
    if (currentIndex < REVIEW_CARDS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setIsCompleted(true);
      soundService.playFanfare();
      addXP(25, 'Finished Spaced Repetition Review!');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-rose-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            Spaced-Repetition Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Smart Review & Weak-Area Mastery
          </h1>
          <p className="text-rose-100/90 text-sm max-w-2xl leading-relaxed">
            Targeted drills generated specifically from your past mistakes, hesitation points, and grammar questions to seal them into long-term memory.
          </p>
        </div>
      </div>

      {!isCompleted ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Card {currentIndex + 1} of {REVIEW_CARDS.length}
            </span>
            <span>
              Score: <strong className="text-slate-900 dark:text-white">{correctCount}</strong> Correct
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / REVIEW_CARDS.length) * 100}%` }}
            />
          </div>

          {/* Flashcard */}
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
                {currentCard.topic}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {currentCard.difficulty}
              </span>
            </div>

            <div className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentCard.question}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentCard.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt.toLowerCase() === currentCard.correctAnswer.toLowerCase();

                let style = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300';
                if (isSelected && !isAnswerChecked) {
                  style = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-900 dark:text-indigo-200';
                } else if (isAnswerChecked && isCorrect) {
                  style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200';
                } else if (isAnswerChecked && isSelected && !isCorrect) {
                  style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 text-rose-900 dark:text-rose-200';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                  >
                    <span>{opt}</span>
                    {isAnswerChecked && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Note */}
            {isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <span className="font-bold text-slate-900 dark:text-white block">
                  Grammar Rule Explanation:
                </span>
                <p className="text-slate-600 dark:text-slate-400">{currentCard.explanation}</p>
              </motion.div>
            )}

            {/* Action Bar */}
            <div className="pt-2">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNextCard}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <span>{currentIndex < REVIEW_CARDS.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-6 shadow-sm">
          <Award className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Review Session Complete!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              You scored {correctCount} out of {REVIEW_CARDS.length} correct.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
            Keep repeating these targeted drills to eliminate recurring errors for good.
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Round</span>
          </button>
        </div>
      )}
    </div>
  );
};
