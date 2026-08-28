import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONTEXTUAL_VOCAB_GROUPS } from '../data/contextualVocabData';
import { soundService } from '../services/soundService';

export const ContextualVocabView: React.FC = () => {
  const { addXP, recordWordLearned } = useApp();

  const [groups] = useState(CONTEXTUAL_VOCAB_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'vg_coffee');
  const [savedWords, setSavedWords] = useState<string[]>([]);

  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleLearnWord = (word: string) => {
    if (!savedWords.includes(word)) {
      setSavedWords((prev) => [...prev, word]);
      recordWordLearned(word);
      soundService.playSuccess();
      addXP(10, `Learned Vocabulary: ${word}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Situational Vocabulary
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Contextual Vocabulary Builder
          </h1>
          <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
            Learn words the way memory retains them best: embedded directly inside real-life scenes with natural word pairings and collocations.
          </p>
        </div>
      </div>

      {/* Situational Topic Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {groups.map((group) => {
          const isSelected = activeGroup.id === group.id;
          return (
            <div
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-900 dark:text-white'
              }`}
            >
              <div className="text-2xl">{group.icon}</div>
              <div className="text-sm font-bold truncate">{group.title}</div>
              <div className={`text-[11px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {group.words.length} Key Terms
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Situation Words List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Target Situation
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{activeGroup.icon}</span>
              <span>{activeGroup.title}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeGroup.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGroup.words.map((item, idx) => {
            const isLearned = savedWords.includes(item.word);
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {item.word}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.partOfSpeech}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => soundService.speak(item.example)}
                      className="text-slate-400 hover:text-emerald-600 p-1"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleLearnWord(item.word)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                        isLearned
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isLearned ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isLearned ? 'Learned' : 'Master Word'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Meaning: </strong>
                  {item.meaning}
                </div>

                {item.collocations?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Natural Pairings: </span>
                    {item.collocations.map((col, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-medium"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 italic">
                  "{item.example}"
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
