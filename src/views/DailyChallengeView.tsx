import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateSentenceWithAI, SentenceEvaluationData } from '../services/aiService';
import { AudioPlayerButton } from '../components/AudioPlayerButton';

export const DailyChallengeView: React.FC = () => {
  const {
    dailyChallenge,
    isDailyChallengeCompleted,
    completeDailyChallenge,
    userProfile,
    setCurrentView,
  } = useApp();

  const [userSentence, setUserSentence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<SentenceEvaluationData | null>(null);

  const handleSubmitChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSentence.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await evaluateSentenceWithAI({
      word: dailyChallenge.word,
      sentence: userSentence,
      context: dailyChallenge.definition,
      userLevel: userProfile.level,
    });

    setEvaluation(result);
    setIsSubmitting(false);

    if (result.isCorrect) {
      completeDailyChallenge();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 font-sans text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <Flame size={16} />
          <span>Daily Habit & Streak Booster</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
          Daily Sentence Challenge
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Write one correct sentence every day to keep your learning streak burning strong!
        </p>
      </div>

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
        {/* Word of the day banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Word of the Day • {dailyChallenge.date}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
              "{dailyChallenge.word}"
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              {dailyChallenge.pronunciation} • {dailyChallenge.partOfSpeech}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-2">
              {dailyChallenge.definition}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <AudioPlayerButton text={dailyChallenge.word} size="lg" label="Pronounce" />
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300">
              +{dailyChallenge.xpReward} XP Reward
            </span>
          </div>
        </div>

        {/* Task prompt */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Today's Mission:
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {dailyChallenge.taskPrompt}
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Target Model Example:</span>
            <span className="italic text-slate-800 dark:text-slate-200">"{dailyChallenge.exampleTarget}"</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitChallenge} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Your English Sentence:
            </label>
            <textarea
              id="daily_challenge_sentence_input"
              rows={3}
              disabled={isDailyChallengeCompleted}
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              placeholder={`Write a sentence using the word "${dailyChallenge.word}"...`}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-60"
            />
          </div>

          {!isDailyChallengeCompleted ? (
            <button
              id="btn_submit_daily_challenge"
              type="submit"
              disabled={!userSentence.trim() || isSubmitting}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Evaluating Sentence...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Submit Today's Challenge (+35 XP)</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center flex items-center justify-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Today's Daily Challenge is already completed! Streak secured 🔥</span>
            </div>
          )}
        </form>

        {/* AI Evaluation */}
        {evaluation && (
          <div
            className={`p-5 rounded-3xl border space-y-3 ${
              evaluation.isCorrect
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            }`}
          >
            <span className="font-bold text-sm block">
              {evaluation.isCorrect ? '🎉 Great English Sentence!' : '💡 Friendly Feedback:'}
            </span>
            <p className="text-xs leading-relaxed">{evaluation.feedback}</p>
            {evaluation.correctedSentence && (
              <p className="text-xs">
                <strong>Polished:</strong> "{evaluation.correctedSentence}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
