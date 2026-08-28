import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Mic,
  PenTool,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAM_DASHBOARD_DATA } from '../data/coursesAndExamsData';
import { ExamType } from '../types';

export const ExamPrepView: React.FC = () => {
  const { selectedExamType, setSelectedExamType, startMockTest, setCurrentView } = useApp();

  const exams: { id: ExamType; label: string; badge: string }[] = [
    { id: 'IELTS_ACADEMIC', label: 'IELTS Academic', badge: 'Band 7.5+' },
    { id: 'IELTS_GENERAL', label: 'IELTS General', badge: 'Band 8.0+' },
    { id: 'TOEFL', label: 'TOEFL iBT', badge: '100+ Score' },
    { id: 'WAEC', label: 'WAEC / WASSCE', badge: 'A1 Distinction' },
    { id: 'NECO', label: 'NECO SSCE', badge: 'Distinction' },
    { id: 'JAMB', label: 'JAMB UTME', badge: '85+ / 100' },
    { id: 'GENERAL_PROFICIENCY', label: 'CEFR Benchmark', badge: 'C1 Target' },
  ];

  const currentData = EXAM_DASHBOARD_DATA[selectedExamType] || EXAM_DASHBOARD_DATA['IELTS_ACADEMIC'];

  const handleLaunchMock = () => {
    startMockTest(selectedExamType);
    setCurrentView('mock_exam');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/20">
            <Award size={14} className="text-amber-300" />
            <span>AI Exam Preparation & Diagnostic Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Exam Preparation
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Prepare for international certifications and national secondary examinations with realistic timed mock exams, AI speaking scoring, and essay feedback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCurrentView('speaking_assessment')}
            className="px-4 py-2.5 bg-indigo-600/40 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400/30 flex items-center gap-2 transition-all"
          >
            <Mic size={14} />
            <span>Speaking Test</span>
          </button>
          <button
            onClick={() => setCurrentView('writing_assessment')}
            className="px-4 py-2.5 bg-purple-600/40 hover:bg-purple-600 text-white font-bold text-xs rounded-xl border border-purple-400/30 flex items-center gap-2 transition-all"
          >
            <PenTool size={14} />
            <span>Writing Test</span>
          </button>
        </div>
      </div>

      {/* Exam Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {exams.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedExamType(ex.id)}
            className={`px-4 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedExamType === ex.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{ex.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedExamType === ex.id
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {ex.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Exam Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Overview, Metrics & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {currentData.tag}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
                  {currentData.name}
                </h2>
                <p className="text-xs text-slate-500">{currentData.subtitle}</p>
              </div>

              <button
                onClick={handleLaunchMock}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.02] shrink-0"
              >
                <span>Launch Timed Mock Test</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Score Band Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                <span className="text-xs font-bold text-slate-400 uppercase">Target Score</span>
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                  {currentData.targetScoreOrBand}
                </p>
                <span className="text-[11px] text-slate-500">Benchmark goal</span>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Current AI Diagnostic Estimate
                </span>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {currentData.currentEstimate}
                </p>
                <span className="text-[11px] text-slate-500">Based on recent practice</span>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skill Mastery Breakdown
              </h3>
              <div className="space-y-3">
                {currentData.skillBreakdown.map((sb, sIdx) => {
                  const percent = Math.round((sb.numericScore / sb.maxScore) * 100);
                  return (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{sb.skill}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{sb.score}</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            sb.status === 'strong'
                              ? 'bg-emerald-500'
                              : sb.status === 'developing'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Target Recommendations
              </h3>
              <div className="space-y-2">
                {currentData.recommendations.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Disclaimers */}
        <div className="space-y-6">
          {/* Assessment Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span>Diagnostic Assessment Tools</span>
            </h3>

            <div
              onClick={() => setCurrentView('speaking_assessment')}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <Mic size={16} />
                <span>AI Speaking Assessment</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Record a 2-minute response and get instant CEFR & IELTS band breakdown.
              </p>
            </div>

            <div
              onClick={() => setCurrentView('writing_assessment')}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                <PenTool size={16} />
                <span>AI Writing Assessment</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Submit an essay or report to receive lexical, grammatical & coherence scoring.
              </p>
            </div>
          </div>

          {/* AI Compliance & Academic Transparency Notice */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-xs">
              <ShieldCheck size={16} className="text-indigo-500" />
              <span>Academic Transparency Note</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {currentData.disclaimer} All mock exams, diagnostic bands, and questions are generated by FluentStep AI algorithms for structured self-study and learning benchmarking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
