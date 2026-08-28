import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Sparkles,
  BookOpen,
  MessageSquare,
  Volume2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LifeCurriculum, LifeCurriculumModule } from '../types';
import { generateLifeCurriculum } from '../services/aiService';
import { soundService } from '../services/soundService';

const PRESET_CAREERS = [
  {
    id: 'tech',
    title: 'Software & Tech',
    description: 'Daily standups, sprint planning, PR reviews & technical discussions.',
    goal: 'Present technical updates smoothly in standups and client calls.',
    level: 'B1',
  },
  {
    id: 'business',
    title: 'Business & Management',
    description: 'Negotiations, client pitches, leadership updates & strategy meetings.',
    goal: 'Lead executive meetings with persuasive and polite authority.',
    level: 'B2',
  },
  {
    id: 'hospitality',
    title: 'Hospitality & Customer Service',
    description: 'Greeting guests, resolving complaints, providing directions & bookings.',
    goal: 'Provide exceptional customer care with warm, natural English.',
    level: 'A2',
  },
  {
    id: 'daily_expat',
    title: 'Living Abroad & Daily Life',
    description: 'Renting an apartment, opening a bank account, doctor visits & supermarket.',
    goal: 'Navigate everyday life in an English-speaking country with zero fear.',
    level: 'A2',
  },
];

export const EnglishForMyLifeView: React.FC = () => {
  const { userProfile, addXP } = useApp();

  const [customProfession, setCustomProfession] = useState<string>('Software Engineer');
  const [customGoal, setCustomGoal] = useState<string>('Communicate clearly in team standups and architectural reviews');
  const [customLevel, setCustomLevel] = useState<string>(userProfile.level || 'B1');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [curriculum, setCurriculum] = useState<LifeCurriculum | null>(() => {
    const saved = localStorage.getItem('fluentstep_life_curriculum');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [activeModuleId, setActiveModuleId] = useState<string>('');

  const handleGenerate = async (prof?: string, goal?: string, lvl?: string) => {
    const professionToUse = prof || customProfession;
    const goalToUse = goal || customGoal;
    const levelToUse = lvl || customLevel;

    setIsGenerating(true);
    soundService.playClick();

    const result = await generateLifeCurriculum({
      profession: professionToUse,
      goal: goalToUse,
      userLevel: levelToUse,
    });

    if (result) {
      setCurriculum(result);
      setActiveModuleId(result.modules[0]?.id || '');
      localStorage.setItem('fluentstep_life_curriculum', JSON.stringify(result));
      soundService.playFanfare();
      addXP(30, 'Generated Custom Life Curriculum!');
    }
    setIsGenerating(false);
  };

  const handleSelectPreset = (preset: typeof PRESET_CAREERS[0]) => {
    setCustomProfession(preset.title);
    setCustomGoal(preset.goal);
    setCustomLevel(preset.level);
    handleGenerate(preset.title, preset.goal, preset.level);
  };

  const activeModule = curriculum?.modules.find((m) => m.id === activeModuleId) || curriculum?.modules[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-blue-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            Hyper-Personalized Curriculum
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            English For My Life & Career
          </h1>
          <p className="text-blue-100/90 text-sm max-w-2xl leading-relaxed">
            Generate a personalized curriculum built specifically around your actual profession, life objectives, and daily conversational needs.
          </p>
        </div>
      </div>

      {/* Preset Fast Picks */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Or Quick Pick an Industry Focus:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CAREERS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-pointer transition-all space-y-1 shadow-sm"
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{preset.level}</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{preset.title}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{preset.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Generator Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
        <div className="text-sm font-bold text-slate-900 dark:text-white">
          Customize Your Learning Domain
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Your Profession / Life Role
            </label>
            <input
              type="text"
              value={customProfession}
              onChange={(e) => setCustomProfession(e.target.value)}
              placeholder="e.g. UX Designer, Chef, Accountant..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Primary Goal or Daily Situations
            </label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="e.g. Talk with international clients on Zoom..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Target CEFR Level
            </label>
            <select
              value={customLevel}
              onChange={(e) => setCustomLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Architecting Personalized Curriculum with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate My Tailored Curriculum</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Modules View */}
      {curriculum && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Modules List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Curriculum Modules ({curriculum.modules.length})
            </div>

            <div className="space-y-2.5">
              {curriculum.modules.map((mod, idx) => {
                const isSelected = (activeModule?.id || curriculum.modules[0].id) === mod.id;
                return (
                  <div
                    key={mod.id || idx}
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                        Module {idx + 1}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {mod.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {mod.situation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Deep Dive Content */}
          <div className="lg:col-span-7">
            {activeModule && (
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm"
              >
                <div className="space-y-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                    Target Situation
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeModule.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeModule.situation}
                  </p>
                </div>

                {/* Useful Real-Life Phrases */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Situational Phrases
                  </div>
                  <div className="space-y-2">
                    {activeModule.usefulPhrases.map((phrase, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs flex items-center justify-between gap-3"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">
                          "{phrase}"
                        </span>
                        <button
                          onClick={() => soundService.speak(phrase)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialized Vocab Words */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Domain Vocabulary
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeModule.targetVocabulary.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                      >
                        <div className="font-bold text-blue-600 dark:text-blue-400">{v.word}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">{v.meaning}</div>
                        <div className="text-[10px] text-slate-400 italic">"{v.example}"</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Scenario Simulation Prompt */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Practical Application Challenge:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Practice saying these sentences out loud as if you were in the middle of this exact meeting or conversation. Focus on smooth intonation and pausing at natural comma boundaries.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
