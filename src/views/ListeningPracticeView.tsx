import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LISTENING_PASSAGES } from '../data/listeningData';
import { ListeningPassage } from '../types';
import { generateListeningPassageWithAI } from '../services/aiService';
import { soundService } from '../services/soundService';

export const ListeningPracticeView: React.FC = () => {
  const { userProfile, addXP, completeListeningPassage, userStats } = useApp();
  const [selectedPassage, setSelectedPassage] = useState<ListeningPassage>(LISTENING_PASSAGES[0]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // AI custom generator
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlayAudio = () => {
    if (isPlaying) {
      soundService.stopAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundService.speak(selectedPassage.passageText);
      // Listen for when speech finishes or reset after duration estimate
    }
  };

  const handleOptionSelect = (qId: string, optIndex: number) => {
    if (isQuizSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleCheckQuiz = () => {
    if (isQuizSubmitted) return;
    setIsQuizSubmitted(true);

    let correctCount = 0;
    selectedPassage.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correctCount++;
    });

    setScore(correctCount);
    if (correctCount === selectedPassage.questions.length) {
      soundService.playFanfare();
      addXP(50, `Aced listening comprehension: ${selectedPassage.title}`);
      completeListeningPassage(selectedPassage.id);
    } else {
      soundService.playSuccess();
      addXP(25, `Completed listening comprehension: ${selectedPassage.title}`);
      completeListeningPassage(selectedPassage.id);
    }
  };

  const handleGenerateCustom = async () => {
    if (!customTopic.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const generated = await generateListeningPassageWithAI(customTopic.trim(), userProfile.level);
      setSelectedPassage(generated);
      setShowTranscript(false);
      setAnswers({});
      setIsQuizSubmitted(false);
      setCustomTopic('');
      addXP(15, 'Generated custom AI listening audio passage');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="listening-practice-container" className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Listening Comprehension Hub</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Train your ear to natural spoken English pacing, rhythm, and everyday vocabulary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Generate AI audio on topic..."
              className="text-xs p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustom()}
            />
            <button
              onClick={handleGenerateCustom}
              disabled={isGenerating || !customTopic.trim()}
              className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : 'Create'}
            </button>
          </div>
        </div>

        {/* Passage Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {LISTENING_PASSAGES.map((lp) => {
            const isCompleted = userStats.listeningCompleted?.includes(lp.id);
            return (
              <button
                key={lp.id}
                onClick={() => {
                  setSelectedPassage(lp);
                  setShowTranscript(false);
                  setAnswers({});
                  setIsQuizSubmitted(false);
                }}
                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedPassage.id === lp.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lp.title}
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Player Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              {selectedPassage.level} • {selectedPassage.topic}
            </span>
            <h2 className="text-2xl font-bold mt-1">{selectedPassage.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900/80 hover:bg-indigo-800 rounded-xl text-xs font-medium text-indigo-200 transition-colors border border-indigo-700"
            >
              {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showTranscript ? 'Hide Transcript' : 'Reveal Transcript'}
            </button>

            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold text-sm shadow-md transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Audio' : 'Play Audio'}
            </button>
          </div>
        </div>

        {/* Transcript Drawer */}
        {showTranscript ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-5 bg-slate-950/80 border border-indigo-900 rounded-2xl text-sm leading-relaxed text-slate-200 font-serif"
          >
            "{selectedPassage.passageText}"
          </motion.div>
        ) : (
          <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-900/50 text-center text-xs text-indigo-300">
            🎧 Listen carefully to the spoken passage first before revealing the written transcript!
          </div>
        )}

        {/* Key Vocabulary Highlights */}
        {selectedPassage.keyVocabulary && selectedPassage.keyVocabulary.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-2">
              Key Vocabulary to Listen For:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {selectedPassage.keyVocabulary.map((kv, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs"
                >
                  <span className="font-bold text-white block">{kv.word}</span>
                  <span className="text-indigo-300 text-[11px]">{kv.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comprehension Questions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Comprehension Questions ({selectedPassage.questions.length})
          </h3>
          {isQuizSubmitted && (
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              Score: {score} / {selectedPassage.questions.length}
            </span>
          )}
        </div>

        <div className="space-y-6">
          {selectedPassage.questions.map((q, qIndex) => (
            <div key={q.id} className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {qIndex + 1}. {q.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = answers[q.id] === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  let optClass = 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400';

                  if (isQuizSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected) {
                      optClass = 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else {
                      optClass = 'opacity-50 border-transparent';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-900 dark:text-blue-200 font-semibold';
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleOptionSelect(q.id, optIndex)}
                      disabled={isQuizSubmitted}
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${optClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isQuizSubmitted && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleCheckQuiz}
            disabled={isQuizSubmitted || Object.keys(answers).length < selectedPassage.questions.length}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm transition-colors shadow-xs"
          >
            {isQuizSubmitted ? 'Submitted' : 'Submit Answers'}
          </button>
        </div>
      </div>
    </div>
  );
};
