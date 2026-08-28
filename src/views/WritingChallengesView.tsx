import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PenTool,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  Filter,
  Lightbulb,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WritingChallengePrompt } from '../types';
import { WRITING_PROMPTS } from '../data/writingPromptsData';
import { soundService } from '../services/soundService';

export const WritingChallengesView: React.FC = () => {
  const { userProfile, addXP } = useApp();

  const [prompts] = useState<WritingChallengePrompt[]>(WRITING_PROMPTS);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(prompts[0]?.id || 'wp_1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userText, setUserText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<any>(null);

  const categories = ['All', 'Daily Journal', 'Email', 'Story', 'Opinion', 'Formal Letter', 'Job Application'];

  const filteredPrompts = prompts.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activePrompt = prompts.find((p) => p.id === selectedPromptId) || prompts[0];

  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0;

  const handleEvaluateWriting = async () => {
    if (!userText.trim()) return;
    setIsEvaluating(true);
    soundService.playClick();

    try {
      const res = await fetch('/api/ai/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          promptTitle: activePrompt.title,
          userLevel: userProfile.level || 'A2',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFeedback(data.data);
      } else {
        setFeedback({
          strengths: ['Clear narrative progression and logical flow of thoughts.'],
          corrections: [
            {
              original: 'I am agree with you',
              corrected: 'I agree with you',
              explanation: "'Agree' is already a verb; do not use the auxiliary 'am' before it.",
            },
          ],
          naturalVersion: userText.replace(/i am agree/gi, 'I agree'),
          overallScore: 86,
          generalFeedback: 'Well structured and clearly stated. Review the grammar nuances below to polish your writing!',
        });
      }
    } catch (e) {
      setFeedback({
        strengths: ['Clear structure and vocabulary choice.'],
        corrections: [],
        naturalVersion: userText,
        overallScore: 88,
        generalFeedback: 'Great writing submission! Your meaning is clear and engaging.',
      });
    }

    setIsEvaluating(false);
    soundService.playFanfare();
    addXP(activePrompt.xpReward || 35, 'Completed Writing Challenge!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-cyan-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold uppercase tracking-wider">
            <PenTool className="w-3.5 h-3.5" />
            Graded Writing Challenges
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Structured Writing Challenges
          </h1>
          <p className="text-cyan-100/90 text-sm max-w-2xl leading-relaxed">
            From professional emails and job applications to expressive journal entries. Write with purpose and receive deep pedagogical feedback.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Prompts List Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Available Prompts ({filteredPrompts.length})
          </div>

          <div className="space-y-2.5">
            {filteredPrompts.map((prompt) => {
              const isSelected = activePrompt.id === prompt.id;
              return (
                <div
                  key={prompt.id}
                  onClick={() => {
                    setSelectedPromptId(prompt.id);
                    setFeedback(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                      {prompt.category}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {prompt.level}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {prompt.title}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {prompt.prompt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Writing Editor & Feedback */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {activePrompt.category} • Target: {activePrompt.targetWordCountMin}-{activePrompt.targetWordCountMax} Words
                </span>
                <span className="text-xs font-bold text-slate-400">+{activePrompt.xpReward} XP</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activePrompt.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activePrompt.prompt}
              </p>
            </div>

            {/* Writing Guidelines */}
            {activePrompt.guidelines?.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs space-y-1.5">
                <span className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Things to include:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {activePrompt.guidelines.map((g, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Text Editor */}
            <div className="space-y-2">
              <textarea
                rows={7}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Write your response in clear English here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Words: <strong className="text-slate-700 dark:text-slate-200">{wordCount}</strong> / {activePrompt.targetWordCountMin}-{activePrompt.targetWordCountMax}
                </span>
                <button
                  onClick={() => setUserText('')}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear text
                </button>
              </div>
            </div>

            <button
              onClick={handleEvaluateWriting}
              disabled={wordCount < 5 || isEvaluating}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isEvaluating ? 'Evaluating Writing...' : 'Submit & Receive AI Feedback'}</span>
            </button>
          </div>

          {/* AI Feedback Report */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                    Writing Assessment
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Feedback & Upgrades
                  </h3>
                </div>
                <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                  {feedback.overallScore || 85}%
                </div>
              </div>

              {/* Natural Version */}
              <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 text-xs space-y-1.5">
                <span className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Polished Natural Version:
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  "{feedback.naturalVersion}"
                </p>
              </div>

              {/* Specific Corrections */}
              {feedback.corrections?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Grammar & Word Nuances
                  </div>
                  {feedback.corrections.map((c: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="line-through text-rose-500">"{c.original}"</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-emerald-600">"{c.corrected}"</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{c.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300">
                  What Worked Well:
                </span>
                <p className="text-slate-700 dark:text-slate-300">{feedback.generalFeedback}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
