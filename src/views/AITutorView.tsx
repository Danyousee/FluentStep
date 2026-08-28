import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  BookmarkPlus,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Compass,
  MessageSquare,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendAITutorChat, TutorChatResponseData } from '../services/aiService';
import { soundService } from '../services/soundService';

interface ChatBubble {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  data?: TutorChatResponseData;
}

const QUICK_TOPICS = [
  { id: 'free', label: '💬 Free Conversation', prompt: "Hi Alex, let's have a friendly conversation. What should we talk about today?" },
  { id: 'fix', label: '✍️ Fix My Sentence', prompt: "Can you check my sentence for grammatical accuracy and natural phrasing? Here is what I want to say: " },
  { id: 'grammar', label: '📖 Explain Grammar', prompt: "Could you explain the difference between 'Present Perfect' and 'Past Simple' with simple examples?" },
  { id: 'phrasal', label: '🧩 Phrasal Verbs', prompt: "Teach me 3 natural phrasal verbs I can use at work or university with real examples." },
  { id: 'interview', label: '💼 Job Interview', prompt: "Can you act as a hiring manager and ask me a common interview question to practice answering?" },
  { id: 'smalltalk', label: '☕ Casual Small Talk', prompt: "Let's practice casual small talk that I can use with coworkers or neighbors." },
];

