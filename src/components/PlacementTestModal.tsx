import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { PLACEMENT_TEST_QUESTIONS } from '../data/placementTestData';
import { useApp } from '../context/AppContext';
import { UserLevel } from '../types';
import { soundService } from '../services/soundService';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({ isOpen, onClose }) => {
  const { setUserLevel, addXP } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_TEST_QUESTIONS[currentIndex];
  const isLast = currentIndex === PLACEMENT_TEST_QUESTIONS.length - 1;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    soundService.playPop();
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
  };

  const handleNext = () => {
    if (isLast) {
      calculateFinalLevel();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const calculateFinalLevel = () => {
    let determinedLevel: UserLevel = 'Beginner';
    const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);

    if (finalScore <= 2) determinedLevel = 'Beginner';
    else if (finalScore <= 4) determinedLevel = 'A1';
    else if (finalScore <= 6) determinedLevel = 'A2';
    else if (finalScore <= 8) determinedLevel = 'B1';
    else if (finalScore <= 9) determinedLevel = 'B2';
    else determinedLevel = 'C1';

    setUserLevel(determinedLevel);
    addXP(50, 'Completed Placement Diagnostic Test!');
    setIsFinished(true);
    soundService.playFanfare();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {!isFinished ? (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Diagnostic Level Test
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Question {currentIndex + 1} of {PLACEMENT_TEST_QUESTIONS.length}
                  </h3>
                </div>
                <button
                  id="btn_close_placement"
                  onClick={onClose}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / PLACEMENT_TEST_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question */}
              <div className="mb-6">
                <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {currentQ.question}
                </p>
                {currentQ.context && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 italic">
                    {currentQ.context}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, idx) => {
                  let style = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200';
                  if (selectedOption === idx) {
                    style = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-medium';
                  }
                  if (isSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      style = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 font-semibold';
                    } else if (selectedOption === idx) {
                      style = 'border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-100 font-semibold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`placement_opt_${idx}`}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between text-sm ${style}`}
                    >
                      <span className="flex-1 pr-2">{option}</span>
                      {isSubmitted && idx === currentQ.correctIndex && (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback explanation if submitted */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed mb-6 ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {selectedOption === currentQ.correctIndex ? 'Correct! 🎉' : 'Explanation:'}
                  </p>
                  {currentQ.explanation}
                </motion.div>
              )}

              {/* Action button */}
              <div className="flex justify-end">
                {!isSubmitted ? (
                  <button
                    id="btn_confirm_placement_ans"
                    disabled={selectedOption === null}
                    onClick={handleConfirmAnswer}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    id="btn_next_placement_q"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                  >
                    {isLast ? 'See Recommended Level' : 'Next Question'}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Award size={36} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Placement Complete!
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6">
                You scored <span className="font-semibold text-emerald-600">{score} / {PLACEMENT_TEST_QUESTIONS.length}</span>. We've customized your lessons and practice challenges to fit your current English skills!
              </p>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 max-w-xs mx-auto mb-8 text-center">
                <span className="text-xs text-zinc-400 uppercase font-medium">Recommended Level</span>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {score <= 2 ? 'Beginner' : score <= 4 ? 'A1 (Elementary)' : score <= 6 ? 'A2 (Pre-Intermediate)' : score <= 8 ? 'B1 (Intermediate)' : 'B2 (Upper-Intermediate)'}
                </p>
              </div>

              <button
                id="btn_start_learning_from_placement"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all"
              >
                Go to Dashboard & Start Learning
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
