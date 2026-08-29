import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Search,
  Volume2,
  Sparkles,
  MessageSquare,
  Building,
  Coffee,
  Plane,
  Compass,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Mic,
  MicOff,
  RotateCcw,
  Zap,
  BookOpen,
  Check,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askHowDoISayThis, evaluateSentenceWithAI, HowDoISayThisResponseData } from '../services/aiService';
import { soundService } from '../services/soundService';
import { speechRecognitionService } from '../services/speechRecognitionService';

const COMMON_INTENTS = [
  { intent: 'Ask for the bill in a restaurant', context: 'Dining' },
  { intent: 'Politely ask someone to repeat what they said', context: 'General' },
  { intent: 'Tell my boss I am sick and cannot come to work today', context: 'Work' },
  { intent: 'Decline an invitation without sounding rude', context: 'Social' },
  { intent: 'Ask for directions to the nearest train station', context: 'Travel' },
  { intent: 'Disagree with a coworker politely in a team meeting', context: 'Work' },
  { intent: 'Ask for a discount or best price in a store', context: 'Shopping' },
  { intent: 'Apologize for being late due to heavy traffic', context: 'Work' },
  { intent: 'Ask someone to explain something more simply', context: 'Academic' },
  { intent: 'Order food with dietary restrictions (no dairy/nuts)', context: 'Dining' },
];

const CONTEXT_TAGS = [
  { id: 'general', label: '🌍 General', icon: Compass },
  { id: 'work', label: '💼 Work & Office', icon: Building },
  { id: 'dining', label: '☕ Café & Dining', icon: Coffee },
  { id: 'travel', label: '✈️ Travel & Transit', icon: Plane },
  { id: 'social', label: '💬 Social & Friends', icon: MessageSquare },
];

