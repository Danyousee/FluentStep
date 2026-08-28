import { LearningRoadmap, RoadmapWeek, UserLevel } from '../types';

export function generateDefaultRoadmap(userLevel: UserLevel = 'A1', weakAreas: string[] = []): LearningRoadmap {
  const hasPastTenseWeakness = weakAreas.some(w => w.toLowerCase().includes('past') || w.toLowerCase().includes('tense'));
  const hasPrepositionWeakness = weakAreas.some(w => w.toLowerCase().includes('prep'));

  const weeks: RoadmapWeek[] = [
    {
      weekNumber: 1,
      title: 'Week 1: Core Foundation & Sentence Architecture',
      theme: 'Mastering Subject + Verb + Object, 20 high-frequency words, and effortless introductions.',
      focusSkills: ['Sentence Building', 'Essential Vocabulary', 'Present Tense', 'Introductions'],
      days: [
        {
          dayNumber: 1,
          title: 'Day 1: Sentence Foundations (Subject + Verb)',
          summary: 'Learn how every complete English thought is constructed and build your first 5 sentences.',
          completed: true,
          xpReward: 30,
          tasks: [
            { id: 't_1_1', title: 'Learn Subject + Verb + Object structure', type: 'sentence', targetNav: { page: 'sentence_builder' }, completed: true, description: 'Master foundational English word order without auxiliary confusion.' },
            { id: 't_1_2', title: '5 Essential Daily Vocabulary words', type: 'vocab', targetNav: { page: 'vocabulary' }, completed: true, description: 'Learn borrow, delicious, improve, polite, reliable.' },
          ],
        },
        {
          dayNumber: 2,
          title: 'Day 2: The Verb "To Be" & Descriptions',
          summary: 'Describe yourself, your job, and your feelings accurately without dropping the verb "is/are".',
          completed: true,
          xpReward: 30,
          tasks: [
            { id: 't_2_1', title: 'Verb "To Be" Grammar Mastery', type: 'grammar', targetNav: { page: 'grammar' }, completed: true, description: 'I am, You are, He/She is with negative and question forms.' },
            { id: 't_2_2', title: 'Introduce Yourself in Voice', type: 'speaking', targetNav: { page: 'speaking_practice' }, completed: true, description: 'Speak 3 full sentences about your name, job, and city.' },
          ],
        },
        {
          dayNumber: 3,
          title: 'Day 3: Present Simple & Daily Habits',
          summary: 'Talk effortlessly about your morning routines and what you do every day.',
          completed: true,
          xpReward: 30,
          tasks: [
            { id: 't_3_1', title: 'Present Simple Rules & 3rd Person "s"', type: 'grammar', targetNav: { page: 'grammar' }, completed: true, description: 'Why we say "He works" but "They work".' },
            { id: 't_3_2', title: 'Sentence Pattern: "I usually [verb] in the morning"', type: 'sentence', targetNav: { page: 'sentence_patterns' }, completed: true, description: 'Build habitual lifestyle sentences.' },
          ],
        },
        {
          dayNumber: 4,
          title: 'Day 4: Real-Life Mission: Meet & Greet',
          summary: 'Step into a simulated networking break and introduce yourself to Alex.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_4_1', title: 'Mission 1: Introduce Yourself', type: 'mission', targetNav: { page: 'missions', id: 'mission_intro' }, completed: false, description: 'Exchanged greetings, background, and friendly questions.' },
            { id: 't_4_2', title: 'Smart Review: Daily SRS Queue', type: 'review', targetNav: { page: 'smart_review' }, completed: false, description: 'Review 10 flashcards due today.' },
          ],
        },
        {
          dayNumber: 5,
          title: 'Day 5: Asking Questions (Do vs. Does & WH-words)',
          summary: 'Stop guessing how to formulate questions. Learn the inverted auxiliary rule.',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_5_1', title: 'Question Formation Engine', type: 'grammar', targetNav: { page: 'sentence_transformation' }, completed: false, description: 'Transform positive statements into Yes/No and WH questions.' },
            { id: 't_5_2', title: 'Interactive Story: The Secret Recipe (Scene 1)', type: 'reading', targetNav: { page: 'story_mode' }, completed: false, description: 'Make dialogue decisions in an English cafe story.' },
          ],
        },
        {
          dayNumber: 6,
          title: 'Day 6: Voice Journal & Fluency Kickoff',
          summary: 'Record your very first 1-minute audio voice journal about your day.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_6_1', title: '1-Minute Voice Journal Entry', type: 'speaking', targetNav: { page: 'voice_journal' }, completed: false, description: 'Speak freely and receive instant grammar & natural phrasing analysis.' },
            { id: 't_6_2', title: 'Word Choice: Say vs. Tell', type: 'vocab', targetNav: { page: 'word_choice' }, completed: false, description: 'Eliminate "He said me" errors permanently.' },
          ],
        },
        {
          dayNumber: 7,
          title: 'Day 7: Week 1 Consolidation & AI Assessment',
          summary: 'Review your 20 words, take your weekly quiz, and generate your progress report.',
          completed: false,
          xpReward: 50,
          tasks: [
            { id: 't_7_1', title: 'Week 1 Adaptive Milestone Quiz', type: 'review', targetNav: { page: 'adaptive_quiz' }, completed: false, description: 'Assess vocabulary retention and sentence building.' },
            { id: 't_7_2', title: 'Weekly Learning Report Check', type: 'review', targetNav: { page: 'weekly_report' }, completed: false, description: 'Analyze your weekly stats and areas to strengthen.' },
          ],
        },
      ],
    },
    {
      weekNumber: 2,
      title: hasPastTenseWeakness ? 'Week 2: Past Tense Mastery & Narrative Confidence (Custom Focus)' : 'Week 2: Past Tense, Storytelling & Listening',
      theme: 'Mastering regular & irregular past verbs, time connectors, and describing past events smoothly.',
      focusSkills: ['Past Simple', 'Time Prepositions', 'Listening Comprehension', 'Storytelling'],
      days: [
        {
          dayNumber: 8,
          title: 'Day 8: Regular vs. Irregular Past Verbs',
          summary: 'Understand why "go" becomes "went" and "buy" becomes "bought".',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_8_1', title: 'Past Tense Grammar Deep Dive', type: 'grammar', targetNav: { page: 'grammar' }, completed: false, description: 'Top 30 irregular past verbs with audio examples.' },
            { id: 't_8_2', title: 'Sentence Expansion in Past Tense', type: 'sentence', targetNav: { page: 'sentence_expansion' }, completed: false, description: 'Expand sentences with time markers (yesterday, last week).' },
          ],
        },
        {
          dayNumber: 9,
          title: 'Day 9: Time Prepositions (In, On, At, For, Since)',
          summary: 'Never mix up "at night", "in July", "on Monday", or "for 3 years" again.',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_9_1', title: 'Prepositions of Time & Place', type: 'grammar', targetNav: { page: 'grammar' }, completed: false, description: 'Clear visual triangle rules for in / on / at.' },
            { id: 't_9_2', title: 'Practice My Mistakes: Preposition Errors', type: 'review', targetNav: { page: 'my_mistakes' }, completed: false, description: 'Review your previously recorded preposition slips.' },
          ],
        },
        {
          dayNumber: 10,
          title: 'Day 10: Real-Life Mission: Order Food at a Bistro',
          summary: 'Order appetizers, drinks, and dietary adjustments with polite restaurant etiquette.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_10_1', title: 'Mission: Order a Complete Meal', type: 'mission', targetNav: { page: 'missions', id: 'mission_order_food' }, completed: false, description: 'Handle server questions and request the bill.' },
            { id: 't_10_2', title: 'Collocations with "Make" vs "Do"', type: 'vocab', targetNav: { page: 'collocations' }, completed: false, description: 'Make a reservation, do a favor.' },
          ],
        },
        {
          dayNumber: 11,
          title: 'Day 11: Listening Lab: Everyday English Monologues',
          summary: 'Listen to native dialogues at natural speed and answer comprehension questions.',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_11_1', title: 'Listening Comprehension Lab', type: 'listening', targetNav: { page: 'listening_practice' }, completed: false, description: 'Morning routines and travel announcements.' },
            { id: 't_11_2', title: 'Pronunciation Lab: Past -ed Endings (/t/, /d/, /ɪd/)', type: 'speaking', targetNav: { page: 'pronunciation_lab' }, completed: false, description: 'Pronounce worked, played, and wanted accurately.' },
          ],
        },
        {
          dayNumber: 12,
          title: 'Day 12: Phone Call Simulator: Hotel Booking',
          summary: 'Simulate a real phone call with an AI receptionist without text subtitles.',
          completed: false,
          xpReward: 45,
          tasks: [
            { id: 't_12_1', title: 'Phone Call: Grand Horizon Hotel', type: 'speaking', targetNav: { page: 'phone_call' }, completed: false, description: 'Confirm late arrival and shuttle options over audio.' },
            { id: 't_12_2', title: 'Communication Strategies: Asking to Repeat', type: 'conversation', targetNav: { page: 'communication_skills' }, completed: false, description: '"Could you speak a little more slowly?"' },
          ],
        },
        {
          dayNumber: 13,
          title: 'Day 13: Fluency Mode: A Memorable Experience',
          summary: 'Speak continuously for 3 minutes without interruption about a memorable trip.',
          completed: false,
          xpReward: 45,
          tasks: [
            { id: 't_13_1', title: '3-Minute Fluency Speaking Session', type: 'speaking', targetNav: { page: 'fluency_mode' }, completed: false, description: 'Get your comprehensive AI Fluency Score & Better Expressions.' },
            { id: 't_13_2', title: 'Sound Natural Trainer', type: 'review', targetNav: { page: 'sound_natural' }, completed: false, description: 'Turn unnatural literal translations into native expressions.' },
          ],
        },
        {
          dayNumber: 14,
          title: 'Day 14: Week 2 Assessment & Roadmap Calibration',
          summary: 'Review past tense accuracy and adjust your upcoming Week 3 roadmap dynamically.',
          completed: false,
          xpReward: 50,
          tasks: [
            { id: 't_14_1', title: 'Weekly English Report Generation', type: 'review', targetNav: { page: 'weekly_report' }, completed: false, description: 'Review your vocabulary growth and speech fluency metrics.' },
            { id: 't_14_2', title: 'Writing Challenge: My Memorable Holiday', type: 'writing', targetNav: { page: 'writing_coach' }, completed: false, description: 'Receive line-by-line AI writing feedback.' },
          ],
        },
      ],
    },
    {
      weekNumber: 3,
      title: 'Week 3: Future Plans, Opinions & Professional Communication',
      theme: 'Expressing future intentions (will vs going to), giving polite opinions, and workplace scenarios.',
      focusSkills: ['Future Forms', 'Giving Opinions', 'Business Phrasal Verbs', 'Diplomatic English'],
      days: [
        {
          dayNumber: 15,
          title: 'Day 15: Will vs. Going To vs. Present Continuous for Future',
          summary: 'Learn when to use "I will", "I am going to", or "I am meeting him tomorrow".',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_15_1', title: 'Future Tense Nuances', type: 'grammar', targetNav: { page: 'grammar' }, completed: false, description: 'Spontaneous decisions vs planned appointments.' },
            { id: 't_15_2', title: 'Sentence Pattern: "I\'m planning to [verb]"', type: 'sentence', targetNav: { page: 'sentence_patterns' }, completed: false, description: 'Talk about your career and personal goals.' },
          ],
        },
        {
          dayNumber: 16,
          title: 'Day 16: Giving Opinions & Agreeing / Disagreeing Politely',
          summary: 'Express your thoughts diplomatically in discussions without sounding aggressive.',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_16_1', title: 'Diplomatic Disagreement Phrases', type: 'conversation', targetNav: { page: 'communication_skills' }, completed: false, description: '"I see your point, but...", "I\'m not so sure that..."' },
            { id: 't_16_2', title: 'Contextual Vocabulary: Run, Head, Break', type: 'vocab', targetNav: { page: 'contextual_vocab' }, completed: false, description: 'Learn multiple meanings in different sentence environments.' },
          ],
        },
        {
          dayNumber: 17,
          title: 'Day 17: Workplace Emails & Messages',
          summary: 'Write professional workplace messages that sound polished and courteous.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_17_1', title: 'Writing Coach: Inquiry Email', type: 'writing', targetNav: { page: 'writing_coach' }, completed: false, description: 'Submit an email draft and review formality scoring.' },
            { id: 't_17_2', title: 'Phrasal Verbs in Business (Follow up, Call off, Look into)', type: 'vocab', targetNav: { page: 'phrasal_verbs' }, completed: false, description: 'Master separable and inseparable verbs.' },
          ],
        },
        {
          dayNumber: 18,
          title: 'Day 18: English For My Life: Tailored Mini-Program',
          summary: 'Build a custom curriculum for your exact real-life goal (job, travel, work, friends).',
          completed: false,
          xpReward: 45,
          tasks: [
            { id: 't_18_1', title: 'Launch Personalized Life Goal', type: 'review', targetNav: { page: 'english_for_my_life' }, completed: false, description: 'Generate custom target vocabulary and scenario dialogues.' },
            { id: 't_18_2', title: 'Voice Journal: Weekly Reflection', type: 'speaking', targetNav: { page: 'voice_journal' }, completed: false, description: 'Compare your speaking speed against Week 1.' },
          ],
        },
        {
          dayNumber: 19,
          title: 'Day 19: Mission: Ask for Directions in a New City',
          summary: 'Navigate streets with prepositions of place and verify instructions.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_19_1', title: 'Mission: Navigation & Directions', type: 'mission', targetNav: { page: 'missions', id: 'mission_directions' }, completed: false, description: 'Stop a pedestrian politely and verify landmarks.' },
            { id: 't_19_2', title: 'Smart Review Queue', type: 'review', targetNav: { page: 'smart_review' }, completed: false, description: '12 adaptive review exercises selected for you.' },
          ],
        },
        {
          dayNumber: 20,
          title: 'Day 20: Phone Call Simulator: Airline Support',
          summary: 'Handle customer support calls with confidence, asking for fees and email confirmations.',
          completed: false,
          xpReward: 45,
          tasks: [
            { id: 't_20_1', title: 'Phone Call: Global Air Support', type: 'speaking', targetNav: { page: 'phone_call' }, completed: false, description: 'Modify your flight date and clarify baggage policies.' },
            { id: 't_20_2', title: 'Word Choice: Job vs Work, Fun vs Funny', type: 'vocab', targetNav: { page: 'word_choice' }, completed: false, description: 'Nuance discrimination drills.' },
          ],
        },
        {
          dayNumber: 21,
          title: 'Day 21: Week 3 Report & Fluency Test',
          summary: 'Measure your sentence complexity and reduced hesitation.',
          completed: false,
          xpReward: 50,
          tasks: [
            { id: 't_21_1', title: 'Weekly Performance Report', type: 'review', targetNav: { page: 'weekly_report' }, completed: false, description: 'Track reduction in common mistakes.' },
            { id: 't_21_2', title: 'Interactive Story: The Job Offer', type: 'reading', targetNav: { page: 'story_mode' }, completed: false, description: 'Branching professional dilemma narrative.' },
          ],
        },
      ],
    },
    {
      weekNumber: 4,
      title: 'Week 4: Real-Life Fluency, Mock Simulations & Final Certification',
      theme: 'Spontaneous conversations, mock interviews, complaint resolutions, and total speaking confidence.',
      focusSkills: ['Spontaneous Fluency', 'Interview Mastery', 'Conflict Resolution', 'Comprehensive Assessment'],
      days: [
        {
          dayNumber: 22,
          title: 'Day 22: Modal Verbs for Politeness & Possibility',
          summary: 'Use could, should, would, might, and must with natural nuance.',
          completed: false,
          xpReward: 35,
          tasks: [
            { id: 't_22_1', title: 'Modal Auxiliary Masterclass', type: 'grammar', targetNav: { page: 'grammar' }, completed: false, description: 'Polite requests vs suggestions vs obligations.' },
            { id: 't_22_2', title: 'Say It Better: 4-Tier Rewrites', type: 'review', targetNav: { page: 'say_it_better' }, completed: false, description: 'Turn direct sentences into courteous workplace phrasing.' },
          ],
        },
        {
          dayNumber: 23,
          title: 'Day 23: Mission: Make a Polite Hotel Complaint',
          summary: 'Resolve room maintenance and customer service issues with calm assertiveness.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_23_1', title: 'Mission: Effective Complaint Resolution', type: 'mission', targetNav: { page: 'missions', id: 'mission_complaint' }, completed: false, description: 'Politely explain issues and negotiate a room change.' },
            { id: 't_23_2', title: 'My Words Notebook Practice', type: 'vocab', targetNav: { page: 'my_words' }, completed: false, description: 'Flashcard drill on your personal saved vocabulary.' },
          ],
        },
        {
          dayNumber: 24,
          title: 'Day 24: 5-Minute Fluency Speaking Challenge',
          summary: 'Speak continuously for 5 full minutes on "Technology & My Future Career".',
          completed: false,
          xpReward: 50,
          tasks: [
            { id: 't_24_1', title: '5-Minute Uninterrupted Fluency Session', type: 'speaking', targetNav: { page: 'fluency_mode' }, completed: false, description: 'Benchmark your speaking stamina, vocabulary variety, and grammar.' },
            { id: 't_24_2', title: 'Comparative Fluency Attempt', type: 'speaking', targetNav: { page: 'fluency_mode' }, completed: false, description: 'Repeat the topic to measure real-time improvement.' },
          ],
        },
        {
          dayNumber: 25,
          title: 'Day 25: Mission: Full Mock Job Interview',
          summary: 'Complete a realistic 4-stage job interview with AI Talent Director Sarah Jenkins.',
          completed: false,
          xpReward: 50,
          tasks: [
            { id: 't_25_1', title: 'Mission: Professional Job Interview', type: 'mission', targetNav: { page: 'missions', id: 'mission_job_interview' }, completed: false, description: 'STAR method answers, strengths, and closing questions.' },
            { id: 't_25_2', title: 'Voice Journal: Post-Interview Reflection', type: 'speaking', targetNav: { page: 'voice_journal' }, completed: false, description: 'Record how you felt and your key takeaways.' },
          ],
        },
        {
          dayNumber: 26,
          title: 'Day 26: Master Review: All Saved & Weak Mistakes',
          summary: 'Target and permanently conquer all recorded mistakes in your personal database.',
          completed: false,
          xpReward: 45,
          tasks: [
            { id: 't_26_1', title: 'Personal Mistake Elimination Sprint', type: 'review', targetNav: { page: 'my_mistakes' }, completed: false, description: 'Interactive AI-generated questions matching your past errors.' },
            { id: 't_26_2', title: 'Smart Review 12-Item Session', type: 'review', targetNav: { page: 'smart_review' }, completed: false, description: 'Achieve 100% review accuracy.' },
          ],
        },
        {
          dayNumber: 27,
          title: 'Day 27: Phone Call Simulator: Doctor & Clinic Booking',
          summary: 'Simulate scheduling an appointment and asking insurance questions over the phone.',
          completed: false,
          xpReward: 45,
          tasks: [
            { id: 't_27_1', title: 'Phone Call: Cityview Health Center', type: 'speaking', targetNav: { page: 'phone_call' }, completed: false, description: 'Schedule checkup with Dr. Collins.' },
            { id: 't_27_2', title: 'Writing Challenge: Opinion Essay', type: 'writing', targetNav: { page: 'writing_coach' }, completed: false, description: 'Draft a 150-word opinion piece.' },
          ],
        },
        {
          dayNumber: 28,
          title: 'Day 28: Reading Lab: Level Advancement Article',
          summary: 'Read a rich long-form article with interactive vocabulary and comprehension checks.',
          completed: false,
          xpReward: 40,
          tasks: [
            { id: 't_28_1', title: 'Reading Lab: Innovation in Global Communication', type: 'reading', targetNav: { page: 'reading_lab' }, completed: false, description: 'Listen to native audio and test comprehension.' },
            { id: 't_28_2', title: 'Sound Natural Practice Sprint', type: 'review', targetNav: { page: 'sound_natural' }, completed: false, description: 'Test 10 tricky expressions.' },
          ],
        },
        {
          dayNumber: 29,
          title: 'Day 29: AI Personal Tutor Comprehensive Dialogue',
          summary: 'Engage in a 10-minute open conversational exchange with Alex on any topic.',
          completed: false,
          xpReward: 50,
          tasks: [
            { id: 't_29_1', title: 'Open AI Tutor Master Chat', type: 'conversation', targetNav: { page: 'ai_tutor' }, completed: false, description: 'Discuss your goals, hobbies, and international aspirations.' },
            { id: 't_29_2', title: 'Voice Journal Month 1 Milestone Entry', type: 'speaking', targetNav: { page: 'voice_journal' }, completed: false, description: 'Compare your speech from Day 6 against today.' },
          ],
        },
        {
          dayNumber: 30,
          title: 'Day 30: 30-Day Graduation Assessment & CEFR Level Up 🎉',
          summary: 'Complete your comprehensive final assessment and unlock your Level Certificate!',
          completed: false,
          xpReward: 100,
          tasks: [
            { id: 't_30_1', title: '30-Day Comprehensive Final Assessment', type: 'review', targetNav: { page: 'adaptive_quiz' }, completed: false, description: 'Test vocabulary, grammar, listening, and sentence construction.' },
            { id: 't_30_2', title: 'Monthly Learning Milestone Report', type: 'review', targetNav: { page: 'weekly_report' }, completed: false, description: 'View your total words mastered, speaking minutes, and level advancement.' },
          ],
        },
      ],
    },
  ];

  return {
    id: `roadmap_${userLevel.toLowerCase()}_${Date.now()}`,
    planTitle: `YOUR 30-DAY ENGLISH ROADMAP (${userLevel.toUpperCase()} LEVEL)`,
    targetLevel: userLevel,
    createdAt: new Date().toISOString(),
    currentDay: 4,
    weeks,
    adaptiveNotes: hasPastTenseWeakness
      ? 'Customized: Automatically increased past tense and storytelling exercises based on your recent mistakes.'
      : 'Calibrated to your CEFR placement level with progressive speaking, sentence building, and real-life missions.',
  };
}
