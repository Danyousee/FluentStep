import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  Target,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Play,
  Flame,
  Plus,
  Compass,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateAICourse } from '../services/aiService';
import { GeneratedCourse, UserLevel } from '../types';

export const CourseGeneratorView: React.FC = () => {
  const {
    userProfile,
    generatedCourses,
    saveGeneratedCourse,
    setActiveCourseId,
    setActiveCourseLessonId,
    setCurrentView,
  } = useApp();

  const [prompt, setPrompt] = useState('');
  const [reason, setReason] = useState('Career & Job Interviews');
  const [targetLevel, setTargetLevel] = useState<UserLevel>(userProfile.level || 'B1');
  const [timePerDay, setTimePerDay] = useState('20 mins/day');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [previewCourse, setPreviewCourse] = useState<GeneratedCourse | null>(null);

  const REASONS = [
    { label: 'Career & Job Interviews', icon: '💼' },
    { label: 'Workplace Meetings & Emails', icon: '📊' },
    { label: 'IELTS / TOEFL Exam Prep', icon: '🎯' },
    { label: 'Travel & Global Living', icon: '✈️' },
    { label: 'Academic & University Studies', icon: '🎓' },
    { label: 'Daily Social Fluency', icon: '🗣️' },
    { label: 'Software & Tech Industry', icon: '💻' },
  ];

  const QUICK_TEMPLATES = [
    {
      title: 'English for Tech Standups & PR Reviews',
      prompt: 'I want to speak confidently in daily agile standups, explain pull requests, and discuss architectural decisions with global engineers.',
      reason: 'Software & Tech Industry',
      level: 'B1' as UserLevel,
    },
    {
      title: 'Job Interview Mastery in 3 Weeks',
      prompt: 'I want to ace behavioral interview questions using the STAR method, discuss my strengths, and negotiate my salary politely.',
      reason: 'Career & Job Interviews',
      level: 'B1' as UserLevel,
    },
    {
      title: 'Executive Presentations & Meeting Diplomatic Nuances',
      prompt: 'I need to present data slides to executives, handle difficult questions calmly, and interrupt meetings with polite phrasing.',
      reason: 'Workplace Meetings & Emails',
      level: 'B2' as UserLevel,
    },
    {
      title: 'IELTS Speaking & Writing Band 7.5 Accelerator',
      prompt: 'I need to boost my IELTS speaking fluency, eliminate repetitive vocabulary, and master Task 2 essay structure.',
      reason: 'IELTS / TOEFL Exam Prep',
      level: 'B2' as UserLevel,
    },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = prompt.trim() || 'Comprehensive English mastery tailored to my professional goals';
    setIsGenerating(true);
    setGenerationStep(1);

    const stepTimer1 = setTimeout(() => setGenerationStep(2), 900);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 1900);

    try {
      const result = await generateAICourse({
        prompt: finalPrompt,
        reason,
        level: targetLevel,
        timePerDay,
        targetGoal: finalPrompt,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (result) {
        setPreviewCourse(result);
      } else {
        // Fallback safety handled inside server or default
      }
    } catch (err) {
      console.error('Course generation error:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleStartCourse = (course: GeneratedCourse) => {
    saveGeneratedCourse(course);
    setActiveCourseId(course.id);
    if (course.modules?.[0]?.lessons?.[0]) {
      setActiveCourseLessonId(course.modules[0].lessons[0].id);
    }
    setCurrentView('course_runner');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <Sparkles size={14} className="text-amber-300" />
            <span>AI Curriculum Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Course Generator
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Tell the AI exactly what you want to achieve. In seconds, it will architect a complete, multi-week course with personalized lessons, speaking drills, interactive quizzes, and a graduation certificate.
          </p>
        </div>
      </div>

      {/* Generated Course Preview Modal / Panel */}
      {previewCourse && (
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full mb-2">
                Custom {previewCourse.targetLevel} Curriculum Ready
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {previewCourse.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {previewCourse.description}
              </p>
            </div>
            <button
              onClick={() => handleStartCourse(previewCourse)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] shrink-0"
            >
              <span>Start Course Now</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Duration</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {previewCourse.durationWeeks} Weeks
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Daily Target</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {previewCourse.dailyTimeMinutes} Mins / Day
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Level Target</span>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                CEFR {previewCourse.targetLevel}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Total Lessons</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {previewCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
              </p>
            </div>
          </div>

          {/* Learning Objectives */}
          {previewCourse.learningObjectives && previewCourse.learningObjectives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                What You Will Achieve
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {previewCourse.learningObjectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/50"
                  >
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {obj}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Weekly Course Syllabus
            </h3>
            <div className="space-y-3">
              {previewCourse.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm flex items-center justify-center">
                        W{mod.weekNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {mod.theme}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {mod.lessons.length} lessons
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-indigo-500 shrink-0" />
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            Day {les.dayNumber}: {les.title}
                          </span>
                        </div>
                        <span className="text-slate-400">{les.durationMinutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Generator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleGenerate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            {/* Step 1: Prompt */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                1. What do you want to learn or achieve in English?
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Be as specific as you like (e.g. your role, upcoming interview, meeting challenges, or target exam).
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., I want to speak English fluently in software engineering meetings, explain system designs clearly, and stop hesitating when answering questions from clients."
                rows={3}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Inspiration Cards */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Or pick a popular goal to get started:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(tmpl.prompt);
                      setReason(tmpl.reason);
                      setTargetLevel(tmpl.level);
                    }}
                    className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all group"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {tmpl.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {tmpl.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Reason for Learning */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                2. Primary Reason / Context
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REASONS.map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setReason(r.label)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                      reason === r.label
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    <span className="line-clamp-1">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Target CEFR Level & Time Commitment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                  3. Your Current Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as UserLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTargetLevel(lvl)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        targetLevel === lvl
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                  4. Daily Time Commitment
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['10 mins/day', '20 mins/day', '30 mins/day'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTimePerDay(time)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        timePerDay === time
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {time.replace('/day', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {generationStep === 1
                      ? 'Analyzing goals and level requirements...'
                      : generationStep === 2
                      ? 'Structuring syllabus & daily micro-lessons...'
                      : 'Crafting dialogues & speaking practice drills...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="text-amber-300" />
                  <span>Generate Complete AI Course</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 1 Col: Saved & Active Courses */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <span>My Generated Courses</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {generatedCourses.length} total
              </span>
            </div>

            <div className="space-y-3">
              {generatedCourses.map((course) => {
                const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                const completedLessons = course.modules.reduce(
                  (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
                  0
                );
                const progressPercent =
                  totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {course.targetLevel} • {course.category || 'General'}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1.5 leading-snug">
                          {course.title}
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400 font-medium">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {completedLessons} / {totalLessons} lessons
                      </span>
                      <button
                        onClick={() => handleStartCourse(course)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>Continue</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
              <GraduationCap size={16} />
              <span>Accreditation Guarantee</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Every course created by FluentStep AI follows the 5-step master learning framework: Concept Learn → Examples → Practice Drills → Audio Speaking → Real-Life Roleplay. Complete your final exam to receive a signed Certificate of Achievement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
