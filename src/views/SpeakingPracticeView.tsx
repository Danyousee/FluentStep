import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Award,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { evaluateSpeakingWithAI, SpeakingFeedbackData } from '../services/aiService';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { soundService } from '../services/soundService';

const SPEAKING_PROMPTS = [
  {
    id: 'speak_intro',
    situation: 'Social Networking',
    targetPhrase: 'Hello, nice to meet you. My name is Alex and I am learning English.',
    tip: 'Focus on clear pronunciation of "nice to meet you" without rushing.',
  },
  {
    id: 'speak_coffee',
    situation: 'Café Order',
    targetPhrase: 'Could I please get a large cappuccino with oat milk to go?',
    tip: 'Use a rising intonation on polite questions like "Could I please get...".',
  },
  {
    id: 'speak_past',
    situation: 'Talking about Yesterday',
    targetPhrase: 'Yesterday, I visited the botanical garden and took many beautiful pictures.',
    tip: 'Pronounce the "-ed" in "visited" as /ɪd/.',
  },
  {
    id: 'speak_hotel',
    situation: 'Hotel Reception',
    targetPhrase: 'Excuse me, could you tell me what time the breakfast buffet starts tomorrow morning?',
    tip: 'Pause naturally after "Excuse me" before asking your question.',
  },
];

export const SpeakingPracticeView: React.FC = () => {
  const { userProfile, addXP, recordSpeakingPractice } = useApp();

  const [promptIndex, setPromptIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedbackData | null>(null);

  const currentPrompt = SPEAKING_PROMPTS[promptIndex % SPEAKING_PROMPTS.length];

  const handleToggleRecord = () => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
    } else {
      setSpokenTranscript('');
      setFeedback(null);
      const started = speechRecognitionService.startListening(
        (res) => {
          setSpokenTranscript(res.transcript);
          if (res.isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          console.warn('Speech error:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  const handleEvaluateSpeaking = async () => {
    if (!spokenTranscript.trim() || isEvaluating) return;
    setIsEvaluating(true);

    const result = await evaluateSpeakingWithAI({
      spokenText: spokenTranscript,
      promptText: currentPrompt.targetPhrase,
      situation: currentPrompt.situation,
      userLevel: userProfile.level,
    });

    setFeedback(result);
    setIsEvaluating(false);
    recordSpeakingPractice(2); // Log 2 minutes
    soundService.playSuccess();
  };

  const handleNextPrompt = () => {
    setPromptIndex((i) => i + 1);
    setSpokenTranscript('');
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <Mic size={16} />
          <span>Speech Recognition & Pronunciation Lab</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
          Speaking & Articulation Practice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Listen to native model audio, record your own voice, and receive instant feedback.
        </p>
      </div>

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
        {/* Situation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Prompt {promptIndex + 1} of {SPEAKING_PROMPTS.length} • {currentPrompt.situation}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
              Read and speak this sentence out loud:
            </h2>
          </div>

          <AudioPlayerButton text={currentPrompt.targetPhrase} size="lg" label="Listen Model" />
        </div>

        {/* Target Phrase Box */}
        <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40 text-center space-y-3">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
            "{currentPrompt.targetPhrase}"
          </p>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
            💡 <strong>Tutor Tip:</strong> {currentPrompt.tip}
          </p>
        </div>

        {/* Microphone Recording Hub */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <button
            id="btn_record_speaking"
            onClick={handleToggleRecord}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 scale-110 animate-pulse ring-8 ring-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 shadow-indigo-600/20'
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {isListening
              ? '🎙️ Listening... Speak your English sentence now!'
              : 'Tap microphone to start speaking'}
          </span>
        </div>

        {/* Live Spoken Transcript */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Speech-to-Text Transcript:
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 min-h-[40px]">
            {spokenTranscript || (
              <span className="text-slate-400 font-normal italic">
                Your spoken words will appear here in real-time...
              </span>
            )}
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSpokenTranscript('')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn_evaluate_speaking"
              disabled={!spokenTranscript.trim() || isEvaluating}
              onClick={handleEvaluateSpeaking}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing Pronunciation...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Analyze Speech with AI (+25 XP)</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextPrompt}
              className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <span>Next Prompt</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* AI Evaluation Scores and Pronunciation Tips */}
        {feedback && (
          <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Speech Evaluation Results
              </span>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300">
                  Accuracy: {feedback.accuracyScore}%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300">
                  Fluency: {feedback.fluencyScore}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {feedback.feedback}
            </p>

            {feedback.pronunciationTips && feedback.pronunciationTips.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                  Pronunciation Tips:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {feedback.pronunciationTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-900"
                    >
                      <strong className="text-emerald-700 dark:text-emerald-300 block">
                        "{tip.word}"
                      </strong>
                      <span className="text-slate-600 dark:text-slate-400">{tip.tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
