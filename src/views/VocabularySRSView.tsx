import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { VocabularyWord, SRSStatus } from '../types';
import { soundService } from '../services/soundService';

export const VocabularySRSView: React.FC = () => {
  const { userStats, updateWordSRS, addXP, setCurrentView } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedSession, setCompletedSession] = useState(false);

  // Find all vocabulary words and their SRS status
  const srsMap = userStats.srsWords || {};

  const reviewQueue: VocabularyWord[] = VOCABULARY_LIST.filter((w) => {
    const srsEntry = srsMap[w.id];
    if (!srsEntry) return true; // new words
    const today = new Date().toISOString().split('T')[0];
    return srsEntry.nextReview <= today || srsEntry.status === 'NEW' || srsEntry.status === 'LEARNING';
  }).slice(0, 10); // review batch of 10

  const currentWord = reviewQueue[currentIndex];

  const handleRate = (status: SRSStatus) => {
    if (!currentWord) return;

    updateWordSRS(currentWord.id, status);
    soundService.playPop();

    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      setCompletedSession(true);
      soundService.playFanfare();
      addXP(40, 'Completed daily Spaced Repetition vocabulary review!');
    }
  };

  const currentSRS = currentWord ? srsMap[currentWord.id]?.status || 'NEW' : 'NEW';

  return (
    <div id="vocab-srs-container" className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-2xl text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Spaced Repetition Review</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Science-backed memory algorithm. Words reappear right before your brain forgets them.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('vocabulary')}
          className="text-xs px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 dark:text-slate-200 self-start md:self-center"
        >
          View All Vocabulary
        </button>
      </div>

      {!completedSession && currentWord ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Card {currentIndex + 1} of {reviewQueue.length}</span>
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-3.5 h-3.5" /> Stage: {currentSRS}
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / reviewQueue.length) * 100}%` }}
            ></div>
          </div>

          {/* Flashcard Component */}
          <div
            id="srs-flashcard"
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[340px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-3xl p-8 shadow-md flex flex-col justify-between transition-all select-none"
          >
            {/* Front Side */}
            {!isFlipped ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 my-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                  {currentWord.partOfSpeech} • {currentWord.level}
                </span>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                  {currentWord.word}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-500">{currentWord.pronunciation}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundService.speak(currentWord.word);
                    }}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-full transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 pt-4 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Tap anywhere on the card to flip & reveal meaning
                </p>
              </div>
            ) : (
              /* Back Side */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentWord.word}</h3>
                    <span className="text-xs font-mono text-slate-400">{currentWord.pronunciation}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundService.speak(`${currentWord.word}. ${currentWord.exampleSentence}`);
                    }}
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-full"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Definition:
                    </span>
                    <p className="text-base text-slate-800 dark:text-slate-200 font-medium">
                      {currentWord.simpleDefinition || currentWord.meaning}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mb-1">
                      Example in a Sentence:
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic font-serif">
                      "{currentWord.exampleSentence}"
                    </p>
                  </div>

                  {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs font-semibold text-slate-400">Synonyms:</span>
                      {currentWord.synonyms.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rating Buttons */}
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
            >
              <button
                onClick={() => handleRate('NEW')}
                className="p-3.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>Again (Forgot)</span>
                <span className="text-[10px] text-rose-500 font-normal">&lt; 10 mins</span>
              </button>

              <button
                onClick={() => handleRate('LEARNING')}
                className="p-3.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>Hard (Recall slow)</span>
                <span className="text-[10px] text-amber-500 font-normal">+ 1 day</span>
              </button>

              <button
                onClick={() => handleRate('FAMILIAR')}
                className="p-3.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>Good (Understood)</span>
                <span className="text-[10px] text-blue-500 font-normal">+ 3 days</span>
              </button>

              <button
                onClick={() => handleRate('MASTERED')}
                className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>Easy (Mastered)</span>
                <span className="text-[10px] text-emerald-500 font-normal">+ 14 days</span>
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Session Complete!</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            You've reviewed your due flashcards. Your memory retention is solidifying!
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setCompletedSession(false);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Review Another Batch
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs font-bold text-white shadow-xs"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
