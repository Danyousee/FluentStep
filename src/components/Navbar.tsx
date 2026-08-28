import React from 'react';
import { Flame, Zap, Award, Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { userStats, userProfile, updateProfile, setSearchOpen, setCurrentView } = useApp();

  const toggleTheme = () => {
    const nextTheme = userProfile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 w-full h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm hidden md:block">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          <Search size={16} />
        </span>
        <input
          id="nav_search_input"
          type="text"
          readOnly
          onClick={() => setSearchOpen(true)}
          placeholder="Search words, grammar, topics..."
          className="w-full pl-10 pr-12 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 cursor-pointer border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 dark:text-slate-200 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-400">
          ⌘K
        </kbd>
      </div>

      {/* Brand fallback on mobile */}
      <div
        className="flex md:hidden items-center gap-2 cursor-pointer"
        onClick={() => setCurrentView('dashboard')}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base">
          L
        </div>
        <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
          LingoFlow
        </span>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3 sm:gap-5 ml-auto">
        {/* Mobile Search Button */}
        <button
          id="nav_mobile_search_btn"
          onClick={() => setSearchOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Search size={18} />
        </button>

        {/* Streak Badge */}
        <div
          title={`${userStats.streakDays} Day Learning Streak!`}
          className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 px-3.5 py-1.5 rounded-full border border-orange-100 dark:border-orange-800/60 text-orange-700 dark:text-orange-400 font-bold text-xs sm:text-sm shadow-xs"
        >
          <Flame size={16} className="fill-orange-500 text-orange-500 animate-pulse" />
          <span>{userStats.streakDays} Day Streak</span>
        </div>

        {/* XP Badge */}
        <div
          title={`${userStats.xp} Total XP`}
          className="hidden sm:flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs shadow-xs"
        >
          <Zap size={14} className="fill-indigo-500 text-indigo-500" />
          <span>{userStats.xp} XP</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="nav_theme_toggle_btn"
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {userProfile.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile Chip */}
        <button
          id="nav_profile_chip"
          onClick={() => setCurrentView('profile')}
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-xs overflow-hidden flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-200">
            {userProfile.avatar || '🎓'}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold leading-none text-slate-800 dark:text-slate-100">
              {userProfile.name}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight mt-0.5">
              {userProfile.level} • Fluent
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
