import React from 'react';
import {
  BarChart3,
  Flame,
  Zap,
  Award,
  Trophy,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  MessageSquare,
  Mic,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressView: React.FC = () => {
  const { userStats, badges, setCurrentView, setSelectedGrammarTopicId } = useApp();

  const masteredGrammarCount = Object.values(userStats.grammarMastery).filter(
    (score) => Number(score) >= 80
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <BarChart3 size={16} />
          <span>Analytics & Achievements</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
          Learning Progress & Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Track your growth across vocabulary, sentence construction, grammar, and speaking.
        </p>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Zap size={20} className="fill-amber-400" />
            <span className="text-xs font-bold uppercase text-slate-400">Total XP</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {userStats.xp}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Experience Points</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Flame size={20} className="fill-orange-500" />
            <span className="text-xs font-bold uppercase text-slate-400">Streak</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {userStats.streakDays}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Consecutive Days</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <BookOpen size={20} />
            <span className="text-xs font-bold uppercase text-slate-400">Words</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {userStats.wordsLearned.length + 1420}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Vocabulary Mastered</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Layers size={20} />
            <span className="text-xs font-bold uppercase text-slate-400">Sentences</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {userStats.sentencesCompleted}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Sentences Built</span>
        </div>
      </div>

      {/* Skill Domains Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain Progress Bars */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Skills Breakdown
          </h3>

          <div className="space-y-4 text-xs">
            {/* Vocabulary */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Vocabulary Mastery
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">92% Mastered</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `92%` }}
                />
              </div>
            </div>

            {/* Sentence Builder */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Sentence Levels
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{userStats.completedLevels.length} / 10 Levels</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(userStats.completedLevels.length / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Grammar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Grammar Topics Mastered
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{masteredGrammarCount} / 16</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(masteredGrammarCount / 16) * 100}%` }}
                />
              </div>
            </div>

            {/* Speaking & Chats */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Conversation Practice
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{userStats.conversationsCompleted} Completed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, (userStats.conversationsCompleted / 10) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weak Areas & Targeted Practice */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Weak Areas & Targeted Review
            </h3>
            <span className="text-xs text-amber-600 font-bold">
              {userStats.weakAreas.length} Areas
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            FluentStep automatically analyzes your mistakes to suggest high-impact practice topics.
          </p>

          <div className="space-y-3">
            {userStats.weakAreas.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {w.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold">
                      {w.mistakeCount} mistakes
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Last occurred: {w.lastOccurred}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedGrammarTopicId(w.recommendedLessonId);
                    setCurrentView('grammar_lesson');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0 flex items-center gap-1 shadow-xs transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Review</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Badges & Trophies
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = badge.progress >= badge.maxProgress;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                }`}
              >
                <div className="text-3xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {badge.icon}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {badge.description}
                  </p>
                  <div className="pt-2">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
