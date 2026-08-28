import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HOW_TO_BUILD_LESSON } from '../data/sentenceData';
import { AudioPlayerButton } from '../components/AudioPlayerButton';

export const SentenceLessonView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const steps = HOW_TO_BUILD_LESSON.steps;
  const currentStep = steps[activeStepIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('sentence_builder')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={16} />
          <span>Back to Sentence Builder</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          7-Step Masterclass
        </span>
      </div>

      {/* Main Lesson Hero Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Foundational Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            {HOW_TO_BUILD_LESSON.title}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            {HOW_TO_BUILD_LESSON.description}
          </p>
        </div>

        {/* Step Progression Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {steps.map((st, idx) => (
            <button
              key={st.number}
              onClick={() => setActiveStepIdx(idx)}
              className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition-all ${
                activeStepIdx === idx
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              Step {st.number}: {st.title}
            </button>
          ))}
        </div>

        {/* Step Detail Card */}
        <div className="p-6 rounded-3xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 dark:border-blue-800/40 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Step {currentStep.number} of {steps.length}
              </span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            {currentStep.explanation}
          </p>

          {/* Example Words/Phrases */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-blue-200/60 dark:border-zinc-700 space-y-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Example Phrases for this step:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentStep.examples.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-xs font-bold"
                >
                  {ex}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Master Golden Formula Reference */}
        <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <span>Master English Sentence Breakdown Example</span>
          </h3>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              "{HOW_TO_BUILD_LESSON.sampleBreakdown.sentence}"
            </p>
            <AudioPlayerButton text={HOW_TO_BUILD_LESSON.sampleBreakdown.sentence} size="sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            {HOW_TO_BUILD_LESSON.sampleBreakdown.parts.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-800"
              >
                <span className="block text-sm">{p.text}</span>
                <span className="text-[10px] opacity-80 font-normal">{p.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            disabled={activeStepIdx === 0}
            onClick={() => setActiveStepIdx((i) => i - 1)}
            className="px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-600 dark:text-zinc-300 disabled:opacity-40"
          >
            Previous Step
          </button>

          {activeStepIdx < steps.length - 1 ? (
            <button
              onClick={() => setActiveStepIdx((i) => i + 1)}
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('sentence_builder')}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <span>Start Sentence Builder Levels</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
