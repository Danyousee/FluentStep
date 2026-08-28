import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, Layers, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGlobalSearchIndex } from '../data/searchData';
import { SearchResultItem } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    setCurrentView,
    setSelectedVocabId,
    setSelectedGrammarTopicId,
    setSelectedConversationId,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'word' | 'collocation' | 'grammar' | 'conversation'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIndex = useMemo(() => getGlobalSearchIndex(), []);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return searchIndex.slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return searchIndex.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.type === activeCategory;
      const matchText =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q));
      return matchCategory && matchText;
    });
  }, [query, activeCategory, searchIndex]);

  const handleSelect = (item: SearchResultItem) => {
    setSearchModalOpen(false);
    if (item.navTarget.page === 'vocabulary') {
      if (item.navTarget.id) setSelectedVocabId(item.navTarget.id);
      setCurrentView('vocabulary');
    } else if (item.navTarget.page === 'grammar_lesson' && item.navTarget.id) {
      setSelectedGrammarTopicId(item.navTarget.id);
      setCurrentView('grammar_lesson');
    } else if (item.navTarget.page === 'conversation' && item.navTarget.id) {
      setSelectedConversationId(item.navTarget.id);
      setCurrentView('conversation');
    } else {
      setCurrentView(item.navTarget.page as any);
    }
  };

  if (!searchModalOpen) return null;

  const typeIcon = {
    word: <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />,
    collocation: <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />,
    grammar: <Layers size={16} className="text-blue-600 dark:text-blue-400" />,
    conversation: <MessageSquare size={16} className="text-purple-600 dark:text-purple-400" />,
    sentence: <Sparkles size={16} className="text-teal-600 dark:text-teal-400" />,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-zinc-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
            <Search className="text-zinc-400 shrink-0" size={20} />
            <input
              ref={inputRef}
              id="global_search_input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words, collocations (e.g. 'make a decision'), grammar rules, topics..."
              className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none text-base font-normal"
            />
            {query && (
              <button
                id="btn_clear_search"
                onClick={() => setQuery('')}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
              >
                <X size={16} />
              </button>
            )}
            <button
              id="btn_close_search_modal"
              onClick={() => setSearchModalOpen(false)}
              className="px-2 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
            >
              ESC
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-zinc-400 font-medium mr-1">Filter:</span>
            {[
              { id: 'all', label: 'All Results' },
              { id: 'word', label: 'Vocabulary' },
              { id: 'collocation', label: 'Collocations & Phrases' },
              { id: 'grammar', label: 'Grammar' },
              { id: 'conversation', label: 'Conversations' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-zinc-50 dark:divide-zinc-800/40">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  No matches found for <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{query}"</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Try searching for keywords like "make", "past tense", "reliable", or "order food".
                </p>
              </div>
            ) : (
              filteredResults.map((item) => (
                <button
                  key={item.id}
                  id={`search_result_${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-4">
                    <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 shrink-0 mt-0.5">
                      {typeIcon[item.type]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 capitalize">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span>Pro tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">Cmd+K</kbd> anywhere to search</span>
            <span>{filteredResults.length} matches</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
