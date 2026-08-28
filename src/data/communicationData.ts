import { CommunicationLesson } from '../types';

export type CommunicationLessonItem = CommunicationLesson;

export const COMMUNICATION_LESSONS: CommunicationLesson[] = [
  {
    id: 'comm_ordering_food',
    title: 'Ordering in a Restaurant or Café',
    category: 'Everyday Life',
    level: 'A2',
    icon: 'Utensils',
    goal: 'Order food, ask about menu ingredients, and request the check politely.',
    explanation:
      'In English-speaking countries, direct commands like "Give me water" or "Bring the bill" sound abrupt or rude. Instead, use soft modal verbs like "Could I have..." or "May I please get...".',
    formalVsCasual: [
      {
        situation: 'Asking for the bill',
        casual: 'Can we get the check?',
        standard: 'Could we please have the bill?',
        formal: 'Excuse me, could you bring us the bill whenever you are ready, please?',
      },
      {
        situation: 'Ordering a beverage',
        casual: 'I’ll grab a lemonade.',
        standard: 'Could I please get a lemonade?',
        formal: 'May I please have a freshly squeezed lemonade?',
      },
    ],
    whatNotToSay: [
      {
        unnatural: 'Give me one chicken and chips.',
        natural: 'Could I please have the grilled chicken with fries?',
        why: '"Give me" sounds demanding. "Could I please have..." is the standard polite formulation.',
      },
      {
        unnatural: 'I want water now.',
        natural: 'Excuse me, could we get a glass of water, please?',
        why: 'Always open with "Excuse me" to get attention without interrupting abruptly.',
      },
    ],
    dialogueExample: [
      { speaker: 'Server', role: 'Staff', text: 'Good evening! Are you ready to order or do you need a few more minutes with the menu?' },
      { speaker: 'You', role: 'Customer', text: 'Good evening! We are ready. Could I start with the tomato soup, please?' },
      { speaker: 'Server', role: 'Staff', text: 'Excellent choice. And for your main course?' },
      { speaker: 'You', role: 'Customer', text: 'I would like the grilled salmon with seasonal vegetables, please.' },
      { speaker: 'Server', role: 'Staff', text: 'Perfect. Would you care for any dessert or coffee after?' },
      { speaker: 'You', role: 'Customer', text: 'Not just yet, thank you so much!' },
    ],
    keyExpressions: [
      'Could I please have...?',
      'I would like to try...',
      'Does this dish contain any dairy or nuts?',
      'Could we have the bill, please?',
    ],
  },
  {
    id: 'comm_job_interview',
    title: 'Answering Job Interview Questions',
    category: 'Work & Professional',
    level: 'B1',
    icon: 'Briefcase',
    goal: 'Confidently present your background, strengths, and handling challenges.',
    explanation:
      'Job interviews require a confident yet humble tone. Structure your answers clearly using transitional markers: "First of all", "In my previous role", "As a result", and "Moving forward".',
    formalVsCasual: [
      {
        situation: 'Introducing your background',
        casual: 'I’ve been doing coding stuff for 3 years.',
        standard: 'I have three years of experience developing web applications.',
        formal: 'Over the past three years, I have specialized in building responsive, scalable applications.',
      },
      {
        situation: 'Discussing a past achievement',
        casual: 'I fixed a big problem with our site.',
        standard: 'I resolved a major performance bottleneck that increased site speed by 40%.',
        formal: 'I spearheaded an optimization initiative that successfully boosted platform responsiveness by 40%.',
      },
    ],
    whatNotToSay: [
      {
        unnatural: 'I know everything and I never make errors.',
        natural: 'I am a fast learner who thrives on feedback and continuous improvement.',
        why: 'Claiming perfection sounds insincere; showing adaptability and problem-solving is preferred.',
      },
      {
        unnatural: 'My last boss was very bad and mean.',
        natural: 'I am seeking a role with greater opportunities for collaborative growth.',
        why: 'Never criticize former employers; frame moves in terms of positive career development.',
      },
    ],
    dialogueExample: [
      { speaker: 'Interviewer', role: 'Hiring Manager', text: 'Tell me about a time you handled a tight deadline.' },
      { speaker: 'You', role: 'Candidate', text: 'In my last position, we had to deliver a feature in two days. I prioritized core functions, coordinated closely with the team, and we delivered on schedule.' },
      { speaker: 'Interviewer', role: 'Hiring Manager', text: 'That sounds impressive. How do you handle constructive feedback?' },
      { speaker: 'You', role: 'Candidate', text: 'I view feedback as a valuable tool for sharpening my craft and ensuring project excellence.' },
    ],
    keyExpressions: [
      'In my previous role, I was responsible for...',
      'One of my greatest strengths is...',
      'I approach challenges by first analyzing...',
      'I am excited about this opportunity because...',
    ],
  },
  {
    id: 'comm_diplomatic_disagreement',
    title: 'Disagreeing Politely and Diplomatically',
    category: 'Work & Professional',
    level: 'B2',
    icon: 'MessageSquare',
    goal: 'Express differing viewpoints in meetings or discussions without offending others.',
    explanation:
      'Saying "You are wrong" causes defensiveness. English speakers use softening cushions like "I see your point, however...", "That is an interesting perspective, but have we considered...", or "I’m not entirely sure about that".',
    formalVsCasual: [
      {
        situation: 'Disagreeing in a team meeting',
        casual: 'No, that won’t work.',
        standard: 'I see what you mean, but that might be difficult to implement given our timeline.',
        formal: 'While I appreciate that suggestion, I have some concerns regarding resource allocation.',
      },
    ],
    whatNotToSay: [
      {
        unnatural: 'You are wrong about this number.',
        natural: 'According to our latest metrics, the figure appears to be slightly different.',
        why: 'Focus on the data rather than making personal accusations.',
      },
    ],
    dialogueExample: [
      { speaker: 'Colleague', role: 'Peer', text: 'I think we should launch this feature immediately without more testing.' },
      { speaker: 'You', role: 'Peer', text: 'I understand the urgency, but wouldn’t it be safer to run a 24-hour test to prevent unexpected bugs?' },
      { speaker: 'Colleague', role: 'Peer', text: 'That is a fair point. Let us schedule the test for this evening.' },
    ],
    keyExpressions: [
      'I see your point, however...',
      'Have we considered the possibility that...?',
      'From my perspective...',
      'While I agree in principle, my main concern is...',
    ],
  },
];
