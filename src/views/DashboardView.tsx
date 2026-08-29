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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlacementTestModal } from '../components/PlacementTestModal';

export const DashboardView: React.FC = () => {
  const {
    userStats,
    userProfile,
    setCurrentView,
    dailyChallenge,
    isDailyChallengeCompleted,
    setSelectedGrammarTopicId,
    selectedSentenceLevel,
  } = useApp();

  const [placementModalOpen, setPlacementModalOpen] = useState(false);

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

  return (
    <div className="space-y-6 pb-12 text-[#1E293B] dark:text-slate-100 font-sans">
      {/* Top Welcome & Summary Metrics */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Level {userProfile.level} • FluentStep Professional
            </span>
            <button
              onClick={() => setCurrentView('adaptive_quiz')}
              className="text-[11px] text-slate-400 hover:text-indigo-600 underline transition-colors"
            >
              (CEFR Diagnostic Test)
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Alex is ready for today's English coaching session. What would you like to master?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 min-w-[110px]">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 leading-none">
              {userStats.xp}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">
              Total XP
            </p>
          </div>

          <div className="text-center px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 min-w-[110px]">
            <p className="text-2xl font-bold text-orange-500 leading-none flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-orange-500 inline" /> {userStats.streakDays}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">
              Day Streak
            </p>
          </div>
        </div>
      </section>

      {/* AI Course Generator Quick Prompt Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">
            <Sparkles size={14} className="text-amber-300" />
            <span>AI Course Generator & Instant Teacher</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            What do you want to achieve in English?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Tell our AI what you need (e.g. <em>"English for Remote Tech Work"</em> or <em>"IELTS Band 8 Speaking"</em>) and get a full custom curriculum instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('course_generator')}
            className="px-6 py-3.5 bg-white text-indigo-900 hover:bg-slate-50 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} className="text-indigo-600" />
            <span>Generate Custom Course</span>
          </button>
          <button
            onClick={() => setCurrentView('ai_teacher')}
            className="px-5 py-3.5 bg-indigo-900/60 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm rounded-2xl border border-indigo-400/30 transition-all flex items-center gap-2"
          >
            <MessageSquare size={16} />
            <span>Live AI Teacher Sarah</span>
          </button>
        </div>
      </div>

      {/* AI Personal English Tutor Featured Banner */}
      <div
        id="dash-ai-tutor-banner"
        className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-3xl shadow-md border border-indigo-300/30">
              🎙️
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping"></span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                Personal AI Tutor & Memory
              </span>
              <span className="text-xs text-indigo-200">Active Adaptation Enabled</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Voice Tutor Alex • {userProfile.level} English
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Talk freely via microphone. Alex remembers your common mistakes, guides natural conversations, and provides gentle, real-time diagnostic feedback.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            id="dash_btn_voice_tutor_start"
            onClick={() => setCurrentView('voice_tutor')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span>Launch Voice Tutor</span>
          </button>
          <button
            id="dash_btn_tutor_memory_open"
            onClick={() => setCurrentView('tutor_memory')}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/15 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Tutor Memory</span>
          </button>
        </div>
      </div>

      {/* Flagship AI Navigation Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="dash_card_diagnostics"
          onClick={() => setCurrentView('ai_diagnostics')}
          className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-left group shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Skill Diagnostics
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Root-cause analysis & error patterns
            </p>
          </div>
        </button>

        <button
          id="dash_card_emergency_help"
          onClick={() => setCurrentView('emergency_help')}
          className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 transition-all text-left group shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              I Need English Now
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Emergency high-stakes quick prep
            </p>
          </div>
        </button>

        <button
          id="dash_card_word_retrieval"
          onClick={() => setCurrentView('word_retrieval')}
          className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-left group shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Word Retrieval Gym
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Timed active vocabulary recall
            </p>
          </div>
        </button>

        <button
          id="dash_card_missions"
          onClick={() => setCurrentView('missions')}
          className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all text-left group shadow-xs cursor-pointer flex flex-col justify-between"
        >
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl w-fit mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Real-Life Missions
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Goal-driven audio roleplay
            </p>
          </div>
        </button>
      </div>

      {/* 6 Quick AI Power Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          id="dash_btn_daily_session"
          onClick={() => setCurrentView('daily_session')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
        >
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">15-Min Habit</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Daily 5-step session</p>
          </div>
        </button>

        <button
          id="dash_btn_sentence_patterns"
          onClick={() => setCurrentView('sentence_patterns')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
        >
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-2">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Patterns Studio</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Reusable structures</p>
          </div>
        </button>

        <button
          id="dash_btn_writing_coach"
          onClick={() => setCurrentView('writing_coach')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
        >
          <div className="p-2 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-xl w-fit mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Writing Coach</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Email & essay critique</p>
          </div>
        </button>

        <button
          id="dash_btn_reading_lab"
          onClick={() => setCurrentView('reading_lab')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
        >
          <div className="p-2 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl w-fit mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Reading Lab</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Level-graded articles</p>
          </div>
        </button>

        <button
          id="dash_btn_story_mode"
          onClick={() => setCurrentView('story_mode')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
        >
          <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl w-fit mb-2">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Story Mode</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Interactive RPG path</p>
          </div>
        </button>

        <button
          id="dash_btn_pronunciation_lab"
          onClick={() => setCurrentView('pronunciation_lab')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-400 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
        >
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-xl w-fit mb-2">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">Pronunciation</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Mouth guides & audio</p>
          </div>
        </button>
      </div>

      {/* Main 2-Column Professional Polish Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sentence Builder 2.0 Resume Activity Card */}
          <div className="bg-indigo-600 rounded-3xl p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden relative shadow-lg shadow-indigo-600/15">
            <div className="z-10">
              <span className="bg-indigo-500/50 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 inline-block text-indigo-100">
                Core Module
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                Sentence Expansion & Builder
              </h2>
              <p className="text-indigo-100 mb-6 opacity-90 max-w-md text-xs sm:text-sm leading-relaxed">
                Build progressive 5-layer sentences and transform positive statements to past, future, negatives, and questions.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  id="dash_btn_resume_sentence"
                  onClick={() => setCurrentView('sentence_expansion')}
                  className="bg-white text-indigo-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
                >
                  Step-by-Step Expander
                </button>
                <button
                  onClick={() => setCurrentView('sentence_builder')}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                >
                  Drag & Drop Puzzle
                </button>
              </div>
            </div>

            {/* Decorative Watermark */}
            <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-1/4 translate-y-1/4 font-black text-[160px] sm:text-[180px] pointer-events-none select-none tracking-tighter">
              FLOW
            </div>
          </div>

          {/* 4 Core Learning Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              id="dash_card_phrasal"
              onClick={() => setCurrentView('phrasal_verbs')}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🧩
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">
                  Phrasal Verbs Hub
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Master verb + particle formulas (give up, run out of, figure out) with mini dialogues.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Explore Verbs</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              id="dash_card_collocations"
              onClick={() => setCurrentView('collocations')}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">
                  Collocations Master
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Learn natural word combinations: Make vs Do, Take vs Have, Pay attention, etc.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Master Collocations</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              id="dash_card_listening"
              onClick={() => setCurrentView('listening')}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🎧
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">
                  Listening Comprehension
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Audio passages, hideable transcripts, and comprehension quizzes to train your ear.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Start Listening</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              id="dash_card_communication"
              onClick={() => setCurrentView('communication_skills')}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  💼
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">
                  Real-Life Skills & Diplomacy
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ordering food, interview answers, polite disagreement, and workplace formality spectrums.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span>View Scenarios</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* AI Personal English Coach & Real-Life System Highlight */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white border border-indigo-800/40 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-900/60 px-2.5 py-1 rounded-md border border-indigo-700/50">
                  AI Personal Coach Suite
                </span>
                <h3 className="text-xl font-bold mt-2 text-white">
                  Real-Life English Communication Studio
                </h3>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Action-oriented modules designed for career, travel, and natural everyday fluency.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('learning_roadmap')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>My Roadmap</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => setCurrentView('fluency_mode')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-indigo-500/20 text-left transition-all group"
              >
                <div className="text-xl mb-1.5">⚡</div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  Fluency Mode
                </div>
                <p className="text-[10px] text-indigo-200/70 mt-0.5">Speed speaking & hesitation reducer</p>
              </button>

              <button
                onClick={() => setCurrentView('english_for_life')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-indigo-500/20 text-left transition-all group"
              >
                <div className="text-xl mb-1.5">🎯</div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  English For My Life
                </div>
                <p className="text-[10px] text-indigo-200/70 mt-0.5">Custom career & situation curriculum</p>
              </button>

              <button
                onClick={() => setCurrentView('phone_call_simulator')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-indigo-500/20 text-left transition-all group"
              >
                <div className="text-xl mb-1.5">📞</div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  Phone Simulator
                </div>
                <p className="text-[10px] text-indigo-200/70 mt-0.5">Realistic audio calls & active listening</p>
              </button>

              <button
                onClick={() => setCurrentView('missions_mode')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-indigo-500/20 text-left transition-all group"
              >
                <div className="text-xl mb-1.5">🗺️</div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  Real-Life Missions
                </div>
                <p className="text-[10px] text-indigo-200/70 mt-0.5">Hotel, dinner, meeting scenarios</p>
              </button>

              <button
                onClick={() => setCurrentView('sound_natural')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-indigo-500/20 text-left transition-all group"
              >
                <div className="text-xl mb-1.5">✨</div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  Sound Natural
                </div>
                <p className="text-[10px] text-indigo-200/70 mt-0.5">Unnatural phrasing fix & alternatives</p>
              </button>

              <button
                onClick={() => setCurrentView('voice_journal')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-indigo-500/20 text-left transition-all group"
              >
                <div className="text-xl mb-1.5">🎙️</div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  Voice Journal
                </div>
                <p className="text-[10px] text-indigo-200/70 mt-0.5">Daily recordings & AI fluency audit</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Goal Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-xs">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-between text-slate-900 dark:text-slate-100">
              <span>Today's Goal</span>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-extrabold">
                {goalPercent}%
              </span>
            </h3>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>
                    Vocabulary ({userStats.dailyGoal.currentWords}/{userStats.dailyGoal.targetWords} words)
                  </span>
                  <span>{wordsGoalPercent}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${wordsGoalPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>
                    Sentences ({userStats.dailyGoal.currentSentences}/{userStats.dailyGoal.targetSentences} completed)
                  </span>
                  <span>{sentencesGoalPercent}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${sentencesGoalPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>
                    Conversation ({userStats.dailyGoal.currentConversations}/{userStats.dailyGoal.targetConversations} session)
                  </span>
                  <span>{convoGoalPercent}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      convoGoalPercent > 0 ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: `${Math.max(5, convoGoalPercent)}%` }}
                  />
                </div>
              </div>

              {/* Daily Challenge Bottom Section */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50 flex items-start gap-3">
                  <span className="text-xl">🏆</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-tight mb-1">
                      Daily Challenge (+{dailyChallenge.xpReward} XP)
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-200 leading-snug">
                      Use the word <strong>"{dailyChallenge.word}"</strong> in a complete sentence challenge.
                    </p>
                    <button
                      onClick={() => setCurrentView('daily_challenge')}
                      className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {isDailyChallengeCompleted ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Challenge Completed</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} />
                          <span>Start Daily Challenge</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional vs Global English Spotlight */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Globe size={14} />
                <span>Global English Guide</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare Nigerian & International English phrasing.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('common_differences')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-bold text-xs transition-colors"
            >
              Explore →
            </button>
          </div>
        </div>
      </div>

      <PlacementTestModal isOpen={placementModalOpen} onClose={() => setPlacementModalOpen(false)} />
    </div>
  );
};
