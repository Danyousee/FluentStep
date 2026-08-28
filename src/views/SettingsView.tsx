import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Moon,
  Sun,
  Laptop,
  Sparkles,
  Download,
  Trash2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, userProfile, updateProfile } = useApp();

  const [soundEffects, setSoundEffects] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState<'0.8' | '1.0' | '1.2'>('1.0');
  const [accent, setAccent] = useState<'US' | 'UK'>('US');
  const [tutorStyle, setTutorStyle] = useState<'friendly' | 'academic'>('friendly');
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const handleExportData = () => {
    const backup = {
      profile: userProfile,
      exportedAt: new Date().toISOString(),
      app: 'FluentStep English AI',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluentstep_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your local progress? This action cannot be undone.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <Settings size={16} />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
          Settings & Tutor Tuning
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Customize pronunciation audio speed, theme, and AI tutor feedback behavior.
        </p>
      </div>

      {/* Appearance */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Display Theme
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (theme === 'dark') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 font-bold'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700'
            }`}
          >
            <Sun size={20} className="text-amber-500" />
            <div>
              <span className="block text-sm">Light Mode</span>
              <span className="text-[11px] opacity-70 font-normal">Crisp & high contrast</span>
            </div>
          </button>

          <button
            onClick={() => {
              if (theme === 'light') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Moon size={20} className="text-indigo-400" />
            <div>
              <span className="block text-sm">Dark Mode</span>
              <span className="text-[11px] opacity-70 font-normal">Deep focus canvas</span>
            </div>
          </button>
        </div>
      </div>

      {/* Audio & Pronunciation Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Volume2 size={18} className="text-emerald-600" />
          <span>Speech & Sound Options</span>
        </h3>

        {/* Speed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block">
            Speech Pronunciation Speed:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: '0.8', label: '0.8x (Beginner Slow)' },
              { id: '1.0', label: '1.0x (Standard Native)' },
              { id: '1.2', label: '1.2x (Fast Conversational)' },
            ].map((spd) => (
              <button
                key={spd.id}
                onClick={() => setSpeechSpeed(spd.id as any)}
                className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  speechSpeed === spd.id
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block">
            English Accent Variety:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'US', label: '🇺🇸 American English (General US)' },
              { id: 'UK', label: '🇬🇧 British English (RP / Standard UK)' },
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => setAccent(acc.id as any)}
                className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  accent === acc.id
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tutor Style */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600" />
          <span>AI Tutor Teaching Personality</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setTutorStyle('friendly')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              tutorStyle === 'friendly'
                ? 'bg-purple-50 dark:bg-purple-950 border-purple-500 text-purple-950 dark:text-purple-200 font-bold'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <span className="block text-sm">🌱 Warm & Encouraging</span>
            <span className="text-xs font-normal opacity-80 mt-0.5 block">
              Praises effort, gentle suggestions, conversational feedback.
            </span>
          </button>

          <button
            onClick={() => setTutorStyle('academic')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              tutorStyle === 'academic'
                ? 'bg-purple-50 dark:bg-purple-950 border-purple-500 text-purple-950 dark:text-purple-200 font-bold'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <span className="block text-sm">🎯 Precise & Detailed</span>
            <span className="text-xs font-normal opacity-80 mt-0.5 block">
              Focuses strictly on syntactic rules, collocations, and nuances.
            </span>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Data & Local Storage
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="px-5 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 transition-all"
          >
            {exportedSuccess ? (
              <>
                <Check size={16} className="text-emerald-600" />
                <span>Exported Successfully!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Export Progress JSON Backup</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetData}
            className="px-5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 size={16} />
            <span>Reset All Learning Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
