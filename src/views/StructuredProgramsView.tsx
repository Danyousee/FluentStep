import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StructuredProgramsView: React.FC = () => {
  const { structuredPrograms, completeProgramDay, setCurrentView, setActiveCourseId } = useApp();

  const [activeProgramId, setActiveProgramId] = useState<string>(
    structuredPrograms[0]?.id || 'prog_30_fluency'
  );

  const selectedProgram =
    structuredPrograms.find((p) => p.id === activeProgramId) || structuredPrograms[0];

  const completedDaysCount =
    selectedProgram?.days.filter((d) => d.completed).length || 0;
  const progressPercent = selectedProgram
    ? Math.round((completedDaysCount / selectedProgram.days.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <Flame size={14} className="text-amber-400" />
            <span>Daily Habit & Structured Roadmaps</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Structured English Programs
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm">
            Disciplined 30, 60, and 90-day daily training schedules designed to build lifelong speaking fluency through consistent, bite-sized daily execution.
          </p>
        </div>
      </div>

      {/* Program Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {structuredPrograms.map((prog) => {
          const isSelected = prog.id === activeProgramId;
          const completedCount = prog.days.filter((d) => d.completed).length;
          const pct = Math.round((completedCount / prog.days.length) * 100);

          return (
            <button
              key={prog.id}
              onClick={() => setActiveProgramId(prog.id)}
              className={`p-5 rounded-3xl border text-left transition-all space-y-3 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-lg shadow-indigo-600/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {prog.durationDays} Days • {prog.targetLevel}
                </span>
                <span className="text-xs font-bold text-slate-400">{prog.dailyMinutes}m / day</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prog.description}</p>
              </div>

              {/* Mini progress bar */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Program Timeline */}
      {selectedProgram && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {selectedProgram.title} Timeline
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Completed {completedDaysCount} of {selectedProgram.days.length} daily milestones
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('ai_teacher')}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl"
              >
                Practice with AI Tutor
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedProgram.days.map((day) => (
              <div
                key={day.dayNumber}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  day.completed
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Day {day.dayNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {day.focusSkill} • {day.estimatedMinutes}m
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {day.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{day.taskDescription}</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => completeProgramDay(selectedProgram.id, day.dayNumber)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      day.completed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>{day.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('course_generator')}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Open Lesson →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
