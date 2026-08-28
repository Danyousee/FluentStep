import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Volume2,
  AlertCircle,
  CheckCircle2,
  Compass,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_ENGLISH_COMPARISONS } from '../data/regionalDifferencesData';
import { NigerianEnglishComparison } from '../types';
import { soundService } from '../services/soundService';

export const CommonDifferencesView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Phrasing', 'Grammar', 'Vocabulary'];

  const filtered = NIGERIAN_ENGLISH_COMPARISONS.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  return (
    <div id="regional-differences-container" className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nigerian & Global English Expressions</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Understand the nuances between regional Nigerian English expressions and International Standard English for global meetings, exams, and travel.
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.category}
                </span>
                <button
                  onClick={() => soundService.speak(item.internationalStandard)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Listen international standard"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Regional vs Standard */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl">
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 block mb-0.5 uppercase font-bold">
                    📍 Common Regional Expression:
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    "{item.regionalPhrase}"
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-xl">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block mb-0.5 uppercase font-bold">
                    🌍 International Standard:
                  </span>
                  <p className="font-bold text-emerald-950 dark:text-emerald-200">
                    "{item.internationalStandard}"
                  </p>
                </div>
              </div>

              {/* Cultural & Linguistic Explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                💡 {item.explanation}
              </p>

              <div className="text-[11px] text-slate-500 italic">
                {item.contextExample}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
