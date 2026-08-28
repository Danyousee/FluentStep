import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Mic,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Zap,
  Target,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WeeklyReportView: React.FC = () => {
  const { userProfile, userStats } = useApp();

  const wordsLearnedCount = userStats.wordsLearned.length || 14;
  const streakDays = userStats.streakDays || 4;
  const speakingMins = userStats.speakingMinutes || 25;
  const sentencesBuilt = userStats.sentencesCompleted || 18;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Weekly Learning Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Weekly Progress & Mastery Report
          </h1>
          <p className="text-indigo-100/90 text-sm max-w-2xl leading-relaxed">
            A comprehensive summary of your English growth, speech momentum, retention patterns, and key focus targets for the week ahead.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Words Mastered', value: `${wordsLearnedCount}`, sub: '+6 this week', icon: <BookOpen className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
          { label: 'Speaking Minutes', value: `${speakingMins}m`, sub: 'Real audio flow', icon: <Mic className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'Sentences Built', value: `${sentencesBuilt}`, sub: '100% grammatically checked', icon: <Zap className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { label: 'Study Streak', value: `${streakDays} Days`, sub: 'Active momentum', icon: <Award className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-950/40' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl ${item.bg}`}>{item.icon}</div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {item.value}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Core Strength */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Top Performing Strength</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Sentence Construction & Word Flow
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You achieved an 88% accuracy rate on sentence building exercises this week. Your subject-verb-object alignment is becoming instinctive and effortless.
          </p>
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
            "Keep maintaining this habit — rapid sentence construction directly elevates your speaking response speed."
          </div>
        </div>

        {/* Areas Needing Attention */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>Primary Focus Target</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Prepositions of Place (in vs. at vs. on)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            3 mistakes were logged this week regarding prepositions with cities and buildings (e.g. saying <em>"living at London"</em> instead of <em>"living in London"</em>).
          </p>
          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
            Rule reminder: Large cities, countries, and rooms take <strong>IN</strong>. Specific points and addresses take <strong>AT</strong>. Surfaces take <strong>ON</strong>.
          </div>
        </div>
      </div>

      {/* Most Common Mistake Deep Dive */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Deep Dive: Most Common Mistake of the Week
          </span>
          <span className="text-xs font-bold text-rose-500">Occurred 2 times</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1">
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">The Mistake Logged:</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white line-through">
              "I very like this food."
            </div>
            <p className="text-xs text-slate-500">
              "Very" is an intensifier for adjectives, not verbs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">The Natural Phrasing:</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              "I really like this food." / "I like this food very much."
            </div>
            <p className="text-xs text-slate-500">
              Use "really" directly before verbs, or "very much" at the end.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation for Next Week */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-900/40 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
        <div className="space-y-1 text-xs">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Coach Alex's Recommendation For Next Week:
          </h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Spend 5 minutes every morning in <strong>Fluency Mode</strong> recording continuous speech about your daily plans. Complete <strong>Day 5 & 6</strong> of your 30-Day Roadmap to reinforce question formation.
          </p>
        </div>
      </div>
    </div>
  );
};
