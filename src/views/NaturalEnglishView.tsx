import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  BookOpen,
  Compass,
  ArrowRight,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { naturalizeTextWithAI, NaturalizeData } from '../services/aiService';
import { REAL_LIFE_SITUATIONS } from '../data/realLifeData';
import { COLLOCATIONS_DATA } from '../data/collocationsData';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { soundService } from '../services/soundService';

export const NaturalEnglishView: React.FC = () => {
  const { userProfile, addXP } = useApp();

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NaturalizeData | null>(null);
  const [activeTab, setActiveTab] = useState<'polisher' | 'situations' | 'collocations'>('polisher');

  const handleNaturalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    const data = await naturalizeTextWithAI(inputText, userProfile.level);
    setResult(data);
    setIsLoading(false);
    addXP(20, 'Polished English sentence to sound natural!');
    soundService.playSuccess();
  };

  const handleQuickSample = (sample: string) => {
    setInputText(sample);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          <Compass size={16} />
          <span>Real-Life English & Sentence Polisher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
          Make My English Natural
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Type any rough sentence or thought. Discover how native speakers express it naturally.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {[
          { id: 'polisher', label: '✨ Instant Sentence Polisher' },
          { id: 'situations', label: '💬 Real-Life Situations' },
          { id: 'collocations', label: '📚 Essential Collocations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Sentence Polisher */}
      {activeTab === 'polisher' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
            {/* Sample chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Try clicking a sample thought:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'I am go to market yesterday for buy food.',
                  'She don’t have much experience in this work.',
                  'Can you explain me what is this meaning?',
                  'I am agree with your opinion very much.',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSample(sample)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors text-left"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleNaturalize} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block mb-1.5">
                  Type your sentence below:
                </label>
                <textarea
                  id="naturalize_input_text"
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Example: I want go for buy some foods..."
                  className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-xs text-zinc-400 hover:text-zinc-600"
                >
                  Clear text
                </button>

                <button
                  id="btn_submit_naturalize"
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Naturalizing English...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Make My English Natural (+20 XP)</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Naturalized Result Card */}
            {result && (
              <div className="p-6 rounded-3xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-5">
                <div className="flex items-center justify-between border-b border-teal-200/60 dark:border-teal-800 pb-3">
                  <span className="font-bold text-sm text-teal-950 dark:text-teal-100 flex items-center gap-1.5">
                    <CheckCircle2 size={18} className="text-teal-600" />
                    AI Naturalization Comparison
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Correct English */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-teal-200 dark:border-zinc-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Grammatically Correct
                      </span>
                      <AudioPlayerButton text={result.correctEnglish} size="sm" />
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      "{result.correctEnglish}"
                    </p>
                  </div>

                  {/* More Natural English */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-teal-300 dark:border-teal-800 space-y-2 ring-2 ring-teal-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        ⭐ Most Natural Native Phrasing
                      </span>
                      <AudioPlayerButton text={result.moreNatural} size="sm" />
                    </div>
                    <p className="text-sm font-bold text-teal-900 dark:text-teal-200">
                      "{result.moreNatural}"
                    </p>
                  </div>
                </div>

                {/* Rules & Explanation */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-teal-200/80 dark:border-zinc-700 space-y-2 text-xs">
                  <strong className="text-zinc-900 dark:text-zinc-100 block">
                    Explanation & Grammar Rules:
                  </strong>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {result.explanation}
                  </p>
                  {result.rules && result.rules.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-zinc-500 pt-1">
                      {result.rules.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Real Life Situations */}
      {activeTab === 'situations' && (
        <div className="space-y-6">
          {REAL_LIFE_SITUATIONS.map((sit) => (
            <div
              key={sit.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {sit.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Context: {sit.context}</p>
              </div>

              <div className="space-y-2">
                {sit.phrases.map((phrase, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                        "{phrase.text}"
                      </p>
                      <p className="text-zinc-500 mt-0.5">{phrase.meaning}</p>
                    </div>
                    <AudioPlayerButton text={phrase.text} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Collocations */}
      {activeTab === 'collocations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COLLOCATIONS_DATA.map((colloc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  {colloc.category}
                </span>
                <AudioPlayerButton text={colloc.collocation} size="sm" />
              </div>
              <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                {colloc.collocation}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {colloc.meaning}
              </p>
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-xs italic text-zinc-700 dark:text-zinc-300">
                "{colloc.correctExample}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
