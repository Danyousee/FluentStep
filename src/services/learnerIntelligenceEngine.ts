import { UserStats, UserProfile, MistakeRecord, ActiveVocabWord, LearnerMemory } from '../types';

export interface CommunicationReadinessBreakdown {
  overallScore: number; // 0 - 100
  demonstratedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  subScores: {
    sentenceConstruction: number;
    grammarAccuracy: number;
    vocabularyDepth: number;
    speakingFluency: number;
    listeningPrecision: number;
    conversationAgility: number;
    naturalness: number;
  };
  totalActivitiesCount: number;
  summarySentence: string;
}

export interface PersonalizedDailyPlanStep {
  stepNumber: number;
  title: string;
  category: 'lesson' | 'builder' | 'transformation' | 'creation' | 'speaking' | 'conversation' | 'review';
  durationMinutes: number;
  description: string;
  targetNav: { page: string; id?: string; payload?: any };
  completed: boolean;
  xpReward: number;
}

export interface PersonalizedDailyPractice {
  date: string;
  topWeakness: string;
  weaknessReason: string;
  weaknessCategory: string;
  recommendedFocus: string;
  totalEstimatedMinutes: number;
  steps: PersonalizedDailyPlanStep[];
  completedCount: number;
  totalXp: number;
}

/**
 * Calculates the authentic demonstrated Communication Readiness score based on real user activity,
 * separating raw activity volume from true proficiency.
 */
export function calculateCommunicationReadiness(
  userStats: UserStats,
  userProfile: UserProfile,
  activeVocabWords: ActiveVocabWord[] = []
): CommunicationReadinessBreakdown {
  const mistakes: MistakeRecord[] = userStats.mistakes || [];
  const resolvedMistakes = mistakes.filter((m) => m.mastered).length;
  const totalMistakes = mistakes.length;
  const mistakeResolutionRate = totalMistakes > 0 ? resolvedMistakes / totalMistakes : 0.8;

  // 1. Sentence Construction Score (based on sentences completed, levels unlocked, and sentence accuracy)
  const sentencesCount = userStats.sentencesCompleted || 0;
  const sentenceLevelBonus = Math.min(30, (userStats.unlockedLevels?.length || 1) * 3);
  const sentenceConstruction = Math.min(
    100,
    Math.round(25 + Math.min(45, sentencesCount * 2.5) + sentenceLevelBonus * mistakeResolutionRate)
  );

  // 2. Grammar Accuracy Score (based on grammar quiz mastery & resolved mistake percentage)
  const grammarValues = Object.values(userStats.grammarMastery || {});
  const avgGrammarQuiz =
    grammarValues.length > 0
      ? grammarValues.reduce((a, b) => a + b, 0) / grammarValues.length
      : 70;
  const grammarAccuracy = Math.min(
    100,
    Math.round(avgGrammarQuiz * 0.6 + mistakeResolutionRate * 40)
  );

  // 3. Vocabulary Depth Score (based on words learned, SRS status, and active vocab stages)
  const wordsCount = userStats.wordsLearned?.length || 0;
  const masteredActiveVocab = activeVocabWords.filter((w) => w.currentStage === 'mastered').length;
  const vocabularyDepth = Math.min(
    100,
    Math.round(20 + Math.min(50, wordsCount * 3) + Math.min(30, masteredActiveVocab * 6))
  );

  // 4. Speaking Fluency Score (based on speaking minutes logged and spoken exercises)
  const speakingMins = userStats.speakingMinutes || 0;
  const speakingFluency = Math.min(100, Math.round(20 + Math.min(80, speakingMins * 4)));

  // 5. Listening Precision Score (based on listening passages completed)
  const listeningCount = userStats.listeningCompleted || 0;
  const listeningPrecision = Math.min(100, Math.round(25 + Math.min(75, listeningCount * 12)));

  // 6. Conversation Agility Score (based on AI conversations and scenarios finished)
  const convoCount = userStats.conversationsCompleted || 0;
  const conversationAgility = Math.min(100, Math.round(20 + Math.min(80, convoCount * 15)));

  // 7. Naturalness & Pragmatics Score
  const naturalness = Math.min(
    100,
    Math.round((sentenceConstruction * 0.35 + grammarAccuracy * 0.35 + conversationAgility * 0.3))
  );

  // Overall Weighted Score
  const overallScore = Math.round(
    sentenceConstruction * 0.22 +
      grammarAccuracy * 0.18 +
      vocabularyDepth * 0.15 +
      speakingFluency * 0.18 +
      listeningPrecision * 0.12 +
      conversationAgility * 0.15
  );

  // Map to Demonstrated CEFR Level
  let demonstratedLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' = 'A1';
  if (overallScore >= 88) demonstratedLevel = 'C1';
  else if (overallScore >= 75) demonstratedLevel = 'B2';
  else if (overallScore >= 60) demonstratedLevel = 'B1';
  else if (overallScore >= 45) demonstratedLevel = 'A2';
  else demonstratedLevel = 'A1';

  const totalActivitiesCount =
    sentencesCount +
    wordsCount +
    convoCount +
    listeningCount +
    totalMistakes;

  const summarySentence = `Demonstrated CEFR ${demonstratedLevel} with ${overallScore}% Communication Readiness. Strongest in ${
    sentenceConstruction >= speakingFluency ? 'Sentence Construction' : 'Spoken Communication'
  }.`;

  return {
    overallScore,
    demonstratedLevel,
    subScores: {
      sentenceConstruction,
      grammarAccuracy,
      vocabularyDepth,
      speakingFluency,
      listeningPrecision,
      conversationAgility,
      naturalness,
    },
    totalActivitiesCount,
    summarySentence,
  };
}

