import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';

export const MockExamView: React.FC = () => {
  const { activeMockTest, submitMockTest, setCurrentView } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);
  const [isFinished, setIsFinished] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  if (!activeMockTest) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 space-y-4">
        <Award size={48} className="text-indigo-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          No Mock Exam Active
        </h2>
        <button
          onClick={() => setCurrentView('exam_prep')}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl"
        >
          Select an Exam
        </button>
      </div>
    );
  }

  const questions = activeMockTest.questions;
  const currentQ = questions[currentIndex] || questions[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (index: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
  };

  const handleFinishExam = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    let band = 'Band 6.5';
    if (scorePercent >= 90) band = 'Band 8.5 (Distinction)';
    else if (scorePercent >= 80) band = 'Band 7.5 (Proficient)';
    else if (scorePercent >= 70) band = 'Band 6.5 (Competent)';
    else if (scorePercent >= 50) band = 'Band 5.5 (Modest)';
    else band = 'Band 4.5';

    setIsFinished(true);
    submitMockTest(activeMockTest.id, answers, scorePercent, band);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Header Bar with Timer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            {activeMockTest.examType} Simulation
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
            {activeMockTest.title}
          </h2>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 font-extrabold text-sm">
            <Clock size={16} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left 3 Cols: Passage & Question */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Optional Reading Passage */}
              {currentQ.passageOrContext && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400">
                    <BookOpen size={14} />
                    <span>Reading Passage</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentQ.passageOrContext}
                  </p>
                </div>
              )}

              {/* Question Body */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-extrabold text-xs">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Skill: {currentQ.skill}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {currentQ.prompt}
                </p>

                {/* Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, oIdx) => {
                    const isChosen = answers[currentQ.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                          isChosen
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigator controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                    }
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg"
                  >
                    Submit Mock Test
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Question Grid Palette */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Question Palette
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, qIdx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = qIdx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(qIdx)}
                      className={`h-10 rounded-xl font-extrabold text-xs transition-all ${
                        isCurrent
                          ? 'ring-2 ring-indigo-600 bg-indigo-50 text-indigo-700'
                          : isAnswered
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-200" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results Review Stage */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center text-3xl font-bold">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Mock Test Completed!
            </h2>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              Estimated Diagnostic Result: {activeMockTest.bandOrGrade || 'Band 7.5 (Proficient)'} (
              {activeMockTest.score || 85}%)
            </p>
          </div>

          {/* Question-by-Question Review */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Itemized Review & Explanations
            </h3>
            {questions.map((q, qIdx) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-600">Q{qIdx + 1}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{q.prompt}</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-500">
                      Your answer: {userAns !== undefined ? q.options[userAns] : 'None'}
                    </p>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">
                      Correct answer: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 italic pt-1">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentView('exam_prep')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow"
            >
              Return to Exam Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
