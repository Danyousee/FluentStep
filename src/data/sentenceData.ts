import { SentenceExercise } from '../types';

export interface SentenceLevelInfo {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  formula: string;
  badge: string;
  color: string;
  examples: {
    sentence: string;
    breakdown: { text: string; role: string; color: string }[];
  }[];
}

export const SENTENCE_LEVELS_INFO: SentenceLevelInfo[] = [
  {
    level: 1,
    title: 'Basic Sentences',
    subtitle: 'Subject + Verb + Object',
    description: 'Learn the core foundation of English sentences: Who does what.',
    formula: 'Subject (Who) + Verb (Action) + Object (What)',
    badge: 'Foundation',
    color: 'emerald',
    examples: [
      {
        sentence: 'I eat rice.',
        breakdown: [
          { text: 'I', role: 'Subject', color: 'blue' },
          { text: 'eat', role: 'Verb', color: 'emerald' },
          { text: 'rice.', role: 'Object', color: 'amber' },
        ],
      },
      {
        sentence: 'She drinks tea.',
        breakdown: [
          { text: 'She', role: 'Subject', color: 'blue' },
          { text: 'drinks', role: 'Verb', color: 'emerald' },
          { text: 'tea.', role: 'Object', color: 'amber' },
        ],
      },
    ],
  },
  {
    level: 2,
    title: 'Questions',
    subtitle: 'Do / Does / Is / Are + Subject + Verb',
    description: 'Ask polite questions to find information and have conversations.',
    formula: 'Auxiliary (Do/Does/Is) + Subject + Main Verb + Object?',
    badge: 'Questions',
    color: 'blue',
    examples: [
      {
        sentence: 'Do you speak English?',
        breakdown: [
          { text: 'Do', role: 'Auxiliary', color: 'purple' },
          { text: 'you', role: 'Subject', color: 'blue' },
          { text: 'speak', role: 'Verb', color: 'emerald' },
          { text: 'English?', role: 'Object', color: 'amber' },
        ],
      },
    ],
  },
  {
    level: 3,
    title: 'Negative Sentences',
    subtitle: 'Subject + do not / does not + Verb',
    description: 'Express what someone does not do or what is not true.',
    formula: 'Subject + do/does not + Verb + Object',
    badge: 'Negatives',
    color: 'rose',
    examples: [
      {
        sentence: 'He does not eat meat.',
        breakdown: [
          { text: 'He', role: 'Subject', color: 'blue' },
          { text: 'does not', role: 'Auxiliary + Not', color: 'rose' },
          { text: 'eat', role: 'Verb', color: 'emerald' },
          { text: 'meat.', role: 'Object', color: 'amber' },
        ],
      },
    ],
  },
  {
    level: 4,
    title: 'Past Tense',
    subtitle: 'Subject + Past Verb + Place/Time',
    description: 'Talk about what happened yesterday, last week, or in the past.',
    formula: 'Subject + Past Verb + Place + Time',
    badge: 'Past Tense',
    color: 'amber',
    examples: [
      {
        sentence: 'I went to the market yesterday.',
        breakdown: [
          { text: 'I', role: 'Subject', color: 'blue' },
          { text: 'went', role: 'Past Verb', color: 'emerald' },
          { text: 'to the market', role: 'Place', color: 'purple' },
          { text: 'yesterday.', role: 'Time', color: 'rose' },
        ],
      },
    ],
  },
  {
    level: 5,
    title: 'Future Tense',
    subtitle: 'Subject + will / going to + Verb',
    description: 'Plan your day and share what will happen in the future.',
    formula: 'Subject + will / is going to + Verb + Time',
    badge: 'Future Tense',
    color: 'indigo',
    examples: [
      {
        sentence: 'We will travel to Japan next month.',
        breakdown: [
          { text: 'We', role: 'Subject', color: 'blue' },
          { text: 'will travel', role: 'Future Verb', color: 'emerald' },
          { text: 'to Japan', role: 'Place', color: 'purple' },
          { text: 'next month.', role: 'Time', color: 'rose' },
        ],
      },
    ],
  },
  {
    level: 6,
    title: 'Present Continuous',
    subtitle: 'Subject + am/is/are + Verb-ing',
    description: 'Describe actions happening right now at this exact moment.',
    formula: 'Subject + be (am/is/are) + Verb-ing + Object',
    badge: 'Continuous',
    color: 'teal',
    examples: [
      {
        sentence: 'She is reading a novel now.',
        breakdown: [
          { text: 'She', role: 'Subject', color: 'blue' },
          { text: 'is reading', role: 'Continuous Verb', color: 'emerald' },
          { text: 'a novel', role: 'Object', color: 'amber' },
          { text: 'now.', role: 'Time', color: 'rose' },
        ],
      },
    ],
  },
  {
    level: 7,
    title: 'Comparisons',
    subtitle: 'A is more / -er than B',
    description: 'Compare two people, places, things, or experiences.',
    formula: 'Subject + Verb + Comparative Adjective + than + Object',
    badge: 'Comparisons',
    color: 'cyan',
    examples: [
      {
        sentence: 'Trains are faster than buses.',
        breakdown: [
          { text: 'Trains', role: 'Subject', color: 'blue' },
          { text: 'are', role: 'Verb', color: 'emerald' },
          { text: 'faster than', role: 'Comparative', color: 'amber' },
          { text: 'buses.', role: 'Object', color: 'purple' },
        ],
      },
    ],
  },
  {
    level: 8,
    title: 'Compound Sentences',
    subtitle: 'Sentence A + and / but / so + Sentence B',
    description: 'Join two related ideas together smoothly using connecting words.',
    formula: 'Clause 1 + Conjunction (and/but/so/or) + Clause 2',
    badge: 'Compound',
    color: 'violet',
    examples: [
      {
        sentence: 'I was tired, but I finished my homework.',
        breakdown: [
          { text: 'I was tired,', role: 'Clause 1', color: 'blue' },
          { text: 'but', role: 'Conjunction', color: 'rose' },
          { text: 'I finished my homework.', role: 'Clause 2', color: 'emerald' },
        ],
      },
    ],
  },
  {
    level: 9,
    title: 'Complex Sentences',
    subtitle: 'Because / When / Although + Clauses',
    description: 'Give reasons, conditions, and time relationships.',
    formula: 'Subordinator (Because/When/If) + Condition + Main Result',
    badge: 'Complex',
    color: 'fuchsia',
    examples: [
      {
        sentence: 'Because it was raining, we stayed indoors.',
        breakdown: [
          { text: 'Because', role: 'Subordinator', color: 'rose' },
          { text: 'it was raining,', role: 'Reason Clause', color: 'blue' },
          { text: 'we stayed indoors.', role: 'Main Clause', color: 'emerald' },
        ],
      },
    ],
  },
  {
    level: 10,
    title: 'Natural Conversation',
    subtitle: 'Idiomatic & Polite Expressions',
    description: 'Construct native-sounding conversational sentences smoothly.',
    formula: 'Polite Opener + Request / Opinion + Context',
    badge: 'Fluency',
    color: 'amber',
    examples: [
      {
        sentence: 'Would you mind helping me with this suitcase?',
        breakdown: [
          { text: 'Would you mind', role: 'Polite Opener', color: 'purple' },
          { text: 'helping', role: 'Verb-ing', color: 'emerald' },
          { text: 'me', role: 'Object', color: 'blue' },
          { text: 'with this suitcase?', role: 'Context', color: 'amber' },
        ],
      },
    ],
  },
];

