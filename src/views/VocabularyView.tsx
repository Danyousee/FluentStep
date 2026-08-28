import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight,
  Filter,
  Play,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { VOCABULARY_LIST, VOCABULARY_CATEGORIES as VOCAB_CATEGORIES } from '../data/vocabularyData';
import { useApp } from '../context/AppContext';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { VocabularyWord } from '../types';

export const VocabularyView: React.FC = () => {
  const {
    userStats,
    markWordLearned,
    markWordForPractice,
    setSelectedVocabId,
    setCurrentView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const filteredWords = useMemo(() => {
    return VOCABULARY_LIST.filter((w) => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || w.level === selectedLevel;
      const matchQuery =
        !searchQuery.trim() ||
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.simpleDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchLevel && matchQuery;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartLesson = (word: VocabularyWord) => {
    setSelectedVocabId(word.id);
    setCurrentView('vocab_lesson');
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <BookOpen size={16} />
            <span>Vocabulary Mastery Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            Learn Everyday Words & Collocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Understand definitions, pronunciation, collocations, and natural sentence usage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="vocab_btn_practice_mode"
            onClick={() => setCurrentView('vocab_practice')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Play size={14} />
            <span>Practice 4 Exercises</span>
          </button>

          <button
            id="vocab_btn_toggle_flashcards"
            onClick={() => setFlashcardMode(!flashcardMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              flashcardMode
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <RotateCcw size={14} />
            <span>{flashcardMode ? 'Grid Mode' : 'Flashcard Mode'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            id="vocab_cat_all"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            All Categories ({VOCABULARY_LIST.length})
          </button>
          {VOCAB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`vocab_cat_${cat.id}`}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Level Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              id="vocab_search_input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words by name, meaning, or part of speech..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Filter size={15} className="text-slate-400" />
            <span className="text-xs text-slate-500">Level:</span>
            {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Words Grid / Flashcard Grid */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No vocabulary matches found for "{searchQuery}"
          </p>
          <p className="text-xs text-slate-400 mt-1">Try changing category or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWords.map((word) => {
            const isLearned = userStats.wordsLearned.includes(word.id);
            const isPracticing = userStats.wordsPracticing.includes(word.id);
            const isFlipped = flashcardMode && flippedCards[word.id];

            return (
              <div
                key={word.id}
                id={`vocab_card_${word.id}`}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                {!isFlipped ? (
                  /* Front of Card */
                  <div className="space-y-3">
                    {/* Top Tag Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {word.partOfSpeech}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {word.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <AudioPlayerButton text={word.word} size="sm" />
                        {isLearned && (
                          <span title="Mastered" className="text-emerald-600">
                            <CheckCircle2 size={16} />
                          </span>
                        )}
                        {isPracticing && !isLearned && (
                          <span title="In Practice" className="text-amber-500">
                            <Bookmark size={16} className="fill-amber-400" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Word Title & Pronunciation */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {word.word}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {word.phonetic}
                      </span>
                    </div>

                    {/* Simple Definition */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {word.simpleDefinition}
                    </p>

                    {/* Example Sentence */}
                    {word.examples[0] && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Example
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 italic">
                          "{word.examples[0].sentence}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Flipped Flashcard (Self-Testing Mode) */
                  <div className="space-y-3 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      Flashcard Answer
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {word.word}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Meaning:</strong> {word.simpleDefinition}
                    </p>
                    <div className="text-xs text-slate-500">
                      <strong>Collocations:</strong> {word.collocations.join(', ')}
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {flashcardMode ? (
                    <button
                      onClick={() => toggleFlip(word.id)}
                      className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {isFlipped ? 'Show Front' : 'Flip to Reveal'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartLesson(word)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Sparkles size={13} />
                        Study Lesson
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn_practice_word_${word.id}`}
                          onClick={() => markWordForPractice(word.id)}
                          title="Save for practice"
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-all"
                        >
                          Review
                        </button>
                        <button
                          id={`btn_mastered_word_${word.id}`}
                          onClick={() => markWordLearned(word.id)}
                          title="Mark as learned (+15 XP)"
                          className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                            isLearned
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {isLearned ? 'Mastered' : 'I Know This'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
