import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_GENERATED_COURSES } from '../data/coursesAndExamsData';

export const ContentLibraryView: React.FC = () => {
  const { generatedCourses, setActiveCourseId, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    'All',
    'Career & Workplace',
    'Examination Prep',
    'General Fluency',
    'Grammar & Writing',
  ];

  // Merge built-in library with user's generated courses
  const allCourses = [...generatedCourses];

  const filteredCourses = allCourses.filter((course) => {
    const matchesCat =
      selectedCategory === 'All' ||
      course.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEnroll = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentView('course_runner');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <BookOpen size={14} className="text-amber-300" />
            <span>Comprehensive Curriculum Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Curriculum Library
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Browse expertly structured English learning tracks for executive business, academic writing, and everyday conversational mastery.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('course_generator')}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 text-xs transition-all shrink-0"
        >
          <Sparkles size={16} className="text-amber-300" />
          <span>Generate Custom AI Course</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {course.targetLevel} • {course.durationWeeks} Weeks
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {course.modules.length} Modules
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              <div className="space-y-1 pt-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Highlights:</p>
                <div className="space-y-1">
                  {course.modules.slice(0, 2).map((m, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate"
                    >
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span className="truncate">{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Award size={14} />
                <span>Certificate Included</span>
              </span>

              <button
                onClick={() => handleEnroll(course.id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all group-hover:scale-[1.03]"
              >
                <span>Start Learning</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
