import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Volume2,
  Award,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FluencyReport, FluencySession } from '../types';
import { analyzeFluencySpeaking } from '../services/aiService';
import { soundService } from '../services/soundService';

const TOPIC_PRESETS = [
  {
    id: 'topic_daily',
    title: 'My Ideal Morning Routine',
    category: 'Daily Life',
    guidingQuestions: [
      'What time do you usually wake up?',
      'What is the very first thing you do?',
      'How does a calm morning change the rest of your day?',
    ],
  },
  {
    id: 'topic_travel',
    title: 'A Memorable Journey or City',
    category: 'Travel & Culture',
    guidingQuestions: [
      'Where did you travel and with whom?',
      'What sights, foods, or people stood out most?',
      'Would you recommend visiting this place to a friend?',
    ],
  },
  {
    id: 'topic_career',
    title: 'Why I Want to Master English',
    category: 'Motivation & Career',
    guidingQuestions: [
      'How will fluent English impact your career and life?',
      'What is the hardest part about learning English for you?',
      'What is one conversation you look forward to having in English?',
    ],
  },
  {
    id: 'topic_opinion',
    title: 'Remote Work vs. Office Work',
    category: 'Opinion & Discussion',
    guidingQuestions: [
      'Which do you personally prefer and why?',
      'What are the advantages and drawbacks of working from home?',
      'How do people stay productive and connected?',
    ],
  },
];

