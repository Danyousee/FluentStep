import {
  LearnerMemory,
  DiagnosticItem,
  DetectedErrorPattern,
  ActiveVocabWord,
  EmergencyHelpSession,
  MissionItem,
} from '../types';

export const INITIAL_LEARNER_MEMORY: LearnerMemory = {
  currentLevel: 'A1',
  targetLevel: 'B2',
  learningGoals: [
    'Speak English naturally without hesitation',
    'Stop translating word-for-word from native language',
    'Build everyday vocabulary & grammar foundation',
    'Improve listening and spoken fluency',
  ],
  preferredDifficulty: 'Beginner',
  topicsStudied: [],
  topicsMastered: [],
  vocabularyLearned: [],
  difficultVocabulary: [],
  commonGrammarMistakes: [],
  commonSentenceMistakes: [],
  frequentlyConfusedWords: [],
  frequentlyUsedIncorrectExpressions: [],
  speakingWeaknesses: [],
  writingWeaknesses: [],
  listeningWeaknesses: [],
  recentConversations: [],
  recentAssessments: [],
  recommendedTopics: [
    'Everyday Introductions & Greetings',
    'Present Simple for Daily Routines',
    'Essential Action Verbs',
    'Active Word Retrieval: Collocations with MAKE vs DO',
  ],
  streakDays: 0,
  lastUpdated: 'Ready for first session',
  totalConversationsCompleted: 0,
  totalWordsRetrieved: 0,
};

export const INITIAL_DIAGNOSTICS: DiagnosticItem[] = [
  {
    skill: 'Grammar',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Ready to benchmark your grammar foundation.',
    rootCauseWeakness:
      'Root Cause: Complete your first interactive grammar lesson or quiz to diagnose specific error patterns and strengths.',
    evidenceExamples: [],
    recommendedAction: 'Start with Present Simple and basic verb patterns in the Grammar module.',
    practiceModuleId: 'grammar_lesson',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Vocabulary',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Ready to build active vocabulary.',
    rootCauseWeakness:
      'Root Cause: Practice vocabulary lessons and word retrieval drills to calibrate active and passive word knowledge.',
    evidenceExamples: [],
    recommendedAction: 'Engage in Word Retrieval Active Recall and Vocabulary SRS practice.',
    practiceModuleId: 'vocab_srs',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Sentence Building',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Ready to practice step-by-step sentence construction.',
    rootCauseWeakness:
      'Root Cause: Construct sentences across levels 1 to 10 to establish baseline sentence structure speed and accuracy.',
    evidenceExamples: [],
    recommendedAction: 'Practice Level 1 Sentence Builder (Subject + Verb + Object).',
    practiceModuleId: 'sentence_builder',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Speaking',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Microphone & speech-to-text ready for speaking practice.',
    rootCauseWeakness:
      'Root Cause: Practice with AI Voice Tutor to measure spoken fluency, pause length, and pronunciation accuracy.',
    evidenceExamples: [],
    recommendedAction: 'Start a voice conversation with Alex the AI Tutor.',
    practiceModuleId: 'voice_tutor',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Listening',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Audio speed controls (0.8x, 1.0x, 1.2x) ready.',
    rootCauseWeakness:
      'Root Cause: Complete listening passages to measure comprehension accuracy and connected speech recognition.',
    evidenceExamples: [],
    recommendedAction: 'Practice beginner dialogues in the Listening Lab.',
    practiceModuleId: 'listening',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Reading',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Interactive reading library ready with instant vocabulary lookup.',
    rootCauseWeakness:
      'Root Cause: Read stories and dialogues to calibrate reading comprehension speed and vocabulary range.',
    evidenceExamples: [],
    recommendedAction: 'Explore short stories and real-world texts in the Reading Lab.',
    practiceModuleId: 'reading_lab',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Writing',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'AI Writing Coach ready for instant grammatical feedback.',
    rootCauseWeakness:
      'Root Cause: Submit short writing exercises or daily journal entries to analyze sentence flow and word choice.',
    evidenceExamples: [],
    recommendedAction: 'Try the 50-word daily writing prompt with the AI Writing Coach.',
    practiceModuleId: 'writing_coach',
    lastAssessedDate: 'Not assessed yet',
  },
  {
    skill: 'Conversation',
    score: 0,
    trend: 'steady',
    trendDelta: '0%',
    strength: 'Interactive real-life scenarios ready.',
    rootCauseWeakness:
      'Root Cause: Complete realistic dialogue missions to measure contextual responsiveness and conversational confidence.',
    evidenceExamples: [],
    recommendedAction: 'Roleplay Real-World Missions with AI characters.',
    practiceModuleId: 'missions',
    lastAssessedDate: 'Not assessed yet',
  },
];

export const INITIAL_ERROR_PATTERNS: DetectedErrorPattern[] = [];

