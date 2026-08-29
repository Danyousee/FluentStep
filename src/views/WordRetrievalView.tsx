import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';
import { ActiveVocabWord } from '../types';

export const WordRetrievalView: React.FC = () => {
  const {
    activeVocabWords,
    advanceActiveVocabStage,
    addCustomWordToActiveVocab,
    addXP,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'timed_drill' | 'confusion_pairs'>('pipeline');
  
  // Timed Drill State
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [userTypedWord, setUserTypedWord] = useState('');
  const [drillSecondsLeft, setDrillSecondsLeft] = useState(12);
  const [isDrillActive, setIsDrillActive] = useState(false);
  const [drillFeedback, setDrillFeedback] = useState<'correct' | 'timeout' | 'wrong' | null>(null);
  const [newWordInput, setNewWordInput] = useState({ word: '', meaning: '', example: '' });

  const eligibleDrillWords = activeVocabWords.filter((w) => w.currentStage !== 'mastered');
  const currentWord = eligibleDrillWords[currentDrillIndex] || eligibleDrillWords[0];

  useEffect(() => {
    let timer: any;
    if (isDrillActive && drillSecondsLeft > 0 && drillFeedback === null) {
      timer = setInterval(() => {
        setDrillSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (drillSecondsLeft === 0 && drillFeedback === null && isDrillActive) {
      setDrillFeedback('timeout');
      soundService.playError();
    }
    return () => clearInterval(timer);
  }, [isDrillActive, drillSecondsLeft, drillFeedback]);

  const handleStartDrill = () => {
    setIsDrillActive(true);
    setDrillSecondsLeft(12);
    setUserTypedWord('');
    setDrillFeedback(null);
  };

  const handleCheckWordRecall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTypedWord.trim() || !currentWord) return;

    if (userTypedWord.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setDrillFeedback('correct');
      soundService.playSuccess();
      advanceActiveVocabStage(currentWord.id, true);
      addXP(25, `Active recall mastered: ${currentWord.word}`);
    } else {
      setDrillFeedback('wrong');
      soundService.playError();
      advanceActiveVocabStage(currentWord.id, false);
    }
  };

  const handleNextDrillWord = () => {
    if (currentDrillIndex + 1 < eligibleDrillWords.length) {
      setCurrentDrillIndex((prev) => prev + 1);
    } else {
      setCurrentDrillIndex(0);
    }
    setDrillSecondsLeft(12);
    setUserTypedWord('');
    setDrillFeedback(null);
    setIsDrillActive(true);
  };

  const handleAddWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordInput.word.trim()) return;
    addCustomWordToActiveVocab(newWordInput.word.trim(), newWordInput.meaning.trim(), newWordInput.example.trim());
    setNewWordInput({ word: '', meaning: '', example: '' });
    addXP(15, 'Added target word to Active Vocabulary pipeline!');
  };

  const countByStage = {
    recognition: activeVocabWords.filter((w) => w.currentStage === 'recognition').length,
    recall: activeVocabWords.filter((w) => w.currentStage === 'recall').length,
    usage: activeVocabWords.filter((w) => w.currentStage === 'usage').length,
    mastered: activeVocabWords.filter((w) => w.currentStage === 'mastered').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Zap size={14} className="text-emerald-400" />
              Active Retrieval Spaced Practice
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Active Vocabulary & Retrieval Gym
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Knowing a word when reading is <em>Passive Recognition</em>. Producing that word in a split-second conversation is <em>Active Retrieval</em>. Train active recall under timed pressure so the right words come instantly.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 text-center shrink-0 min-w-[210px]">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              Spontaneous Active Words
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white">
              {countByStage.mastered}
              <span className="text-xl text-slate-400">/{activeVocabWords.length}</span>
            </div>
            <div className="text-xs text-slate-300 mt-2 font-medium">
              {countByStage.recall + countByStage.usage} currently advancing
            </div>
          </div>
        </div>

        {/* 4 Stage Pipeline Stepper */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { stage: '1. Recognition', count: countByStage.recognition, desc: 'Multiple-choice identification' },
            { stage: '2. Timed Recall', count: countByStage.recall, desc: 'Clue to word in <12s' },
            { stage: '3. Sentence Usage', count: countByStage.usage, desc: 'Spontaneous contextual usage' },
            { stage: '4. Mastered', count: countByStage.mastered, desc: 'Permanent speaking fluency' },
          ].map((step, sIdx) => (
            <div
              key={sIdx}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1"
            >
              <div className="text-xs font-bold text-slate-300">{step.stage}</div>
              <div className="text-lg font-black text-white">{step.count} words</div>
              <div className="text-[10px] text-slate-400 leading-tight">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pipeline'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers size={16} />
          Word Pipeline ({activeVocabWords.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('timed_drill');
            handleStartDrill();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'timed_drill'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock size={16} />
          Timed Retrieval Drill
        </button>
      </div>

      {/* TAB 1: PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Add New Target Word Card */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus size={18} className="text-emerald-500" />
              Add Target Word to Active Pipeline
            </h3>
            <form onSubmit={handleAddWordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newWordInput.word}
                onChange={(e) => setNewWordInput({ ...newWordInput, word: e.target.value })}
                placeholder="Target Word (e.g. 'Procrastinate')..."
                className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-slate-100"
              />
              <input
                type="text"
                value={newWordInput.meaning}
                onChange={(e) => setNewWordInput({ ...newWordInput, meaning: e.target.value })}
                placeholder="Core meaning / definition..."
                className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-slate-100"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWordInput.example}
                  onChange={(e) => setNewWordInput({ ...newWordInput, example: e.target.value })}
                  placeholder="Example sentence..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!newWordInput.word.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>

          {/* Active Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeVocabWords.map((word) => (
              <div
                key={word.id}
                className="bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {word.word}
                    </span>
                    <button
                      onClick={() => soundService.speak(word.word)}
                      className="text-slate-400 hover:text-emerald-500 p-1"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      word.currentStage === 'mastered'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : word.currentStage === 'usage'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : word.currentStage === 'recall'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Stage: {word.currentStage}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {word.definition}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  "{word.userCustomSentence || (word.collocations && word.collocations.join(', ')) || word.definition}"
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Recall Clue: "{word.clueHint}"</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {word.recallSuccessCount} Active Successes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TIMED RETRIEVAL DRILL */}
      {activeTab === 'timed_drill' && currentWord && (
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-xs max-w-2xl mx-auto space-y-6 animate-fadeIn">
          {/* Timer Clock */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Word {currentDrillIndex + 1} of {eligibleDrillWords.length}
            </div>
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono font-black text-sm ${
                drillSecondsLeft <= 3
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 animate-ping'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Clock size={16} />
              <span>{drillSecondsLeft}s</span>
            </div>
          </div>

          {/* Clue Prompt */}
          <div className="space-y-2 text-center py-4">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Definition / Context:
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              "{currentWord.definition}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              💡 Clue: <strong>{currentWord.clueHint}</strong>
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleCheckWordRecall} className="space-y-4">
            <input
              type="text"
              autoFocus
              disabled={drillFeedback !== null}
              value={userTypedWord}
              onChange={(e) => setUserTypedWord(e.target.value)}
              placeholder="Type the exact target word..."
              className="w-full text-center px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-slate-100"
            />

            {drillFeedback === null ? (
              <button
                type="submit"
                disabled={!userTypedWord.trim()}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                Submit Recall
              </button>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
                    drillFeedback === 'correct'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {drillFeedback === 'correct' ? (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Instant Recall! Advanced toward Mastered.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      <span>The correct word was: "{currentWord.word}"</span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextDrillWord}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next Drill Word</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
