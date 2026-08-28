import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Clock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PhoneCallScenario } from '../types';
import { PHONE_CALL_SCENARIOS } from '../data/phoneCallData';
import { sendPhoneCallTurn } from '../services/aiService';
import { soundService } from '../services/soundService';

export const PhoneCallView: React.FC = () => {
  const { userProfile, addXP, recordSpeakingPractice } = useApp();

  const [scenarios] = useState<PhoneCallScenario[]>(PHONE_CALL_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<PhoneCallScenario>(PHONE_CALL_SCENARIOS[0]);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [messages, setMessages] = useState<Array<{ speaker: 'ai' | 'user'; text: string }>>([]);
  const [spokenInput, setSpokenInput] = useState<string>('');
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [coachTip, setCoachTip] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setSpokenInput(text);
        if (e.results[0].isFinal) {
          setIsRecording(false);
          handleSendCallSpeech(text);
        }
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartCall = () => {
    setCallState('calling');
    setCallDuration(0);
    setMessages([]);
    setCoachTip(selectedScenario.communicationTips?.[0] || 'Listen carefully to the other person.');
    soundService.playClick();

    // Simulate phone ringing delay then answer
    setTimeout(() => {
      setCallState('connected');
      const opening = selectedScenario.initialGreeting;
      setMessages([{ speaker: 'ai', text: opening }]);
      setIsAiSpeaking(true);
      soundService.speak(opening);
      setTimeout(() => setIsAiSpeaking(false), 2500);

      setSuggestedReplies(selectedScenario.keyPhrases.slice(0, 3));

      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState('ended');
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    soundService.playSuccess();
    recordSpeakingPractice(Math.max(1, Math.round(callDuration / 60)));
    addXP(30, `Completed Phone Simulation: ${selectedScenario.title}`);
  };

  const handleSendCallSpeech = async (textToSend?: string) => {
    const text = (textToSend || spokenInput).trim();
    if (!text || callState !== 'connected') return;

    setSpokenInput('');
    const newMessages = [...messages, { speaker: 'user' as const, text }];
    setMessages(newMessages);
    setIsAiSpeaking(true);

    const reply = await sendPhoneCallTurn({
      scenario: selectedScenario,
      messages: newMessages,
      userSpokenText: text,
    });

    if (reply) {
      setMessages((prev) => [...prev, { speaker: 'ai', text: reply.replyText }]);
      soundService.speak(reply.replyText);

      if (reply.suggestedReplies?.length) {
        setSuggestedReplies(reply.suggestedReplies);
      }
      if (reply.coachTip) {
        setCoachTip(reply.coachTip);
      }
      if (reply.isCallFinished) {
        setTimeout(() => {
          handleEndCall();
        }, 3000);
      }
    }
    setIsAiSpeaking(false);
  };

  const handleToggleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setSpokenInput('');
      recognitionRef.current?.start();
    }
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-teal-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            Voice-Only Phone Communication
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Phone Call Simulator
          </h1>
          <p className="text-teal-100/90 text-sm max-w-2xl leading-relaxed">
            Phone conversations in a foreign language are intimidating because there are no visual gestures. Practice real phone calls with interactive strategy helpers.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenario Selection */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Select Phone Scenario
          </div>

          <div className="space-y-2.5">
            {scenarios.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    if (callState === 'idle' || callState === 'ended') {
                      setSelectedScenario(sc);
                      setCallState('idle');
                    }
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {sc.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{sc.difficulty}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {sc.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Caller: {sc.callerName} ({sc.callerRole})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Realistic Phone Interface & Call Console */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            {/* Phone Screen Top Info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                  {selectedScenario.callerAvatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedScenario.callerName}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedScenario.callerRole} • {selectedScenario.callerNumber}</p>
                </div>
              </div>

              <div>
                {callState === 'connected' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {formatCallTime(callDuration)}
                  </div>
                )}
                {callState === 'calling' && (
                  <span className="text-xs text-amber-400 font-medium animate-pulse">
                    Calling...
                  </span>
                )}
                {callState === 'ended' && (
                  <span className="text-xs text-slate-400 font-medium">Call Ended</span>
                )}
              </div>
            </div>

            {/* Middle: Transcript & Audio Waveform */}
            <div className="flex-1 my-6 space-y-4 overflow-y-auto max-h-[260px] pr-2">
              {callState === 'idle' && (
                <div className="text-center py-12 space-y-3">
                  <PhoneCall className="w-12 h-12 text-teal-400 mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold text-white">
                    Ready to Call: {selectedScenario.title}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Objective: "{selectedScenario.objective}". Press Dial to begin speaking.
                  </p>
                </div>
              )}

              {callState === 'calling' && (
                <div className="text-center py-12 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center mx-auto animate-pulse">
                    <Phone className="w-6 h-6 text-teal-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Connecting to receiver...</p>
                </div>
              )}

              {(callState === 'connected' || callState === 'ended') && (
                <div className="space-y-3">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 ${
                        m.speaker === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          m.speaker === 'user'
                            ? 'bg-teal-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isAiSpeaking && (
                    <div className="flex items-center gap-2 text-xs text-teal-400 italic">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>{selectedScenario.callerName} is speaking...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Strategic Emergency Helpers on the Phone (Ask to Repeat / Slow Down) */}
            {callState === 'connected' && (
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                  <span>Strategic Phone Phrases (Click to Say):</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    'Could you repeat that, please?',
                    'Could you speak a little slower, please?',
                    'Sorry, the line is breaking up a bit.',
                    'Let me double check that with you.',
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendCallSpeech(phrase)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-teal-300 transition-colors"
                    >
                      "{phrase}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Call Controls */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {callState === 'idle' && (
                <button
                  onClick={handleStartCall}
                  className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dial & Start Call</span>
                </button>
              )}

              {callState === 'connected' && (
                <div className="w-full flex items-center gap-3">
                  <button
                    onClick={handleToggleMic}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isRecording
                        ? 'bg-red-500 text-white border-red-500 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <input
                    type="text"
                    value={spokenInput}
                    onChange={(e) => setSpokenInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCallSpeech()}
                    placeholder="Speak or type what you say into the phone..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  <button
                    onClick={() => handleSendCallSpeech()}
                    className="px-4 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs active:scale-95 transition-all"
                  >
                    Send
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all active:scale-95"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              )}

              {callState === 'ended' && (
                <div className="w-full flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    Call Duration: <span className="font-bold text-white">{formatCallTime(callDuration)}</span>
                  </div>
                  <button
                    onClick={handleStartCall}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Call Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
