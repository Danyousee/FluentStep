import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Trash2,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';

interface SavedWordItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
  context: string;
  strength: number; // 0 to 100
  dateAdded: string;
}

const DEFAULT_MY_WORDS: SavedWordItem[] = [
  {
    id: 'w1',
    word: 'Fluently',
    meaning: 'In a smoothly, flowing, and accurate manner.',
    example: 'I practice speaking every morning to speak fluently.',
    context: 'Daily Conversation',
    strength: 85,
    dateAdded: '2026-08-25',
  },
  {
    id: 'w2',
    word: 'Prioritize',
    meaning: 'Designate or treat something as more important than other things.',
    example: 'You should prioritize high-frequency verbs.',
    context: 'Study Strategy',
    strength: 70,
    dateAdded: '2026-08-26',
  },
  {
    id: 'w3',
    word: 'Collocation',
    meaning: 'Words that naturally fit or sound right together in English.',
    example: '"Make a decision" is a common collocation, not "do a decision".',
    context: 'Grammar & Vocabulary',
    strength: 90,
    dateAdded: '2026-08-27',
  },
];

export const MyWordsView: React.FC = () => {
  const { userStats, addXP, recordWordLearned } = useApp();

  const [words, setWords] = useState<SavedWordItem[]>(() => {
    const saved = localStorage.getItem('fluentstep_my_words');
    return saved ? JSON.parse(saved) : DEFAULT_MY_WORDS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newWord, setNewWord] = useState<string>('');
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [newExample, setNewExample] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddWord = () => {
    if (!newWord.trim()) return;

    const entry: SavedWordItem = {
      id: `w_${Date.now()}`,
      word: newWord.trim(),
      meaning: newMeaning.trim() || 'Custom user saved definition',
      example: newExample.trim() || `I practiced using "${newWord.trim()}" in a sentence.`,
      context: 'Personal Vocab',
      strength: 50,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const updated = [entry, ...words];
    setWords(updated);
    localStorage.setItem('fluentstep_my_words', JSON.stringify(updated));
    recordWordLearned(entry.word);
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setShowAddForm(false);
    soundService.playSuccess();
    addXP(10, `Added word: ${entry.word}`);
  };

  const handleDeleteWord = (id: string) => {
    const updated = words.filter((w) => w.id !== id);
    setWords(updated);
    localStorage.setItem('fluentstep_my_words', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Personal Lexicon
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              My Saved Words & Expressions
            </h1>
            <p className="text-indigo-100/90 text-sm max-w-2xl leading-relaxed">
              Every word you discover across conversations, missions, and journals is saved here for spaced-repetition mastery.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Word</span>
          </button>
        </div>
      </div>

      {/* Add Custom Word Modal / Inline Expand */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm"
          >
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Add a New Word or Idiom
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Word or phrase (e.g. In a nutshell)..."
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="Meaning or translation..."
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="Example sentence..."
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWord}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
              >
                Save Word
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search through your saved vocabulary and examples..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {item.word}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => soundService.speak(item.word)}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteWord(item.id)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {item.meaning}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic">
                "{item.example}"
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
              <span>{item.context}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Mastery: {item.strength}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
