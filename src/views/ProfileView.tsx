import React, { useState } from 'react';
import {
  User,
  Award,
  Flame,
  Zap,
  Target,
  Edit2,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserLevel } from '../types';
import { PlacementTestModal } from '../components/PlacementTestModal';

export const ProfileView: React.FC = () => {
  const { userProfile, userStats, updateProfile, setUserLevel } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [placementOpen, setPlacementOpen] = useState(false);

  const availableAvatars = ['🎓', '🦁', '🦉', '🚀', '🌟', '👨‍💻', '👩‍🏫', '🌍'];

  const learningGoalOptions = [
    'Speak fluently in everyday conversations',
    'Understand spoken English and movies without subtitles',
    'Write professional business emails and reports',
    'Prepare for job interviews and exams (IELTS/TOEFL)',
    'Expand advanced vocabulary and idioms',
    'Improve English sentence structure and grammar',
  ];

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfile({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const handleToggleGoal = (goal: string) => {
    const current = userProfile.goals || [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    updateProfile({ goals: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-4xl shrink-0 shadow-md">
              {userProfile.avatar || '🎓'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border text-base font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 rounded-xl bg-emerald-600 text-white"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {userProfile.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  <span>Joined {userProfile.joinedDate}</span>
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-600">
                  Level {userProfile.level}
                </span>
              </div>
            </div>
          </div>

          <button
            id="profile_btn_retake_test"
            onClick={() => setPlacementOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Award size={15} />
            <span>Retake Placement Test</span>
          </button>
        </div>

        {/* Change Avatar Selector */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            Choose Your Avatar:
          </span>
          <div className="flex flex-wrap gap-2">
            {availableAvatars.map((av) => (
              <button
                key={av}
                onClick={() => updateProfile({ avatar: av })}
                className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-all ${
                  userProfile.avatar === av
                    ? 'bg-emerald-600 text-white scale-110 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Level Setting */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Current English CEFR Proficiency Level
        </h3>
        <p className="text-xs text-zinc-500">
          Set your current level to adjust AI vocabulary difficulty and tutor responses:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['Beginner', 'A1', 'A2', 'B1', 'B2', 'C1'] as UserLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setUserLevel(lvl)}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                userProfile.level === lvl
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md shadow-emerald-600/20'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
              }`}
            >
              <span className="block text-sm">{lvl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Target className="text-emerald-600" size={20} />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Personal English Goals
          </h3>
        </div>
        <p className="text-xs text-zinc-500">
          Select what you want to achieve with FluentStep:
        </p>

        <div className="space-y-2">
          {learningGoalOptions.map((goal, idx) => {
            const isSelected = (userProfile.goals || []).includes(goal);

            return (
              <button
                key={idx}
                onClick={() => handleToggleGoal(goal)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                }`}
              >
                <span>{goal}</span>
                {isSelected && <Check size={16} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <PlacementTestModal isOpen={placementOpen} onClose={() => setPlacementOpen(false)} />
    </div>
  );
};
