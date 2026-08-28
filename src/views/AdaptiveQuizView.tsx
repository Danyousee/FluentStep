import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnglishLevel } from '../types';
import { soundService } from '../services/soundService';

interface DiagnosticQuestion {
  id: number;
  level: EnglishLevel;
  category: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    level: 'A1',
    category: 'Basic Present Tense',
    prompt: 'She _______ coffee every morning before work.',
    options: ['drink', 'drinks', 'drinking', 'is drink'],
    correctIndex: 1,
    explanation: "Third-person singular (she/he/it) takes 'drinks' in Present Simple.",
  },
  {
    id: 2,
    level: 'A1',
    category: 'Prepositions of Place',
    prompt: 'The keys are _______ the table in the kitchen.',
    options: ['on', 'in', 'at', 'into'],
    correctIndex: 0,
    explanation: "We say 'on the table' for flat surfaces.",
  },
  {
    id: 3,
    level: 'A2',
    category: 'Past Simple Irregular Verbs',
    prompt: 'Yesterday, we _______ to the new shopping mall downtown.',
    options: ['goed', 'went', 'gone', 'going'],
    correctIndex: 1,
    explanation: "'Went' is the past simple of 'go'.",
  },
  {
    id: 4,
    level: 'A2',
    category: 'Collocations',
    prompt: 'I need to _______ a decision before Friday.',
    options: ['do', 'make', 'create', 'build'],
    correctIndex: 1,
    explanation: "The standard English collocation is 'make a decision'.",
  },
  {
    id: 5,
    level: 'B1',
    category: 'Present Perfect vs Past Simple',
    prompt: 'I _______ living in this apartment since 2021.',
    options: ['have been', 'am', 'was', 'had been'],
    correctIndex: 0,
    explanation: "'Since 2021' requires the Present Perfect Continuous ('have been living').",
  },
  {
    id: 6,
    level: 'B1',
    category: 'Phrasal Verbs',
    prompt: 'The company had to _______ the annual meeting due to a blizzard.',
    options: ['call off', 'call in', 'call for', 'call up'],
    correctIndex: 0,
    explanation: "'Call off' means to cancel an event.",
  },
  {
    id: 7,
    level: 'B2',
    category: 'Conditional Sentences',
    prompt: 'If I _______ harder for the exam, I would have passed.',
    options: ['studied', 'had studied', 'have studied', 'would study'],
    correctIndex: 1,
    explanation: "Third conditional (past unreal situation): 'If + Past Perfect (had studied), would have + Past Participle'.",
  },
  {
    id: 8,
    level: 'B2',
    category: 'Gerund vs Infinitive',
    prompt: 'I look forward to _______ you at the conference next week.',
    options: ['see', 'seeing', 'saw', 'have seen'],
    correctIndex: 1,
    explanation: "'Look forward to' is followed by a gerund ('seeing').",
  },
  {
    id: 9,
    level: 'C1',
    category: 'Advanced Inversion',
    prompt: 'Seldom _______ such an eloquent presentation.',
    options: ['I have heard', 'have I heard', 'I had heard', 'heard I'],
    correctIndex: 1,
    explanation: "Negative adverbs (Seldom, Rarely, Hardly) at the start trigger subject-auxiliary inversion ('have I heard').",
  },
];

export const AdaptiveQuizView: React.FC = () => {
  const { userProfile, updateProfile, addXP, setCurrentView } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [calculatedLevel, setCalculatedLevel] = useState<EnglishLevel>('A2');

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelect = (optIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIndex }));
  };

  const handleCheck = () => {
    if (selectedAnswers[currentQ.id] === undefined) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedAnswers[currentQ.id] === currentQ.correctIndex;
    if (isCorrect) {
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
  };

  const handleNext = () => {
    if (currentIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate level
      let score = 0;
      DIAGNOSTIC_QUESTIONS.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) score++;
      });

      let assessed: EnglishLevel = 'A1';
      if (score >= 8) assessed = 'C1';
      else if (score >= 6) assessed = 'B2';
      else if (score >= 4) assessed = 'B1';
      else if (score >= 2) assessed = 'A2';
      else assessed = 'A1';

      setCalculatedLevel(assessed);
      setIsFinished(true);
      soundService.playFanfare();
      addXP(60, `Completed English Diagnostic Test: Assessed as Level ${assessed}`);
    }
  };

  const handleApplyLevel = () => {
    updateProfile({ level: calculatedLevel });
    soundService.playSuccess();
    setCurrentView('dashboard');
  };

  return (
    <div id="adaptive-quiz-container" className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CEFR Adaptive Diagnostic Test</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Evaluate your grammar, vocabulary, and phrasal verb proficiency across A1 through C1 levels.
            </p>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
            <span className="text-indigo-600 dark:text-indigo-400">Target Level: {currentQ.level}</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentQ.category}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.prompt}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswers[currentQ.id] === i;
                const isCorrect = i === currentQ.correctIndex;

                let optClass = 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optClass = 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200';
                  } else {
                    optClass = 'opacity-40 border-transparent';
                  }
                } else if (isSelected) {
                  optClass = 'bg-indigo-50 dark:bg-indigo-950 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-semibold';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={isAnswerSubmitted}
                    className={`p-4 rounded-2xl border text-sm text-left transition-all ${optClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                💡 <strong>Explanation:</strong> {currentQ.explanation}
              </motion.div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div></div>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleCheck}
                disabled={selectedAnswers[currentQ.id] === undefined}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                {currentIndex < DIAGNOSTIC_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xs">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto border-2 border-indigo-200 dark:border-indigo-800">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Diagnostic Results</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Based on your grammar accuracy, collocation knowledge, and sentence structures:
            </p>
          </div>

          <div className="inline-block p-6 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessed CEFR Level</span>
            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{calculatedLevel}</div>
          </div>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Setting your profile to <strong>{calculatedLevel}</strong> will automatically tune your AI tutor (Alex),
            sentence complexity, and listening exercises.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setSelectedAnswers({});
                setIsAnswerSubmitted(false);
              }}
              className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Retake Test
            </button>
            <button
              onClick={handleApplyLevel}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
            >
              Set My Level to {calculatedLevel} & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
