import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Mic,
  MessageSquare,
  Award,
  Zap,
  ChevronRight,
  TrendingUp,
  Target,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';
import { LearningRoadmap, RoadmapDay, RoadmapTask } from '../types';
import { generateDefaultRoadmap } from '../data/roadmapData';
import { generateAIRoadmap } from '../services/aiService';
import { soundService } from '../services/soundService';

export const RoadmapView: React.FC = () => {
  const { userProfile, userStats, setCurrentView, addXP, setSelectedConversationId } = useApp();

  const [roadmap, setRoadmap] = useState<LearningRoadmap>(() => {
    const saved = localStorage.getItem('fluentstep_roadmap');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const weakList = (userStats.weakAreas || []).map((w) => w.topic);
    return generateDefaultRoadmap((userProfile.level || 'A1') as any, weakList);
  });

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(4);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('fluentstep_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  // Calculate overall completion
  const allDays: RoadmapDay[] = roadmap.weeks.flatMap((w) => w.days);
  const completedDaysCount = allDays.filter((d) => d.completed).length;
  const totalDays = allDays.length || 28;
  const progressPercent = Math.round((completedDaysCount / totalDays) * 100);

  const currentDay = allDays.find((d) => d.dayNumber === selectedDayNumber) || allDays[0];

  const handleToggleTask = (dayNumber: number, taskId: string) => {
    setRoadmap((prev) => {
      const updatedWeeks = prev.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) => {
          if (d.dayNumber !== dayNumber) return d;
          const updatedTasks = d.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          const allComplete = updatedTasks.every((t) => t.completed);
          return {
            ...d,
            tasks: updatedTasks,
            completed: allComplete,
          };
        }),
      }));
      return { ...prev, weeks: updatedWeeks };
    });

    const task = currentDay?.tasks.find((t) => t.id === taskId);
    if (!task?.completed) {
      soundService.playSuccess();
      addXP(15, 'Completed Roadmap Task!');
    }
  };

  const handleToggleDayComplete = (dayNumber: number) => {
    setRoadmap((prev) => {
      const updatedWeeks = prev.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) => {
          if (d.dayNumber !== dayNumber) return d;
          const willComplete = !d.completed;
          const updatedTasks = d.tasks.map((t) => ({ ...t, completed: willComplete }));
          return {
            ...d,
            completed: willComplete,
            tasks: updatedTasks,
          };
        }),
      }));
      return { ...prev, weeks: updatedWeeks };
    });

    if (!currentDay.completed) {
      soundService.playFanfare();
      addXP(currentDay.xpReward || 35, `Mastered Day ${dayNumber} Curriculum!`);
    }
  };

  const handleNavigateTask = (task: RoadmapTask) => {
    if (task.targetNav.id && task.targetNav.page === 'conversation') {
      setSelectedConversationId(task.targetNav.id);
    }
    setCurrentView(task.targetNav.page as AppView);
  };

  const handleRegenerateAIRoadmap = async () => {
    setIsRegenerating(true);
    const weakList = (userStats.weakAreas || []).map((w) => w.topic);
    const result = await generateAIRoadmap({
      userLevel: userProfile.level || 'A1',
      goals: userProfile.goals || ['Speak fluently', 'Everyday communication'],
      weakAreas: weakList,
    });

    if (result && result.weeks) {
      setRoadmap(result);
      soundService.playFanfare();
      addXP(25, 'Generated Customized AI Roadmap!');
    } else {
      const fallback = generateDefaultRoadmap((userProfile.level || 'A1') as any, weakList);
      setRoadmap(fallback);
    }
    setIsRegenerating(false);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'vocab':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'speaking':
        return <Mic className="w-4 h-4 text-amber-500" />;
      case 'conversation':
      case 'mission':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'review':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Personalized 30-Day Blueprint
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {roadmap.planTitle || 'Your 30-Day English Roadmap'}
            </h1>
            <p className="text-indigo-200/90 text-sm max-w-2xl leading-relaxed">
              {roadmap.adaptiveNotes ||
                `Calibrated specifically for Level ${userProfile.level}. Target daily milestones to transition from passive knowledge to active speaking fluency.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-md min-w-[170px]">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Total Completion</span>
                <span className="font-bold text-white">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>{completedDaysCount} of {totalDays} Days Complete</span>
              </div>
            </div>

            <button
              onClick={handleRegenerateAIRoadmap}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Optimizing AI Plan...' : 'Recalibrate Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {roadmap.weeks.map((week) => {
          const isSelected = selectedWeek === week.weekNumber;
          const weekDone = week.days.every((d) => d.completed);
          const doneCount = week.days.filter((d) => d.completed).length;

          return (
            <button
              key={week.weekNumber}
              onClick={() => {
                setSelectedWeek(week.weekNumber);
                setSelectedDayNumber(week.days[0].dayNumber);
              }}
              className={`flex-1 min-w-[200px] p-4 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                  WEEK {week.weekNumber}
                </span>
                {weekDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">{doneCount}/7 Days</span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {week.title.split(':')[1] || week.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Week Theme & Focus */}
      {(() => {
        const currentWeekObj = roadmap.weeks.find((w) => w.weekNumber === selectedWeek) || roadmap.weeks[0];
        return (
          <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Week {currentWeekObj.weekNumber} Focus
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">{currentWeekObj.theme}</div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentWeekObj.focusSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Main Day Grid and Day Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Days Navigation Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Schedule for Week {selectedWeek}</span>
            <span className="text-xs text-slate-500 font-normal">Select a day to view tasks</span>
          </div>

          <div className="space-y-2.5">
            {roadmap.weeks
              .find((w) => w.weekNumber === selectedWeek)
              ?.days.map((day) => {
                const isSelected = selectedDayNumber === day.dayNumber;
                return (
                  <motion.div
                    key={day.dayNumber}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                        : day.completed
                        ? 'bg-white dark:bg-slate-800/90 border-emerald-200 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : day.completed
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          D{day.dayNumber}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {day.title}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            {day.tasks.length} learning activities • +{day.xpReward} XP
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {day.completed ? (
                          <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                        ) : (
                          <Circle className={`w-5 h-5 ${isSelected ? 'text-indigo-200' : 'text-slate-300 dark:text-slate-600'}`} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* Selected Day Details & Interactive Tasks */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDay.dayNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Day {currentDay.dayNumber} Curriculum
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {currentDay.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                    {currentDay.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleDayComplete(currentDay.dayNumber)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-all shrink-0 ${
                    currentDay.completed
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {currentDay.completed ? 'Completed' : 'Mark Day Done'}
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Action Items & Guided Exercises</span>
                  <span>
                    {currentDay.tasks.filter((t) => t.completed).length} / {currentDay.tasks.length} Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {currentDay.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        task.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleTask(currentDay.dayNumber, task.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {getTaskIcon(task.type)}
                            <span
                              className={`text-sm font-semibold ${
                                task.completed
                                  ? 'text-slate-500 dark:text-slate-400 line-through'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {task.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleNavigateTask(task)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1.5 transition-all shrink-0"
                        >
                          <span>Start</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus Encouragement & AI Coach Recommendation */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Coach Alex's Daily Advice:</span>
                  <span>
                    Speak every sentence out loud twice — once at normal speed, and once exaggerating the pronunciation and sentence melody.
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
