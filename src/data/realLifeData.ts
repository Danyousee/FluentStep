export interface RealLifeSituation {
  id: string;
  title: string;
  icon: string;
  context: string;
  phrases: {
    text: string;
    meaning: string;
    usageTip: string;
  }[];
  interactivePrompt: string;
  sampleResponse: string;
}

export const REAL_LIFE_SITUATIONS: RealLifeSituation[] = [
  {
    id: 'first_meeting',
    title: 'Meeting Someone for the First Time',
    icon: 'UserPlus',
    context: 'At a networking event, social mixer, or new classroom.',
    phrases: [
      { text: 'Nice to meet you.', meaning: 'Polite greeting when meeting a person for the first time.', usageTip: 'Say with a warm smile and handshake or nod.' },
      { text: 'Where are you from originally?', meaning: 'Polite way to ask someone’s hometown or home country.', usageTip: 'Adds curiosity without sounding intrusive.' },
      { text: 'What do you do for a living?', meaning: 'Asks about someone’s profession or work.', usageTip: 'Standard small talk question at events.' },
      { text: 'How was your day so far?', meaning: 'Casual icebreaker asking about their day.', usageTip: 'Great for chatting with acquaintances or colleagues.' },
      { text: 'What do you like doing in your free time?', meaning: 'Asks about personal hobbies and interests.', usageTip: 'Opens up friendly personal conversations.' },
    ],
    interactivePrompt: 'Someone just walked up to you and said: "Hello! I don’t think we’ve met yet. I’m David." How do you introduce yourself naturally?',
    sampleResponse: 'Hi David, nice to meet you! My name is Yusuf. What brings you to this event today?',
  },
  {
    id: 'coffee_shop',
    title: 'Ordering at a Busy Coffee Shop',
    icon: 'Coffee',
    context: 'Ordering quick drinks and breakfast pastries on the go.',
    phrases: [
      { text: 'Could I get a large latte with oat milk, please?', meaning: 'Polite standard way to order coffee with milk preference.', usageTip: 'Use "Could I get..." instead of "I want...".' },
      { text: 'Is that for here or to go?', meaning: 'Asking if you will drink inside or take it away.', usageTip: 'Answer with "For here, please" or "To go, thanks".' },
      { text: 'Could you warm that up for me?', meaning: 'Requesting a bakery item or pastry to be heated.', usageTip: 'Common when ordering croissants or muffins.' },
      { text: 'Can I pay by card / contactless?', meaning: 'Asking payment method preference.', usageTip: 'Use whenever paying at counters.' },
    ],
    interactivePrompt: 'The barista asks: "Next in line, please! What can I get started for you today?"',
    sampleResponse: 'Hi! Could I get an iced americano and a blueberry muffin to go, please?',
  },
  {
    id: 'clarifying_understanding',
    title: 'Asking for Clarification Politely',
    icon: 'HelpCircle',
    context: 'When you didn’t hear someone or need them to speak slightly slower.',
    phrases: [
      { text: 'Could you please repeat that?', meaning: 'Polite request for repetition.', usageTip: 'Much more polite than saying "What?".' },
      { text: 'Could you speak a little slower, please?', meaning: 'Helpful when someone is speaking too fast for your level.', usageTip: 'English speakers will gladly slow down.' },
      { text: 'What does that word mean?', meaning: 'Asks for an explanation of an unfamiliar term.', usageTip: 'A great habit for active learners.' },
      { text: 'If I understood correctly, you mean... is that right?', meaning: 'Confirms you understood key information.', usageTip: 'Ideal for work or school tasks.' },
    ],
    interactivePrompt: 'A colleague gives instructions very quickly and you missed the last part. How do you ask them to clarify?',
    sampleResponse: 'Excuse me, could you please repeat the last part a little slower? I want to make sure I don\'t miss anything.',
  },
];
