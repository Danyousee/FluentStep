import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { READING_ARTICLES, ReadingArticle } from '../data/readingData';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  BookMarked,
  Info,
} from 'lucide-react';

interface ReadingLabViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const ReadingLabView: React.FC<ReadingLabViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<ReadingArticle>(READING_ARTICLES[0]);
  const [activeTab, setActiveTab] = useState<'article' | 'vocabulary' | 'grammar' | 'quiz'>('article');
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [selectedWordLookup, setSelectedWordLookup] = useState<{ word: string; meaning: string; phonetic?: string } | null>(null);

  const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
  const categories = ['All', ...Array.from(new Set(READING_ARTICLES.map((a) => a.category)))];

  const filteredArticles = READING_ARTICLES.filter((art) => {
    const matchesLevel = selectedLevel === 'All' || art.level === selectedLevel;
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesLevel && matchesCategory;
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

  const handleSelectArticle = (art: ReadingArticle) => {
    setActiveArticle(art);
    setActiveTab('article');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setSelectedWordLookup(null);
  };

  const handleSelectQuizOption = (qId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Count score
    let correctCount = 0;
    activeArticle.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) correctCount++;
    });

    if (correctCount >= Math.ceil(activeArticle.quiz.length / 2)) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedConversations: Array.from(
          new Set([...(prev.completedConversations || []), `read_${activeArticle.id}`])
        ),
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    }
  };

  return (
    <div id="reading-lab-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-teal-100 border border-white/20">
            <BookMarked className="w-3.5 h-3.5" />
            Reading Lab & Comprehension
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Level-Graded English Articles</h1>
          <p className="text-teal-100 text-base md:text-lg leading-relaxed">
            Expand vocabulary in rich context. Read culturally diverse, level-graded articles with instant word lookups, key grammar highlights, and interactive comprehension checks.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Level:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevel === lvl
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Article Selector (Left) & Reader Studio (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Article List */}
        <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Articles ({filteredArticles.length})
          </div>
          {filteredArticles.map((art) => {
            const isSelected = activeArticle.id === art.id;
            const isDone = userProgress.completedConversations?.includes(`read_${art.id}`);

            return (
              <div
                key={art.id}
                onClick={() => handleSelectArticle(art)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                    {art.level}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{art.readTime} read</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{art.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{art.summary}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  <span>{art.category}</span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Read
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Article Reader View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            {/* Article Top Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-teal-600 text-white font-bold text-xs">
                    {activeArticle.level}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {activeArticle.category} • {activeArticle.readingTimeMinutes} min read
                  </span>
                </div>
                <button
                  onClick={() => speakText(activeArticle.paragraphs.join(' '))}
                  className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Listen to full article narration"
                >
                  <Volume2 className="w-4 h-4" /> Listen
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{activeArticle.summary}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              {[
                { id: 'article', label: 'Article Text' },
                { id: 'vocabulary', label: `Vocabulary (${activeArticle.vocabularyList.length})` },
                { id: 'grammar', label: `Grammar Focus (${activeArticle.grammarHighlights.length})` },
                { id: 'quiz', label: `Quiz (${activeArticle.quiz.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Full Article Text with Instant Word Lookups */}
            {activeTab === 'article' && (
              <div className="space-y-6">
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-slate-800 dark:text-slate-200 space-y-4">
                  {activeArticle.paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Vocabulary Quick Tags */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Article Words (Tap for meaning):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeArticle.vocabularyList.map((v) => (
                      <button
                        key={v.word}
                        onClick={() => setSelectedWordLookup(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedWordLookup?.word === v.word
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-400'
                        }`}
                      >
                        {v.word}
                      </button>
                    ))}
                  </div>

                  {selectedWordLookup && (
                    <div className="mt-3 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-950 dark:text-teal-200 flex items-center justify-between">
                      <div>
                        <strong>{selectedWordLookup.word}</strong>{' '}
                        {selectedWordLookup.phonetic && (
                          <span className="font-mono text-teal-600 dark:text-teal-400 mr-2">
                            {selectedWordLookup.phonetic}
                          </span>
                        )}
                        : {selectedWordLookup.meaning}
                      </div>
                      <button
                        onClick={() => speakText(selectedWordLookup.word)}
                        className="p-1 rounded-md hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    Take Article Comprehension Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Vocabulary List */}
            {activeTab === 'vocabulary' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Words and Expressions:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeArticle.vocabularyList.map((v) => (
                    <div
                      key={v.word}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-base">{v.word}</span>
                        {v.phonetic && (
                          <span className="font-mono text-xs text-teal-600 dark:text-teal-400">{v.phonetic}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{v.meaning}</p>
                      <button
                        onClick={() => speakText(v.word)}
                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 pt-1 font-semibold"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Pronounce
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Grammar Highlights */}
            {activeTab === 'grammar' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Grammar Patterns Used in This Article:
                </div>
                <div className="space-y-3">
                  {activeArticle.grammarHighlights.map((gh, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {gh.pattern}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 pl-7">{gh.explanation}</div>
                      <div className="pl-7 text-xs font-medium text-teal-700 dark:text-teal-300 italic">
                        "{gh.exampleFromText}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Comprehension Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Comprehension Questions ({activeArticle.quiz.length})
                </div>

                <div className="space-y-6">
                  {activeArticle.quiz.map((q, qIdx) => {
                    const chosen = quizAnswers[q.id];
                    const isCorrect = chosen === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <span>{q.question}</span>
                        </div>

                        <div className="space-y-2 pl-7">
                          {q.options.map((opt, optIdx) => {
                            const isOptChosen = chosen === optIdx;
                            const isOptCorrect = optIdx === q.correctIndex;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                                  quizSubmitted
                                    ? isOptCorrect
                                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                                      : isOptChosen
                                      ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                                    : isOptChosen
                                    ? 'bg-teal-600 text-white font-bold border-teal-600 shadow-sm'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-400'
                                }`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isOptCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="pl-7 text-xs text-slate-600 dark:text-slate-400 pt-1">
                            💡 <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizAnswers).length < activeArticle.quiz.length}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Submit Quiz Answers
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Quiz Completed!
                      </span>
                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
