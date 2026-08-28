import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Send,
  Loader2,
  ArrowRight,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { evaluateSentenceWithAI, SentenceEvaluationData } from '../services/aiService';
import { soundService } from '../services/soundService';

type ExerciseType = 'mcq' | 'fill_blank' | 'matching' | 'create_sentence';

export const VocabularyPracticeView: React.FC = () => {
  const { setCurrentView, addXP, userProfile } = useApp();

  const [activeTab, setActiveTab] = useState<ExerciseType>('mcq');

  // State for MCQ
  const [mcqIndex, setMcqIndex] = useState(0);
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  // State for Fill Blank
  const [blankIndex, setBlankIndex] = useState(0);
  const [blankSelected, setBlankSelected] = useState<string | null>(null);
  const [blankSubmitted, setBlankSubmitted] = useState(false);

  // State for Create Sentence AI
  const [targetWordIndex, setTargetWordIndex] = useState(0);
  const [userSentence, setUserSentence] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<SentenceEvaluationData | null>(null);

  // State for Matching
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedMatchTerm, setSelectedMatchTerm] = useState<string | null>(null);
  const [selectedMatchDef, setSelectedMatchDef] = useState<string | null>(null);

  // MCQ Data generator
  const currentMcqWord = VOCABULARY_LIST[mcqIndex % VOCABULARY_LIST.length];
  const wrongOptions = VOCABULARY_LIST.filter((w) => w.id !== currentMcqWord.id)
    .slice(0, 3)
    .map((w) => w.simpleDefinition);
  const mcqOptions = [currentMcqWord.simpleDefinition, ...wrongOptions].sort();
  const correctMcqIdx = mcqOptions.indexOf(currentMcqWord.simpleDefinition);

  // Fill in blanks generator
  const currentBlankWord = VOCABULARY_LIST[blankIndex % VOCABULARY_LIST.length];
  const blankSentence =
    currentBlankWord.exampleSentence?.replace(
      new RegExp(currentBlankWord.word, 'gi'),
      '_______'
    ) || `She asked to _______ the book.`;
  const blankOptions = [
    currentBlankWord.word,
    ...VOCABULARY_LIST.filter((w) => w.id !== currentBlankWord.id)
      .slice(0, 3)
      .map((w) => w.word),
  ].sort();

  // Create sentence target word
  const currentTargetWord = VOCABULARY_LIST[targetWordIndex % VOCABULARY_LIST.length];

  // Matching game list (4 pairs)
  const matchingWords = VOCABULARY_LIST.slice(0, 4);

  const handleSelectMcq = (idx: number) => {
    if (mcqSubmitted) return;
    setMcqSelected(idx);
    setMcqSubmitted(true);
    if (idx === correctMcqIdx) {
      addXP(15, 'Correct vocabulary meaning!');
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
  };

  const handleNextMcq = () => {
    setMcqIndex((i) => i + 1);
    setMcqSelected(null);
    setMcqSubmitted(false);
  };

  const handleSelectBlank = (word: string) => {
    if (blankSubmitted) return;
    setBlankSelected(word);
    setBlankSubmitted(true);
    if (word.toLowerCase() === currentBlankWord.word.toLowerCase()) {
      addXP(15, 'Filled in the correct vocabulary word!');
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
  };

  const handleNextBlank = () => {
    setBlankIndex((i) => i + 1);
    setBlankSelected(null);
    setBlankSubmitted(false);
  };

  const handleMatchSelect = (type: 'term' | 'def', value: string) => {
    soundService.playPop();
    if (type === 'term') {
      setSelectedMatchTerm(value);
      if (selectedMatchDef) {
        checkMatch(value, selectedMatchDef);
      }
    } else {
      setSelectedMatchDef(value);
      if (selectedMatchTerm) {
        checkMatch(selectedMatchTerm, value);
      }
    }
  };

  const checkMatch = (termId: string, defId: string) => {
    if (termId === defId) {
      setMatchedPairs((prev) => [...prev, termId]);
      addXP(10, 'Matched vocabulary pair!');
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
    setSelectedMatchTerm(null);
    setSelectedMatchDef(null);
  };

  const handleEvaluateSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSentence.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setAiFeedback(null);

    const result = await evaluateSentenceWithAI({
      word: currentTargetWord.word,
      sentence: userSentence,
      context: currentTargetWord.simpleDefinition,
      userLevel: userProfile.level,
    });

    setAiFeedback(result);
    setIsEvaluating(false);

    if (result.isCorrect) {
      addXP(25, 'Constructed a meaningful sentence with the target word!');
      soundService.playSuccess();
    } else {
      soundService.playError();
    }
  };

  const handleNextTargetWord = () => {
    setTargetWordIndex((i) => i + 1);
    setUserSentence('');
    setAiFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('vocabulary')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={16} />
          <span>Back to Vocabulary</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Practice Arena
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'mcq', label: '1. Meaning Quiz' },
          { id: 'fill_blank', label: '2. Fill in the Blanks' },
          { id: 'matching', label: '3. Match Definitions' },
          { id: 'create_sentence', label: '4. AI Sentence Challenge' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`practice_tab_${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Multiple Choice Meaning Quiz */}
      {activeTab === 'mcq' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Exercise 1: Meaning Recognition
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              What is the meaning of "{currentMcqWord.word}"?
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Part of speech: {currentMcqWord.partOfSpeech} • {currentMcqWord.pronunciation}
            </p>
          </div>

          <div className="space-y-3">
            {mcqOptions.map((opt, idx) => {
              let style = 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200';
              if (mcqSubmitted) {
                if (idx === correctMcqIdx) {
                  style = 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-500 font-bold';
                } else if (mcqSelected === idx) {
                  style = 'bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-500 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  id={`mcq_opt_${idx}`}
                  disabled={mcqSubmitted}
                  onClick={() => handleSelectMcq(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {mcqSubmitted && idx === correctMcqIdx && (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  )}
                  {mcqSubmitted && mcqSelected === idx && idx !== correctMcqIdx && (
                    <XCircle size={18} className="text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {mcqSubmitted && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-500">
                {mcqSelected === correctMcqIdx ? '🎉 Great job!' : 'Review this definition and try the next!'}
              </span>
              <button
                id="btn_mcq_next"
                onClick={handleNextMcq}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Fill in the Blanks */}
      {activeTab === 'fill_blank' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Exercise 2: Contextual Sentence Completion
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Select the correct word to complete the sentence:
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-center">
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              "{blankSentence}"
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {blankOptions.map((word, idx) => {
              let style = 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50';
              if (blankSubmitted) {
                if (word.toLowerCase() === currentBlankWord.word.toLowerCase()) {
                  style = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                } else if (blankSelected === word) {
                  style = 'bg-rose-600 text-white border-rose-600 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={blankSubmitted}
                  onClick={() => handleSelectBlank(word)}
                  className={`p-3.5 rounded-2xl border text-center text-sm font-semibold transition-all ${style}`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {blankSubmitted && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-500">
                Definition: <strong>{currentBlankWord.simpleDefinition}</strong>
              </span>
              <button
                id="btn_blank_next"
                onClick={handleNextBlank}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span>Next Sentence</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Word Matching */}
      {activeTab === 'matching' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Exercise 3: Word & Definition Pairing
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Match each word to its corresponding definition:
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Click a word on the left, then click its matching meaning on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Terms */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 block">Words</span>
              {matchingWords.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedMatchTerm === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleMatchSelect('term', item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-sm font-bold transition-all ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 opacity-60'
                        : isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/40'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {item.word} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Right Definitions */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 block">Definitions</span>
              {[...matchingWords]
                .reverse()
                .map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedMatchDef === item.id;

                  return (
                    <button
                      key={item.id}
                      disabled={isMatched}
                      onClick={() => handleMatchSelect('def', item.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs leading-relaxed transition-all ${
                        isMatched
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 opacity-60'
                          : isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/40'
                          : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {item.simpleDefinition} {isMatched && '✓'}
                    </button>
                  );
                })}
            </div>
          </div>

          {matchedPairs.length === matchingWords.length && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center">
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                🎉 All 4 pairs matched successfully! (+40 XP)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Create a Sentence with AI Evaluation */}
      {activeTab === 'create_sentence' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                <Sparkles size={16} />
                <span>AI Sentence Constructor</span>
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                Use "{currentTargetWord.word}" in your own English sentence
              </h2>
            </div>

            <button
              onClick={handleNextTargetWord}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
            >
              <span>Try different word</span>
              <RotateCcw size={13} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 space-y-1">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
              Word Details:
            </span>
            <p className="text-xs text-purple-800 dark:text-purple-300">
              <strong>{currentTargetWord.word}</strong> ({currentTargetWord.partOfSpeech}) — {currentTargetWord.simpleDefinition}
            </p>
            <p className="text-[11px] text-purple-700 dark:text-purple-400 italic">
              Example usage: "{currentTargetWord.exampleSentence}"
            </p>
          </div>

          <form onSubmit={handleEvaluateSentence} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block mb-1.5">
                Type your English sentence below:
              </label>
              <textarea
                id="vocab_ai_sentence_input"
                rows={3}
                value={userSentence}
                onChange={(e) => setUserSentence(e.target.value)}
                placeholder={`Example: I want to ${currentTargetWord.word.toLowerCase()}...`}
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <button
              id="btn_submit_ai_sentence"
              type="submit"
              disabled={!userSentence.trim() || isEvaluating}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Evaluating with AI Tutor...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Check Sentence with AI (+25 XP)</span>
                </>
              )}
            </button>
          </form>

          {/* AI Feedback Card */}
          {aiFeedback && (
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                aiFeedback.isCorrect
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {aiFeedback.isCorrect ? '✅ Sentence Approved!' : '💡 Learning Opportunity:'}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800">
                  Score: {aiFeedback.score}/100
                </span>
              </div>

              <p className="text-xs leading-relaxed font-medium">
                {aiFeedback.feedback}
              </p>

              {aiFeedback.correctedSentence && (
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 text-xs">
                  <span className="font-bold text-zinc-500 block mb-0.5">Polished Version:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    "{aiFeedback.correctedSentence}"
                  </span>
                </div>
              )}

              {aiFeedback.explanation && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <strong>Why:</strong> {aiFeedback.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
