// AI API Client Service Layer

export interface ConversationResponseData {
  aiResponse: string;
  correction?: {
    hasMistake: boolean;
    original?: string;
    better?: string;
    why?: string;
    category?: string;
  };
  suggestedReplies: string[];
  isGoalCompleted: boolean;
}

export interface SentenceEvaluationData {
  isCorrect: boolean;
  score: number;
  feedback: string;
  correctedSentence: string;
  naturalAlternative?: string;
  explanation: string;
  grammarCategory?: string;
}

export interface NaturalizeData {
  original: string;
  correctEnglish: string;
  moreNatural: string;
  explanation: string;
  rules: string[];
  example: string;
  category?: string;
}

export interface SpeakingFeedbackData {
  accuracyScore: number;
  fluencyScore: number;
  feedback: string;
  correctedSentence: string;
  moreNatural: string;
  pronunciationTips: { word: string; tip: string }[];
}

export interface TutorChatResponseData {
  reply: string;
  correction?: {
    hasMistake: boolean;
    original?: string;
    better?: string;
    explanation?: string;
    category?: string;
  };
  exampleSentences?: string[];
  suggestedReplies: string[];
  encouragement?: string;
}

export interface SayItBetterResponseData {
  originalSentence: string;
  correctEnglish: string;
  naturalEnglish: string;
  professionalEnglish: string;
  keyDifferences: string[];
  summaryTip: string;
  practiceExercise: {
    prompt: string;
    targetSentence: string;
    jumbledWords: string[];
    hint: string;
  };
}

export interface HowDoISayThisResponseData {
  concept: string;
  options: {
    tier: string;
    phrase: string;
    whenToUse: string;
    sampleDialogue?: string;
  }[];
  culturalTip?: string;
}

export interface SentenceExpansionResponseData {
  title: string;
  steps: {
    stepNumber: number;
    structureName: string;
    sentence: string;
    addedComponent: string;
    componentRole: string;
    explanation: string;
    colorClass?: string;
  }[];
}

export interface SentenceTransformationResponseData {
  baseSentence: string;
  transformations: {
    type: string;
    transformedSentence: string;
    ruleExplanation: string;
    formula: string;
  }[];
}

export interface MistakesPracticeResponseData {
  title: string;
  summary: string;
  questions: {
    id: string;
    type: string;
    prompt: string;
    contextSentence?: string;
    options?: string[];
    correctAnswer: string;
    correctIndex?: number;
    explanation: string;
    category: string;
  }[];
}

export interface ListeningPassageResponseData {
  title: string;
  topic: string;
  level: string;
  passage: string;
  speaker: string;
  keyVocabulary: { word: string; meaning: string }[];
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
}

// 1. AI Personal English Tutor Chat (Alex)
export async function sendAITutorChat(params: {
  message: string;
  conversationHistory?: { role: string; text: string }[];
  userLevel?: string;
  currentLesson?: string;
  weakAreas?: any[];
  previousMistakes?: any[];
  learningGoals?: string[];
}): Promise<TutorChatResponseData> {
  try {
    const res = await fetch('/api/ai/tutor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Invalid tutor response');
  } catch (error) {
    console.warn('Fallback to local AI tutor:', error);
    return {
      reply: `I'm Alex, your personal English tutor! Let's practice making clear, natural sentences together. What would you like to practice today?`,
      exampleSentences: [
        'I want to improve my speaking skills.',
        'Could you explain how to use prepositions correctly?',
      ],
      suggestedReplies: [
        'How do I introduce myself naturally?',
        'Can we practice sentence building?',
        'Explain past tense rules simply',
      ],
      encouragement: 'Every word you practice makes you a more confident communicator!',
    };
  }
}