export const INITIAL_ACTIVE_VOCAB_WORDS: ActiveVocabWord[] = [
  {
    id: 'act_word_collaborate',
    word: 'Collaborate',
    phonetic: '/kəˈlæb.ə.reɪt/',
    partOfSpeech: 'verb',
    definition: 'To work jointly with others on an activity or project.',
    clueHint: 'To work together with a team to achieve a shared goal (verb starting with C).',
    collocations: ['Collaborate closely', 'Collaborate on a project', 'Collaborate with a colleague'],
    confusedWith: 'Cooperate',
    confusionNote: 'Collaborating involves actively creating together; cooperating means complying or agreeing.',
    currentStage: 'recognition',
    recognitionSuccessCount: 0,
    recallSuccessCount: 0,
    usageSuccessCount: 0,
    lastPracticedDate: 'Not practiced yet',
    nextReviewDate: 'Available for practice',
    userCustomSentence: '',
  },
  {
    id: 'act_word_convenient',
    word: 'Convenient',
    phonetic: '/kənˈviː.ni.ənt/',
    partOfSpeech: 'adjective',
    definition: 'Fitting in well with a person’s needs, activities, and plans; easy to use.',
    clueHint: 'Making life easier, saving time or effort (adjective starting with C).',
    collocations: ['Extremely convenient', 'Convenient location', 'Convenient time'],
    confusedWith: 'Comfortable',
    confusionNote: 'Comfortable refers to physical ease or feeling relaxed; convenient refers to saving time/effort.',
    currentStage: 'recognition',
    recognitionSuccessCount: 0,
    recallSuccessCount: 0,
    usageSuccessCount: 0,
    lastPracticedDate: 'Not practiced yet',
    nextReviewDate: 'Available for practice',
    userCustomSentence: '',
  },
  {
    id: 'act_word_hesitate',
    word: 'Hesitate',
    phonetic: '/ˈhez.ɪ.teɪt/',
    partOfSpeech: 'verb',
    definition: 'To pause before saying or doing something, often due to uncertainty or doubt.',
    clueHint: 'To pause or delay making a decision because you are unsure (verb starting with H).',
    collocations: ['Do not hesitate to ask', 'Hesitate for a moment', 'Hesitate to speak'],
    currentStage: 'recognition',
    recognitionSuccessCount: 0,
    recallSuccessCount: 0,
    usageSuccessCount: 0,
    lastPracticedDate: 'Not practiced yet',
    nextReviewDate: 'Available for practice',
    userCustomSentence: '',
  },
  {
    id: 'act_word_accomplish',
    word: 'Accomplish',
    phonetic: '/əˈkʌm.plɪʃ/',
    partOfSpeech: 'verb',
    definition: 'To succeed in doing or completing something successfully.',
    clueHint: 'To finish a difficult task or achieve a goal (verb starting with A).',
    collocations: ['Accomplish a goal', 'Accomplish a task', 'Sense of accomplishment'],
    currentStage: 'recognition',
    recognitionSuccessCount: 0,
    recallSuccessCount: 0,
    usageSuccessCount: 0,
    lastPracticedDate: 'Not practiced yet',
    nextReviewDate: 'Available for practice',
    userCustomSentence: '',
  },
];

