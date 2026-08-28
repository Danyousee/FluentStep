import React from 'react';
import { LayoutDashboard, BookOpen, Sparkles, MessageSquare, Flame, User } from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const navButtons: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { id: 'course_generator', label: 'Courses', icon: <Sparkles size={20} className="text-indigo-500" /> },
    { id: 'ai_teacher', label: 'AI Teacher', icon: <MessageSquare size={20} className="text-purple-500" /> },
    { id: 'exam_prep', label: 'Exams', icon: <BookOpen size={20} className="text-amber-500" /> },
    { id: 'daily_challenge', label: 'Daily', icon: <Flame size={20} className="text-orange-500" /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navButtons.map((btn) => {
          const isActive =
            currentView === btn.id ||
            (btn.id === 'vocabulary' && (currentView === 'vocab_lesson' || currentView === 'vocab_practice')) ||
            (btn.id === 'sentence_builder' && currentView === 'sentence_lesson');

          return (
            <button
              key={btn.id}
              id={`mobile_nav_${btn.id}`}
              onClick={() => setCurrentView(btn.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-normal hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {btn.icon}
              <span className="text-[10px] mt-0.5 tracking-tight">{btn.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