export const HowDoISayThisView: React.FC = () => {
  const { userProfile, addXP, addMistakeRecord, recordSentenceCompleted, recordSpeakingPractice } = useApp();
  const [query, setQuery] = useState('');
  const [activeContext, setActiveContext] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HowDoISayThisResponseData | null>(null);

  // 7-Step Interactive Mastery Workout state
  const [activePhraseOption, setActivePhraseOption] = useState<{
    tier: string;
    phrase: string;
    whenToUse: string;
    sampleDialogue?: string;
  } | null>(null);
  const [workoutStep, setWorkoutStep] = useState<number>(1); // 1: Understand, 2: Rebuild, 3: Modify, 4: Create, 5: Speak, 6: Dialogue

  // Step 2 Rebuild Puzzle state
  const [puzzleTokens, setPuzzleTokens] = useState<string[]>([]);
  const [selectedPuzzleTokens, setSelectedPuzzleTokens] = useState<string[]>([]);
  const [isPuzzleVerified, setIsPuzzleVerified] = useState<boolean | null>(null);

  // Step 4 Create Own Sentence state
  const [userCreatedSentence, setUserCreatedSentence] = useState('');
  const [isEvaluatingSentence, setIsEvaluatingSentence] = useState(false);
  const [sentenceEvaluation, setSentenceEvaluation] = useState<any | null>(null);

  // Step 5 Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speakingAccuracy, setSpeakingAccuracy] = useState<number | null>(null);

  // Step 6 Dialogue simulation state
  const [dialogueTurn, setDialogueTurn] = useState<number>(0);

  const handleSearch = async (customQuery?: string, contextOverride?: string) => {
    const q = customQuery || query.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setActivePhraseOption(null);
    const ctx = contextOverride || activeContext;

    try {
      const data = await askHowDoISayThis(q, ctx, userProfile.level);
      setResult(data);
      addXP(15, 'Discovered contextual English expressions');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMasteryWorkout = (option: {
    tier: string;
    phrase: string;
    whenToUse: string;
    sampleDialogue?: string;
  }) => {
    setActivePhraseOption(option);
    setWorkoutStep(1);
    setIsPuzzleVerified(null);
    setUserCreatedSentence('');
    setSentenceEvaluation(null);
    setSpokenTranscript('');
    setSpeakingAccuracy(null);
    setDialogueTurn(0);

    // Initialize puzzle tokens
    const words = option.phrase.replace(/[.,?!]/g, '').split(/\s+/).filter(Boolean);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setPuzzleTokens(shuffled);
    setSelectedPuzzleTokens([]);
    soundService.playFanfare();
  };

  const handleSelectPuzzleToken = (word: string, index: number) => {
    soundService.playPop();
    setSelectedPuzzleTokens([...selectedPuzzleTokens, word]);
    const updated = [...puzzleTokens];
    updated.splice(index, 1);
    setPuzzleTokens(updated);
    setIsPuzzleVerified(null);
  };

  const handleDeselectPuzzleToken = (word: string, index: number) => {
    soundService.playPop();
    const updatedSelected = [...selectedPuzzleTokens];
    updatedSelected.splice(index, 1);
    setSelectedPuzzleTokens(updatedSelected);
    setPuzzleTokens([...puzzleTokens, word]);
    setIsPuzzleVerified(null);
  };

  const handleVerifyPuzzle = () => {
    if (!activePhraseOption) return;
    const built = selectedPuzzleTokens.join(' ').toLowerCase().trim();
    const targetClean = activePhraseOption.phrase.replace(/[.,?!]/g, '').toLowerCase().trim();

    if (built === targetClean) {
      setIsPuzzleVerified(true);
      soundService.playSuccess();
      addXP(15, 'Rebuilt target sentence successfully!');
      recordSentenceCompleted();
    } else {
      setIsPuzzleVerified(false);
      soundService.playError();
    }
  };

  const handleEvaluateCreatedSentence = async () => {
    if (!userCreatedSentence.trim() || isEvaluatingSentence || !activePhraseOption) return;
    setIsEvaluatingSentence(true);
    try {
      const evalResult = await evaluateSentenceWithAI({
        word: result?.concept || activePhraseOption.phrase,
        sentence: userCreatedSentence,
        context: `Expressing: ${result?.concept || activePhraseOption.whenToUse}`,
        userLevel: userProfile.level,
      });
      setSentenceEvaluation(evalResult);
      if (evalResult.isCorrect) {
        soundService.playSuccess();
        addXP(20, 'Formulated natural customized sentence');
        recordSentenceCompleted();
      } else {
        soundService.playError();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluatingSentence(false);
    }
  };

  const handleToggleSpeech = () => {
    if (!activePhraseOption) return;

    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      return;
    }

    setSpokenTranscript('');
    setSpeakingAccuracy(null);

    const started = speechRecognitionService.startListening(
      (res) => {
        setSpokenTranscript(res.transcript);
        if (res.isFinal) {
          setIsListening(false);
          const targetClean = activePhraseOption.phrase.toLowerCase().replace(/[^a-z0-9 ]/g, '');
          const spokenClean = res.transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '');
          const targetWords = targetClean.split(' ');
          const spokenWords = spokenClean.split(' ');
          const matched = targetWords.filter((w) => spokenWords.includes(w)).length;
          const score = Math.round((matched / Math.max(targetWords.length, 1)) * 100);
          setSpeakingAccuracy(score);
          if (score >= 70) {
            soundService.playSuccess();
            addXP(20, 'Accurately pronounced target expression');
            recordSpeakingPractice(1);
          } else {
            soundService.playError();
          }
        }
      },
      (err) => {
        console.warn(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  return (
    <div id="how-do-i-say-this-container" className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">"What Do You Want to Say?" Studio</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Express your intent in simple words, discover natural phrasing across 4 formality tiers, and complete interactive mastery workouts.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="how-do-i-say-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Tell my boss I am sick and won't attend today's meeting..."
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              id="how-do-i-say-search-btn"
              onClick={() => handleSearch()}
              disabled={!query.trim() || isLoading}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Finding Phrases...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Find Expressions
                </>
              )}
            </button>
          </div>

          {/* Context Selector */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Setting / Context:</span>
            {CONTEXT_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setActiveContext(tag.id);
                  if (query.trim()) handleSearch(query, tag.id);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  activeContext === tag.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Prompt chips */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 mr-2">Popular communication scenarios:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_INTENTS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(item.intent);
                    handleSearch(item.intent, item.context.toLowerCase());
                  }}
                  className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  💡 {item.intent}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results & 4 Phrasing Tiers */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                4 Phrasing Tiers for: <span className="text-indigo-600 dark:text-indigo-400">"{result.concept}"</span>
              </h2>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Context: {activeContext}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.options.map((opt, i) => {
                let badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
                if (opt.tier === 'Natural' || opt.tier.includes('Natural')) badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
                if (opt.tier === 'Polite' || opt.tier.includes('Polite')) badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
                if (opt.tier === 'Professional' || opt.tier.includes('Professional')) badgeColor = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';

                const isSelected = activePhraseOption?.phrase === opt.phrase;

                return (
                  <div
                    key={i}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                          {opt.tier} Tier
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => soundService.speak(opt.phrase)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Listen pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        "{opt.phrase}"
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {opt.whenToUse}
                      </p>

                      {opt.sampleDialogue && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 mt-2">
                          <span className="font-semibold text-slate-500 block mb-1">Sample Exchange:</span>
                          <p className="italic font-mono text-[11px]">{opt.sampleDialogue}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => handleStartMasteryWorkout(opt)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Practicing Workout' : 'Start Mastery Workout'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cultural Tip Card */}
            {result.culturalTip && (
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-amber-100">Cultural & Social Etiquette Nuance</h4>
                  <p className="mt-1 leading-relaxed">{result.culturalTip}</p>
                </div>
              </div>
            )}

            {/* 7-Step Interactive Mastery Workout Drawer */}
            {activePhraseOption && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/80 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-800">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-800/60 px-2.5 py-1 rounded-md">
                      7-Step Expression Mastery Workout
                    </span>
                    <h3 className="text-xl font-bold mt-1 text-white">
                      "{activePhraseOption.phrase}"
                    </h3>
                  </div>

                  {/* Step Selector Tabs */}
                  <div className="flex flex-wrap gap-1 bg-indigo-950/80 p-1.5 rounded-2xl border border-indigo-800">
                    {[
                      { num: 1, label: '1. Understand' },
                      { num: 2, label: '2. Rebuild' },
                      { num: 3, label: '3. Create' },
                      { num: 4, label: '4. Speak' },
                      { num: 5, label: '5. Dialogue' },
                    ].map((st) => (
                      <button
                        key={st.num}
                        onClick={() => setWorkoutStep(st.num)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          workoutStep === st.num
                            ? 'bg-white text-indigo-900 shadow-xs'
                            : 'text-indigo-300 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 1: Understand Breakdown */}
                {workoutStep === 1 && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-800 space-y-3">
                      <h4 className="font-bold text-sm text-indigo-200">Sentence Anatomy & Nuance</h4>
                      <p className="text-sm font-semibold text-white">
                        "{activePhraseOption.phrase}"
                      </p>
                      <p className="text-xs text-indigo-300 leading-relaxed">
                        <strong>Usage Context:</strong> {activePhraseOption.whenToUse}
                      </p>
                      <div className="p-3 bg-indigo-900/60 rounded-xl text-xs text-indigo-200">
                        💡 <strong>Why it sounds natural:</strong> English speakers use polite softening phrases like "I was wondering if...", "Could you please...", and "I wanted to let you know that..." to communicate with diplomacy without sounding aggressive or demanding.
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setWorkoutStep(2)}
                        className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <span>Next: Rebuild with Word Puzzle</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Rebuild Puzzle */}
                {workoutStep === 2 && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-800 space-y-4">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Reconstruct the expression in correct sequence:
                      </span>

                      {/* Selected Slots */}
                      <div className="min-h-[50px] p-3 bg-slate-900 border border-indigo-700 rounded-xl flex flex-wrap gap-2 items-center">
                        {selectedPuzzleTokens.length === 0 ? (
                          <span className="text-xs text-indigo-400 italic">Click the words below to build the sentence...</span>
                        ) : (
                          selectedPuzzleTokens.map((w, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDeselectPuzzleToken(w, idx)}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-transform active:scale-95 cursor-pointer shadow-2xs"
                            >
                              {w}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Available Word Chips */}
                      <div className="flex flex-wrap gap-2">
                        {puzzleTokens.map((w, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectPuzzleToken(w, idx)}
                            className="px-3 py-1.5 bg-indigo-800/80 hover:bg-indigo-700 border border-indigo-600 text-white rounded-lg text-xs font-semibold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            {w}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => {
                            const words = activePhraseOption.phrase.replace(/[.,?!]/g, '').split(/\s+/).filter(Boolean);
                            setPuzzleTokens([...words].sort(() => Math.random() - 0.5));
                            setSelectedPuzzleTokens([]);
                            setIsPuzzleVerified(null);
                          }}
                          className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>

                        <button
                          onClick={handleVerifyPuzzle}
                          disabled={selectedPuzzleTokens.length === 0}
                          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Check Assembly
                        </button>
                      </div>

                      {isPuzzleVerified !== null && (
                        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          isPuzzleVerified
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}>
                          {isPuzzleVerified ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Great job! You assembled the exact natural phrasing.
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4 text-rose-400" /> Word order isn't quite right yet. Keep adjusting!
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setWorkoutStep(3)}
                        className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <span>Next: Write Your Own Variation</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Create Own Variation */}
                {workoutStep === 3 && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-800 space-y-3">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Practice applying this pattern in your own custom sentence:
                      </span>
                      <p className="text-xs text-indigo-200">
                        Target Concept: <em>"{result.concept}"</em>. Write a sentence adapting this phrase for your own life or workplace.
                      </p>

                      <textarea
                        rows={2}
                        value={userCreatedSentence}
                        onChange={(e) => setUserCreatedSentence(e.target.value)}
                        placeholder={`e.g. ${activePhraseOption.phrase}`}
                        className="w-full text-xs p-3 bg-slate-900 border border-indigo-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={handleEvaluateCreatedSentence}
                          disabled={!userCreatedSentence.trim() || isEvaluatingSentence}
                          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          {isEvaluatingSentence ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Evaluating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" /> AI Coach Check
                            </>
                          )}
                        </button>
                      </div>

                      {sentenceEvaluation && (
                        <div className={`p-4 rounded-xl text-xs space-y-2 border ${
                          sentenceEvaluation.isCorrect
                            ? 'bg-emerald-950/80 text-emerald-200 border-emerald-700'
                            : 'bg-rose-950/80 text-rose-200 border-rose-700'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">
                              {sentenceEvaluation.isCorrect ? '✅ Excellent Sentence!' : '💡 Coach Correction:'}
                            </span>
                            <span className="font-bold">Score: {sentenceEvaluation.score}/100</span>
                          </div>
                          <p>{sentenceEvaluation.feedback}</p>
                          {sentenceEvaluation.correctedSentence && (
                            <p className="font-mono text-emerald-300">
                              Better: "{sentenceEvaluation.correctedSentence}"
                            </p>
                          )}
                          <p className="italic text-[11px] opacity-90">{sentenceEvaluation.explanation}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setWorkoutStep(4)}
                        className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <span>Next: Pronounce & Speak</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Speak Aloud */}
                {workoutStep === 4 && (
                  <div className="space-y-4 max-w-2xl mx-auto text-center">
                    <div className="bg-indigo-950/80 p-6 rounded-2xl border border-indigo-800 space-y-4">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Speak the target expression out loud:
                      </span>
                      <p className="text-lg font-bold text-white">
                        "{activePhraseOption.phrase}"
                      </p>

                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => soundService.speak(activePhraseOption.phrase)}
                          className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Listen Model Audio
                        </button>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-3 pt-2">
                        <button
                          onClick={handleToggleSpeech}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all cursor-pointer ${
                            isListening
                              ? 'bg-rose-600 scale-110 animate-pulse ring-8 ring-rose-500/20'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg'
                          }`}
                        >
                          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <span className="text-xs text-indigo-300">
                          {isListening ? 'Listening... Speak now!' : 'Tap microphone to speak'}
                        </span>
                      </div>

                      {spokenTranscript && (
                        <div className="p-3 bg-slate-900 border border-indigo-700 rounded-xl text-xs text-left space-y-1">
                          <span className="text-indigo-400 text-[10px] uppercase font-bold">What we heard:</span>
                          <p className="text-white font-medium">"{spokenTranscript}"</p>
                          {speakingAccuracy !== null && (
                            <p className={`font-bold ${speakingAccuracy >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              Pronunciation Accuracy: {speakingAccuracy}%
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setWorkoutStep(5)}
                        className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <span>Next: Roleplay Dialogue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Simulated Dialogue */}
                {workoutStep === 5 && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-800 space-y-4">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Simulated Context Exchange:
                      </span>

                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-900 rounded-xl border border-indigo-800 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            🤖
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-indigo-300">Conversation Partner:</span>
                            <p className="text-xs text-white mt-0.5">
                              {activeContext === 'dining' ? "Hello! How can I help you today?" : "Hey there! How is everything going?"}
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 bg-indigo-900/60 rounded-xl border border-indigo-700 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                            👤
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-emerald-300">Your Turn (Speak or Read):</span>
                            <p className="text-xs font-bold text-white mt-0.5">
                              "{activePhraseOption.phrase}"
                            </p>
                          </div>
                        </div>

                        {activePhraseOption.sampleDialogue && (
                          <div className="p-3 bg-indigo-900/40 rounded-xl border border-indigo-800 text-xs text-indigo-200 italic">
                            💬 Exchange Pattern: {activePhraseOption.sampleDialogue}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          addXP(30, 'Mastered expression workout!');
                          soundService.playFanfare();
                          setActivePhraseOption(null);
                        }}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <Award className="w-4 h-4" />
                        <span>Complete & Master Expression (+30 XP)</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

