import { SearchResultItem } from '../types';
import { VOCABULARY_LIST } from './vocabularyData';
import { GRAMMAR_TOPICS } from './grammarData';
import { CONVERSATION_SCENARIOS } from './conversationData';
import { SENTENCE_PATTERNS } from './sentencePatternsData';
import { STORIES } from './storyData';
import { READING_ARTICLES } from './readingData';
import { PRONUNCIATION_SOUNDS, DIALECT_DIFFERENCES } from './pronunciationData';
import { COMMON_MISTAKES_DATABASE } from './commonMistakesData';
import { PHRASAL_VERBS } from './phrasalVerbsData';
import { COLLOCATIONS_DATA } from './collocationsData';
import { COMMUNICATION_LESSONS } from './communicationData';

export function getGlobalSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 1. Vocabulary Words
  VOCABULARY_LIST.forEach((word) => {
    items.push({
      id: `word_${word.id}`,
      type: 'word',
      title: word.word,
      subtitle: `${word.partOfSpeech} • ${word.simpleDefinition} (${word.level})`,
      tags: [word.word.toLowerCase(), word.category.toLowerCase(), word.partOfSpeech, ...word.synonyms.map((s) => s.toLowerCase()), word.exampleSentence.toLowerCase()],
      navTarget: { page: 'vocabulary', id: word.id },
    });
  });

  // 2. Sentence Patterns
  SENTENCE_PATTERNS.forEach((sp) => {
    items.push({
      id: `pattern_${sp.id}`,
      type: 'sentence',
      title: sp.pattern,
      subtitle: `${sp.explanation} • Examples: "${sp.examples[0]}" (${sp.level})`,
      tags: [sp.pattern.toLowerCase(), 'pattern', 'sentence pattern', sp.category.toLowerCase(), sp.level.toLowerCase(), ...sp.examples.map((e) => e.toLowerCase())],
      navTarget: { page: 'sentence_patterns', id: sp.id },
    });
  });

  // 3. Phrasal Verbs
  PHRASAL_VERBS.forEach((pv) => {
    items.push({
      id: `phrasal_${pv.id}`,
      type: 'phrasal_verb',
      title: `${pv.verb} ${pv.particles.join(' / ')}`,
      subtitle: `${pv.meaning} • Example: "${pv.example}"`,
      tags: [pv.verb.toLowerCase(), ...pv.particles.map((p) => p.toLowerCase()), 'phrasal verb', pv.meaning.toLowerCase()],
      navTarget: { page: 'phrasal_verbs', id: pv.id },
    });
  });

  // 4. Collocations
  COLLOCATIONS_DATA.forEach((colloc) => {
    items.push({
      id: `colloc_${colloc.id}`,
      type: 'collocation',
      title: colloc.collocation,
      subtitle: `${colloc.meaning} • Example: "${colloc.correctExample}"`,
      tags: [colloc.collocation.toLowerCase(), colloc.verbRoot.toLowerCase(), colloc.category.toLowerCase(), 'collocation', 'natural english'],
      navTarget: { page: 'collocations', id: colloc.id },
    });
  });

  // 5. Common Mistakes
  COMMON_MISTAKES_DATABASE.forEach((cm) => {
    items.push({
      id: `mistake_${cm.id}`,
      type: 'grammar',
      title: `Mistake: "${cm.incorrect}" → Correct: "${cm.correct}"`,
      subtitle: `${cm.why} (${cm.level})`,
      tags: [cm.incorrect.toLowerCase(), cm.correct.toLowerCase(), 'common mistake', 'error', cm.category.toLowerCase()],
      navTarget: { page: 'common_mistakes', id: cm.id },
    });
  });

  // 6. Interactive Stories
  STORIES.forEach((story) => {
    items.push({
      id: `story_${story.id}`,
      type: 'conversation',
      title: `Story: ${story.title}`,
      subtitle: `${story.synopsis} (${story.level} • ${story.estimatedMinutes} mins)`,
      tags: [story.title.toLowerCase(), 'story', 'story mode', story.theme.toLowerCase(), story.level.toLowerCase()],
      navTarget: { page: 'stories', id: story.id },
    });
  });

  // 7. Reading Lab Articles
  READING_ARTICLES.forEach((art) => {
    items.push({
      id: `read_${art.id}`,
      type: 'word',
      title: `Reading: ${art.title}`,
      subtitle: `${art.summary} (${art.level} • ${art.category})`,
      tags: [art.title.toLowerCase(), 'reading', 'article', art.category.toLowerCase(), art.level.toLowerCase()],
      navTarget: { page: 'reading', id: art.id },
    });
  });

  // 8. Pronunciation Sounds & Dialects
  PRONUNCIATION_SOUNDS.forEach((snd) => {
    items.push({
      id: `sound_${snd.id}`,
      type: 'regional',
      title: `Sound: ${snd.soundName} (${snd.soundSymbol})`,
      subtitle: `${snd.mouthPositionTip.slice(0, 75)}...`,
      tags: [snd.soundName.toLowerCase(), snd.soundSymbol.toLowerCase(), 'pronunciation', 'accent', 'phonics'],
      navTarget: { page: 'pronunciation', id: snd.id },
    });
  });

  DIALECT_DIFFERENCES.forEach((dia, idx) => {
    items.push({
      id: `dialect_${idx}`,
      type: 'regional',
      title: `British "${dia.british.term}" vs American "${dia.american.term}"`,
      subtitle: dia.internationalNote,
      tags: [dia.british.term.toLowerCase(), dia.american.term.toLowerCase(), 'british', 'american', 'dialect', 'accent'],
      navTarget: { page: 'pronunciation' },
    });
  });

  // 9. Grammar Topics
  GRAMMAR_TOPICS.forEach((topic) => {
    items.push({
      id: `grammar_${topic.id}`,
      type: 'grammar',
      title: topic.title,
      subtitle: topic.shortDesc,
      tags: [topic.title.toLowerCase(), 'grammar', topic.level.toLowerCase(), topic.summary.toLowerCase()],
      navTarget: { page: 'grammar_lesson', id: topic.id },
    });
  });

  // 10. Conversation Scenarios
  CONVERSATION_SCENARIOS.forEach((scen) => {
    items.push({
      id: `conv_${scen.id}`,
      type: 'conversation',
      title: `Scenario: ${scen.title}`,
      subtitle: `AI Tutor Partner: ${scen.aiPersona.name} (${scen.aiPersona.role}) - ${scen.description}`,
      tags: [scen.title.toLowerCase(), 'conversation', scen.category.toLowerCase(), ...scen.keyPhrases.map((k) => k.toLowerCase())],
      navTarget: { page: 'conversation', id: scen.id },
    });
  });

  // 11. Real-life Communication Lessons
  COMMUNICATION_LESSONS.forEach((comm) => {
    items.push({
      id: `comm_${comm.id}`,
      type: 'communication',
      title: comm.title,
      subtitle: `${comm.goal} (${comm.level} • ${comm.category})`,
      tags: [comm.title.toLowerCase(), 'communication', 'real-life', 'diplomacy', comm.category.toLowerCase()],
      navTarget: { page: 'communication_skills', id: comm.id },
    });
  });

  return items;
}
