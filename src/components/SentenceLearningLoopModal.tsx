import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Mic,
  MicOff,
  Lightbulb,
  Award,
  BookOpen,
  Layers,
  Send,
  MessageSquare,
  RefreshCw,
  Zap,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  generateCompleteSentenceLoop,
  evaluateSentenceEducational,
  CompleteSentenceLoopData,
  EducationalFeedbackData,
} from '../services/aiService';
import { soundService } from '../services/soundService';
import { speechRecognitionService } from '../services/speechRecognitionService';

interface SentenceLearningLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicOrWord?: string;
  sourceContext?: string;
}

const STAGES = [
  { id: 1, name: 'Learn', icon: BookOpen, title: 'Formula & Structure' },
  { id: 2, name: 'Build', icon: Layers, title: 'Sentence Puzzle' },
  { id: 3, name: 'Explain', icon: Lightbulb, title: 'Why It Works' },
  { id: 4, name: 'Rebuild', icon: RotateCcw, title: 'Memory Assembly' },
  { id: 5, name: 'Expand', icon: Sparkles, title: 'Progressive Expansion' },
  { id: 6, name: 'Transform', icon: RefreshCw, title: 'Grammar Variations' },
  { id: 7, name: 'Create', icon: MessageSquare, title: 'Original Expression' },
  { id: 8, name: 'Speak', icon: Mic, title: 'Pronunciation & Stress' },
  { id: 9, name: 'Talk', icon: Zap, title: 'AI Conversation' },
  { id: 10, name: 'Master', icon: Award, title: 'Review & Retain' },
];

