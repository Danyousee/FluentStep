import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle2,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendVoiceTutorMessage, generateVoiceConversationReport } from '../services/aiService';
import { soundService } from '../services/soundService';
import { VoiceTutorTurn, VoiceConversationReport } from '../types';

const VOICE_SCENARIOS = [
  {
    id: 'scen_free_chat',
    title: 'Free Daily Conversation with Alex',
    category: 'General Speaking',
    difficulty: 'Any Level',
    promptContext: 'Casual daily life conversation. Ask how the learner’s day is going, their plans, hobbies, or recent experiences.',
    initialMessage: "Hi there! I'm Alex, your personal English voice tutor. How is your day going so far? Tell me what you've been working on today!",
    avatar: '🎙️',
  },
  {
    id: 'scen_job_interview',
    title: 'Job Interview Simulation',
    category: 'Workplace & Career',
    difficulty: 'Intermediate / Advanced',
    promptContext: 'Hiring manager interview. Ask behavioral questions, experience summaries, and how they solve challenging team problems.',
    initialMessage: "Welcome to our interview! Thanks for joining today. Could you start by introducing yourself and sharing your core strengths?",
    avatar: '💼',
  },
  {
    id: 'scen_coffee_problem',
    title: 'Politely Fixing a Wrong Order at a Café',
    category: 'Real-Life Social',
    difficulty: 'Elementary / Intermediate',
    promptContext: 'Barista roleplay. You accidentally brought iced latte instead of hot oat cappuccino.',
    initialMessage: "Here is your iced latte with regular milk! That will be $5.20. Enjoy your drink!",
    avatar: '☕',
  },
  {
    id: 'scen_hotel_reservation',
    title: 'Checking in at an International Hotel',
    category: 'Travel & Dining',
    difficulty: 'Intermediate',
    promptContext: 'Hotel receptionist roleplay. Ask for confirmation number, passport ID, and explain breakfast times.',
    initialMessage: "Good evening and welcome to The Grand Regent Hotel. Are you checking in today?",
    avatar: '🏨',
  },
];

