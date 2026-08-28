import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GRAMMAR_TOPICS } from '../data/grammarData';

export const GrammarView: React.FC = () => {
  const { userStats, setSelectedGrammarTopicId, setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredTopics = useMemo(() => {
    return GRAMMAR_TOPICS.filter((topic) => {
      const matchLevel = selectedLevel === 'all' || topic.level === selectedLevel;
      const matchQuery =
        !searchQuery.trim() ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchQuery;
    });
  }, [searchQuery, selectedLevel]);

  const handleOpenLesson = (topicId: string) => {
    setSelectedGrammarTopicId(topicId);
    setCurrentView('grammar_lesson');
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <GraduationCap size={16} />
            <span>Grammar Without Confusion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            Plain English Grammar Rules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Practical explanations with formulas, clear examples, common mistakes, and short quizzes.
          </p>
        </div>
      </div>

      {/* Search & Level Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            id="grammar_search_input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grammar topics (e.g. articles, prepositions, past simple)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'A1', 'A2', 'B1'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const mastery = userStats.grammarMastery[topic.id] || 0;

          return (
            <div
              key={topic.id}
              id={`grammar_card_${topic.id}`}
              onClick={() => handleOpenLesson(topic.id)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                    Level {topic.level}
                  </span>
                  {mastery >= 80 && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={14} />
                      {mastery}% Mastered
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {topic.shortDesc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {topic.rules.length} Rules • {topic.quizQuestions.length} Questions
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Study Lesson <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
