import { UserLevel } from '../types';

export interface ReadingWordDefinition {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  synonyms: string[];
}

export interface ReadingQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'main_idea';
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReadingArticle {
  id: string;
  title: string;
  level: UserLevel;
  category: 'Technology' | 'Education' | 'Travel' | 'Culture' | 'Work' | 'Science' | 'Daily life' | 'Relationships' | 'Business' | 'Interesting stories';
  readTime: string;
  wordCount: number;
  coverEmoji: string;
  summary: string;
  text: string;
  vocabulary: ReadingWordDefinition[];
  questions: ReadingQuestion[];
}

export const READING_ARTICLES: ReadingArticle[] = [
  {
    id: 'a1-daily-routine',
    title: 'A Healthy Morning Routine',
    level: 'A1',
    category: 'Daily life',
    readTime: '2 min',
    wordCount: 110,
    coverEmoji: '☀️',
    summary: 'Discover how simple morning habits like drinking fresh water and eating fruit give you energy for the entire day.',
    text: `Every morning, Maya wakes up at 6:30 AM. First, she drinks a tall glass of clean water. Water wakes up her body and mind. Next, she does light stretching exercises for ten minutes. 

After her exercise, Maya prepares a healthy breakfast. She eats fresh fruit, oatmeal, and a boiled egg. She usually drinks warm tea with a little honey. Maya never skips breakfast because it gives her the necessary energy to study and work. By 8:00 AM, she feels happy, refreshed, and ready to start her busy day.`,
    vocabulary: [
      {
        word: 'stretching',
        pronunciation: '/ˈstretʃ.ɪŋ/',
        partOfSpeech: 'noun',
        meaning: 'exercises where you extend your muscles to improve flexibility',
        example: 'Morning stretching helps prevent muscle stiffness.',
        synonyms: ['flexing', 'limbering up'],
      },
      {
        word: 'skips',
        pronunciation: '/skɪps/',
        partOfSpeech: 'verb',
        meaning: 'decides not to do or eat something that is usual',
        example: 'He never skips his morning workout.',
        synonyms: ['misses', 'omits'],
      },
      {
        word: 'refreshed',
        pronunciation: '/rɪˈfreʃt/',
        partOfSpeech: 'adjective',
        meaning: 'feeling full of new energy and enthusiasm',
        example: 'After a shower, she felt completely refreshed.',
        synonyms: ['reinvigorated', 'energized', 'revitalized'],
      },
      {
        word: 'necessary',
        pronunciation: '/ˈnes.ə.ser.i/',
        partOfSpeech: 'adjective',
        meaning: 'needed in order to achieve a particular result',
        example: 'Good sleep is necessary for good health.',
        synonyms: ['essential', 'required', 'vital'],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the very first thing Maya does after waking up?',
        type: 'multiple_choice',
        options: ['She prepares an oatmeal breakfast', 'She drinks a glass of clean water', 'She checks her smartphone', 'She goes for a run'],
        correctIndex: 1,
        explanation: 'The text states: "First, she drinks a tall glass of clean water."',
      },
      {
        id: 'q2',
        question: 'Why does Maya never skip breakfast?',
        type: 'multiple_choice',
        options: ['Because it gives her energy to study and work', 'Because her doctor ordered it', 'Because she loves cooking big meals', 'Because it takes only two minutes'],
        correctIndex: 0,
        explanation: 'The text specifies: "Maya never skips breakfast because it gives her the necessary energy to study and work."',
      },
      {
        id: 'q3',
        question: 'Maya does stretching exercises for 30 minutes.',
        type: 'true_false',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The text states she stretches for ten minutes.',
      },
    ],
  },
  {
    id: 'a2-lagos-markets',
    title: 'The Vibrant Markets of Lagos',
    level: 'A2',
    category: 'Culture',
    readTime: '3 min',
    wordCount: 155,
    coverEmoji: '🛍️',
    summary: 'Experience the colors, sounds, and friendly bargaining culture of open-air West African markets.',
    text: `Lagos is famous across West Africa for its bustling open-air markets. Markets like Balogun and Lekki Arts Market attract thousands of shoppers every single day. Walking through these markets is a feast for the senses. 

Traders display colorful traditional fabrics called Ankara, hand-carved wooden sculptures, fresh spices, and sweet tropical fruits. The sound of cheerful bargaining fills the air. Bargaining is a normal and friendly part of shopping here; buyers and sellers exchange warm greetings and negotiate a fair price with a smile. Visiting a local market is not only about purchasing goods—it is also a wonderful way to experience authentic community warmth and local craftsmanship.`,
    vocabulary: [
      {
        word: 'bustling',
        pronunciation: '/ˈbʌs.lɪŋ/',
        partOfSpeech: 'adjective',
        meaning: 'full of busy activity and lively people',
        example: 'The market was bustling with excited holiday shoppers.',
        synonyms: ['vibrant', 'lively', 'hectic'],
      },
      {
        word: 'bargaining',
        pronunciation: '/ˈbɑːr.ɡən.ɪŋ/',
        partOfSpeech: 'noun',
        meaning: 'discussing the price of something in order to agree on a lower price',
        example: 'Good bargaining requires patience and a friendly smile.',
        synonyms: ['negotiation', 'haggling'],
      },
      {
        word: 'authentic',
        pronunciation: '/ɔːˈθen.tɪk/',
        partOfSpeech: 'adjective',
        meaning: 'genuine, real, and true to original traditions',
        example: 'We enjoyed an authentic Nigerian meal with jollof rice.',
        synonyms: ['genuine', 'real', 'original'],
      },
      {
        word: 'craftsmanship',
        pronunciation: '/ˈkræfts.mən.ʃɪp/',
        partOfSpeech: 'noun',
        meaning: 'skill in making things by hand with artistic care',
        example: 'The wooden mask demonstrated exquisite craftsmanship.',
        synonyms: ['artistry', 'workmanship', 'skill'],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the main topic of the passage?',
        type: 'main_idea',
        options: ['The history of train travel in Africa', 'The vibrant atmosphere and cultural value of Lagos markets', 'How to manufacture Ankara fabrics', 'The best restaurants in Lagos'],
        correctIndex: 1,
        explanation: 'The passage explores the lively sights, sounds, bargaining culture, and community spirit of Lagos markets.',
      },
      {
        id: 'q2',
        question: 'How is bargaining viewed in these markets according to the text?',
        type: 'multiple_choice',
        options: ['As an angry argument', 'As a normal, friendly, and respectful cultural interaction', 'As strictly forbidden by law', 'As something only tourists do'],
        correctIndex: 1,
        explanation: 'The text notes: "Bargaining is a normal and friendly part of shopping here... with a smile."',
      },
    ],
  },
  {
    id: 'b1-remote-work',
    title: 'The Evolution of Modern Remote Work',
    level: 'B1',
    category: 'Work',
    readTime: '4 min',
    wordCount: 220,
    coverEmoji: '💻',
    summary: 'How digital collaboration tools have transformed international workplaces and asynchronous teamwork.',
    text: `Over the past decade, the global workplace has undergone a remarkable transformation. Driven by high-speed internet and collaborative digital platforms, remote and hybrid working arrangements have transitioned from rare perks into mainstream professional standards.

For employees, the benefits are substantial: eliminating daily commuting stress, enjoying greater geographic mobility, and achieving better work-life balance. Many professionals now work for international tech organizations while living in their home countries, earning competitive salaries and contributing directly to their local economies.

However, remote collaboration also presents distinct hurdles. Asynchronous communication requires higher precision in written English, as team members across time zones rely heavily on clear emails, Slack messages, and project documentation. Furthermore, maintaining team cohesion and preventing burnout demands intentional effort. Forward-thinking companies are now investing in virtual social events and establishing clear boundaries around after-hours communication to sustain productivity without sacrificing well-being.`,
    vocabulary: [
      {
        word: 'transitioned',
        pronunciation: '/trænˈzɪʃ.ənd/',
        partOfSpeech: 'verb',
        meaning: 'changed or shifted smoothly from one state or condition to another',
        example: 'The company transitioned to a remote-first work culture.',
        synonyms: ['shifted', 'evolved', 'converted'],
      },
      {
        word: 'asynchronous',
        pronunciation: '/eɪˈsɪŋ.krə.nəs/',
        partOfSpeech: 'adjective',
        meaning: 'not happening at the same time; communication without immediate live reply',
        example: 'Asynchronous communication lets team members reply in their own time zones.',
        synonyms: ['non-simultaneous', 'time-shifted'],
      },
      {
        word: 'cohesion',
        pronunciation: '/koʊˈhiː.ʒən/',
        partOfSpeech: 'noun',
        meaning: 'the state of being united, connected, and working closely together',
        example: 'Regular team check-ins foster strong social cohesion.',
        synonyms: ['unity', 'solidarity', 'togetherness'],
      },
      {
        word: 'burnout',
        pronunciation: '/ˈbɜːrn.aʊt/',
        partOfSpeech: 'noun',
        meaning: 'state of emotional, physical, and mental exhaustion caused by excessive stress',
        example: 'Setting firm work boundaries prevents employee burnout.',
        synonyms: ['exhaustion', 'fatigue', 'overwork'],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why does asynchronous communication require higher precision in written English?',
        type: 'multiple_choice',
        options: ['Because people across different time zones rely on written messages without immediate verbal clarifications', 'Because computer software rejects misspelled words', 'Because managers only speak one language', 'Because video cameras are banned'],
        correctIndex: 0,
        explanation: 'Asynchronous teams rely on documentation, emails, and chat messages across different time zones, requiring clear written phrasing.',
      },
      {
        id: 'q2',
        question: 'What is one major benefit mentioned for international remote workers?',
        type: 'multiple_choice',
        options: ['Working for global companies while living in their home countries', 'Never having to write emails', 'Getting free computers from governments', 'Working 24 hours every day'],
        correctIndex: 0,
        explanation: 'The text highlights that professionals can work for international companies while staying in their home countries.',
      },
    ],
  },
  {
    id: 'b2-ai-language-learning',
    title: 'How Artificial Intelligence Is Reshaping Language Acquisition',
    level: 'B2',
    category: 'Technology',
    readTime: '4 min',
    wordCount: 260,
    coverEmoji: '🤖',
    summary: 'The shift from passive textbook memorization to personalized, real-time interactive conversational tutoring.',
    text: `For generations, learning a second language followed a predictable and often rigid pedagogical formula: memorizing verb conjugations, reciting dialogues from outdated textbooks, and taking standardized written examinations. While these methods established foundational grammatical awareness, they frequently failed to cultivate spontaneous conversational fluency.

The advent of Large Language Models (LLMs) and conversational AI is fundamentally revolutionizing this landscape. Modern AI tutors provide learners with safe, judgment-free conversational environments where they can practice speaking and writing at any hour of the day. Unlike traditional classroom settings where a single teacher must divide attention among dozens of students, AI systems tailor explanations dynamically to an individual's unique proficiency level, learning pace, and recurring grammatical errors.

Moreover, AI feedback is instantaneous. When a student constructs an awkward sentence, the intelligent system does not simply flag it as incorrect; rather, it unpacks the pragmatic nuance, suggesting more natural, native-sounding alternatives. By bridging the gap between passive comprehension and active production, intelligent AI platforms are democratizing world-class language education across the globe.`,
    vocabulary: [
      {
        word: 'pedagogical',
        pronunciation: '/ˌped.əˈɡɑː.dʒɪ.kəl/',
        partOfSpeech: 'adjective',
        meaning: 'relating to the methods and theory of teaching',
        example: 'The app uses modern pedagogical techniques to accelerate fluency.',
        synonyms: ['educational', 'instructional', 'academic'],
      },
      {
        word: 'spontaneous',
        pronunciation: '/spɑːnˈteɪ.ni.əs/',
        partOfSpeech: 'adjective',
        meaning: 'happening naturally and easily without being planned in advance',
        example: 'He achieved spontaneous conversational fluency after six months.',
        synonyms: ['unrehearsed', 'impromptu', 'natural'],
      },
      {
        word: 'democratizing',
        pronunciation: '/dɪˈmɑː.krə.taɪ.zɪŋ/',
        partOfSpeech: 'verb (gerund)',
        meaning: 'making something accessible and available to everyone',
        example: 'Online mobile tools are democratizing quality education worldwide.',
        synonyms: ['popularizing', 'broadening access to'],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'According to the author, what was a common limitation of traditional textbook learning?',
        type: 'multiple_choice',
        options: ['It was too cheap for universities', 'It often failed to cultivate spontaneous conversational fluency', 'It did not teach any grammar rules', 'It was completely banned in Europe'],
        correctIndex: 1,
        explanation: 'The passage notes that rigid memorization "frequently failed to cultivate spontaneous conversational fluency."',
      },
      {
        id: 'q2',
        question: 'How do conversational AI tutors assist learners differently than a crowded classroom?',
        type: 'multiple_choice',
        options: ['They provide personalized, real-time feedback tailored to individual strengths and mistakes', 'They give students grades that are sent to employers', 'They replace all human conversation permanently', 'They only allow 5 minutes of study per week'],
        correctIndex: 0,
        explanation: 'AI systems adapt explanations dynamically to individual levels and recurring mistakes.',
      },
    ],
  },
  {
    id: 'c1-diplomatic-communication',
    title: 'The Architecture of Diplomatic and Nuanced Discourse',
    level: 'C1',
    category: 'Business',
    readTime: '5 min',
    wordCount: 310,
    coverEmoji: '🏛️',
    summary: 'Mastering the subtle art of linguistic hedging, indirectness, and tactical diplomacy in high-stakes negotiations.',
    text: `Mastery of advanced English extends far beyond grammatical precision and expansive vocabulary; it demands a sophisticated command of pragmatics, tone modulation, and contextual rhetoric. In multilateral diplomacy, international commerce, and executive leadership, the difference between discord and consensus frequently hinges on subtle linguistic choices.

A central hallmark of high-level English discourse is the strategic deployment of linguistic hedging. Rather than asserting unequivocal, confrontational statements such as "Your proposal is flawed," accomplished communicators employ calibrated indirectness: "Perhaps we might reconsider whether the proposed timeline adequately accounts for supply chain contingencies." This softens the assertion, preserves professional goodwill, and creates psychological safety for constructive counter-proposals.

Furthermore, astute professionals leverage modal verbs (might, could, would), passive voice to depersonalize error attribution ("A discrepancy was identified" rather than "You made a calculation error"), and rhetorical questions to guide stakeholders toward collaborative solutions. In an interconnected global economy, linguistic diplomacy is not merely politeness—it is a formidable strategic asset.`,
    vocabulary: [
      {
        word: 'pragmatics',
        pronunciation: '/præɡˈmæt.ɪks/',
        partOfSpeech: 'noun',
        meaning: 'the branch of linguistics dealing with language in use and the contexts in which it is spoken',
        example: 'Understanding cultural pragmatics prevents workplace misunderstandings.',
        synonyms: ['contextual linguistics', 'language etiquette'],
      },
      {
        word: 'hedging',
        pronunciation: '/ˈhedʒ.ɪŋ/',
        partOfSpeech: 'noun',
        meaning: 'words or phrases used to express hesitation or avoid making direct, absolute statements',
        example: 'Using words like "perhaps" and "somewhat" is a classic form of linguistic hedging.',
        synonyms: ['qualification', 'cautious phrasing', 'softening'],
      },
      {
        word: 'unequivocal',
        pronunciation: '/ˌʌn.ɪˈkwɪv.ə.kəl/',
        partOfSpeech: 'adjective',
        meaning: 'leaving no doubt; unambiguous, absolute, and clear',
        example: 'She gave an unequivocal endorsement of the new strategy.',
        synonyms: ['unambiguous', 'unmistakable', 'direct', 'explicit'],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the primary function of "linguistic hedging" in professional discourse?',
        type: 'multiple_choice',
        options: ['To soften blunt statements and foster collaborative goodwill without creating defensiveness', 'To confuse the listener deliberately', 'To lengthen emails to appear busier', 'To hide grammatical mistakes'],
        correctIndex: 0,
        explanation: 'Hedging softens assertions, preserves professional goodwill, and encourages constructive dialogue.',
      },
      {
        id: 'q2',
        question: 'Why might a diplomat use the passive voice when pointing out an error?',
        type: 'multiple_choice',
        options: ['To depersonalize the attribution of the mistake and maintain harmony', 'Because active voice is grammatically incorrect in business', 'To show anger towards the team', 'Because English has no pronouns for mistakes'],
        correctIndex: 0,
        explanation: 'The text explains that passive voice depersonalizes error attribution (e.g., "A discrepancy was identified" rather than blaming someone directly).',
      },
    ],
  },
];
