import { NigerianEnglishComparison } from '../types';

export const NIGERIAN_ENGLISH_COMPARISONS: NigerianEnglishComparison[] = [
  {
    id: 'reg_coming',
    regionalPhrase: 'I am coming',
    internationalStandard: "I'll be right back / I will return in a moment",
    naturalAlternative: "Just give me a minute, I'll be right back!",
    category: 'Phrasing',
    explanation:
      'In West African English, "I am coming" is used when leaving momentarily. To native speakers in the UK/US, "I am coming" means you are currently moving towards them, which causes confusion when you walk away.',
    contextExample:
      'Scenario: You need to grab a notebook from the next room during a video call. Say "Excuse me, I will be right back in a second."',
  },
  {
    id: 'reg_drop_me',
    regionalPhrase: 'Drop me here / Drop me at the junction',
    internationalStandard: 'Could you drop me off here? / Can you let me out here, please?',
    naturalAlternative: 'Could you please pull over by the corner?',
    category: 'Phrasing',
    explanation:
      'Phrasal verb "drop off" requires the particle "off". Saying "drop me" literally implies dropping an object on the floor.',
    contextExample:
      'Scenario: Taking a taxi or rideshare. Say "Could you please drop me off right by the main entrance?"',
  },
  {
    id: 'reg_borrow_me',
    regionalPhrase: 'Borrow me your pen / Borrow me some cash',
    internationalStandard: 'Can I borrow your pen? / Could you lend me your pen?',
    naturalAlternative: 'May I borrow a pen for a moment?',
    category: 'Grammar',
    explanation:
      '"Borrow" means to take/receive temporarily (Subject borrows FROM someone). "Lend" means to give temporarily (Subject lends TO someone). You cannot "borrow someone" something.',
    contextExample:
      'Correct: "Could you lend me $10?" or "Can I borrow $10 from you?"',
  },
  {
    id: 'reg_flash_me',
    regionalPhrase: 'Flash my phone / Flash me when you arrive',
    internationalStandard: 'Give me a missed call / Give me a quick ring / Buzz me',
    naturalAlternative: 'Give me a quick call or text me when you get there.',
    category: 'Vocabulary',
    explanation:
      'Outside West Africa, "to flash" usually means exposing oneself or using a camera light. International speakers say "give me a ring" or "send a quick ping".',
    contextExample:
      'Scenario: Coordinating arrival with international colleagues. Say "Send me a text or give me a quick ring when you arrive."',
  },
  {
    id: 'reg_enter_car',
    regionalPhrase: 'Enter inside the car / Enter the bus',
    internationalStandard: 'Get into the car / Get on the bus',
    naturalAlternative: 'Hop in! / Get into the car.',
    category: 'Grammar',
    explanation:
      'For enclosed personal vehicles (car, taxi), use "get in / get into". For large public transportation you can stand up and walk on (bus, train, plane, boat), use "get on". "Enter inside" is also redundant.',
    contextExample:
      'Correct: "Let\'s get into the car." vs "We got on the 9:00 AM train."',
  },
  {
    id: 'reg_traffic_hold_up',
    regionalPhrase: 'Traffic hold up / Go-slow',
    internationalStandard: 'Traffic jam / Heavy traffic / Gridlock / Congestion',
    naturalAlternative: 'I got stuck in heavy traffic on the expressway.',
    category: 'Vocabulary',
    explanation:
      '"Hold-up" internationally refers to an armed robbery or delay. Standard international terms for vehicular congestion are "traffic jam", "heavy traffic", or "gridlock".',
    contextExample:
      'Scenario: Explaining why you are running late to a meeting. Say "Apologies for the delay, there was heavy traffic on the bridge."',
  },
  {
    id: 'reg_dress_small',
    regionalPhrase: 'Dress small / Shift small',
    internationalStandard: 'Could you please make a little room? / Could you scooch over?',
    naturalAlternative: 'Would you mind moving over slightly so I can sit?',
    category: 'Phrasing',
    explanation:
      '"Dress" refers to clothing. When asking someone to shift position on a bench or seat, say "Could you please slide over a bit?" or "Could you make a little room?"',
    contextExample:
      'Scenario: Asking someone to make space on a train seat. Say "Excuse me, would you mind sliding over just a bit?"',
  },
];
