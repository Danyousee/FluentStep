import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserStats,
  UserProfile,
  Badge,
  UserLevel,
  DailyChallenge,
  MistakeRecord,
  SRSStatus,
  GeneratedCourse,
  ExamType,
  MockTest,
  PlatformCertificate,
  SpeakingAssessmentResult,
  WritingAssessmentResult,
  SkillProfile,
  MonthlyProgressComparison,
  StructuredProgram,
  MarketplaceCourse,
  SavedNotebookWord,
  InstantLesson,
  LearnerMemory,
  DiagnosticItem,
  DetectedErrorPattern,
  ActiveVocabWord,
  ActiveVocabStage,
} from '../types';
import { soundService } from '../services/soundService';
import {
  INITIAL_GENERATED_COURSES,
  INITIAL_MOCK_TESTS,
  INITIAL_STRUCTURED_PROGRAMS,
  INITIAL_MARKETPLACE_COURSES,
  INITIAL_CERTIFICATES,
  INITIAL_SKILL_PROFILE,
  INITIAL_MONTHLY_PROGRESS,
  INITIAL_NOTEBOOK_WORDS,
} from '../data/coursesAndExamsData';
import {
  INITIAL_LEARNER_MEMORY,
  INITIAL_DIAGNOSTICS,
  INITIAL_ERROR_PATTERNS,
  INITIAL_ACTIVE_VOCAB_WORDS,
} from '../data/learnerMemoryAndDiagnosticsData';

