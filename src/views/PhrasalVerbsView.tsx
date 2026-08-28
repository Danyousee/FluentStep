import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { PHRASAL_VERBS, PhrasalVerbItem } from '../data/phrasalVerbsData';
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
  Split,
  Lock,
} from 'lucide-react';

interface PhrasalVerbsViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const PhrasalVerbsView: React.FC<PhrasalVerbsViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedVerbRoot, setSelectedVerbRoot] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVerb, setActiveVerb] = useState<PhrasalVerbItem>(PHRASAL_VERBS[0]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const verbRoots = ['All', ...Array.from(new Set(PHRASAL_VERBS.map((p) => p.verb)))];

  const filteredVerbs = PHRASAL_VERBS.filter((pv) => {
    const matchesRoot = selectedVerbRoot === 'All' || pv.verb === selectedVerbRoot;
    const term = `${pv.verb} ${pv.particles.join(' ')} ${pv.meaning} ${pv.example}`.toLowerCase();
    const matchesQuery = !searchQuery.trim() || term.includes(searchQuery.toLowerCase());
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

  const handleSelectVerb = (pv: PhrasalVerbItem) => {
    setActiveVerb(pv);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = (selectedIdx: number) => {
    setQuizAnswer(selectedIdx);
    setQuizSubmitted(true);
    if (selectedIdx === activeVerb.quiz.correctIndex) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedWords: Array.from(new Set([...(prev.completedWords || []), `pv_${activeVerb.id}`])),
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    }
  };

  return (
    <div id="phrasal-verbs-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-orange-100 border border-white/20">
            <Split className="w-3.5 h-3.5" />
            Natural Idiomatic Mastery
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Phrasal Verbs Hub</h1>
          <p className="text-orange-100 text-base md:text-lg leading-relaxed">
            Master the most common English phrasal verbs. Understand literal vs idiomatic meanings, separable vs inseparable rules, and practice with real dialogues.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Root Verb:</span>
          {verbRoots.map((root) => (
            <button
              key={root}
              onClick={() => setSelectedVerbRoot(root)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedVerbRoot === root
                  ? 'bg-orange-600 text-white shadow-sm'
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
            placeholder="Search phrasal verbs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Main Grid: Verb List & Interactive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Phrasal Verb List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Phrasal Verbs ({filteredVerbs.length})
          </div>
          {filteredVerbs.map((pv) => {
            const isSelected = activeVerb.id === pv.id;
            return (
              <div
                key={pv.id}
                onClick={() => handleSelectVerb(pv)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 shadow-sm ring-1 ring-orange-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {pv.verb} {pv.particles.join(' / ')}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                      pv.separable
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {pv.separable ? 'Separable' : 'Inseparable'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">{pv.meaning}</p>
                <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 italic line-clamp-1">
                  "{pv.example}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Phrasal Verb Studio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      activeVerb.separable
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {activeVerb.separable ? 'Separable Phrasal Verb' : 'Inseparable Phrasal Verb'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{activeVerb.category}</span>
                </div>
                <button
                  onClick={() => speakText(`${activeVerb.verb} ${activeVerb.particles.join(' ')}. ${activeVerb.example}`)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                {activeVerb.verb} <span className="text-orange-600 dark:text-orange-400">{activeVerb.particles.join(' / ')}</span>
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium mt-1">
                {activeVerb.meaning}
              </p>
            </div>

            {/* Separability Rule Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                {activeVerb.separable ? <Split className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-indigo-600" />}
                Separability & Placement Rule:
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeVerb.separable
                  ? `You CAN put the object between the verb and particle. E.g., "${activeVerb.verb} the light ${activeVerb.particles[0]}" OR "${activeVerb.verb} ${activeVerb.particles[0]} the light". When using pronouns (it, them), you MUST separate them (e.g. "${activeVerb.verb} it ${activeVerb.particles[0]}").`
                  : `You CANNOT separate this verb and particle. The object always comes after the particle. E.g., "${activeVerb.verb} ${activeVerb.particles[0]} the problem".`}
              </p>
            </div>

            {/* Example In Context */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Example in Daily English:</div>
              <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  "{activeVerb.example}"
                </span>
                <button
                  onClick={() => speakText(activeVerb.example)}
                  className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 text-orange-700"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Mini-Quiz */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-4 h-4 text-orange-600" /> Practice Quiz:
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {activeVerb.quiz.prompt}
              </p>

              <div className="space-y-2">
                {activeVerb.quiz.options.map((opt, idx) => {
                  const isChosen = quizAnswer === idx;
                  const isCorrect = idx === activeVerb.quiz.correctIndex;

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
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-orange-400'
                      }`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-xs text-orange-950 dark:text-orange-200 leading-relaxed font-medium">
                  💡 {activeVerb.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
