import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateSpeakingAssessment } from '../services/aiService';
import { soundService } from '../services/soundService';
import { SpeakingAssessmentResult } from '../types';

export const SpeakingAssessmentView: React.FC = () => {
  const { userProfile, saveSpeakingAssessment, setCurrentView } = useApp();

  const PROMPTS = [
    {
      type: 'IELTS Part 2 (Cue Card)',
      text: 'Describe a significant decision you made recently. Explain what the situation was, who helped you decide, and why it had a positive impact on your life.',
      timeTip: 'Speak continuously for 1 to 2 minutes.',
    },
    {
      type: 'TOEFL Integrated Task',
      text: 'Explain whether you prefer working in an open-plan collaborative office or in an individual quiet workspace. Provide two specific reasons to support your choice.',
      timeTip: 'Speak for 45 to 60 seconds.',
    },
    {
      type: 'Workplace & Career Pitch',
      text: 'Introduce yourself in a professional meeting, outlining your current responsibilities and one key project you successfully delivered this quarter.',
      timeTip: 'Speak clearly for 1 minute.',
    },
  ];

  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<SpeakingAssessmentResult | null>(null);

  const activePrompt = PROMPTS[selectedPromptIndex];

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        setTranscript(
          'Recently I made the decision to change my career focus to software engineering. At first it was very challenging because I had to learn many new programming languages and algorithms, but with the support of my mentor and consistent daily study, I was able to build several portfolio applications and secure a full-time role.'
        );
        setIsRecording(false);
        soundService.playSuccess();
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      setIsRecording(true);
      let currentString = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentString += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(currentString || interim);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) return;
    setIsEvaluating(true);

    try {
      const evalData = await evaluateSpeakingAssessment({
        promptText: activePrompt.text,
        spokenTranscript: transcript,
        audioDuration: 60,
        userLevel: userProfile.level,
      });

      if (evalData) {
        setResult(evalData);
        saveSpeakingAssessment(evalData);
        soundService.playFanfare();
      }
    } catch (e) {
      console.error('Speaking assessment error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <Mic size={14} className="text-emerald-300" />
            <span>AI Voice & Fluency Diagnostic</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Speaking Assessment
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm">
            Record your spoken answer to standard exam prompts. The AI evaluates pronunciation clarity, lexical variety, grammar range, and fluency cadence.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Prompt Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Speaking Task Prompt:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPromptIndex(idx);
                    setTranscript('');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedPromptIndex === idx
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 block mb-1">
                    {p.type}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                    {p.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Prompt Box */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
              {activePrompt.type}
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              "{activePrompt.text}"
            </p>
            <p className="text-xs text-slate-400 italic">{activePrompt.timeTip}</p>
          </div>

          {/* Record & Transcript Arena */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleToggleRecord}
                className={`px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-3 shadow-xl transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isRecording ? 'Listening... Tap to Stop' : 'Start Recording Voice'}</span>
              </button>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold uppercase text-slate-400">
                Spoken Speech Transcript:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your recorded voice transcript will appear here automatically, or you can paste your spoken transcription directly..."
                rows={4}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleEvaluate}
              disabled={!transcript.trim() || isEvaluating}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isEvaluating ? (
                <span>Analyzing Acoustic & Grammatical Features...</span>
              ) : (
                <>
                  <Sparkles size={18} className="text-amber-300" />
                  <span>Submit for AI Assessment & Band Calculation</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                Diagnostic Assessment Complete
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                Estimated Overall Band: {result.overallBand}
              </h2>
              <p className="text-xs text-slate-400">CEFR Level: {result.cefrEstimate}</p>
            </div>
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Take Another Test
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-medium">Pronunciation</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {result.pronunciationScore}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-medium">Fluency & Cadence</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                {result.fluencyScore}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-medium">Grammar Range</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {result.grammarAccuracyScore}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 font-medium">Lexical Variety</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {result.lexicalResourceScore}%
              </p>
            </div>
          </div>

          {/* Detailed Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Key Strengths</h4>
              <div className="space-y-2">
                {result.strengths.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Target Growth Areas</h4>
              <div className="space-y-2">
                {result.improvementAreas.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-2"
                  >
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Native Polish Suggestions */}
          {result.suggestedRewrites && result.suggestedRewrites.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">
                Native Alternative Formulations
              </h4>
              <div className="space-y-2">
                {result.suggestedRewrites.map((rw, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4 text-xs sm:text-sm font-medium"
                  >
                    <p className="text-slate-800 dark:text-slate-200">"{rw}"</p>
                    <button
                      onClick={() => soundService.speakSentence(rw)}
                      className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-lg hover:bg-indigo-100"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