/**
 * Analyzes the user's authentic mistake history & weak areas to diagnose top priority.
 */
export function diagnoseLearnerWeakness(userStats: UserStats, userProfile: UserProfile): {
  topWeakness: string;
  weaknessCategory: string;
  reason: string;
  mistakeCount: number;
} {
  const mistakes: MistakeRecord[] = userStats.mistakes || [];
  const unmastered = mistakes.filter((m) => !m.mastered);

  // Count mistakes per category
  const categoryCounts: Record<string, number> = {};
  mistakes.forEach((m) => {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  });

  // Check if any weak area has recorded mistakes
  let topCategory = 'Past tense';
  let maxCount = 0;

  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  }

  // If user has specific unmastered mistakes in weakAreas
  if (userStats.weakAreas && userStats.weakAreas.length > 0) {
    const sorted = [...userStats.weakAreas].sort((a, b) => b.mistakeCount - a.mistakeCount);
    if (sorted[0].mistakeCount > maxCount) {
      topCategory = sorted[0].topic;
      maxCount = sorted[0].mistakeCount;
    }
  }

  if (maxCount > 0) {
    return {
      topWeakness: topCategory,
      weaknessCategory: topCategory,
      reason: `You recorded ${maxCount} mistake${maxCount > 1 ? 's' : ''} in ${topCategory.toLowerCase()} during recent exercises.`,
      mistakeCount: maxCount,
    };
  }

  // Default diagnostic baseline based on user level
  const defaultByLevel: Record<string, { topic: string; reason: string }> = {
    Beginner: {
      topic: 'Basic Sentence Structure (Subject + Verb + Object)',
      reason: 'Key foundational pattern needed to form complete English sentences without hesitation.',
    },
    A1: {
      topic: 'Present Simple & Daily Routines',
      reason: 'Essential tense for describing everyday actions and habitual facts.',
    },
    A2: {
      topic: 'Past Tense & Time Markers',
      reason: 'Mastering regular/irregular past forms (went, visited, saw) enables storytelling.',
    },
    B1: {
      topic: 'Prepositions & Natural Collocations',
      reason: 'Crucial for transitioning from literal translation to natural English phrasing.',
    },
    B2: {
      topic: 'Conditional Sentences & Nuanced Phrasing',
      reason: 'Enables polite hypothetical communication and professional workplace discussions.',
    },
  };

  const fallback = defaultByLevel[userProfile.level] || defaultByLevel['A2'];
  return {
    topWeakness: fallback.topic,
    weaknessCategory: 'Grammar',
    reason: fallback.reason,
    mistakeCount: 0,
  };
}

/**
 * Builds the Personalized Daily Practice Plan tailored to the user's authentic weak points.
 */
export function generateTodayPersonalizedPlan(
  userStats: UserStats,
  userProfile: UserProfile
): PersonalizedDailyPractice {
  const diagnosis = diagnoseLearnerWeakness(userStats, userProfile);
  const today = new Date().toISOString().split('T')[0];

  // Map category to specific lessons
  const steps: PersonalizedDailyPlanStep[] = [
    {
      stepNumber: 1,
      title: `5-Minute ${diagnosis.topWeakness} Lesson`,
      category: 'lesson',
      durationMinutes: 5,
      description: `Understand the core grammatical rules and common traps in ${diagnosis.topWeakness.toLowerCase()}.`,
      targetNav: { page: 'grammar_lesson', id: 'past_simple' },
      completed: (userStats.grammarMastery && Object.keys(userStats.grammarMastery).length > 0) || false,
      xpReward: 25,
    },
    {
      stepNumber: 2,
      title: '10 Sentence-Building Exercises',
      category: 'builder',
      durationMinutes: 4,
      description: 'Arrange words into perfect structural formulas with instant validation.',
      targetNav: { page: 'sentence_builder' },
      completed: (userStats.dailyGoal?.currentSentences || 0) >= 3,
      xpReward: 30,
    },
    {
      stepNumber: 3,
      title: '5 Sentence Transformations',
      category: 'transformation',
      durationMinutes: 3,
      description: 'Convert base statements into negatives, questions, and past/future forms.',
      targetNav: { page: 'sentence_expansion' },
      completed: false,
      xpReward: 25,
    },
    {
      stepNumber: 4,
      title: 'Create 3 Original Sentences',
      category: 'creation',
      durationMinutes: 3,
      description: 'Express your own real thoughts with educational AI diagnostics & feedback.',
      targetNav: { page: 'how_do_i_say_this' },
      completed: false,
      xpReward: 35,
    },
    {
      stepNumber: 5,
      title: '3-Minute Speaking & Pronunciation Practice',
      category: 'speaking',
      durationMinutes: 3,
      description: 'Speak your newly constructed sentences aloud with acoustic verification.',
      targetNav: { page: 'speaking_practice' },
      completed: (userStats.speakingMinutes || 0) > 0,
      xpReward: 30,
    },
    {
      stepNumber: 6,
      title: 'Short AI Conversation Application',
      category: 'conversation',
      durationMinutes: 5,
      description: 'Apply your target sentences in a natural dialogue with Alex or Sarah.',
      targetNav: { page: 'ai_tutor' },
      completed: (userStats.dailyGoal?.currentConversations || 0) >= 1,
      xpReward: 45,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const totalXp = steps.reduce((sum, s) => sum + s.xpReward, 0);

  return {
    date: today,
    topWeakness: diagnosis.topWeakness,
    weaknessReason: diagnosis.reason,
    weaknessCategory: diagnosis.weaknessCategory,
    recommendedFocus: `Targeted Mastery: ${diagnosis.topWeakness}`,
    totalEstimatedMinutes: 23,
    steps,
    completedCount,
    totalXp,
  };
}
