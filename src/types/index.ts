export interface UserProgress {
  level: UserLevel;
  streakDays: number;
  xp: number;
  dailyGoal: number;
  dailyGoalProgress: number;
  completedPatterns?: string[];
  completedWords?: string[];
  completedStories?: string[];
  completedConversations?: string[];
  totalSentencesConstructed?: number;
}

export type UserLevel = 'Beginner' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type EnglishLevel = UserLevel;

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'pronoun'
  | 'conjunction'
  | 'phrase';

export type SRSStatus = 'NEW' | 'LEARNING' | 'FAMILIAR' | 'MASTERED';

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: PartOfSpeech;
  category: string;
  level: UserLevel;
  simpleDefinition: string;
  meaning: string;
  exampleSentence: string;
  naturalExample?: string;
  collocations?: string[];
  commonMistakes?: string;
  synonyms: string[];
  antonyms?: string[];
  iconName?: string;
  learned?: boolean;
  practiceCount?: number;
  srsStatus?: SRSStatus;
  nextReviewDate?: string;
  intervalDays?: number;
}

export type SentencePartType =
  | 'subject'
  | 'verb'
  | 'object'
  | 'place'
  | 'time'
  | 'adverb'
  | 'question_word'
  | 'auxiliary'
  | 'complement'
  | 'conjunction';

export interface SentencePart {
  text: string;
  type: SentencePartType;
  label: string;
  colorClass: string;
}

export interface SentenceExercise {
  id: string;
  level: number;
  levelTitle: string;
  targetSentence: string;
  jumbledWords: string[];
  formula: string; // e.g. "Subject + Verb + Object + Place"
  parts: SentencePart[];
  hint: string;
  ruleExplanation: string;
  translationMeaning?: string;
}

export interface SentenceExpansionStep {
  stepNumber: number;
  structureName: string;
  sentence: string;
  addedComponent: string;
  componentRole: string;
  explanation: string;
  colorClass?: string;
}

