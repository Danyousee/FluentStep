import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  Volume2,
  ArrowRight,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  Award,
  Mic,
  MicOff,
  Zap,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  expandSentenceWithAI,
  transformSentenceWithAI,
  SentenceExpansionResponseData,
  SentenceTransformationResponseData,
} from '../services/aiService';
import { soundService } from '../services/soundService';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { SentenceLearningLoopModal } from '../components/SentenceLearningLoopModal';

const PRESET_EXPANSIONS = [
  { subject: 'I', verb: 'learn', object: 'English' },
  { subject: 'She', verb: 'drinks', object: 'coffee' },
  { subject: 'They', verb: 'play', object: 'football' },
  { subject: 'David', verb: 'reads', object: 'books' },
  { subject: 'We', verb: 'cook', object: 'dinner' },
  { subject: 'The team', verb: 'builds', object: 'software' },
];

const PRESET_TRANSFORMATIONS = [
  'I study English every day.',
  'She works at the hospital.',
  'They travel to London by train.',
  'He drinks tea in the morning.',
  'The manager approved the budget.',
  'We need your help with the project.',
];

const COMPONENT_TAGS = [
  { role: 'Subject', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-900', desc: 'Who or what performs the action' },
  { role: 'Verb', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900', desc: 'Action or state' },
  { role: 'Object', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900', desc: 'Who or what receives the action' },
  { role: 'Place', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900', desc: 'Where the action happens (in, at, on)' },
  { role: 'Time', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-900', desc: 'When the action happens' },
  { role: 'Frequency', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-200 dark:border-orange-900', desc: 'How often (always, usually, never)' },
  { role: 'Reason', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900', desc: 'Why it happens (because, in order to)' },
  { role: 'Condition', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900', desc: 'Under what circumstances (if, when)' },
];

export const SentenceExpansionView: React.FC = () => {
  const { addXP, recordSentenceCompleted, recordSpeakingPractice } = useApp();
  const [activeTab, setActiveTab] = useState<'expand' | 'transform' | 'anatomy'>('expand');

  // Expander State
  const [customSubject, setCustomSubject] = useState('I');
  const [customVerb, setCustomVerb] = useState('study');
  const [customObject, setCustomObject] = useState('English');
  const [isExpanding, setIsExpanding] = useState(false);
  const [expansionResult, setExpansionResult] = useState<SentenceExpansionResponseData | null>(null);

  // Interactive step builder mode
  const [interactiveStep, setInteractiveStep] = useState<number | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [isStepVerified, setIsStepVerified] = useState<boolean | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Speech Practice State
  const [recordingStep, setRecordingStep] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speechMatchScore, setSpeechMatchScore] = useState<number | null>(null);

  // Transformer State
  const [baseSentence, setBaseSentence] = useState('I study English every day.');
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationResult, setTransformationResult] = useState<SentenceTransformationResponseData | null>(null);
  const [activePracticeIndex, setActivePracticeIndex] = useState<number | null>(null);
  const [userTransformedInput, setUserTransformedInput] = useState('');
  const [transformationVerified, setTransformationVerified] = useState<boolean | null>(null);

  // 10-Stage Complete Sentence Learning Loop
  const [sentenceLoopOpen, setSentenceLoopOpen] = useState(false);
  const [loopTargetWord, setLoopTargetWord] = useState('study');

  const handleRunExpansion = async (s?: string, v?: string, o?: string) => {
    const sub = s || customSubject.trim();
    const vrb = v || customVerb.trim();
    const obj = o || customObject.trim();
    if (!sub || !vrb) return;

    setIsExpanding(true);
    setInteractiveStep(null);
    setIsStepVerified(null);
    try {
      const data = await expandSentenceWithAI({
        baseSubject: sub,
        baseVerb: vrb,
        baseObject: obj,
      });
      setExpansionResult(data);
      addXP(15, 'Expanded English sentence structure step-by-step');
      recordSentenceCompleted();
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleRunTransformation = async (sent?: string) => {
    const s = sent || baseSentence.trim();
    if (!s) return;

    setIsTransforming(true);
    setActivePracticeIndex(null);
    setTransformationVerified(null);
    setUserTransformedInput('');
    try {
      const data = await transformSentenceWithAI(s);
      setTransformationResult(data);
      addXP(15, 'Practiced grammar sentence transformations');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleStartStepInteractive = (stepNumber: number) => {
    if (!expansionResult) return;
    const step = expansionResult.steps.find((s) => s.stepNumber === stepNumber);
    if (!step) return;

    setInteractiveStep(stepNumber);
    setIsStepVerified(null);
    setSelectedTokens([]);
    setHintLevel(0);

    // Split words and shuffle
    const cleanWords = step.sentence.replace(/[.,?!]/g, '').split(/\s+/).filter(Boolean);
    const shuffled = [...cleanWords].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    soundService.playClick();
  };

  const handleSelectToken = (token: string, index: number) => {
    soundService.playPop();
    setSelectedTokens([...selectedTokens, token]);
    const updated = [...availableTokens];
    updated.splice(index, 1);
    setAvailableTokens(updated);
    setIsStepVerified(null);
  };

  const handleDeselectToken = (token: string, index: number) => {
    soundService.playPop();
    const updatedSelected = [...selectedTokens];
    updatedSelected.splice(index, 1);
    setSelectedTokens(updatedSelected);
    setAvailableTokens([...availableTokens, token]);
    setIsStepVerified(null);
  };

  const handleVerifyStepTokens = (targetSentence: string) => {
    const built = selectedTokens.join(' ').toLowerCase().trim();
    const cleanTarget = targetSentence.replace(/[.,?!]/g, '').toLowerCase().trim();

    if (built === cleanTarget) {
      setIsStepVerified(true);
      soundService.playSuccess();
      addXP(10, 'Completed progressive sentence assembly!');
    } else {
      setIsStepVerified(false);
      soundService.playError();
    }
  };

  const handleToggleVoicePractice = (stepNumber: number, targetSentence: string) => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      setRecordingStep(null);
      return;
    }

    setRecordingStep(stepNumber);
    setSpokenTranscript('');
    setSpeechMatchScore(null);

    const started = speechRecognitionService.startListening(
      (res) => {
        setSpokenTranscript(res.transcript);
        if (res.isFinal) {
          setIsListening(false);
          // Calculate similarity
          const targetClean = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '');
          const spokenClean = res.transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '');
          const targetWords = targetClean.split(' ');
          const spokenWords = spokenClean.split(' ');
          const matched = targetWords.filter((w) => spokenWords.includes(w)).length;
          const score = Math.round((matched / Math.max(targetWords.length, 1)) * 100);
          setSpeechMatchScore(score);
          if (score >= 70) {
            soundService.playSuccess();
            addXP(15, 'Clear sentence pronunciation');
            recordSpeakingPractice(1);
          } else {
            soundService.playError();
          }
        }
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsListening(false);
        setRecordingStep(null);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleCheckTransformation = (target: string) => {
    const cleanUser = userTransformedInput.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    if (cleanUser === cleanTarget || cleanUser.includes(cleanTarget)) {
      setTransformationVerified(true);
      soundService.playSuccess();
      addXP(20, 'Mastered sentence transformation rule!');
    } else {
      setTransformationVerified(false);
      soundService.playError();
    }
  };

  return (
    <div id="sentence-expansion-container" className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sentence-Building Engine & Gym</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Learn to think in English by building 5 progressive structural layers and mastering 10+ sentence transformations.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('expand');
                if (!expansionResult) handleRunExpansion();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'expand'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              5-Layer Expander
            </button>
            <button
              onClick={() => {
                setActiveTab('transform');
                if (!transformationResult) handleRunTransformation();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transform'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Transformation Studio
            </button>
            <button
              onClick={() => setActiveTab('anatomy')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'anatomy'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Anatomy Matrix
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'expand' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Choose or Type a Base Sentence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Subject (Who)
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g. I, She, The engineer"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Verb (Action)
                </label>
                <input
                  type="text"
                  value={customVerb}
                  onChange={(e) => setCustomVerb(e.target.value)}
                  placeholder="e.g. study, cook, present"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  Object (What)
                </label>
                <input
                  type="text"
                  value={customObject}
                  onChange={(e) => setCustomObject(e.target.value)}
                  placeholder="e.g. English, dinner, reports"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-slate-400 mr-1">Presets:</span>
                {PRESET_EXPANSIONS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCustomSubject(preset.subject);
                      setCustomVerb(preset.verb);
                      setCustomObject(preset.object);
                      handleRunExpansion(preset.subject, preset.verb, preset.object);
                    }}
                    className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.subject} + {preset.verb} + {preset.object}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleRunExpansion()}
                disabled={isExpanding}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {isExpanding ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Expanding...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Expand to 5 Layers
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expansion Result Steps */}
          {expansionResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  5 Progressive Layers for: <span className="text-indigo-600 dark:text-indigo-400">{expansionResult.title}</span>
                </h3>
                <span className="text-xs text-slate-400">Click "Build Yourself" on any step to practice interactive token assembly</span>
              </div>

              <div className="space-y-4">
                {expansionResult.steps.map((step) => {
                  let stepBadgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900';
                  if (step.stepNumber === 2) stepBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
                  if (step.stepNumber === 3) stepBadgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900';
                  if (step.stepNumber === 4) stepBadgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
                  if (step.stepNumber === 5) stepBadgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900';

                  const isCurrentInteractive = interactiveStep === step.stepNumber;
                  const isCurrentRecording = recordingStep === step.stepNumber;

                  return (
                    <motion.div
                      key={step.stepNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: step.stepNumber * 0.06 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${stepBadgeColor}`}>
                            Level {step.stepNumber}: {step.structureName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            + Added: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">"{step.addedComponent}"</strong> ({step.componentRole})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => soundService.speak(step.sentence)}
                            className="p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                            title="Listen"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleVoicePractice(step.stepNumber, step.sentence)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isCurrentRecording && isListening
                                ? 'bg-rose-600 text-white animate-pulse'
                                : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                            }`}
                            title="Practice Speaking"
                          >
                            <Mic className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartStepInteractive(step.stepNumber)}
                            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                              isCurrentInteractive
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                            }`}
                          >
                            {isCurrentInteractive ? 'Interactive Active' : 'Build Yourself'}
                          </button>
                        </div>
                      </div>

                      {/* Display Sentence */}
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          "{step.sentence}"
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                          💡 {step.explanation}
                        </p>
                      </div>

                      {/* Interactive Token Assembly Drawer */}
                      {isCurrentInteractive && (
                        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-amber-500" /> Assemble the sentence tokens in order:
                            </span>
                            <button
                              onClick={() => setHintLevel((h) => Math.min(h + 1, 3))}
                              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <HelpCircle className="w-3.5 h-3.5" /> Hint {hintLevel > 0 ? `(${hintLevel}/3)` : ''}
                            </button>
                          </div>

                          {hintLevel > 0 && (
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                              {hintLevel === 1 && `Hint 1: First word starts with "${step.sentence.split(' ')[0]}"`}
                              {hintLevel === 2 && `Hint 2: Structure formula is: ${step.structureName}`}
                              {hintLevel === 3 && `Hint 3: Full target is: "${step.sentence}"`}
                            </div>
                          )}

                          {/* Selected Slots */}
                          <div className="min-h-[48px] p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl flex flex-wrap gap-2 items-center">
                            {selectedTokens.length === 0 ? (
                              <span className="text-xs text-slate-400 italic">Click words below to arrange them here...</span>
                            ) : (
                              selectedTokens.map((token, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleDeselectToken(token, idx)}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-transform active:scale-95 cursor-pointer shadow-2xs"
                                >
                                  {token}
                                </button>
                              ))
                            )}
                          </div>

                          {/* Available Word Chips */}
                          <div className="flex flex-wrap gap-2">
                            {availableTokens.map((token, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSelectToken(token, idx)}
                                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              >
                                {token}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={() => handleStartStepInteractive(step.stepNumber)}
                              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Reset Tokens
                            </button>

                            <button
                              onClick={() => handleVerifyStepTokens(step.sentence)}
                              disabled={selectedTokens.length === 0}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" /> Check Assembly
                            </button>
                          </div>

                          {isStepVerified !== null && (
                            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                              isStepVerified
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            }`}>
                              {isStepVerified ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Perfect! Correctly assembled Level {step.stepNumber} sentence (+10 XP).
                                </>
                              ) : (
                                <>
                                  <HelpCircle className="w-4 h-4 text-rose-600" /> Word order isn't quite right yet. Try rearranging your tokens or check the hint!
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Speech Recording Feedback */}
                      {isCurrentRecording && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-300">
                              {isListening ? '🎙️ Listening... Speak the sentence now' : 'Speech Transcript'}
                            </span>
                            {speechMatchScore !== null && (
                              <span className={speechMatchScore >= 70 ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>
                                Accuracy: {speechMatchScore}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 italic">
                            "{spokenTranscript || 'Speak into your microphone...'}"
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transform' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Enter Any English Sentence to Transform
            </h2>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={baseSentence}
                onChange={(e) => setBaseSentence(e.target.value)}
                placeholder="e.g. I study English every day."
                className="flex-1 p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleRunTransformation()}
              />
              <button
                onClick={() => handleRunTransformation()}
                disabled={isTransforming || !baseSentence.trim()}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {isTransforming ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" />
                    Generate 10+ Transformations
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1">Presets:</span>
              {PRESET_TRANSFORMATIONS.map((sent, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBaseSentence(sent);
                    handleRunTransformation(sent);
                  }}
                  className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  "{sent}"
                </button>
              ))}
            </div>
          </div>

          {/* Transformation Results */}
          {transformationResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Transformations for: <span className="text-indigo-600 dark:text-indigo-400">"{transformationResult.baseSentence}"</span>
                </h3>
                <span className="text-xs text-slate-400">Click "Test Yourself" on any card to practice transforming manually</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transformationResult.transformations.map((item, i) => {
                  const isPracticingThis = activePracticeIndex === i;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                            {item.type}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => soundService.speak(item.transformedSentence)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg cursor-pointer"
                              title="Listen"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (isPracticingThis) {
                                  setActivePracticeIndex(null);
                                } else {
                                  setActivePracticeIndex(i);
                                  setUserTransformedInput('');
                                  setTransformationVerified(null);
                                }
                              }}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                isPracticingThis
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {isPracticingThis ? 'Close Test' : 'Test Yourself'}
                            </button>
                          </div>
                        </div>

                        {!isPracticingThis ? (
                          <>
                            <p className="text-base font-bold text-slate-900 dark:text-white">
                              "{item.transformedSentence}"
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {item.ruleExplanation}
                            </p>
                          </>
                        ) : (
                          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                            <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-200">
                              Transform: <em>"{transformationResult.baseSentence}"</em> into <strong>{item.type}</strong>
                            </label>
                            <input
                              type="text"
                              value={userTransformedInput}
                              onChange={(e) => setUserTransformedInput(e.target.value)}
                              placeholder="Type your transformed sentence..."
                              className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                              onKeyDown={(e) => e.key === 'Enter' && handleCheckTransformation(item.transformedSentence)}
                            />
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={() => handleCheckTransformation(item.transformedSentence)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                              >
                                Check
                              </button>
                            </div>
                            {transformationVerified !== null && (
                              <p className={`text-xs font-semibold ${transformationVerified ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {transformationVerified
                                  ? '🎉 Excellent! That is the correct transformed sentence (+20 XP).'
                                  : `Not quite. Correct target: "${item.transformedSentence}"`}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          Formula: {item.formula}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'anatomy' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                The Anatomy of an English Sentence
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                English is a positional language. Understanding where each building block belongs gives you the confidence to formulate unlimited natural sentences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMPONENT_TAGS.map((tag, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${tag.color} flex items-start gap-3 shadow-2xs`}
                >
                  <div className="p-2 bg-white dark:bg-slate-900/60 rounded-xl font-bold text-xs shrink-0 shadow-2xs">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{tag.role}</h3>
                    <p className="text-xs opacity-90 mt-0.5">{tag.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                The Golden Formula: S + V + O + P + T + R
              </h3>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                "Subject + Verb + Object + Place + Time + Reason"
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Example: <em>"I (S) study (V) English (O) at the library (P) every Saturday morning (T) because I want to advance my career (R)."</em>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 10-Stage Complete Sentence Learning Loop Modal */}
      <SentenceLearningLoopModal
        isOpen={sentenceLoopOpen}
        onClose={() => setSentenceLoopOpen(false)}
        initialTopicOrWord={loopTargetWord}
        sourceContext="SentenceExpansion"
      />
    </div>
  );
};