export const REAL_WORLD_MISSIONS_CATALOG: MissionItem[] = [
  {
    id: 'mission_restaurant',
    title: 'Ordering Food at a Busy Restaurant',
    category: 'Restaurant & Dining',
    difficulty: 'Beginner',
    level: 'A1',
    estimatedMinutes: 5,
    icon: 'Utensils',
    coverEmoji: '🍝',
    goal: 'Politely greet the host, request a table, ask for recommendations, order main courses, and request the bill.',
    requiredSkills: ['Polite requests (Could I have...)', 'Asking about ingredients', 'Requesting the check'],
    targetVocabulary: [
      { word: 'Recommendation', meaning: 'A suggestion about what is good or suitable' },
      { word: 'Allergic', meaning: 'Having an adverse reaction to certain foods' },
      { word: 'Check / Bill', meaning: 'The document showing how much you need to pay' },
    ],
    usefulPhrases: [
      'Table for two, please.',
      'What would you recommend for the main course?',
      'Could I have the dressing on the side?',
      'Could we get the check when you have a moment?',
    ],
    scenarioDescription:
      'You are visiting a popular Italian bistro on a busy evening. Your server, Marco, is friendly but brisk.',
    initialMessage:
      'Good evening! Welcome to Luigi’s. Table for how many tonight, or do you have a reservation?',
    aiCharacter: { name: 'Marco', role: 'Bistro Server', avatar: '👨‍🍳' },
    conversationPrompt:
      'Act as Marco, a friendly restaurant server. Guide the guest through seating, ordering, dietary questions, and paying the bill.',
    completionChecklist: [
      'Greet the server and state party size',
      'Ask for a menu recommendation or dish detail',
      'Order food and beverage politely',
      'Request the bill / check',
      'Thank the server and conclude',
    ],
  },
  {
    id: 'mission_return_item',
    title: 'Returning an Item at a Retail Store',
    category: 'Shopping & Customer Service',
    difficulty: 'Intermediate',
    level: 'A2',
    estimatedMinutes: 6,
    icon: 'ShoppingBag',
    coverEmoji: '🛍️',
    goal: 'Explain why you are returning a purchased item, show proof of purchase, and request a full refund or exchange.',
    requiredSkills: ['Explaining defects/issues', 'Polite insistence', 'Understanding return policy'],
    targetVocabulary: [
      { word: 'Defective', meaning: 'Faulty, not working properly' },
      { word: 'Receipt', meaning: 'Proof of payment slip' },
      { word: 'Refund', meaning: 'Return of paid money' },
    ],
    usefulPhrases: [
      'I would like to return this shirt I bought yesterday.',
      'It turns out the zipper is broken / the size is too small.',
      'I have the receipt right here.',
      'Would it be possible to get a refund to my original card?',
    ],
    scenarioDescription:
      'You bought a jacket yesterday, but discovered a broken seam when you got home. You are at customer service speaking to Elena.',
    initialMessage:
      'Hi there, how can I help you today at Customer Service?',
    aiCharacter: { name: 'Elena', role: 'Customer Service Representative', avatar: '👩‍💼' },
    conversationPrompt:
      'Act as Elena, a helpful store associate. Ask for the reason of return, inspect receipt, and process refund.',
    completionChecklist: [
      'State intent to return the item clearly',
      'Describe the defect or reason politely',
      'Provide the receipt / order number',
      'Confirm preferred resolution (refund vs store credit)',
    ],
  },
  {
    id: 'mission_complaint_refund',
    title: 'Making a Complaint & Asking for a Refund',
    category: 'Customer Service & Travel',
    difficulty: 'Intermediate',
    level: 'B1',
    estimatedMinutes: 7,
    icon: 'AlertTriangle',
    coverEmoji: '🛎️',
    goal: 'Calmly and assertively explain an unacceptable service issue at a hotel and negotiate appropriate compensation or refund.',
    requiredSkills: ['Assertive communication', 'Chronological explanation', 'Negotiating compensation'],
    targetVocabulary: [
      { word: 'Unacceptable', meaning: 'Not satisfactory or tolerable' },
      { word: 'Compensation', meaning: 'Money or value given to make up for a loss or inconvenience' },
      { word: 'Inconvenience', meaning: 'Trouble or difficulty caused' },
    ],
    usefulPhrases: [
      'I am afraid I have a serious concern regarding my room.',
      'The air conditioner has not been functioning since yesterday.',
      'Given the disruption, I would like to request compensation or a partial refund.',
    ],
    scenarioDescription:
      'You are staying at the Grand View Hotel. There was loud construction at 6 AM and no hot water. You are speaking to Manager Richard.',
    initialMessage:
      'Good morning, front desk. How can I assist you with your stay today?',
    aiCharacter: { name: 'Richard', role: 'Front Desk Manager', avatar: '👔' },
    conversationPrompt:
      'Act as Richard, the hotel manager. Listen to the customer complaint with empathy, apologize, and offer fair compensation.',
    completionChecklist: [
      'State the issue clearly without losing composure',
      'Explain how the issue impacted your stay',
      'Politely reject unhelpful excuses',
      'Agree on a mutually acceptable resolution (refund/upgrade)',
    ],
  },
  {
    id: 'mission_negotiate_price',
    title: 'Negotiating a Price at a Market / Dealership',
    category: 'Business & Negotiation',
    difficulty: 'Intermediate',
    level: 'B1',
    estimatedMinutes: 6,
    icon: 'DollarSign',
    coverEmoji: '🤝',
    goal: 'Negotiate a lower price on a product while remaining polite, professional, and confident.',
    requiredSkills: ['Counter-offering', 'Highlighting flaws/competitor rates', 'Closing a deal'],
    targetVocabulary: [
      { word: 'Counter-offer', meaning: 'An alternative proposal made in response to an initial offer' },
      { word: 'Discount', meaning: 'A deduction from the usual cost' },
      { word: 'Firm', meaning: 'Not willing to change or lower' },
    ],
    usefulPhrases: [
      'Is there any flexibility on this price?',
      'I noticed a small scratch here. Could you do $150?',
      'If I pay in cash right now, what is the best you can offer?',
      'Let’s meet in the middle at $160.',
    ],
    scenarioDescription:
      'You are buying a vintage camera or furniture item from an antique dealer named Samuel.',
    initialMessage:
      'Hello there! That’s an exquisite piece you’re looking at. The tag says $220. What do you think?',
    aiCharacter: { name: 'Samuel', role: 'Antique Dealer', avatar: '🧔' },
    conversationPrompt:
      'Act as Samuel, an experienced merchant. Defend the quality of your product, evaluate buyer counter-offers, and settle fairly.',
    completionChecklist: [
      'Ask about price flexibility politely',
      'Provide a logical justification for a discount',
      'Make a clear counter-offer',
      'Reach an agreement and confirm purchase',
    ],
  },
  {
    id: 'mission_ask_leave',
    title: 'Asking Your Boss for Time Off / Leave',
    category: 'Workplace & Career',
    difficulty: 'Intermediate',
    level: 'B1',
    estimatedMinutes: 6,
    icon: 'Briefcase',
    coverEmoji: '📅',
    goal: 'Formally request 3 days off next month, explain work coverage, and answer manager concerns professionally.',
    requiredSkills: ['Professional modals (was hoping to, would appreciate)', 'Outlining coverage', 'Diplomatic tone'],
    targetVocabulary: [
      { word: 'Handover', meaning: 'Passing responsibilities to a colleague' },
      { word: 'Coverage', meaning: 'Having someone do your duties while away' },
      { word: 'Notice', meaning: 'Advance warning or time before an event' },
    ],
    usefulPhrases: [
      'I was hoping to speak with you regarding some upcoming time off.',
      'I would like to request three days of annual leave from October 14th to 16th.',
      'I have already arranged for Sarah to cover my urgent client emails.',
    ],
    scenarioDescription:
      'You need 3 days off for a personal family event. You are having a quick 1-on-1 meeting with your manager, Karen.',
    initialMessage:
      'Hi! Thanks for requesting a quick catch-up. What did you want to discuss?',
    aiCharacter: { name: 'Karen', role: 'Team Director', avatar: '👩‍💼' },
    conversationPrompt:
      'Act as Karen, a pragmatic manager. Ask about dates, project deadlines, and coverage plans before approving.',
    completionChecklist: [
      'Open the conversation with polite professional framing',
      'Specify exact dates and purpose',
      'Explain your work handover and coverage plan',
      'Thank the manager upon receiving approval',
    ],
  },
  {
    id: 'mission_teacher_help',
    title: 'Asking a Professor / Teacher for Clarification & Extension',
    category: 'Academic & School',
    difficulty: 'Intermediate',
    level: 'B1',
    estimatedMinutes: 6,
    icon: 'GraduationCap',
    coverEmoji: '🎓',
    goal: 'Explain confusion regarding an assignment prompt, ask targeted questions, and request a 24-hour extension politely.',
    requiredSkills: ['Academic vocabulary', 'Clarifying questions', 'Polite request framing'],
    targetVocabulary: [
      { word: 'Clarification', meaning: 'Making a statement or concept less confusing' },
      { word: 'Extension', meaning: 'Additional time allowed to complete an assignment' },
      { word: 'Syllabus', meaning: 'Course outline and requirements' },
    ],
    usefulPhrases: [
      'Could I ask for some clarification on section two of the essay prompt?',
      'I am having trouble narrowing down my thesis statement.',
      'Due to an unexpected illness, would it be possible to get a brief 24-hour extension?',
    ],
    scenarioDescription:
      'You are attending office hours with Professor Evans to discuss your upcoming term paper.',
    initialMessage:
      'Come in! Have a seat. What questions do you have about the research paper draft?',
    aiCharacter: { name: 'Prof. Evans', role: 'University Lecturer', avatar: '👨‍🏫' },
    conversationPrompt:
      'Act as Professor Evans. Answer academic questions encouragingly and evaluate the student’s extension request.',
    completionChecklist: [
      'Explain which part of the assignment is confusing',
      'Demonstrate that you have already made an effort',
      'Request the extension with a polite rationale',
      'Confirm the new submission time',
    ],
  },
  {
    id: 'mission_it_support',
    title: 'Explaining a Technical Problem to IT Support',
    category: 'Technology & Work',
    difficulty: 'Intermediate',
    level: 'A2',
    estimatedMinutes: 6,
    icon: 'Laptop',
    coverEmoji: '💻',
    goal: 'Describe computer symptoms, error messages, and troubleshooting steps already taken to an IT technician.',
    requiredSkills: ['Descriptive tech verbs', 'Step-by-step chronology', 'Following technical instructions'],
    targetVocabulary: [
      { word: 'Glitch / Crash', meaning: 'A sudden failure of computer hardware or software' },
      { word: 'Error code', meaning: 'A message indicating what went wrong' },
      { word: 'Reboot', meaning: 'Restarting the device' },
    ],
    usefulPhrases: [
      'My laptop keeps crashing whenever I open the design software.',
      'An error message pops up saying "Connection Timeout 504".',
      'I already tried restarting the system and clearing the cache, but the problem persists.',
    ],
    scenarioDescription:
      'Your work laptop is freezing before a major client demo. You are on the phone with IT Specialist Dev.',
    initialMessage:
      'IT Helpdesk, this is Dev. What seems to be the issue with your workstation?',
    aiCharacter: { name: 'Dev', role: 'IT Support Specialist', avatar: '👨‍💻' },
    conversationPrompt:
      'Act as Dev. Ask technical diagnostic questions, suggest steps (restart, VPN check), and resolve the ticket.',
    completionChecklist: [
      'Describe the exact error symptom clearly',
      'Mention what software / action triggered it',
      'List troubleshooting steps already tried',
      'Follow technician instructions and confirm resolution',
    ],
  },
  {
    id: 'mission_colleague_misunderstanding',
    title: 'Resolving a Misunderstanding with a Colleague',
    category: 'Workplace & Conflict Resolution',
    difficulty: 'Advanced',
    level: 'B2',
    estimatedMinutes: 7,
    icon: 'Users',
    coverEmoji: '🤝',
    goal: 'Address a tense email miscommunication with a coworker, clarify your positive intent, and re-establish a collaborative relationship.',
    requiredSkills: ['Emotional intelligence in English', 'De-escalation phrases', 'Reaffirming collaboration'],
    targetVocabulary: [
      { word: 'Miscommunication', meaning: 'Failure to communicate ideas or intentions properly' },
      { word: 'Clarify', meaning: 'To make an idea easier to understand' },
      { word: 'Perspective', meaning: 'A particular attitude or way of regarding something' },
    ],
    usefulPhrases: [
      'I wanted to touch base regarding our exchange on yesterday’s email thread.',
      'I realize my tone might have come across as blunt, which was definitely not my intention.',
      'I really value your input, and I wanted to make sure we are on the same page moving forward.',
    ],
    scenarioDescription:
      'A colleague, Marcus, felt slighted by your feedback during yesterday’s meeting. You are meeting for coffee to clear the air.',
    initialMessage:
      'Hey. Thanks for meeting up. To be honest, I was a bit caught off guard by your comments in yesterday’s sprint review.',
    aiCharacter: { name: 'Marcus', role: 'Senior Product Designer', avatar: '👨‍💼' },
    conversationPrompt:
      'Act as Marcus. Express your initial frustration politely, listen to the colleague’s explanation, and rebuild mutual trust.',
    completionChecklist: [
      'Acknowledge the tension without defensive excuses',
      'Clarify your genuine intention constructively',
      'Listen actively to the colleague’s perspective',
      'Agree on a clearer communication protocol',
    ],
  },
  {
    id: 'mission_doctor_appointment',
    title: 'Making & Rescheduling a Medical Appointment',
    category: 'Healthcare & Daily Life',
    difficulty: 'Intermediate',
    level: 'A2',
    estimatedMinutes: 6,
    icon: 'Activity',
    coverEmoji: '🏥',
    goal: 'Call a medical clinic, describe mild symptoms, book a doctor appointment, and subsequently reschedule to another day.',
    requiredSkills: ['Describing physical symptoms', 'Date and time negotiation', 'Polite phone etiquette'],
    targetVocabulary: [
      { word: 'Symptoms', meaning: 'Physical signs indicating an illness or condition' },
      { word: 'Availability', meaning: 'Times when someone is free' },
      { word: 'Reschedule', meaning: 'Change the date or time of an appointment' },
    ],
    usefulPhrases: [
      'I would like to schedule an appointment with Dr. Hayes, please.',
      'I have been experiencing persistent sore throat and fever for two days.',
      'Would you happen to have any morning openings this Thursday?',
    ],
    scenarioDescription:
      'You need to see a general practitioner for an allergy and checkup. You are speaking with Clinic Receptionist Clara.',
    initialMessage:
      'Metro Health Clinic, Clara speaking. Are you calling to book a new appointment or follow up on test results?',
    aiCharacter: { name: 'Clara', role: 'Clinic Receptionist', avatar: '👩‍⚕️' },
    conversationPrompt:
      'Act as Clara, a helpful clinic receptionist. Inquire about symptoms, check schedule, and confirm appointment details.',
    completionChecklist: [
      'State purpose of visit and general symptoms',
      'Choose a suitable date and time',
      'Provide patient information',
      'Politely reschedule when a conflict arises',
    ],
  },
  {
    id: 'mission_ask_directions',
    title: 'Giving & Asking for Directions in a City',
    category: 'Travel & Urban Navigation',
    difficulty: 'Beginner',
    level: 'A1',
    estimatedMinutes: 5,
    icon: 'Compass',
    coverEmoji: '🗺️',
    goal: 'Stop a local pedestrian, ask how to get to the central train station, clarify turns and landmarks, and say thank you.',
    requiredSkills: ['Direction vocabulary (left, right, straight, cross)', 'Prepositions of place', 'Confirming instructions'],
    targetVocabulary: [
      { word: 'Intersection', meaning: 'Where two or more roads cross each other' },
      { word: 'Landmark', meaning: 'An easily recognizable building or feature' },
      { word: 'Blocks', meaning: 'The distance between two streets' },
    ],
    usefulPhrases: [
      'Excuse me, could you tell me how to get to Central Station?',
      'Is it within walking distance from here?',
      'So I go straight for two blocks and turn left at the pharmacy?',
      'Thank you so much for your help!',
    ],
    scenarioDescription:
      'Your phone battery died in downtown Chicago. You need to reach the subway station. You stop an approachable local, Liam.',
    initialMessage:
      'Hi there! Looking for somewhere? You seem a bit lost.',
    aiCharacter: { name: 'Liam', role: 'Local Resident', avatar: '🚶‍♂️' },
    conversationPrompt:
      'Act as Liam, a friendly local. Give clear step-by-step street directions with landmarks.',
    completionChecklist: [
      'Politely get the pedestrian’s attention',
      'Ask for the specific destination',
      'Repeat instructions back to verify understanding',
      'Thank the pedestrian warmly',
    ],
  },
  {
    id: 'mission_emergency_911',
    title: 'Explaining an Emergency to 911 / Medical Services',
    category: 'Emergency & Safety',
    difficulty: 'Intermediate',
    level: 'A2',
    estimatedMinutes: 5,
    icon: 'PhoneCall',
    coverEmoji: '🚨',
    goal: 'Call emergency dispatch, state the exact nature and location of the incident, report injuries, and follow dispatcher instructions calmly.',
    requiredSkills: ['Urgent clear phrasing', 'Describing exact locations', 'Staying calm under pressure'],
    targetVocabulary: [
      { word: 'Conscious', meaning: 'Awake and aware of surroundings' },
      { word: 'Paramedics', meaning: 'Emergency healthcare workers' },
      { word: 'Dispatch', meaning: 'Send emergency vehicles to a scene' },
    ],
    usefulPhrases: [
      'I need to report a two-car traffic accident at the corner of 5th and Pine Street.',
      'One driver is conscious but complaining of severe chest pain.',
      'Please send an ambulance immediately.',
    ],
    scenarioDescription:
      'You witnessed a minor vehicle collision at a busy intersection. You call 911 immediately.',
    initialMessage:
      '911 Emergency Dispatch. What is the address of your emergency, and do you require police, fire, or ambulance?',
    aiCharacter: { name: 'Dispatcher Kelly', role: 'Emergency Dispatcher', avatar: '🚨' },
    conversationPrompt:
      'Act as 911 Dispatcher Kelly. Prioritize location, patient state, safety instructions, and confirm units are dispatched.',
    completionChecklist: [
      'State exact location immediately',
      'Explain what happened clearly without panic',
      'State number of people involved and injury condition',
      'Confirm safety instructions from dispatcher',
    ],
  },
  {
    id: 'mission_job_interview',
    title: 'Job Interview: Background & Salary Negotiation',
    category: 'Career & Professional',
    difficulty: 'Advanced',
    level: 'B2',
    estimatedMinutes: 8,
    icon: 'Award',
    coverEmoji: '💼',
    goal: 'Introduce your strengths using the STAR method, answer behavioral questions, and diplomatically discuss salary expectations.',
    requiredSkills: ['STAR story structure', 'Professional confidence', 'Salary anchoring & negotiation'],
    targetVocabulary: [
      { word: 'Initiative', meaning: 'The ability to assess and initiate things independently' },
      { word: 'Competitive', meaning: 'Fair and attractive compared to market standards' },
      { word: 'Deliverables', meaning: 'Things able to be provided, especially as a product of a development process' },
    ],
    usefulPhrases: [
      'In my previous role, I spearheaded a project that reduced processing time by 25%.',
      'Based on the responsibilities of this role and market benchmarks, I am targeting a range between $85,000 and $95,000.',
      'I am very excited about the company vision and confident I can add immediate value.',
    ],
    scenarioDescription:
      'Final round interview with Hiring VP Victoria at a growing tech enterprise.',
    initialMessage:
      'Welcome! We are really impressed with your technical portfolio. To start, tell me about a time you solved a critical project bottleneck.',
    aiCharacter: { name: 'Victoria', role: 'Vice President of Talent', avatar: '👩‍💼' },
    conversationPrompt:
      'Act as Victoria, a sharp executive interviewer. Ask behavioral follow-ups and explore salary expectations professionally.',
    completionChecklist: [
      'Deliver a concise STAR-formatted accomplishment',
      'Explain why you are the ideal fit for this team',
      'Handle salary discussion diplomatically',
      'Ask an insightful closing question to the interviewer',
    ],
  },
  {
    id: 'mission_bank_account',
    title: 'Opening a Bank Account & Inquiring About Fees',
    category: 'Finance & Banking',
    difficulty: 'Intermediate',
    level: 'A2',
    estimatedMinutes: 6,
    icon: 'CreditCard',
    coverEmoji: '🏦',
    goal: 'Inquire about checking account types, ask about minimum balances and international transfer fees, and complete onboarding.',
    requiredSkills: ['Financial vocabulary', 'Comparing account benefits', 'Clarifying fee structures'],
    targetVocabulary: [
      { word: 'Maintenance fee', meaning: 'A recurring charge for keeping an account open' },
      { word: 'Wire transfer', meaning: 'Electronic transfer of funds between banks' },
      { word: 'Overdraft', meaning: 'A deficit in a bank account caused by drawing more money than is held' },
    ],
    usefulPhrases: [
      'I would like to open a checking and savings account, please.',
      'Are there any monthly maintenance fees or minimum balance requirements?',
      'What are the charges for sending international wire transfers?',
    ],
    scenarioDescription:
      'You recently relocated or started university and need a local bank account. You visit Premier Bank and speak with Banker Andrew.',
    initialMessage:
      'Good afternoon! Welcome to Premier Bank. How can I help you manage your finances today?',
    aiCharacter: { name: 'Andrew', role: 'Personal Banker', avatar: '👨‍💼' },
    conversationPrompt:
      'Act as Andrew, a knowledgeable personal banker. Explain account tiers, fees, debit card issuance, and online banking.',
    completionChecklist: [
      'State the type of account you want to open',
      'Ask about monthly maintenance fees and fee waivers',
      'Inquire about international transfer fees and debit card delivery',
      'Confirm requirements and thank the banker',
    ],
  },
  {
    id: 'mission_airport_checkin',
    title: 'Airport Check-In & Missing Luggage Desk',
    category: 'Travel & Aviation',
    difficulty: 'Intermediate',
    level: 'A2',
    estimatedMinutes: 6,
    icon: 'Plane',
    coverEmoji: '✈️',
    goal: 'Check in for an international flight, request an aisle seat, and subsequently report a delayed/missing bag at the baggage service desk.',
    requiredSkills: ['Travel terminology', 'Describing luggage physical details', 'Filing a claim calmly'],
    targetVocabulary: [
      { word: 'Boarding pass', meaning: 'Document giving passenger permission to board an aircraft' },
      { word: 'Baggage claim tag', meaning: 'Receipt sticker identifying checked luggage' },
      { word: 'Carousel', meaning: 'Rotating luggage conveyor belt at an airport' },
    ],
    usefulPhrases: [
      'Here is my passport and booking reference.',
      'Could I possibly get an aisle seat near the front?',
      'My suitcase did not appear on Carousel 4. I need to file a missing baggage report.',
    ],
    scenarioDescription:
      'You landed at London Heathrow, but your black roller suitcase did not arrive. You speak with Baggage Agent Chloe.',
    initialMessage:
      'Baggage Services desk. Did your luggage fail to arrive on your incoming flight?',
    aiCharacter: { name: 'Chloe', role: 'Airline Baggage Agent', avatar: '👩‍✈️' },
    conversationPrompt:
      'Act as Chloe, an airline agent. Collect baggage claim receipt, passenger contact info, physical bag description, and issue a tracking reference number.',
    completionChecklist: [
      'Provide your boarding pass and luggage claim receipt',
      'Describe your luggage color, brand, and distinctive features',
      'Provide your delivery address and contact phone number',
      'Collect the missing baggage tracking number',
    ],
  },
];

