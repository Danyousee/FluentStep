import { ContextualVocabItem } from '../types';

export const CONTEXTUAL_VOCAB_DATA: ContextualVocabItem[] = [
  {
    id: 'ctx_run',
    word: 'Run',
    phonetic: '/rʌn/',
    partOfSpeech: 'verb',
    contexts: [
      {
        senseNumber: 1,
        meaning: 'To move fast using your legs (Physical sprint)',
        sentence: 'I run five kilometers in the park every morning before breakfast.',
        contextLabel: 'Physical Exercise',
      },
      {
        senseNumber: 2,
        meaning: 'To operate or function (Machines, computers, engines)',
        sentence: 'Leave the engine running for a minute so the car warms up.',
        contextLabel: 'Machinery & Tech',
      },
      {
        senseNumber: 3,
        meaning: 'To manage or direct a business or team',
        sentence: 'She runs a successful digital marketing agency with twenty employees.',
        contextLabel: 'Business & Management',
      },
      {
        senseNumber: 4,
        meaning: 'To do errands or short shopping trips',
        sentence: 'I have to run some errands this afternoon, including picking up dry cleaning.',
        contextLabel: 'Daily Errands',
      },
    ],
    quiz: {
      question: 'Which meaning of "run" is used in this sentence: "Our company software is running smoothly after the update."?',
      contextSentence: 'Our company software is running smoothly after the update.',
      options: [
        'Moving fast on foot',
        'Operating and functioning properly',
        'Managing a company',
        'Running an errand',
      ],
      correctIndex: 1,
      explanation: 'In software and machinery contexts, "running" means operating or functioning.',
    },
  },
  {
    id: 'ctx_head',
    word: 'Head',
    phonetic: '/hed/',
    partOfSpeech: 'noun',
    contexts: [
      {
        senseNumber: 1,
        meaning: 'The upper part of the human body containing brain and eyes',
        sentence: 'I wore a helmet to protect my head while cycling.',
        contextLabel: 'Anatomy',
      },
      {
        senseNumber: 2,
        meaning: 'To move or travel in a specific direction (Verb)',
        sentence: 'It is getting late, so we should head home before the rain starts.',
        contextLabel: 'Direction & Movement',
      },
      {
        senseNumber: 3,
        meaning: 'The leader or director of an organization or department',
        sentence: 'She was appointed as the new head of the marketing department.',
        contextLabel: 'Leadership Role',
      },
    ],
    quiz: {
      question: 'In the sentence "Where are you heading after work?", what does "head" mean?',
      contextSentence: 'Where are you heading after work?',
      options: [
        'Thinking with your mind',
        'Moving or traveling towards a destination',
        'Leading a committee',
        'Resting on a pillow',
      ],
      correctIndex: 1,
      explanation: '"Heading to/towards" is a natural everyday phrasal verb meaning traveling towards a place.',
    },
  },
  {
    id: 'ctx_break',
    word: 'Break',
    phonetic: '/breɪk/',
    partOfSpeech: 'verb',
    contexts: [
      {
        senseNumber: 1,
        meaning: 'To separate into pieces as a result of a blow or shock',
        sentence: 'Be careful with that glass vase or it might break.',
        contextLabel: 'Physical Damage',
      },
      {
        senseNumber: 2,
        meaning: 'A short pause or rest in work or study (Noun)',
        sentence: 'Let\'s take a quick ten-minute coffee break to recharge.',
        contextLabel: 'Rest & Pause',
      },
      {
        senseNumber: 3,
        meaning: 'To violate a rule, promise, or law',
        sentence: 'You should never break a promise made to a friend.',
        contextLabel: 'Ethics & Rules',
      },
      {
        senseNumber: 4,
        meaning: 'A fortunate opportunity or turning point',
        sentence: 'Landing that first international internship was her big break.',
        contextLabel: 'Career & Luck',
      },
    ],
    quiz: {
      question: 'What is the meaning of "break" in: "We have been studying for three hours; let\'s take a break."?',
      contextSentence: 'We have been studying for three hours; let\'s take a break.',
      options: [
        'Damage something fragile',
        'A short rest or pause',
        'Violate a regulation',
        'A lucky opportunity',
      ],
      correctIndex: 1,
      explanation: '"Take a break" means taking a temporary rest from continuous effort.',
    },
  },
  {
    id: 'ctx_book',
    word: 'Book',
    phonetic: '/bʊk/',
    partOfSpeech: 'noun',
    contexts: [
      {
        senseNumber: 1,
        meaning: 'A written or printed work with pages (Noun)',
        sentence: 'I am reading an interesting book about world history.',
        contextLabel: 'Reading Material',
      },
      {
        senseNumber: 2,
        meaning: 'To reserve accommodation, tickets, or a table in advance (Verb)',
        sentence: 'We should book our flight tickets early to secure the lowest price.',
        contextLabel: 'Reservations',
      },
      {
        senseNumber: 3,
        meaning: 'To officially record details of an offense (Legal / Sports)',
        sentence: 'The referee booked the player with a yellow card for the rough tackle.',
        contextLabel: 'Sports & Law',
      },
    ],
    quiz: {
      question: 'Identify the sense of "book" in: "I called the hotel to book a double room for Friday night."?',
      contextSentence: 'I called the hotel to book a double room for Friday night.',
      options: [
        'A paperback novel',
        'To reserve in advance',
        'To issue a penalty',
        'To write a journal',
      ],
      correctIndex: 1,
      explanation: 'In travel and dining contexts, "to book" means to make a reservation in advance.',
    },
  },
  {
    id: 'ctx_charge',
    word: 'Charge',
    phonetic: '/tʃɑːrdʒ/',
    partOfSpeech: 'verb',
    contexts: [
      {
        senseNumber: 1,
        meaning: 'To demand an amount of money as a price for a service or goods',
        sentence: 'The repair shop charges fifty dollars per hour for labor.',
        contextLabel: 'Money & Cost',
      },
      {
        senseNumber: 2,
        meaning: 'To supply a battery or device with electrical energy',
        sentence: 'I need to charge my smartphone because the battery is at five percent.',
        contextLabel: 'Electronics & Battery',
      },
      {
        senseNumber: 3,
        meaning: 'To be in control of or responsible for something (in charge of)',
        sentence: 'Julia is in charge of organizing the international conference.',
        contextLabel: 'Leadership & Duty',
      },
    ],
    quiz: {
      question: 'What does "in charge of" mean in: "Who is in charge of customer support?"?',
      contextSentence: 'Who is in charge of customer support?',
      options: [
        'Paying money for support',
        'Plugging support into electricity',
        'Responsible for managing and overseeing',
        'Accusing of a crime',
      ],
      correctIndex: 2,
      explanation: '"In charge of" is a key workplace collocation meaning responsible for managing.',
    },
  },
];

export const CONTEXTUAL_VOCAB_GROUPS = CONTEXTUAL_VOCAB_DATA;

