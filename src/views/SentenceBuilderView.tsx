import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Lock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SENTENCE_LEVELS_INFO, SENTENCE_EXERCISES } from '../data/sentenceData';
import { soundService } from '../services/soundService';
import { AudioPlayerButton } from '../components/AudioPlayerButton';

export const SentenceBuilderView: React.FC = () => {
  const {
    userStats,
    recordSentenceCompletion,
    recordMistake,
    setCurrentView,
    selectedSentenceLevel,
    setSelectedSentenceLevel,
  } = useApp();

  const currentLevelInfo =
    SENTENCE_LEVELS_INFO.find((lvl) => lvl.level === selectedSentenceLevel) ||
    SENTENCE_LEVELS_INFO[0];

  const levelExercises = SENTENCE_EXERCISES.filter(
    (ex) => ex.level === selectedSentenceLevel
  );

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation?: string;
  } | null>(null);

  const currentExercise =
    levelExercises[exerciseIndex % (levelExercises.length || 1)] || SENTENCE_EXERCISES[0];

  const availableTokens = currentExercise.jumbledWords;

  const handleToggleToken = (token: string) => {
    if (isSubmitted) return;
    soundService.playPop();

    if (selectedTokens.includes(token)) {
      setSelectedTokens((prev) => prev.filter((t) => t !== token));
    } else {
      setSelectedTokens((prev) => [...prev, token]);
    }
  };

  const handleResetTokens = () => {
    setSelectedTokens([]);
    setIsSubmitted(false);
    setFeedback(null);
    setShowHint(false);
  };

  const handleCheckSentence = () => {
    if (selectedTokens.length === 0) return;

    const userAssembled = selectedTokens.join(' ').trim();
    const correctTarget = currentExercise.targetSentence.trim();

    const cleanUser = userAssembled.replace(/[.,?!]/g, '').toLowerCase();
    const cleanTarget = correctTarget.replace(/[.,?!]/g, '').toLowerCase();

    const isCorrect = cleanUser === cleanTarget;
    setIsSubmitted(true);

    if (isCorrect) {
      soundService.playSuccess();
      recordSentenceCompletion(currentLevelInfo.level);
      setFeedback({
        isCorrect: true,
        explanation: 'Excellent! Your sentence follows correct English word order.',
      });
    } else {
      soundService.playError();
      recordMistake(currentLevelInfo.title, 'sentence_lesson');
      setFeedback({
        isCorrect: false,
        explanation: currentExercise.hint,
      });
    }
  };

  const handleNextExercise = () => {
    if (exerciseIndex + 1 < levelExercises.length) {
      setExerciseIndex((i) => i + 1);
    } else {
      const nextLevel = selectedSentenceLevel + 1;
      if (nextLevel <= 10) {
        setSelectedSentenceLevel(nextLevel);
        setExerciseIndex(0);
      }
    }
    handleResetTokens();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Layers size={16} />
            <span>Interactive Sentence Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            Build Natural English Sentences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Construct correct grammar step by step from Subject & Verb to complex clauses.
          </p>
        </div>

        <button
          id="btn_open_how_to_sentence_lesson"
          onClick={() => setCurrentView('sentence_lesson')}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-xs transition-colors"
        >
          <BookOpen size={15} className="text-indigo-600 dark:text-indigo-400" />
          <span>How to Build a Sentence (7 Steps)</span>
        </button>
      </div>

      {/* 10 Progressive Level Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {SENTENCE_LEVELS_INFO.map((lvl) => {
          const isUnlocked = userStats.unlockedLevels.includes(lvl.level);
          const isCompleted = userStats.completedLevels.includes(lvl.level);
          const isSelected = selectedSentenceLevel === lvl.level;

          return (
            <button
              key={lvl.level}
              id={`lvl_btn_${lvl.level}`}
              disabled={!isUnlocked}
              onClick={() => {
                setSelectedSentenceLevel(lvl.level);
                setExerciseIndex(0);
                handleResetTokens();
              }}
              className={`px-3.5 py-2 rounded-xl font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
              }`}
            >
              {!isUnlocked && <Lock size={12} />}
              <span>Lvl {lvl.level}: {lvl.title}</span>
              {isCompleted && <span className="text-[10px] text-emerald-400">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Active Exercise Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
        {/* Exercise Header & Rule Formula */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Level {currentLevelInfo.level} • Exercise {exerciseIndex + 1} of {levelExercises.length || 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
              {currentLevelInfo.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentLevelInfo.description}
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-mono font-semibold">
            Formula: {currentExercise.formula}
          </div>
        </div>

        {/* Construction Assembly Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Your Sentence Assembly:</span>
            <span>{selectedTokens.length} words added</span>
          </div>

          <div className="min-h-[90px] p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2.5">
            {selectedTokens.length === 0 ? (
              <span className="text-xs sm:text-sm text-slate-400 italic">
                Click or tap the word tiles below in the correct order to construct your sentence...
              </span>
            ) : (
              selectedTokens.map((token, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleToken(token)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs hover:bg-indigo-700 transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>{token}</span>
                  <span className="text-[10px] text-indigo-200 font-normal">✕</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Scrambled Word Tiles */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Available Word Tiles:
          </span>

          <div className="flex flex-wrap gap-2.5">
            {availableTokens.map((token, idx) => {
              const isUsed = selectedTokens.includes(token);
              return (
                <button
                  key={idx}
                  id={`token_btn_${idx}`}
                  disabled={isUsed || isSubmitted}
                  onClick={() => handleToggleToken(token)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm border transition-all ${
                    isUsed
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-40 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 shadow-xs active:scale-95'
                  }`}
                >
                  {token}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              id="btn_reset_tokens"
              onClick={handleResetTokens}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw size={14} />
              <span>Clear & Reset</span>
            </button>

            <button
              id="btn_show_hint"
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 transition-all"
            >
              <HelpCircle size={14} />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          </div>

          {!isSubmitted ? (
            <button
              id="btn_check_sentence"
              disabled={selectedTokens.length === 0}
              onClick={handleCheckSentence}
              className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Sparkles size={16} />
              <span>Check Sentence (+20 XP)</span>
            </button>
          ) : (
            <button
              id="btn_next_sentence_ex"
              onClick={handleNextExercise}
              className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              <span>Next Sentence</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>💡 Helpful Hint:</strong> {currentExercise.hint}
          </div>
        )}

        {/* Detailed Feedback Panel */}
        {feedback && (
          <div
            className={`p-6 rounded-3xl border space-y-4 ${
              feedback.isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                {feedback.isCorrect ? (
                  <>
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>Correct! Sentence is natural and accurate.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-rose-600" size={20} />
                    <span>Let's review this word order:</span>
                  </>
                )}
              </div>
              <AudioPlayerButton text={currentExercise.targetSentence} size="sm" />
            </div>

            {/* Breakdown of sentence tokens */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider block opacity-70">
                Correct English Structure:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentExercise.parts.map((part, pIdx) => (
                  <div
                    key={pIdx}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                      part.colorClass || 'bg-white dark:bg-zinc-800 text-zinc-800'
                    }`}
                  >
                    <span className="font-bold block">{part.text}</span>
                    <span className="text-[10px] font-normal opacity-80">{part.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation why */}
            <p className="text-xs leading-relaxed">
              <strong>Grammar Rule:</strong> {currentExercise.ruleExplanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
