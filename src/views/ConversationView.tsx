import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Volume2,
  Loader2,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONVERSATION_SCENARIOS } from '../data/conversationData';
import {
  sendAIConversationMessage,
  ConversationResponseData,
} from '../services/aiService';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { soundService } from '../services/soundService';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  correction?: {
    hasMistake: boolean;
    original?: string;
    better?: string;
    why?: string;
    category?: string;
  };
}

export const ConversationView: React.FC = () => {
  const {
    selectedConversationId,
    setSelectedConversationId,
    userProfile,
    recordConversationCompletion,
  } = useApp();

  const currentScenario =
    CONVERSATION_SCENARIOS.find((s) => s.id === selectedConversationId) ||
    CONVERSATION_SCENARIOS[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [isGoalDone, setIsGoalDone] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize scenario chat
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: currentScenario.aiPersona.intro,
      },
    ]);
    setSuggestedReplies(currentScenario.suggestedStarters);
    setIsGoalDone(false);
    setInputText('');
  }, [currentScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    soundService.playPop();
    setInputText('');

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response: ConversationResponseData = await sendAIConversationMessage({
        scenario: currentScenario,
        messages: newMessages.map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        userLevel: userProfile.level,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.aiResponse,
          correction: response.correction,
        },
      ]);

      if (response.suggestedReplies && response.suggestedReplies.length > 0) {
        setSuggestedReplies(response.suggestedReplies);
      }

      if (response.isGoalCompleted && !isGoalDone) {
        setIsGoalDone(true);
        recordConversationCompletion(currentScenario.id);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "That sounds wonderful! Could you tell me more about your daily routine?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
    } else {
      const started = speechRecognitionService.startListening(
        (res) => {
          setInputText(res.transcript);
          if (res.isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          console.warn(err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  const handleRestartChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: currentScenario.aiPersona.intro,
      },
    ]);
    setSuggestedReplies(currentScenario.suggestedStarters);
    setIsGoalDone(false);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans text-slate-800 dark:text-slate-100">
      {/* Scenario Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <MessageSquare size={16} />
            <span>AI English Tutor Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            Real-Life Conversation Practice
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Practice talking with <strong>{currentScenario.aiPersona.name}</strong> ({currentScenario.aiPersona.role}).
          </p>
        </div>

        {/* Change Scenario Dropdown */}
        <div className="relative">
          <button
            id="btn_change_scenario"
            onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs hover:bg-slate-50 transition-all"
          >
            <span>Scenario: {currentScenario.title}</span>
            <ChevronDown size={14} />
          </button>

          {scenarioDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                Select Scenario (15 Available)
              </span>
              {CONVERSATION_SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedConversationId(scen.id);
                    setScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedConversationId === scen.id
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <span className="block">{scen.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{scen.category} • {scen.level}</span>
                  </div>
                  <span className="text-base">{scen.aiPersona.avatar}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scenario Goal Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            🎯
          </div>
          <div>
            <span className="font-bold text-indigo-950 dark:text-indigo-200">
              Scenario Goal:
            </span>
            <p className="text-indigo-800 dark:text-indigo-300 font-medium">
              {currentScenario.goal}
            </p>
          </div>
        </div>

        {isGoalDone ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
            <CheckCircle2 size={14} />
            <span>Goal Achieved! (+30 XP)</span>
          </div>
        ) : (
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            3-5 turns to complete
          </div>
        )}
      </div>

      {/* Chat Messages Box */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[520px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p>{msg.text}</p>
                  {msg.sender === 'ai' && (
                    <AudioPlayerButton text={msg.text} size="sm" />
                  )}
                </div>

                {/* Gentle AI Correction Card */}
                {msg.correction && msg.correction.hasMistake && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-1 mt-2">
                    <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300">
                      <Sparkles size={13} />
                      Gentle English Polish:
                    </span>
                    {msg.correction.better && (
                      <p>
                        Say: <strong>"{msg.correction.better}"</strong>
                      </p>
                    )}
                    {msg.correction.why && (
                      <p className="text-[11px] opacity-80">{msg.correction.why}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
              <Loader2 size={14} className="animate-spin text-indigo-600" />
              <span>{currentScenario.aiPersona.name} is typing a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Replies */}
        {suggestedReplies.length > 0 && !isTyping && (
          <div className="pt-3 pb-2 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Suggestions:</span>
            {suggestedReplies.map((reply, rIdx) => (
              <button
                key={rIdx}
                onClick={() => handleSendMessage(reply)}
                className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0 font-medium transition-colors text-left"
              >
                "{reply}"
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            id="btn_restart_conversation"
            onClick={handleRestartChat}
            title="Restart Conversation"
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw size={18} />
          </button>

          <button
            id="btn_voice_input_conv"
            onClick={handleToggleMic}
            title={isListening ? 'Stop Listening' : 'Speak into microphone'}
            className={`p-2.5 rounded-2xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            id="conv_message_input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={`Type in English or tap mic to speak...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />

          <button
            id="btn_send_conv_message"
            disabled={!inputText.trim() || isTyping}
            onClick={() => handleSendMessage()}
            className="p-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
