import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  MessageSquare,
  Mic,
  GraduationCap,
  Sparkles,
  Flame,
  Zap,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Trophy,
  Clock,
  HelpCircle,
  Puzzle,
  Link2,
  Headphones,
  Globe,
  Award,
  Check,
  ChevronRight,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlacementTestModal } from '../components/PlacementTestModal';
import { SentenceLearningLoopModal } from '../components/SentenceLearningLoopModal';
import {
  calculateCommunicationReadiness,
  generateTodayPersonalizedPlan,
  diagnoseLearnerWeakness,
} from '../services/learnerIntelligenceEngine';

export const DashboardView: React.FC = () => {
  const {
    userStats,
    userProfile,
    activeVocabWords,
    setCurrentView,
    dailyChallenge,
    isDailyChallengeCompleted,
    setSelectedGrammarTopicId,
    selectedSentenceLevel,
  } = useApp();

  const [placementModalOpen, setPlacementModalOpen] = useState(false);
  const [sentenceLoopModalOpen, setSentenceLoopModalOpen] = useState(false);
  const [targetLoopTopic, setTargetLoopTopic] = useState('discuss');

  // Compute authentic demonstrated Communication Readiness
  const readiness = calculateCommunicationReadiness(userStats, userProfile, activeVocabWords);
  // Compute authentic personalized daily practice plan
  const dailyPlan = generateTodayPersonalizedPlan(userStats, userProfile);
  // Diagnose top weakness
  const diagnosis = diagnoseLearnerWeakness(userStats, userProfile);

  // Daily goal calculation
  const totalGoalItems =
    userStats.dailyGoal.targetWords +
    userStats.dailyGoal.targetSentences +
    userStats.dailyGoal.targetConversations;
  const currentGoalItems =
    userStats.dailyGoal.currentWords +
    userStats.dailyGoal.currentSentences +
    userStats.dailyGoal.currentConversations;
  const goalPercent = Math.min(100, Math.round((currentGoalItems / totalGoalItems) * 100));

  const wordsGoalPercent = Math.min(
    100,
    Math.round((userStats.dailyGoal.currentWords / (userStats.dailyGoal.targetWords || 1)) * 100)
  );
  const sentencesGoalPercent = Math.min(
    100,
    Math.round((userStats.dailyGoal.currentSentences / (userStats.dailyGoal.targetSentences || 1)) * 100)
  );
  const convoGoalPercent = Math.min(
    100,
    Math.round((userStats.dailyGoal.currentConversations / (userStats.dailyGoal.targetConversations || 1)) * 100)
  );

  const unmasteredMistakes = userStats.mistakes?.filter((m) => !m.mastered).length || 0;

  const handleLaunchStep = (step: any) => {
    if (step.targetNav?.page) {
      if (step.targetNav.id) {
        setSelectedGrammarTopicId(step.targetNav.id);
      }
      setCurrentView(step.targetNav.page);
    }
  };

  const handleOpenSentenceLoop = (word?: string) => {
    if (word) setTargetLoopTopic(word);
    setSentenceLoopModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-16 text-[#1E293B] dark:text-slate-100 font-sans">
      {/* Top Welcome & Demonstrated Readiness Scorecard Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60">
              CEFR Level {userProfile.level} • Personal English Coach
            </span>
            <button
              onClick={() => setCurrentView('adaptive_quiz')}
              className="text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
            >
              Take CEFR Diagnostic Test
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {readiness.summarySentence}
          </p>
        </div>

        {/* Demonstrated Ability vs Activity Badge Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Readiness Score */}
          <div className="text-center px-4 py-3 bg-indigo-50/70 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 min-w-[125px]">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
              {readiness.overallScore}%
            </div>
            <div className="text-[10px] text-indigo-800 dark:text-indigo-300 font-extrabold uppercase mt-1 tracking-tight">
              Readiness ({readiness.demonstratedLevel})
            </div>
          </div>

          {/* Day Streak */}
          <div className="text-center px-4 py-3 bg-amber-50/70 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-800/80 min-w-[100px]">
            <div className="text-2xl font-black text-orange-500 leading-none flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-orange-500 inline" /> {userStats.streakDays}
            </div>
            <div className="text-[10px] text-amber-800 dark:text-amber-300 font-extrabold uppercase mt-1 tracking-tight">
              Day Streak
            </div>
          </div>

          {/* Total XP */}
          <div className="text-center px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[100px]">
            <div className="text-2xl font-black text-slate-800 dark:text-slate-200 leading-none">
              {userStats.xp}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-1 tracking-tight">
              Total XP
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 1: WHAT SHOULD I PRACTICE TODAY? (PERSONALIZED DAILY PLAN) */}
      {/* ================================================================ */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/40 relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/60 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-xs font-extrabold text-indigo-300 border border-indigo-500/30">
              <Sparkles size={14} className="text-amber-400" />
              <span>TODAY'S PERSONALIZED PRACTICE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Target Priority: {dailyPlan.topWeakness}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-2xl">
              💡 <strong>Why this focus:</strong> {dailyPlan.weaknessReason}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-indigo-200">
                Completed: {dailyPlan.completedCount}/{dailyPlan.steps.length} Steps
              </div>
              <div className="text-[11px] text-indigo-300">
                Est. Time: {dailyPlan.totalEstimatedMinutes} mins • +{dailyPlan.totalXp} XP
              </div>
            </div>
            <button
              onClick={() => handleLaunchStep(dailyPlan.steps[0])}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play size={16} />
              <span>Start Daily Plan</span>
            </button>
          </div>
        </div>

        {/* 6-Step Daily Practice Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dailyPlan.steps.map((step) => (
            <div
              key={step.stepNumber}
              onClick={() => handleLaunchStep(step)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-indigo-500/20 hover:border-indigo-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200">
                    Step {step.stepNumber} • {step.durationMinutes} min
                  </span>
                  <span className="text-xs font-bold text-amber-400">+{step.xpReward} XP</span>
                </div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-white">
                <span>{step.completed ? 'Completed' : 'Launch Step →'}</span>
                {step.completed && <Check size={14} className="text-green-400" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: THE COMPLETE SENTENCE LEARNING LOOP (FEATURED HIGHLIGHT) */}
      {/* ================================================================ */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                Core Training Loop
              </span>
              <span className="text-xs text-slate-500">10-Stage Mastery Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              The Complete Sentence Learning Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Learn → Build → Check → Explain → Rebuild → Expand → Transform → Create → Speak → Use in Conversation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenSentenceLoop('collaborate')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              "collaborate"
            </button>
            <button
              onClick={() => handleOpenSentenceLoop('discuss')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              "discuss"
            </button>
            <button
              onClick={() => handleOpenSentenceLoop('look forward to')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              "look forward to"
            </button>
            <button
              onClick={() => handleOpenSentenceLoop()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw size={14} />
              <span>Launch 10-Step Loop</span>
            </button>
          </div>
        </div>

        {/* Visual Stepper Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-2">
          {[
            { num: 1, title: 'Learn', desc: 'Formula' },
            { num: 2, title: 'Build', desc: 'Tile puzzle' },
            { num: 3, title: 'Explain', desc: 'Grammar rule' },
            { num: 4, title: 'Rebuild', desc: 'Memory recall' },
            { num: 5, title: 'Expand', desc: '10 layers' },
            { num: 6, title: 'Transform', desc: 'Past/Neg/Q' },
            { num: 7, title: 'Create', desc: 'Own ideas' },
            { num: 8, title: 'Speak', desc: 'Voice check' },
            { num: 9, title: 'Talk', desc: 'AI dialogue' },
            { num: 10, title: 'Review', desc: 'Spaced SRS' },
          ].map((item) => (
            <div
              key={item.num}
              onClick={() => handleOpenSentenceLoop()}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center hover:border-purple-400 cursor-pointer transition-all"
            >
              <div className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400">
                0{item.num}
              </div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{item.title}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: PRIMARY ACTION HUBS (INTUITIVE, NO UNWANTED CLUTTER) */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Primary Training Hubs
          </h2>
          <span className="text-xs text-slate-400 font-medium">Choose your focus area</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hub 1: Build Sentences */}
          <div
            onClick={() => setCurrentView('sentence_expansion')}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🧱
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Sentence Expansion & Gym
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Progressive 10-layer expansions, transformation gym, and formula builder.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Start Building Sentences</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 2: Practice Speaking */}
          <div
            onClick={() => setCurrentView('speaking_practice')}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Practice Speaking Aloud
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Microphone voice verification, rhythm stress, and pronunciation analysis.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch Voice Practice</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 3: Talk to AI */}
          <div
            onClick={() => setCurrentView('ai_tutor')}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Talk to AI (Alex & Sarah)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Personalized conversational coach who remembers your mistakes and guides dialogues.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Start Dialogue</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 4: Review Mistakes */}
          <div
            onClick={() => setCurrentView('my_mistakes')}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🩺
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Mistake Surgery Gym
                </h3>
                {unmasteredMistakes > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                    {unmasteredMistakes} open
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Convert your real past errors into mastered, natural sentence patterns.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Perform Mistake Surgery</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 5: Express My Thoughts ("How Do I Say This?") */}
          <div
            onClick={() => setCurrentView('how_do_i_say_this')}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                💡
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                "How Do I Say This?" Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Simple, Natural, Polite, and Professional variations for any real situation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Express Idea</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 6: Smart Review */}
          <div
            onClick={() => setCurrentView('smart_review')}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Smart Spaced Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                SRS vocabulary review, difficult patterns, and weak grammar consolidation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Review SRS Items</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: DEMONSTRATED READINESS SCORECARD (ACTIVITY VS ABILITY) */}
      {/* ================================================================ */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Demonstrated Communication Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real competency scores evaluated from your completed exercises, not just activity volume.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('progress')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
          >
            View Comprehensive Analytics →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Sentence Construction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Sentence Construction</span>
              <span className="text-indigo-600">{readiness.subScores.sentenceConstruction}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${readiness.subScores.sentenceConstruction}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Based on {userStats.sentencesCompleted} sentences assembled
            </p>
          </div>

          {/* 2. Grammar Accuracy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Grammar Accuracy</span>
              <span className="text-emerald-600">{readiness.subScores.grammarAccuracy}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${readiness.subScores.grammarAccuracy}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Calculated from mistake mastery & rule quizzes
            </p>
          </div>

          {/* 3. Speaking Fluency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Speaking & Vocal Fluency</span>
              <span className="text-purple-600">{readiness.subScores.speakingFluency}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${readiness.subScores.speakingFluency}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Logged {userStats.speakingMinutes} minutes of active speech
            </p>
          </div>

          {/* 4. Vocabulary Depth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Vocabulary Depth</span>
              <span className="text-amber-600">{readiness.subScores.vocabularyDepth}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${readiness.subScores.vocabularyDepth}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {userStats.wordsLearned.length} active vocabulary words mastered
            </p>
          </div>

          {/* 5. Listening Precision */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Listening Precision</span>
              <span className="text-blue-600">{readiness.subScores.listeningPrecision}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${readiness.subScores.listeningPrecision}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {userStats.listeningCompleted} passages comprehended
            </p>
          </div>

          {/* 6. Conversation Agility */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Conversation Agility</span>
              <span className="text-teal-600">{readiness.subScores.conversationAgility}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${readiness.subScores.conversationAgility}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {userStats.conversationsCompleted} AI dialogue sessions completed
            </p>
          </div>
        </div>
      </section>

      {/* Daily Challenge Bottom Card */}
      <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-3xl border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
            🏆
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase text-amber-800 dark:text-amber-300">
              Daily Challenge (+{dailyChallenge.xpReward} XP)
            </div>
            <h3 className="text-base font-extrabold text-amber-950 dark:text-amber-100 mt-0.5">
              Construct a complete sentence with: <strong>"{dailyChallenge.word}"</strong>
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-200 mt-0.5">
              Reinforces active usage and elevates your Communication Readiness score.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('daily_challenge')}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
        >
          {isDailyChallengeCompleted ? (
            <>
              <CheckCircle2 size={16} />
              <span>Challenge Completed</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Start Daily Challenge</span>
            </>
          )}
        </button>
      </div>

      {/* Complete Sentence Learning Loop Modal */}
      <SentenceLearningLoopModal
        isOpen={sentenceLoopModalOpen}
        onClose={() => setSentenceLoopModalOpen(false)}
        initialTopicOrWord={targetLoopTopic}
        sourceContext="Dashboard"
      />

      {/* Diagnostic Placement Modal */}
      <PlacementTestModal isOpen={placementModalOpen} onClose={() => setPlacementModalOpen(false)} />
    </div>
  );
};
