import { UserLevel } from '../types';

export interface CommonMistakeEntry {
  id: string;
  incorrect: string;
  correct: string;
  level: UserLevel;
  category: 'Grammar' | 'Prepositions' | 'Vocabulary Choice' | 'Tenses' | 'Regional & Context Nuance' | 'Spelling & Homophones';
  why: string;
  explanation: string;
  correctExample: string;
  incorrectExample: string;
  isRegionalOrContextual?: boolean;
  regionalContextNote?: string;
  quiz: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const COMMON_MISTAKES_DATABASE: CommonMistakeEntry[] = [
  {
    id: 'borrow-vs-lend',
    incorrect: 'Can you borrow me some money?',
    correct: 'Can you lend me some money? / Can I borrow some money?',
    level: 'A1',
    category: 'Vocabulary Choice',
    why: '"Borrow" means to take/receive temporarily. "Lend" means to give temporarily.',
    explanation: 'Think of direction: BORROW comes IN (to you), while LEND goes OUT (from you to someone else).',
    correctExample: 'Could you please lend me your charger? / May I borrow your charger?',
    incorrectExample: 'Please borrow me your laptop for one hour.',
    quiz: {
      prompt: 'Complete the sentence: "I forgot my pen. Can I ________ yours for a minute?"',
      options: ['borrow', 'lend', 'rent', 'loan me'],
      correctIndex: 0,
      explanation: 'Use "borrow" because you are the one receiving the pen temporarily.',
    },
  },
  {
    id: 'explained-me',
    incorrect: 'The teacher explained me the rule.',
    correct: 'The teacher explained the rule to me.',
    level: 'A2',
    category: 'Prepositions',
    why: 'The verb "explain" cannot take a person as a direct object without the preposition "to".',
    explanation: 'The pattern is: explain [SOMETHING] to [SOMEONE]. Contrast with "told me the rule".',
    correctExample: 'She explained the process to our team.',
    incorrectExample: 'She explained our team the process.',
    quiz: {
      prompt: 'Which sentence is grammatically correct?',
      options: [
        'He explained me the whole situation.',
        'He explained the whole situation to me.',
        'He explained to the situation to me.',
        'He was explaining me.',
      ],
      correctIndex: 1,
      explanation: 'Correct formula: explain [something] + to [someone].',
    },
  },
  {
    id: 'since-vs-for',
    incorrect: 'I have lived here since 5 years.',
    correct: 'I have lived here for 5 years. / I have lived here since 2019.',
    level: 'A2',
    category: 'Tenses',
    why: 'Use "FOR" for a duration or period of time. Use "SINCE" for a specific starting point in time.',
    explanation: 'FOR = duration (for 2 days, for 5 years, for a long time). SINCE = starting point (since Monday, since 2020, since 8:00 AM).',
    correctExample: 'I have been studying English for three months.',
    incorrectExample: 'I have been studying English since three months.',
    quiz: {
      prompt: 'Choose the correct preposition: "David has worked at this hospital ________ 2018."',
      options: ['since', 'for', 'during', 'from'],
      correctIndex: 0,
      explanation: '2018 is a specific starting point in time, so "since" is required.',
    },
  },
  {
    id: 'look-forward-to',
    incorrect: 'I look forward to meet you.',
    correct: 'I look forward to meeting you.',
    level: 'B1',
    category: 'Grammar',
    why: 'In "look forward to", the word "to" is a preposition, not an infinitive marker. Prepositions require a gerund (-ing).',
    explanation: 'Whenever "to" is a preposition, it must be followed by a noun or an -ing verb (e.g. look forward to seeing, used to living).',
    correctExample: 'We look forward to hearing from you soon.',
    incorrectExample: 'We look forward to hear your news.',
    quiz: {
      prompt: 'Select the correct email closing: "I look forward to ________ our partnership."',
      options: ['expanding', 'expand', 'expanded', 'to expand'],
      correctIndex: 0,
      explanation: '"Look forward to" is followed by a gerund (-ing verb).',
    },
  },
  {
    id: 'flash-me-regional',
    incorrect: 'Flash me when you arrive.',
    correct: 'Give me a missed call / Give me a quick call / Buzz me when you arrive.',
    level: 'A2',
    category: 'Regional & Context Nuance',
    why: '"Flash me" is common in Nigerian and Ghanaian English meaning a brief missed call, but in Standard British/American English it means exposing oneself inappropriately.',
    explanation: 'While widely understood across West Africa, using "flash me" with international speakers can cause significant embarrassment or confusion.',
    isRegionalOrContextual: true,
    regionalContextNote: 'Perfect for local informal chats in Nigeria, but replace with "give me a missed call / quick ring" in global workplace contexts.',
    correctExample: 'Give me a quick ring when your taxi gets to the gate.',
    incorrectExample: 'Please flash me as soon as you get outside.',
    quiz: {
      prompt: 'What is the most natural international English alternative to "Flash me when you reach"?',
      options: [
        'Give me a missed call or quick ring when you arrive.',
        'Signal me with light when you get there.',
        'Drop me a flash message.',
        'Make a flashlight sound.',
      ],
      correctIndex: 0,
      explanation: '"Give me a quick ring / missed call" is natural and avoids unintended misunderstandings internationally.',
    },
  },
  {
    id: 'congratulations-for',
    incorrect: 'Congratulations for your promotion!',
    correct: 'Congratulations on your promotion!',
    level: 'B1',
    category: 'Prepositions',
    why: 'The standard preposition following "congratulations" or "congratulate" is "ON", not "FOR".',
    explanation: 'Always say: Congratulations ON your wedding, ON passing your exam, ON your new job.',
    correctExample: 'Congratulations on achieving your IELTS band score!',
    incorrectExample: 'Congratulations for achieving your goal!',
    quiz: {
      prompt: 'Fill in the blank: "We would like to congratulate you ________ winning the championship."',
      options: ['on', 'for', 'about', 'with'],
      correctIndex: 0,
      explanation: 'The verb "congratulate" and noun "congratulations" always take "on".',
    },
  },
  {
    id: 'do-a-mistake',
    incorrect: 'I did a mistake in the exam.',
    correct: 'I made a mistake in the exam.',
    level: 'A1',
    category: 'Vocabulary Choice',
    why: '"Mistake" strictly collocates with the verb "make", never with "do".',
    explanation: 'Collocations with MAKE: make a mistake, make a decision, make friends, make money. Collocations with DO: do homework, do business, do exercise.',
    correctExample: 'Don\'t worry about making mistakes—that is how we learn!',
    incorrectExample: 'Don\'t worry about doing mistakes.',
    quiz: {
      prompt: 'Choose the correct verb: "Everyone ________ mistakes when learning a new language."',
      options: ['makes', 'does', 'creates', 'performs'],
      correctIndex: 0,
      explanation: 'The natural English collocation is "make a mistake".',
    },
  },
  {
    id: 'discuss-about',
    incorrect: 'Let us discuss about the proposal.',
    correct: 'Let us discuss the proposal.',
    level: 'B2',
    category: 'Prepositions',
    why: '"Discuss" is a transitive verb that takes an object directly without the preposition "about".',
    explanation: 'Say "discuss the topic" (no about) OR "talk about the topic". Do not combine them into "discuss about".',
    correctExample: 'We need to discuss the project budget tomorrow.',
    incorrectExample: 'We need to discuss about the budget.',
    quiz: {
      prompt: 'Which of the following is correct?',
      options: [
        'We will discuss the plan in the meeting.',
        'We will discuss about the plan in the meeting.',
        'We will discuss regarding the plan.',
        'We will discussing the plan.',
      ],
      correctIndex: 0,
      explanation: '"Discuss" takes a direct object without "about".',
    },
  },
];
