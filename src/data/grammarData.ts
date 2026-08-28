import { GrammarTopic } from '../types';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'grammar_articles',
    title: 'Articles (A, An, The)',
    level: 'A1',
    icon: 'FileText',
    shortDesc: 'Learn when to use "a", "an", "the", or no article at all.',
    summary: 'Articles point out whether you are speaking about something general or something specific.',
    rules: [
      {
        ruleTitle: 'Use "A" and "An" for single, general items',
        explanation: 'Use "a" before consonant sounds (a book, a university) and "an" before vowel sounds (an apple, an hour).',
        formula: 'A / An + Singular Countable Noun (general)',
        examples: [
          { correct: 'I bought an apple and a sandwich for lunch.', note: 'General items mentioned for the first time.' },
          { correct: 'She is an honest person.', note: '"honest" starts with a silent H vowel sound.' },
        ],
      },
      {
        ruleTitle: 'Use "The" for specific or known items',
        explanation: 'Use "the" when both the speaker and listener already know which specific thing is being discussed.',
        formula: 'The + Noun (specific / unique / already mentioned)',
        examples: [
          { correct: 'The sun rises in the east.', note: 'Unique things in nature take "the".' },
          { correct: 'I bought a book yesterday. The book is exciting!', note: 'Second mention becomes specific.' },
        ],
      },
    ],
    commonMistakes: [
      {
        wrong: 'I am eating an banana.',
        right: 'I am eating a banana.',
        reason: '"Banana" starts with a consonant sound /b/, so use "a", not "an".',
      },
      {
        wrong: 'She is doctor.',
        right: 'She is a doctor.',
        reason: 'In English, singular professions require an article ("a doctor", "an engineer").',
      },
    ],
    quizQuestions: [
      {
        question: 'Which sentence uses articles correctly?',
        options: [
          'He is an architect and she is a engineer.',
          'He is an architect and she is an engineer.',
          'He is architect and she is engineer.',
          'He is the architect and she is a engineer.',
        ],
        correctIndex: 1,
        explanation: 'Both "architect" and "engineer" begin with vowel sounds, so both take "an".',
      },
      {
        question: 'Fill in the blank: "Could you pass me _____ salt on the table?"',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 2,
        explanation: 'We use "the" because we are referring to the specific salt on the table.',
      },
    ],
  },
  {
    id: 'grammar_prepositions',
    title: 'Prepositions of Time & Place (In, On, At)',
    level: 'A1',
    icon: 'MapPin',
    shortDesc: 'Master the golden pyramid rule for In, On, and At.',
    summary: 'Prepositions connect nouns to other words showing location, direction, or time.',
    rules: [
      {
        ruleTitle: 'Time Pyramid: IN (Broad) → ON (Specific days) → AT (Exact time)',
        explanation: 'IN for months/years/centuries ("in July", "in 2026"). ON for days/dates ("on Monday", "on May 5th"). AT for precise hours ("at 3:30 PM", "at night").',
        formula: 'IN (Century/Year/Month) → ON (Day/Date) → AT (Clock Time)',
        examples: [
          { correct: 'My birthday is in September, on September 15th, at 7:00 PM.' },
        ],
      },
      {
        ruleTitle: 'Place Pyramid: IN (Enclosed/City/Country) → ON (Surface/Street) → AT (Specific point)',
        explanation: 'IN Paris, ON Oxford Street, AT the bus stop.',
        formula: 'IN (Country/City) → ON (Street/Surface) → AT (Exact address/point)',
        examples: [
          { correct: 'We met in London, on Baker Street, at the coffee shop entrance.' },
        ],
      },
    ],
    commonMistakes: [
      {
        wrong: 'I will see you in Monday.',
        right: 'I will see you on Monday.',
        reason: 'Days of the week always take the preposition "on".',
      },
      {
        wrong: 'The movie starts on 8 o\'clock.',
        right: 'The movie starts at 8 o\'clock.',
        reason: 'Exact clock times always take "at".',
      },
    ],
    quizQuestions: [
      {
        question: 'Choose the correct preposition: "Our flight departs _____ 6:45 AM _____ Friday."',
        options: ['in / on', 'at / on', 'on / at', 'at / in'],
        correctIndex: 1,
        explanation: '"at" is used for specific times (6:45 AM) and "on" is used for days of the week (Friday).',
      },
    ],
  },
  {
    id: 'grammar_present_simple',
    title: 'Present Simple Tense',
    level: 'A1',
    icon: 'Clock',
    shortDesc: 'Habits, routines, and permanent truths.',
    summary: 'Used to describe things you do regularly or general facts.',
    rules: [
      {
        ruleTitle: 'Add -s or -es for He, She, It',
        explanation: 'I/You/We/They work. He/She/It works. Do not forget the 3rd person singular "s"!',
        formula: 'Subject + Base Verb (+s/es for He/She/It)',
        examples: [
          { correct: 'I live in New York, but my brother lives in Chicago.' },
          { correct: 'Water boils at 100 degrees Celsius.' },
        ],
      },
    ],
    commonMistakes: [
      {
        wrong: 'He teach English at university.',
        right: 'He teaches English at university.',
        reason: 'Third person singular "He" requires -es on verbs ending in -ch.',
      },
      {
        wrong: 'She don\'t know the answer.',
        right: 'She doesn\'t know the answer.',
        reason: 'Use "doesn\'t" (does not) for he/she/it negatives.',
      },
    ],
    quizQuestions: [
      {
        question: 'Which sentence is correct?',
        options: [
          'My sister watch TV every evening.',
          'My sister watches TV every evening.',
          'My sister watching TV every evening.',
          'My sister is watch TV every evening.',
        ],
        correctIndex: 1,
        explanation: 'For "My sister" (she), verbs ending in -ch add "-es": "watches".',
      },
    ],
  },
  {
    id: 'grammar_past_simple',
    title: 'Past Simple & Irregular Verbs',
    level: 'A2',
    icon: 'History',
    shortDesc: 'Completed actions in the past with time markers.',
    summary: 'Used for actions that finished at a specific time in the past.',
    rules: [
      {
        ruleTitle: 'Regular verbs add -ed; Irregular verbs change form',
        explanation: 'play → played, visit → visited. Go → went, buy → bought, see → saw, eat → ate.',
        formula: 'Subject + Past Verb Form (V2)',
        examples: [
          { correct: 'I visited my friend yesterday and we ate delicious pizza.' },
        ],
      },
      {
        ruleTitle: 'In questions and negatives, use base verb with Did / Didn\'t',
        explanation: 'Did you go? (NOT "Did you went?"). I didn\'t see it (NOT "I didn\'t saw it").',
        formula: 'Subject + didn\'t + Base Verb (V1)',
        examples: [
          { correct: 'Did you buy the tickets? No, I didn\'t buy them yet.' },
        ],
      },
    ],
    commonMistakes: [
      {
        wrong: 'I didn\'t went to work yesterday.',
        right: 'I didn\'t go to work yesterday.',
        reason: '"didn\'t" already holds the past tense, so the main verb must stay in base form "go".',
      },
      {
        wrong: 'She buyed a new car last week.',
        right: 'She bought a new car last week.',
        reason: '"Buy" is an irregular verb: buy → bought.',
      },
    ],
    quizQuestions: [
      {
        question: 'Choose the correct past tense sentence:',
        options: [
          'Did they visited their parents last Sunday?',
          'They didn\'t saw the movie yesterday.',
          'We went to the beach and had a wonderful time.',
          'He maked a delicious dinner for us.',
        ],
        correctIndex: 2,
        explanation: '"went" and "had" are correct irregular past tense verbs.',
      },
    ],
  },
  {
    id: 'grammar_subject_verb_agreement',
    title: 'Subject-Verb Agreement',
    level: 'A2',
    icon: 'CheckSquare',
    shortDesc: 'Matching singular and plural subjects with correct verbs.',
    summary: 'A singular subject takes a singular verb, whereas a plural subject takes a plural verb.',
    rules: [
      {
        ruleTitle: 'Singular subjects match singular verbs (with -s)',
        explanation: 'The dog barks. The dogs bark. Everyone/Everybody is treated as singular.',
        formula: 'Singular Subject + Verb+s | Plural Subject + Base Verb',
        examples: [
          { correct: 'Everyone in the office is working hard today.' },
          { correct: 'The list of items is on the table.' },
        ],
      },
    ],
    commonMistakes: [
      {
        wrong: 'Everyone are excited about the party.',
        right: 'Everyone is excited about the party.',
        reason: 'Words like "everyone", "everybody", "someone" take a singular verb ("is", not "are").',
      },
    ],
    quizQuestions: [
      {
        question: 'Which sentence is grammatically correct?',
        options: [
          'Neither of the students were ready for the test.',
          'One of my friends lives in Toronto.',
          'The group of tourists are arriving now.',
          'Everybody have their own opinions.',
        ],
        correctIndex: 1,
        explanation: '"One of my friends" has the singular subject "One", so it takes "lives".',
      },
    ],
  },
  {
    id: 'grammar_adjectives_adverbs',
    title: 'Adjectives vs. Adverbs',
    level: 'A2',
    icon: 'Sparkles',
    shortDesc: 'Adjectives describe nouns; Adverbs describe actions.',
    summary: 'Learn how to describe things vividly and explain how actions take place.',
    rules: [
      {
        ruleTitle: 'Adjectives describe nouns, Adverbs describe verbs',
        explanation: 'A quick runner (adj) runs quickly (adv). A fluent speaker (adj) speaks fluently (adv).',
        formula: 'Noun + is + Adjective | Verb + Adverb (-ly)',
        examples: [
          { correct: 'She is a careful driver. She drives very carefully.' },
          { correct: 'He is good at tennis. He plays tennis well.' },
        ],
      },
    ],
    commonMistakes: [
      {
        wrong: 'He speaks English very good.',
        right: 'He speaks English very well.',
        reason: '"Good" is an adjective. To describe the verb "speaks", use the adverb "well".',
      },
    ],
    quizQuestions: [
      {
        question: 'Fill in the blank: "Please drive _____ because the roads are icy."',
        options: ['slow', 'careful', 'slowly', 'extreme careful'],
        correctIndex: 2,
        explanation: '"slowly" is an adverb modifying the action verb "drive".',
      },
    ],
  },
  {
    id: 'grammar_future_tense',
    title: 'Future Tense: Will vs. Going To',
    level: 'A2',
    icon: 'ArrowRightCircle',
    shortDesc: 'Spontaneous decisions (will) vs planned intentions (going to).',
    summary: 'Know exactly when to use "will" versus "be going to".',
    rules: [
      {
        ruleTitle: 'Use "Will" for spontaneous decisions and promises',
        explanation: '"I forgot my wallet." → "Don\'t worry, I will pay!"',
        formula: 'Subject + will + Base Verb',
        examples: [{ correct: 'I will help you carry those bags.' }],
      },
      {
        ruleTitle: 'Use "Be Going To" for plans made before speaking',
        explanation: 'We bought the tickets last week; we are going to see a concert tonight.',
        formula: 'Subject + am/is/are + going to + Base Verb',
        examples: [{ correct: 'She is going to study medicine next year.' }],
      },
    ],
    commonMistakes: [
      {
        wrong: 'I am going to help you right now! (spontaneous offer)',
        right: 'I will help you right now!',
        reason: 'Instant spontaneous decisions made at the moment of speaking use "will".',
      },
    ],
    quizQuestions: [
      {
        question: 'The phone is ringing! What do you say?',
        options: [
          'I am going to answer it!',
          'I will answer it!',
          'I answer it!',
          'I am answering it yesterday!',
        ],
        correctIndex: 1,
        explanation: 'Instant decision made at the moment of hearing the ring uses "will".',
      },
    ],
  },
  {
    id: 'grammar_present_continuous',
    title: 'Present Continuous (Actions Right Now)',
    level: 'A1',
    icon: 'PlayCircle',
    shortDesc: 'What is happening right now at this exact moment.',
    summary: 'Subject + am/is/are + verb-ing.',
    rules: [
      {
        ruleTitle: 'Forming Present Continuous',
        explanation: 'I am eating. You are listening. She is writing.',
        formula: 'Subject + am/is/are + Verb-ing',
        examples: [{ correct: 'Look! It is starting to snow outside.' }],
      },
    ],
    commonMistakes: [
      {
        wrong: 'I am write an email right now.',
        right: 'I am writing an email right now.',
        reason: 'Continuous tense requires "-ing" on the main verb.',
      },
    ],
    quizQuestions: [
      {
        question: 'Which sentence describes an action happening right now?',
        options: [
          'She works as a teacher.',
          'She is currently preparing her lesson.',
          'She worked all day yesterday.',
          'She will work tomorrow.',
        ],
        correctIndex: 1,
        explanation: '"is currently preparing" is present continuous for an ongoing action.',
      },
    ],
  },
];