export const EMERGENCY_HELP_SCENARIOS: EmergencyHelpSession[] = [
  {
    scenarioId: 'em_interview_1hr',
    scenarioTitle: 'Job Interview in 1 Hour',
    urgencyReason: 'You have an important English interview starting shortly and need immediate confidence and polished self-introduction phrases.',
    targetTone: 'Professional',
    goldenRuleTip:
      'Keep your answers structured: Point -> Brief Example -> Benefit to Employer. Speak slowly; native speakers perceive slower, deliberate speech as more authoritative.',
    topPhrases: [
      {
        phrase: 'Thank you for taking the time to meet with me today.',
        meaning: 'Polite, professional opening greeting.',
        pronunciationTip: 'Emphasize "time" and "today" with warm upward intonation.',
      },
      {
        phrase: 'In my recent role, my main responsibility was leading...',
        meaning: 'Direct way to introduce your key experience.',
      },
      {
        phrase: 'One of my greatest strengths is my ability to quickly adapt to new workflows.',
        meaning: 'Structured strength response with evidence.',
      },
      {
        phrase: 'Could you tell me more about the team’s biggest priorities for the coming quarter?',
        meaning: 'High-impact closing question demonstrating strategic thinking.',
      },
    ],
    keyVocabulary: [
      { word: 'Spearhead', meaning: 'To lead or initiate a project', phonetic: '/ˈspɪə.hed/' },
      { word: 'Streamline', meaning: 'To make a system or process more efficient', phonetic: '/ˈstriːm.laɪn/' },
      { word: 'Cross-functional', meaning: 'Working across different teams and departments', phonetic: '/ˌkrɒsˈfʌŋk.ʃən.əl/' },
    ],
    quickPracticeExercises: [
      {
        prompt: 'Arrange the words into an elegant interview opening:',
        targetSentence: 'I am excited about the opportunity to contribute to your team.',
        jumbledWords: ['excited', 'I', 'about', 'to', 'am', 'opportunity', 'the', 'team.', 'your', 'contribute', 'to'],
        hint: 'Start with "I am excited..."',
      },
    ],
    roleplayDialogue: {
      partnerName: 'Interviewer Rachel',
      partnerRole: 'Head of Recruitment',
      openingLine: 'Welcome! It’s great to connect. Could you walk me through your background and why you’re interested in this role?',
      suggestedResponses: [
        'Certainly! Over the past three years, I have focused on...',
        'Thank you! I was drawn to this position because your company is expanding into...',
      ],
    },
  },
  {
    scenarioId: 'em_landlord_leak',
    scenarioTitle: 'Calling Landlord About an Urgent Water Leak',
    urgencyReason: 'There is water leaking in your apartment and you need building maintenance dispatched immediately.',
    targetTone: 'Calm & Assertive',
    goldenRuleTip:
      'State the emergency immediately before pleasantries. Provide exact location in the apartment and state that delaying will cause property damage.',
    topPhrases: [
      {
        phrase: 'Hello, this is [Name] from Apartment 4B. I am calling because there is an active water leak in my bathroom.',
        meaning: 'Clear identification and emergency statement.',
      },
      {
        phrase: 'Water is dripping through the ceiling fixture and pooling on the floor.',
        meaning: 'Specific description of severity.',
      },
      {
        phrase: 'This requires immediate maintenance before it causes structural damage.',
        meaning: 'Assertive justification for emergency dispatch.',
      },
    ],
    keyVocabulary: [
      { word: 'Active leak', meaning: 'Water continuously coming out right now', phonetic: '/ˈæk.tɪv liːk/' },
      { word: 'Dripping', meaning: 'Falling in small drops', phonetic: '/ˈdrɪp.ɪŋ/' },
      { word: 'Maintenance', meaning: 'Repair and upkeep workers', phonetic: '/ˈmeɪn.tə.nəns/' },
    ],
    quickPracticeExercises: [
      {
        prompt: 'Arrange the sentence to request emergency plumbing:',
        targetSentence: 'Please send a plumber as soon as possible.',
        jumbledWords: ['as', 'possible.', 'Please', 'a', 'plumber', 'send', 'soon', 'as'],
        hint: 'Start with "Please send..."',
      },
    ],
    roleplayDialogue: {
      partnerName: 'Property Manager Dan',
      partnerRole: 'Building Super',
      openingLine: 'Dan speaking. What’s going on in the building?',
      suggestedResponses: [
        'Hi Dan, I have an urgent water leak in Apartment 4B coming from the ceiling.',
        'It’s getting worse quickly. We need someone to turn off the main valve right away.',
      ],
    },
  },
  {
    scenarioId: 'em_doctor_urgent',
    scenarioTitle: 'Explaining Urgent Symptoms to a Doctor / ER',
    urgencyReason: 'You or a family member feel unwell and need to clearly convey onset, pain level, and medication history in English.',
    targetTone: 'Clear & Direct',
    goldenRuleTip:
      'Use a 1-10 pain scale, state when symptoms started (e.g. "since yesterday evening"), and specify if pain is sharp, dull, throbbing, or burning.',
    topPhrases: [
      {
        phrase: 'I have a sharp, throbbing pain in my lower abdomen that started 4 hours ago.',
        meaning: 'Describes type, location, and timeframe accurately.',
      },
      {
        phrase: 'The pain is currently about a 7 out of 10.',
        meaning: 'Quantifies pain for triage priority.',
      },
      {
        phrase: 'I have no known allergies to medications, but I am currently taking...',
        meaning: 'Vital clinical safety information.',
      },
    ],
    keyVocabulary: [
      { word: 'Throbbing', meaning: 'Beating or pulsating with pain', phonetic: '/ˈθrɒb.ɪŋ/' },
      { word: 'Nausea', meaning: 'Feeling like you might vomit', phonetic: '/ˈnɔː.zi.ə/' },
      { word: 'Dizziness', meaning: 'Feeling off-balance or faint', phonetic: '/ˈdɪz.i.nəs/' },
    ],
    quickPracticeExercises: [
      {
        prompt: 'Arrange into a clear medical statement:',
        targetSentence: 'I have been experiencing severe dizziness since this morning.',
        jumbledWords: ['since', 'dizziness', 'I', 'experiencing', 'severe', 'have', 'morning.', 'been', 'this'],
        hint: 'Start with "I have been experiencing..."',
      },
    ],
    roleplayDialogue: {
      partnerName: 'Dr. Warren',
      partnerRole: 'Triage Physician',
      openingLine: 'Hello. I’m Dr. Warren. What brings you into urgent care today?',
      suggestedResponses: [
        'Doctor, I have had a severe throbbing headache and high fever since last night.',
        'The pain medication I took didn’t help, and I am feeling quite dizzy.',
      ],
    },
  },
];
