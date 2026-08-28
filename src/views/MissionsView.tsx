import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  CheckCircle2,
  Circle,
  MessageSquare,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  HelpCircle,
  Check,
  User,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MissionItem } from '../types';
import { MISSIONS_DATA, REAL_LIFE_MISSIONS } from '../data/missionsData';
import { sendMissionTurn } from '../services/aiService';
import { soundService } from '../services/soundService';

export const MissionsView: React.FC = () => {
  const { userStats, userProfile, addXP } = useApp();

  const [missions, setMissions] = useState<MissionItem[]>(() => {
    const saved = localStorage.getItem('fluentstep_missions');
    return saved ? JSON.parse(saved) : REAL_LIFE_MISSIONS;
  });

  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [latestCorrection, setLatestCorrection] = useState<any>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('fluentstep_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setInputText(spoken);
        setIsRecording(false);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
    }
  }, []);

  const activeMission = missions.find((m) => m.id === activeMissionId);

  const handleStartMission = (mission: MissionItem) => {
    setActiveMissionId(mission.id);
    setCompletedItems([]);
    const opening = mission.initialMessage || `Hello! Ready to start our conversation?`;
    setMessages([
      {
        sender: 'ai',
        text: opening,
      },
    ]);
    setSuggestedReplies(mission.usefulPhrases.slice(0, 3));
    setLatestCorrection(null);
    soundService.speak(opening);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeMission) return;

    setInputText('');
    const newMessages = [...messages, { sender: 'user' as const, text }];
    setMessages(newMessages);
    setIsLoading(true);
    soundService.playClick();

    const reply = await sendMissionTurn({
      mission: activeMission,
      messages: newMessages,
      userMessage: text,
    });

    if (reply) {
      setMessages((prev) => [...prev, { sender: 'ai', text: reply.aiResponse }]);
      soundService.speak(reply.aiResponse);

      if (reply.correction?.hasMistake) {
        setLatestCorrection(reply.correction);
      } else {
        setLatestCorrection(null);
      }

      if (reply.suggestedReplies?.length) {
        setSuggestedReplies(reply.suggestedReplies);
      }

      if (reply.completedChecklistItems?.length) {
        setCompletedItems((prev) => Array.from(new Set([...prev, ...reply.completedChecklistItems])));
      }

      if (reply.isMissionComplete) {
        soundService.playFanfare();
        addXP(40, `Completed Real-Life Mission: ${activeMission.title}!`);
      }
    }
    setIsLoading(false);
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Task-Based Real-Life Missions
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Real-Life English Missions
          </h1>
          <p className="text-blue-100/90 text-sm max-w-2xl leading-relaxed">
            Stop studying isolated rules. Put your English into immediate action by completing practical everyday objectives with native AI characters.
          </p>
        </div>
      </div>

      {/* Main Container: List vs Active Mission */}
      {!activeMissionId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            return (
              <motion.div
                key={mission.id}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{mission.coverEmoji || '🎯'}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {mission.level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {mission.scenarioDescription}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Goal:</span>
                    <p className="text-slate-600 dark:text-slate-400">{mission.goal}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{mission.aiCharacter.name} ({mission.aiCharacter.role})</span>
                    <span>+{mission.estimatedMinutes * 10} XP</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartMission(mission)}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Mission</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        activeMission && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Mission Brief & Objectives Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                  <button
                    onClick={() => setActiveMissionId(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    ← All Missions
                  </button>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                    {activeMission.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl">{activeMission.coverEmoji || '🎯'}</div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeMission.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeMission.scenarioDescription}
                  </p>
                </div>

                {/* Checklist Goals */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Mission Objectives Checklist
                  </div>
                  <div className="space-y-2">
                    {activeMission.completionChecklist.map((item, idx) => {
                      const isDone = completedItems.some((c) => item.toLowerCase().includes(c.toLowerCase()));
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
                            isDone
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Target Vocab & Useful Phrases Tooltip */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Handy Phrases For This Mission
                  </div>
                  <div className="space-y-2">
                    {activeMission.usefulPhrases.map((phrase, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSendMessage(phrase)}
                        className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <span className="font-semibold block">"{phrase}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Chat Console */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-[580px] shadow-sm">
                {/* Character Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                      {activeMission.aiCharacter.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeMission.aiCharacter.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {activeMission.aiCharacter.role}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Mission Active
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 ${
                        m.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                          m.sender === 'user'
                            ? 'bg-slate-900 text-white'
                            : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                        }`}
                      >
                        {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : activeMission.aiCharacter.avatar}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{m.text}</span>
                          {m.sender === 'ai' && (
                            <button
                              onClick={() => soundService.speak(m.text)}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <span>{activeMission.aiCharacter.name} is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Gentle Inline Correction Card */}
                {latestCorrection && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Quick Coach Note:
                    </span>
                    <div className="text-slate-700 dark:text-slate-300">
                      Instead of <span className="line-through text-rose-500">"{latestCorrection.original}"</span>, try saying <span className="font-bold text-emerald-600">"{latestCorrection.better}"</span>.
                    </div>
                    <div className="text-[11px] text-slate-500">{latestCorrection.why}</div>
                  </div>
                )}

                {/* Suggested Quick Replies */}
                {suggestedReplies.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
                      Suggestions:
                    </span>
                    {suggestedReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-slate-700 dark:text-slate-300 text-xs font-medium whitespace-nowrap transition-all"
                      >
                        "{reply}"
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={handleToggleVoice}
                    className={`p-3 rounded-xl border transition-all ${
                      isRecording
                        ? 'bg-red-500 text-white border-red-500 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type or speak what you would say in this situation..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isLoading}
                    className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
