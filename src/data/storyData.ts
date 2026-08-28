import { UserLevel } from '../types';

export interface StoryChoice {
  id: string;
  text: string;
  responsePreview?: string;
  nextNodeId: string;
  xpReward: number;
  goodPhrase?: string;
}

export interface StoryNode {
  id: string;
  speaker: string;
  speakerRole: string;
  speakerAvatar: string;
  dialogue: string;
  narration?: string;
  characterEmotion?: 'friendly' | 'curious' | 'encouraging' | 'thoughtful' | 'excited';
  highlightedVocab?: {
    word: string;
    meaning: string;
    partOfSpeech: string;
  }[];
  choices: StoryChoice[];
  isEndNode?: boolean;
}

export interface InteractiveStory {
  id: string;
  title: string;
  level: UserLevel;
  icon: string;
  theme: string;
  estimatedMinutes: number;
  synopsis: string;
  coverEmoji: string;
  learningObjectives: string[];
  nodes: { [nodeId: string]: StoryNode };
  startNodeId: string;
  usefulExpressions: string[];
  grammarPoints: string[];
}

export const STORIES: InteractiveStory[] = [
  {
    id: 'first-day-school',
    title: 'My First Day at Language School',
    level: 'A1',
    icon: 'School',
    theme: 'Meeting Classmates & Teachers',
    estimatedMinutes: 5,
    synopsis: 'You arrive at London International Academy for your very first English class. Introduce yourself, make a new friend, and ask the teacher for help.',
    coverEmoji: '🎒',
    learningObjectives: [
      'Introducing your name and home country',
      'Asking where things are located in a classroom',
      'Polite classroom greetings',
    ],
    usefulExpressions: [
      'Nice to meet you!',
      'Where are you from?',
      'Is this seat taken?',
      'Could you repeat that, please?',
    ],
    grammarPoints: [
      'Present Simple with "to be" (I am, you are)',
      'Possessive adjectives (my, your, our)',
      'Polite question forms (Could you...?)',
    ],
    startNodeId: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1',
        speaker: 'Lucas',
        speakerRole: 'Friendly Classmate from Brazil',
        speakerAvatar: '🧑‍🎓',
        characterEmotion: 'friendly',
        narration: 'You walk into Room 304. The classroom is bright and bustling with international students. A friendly student with glasses smiles and waves at you.',
        dialogue: 'Hi! Welcome to our English class. Are you new here? Is this seat next to you free?',
        highlightedVocab: [
          { word: 'welcome', meaning: 'greeting someone kindly on arrival', partOfSpeech: 'verb/interjection' },
          { word: 'free', meaning: 'available; not occupied by anyone', partOfSpeech: 'adjective' },
        ],
        choices: [
          {
            id: 'c1',
            text: 'Yes, it is free! Please sit down. My name is Alex. Nice to meet you!',
            nextNodeId: 'node-2a',
            xpReward: 15,
            goodPhrase: 'Yes, it is free! Nice to meet you!',
          },
          {
            id: 'c2',
            text: 'Hello! Yes, you can sit here. I just arrived today. Where are you from?',
            nextNodeId: 'node-2b',
            xpReward: 15,
            goodPhrase: 'Where are you from?',
          },
        ],
      },
      'node-2a': {
        id: 'node-2a',
        speaker: 'Lucas',
        speakerRole: 'Classmate',
        speakerAvatar: '🧑‍🎓',
        characterEmotion: 'excited',
        narration: 'Lucas sits down happily and opens his notebook.',
        dialogue: 'Nice to meet you too! I am Lucas from São Paulo. This is my second week here. Are you excited to practice speaking English?',
        highlightedVocab: [
          { word: 'excited', meaning: 'feeling very enthusiastic and happy', partOfSpeech: 'adjective' },
          { word: 'practice', meaning: 'doing an activity repeatedly to improve', partOfSpeech: 'verb' },
        ],
        choices: [
          {
            id: 'c3',
            text: 'Yes, I am very excited! I want to improve my speaking and make friends.',
            nextNodeId: 'node-3',
            xpReward: 20,
          },
          {
            id: 'c4',
            text: 'A little nervous, but I am ready to learn step by step!',
            nextNodeId: 'node-3',
            xpReward: 20,
          },
        ],
      },
      'node-2b': {
        id: 'node-2b',
        speaker: 'Lucas',
        speakerRole: 'Classmate',
        speakerAvatar: '🧑‍🎓',
        characterEmotion: 'friendly',
        narration: 'Lucas smiles warmly as he takes a seat beside you.',
        dialogue: 'I am from Brazil! I love this school because the teachers are very patient. What about you? Where are you from?',
        highlightedVocab: [
          { word: 'patient', meaning: 'able to accept delays or problems calmly without becoming annoyed', partOfSpeech: 'adjective' },
        ],
        choices: [
          {
            id: 'c5',
            text: 'I am from Nigeria. I really want to learn fluent English for my career.',
            nextNodeId: 'node-3',
            xpReward: 20,
          },
          {
            id: 'c6',
            text: 'I just moved here from my home country. Everyone seems very friendly!',
            nextNodeId: 'node-3',
            xpReward: 20,
          },
        ],
      },
      'node-3': {
        id: 'node-3',
        speaker: 'Ms. Sarah',
        speakerRole: 'English Teacher',
        speakerAvatar: '👩‍🏫',
        characterEmotion: 'encouraging',
        narration: 'The teacher enters the room with a warm smile and places her lesson notes on the podium.',
        dialogue: 'Good morning everyone! Let us begin our lesson. Could everyone please turn to page 12 of the student handbook?',
        highlightedVocab: [
          { word: 'handbook', meaning: 'a book that gives information or instructions about a subject', partOfSpeech: 'noun' },
        ],
        choices: [
          {
            id: 'c7',
            text: 'Excuse me, Ms. Sarah, could you please repeat the page number?',
            nextNodeId: 'node-end',
            xpReward: 25,
            goodPhrase: 'Could you please repeat that?',
          },
          {
            id: 'c8',
            text: 'I have page 12 open! Lucas and I are ready to practice together.',
            nextNodeId: 'node-end',
            xpReward: 25,
          },
        ],
      },
      'node-end': {
        id: 'node-end',
        speaker: 'Ms. Sarah',
        speakerRole: 'Teacher',
        speakerAvatar: '👩‍🏫',
        characterEmotion: 'excited',
        narration: 'Ms. Sarah nods approvingly and gives you a thumbs up. You successfully navigated your first day with confidence!',
        dialogue: 'Excellent! You both communicated clearly and politely. Welcome to our English learning community!',
        choices: [],
        isEndNode: true,
      },
    },
  },
  {
    id: 'weekend-trip',
    title: 'A Weekend Trip to the Countryside',
    level: 'A2',
    icon: 'MapPin',
    theme: 'Travel & Booking',
    estimatedMinutes: 6,
    synopsis: 'You and a friend plan a weekend getaway. Buy train tickets, ask about platform changes, and check into a cosy bed and breakfast.',
    coverEmoji: '🚂',
    learningObjectives: [
      'Purchasing transit tickets and asking for departure times',
      'Handling unexpected schedule delays calmly',
      'Describing preferences for weekend activities',
    ],
    usefulExpressions: [
      'Two return tickets to Oxford, please.',
      'Which platform does the train depart from?',
      'How long does the journey take?',
      'Could we check in early?',
    ],
    grammarPoints: [
      'Future plans with "going to"',
      'Modals for permission (Could we, Can I)',
      'Prepositions of time and place (at 10 AM, on Platform 4)',
    ],
    startNodeId: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1',
        speaker: 'Ticket Agent',
        speakerRole: 'Train Station Officer',
        speakerAvatar: '👨‍✈️',
        characterEmotion: 'friendly',
        narration: 'You stand in front of the ticket counter at the bustling central railway station.',
        dialogue: 'Good morning! Where would you like to travel today?',
        highlightedVocab: [
          { word: 'return ticket', meaning: 'a ticket that allows you to travel to a place and back', partOfSpeech: 'noun phrase' },
          { word: 'platform', meaning: 'the raised area beside the railway track where passengers get on and off', partOfSpeech: 'noun' },
        ],
        choices: [
          {
            id: 'c1',
            text: 'Good morning! Two return tickets to Oxford, please.',
            nextNodeId: 'node-2',
            xpReward: 20,
            goodPhrase: 'Two return tickets to..., please.',
          },
          {
            id: 'c2',
            text: 'Hi, what is the fastest train to Oxford this morning?',
            nextNodeId: 'node-2',
            xpReward: 20,
          },
        ],
      },
      'node-2': {
        id: 'node-2',
        speaker: 'Ticket Agent',
        speakerRole: 'Train Station Officer',
        speakerAvatar: '👨‍✈️',
        characterEmotion: 'thoughtful',
        dialogue: 'The express train leaves from Platform 3 in fifteen minutes. Would you prefer standard or first class seats?',
        choices: [
          {
            id: 'c3',
            text: 'Standard class is perfect, thank you! Which carriage should we board?',
            nextNodeId: 'node-3',
            xpReward: 20,
          },
          {
            id: 'c4',
            text: 'Standard, please. How long does the entire journey take?',
            nextNodeId: 'node-3',
            xpReward: 20,
          },
        ],
      },
      'node-3': {
        id: 'node-3',
        speaker: 'Maya',
        speakerRole: 'Travel Companion',
        speakerAvatar: '👩‍🌾',
        characterEmotion: 'excited',
        narration: 'You board the train and watch the green hills roll past through the window.',
        dialogue: 'The scenery is breathtaking! When we arrive in Oxford, should we visit the historic university libraries or rent bicycles first?',
        highlightedVocab: [
          { word: 'breathtaking', meaning: 'extremely exciting, beautiful, or surprising', partOfSpeech: 'adjective' },
          { word: 'historic', meaning: 'famous or important in history', partOfSpeech: 'adjective' },
        ],
        choices: [
          {
            id: 'c5',
            text: "I'd rather rent bicycles first so we can explore the whole town easily!",
            nextNodeId: 'node-end',
            xpReward: 25,
            goodPhrase: "I'd rather... so we can...",
          },
          {
            id: 'c6',
            text: 'I suggest we check in at the hotel first and drop off our heavy bags.',
            nextNodeId: 'node-end',
            xpReward: 25,
            goodPhrase: 'I suggest we...',
          },
        ],
      },
      'node-end': {
        id: 'node-end',
        speaker: 'Maya',
        speakerRole: 'Travel Companion',
        speakerAvatar: '👩‍🌾',
        characterEmotion: 'friendly',
        dialogue: 'That sounds like a great plan! Let us enjoy this wonderful trip.',
        choices: [],
        isEndNode: true,
      },
    },
  },
  {
    id: 'first-job',
    title: 'My First Day on the Job',
    level: 'B1',
    icon: 'Briefcase',
    theme: 'Workplace & Professional English',
    estimatedMinutes: 7,
    synopsis: 'You start your new position as an Associate Project Coordinator. Meet your manager, receive your first assignment, and collaborate with your team.',
    coverEmoji: '💼',
    learningObjectives: [
      'Professional introductions and clarifying task expectations',
      'Asking for feedback diplomatically',
      'Communicating deadlines and priorities',
    ],
    usefulExpressions: [
      'Could you clarify the main priority for this week?',
      'I am looking forward to collaborating with the team.',
      'I will make sure to deliver this by Friday.',
      'Please let me know if you need any adjustments.',
    ],
    grammarPoints: [
      'Present Perfect for experience and milestones',
      'Conditionals (If you need help, let me know)',
      'Business idioms and collocations (meet a deadline, touch base)',
    ],
    startNodeId: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1',
        speaker: 'David Vance',
        speakerRole: 'Department Director',
        speakerAvatar: '👔',
        characterEmotion: 'encouraging',
        narration: 'You walk into the modern open-plan office. Your director welcomes you into the conference room.',
        dialogue: 'Welcome to the team! We are thrilled to have you on board. How are you settling in so far?',
        highlightedVocab: [
          { word: 'thrilled', meaning: 'extremely pleased and excited', partOfSpeech: 'adjective' },
          { word: 'settling in', meaning: 'becoming familiar and comfortable with a new job or environment', partOfSpeech: 'phrasal verb' },
        ],
        choices: [
          {
            id: 'c1',
            text: 'Thank you, Mr. Vance! Everyone has been very welcoming. I am eager to get started on our new projects.',
            nextNodeId: 'node-2',
            xpReward: 25,
            goodPhrase: 'Thank you! I am eager to get started...',
          },
          {
            id: 'c2',
            text: 'Good morning! Everything is going smoothly. I am excited to meet everyone during today’s team sync.',
            nextNodeId: 'node-2',
            xpReward: 25,
          },
        ],
      },
      'node-2': {
        id: 'node-2',
        speaker: 'David Vance',
        speakerRole: 'Department Director',
        speakerAvatar: '👔',
        characterEmotion: 'thoughtful',
        dialogue: 'Fantastic. Our client needs a draft proposal by Thursday afternoon. Would you prefer to analyze the user data or draft the executive summary first?',
        choices: [
          {
            id: 'c3',
            text: 'I would be happy to draft the executive summary first and share an initial version by Wednesday morning.',
            nextNodeId: 'node-3',
            xpReward: 30,
            goodPhrase: 'I would be happy to... and share an initial version by...',
          },
          {
            id: 'c4',
            text: 'I think analyzing the data first will give us stronger insights for the proposal. What do you think?',
            nextNodeId: 'node-3',
            xpReward: 30,
          },
        ],
      },
      'node-3': {
        id: 'node-3',
        speaker: 'Chloe',
        speakerRole: 'Senior Team Lead',
        speakerAvatar: '👩‍💻',
        characterEmotion: 'friendly',
        narration: 'Chloe pulls up a chair with a cup of coffee to walk you through the shared project board.',
        dialogue: 'Hey! Don’t hesitate to reach out if you hit any roadblocks with the software. We always review each other’s work before final submission.',
        highlightedVocab: [
          { word: 'roadblock', meaning: 'an obstacle or problem that prevents progress', partOfSpeech: 'noun' },
          { word: 'reach out', meaning: 'contact someone for support or discussion', partOfSpeech: 'phrasal verb' },
        ],
        choices: [
          {
            id: 'c5',
            text: 'Thank you Chloe! I really appreciate the support. I will ping you if I have any questions.',
            nextNodeId: 'node-end',
            xpReward: 30,
            goodPhrase: 'I really appreciate the support.',
          },
        ],
      },
      'node-end': {
        id: 'node-end',
        speaker: 'David Vance',
        speakerRole: 'Director',
        speakerAvatar: '👔',
        characterEmotion: 'friendly',
        dialogue: 'You handled your first day with exceptional poise and communication. Great job!',
        choices: [],
        isEndNode: true,
      },
    },
  },
  {
    id: 'difficult-decision',
    title: 'A Difficult Decision',
    level: 'B2',
    icon: 'Compass',
    theme: 'Negotiation & Critical Thinking',
    estimatedMinutes: 8,
    synopsis: 'You are presented with two competing job offers in different cities. Discuss with a mentor, weigh pros and cons, and negotiate conditions.',
    coverEmoji: '⚖️',
    learningObjectives: [
      'Expressing nuanced pros and cons',
      'Using hypothetical and conditional structures (Second and Third conditionals)',
      'Polite negotiation techniques',
    ],
    usefulExpressions: [
      'On the one hand..., but on the other hand...',
      'If I were to accept this offer, I would have to...',
      'Taking everything into consideration...',
      'I am weighing my options carefully.',
    ],
    grammarPoints: [
      'Second Conditional (If I took..., I would...)',
      'Advanced contrast linkers (Although, Whereas, Nonetheless)',
      'Hedging language (It seems to me, I am inclined to believe)',
    ],
    startNodeId: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1',
        speaker: 'Professor Adeyemi',
        speakerRole: 'Senior Academic Mentor',
        speakerAvatar: '🧑‍🏫',
        characterEmotion: 'thoughtful',
        narration: 'You sit in Professor Adeyemi’s study surrounded by stacks of research papers. He pours hot tea and listens attentively.',
        dialogue: 'So you have received two compelling offers: one from an innovative startup with high equity, and one from an established multinational with job stability. How are you evaluating them?',
        highlightedVocab: [
          { word: 'compelling', meaning: 'evoking interest, attention, or admiration in a powerfully irresistible way', partOfSpeech: 'adjective' },
          { word: 'equity', meaning: 'the value of the shares issued by a company', partOfSpeech: 'noun' },
        ],
        choices: [
          {
            id: 'c1',
            text: 'On the one hand, the startup offers rapid career growth; on the other hand, the multinational offers international relocation opportunities.',
            nextNodeId: 'node-2',
            xpReward: 30,
            goodPhrase: 'On the one hand..., on the other hand...',
          },
          {
            id: 'c2',
            text: 'If I were to prioritize long-term learning and autonomy, I believe the startup would give me more hands-on responsibility.',
            nextNodeId: 'node-2',
            xpReward: 30,
            goodPhrase: 'If I were to prioritize..., I believe...',
          },
        ],
      },
      'node-2': {
        id: 'node-2',
        speaker: 'Professor Adeyemi',
        speakerRole: 'Senior Mentor',
        speakerAvatar: '🧑‍🏫',
        characterEmotion: 'curious',
        dialogue: 'That is a very astute analysis. However, have you considered negotiating with the multinational for more flexible remote working terms?',
        highlightedVocab: [
          { word: 'astute', meaning: 'having or showing an ability to accurately assess situations', partOfSpeech: 'adjective' },
        ],
        choices: [
          {
            id: 'c3',
            text: 'I am planning to request a follow-up conversation to discuss whether a hybrid working schedule is feasible.',
            nextNodeId: 'node-end',
            xpReward: 35,
            goodPhrase: 'I am planning to request... to discuss whether... is feasible.',
          },
          {
            id: 'c4',
            text: 'Taking everything into consideration, I feel ready to negotiate confidently while maintaining a collaborative tone.',
            nextNodeId: 'node-end',
            xpReward: 35,
          },
        ],
      },
      'node-end': {
        id: 'node-end',
        speaker: 'Professor Adeyemi',
        speakerRole: 'Mentor',
        speakerAvatar: '🧑‍🏫',
        characterEmotion: 'friendly',
        dialogue: 'You have articulated your thoughts with remarkable clarity and diplomatic precision. Whatever you decide, you are well-prepared to succeed.',
        choices: [],
        isEndNode: true,
      },
    },
  },
  {
    id: 'unexpected-opportunity',
    title: 'The Unexpected Opportunity',
    level: 'C1',
    icon: 'Sparkles',
    theme: 'Leadership & High-Stakes Communication',
    estimatedMinutes: 8,
    synopsis: 'At an international tech conference, the keynote speaker is suddenly indisposed. You are invited to deliver the opening address to 500 delegates.',
    coverEmoji: '🎙️',
    learningObjectives: [
      'Rhetorical devices and persuasive discourse',
      'Advanced vocabulary and sophisticated metaphors',
      'Handling spontaneous high-profile public speaking',
    ],
    usefulExpressions: [
      'It is an immense privilege to address you today.',
      'We stand at a critical juncture in our industry.',
      'Allow me to elaborate on three fundamental pillars...',
      'To conclude, let us remember that innovation without empathy is hollow.',
    ],
    grammarPoints: [
      'Cleft sentences (What we must understand is...)',
      'Negative inversion (Rarely have we witnessed...)',
      'Subjunctive and elevated modal constructions',
    ],
    startNodeId: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1',
        speaker: 'Elena Rostova',
        speakerRole: 'Conference Chair',
        speakerAvatar: '👩‍💼',
        characterEmotion: 'excited',
        narration: 'Behind the main stage curtains, Elena rushes toward you with an urgent look.',
        dialogue: 'Our keynote speaker’s flight was delayed in Frankfurt! Your research paper was the most discussed in committee. Can you deliver the 10-minute opening remarks on the future of AI and language accessibility?',
        highlightedVocab: [
          { word: 'indisposed', meaning: 'unable to attend or slightly unwell', partOfSpeech: 'adjective' },
          { word: 'keynote', meaning: 'the main speech at a conference that sets the central theme', partOfSpeech: 'noun' },
        ],
        choices: [
          {
            id: 'c1',
            text: 'I would be honoured. Give me three minutes to structure my core talking points around inclusion and technological empowerment.',
            nextNodeId: 'node-2',
            xpReward: 40,
            goodPhrase: 'I would be honoured. Allow me to structure my core talking points...',
          },
          {
            id: 'c2',
            text: 'Under circumstances like these, clarity and conviction are what matter most. I am ready to step in.',
            nextNodeId: 'node-2',
            xpReward: 40,
          },
        ],
      },
      'node-2': {
        id: 'node-2',
        speaker: 'Elena Rostova',
        speakerRole: 'Conference Chair',
        speakerAvatar: '👩‍💼',
        characterEmotion: 'encouraging',
        narration: 'Elena hands you the microphone as the spotlight turns towards you. 500 tech leaders and educators quiet down.',
        dialogue: 'The stage is yours! How will you open the address?',
        choices: [
          {
            id: 'c3',
            text: 'Distinguished delegates and guests, it is a privilege to stand before you today at this pivotal moment in digital communication.',
            nextNodeId: 'node-end',
            xpReward: 45,
            goodPhrase: 'Distinguished guests, it is a privilege to stand before you at this pivotal moment...',
          },
          {
            id: 'c4',
            text: 'Rarely have we witnessed a shift as profound as the intersection of natural language learning and artificial intelligence.',
            nextNodeId: 'node-end',
            xpReward: 45,
            goodPhrase: 'Rarely have we witnessed a shift as profound as...',
          },
        ],
      },
      'node-end': {
        id: 'node-end',
        speaker: 'Elena Rostova',
        speakerRole: 'Chair',
        speakerAvatar: '👩‍💼',
        characterEmotion: 'excited',
        narration: 'A resounding round of applause fills the auditorium. Delegates stand up to congratulate your eloquence.',
        dialogue: 'That was utterly masterful! Your rhetoric and composure captivated the entire room.',
        choices: [],
        isEndNode: true,
      },
    },
  },
];
