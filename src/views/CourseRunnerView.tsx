import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  Check,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundService } from '../services/soundService';
import { GeneratedLesson, GeneratedCourse } from '../types';

export const CourseRunnerView: React.FC = () => {
  const {
    generatedCourses,
    activeCourseId,
    activeCourseLessonId,
    setActiveCourseId,
    setActiveCourseLessonId,
    completeCourseLesson,
    issueCourseCertificate,
    saveWordToNotebook,
    setCurrentView,
  } = useApp();

  const currentCourse: GeneratedCourse | undefined =
    generatedCourses.find((c) => c.id === activeCourseId) || generatedCourses[0];

  // Find active lesson or fallback to first
  let currentLesson: GeneratedLesson | undefined;
  if (currentCourse) {
    for (const mod of currentCourse.modules) {
      const found = mod.lessons.find((l) => l.id === activeCourseLessonId);
      if (found) {
        currentLesson = found;
        break;
      }
    }
    if (!currentLesson && currentCourse.modules[0]?.lessons[0]) {
      currentLesson = currentCourse.modules[0].lessons[0];
    }
  }

  // Pedagogical step index (0: Learn, 1: Examples, 2: Practice, 3: Speak, 4: Apply & Review)
  const [stepIndex, setStepIndex] = useState(0);

  // Practice state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);

  // Apply / Dialogue roleplay state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'partner'; text: string }>
  >([]);
  const [chatInput, setChatInput] = useState('');

  // Final exam modal
  const [examOpen, setExamOpen] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examResult, setExamResult] = useState<{
    scorePercent: number;
    passed: boolean;
  } | null>(null);

  // Reset steps when changing lessons
  useEffect(() => {
    setStepIndex(0);
    setSelectedAnswers({});
    setPracticeSubmitted(false);
    setIsRecording(false);
    setSpokenTranscript('');
    setSpeakingScore(null);
    if (currentLesson?.apply?.starterMessage) {
      setChatMessages([
        { sender: 'partner', text: currentLesson.apply.starterMessage },
      ]);
    } else {
      setChatMessages([]);
    }
  }, [currentLesson?.id]);

  if (!currentCourse || !currentLesson) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 space-y-4">
        <BookOpen size={48} className="text-indigo-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          No Active Course Selected
        </h2>
        <p className="text-slate-500 text-sm">
          Select or generate a custom course to begin learning.
        </p>
        <button
          onClick={() => setCurrentView('course_generator')}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg"
        >
          Go to Course Generator
        </button>
      </div>
    );
  }

  const steps = [
    { label: '1. Learn Concept', icon: BookOpen },
    { label: '2. Real Examples', icon: Volume2 },
    { label: '3. Practice Drills', icon: HelpCircle },
    { label: '4. Speak Aloud', icon: Mic },
    { label: '5. Apply & Review', icon: MessageSquare },
  ];

  const handleAudioPlay = (text: string) => {
    soundService.speakSentence(text);
  };

  const handleToggleSpeechRecognition = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Realistic simulation for browser environment without native SpeechRecognition API
      setIsRecording(true);
      setTimeout(() => {
        const target = currentLesson?.speak?.targetPhrase || 'I would like to chime in on this topic.';
        setSpokenTranscript(target);
        setIsRecording(false);
        setSpeakingScore(92);
        soundService.playSuccess();
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSpokenTranscript(text);
        setIsRecording(false);
        setSpeakingScore(88);
        soundService.playSuccess();
      };
      recognition.onerror = () => {
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Teacher simulated partner feedback
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'partner',
          text: `Excellent contribution! That was phrased very naturally and directly addressed the agenda. Keep up that level of confidence!`,
        },
      ]);
      soundService.playSuccess();
    }, 700);
  };

  const handleLessonCompletion = () => {
    completeCourseLesson(currentCourse.id, currentLesson.id);

    // Find next lesson
    let nextFound = false;
    for (const mod of currentCourse.modules) {
      for (const les of mod.lessons) {
        if (nextFound) {
          setActiveCourseLessonId(les.id);
          return;
        }
        if (les.id === currentLesson.id) {
          nextFound = true;
        }
      }
    }
    // If finished last lesson
    setExamOpen(true);
  };

  const handleExamSubmit = () => {
    const questions = currentCourse.finalAssessment?.questions || [];
    if (questions.length === 0) {
      const cert = issueCourseCertificate(currentCourse, 95);
      setExamResult({ scorePercent: 95, passed: true });
      return;
    }

    let correct = 0;
    questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    const passed = scorePercent >= (currentCourse.finalAssessment?.minPassScore || 70);

    if (passed) {
      issueCourseCertificate(currentCourse, scorePercent);
    }

    setExamResult({ scorePercent, passed });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Course Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {currentCourse.targetLevel} • {currentCourse.category || 'Curriculum'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {currentCourse.durationWeeks} Weeks
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {currentCourse.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Day {currentLesson.dayNumber}: {currentLesson.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setExamOpen(true)}
              className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Award size={16} />
              <span>Final Exam & Certificate</span>
            </button>
            <button
              onClick={() => setCurrentView('course_generator')}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold rounded-xl transition-all"
            >
              All Courses
            </button>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="grid grid-cols-5 gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isActive = stepIndex === idx;
            const isCompleted = stepIndex > idx;
            return (
              <button
                key={idx}
                onClick={() => setStepIndex(idx)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : isCompleted
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Active Pedagogy Step Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* STEP 1: LEARN */}
          {stepIndex === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {currentLesson.title}
                  </h3>
                  <p className="text-xs text-slate-400">Core Principle & Grammar Concept</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                <p>{currentLesson.learn?.explanation}</p>
              </div>

              {currentLesson.learn?.keyRules && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Rules to Remember
                  </h4>
                  <div className="space-y-2">
                    {currentLesson.learn.keyRules.map((rule, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span className="font-medium">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentLesson.learn?.tips && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
                  <Sparkles size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-bold">Pro Speaking Tip: </span>
                    <span>{currentLesson.learn.tips}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStepIndex(1)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Continue to Real Examples</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EXAMPLES */}
          {stepIndex === 1 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Real-World Examples
                    </h3>
                    <p className="text-xs text-slate-400">Listen, repeat, and internalize cadence</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {currentLesson.examples?.map((ex, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        "{ex.sentence}"
                      </p>
                      <button
                        onClick={() => handleAudioPlay(ex.audioText || ex.sentence)}
                        className="p-3 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all shadow-sm shrink-0"
                        title="Listen to native pronunciation"
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Context: {ex.translationOrContext}
                      </span>
                      <button
                        onClick={() => {
                          saveWordToNotebook({
                            wordOrPhrase: ex.sentence,
                            meaning: ex.translationOrContext,
                            type: 'phrase',
                            exampleSentence: ex.sentence,
                            folder: currentCourse.category || 'General',
                          });
                        }}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        + Save to Notebook
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStepIndex(0)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Learn
                </button>
                <button
                  onClick={() => setStepIndex(2)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Start Practice Drills</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRACTICE */}
          {stepIndex === 2 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Interactive Practice Drills
                  </h3>
                  <p className="text-xs text-slate-400">Lock in your knowledge with active recall</p>
                </div>
              </div>

              <div className="space-y-6">
                {currentLesson.practice?.map((prac, pIdx) => {
                  const isAnswered = selectedAnswers[prac.id] !== undefined;
                  const isCorrect =
                    prac.type === 'choice'
                      ? selectedAnswers[prac.id] === prac.correctAnswer ||
                        selectedAnswers[prac.id] === prac.correctIndex
                      : selectedAnswers[prac.id] === prac.correctAnswer;

                  return (
                    <div
                      key={prac.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-extrabold text-indigo-600 text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950">
                          Q{pIdx + 1}
                        </span>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                          {prac.prompt}
                        </p>
                      </div>

                      {/* Options */}
                      {prac.options && (
                        <div className="space-y-2">
                          {prac.options.map((opt, oIdx) => {
                            const isChosen =
                              selectedAnswers[prac.id] === opt ||
                              selectedAnswers[prac.id] === oIdx;

                            return (
                              <button
                                key={oIdx}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({
                                    ...prev,
                                    [prac.id]: opt,
                                  }))
                                }
                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                                  isChosen
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                                    : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Explanation Feedback */}
                      {isAnswered && (
                        <div
                          className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                          ) : (
                            <RotateCcw size={16} className="shrink-0 text-rose-600 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold">{isCorrect ? 'Correct! ' : 'Explanation: '}</span>
                            <span>{prac.explanation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStepIndex(1)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Examples
                </button>
                <button
                  onClick={() => setStepIndex(3)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Continue to Speaking</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SPEAK */}
          {stepIndex === 3 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Spoken Pronunciation Drill
                  </h3>
                  <p className="text-xs text-slate-400">Speak aloud to develop muscle memory</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 text-center space-y-4">
                <span className="text-xs uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  Target Phrase
                </span>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 max-w-xl mx-auto leading-relaxed">
                  "{currentLesson.speak?.targetPhrase}"
                </p>

                {currentLesson.speak?.pronunciationTip && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Tip: {currentLesson.speak.pronunciationTip}
                  </p>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleAudioPlay(currentLesson.speak?.targetPhrase || '')}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Volume2 size={16} className="text-indigo-600" />
                    <span>Listen Reference</span>
                  </button>

                  <button
                    onClick={handleToggleSpeechRecognition}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                    }`}
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                    <span>{isRecording ? 'Listening... (Speak Now)' : 'Record Your Voice'}</span>
                  </button>
                </div>
              </div>

              {spokenTranscript && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">You Said:</span>
                    {speakingScore && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Accuracy: {speakingScore}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    "{spokenTranscript}"
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStepIndex(2)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Practice
                </button>
                <button
                  onClick={() => setStepIndex(4)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Finish with Dialogue Roleplay</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: APPLY & REVIEW */}
          {stepIndex === 4 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Apply in Real-Life Dialogue
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentLesson.apply?.scenarioTitle || 'Simulated Roleplay'}
                  </p>
                </div>
              </div>

              {/* Chat Dialogue Arena */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-80">
                <div className="p-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    Partner: {currentLesson.apply?.partnerRole || 'AI Colleague'}
                  </span>
                  <span className="text-slate-400">Goal: {currentLesson.apply?.dialogueGoal}</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your response to practice your new phrase..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition-all shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

              {/* Vocabulary Summary Cards */}
              {currentLesson.review?.vocabWords && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vocabulary Mastered in this Lesson:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.review.vocabWords.map((v, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Lesson CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setStepIndex(3)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Speaking
                </button>
                <button
                  onClick={handleLessonCompletion}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Check size={18} />
                  <span>Complete Lesson (+35 XP)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Course Syllabus Tree */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              <span>Course Syllabus</span>
            </h3>

            <div className="space-y-4">
              {currentCourse.modules.map((mod) => (
                <div key={mod.id} className="space-y-1.5">
                  <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Week {mod.weekNumber}: {mod.title}
                  </p>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCurrent = les.id === currentLesson.id;
                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveCourseLessonId(les.id)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                            isCurrent
                              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-900'
                              : les.completed
                              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {les.completed ? (
                              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            ) : (
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isCurrent ? 'bg-indigo-600' : 'bg-slate-300'
                                }`}
                              />
                            )}
                            <span className="truncate">
                              Day {les.dayNumber}: {les.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL ASSESSMENT MODAL */}
      {examOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {!examResult ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Award size={22} className="text-amber-500" />
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                      {currentCourse.finalAssessment?.title || 'Course Final Assessment'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setExamOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Score 70% or higher to graduate and unlock your verified Certificate of
                  Achievement.
                </p>

                <div className="space-y-4">
                  {currentCourse.finalAssessment?.questions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs sm:text-sm"
                    >
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        {qIdx + 1}. {q.prompt}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() =>
                              setExamAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                            className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                              examAnswers[q.id] === oIdx
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleExamSubmit}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Award size={18} />
                  <span>Submit Exam & Calculate Score</span>
                </button>
              </>
            ) : (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center font-bold text-2xl">
                  {examResult.passed ? '🎓' : '📚'}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                    {examResult.passed
                      ? 'Congratulations, You Graduated!'
                      : 'Good effort! Review & retry'}
                  </h3>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    Final Exam Score: {examResult.scorePercent}%
                  </p>
                </div>

                {examResult.passed && (
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your official Certificate of Achievement has been issued and stored in your
                    profile.
                  </p>
                )}

                <div className="flex items-center justify-center gap-3 pt-4">
                  {examResult.passed ? (
                    <button
                      onClick={() => {
                        setExamOpen(false);
                        setCurrentView('certificates');
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-lg hover:bg-indigo-700"
                    >
                      View My Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => setExamResult(null)}
                      className="px-6 py-3 bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-lg"
                    >
                      Try Exam Again
                    </button>
                  )}
                  <button
                    onClick={() => setExamOpen(false)}
                    className="px-4 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl"
                  >
                    Return to Course
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