export const VoiceTutorView: React.FC = () => {
  const {
    userProfile,
    learnerMemory,
    thinkingMode,
    addXP,
    setCurrentView,
    addMistakeRecord,
  } = useApp();

  const [activeScenario, setActiveScenario] = useState(VOICE_SCENARIOS[0]);
  const [turns, setTurns] = useState<VoiceTutorTurn[]>([
    {
      id: 'turn_0',
      speaker: 'tutor',
      text: VOICE_SCENARIOS[0].initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [tutorState, setTutorState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<VoiceConversationReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, tutorState]);

  // Read initial message if audio enabled
  useEffect(() => {
    if (isAudioEnabled) {
      soundService.speak(activeScenario.initialMessage);
    }
  }, [activeScenario]);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setTutorState('listening');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInputText(final || interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition event:', e);
        setTutorState('idle');
      };

      recognition.onend = () => {
        setTutorState('idle');
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (tutorState === 'listening') {
      recognitionRef.current?.stop();
      setTutorState('idle');
    } else {
      try {
        soundService.cancelSpeech();
        setInputText('');
        recognitionRef.current?.start();
      } catch {
        setTutorState('listening');
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message) return;

    if (tutorState === 'listening') {
      recognitionRef.current?.stop();
    }

    const userTurn: VoiceTutorTurn = {
      id: `turn_${Date.now()}`,
      speaker: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newTurns = [...turns, userTurn];
    setTurns(newTurns);
    setInputText('');
    setTutorState('thinking');

    try {
      const history = newTurns.map((t) => ({ speaker: t.speaker, text: t.text }));
      const response = await sendVoiceTutorMessage({
        userSpeechText: message,
        conversationHistory: history,
        scenarioTitle: activeScenario.title,
        learnerGoals: learnerMemory.learningGoals,
        learnerWeaknesses: learnerMemory.commonGrammarMistakes,
        learnerLevel: userProfile.level,
        thinkingMode,
      });

      const tutorTurn: VoiceTutorTurn = {
        id: `turn_${Date.now() + 1}`,
        speaker: 'tutor',
        text: response?.spokenReply || "That's very interesting! Can you tell me more?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: response?.correction?.hasMistake
          ? {
              hasMistake: true,
              original: response.correction.original || message,
              corrected: response.correction.corrected || '',
              explanation: response.correction.explanation || '',
            }
          : undefined,
        suggestedReplies: response?.suggestedReplies,
      };

      setTurns([...newTurns, tutorTurn]);
      setTutorState('speaking');

      // If user had a mistake, record it
      if (response?.correction?.hasMistake) {
        addMistakeRecord({
          userSentence: response.correction.original || message,
          correction: response.correction.corrected || '',
          rule: response.correction.explanation || 'Grammar correction',
          category: (response.correction.category as any) || 'Grammar',
        });
      }

      // Voice output
      if (isAudioEnabled) {
        soundService.speak(tutorTurn.text);
      }
      setTimeout(() => setTutorState('idle'), 2500);

      addXP(15, 'Voice turn completed!');
    } catch {
      setTutorState('idle');
    }
  };

  const handleEndSessionAndReview = async () => {
    setIsGeneratingReport(true);
    soundService.cancelSpeech();
    try {
      const transcript = turns.map((t) => ({ speaker: t.speaker, text: t.text }));
      const report = await generateVoiceConversationReport({
        scenarioTitle: activeScenario.title,
        transcript,
        durationMinutes: 4,
      });
      setReportData(report);
      setShowReport(true);
      addXP(50, 'Completed full Voice Conversation Report!');
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSelectScenario = (scen: typeof VOICE_SCENARIOS[0]) => {
    soundService.cancelSpeech();
    setActiveScenario(scen);
    setTurns([
      {
        id: `turn_${Date.now()}`,
        speaker: 'tutor',
        text: scen.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setShowReport(false);
    setReportData(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Mic size={14} className="text-emerald-400 animate-pulse" />
              Live AI Voice Tutor • Alex
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeScenario.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak naturally using your microphone. Alex listens, responds naturally, and highlights gentle corrections in real-time.
            </p>
          </div>

          {/* Audio toggle & End Session Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn_toggle_audio_speech"
              onClick={() => {
                if (isAudioEnabled) soundService.cancelSpeech();
                setIsAudioEnabled(!isAudioEnabled);
              }}
              title={isAudioEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isAudioEnabled
                  ? 'bg-indigo-600/80 border-indigo-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              id="btn_generate_voice_report"
              onClick={handleEndSessionAndReview}
              disabled={turns.length < 3 || isGeneratingReport}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <Award size={16} />
              {isGeneratingReport ? 'Analyzing...' : 'Finish & Get Diagnostic Report'}
            </button>
          </div>
        </div>

        {/* Scenario Switcher Pills */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {VOICE_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              id={`btn_switch_scenario_${scen.id}`}
              onClick={() => handleSelectScenario(scen)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeScenario.id === scen.id
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>{scen.avatar}</span>
              <span>{scen.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={`flex flex-col ${turn.speaker === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-bold text-slate-400">
                {turn.speaker === 'user' ? userProfile.name : 'AI Tutor Alex'}
              </span>
              <span className="text-[10px] text-slate-400">{turn.timestamp}</span>
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed ${
                turn.speaker === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-600/10'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <p>{turn.text}</p>
              {turn.speaker === 'tutor' && (
                <button
                  onClick={() => soundService.speak(turn.text)}
                  className="mt-2 text-indigo-600 dark:text-indigo-400 hover:opacity-80 text-xs font-bold flex items-center gap-1"
                >
                  <Volume2 size={13} /> Replay Audio
                </button>
              )}
            </div>

            {/* Non-interrupting Inline Correction Card */}
            {turn.correction?.hasMistake && (
              <div className="mt-2 max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
                  <Sparkles size={14} className="text-amber-600" />
                  Gentle Tutor Note ({turn.correction.category || 'Natural English'}):
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="line-through text-slate-400">"{turn.correction.original}"</span>
                  <span>→</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    "{turn.correction.corrected}"
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{turn.correction.explanation}</p>
              </div>
            )}

            {/* Quick suggested reply chips */}
            {turn.speaker === 'tutor' && turn.suggestedReplies && turn.suggestedReplies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 max-w-[85%]">
                {turn.suggestedReplies.map((reply, rIdx) => (
                  <button
                    key={rIdx}
                    id={`btn_reply_suggestion_${rIdx}`}
                    onClick={() => handleSendMessage(reply)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    💬 "{reply}"
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Live Tutor Status Bubble */}
        {tutorState !== 'idle' && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {tutorState === 'listening'
                ? 'Listening to you speak...'
                : tutorState === 'thinking'
                ? 'Alex is formulating response...'
                : 'Alex speaking...'}
            </span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Voice & Input Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Big Interactive Mic Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <button
              id="btn_voice_tutor_mic"
              onClick={toggleMic}
              className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl transition-all active:scale-90 cursor-pointer ${
                tutorState === 'listening'
                  ? 'bg-rose-600 shadow-rose-600/40 animate-pulse ring-8 ring-rose-400/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              {tutorState === 'listening' ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {tutorState === 'listening' ? 'Tap mic to send voice' : 'Press mic & start talking'}
              </div>
              <div className="text-xs text-slate-400">
                Or type in English below if you are in a quiet space.
              </div>
            </div>
          </div>

          {/* Thinking Mode Display */}
          <div className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Immersion: <strong className="text-indigo-600 dark:text-indigo-400">{thinkingMode}</strong>
          </div>
        </div>

        {/* Text Input Row */}
        <div className="flex gap-2">
          <input
            id="input_voice_tutor_text"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your response in English (or speak via microphone)..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
          />
          <button
            id="btn_send_voice_tutor_text"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Post-Session Diagnostic Report Modal */}
      {showReport && reportData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    Voice Conversation Diagnostic Report
                  </h3>
                  <p className="text-xs text-slate-400">
                    Scenario: {activeScenario.title} • 6-Dimension AI Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* 6 Dimension Radar / Metric Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Overall Score', score: reportData.overallScore, color: 'text-indigo-600' },
                { label: 'Communication', score: reportData.communicationScore, color: 'text-emerald-600' },
                { label: 'Grammar Accuracy', score: reportData.grammarScore, color: 'text-purple-600' },
                { label: 'Vocabulary Range', score: reportData.vocabularyScore, color: 'text-blue-600' },
                { label: 'Sentence Variety', score: reportData.sentenceVarietyScore, color: 'text-amber-600' },
                { label: 'Fluency Rate', score: reportData.fluencyScore, color: 'text-rose-600' },
              ].map((metric, mIdx) => (
                <div
                  key={mIdx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-center"
                >
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </div>
                  <div className={`text-2xl font-black ${metric.color} mt-0.5`}>
                    {metric.score}%
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths & Improvements */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Key Strengths Observed:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {reportData.strengths.map((s, sIdx) => (
                    <li key={sIdx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertCircle size={14} /> Targeted Areas for Practice:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  {reportData.areasToImprove.map((a, aIdx) => (
                    <li key={aIdx}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation & Retest */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
              <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tutor Action Plan:</strong> {reportData.recommendation}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowReport(false);
                  handleSelectScenario(activeScenario);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                Try Scenario Again
              </button>
              <button
                onClick={() => {
                  setShowReport(false);
                  setCurrentView('dashboard');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
