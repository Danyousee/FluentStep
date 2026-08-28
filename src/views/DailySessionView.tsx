import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { SENTENCE_PATTERNS } from '../data/sentencePatternsData';
import { COMMON_MISTAKES_DATABASE } from '../data/commonMistakesData';
import { PRONUNCIATION_SOUNDS } from '../data/pronunciationData';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Volume2,
  ArrowRight,
  BookOpen,
  Layers,
  Clock,
  Mic,
  AlertTriangle,
  Trophy,
  Check,
} from 'lucide-react';

interface DailySessionViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onCompleteSession?: () => void;
}

export const DailySessionView: React.FC<DailySessionViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
  onCompleteSession,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<{ [step: number]: boolean }>({});
  const [spokenSentences, setSpokenSentences] = useState<{ [id: string]: boolean }>({});

  // Pick level-appropriate materials for today's 15-minute curriculum
  const todaysVocab = VOCABULARY_LIST.slice(0, 3);
  const todaysPatterns = SENTENCE_PATTERNS.slice(0, 2);
  const todaysMistake = COMMON_MISTAKES_DATABASE[0];
  const todaysSound = PRONUNCIATION_SOUNDS[0];

  const steps = [
    { id: 'concept', title: '1. Daily Core Concept', time: '2 mins' },
    { id: 'vocab', title: '2. Three High-Impact Words', time: '3 mins' },
    { id: 'patterns', title: '3. Two Reusable Sentence Patterns', time: '4 mins' },
    { id: 'speaking', title: '4. Pronunciation & Speaking Practice', time: '3 mins' },
    { id: 'mistake', title: '5. Mistake Prevention & Quiz', time: '3 mins' },
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const markStepDone = (stepIdx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIdx]: true }));
    if (stepIdx < steps.length - 1) {
      setCurrentStepIndex(stepIdx + 1);
    } else {
      // Completed full session
      onUpdateProgress((prev) => ({
        ...prev,
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 5),
        currentStreak: (prev.currentStreak || 0) + 1,
      }));
    }
  };

  const isSessionComplete = Object.keys(completedSteps).length === steps.length;

  return (
    <div id="daily-session-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100 border border-white/20">
            <Clock className="w-3.5 h-3.5" />
            15-Minute Daily Habit
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Today's Daily Learning Session</h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            A balanced, science-backed 15-minute routine: 1 Core Concept • 3 Vocabulary Words • 2 Sentence Patterns • 1 Pronunciation Practice • 1 Mistake Review.
          </p>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isDone = completedSteps[idx];
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                  : isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/30 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-400">{step.time}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="text-xs font-bold truncate">{step.title}</div>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm space-y-6">
        {/* Step 1: Concept */}
        {currentStepIndex === 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 1 of 5
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                Core Concept: The Power of SVO (Subject + Verb + Object)
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                English is fundamentally a positional language. When you place the Person (Subject) first, followed by the Action (Verb), and what receives the action (Object), native speakers instantly understand you clearly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                Formula Example:
              </div>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">[I]</span> +{' '}
                <span className="text-emerald-600 dark:text-emerald-400">[learn]</span> +{' '}
                <span className="text-purple-600 dark:text-purple-400">[English]</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Always establish the Subject and Verb before adding extra details like Place and Time.
              </p>
            </div>

            <button
              onClick={() => markStepDone(0)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all ml-auto"
            >
              Mark Understood & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Vocabulary */}
        {currentStepIndex === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Step 2 of 5
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                3 High-Impact Words for Today
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Listen to the pronunciation and see how each word functions in a real sentence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todaysVocab.map((w) => (
                <div
                  key={w.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white text-lg">{w.word}</span>
                      <button
                        onClick={() => speakText(w.word)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-blue-600 dark:text-blue-400">{w.pronunciation}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                      {w.simpleDefinition}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic">
                    "{w.exampleSentence}"
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => markStepDone(1)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all ml-auto"
            >
              I Learned These 3 Words <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Sentence Patterns */}
        {currentStepIndex === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Step 3 of 5
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                2 Reusable Sentence Multipliers
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Read aloud and notice how easily you can swap in new objects or verbs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todaysPatterns.map((pat) => (
                <div
                  key={pat.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-indigo-700 dark:text-indigo-300 text-base">
                      {pat.pattern}
                    </span>
                    <button
                      onClick={() => speakText(pat.examples[0])}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-indigo-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{pat.explanation}</p>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200">
                    e.g., "{pat.examples[0]}"
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => markStepDone(2)}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all ml-auto"
            >
              Continue to Speaking Practice <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 4: Speaking & Pronunciation */}
        {currentStepIndex === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                Step 4 of 5
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                Pronunciation Focus: {todaysSound.soundName} ({todaysSound.soundSymbol})
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Say these sentences aloud to build muscle memory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                Mouth Placement Tip:
              </div>
              <p className="text-sm text-cyan-950 dark:text-cyan-200 font-medium">
                {todaysSound.mouthPositionTip}
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Speak This Sentence Aloud:
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  "{todaysSound.sentencePractice}"
                </div>
                <button
                  onClick={() => speakText(todaysSound.sentencePractice)}
                  className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => markStepDone(3)}
              className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all ml-auto"
            >
              I Practiced Speaking Aloud <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 5: Mistake Review */}
        {currentStepIndex === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                Step 5 of 5
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                Daily Error Fix: "{todaysMistake.incorrect}"
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Learn why native speakers say "{todaysMistake.correct}" instead.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1">
                <div className="font-bold text-rose-800 dark:text-rose-300">❌ Avoid Saying:</div>
                <div className="text-sm line-through text-rose-950 dark:text-rose-200 font-semibold">
                  "{todaysMistake.incorrect}"
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300">✓ Natural English:</div>
                <div className="text-sm text-emerald-950 dark:text-emerald-100 font-bold">
                  "{todaysMistake.correct}"
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              💡 <strong>Why:</strong> {todaysMistake.why}
            </div>

            <button
              onClick={() => markStepDone(4)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all ml-auto"
            >
              <Trophy className="w-5 h-5" /> Complete Today's 15-Minute Routine
            </button>
          </div>
        )}

        {/* Completion Celebration banner */}
        {isSessionComplete && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-emerald-950 dark:text-emerald-100">
              Daily Habit Completed!
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
              You practiced 3 words, 2 sentence patterns, pronunciation, and an error fix. Your daily streak has been updated!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