export interface SentenceTransformation {
  type: string;
  transformedSentence: string;
  ruleExplanation: string;
  formula: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: UserLevel;
  icon: string;
  shortDesc: string;
  summary: string;
  rules: {
    ruleTitle: string;
    explanation: string;
    formula?: string;
    examples: {
      correct: string;
      incorrect?: string;
      note?: string;
    }[];
  }[];
  commonMistakes: {
    wrong: string;
    right: string;
    reason: string;
  }[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  category: string;
  level: UserLevel;
  icon: string;
  description: string;
  goal: string;
  aiPersona: {
    name: string;
    role: string;
    avatar: string;
    intro: string;
  };
  keyPhrases: string[];
  suggestedStarters: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  correction?: {
    hasMistake: boolean;
    original?: string;
    better?: string;
    why?: string;
    category?: string;
  };
  suggestedReplies?: string[];
}

export interface MistakeRecord {
  id: string;
  originalSentence: string;
  correctedSentence: string;
  explanation: string;
  category: 'Past tense' | 'Prepositions' | 'Articles' | 'Vocabulary' | 'Sentence structure' | 'Pronunciation' | 'Collocations' | 'General';
  sourceLesson?: string;
  date: string;
  mastered: boolean;
  practiceCount: number;
}

export interface DailyChallenge {
  date: string;
  word: string;
  pronunciation: string;
  partOfSpeech: PartOfSpeech;
  definition: string;
  taskPrompt: string;
  exampleTarget: string;
  ruleTip: string;
  xpReward: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface PhrasalVerb {
  id: string;
  verb: string;
  particles: string[];
  meaning: string;
  simpleExplanation: string;
  example: string;
  separable?: boolean;
  commonMistake?: string;
  miniDialogue: { speaker: string; text: string }[];
  quizQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CollocationItem {
  id: string;
  collocation: string;
  verbRoot: string; // 'make' | 'do' | 'take' | 'have' | 'pay' | 'get'
  category: 'Daily Life' | 'Business & Work' | 'Social' | 'Academic';
  meaning: string;
  correctExample: string;
  wrongAlternative: string; // e.g. "do a mistake (WRONG)"
  whyWrong: string;
}

export interface ListeningPassage {
  id: string;
  title: string;
  level: UserLevel;
  topic: string;
  duration: string;
  passageText: string;
  audioVoice?: string;
  keyVocabulary: { word: string; meaning: string }[];
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface CommunicationLesson {
  id: string;
  title: string;
  category: string;
  level: UserLevel;
  icon: string;
  goal: string;
  explanation: string;
  formalVsCasual: {
    situation: string;
    casual: string;
    standard: string;
    formal: string;
  }[];
  whatNotToSay: {
    unnatural: string;
    natural: string;
    why: string;
  }[];
  dialogueExample: {
    speaker: string;
    role: string;
    text: string;
    notes?: string;
  }[];
  keyExpressions: string[];
}

export interface NigerianEnglishComparison {
  id: string;
  regionalPhrase: string;
  internationalStandard: string;
  naturalAlternative: string;
  category: 'Phrasing' | 'Vocabulary' | 'Pronunciation' | 'Grammar';
  explanation: string;
  contextExample: string;
}

export interface UserStats {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  wordsLearned: string[];
  wordsPracticing: string[];
  srsWords: { [wordId: string]: { status: SRSStatus; nextReview: string; interval: number } };
  mistakes: MistakeRecord[];
  sentencesCompleted: number;
  conversationsCompleted: number;
  speakingMinutes: number;
  listeningCompleted: number;
  grammarMastery: { [topicId: string]: number }; // 0 - 100%
  completedLevels: number[];
  unlockedLevels: number[];
  weakAreas: {
    topic: string;
    mistakeCount: number;
    lastOccurred: string;
    recommendedLessonId: string;
  }[];
  dailyGoal: {
    targetWords: number;
    targetSentences: number;
    targetConversations: number;
    currentWords: number;
    currentSentences: number;
    currentConversations: number;
  };
}

export interface UserProfile {
  name: string;
  level: UserLevel;
  avatar: string;
  joinedDate: string;
  goals: string[];
  voiceSpeed: number; // 0.8, 1.0, 1.2
  voiceAccent: string; // 'en-US' | 'en-GB'
  soundEffects: boolean;
  theme: 'light' | 'dark';
  immersionMode?: 'Beginner' | 'Balanced' | 'Full English';
}

export interface PlacementQuestion {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  levelAssessed: UserLevel;
  explanation: string;
}

export interface SearchResultItem {
  id: string;
  type: 'word' | 'grammar' | 'sentence' | 'conversation' | 'collocation' | 'phrasal_verb' | 'communication' | 'regional' | 'mission' | 'roadmap' | 'tool';
  title: string;
  subtitle: string;
  tags: string[];
  navTarget: {
    page: string;
    id?: string;
  };
}

// 1. Learning Roadmap Types
export interface RoadmapTask {
  id: string;
  title: string;
  type: 'vocab' | 'grammar' | 'sentence' | 'speaking' | 'conversation' | 'listening' | 'reading' | 'writing' | 'mission' | 'review';
  targetNav: { page: string; id?: string };
  completed: boolean;
  description: string;
}

export interface RoadmapDay {
  dayNumber: number;
  title: string;
  summary: string;
  tasks: RoadmapTask[];
  completed: boolean;
  xpReward: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  theme: string;
  focusSkills: string[];
  days: RoadmapDay[];
}

export interface LearningRoadmap {
  id: string;
  planTitle: string;
  targetLevel: UserLevel;
  createdAt: string;
  currentDay: number;
  weeks: RoadmapWeek[];
  adaptiveNotes?: string;
}

// 2. Fluency Mode Types
export interface FluencyReport {
  grammarScore: number;
  vocabularyScore: number;
  sentenceVarietyScore: number;
  naturalnessScore: number;
  pronunciationScore: number;
  overallFluencyScore: number;
  whatYouDidWell: string[];
  commonMistakes: { mistake: string; correction: string; explanation: string }[];
  betterExpressions: { original: string; better: string; reason: string }[];
  keyVocabularyUsed: string[];
  feedbackSummary: string;
}

export interface FluencySession {
  id: string;
  topic: string;
  durationSeconds: number;
  actualSpokenSeconds: number;
  transcript: string;
  recordedAt: string;
  attemptNumber: number;
  report: FluencyReport;
}

// 3. Real-Life Mission Mode Types
export interface MissionItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  level: UserLevel;
  estimatedMinutes: number;
  icon: string;
  coverEmoji: string;
  goal: string;
  requiredSkills: string[];
  targetVocabulary: { word: string; meaning: string }[];
  usefulPhrases: string[];
  scenarioDescription: string;
  initialMessage: string;
  aiCharacter: { name: string; role: string; avatar: string };
  conversationPrompt: string;
  completionChecklist: string[];
}

// 4. AI Phone Call Simulator Types
export interface PhoneCallScenario {
  id: string;
  title: string;
  callerName: string;
  callerRole: string;
  callerAvatar: string;
  callerNumber: string;
  category: string;
  initialGreeting: string;
  objective: string;
  keyPhrases: string[];
  communicationTips: string[];
  difficulty: 'Easy' | 'Medium' | 'Challenging';
}

// 5. Voice Journal Types
export interface VoiceJournalEntry {
  id: string;
  date: string;
  title: string;
  audioDurationSeconds: number;
  originalTranscript: string;
  correctedVersion: string;
  naturalVersion: string;
  suggestedVocabulary: { word: string; meaning: string; context: string }[];
  grammarScore: number;
  fluencyScore: number;
  feedback: string;
  tags: string[];
  weekNumber: number;
}

// 6. Writing Challenges Types
export interface WritingChallengePrompt {
  id: string;
  category: 'Daily journal' | 'Email' | 'Story' | 'Opinion' | 'Description' | 'Formal letter' | 'Job application' | 'Professional message' | 'School assignment';
  level: UserLevel;
  title: string;
  promptText: string;
  suggestedWordCount: string;
  keyVocabSuggestions: string[];
  guidelinePoints: string[];
}

// 7. Weekly Report Types
export interface WeeklyReportData {
  weekNumber: number;
  weekRange: string;
  wordsLearned: number;
  wordsMastered: number;
  lessonsCompleted: number;
  conversationMinutes: number;
  speakingMinutes: number;
  listeningMinutes: number;
  readingMinutes: number;
  writingCount: number;
  averageQuizScore: number;
  yourStrength: string;
  strengthDetail: string;
  needsAttention: string;
  needsAttentionDetail: string;
  mostCommonMistake: string;
  mostCommonMistakeFix: string;
  improvementPercentage: number;
  improvementSummary: string;
  nextWeekPlan: { day: string; focus: string; activity: string }[];
}

// 8. English For My Life Types
export interface EnglishForMyLifeGoal {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
}

export interface LifeCurriculum {
  goalTitle: string;
  userIntent: string;
  level: UserLevel;
  vocabulary: { word: string; meaning: string; example: string }[];
  usefulPhrases: { phrase: string; whenToUse: string }[];
  commonQuestions: { question: string; goodAnswer: string; tip: string }[];
  sentencePatterns: { pattern: string; example: string }[];
  grammarFocus: { topic: string; rule: string; example: string }[];
  speakingPrompt: string;
  mockScenario: {
    title: string;
    partnerRole: string;
    situation: string;
    openingMessage: string;
  };
}

export type LifeCurriculumModule = LifeCurriculum;


// 9. Sound Natural Trainer Types
export interface SoundNaturalAnalysis {
  original: string;
  status: 'Unnatural' | 'Understandable' | 'Natural' | 'Very Natural';
  score: number;
  whyExplanation: string;
  naturalAlternatives: string[];
  ruleTip: string;
  practiceExercise?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// 10. Word Choice Trainer Types
export interface WordChoiceItem {
  id: string;
  pairTitle: string;
  level: UserLevel;
  words: {
    word: string;
    definition: string;
    keyRule: string;
    example: string;
  }[];
  differenceSummary: string;
  commonMistake: {
    wrong: string;
    right: string;
    why: string;
  };
  miniDialogue: { speaker: string; text: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// 11. Contextual Vocabulary Types
export interface ContextualVocabItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  contexts: {
    senseNumber: number;
    meaning: string;
    sentence: string;
    contextLabel: string;
  }[];
  quiz: {
    question: string;
    contextSentence: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// 12. Personal Vocabulary Notebook Types ("My Words")
export type NotebookFolder = 'School' | 'Work' | 'Travel' | 'Personal' | 'Exam' | 'Difficult Words' | 'General';

export interface SavedNotebookWord {
  id: string;
  wordOrPhrase: string;
  type: 'word' | 'phrase' | 'sentence' | 'phrasal_verb' | 'collocation' | 'idiom';
  meaning: string;
  exampleSentence?: string;
  folder: NotebookFolder;
  dateAdded: string;
  notes?: string;
  masteryStatus: SRSStatus;
}

// 13. Smart Review Engine Item Types
export interface SmartReviewItem {
  id: string;
  type: 'vocab' | 'grammar' | 'sentence' | 'mistake' | 'collocation' | 'phrasal_verb';
  title: string;
  category: string;
  prompt: string;
  contextSentence?: string;
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
  explanation: string;
  sourceId?: string;
}

// 14. AI Course Generator & Runner Types
export interface CourseLessonExercise {
  id: string;
  type: 'fill_blank' | 'reorder' | 'choice' | 'correction';
  prompt: string;
  context?: string;
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
  explanation: string;
}

export interface CourseLesson {
  id: string;
  dayNumber: number;
  title: string;
  summary: string;
  durationMinutes: number;
  completed: boolean;
  learn: {
    explanation: string;
    keyRules: string[];
    tips?: string;
  };
  examples: {
    sentence: string;
    translationOrContext: string;
    audioText?: string;
  }[];
  practice: CourseLessonExercise[];
  speak: {
    prompt: string;
    targetPhrase: string;
    context: string;
    pronunciationTip?: string;
  };
  apply: {
    scenarioTitle: string;
    rolePrompt: string;
    partnerRole: string;
    dialogueGoal: string;
    starterMessage: string;
  };
  review: {
    vocabWords: string[];
    keyGrammarPoint: string;
    flashcardPrompt: string;
  };
}

export type GeneratedLesson = CourseLesson;
export type TeacherMode = TeachingMode;

export interface CourseModule {
  id: string;
  weekNumber: number;
  title: string;
  theme: string;
  description: string;
  lessons: CourseLesson[];
  moduleQuiz?: {
    id: string;
    title: string;
    questions: {
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
  };
}

export interface CourseFinalAssessment {
  title: string;
  minPassScore: number;
  questions: {
    id: string;
    skill: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  targetLevel: UserLevel;
  durationWeeks: number;
  dailyTimeMinutes: number;
  learningObjectives: string[];
  modules: CourseModule[];
  finalAssessment: CourseFinalAssessment;
  completed: boolean;
  currentWeekIndex: number;
  currentLessonIndex: number;
  certificateId?: string;
  createdAt: string;
  userGoal: string;
  userReason: string;
}

// 15. AI Live Teacher & Voice Mode Types
export type TeachingMode =
  | 'teaching'
  | 'conversation'
  | 'correction'
  | 'instant_lesson'
  | 'explain'
  | 'practice'
  | 'quiz'
  | 'review'
  | 'challenge';

export interface TeacherChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  mode?: TeachingMode;
  audioBase64?: string;
  correction?: {
    hasMistake: boolean;
    original?: string;
    better?: string;
    why?: string;
    category?: string;
  };
  quizQuestion?: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  speechAnalysis?: {
    grammarScore: number;
    vocabularyScore: number;
    naturalnessScore: number;
    feedback: string;
  };
}

export interface InstantLesson {
  id: string;
  topic: string;
  userLevel: UserLevel;
  title: string;
  explanation: string;
  keyRules: string[];
  examples: {
    sentence: string;
    context: string;
  }[];
  commonMistakes: {
    wrong: string;
    right: string;
    explanation: string;
  }[];
  practiceExercises: CourseLessonExercise[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  conversationPrompt: {
    scenario: string;
    partnerRole: string;
    starter: string;
    goal: string;
  };
  speakingTask: {
    prompt: string;
    sampleAnswer: string;
    targetPattern: string;
  };
  reviewTakeaways: string[];
}

// 16. AI Exam Preparation & Mock Exam Types
export type ExamType =
  | 'IELTS_ACADEMIC'
  | 'IELTS_GENERAL'
  | 'TOEFL'
  | 'WAEC'
  | 'NECO'
  | 'JAMB'
  | 'GENERAL_PROFICIENCY';

export interface ExamSkillScore {
  skill: 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Grammar' | 'Vocabulary' | 'Comprehension';
  score: string;
  numericScore: number;
  maxScore: number;
  status: 'strong' | 'developing' | 'needs_work';
}

export interface ExamDashboardInfo {
  examType: ExamType;
  name: string;
  subtitle: string;
  tag: string;
  targetScoreOrBand: string;
  currentEstimate: string;
  skillBreakdown: ExamSkillScore[];
  recommendations: string[];
  mockTestsCount: number;
  disclaimer: string;
}

export interface ExamQuestion {
  id: string;
  examType: ExamType;
  skill: 'Reading' | 'Listening' | 'Grammar' | 'Vocabulary' | 'Writing' | 'Speaking';
  questionType:
    | 'multiple_choice'
    | 'fill_blank'
    | 'reading_comp'
    | 'listening_comp'
    | 'sentence_correction'
    | 'essay'
    | 'speaking';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  passageOrContext?: string;
  audioText?: string;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  explanation: string;
  topic: string;
}

export interface MockTest {
  id: string;
  examType: ExamType;
  title: string;
  durationMinutes: number;
  questions: ExamQuestion[];
  completed: boolean;
  score?: number;
  bandEstimate?: string;
  completedDate?: string;
  userAnswers?: Record<string, string | number>;
  flaggedQuestions?: string[];
}

// 17. AI Speaking & Writing Assessment Types
export interface SpeakingAssessmentResult {
  id: string;
  prompt: string;
  spokenTranscript: string;
  grammarScore: number;
  vocabularyScore: number;
  sentenceVarietyScore: number;
  fluencyScore: number;
  topicRelevanceScore: number;
  pronunciationEstimate: number;
  overallScore: number;
  overallBand?: string;
  strengths: string[];
  areasForImprovement: string[];
  naturalAlternative: string;
  practiceRecommendation: string;
  date: string;
}

export interface WritingAssessmentResult {
  id: string;
  prompt: string;
  writtenText: string;
  taskCompletionScore: number;
  grammarScore: number;
  vocabularyScore: number;
  organizationScore: number;
  clarityScore: number;
  coherenceScore: number;
  naturalnessScore: number;
  overallScore: number;
  overallBand?: string;
  whatYouDidWell: string[];
  whatNeedsImprovement: string[];
  exampleImprovement: string;
  practiceRecommendation: string;
  date: string;
}

// 18. Certificate System Types
export interface PlatformCertificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  level: string;
  completionDate: string;
  scorePercent: number;
  skillsPracticed: string[];
  hoursSpent: number;
  verifyUrl: string;
  badgeTitle: string;
}

// 19. Skill Profile & Progress Comparison Types
export interface SkillProfile {
  vocabulary: UserLevel;
  grammar: UserLevel;
  sentenceConstruction: UserLevel;
  reading: UserLevel;
  listening: UserLevel;
  writing: UserLevel;
  speaking: UserLevel;
  conversation: UserLevel;
  overallCEFR: string;
  transitionNote: string;
}

export interface MonthlyProgressComparison {
  month: string;
  grammar: number;
  speaking: number;
  vocabulary: number;
  listening: number;
  writing: number;
  reading: number;
}

// 20. 30 / 60 / 90 Day Structured Programs
export interface StructuredProgramDay {
  dayNumber: number;
  title: string;
  summary: string;
  focusSkill: string;
  completed: boolean;
  xpReward: number;
  tasks: {
    id: string;
    title: string;
    type: string;
    description: string;
    targetNav: {
      page: string;
      id?: string;
    };
    completed: boolean;
  }[];
}

export interface StructuredProgram {
  id: string;
  durationDays: 30 | 60 | 90;
  title: string;
  subtitle: string;
  description: string;
  targetLevel: UserLevel;
  currentDay: number;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  days: StructuredProgramDay[];
}

// 21. Content Library & Course Marketplace Architecture
export interface MarketplaceCourse {
  id: string;
  title: string;
  category:
    | 'General English'
    | 'Business English'
    | 'Travel English'
    | 'Academic English'
    | 'Interview English'
    | 'Customer Service'
    | 'Healthcare English'
    | 'Technology English'
    | 'Hospitality English'
    | 'Exam Preparation';
  level: UserLevel;
  duration: string;
  rating: number;
  studentCount: number;
  isFree: boolean;
  isPremium: boolean;
  isAIGenerated: boolean;
  description: string;
  highlights: string[];
  modulesCount: number;
}

// 22. AI Learning Memory System ("My AI Tutor Memory")
export interface ConfusedWordPair {
  pair: string;
  explanation: string;
  exampleA: string;
  exampleB: string;
  lastPracticed?: string;
}

export interface LearnerMemory {
  currentLevel: UserLevel;
  targetLevel: UserLevel;
  learningGoals: string[];
  preferredDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topicsStudied: string[];
  topicsMastered: string[];
  vocabularyLearned: string[];
  difficultVocabulary: string[];
  commonGrammarMistakes: string[];
  commonSentenceMistakes: string[];
  frequentlyConfusedWords: ConfusedWordPair[];
  frequentlyUsedIncorrectExpressions: { wrong: string; right: string; context?: string }[];
  speakingWeaknesses: string[];
  writingWeaknesses: string[];
  listeningWeaknesses: string[];
  recentConversations: { id: string; topic: string; date: string; score: number; attemptNumber?: number }[];
  recentAssessments: { type: string; date: string; score: number }[];
  recommendedTopics: string[];
  streakDays: number;
  lastUpdated: string;
  totalConversationsCompleted: number;
  totalWordsRetrieved: number;
}

// 23. AI Skill Diagnostics & Root Cause Analysis
export type DiagnosticSkillCategory =
  | 'Vocabulary'
  | 'Grammar'
  | 'Sentence Building'
  | 'Speaking'
  | 'Listening'
  | 'Reading'
  | 'Writing'
  | 'Conversation';

export interface DiagnosticItem {
  skill: DiagnosticSkillCategory;
  score: number; // 0 - 100
  trend: 'improving' | 'steady' | 'declining';
  trendDelta: string; // e.g. "+12%" or "-4%"
  strength: string;
  rootCauseWeakness: string;
  evidenceExamples: string[];
  recommendedAction: string;
  practiceModuleId: string;
  lastAssessedDate: string;
}

export interface DetectedErrorPattern {
  id: string;
  patternTitle: string;
  category: 'grammar' | 'vocabulary' | 'sentence_structure' | 'preposition' | 'collocation';
  wrongExamples: string[];
  correctExamples: string[];
  rootCause: string;
  remedyTip: string;
  practicePrompt: string;
  practiceOptions: string[];
  correctIndex: number;
  practiceExplanation: string;
}

// 24. Active Vocabulary 3-Stage Model
export type ActiveVocabStage = 'recognition' | 'recall' | 'usage' | 'mastered';

export interface ActiveVocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  definition: string;
  clueHint: string;
  collocations: string[];
  confusedWith?: string;
  confusionNote?: string;
  currentStage: ActiveVocabStage;
  recognitionSuccessCount: number;
  recallSuccessCount: number;
  usageSuccessCount: number;
  lastPracticedDate: string;
  nextReviewDate: string;
  userCustomSentence?: string;
}

// 25. Emergency Help Mode ("I Need English Now")
export interface EmergencyHelpSession {
  scenarioId: string;
  scenarioTitle: string;
  urgencyReason: string;
  targetTone: 'Polite' | 'Professional' | 'Clear & Direct' | 'Calm & Assertive';
  topPhrases: { phrase: string; meaning: string; pronunciationTip?: string }[];
  keyVocabulary: { word: string; meaning: string; phonetic: string }[];
  goldenRuleTip: string;
  quickPracticeExercises: {
    prompt: string;
    targetSentence: string;
    jumbledWords: string[];
    hint: string;
  }[];
  roleplayDialogue: {
    partnerName: string;
    partnerRole: string;
    openingLine: string;
    suggestedResponses: string[];
  };
}

// 26. Voice Tutor Session & Assessment
export interface VoiceTutorTurn {
  id: string;
  speaker: 'user' | 'tutor';
  text: string;
  audioUrl?: string;
  timestamp: string;
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
    hasMistake: boolean;
  };
  suggestedReplies?: string[];
}

export interface VoiceConversationReport {
  overallScore: number;
  communicationScore: number;
  grammarScore: number;
  vocabularyScore: number;
  sentenceVarietyScore: number;
  fluencyScore: number;
  isAiEstimated: boolean;
  attemptNumber: number;
  previousAttemptScore?: number;
  improvementDelta?: number;
  strengths: string[];
  areasToImprove: string[];
  mistakesAndCorrections: { wrong: string; right: string; reason: string }[];
  usefulExpressions: { expression: string; context: string }[];
  recommendation: string;
}



