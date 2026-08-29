import React, { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Send,
  MessageSquare,
  Repeat,
  Flame,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';
import { EMERGENCY_HELP_SCENARIOS } from '../data/learnerMemoryAndDiagnosticsData';
import { generateEmergencyHelp } from '../services/aiService';
import { EmergencyHelpSession } from '../types';

export const EmergencyHelpView: React.FC = () => {
  const { addXP, setCurrentView } = useApp();

  const [sessions, setSessions] = useState<EmergencyHelpSession[]>(EMERGENCY_HELP_SCENARIOS);
  const [activeSession, setActiveSession] = useState<EmergencyHelpSession>(EMERGENCY_HELP_SCENARIOS[0]);
  const [customSituationText, setCustomSituationText] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Quick Drill State
  const [jumbledWords, setJumbledWords] = useState<string[]>(
    activeSession.quickPracticeExercises[0]?.jumbledWords || []
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [drillFeedback, setDrillFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Roleplay Rehearsal State
  const [roleplayTurn, setRoleplayTurn] = useState<number>(0);
  const [roleplayHistory, setRoleplayHistory] = useState<{ speaker: string; text: string }[]>([
    {
      speaker: activeSession.roleplayDialogue.partnerName,
      text: activeSession.roleplayDialogue.openingLine,
    },
  ]);

  const handleSelectSession = (session: EmergencyHelpSession) => {
    setActiveSession(session);
    setJumbledWords(session.quickPracticeExercises[0]?.jumbledWords || []);
    setSelectedWords([]);
    setDrillFeedback(null);
    setRoleplayTurn(0);
    setRoleplayHistory([
      {
        speaker: session.roleplayDialogue.partnerName,
        text: session.roleplayDialogue.openingLine,
      },
    ]);
  };

  const handleWordClick = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
    const updated = [...jumbledWords];
    updated.splice(index, 1);
    setJumbledWords(updated);
    setDrillFeedback(null);
  };

  const handleResetDrill = () => {
    setJumbledWords(activeSession.quickPracticeExercises[0]?.jumbledWords || []);
    setSelectedWords([]);
    setDrillFeedback(null);
  };

  const handleCheckDrill = () => {
    const constructed = selectedWords.join(' ');
    const target = activeSession.quickPracticeExercises[0]?.targetSentence.replace(/[.!?]/g, '').trim();
    const cleanConstructed = constructed.replace(/[.!?]/g, '').trim();

    if (cleanConstructed.toLowerCase() === target.toLowerCase()) {
      setDrillFeedback('correct');
      soundService.playSuccess();
      addXP(25, 'Emergency phrase mastered under pressure!');
    } else {
      setDrillFeedback('incorrect');
      soundService.playError();
    }
  };

  const handleRoleplayChoice = (response: string) => {
    soundService.speak(response);
    setRoleplayHistory([
      ...roleplayHistory,
      { speaker: 'You', text: response },
      {
        speaker: activeSession.roleplayDialogue.partnerName,
        text: "Understood. That is very clear and we'll take care of it right away.",
      },
    ]);
    setRoleplayTurn(1);
    addXP(20, 'Completed emergency response rehearsal!');
  };

  const handleGenerateCustomSituation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSituationText.trim()) return;

    setIsGeneratingCustom(true);
    try {
      const generated = await generateEmergencyHelp({
        situationDescription: customSituationText.trim(),
        urgencyLevel: 'High',
        tone: 'Professional & Assertive',
      });

      if (generated) {
        setSessions([generated, ...sessions]);
        handleSelectSession(generated);
      } else {
        // Fallback emergency session
        const fallback: EmergencyHelpSession = {
          scenarioId: `custom_${Date.now()}`,
          scenarioTitle: customSituationText.trim().slice(0, 45),
          urgencyReason: customSituationText.trim(),
          targetTone: 'Clear & Direct',
          goldenRuleTip: 'State the core problem in your first sentence. Keep sentences short and unambiguous.',
          topPhrases: [
            {
              phrase: `I am speaking with you regarding: ${customSituationText.trim()}.`,
              meaning: 'Direct problem statement without hesitation.',
            },
            {
              phrase: 'Could you please confirm the exact next step and timeframe for resolution?',
              meaning: 'Locks down accountability and timing.',
            },
          ],
          keyVocabulary: [
            { word: 'Resolution', meaning: 'The action of solving a problem', phonetic: '/ˌrez.əˈluː.ʃən/' },
            { word: 'Urgent', meaning: 'Requiring immediate action or attention', phonetic: '/ˈɜː.dʒənt/' },
          ],
          quickPracticeExercises: [
            {
              prompt: 'Form the urgent opening statement:',
              targetSentence: 'I need immediate assistance with this matter.',
              jumbledWords: ['assistance', 'I', 'need', 'immediate', 'this', 'with', 'matter.'],
              hint: 'Start with "I need..."',
            },
          ],
          roleplayDialogue: {
            partnerName: 'Representative',
            partnerRole: 'Service Lead',
            openingLine: 'Hello, how can I assist you today?',
            suggestedResponses: [
              `Hello, I need immediate help regarding ${customSituationText.trim()}.`,
              'I would like to resolve this as quickly as possible.',
            ],
          },
        };
        setSessions([fallback, ...sessions]);
        handleSelectSession(fallback);
      }
      setCustomSituationText('');
      addXP(20, 'Generated instant emergency help plan!');
    } catch {
      // Ignore
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold tracking-wide">
              <ShieldAlert size={14} className="text-rose-400 animate-pulse" />
              Emergency Mode • High-Stakes Situations
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              I Need English Now
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have an urgent call, doctor visit, job interview, or landlord dispute in the next 10 minutes? Get high-impact phrases, golden strategies, and a 2-minute drill to speak with immediate authority.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-center shrink-0">
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
              Active Situation Tone
            </div>
            <div className="text-xl font-black text-white">
              {activeSession.targetTone}
            </div>
            <div className="text-[11px] text-slate-300 mt-1">
              Zero fluff • High-clarity English
            </div>
          </div>
        </div>

        {/* Custom Situation Input Box */}
        <form onSubmit={handleGenerateCustomSituation} className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2">
          <input
            id="input_custom_emergency_situation"
            type="text"
            value={customSituationText}
            onChange={(e) => setCustomSituationText(e.target.value)}
            placeholder="Type your urgent situation (e.g. 'Flight delayed and missing connecting flight in London')..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
          />
          <button
            id="btn_generate_custom_emergency"
            type="submit"
            disabled={isGeneratingCustom || !customSituationText.trim()}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 shrink-0 cursor-pointer"
          >
            <Sparkles size={16} />
            {isGeneratingCustom ? 'Building Prep...' : 'Prepare Instantly'}
          </button>
        </form>
      </div>

      {/* Preset Emergency Scenarios Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sessions.map((sess) => (
          <button
            key={sess.scenarioId}
            id={`btn_select_emergency_${sess.scenarioId}`}
            onClick={() => handleSelectSession(sess)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeSession.scenarioId === sess.scenarioId
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-400'
            }`}
          >
            <span>🚨</span>
            <span>{sess.scenarioTitle}</span>
          </button>
        ))}
      </div>

      {/* Main Situation Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Phrases & Golden Rule (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Golden Rule Banner */}
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 space-y-1.5">
            <div className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-600" />
              Golden Rule for this Situation:
            </div>
            <p className="text-sm font-semibold leading-relaxed">
              {activeSession.goldenRuleTip}
            </p>
          </div>

          {/* Top High-Impact Phrases */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame size={18} className="text-rose-500" />
                High-Impact Phrases (Use Exactly These)
              </h3>
              <span className="text-xs text-slate-400">Click audio to hear native delivery</span>
            </div>

            <div className="space-y-4">
              {activeSession.topPhrases.map((phraseObj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2 hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                      "{phraseObj.phrase}"
                    </p>
                    <button
                      onClick={() => soundService.speak(phraseObj.phrase)}
                      className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white transition-colors shrink-0"
                      title="Play Pronunciation"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Why it works:</span>
                    <span>{phraseObj.meaning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Jumbled Sentence Pressure Drill */}
          {activeSession.quickPracticeExercises[0] && (
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Repeat size={18} className="text-indigo-500" />
                  30-Second Pressure Muscle-Memory Drill
                </h3>
                <button
                  onClick={handleResetDrill}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Reset Words
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeSession.quickPracticeExercises[0].prompt}
              </p>

              {/* Constructed sentence box */}
              <div className="min-h-[56px] p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                {selectedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Tap words below to arrange your sentence...
                  </span>
                ) : (
                  selectedWords.map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs animate-scaleUp"
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>

              {/* Word choices */}
              <div className="flex flex-wrap gap-2">
                {jumbledWords.map((word, jIdx) => (
                  <button
                    key={jIdx}
                    onClick={() => handleWordClick(word, jIdx)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-indigo-500 transition-all cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Drill Check Button & Feedback */}
              <div className="flex items-center justify-between pt-2">
                {drillFeedback === 'correct' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span>Perfect delivery! Your tongue is ready.</span>
                  </div>
                ) : drillFeedback === 'incorrect' ? (
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    Not quite. Target: "{activeSession.quickPracticeExercises[0].targetSentence}"
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Hint: {activeSession.quickPracticeExercises[0].hint}
                  </span>
                )}

                <button
                  onClick={handleCheckDrill}
                  disabled={selectedWords.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Verify Sentence
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Key Vocabulary & Roleplay Rehearsal (1 col) */}
        <div className="space-y-6">
          {/* Key Vocabulary */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🎯</span> Key Vocabulary to Anchor
            </h3>
            <div className="space-y-3">
              {activeSession.keyVocabulary.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {vocab.word}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{vocab.phonetic}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{vocab.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2-Turn Roleplay Simulator */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500" />
              Simulated Roleplay Rehearsal
            </h3>

            {/* Conversation Stream */}
            <div className="space-y-3">
              {roleplayHistory.map((item, rIdx) => (
                <div
                  key={rIdx}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    item.speaker === 'You'
                      ? 'bg-indigo-600 text-white ml-6 rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 mr-6 rounded-tl-xs border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1">{item.speaker}</div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Rehearsal Choices if turn 0 */}
            {roleplayTurn === 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-400">
                  Select your rehearsal response:
                </div>
                {activeSession.roleplayDialogue.suggestedResponses.map((resp, sIdx) => (
                  <button
                    key={sIdx}
                    id={`btn_roleplay_resp_${sIdx}`}
                    onClick={() => handleRoleplayChoice(resp)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    💬 "{resp}"
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
