import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Volume2,
  Trash2,
  ArrowRight,
  TrendingUp,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceJournalEntry } from '../types';
import { analyzeVoiceJournal } from '../services/aiService';
import { soundService } from '../services/soundService';

const SAMPLE_JOURNALS: VoiceJournalEntry[] = [
  {
    id: 'vj_1',
    date: '2026-08-27',
    title: 'Morning Reflections & Work Focus',
    audioDurationSeconds: 45,
    originalTranscript: 'Today I woke up at 7. I drank tea and I thinked about my work plan. I want to speak more fluent.',
    correctedVersion: 'Today I woke up at 7:00. I drank tea and thought about my work plan. I want to speak more fluently.',
    naturalVersion: 'I started my day around 7:00 AM with a cup of tea while mapping out my priorities for work. My main goal is to keep refining my speaking fluency.',
    suggestedVocabulary: [
      { word: 'mapping out', meaning: 'planning the details of an activity', context: 'Mapping out my daily priorities.' },
      { word: 'fluently', meaning: 'with smooth ease and accuracy (adverb)', context: 'Speak more fluently.' },
      { word: 'priorities', meaning: 'things regarded as more important', context: 'Focusing on my top priorities.' },
    ],
    grammarScore: 82,
    fluencyScore: 80,
    feedback: 'Good clear thoughts! Notice that the past tense of "think" is "thought" (irregular) and we use the adverb "fluently" after the verb speak.',
    tags: ['Daily Life', 'Morning Routine'],
    weekNumber: 1,
  },
];

export const VoiceJournalView: React.FC = () => {
  const { userProfile, addXP, recordSpeakingPractice } = useApp();

  const [entries, setEntries] = useState<VoiceJournalEntry[]>(() => {
    const saved = localStorage.getItem('fluentstep_voice_journals');
    return saved ? JSON.parse(saved) : SAMPLE_JOURNALS;
  });

  const [selectedEntryId, setSelectedEntryId] = useState<string>(entries[0]?.id || 'vj_1');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [journalTitle, setJournalTitle] = useState<string>('Daily Reflection');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('fluentstep_voice_journals', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e: any) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript + ' ';
        }
        setLiveTranscript(text);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const handleStartRecording = () => {
    setLiveTranscript('');
    setRecordingSeconds(0);
    setIsRecording(true);
    soundService.playClick();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecordingAndSave = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    setIsAnalyzing(true);
    const transcriptText =
      liveTranscript.trim() ||
      'Today was very productive. I practiced English vocabulary and learned new sentence patterns.';

    const analysis = await analyzeVoiceJournal({
      transcript: transcriptText,
      title: journalTitle || 'Daily Voice Reflection',
      userLevel: userProfile.level || 'A2',
    });

    const newEntry: VoiceJournalEntry = {
      id: `vj_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: journalTitle || 'Daily Reflection',
      audioDurationSeconds: recordingSeconds || 45,
      originalTranscript: analysis?.originalTranscript || transcriptText,
      correctedVersion: analysis?.correctedVersion || transcriptText,
      naturalVersion: analysis?.naturalVersion || transcriptText,
      suggestedVocabulary: analysis?.suggestedVocabulary || [
        { word: 'productive', meaning: 'achieving significant output', context: 'A productive day.' },
      ],
      grammarScore: analysis?.grammarScore || 85,
      fluencyScore: analysis?.fluencyScore || 82,
      feedback: analysis?.feedback || 'Great job recording your voice journal!',
      tags: ['Voice Log', 'Self Practice'],
      weekNumber: 1,
    };

    setEntries([newEntry, ...entries]);
    setSelectedEntryId(newEntry.id);
    setIsAnalyzing(false);
    soundService.playFanfare();
    recordSpeakingPractice(1);
    addXP(35, 'Saved Voice Journal Entry!');
  };

  const selectedEntry = entries.find((e) => e.id === selectedEntryId) || entries[0];

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    if (selectedEntryId === id && updated.length > 0) {
      setSelectedEntryId(updated[0].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5" />
            Audio Speaking Diary
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            My Voice Journal & Phrase Upgrades
          </h1>
          <p className="text-purple-100/90 text-sm max-w-2xl leading-relaxed">
            Record a 1-minute reflection every day. Hear your own voice, compare what you said against native phrasing, and watch your speaking confidence evolve over weeks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recorder & Past Entries List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Record New Entry Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Record Today's Entry
              </span>
              {isRecording && (
                <span className="text-xs font-mono font-bold text-red-500 animate-pulse">
                  {recordingSeconds}s
                </span>
              )}
            </div>

            <input
              type="text"
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              placeholder="Entry Title (e.g. My Weekend, Plans for tomorrow)..."
              disabled={isRecording}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {isRecording && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 italic min-h-[60px]">
                {liveTranscript || 'Listening to your voice...'}
              </div>
            )}

            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Audio Recording</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecordingAndSave}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Analyzing Entry...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Finish & Analyze Entry</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Past Entries */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-3 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Journal History ({entries.length} Entries)
            </div>

            <div className="space-y-2">
              {entries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntryId(entry.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-500 ring-2 ring-purple-500/20'
                        : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {entry.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{entry.date}</span>
                        <span>•</span>
                        <span>{entry.audioDurationSeconds}s</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        {entry.fluencyScore}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Multi-Tier Comparison (Original vs Corrected vs Natural) */}
        <div className="lg:col-span-7">
          {selectedEntry ? (
            <motion.div
              key={selectedEntry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                    {selectedEntry.date} • {selectedEntry.audioDurationSeconds} Seconds
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedEntry.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                    Fluency: {selectedEntry.fluencyScore}%
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    Grammar: {selectedEntry.grammarScore}%
                  </span>
                </div>
              </div>

              {/* Version 1: Original Spoken Transcript */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>1. What You Said (Verbatim):</span>
                  <button
                    onClick={() => soundService.speak(selectedEntry.originalTranscript)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{selectedEntry.originalTranscript}"
                </p>
              </div>

              {/* Version 2: Grammatically Corrected */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <span>2. Grammatically Corrected:</span>
                  <button
                    onClick={() => soundService.speak(selectedEntry.correctedVersion)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  "{selectedEntry.correctedVersion}"
                </p>
              </div>

              {/* Version 3: Native Natural Phrasing */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 3. Native-Level Natural Upgrade:
                  </span>
                  <button
                    onClick={() => soundService.speak(selectedEntry.naturalVersion)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-900 dark:text-white font-bold leading-relaxed">
                  "{selectedEntry.naturalVersion}"
                </p>
              </div>

              {/* Suggested Vocabulary Upgrade Words */}
              {selectedEntry.suggestedVocabulary.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vocabulary Upgrades for Your Next Entry
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedEntry.suggestedVocabulary.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                      >
                        <div className="font-bold text-purple-600 dark:text-purple-400">{v.word}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">{v.meaning}</div>
                        <div className="text-[10px] text-slate-400 italic">"{v.context}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coach Feedback Note */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
                  Coach Alex's Notes:
                </span>
                {selectedEntry.feedback}
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400">
              No journal entry selected. Record one on the left to start!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
