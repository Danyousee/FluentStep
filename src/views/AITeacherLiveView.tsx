import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  RotateCcw,
  Plus,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendTeacherInteraction, generateInstantLesson } from '../services/aiService';
import { soundService } from '../services/soundService';
import { TeacherMode } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'teacher';
  text: string;
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
    hasMistake: boolean;
  };
  suggestedFollowUps?: string[];
  naturalPhrasings?: string[];
  timestamp: string;
}

export const AITeacherLiveView: React.FC = () => {
  const { userProfile, userStats, saveWordToNotebook, addXP } = useApp();

  const [activeMode, setActiveMode] = useState<TeacherMode>('teaching');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      sender: 'teacher',
      text: `Hello ${userProfile.name || 'there'}! I'm Sarah, your AI Live English Teacher. I'm here to explain any grammar rule, converse with you in real time, correct your sentences, or generate instant mini-lessons on the spot. What would you like to explore today?`,
      suggestedFollowUps: [
        'Explain when to use "since" vs "for"',
        'Let\'s practice a job interview conversation',
        'Can you check my sentence: "I look forward to meet you"?',
        'Give me a 5-minute instant lesson on Business Phrasal Verbs',
      ],
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MODES: { id: TeacherMode; label: string; icon: string; desc: string }[] = [
    { id: 'teaching', label: 'Teaching Mode', icon: '👨‍🏫', desc: 'Explains grammar, idioms, nuances & rules clearly' },
    { id: 'conversation', label: 'Conversation Practice', icon: '🗣️', desc: 'Real-time dialogue with natural feedback' },
    { id: 'correction', label: 'Sentence Correction', icon: '🔍', desc: 'Detailed breakdown of mistakes & native rewrites' },
    { id: 'instant_lesson', label: 'Instant Lesson Generator', icon: '⏱️', desc: 'Custom 5-minute lesson on any topic' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (activeMode === 'instant_lesson' && text.toLowerCase().includes('lesson')) {
        const instantResult = await generateInstantLesson({
          topic: text,
          userLevel: userProfile.level,
        });

        const teacherMsg: Message = {
          id: `teacher_${Date.now()}`,
          sender: 'teacher',
          text: `Here is your custom instant lesson on **${instantResult.topic}**:\n\n**Core Concept:**\n${instantResult.explanation}\n\n**Key Rule:**\n${instantResult.keyRule}\n\n**Real-Life Examples:**\n${instantResult.examples.map((e: string) => `• ${e}`).join('\n')}`,
          suggestedFollowUps: ['Give me a practice quiz on this', 'Explain another related concept', 'Let\'s practice using these in conversation'],
          naturalPhrasings: instantResult.examples,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, teacherMsg]);
        addXP(20, 'Instant Lesson Mastered');
      } else {
        const response = await sendTeacherInteraction({
          mode: activeMode,
          userMessage: text,
          userLevel: userProfile.level,
          mistakeHistory: userStats.mistakes,
          conversationHistory: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        });

        const teacherMsg: Message = {
          id: `teacher_${Date.now()}`,
          sender: 'teacher',
          text: response.teacherReply,
          correction: response.correction,
          suggestedFollowUps: response.suggestedFollowUps,
          naturalPhrasings: response.naturalPhrasings,
          timestamp: 'Just now',
        };

        setMessages((prev) => [...prev, teacherMsg]);
        addXP(15, 'Practiced with AI Teacher');
      }
      soundService.playSuccess();
    } catch (err) {
      console.error('Teacher interaction error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Realistic simulation for environments without Web Speech API
      setIsRecording(true);
      setTimeout(() => {
        setInputValue('How can I sound more polite when disagreeing with my boss?');
        setIsRecording(false);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handlePlayVoice = (text: string) => {
    soundService.speakSentence(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <Sparkles size={14} className="text-amber-300" />
            <span>Interactive Live Tutor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Live Teacher
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm max-w-xl">
            Ask any grammar question, converse naturally, or get instant corrections with detailed pedagogical explanations.
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              activeMode === m.id
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 shadow-md shadow-indigo-600/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{m.icon}</span>
              <span
                className={`text-xs font-bold ${
                  activeMode === m.id
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {m.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm min-h-[500px] max-h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20 font-medium'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Optional Voice button for Teacher */}
                {msg.sender === 'teacher' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => handlePlayVoice(msg.text)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Volume2 size={14} />
                      <span>Listen to pronunciation</span>
                    </button>
                  </div>
                )}

                {/* Correction Card if mistake detected */}
                {msg.correction && msg.correction.hasMistake && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-slate-800 dark:text-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold uppercase text-[10px]">
                      <AlertCircle size={14} />
                      <span>Grammar & Phrasing Feedback</span>
                    </div>
                    <div className="space-y-1">
                      <p className="line-through text-rose-600 dark:text-rose-400">
                        {msg.correction.original}
                      </p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">
                        ✓ {msg.correction.corrected}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] italic">
                        {msg.correction.explanation}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        saveWordToNotebook({
                          wordOrPhrase: msg.correction!.corrected,
                          meaning: msg.correction!.explanation,
                          type: 'phrase',
                          exampleSentence: msg.correction!.corrected,
                          folder: 'Grammar Corrections',
                        });
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                    >
                      <Plus size={12} />
                      <span>Save corrected phrase to Notebook</span>
                    </button>
                  </div>
                )}

                {/* Natural Phrasings / Idiomatic Alternatives */}
                {msg.naturalPhrasings && msg.naturalPhrasings.length > 0 && (
                  <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-xs space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                      More Natural Native Ways to Say This:
                    </span>
                    {msg.naturalPhrasings.map((phrase, pIdx) => (
                      <div key={pIdx} className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          • {phrase}
                        </span>
                        <button
                          onClick={() => handlePlayVoice(phrase)}
                          className="text-slate-400 hover:text-indigo-600"
                        >
                          <Volume2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-2xl">
                  {msg.suggestedFollowUps.map((promptText, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSendMessage(promptText)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 rounded-full text-[11px] font-medium transition-all border border-slate-200 dark:border-slate-700"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl w-fit">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-1">Sarah is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Speech-to-text"
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              activeMode === 'teaching'
                ? 'Ask any English grammar question (e.g. "What is the difference between lend and borrow?")...'
                : activeMode === 'correction'
                ? 'Paste or type any sentence you want checked...'
                : activeMode === 'instant_lesson'
                ? 'Type a topic for a 5-minute instant lesson (e.g. "Polite meeting phrases")...'
                : 'Type your message in English...'
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
