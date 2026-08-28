import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  BookmarkPlus,
  HelpCircle,
  Lightbulb,
  Briefcase,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeSayItBetter, SayItBetterResponseData } from '../services/aiService';
import { soundService } from '../services/soundService';

const CURATED_EXAMPLES = [
  { sentence: 'I am coming back now.', label: 'Leaving momentarily' },
  { sentence: 'Can you explain me this grammar rule?', label: 'Asking for explanation' },
  { sentence: 'I want you to help me with this bag.', label: 'Asking for assistance' },
  { sentence: 'I enter inside the bus yesterday.', label: 'Boarding transit' },
  { sentence: 'I have 24 years old.', label: 'Stating age' },
  { sentence: 'She is very good in cooking delicious food.', label: 'Skill with preposition' },
];

export const SayItBetterView: React.FC = () => {
  const { userProfile, addXP, addMistakeRecord } = useApp();
  const [inputSentence, setInputSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SayItBetterResponseData | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Interactive sentence builder puzzle for practice
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isPuzzleChecked, setIsPuzzleChecked] = useState(false);
  const [isPuzzleCorrect, setIsPuzzleCorrect] = useState(false);

  const handleAnalyze = async (customSentence?: string) => {
    const text = customSentence || inputSentence.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setIsSaved(false);
    setIsPuzzleChecked(false);
    setIsPuzzleCorrect(false);

    try {
      const data = await analyzeSayItBetter(text, userProfile.level);
      setResult(data);

      if (data.practiceExercise?.jumbledWords) {
        setScrambledWords([...data.practiceExercise.jumbledWords]);
        setSelectedWords([]);
      }
      addXP(15, 'Analyzed sentence phrasing tiers');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordClick = (word: string, index: number) => {
    if (isPuzzleChecked) return;
    const newScrambled = [...scrambledWords];
    newScrambled.splice(index, 1);
    setScrambledWords(newScrambled);
    setSelectedWords([...selectedWords, word]);
    soundService.playPop();
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isPuzzleChecked) return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setScrambledWords([...scrambledWords, word]);
    soundService.playPop();
  };

  const handleCheckPuzzle = () => {
    if (!result?.practiceExercise) return;
    const userSentence = selectedWords.join(' ').replace(/\s+([.,!?])/g, '$1');
    const target = result.practiceExercise.targetSentence.trim();
    const isCorrect =
      userSentence.toLowerCase().replace(/[.,!?]/g, '') ===
      target.toLowerCase().replace(/[.,!?]/g, '');

    setIsPuzzleCorrect(isCorrect);
    setIsPuzzleChecked(true);

    if (isCorrect) {
      soundService.playSuccess();
      addXP(20, 'Constructed natural target sentence!');
    } else {
      soundService.playError();
    }
  };

  const handleSaveToMistakes = () => {
    if (!result || isSaved) return;
    addMistakeRecord({
      originalSentence: result.originalSentence,
      correctedSentence: result.naturalEnglish || result.correctEnglish,
      explanation: result.summaryTip || 'Natural phrasing upgrade.',
      category: 'Vocabulary',
      sourceLesson: 'Say It Better',
    });
    setIsSaved(true);
    soundService.playSuccess();
  };

  return (
    <div id="say-it-better-container" className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div id="say-it-better-hero" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">"Say It Better" Engine</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Transform awkward or literal translations into grammatically flawless, natural, and professional English.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Type any sentence you want to improve:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="say-it-better-input"
              type="text"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="e.g. I want you to help me with this problem..."
              className="flex-1 p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              id="analyze-say-it-better-btn"
              onClick={() => handleAnalyze()}
              disabled={!inputSentence.trim() || isLoading}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Upgrade Phrasing
                </>
              )}
            </button>
          </div>

          {/* Quick Examples */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 mr-2">Try common awkward sentences:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CURATED_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputSentence(ex.sentence);
                    handleAnalyze(ex.sentence);
                  }}
                  className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  "{ex.sentence}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Tier Rewrite Cards */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1: Grammatically Correct */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      1. Grammatically Correct
                    </span>
                    <button
                      onClick={() => soundService.speak(result.correctEnglish)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    "{result.correctEnglish}"
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fixes grammatical errors, tense agreement, and standard word order.
                  </p>
                </div>
              </div>

              {/* Tier 2: Natural Everyday English */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-extrabold px-3 py-0.5 rounded-bl-xl tracking-wider">
                  Recommended
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      2. Natural Everyday English
                    </span>
                    <button
                      onClick={() => soundService.speak(result.naturalEnglish)}
                      className="p-1 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 rounded-lg"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-base font-bold text-emerald-950 dark:text-emerald-100 leading-snug">
                    "{result.naturalEnglish}"
                  </p>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    How native speakers naturally express this concept in everyday life.
                  </p>
                </div>
              </div>

              {/* Tier 3: Professional / Workplace */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-purple-700 dark:text-purple-300">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      3. Professional & Workplace
                    </span>
                    <button
                      onClick={() => soundService.speak(result.professionalEnglish)}
                      className="p-1 text-slate-400 hover:text-purple-600 rounded-lg"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    "{result.professionalEnglish}"
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Polite, diplomatic tone suitable for emails, meetings, and formal contexts.
                  </p>
                </div>
              </div>
            </div>

            {/* Nuance Breakdown & Save */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Key Differences & Why It Sounds Better
                </h3>

                <button
                  id="save-to-mistakes-book-btn"
                  onClick={handleSaveToMistakes}
                  disabled={isSaved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                    isSaved
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  {isSaved ? 'Saved in My Mistakes Book' : 'Save to My Mistakes'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.keyDifferences.map((diff, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 leading-relaxed"
                  >
                    • {diff}
                  </div>
                ))}
              </div>

              <p className="text-xs italic text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                💡 {result.summaryTip}
              </p>
            </div>

            {/* Interactive Sentence Puzzle Practice */}
            {result.practiceExercise && (
              <div id="say-it-better-puzzle" className="bg-indigo-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Interactive Practice Workout
                    </span>
                    <h3 className="text-base font-bold mt-0.5">
                      {result.practiceExercise.prompt}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      if (result.practiceExercise) {
                        setScrambledWords([...result.practiceExercise.jumbledWords]);
                        setSelectedWords([]);
                        setIsPuzzleChecked(false);
                      }
                    }}
                    className="text-xs text-indigo-300 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Drop Area */}
                <div className="min-h-[56px] p-3 bg-indigo-950/80 rounded-2xl border-2 border-dashed border-indigo-700 flex flex-wrap gap-2 items-center">
                  {selectedWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handleRemoveWord(word, i)}
                      className="px-3 py-1.5 bg-white text-indigo-950 font-bold rounded-xl text-sm shadow-xs hover:bg-rose-100 transition-all"
                    >
                      {word}
                    </button>
                  ))}
                  {selectedWords.length === 0 && (
                    <span className="text-xs text-indigo-400">Click the words below in the correct order...</span>
                  )}
                </div>

                {/* Scrambled Word Pool */}
                <div className="flex flex-wrap gap-2">
                  {scrambledWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handleWordClick(word, i)}
                      className="px-3.5 py-1.5 bg-indigo-800/90 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm border border-indigo-700 transition-all shadow-2xs"
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-indigo-300 italic">
                    Hint: {result.practiceExercise.hint}
                  </span>

                  <button
                    onClick={handleCheckPuzzle}
                    disabled={selectedWords.length === 0 || isPuzzleChecked}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    Check Order
                  </button>
                </div>

                {isPuzzleChecked && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      isPuzzleCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isPuzzleCorrect
                      ? '🎉 Perfect! You built the natural English sentence correctly.'
                      : `Target sentence was: "${result.practiceExercise.targetSentence}"`}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
