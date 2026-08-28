import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { AudioPlayerButton } from '../components/AudioPlayerButton';

export const VocabularyLessonView: React.FC = () => {
  const {
    selectedVocabId,
    setSelectedVocabId,
    setCurrentView,
    markWordLearned,
    markWordForPractice,
    userStats,
  } = useApp();

  const activeIndex = Math.max(
    0,
    VOCABULARY_LIST.findIndex((w) => w.id === selectedVocabId)
  );
  const word = VOCABULARY_LIST[activeIndex] || VOCABULARY_LIST[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'examples' | 'collocations'>('overview');

  const isLearned = userStats.wordsLearned.includes(word.id);

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + VOCABULARY_LIST.length) % VOCABULARY_LIST.length;
    setSelectedVocabId(VOCABULARY_LIST[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % VOCABULARY_LIST.length;
    setSelectedVocabId(VOCABULARY_LIST[nextIdx].id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          id="vocab_lesson_btn_back"
          onClick={() => setCurrentView('vocabulary')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={16} />
          <span>Back to Vocabulary List</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">
            Word {activeIndex + 1} of {VOCABULARY_LIST.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              id="vocab_lesson_btn_prev"
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              id="vocab_lesson_btn_next"
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Study Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        {/* Word Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {word.partOfSpeech}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Level {word.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                {word.category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {word.word}
            </h1>
            <p className="text-sm font-mono text-zinc-400 mt-1">
              Pronunciation: {word.pronunciation}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AudioPlayerButton text={word.word} size="lg" label="Listen" />
            <button
              id="vocab_lesson_btn_mark_learned"
              onClick={() => markWordLearned(word.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isLearned
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
              }`}
            >
              {isLearned ? '✓ Mastered' : 'Mark Mastered (+15 XP)'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          {[
            { id: 'overview', label: 'Definition & Meaning' },
            { id: 'examples', label: 'Example Sentence' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Simple Definition
              </h4>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                {word.simpleDefinition}
              </p>
              {word.meaning && (
                <p className="text-xs text-zinc-500 mt-2">
                  Full context: {word.meaning}
                </p>
              )}
            </div>

            {/* Synonyms and Antonyms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-2">
                  Synonyms (Similar Words)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {word.synonyms?.map((syn, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-emerald-200 dark:border-emerald-900"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>

              {word.antonyms && word.antonyms.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/30">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block mb-2">
                    Antonyms (Opposites)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.map((ant, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-rose-200 dark:border-rose-900"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grammar Usage Tip */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 flex items-start gap-3">
              <Lightbulb className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  How to Use in a Sentence
                </h5>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  Notice how <strong>"{word.word}"</strong> behaves as a <em>{word.partOfSpeech}</em>. When constructing sentences, pair it with standard auxiliary verbs or objects.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Realistic Sentence Context
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  "{word.exampleSentence}"
                </p>
              </div>
              <AudioPlayerButton text={word.exampleSentence} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Next Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => markWordForPractice(word.id)}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 flex items-center gap-2"
        >
          <Bookmark size={15} />
          <span>Add to Practice List</span>
        </button>

        <button
          id="btn_vocab_lesson_goto_practice"
          onClick={() => setCurrentView('vocab_practice')}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <Sparkles size={15} />
          <span>Practice Exercises for this Word</span>
        </button>
      </div>
    </div>
  );
};
