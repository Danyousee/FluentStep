import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { SENTENCE_PATTERNS, SentencePatternItem } from '../data/sentencePatternsData';
import { evaluateSentencePatternWithAI, PatternEvaluationData } from '../services/aiService';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  BookOpen,
  Filter,
  Lightbulb,
  Check,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface SentencePatternsViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onNavigateToBuilder?: () => void;
}

export const SentencePatternsView: React.FC<SentencePatternsViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
  onNavigateToBuilder,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePattern, setActivePattern] = useState<SentencePatternItem>(SENTENCE_PATTERNS[0]);
  const [userSentenceInput, setUserSentenceInput] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<PatternEvaluationData | null>(null);
  const [slotSelections, setSlotSelections] = useState<{ [key: string]: string }>({});

  const categories = ['All', ...Array.from(new Set(SENTENCE_PATTERNS.map((p) => p.category)))];
  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];

  const filteredPatterns = SENTENCE_PATTERNS.filter((pattern) => {
    const matchesLevel = selectedLevel === 'All' || pattern.level === selectedLevel;
    const matchesCategory = selectedCategory === 'All' || pattern.category === selectedCategory;
    return matchesLevel && matchesCategory;
  });

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectPattern = (pat: SentencePatternItem) => {
    setActivePattern(pat);
    setUserSentenceInput('');
    setEvaluationResult(null);
    setSlotSelections({});
  };

  const handleSlotSelect = (slotName: string, option: string) => {
    const next = { ...slotSelections, [slotName]: option };
    setSlotSelections(next);

    // Auto assemble if slots are selected
    let assembled = activePattern.pattern;
    activePattern.slots.forEach((s) => {
      const chosen = next[s.slotName] || `[${s.slotName}]`;
      assembled = assembled.replace(`[${s.slotName}]`, chosen);
    });
    if (!assembled.includes('[')) {
      setUserSentenceInput(assembled);
    }
  };

  const handleEvaluateCustomSentence = async () => {
    if (!userSentenceInput.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateSentencePatternWithAI({
        pattern: activePattern.pattern,
        sentence: userSentenceInput,
        userLevel,
      });
      setEvaluationResult(result);
      if (result.isValid) {
        onUpdateProgress((prev) => ({
          ...prev,
          totalSentencesConstructed: (prev.totalSentencesConstructed || 0) + 1,
          dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div id="sentence-patterns-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100 border border-white/20">
            <Layers className="w-3.5 h-3.5" />
            Core Grammar Multiplier
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Sentence Pattern Library</h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            Stop memorizing isolated phrases. Master reusable English sentence structures that empower you to build hundreds of real, natural sentences.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Level:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevel === lvl
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Patterns List & Interactive Pattern Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pattern Browser */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Available Patterns ({filteredPatterns.length})
          </div>
          {filteredPatterns.map((pat) => {
            const isSelected = activePattern.id === pat.id;
            return (
              <div
                key={pat.id}
                onClick={() => handleSelectPattern(pat)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {pat.level}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{pat.category}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight font-mono">
                  {pat.pattern}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">{pat.explanation}</p>
                <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium italic">
                  e.g., "{pat.examples[0]}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Pattern Studio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            {/* Pattern Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold text-xs">
                    {activePattern.level} Level
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {activePattern.category}
                  </span>
                </div>
                <button
                  onClick={() => speakText(activePattern.examples[0])}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
                {activePattern.pattern}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{activePattern.explanation}</p>
            </div>

            {/* Pattern Slot Filler / Word Multiplier */}
            {activePattern.slots && activePattern.slots.length > 0 && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Interactive Slot Multipliers (Tap to assemble sentence)
                </div>
                <div className="space-y-3">
                  {activePattern.slots.map((slot) => (
                    <div key={slot.slotName} className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {slot.slotName} ({slot.label}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slot.options.map((opt) => {
                          const isSelected = slotSelections[slot.slotName] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSlotSelect(slot.slotName, opt)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example Sentences */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Real-Life Examples with this Pattern
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {activePattern.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 group hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">{ex}</span>
                    </div>
                    <button
                      onClick={() => speakText(ex)}
                      className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
                    >
                      <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes Warning */}
            {activePattern.commonMistake && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200">Watch Out for this Common Error:</div>
                  <div className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
                    {activePattern.commonMistake}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Build & AI Feedback */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Write Your Own Sentence using "{activePattern.pattern}":
              </label>
              <div className="relative">
                <textarea
                  value={userSentenceInput}
                  onChange={(e) => setUserSentenceInput(e.target.value)}
                  placeholder={`Try writing a sentence using this pattern, e.g., "${activePattern.examples[0]}"`}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setUserSentenceInput('');
                    setEvaluationResult(null);
                    setSlotSelections({});
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear
                </button>
                <button
                  onClick={handleEvaluateCustomSentence}
                  disabled={!userSentenceInput.trim() || isEvaluating}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking with AI Tutor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Evaluate Sentence
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Evaluation Output */}
            {evaluationResult && (
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  evaluationResult.isValid
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {evaluationResult.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                    <span
                      className={`font-bold text-sm ${
                        evaluationResult.isValid
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : 'text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {evaluationResult.isValid ? 'Correct Pattern Application!' : 'Needs a Small Adjustment'}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 shadow-xs">
                    Score: {evaluationResult.score}/100
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {evaluationResult.feedback}
                </p>

                {evaluationResult.correctedSentence && (
                  <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="text-slate-500 font-semibold">Polished Phrasing:</div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      "{evaluationResult.correctedSentence}"
                    </div>
                  </div>
                )}

                {evaluationResult.expandedSuggestion && (
                  <div className="mt-2 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>
                      <strong>Next level expansion:</strong> "{evaluationResult.expandedSuggestion}"
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
