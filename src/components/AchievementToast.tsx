import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Award, Trophy, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AchievementToast: React.FC = () => {
  const { activeToast, dismissToast } = useApp();

  if (!activeToast) return null;

  const iconMap = {
    xp: <Zap className="text-amber-500 fill-amber-400" size={22} />,
    badge: <Trophy className="text-yellow-500 fill-yellow-400" size={22} />,
    level: <Award className="text-emerald-500 fill-emerald-400" size={22} />,
    info: <CheckCircle2 className="text-blue-500" size={22} />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.22 }}
        className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 flex items-start gap-3.5"
      >
        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
          {iconMap[activeToast.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {activeToast.title}
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
            {activeToast.desc}
          </p>
        </div>
        <button
          id="btn_toast_dismiss"
          onClick={dismissToast}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