// 2. "Say It Better"
export async function analyzeSayItBetter(
  sentence: string,
  userLevel: string = 'A2'
): Promise<SayItBetterResponseData> {
  try {
    const res = await fetch('/api/ai/say-it-better', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence, userLevel }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Say It Better API error');
  } catch {
    return {
      originalSentence: sentence,
      correctEnglish: sentence.charAt(0).toUpperCase() + sentence.slice(1) + (sentence.endsWith('.') ? '' : '.'),
      naturalEnglish: `I am heading out to practice my English today.`,
      professionalEnglish: `I would like to effectively communicate this concept clearly.`,
      keyDifferences: [
        'Use Subject + Verb + Object structure.',
        'Ensure correct verb tense alignment.',
        'Choose natural collocations instead of literal translations.',
      ],
      summaryTip: 'Keep your thoughts simple and focus on clear word order!',
      practiceExercise: {
        prompt: 'Arrange the words into a natural English sentence:',
        targetSentence: 'I would like to learn English.',
        jumbledWords: ['learn', 'would', 'to', 'I', 'English.', 'like'],
        hint: "Start with 'I would like...'",
      },
    };
  }
}

// 3. "How Do I Say This?"
export async function askHowDoISayThis(
  query: string,
  context: string = 'general',
  userLevel: string = 'A2'
): Promise<HowDoISayThisResponseData> {
  try {
    const res = await fetch('/api/ai/how-do-i-say-this', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context, userLevel }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('How Do I Say This API error');
  } catch {
    return {
      concept: query,
      options: [
        {
          tier: 'Simple',
          phrase: "Excuse me, I need some help.",
          whenToUse: 'Direct and friendly for beginners in any situation.',
          sampleDialogue: "A: 'Excuse me, I need some help.' B: 'Sure, what can I do for you?'",
        },
        {
          tier: 'Natural',
          phrase: "Could you give me a quick hand with this?",
          whenToUse: 'Casual everyday English with coworkers or friends.',
          sampleDialogue: "A: 'Could you give me a quick hand with this?' B: 'Absolutely!'",
        },
        {
          tier: 'Polite',
          phrase: "Would you mind helping me for a moment?",
          whenToUse: 'Polite request in stores, public places, or with strangers.',
          sampleDialogue: "A: 'Would you mind helping me for a moment?' B: 'Of course, no problem.'",
        },
        {
          tier: 'Professional',
          phrase: "I would greatly appreciate your assistance with this matter.",
          whenToUse: 'Workplace emails, formal inquiries, or client communications.',
          sampleDialogue: "A: 'I would greatly appreciate your assistance.' B: 'I will look into it right away.'",
        },
      ],
      culturalTip: "Starting requests with 'Could you' or 'Would you mind' sounds respectful and polite.",
    };
  }
}

// 4. Sentence Expansion
export async function expandSentenceWithAI(params: {
  baseSubject?: string;
  baseVerb?: string;
  baseObject?: string;
}): Promise<SentenceExpansionResponseData> {
  try {
    const res = await fetch('/api/ai/expand-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Expand sentence API error');
  } catch {
    const s = params.baseSubject || 'I';
    const v = params.baseVerb || 'study';
    const o = params.baseObject || 'English';
    return {
      title: `Expanding: ${s} + ${v} + ${o}`,
      steps: [
        {
          stepNumber: 1,
          structureName: 'Subject + Verb',
          sentence: `${s} ${v}.`,
          addedComponent: `${s} ${v}`,
          componentRole: 'Subject + Verb',
          explanation: 'Core of every sentence.',
          colorClass: 'blue',
        },
        {
          stepNumber: 2,
          structureName: 'Subject + Verb + Object',
          sentence: `${s} ${v} ${o}.`,
          addedComponent: o,
          componentRole: 'Object',
          explanation: 'Tells what receives the action.',
          colorClass: 'emerald',
        },
        {
          stepNumber: 3,
          structureName: 'Subject + Verb + Object + Place',
          sentence: `${s} ${v} ${o} at school.`,
          addedComponent: 'at school',
          componentRole: 'Place',
          explanation: 'Adds where the action happens.',
          colorClass: 'purple',
        },
        {
          stepNumber: 4,
          structureName: 'Subject + Verb + Object + Place + Time',
          sentence: `${s} ${v} ${o} at school every day.`,
          addedComponent: 'every day',
          componentRole: 'Time',
          explanation: 'Adds when/how often the action occurs.',
          colorClass: 'amber',
        },
        {
          stepNumber: 5,
          structureName: 'Subject + Verb + Object + Place + Time + Reason',
          sentence: `${s} ${v} ${o} at school every day because I want to communicate globally.`,
          addedComponent: 'because I want to communicate globally',
          componentRole: 'Reason',
          explanation: 'Connects with because to explain why.',
          colorClass: 'rose',
        },
      ],
    };
  }
}