export const AITutorView: React.FC = () => {
  const { userProfile, userStats, addXP, addMistakeRecord, setCurrentView } = useApp();
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 'welcome_msg',
      sender: 'tutor',
      text: `Hello ${userProfile.name}! I'm Alex, your personal English tutor. I've tuned our session for your ${userProfile.level} level. Whether you want to fix a sentence, learn new phrases, or practice real speaking, I'm here to help! What would you like to work on?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: {
        reply: `Hello ${userProfile.name}! I'm Alex, your personal English tutor. I've tuned our session for your ${userProfile.level} level. Whether you want to fix a sentence, learn new phrases, or practice real speaking, I'm here to help!`,
        exampleSentences: [
          "I'm looking forward to learning today.",
          "Could you check if this sentence is correct?",
        ],
        suggestedReplies: [
          'How can I introduce myself more naturally?',
          'Let’s practice building longer sentences.',
          'Teach me useful everyday phrasal verbs.',
        ],
        encouragement: 'Every mistake is just a step towards fluent communication!',
      },
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [savedMistakeIds, setSavedMistakeIds] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Setup Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = userProfile.voiceAccent || 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, [userProfile.voiceAccent]);

  const toggleRecording = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isRecording) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechRecognitionRef.current.start();
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputVal.trim();
    if (!textToSend || isLoading) return;

    const userBubble: ChatBubble = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userBubble]);
    setInputVal('');
    setIsLoading(true);

    // Prepare history
    const history = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    try {
      const tutorResponse = await sendAITutorChat({
        message: textToSend,
        conversationHistory: history,
        userLevel: userProfile.level,
        currentLesson: 'AI Personal Tutor Session',
        weakAreas: userStats.weakAreas,
        previousMistakes: userStats.mistakes.filter((m) => !m.mastered),
        learningGoals: userProfile.goals,
      });

      const tutorBubble: ChatBubble = {
        id: `tutor_${Date.now()}`,
        sender: 'tutor',
        text: tutorResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: tutorResponse,
      };

      setMessages((prev) => [...prev, tutorBubble]);
      addXP(10, 'Active English Tutor interaction');
      soundService.playPop();

      // If user had a mistake and speech is on, tutor voice can speak
    } catch (err) {
      console.error('Tutor chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMistake = (bubbleId: string, correction: any) => {
    if (savedMistakeIds[bubbleId]) return;
    addMistakeRecord({
      originalSentence: correction.original || '',
      correctedSentence: correction.better || '',
      explanation: correction.explanation || correction.why || 'Grammar and usage correction.',
      category: (correction.category as any) || 'General',
      sourceLesson: 'AI Tutor Chat',
    });
    setSavedMistakeIds((prev) => ({ ...prev, [bubbleId]: true }));
    soundService.playSuccess();
  };

  const playVoice = (text: string) => {
    soundService.speak(text);
  };

  return (
    <div id="ai-tutor-container" className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto p-4 md:p-6">
      {/* Header Banner */}
      <div id="tutor-header-card" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xl shadow-xs">
              👨‍🏫
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Alex • AI English Tutor</h1>
              <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-100 dark:border-indigo-900">
                Level: {userProfile.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adapting vocabulary, grammar, and corrections in real-time to your learning pace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-mistakes-book-btn"
            onClick={() => setCurrentView('my_mistakes')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            My Mistakes Book ({userStats.mistakes?.filter((m) => !m.mastered).length || 0})
          </button>
          <button
            id="open-say-it-better-btn"
            onClick={() => setCurrentView('say_it_better')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl border border-indigo-100 dark:border-indigo-900 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Say It Better
          </button>
        </div>
      </div>

      {/* Quick Topic Starter Chips */}
      <div id="quick-topics-scroller" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
        {QUICK_TOPICS.map((topic) => (
          <button
            key={topic.id}
            id={`quick-topic-${topic.id}`}
            onClick={() => handleSend(topic.prompt)}
            disabled={isLoading}
            className="shrink-0 text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 transition-all shadow-2xs whitespace-nowrap"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Main Chat Thread */}
      <div id="tutor-chat-thread" className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 md:p-6 space-y-4 shadow-inner">
        <AnimatePresence initial={false}>
          {messages.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex flex-col ${bubble.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%] md:max-w-[78%]">
                {bubble.sender === 'tutor' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shrink-0 mb-1">
                    👨‍🏫
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    bubble.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{bubble.text}</p>

                  {/* Tutor AI Detailed Feedback Card */}
                  {bubble.data?.correction?.hasMistake && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-amber-100 dark:border-amber-950/60 bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 font-semibold text-amber-800 dark:text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Grammar & Phrasing Tip
                        </span>
                        <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-full font-medium">
                          {bubble.data.correction.category || 'Correction'}
                        </span>
                      </div>

                      {bubble.data.correction.original && (
                        <div className="text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-slate-500">Your phrasing: </span>
                          <span className="line-through decoration-rose-400 text-rose-600 dark:text-rose-400">
                            {bubble.data.correction.original}
                          </span>
                        </div>
                      )}

                      {bubble.data.correction.better && (
                        <div className="text-emerald-800 dark:text-emerald-300 font-medium">
                          <span>More Natural: </span>
                          <span className="bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-sm">
                            {bubble.data.correction.better}
                          </span>
                        </div>
                      )}

                      {bubble.data.correction.explanation && (
                        <p className="text-slate-600 dark:text-slate-300 italic pt-1 border-t border-amber-200/40 dark:border-amber-900/30">
                          💡 {bubble.data.correction.explanation}
                        </p>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          id={`save-mistake-btn-${bubble.id}`}
                          onClick={() => handleSaveMistake(bubble.id, bubble.data?.correction)}
                          disabled={savedMistakeIds[bubble.id]}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            savedMistakeIds[bubble.id]
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          {savedMistakeIds[bubble.id] ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Saved in Mistakes Book
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3 h-3" /> Save to My Mistakes Book
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Example Sentences */}
                  {bubble.data?.exampleSentences && bubble.data.exampleSentences.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Example Usages:
                      </p>
                      {bubble.data.exampleSentences.map((ex, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300"
                        >
                          <span>"{ex}"</span>
                          <button
                            onClick={() => playVoice(ex)}
                            className="p-1 hover:text-indigo-600 transition-colors"
                            title="Listen pronunciation"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Encouragement note */}
                  {bubble.data?.encouragement && (
                    <p className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      ✨ {bubble.data.encouragement}
                    </p>
                  )}
                </div>

                {bubble.sender === 'tutor' && (
                  <button
                    id={`listen-bubble-${bubble.id}`}
                    onClick={() => playVoice(bubble.text)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0 mb-1"
                    title="Listen to Alex"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">{bubble.timestamp}</span>

              {/* One-click Suggested Replies */}
              {bubble.sender === 'tutor' && bubble.data?.suggestedReplies && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {bubble.data.suggestedReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(reply)}
                      disabled={isLoading}
                      className="text-xs px-2.5 py-1 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors text-left font-medium shadow-2xs"
                    >
                      💬 {reply}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs animate-pulse">
              👨‍🏫
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-slate-500">Alex is formulating thoughtful feedback...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div id="tutor-input-container" className="mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            id="tutor-mic-btn"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Speak via microphone'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            id="tutor-message-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to your voice...'
                : 'Ask Alex anything or practice a sentence...'
            }
            className="flex-1 bg-transparent px-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
            disabled={isLoading}
          />

          <button
            type="submit"
            id="tutor-send-btn"
            disabled={!inputVal.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
