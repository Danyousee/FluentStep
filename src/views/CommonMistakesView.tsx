import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { COMMON_MISTAKES_DATABASE, CommonMistakeEntry } from '../data/commonMistakesData';
import {
  AlertTriangle,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  Sparkles,
  Globe,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface CommonMistakesViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const CommonMistakesView: React.FC<CommonMistakesViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEntry, setActiveEntry] = useState<CommonMistakeEntry>(COMMON_MISTAKES_DATABASE[0]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const categories = [
    'All',
    'Grammar',
    'Prepositions',
    'Vocabulary Choice',
    'Tenses',
    'Regional & Context Nuance',
  ];

  const filteredEntries = COMMON_MISTAKES_DATABASE.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery.trim() ||
      item.incorrect.toLowerCase().includes(query) ||
      item.correct.toLowerCase().includes(query) ||
      item.why.toLowerCase().includes(query) ||
      item.explanation.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
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

  const handleSelectEntry = (entry: CommonMistakeEntry) => {
    setActiveEntry(entry);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = (selectedIdx: number) => {
    setQuizAnswer(selectedIdx);
    setQuizSubmitted(true);
    if (selectedIdx === activeEntry.quiz.correctIndex) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedConversations: Array.from(new Set([...(prev.completedConversations || []), `mistake_${activeEntry.id}`])),
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    }
  };

  return (
    <div id="common-mistakes-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-red-100 border border-white/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Accuracy & Error Prevention
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Common English Mistakes</h1>
          <p className="text-red-100 text-base md:text-lg leading-relaxed">
            Searchable database of high-frequency English errors. Understand the grammatical "Why", learn natural alternatives, and explore regional vs. international context nuances.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mistakes (e.g. explain, borrow)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Main Grid: List & Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Common Errors ({filteredEntries.length})
          </div>
          {filteredEntries.map((item) => {
            const isSelected = activeEntry.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectEntry(item)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.level}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                </div>
                <div className="text-xs font-semibold text-rose-600 line-through">
                  ❌ {item.incorrect}
                </div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  ✓ {item.correct}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-1">{item.why}</p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Studio Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-600 text-white">
                    {activeEntry.level} Level
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{activeEntry.category}</span>
                </div>
                <button
                  onClick={() => speakText(`Incorrect: ${activeEntry.incorrect}. Correct: ${activeEntry.correct}`)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" /> Common Mistake (Avoid Saying):
                </div>
                <div className="text-base line-through text-rose-900 dark:text-rose-200 font-semibold">
                  "{activeEntry.incorrect}"
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct & Natural Phrasing:
                </div>
                <div className="text-base text-emerald-950 dark:text-emerald-100 font-extrabold">
                  "{activeEntry.correct}"
                </div>
              </div>
            </div>

            {/* Detailed Explanation */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                💡 Why this rule works in English:
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {activeEntry.why}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed pt-1">
                {activeEntry.explanation}
              </p>
            </div>

            {/* Regional / Contextual Nuance Card if applicable */}
            {activeEntry.isRegionalOrContextual && activeEntry.regionalContextNote && (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-indigo-600" /> Regional vs. International Context:
                </div>
                <p className="text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
                  {activeEntry.regionalContextNote}
                </p>
              </div>
            )}

            {/* Practice Fix-It Quiz */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-4 h-4 text-rose-600" /> Quick Fix-It Practice:
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {activeEntry.quiz.prompt}
              </p>

              <div className="space-y-2">
                {activeEntry.quiz.options.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === activeEntry.quiz.correctIndex;

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
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-rose-400'
                      }`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-950 dark:text-rose-200 leading-relaxed font-medium">
                  💡 {activeEntry.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
