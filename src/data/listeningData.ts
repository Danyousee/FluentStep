import { ListeningPassage } from '../types';

export const LISTENING_PASSAGES: ListeningPassage[] = [
  {
    id: 'lp_daily_routine',
    title: 'A Typical Morning in London',
    level: 'A1',
    topic: 'Daily Routine',
    duration: '1:15',
    passageText:
      'My name is Oliver. Every weekday, my alarm rings at 6:30 in the morning. I get out of bed, wash my face, and prepare a fresh cup of coffee with toast. At 7:30, I leave my apartment and walk ten minutes to the underground station. The train ride to my office takes about twenty-five minutes. During the commute, I usually read a book or listen to an English podcast. I arrive at my desk promptly at 8:15 and review my daily tasks.',
    keyVocabulary: [
      { word: 'Alarm', meaning: 'A device that wakes you up at a set time.' },
      { word: 'Commute', meaning: 'The regular journey to and from work.' },
      { word: 'Promptly', meaning: 'Exactly on time; without delay.' },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What time does Oliver’s alarm ring on weekdays?',
        options: ['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM'],
        correctIndex: 1,
        explanation: 'Oliver states his alarm rings at 6:30 in the morning.',
      },
      {
        id: 'q2',
        question: 'How long does it take Oliver to walk to the underground station?',
        options: ['5 minutes', '10 minutes', '25 minutes', '1 hour'],
        correctIndex: 1,
        explanation: 'He walks ten minutes to the underground station.',
      },
      {
        id: 'q3',
        question: 'What does Oliver usually do during his commute?',
        options: ['Sleep', 'Eat breakfast', 'Read a book or listen to a podcast', 'Call his manager'],
        correctIndex: 2,
        explanation: 'He says he reads a book or listens to an English podcast during the commute.',
      },
    ],
  },
  {
    id: 'lp_job_interview',
    title: 'Preparing for a Job Interview',
    level: 'B1',
    topic: 'Career & Work',
    duration: '1:45',
    passageText:
      'Good communication is crucial during any job interview. Employers look not only for technical knowledge, but also for clear articulation and positive body language. Before entering the room, take three deep breaths to calm your nerves. When answering questions, use the STAR method: describe the Situation, Task, Action you took, and the final Result. Always listen actively to the interviewer without interrupting, and prepare two thoughtful questions to ask at the end.',
    keyVocabulary: [
      { word: 'Articulation', meaning: 'The ability to express thoughts clearly in speech.' },
      { word: 'STAR method', meaning: 'A structured technique to answer behavioral interview questions.' },
      { word: 'Thoughtful', meaning: 'Showing careful consideration and attention.' },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What does the STAR method stand for?',
        options: [
          'Story, Time, Action, Review',
          'Situation, Task, Action, Result',
          'Speaking, Thinking, Answering, Repeating',
          'Standard, Team, Achievement, Reward',
        ],
        correctIndex: 1,
        explanation: 'STAR stands for Situation, Task, Action, and Result.',
      },
      {
        id: 'q2',
        question: 'What should a candidate prepare to do at the end of the interview?',
        options: [
          'Leave immediately',
          'Ask for the salary in cash',
          'Ask two thoughtful questions',
          'Rate the interviewer',
        ],
        correctIndex: 2,
        explanation: 'The passage advises preparing two thoughtful questions to ask at the end.',
      },
    ],
  },
  {
    id: 'lp_coffee_order',
    title: 'At the Downtown Café',
    level: 'A2',
    topic: 'Everyday Situations',
    duration: '1:00',
    passageText:
      'Barista: "Hi there! Welcome to Bean & Leaf. What can I get started for you today?" Customer: "Good morning! Could I please get a medium oat milk cappuccino and a warm croissant?" Barista: "Certainly! Would you like chocolate or almond on that croissant?" Customer: "Almond, please. And could I pay using contactless card?" Barista: "Sure thing. Your total is six pounds fifty. Please tap your card here."',
    keyVocabulary: [
      { word: 'Contactless', meaning: 'Payment using NFC by tapping a card or phone.' },
      { word: 'Certainly', meaning: 'Of course; used to politely confirm an order.' },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What type of milk did the customer order for the cappuccino?',
        options: ['Whole cow milk', 'Oat milk', 'Soy milk', 'Almond milk'],
        correctIndex: 1,
        explanation: 'The customer requested a medium oat milk cappuccino.',
      },
      {
        id: 'q2',
        question: 'How did the customer choose to pay?',
        options: ['Cash', 'Contactless card', 'Bank transfer', 'Gift voucher'],
        correctIndex: 1,
        explanation: 'The customer asked to pay using a contactless card.',
      },
    ],
  },
];