export const SentenceLearningLoopModal: React.FC<SentenceLearningLoopModalProps> = ({
  isOpen,
  onClose,
  initialTopicOrWord = 'discuss',
  sourceContext = 'Dashboard',
}) => {
  const { userProfile, addXP, recordSentenceCompleted, recordSpeakingPractice, addMistakeRecord, resolveMistake } = useApp();

  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loopData, setLoopData] = useState<CompleteSentenceLoopData | null>(null);

  // Stage 2 (Build) State
  const [buildAvailable, setBuildAvailable] = useState<string[]>([]);
  const [buildSelected, setBuildSelected] = useState<string[]>([]);
  const [buildVerified, setBuildVerified] = useState<boolean | null>(null);

  // Stage 4 (Rebuild) State
  const [rebuildAvailable, setRebuildAvailable] = useState<string[]>([]);
  const [rebuildSelected, setRebuildSelected] = useState<string[]>([]);
  const [rebuildVerified, setRebuildVerified] = useState<boolean | null>(null);

  // Stage 5 (Expand) State
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  // Stage 6 (Transform) State
  const [selectedTransformIndex, setSelectedTransformIndex] = useState(0);
  const [transformUserText, setTransformUserText] = useState('');
  const [transformVerified, setTransformVerified] = useState<boolean | null>(null);

  // Stage 7 (Create) State
  const [createdSentence, setCreatedSentence] = useState('');
  const [isEvaluatingCreation, setIsEvaluatingCreation] = useState(false);
  const [creationFeedback, setCreationFeedback] = useState<EducationalFeedbackData | null>(null);

  // Stage 8 (Speak) State
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  // Stage 9 (Conversation) State
  const [userConvoReply, setUserConvoReply] = useState('');
  const [convoChat, setConvoChat] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);

  // Stage 10 (Review) State
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLoopData(initialTopicOrWord);
      setCurrentStage(1);
    }
  }, [isOpen, initialTopicOrWord]);

  const loadLoopData = async (word: string) => {
    setIsLoading(true);
    try {
      const data = await generateCompleteSentenceLoop({
        topicOrWord: word,
        userLevel: userProfile.level,
      });
      setLoopData(data);
      initStageStates(data);
    } catch (err) {
      console.error('Failed to load sentence loop:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initStageStates = (data: CompleteSentenceLoopData) => {
    // Build tokens
    setBuildAvailable([...data.build.jumbledTokens]);
    setBuildSelected([]);
    setBuildVerified(null);

    // Rebuild tokens
    setRebuildAvailable([...data.rebuild.jumbledTokens]);
    setRebuildSelected([]);
    setRebuildVerified(null);

    // Reset others
    setSelectedLayerIndex(0);
    setSelectedTransformIndex(0);
    setTransformUserText('');
    setTransformVerified(null);
    setCreatedSentence('');
    setCreationFeedback(null);
    setSpeechTranscript('');
    setSpeechScore(null);
    setConvoChat([{ role: 'ai', text: data.conversation.aiOpener }]);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  if (!isOpen) return null;

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  // Build handlers
  const handleSelectBuildToken = (token: string, idx: number) => {
    soundService.playPop();
    setBuildSelected([...buildSelected, token]);
    const updated = [...buildAvailable];
    updated.splice(idx, 1);
    setBuildAvailable(updated);
    setBuildVerified(null);
  };

  const handleDeselectBuildToken = (token: string, idx: number) => {
    soundService.playPop();
    const updated = [...buildSelected];
    updated.splice(idx, 1);
    setBuildSelected(updated);
    setBuildAvailable([...buildAvailable, token]);
    setBuildVerified(null);
  };

  const handleVerifyBuild = () => {
    if (!loopData) return;
    const built = buildSelected.join(' ').toLowerCase().replace(/[.,?!]/g, '').trim();
    const target = loopData.build.targetSentence.toLowerCase().replace(/[.,?!]/g, '').trim();

    if (built === target) {
      setBuildVerified(true);
      soundService.playSuccess();
      addXP(15, 'Sentence built correctly');
      recordSentenceCompleted();
    } else {
      setBuildVerified(false);
      soundService.playError();
    }
  };

  // Rebuild handlers
  const handleSelectRebuildToken = (token: string, idx: number) => {
    soundService.playPop();
    setRebuildSelected([...rebuildSelected, token]);
    const updated = [...rebuildAvailable];
    updated.splice(idx, 1);
    setRebuildAvailable(updated);
    setRebuildVerified(null);
  };

  const handleDeselectRebuildToken = (token: string, idx: number) => {
    soundService.playPop();
    const updated = [...rebuildSelected];
    updated.splice(idx, 1);
    setRebuildSelected(updated);
    setRebuildAvailable([...rebuildAvailable, token]);
    setRebuildVerified(null);
  };

  const handleVerifyRebuild = () => {
    if (!loopData) return;
    const built = rebuildSelected.join(' ').toLowerCase().replace(/[.,?!]/g, '').trim();
    const target = loopData.rebuild.targetSentence.toLowerCase().replace(/[.,?!]/g, '').trim();

    if (built === target) {
      setRebuildVerified(true);
      soundService.playSuccess();
      addXP(20, 'Rebuilt sentence from memory');
    } else {
      setRebuildVerified(false);
      soundService.playError();
    }
  };

  // Transform verification
  const handleVerifyTransform = () => {
    if (!loopData) return;
    const target = loopData.transform.transformations[selectedTransformIndex]?.sentence || '';
    const cleanUser = transformUserText.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    if (cleanUser === cleanTarget || cleanUser.includes(cleanTarget)) {
      setTransformVerified(true);
      soundService.playSuccess();
      addXP(20, 'Mastered sentence transformation');
    } else {
      setTransformVerified(false);
      soundService.playError();
    }
  };

  // Create Original Evaluation
  const handleEvaluateCreation = async () => {
    if (!createdSentence.trim()) return;
    setIsEvaluatingCreation(true);
    try {
      const fb = await evaluateSentenceEducational({
        sentence: createdSentence,
        targetConcept: loopData?.targetWordOrTopic,
        userLevel: userProfile.level,
      });
      setCreationFeedback(fb);
      if (fb.score >= 70) {
        soundService.playSuccess();
        addXP(30, 'Created authentic original sentence');
      } else {
        soundService.playPop();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingCreation(false);
    }
  };

  // Speak handler
  const handleToggleSpeech = () => {
    if (!loopData) return;

    if (isListeningSpeech) {
      speechRecognitionService.stopListening();
      setIsListeningSpeech(false);
      return;
    }

    setSpeechTranscript('');
    setSpeechScore(null);

    const started = speechRecognitionService.startListening(
      (res) => {
        setSpeechTranscript(res.transcript);
        if (res.isFinal) {
          setIsListeningSpeech(false);
          const targetClean = loopData.speak.sentence.toLowerCase().replace(/[^a-z0-9 ]/g, '');
          const spokenClean = res.transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '');
          const targetWords = targetClean.split(' ');
          const spokenWords = spokenClean.split(' ');
          const matched = targetWords.filter((w) => spokenWords.includes(w)).length;
          const score = Math.round((matched / Math.max(targetWords.length, 1)) * 100);
          setSpeechScore(score);
          if (score >= 70) {
            soundService.playSuccess();
            addXP(25, 'Spoke sentence with clear fluency');
            recordSpeakingPractice(1);
          } else {
            soundService.playError();
          }
        }
      },
      () => {
        setIsListeningSpeech(false);
      },
      () => {
        setIsListeningSpeech(false);
      }
    );

    if (started) {
      setIsListeningSpeech(true);
    }
  };

  // Conversation turn
  const handleSendConvoTurn = (textToSend?: string) => {
    const message = textToSend || userConvoReply.trim();
    if (!message) return;

    const newChat = [...convoChat, { role: 'user' as const, text: message }];
    setConvoChat(newChat);
    setUserConvoReply('');
    soundService.playPop();

    // AI follow up response
    setTimeout(() => {
      newChat.push({
        role: 'ai',
        text: `Excellent usage! Using "${loopData?.targetWordOrTopic}" naturally in conversation helps you express thoughts without hesitation. Let's finish your mastery review!`,
      });
      setConvoChat([...newChat]);
      soundService.playSuccess();
      addXP(20, 'Completed communicative dialogue turn');
    }, 900);
  };

  // Quiz submission
  const handleSelectQuiz = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(idx);
    setQuizSubmitted(true);

    if (idx === loopData?.review.quizQuestion.correctIndex) {
      soundService.playFanfare();
      addXP(50, 'Mastered Complete Sentence Loop!');
    } else {
      soundService.playError();
      if (loopData) {
        addMistakeRecord({
          originalSentence: loopData.review.quizQuestion.options[idx],
          correctedSentence: loopData.review.quizQuestion.options[loopData.review.quizQuestion.correctIndex],
          explanation: loopData.review.quizQuestion.explanation,
          category: 'Sentence structure',
          sourceLesson: `Sentence Loop: ${loopData.targetWordOrTopic}`,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
              🔄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                  Complete Sentence Learning Loop
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  Target: {loopData?.targetWordOrTopic || initialTopicOrWord}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10-stage progression from word knowledge to natural conversational usage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 10-Stage Progress Stepper Bar */}
        <div className="px-5 sm:px-8 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {STAGES.map((stg) => {
            const Icon = stg.icon;
            const isDone = stg.id < currentStage;
            const isCurrent = stg.id === currentStage;
            return (
              <button
                key={stg.id}
                onClick={() => setCurrentStage(stg.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDone
                    ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 opacity-60 hover:opacity-100'
                }`}
              >
                {isDone ? <Check size={12} className="stroke-[3]" /> : <Icon size={12} />}
                <span>{stg.id}. {stg.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {isLoading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Generating Complete 10-Stage Learning Loop for "{initialTopicOrWord}"...
              </p>
            </div>
          ) : !loopData ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Failed to load learning loop data.</p>
              <button
                onClick={() => loadLoopData(initialTopicOrWord)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
              >
                Retry
              </button>
            </div>
          ) : (
            <div>
              {/* STAGE 1: LEARN */}
              {currentStage === 1 && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 dark:bg-indigo-950/40 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        Target Formula
                      </span>
                      <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        {loopData.formula}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                        "{loopData.learn.sentence}"
                      </p>
                      <button
                        onClick={() => playAudio(loopData.learn.sentence)}
                        className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-transform active:scale-95 shadow-sm"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      💡 Meaning: {loopData.learn.meaning}
                    </p>
                  </div>

                  {/* Syntactic Breakdown */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <Layers size={16} className="text-indigo-600" />
                      <span>Syntactic Structural Breakdown</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {loopData.learn.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                              {item.component}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {item.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {item.roleExplanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: BUILD */}
              {currentStage === 2 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                      STEP 2: ARRANGE THE SENTENCE
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {loopData.build.prompt}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                      💡 Hint: {loopData.build.hint}
                    </p>
                  </div>

                  {/* Selected Assembly Area */}
                  <div className="min-h-[100px] p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center gap-2">
                    {buildSelected.length === 0 ? (
                      <span className="text-sm text-slate-400 dark:text-slate-500">
                        Click words below to assemble the complete sentence in order...
                      </span>
                    ) : (
                      buildSelected.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDeselectBuildToken(word, idx)}
                          className="px-3.5 py-2 rounded-xl font-bold text-sm bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-transform active:scale-95"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Pool */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {buildAvailable.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectBuildToken(word, idx)}
                        className="px-3.5 py-2 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-500 transition-transform active:scale-95 shadow-xs"
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                  {/* Check Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setBuildAvailable([...loopData.build.jumbledTokens]);
                        setBuildSelected([]);
                        setBuildVerified(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>

                    <button
                      onClick={handleVerifyBuild}
                      disabled={buildSelected.length === 0}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Check Sentence</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {buildVerified !== null && (
                    <div
                      className={`p-4 rounded-2xl flex items-center gap-3 ${
                        buildVerified
                          ? 'bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {buildVerified ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      <span className="font-bold text-sm">
                        {buildVerified
                          ? 'Perfect sentence structure! Ready for the grammatical explanation.'
                          : 'Not quite right yet. Check word order and try again.'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3: EXPLAIN */}
              {currentStage === 3 && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800/50 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                      <Lightbulb size={18} />
                      <span>THE CORE RULE</span>
                    </div>
                    <p className="text-base font-semibold text-emerald-950 dark:text-emerald-100">
                      {loopData.explain.coreRule}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 space-y-2">
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-tight">
                        ⚠️ Common Pitfall To Avoid
                      </p>
                      <p className="text-sm font-medium text-rose-900 dark:text-rose-200">
                        {loopData.explain.commonMistake}
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 space-y-2">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-tight">
                        🧠 Why Native Speakers Say This
                      </p>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        {loopData.explain.whyItWorks}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 4: REBUILD */}
              {currentStage === 4 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                      STEP 4: RECALL & REBUILD FROM MEMORY
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {loopData.rebuild.prompt}
                    </p>
                  </div>

                  <div className="min-h-[90px] p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center gap-2">
                    {rebuildSelected.length === 0 ? (
                      <span className="text-sm text-slate-400">
                        Assemble the sentence from memory without hints...
                      </span>
                    ) : (
                      rebuildSelected.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDeselectRebuildToken(word, idx)}
                          className="px-3.5 py-2 rounded-xl font-bold text-sm bg-purple-600 text-white shadow-xs hover:bg-purple-700"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {rebuildAvailable.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectRebuildToken(word, idx)}
                        className="px-3.5 py-2 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-500"
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setRebuildAvailable([...loopData.rebuild.jumbledTokens]);
                        setRebuildSelected([]);
                        setRebuildVerified(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>

                    <button
                      onClick={handleVerifyRebuild}
                      disabled={rebuildSelected.length === 0}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md flex items-center gap-2"
                    >
                      <span>Verify Memory Recall</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {rebuildVerified !== null && (
                    <div
                      className={`p-4 rounded-2xl flex items-center gap-3 ${
                        rebuildVerified
                          ? 'bg-green-50 dark:bg-green-950/40 border border-green-200 text-green-800 dark:text-green-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {rebuildVerified ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      <span className="font-bold text-sm">
                        {rebuildVerified
                          ? 'Excellent memory recall! Now let’s expand this sentence into 10 progressive layers.'
                          : 'Almost there! Take another look and rebuild.'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 5: EXPAND */}
              {currentStage === 5 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        10-LAYER PROGRESSIVE EXPANSION
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Watch how a 2-word sentence grows into a rich, natural English sentence.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950/80 rounded-full text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                      Layer {selectedLayerIndex + 1} of {loopData.expand.layers.length}
                    </span>
                  </div>

                  {/* Active Layer Big Display */}
                  {loopData.expand.layers[selectedLayerIndex] && (
                    <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-extrabold">
                          {loopData.expand.layers[selectedLayerIndex].name}
                        </span>
                        <button
                          onClick={() => playAudio(loopData.expand.layers[selectedLayerIndex].sentence)}
                          className="p-2 bg-white dark:bg-slate-800 rounded-xl text-indigo-600 hover:bg-indigo-50 shadow-xs"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>

                      <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                        "{loopData.expand.layers[selectedLayerIndex].sentence}"
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                        <span>Added Element:</span>
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800">
                          {loopData.expand.layers[selectedLayerIndex].addedPart} ({loopData.expand.layers[selectedLayerIndex].role})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Layer Pills Nav */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {loopData.expand.layers.map((layer, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedLayerIndex(idx)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          selectedLayerIndex === idx
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-80">Layer {idx + 1}</div>
                        <div className="text-xs font-extrabold truncate">{layer.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STAGE 6: TRANSFORM */}
              {currentStage === 6 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      GRAMMAR TRANSFORMATION GYM
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Base Sentence: <strong>"{loopData.transform.baseSentence}"</strong>
                    </p>
                  </div>

                  {/* Variations grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {loopData.transform.transformations.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTransformIndex(idx);
                          setTransformUserText('');
                          setTransformVerified(null);
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          selectedTransformIndex === idx
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{t.type}</div>
                        <div className="text-[10px] opacity-80 truncate">{t.formula}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active transformation challenge */}
                  {loopData.transform.transformations[selectedTransformIndex] && (
                    <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-purple-900 dark:text-purple-200">
                          Transform to: {loopData.transform.transformations[selectedTransformIndex].type}
                        </span>
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                          Rule: {loopData.transform.transformations[selectedTransformIndex].rule}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={transformUserText}
                        onChange={(e) => {
                          setTransformUserText(e.target.value);
                          setTransformVerified(null);
                        }}
                        placeholder={`Type the ${loopData.transform.transformations[selectedTransformIndex].type.toLowerCase()} version here...`}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                      />

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setTransformUserText(loopData.transform.transformations[selectedTransformIndex].sentence)}
                          className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline"
                        >
                          Reveal Target Answer
                        </button>

                        <button
                          onClick={handleVerifyTransform}
                          disabled={!transformUserText.trim()}
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          <span>Verify Transformation</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>

                      {transformVerified !== null && (
                        <div
                          className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold ${
                            transformVerified
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {transformVerified ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          <span>
                            {transformVerified
                              ? `Correct: "${loopData.transform.transformations[selectedTransformIndex].sentence}"`
                              : `Target is: "${loopData.transform.transformations[selectedTransformIndex].sentence}"`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 7: CREATE ORIGINAL */}
              {currentStage === 7 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      STEP 7: EXPRESS YOUR OWN THOUGHTS
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {loopData.create.prompt}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Context: {loopData.create.context}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-500 self-center">Starters:</span>
                    {loopData.create.suggestedStarters.map((st, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCreatedSentence((prev) => (prev ? `${prev} ${st}` : st))}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={createdSentence}
                      onChange={(e) => setCreatedSentence(e.target.value)}
                      placeholder="Write your original sentence here..."
                      className="w-full p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />

                    <button
                      onClick={handleEvaluateCreation}
                      disabled={!createdSentence.trim() || isEvaluatingCreation}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isEvaluatingCreation ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>AI Educator Diagnosing Sentence...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Evaluate with Educational Feedback</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Feedback Box */}
                  {creationFeedback && (
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                        <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                          Educational Feedback ({creationFeedback.score}/100)
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            creationFeedback.status === 'natural'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {creationFeedback.status}
                        </span>
                      </div>

                      {/* GOOD */}
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">
                          ✅ What You Did Well
                        </p>
                        <ul className="text-xs text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
                          {creationFeedback.goodPoints.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>

                      {/* IMPROVE */}
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-1">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
                          🎯 Priority Focus: {creationFeedback.priorityImprovement.rule}
                        </p>
                        <p className="text-xs text-amber-900 dark:text-amber-200">
                          {creationFeedback.priorityImprovement.explanation}
                        </p>
                      </div>

                      {/* BETTER VERSION */}
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 space-y-1">
                        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                          ✨ Recommended Natural Version
                        </p>
                        <p className="text-sm font-extrabold text-indigo-900 dark:text-indigo-100">
                          "{creationFeedback.betterVersion}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 8: SPEAK */}
              {currentStage === 8 && (
                <div className="space-y-6 text-center">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      STEP 8: SPEAKING PRACTICE & STRESS PATTERN
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Speak this sentence clearly. Listen first to hear the rhythm and stress.
                    </p>
                  </div>

                  <div className="p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800 space-y-4">
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                      "{loopData.speak.sentence}"
                    </p>
                    <p className="text-xs font-mono text-indigo-600 dark:text-indigo-300 tracking-wide">
                      Stress Rhythm: {loopData.speak.stressPattern}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      💡 Phonetic Tip: {loopData.speak.phoneticTip}
                    </p>

                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => playAudio(loopData.speak.sentence)}
                        className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 text-indigo-600 rounded-2xl font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 shadow-xs"
                      >
                        <Volume2 size={16} />
                        <span>Listen to Native Voice</span>
                      </button>

                      <button
                        onClick={handleToggleSpeech}
                        className={`px-6 py-2.5 rounded-2xl font-bold text-xs text-white shadow-md flex items-center gap-2 transition-all ${
                          isListeningSpeech
                            ? 'bg-rose-600 animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isListeningSpeech ? <MicOff size={16} /> : <Mic size={16} />}
                        <span>{isListeningSpeech ? 'Listening... Speak Now' : 'Record My Speech'}</span>
                      </button>
                    </div>
                  </div>

                  {speechTranscript && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Heard: "{speechTranscript}"</span>
                        {speechScore !== null && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              speechScore >= 70
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Score: {speechScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 9: CONVERSATION */}
              {currentStage === 9 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      STEP 9: REAL-LIFE CONVERSATION APPLICATION
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {loopData.conversation.contextDescription}
                    </p>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-3 min-h-[160px] max-h-[260px] overflow-y-auto p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    {convoChat.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {m.role === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                            🤖
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[80%] ${
                            m.role === 'user'
                              ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick suggested chips */}
                  <div className="flex flex-wrap gap-2">
                    {loopData.conversation.suggestedResponses.map((res, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendConvoTurn(res)}
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        {res}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userConvoReply}
                      onChange={(e) => setUserConvoReply(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendConvoTurn()}
                      placeholder="Type your reply to Alex..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      onClick={() => handleSendConvoTurn()}
                      disabled={!userConvoReply.trim()}
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl transition-all shadow-sm"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 10: REVIEW & SRS */}
              {currentStage === 10 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-3xl border border-amber-200 dark:border-amber-800/50 space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                      <Award size={16} />
                      <span>Takeaway Memory Card</span>
                    </div>
                    <p className="text-base font-bold text-amber-950 dark:text-amber-100">
                      {loopData.review.takeawayCard}
                    </p>
                  </div>

                  {/* Final Mastery Quiz */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Final Mastery Check
                    </p>
                    <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {loopData.review.quizQuestion.question}
                    </p>

                    <div className="space-y-2">
                      {loopData.review.quizQuestion.options.map((opt, idx) => {
                        const isSelected = selectedQuizOption === idx;
                        const isCorrect = idx === loopData.review.quizQuestion.correctIndex;
                        let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-500';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-green-500 text-white border-green-500 font-bold';
                          } else if (isSelected) {
                            btnStyle = 'bg-rose-500 text-white border-rose-500 font-bold';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectQuiz(idx)}
                            disabled={quizSubmitted}
                            className={`w-full p-3.5 rounded-2xl text-left border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 size={16} />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-xs font-medium border border-indigo-100 dark:border-indigo-800">
                        {loopData.review.quizQuestion.explanation}
                      </div>
                    )}
                  </div>

                  {quizSubmitted && (
                    <div className="text-center pt-2">
                      <button
                        onClick={onClose}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95"
                      >
                        Complete Loop & Return to App (+50 XP)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:px-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <button
            onClick={() => setCurrentStage((prev) => Math.max(1, prev - 1))}
            disabled={currentStage === 1}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-colors"
          >
            ← Previous Stage
          </button>

          <div className="text-xs font-extrabold text-slate-500">
            Stage {currentStage} / {STAGES.length}
          </div>

          <button
            onClick={() => {
              if (currentStage < STAGES.length) {
                setCurrentStage((prev) => prev + 1);
              } else {
                onClose();
              }
            }}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>{currentStage === STAGES.length ? 'Finish Loop' : 'Next Stage'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
