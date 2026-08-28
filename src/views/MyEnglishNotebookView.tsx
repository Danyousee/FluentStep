import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Folder,
  Tag,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';
import { SavedNotebookWord } from '../types';

export const MyEnglishNotebookView: React.FC = () => {
  const { savedNotebookWords, saveWordToNotebook, removeWordFromNotebook } = useApp();

  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New word form state
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newType, setNewType] = useState<'word' | 'phrase' | 'idiom' | 'grammar_rule'>('word');
  const [newExample, setNewExample] = useState('');
  const [newFolder, setNewFolder] = useState('General');

  const folders = [
    'All',
    ...Array.from(new Set(savedNotebookWords.map((w) => w.folder || 'General'))),
  ];

  const filteredWords = savedNotebookWords.filter((w) => {
    const matchesFolder = selectedFolder === 'All' || (w.folder || 'General') === selectedFolder;
    const matchesSearch =
      w.wordOrPhrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    saveWordToNotebook({
      wordOrPhrase: newWord.trim(),
      meaning: newMeaning.trim(),
      type: newType,
      exampleSentence: newExample.trim() || undefined,
      folder: newFolder.trim() || 'General',
    });

    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setIsAdding(false);
  };

  const handlePlayVoice = (text: string) => {
    soundService.speakSentence(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <BookOpen size={14} className="text-amber-300" />
            <span>Personal Lexicon & Phrasebook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My English Notebook
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm">
            Review your saved vocabulary, idioms, grammar corrections, and practice active recall with spaced repetition flashcards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotebookWords.length > 0 && (
            <button
              onClick={() => {
                setFlashcardMode(!flashcardMode);
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Sparkles size={16} />
              <span>{flashcardMode ? 'List View' : 'Flashcard Mode'}</span>
            </button>
          )}
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {flashcardMode && filteredWords.length > 0 ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>
              Card {flashcardIndex + 1} of {filteredWords.length}
            </span>
            <span>Tap card to reveal definition</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-72 cursor-pointer bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.01]"
          >
            {!isFlipped ? (
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {filteredWords[flashcardIndex]?.type}
                </span>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                  {filteredWords[flashcardIndex]?.wordOrPhrase}
                </h3>
                <p className="text-xs text-slate-400">Click to flip</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {filteredWords[flashcardIndex]?.meaning}
                </p>
                {filteredWords[flashcardIndex]?.exampleSentence && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "{filteredWords[flashcardIndex]?.exampleSentence}"
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(filteredWords[flashcardIndex]?.wordOrPhrase || '');
                  }}
                  className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-full mx-auto block hover:bg-indigo-100"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setFlashcardIndex((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={flashcardIndex === 0}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                setFlashcardIndex((prev) =>
                  Math.min(filteredWords.length - 1, prev + 1)
                );
                setIsFlipped(false);
              }}
              disabled={flashcardIndex === filteredWords.length - 1}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 disabled:opacity-40"
            >
              Next Card →
            </button>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFolder === f
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notebook..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {item.type}
                    </span>
                    <button
                      onClick={() => handlePlayVoice(item.wordOrPhrase)}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-all"
                      title="Pronounce"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {item.wordOrPhrase}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.meaning}
                  </p>

                  {item.exampleSentence && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 italic">
                      "{item.exampleSentence}"
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Folder: {item.folder || 'General'}</span>
                  <button
                    onClick={() => removeWordFromNotebook(item.id)}
                    className="text-rose-500 hover:text-rose-700"
                    title="Remove from notebook"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWords.length === 0 && (
            <div className="text-center py-12 space-y-3 text-slate-400">
              <BookOpen size={36} className="mx-auto text-slate-300" />
              <p className="text-xs">No entries found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Add to Notebook
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Word or Phrase</label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Touch base"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Meaning & Definition</label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="e.g. Briefly make contact or connect with someone"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="word">Word</option>
                  <option value="phrase">Phrase</option>
                  <option value="idiom">Idiom</option>
                  <option value="grammar_rule">Grammar Rule</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Example Sentence</label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. Let's touch base on Monday after the team meeting."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Folder Category</label>
                <input
                  type="text"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  placeholder="e.g. Business Meetings"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg mt-2"
              >
                Save to Notebook
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