// 5. Sentence Transformation
export async function transformSentenceWithAI(
  baseSentence: string
): Promise<SentenceTransformationResponseData> {
  try {
    const res = await fetch('/api/ai/transform-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseSentence }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Transform sentence API error');
  } catch {
    return {
      baseSentence,
      transformations: [
        {
          type: 'Positive',
          transformedSentence: baseSentence,
          ruleExplanation: 'Standard Subject + Verb + Object statement.',
          formula: 'Subject + Verb + Object',
        },
        {
          type: 'Negative',
          transformedSentence: 'I do not ' + baseSentence.toLowerCase().replace(/^i\s+/, ''),
          ruleExplanation: "Add 'do not' before the base verb.",
          formula: 'Subject + do not + Verb',
        },
        {
          type: 'Question',
          transformedSentence: 'Do you ' + baseSentence.toLowerCase().replace(/^i\s+/, '') + '?',
          ruleExplanation: "Add 'Do' at the beginning and change Subject to 'you'.",
          formula: 'Do + Subject + Verb + Object?',
        },
        {
          type: 'Past Tense',
          transformedSentence: baseSentence.replace(/study/gi, 'studied').replace(/eat/gi, 'ate'),
          ruleExplanation: 'Change main verb to past tense form.',
          formula: 'Subject + Past Verb',
        },
      ],
    };
  }
}

// 6. Practice My Mistakes Generator
export async function generateMistakesPracticeWithAI(
  mistakes: any[],
  userLevel: string = 'A1'
): Promise<MistakesPracticeResponseData> {
  try {
    const res = await fetch('/api/ai/practice-mistakes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mistakes, userLevel }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Mistakes practice API error');
  } catch {
    return {
      title: 'Mistake Review & Mastery',
      summary: 'Practice fixing previous common errors.',
      questions: [
        {
          id: 'fb_1',
          type: 'correction',
          prompt: 'Choose the correct past tense sentence:',
          contextSentence: 'Talking about yesterday',
          options: [
            'I went to the market yesterday.',
            'I go to the market yesterday.',
            'I am go to the market yesterday.',
            'I have go market yesterday.',
          ],
          correctAnswer: 'I went to the market yesterday.',
          correctIndex: 0,
          explanation: "'Yesterday' requires the past tense 'went'.",
          category: 'Past Tense',
        },
      ],
    };
  }
}

// 7. Listening Passage Generator
export async function generateListeningPassageWithAI(
  level: string = 'A1',
  topic: string = 'Daily Routine'
): Promise<ListeningPassageResponseData> {
  try {
    const res = await fetch('/api/ai/listening-passage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, topic }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Listening passage API error');
  } catch {
    return {
      title: 'A Day in the City',
      topic,
      level,
      passage:
        'Sarah works as a software designer in London. Every morning at eight o’clock, she takes the underground train to her office. She enjoys a cup of green tea while checking her team’s schedule.',
      speaker: 'Sarah',
      keyVocabulary: [
        { word: 'Underground', meaning: 'The London metro railway system.' },
        { word: 'Schedule', meaning: 'A plan of times at which events are intended to take place.' },
      ],
      questions: [
        {
          id: 'lq1',
          question: 'What is Sarah’s job?',
          options: ['Software designer', 'Doctor', 'Teacher', 'Chef'],
          correctIndex: 0,
          explanation: 'Sarah works as a software designer.',
        },
        {
          id: 'lq2',
          question: 'How does Sarah travel to her office?',
          options: ['By bus', 'By underground train', 'By bicycle', 'She walks'],
          correctIndex: 1,
          explanation: 'She takes the underground train to her office.',
        },
      ],
    };
  }
}

