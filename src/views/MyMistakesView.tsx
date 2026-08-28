import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Volume2,
  Plus,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MistakeRecord } from '../types';
import { generateMistakesPracticeWithAI, MistakesPracticeResponseData } from '../services/aiService';
import { soundService } from '../services/soundService';

export const MyMistakesView: React.FC = () => {
  const { userStats, resolveMistake, addMistakeRecord, addXP, userProfile } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [filterMastered, setFilterMastered] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceData, setPracticeData] = useState<MistakesPracticeResponseData | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New mistake manual form
  const [newOriginal, setNewOriginal] = useState('');
  const [newCorrected, setNewCorrected] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newCat, setNewCat] = useState<'Past tense' | 'Prepositions' | 'Articles' | 'Vocabulary' | 'Sentence structure' | 'Collocations' | 'General'>('General');

  const mistakes: MistakeRecord[] = userStats.mistakes || [];

  const categories = ['All', ...Array.from(new Set(mistakes.map((m) => m.category)))];

  const filteredMistakes = mistakes.filter((m) => {
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    const matchStatus =
      filterMastered === 'all'
        ? true
        : filterMastered === 'mastered'
        ? m.mastered
        : !m.mastered;
    return matchCat && matchStatus;
  });

  const masteredCount = mistakes.filter((m) => m.mastered).length;
  const unmasteredCount = mistakes.filter((m) => !m.mastered).length;
  const masteryPercentage = mistakes.length > 0 ? Math.round((masteredCount / mistakes.length) * 100) : 0;

  const handleStartPractice = async () => {
    setIsGeneratingPractice(true);
    try {
      const result = await generateMistakesPracticeWithAI(
        mistakes.filter((m) => !m.mastered),
        userProfile.level
      );
      setPracticeData(result);
      setCurrentQIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setIsPracticing(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPractice(false);
    }
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    if (isAnswerSubmitted || !practiceData) return;
    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    const currentQ = practiceData.questions[currentQIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      soundService.playSuccess();
      setScore((s) => s + 1);
      addXP(15, 'Correctly resolved a previous error!');
    } else {
      soundService.playError();
    }
  };

  const handleNextQuestion = () => {
    if (!practiceData) return;
    if (currentQIndex < practiceData.questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished practice
      soundService.playFanfare();
      addXP(30, 'Completed Mistakes Practice Session!');
    }
  };

  const handleCreateMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOriginal.trim() || !newCorrected.trim()) return;

    addMistakeRecord({
      originalSentence: newOriginal.trim(),
      correctedSentence: newCorrected.trim(),
      explanation: newExplanation.trim() || 'Custom recorded learner mistake.',
      category: newCat,
      sourceLesson: 'Self Recorded',
    });

    setNewOriginal('');
    setNewCorrected('');
    setNewExplanation('');
    setShowAddModal(false);
    soundService.playPop();
  };

  return (
    <div id="my-mistakes-view" className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header & Stats Card */}
      <div id="mistakes-header" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-2xl text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60">
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Mistakes Book</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              "Errors are the stepping stones to fluency." Every corrected mistake from your tutor chats,
              quizzes, and sentence construction is recorded here for targeted review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="add-mistake-manual-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Mistake
            </button>

            <button
              id="start-practice-mistakes-btn"
              onClick={handleStartPractice}
              disabled={isGeneratingPractice || unmasteredCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50 transition-colors"
            >
              {isGeneratingPractice ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating AI Quiz...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Practice My Mistakes ({unmasteredCount})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Recorded</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{mistakes.length}</div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-950">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Needs Practice</span>
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{unmasteredCount}</div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Mastered</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{masteryPercentage}%</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{masteredCount}</div>
            <div className="w-full bg-emerald-100 dark:bg-emerald-950 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${masteryPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Interactive Modal/Section */}
      <AnimatePresence>
        {isPracticing && practiceData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            id="mistakes-practice-session"
            className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-700"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-800">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-indigo-700 rounded-xl">
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">Mistake Mastery Practice</h2>
                  <p className="text-xs text-indigo-300">
                    Question {currentQIndex + 1} of {practiceData.questions.length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPracticing(false)}
                className="text-xs px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 rounded-lg text-indigo-200 transition-colors"
              >
                Exit Practice
              </button>
            </div>

            {currentQIndex < practiceData.questions.length ? (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-800/80">
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                    {practiceData.questions[currentQIndex].category}
                  </span>
                  <h3 className="text-lg font-semibold mt-2">
                    {practiceData.questions[currentQIndex].prompt}
                  </h3>
                  {practiceData.questions[currentQIndex].contextSentence && (
                    <p className="text-xs text-indigo-300 italic mt-1">
                      Context: {practiceData.questions[currentQIndex].contextSentence}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {practiceData.questions[currentQIndex].options?.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === practiceData.questions[currentQIndex].correctIndex;
                    let btnClass = 'bg-slate-800/90 border-indigo-800 hover:border-indigo-500 text-white';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-600 border-emerald-400 text-white';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-600 border-rose-400 text-white';
                      } else {
                        btnClass = 'opacity-40 border-transparent text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerSubmit(i)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-indigo-950/90 border border-indigo-800 rounded-xl space-y-3"
                  >
                    <p className="text-xs text-indigo-200">
                      💡 <strong>Rule Explanation:</strong> {practiceData.questions[currentQIndex].explanation}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-2 px-5 py-2 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                      >
                        {currentQIndex < practiceData.questions.length - 1 ? 'Next Challenge' : 'Complete Review'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Review Complete!</h3>
                <p className="text-indigo-200 text-sm">
                  You scored {score} / {practiceData.questions.length} on your personalized mistake workout.
                </p>
                <button
                  onClick={() => setIsPracticing(false)}
                  className="px-6 py-2.5 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:bg-indigo-50"
                >
                  Return to Mistakes Book
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div id="mistakes-filters" className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilterMastered('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterMastered === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMastered('unmastered')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterMastered === 'unmastered' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Needs Practice
          </button>
          <button
            onClick={() => setFilterMastered('mastered')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterMastered === 'mastered' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Mastered
          </button>
        </div>
      </div>

      {/* Mistakes List */}
      <div id="mistakes-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMistakes.map((item) => (
          <div
            key={item.id}
            id={`mistake-card-${item.id}`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{item.date}</span>
                  {item.mastered ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-3 h-3" /> Mastered
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                      <AlertTriangle className="w-3 h-3" /> Practicing
                    </span>
                  )}
                </div>
              </div>

              {/* Wrong vs Right */}
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl">
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                    ❌ Avoid saying:
                  </span>
                  <p className="line-through decoration-rose-400 text-slate-700 dark:text-slate-300 font-medium">
                    "{item.originalSentence}"
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">
                      ✅ Say this instead:
                    </span>
                    <button
                      onClick={() => soundService.speak(item.correctedSentence)}
                      className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 p-1"
                      title="Listen correct pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-emerald-900 dark:text-emerald-200 font-semibold">
                    "{item.correctedSentence}"
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
                💡 {item.explanation}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Practiced {item.practiceCount} times
              </span>

              {!item.mastered && (
                <button
                  onClick={() => resolveMistake(item.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark as Mastered
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredMistakes.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No mistakes found in this filter!</p>
            <p className="text-xs text-slate-500 mt-1">Keep practicing conversations and lessons to identify areas for growth.</p>
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Record a Custom Mistake</h2>
            <form onSubmit={handleCreateMistake} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Wrong / Awkward Sentence
                </label>
                <input
                  type="text"
                  required
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                  placeholder="e.g. I am coming back now"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Corrected English Sentence
                </label>
                <input
                  type="text"
                  required
                  value={newCorrected}
                  onChange={(e) => setNewCorrected(e.target.value)}
                  placeholder="e.g. I will be right back in a moment"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Past tense">Past tense</option>
                  <option value="Prepositions">Prepositions</option>
                  <option value="Articles">Articles</option>
                  <option value="Vocabulary">Vocabulary</option>
                  <option value="Collocations">Collocations</option>
                  <option value="Sentence structure">Sentence structure</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Why was it wrong? (Explanation)
                </label>
                <textarea
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Explain the grammar rule or natural nuance..."
                  rows={2}
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Save to Book
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
