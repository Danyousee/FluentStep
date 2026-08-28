import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  Volume2,
  ArrowRight,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  expandSentenceWithAI,
  transformSentenceWithAI,
  SentenceExpansionResponseData,
  SentenceTransformationResponseData,
} from '../services/aiService';
import { soundService } from '../services/soundService';

const PRESET_EXPANSIONS = [
  { subject: 'I', verb: 'learn', object: 'English' },
  { subject: 'She', verb: 'drinks', object: 'coffee' },
  { subject: 'They', verb: 'play', object: 'football' },
  { subject: 'David', verb: 'reads', object: 'books' },
  { subject: 'We', verb: 'cook', object: 'dinner' },
];

const PRESET_TRANSFORMATIONS = [
  'I study English every day.',
  'She works at the hospital.',
  'They travel to London by train.',
  'He drinks tea in the morning.',
];

export const SentenceExpansionView: React.FC = () => {
  const { addXP } = useApp();
  const [activeTab, setActiveTab] = useState<'expand' | 'transform'>('expand');

  // Expander State
  const [customSubject, setCustomSubject] = useState('I');
  const [customVerb, setCustomVerb] = useState('study');
  const [customObject, setCustomObject] = useState('English');
  const [isExpanding, setIsExpanding] = useState(false);
  const [expansionResult, setExpansionResult] = useState<SentenceExpansionResponseData | null>(null);

  // Transformer State
  const [baseSentence, setBaseSentence] = useState('I study English every day.');
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationResult, setTransformationResult] = useState<SentenceTransformationResponseData | null>(null);

  const handleRunExpansion = async (s?: string, v?: string, o?: string) => {
    const sub = s || customSubject.trim();
    const vrb = v || customVerb.trim();
    const obj = o || customObject.trim();
    if (!sub || !vrb) return;

    setIsExpanding(true);
    try {
      const data = await expandSentenceWithAI({
        baseSubject: sub,
        baseVerb: vrb,
        baseObject: obj,
      });
      setExpansionResult(data);
      addXP(15, 'Expanded English sentence structure step-by-step');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleRunTransformation = async (sent?: string) => {
    const s = sent || baseSentence.trim();
    if (!s) return;

    setIsTransforming(true);
    try {
      const data = await transformSentenceWithAI(s);
      setTransformationResult(data);
      addXP(15, 'Practiced grammar sentence transformations');
      soundService.playPop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div id="sentence-expansion-container" className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sentence Expansion & Transformation</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Master natural English word order by building sentences layer by layer, and transforming them effortlessly.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('expand');
                if (!expansionResult) handleRunExpansion();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'expand'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Step-by-Step Expander
            </button>
            <button
              onClick={() => {
                setActiveTab('transform');
                if (!transformationResult) handleRunTransformation();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transform'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Grammar Transformer
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'expand' ? (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Choose or Type a Base Sentence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Subject (Who)
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g. I, She, The teacher"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Verb (Action)
                </label>
                <input
                  type="text"
                  value={customVerb}
                  onChange={(e) => setCustomVerb(e.target.value)}
                  placeholder="e.g. study, read, cook"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  Object (What)
                </label>
                <input
                  type="text"
                  value={customObject}
                  onChange={(e) => setCustomObject(e.target.value)}
                  placeholder="e.g. English, a book, dinner"
                  className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-slate-400 mr-1">Presets:</span>
                {PRESET_EXPANSIONS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCustomSubject(preset.subject);
                      setCustomVerb(preset.verb);
                      setCustomObject(preset.object);
                      handleRunExpansion(preset.subject, preset.verb, preset.object);
                    }}
                    className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {preset.subject} + {preset.verb} + {preset.object}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleRunExpansion()}
                disabled={isExpanding}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                {isExpanding ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Expanding...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Expand to Level 5
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expansion Result Steps */}
          {expansionResult && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Progressive Layers for: <span className="text-indigo-600 dark:text-indigo-400">{expansionResult.title}</span>
              </h3>

              <div className="space-y-3">
                {expansionResult.steps.map((step) => {
                  let stepBadgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                  if (step.stepNumber === 2) stepBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                  if (step.stepNumber === 3) stepBadgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
                  if (step.stepNumber === 4) stepBadgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                  if (step.stepNumber === 5) stepBadgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

                  return (
                    <motion.div
                      key={step.stepNumber}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.stepNumber * 0.08 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${stepBadgeColor}`}>
                            Level {step.stepNumber}: {step.structureName}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            + Added: <span className="font-semibold text-slate-700 dark:text-slate-200">"{step.addedComponent}"</span> ({step.componentRole})
                          </span>
                        </div>

                        <p className="text-base font-bold text-slate-900 dark:text-white">
                          "{step.sentence}"
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          💡 {step.explanation}
                        </p>
                      </div>

                      <button
                        onClick={() => soundService.speak(step.sentence)}
                        className="p-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-2xl shrink-0 transition-colors self-start md:self-center"
                        title="Listen sentence"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Transformer Tab */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Enter Any English Sentence to Transform
            </h2>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={baseSentence}
                onChange={(e) => setBaseSentence(e.target.value)}
                placeholder="e.g. I study English every day."
                className="flex-1 p-3.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleRunTransformation()}
              />
              <button
                onClick={() => handleRunTransformation()}
                disabled={isTransforming || !baseSentence.trim()}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                {isTransforming ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" />
                    Transform Sentence
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1">Examples:</span>
              {PRESET_TRANSFORMATIONS.map((sent, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBaseSentence(sent);
                    handleRunTransformation(sent);
                  }}
                  className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  "{sent}"
                </button>
              ))}
            </div>
          </div>

          {/* Transformation Results */}
          {transformationResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transformationResult.transformations.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                        {item.type}
                      </span>
                      <button
                        onClick={() => soundService.speak(item.transformedSentence)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      "{item.transformedSentence}"
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {item.ruleExplanation}
                    </p>

                    <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Formula: {item.formula}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
