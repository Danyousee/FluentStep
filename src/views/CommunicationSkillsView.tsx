import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { COMMUNICATION_LESSONS, CommunicationLessonItem } from '../data/communicationData';
import {
  MessageSquare,
  Volume2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldAlert,
  ThumbsUp,
} from 'lucide-react';

interface CommunicationSkillsViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const CommunicationSkillsView: React.FC<CommunicationSkillsViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [activeLesson, setActiveLesson] = useState<CommunicationLessonItem>(COMMUNICATION_LESSONS[0]);
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectLesson = (lesson: CommunicationLessonItem) => {
    setActiveLesson(lesson);
    setSelectedScenarioIdx(0);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = (selectedIdx: number) => {
    setQuizAnswer(selectedIdx);
    setQuizSubmitted(true);
    if (selectedIdx === activeLesson.quiz.correctIndex) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedConversations: Array.from(new Set([...(prev.completedConversations || []), `comm_${activeLesson.id}`])),
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    }
  };

  return (
    <div id="communication-skills-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-100 border border-white/20">
            <Briefcase className="w-3.5 h-3.5" />
            Diplomacy & Professional Poise
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Real-Life Communication Skills</h1>
          <p className="text-emerald-100 text-base md:text-lg leading-relaxed">
            Master the subtle art of tone, diplomacy, and politeness in English. Learn how to disagree respectfully, negotiate tactfully, decline invitations gracefully, and handle challenging workplace conversations.
          </p>
        </div>
      </div>

      {/* Main Grid: Lessons List (Left) & Scenario Studio (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lesson Cards */}
        <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Communication Modules ({COMMUNICATION_LESSONS.length})
          </div>
          {COMMUNICATION_LESSONS.map((lesson) => {
            const isSelected = activeLesson.id === lesson.id;
            return (
              <div
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {lesson.level}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{lesson.category}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{lesson.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{lesson.goal}</p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Lesson Studio */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white">
                    {activeLesson.level} Level
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {activeLesson.category}
                  </span>
                </div>
                <button
                  onClick={() => speakText(`${activeLesson.title}. ${activeLesson.keyTakeaway}`)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                {activeLesson.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{activeLesson.goal}</p>
            </div>

            {/* Side-by-Side Tone Comparisons (Blunt vs Diplomatic) */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contrast: Blunt/Demanding vs. Tactful/Diplomatic
              </div>
              <div className="space-y-3">
                {activeLesson.scenarios.map((scen, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3"
                  >
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Context: {scen.situation}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Too Direct */}
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-rose-800 dark:text-rose-300">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Too Blunt / Aggressive:
                        </div>
                        <div className="text-rose-950 dark:text-rose-200 font-semibold line-through">
                          "{scen.tooDirectOrRude}"
                        </div>
                      </div>

                      {/* Diplomatic */}
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                        <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" /> Diplomatic / Professional:
                          </div>
                          <button
                            onClick={() => speakText(scen.diplomaticAndPolite)}
                            className="text-emerald-700 hover:text-emerald-900"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-emerald-950 dark:text-emerald-100 font-bold">
                          "{scen.diplomaticAndPolite}"
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                      💡 <strong>Tone Breakdown:</strong> {scen.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Essential Formula Phrases */}
            <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Key Phrases to Memorize:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeLesson.phrases.map((phrase, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => speakText(phrase)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-200/60 dark:border-teal-800 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-teal-400 transition-all flex items-center justify-between"
                  >
                    <span>"{phrase}"</span>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">🌟 Principle for Success:</span>
              <div className="leading-relaxed">{activeLesson.keyTakeaway}</div>
            </div>

            {/* Practice Quiz */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-4 h-4 text-emerald-600" /> Scenario Judgment Quiz:
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {activeLesson.quiz.prompt}
              </p>

              <div className="space-y-2">
                {activeLesson.quiz.options.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === activeLesson.quiz.correctIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && handleQuizSubmit(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                        quizSubmitted
                          ? isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                            : isChosen
                            ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                  💡 {activeLesson.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
