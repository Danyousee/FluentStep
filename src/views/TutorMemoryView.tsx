import React, { useState } from 'react';
import {
  Brain,
  Trash2,
  Edit3,
  Plus,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Mic,
  MessageSquare,
  Zap,
  Layers,
  Award,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TutorMemoryView: React.FC = () => {
  const {
    learnerMemory,
    updateLearnerMemory,
    resetLearnerMemory,
    clearMemoryCategory,
    userProfile,
    setCurrentView,
    addXP,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'mistakes' | 'vocabulary' | 'topics' | 'conversations'>('overview');
  const [newGoalInput, setNewGoalInput] = useState('');
  const [newMistakeInput, setNewMistakeInput] = useState('');
  const [simulationPrompt, setSimulationPrompt] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    updateLearnerMemory({
      learningGoals: [...learnerMemory.learningGoals, newGoalInput.trim()],
    });
    setNewGoalInput('');
    addXP(10, 'Added custom learning goal to AI memory');
  };

  const handleRemoveGoal = (index: number) => {
    const updated = learnerMemory.learningGoals.filter((_, i) => i !== index);
    updateLearnerMemory({ learningGoals: updated });
  };

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMistakeInput.trim()) return;
    updateLearnerMemory({
      commonGrammarMistakes: [...learnerMemory.commonGrammarMistakes, newMistakeInput.trim()],
    });
    setNewMistakeInput('');
    addXP(10, 'Noted grammar focus point in AI memory');
  };

  const handleRemoveGrammarMistake = (index: number) => {
    const updated = learnerMemory.commonGrammarMistakes.filter((_, i) => i !== index);
    updateLearnerMemory({ commonGrammarMistakes: updated });
  };

  const handleRemoveConfusedWord = (index: number) => {
    const updated = learnerMemory.frequentlyConfusedWords.filter((_, i) => i !== index);
    updateLearnerMemory({ frequentlyConfusedWords: updated });
  };

  const handleSimulateAdaptation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationPrompt(
        `[AI Tutor Adaptive Context Injected]:
- Learner Level: ${learnerMemory.currentLevel} -> Target: ${learnerMemory.targetLevel}
- Active Goals: "${learnerMemory.learningGoals[0] || 'Fluency'}"
- Known Weaknesses to softly target: "${learnerMemory.commonGrammarMistakes[0] || 'Prepositions'}"
- Avoiding difficult vocabulary overwhelm while nudging: "${learnerMemory.difficultVocabulary.slice(0, 2).join(', ')}"
- Suggested Tutor Response Tone: Patient, encouraging, with 1 gentle inline correction if error occurs.`
      );
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Brain size={14} className="text-indigo-400 animate-pulse" />
              My AI Tutor Memory Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              What Your Tutor Knows
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your AI tutor continuously observes your speech, sentences, and mistakes to build a deeply personalized learning model. You have complete transparency and control to edit or delete any memory item at any time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              id="btn_test_tutor_memory_adaptation"
              onClick={handleSimulateAdaptation}
              disabled={isSimulating}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={16} className={isSimulating ? 'animate-spin' : ''} />
              {isSimulating ? 'Analyzing...' : 'Test Tutor Adaptation'}
            </button>
            <button
              id="btn_launch_voice_tutor_from_memory"
              onClick={() => setCurrentView('voice_tutor')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all cursor-pointer"
            >
              <Mic size={16} className="text-emerald-400" />
              Practice in Voice Tutor
            </button>
          </div>
        </div>

        {/* Privacy Guarantee Pill */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>
              <strong>Privacy Guarantee:</strong> No unnecessary personal data is stored. Only learning-related metrics are retained to improve your English.
            </span>
          </div>
          <button
            id="btn_open_clear_all_memory"
            onClick={() => setShowConfirmReset(true)}
            className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Reset All Tutor Memory
          </button>
        </div>
      </div>

      {/* Simulation Prompt Preview Modal/Alert if clicked */}
      {simulationPrompt && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 relative animate-fadeIn">
          <button
            onClick={() => setSimulationPrompt(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
          >
            Close ✕
          </button>
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                Live Tutor Personalization In Action
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 mb-3">
                When you practice speaking or doing exercises, the AI injects the following tailored profile into every conversation:
              </p>
              <pre className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {simulationPrompt}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Reset All AI Learning Memory?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                This will clear all tracked weaknesses, mistake patterns, and conversation memory. Your base account XP and badges will remain intact.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn_cancel_reset_memory"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                id="btn_confirm_reset_memory"
                onClick={() => {
                  resetLearnerMemory();
                  setShowConfirmReset(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/30"
              >
                Yes, Reset Memory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Tutor Overview', icon: <Brain size={16} /> },
          { id: 'mistakes', label: 'Tracked Mistakes & Traps', icon: <AlertCircle size={16} /> },
          { id: 'vocabulary', label: 'Vocabulary & Nuances', icon: <BookOpen size={16} /> },
          { id: 'topics', label: 'Curriculum & Mastery', icon: <Layers size={16} /> },
          { id: 'conversations', label: 'Conversation Insights', icon: <MessageSquare size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab_memory_${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Current CEFR Level</span>
                <Award size={16} className="text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {learnerMemory.currentLevel} → {learnerMemory.targetLevel}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                Targeting B2 Professional Fluency
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Identified Weak Areas</span>
                <AlertCircle size={16} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {learnerMemory.commonGrammarMistakes.length + learnerMemory.commonSentenceMistakes.length} Patterns
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Actively targeted in daily drills
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Active Vocabulary</span>
                <BookOpen size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {learnerMemory.vocabularyLearned.length} Words
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                {learnerMemory.difficultVocabulary.length} words flagged for review
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Speaking Time Recorded</span>
                <Mic size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {learnerMemory.speakingWeaknesses.length ? '8.4 Min' : '0 Min'}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                Pacing & Pronunciation tracked
              </div>
            </div>
          </div>

          {/* Active Goals Section */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Learner Goals Remembered by AI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  The AI references these priorities when selecting topic scenarios and conversation themes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learnerMemory.learningGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {goal}
                    </span>
                  </div>
                  <button
                    id={`btn_delete_goal_${idx}`}
                    onClick={() => handleRemoveGoal(idx)}
                    title="Delete goal"
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Goal Form */}
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                id="input_new_memory_goal"
                type="text"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                placeholder="Tell your tutor another goal (e.g. 'Ace tech job interview next month')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
              />
              <button
                id="btn_add_new_memory_goal"
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/20"
              >
                <Plus size={16} />
                Add Goal
              </button>
            </form>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              id="card_nav_diagnostics"
              onClick={() => setCurrentView('ai_diagnostics')}
              className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                AI Skill Diagnostics
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                View root-cause analysis on translation dependency, preposition errors, and grammar gaps.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4">
                <span>View Full Diagnostics</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div
              id="card_nav_word_retrieval"
              onClick={() => setCurrentView('word_retrieval')}
              className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Word Retrieval Gym
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Test active recall under pressure to move vocabulary from passive recognition to speaking fluency.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4">
                <span>Start Timed Retrieval</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div
              id="card_nav_emergency_mode"
              onClick={() => setCurrentView('emergency_help')}
              className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertCircle size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Emergency English Mode
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                "I Need English Now" — prepare high-stakes interviews, ER visits, or landlord disputes instantly.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 mt-4">
                <span>Prepare Situation</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MISTAKES & TRAPS */}
      {activeTab === 'mistakes' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Grammar Mistakes Section */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  Repeated Grammar Mistake Patterns
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Patterns detected across quizzes, sentence builders, and speech sessions.
                </p>
              </div>
              <button
                id="btn_clear_mistakes_memory"
                onClick={() => clearMemoryCategory('mistakes')}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear Mistakes History
              </button>
            </div>

            <div className="space-y-3">
              {learnerMemory.commonGrammarMistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 group"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {mistake}
                    </p>
                  </div>
                  <button
                    id={`btn_remove_grammar_mistake_${idx}`}
                    onClick={() => handleRemoveGrammarMistake(idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Grammar Focus */}
            <form onSubmit={handleAddMistake} className="flex gap-2 pt-2">
              <input
                id="input_new_grammar_mistake"
                type="text"
                value={newMistakeInput}
                onChange={(e) => setNewMistakeInput(e.target.value)}
                placeholder="Add a grammar area you know you struggle with (e.g. 'Since vs For with Present Perfect')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shrink-0 shadow-md shadow-amber-600/20"
              >
                Track Focus Area
              </button>
            </form>
          </div>

          {/* Frequently Confused Pairs */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-500" />
              Frequently Confused Pairs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learnerMemory.frequentlyConfusedWords.map((pair, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3 relative group"
                >
                  <button
                    onClick={() => handleRemoveConfusedWord(idx)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {pair.pair}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pair.explanation}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
                    <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                      ✓ {pair.exampleA}
                    </div>
                    <div className="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                      ✓ {pair.exampleB}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* L1 Translation Traps */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap size={18} className="text-rose-500" />
              L1 Literal Translation Traps Detected
            </h3>
            <div className="space-y-3">
              {learnerMemory.frequentlyUsedIncorrectExpressions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold line-through text-rose-600 dark:text-rose-400">
                        "{item.wrong}"
                      </span>
                      <span className="text-xs font-black text-slate-400">→</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        "{item.right}"
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reason: {item.context}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                    Tutor Autocorrect Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VOCABULARY & NUANCES */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mastered Vocabulary */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Words in Fluent Active Use ({learnerMemory.vocabularyLearned.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {learnerMemory.vocabularyLearned.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Flagged Difficult Vocabulary */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  Words Needing Retrieval Practice ({learnerMemory.difficultVocabulary.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {learnerMemory.difficultVocabulary.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CURRICULUM & MASTERY */}
      {activeTab === 'topics' && (
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Curriculum Topics Studied & Retained
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learnerMemory.topicsStudied.map((topic, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {topic}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONVERSATIONS */}
      {activeTab === 'conversations' && (
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                AI Speaking Weakness Observations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Observed acoustic and fluency markers during speech sessions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {learnerMemory.speakingWeaknesses.map((weakness, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3"
              >
                <Mic size={16} className="text-purple-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                  {weakness}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