export const SENTENCE_EXERCISES: SentenceExercise[] = [
  // LEVEL 1: Basic Sentences (S + V + O)
  {
    id: 'sent_l1_1',
    level: 1,
    levelTitle: 'Basic Sentences',
    targetSentence: 'I go to school.',
    jumbledWords: ['school', 'I', 'go', 'to'],
    formula: 'Subject + Verb + Place',
    parts: [
      { text: 'I', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'go', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'to school', type: 'place', label: 'Place', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
    ],
    hint: 'In English, the person doing the action (Subject) comes first, followed by the action (Verb).',
    ruleExplanation: 'English follows Subject + Verb + Place order: "I" (subject) + "go" (verb) + "to school" (place).',
    translationMeaning: 'I attend school as a student.',
  },
  {
    id: 'sent_l1_2',
    level: 1,
    levelTitle: 'Basic Sentences',
    targetSentence: 'She drinks coffee every morning.',
    jumbledWords: ['coffee', 'She', 'every', 'drinks', 'morning'],
    formula: 'Subject + Verb + Object + Time',
    parts: [
      { text: 'She', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'drinks', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'coffee', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
      { text: 'every morning', type: 'time', label: 'Time', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
    ],
    hint: 'Time words like "every morning" typically go at the very end of the sentence.',
    ruleExplanation: 'Formula: Subject (She) + Verb (drinks) + Object (coffee) + Time phrase (every morning).',
  },
  {
    id: 'sent_l1_3',
    level: 1,
    levelTitle: 'Basic Sentences',
    targetSentence: 'I eat rice at home.',
    jumbledWords: ['home', 'I', 'eat', 'at', 'rice'],
    formula: 'Subject + Verb + Object + Place',
    parts: [
      { text: 'I', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'eat', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'rice', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
      { text: 'at home', type: 'place', label: 'Place', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
    ],
    hint: 'First state what is being eaten (Object: rice), then where it is eaten (Place: at home).',
    ruleExplanation: 'In standard English, place phrases come after direct objects: Subject + Verb + Object + Place.',
  },

  // LEVEL 2: Questions
  {
    id: 'sent_l2_1',
    level: 2,
    levelTitle: 'Questions',
    targetSentence: 'Do you like Italian food?',
    jumbledWords: ['food', 'you', 'Italian', 'Do', 'like'],
    formula: 'Auxiliary + Subject + Verb + Object',
    parts: [
      { text: 'Do', type: 'auxiliary', label: 'Auxiliary', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
      { text: 'you', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'like', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'Italian food', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
    hint: 'Yes/No questions with general verbs start with the helping verb "Do" or "Does".',
    ruleExplanation: 'Start with Auxiliary "Do" + Subject "you" + Base Verb "like" + Object "Italian food".',
  },
  {
    id: 'sent_l2_2',
    level: 2,
    levelTitle: 'Questions',
    targetSentence: 'Where does your brother live?',
    jumbledWords: ['brother', 'Where', 'your', 'live', 'does'],
    formula: 'Question Word + Auxiliary + Subject + Verb',
    parts: [
      { text: 'Where', type: 'question_word', label: 'Question Word', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
      { text: 'does', type: 'auxiliary', label: 'Auxiliary', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
      { text: 'your brother', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'live', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    ],
    hint: 'Wh-questions place the question word first (Where), followed immediately by the auxiliary (does).',
    ruleExplanation: 'Question Word (Where) + Helper (does) + Subject (your brother) + Base verb (live).',
  },

  // LEVEL 3: Negative Sentences
  {
    id: 'sent_l3_1',
    level: 3,
    levelTitle: 'Negative Sentences',
    targetSentence: 'He does not understand the question.',
    jumbledWords: ['understand', 'He', 'question', 'does', 'the', 'not'],
    formula: 'Subject + does not + Verb + Object',
    parts: [
      { text: 'He', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'does not', type: 'auxiliary', label: 'Auxiliary + Not', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
      { text: 'understand', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'the question', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
    hint: 'For "he/she/it", use "does not" followed by the base form of the verb without "s".',
    ruleExplanation: 'Subject (He) + does not + Base verb (understand) + Object (the question).',
  },

  // LEVEL 4: Past Tense
  {
    id: 'sent_l4_1',
    level: 4,
    levelTitle: 'Past Tense',
    targetSentence: 'I visited my grandparents last weekend.',
    jumbledWords: ['grandparents', 'visited', 'I', 'weekend', 'last', 'my'],
    formula: 'Subject + Past Verb + Object + Time',
    parts: [
      { text: 'I', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'visited', type: 'verb', label: 'Past Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'my grandparents', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
      { text: 'last weekend', type: 'time', label: 'Time', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
    ],
    hint: 'The completed time expression "last weekend" belongs at the end of the sentence.',
    ruleExplanation: 'Subject (I) + Past tense verb (visited) + Object (my grandparents) + Past time phrase (last weekend).',
  },

  // LEVEL 5: Future Tense
  {
    id: 'sent_l5_1',
    level: 5,
    levelTitle: 'Future Tense',
    targetSentence: 'We will attend the meeting tomorrow afternoon.',
    jumbledWords: ['meeting', 'will', 'We', 'afternoon', 'attend', 'tomorrow', 'the'],
    formula: 'Subject + will + Verb + Object + Time',
    parts: [
      { text: 'We', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'will attend', type: 'verb', label: 'Future Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'the meeting', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
      { text: 'tomorrow afternoon', type: 'time', label: 'Time', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
    ],
    hint: '"will" is placed before the base verb "attend".',
    ruleExplanation: 'Subject + will + base verb + object + future time marker.',
  },

  // LEVEL 6: Present Continuous
  {
    id: 'sent_l6_1',
    level: 6,
    levelTitle: 'Present Continuous',
    targetSentence: 'They are preparing dinner in the kitchen.',
    jumbledWords: ['kitchen', 'are', 'the', 'They', 'in', 'dinner', 'preparing'],
    formula: 'Subject + are + Verb-ing + Object + Place',
    parts: [
      { text: 'They', type: 'subject', label: 'Subject', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'are preparing', type: 'verb', label: 'Be + V-ing', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'dinner', type: 'object', label: 'Object', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
      { text: 'in the kitchen', type: 'place', label: 'Place', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
    ],
    hint: 'Form the continuous action with "are preparing" before describing where.',
    ruleExplanation: 'Subject (They) + auxiliary (are) + participle (preparing) + Object (dinner) + Place (in the kitchen).',
  },

  // LEVEL 7: Comparisons
  {
    id: 'sent_l7_1',
    level: 7,
    levelTitle: 'Comparisons',
    targetSentence: 'This laptop is more expensive than my phone.',
    jumbledWords: ['laptop', 'expensive', 'This', 'my', 'phone', 'is', 'more', 'than'],
    formula: 'Item A + is + more [Adjective] than + Item B',
    parts: [
      { text: 'This laptop', type: 'subject', label: 'Subject A', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'is', type: 'verb', label: 'Verb', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'more expensive than', type: 'adverb', label: 'Comparison', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
      { text: 'my phone', type: 'object', label: 'Subject B', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
    ],
    hint: 'Multi-syllable adjectives like "expensive" use "more ... than" for comparison.',
    ruleExplanation: 'Use "more + adjective + than" when comparing two nouns.',
  },

  // LEVEL 8: Compound Sentences
  {
    id: 'sent_l8_1',
    level: 8,
    levelTitle: 'Compound Sentences',
    targetSentence: 'I wanted to go for a walk, but it started to rain.',
    jumbledWords: ['for', 'walk', 'started', 'a', 'I', 'wanted', 'to', 'go', 'but', 'it', 'rain', 'to'],
    formula: 'Clause 1 + , but + Clause 2',
    parts: [
      { text: 'I wanted to go for a walk', type: 'subject', label: 'First Idea', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'but', type: 'conjunction', label: 'Contrast Word', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
      { text: 'it started to rain', type: 'object', label: 'Second Idea', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    ],
    hint: 'Use the coordinating conjunction "but" to connect contrasting facts.',
    ruleExplanation: 'Join two independent clauses with a comma and the connecting word "but".',
  },

  // LEVEL 9: Complex Sentences
  {
    id: 'sent_l9_1',
    level: 9,
    levelTitle: 'Complex Sentences',
    targetSentence: 'Although he was very tired, he continued studying for the exam.',
    jumbledWords: ['he', 'tired', 'for', 'exam', 'was', 'very', 'Although', 'studying', 'he', 'continued', 'the'],
    formula: 'Although + Clause 1, + Clause 2',
    parts: [
      { text: 'Although', type: 'conjunction', label: 'Subordinator', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
      { text: 'he was very tired', type: 'subject', label: 'Dependent Clause', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
      { text: 'he continued studying for the exam', type: 'object', label: 'Main Clause', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    ],
    hint: 'When "Although" starts the sentence, separate the two ideas with a comma.',
    ruleExplanation: 'Subordinating conjunctions create a relationship of concession or reason.',
  },

  // LEVEL 10: Natural Conversation
  {
    id: 'sent_l10_1',
    level: 10,
    levelTitle: 'Natural Conversation',
    targetSentence: 'Could you please let me know when the package arrives?',
    jumbledWords: ['know', 'arrives', 'Could', 'please', 'me', 'the', 'package', 'let', 'when', 'you'],
    formula: 'Polite Request + Embedded Question Clause',
    parts: [
      { text: 'Could you please', type: 'auxiliary', label: 'Polite Opener', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
      { text: 'let me know', type: 'verb', label: 'Request Verb Phrase', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { text: 'when the package arrives', type: 'object', label: 'Embedded Clause', colorClass: 'bg-purple-100 text-purple-800 border-purple-300' },
    ],
    hint: 'Start with the polite modal phrase "Could you please".',
    ruleExplanation: 'In natural business/daily conversation, indirect questions are polite: Could you please + verb + when...',
  },
];

export const HOW_TO_BUILD_LESSON = {
  title: 'How to Build an English Sentence',
  subtitle: 'The 7-Step Method for Perfect Word Order Every Time',
  description:
    'English is an S-V-O language (Subject-Verb-Object). Follow these 7 clear steps to turn your thoughts into clear, natural English sentences.',
  steps: [
    {
      number: 1,
      title: 'Find the Subject (Who or What?)',
      explanation: 'Ask yourself: Who is doing the action? The subject always comes first in normal statements.',
      examples: ['"I"', '"My teacher"', '"The train"', '"Sarah and David"'],
      color: 'blue',
    },
    {
      number: 2,
      title: 'Choose the Verb (What is the action?)',
      explanation: 'What is the subject doing or experiencing? Check if you need past, present, or future form.',
      examples: ['"eats"', '"went"', '"will arrive"', '"is studying"'],
      color: 'emerald',
    },
    {
      number: 3,
      title: 'Add the Object (Who or what receives the action?)',
      explanation: 'If the verb acts on something or someone, place the object right after the verb.',
      examples: ['"rice"', '"an email"', '"the guitar"', '"a cup of coffee"'],
      color: 'amber',
    },
    {
      number: 4,
      title: 'Add Manner or Adverbs (How?)',
      explanation: 'Describe how the action was done. Adverbs often sit before the main verb or after the object.',
      examples: ['"quickly"', '"carefully"', '"fluently"'],
      color: 'cyan',
    },
    {
      number: 5,
      title: 'Add the Place (Where?)',
      explanation: 'Tell the listener where the action takes place. In English, Place almost always comes before Time.',
      examples: ['"at home"', '"in the library"', '"at the office"', '"to the airport"'],
      color: 'purple',
    },
    {
      number: 6,
      title: 'Add the Time (When?)',
      explanation: 'When did it happen? Time phrases usually go at the very end (or occasionally at the very beginning for emphasis).',
      examples: ['"yesterday"', '"every morning"', '"at 5 PM"', '"next week"'],
      color: 'rose',
    },
    {
      number: 7,
      title: 'Check Punctuation & Capitalization',
      explanation: 'Always start with a capital letter and end with a period (.), question mark (?), or exclamation mark (!).',
      examples: ['"I eat rice at home every evening."'],
      color: 'indigo',
    },
  ],
  sampleBreakdown: {
    sentence: 'I went to the market yesterday.',
    parts: [
      { text: 'I', role: 'Subject (Step 1)', color: 'blue' },
      { text: 'went', role: 'Verb (Step 2)', color: 'emerald' },
      { text: 'to the market', role: 'Place (Step 5)', color: 'purple' },
      { text: 'yesterday.', role: 'Time (Step 6)', color: 'rose' },
    ],
  },
};
