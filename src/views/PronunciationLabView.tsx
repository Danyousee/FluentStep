import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { PRONUNCIATION_SOUNDS, SoundPracticeCategory, DIALECT_DIFFERENCES } from '../data/pronunciationData';
import {
  Mic,
  Volume2,
  Sparkles,
  CheckCircle2,
  Globe,
  Flame,
  Layers,
  ArrowRight,
  BookOpen,
  Info,
} from 'lucide-react';

interface PronunciationLabViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const PronunciationLabView: React.FC<PronunciationLabViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'sounds' | 'dialects'>('sounds');
  const [activeSound, setActiveSound] = useState<SoundPracticeCategory>(PRONUNCIATION_SOUNDS[0]);
  const [practicedWords, setPracticedWords] = useState<{ [word: string]: boolean }>({});

  const speakText = (text: string, rate: number = 0.85, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePracticeWord = (word: string) => {
    speakText(word);
    setPracticedWords((prev) => ({ ...prev, [word]: true }));
    onUpdateProgress((prev) => ({
      ...prev,
      dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
    }));
  };

  return (
    <div id="pronunciation-lab-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-cyan-100 border border-white/20">
            <Mic className="w-3.5 h-3.5" />
            Acoustic & Phonetic Training
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pronunciation & Accent Lab</h1>
          <p className="text-cyan-100 text-base md:text-lg leading-relaxed">
            Train your mouth and tongue for clear, confident English pronunciation. Master tricky sounds (/θ/, /ð/, /r/, /l/, /v/ vs /w/), practice tongue twisters, and compare British vs American English.
          </p>
        </div>
      </div>

      {/* Main Tabs: Sounds vs Dialects */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('sounds')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sounds'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mic className="w-4 h-4" /> Phonetic Sound Mastery
        </button>
        <button
          onClick={() => setActiveTab('dialects')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dialects'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" /> British vs. American English
        </button>
      </div>

      {activeTab === 'sounds' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Sound Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Target English Sounds ({PRONUNCIATION_SOUNDS.length})
            </div>
            {PRONUNCIATION_SOUNDS.map((snd) => {
              const isSelected = activeSound.id === snd.id;
              return (
                <div
                  key={snd.id}
                  onClick={() => setActiveSound(snd)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                      {snd.soundSymbol}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{snd.category}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{snd.soundName}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {snd.words.slice(0, 3).map((w) => (
                      <span
                        key={w.word}
                        className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
                      >
                        {w.word}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sound Training Studio */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono font-bold text-xs">
                      {activeSound.soundSymbol}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {activeSound.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {activeSound.soundName}
                  </h2>
                </div>
              </div>

              {/* Mouth & Tongue Position Guide */}
              <div className="p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
                  <Mic className="w-4 h-4" /> Mouth & Tongue Placement Tip:
                </div>
                <p className="text-sm text-cyan-950 dark:text-cyan-200 leading-relaxed font-medium">
                  {activeSound.mouthPositionTip}
                </p>
              </div>

              {/* Practice Word Cards */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Click to Hear & Practice Words:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeSound.words.map((w) => {
                    const isPracticed = practicedWords[w.word];
                    return (
                      <button
                        key={w.word}
                        onClick={() => handlePracticeWord(w.word)}
                        className={`p-4 rounded-2xl border text-left transition-all group flex flex-col justify-between ${
                          isPracticed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600">
                            {w.word}
                          </span>
                          <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-1">{w.phonetic}</div>
                        <div className="text-xs text-slate-500 mt-2 line-clamp-1">{w.meaning}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Sentence Practice */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Sentence Flow Practice:
                  </span>
                  <button
                    onClick={() => speakText(activeSound.sentencePractice)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-base font-semibold text-slate-900 dark:text-white">
                  "{activeSound.sentencePractice}"
                </div>
              </div>

              {/* Tongue Twister Challenge */}
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <Flame className="w-4 h-4 text-amber-600" /> Tongue Twister Challenge:
                  </div>
                  <button
                    onClick={() => speakText(activeSound.tongueTwister, 0.95)}
                    className="p-1.5 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-700"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm font-bold text-amber-950 dark:text-amber-100 italic">
                  "{activeSound.tongueTwister}"
                </div>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/80">
                  Try saying this 3 times fast without making a mistake!
                </p>
              </div>

              {/* Common Pitfall Warning */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">💡 Common Mistake to Avoid:</span>
                <div>{activeSound.commonMistake}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dialect Comparison Section */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                British vs. American English Variations
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Both accents and vocabulary sets are standard and widely recognized globally. Understand the nuances to communicate naturally in any country.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIALECT_DIFFERENCES.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-4"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {diff.category}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* British */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400">🇬🇧 British</span>
                        <button
                          onClick={() => speakText(diff.british.term, 0.85, 'en-GB')}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">{diff.british.term}</div>
                      <div className="text-xs text-slate-500 italic">"{diff.british.example}"</div>
                    </div>

                    {/* American */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400">🇺🇸 American</span>
                        <button
                          onClick={() => speakText(diff.american.term, 0.85, 'en-US')}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">{diff.american.term}</div>
                      <div className="text-xs text-slate-500 italic">"{diff.american.example}"</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    🌍 <strong>International Note:</strong> {diff.internationalNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