export const FluencyModeView: React.FC = () => {
  const { userProfile, addXP, recordSpeakingPractice } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<number>(60); // in seconds
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPIC_PRESETS[0].title);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [transcript, setTranscript] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [fluencyReport, setFluencyReport] = useState<FluencyReport | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartSpeaking = () => {
    setTranscript('');
    setFluencyReport(null);
    setTimeLeft(selectedDuration);
    setIsRecording(true);
    soundService.playClick();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleStopAndAnalyze();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStopAndAnalyze = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    soundService.playSuccess();
    recordSpeakingPractice(Math.max(1, Math.round(selectedDuration / 60)));

    setIsAnalyzing(true);
    const activeTopicTitle = customTopic.trim() || selectedTopic;
    const finalTranscript =
      transcript.trim() ||
      'I want to talk about my daily routine. I usually wake up early in the morning and drink a glass of water. Then I practice English speaking.';

    const report = await analyzeFluencySpeaking({
      transcript: finalTranscript,
      topic: activeTopicTitle,
      durationSeconds: selectedDuration - timeLeft || selectedDuration,
      userLevel: userProfile.level || 'A2',
    });

    if (report) {
      setFluencyReport(report);
      soundService.playFanfare();
      addXP(40, 'Fluency Speech Analysis Completed!');
    }
    setIsAnalyzing(false);
  };

  const activeTopicObj = TOPIC_PRESETS.find((t) => t.title === selectedTopic);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5" />
            Uninterrupted Continuous Speaking
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Fluency Mode & Speech Analyzer
          </h1>
          <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
            Speak continuously for 1, 3, or 5 minutes without interruption. Overcome hesitation, build natural conversational momentum, and receive deep AI analytics afterwards.
          </p>
        </div>
      </div>

      {!fluencyReport && !isRecording && !isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Settings & Topic Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Duration Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Select Speaking Duration</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '1 Minute', value: 60, desc: 'Quick Flow & Sprint' },
                  { label: '3 Minutes', value: 180, desc: 'Balanced Talk' },
                  { label: '5 Minutes', value: 300, desc: 'Deep Fluency Marathon' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedDuration(item.value)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      selectedDuration === item.value
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-base font-bold">{item.label}</div>
                    <div className={`text-xs mt-1 ${selectedDuration === item.value ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Cards */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Choose a Prompt or Discussion Topic
                </span>
                <span className="text-xs text-slate-400">4 Curated Themes</span>
              </div>

              <div className="space-y-3">
                {TOPIC_PRESETS.map((topic) => {
                  const isSelected = selectedTopic === topic.title && !customTopic;
                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic.title);
                        setCustomTopic('');
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {topic.category}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        {topic.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Topic Input */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Or enter your own custom topic:
                </label>
                <input
                  type="text"
                  placeholder="e.g. My favorite movie, A difficult decision I made..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Topic Helper & Ready to Start Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Speaking Guidelines
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {customTopic.trim() || selectedTopic}
                </h3>
              </div>

              {activeTopicObj && !customTopic && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ideas to talk about:</span>
                  </div>
                  <ul className="space-y-2">
                    {activeTopicObj.guidingQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  The Golden Rule of Fluency:
                </span>
                <span>
                  Do not stop if you make a mistake! Keep speaking, describe around difficult words, and keep your vocal rhythm moving.
                </span>
              </div>

              <button
                onClick={handleStartSpeaking}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                <Mic className="w-5 h-5" />
                <span>Start {selectedDuration / 60}-Minute Fluency Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Recording State */}
      {isRecording && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center space-y-8 shadow-md max-w-3xl mx-auto">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Recording In Progress • Do Not Stop
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {customTopic.trim() || selectedTopic}
            </h2>
          </div>

          {/* Animated Circular Timer / Waveform */}
          <div className="relative flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-4 border-emerald-100 dark:border-emerald-950 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-950/30">
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-slate-400 mt-1">Time Remaining</span>
            </div>
          </div>

          {/* Live Transcript Stream */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-left min-h-[120px] max-h-[200px] overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Live Speech Transcription:
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              {transcript || 'Listening to your voice... Speak clearly into your microphone.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleStopAndAnalyze}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Finish Early & Analyze</span>
            </button>
          </div>
        </div>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            AI Coach is Evaluating Your Fluency...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Measuring speech rhythm, vocabulary breadth, grammar patterns, and crafting high-level natural phrasing upgrades.
          </p>
        </div>
      )}

      {/* Post-Session Fluency Report */}
      {fluencyReport && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Scorecard Header */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Session Completed
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Fluency Assessment Report
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Topic: "{customTopic.trim() || selectedTopic}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setFluencyReport(null);
                    handleStartSpeaking();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again & Compare</span>
                </button>
                <button
                  onClick={() => setFluencyReport(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
                >
                  New Topic
                </button>
              </div>
            </div>

            {/* Score Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Overall Fluency', value: fluencyReport.overallFluencyScore, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                { label: 'Grammar', value: fluencyReport.grammarScore, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
                { label: 'Vocabulary', value: fluencyReport.vocabularyScore, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
                { label: 'Sentence Variety', value: fluencyReport.sentenceVarietyScore, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
                { label: 'Naturalness', value: fluencyReport.naturalnessScore, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
                { label: 'Pronunciation', value: fluencyReport.pronunciationScore, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
              ].map((gauge, idx) => (
                <div key={idx} className={`${gauge.bg} rounded-2xl p-4 text-center border border-slate-200/50 dark:border-slate-700/50`}>
                  <div className={`text-2xl font-black ${gauge.color}`}>{gauge.value}%</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    {gauge.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Note */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Coach Alex's Feedback:</span>
              {fluencyReport.feedbackSummary}
            </div>
          </div>

          {/* Detailed Feedback: Strengths, Mistakes & Upgrades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What You Did Well */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>What You Did Exceptionally Well</span>
              </div>
              <ul className="space-y-2.5">
                {fluencyReport.whatYouDidWell.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes & Corrections */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Grammar & Word Corrections</span>
              </div>
              <div className="space-y-2.5">
                {fluencyReport.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-rose-600 dark:text-rose-400 line-through font-medium">"{mistake.mistake}"</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">"{mistake.correction}"</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{mistake.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* "Instead of... Try..." Better Expressions Upgrades */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Elevate Your Phrasing: Instead of... Try...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fluencyReport.betterExpressions.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                  <div className="text-xs text-slate-500">
                    Instead of: <span className="font-semibold text-slate-700 dark:text-slate-300">"{exp.original}"</span>
                  </div>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    Try: "{exp.better}"
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {exp.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
