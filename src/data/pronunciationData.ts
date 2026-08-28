export interface SoundPracticeCategory {
  id: string;
  soundSymbol: string; // e.g. "/θ/"
  soundName: string; // "Voiceless TH"
  category: 'Consonants' | 'Vowels' | 'Diphthongs';
  mouthPositionTip: string;
  words: {
    word: string;
    phonetic: string;
    meaning: string;
    difficulty: 'Easy' | 'Medium' | 'Challenging';
  }[];
  sentencePractice: string;
  tongueTwister: string;
  commonMistake: string;
}

export const PRONUNCIATION_SOUNDS: SoundPracticeCategory[] = [
  {
    id: 'th-unvoiced',
    soundSymbol: '/θ/',
    soundName: 'Voiceless "TH"',
    category: 'Consonants',
    mouthPositionTip: 'Place the tip of your tongue gently between your upper and lower front teeth. Blow air out softly without vibrating your vocal cords.',
    words: [
      { word: 'think', phonetic: '/θɪŋk/', meaning: 'to have a particular opinion or use your mind', difficulty: 'Easy' },
      { word: 'three', phonetic: '/θriː/', meaning: 'the number after two', difficulty: 'Easy' },
      { word: 'thought', phonetic: '/θɔːt/', meaning: 'an idea or past tense of think', difficulty: 'Medium' },
      { word: 'through', phonetic: '/θruː/', meaning: 'moving in one side and out of the other side', difficulty: 'Medium' },
      { word: 'theater', phonetic: '/ˈθiː.ə.tər/', meaning: 'a building for plays or movies', difficulty: 'Medium' },
      { word: 'enthusiastic', phonetic: '/ɪnˌθuː.ziˈæs.tɪk/', meaning: 'showing intense enjoyment and interest', difficulty: 'Challenging' },
    ],
    sentencePractice: 'I think that three healthy authors walked through the theater.',
    tongueTwister: 'Thirty-three thousand thinkers thought throughout Thursday.',
    commonMistake: 'Avoid replacing the /θ/ sound with "t" (e.g. saying "tink" instead of "think") or "s" ("sink").',
  },
  {
    id: 'th-voiced',
    soundSymbol: '/ð/',
    soundName: 'Voiced "TH"',
    category: 'Consonants',
    mouthPositionTip: 'Place the tip of your tongue between your teeth just like unvoiced TH, but vibrate your vocal cords while exhaling.',
    words: [
      { word: 'this', phonetic: '/ðɪs/', meaning: 'referring to a specific thing close by', difficulty: 'Easy' },
      { word: 'that', phonetic: '/ðæt/', meaning: 'referring to a specific thing farther away', difficulty: 'Easy' },
      { word: 'there', phonetic: '/ðer/', meaning: 'in, at, or to that place', difficulty: 'Easy' },
      { word: 'brother', phonetic: '/ˈbrʌð.ər/', meaning: 'a male sibling', difficulty: 'Medium' },
      { word: 'weather', phonetic: '/ˈweð.ər/', meaning: 'atmospheric conditions (sun, rain, wind)', difficulty: 'Medium' },
      { word: 'breathe', phonetic: '/briːð/', meaning: 'to take air into the lungs and expel it', difficulty: 'Challenging' },
    ],
    sentencePractice: 'My brother and mother enjoy this warm weather together.',
    tongueTwister: 'They breathe the fresh northern air with their father and mother.',
    commonMistake: 'Avoid pronouncing /ð/ as a hard "d" (e.g. saying "dis" instead of "this").',
  },
  {
    id: 'r-sound',
    soundSymbol: '/r/',
    soundName: 'English "R"',
    category: 'Consonants',
    mouthPositionTip: 'Curl the sides of your tongue against your upper molars. The tip of your tongue floats near the roof of your mouth without actually touching it.',
    words: [
      { word: 'right', phonetic: '/raɪt/', meaning: 'correct or opposite of left', difficulty: 'Easy' },
      { word: 'around', phonetic: '/əˈraʊnd/', meaning: 'on all sides of or in a circular path', difficulty: 'Easy' },
      { word: 'correct', phonetic: '/kəˈrekt/', meaning: 'free from error; accurate', difficulty: 'Medium' },
      { word: 'restaurant', phonetic: '/ˈres.trɑːnt/', meaning: 'a place where meals are served to customers', difficulty: 'Medium' },
      { word: 'extraordinary', phonetic: '/ɪkˈstrɔːr.dən.er.i/', meaning: 'remarkable; very unusual', difficulty: 'Challenging' },
    ],
    sentencePractice: 'Robert arrived at the crowded restaurant right on time.',
    tongueTwister: 'Red lorry, yellow lorry, rolling rapidly round the ring road.',
    commonMistake: 'Do not roll or trill the tongue against the front teeth like in Spanish or Russian; keep the tip curved back in the middle of the mouth.',
  },
  {
    id: 'l-sound',
    soundSymbol: '/l/',
    soundName: 'Light & Dark "L"',
    category: 'Consonants',
    mouthPositionTip: 'Press the tip of your tongue firmly against the gum ridge behind your upper front teeth. Let the air flow smoothly around the sides.',
    words: [
      { word: 'learn', phonetic: '/lɜːrn/', meaning: 'to gain knowledge or skill', difficulty: 'Easy' },
      { word: 'light', phonetic: '/laɪt/', meaning: 'brightness or not heavy', difficulty: 'Easy' },
      { word: 'listen', phonetic: '/ˈlɪs.ən/', meaning: 'to pay attention to sounds', difficulty: 'Easy' },
      { word: 'fluently', phonetic: '/ˈfluː.ənt.li/', meaning: 'smoothly and effortlessly', difficulty: 'Medium' },
      { word: 'multilingual', phonetic: '/ˌmʌl.tiˈlɪŋ.ɡwəl/', meaning: 'able to speak multiple languages', difficulty: 'Challenging' },
    ],
    sentencePractice: 'Learners listen closely to speak English clearly and fluently.',
    tongueTwister: 'Little Lily loves lovely lemon lollipops in London.',
    commonMistake: 'Avoid confusing /l/ with /r/ (e.g. saying "clect" instead of "correct" or "fright" instead of "flight").',
  },
  {
    id: 'v-vs-w',
    soundSymbol: '/v/ vs /w/',
    soundName: 'V versus W Distinction',
    category: 'Consonants',
    mouthPositionTip: 'For /v/, gently rest your top front teeth on your bottom lip. For /w/, round your lips into a tight circle like making an "oo" sound.',
    words: [
      { word: 'very', phonetic: '/ˈver.i/', meaning: 'to a great degree; extremely', difficulty: 'Easy' },
      { word: 'water', phonetic: '/ˈwɑː.tər/', meaning: 'clear liquid essential for life', difficulty: 'Easy' },
      { word: 'voice', phonetic: '/vɔɪs/', meaning: 'sound produced in the throat', difficulty: 'Easy' },
      { word: 'wonder', phonetic: '/ˈwʌn.dər/', meaning: 'desire to know something', difficulty: 'Medium' },
      { word: 'vocabulary', phonetic: '/voʊˈkæb.jə.ler.i/', meaning: 'the body of words used in a language', difficulty: 'Challenging' },
    ],
    sentencePractice: 'We were very excited to view the vast waterfalls in winter.',
    tongueTwister: 'Victor went to Washington while Wendy visited Venice.',
    commonMistake: 'Do not bite your lip for "W" (keep lips rounded) and do not round your lips for "V" (touch teeth to lip).',
  },
  {
    id: 'sh-vs-ch',
    soundSymbol: '/ʃ/ vs /tʃ/',
    soundName: 'SH (/ʃ/) versus CH (/tʃ/)',
    category: 'Consonants',
    mouthPositionTip: 'SH is continuous smooth air ("shhh"). CH starts with a stop (like a "T") followed immediately by explosive air release.',
    words: [
      { word: 'share', phonetic: '/ʃer/', meaning: 'to give a portion to others', difficulty: 'Easy' },
      { word: 'chair', phonetic: '/tʃer/', meaning: 'a seat with a back for one person', difficulty: 'Easy' },
      { word: 'shopping', phonetic: '/ˈʃɑː.pɪŋ/', meaning: 'purchasing goods from stores', difficulty: 'Medium' },
      { word: 'challenge', phonetic: '/ˈtʃæl.ɪndʒ/', meaning: 'a demanding or stimulating task', difficulty: 'Medium' },
      { word: 'champion', phonetic: '/ˈtʃæm.pi.ən/', meaning: 'winner of a competition', difficulty: 'Challenging' },
    ],
    sentencePractice: 'She chose to share the challenge with her chief teacher.',
    tongueTwister: 'Charlie cheered as Shirley shared shiny cherry chocolates.',
    commonMistake: 'Do not say "shair" for "chair" or "chip" for "ship". Practice feeling the sharp initial tap for CH.',
  },
  {
    id: 'short-i-vs-long-ee',
    soundSymbol: '/ɪ/ vs /iː/',
    soundName: 'Short "I" (/ɪ/) vs Long "EE" (/iː/)',
    category: 'Vowels',
    mouthPositionTip: 'For /iː/ (seat, reach), spread your lips wide into a smile and hold tension. For /ɪ/ (sit, rich), relax your jaw and tongue.',
    words: [
      { word: 'sit', phonetic: '/sɪt/', meaning: 'to rest with the torso upright on a chair', difficulty: 'Easy' },
      { word: 'seat', phonetic: '/siːt/', meaning: 'a piece of furniture designed for sitting', difficulty: 'Easy' },
      { word: 'live', phonetic: '/lɪv/', meaning: 'to reside or be alive', difficulty: 'Easy' },
      { word: 'leave', phonetic: '/liːv/', meaning: 'to depart from a place', difficulty: 'Easy' },
      { word: 'ship', phonetic: '/ʃɪp/', meaning: 'a large vessel traveling on water', difficulty: 'Medium' },
      { word: 'sheep', phonetic: '/ʃiːp/', meaning: 'a woolly animal', difficulty: 'Medium' },
    ],
    sentencePractice: 'Please sit in this comfortable seat before you leave.',
    tongueTwister: 'Sixteen slick sheep slip quickly into deep green streams.',
    commonMistake: 'Saying "leave" when you mean "live" or "sheet" when you mean "shit" (avoid accidental profanity!).',
  },
];

