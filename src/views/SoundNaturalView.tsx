import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Send,
  RefreshCw,
  Lightbulb,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SOUND_NATURAL_PAIRS } from '../data/soundNaturalData';
import { evaluateSoundNatural } from '../services/aiService';
import { soundService } from '../services/soundService';

export const SoundNaturalView: React.FC = () => {
  const { addXP } = useApp();

  const [pairs] = useState(SOUND_NATURAL_PAIRS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userSentence, setUserSentence] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const categories = ['All', 'Everyday Chat', 'Work & Professional', 'Feelings & State', 'Social & Casual'];

  const filteredPairs = pairs.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleEvaluate = async () => {
    if (!userSentence.trim()) return;
    setIsEvaluating(true);
    soundService.playClick();

    const res = await evaluateSoundNatural(userSentence);
    if (res) {
      setEvaluationResult(res);
      soundService.playFanfare();
      addXP(20, 'Sound Natural Analysis Completed!');
    }
    setIsEvaluating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-amber-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Natural Native Nuance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sound More Natural: Textbook vs. Native
          </h1>
          <p className="text-amber-100/90 text-sm max-w-2xl leading-relaxed">
            Move beyond rigid textbook phrases. Discover how native speakers actually express everyday feelings, requests, and opinions with effortless nuance.
          </p>
        </div>
      </div>

      {/* Interactive Sentence Polisher (Live AI Test) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Interactive Phrase Naturalizer</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter any sentence you usually say, and the AI will evaluate how natural it sounds and suggest native alternatives.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userSentence}
            onChange={(e) => setUserSentence(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEvaluate()}
            placeholder="e.g. I am very tired, I am agree with your opinion, How do you do?..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleEvaluate}
            disabled={!userSentence.trim() || isEvaluating}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
          >
            {isEvaluating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Analyze Naturalness</span>
          </button>
        </div>

        {/* Live Evaluation Card */}
        {evaluationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
                Naturalness Score: {evaluationResult.naturalnessRating} / 5 Stars
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[11px] text-slate-400 font-semibold">Your Sentence (Textbook/Rigid):</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  "{evaluationResult.textbookPhrase || userSentence}"
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 space-y-1">
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center justify-between">
                  <span>Natural Native Version:</span>
                  <button
                    onClick={() => soundService.speak(evaluationResult.naturalPhrase)}
                    className="text-amber-500 hover:text-amber-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  "{evaluationResult.naturalPhrase}"
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Why Native Speakers Say This: </strong>
              {evaluationResult.explanation}
            </div>
          </motion.div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Library of Textbook vs Native Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPairs.map((pair) => (
          <motion.div
            key={pair.id}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                {pair.category}
              </span>
              <span className="text-xs text-slate-400">{pair.context}</span>
            </div>

            {/* Comparison Boxes */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Textbook / Stiff:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    "{pair.textbookVersion}"
                  </span>
                </div>
                <button
                  onClick={() => soundService.speak(pair.textbookVersion)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                    Natural / Conversational:
                  </span>
                  <span className="text-amber-900 dark:text-amber-200 font-bold">
                    "{pair.naturalVersion}"
                  </span>
                </div>
                <button
                  onClick={() => soundService.speak(pair.naturalVersion)}
                  className="text-amber-600 hover:text-amber-800 p-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
              {pair.explanation}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
