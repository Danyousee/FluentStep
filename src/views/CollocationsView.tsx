import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { COLLOCATIONS_DATA, CollocationEntry } from '../data/collocationsData';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface CollocationsViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const CollocationsView: React.FC<CollocationsViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedVerbRoot, setSelectedVerbRoot] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCollocation, setActiveCollocation] = useState<CollocationEntry>(COLLOCATIONS_DATA[0]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const verbRoots = ['All', 'Make', 'Do', 'Have', 'Take', 'Get', 'Give', 'Break', 'Pay', 'Catch', 'Keep'];

  const filteredCollocations = COLLOCATIONS_DATA.filter((colloc) => {
    const matchesRoot = selectedVerbRoot === 'All' || colloc.verbRoot.toLowerCase() === selectedVerbRoot.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery.trim() ||
      colloc.collocation.toLowerCase().includes(query) ||
      colloc.meaning.toLowerCase().includes(query) ||
      colloc.correctExample.toLowerCase().includes(query);
    return matchesRoot && matchesQuery;
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

  const handleSelectCollocation = (c: CollocationEntry) => {
    setActiveCollocation(c);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = (selectedIdx: number) => {
    setQuizAnswer(selectedIdx);
    setQuizSubmitted(true);
    if (selectedIdx === activeCollocation.quiz.correctIndex) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedWords: Array.from(new Set([...(prev.completedWords || []), `colloc_${activeCollocation.id}`])),
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    }
  };

  return (
    <div id="collocations-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-pink-100 border border-white/20">
            <Zap className="w-3.5 h-3.5" />
            Natural Word Partnerships
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Collocations Library</h1>
          <p className="text-pink-100 text-base md:text-lg leading-relaxed">
            Words that naturally go together in English. Learn whether to say "make a mistake" or "do a mistake", "take a break" or "have a break", with clear side-by-side comparisons.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Verb:</span>
          {verbRoots.map((root) => (
            <button
              key={root}
              onClick={() => setSelectedVerbRoot(root)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedVerbRoot === root
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {root}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collocations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Main Grid: List & Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Collocations ({filteredCollocations.length})
          </div>
          {filteredCollocations.map((colloc) => {
            const isSelected = activeCollocation.id === colloc.id;
            return (
              <div
                key={colloc.id}
                onClick={() => handleSelectCollocation(colloc)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {colloc.collocation}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                    {colloc.verbRoot}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">{colloc.meaning}</p>
                <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 italic line-clamp-1">
                  ✓ "{colloc.correctExample}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Studio Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            {/* Top Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Verb Root: {activeCollocation.verbRoot}
                </span>
                <button
                  onClick={() => speakText(`${activeCollocation.collocation}. ${activeCollocation.correctExample}`)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                {activeCollocation.collocation}
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium mt-1">
                {activeCollocation.meaning}
              </p>
            </div>

            {/* Side-by-side Correct vs Incorrect */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Natural English (Say This):
                </div>
                <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                  "{activeCollocation.correctExample}"
                </div>
              </div>

              {activeCollocation.incorrectExample && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Unnatural / Common Mistake:
                  </div>
                  <div className="text-sm line-through text-rose-900 dark:text-rose-200">
                    "{activeCollocation.incorrectExample}"
                  </div>
                </div>
              )}
            </div>

            {/* Why explanation */}
            {activeCollocation.why && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  💡 Why Native Speakers Say It This Way:
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {activeCollocation.why}
                </div>
              </div>
            )}

            {/* Practice Quiz */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-4 h-4 text-rose-600" /> Practice Quiz:
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {activeCollocation.quiz.prompt}
              </p>

              <div className="space-y-2">
                {activeCollocation.quiz.options.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === activeCollocation.quiz.correctIndex;

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
                  💡 {activeCollocation.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