export interface EnglishDialectComparison {
  category: string;
  british: { term: string; phonetic: string; example: string };
  american: { term: string; phonetic: string; example: string };
  internationalNote: string;
}

export const DIALECT_DIFFERENCES: EnglishDialectComparison[] = [
  {
    category: 'Daily Objects & Transport',
    british: { term: 'Lift', phonetic: '/lɪft/', example: 'Take the lift to the fourth floor.' },
    american: { term: 'Elevator', phonetic: '/ˈel.ə.veɪ.tər/', example: 'Take the elevator to the fourth floor.' },
    internationalNote: 'Both terms are universally understood in international hotels and airports worldwide.',
  },
  {
    category: 'Travel & Time Off',
    british: { term: 'Holiday', phonetic: '/ˈhɑː.lə.deɪ/', example: 'I am going on holiday to Spain.' },
    american: { term: 'Vacation', phonetic: '/veɪˈkeɪ.ʃən/', example: 'I am going on vacation to Florida.' },
    internationalNote: 'In American English, "holiday" usually refers specifically to public holidays like Thanksgiving or Christmas.',
  },
  {
    category: 'Apparel & Footwear',
    british: { term: 'Trainers', phonetic: '/ˈtreɪ.nəz/', example: 'I bought new running trainers.' },
    american: { term: 'Sneakers', phonetic: '/ˈsniː.kɚz/', example: 'I bought new running sneakers.' },
    internationalNote: '"Sports shoes" or "running shoes" is a neutral international alternative.',
  },
  {
    category: 'Urban Environment',
    british: { term: 'Pavement', phonetic: '/ˈpeɪv.mənt/', example: 'Walk on the pavement for safety.' },
    american: { term: 'Sidewalk', phonetic: '/ˈsaɪd.wɑːk/', example: 'Walk on the sidewalk for safety.' },
    internationalNote: 'In American English, "pavement" refers to the paved road surface itself.',
  },
  {
    category: 'Spelling Variations',
    british: { term: 'Colour / Flavour / Centre', phonetic: '/ˈkʌl.ər/', example: 'What is your favourite colour?' },
    american: { term: 'Color / Flavor / Center', phonetic: '/ˈkʌl.ɚ/', example: 'What is your favorite color?' },
    internationalNote: 'Both spelling conventions are accepted in international IELTS and TOEFL exams if used consistently.',
  },
];
