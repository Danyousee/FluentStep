import { EnglishForMyLifeGoal, LifeCurriculum } from '../types';

export const ENGLISH_LIFE_GOAL_PRESETS: EnglishForMyLifeGoal[] = [
  {
    id: 'goal_interview',
    title: 'I have a job interview tomorrow',
    category: 'Career',
    description: 'Master self-introduction, describing achievements, handling tough questions, and professional vocabulary.',
    icon: 'Briefcase',
  },
  {
    id: 'goal_travel',
    title: 'I am traveling next week',
    category: 'Travel',
    description: 'Learn airport check-ins, ordering meals, hotel reservations, asking directions, and emergency phrases.',
    icon: 'Plane',
  },
  {
    id: 'goal_workplace',
    title: 'I want to communicate better at work',
    category: 'Workplace',
    description: 'Improve meeting participation, writing polite emails, diplomatic disagreement, and giving project updates.',
    icon: 'Building2',
  },
  {
    id: 'goal_social_friends',
    title: 'I want to make international friends',
    category: 'Social',
    description: 'Casual slang, natural icebreakers, talking about hobbies, active listening, and making weekend plans.',
    icon: 'Users',
  },
  {
    id: 'goal_school_academic',
    title: 'I want to improve my school & academic English',
    category: 'Education',
    description: 'Classroom presentations, asking professors for help, essay connectors, and academic vocabulary.',
    icon: 'GraduationCap',
  },
  {
    id: 'goal_confident_speaking',
    title: 'I want to stop hesitating and speak confidently',
    category: 'Fluency',
    description: 'Time-buying phrases, sentence starters, filler reduction, and spontaneous speaking drills.',
    icon: 'Mic',
  },
];

