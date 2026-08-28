import { PhrasalVerb } from '../types';

export type PhrasalVerbItem = PhrasalVerb & {
  separable?: boolean;
  category?: string;
  quiz?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
};

export const PHRASAL_VERBS_DATA: PhrasalVerb[] = [
  {
    id: 'pv_give_up',
    verb: 'give',
    particles: ['up'],
    meaning: 'To stop trying or quit doing something.',
    simpleExplanation: 'When you surrender or stop doing a habit or activity.',
    example: "Don't give up on learning English; with daily practice you will succeed.",
    commonMistake: 'Saying "give out" when you mean stop trying.',
    miniDialogue: [
      { speaker: 'Tutor Alex', text: 'Sentence structures seem tough today, but keep pushing!' },
      { speaker: 'Learner', text: 'I will never give up! I want to speak fluently.' },
    ],
    quizQuestion: {
      prompt: 'Complete the sentence: "Learning a new language takes time, so do not _______!"',
      options: ['give up', 'give in', 'give off', 'give away'],
      correctIndex: 0,
      explanation: "'Give up' means to stop trying or quit.",
    },
  },
  {
    id: 'pv_look_forward_to',
    verb: 'look',
    particles: ['forward', 'to'],
    meaning: 'To feel excited about something that is going to happen in the future.',
    simpleExplanation: 'Anticipating a good event happily.',
    example: 'I am looking forward to our next English lesson on Monday.',
    commonMistake: 'Follow with an -ing verb or noun (e.g. "look forward to meeting you", NOT "look forward to meet you").',
    miniDialogue: [
      { speaker: 'Friend', text: 'Are you excited for the weekend trip?' },
      { speaker: 'You', text: 'Yes! I am really looking forward to visiting the museum.' },
    ],
    quizQuestion: {
      prompt: 'Which sentence is grammatically correct?',
      options: [
        'I look forward to meeting you tomorrow.',
        'I look forward to meet you tomorrow.',
        'I look forward meeting you tomorrow.',
        'I looking forward to meet you tomorrow.',
      ],
      correctIndex: 0,
      explanation: "'Look forward to' is followed by a gerund (-ing form), so 'meeting you' is correct.",
    },
  },
  {
    id: 'pv_call_off',
    verb: 'call',
    particles: ['off'],
    meaning: 'To cancel an event or scheduled activity.',
    simpleExplanation: 'Cancelling a meeting, game, or party.',
    example: 'They had to call off the soccer match due to heavy thunderstorms.',
    commonMistake: 'Do not confuse with "put off" (which means to postpone/delay, not cancel).',
    miniDialogue: [
      { speaker: 'Manager', text: 'The client is sick today.' },
      { speaker: 'Colleague', text: 'Understood, let us call off the meeting and reschedule.' },
    ],
    quizQuestion: {
      prompt: '"Due to bad weather, the outdoor concert was _______."',
      options: ['called off', 'called out', 'called on', 'called for'],
      correctIndex: 0,
      explanation: "'Called off' means cancelled.",
    },
  },
  {
    id: 'pv_run_out_of',
    verb: 'run',
    particles: ['out', 'of'],
    meaning: 'To have no more of something left.',
    simpleExplanation: 'When your supply of milk, money, battery, or time is finished.',
    example: 'We ran out of coffee, so I need to go to the grocery store.',
    commonMistake: 'Saying "My phone is finished" instead of "My phone ran out of battery".',
    miniDialogue: [
      { speaker: 'Roommate', text: 'Can you make breakfast?' },
      { speaker: 'You', text: 'We ran out of eggs, so let me run to the store first.' },
    ],
    quizQuestion: {
      prompt: '"Hurry up! We are _______ time before the train departs."',
      options: ['running out of', 'running away to', 'running into', 'running after'],
      correctIndex: 0,
      explanation: "'Running out of' means using up all available supply or time.",
    },
  },
  {
    id: 'pv_figure_out',
    verb: 'figure',
    particles: ['out'],
    meaning: 'To understand or find a solution to a problem after thinking.',
    simpleExplanation: 'Solving or understanding something tricky.',
    example: 'After studying the grammar rules, I figured out how to use prepositions.',
    commonMistake: 'Saying "I discovered the math problem" instead of "I figured out the solution".',
    miniDialogue: [
      { speaker: 'Student', text: 'This sentence structure was confusing at first.' },
      { speaker: 'Tutor Alex', text: 'Did you figure out why the verb comes before the object?' },
    ],
    quizQuestion: {
      prompt: '"Can you help me _______ how to connect this microphone?"',
      options: ['figure out', 'figure in', 'figure up', 'figure at'],
      correctIndex: 0,
      explanation: "'Figure out' means to find the solution or understand how something works.",
    },
  },
  {
    id: 'pv_turn_down',
    verb: 'turn',
    particles: ['down'],
    meaning: '1. To reduce volume/heat. 2. To reject an offer or invitation.',
    simpleExplanation: 'Lowering sound or politely saying no to an offer.',
    example: 'He decided to turn down the job offer because the commute was too far.',
    commonMistake: 'Confusing with "turn off" (which shuts down completely).',
    miniDialogue: [
      { speaker: 'Interviewer', text: 'Why did she decline the position?' },
      { speaker: 'HR', text: 'She had to turn down the offer to stay in her current city.' },
    ],
    quizQuestion: {
      prompt: '"Please _______ the music volume; the baby is sleeping."',
      options: ['turn down', 'turn off', 'turn over', 'turn up'],
      correctIndex: 0,
      explanation: "'Turn down' means reduce the volume/intensity.",
    },
  },
];

export const PHRASAL_VERBS = PHRASAL_VERBS_DATA;
