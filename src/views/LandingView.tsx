import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Layers,
  MessageSquare,
  Mic,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlacementTestModal } from '../components/PlacementTestModal';

export const LandingView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [placementOpen, setPlacementOpen] = useState(false);

  const pillars = [
    {
      icon: <BookOpen className="text-emerald-500" size={28} />,
      title: 'Learn Vocabulary',
      description: 'Master everyday words with clear definitions, pronunciation audio, synonyms, and real sentences.',
      tag: '16 Categories',
    },
    {
      icon: <Layers className="text-blue-500" size={28} />,
      title: 'Build Sentences',
      description: 'Step-by-step word builder from basic Subject+Verb+Object to complex natural conversation patterns.',
      tag: '10 Levels',
    },
    {
      icon: <MessageSquare className="text-purple-500" size={28} />,
      title: 'Talk to AI English Tutor',
      description: 'Practice realistic conversations in 15+ situations with instant, patient, non-intrusive corrections.',
      tag: 'Patient AI',
    },
    {
      icon: <GraduationCap className="text-amber-500" size={28} />,
      title: 'Natural Grammar',
      description: 'Simple, non-academic grammar explanations with clear formulas, wrong-vs-right checks, and quizzes.',
      tag: 'No Jargon',
    },
    {
      icon: <Mic className="text-rose-500" size={28} />,
      title: 'Speaking Practice',
      description: 'Speak out loud into your microphone, get real-time speech transcription, fluency scores, and pronunciation tips.',
      tag: 'Speech-to-Text',
    },
    {
      icon: <Sparkles className="text-teal-500" size={28} />,
      title: 'Make English Natural',
      description: 'Type any rough thought or draft and discover how native English speakers would rephrase it naturally.',
      tag: 'Instant Polisher',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Top Floating Nav */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Sparkles size={22} />
          </div>
          <span className="font-extrabold text-xl text-zinc-900 dark:text-zinc-100 tracking-tight">
            FluentStep
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="landing_btn_take_placement"
            onClick={() => setPlacementOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all"
          >
            <Award size={15} />
            Free Placement Test
          </button>

          <button
            id="landing_btn_enter_app"
            onClick={() => setCurrentView('dashboard')}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
          >
            Enter Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles size={14} />
            <span>Interactive English Learning & Sentence Builder</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight max-w-4xl mx-auto">
            Learn English. <span className="text-emerald-600 dark:text-emerald-400">Build Better Sentences.</span> Speak With Confidence.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Learn vocabulary, understand sentence structure step by step, practice grammar naturally, and have real conversations with your personal AI English tutor.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero_btn_start_learning"
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Start Learning Free</span>
              <ArrowRight size={18} />
            </button>

            <button
              id="hero_btn_try_demo"
              onClick={() => setPlacementOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 font-semibold text-base border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Play size={16} className="text-emerald-600 fill-emerald-600" />
              <span>Take 2-Min Placement Test</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Beginner to Intermediate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>Gentle AI Corrections</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Audio Pronunciations</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Example Demo Card */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-zinc-500 ml-2">Live Experience Preview</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              SVO Formula
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                1. Word Arrangement Exercise
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold text-sm border border-blue-200">
                  I
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-sm border border-emerald-200">
                  went
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold text-sm border border-purple-200">
                  to the market
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold text-sm border border-rose-200">
                  yesterday.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-blue-600 block">I</span>
                  <span className="text-zinc-500">Subject (Who)</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-emerald-600 block">went</span>
                  <span className="text-zinc-500">Verb (Action)</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-purple-600 block">to the market</span>
                  <span className="text-zinc-500">Place (Where)</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-rose-600 block">yesterday</span>
                  <span className="text-zinc-500">Time (When)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  AI Tutor Feedback Example
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  "Nice try! Instead of <em>'I am go to school yesterday'</em>, say <em>'I went to school yesterday'</em> because <strong>yesterday</strong> signals the past tense."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Comprehensive Curriculum
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            Everything You Need to Master English
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-2">
            Structured modules designed to build your vocabulary, sentence construction speed, and spoken communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                    {p.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <button
                id={`landing_card_cta_${idx}`}
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Explore Feature</span>
                <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Placement Test Modal */}
      <PlacementTestModal isOpen={placementOpen} onClose={() => setPlacementOpen(false)} />
    </div>
  );
};