export const PRESET_CURRICULA: Record<string, LifeCurriculum> = {
  goal_interview: {
    goalTitle: 'Job Interview Mastery',
    userIntent: 'I have a job interview tomorrow.',
    level: 'B1',
    vocabulary: [
      { word: 'experience', meaning: 'practical contact with and observation of facts or events', example: 'I have extensive experience leading software development teams.' },
      { word: 'qualification', meaning: 'a quality or accomplishment that makes someone suitable', example: 'My background in data analytics matches the qualifications for this role.' },
      { word: 'responsibility', meaning: 'the state or job of having a duty to deal with something', example: 'In my last position, my core responsibility was client onboarding.' },
      { word: 'collaborate', meaning: 'work jointly on an activity or project', example: 'I frequently collaborate with product and design teams.' },
      { word: 'initiative', meaning: 'the power or opportunity to act or take charge before others do', example: 'I took the initiative to automate our weekly reporting workflow.' },
    ],
    usefulPhrases: [
      { phrase: 'I have over three years of experience in...', whenToUse: 'Summarizing your career background clearly at the start.' },
      { phrase: 'In my previous position, I was responsible for...', whenToUse: 'Explaining your specific daily tasks and duties.' },
      { phrase: 'One major milestone I achieved was...', whenToUse: 'Highlighting a quantifiable success story (STAR method).' },
      { phrase: 'What does a typical day look like for someone in this role?', whenToUse: 'Asking the interviewer insightful closing questions.' },
      { phrase: 'Thank you very much for this opportunity to speak with you today.', whenToUse: 'Closing the interview with professional warmth.' },
    ],
    commonQuestions: [
      {
        question: 'Could you tell me a little bit about yourself?',
        goodAnswer: 'Certainly! I have been working in project coordination for four years. I specialize in streamlining team communication and delivering milestones on schedule. I am eager to bring my problem-solving skills to this team.',
        tip: 'Keep it to 90 seconds. Focus on Present -> Past Achievements -> Why this role.',
      },
      {
        question: 'What is your greatest professional strength?',
        goodAnswer: 'My greatest strength is my proactive problem-solving. When unforeseen bottlenecks occur, I quickly analyze root causes and propose actionable solutions.',
        tip: 'Always back up your strength with a short 1-sentence real example.',
      },
      {
        question: 'How do you handle tight deadlines or workplace pressure?',
        goodAnswer: 'I prioritize tasks based on impact and urgency, communicate proactively with stakeholders, and break complex tasks into manageable daily deliverables.',
        tip: 'Show emotional composure, structure, and communication discipline.',
      },
    ],
    sentencePatterns: [
      { pattern: 'I have [X years of] experience in [noun/gerund]...', example: 'I have five years of experience in customer relationship management.' },
      { pattern: 'I am particularly skilled at [verb+ing]...', example: 'I am particularly skilled at organizing cross-functional sprints.' },
      { pattern: 'What attracted me to this position is [noun/clause]...', example: 'What attracted me to this position is your company\'s commitment to innovation.' },
    ],
    grammarFocus: [
      { topic: 'Present Perfect vs. Past Simple', rule: 'Use Present Perfect ("I have worked") for experiences connecting to now, and Past Simple ("In 2022, I managed") for completed past projects.', example: 'I have led five marketing campaigns, and last year I organized our annual summit.' },
    ],
    speakingPrompt: 'Introduce yourself in 60 seconds as if speaking to the hiring manager. Highlight your core strength and reason for applying.',
    mockScenario: {
      title: 'Final Round Interview with Hiring Director',
      partnerRole: 'Hiring Director (Sarah)',
      situation: 'Video interview for a leadership position.',
      openingMessage: 'Good morning! Thank you for joining us today. To kick off our conversation, could you walk me through your background and what excites you about this role?',
    },
  },
  goal_travel: {
    goalTitle: 'International Travel & Airport Survival',
    userIntent: 'I am traveling next week.',
    level: 'A2',
    vocabulary: [
      { word: 'boarding pass', meaning: 'document giving passenger permission to board an aircraft', example: 'Please have your passport and boarding pass ready.' },
      { word: 'luggage / baggage', meaning: 'suitcases and bags containing personal belongings', example: 'How many pieces of luggage are you checking in today?' },
      { word: 'customs', meaning: 'the official department that checks goods arriving into a country', example: 'We need to pass through customs and passport control.' },
      { word: 'terminal', meaning: 'a building at an airport where passengers transfer', example: 'Our flight departs from Terminal 2, Gate 14.' },
      { word: 'reservation', meaning: 'an arrangement to have something kept for you', example: 'I have a hotel reservation under the name Anderson.' },
    ],
    usefulPhrases: [
      { phrase: 'Excuse me, which way to Gate 12?', whenToUse: 'Navigating unfamiliar international airports.' },
      { phrase: 'Could I please get a window / aisle seat?', whenToUse: 'Checking in at the airline counter.' },
      { phrase: 'Where can I exchange foreign currency?', whenToUse: 'In the airport arrival hall.' },
      { phrase: 'Is there a direct bus or train into the city center?', whenToUse: 'Arranging transit from airport to hotel.' },
      { phrase: 'Could you recommend a good local restaurant nearby?', whenToUse: 'Asking hotel concierge or locals.' },
    ],
    commonQuestions: [
      {
        question: 'What is the purpose of your visit?',
        goodAnswer: 'I am here for tourism and sightseeing for two weeks.',
        tip: 'Keep answers concise and clear at immigration control.',
      },
      {
        question: 'Where will you be staying during your trip?',
        goodAnswer: 'I have a reservation at the Marriott Hotel in downtown Chicago.',
        tip: 'Have the address written on your phone or paper.',
      },
    ],
    sentencePatterns: [
      { pattern: 'Could you tell me how to get to [place]?', example: 'Could you tell me how to get to the baggage claim area?' },
      { pattern: 'I would like to [verb]...', example: 'I would like to check in for my flight to Tokyo.' },
    ],
    grammarFocus: [
      { topic: 'Polite Modals: Could / Would / May', rule: 'Always use "Could I have..." or "Would you mind..." instead of imperative commands when traveling.', example: 'Could you please help me with this heavy suitcase?' },
    ],
    speakingPrompt: 'Practice ordering a meal at an international airport cafe and asking for the WiFi password.',
    mockScenario: {
      title: 'Airport Check-in & Gate Inquiries',
      partnerRole: 'Airline Counter Agent (James)',
      situation: 'Checking in for an international flight.',
      openingMessage: 'Good morning! Welcome to SkyWays. Where are you flying to today, and may I see your passport?',
    },
  },
};