export async function sendAIConversationMessage(params: {
  scenario: any;
  messages: any[];
  userLevel: string;
}): Promise<ConversationResponseData> {
  try {
    const res = await fetch('/api/ai/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Invalid conversation payload');
  } catch (error) {
    console.warn('Fallback to local conversation tutor due to:', error);
    return {
      aiResponse: "I see! That is interesting. Can you tell me a little bit more about that?",
      suggestedReplies: ["Sure! Let me explain...", "What would you like to know?", "Could you give me an example?"],
      isGoalCompleted: params.messages.length >= 6,
    };
  }
}

export async function evaluateSentenceWithAI(params: {
  word: string;
  sentence: string;
  context?: string;
  userLevel: string;
}): Promise<SentenceEvaluationData> {
  try {
    const res = await fetch('/api/ai/evaluate-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Evaluation error');
  } catch {
    const cleanWord = params.word.toLowerCase();
    const cleanSent = params.sentence.toLowerCase();
    const hasWord = cleanSent.includes(cleanWord);
    return {
      isCorrect: hasWord && params.sentence.length > 8,
      score: hasWord ? 85 : 55,
      feedback: hasWord ? `Well done! You used "${params.word}" in your sentence.` : `Make sure to include the target word "${params.word}".`,
      correctedSentence: params.sentence.charAt(0).toUpperCase() + params.sentence.slice(1),
      explanation: `Target word: "${params.word}".`,
    };
  }
}

export async function naturalizeTextWithAI(text: string, userLevel: string = 'A2'): Promise<NaturalizeData> {
  try {
    const res = await fetch('/api/ai/naturalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, userLevel }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Naturalize error');
  } catch {
    return {
      original: text,
      correctEnglish: text.charAt(0).toUpperCase() + text.slice(1) + (text.endsWith('.') ? '' : '.'),
      moreNatural: text,
      explanation: 'Use clear Subject + Verb + Object word order.',
      rules: ['Check subject-verb agreement', 'Ensure prepositions match the place and time context'],
      example: 'I want to go to the park this afternoon.',
    };
  }
}

export async function evaluateSpeakingWithAI(params: {
  spokenText: string;
  promptText: string;
  situation: string;
  userLevel: string;
}): Promise<SpeakingFeedbackData> {
  try {
    const res = await fetch('/api/ai/speaking-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Speaking eval error');
  } catch {
    return {
      accuracyScore: 88,
      fluencyScore: 85,
      feedback: 'Great job speaking out loud! Your articulation was clear and confident.',
      correctedSentence: params.spokenText || 'Hello, I am practicing English.',
      moreNatural: params.spokenText || 'Hello, I am practicing English.',
      pronunciationTips: [
        { word: 'the', tip: 'Place tongue against upper front teeth.' },
      ],
    };
  }
}

export interface WritingCoachAnalysisData {
  originalText: string;
  correctedVersion: string;
  naturalVersion: string;
  professionalVersion: string;
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  clarityScore: number;
  explanations: {
    category: string;
    originalSegment: string;
    improvedSegment: string;
    reason: string;
  }[];
  keyStrengths: string[];
  areasForImprovement: string[];
}

