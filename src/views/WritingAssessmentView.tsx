import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateWritingAssessment } from '../services/aiService';
import { soundService } from '../services/soundService';
import { WritingAssessmentResult } from '../types';

export const WritingAssessmentView: React.FC = () => {
  const { userProfile, saveWritingAssessment, setCurrentView } = useApp();

  const TASKS = [
    {
      title: 'IELTS Academic Writing Task 2',
      prompt: 'Some people argue that technological automation will reduce employment opportunities for future generations, while others believe it will create higher-value jobs. Discuss both views and give your opinion.',
      minWords: 250,
    },
    {
      title: 'Executive Business Proposal',
      prompt: 'Write an executive proposal to your company leadership recommending adopting an AI-assisted customer service workflow to improve response times and customer satisfaction.',
      minWords: 200,
    },
    {
      title: 'WAEC / WASSCE Argumentative Essay',
      prompt: 'Write an essay suitable for publication in a national newspaper on the topic: "The Importance of Practical Vocational Education in National Development."',
      minWords: 300,
    },
  ];

  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [essayText, setEssayText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<WritingAssessmentResult | null>(null);

  const activeTask = TASKS[selectedTaskIndex];
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const handleEvaluate = async () => {
    if (!essayText.trim()) return;
    setIsEvaluating(true);

    try {
      const evalData = await evaluateWritingAssessment({
        promptText: activeTask.prompt,
        writtenText: essayText,
        examTypeOrLevel: activeTask.title,
      });

      if (evalData) {
        setResult(evalData);
        saveWritingAssessment(evalData);
        soundService.playFanfare();
      }
    } catch (e) {
      console.error('Writing assessment error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <PenTool size={14} className="text-purple-300" />
            <span>AI Writing & Essay Diagnostic Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Writing Assessment
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm">
            Submit your essay, proposal, or report. The AI provides standard 4-pillar band evaluations, paragraph-by-paragraph feedback, and an advanced model rewrite.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Task Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Writing Prompt Task:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TASKS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTaskIndex(idx);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedTaskIndex === idx
                      ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs text-purple-700 dark:text-purple-400 block mb-1">
                    {t.title}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                    {t.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Prompt Info */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-purple-600 dark:text-purple-400">
                {activeTask.title}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Target: {activeTask.minWords}+ words
              </span>
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
              "{activeTask.prompt}"
            </p>
          </div>

          {/* Essay Input Arena */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="uppercase text-slate-400">Your Written Text:</label>
              <span
                className={
                  wordCount >= activeTask.minWords
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }
              >
                {wordCount} / {activeTask.minWords} words
              </span>
            </div>

            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Type or paste your essay here in English..."
              rows={12}
              className="w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleEvaluate}
              disabled={wordCount < 10 || isEvaluating}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 transition-all"
            >
              {isEvaluating ? (
                <span>Evaluating Essay Coherence & Lexicon...</span>
              ) : (
                <>
                  <Sparkles size={18} className="text-amber-300" />
                  <span>Evaluate Writing & Generate Diagnostic Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded bg-purple-100 text-purple-700">
                Writing Evaluation Complete
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                Estimated Band: {result.overallBand}
              </h2>
              <p className="text-xs text-slate-400">Total Word Count: {result.wordCount} words</p>
            </div>
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Submit Another Essay
            </button>
          </div>

          {/* 4 Pillars Scoring */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 text-center">
              <span className="text-xs text-slate-400 font-medium">Task Response</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                {result.taskAchievementScore}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 text-center">
              <span className="text-xs text-slate-400 font-medium">Coherence & Cohesion</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {result.coherenceScore}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 text-center">
              <span className="text-xs text-slate-400 font-medium">Lexical Variety</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {result.lexicalResourceScore}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 text-center">
              <span className="text-xs text-slate-400 font-medium">Grammar Range</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {result.grammaticalRangeScore}%
              </p>
            </div>
          </div>

          {/* Paragraph Feedback */}
          {result.paragraphFeedback && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">
                Detailed Feedback by Paragraph
              </h4>
              <div className="space-y-3">
                {result.paragraphFeedback.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
                  >
                    <span className="font-extrabold text-purple-600">
                      Paragraph {fb.paragraphNumber}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{fb.critique}</p>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">
                      Recommendation: {fb.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Band Model Rewrite */}
          {result.modelRewrite && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">
                High-Band Native Model Rewrite
              </h4>
              <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                {result.modelRewrite}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
