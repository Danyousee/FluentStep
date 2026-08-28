import { WritingChallengePrompt } from '../types';

export const WRITING_PROMPTS_DATA: WritingChallengePrompt[] = [
  {
    id: 'wp_a1_family',
    category: 'Daily journal',
    level: 'A1',
    title: 'My Family & Daily Routine',
    promptText: 'Write 4 to 6 simple sentences about your family or household. Mention who lives with you and what they do.',
    suggestedWordCount: '40 - 70 words',
    keyVocabSuggestions: ['family', 'brother', 'sister', 'friendly', 'together', 'evening'],
    guidelinePoints: [
      'Use Present Simple tense (e.g. "My brother works at...", "We eat dinner...")',
      'Check subject-verb agreement (he/she + verb-s)',
      'Use capital letters for "I" and the first word of every sentence',
    ],
  },
  {
    id: 'wp_a2_vacation',
    category: 'Description',
    level: 'A2',
    title: 'A Memorable Holiday or Trip',
    promptText: 'Describe a trip you took in the past. Where did you go, who did you go with, what did you see, and how did you feel?',
    suggestedWordCount: '70 - 110 words',
    keyVocabSuggestions: ['traveled', 'visited', 'scenery', 'delicious', 'memorable', 'enjoyed'],
    guidelinePoints: [
      'Maintain consistent Past Simple tense (went, saw, tasted, stayed)',
      'Use connectors like "First", "Then", "After that", "Because"',
      'Include sensory descriptions (what the weather was like, what food you ate)',
    ],
  },
  {
    id: 'wp_b1_decision',
    category: 'Opinion',
    level: 'B1',
    title: 'A Difficult Decision I Made',
    promptText: 'Describe a challenging choice you had to make in your studies, career, or personal life. What were the options, what did you choose, and what did you learn?',
    suggestedWordCount: '120 - 180 words',
    keyVocabSuggestions: ['decision', 'consequence', 'eventually', 'opportunity', 'weighed the options', 'valuable lesson'],
    guidelinePoints: [
      'Organize your response into 2 or 3 structured paragraphs',
      'Use contrast connectors (However, Although, On the one hand, On the other hand)',
      'Reflect on the long-term impact of your choice',
    ],
  },
  {
    id: 'wp_b2_remote_work',
    category: 'Opinion',
    level: 'B2',
    title: 'Does Technology Improve Education & Remote Collaboration?',
    promptText: 'Discuss whether remote work and digital learning tools enhance productivity or create digital fatigue and isolation. Provide balanced arguments and your reasoned conclusion.',
    suggestedWordCount: '180 - 250 words',
    keyVocabSuggestions: ['productivity', 'flexibility', 'collaboration', 'isolation', 'burnout', 'hybrid model', 'indispensable'],
    guidelinePoints: [
      'Write a formal introduction stating the general topic and thesis',
      'Provide dedicated paragraphs for benefits and drawbacks',
      'Conclude with a clear synthesis and future perspective',
    ],
  },
  {
    id: 'wp_b1_job_email',
    category: 'Job application',
    level: 'B1',
    title: 'Inquiry Email for a Job Opportunity',
    promptText: 'Write a professional email to a hiring manager inquiring about an open position at their company. Highlight your background, enthusiasm, and attached CV.',
    suggestedWordCount: '100 - 150 words',
    keyVocabSuggestions: ['Dear Hiring Manager', 'I am writing to express my interest', 'background in', 'enclosed resume', 'thank you for your time'],
    guidelinePoints: [
      'Include a clear subject line and formal salutation',
      'State the purpose of the email in the opening sentence',
      'Close with a polite call to action and professional sign-off (Sincerely, Best regards)',
    ],
  },
  {
    id: 'wp_c1_formal_complaint',
    category: 'Formal letter',
    level: 'C1',
    title: 'Formal Letter of Complaint to Corporate Headquarters',
    promptText: 'Draft a diplomatic yet firm formal letter addressing an unacceptable service failure by a logistics firm. Detail the financial inconvenience, outline previous failed communications, and demand a specific remedy.',
    suggestedWordCount: '220 - 300 words',
    keyVocabSuggestions: ['unacceptable standard of service', 'incurred substantial delays', 'prompt remediation', 'reimbursement', 'diplomatic resolution'],
    guidelinePoints: [
      'Adopt an elevated, objective, professional register throughout',
      'Avoid emotional outbursts; rely on precise dates, reference numbers, and facts',
      'State a definitive deadline for response',
    ],
  },
];

export const WRITING_PROMPTS = WRITING_PROMPTS_DATA;

