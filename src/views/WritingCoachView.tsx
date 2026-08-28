import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { analyzeWritingWithAICoach, WritingCoachAnalysisData } from '../services/aiService';
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Layers,
  Mail,
  MessageSquare,
  FileText,
  Briefcase,
  GraduationCap,
  Volume2,
} from 'lucide-react';

interface WritingCoachViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

const WRITING_TEMPLATES = [
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    placeholder: 'Write an email to a colleague, client, or professor (e.g. requesting time off, asking for a meeting, following up on a project)...',
    sample: 'Hi John, I am writing this to ask if we can have a meeting tomorrow at 2 PM to talk about the project. Let me know if you are free.',
  },
  {
    id: 'message',
    label: 'Casual Chat / Message',
    icon: MessageSquare,
    placeholder: 'Write a quick message to a friend or teammate (e.g. asking to hang out, explaining why you are late)...',
    sample: 'Hey bro, sorry for delay, heavy traffic on highway. I will reach in 15 mins.',
  },
  {
    id: 'job_application',
    label: 'Job Application / Cover Letter',
    icon: Briefcase,
    placeholder: 'Draft a short cover letter paragraph or introduction to a hiring manager...',
    sample: 'Dear Sir, I am writing to apply for the software engineer position. I have 3 years experience and I am very hard worker who wants to work in your company.',
  },
  {
    id: 'essay',
    label: 'Essay / Academic',
    icon: GraduationCap,
    placeholder: 'Write an essay paragraph expressing an opinion or arguing a point...',
    sample: 'In my opinion, technology has many advantages for students. It help them learn faster and find information easily on internet.',
  },
];

export const WritingCoachView: React.FC<WritingCoachViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('email');
  const [inputText, setInputText] = useState<string>(WRITING_TEMPLATES[0].sample);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<WritingCoachAnalysisData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentTemplate = WRITING_TEMPLATES.find((t) => t.id === selectedFormat) || WRITING_TEMPLATES[0];

  const handleSelectFormat = (formatId: string) => {
    setSelectedFormat(formatId);
    const tmpl = WRITING_TEMPLATES.find((t) => t.id === formatId);
    if (tmpl) {
      setInputText(tmpl.sample);
    }
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeWritingWithAICoach({
        text: inputText,
        writingType: selectedFormat,
        userLevel,
      });
      setAnalysisResult(result);
      onUpdateProgress((prev) => ({
        ...prev,
        totalSentencesConstructed: (prev.totalSentencesConstructed || 0) + 1,
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="writing-coach-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-violet-100 border border-white/20">
            <PenTool className="w-3.5 h-3.5" />
            AI Writing Assistant
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">AI Writing Coach</h1>
          <p className="text-violet-100 text-base md:text-lg leading-relaxed">
            Write messages, emails, essays, and job applications with confidence. Get side-by-side corrected, natural, and professional versions with granular grammar and vocabulary feedback.
          </p>
        </div>
      </div>

      {/* Writing Format Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WRITING_TEMPLATES.map((tmpl) => {
          const isSelected = selectedFormat === tmpl.id;
          const Icon = tmpl.icon;
          return (
            <button
              key={tmpl.id}
              onClick={() => handleSelectFormat(tmpl.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-violet-50/80 dark:bg-violet-950/40 border-violet-500 shadow-sm ring-1 ring-violet-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-900 dark:text-white">{tmpl.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Draft Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-violet-600" />
            Your Draft ({currentTemplate.label}):
          </label>
          <button
            onClick={() => setInputText('')}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear Text
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={currentTemplate.placeholder}
          rows={5}
          className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Writing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze & Coach My Writing
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis & Output Comparison Grid */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-500">Overall Score</div>
              <div className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
                {analysisResult.overallScore}/100
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-500">Grammar</div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {analysisResult.grammarScore}/100
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-500">Vocabulary</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {analysisResult.vocabularyScore}/100
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-500">Clarity</div>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {analysisResult.clarityScore}/100
              </div>
            </div>
          </div>

          {/* Side-by-Side Versions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Version 1: Grammatically Correct */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    Grammatically Correct
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakText(analysisResult.correctedVersion)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(analysisResult.correctedVersion, 'corrected')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      {copiedKey === 'corrected' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {analysisResult.correctedVersion}
                </p>
              </div>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                Fixes all spelling and grammar while preserving your original tone.
              </div>
            </div>

            {/* Version 2: Natural Conversational */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-violet-200 dark:border-violet-900/60 p-6 shadow-sm flex flex-col justify-between space-y-4 ring-1 ring-violet-500/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold text-xs">
                    Natural & Native-Sounding
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakText(analysisResult.naturalVersion)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(analysisResult.naturalVersion, 'natural')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      {copiedKey === 'natural' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {analysisResult.naturalVersion}
                </p>
              </div>
              <div className="text-xs text-violet-700 dark:text-violet-300 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
                Uses fluent idioms and natural phrasing for everyday communication.
              </div>
            </div>

            {/* Version 3: Formal / Professional */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    Professional / Business
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakText(analysisResult.professionalVersion)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(analysisResult.professionalVersion, 'prof')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      {copiedKey === 'prof' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {analysisResult.professionalVersion}
                </p>
              </div>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                Polished and courteous register ideal for workplace emails and exams.
              </div>
            </div>
          </div>

          {/* Granular Feedback Explanations */}
          {analysisResult.explanations && analysisResult.explanations.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Specific Corrections & Why They Matter:
              </div>
              <div className="space-y-3">
                {analysisResult.explanations.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
                        {exp.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-800 dark:text-slate-200">
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 line-through text-rose-800 dark:text-rose-200">
                        {exp.originalSegment}
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 font-semibold text-emerald-800 dark:text-emerald-200">
                        {exp.improvedSegment}
                      </div>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                      💡 <strong>Why:</strong> {exp.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Key Writing Strengths
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.keyStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" /> Recommended Areas to Practice
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