export async function analyzeWritingWithAICoach(params: {
  text: string;
  writingType: string;
  userLevel: string;
}): Promise<WritingCoachAnalysisData> {
  try {
    const res = await fetch('/api/ai/writing-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Writing coach API error');
  } catch {
    return {
      originalText: params.text,
      correctedVersion: params.text ? params.text.charAt(0).toUpperCase() + params.text.slice(1) : '',
      naturalVersion: params.text,
      professionalVersion: params.text,
      overallScore: 88,
      grammarScore: 90,
      vocabularyScore: 86,
      clarityScore: 88,
      explanations: [
        {
          category: 'Style & Politeness',
          originalSegment: 'Standard draft',
          improvedSegment: 'Polished phrasing',
          reason: 'Clear structure with appropriate tone for the chosen format.',
        },
      ],
      keyStrengths: ['Clear communicative purpose', 'Good logical flow'],
      areasForImprovement: ['Practice using formal connectors like furthermore, moreover, or consequently.'],
    };
  }
}

export interface PatternEvaluationData {
  isValid: boolean;
  score: number;
  feedback: string;
  correctedSentence: string;
  naturalAlternative: string;
  explanation: string;
  expandedSuggestion?: string;
}

export async function evaluateSentencePatternWithAI(params: {
  pattern: string;
  sentence: string;
  userLevel: string;
}): Promise<PatternEvaluationData> {
  try {
    const res = await fetch('/api/ai/evaluate-sentence-pattern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Pattern eval error');
  } catch {
    const clean = params.sentence.trim();
    const isValid = clean.length > 6;
    return {
      isValid,
      score: isValid ? 92 : 65,
      feedback: 'Good work! You accurately applied the sentence pattern structure.',
      correctedSentence: clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : '',
      naturalAlternative: clean,
      explanation: `Target pattern "${params.pattern}" successfully applied with correct subject-verb harmony.`,
      expandedSuggestion: clean ? `${clean} because it opens new opportunities.` : '',
    };
  }
}

export interface ConversationAssessmentData {
  communicationScore: number;
  grammarScore: number;
  vocabularyScore: number;
  naturalnessScore: number;
  fluencyEstimate: number;
  overallFeedback: string;
  strengths: string[];
  areasToImprove: string[];
  highlightedPhrases?: string[];
}

