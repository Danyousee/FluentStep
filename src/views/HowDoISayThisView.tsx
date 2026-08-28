import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Search,
  Volume2,
  Sparkles,
  MessageSquare,
  Building,
  Coffee,
  Plane,
  Compass,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askHowDoISayThis, HowDoISayThisResponseData } from '../services/aiService';
import { soundService } from '../services/soundService';

const COMMON_INTENTS = [
  { intent: 'Ask for the bill in a restaurant', context: 'Dining' },
  { intent: 'Politely ask someone to repeat what they said', context: 'General' },
  { intent: 'Decline an invitation without sounding rude', context: 'Social' },
  { intent: 'Ask for directions to the train station', context: 'Travel' },
  { intent: 'Disagree with a coworker politely in a meeting', context: 'Work' },
  { intent: 'Ask for a discount or best price in a shop', context: 'Shopping' },
];

const CONTEXT_TAGS = [
  { id: 'general', label: '🌍 General', icon: Compass },
  { id: 'work', label: '💼 Work & Office', icon: Building },
  { id: 'dining', label: '☕ Café & Dining', icon: Coffee },
  { id: 'travel', label: '✈️ Travel & Transit', icon: Plane },
  { id: 'social', label: '💬 Social & Friends', icon: MessageSquare },
];

export const HowDoISayThisView: React.FC = () => {
  const { userProfile, addXP } = useApp();
  const [query, setQuery] = useState('');
  const [activeContext, setActiveContext] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HowDoISayThisResponseData | null>(null);

  const handleSearch = async (customQuery?: string, contextOverride?: string) => {
    const q = customQuery || query.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    const ctx = contextOverride || activeContext;

    try {
      const data = await askHowDoISayThis(q, ctx, userProfile.level);
      setResult(data);
      addXP(15, 'Discovered contextual English expressions');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="how-do-i-say-this-container" className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">"How Do I Say This?" Helper</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Describe what you want to communicate in your own words, and get exact phrases for every situation.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="how-do-i-say-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. How to ask someone to speak slower without being awkward..."
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              id="how-do-i-say-search-btn"
              onClick={() => handleSearch()}
              disabled={!query.trim() || isLoading}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Finding Phrases...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Find Expressions
                </>
              )}
            </button>
          </div>

          {/* Context Selector */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Setting / Context:</span>
            {CONTEXT_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setActiveContext(tag.id);
                  if (query.trim()) handleSearch(query, tag.id);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeContext === tag.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Prompt chips */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 mr-2">Popular situations to ask:</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_INTENTS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(item.intent);
                    handleSearch(item.intent, item.context.toLowerCase());
                  }}
                  className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  💡 {item.intent}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Phrases for: <span className="text-indigo-600 dark:text-indigo-400">"{result.concept}"</span>
              </h2>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Context: {activeContext}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.options.map((opt, i) => {
                let badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
                if (opt.tier === 'Natural') badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
                if (opt.tier === 'Polite') badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
                if (opt.tier === 'Professional') badgeColor = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';

                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                          {opt.tier} Option
                        </span>
                        <button
                          onClick={() => soundService.speak(opt.phrase)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Listen pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        "{opt.phrase}"
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {opt.whenToUse}
                      </p>

                      {opt.sampleDialogue && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 mt-2">
                          <span className="font-semibold text-slate-500 block mb-1">Sample Exchange:</span>
                          <p className="italic font-mono text-[11px]">{opt.sampleDialogue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cultural Tip Card */}
            {result.culturalTip && (
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 dark:text-amber-100">Cultural & Social Etiquette Tip</h4>
                  <p className="mt-1 leading-relaxed">{result.culturalTip}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
