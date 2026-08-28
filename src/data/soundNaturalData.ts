export interface SoundNaturalItem {
  id: string;
  unnatural: string;
  category: string;
  natural: string;
  whyExplanation: string;
  alternatives: string[];
  ruleTip: string;
}

export const SOUND_NATURAL_PRESETS: SoundNaturalItem[] = [
  {
    id: 'sn_make_question',
    unnatural: 'I want to make a question.',
    category: 'Collocations & Verbs',
    natural: 'I want to ask a question.',
    whyExplanation: 'In English, questions are "asked", not "made" or "done".',
    alternatives: [
      'May I ask a question?',
      'I have a quick question.',
      'Could I ask you something?',
    ],
    ruleTip: 'Always use "ask a question" or "have a question".',
  },
  {
    id: 'sn_very_like',
    unnatural: 'I very like this music.',
    category: 'Adverb Placement',
    natural: 'I really like this music.',
    whyExplanation: '"Very" cannot directly modify a verb (like, want, need). Use "really" before the verb, or "very much" at the end of the sentence.',
    alternatives: [
      'I really love this music.',
      'I enjoy this music very much.',
      'I\'m a huge fan of this music.',
    ],
    ruleTip: 'Use "really + verb" (e.g. "I really want", "I really think").',
  },
  {
    id: 'sn_explained_me',
    unnatural: 'The teacher explained me the rule.',
    category: 'Verb Complementation',
    natural: 'The teacher explained the rule to me.',
    whyExplanation: '"Explain" requires the structure "explain [something] TO [someone]". It cannot take an indirect object directly without "to".',
    alternatives: [
      'The teacher explained to me how the rule works.',
      'The teacher walked me through the rule.',
      'The teacher clarified the rule for me.',
    ],
    ruleTip: 'Formula: explain + SOMETHING + TO someone.',
  },
  {
    id: 'sn_open_lights',
    unnatural: 'Please open the lights in the kitchen.',
    category: 'Everyday Household',
    natural: 'Please turn on the lights in the kitchen.',
    whyExplanation: 'Electrical appliances, electronics, and lights are "turned on" or "switched on", not "opened". Doors and windows are opened.',
    alternatives: [
      'Could you switch on the kitchen lights?',
      'Can you turn the lights on, please?',
      'Could you flick the light switch on?',
    ],
    ruleTip: 'Turn on / switch on appliances, electronics, faucets, and lights.',
  },
  {
    id: 'sn_see_movie_cinema',
    unnatural: 'I went to cinema for seeing a cinema.',
    category: 'Natural Phrasing',
    natural: 'I went to the cinema to see a movie.',
    whyExplanation: '"Cinema" or "movie theater" is the physical venue; the film itself is called a "movie" or "film". Also use "to see" for purpose instead of "for seeing".',
    alternatives: [
      'I went to the movies last night.',
      'I caught a film at the local theater.',
      'We went out to watch a movie.',
    ],
    ruleTip: 'Go to the cinema / movie theater to watch/see a movie.',
  },
  {
    id: 'sn_take_coffee',
    unnatural: 'Let\'s take a coffee together.',
    category: 'Social Expressions',
    natural: 'Let\'s grab a coffee together.',
    whyExplanation: 'While understandable, native English speakers overwhelmingly say "grab a coffee", "get a coffee", or "have a coffee" for casual social invitations.',
    alternatives: [
      'Do you want to get coffee sometime?',
      'Let\'s catch up over coffee.',
      'Would you like to have coffee with me?',
    ],
    ruleTip: '"Grab / get / have coffee" is the universal casual phrasing.',
  },
  {
    id: 'sn_discuss_about',
    unnatural: 'We need to discuss about the budget.',
    category: 'Preposition Redundancy',
    natural: 'We need to discuss the budget.',
    whyExplanation: '"Discuss" is a transitive verb that means "to talk about", so adding "about" after "discuss" is redundant.',
    alternatives: [
      'We need to talk about the budget.',
      'Let\'s review the budget together.',
      'We should go over the budget numbers.',
    ],
    ruleTip: 'discuss + NOUN (no "about"). OR talk + ABOUT + noun.',
  },
  {
    id: 'sn_sleep_late',
    unnatural: 'On Sunday I love to sleep late. (meaning waking up late)',
    category: 'Subtle Idiomatic Meaning',
    natural: 'On Sunday I love to sleep in.',
    whyExplanation: '"To sleep late" means going to bed late at night. "To sleep in" means waking up later in the morning than usual.',
    alternatives: [
      'I love sleeping in on Sunday mornings.',
      'I like to stay in bed and relax until 10 AM.',
      'I enjoy catching up on sleep over the weekend.',
    ],
    ruleTip: '"Sleep in" = wake up late in the morning. "Stay up late" = go to bed late.',
  },
];

export const SOUND_NATURAL_PAIRS = SOUND_NATURAL_PRESETS;