export type AppView =
  | 'landing'
  | 'placement_test'
  | 'dashboard'
  | 'course_generator'
  | 'course_runner'
  | 'ai_teacher'
  | 'ai_teacher_live'
  | 'instant_lesson'
  | 'exam_prep'
  | 'mock_exam'
  | 'speaking_assessment'
  | 'writing_assessment'
  | 'certificates'
  | 'skill_assessment'
  | 'structured_programs'
  | 'day_programs'
  | 'content_library'
  | 'my_notebook'
  | 'my_english'
  | 'roadmap'
  | 'fluency_mode'
  | 'missions'
  | 'real_life_missions'
  | 'phone_call'
  | 'voice_journal'
  | 'writing_challenges'
  | 'weekly_report'
  | 'english_for_my_life'
  | 'sound_natural'
  | 'word_choice'
  | 'contextual_vocab'
  | 'my_words'
  | 'smart_review'
  | 'ai_tutor'
  | 'voice_tutor'
  | 'tutor_memory'
  | 'ai_diagnostics'
  | 'emergency_help'
  | 'practice_everything'
  | 'word_retrieval'
  | 'tutor'
  | 'my_mistakes'
  | 'say_it_better'
  | 'how_do_i_say'
  | 'how_do_i_say_this'
  | 'sentence_patterns'
  | 'story_mode'
  | 'stories'
  | 'reading_lab'
  | 'writing_coach'
  | 'pronunciation_lab'
  | 'common_mistakes'
  | 'daily_session'
  | 'vocabulary'
  | 'vocab_lesson'
  | 'vocabulary_lesson'
  | 'vocab_practice'
  | 'vocabulary_practice'
  | 'vocab_srs'
  | 'vocabulary_srs'
  | 'sentence_builder'
  | 'sentence_expansion'
  | 'sentence_transformation'
  | 'sentence_lesson'
  | 'grammar'
  | 'grammar_lesson'
  | 'phrasal_verbs'
  | 'collocations'
  | 'conversation'
  | 'speaking'
  | 'speaking_practice'
  | 'listening'
  | 'listening_practice'
  | 'communication_skills'
  | 'common_differences'
  | 'adaptive_quiz'
  | 'natural_english'
  | 'daily_challenge'
  | 'progress'
  | 'profile'
  | 'settings';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedVocabId: string | null;
  setSelectedVocabId: (id: string | null) => void;
  selectedVocabCategory: string | null;
  setSelectedVocabCategory: (cat: string | null) => void;
  selectedGrammarTopicId: string | null;
  setSelectedGrammarTopicId: (id: string | null) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  selectedSentenceLevel: number;
  setSelectedSentenceLevel: (lvl: number) => void;
  selectedListeningTopicId: string | null;
  setSelectedListeningTopicId: (id: string | null) => void;
  selectedCommunicationLessonId: string | null;
  setSelectedCommunicationLessonId: (id: string | null) => void;

  // AI Learning Memory ("My AI Tutor Memory") & Diagnostics
  learnerMemory: LearnerMemory;
  updateLearnerMemory: (updates: Partial<LearnerMemory>) => void;
  resetLearnerMemory: () => void;
  clearMemoryCategory: (category: 'mistakes' | 'conversations' | 'vocabulary' | 'all') => void;
  memoryModalOpen: boolean;
  setMemoryModalOpen: (open: boolean) => void;

  diagnostics: DiagnosticItem[];
  updateDiagnosticScore: (skill: string, newScore: number, deltaStr?: string) => void;
  errorPatterns: DetectedErrorPattern[];
  resolveErrorPattern: (patternId: string) => void;

  // Active Vocabulary 3-Stage Model
  activeVocabWords: ActiveVocabWord[];
  advanceActiveVocabStage: (wordId: string, successStage: 'recognition' | 'recall' | 'usage') => void;
  addCustomWordToActiveVocab: (word: Partial<ActiveVocabWord>) => void;

  // Thinking in English Mode
  thinkingMode: 'Beginner Support' | 'Balanced' | 'English Only';
  setThinkingMode: (mode: 'Beginner Support' | 'Balanced' | 'English Only') => void;

  // New AI Course & Assessment State
  generatedCourses: GeneratedCourse[];
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  activeCourseLessonId: string | null;
  setActiveCourseLessonId: (id: string | null) => void;
  saveGeneratedCourse: (course: GeneratedCourse) => void;
  completeCourseLesson: (courseId: string, lessonId: string) => void;
  issueCourseCertificate: (course: GeneratedCourse, scorePercent: number) => PlatformCertificate;
  
  certificates: PlatformCertificate[];
  activeCertificateId: string | null;
  setActiveCertificateId: (id: string | null) => void;

  instantLessons: InstantLesson[];
  activeInstantLesson: InstantLesson | null;
  setActiveInstantLesson: (lesson: InstantLesson | null) => void;
  saveInstantLesson: (lesson: InstantLesson) => void;

  selectedExamType: ExamType;
  setSelectedExamType: (type: ExamType) => void;
  activeMockTest: MockTest | null;
  setActiveMockTest: (test: MockTest | null) => void;
  startMockTest: (examType: ExamType) => void;
  submitMockTest: (testId: string, answers: Record<string, string | number>, score: number, band: string) => void;

  speakingAssessments: SpeakingAssessmentResult[];
  saveSpeakingAssessment: (result: SpeakingAssessmentResult) => void;
  writingAssessments: WritingAssessmentResult[];
  saveWritingAssessment: (result: WritingAssessmentResult) => void;

  skillProfile: SkillProfile;
  updateSkillProfile: (updates: Partial<SkillProfile>) => void;
  monthlyProgress: MonthlyProgressComparison[];

  structuredPrograms: StructuredProgram[];
  activeProgramId: string;
  setActiveProgramId: (id: string) => void;
  completeProgramDay: (programId: string, dayNumber: number) => void;

  marketplaceCourses: MarketplaceCourse[];
  savedNotebookWords: SavedNotebookWord[];
  saveWordToNotebook: (word: Omit<SavedNotebookWord, 'id' | 'dateAdded'>) => void;
  deleteNotebookWord: (id: string) => void;
  updateNotebookWordStatus: (id: string, status: SRSStatus) => void;

  userStats: UserStats;
  userProfile: UserProfile;
  badges: Badge[];
  dailyChallenge: DailyChallenge;
  isDailyChallengeCompleted: boolean;

  addXP: (amount: number, reason?: string) => void;
  markWordLearned: (wordId: string) => void;
  markWordForPractice: (wordId: string) => void;
  updateWordSRS: (wordId: string, status: SRSStatus) => void;
  addMistakeRecord: (mistake: Omit<MistakeRecord, 'id' | 'date' | 'mastered' | 'practiceCount'>) => void;
  resolveMistake: (id: string) => void;
  recordSentenceCompletion: (level: number) => void;
  recordConversationCompletion: (scenarioId: string) => void;
  recordSpeakingPractice: (durationMinutes: number) => void;
  recordListeningCompletion: (passageId: string) => void;
  recordGrammarMastery: (topicId: string, scorePercent: number) => void;
  recordMistake: (topic: string, lessonTarget: string) => void;
  completeDailyChallenge: () => void;
  setUserLevel: (level: UserLevel) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setUserGoals: (goals: string[]) => void;
  resetProgress: () => void;

  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  placementTestOpen: boolean;
  setPlacementTestOpen: (open: boolean) => void;
  activeToast: { title: string; desc: string; type: 'xp' | 'badge' | 'level' | 'info' } | null;
  dismissToast: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'New Learner',
  level: 'Beginner',
  avatar: '🎓',
  joinedDate: 'August 2026',
  goals: ['Speak confidently', 'Master grammar & vocabulary', 'Everyday communication'],
  voiceSpeed: 1.0,
  voiceAccent: 'en-US',
  soundEffects: true,
  theme: 'light',
};

const DEFAULT_MISTAKES: MistakeRecord[] = [];

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  wordsLearned: [],
  wordsPracticing: [],
  srsWords: {},
  mistakes: [],
  sentencesCompleted: 0,
  conversationsCompleted: 0,
  speakingMinutes: 0,
  listeningCompleted: 0,
  grammarMastery: {},
  completedLevels: [],
  unlockedLevels: [1],
  weakAreas: [],
  dailyGoal: {
    targetWords: 5,
    targetSentences: 5,
    targetConversations: 1,
    currentWords: 0,
    currentSentences: 0,
    currentConversations: 0,
  },
};