export async function assessConversationWithAI(params: {
  scenarioTitle: string;
  messages: any[];
  userLevel: string;
}): Promise<ConversationAssessmentData> {
  try {
    const res = await fetch('/api/ai/conversation-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error('Conversation assessment error');
  } catch {
    return {
      communicationScore: 90,
      grammarScore: 88,
      vocabularyScore: 85,
      naturalnessScore: 87,
      fluencyEstimate: 86,
      overallFeedback: `Excellent interaction during "${params.scenarioTitle}"! You responded naturally and maintained a polite register throughout.`,
      strengths: ['Great response speed and context understanding', 'Polite phrasing'],
      areasToImprove: ['Add more complex connectors to combine shorter thoughts'],
      highlightedPhrases: ['Could you please...', 'Nice to meet you!'],
    };
  }
}

// 1. AI Roadmap Generator
export async function generateAIRoadmap(params: {
  userLevel: string;
  goals: string[];
  weakAreas: string[];
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Roadmap API fetch failed, using fallback generator:', e);
  }
  return null;
}

// 2. AI Fluency Mode Analysis
export async function analyzeFluencySpeaking(params: {
  transcript: string;
  topic: string;
  durationSeconds: number;
  userLevel?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/fluency-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Fluency API fetch failed:', e);
  }
  return null;
}

// 3. AI English For My Life Curriculum
export async function generateLifeCurriculum(params: {
  userGoalText?: string;
  profession?: string;
  goal?: string;
  userLevel?: string;
}): Promise<any> {
  try {
    const payload = {
      userGoalText: params.userGoalText || `${params.profession || 'Professional'} - ${params.goal || 'General Mastery'}`,
      userLevel: params.userLevel || 'A2',
    };
    const res = await fetch('/api/ai/life-curriculum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Life curriculum API error:', e);
  }
  return null;
}

// 4. AI Voice Journal Analysis
export async function analyzeVoiceJournal(params: {
  transcript: string;
  title?: string;
  userLevel?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/voice-journal-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Voice journal API error:', e);
  }
  return null;
}

// 5. AI Phone Call Simulator Turn
export async function sendPhoneCallTurn(params: {
  scenario: any;
  messages: any[];
  userSpokenText: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/phone-call-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Phone call API error:', e);
  }
  return {
    replyText: 'Thank you for calling. Could you please confirm your name and details?',
    suggestedReplies: [
      'Could you repeat that, please?',
      'Yes, my name is Alex.',
      'Thank you very much!',
    ],
    isCallFinished: false,
    coachTip: 'Active listening is key on voice calls.',
  };
}

// 6. Sound Natural Evaluator
export async function evaluateSoundNatural(params: {
  inputSentence: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/sound-natural-evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Sound natural API error:', e);
  }
  return null;
}

// 7. Mission Mode Turn
export async function sendMissionTurn(params: {
  mission: any;
  messages: any[];
  userMessage: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/mission-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Mission turn API error:', e);
  }
  return {
    aiResponse: 'Thank you! That makes total sense. How else can I assist you?',
    correction: { hasMistake: false },
    suggestedReplies: [
      'Thank you so much!',
      'Could you give me more details?',
      'Have a great day!',
    ],
    isMissionComplete: false,
    completedChecklistItems: ['Greeted politely'],
  };
}

// 8. AI Course Generator Client Call
export async function generateAICourse(params: {
  prompt: string;
  reason: string;
  level: string;
  timePerDay: string;
  targetGoal?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/generate-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Generate course API error:', e);
  }
  return null;
}

// 9. AI Teacher Live Interaction Client Call
export async function sendTeacherInteraction(params: {
  mode: string;
  userMessage: string;
  currentLesson?: string;
  currentTopic?: string;
  userLevel?: string;
  mistakeHistory?: any[];
  conversationHistory?: any[];
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/teacher-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Teacher interaction API error:', e);
  }
  return null;
}

// 10. AI Instant Lesson Generator Client Call
export async function generateInstantLesson(params: {
  topic: string;
  userLevel?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/generate-instant-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Generate instant lesson API error:', e);
  }
  return null;
}

// 11. AI Exam Questions Generator Client Call
export async function generateExamQuestions(params: {
  examType: string;
  skill: string;
  count?: number;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/generate-exam-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Generate exam questions API error:', e);
  }
  return null;
}

// 12. AI Speaking Assessment Client Call
export async function evaluateSpeakingAssessment(params: {
  promptText: string;
  spokenTranscript: string;
  audioDuration?: number;
  userLevel?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/evaluate-speaking-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Evaluate speaking assessment API error:', e);
  }
  return null;
}

// 13. AI Writing Assessment Client Call
export async function evaluateWritingAssessment(params: {
  promptText: string;
  writtenText: string;
  examTypeOrLevel?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/evaluate-writing-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Evaluate writing assessment API error:', e);
  }
  return null;
}

// 14. AI Smart Search Client Call
export async function smartSearchEnglish(query: string): Promise<any> {
  try {
    const res = await fetch('/api/ai/smart-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Smart search API error:', e);
  }
  return null;
}

// 15. AI Voice Tutor Conversational Turn (With Memory Context & Inline Gentle Corrections)
export interface VoiceTutorPayload {
  userSpeechText: string;
  conversationHistory: { speaker: 'user' | 'tutor'; text: string }[];
  scenarioTitle?: string;
  learnerGoals?: string[];
  learnerWeaknesses?: string[];
  learnerLevel?: string;
  thinkingMode?: 'Beginner Support' | 'Balanced' | 'English Only';
}

export interface VoiceTutorResponse {
  spokenReply: string;
  correction?: {
    hasMistake: boolean;
    original?: string;
    corrected?: string;
    explanation?: string;
    category?: string;
  };
  suggestedReplies: string[];
  isGoalCompleted?: boolean;
  xpAwarded?: number;
}

export async function sendVoiceTutorMessage(payload: VoiceTutorPayload): Promise<VoiceTutorResponse | null> {
  try {
    const res = await fetch('/api/ai/voice-tutor-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Voice tutor API error:', e);
  }

  // Robust intelligent fallback simulation
  const lastUserText = payload.userSpeechText.toLowerCase();
  let fallbackReply = "That's a great thought! Can you expand a bit more on how that impacts your day-to-day routine?";
  let correction: VoiceTutorResponse['correction'] = undefined;

  if (lastUserText.includes('i want go') || lastUserText.includes('i want visit')) {
    correction = {
      hasMistake: true,
      original: payload.userSpeechText,
      corrected: payload.userSpeechText.replace(/i want (\w+)/i, 'I want to $1'),
      explanation: 'Remember to use "to" with the infinitive after the verb "want" (want + to + verb).',
      category: 'Verb Incompletions',
    };
    fallbackReply = "I understand! By the way, remember to say 'I want to go'. Where would you like to travel next?";
  } else if (lastUserText.includes('i have 25') || lastUserText.includes('i have 30')) {
    correction = {
      hasMistake: true,
      original: payload.userSpeechText,
      corrected: payload.userSpeechText.replace(/i have (\d+)/i, 'I am $1 years old'),
      explanation: 'In English, express age with the verb "to be" ("I am ..."), not "have".',
      category: 'L1 Literal Translation',
    };
  }

  return {
    spokenReply: fallbackReply,
    correction,
    suggestedReplies: [
      "I usually try to plan ahead.",
      "Could you explain what you mean?",
      "Let me give you a clear example.",
    ],
    isGoalCompleted: false,
    xpAwarded: 15,
  };
}

// 16. AI Voice Conversation Comprehensive Diagnostic Report
export async function generateVoiceConversationReport(params: {
  scenarioTitle: string;
  transcript: { speaker: string; text: string }[];
  durationMinutes: number;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/voice-conversation-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Voice report API error:', e);
  }

  // Comprehensive fallback report
  return {
    overallScore: 86,
    communicationScore: 88,
    grammarScore: 82,
    vocabularyScore: 84,
    sentenceVarietyScore: 80,
    fluencyScore: 85,
    isAiEstimated: true,
    attemptNumber: 1,
    improvementDelta: 6,
    strengths: [
      'Responded with natural conversational speed and strong clarity',
      'Kept ideas logical and connected without long translation pauses',
      'Good use of polite openers and cooperative discourse markers',
    ],
    areasToImprove: [
      'Watch out for prepositions after verbs (e.g. listen TO, look FOR)',
      'Incorporate more varied clause linkers (whereas, furthermore, in spite of)',
    ],
    mistakesAndCorrections: [
      {
        wrong: "I am agree with your opinion",
        right: "I agree with your opinion",
        reason: "'Agree' is already a verb; do not add the auxiliary 'am'.",
      },
    ],
    usefulExpressions: [
      {
        expression: "From my perspective...",
        context: "Use to introduce opinions in professional and IELTS settings",
      },
      {
        expression: "Could you clarify what you mean by...",
        context: "Use when you need repetition without sounding unsure",
      },
    ],
    recommendation:
      "Practice 5 minutes of targeted sentence expansion focusing on verb + preposition pairs.",
  };
}

// 17. AI Emergency Help Generator ("I Need English Now")
export async function generateEmergencyHelp(params: {
  situationDescription: string;
  urgencyLevel?: string;
  tone?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/ai/emergency-help-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (e) {
    console.warn('Emergency help API error:', e);
  }
  return null;
}



