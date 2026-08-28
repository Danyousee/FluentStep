import { WordChoiceItem } from '../types';

export const WORD_CHOICE_DATA: WordChoiceItem[] = [
  {
    id: 'wc_say_tell',
    pairTitle: 'Say vs. Tell',
    level: 'A1',
    words: [
      {
        word: 'Say',
        definition: 'To utter words. Focuses on the words spoken. Usually followed directly by the words or "that", but NEVER directly by a person object without "to".',
        keyRule: 'say + something OR say + TO someone (e.g. "He said that he was tired.")',
        example: 'She said hello to everyone in the room.',
      },
      {
        word: 'Tell',
        definition: 'To give information or instructions to a specific person. Always followed by the person (receiver) being told.',
        keyRule: 'tell + SOMEONE + something (e.g. "He told ME a secret.")',
        example: 'Can you tell me the time, please?',
      },
    ],
    differenceSummary: 'Use "tell" when you specify WHO receives the message directly (tell me, tell him, tell us). Use "say" when you focus purely on the words spoken (say hello, say that you agree).',
    commonMistake: {
      wrong: 'He said me that he was busy. (WRONG)',
      right: 'He told me that he was busy. OR He said that he was busy.',
      why: '"Say" cannot be followed directly by a personal pronoun object like "me" or "him".',
    },
    miniDialogue: [
      { speaker: 'Emma', text: 'Did Alex say anything about the meeting?' },
      { speaker: 'Lucas', text: 'Yes, he told me that it starts at 2:00 PM.' },
    ],
    quiz: {
      question: 'Please _____ me the truth about what happened.',
      options: ['say', 'tell', 'speak', 'explain'],
      correctIndex: 1,
      explanation: 'We use "tell" before a person object ("me"): "tell me the truth".',
    },
  },
  {
    id: 'wc_look_watch_see',
    pairTitle: 'Look vs. Watch vs. See',
    level: 'A2',
    words: [
      {
        word: 'See',
        definition: 'Natural, involuntary visual perception. Your eyes notice something automatically without effort.',
        keyRule: 'Involuntary / passive ability: "I see a bird in the tree."',
        example: 'Did you see that shooting star?',
      },
      {
        word: 'Look (at)',
        definition: 'Directing your eyes intentionally in a specific direction.',
        keyRule: 'Intentional focus: "Look at the whiteboard."',
        example: 'Look at this picture I took yesterday!',
      },
      {
        word: 'Watch',
        definition: 'Looking at something that is moving or changing over a period of time with active attention.',
        keyRule: 'Active, prolonged viewing (movies, sports, moving objects): "Watch a match."',
        example: 'We watched the soccer match together on TV.',
      },
    ],
    differenceSummary: '"See" is effortless visual perception. "Look at" is intentional direction of your eyes. "Watch" is observing dynamic movement or video over time.',
    commonMistake: {
      wrong: 'I saw a movie on Netflix for two hours. (UNNATURAL)',
      right: 'I watched a movie on Netflix last night.',
      why: 'For full films, video streams, or sports, native speakers use "watch".',
    },
    miniDialogue: [
      { speaker: 'David', text: 'Look at the sky! Do you see those dark clouds?' },
      { speaker: 'Sarah', text: 'Yes! Let\'s go inside and watch the thunderstorm from the window.' },
    ],
    quiz: {
      question: 'I usually _____ the news on TV while cooking dinner.',
      options: ['look', 'see', 'watch', 'glance'],
      correctIndex: 2,
      explanation: 'We use "watch" for television broadcasts, videos, and dynamic events over time.',
    },
  },
  {
    id: 'wc_borrow_lend',
    pairTitle: 'Borrow vs. Lend',
    level: 'A2',
    words: [
      {
        word: 'Borrow',
        definition: 'To take and use something belonging to someone else with the intention of returning it (INCOMING action).',
        keyRule: 'Borrow = take in (e.g. "Can I borrow your pen?")',
        example: 'I borrowed an umbrella from my coworker because it started raining.',
      },
      {
        word: 'Lend',
        definition: 'To give something to someone for a short time, expecting it to be given back (OUTGOING action).',
        keyRule: 'Lend = give out (e.g. "Could you lend me $10?")',
        example: 'My brother lent me his car for the weekend.',
      },
    ],
    differenceSummary: 'You BORROW from someone (you receive it). You LEND to someone (you give it temporarily).',
    commonMistake: {
      wrong: 'Can you borrow me your jacket? (WRONG)',
      right: 'Can you lend me your jacket? OR Can I borrow your jacket?',
      why: 'The owner "lends"; the receiver "borrows".',
    },
    miniDialogue: [
      { speaker: 'Maya', text: 'Could I borrow your laptop charger for an hour?' },
      { speaker: 'Leo', text: 'Sure, I can lend it to you until my battery runs low.' },
    ],
    quiz: {
      question: 'The bank agreed to _____ him $50,000 for his new business.',
      options: ['borrow', 'lend', 'hire', 'take'],
      correctIndex: 1,
      explanation: 'The bank is the provider/giver of the money temporarily, so the bank "lends" money.',
    },
  },
  {
    id: 'wc_bring_take',
    pairTitle: 'Bring vs. Take',
    level: 'A2',
    words: [
      {
        word: 'Bring',
        definition: 'Movement TOWARDS the speaker or the current location (HERE).',
        keyRule: 'Come towards here: "Bring it to me."',
        example: 'Please bring your notebooks to class tomorrow.',
      },
      {
        word: 'Take',
        definition: 'Movement AWAY from the speaker or current location (THERE).',
        keyRule: 'Go away to there: "Take this to the office."',
        example: 'Don\'t forget to take an umbrella when you leave the house.',
      },
    ],
    differenceSummary: '"Bring" moves towards where you are. "Take" moves away from where you are.',
    commonMistake: {
      wrong: 'When you come to my party tonight, take some snacks. (UNNATURAL)',
      right: 'When you come to my party tonight, bring some snacks.',
      why: 'Since the party is where the speaker will be, use "bring".',
    },
    miniDialogue: [
      { speaker: 'Mom', text: 'Please take the garbage out to the bin.' },
      { speaker: 'Son', text: 'Done! Should I bring the mail in from the box?' },
    ],
    quiz: {
      question: 'When you visit our office next week, please _____ your passport for security registration.',
      options: ['take', 'bring', 'fetch', 'carry away'],
      correctIndex: 1,
      explanation: 'The person is traveling towards the speaker\'s office, so we use "bring".',
    },
  },
  {
    id: 'wc_job_work',
    pairTitle: 'Job vs. Work',
    level: 'A2',
    words: [
      {
        word: 'Job',
        definition: 'A specific countable paid position or employment role (e.g. "a job", "two jobs").',
        keyRule: 'Countable noun (takes "a/an"): "She has a good job."',
        example: 'He applied for three software developer jobs this week.',
      },
      {
        word: 'Work',
        definition: 'The general effort, tasks, or labor you do, or the workplace itself. Usually uncountable as a noun.',
        keyRule: 'Uncountable noun (never "a work"): "I have a lot of work today."',
        example: 'I leave for work at 8:00 AM every weekday.',
      },
    ],
    differenceSummary: '"Job" is the specific title or contract (countable). "Work" is the effort or tasks you do (uncountable).',
    commonMistake: {
      wrong: 'I have a hard work to finish today. (WRONG)',
      right: 'I have a lot of hard work to finish today. OR I have a hard job/task to finish.',
      why: '"Work" as general tasks is uncountable and cannot take the indefinite article "a".',
    },
    miniDialogue: [
      { speaker: 'Carlos', text: 'How do you like your new job at the bank?' },
      { speaker: 'Amina', text: 'I love it, but there is a tremendous amount of work to do every day!' },
    ],
    quiz: {
      question: 'Rachel is looking for a new _____ in digital marketing.',
      options: ['work', 'job', 'working', 'works'],
      correctIndex: 1,
      explanation: 'We have the article "a", which requires the countable noun "job".',
    },
  },
  {
    id: 'wc_fun_funny',
    pairTitle: 'Fun vs. Funny',
    level: 'A2',
    words: [
      {
        word: 'Fun',
        definition: 'Enjoyable, entertaining, or pleasant. Something that makes you have a good time.',
        keyRule: 'Enjoyable experience: "The roller coaster was so much fun!"',
        example: 'We had a lot of fun at the beach yesterday.',
      },
      {
        word: 'Funny',
        definition: 'Humorous, making you laugh; or strange/unusual.',
        keyRule: 'Makes you laugh / comic: "The comedian told funny jokes."',
        example: 'That stand-up comedy show was hilarious and so funny.',
      },
    ],
    differenceSummary: 'If something makes you smile and enjoy your time, it is FUN. If something makes you laugh out loud because it is comical, it is FUNNY.',
    commonMistake: {
      wrong: 'The concert was very funny, I danced all night! (WRONG MEANING)',
      right: 'The concert was so much fun, I danced all night!',
      why: 'Dancing and enjoying a concert is "fun", not "funny" (unless clowns were dancing comedy).',
    },
    miniDialogue: [
      { speaker: 'Jack', text: 'Why are you laughing?' },
      { speaker: 'Lily', text: 'This cartoon is really funny! You should watch it, it\'s great fun.' },
    ],
    quiz: {
      question: 'Playing board games with my family on weekends is always great _____.',
      options: ['funny', 'fun', 'funnier', 'humorously'],
      correctIndex: 1,
      explanation: 'Board games provide enjoyment and quality time, so we say "great fun".',
    },
  },
  {
    id: 'wc_hear_listen',
    pairTitle: 'Hear vs. Listen',
    level: 'A1',
    words: [
      {
        word: 'Hear',
        definition: 'To perceive sound with your ears passively without conscious decision.',
        keyRule: 'Passive sensory ability: "Did you hear that noise?"',
        example: 'I can hear birds singing outside my window.',
      },
      {
        word: 'Listen (to)',
        definition: 'To pay deliberate attention to sound; to concentrate on what someone is saying.',
        keyRule: 'Active intentional focus: "Listen to the instructions."',
        example: 'She loves listening to podcasts while jogging.',
      },
    ],
    differenceSummary: '"Hear" is passive sound entering your ears. "Listen to" is giving active attention to the message.',
    commonMistake: {
      wrong: 'Please hear to me when I am speaking. (WRONG)',
      right: 'Please listen to me when I am speaking.',
      why: 'Paying conscious attention requires "listen to".',
    },
    miniDialogue: [
      { speaker: 'Professor', text: 'Are you listening to the lecture?' },
      { speaker: 'Student', text: 'I can hear your voice, but the audio from the back row is a bit faint.' },
    ],
    quiz: {
      question: 'You should always _____ carefully when the flight attendant gives safety instructions.',
      options: ['hear', 'listen', 'sound', 'overhear'],
      correctIndex: 1,
      explanation: 'Giving conscious attention to instructions requires the verb "listen".',
    },
  },
  {
    id: 'wc_learn_teach',
    pairTitle: 'Learn vs. Teach',
    level: 'A1',
    words: [
      {
        word: 'Learn',
        definition: 'To gain knowledge, understanding, or skill through study or experience (RECEIVING knowledge).',
        keyRule: 'The student learns: "I want to learn English."',
        example: 'Children learn languages very quickly through immersion.',
      },
      {
        word: 'Teach',
        definition: 'To give knowledge, instruction, or training to someone else (GIVING knowledge).',
        keyRule: 'The instructor teaches: "She teaches mathematics."',
        example: 'My grandfather taught me how to play chess.',
      },
    ],
    differenceSummary: 'Students LEARN (gain skill). Instructors TEACH (impart skill to others).',
    commonMistake: {
      wrong: 'Can you learn me how to drive a car? (WRONG)',
      right: 'Can you teach me how to drive a car?',
      why: 'The person giving instruction is "teaching", not "learning" the other person.',
    },
    miniDialogue: [
      { speaker: 'Zack', text: 'Who taught you how to play the guitar so well?' },
      { speaker: 'Elena', text: 'I learned mostly by watching tutorial videos online.' },
    ],
    quiz: {
      question: 'Mr. Henderson has been _____ English literature at the high school for fifteen years.',
      options: ['learning', 'teaching', 'studying', 'knowing'],
      correctIndex: 1,
      explanation: 'As the instructor delivering knowledge to students, Mr. Henderson is "teaching".',
    },
  },
  {
    id: 'wc_make_do',
    pairTitle: 'Make vs. Do',
    level: 'A2',
    words: [
      {
        word: 'Make',
        definition: 'Creating, producing, constructing, or causing something new to exist.',
        keyRule: 'Produce / Create: make coffee, make a decision, make a mistake, make money, make plans.',
        example: 'I need to make a phone call before we leave.',
      },
      {
        word: 'Do',
        definition: 'Performing actions, duties, chores, general work, or non-specific activities.',
        keyRule: 'Action / Duty: do homework, do business, do exercise, do the dishes, do your best.',
        example: 'Have you done your English exercises for today?',
      },
    ],
    differenceSummary: '"Make" creates something tangible or conceptual (make a choice, make tea). "Do" performs routine tasks and actions (do research, do chores).',
    commonMistake: {
      wrong: 'I need to do a reservation for dinner. (WRONG)',
      right: 'I need to make a reservation for dinner.',
      why: 'Reservations, plans, and decisions take the verb "make".',
    },
    miniDialogue: [
      { speaker: 'Liam', text: 'Could you do me a favor?' },
      { speaker: 'Sophia', text: 'Of course! Let me just make a cup of tea first.' },
    ],
    quiz: {
      question: 'Don\'t worry about failing; the most important thing is to _____ your best.',
      options: ['make', 'do', 'create', 'produce'],
      correctIndex: 1,
      explanation: 'The standard English idiom is "do your best".',
    },
  },
];

export const WORD_CHOICE_PAIRS = WORD_CHOICE_DATA;