const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_first_100',
    title: 'First 100 Words',
    description: 'Learn and master 100 English vocabulary words.',
    icon: '🏆',
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'badge_7_streak',
    title: '7-Day Streak',
    description: 'Practice English 7 consecutive days in a row.',
    icon: '🔥',
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'badge_first_conv',
    title: 'First Conversation',
    description: 'Complete a realistic dialogue with the AI Tutor.',
    icon: '💬',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'badge_sentence_builder',
    title: 'Sentence Builder',
    description: 'Complete 25 sentence construction challenges.',
    icon: '✍️',
    progress: 0,
    maxProgress: 25,
  },
  {
    id: 'badge_grammar_master',
    title: 'Grammar Master',
    description: 'Score 100% on 5 different grammar topic quizzes.',
    icon: '📚',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'badge_speaking_starter',
    title: 'Speaking Starter',
    description: 'Practice 10 minutes of verbal speaking exercises.',
    icon: '🎤',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'badge_mistake_destroyer',
    title: 'Mistake Master',
    description: 'Review and master 5 previous mistakes.',
    icon: '🎯',
    progress: 0,
    maxProgress: 5,
  },
];

const TODAY_CHALLENGE: DailyChallenge = {
  date: new Date().toISOString().split('T')[0],
  word: 'Improve',
  pronunciation: '/ɪmˈpruːv/',
  partOfSpeech: 'verb',
  definition: 'To make or become better over time.',
  taskPrompt: 'Create a meaningful English sentence using the verb "improve".',
  exampleTarget: 'I want to improve my spoken English by practicing every day.',
  ruleTip: 'Remember: "want" is followed by "to + verb" (want to improve).',
  xpReward: 35,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem('fluentstep_view');
    return (saved as AppView) || 'landing';
  });

  const [selectedVocabId, setSelectedVocabId] = useState<string | null>(null);
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string | null>(null);
  const [selectedGrammarTopicId, setSelectedGrammarTopicId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedSentenceLevel, setSelectedSentenceLevel] = useState<number>(1);
  const [selectedListeningTopicId, setSelectedListeningTopicId] = useState<string | null>(null);
  const [selectedCommunicationLessonId, setSelectedCommunicationLessonId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fluentstep_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('fluentstep_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STATS,
        ...parsed,
        srsWords: parsed.srsWords || DEFAULT_STATS.srsWords,
        mistakes: parsed.mistakes || DEFAULT_STATS.mistakes,
      };
    }
    return DEFAULT_STATS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('fluentstep_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [dailyChallenge] = useState<DailyChallenge>(TODAY_CHALLENGE);
  const [isDailyChallengeCompleted, setIsDailyChallengeCompleted] = useState<boolean>(() => {
    return localStorage.getItem(`fluentstep_challenge_${TODAY_CHALLENGE.date}`) === 'completed';
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [placementTestOpen, setPlacementTestOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{
    title: string;
    desc: string;
    type: 'xp' | 'badge' | 'level' | 'info';
  } | null>(null);

  // AI Learning Memory & Diagnostics State
  const [learnerMemory, setLearnerMemory] = useState<LearnerMemory>(() => {
    const saved = localStorage.getItem('fluentstep_learner_memory');
    return saved ? JSON.parse(saved) : INITIAL_LEARNER_MEMORY;
  });
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);

  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>(() => {
    const saved = localStorage.getItem('fluentstep_diagnostics');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSTICS;
  });

  const [errorPatterns, setErrorPatterns] = useState<DetectedErrorPattern[]>(() => {
    const saved = localStorage.getItem('fluentstep_error_patterns');
    return saved ? JSON.parse(saved) : INITIAL_ERROR_PATTERNS;
  });

  const [activeVocabWords, setActiveVocabWords] = useState<ActiveVocabWord[]>(() => {
    const saved = localStorage.getItem('fluentstep_active_vocab');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_VOCAB_WORDS;
  });

  const [thinkingMode, setThinkingMode] = useState<'Beginner Support' | 'Balanced' | 'English Only'>(() => {
    const saved = localStorage.getItem('fluentstep_thinking_mode');
    return (saved as any) || 'Balanced';
  });

  // AI Courses & Assessment State
  const [generatedCourses, setGeneratedCourses] = useState<GeneratedCourse[]>(() => {
    const saved = localStorage.getItem('fluentstep_courses');
    return saved ? JSON.parse(saved) : INITIAL_GENERATED_COURSES;
  });
  const [activeCourseId, setActiveCourseId] = useState<string | null>('course_workplace_mastery');
  const [activeCourseLessonId, setActiveCourseLessonId] = useState<string | null>('les_work_1_1');

  const [certificates, setCertificates] = useState<PlatformCertificate[]>(() => {
    const saved = localStorage.getItem('fluentstep_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });
  const [activeCertificateId, setActiveCertificateId] = useState<string | null>(null);

  const [instantLessons, setInstantLessons] = useState<InstantLesson[]>(() => {
    const saved = localStorage.getItem('fluentstep_instant_lessons');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeInstantLesson, setActiveInstantLesson] = useState<InstantLesson | null>(null);

  const [selectedExamType, setSelectedExamType] = useState<ExamType>('IELTS_ACADEMIC');
  const [activeMockTest, setActiveMockTest] = useState<MockTest | null>(INITIAL_MOCK_TESTS['IELTS_ACADEMIC'] || null);

  const [speakingAssessments, setSpeakingAssessments] = useState<SpeakingAssessmentResult[]>(() => {
    const saved = localStorage.getItem('fluentstep_speaking_assessments');
    return saved ? JSON.parse(saved) : [];
  });

  const [writingAssessments, setWritingAssessments] = useState<WritingAssessmentResult[]>(() => {
    const saved = localStorage.getItem('fluentstep_writing_assessments');
    return saved ? JSON.parse(saved) : [];
  });

  const [skillProfile, setSkillProfile] = useState<SkillProfile>(() => {
    const saved = localStorage.getItem('fluentstep_skill_profile');
    return saved ? JSON.parse(saved) : INITIAL_SKILL_PROFILE;
  });

  const [monthlyProgress] = useState<MonthlyProgressComparison[]>(INITIAL_MONTHLY_PROGRESS);

  // Auto-reset once to ensure clean state for a new user
  useEffect(() => {
    const freshKey = 'fluentstep_v4_new_user_ready';
    const isInitialized = localStorage.getItem(freshKey);
    if (!isInitialized) {
      localStorage.clear();
      localStorage.setItem(freshKey, 'true');
      setUserStats(DEFAULT_STATS);
      setUserProfile(DEFAULT_PROFILE);
      setBadges(INITIAL_BADGES);
      setIsDailyChallengeCompleted(false);
      setCertificates(INITIAL_CERTIFICATES);
      setActiveCertificateId(null);
      setInstantLessons([]);
      setActiveInstantLesson(null);
      setSpeakingAssessments([]);
      setWritingAssessments([]);
      setSkillProfile(INITIAL_SKILL_PROFILE);
      setStructuredPrograms(INITIAL_STRUCTURED_PROGRAMS);
      setSavedNotebookWords(INITIAL_NOTEBOOK_WORDS);
      setGeneratedCourses(INITIAL_GENERATED_COURSES);
      setLearnerMemory(INITIAL_LEARNER_MEMORY);
      setDiagnostics(INITIAL_DIAGNOSTICS);
      setErrorPatterns(INITIAL_ERROR_PATTERNS);
      setActiveVocabWords(INITIAL_ACTIVE_VOCAB_WORDS);
    }
  }, []);

  const [structuredPrograms, setStructuredPrograms] = useState<StructuredProgram[]>(() => {
    const saved = localStorage.getItem('fluentstep_structured_programs');
    return saved ? JSON.parse(saved) : INITIAL_STRUCTURED_PROGRAMS;
  });
  const [activeProgramId, setActiveProgramId] = useState<string>('prog_30_day');

  const [marketplaceCourses] = useState<MarketplaceCourse[]>(INITIAL_MARKETPLACE_COURSES);

  const [savedNotebookWords, setSavedNotebookWords] = useState<SavedNotebookWord[]>(() => {
    const saved = localStorage.getItem('fluentstep_notebook');
    return saved ? JSON.parse(saved) : INITIAL_NOTEBOOK_WORDS;
  });

  useEffect(() => {
    localStorage.setItem('fluentstep_learner_memory', JSON.stringify(learnerMemory));
  }, [learnerMemory]);

  useEffect(() => {
    localStorage.setItem('fluentstep_diagnostics', JSON.stringify(diagnostics));
  }, [diagnostics]);

  useEffect(() => {
    localStorage.setItem('fluentstep_error_patterns', JSON.stringify(errorPatterns));
  }, [errorPatterns]);

  useEffect(() => {
    localStorage.setItem('fluentstep_active_vocab', JSON.stringify(activeVocabWords));
  }, [activeVocabWords]);

  useEffect(() => {
    localStorage.setItem('fluentstep_thinking_mode', thinkingMode);
  }, [thinkingMode]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('fluentstep_courses', JSON.stringify(generatedCourses));
  }, [generatedCourses]);

  useEffect(() => {
    localStorage.setItem('fluentstep_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('fluentstep_instant_lessons', JSON.stringify(instantLessons));
  }, [instantLessons]);

  useEffect(() => {
    localStorage.setItem('fluentstep_speaking_assessments', JSON.stringify(speakingAssessments));
  }, [speakingAssessments]);

  useEffect(() => {
    localStorage.setItem('fluentstep_writing_assessments', JSON.stringify(writingAssessments));
  }, [writingAssessments]);

  useEffect(() => {
    localStorage.setItem('fluentstep_skill_profile', JSON.stringify(skillProfile));
  }, [skillProfile]);

  useEffect(() => {
    localStorage.setItem('fluentstep_structured_programs', JSON.stringify(structuredPrograms));
  }, [structuredPrograms]);

  useEffect(() => {
    localStorage.setItem('fluentstep_notebook', JSON.stringify(savedNotebookWords));
  }, [savedNotebookWords]);

  const saveGeneratedCourse = (course: GeneratedCourse) => {
    setGeneratedCourses((prev) => [course, ...prev.filter((c) => c.id !== course.id)]);
    setActiveCourseId(course.id);
    if (course.modules?.[0]?.lessons?.[0]) {
      setActiveCourseLessonId(course.modules[0].lessons[0].id);
    }
    addXP(50, `Created AI Course: ${course.title}`);
  };

  const completeCourseLesson = (courseId: string, lessonId: string) => {
    setGeneratedCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        let allCompleted = true;
        const updatedModules = c.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id === lessonId) {
              return { ...l, completed: true };
            }
            if (!l.completed) allCompleted = false;
            return l;
          }),
        }));
        return {
          ...c,
          modules: updatedModules,
          completed: allCompleted,
        };
      })
    );
    addXP(35, 'Lesson Complete! Fantastic work.');
    triggerConfetti();
  };

  const issueCourseCertificate = (course: GeneratedCourse, scorePercent: number): PlatformCertificate => {
    const certNumber = `FS-${new Date().getFullYear()}-ENG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert: PlatformCertificate = {
      id: `cert_${Date.now()}`,
      certificateNumber: certNumber,
      studentName: userProfile.name || 'Learner',
      courseTitle: course.title,
      level: `CEFR ${course.targetLevel} (${course.category || 'General'})`,
      completionDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      scorePercent,
      skillsPracticed: course.learningObjectives?.slice(0, 4) || [
        'Fluent Expression',
        'Grammar Accuracy',
        'Spoken Output',
        'Listening Precision',
      ],
      hoursSpent: Math.max(12, course.durationWeeks * 4),
      verifyUrl: `https://fluentstep.app/verify/${certNumber}`,
      badgeTitle: `${course.targetLevel} Master Graduate`,
    };

    setCertificates((prev) => [newCert, ...prev]);
    setActiveCertificateId(newCert.id);
    addXP(150, `🎓 Earned Certificate for ${course.title}!`);
    soundService.playFanfare();
    triggerConfetti();
    return newCert;
  };

  const saveInstantLesson = (lesson: InstantLesson) => {
    setInstantLessons((prev) => [lesson, ...prev.filter((l) => l.id !== lesson.id)]);
    setActiveInstantLesson(lesson);
    addXP(20, `Generated Instant Lesson on ${lesson.topic}`);
  };

  const startMockTest = (examType: ExamType) => {
    setSelectedExamType(examType);
    const existing = INITIAL_MOCK_TESTS[examType];
    if (existing) {
      setActiveMockTest(existing);
    } else {
      setActiveMockTest(INITIAL_MOCK_TESTS['IELTS_ACADEMIC']);
    }
  };

  const submitMockTest = (
    testId: string,
    answers: Record<string, string | number>,
    score: number,
    band: string
  ) => {
    if (activeMockTest && activeMockTest.id === testId) {
      setActiveMockTest({
        ...activeMockTest,
        completed: true,
        score,
        bandOrGrade: band,
        userAnswers: answers,
      });
    }
    addXP(100, `Completed Mock Test (${band})!`);
    soundService.playFanfare();
    triggerConfetti();
  };

  const saveSpeakingAssessment = (result: SpeakingAssessmentResult) => {
    setSpeakingAssessments((prev) => [result, ...prev]);
    addXP(40, `Speaking Assessment Scored (${result.overallBand})!`);
  };

  const saveWritingAssessment = (result: WritingAssessmentResult) => {
    setWritingAssessments((prev) => [result, ...prev]);
    addXP(40, `Writing Assessment Scored (${result.overallBand})!`);
  };

  const updateSkillProfile = (updates: Partial<SkillProfile>) => {
    setSkillProfile((prev) => ({ ...prev, ...updates }));
  };

  const completeProgramDay = (programId: string, dayNumber: number) => {
    setStructuredPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const updatedDays = prog.days.map((d) =>
          d.dayNumber === dayNumber ? { ...d, completed: true } : d
        );
        const nextDay = Math.min(prog.durationDays, dayNumber + 1);
        return {
          ...prog,
          days: updatedDays,
          currentDay: nextDay,
        };
      })
    );
    addXP(40, `Day ${dayNumber} Milestone Complete!`);
    triggerConfetti();
  };

  const saveWordToNotebook = (word: Omit<SavedNotebookWord, 'id' | 'dateAdded'>) => {
    const newWord: SavedNotebookWord = {
      ...word,
      id: `sn_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      masteryStatus: word.masteryStatus || 'LEARNING',
    };
    setSavedNotebookWords((prev) => [newWord, ...prev]);
    addXP(10, `Added "${word.wordOrPhrase}" to your notebook!`);
  };

  const deleteNotebookWord = (id: string) => {
    setSavedNotebookWords((prev) => prev.filter((w) => w.id !== id));
  };

  const updateNotebookWordStatus = (id: string, status: SRSStatus) => {
    setSavedNotebookWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, masteryStatus: status } : w))
    );
  };

  // Sync settings with SoundService and DOM theme
  useEffect(() => {
    soundService.setSoundEnabled(userProfile.soundEffects);
    soundService.setVoiceSpeed(userProfile.voiceSpeed);
    soundService.setVoiceAccent(userProfile.voiceAccent);

    if (userProfile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProfile]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fluentstep_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('fluentstep_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('fluentstep_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('fluentstep_badges', JSON.stringify(badges));
  }, [badges]);

  const dismissToast = () => setActiveToast(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }
  };

  const addXP = (amount: number, reason?: string) => {
    setUserStats((prev) => {
      const newXP = prev.xp + amount;
      return { ...prev, xp: newXP };
    });
    soundService.playSuccess();
    setActiveToast({
      title: `+${amount} XP Earned!`,
      desc: reason || 'Great job practicing your English!',
      type: 'xp',
    });
    setTimeout(() => {
      setActiveToast((t) => (t?.title.includes(`${amount} XP`) ? null : t));
    }, 3200);
  };

  const markWordLearned = (wordId: string) => {
    setUserStats((prev) => {
      const learned = prev.wordsLearned.includes(wordId)
        ? prev.wordsLearned
        : [...prev.wordsLearned, wordId];
      const practicing = prev.wordsPracticing.filter((id) => id !== wordId);
      const newDailyWords = Math.min(prev.dailyGoal.targetWords, prev.dailyGoal.currentWords + 1);

      const srsObj = prev.srsWords || {};
      const updatedSRS = {
        ...srsObj,
        [wordId]: {
          status: 'LEARNING' as SRSStatus,
          nextReview: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          interval: 1,
        },
      };

      return {
        ...prev,
        wordsLearned: learned,
        wordsPracticing: practicing,
        srsWords: updatedSRS,
        dailyGoal: { ...prev.dailyGoal, currentWords: newDailyWords },
      };
    });
    addXP(15, 'Added to Vocabulary Mastery!');
  };

  const markWordForPractice = (wordId: string) => {
    setUserStats((prev) => {
      const practicing = prev.wordsPracticing.includes(wordId)
        ? prev.wordsPracticing
        : [...prev.wordsPracticing, wordId];
      return { ...prev, wordsPracticing: practicing };
    });
  };

  const updateWordSRS = (wordId: string, status: SRSStatus) => {
    setUserStats((prev) => {
      const srsObj = { ...prev.srsWords };
      let interval = 1;
      if (status === 'LEARNING') interval = 1;
      if (status === 'FAMILIAR') interval = 3;
      if (status === 'MASTERED') interval = 14;

      const nextReviewDate = new Date(Date.now() + interval * 86400000).toISOString().split('T')[0];

      srsObj[wordId] = {
        status,
        nextReview: nextReviewDate,
        interval,
      };

      return {
        ...prev,
        srsWords: srsObj,
      };
    });
    addXP(10, `Updated vocabulary status to ${status}!`);
  };

  const addMistakeRecord = (mistake: Omit<MistakeRecord, 'id' | 'date' | 'mastered' | 'practiceCount'>) => {
    const newRecord: MistakeRecord = {
      ...mistake,
      id: `mistake_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mastered: false,
      practiceCount: 0,
    };
    setUserStats((prev) => ({
      ...prev,
      mistakes: [newRecord, ...(prev.mistakes || [])],
    }));
  };

  const resolveMistake = (id: string) => {
    setUserStats((prev) => ({
      ...prev,
      mistakes: (prev.mistakes || []).map((m) =>
        m.id === id ? { ...m, mastered: true, practiceCount: m.practiceCount + 1 } : m
      ),
    }));
    addXP(20, 'Mistake mastered!');
  };

  const recordSentenceCompletion = (level: number) => {
    setUserStats((prev) => {
      const newSentences = prev.sentencesCompleted + 1;
      const completedLevels = prev.completedLevels.includes(level)
        ? prev.completedLevels
        : [...prev.completedLevels, level];
      const nextLevel = level + 1;
      const unlockedLevels =
        nextLevel <= 10 && !prev.unlockedLevels.includes(nextLevel)
          ? [...prev.unlockedLevels, nextLevel]
          : prev.unlockedLevels;
      const newDaily = Math.min(prev.dailyGoal.targetSentences, prev.dailyGoal.currentSentences + 1);

      return {
        ...prev,
        sentencesCompleted: newSentences,
        completedLevels,
        unlockedLevels,
        dailyGoal: { ...prev.dailyGoal, currentSentences: newDaily },
      };
    });
    addXP(20, 'Constructed a correct sentence!');
  };

  const recordConversationCompletion = (_scenarioId: string) => {
    setUserStats((prev) => {
      const newCount = prev.conversationsCompleted + 1;
      const newDaily = Math.min(prev.dailyGoal.targetConversations, prev.dailyGoal.currentConversations + 1);
      return {
        ...prev,
        conversationsCompleted: newCount,
        dailyGoal: { ...prev.dailyGoal, currentConversations: newDaily },
      };
    });
    triggerConfetti();
    soundService.playFanfare();
    addXP(30, 'Completed a full AI tutor conversation scenario!');
  };

  const recordSpeakingPractice = (durationMinutes: number) => {
    setUserStats((prev) => ({
      ...prev,
      speakingMinutes: prev.speakingMinutes + durationMinutes,
    }));
    addXP(durationMinutes * 5, 'Speaking practice session!');
  };

  const recordListeningCompletion = (_passageId: string) => {
    setUserStats((prev) => ({
      ...prev,
      listeningCompleted: (prev.listeningCompleted || 0) + 1,
    }));
    addXP(25, 'Completed Listening Practice!');
  };

  const recordGrammarMastery = (topicId: string, scorePercent: number) => {
    setUserStats((prev) => ({
      ...prev,
      grammarMastery: {
        ...prev.grammarMastery,
        [topicId]: Math.max(prev.grammarMastery[topicId] || 0, scorePercent),
      },
    }));
    if (scorePercent >= 80) {
      addXP(25, 'High score on Grammar Quiz!');
    }
  };

  const recordMistake = (topic: string, lessonTarget: string) => {
    setUserStats((prev) => {
      const existingIdx = prev.weakAreas.findIndex((w) => w.topic === topic);
      let updated = [...prev.weakAreas];
      if (existingIdx >= 0) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          mistakeCount: updated[existingIdx].mistakeCount + 1,
          lastOccurred: 'Just now',
        };
      } else {
        updated.push({
          topic,
          mistakeCount: 1,
          lastOccurred: 'Just now',
          recommendedLessonId: lessonTarget,
        });
      }
      return { ...prev, weakAreas: updated };
    });
  };

  const completeDailyChallenge = () => {
    if (isDailyChallengeCompleted) return;
    setIsDailyChallengeCompleted(true);
    localStorage.setItem(`fluentstep_challenge_${TODAY_CHALLENGE.date}`, 'completed');
    triggerConfetti();
    soundService.playFanfare();
    addXP(TODAY_CHALLENGE.xpReward, 'Daily Challenge Completed! 🔥 Streak +1');
    setUserStats((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
    }));
  };

  const setUserLevel = (level: UserLevel) => {
    setUserProfile((prev) => ({ ...prev, level }));
    setActiveToast({
      title: `English Level: ${level}`,
      desc: `Curriculum updated to match level ${level}!`,
      type: 'level',
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const setUserGoals = (goals: string[]) => {
    setUserProfile((prev) => ({ ...prev, goals }));
  };

  const updateLearnerMemory = (updates: Partial<LearnerMemory>) => {
    setLearnerMemory((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const resetLearnerMemory = () => {
    setLearnerMemory(INITIAL_LEARNER_MEMORY);
    setDiagnostics(INITIAL_DIAGNOSTICS);
    setErrorPatterns(INITIAL_ERROR_PATTERNS);
    setActiveVocabWords(INITIAL_ACTIVE_VOCAB_WORDS);
    localStorage.removeItem('fluentstep_learner_memory');
    localStorage.removeItem('fluentstep_diagnostics');
    localStorage.removeItem('fluentstep_error_patterns');
    localStorage.removeItem('fluentstep_active_vocab');
    addXP(10, 'Tutor memory successfully cleared and refreshed.');
  };

  const clearMemoryCategory = (category: 'mistakes' | 'conversations' | 'vocabulary' | 'all') => {
    if (category === 'all') {
      resetLearnerMemory();
      return;
    }
    setLearnerMemory((prev) => {
      const updated = { ...prev, lastUpdated: new Date().toISOString() };
      if (category === 'mistakes') {
        updated.frequentMistakes = [];
        updated.learningInsights = updated.learningInsights.filter((i) => i.type !== 'recurrent_error');
      } else if (category === 'conversations') {
        updated.conversationalTopics = [];
        updated.interactionStats = { ...updated.interactionStats, totalConversations: 0 };
      } else if (category === 'vocabulary') {
        updated.masteredVocabulary = [];
        updated.troubleVocabulary = [];
      }
      return updated;
    });
    addXP(10, `Cleared ${category} memory.`);
  };

  const updateDiagnosticScore = (skill: string, newScore: number, deltaStr: string = '+3%') => {
    setDiagnostics((prev) =>
      prev.map((item) =>
        item.skill.toLowerCase() === skill.toLowerCase()
          ? {
              ...item,
              score: Math.min(100, Math.max(0, newScore)),
              trend: newScore >= item.score ? 'improving' : 'declining',
              trendDelta: deltaStr,
            }
          : item
      )
    );
  };

  const resolveErrorPattern = (_patternId: string) => {
    setErrorPatterns((prev) =>
      prev.map((p) => (p.id === _patternId ? { ...p } : p))
    );
    addXP(25, 'Targeted error pattern resolved & mastered!');
  };

  const advanceActiveVocabStage = (wordId: string, successStage: 'recognition' | 'recall' | 'usage') => {
    setActiveVocabWords((prev) =>
      prev.map((w) => {
        if (w.id !== wordId) return w;
        let newStage: ActiveVocabStage = w.currentStage;
        let newRecallCount = w.recallSuccessCount;
        let newUsageCount = w.usageSuccessCount;
        let newRecognitionCount = w.recognitionSuccessCount;

        if (successStage === 'recognition') {
          newRecognitionCount += 1;
          if (w.currentStage === 'recognition') newStage = 'recall';
        } else if (successStage === 'recall') {
          newRecallCount += 1;
          if (w.currentStage === 'recall' && newRecallCount >= 2) newStage = 'usage';
        } else if (successStage === 'usage') {
          newUsageCount += 1;
          newStage = 'mastered';
        }
        return {
          ...w,
          currentStage: newStage,
          recognitionSuccessCount: newRecognitionCount,
          recallSuccessCount: newRecallCount,
          usageSuccessCount: newUsageCount,
          lastPracticedDate: new Date().toISOString().split('T')[0],
          nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        };
      })
    );
    addXP(15, `Word advanced to ${successStage} stage!`);
  };

  const addCustomWordToActiveVocab = (word: Partial<ActiveVocabWord>) => {
    const newWord: ActiveVocabWord = {
      id: `act_${Date.now()}`,
      word: word.word || 'new word',
      phonetic: word.phonetic || '/.../',
      partOfSpeech: word.partOfSpeech || 'noun',
      definition: word.definition || '',
      clueHint: word.clueHint || `What word means: "${word.definition}"?`,
      collocations: word.collocations || [],
      confusedWith: word.confusedWith,
      confusionNote: word.confusionNote,
      currentStage: 'recognition',
      recognitionSuccessCount: 0,
      recallSuccessCount: 0,
      usageSuccessCount: 0,
      lastPracticedDate: new Date().toISOString().split('T')[0],
      nextReviewDate: new Date().toISOString().split('T')[0],
      userCustomSentence: word.userCustomSentence || '',
    };
    setActiveVocabWords((prev) => [newWord, ...prev]);
    addXP(10, `Added "${newWord.word}" to Active Vocabulary!`);
  };

  const resetProgress = () => {
    setUserStats(DEFAULT_STATS);
    setUserProfile(DEFAULT_PROFILE);
    setBadges(INITIAL_BADGES);
    setIsDailyChallengeCompleted(false);
    setCertificates([]);
    setActiveCertificateId(null);
    setInstantLessons([]);
    setActiveInstantLesson(null);
    setSpeakingAssessments([]);
    setWritingAssessments([]);
    setSkillProfile(INITIAL_SKILL_PROFILE);
    setStructuredPrograms(INITIAL_STRUCTURED_PROGRAMS);
    setSavedNotebookWords([]);
    setGeneratedCourses(INITIAL_GENERATED_COURSES);
    setActiveCourseId('course_workplace_mastery');
    setActiveCourseLessonId('les_work_1_1');
    setActiveMockTest(INITIAL_MOCK_TESTS['IELTS_ACADEMIC'] || null);
    setLearnerMemory(INITIAL_LEARNER_MEMORY);
    setDiagnostics(INITIAL_DIAGNOSTICS);
    setErrorPatterns(INITIAL_ERROR_PATTERNS);
    setActiveVocabWords(INITIAL_ACTIVE_VOCAB_WORDS);
    localStorage.clear();
    localStorage.setItem('fluentstep_v4_new_user_ready', 'true');
    setCurrentView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedVocabId,
        setSelectedVocabId,
        selectedVocabCategory,
        setSelectedVocabCategory,
        selectedGrammarTopicId,
        setSelectedGrammarTopicId,
        selectedConversationId,
        setSelectedConversationId,
        selectedSentenceLevel,
        setSelectedSentenceLevel,
        selectedListeningTopicId,
        setSelectedListeningTopicId,
        selectedCommunicationLessonId,
        setSelectedCommunicationLessonId,

        // AI Learning Memory & Diagnostics
        learnerMemory,
        updateLearnerMemory,
        resetLearnerMemory,
        clearMemoryCategory,
        memoryModalOpen,
        setMemoryModalOpen,
        diagnostics,
        updateDiagnosticScore,
        errorPatterns,
        resolveErrorPattern,
        activeVocabWords,
        advanceActiveVocabStage,
        addCustomWordToActiveVocab,
        thinkingMode,
        setThinkingMode,

        // AI Courses & Assessment
        generatedCourses,
        activeCourseId,
        setActiveCourseId,
        activeCourseLessonId,
        setActiveCourseLessonId,
        saveGeneratedCourse,
        completeCourseLesson,
        issueCourseCertificate,
        certificates,
        activeCertificateId,
        setActiveCertificateId,
        instantLessons,
        activeInstantLesson,
        setActiveInstantLesson,
        saveInstantLesson,
        selectedExamType,
        setSelectedExamType,
        activeMockTest,
        setActiveMockTest,
        startMockTest,
        submitMockTest,
        speakingAssessments,
        saveSpeakingAssessment,
        writingAssessments,
        saveWritingAssessment,
        skillProfile,
        updateSkillProfile,
        monthlyProgress,
        structuredPrograms,
        activeProgramId,
        setActiveProgramId,
        completeProgramDay,
        marketplaceCourses,
        savedNotebookWords,
        saveWordToNotebook,
        deleteNotebookWord,
        updateNotebookWordStatus,

        userStats,
        userProfile,
        badges,
        dailyChallenge,
        isDailyChallengeCompleted,
        addXP,
        markWordLearned,
        markWordForPractice,
        updateWordSRS,
        addMistakeRecord,
        resolveMistake,
        recordSentenceCompletion,
        recordConversationCompletion,
        recordSpeakingPractice,
        recordListeningCompletion,
        recordGrammarMastery,
        recordMistake,
        completeDailyChallenge,
        setUserLevel,
        updateProfile,
        setUserGoals,
        resetProgress,
        searchOpen,
        setSearchOpen,
        searchModalOpen: searchOpen,
        setSearchModalOpen: setSearchOpen,
        placementTestOpen,
        setPlacementTestOpen,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

