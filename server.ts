import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client if key exists
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check & AI status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// 1. AI Personal Tutor Chat (Alex)
app.post("/api/ai/tutor-chat", async (req, res) => {
  try {
    const {
      message,
      conversationHistory = [],
      userLevel = "A1",
      currentLesson = "General English",
      weakAreas = [],
      previousMistakes = [],
      learningGoals = [],
    } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackTutorResponse(message, userLevel, currentLesson));
    }

    const levelGuidance =
      userLevel === "A1" || userLevel === "A2" || userLevel === "Beginner"
        ? "Use simple, clear English. Explain unfamiliar words simply. Avoid heavy technical linguistic terminology. Speak warmly and encouragingly."
        : userLevel === "B1" || userLevel === "B2"
        ? "Use natural conversational expressions, introducing useful phrasal verbs, collocations, and moderate sentence variety."
        : "Use sophisticated vocabulary, discuss nuanced differences between expressions, and provide high-level professional/academic communication advice.";

    const historyPrompt = conversationHistory
      .slice(-6)
      .map((m: { role: string; text: string }) => `${m.role === "user" ? "Student" : "Alex (Tutor)"}: ${m.text}`)
      .join("\n");

    const prompt = `You are Alex, an intelligent, patient, and deeply encouraging AI Personal English Tutor.
User English Level: ${userLevel}
Current Lesson/Context: ${currentLesson}
User Learning Goals: ${Array.isArray(learningGoals) ? learningGoals.join(", ") : "General English fluency"}
Recent Weak Areas: ${Array.isArray(weakAreas) ? weakAreas.slice(0, 3).map((w: any) => typeof w === 'string' ? w : w.topic).join(", ") : "None"}
Recent Mistakes: ${Array.isArray(previousMistakes) ? previousMistakes.slice(0, 3).map((m: any) => m.wrong || m.originalSentence || m).join("; ") : "None"}

Pedagogical Rules:
${levelGuidance}
- The student's message is: "${message}"
- Respond directly in a conversational, helpful teacher tone.
- If the student made a grammar or wording error in their message, gently highlight it with a positive tone, providing the correct form and a simple 1-sentence explanation.
- If they asked a question about grammar, words, or how to say something, give a clear explanation with 2 practical everyday examples.
- Include 2-3 quick suggested follow-up replies the student can click.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "Alex's main response" },
            correction: {
              type: Type.OBJECT,
              description: "Optional gentle correction if student made a mistake",
              properties: {
                hasMistake: { type: Type.BOOLEAN },
                original: { type: Type.STRING },
                better: { type: Type.STRING },
                explanation: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["hasMistake"],
            },
            exampleSentences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "1-2 practical example sentences",
            },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 short follow-up buttons for the student",
            },
            encouragement: { type: Type.STRING, description: "Short motivational praise" },
          },
          required: ["reply", "suggestedReplies"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Tutor chat error:", error);
    return res.json(generateFallbackTutorResponse(req.body.message, req.body.userLevel, req.body.currentLesson));
  }
});

// 2. "Say It Better" Endpoint (4 tiers: Original, Correct, Natural, Professional)
app.post("/api/ai/say-it-better", async (req, res) => {
  try {
    const { sentence, userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackSayItBetter(sentence));
    }

    const prompt = `A ${userLevel} English learner entered this sentence:
"${sentence}"

Please provide 4 versions and actionable explanations:
1. Your Sentence: The exact sentence entered.
2. Correct English: Fix grammatical errors while preserving the original meaning.
3. Natural English: How a fluent native English speaker would casually and naturally say it.
4. Professional English: A formal, polite, workplace/business-appropriate version.
5. Key changes explanation: Clear, bulleted explanation of what changed and why.
6. Practice exercise: Create an interactive exercise (scramble or fill-in-blank) based on the natural sentence.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalSentence: { type: Type.STRING },
            correctEnglish: { type: Type.STRING },
            naturalEnglish: { type: Type.STRING },
            professionalEnglish: { type: Type.STRING },
            keyDifferences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key rules and changes explained clearly",
            },
            summaryTip: { type: Type.STRING, description: "Quick memorable rule of thumb" },
            practiceExercise: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                targetSentence: { type: Type.STRING },
                jumbledWords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                hint: { type: Type.STRING },
              },
              required: ["prompt", "targetSentence", "jumbledWords", "hint"],
            },
          },
          required: [
            "originalSentence",
            "correctEnglish",
            "naturalEnglish",
            "professionalEnglish",
            "keyDifferences",
            "summaryTip",
            "practiceExercise",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Say It Better error:", error);
    return res.json(generateFallbackSayItBetter(req.body.sentence));
  }
});

// 3. "How Do I Say This?" Endpoint
app.post("/api/ai/how-do-i-say-this", async (req, res) => {
  try {
    const { query, context = "general", userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackHowDoISayThis(query));
    }

    const prompt = `An English learner (${userLevel}) is asking:
"How do I say this: ${query}?"
Context: ${context}

Provide 4 clear ways to express this idea in English:
1. Simple: Direct, easy words for beginner learners.
2. Natural: Casual everyday expression used by native speakers.
3. Polite: Courteous phrasing for requests or sensitive situations.
4. Professional: Formal business/workplace phrasing.

For each option, explain when to use it, with pronunciation/stress guide.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tier: { type: Type.STRING, description: "Simple, Natural, Polite, or Professional" },
                  phrase: { type: Type.STRING },
                  whenToUse: { type: Type.STRING },
                  sampleDialogue: { type: Type.STRING },
                },
                required: ["tier", "phrase", "whenToUse"],
              },
            },
            culturalTip: { type: Type.STRING, description: "Cultural or pragmatic nuance tip" },
          },
          required: ["concept", "options", "culturalTip"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI How Do I Say This error:", error);
    return res.json(generateFallbackHowDoISayThis(req.body.query));
  }
});

// 4. Sentence Expansion Engine (Subject + Verb -> + Object -> + Place -> + Time -> + Reason)
app.post("/api/ai/expand-sentence", async (req, res) => {
  try {
    const { baseSubject = "I", baseVerb = "eat", baseObject = "rice" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackSentenceExpansion(baseSubject, baseVerb, baseObject));
    }

    const prompt = `Create a 5-step progressive Sentence Expansion starting from base concept: Subject: "${baseSubject}", Verb: "${baseVerb}", Object: "${baseObject}".
Progressive steps:
Step 1: Subject + Verb (e.g. "I eat.")
Step 2: Subject + Verb + Object (e.g. "I eat rice.")
Step 3: Subject + Verb + Object + Place (e.g. "I eat rice at home.")
Step 4: Subject + Verb + Object + Place + Time (e.g. "I eat rice at home every evening.")
Step 5: Subject + Verb + Object + Place + Time + Reason (e.g. "I eat rice at home every evening because it gives me energy.")

Explain what grammatical part was added in each step.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  structureName: { type: Type.STRING },
                  sentence: { type: Type.STRING },
                  addedComponent: { type: Type.STRING },
                  componentRole: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  colorClass: { type: Type.STRING },
                },
                required: ["stepNumber", "structureName", "sentence", "addedComponent", "componentRole", "explanation"],
              },
            },
          },
          required: ["title", "steps"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Sentence Expansion error:", error);
    return res.json(generateFallbackSentenceExpansion(req.body.baseSubject, req.body.baseVerb, req.body.baseObject));
  }
});

// 5. Sentence Transformation Engine (Positive -> Negative -> Question -> Past -> Future -> WH Question)
app.post("/api/ai/transform-sentence", async (req, res) => {
  try {
    const { baseSentence = "I like football." } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackSentenceTransformation(baseSentence));
    }

    const prompt = `Transform this English sentence into multiple grammatical forms:
Sentence: "${baseSentence}"

Provide:
1. Positive (Original or standardized)
2. Negative (e.g. "I don't like football.")
3. Yes/No Question (e.g. "Do you like football?")
4. Past Tense (e.g. "I liked football.")
5. Future Tense (e.g. "I will like football." or "I am going to play football.")
6. WH-Question (e.g. "What do you like?")

For each, explain the transformation rule clearly (e.g. "Add auxiliary 'do not' before the base verb").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baseSentence: { type: Type.STRING },
            transformations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Positive, Negative, Yes/No Question, Past, Future, or WH-Question" },
                  transformedSentence: { type: Type.STRING },
                  ruleExplanation: { type: Type.STRING },
                  formula: { type: Type.STRING },
                },
                required: ["type", "transformedSentence", "ruleExplanation", "formula"],
              },
            },
          },
          required: ["baseSentence", "transformations"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Sentence Transformation error:", error);
    return res.json(generateFallbackSentenceTransformation(req.body.baseSentence));
  }
});

// 6. Practice My Mistakes (Dynamically generated quiz from user's recorded mistakes)
app.post("/api/ai/practice-mistakes", async (req, res) => {
  try {
    const { mistakes = [], userLevel = "A1" } = req.body;
    const ai = getAI();

    if (!ai || !mistakes.length) {
      return res.json(generateFallbackMistakesPractice(mistakes));
    }

    const prompt = `A ${userLevel} student has made these mistakes in recent practice:
${JSON.stringify(mistakes.slice(0, 8))}

Generate 4 interactive quiz questions that directly help the student practice and overcome these specific mistakes.
Question types:
- Sentence Correction
- Fill-in-the-blank
- Choose the Natural Expression
- Word Reordering`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, description: "correction, fill_blank, multiple_choice, or ordering" },
                  prompt: { type: Type.STRING },
                  contextSentence: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ["id", "type", "prompt", "correctAnswer", "explanation", "category"],
              },
            },
          },
          required: ["title", "summary", "questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Mistakes Practice error:", error);
    return res.json(generateFallbackMistakesPractice(req.body.mistakes));
  }
});

// 7. Listening Practice Generator
app.post("/api/ai/listening-passage", async (req, res) => {
  try {
    const { level = "A1", topic = "Daily Routine" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackListeningPassage(level, topic));
    }

    const prompt = `Generate a high quality English listening practice passage for level ${level} on topic "${topic}".
Include:
1. Title
2. Passage text (clear, natural, realistic monologue or dialogue, 35-70 words for A1/A2, 70-120 words for B1/B2/C1).
3. 3 comprehension questions with 4 options each and clear explanations.
4. Key vocabulary words highlighted.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topic: { type: Type.STRING },
            level: { type: Type.STRING },
            passage: { type: Type.STRING },
            speaker: { type: Type.STRING },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["word", "meaning"],
              },
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
          },
          required: ["title", "passage", "keyVocabulary", "questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Listening passage error:", error);
    return res.json(generateFallbackListeningPassage(req.body.level, req.body.topic));
  }
});

// AI Conversation Endpoint
app.post("/api/ai/conversation", async (req, res) => {
  try {
    const { scenario, messages, userLevel = "A1", topic = "General" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackConversationResponse(scenario, messages, userLevel));
    }

    const conversationHistory = (messages || [])
      .map((m: { role: string; text: string }) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.text}`)
      .join("\n");

    const prompt = `You are Alex, a friendly, patient, and encouraging English tutor for a ${userLevel} level learner.
Topic/Scenario: "${scenario?.title || topic}" - ${scenario?.description || "Everyday friendly conversation"}
Target Goal: ${scenario?.goal || "Practice natural English communication"}

Conversation history so far:
${conversationHistory}

Task:
1. Respond naturally to the student's latest message in a warm, friendly, conversational way (1-3 sentences max).
2. If the student made an important grammar, word choice, or natural phrasing mistake in their latest message, formulate a gentle, encouraging correction (explain simply why, without using overly complex linguistic jargon). If there was no significant mistake, correction should be null.
3. Provide 3 short suggested replies that the student could choose next to keep the conversation flowing.
4. Assess if the student has successfully completed the conversation goal (e.g. exchanged at least 4-5 meaningful turns).

Provide the output strictly in JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiResponse: {
              type: Type.STRING,
              description: "The AI tutor's natural conversational reply (1-3 sentences).",
            },
            correction: {
              type: Type.OBJECT,
              description: "Grammar or phrasing correction if student made a mistake, otherwise null.",
              properties: {
                hasMistake: { type: Type.BOOLEAN },
                original: { type: Type.STRING },
                better: { type: Type.STRING },
                why: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["hasMistake"],
            },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 concise suggested replies for the learner.",
            },
            isGoalCompleted: {
              type: Type.BOOLEAN,
              description: "Whether the practice goal for this scenario has been reached.",
            },
          },
          required: ["aiResponse", "suggestedReplies", "isGoalCompleted"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI conversation error:", error);
    const fallback = generateFallbackConversationResponse(req.body.scenario, req.body.messages, req.body.userLevel);
    return res.json(fallback);
  }
});

// AI Evaluate Sentence / Vocabulary Usage
app.post("/api/ai/evaluate-sentence", async (req, res) => {
  try {
    const { word, sentence, context, userLevel = "A1" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackSentenceEvaluation(word, sentence));
    }

    const prompt = `You are an English language teacher evaluating a sentence written by a ${userLevel} student.
Target word/rule: "${word}"
Student's sentence: "${sentence}"
Context/Task: "${context || "Create a correct sentence using the target word"}"

Evaluate if the sentence is grammatically correct, natural, and uses the target word correctly.
Provide constructive, beginner-friendly feedback.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            score: { type: Type.INTEGER, description: "Score from 0 to 100" },
            feedback: { type: Type.STRING, description: "Friendly encouraging feedback" },
            correctedSentence: { type: Type.STRING, description: "Grammatically corrected sentence" },
            naturalAlternative: { type: Type.STRING, description: "How a native speaker would say it" },
            explanation: { type: Type.STRING, description: "Simple explanation of the rule or mistake" },
            grammarCategory: { type: Type.STRING, description: "e.g. Tense, Prepositions, Word Order, Vocabulary" },
          },
          required: ["isCorrect", "score", "feedback", "correctedSentence", "explanation"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI evaluate error:", error);
    return res.json(generateFallbackSentenceEvaluation(req.body.word, req.body.sentence));
  }
});

// Educational Sentence Feedback Engine (GOOD / IMPROVE / BETTER / WHY / REBUILD / TRY AGAIN / SPEAK)
app.post("/api/ai/evaluate-sentence-educational", async (req, res) => {
  try {
    const { sentence, targetConcept, context, userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai) {
      const tokens = (sentence || "").replace(/[.,?!]/g, "").split(/\s+/).filter(Boolean);
      return res.json({
        success: true,
        data: {
          status: "natural",
          score: 85,
          goodPoints: ["Clear communication of your idea.", "Correct subject and verb placement."],
          priorityImprovement: {
            rule: "Natural sentence flow",
            explanation: "Practice connecting words smoothly.",
          },
          betterVersion: sentence || "I practice English every day.",
          whyExplanation: "Your sentence is communicative and grammatically structured.",
          rebuildTokens: tokens.sort(() => Math.random() - 0.5),
          tryAgainPrompt: "Try writing another sentence adding when or where this happened.",
          speakTargetSentence: sentence || "I practice English every day.",
          pronunciationTip: "Keep your vocal tone relaxed and stress the main action verb.",
        },
      });
    }

    const prompt = `You are an expert, patient English educator evaluating a sentence written by a ${userLevel} student.
Student sentence: "${sentence}"
Target word or concept (if any): "${targetConcept || "General English sentence creation"}"
Context (if any): "${context || "Self-expression practice"}"

Evaluation Rules:
1. Distinguish carefully between:
   - 'incorrect' (has clear grammar/spelling errors)
   - 'unnatural' (grammatically possible but native speakers don't say it this way)
   - 'natural' (fluent, correct, natural)
   - 'more_natural' (a good sentence that has an even crisper alternative)
   - 'formal' / 'casual' / 'professional'
   CRITICAL RULE: Do NOT mark a sentence wrong simply because another version sounds more natural. Clearly distinguish "Correct vs Natural".
2. Good points: Identify 1-2 specific things the learner did right (e.g. good vocabulary choice, correct verb form).
3. Priority Improvement: Identify ONLY the #1 most important problem to fix first. Keep it simple and actionable.
4. Better Version: Provide a clear, natural version of the sentence.
5. Why: Provide a simple, jargon-free 1-2 sentence explanation of the rule.
6. Rebuild tokens: Provide the words of the better version in jumbled order for an interactive rebuild challenge.
7. Try Again Prompt: A concrete prompt asking the learner to write another sentence using this same structure.
8. Speak target: The target sentence to speak aloud.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "incorrect, unnatural, natural, more_natural, formal, casual, or professional",
            },
            score: { type: Type.INTEGER, description: "0-100 score" },
            goodPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "1-2 things the learner did right",
            },
            priorityImprovement: {
              type: Type.OBJECT,
              properties: {
                rule: { type: Type.STRING },
                explanation: { type: Type.STRING },
                mistakeSnippet: { type: Type.STRING },
                correctedSnippet: { type: Type.STRING },
              },
              required: ["rule", "explanation"],
            },
            betterVersion: { type: Type.STRING },
            formalVersion: { type: Type.STRING },
            casualVersion: { type: Type.STRING },
            whyExplanation: { type: Type.STRING },
            rebuildTokens: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tryAgainPrompt: { type: Type.STRING },
            speakTargetSentence: { type: Type.STRING },
            pronunciationTip: { type: Type.STRING },
          },
          required: [
            "status",
            "score",
            "goodPoints",
            "priorityImprovement",
            "betterVersion",
            "whyExplanation",
            "rebuildTokens",
            "tryAgainPrompt",
            "speakTargetSentence",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI educational sentence evaluation error:", error);
    const tokens = (req.body.sentence || "").replace(/[.,?!]/g, "").split(/\s+/).filter(Boolean);
    return res.json({
      success: true,
      data: {
        status: "natural",
        score: 85,
        goodPoints: ["Clear communication of your idea.", "Correct subject and verb placement."],
        priorityImprovement: {
          rule: "Natural sentence flow",
          explanation: "Practice connecting words smoothly.",
        },
        betterVersion: req.body.sentence || "I practice English every day.",
        whyExplanation: "Your sentence is communicative and grammatically structured.",
        rebuildTokens: tokens.sort(() => Math.random() - 0.5),
        tryAgainPrompt: "Try writing another sentence adding when or where this happened.",
        speakTargetSentence: req.body.sentence || "I practice English every day.",
        pronunciationTip: "Keep your vocal tone relaxed and stress the main action verb.",
      },
    });
  }
});

// Complete 10-Step Sentence Learning Loop Generator
app.post("/api/ai/complete-sentence-loop", async (req, res) => {
  try {
    const { topicOrWord = "discuss", userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        success: true,
        data: {
          targetWordOrTopic: topicOrWord,
          cefrLevel: userLevel,
          formula: "Subject + Verb + Object + Place + Time",
          learn: {
            sentence: `I discuss the project with my team every morning.`,
            meaning: `Expressing a regular collaborative discussion with coworkers.`,
            breakdown: [
              { component: "I", role: "Subject", roleExplanation: "The person performing the action." },
              { component: "discuss", role: "Verb", roleExplanation: "No preposition after 'discuss'!" },
              { component: "the project", role: "Object", roleExplanation: "The topic being discussed." },
              { component: "with my team", role: "Partner/Party", roleExplanation: "The people involved." },
              { component: "every morning", role: "Time", roleExplanation: "Frequency of the habit." },
            ],
          },
          build: {
            prompt: `Assemble the words to form a correct sentence with "${topicOrWord}":`,
            targetSentence: `I discuss the project with my team every morning.`,
            jumbledTokens: ["morning.", "discuss", "team", "the", "every", "with", "I", "my", "project"],
            hint: `Remember: 'discuss' takes an object directly without 'about'.`,
          },
          explain: {
            coreRule: `In English, we say 'discuss something' NOT 'discuss about something'.`,
            commonMistake: `Saying 'I discussed about the plan' is incorrect. Use 'I discussed the plan'.`,
            whyItWorks: `'Discuss' is a transitive verb that directly links to its object.`,
          },
          rebuild: {
            prompt: "Rebuild the sentence from memory:",
            targetSentence: `I discuss the project with my team every morning.`,
            jumbledTokens: ["team", "every", "project", "discuss", "morning.", "my", "I", "with", "the"],
          },
          expand: {
            layers: [
              { layerNumber: 1, name: "Subject + Verb", sentence: "I discuss.", addedPart: "I discuss", role: "Core" },
              { layerNumber: 2, name: "+ Object", sentence: "I discuss the project.", addedPart: "the project", role: "Direct Object" },
              { layerNumber: 3, name: "+ People", sentence: "I discuss the project with my team.", addedPart: "with my team", role: "Comitative" },
              { layerNumber: 4, name: "+ Time", sentence: "I discuss the project with my team every morning.", addedPart: "every morning", role: "Time Marker" },
              { layerNumber: 5, name: "+ Place", sentence: "I discuss the project with my team in the office every morning.", addedPart: "in the office", role: "Location" },
              { layerNumber: 6, name: "+ Reason", sentence: "I discuss the project with my team in the office every morning to align our goals.", addedPart: "to align our goals", role: "Purpose" },
              { layerNumber: 7, name: "+ Frequency", sentence: "I always discuss the project with my team in the office every morning to align our goals.", addedPart: "always", role: "Adverb" },
              { layerNumber: 8, name: "+ Condition", sentence: "If questions arise, I always discuss the project with my team in the office to align our goals.", addedPart: "If questions arise", role: "Conditional" },
              { layerNumber: 9, name: "+ Opinion", sentence: "Personally, if questions arise, I always discuss the project with my team to align our goals.", addedPart: "Personally", role: "Stance" },
              { layerNumber: 10, name: "+ Complex Link", sentence: "Personally, if questions arise, I always discuss the project with my team because transparency creates trust.", addedPart: "because transparency creates trust", role: "Causal" },
            ],
          },
          transform: {
            baseSentence: "I discuss the project with my team.",
            transformations: [
              { type: "Negative", sentence: "I don't discuss the project with my team.", rule: "Add 'do not' before base verb", formula: "Subject + do not + Verb" },
              { type: "Question", sentence: "Do you discuss the project with your team?", rule: "Begin with auxiliary 'Do'", formula: "Do + Subject + Verb + ?" },
              { type: "Past Simple", sentence: "I discussed the project with my team yesterday.", rule: "Use regular past '-ed'", formula: "Subject + Verb-ed + Past Time" },
              { type: "Future Tense", sentence: "I will discuss the project with my team tomorrow.", rule: "Use modal 'will'", formula: "Subject + will + Verb" },
              { type: "Continuous", sentence: "I am discussing the project with my team right now.", rule: "Use 'am + verb-ing'", formula: "Subject + be + Verb-ing" },
              { type: "Polite Request", sentence: "Could we discuss the project together?", rule: "Use 'Could we + verb'", formula: "Could + Subject + Verb + ?" },
            ],
          },
          create: {
            prompt: `Write your own original sentence using "${topicOrWord}".`,
            context: "Think about your daily work, study, or family discussions.",
            suggestedStarters: ["We need to discuss...", "Yesterday I discussed...", "I usually discuss..."],
          },
          speak: {
            sentence: `I discuss the project with my team every morning.`,
            stressPattern: `I dis-CUSS the PRO-ject with my TEAM EV-ery MORN-ing.`,
            phoneticTip: `Stress the second syllable of 'dis-CUSS' and the first syllable of 'PRO-ject'.`,
          },
          conversation: {
            aiOpener: `What is an important topic you recently discussed with a friend or colleague?`,
            contextDescription: `Alex wants to practice discussing real topics naturally.`,
            suggestedResponses: [
              "We discussed our upcoming travel plans.",
              "I discussed a new project deadline with my manager.",
              "We discussed how to improve our daily English speaking habits.",
            ],
          },
          review: {
            takeawayCard: `Rule of Thumb: Do NOT say 'discuss about'. Say 'discuss the issue'.`,
            quizQuestion: {
              question: `Which sentence is 100% correct and natural?`,
              options: [
                "We discussed about the new plan yesterday.",
                "We discussed the new plan yesterday.",
                "We discussed on the new plan yesterday.",
                "We were discussed the new plan yesterday.",
              ],
              correctIndex: 1,
              explanation: `'Discuss' takes a direct object without the preposition 'about'.`,
            },
          },
        },
      });
    }

    const prompt = `Generate a complete 10-Stage English Sentence Learning Loop for a ${userLevel} student.
Target word or grammar pattern: "${topicOrWord}"

Pedagogical Loop Stages:
1. Learn: Target natural sentence, clear meaning, component-by-component grammatical breakdown.
2. Build: Interactive scrambled word puzzle with hint.
3. Explain: Clear, simple explanation of why this structure works and the #1 common trap to avoid.
4. Rebuild: Jumbled tokens of the sentence for recall practice.
5. Expand: 10 progressive layers:
   Layer 1: Subject + Verb
   Layer 2: + Object
   Layer 3: + Place / Partner
   Layer 4: + Time
   Layer 5: + Frequency
   Layer 6: + Reason / Purpose
   Layer 7: + Description (Adjectives/Adverbs)
   Layer 8: + Condition (If / When)
   Layer 9: + Opinion (Personally / In my view)
   Layer 10: + Complex Connection (Because / Although)
6. Transform: 6 grammatical variations (Negative, Question, Past, Future, Continuous, Polite Modal).
7. Create: Contextual prompt asking student to write their own original sentence with 3 sentence starters.
8. Speak: Target sentence with stress pattern and clear pronunciation tip.
9. Conversation: AI conversational follow-up question and 3 suggested replies.
10. Review: Memorable takeaway rule and a 4-option quiz question with explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetWordOrTopic: { type: Type.STRING },
            cefrLevel: { type: Type.STRING },
            formula: { type: Type.STRING },
            learn: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING },
                meaning: { type: Type.STRING },
                breakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      component: { type: Type.STRING },
                      role: { type: Type.STRING },
                      roleExplanation: { type: Type.STRING },
                    },
                    required: ["component", "role", "roleExplanation"],
                  },
                },
              },
              required: ["sentence", "meaning", "breakdown"],
            },
            build: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                targetSentence: { type: Type.STRING },
                jumbledTokens: { type: Type.ARRAY, items: { type: Type.STRING } },
                hint: { type: Type.STRING },
              },
              required: ["prompt", "targetSentence", "jumbledTokens", "hint"],
            },
            explain: {
              type: Type.OBJECT,
              properties: {
                coreRule: { type: Type.STRING },
                commonMistake: { type: Type.STRING },
                whyItWorks: { type: Type.STRING },
              },
              required: ["coreRule", "commonMistake", "whyItWorks"],
            },
            rebuild: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                targetSentence: { type: Type.STRING },
                jumbledTokens: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["prompt", "targetSentence", "jumbledTokens"],
            },
            expand: {
              type: Type.OBJECT,
              properties: {
                layers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      layerNumber: { type: Type.INTEGER },
                      name: { type: Type.STRING },
                      sentence: { type: Type.STRING },
                      addedPart: { type: Type.STRING },
                      role: { type: Type.STRING },
                    },
                    required: ["layerNumber", "name", "sentence", "addedPart", "role"],
                  },
                },
              },
              required: ["layers"],
            },
            transform: {
              type: Type.OBJECT,
              properties: {
                baseSentence: { type: Type.STRING },
                transformations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      sentence: { type: Type.STRING },
                      rule: { type: Type.STRING },
                      formula: { type: Type.STRING },
                    },
                    required: ["type", "sentence", "rule", "formula"],
                  },
                },
              },
              required: ["baseSentence", "transformations"],
            },
            create: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                context: { type: Type.STRING },
                suggestedStarters: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["prompt", "context", "suggestedStarters"],
            },
            speak: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING },
                stressPattern: { type: Type.STRING },
                phoneticTip: { type: Type.STRING },
              },
              required: ["sentence", "stressPattern", "phoneticTip"],
            },
            conversation: {
              type: Type.OBJECT,
              properties: {
                aiOpener: { type: Type.STRING },
                contextDescription: { type: Type.STRING },
                suggestedResponses: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["aiOpener", "contextDescription", "suggestedResponses"],
            },
            review: {
              type: Type.OBJECT,
              properties: {
                takeawayCard: { type: Type.STRING },
                quizQuestion: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ["question", "options", "correctIndex", "explanation"],
                },
              },
              required: ["takeawayCard", "quizQuestion"],
            },
          },
          required: [
            "targetWordOrTopic",
            "cefrLevel",
            "formula",
            "learn",
            "build",
            "explain",
            "rebuild",
            "expand",
            "transform",
            "create",
            "speak",
            "conversation",
            "review",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Complete Sentence Loop error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// "Make My English Natural" Endpoint
app.post("/api/ai/naturalize", async (req, res) => {
  try {
    const { text, userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackNaturalize(text));
    }

    const prompt = `A student (${userLevel}) typed this English text:
"${text}"

Please analyze and return:
1. Exact grammatical correction if needed.
2. A much more natural, native-sounding phrasing.
3. Simple, non-academic explanation of the changes and rules.
4. Key rules (bullet points).
5. A similar example sentence demonstrating the same pattern.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            correctEnglish: { type: Type.STRING },
            moreNatural: { type: Type.STRING },
            explanation: { type: Type.STRING },
            rules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            example: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["original", "correctEnglish", "moreNatural", "explanation", "rules", "example"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI naturalize error:", error);
    return res.json(generateFallbackNaturalize(req.body.text));
  }
});

// AI Speaking Practice Evaluation
app.post("/api/ai/speaking-feedback", async (req, res) => {
  try {
    const { spokenText, promptText, situation, userLevel = "A1" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackSpeakingFeedback(spokenText, promptText));
    }

    const prompt = `Evaluate the spoken English response from a ${userLevel} student.
Context / Scenario: "${situation || "Speaking Practice"}"
Prompt/Question: "${promptText || "Say something natural in this situation"}"
Student's spoken transcription: "${spokenText}"

Provide:
1. Accuracy score (0-100)
2. Fluency score (0-100)
3. Encouraging verbal feedback
4. Corrected sentence
5. More natural alternative
6. Pronunciation tips for key tricky words in their sentence`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracyScore: { type: Type.INTEGER },
            fluencyScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            correctedSentence: { type: Type.STRING },
            moreNatural: { type: Type.STRING },
            pronunciationTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ["word", "tip"],
              },
            },
          },
          required: ["accuracyScore", "fluencyScore", "feedback", "correctedSentence", "moreNatural"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI speaking evaluation error:", error);
    return res.json(generateFallbackSpeakingFeedback(req.body.spokenText, req.body.promptText));
  }
});

// AI Writing Coach Endpoint
app.post("/api/ai/writing-coach", async (req, res) => {
  try {
    const { text, writingType = "email", userLevel = "B1" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackWritingCoach(text, writingType));
    }

    const prompt = `You are an expert AI English Writing Coach analyzing a student's submission.
Student Level: ${userLevel}
Writing Type: ${writingType} (e.g. Message, Email, Essay, Story, Job Application, Professional)
User's Original Text:
"${text}"

Analyze thoroughly and provide:
1. Original text.
2. Corrected Version (fixes grammar and spelling while preserving exact meaning).
3. Natural Version (casual, native-sounding phrasing).
4. Professional / Formal Version (polished, diplomatic, business-ready).
5. Grammar Analysis: Specific errors identified and clear, simple explanations.
6. Vocabulary Analysis: Better word choice suggestions.
7. Structure & Organization: Feedback on sentence variety and flow.
8. Overall Writing Score (0-100).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: { type: Type.STRING },
            correctedVersion: { type: Type.STRING },
            naturalVersion: { type: Type.STRING },
            professionalVersion: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            grammarScore: { type: Type.INTEGER },
            vocabularyScore: { type: Type.INTEGER },
            clarityScore: { type: Type.INTEGER },
            explanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  originalSegment: { type: Type.STRING },
                  improvedSegment: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["category", "originalSegment", "improvedSegment", "reason"],
              },
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            areasForImprovement: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "originalText",
            "correctedVersion",
            "naturalVersion",
            "professionalVersion",
            "overallScore",
            "grammarScore",
            "vocabularyScore",
            "clarityScore",
            "explanations",
            "keyStrengths",
            "areasForImprovement",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI writing coach error:", error);
    return res.json(generateFallbackWritingCoach(req.body.text, req.body.writingType));
  }
});

// AI Sentence Pattern Evaluation Endpoint
app.post("/api/ai/evaluate-sentence-pattern", async (req, res) => {
  try {
    const { pattern, sentence, userLevel = "A1" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackPatternEvaluation(pattern, sentence));
    }

    const prompt = `A ${userLevel} student constructed this sentence using the target pattern "${pattern}":
Student's sentence: "${sentence}"

Evaluate whether:
1. The student correctly applied the grammatical pattern.
2. The sentence is grammatically correct and natural.
3. Provide constructive feedback, natural alternative, and a follow-up expansion suggestion.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            correctedSentence: { type: Type.STRING },
            naturalAlternative: { type: Type.STRING },
            explanation: { type: Type.STRING },
            expandedSuggestion: { type: Type.STRING },
          },
          required: ["isValid", "score", "feedback", "correctedSentence", "naturalAlternative", "explanation"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI pattern evaluation error:", error);
    return res.json(generateFallbackPatternEvaluation(req.body.pattern, req.body.sentence));
  }
});

// AI Post-Conversation Evaluation & Assessment Endpoint
app.post("/api/ai/conversation-assessment", async (req, res) => {
  try {
    const { scenarioTitle, messages, userLevel = "A1" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackConversationAssessment(scenarioTitle, messages));
    }

    const history = (messages || [])
      .map((m: any) => `${m.sender === "user" ? "Student" : "Partner"}: ${m.text}`)
      .join("\n");

    const prompt = `Evaluate the completed English dialogue between a ${userLevel} student and their conversation partner.
Scenario: "${scenarioTitle}"
Dialogue history:
${history}

Provide comprehensive performance metrics (clearly indicating estimated nature for AI calculated scores):
1. Communication Score (0-100)
2. Grammar Score (0-100)
3. Vocabulary Score (0-100)
4. Naturalness Score (0-100)
5. Confidence/Fluency Estimate (0-100)
6. Summary of strengths and areas to practice.
7. 2-3 key vocabulary or expressions used well.
8. 1-2 personalized mistake reviews.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            communicationScore: { type: Type.INTEGER },
            grammarScore: { type: Type.INTEGER },
            vocabularyScore: { type: Type.INTEGER },
            naturalnessScore: { type: Type.INTEGER },
            fluencyEstimate: { type: Type.INTEGER },
            overallFeedback: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            highlightedPhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "communicationScore",
            "grammarScore",
            "vocabularyScore",
            "naturalnessScore",
            "fluencyEstimate",
            "overallFeedback",
            "strengths",
            "areasToImprove",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI conversation assessment error:", error);
    return res.json(generateFallbackConversationAssessment(req.body.scenarioTitle, req.body.messages));
  }
});

// 1. AI Personalized Learning Roadmap Endpoint
app.post("/api/ai/generate-roadmap", async (req, res) => {
  try {
    const { userLevel = "A1", goals = [], weakAreas = [] } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackRoadmapResponse(userLevel, goals, weakAreas));
    }

    const prompt = `You are a Senior English Curriculum Architect. Create a personalized 30-Day English Roadmap for a learner at ${userLevel} level.
User goals: ${goals.join(", ") || "Speak confidently, everyday communication"}
Recent weak areas / mistakes: ${weakAreas.join(", ") || "Past tense, prepositions"}

Design a comprehensive 4-week structured roadmap (7 days per week, days 1 to 28-30).
For each day include: dayNumber, title, summary, xpReward (30-50), tasks array.
Include diverse task types: 'vocab', 'grammar', 'sentence', 'speaking', 'conversation', 'listening', 'reading', 'writing', 'mission', 'review'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            targetLevel: { type: Type.STRING },
            adaptiveNotes: { type: Type.STRING },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  focusSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  days: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dayNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                        xpReward: { type: Type.INTEGER },
                        tasks: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              title: { type: Type.STRING },
                              type: { type: Type.STRING },
                              description: { type: Type.STRING },
                              targetNav: {
                                type: Type.OBJECT,
                                properties: {
                                  page: { type: Type.STRING },
                                  id: { type: Type.STRING },
                                },
                                required: ["page"],
                              },
                              completed: { type: Type.BOOLEAN },
                            },
                            required: ["id", "title", "type", "description", "targetNav", "completed"],
                          },
                        },
                      },
                      required: ["dayNumber", "title", "summary", "completed", "xpReward", "tasks"],
                    },
                  },
                },
                required: ["weekNumber", "title", "theme", "focusSkills", "days"],
              },
            },
          },
          required: ["planTitle", "targetLevel", "adaptiveNotes", "weeks"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Roadmap error:", error);
    return res.json(generateFallbackRoadmapResponse(req.body.userLevel, req.body.goals, req.body.weakAreas));
  }
});

// 2. AI Fluency Mode Non-Interrupting Analysis Endpoint
app.post("/api/ai/fluency-analysis", async (req, res) => {
  try {
    const { transcript, topic, durationSeconds, userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai || !transcript || transcript.trim().length < 5) {
      return res.json(generateFallbackFluencyAnalysis(transcript, topic, durationSeconds));
    }

    const prompt = `A ${userLevel} student spoke continuously for ${durationSeconds} seconds on the topic: "${topic}".
Spoken transcript:
"${transcript}"

Evaluate the full speech objectively:
1. Grammar Score % (0-100)
2. Vocabulary Score % (0-100)
3. Sentence Variety Score % (0-100)
4. Naturalness Score % (0-100)
5. Pronunciation AI Estimate % (0-100)
6. Overall Fluency Score % (0-100)
7. What You Did Well (3 specific encouraging bullet points)
8. Common Mistakes: Array of { mistake, correction, explanation }
9. Better Expressions: Array of { original, better, reason } (e.g. "I very like" -> "I really enjoy")
10. Key Vocabulary Used (good words the student used)
11. Constructive feedback summary (2-3 sentences).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grammarScore: { type: Type.INTEGER },
            vocabularyScore: { type: Type.INTEGER },
            sentenceVarietyScore: { type: Type.INTEGER },
            naturalnessScore: { type: Type.INTEGER },
            pronunciationScore: { type: Type.INTEGER },
            overallFluencyScore: { type: Type.INTEGER },
            whatYouDidWell: { type: Type.ARRAY, items: { type: Type.STRING } },
            commonMistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mistake: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["mistake", "correction", "explanation"],
              },
            },
            betterExpressions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  better: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["original", "better", "reason"],
              },
            },
            keyVocabularyUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedbackSummary: { type: Type.STRING },
          },
          required: [
            "grammarScore",
            "vocabularyScore",
            "sentenceVarietyScore",
            "naturalnessScore",
            "pronunciationScore",
            "overallFluencyScore",
            "whatYouDidWell",
            "commonMistakes",
            "betterExpressions",
            "keyVocabularyUsed",
            "feedbackSummary",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Fluency error:", error);
    return res.json(generateFallbackFluencyAnalysis(req.body.transcript, req.body.topic, req.body.durationSeconds));
  }
});

// 3. AI "English For My Life" Curriculum Generator Endpoint
app.post("/api/ai/life-curriculum", async (req, res) => {
  try {
    const { userGoalText, userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai || !userGoalText) {
      return res.json(generateFallbackLifeCurriculum(userGoalText, userLevel));
    }

    const prompt = `A ${userLevel} student has a specific real-life goal: "${userGoalText}".
Create a tailored, high-impact mini-curriculum including:
1. goalTitle (concise, inspiring)
2. 5 target vocabulary words with simple definitions and contextual example sentences
3. 5 essential useful phrases with "whenToUse" guidance
4. 3 common questions with ideal native-sounding answers and strategic tips
5. 3 reusable sentence patterns with examples
6. 1 grammar focus point with clear rule and example
7. 1 spontaneous speaking practice prompt
8. 1 mock interactive scenario setup (title, partnerRole, situation, openingMessage).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goalTitle: { type: Type.STRING },
            userIntent: { type: Type.STRING },
            level: { type: Type.STRING },
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ["word", "meaning", "example"],
              },
            },
            usefulPhrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  whenToUse: { type: Type.STRING },
                },
                required: ["phrase", "whenToUse"],
              },
            },
            commonQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  goodAnswer: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ["question", "goodAnswer", "tip"],
              },
            },
            sentencePatterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pattern: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ["pattern", "example"],
              },
            },
            grammarFocus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  rule: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ["topic", "rule", "example"],
              },
            },
            speakingPrompt: { type: Type.STRING },
            mockScenario: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                partnerRole: { type: Type.STRING },
                situation: { type: Type.STRING },
                openingMessage: { type: Type.STRING },
              },
              required: ["title", "partnerRole", "situation", "openingMessage"],
            },
          },
          required: [
            "goalTitle",
            "userIntent",
            "level",
            "vocabulary",
            "usefulPhrases",
            "commonQuestions",
            "sentencePatterns",
            "grammarFocus",
            "speakingPrompt",
            "mockScenario",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Life Curriculum error:", error);
    return res.json(generateFallbackLifeCurriculum(req.body.userGoalText, req.body.userLevel));
  }
});

// 4. AI Voice Journal Multi-Tier Analysis Endpoint
app.post("/api/ai/voice-journal-analysis", async (req, res) => {
  try {
    const { transcript, title = "Daily Reflection", userLevel = "A2" } = req.body;
    const ai = getAI();

    if (!ai || !transcript) {
      return res.json(generateFallbackVoiceJournalAnalysis(transcript, title));
    }

    const prompt = `A ${userLevel} student recorded this spoken voice journal:
Title: "${title}"
Spoken transcription:
"${transcript}"

Provide:
1. originalTranscript
2. correctedVersion (fixes grammatical errors while keeping the user's authentic voice)
3. naturalVersion (smooth, native-sounding phrasing)
4. 3 suggestedVocabulary upgrade words that the student could use next time
5. grammarScore (0-100)
6. fluencyScore (0-100)
7. Encouraging feedback note from the coach.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalTranscript: { type: Type.STRING },
            correctedVersion: { type: Type.STRING },
            naturalVersion: { type: Type.STRING },
            suggestedVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  context: { type: Type.STRING },
                },
                required: ["word", "meaning", "context"],
              },
            },
            grammarScore: { type: Type.INTEGER },
            fluencyScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ["originalTranscript", "correctedVersion", "naturalVersion", "suggestedVocabulary", "grammarScore", "fluencyScore", "feedback"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Voice Journal error:", error);
    return res.json(generateFallbackVoiceJournalAnalysis(req.body.transcript, req.body.title));
  }
});

// 5. AI Phone Call Simulator Interaction Endpoint
app.post("/api/ai/phone-call-reply", async (req, res) => {
  try {
    const { scenario, messages = [], userSpokenText = "" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackPhoneCallReply(scenario, messages, userSpokenText));
    }

    const conversationHistory = (messages || [])
      .map((m: any) => `${m.speaker === "user" ? "Caller (Student)" : "Receiver (AI)"}: ${m.text}`)
      .join("\n");

    const prompt = `You are playing the role of ${scenario?.callerName || "Customer Support"} (${scenario?.callerRole || "Agent"}) in a telephone call.
Scenario Objective: "${scenario?.objective || "Handle customer phone request"}"
Conversation history:
${conversationHistory}
Latest thing the caller just said over the phone:
"${userSpokenText}"

Respond realistically as the other person on the phone call:
1. Speak naturally and concisely (1-2 sentences, suitable for speech synthesis).
2. Answer the caller's request, ask clarifying questions if needed.
3. Suggest 3 helpful quick phrases the caller might want to say next (e.g. asking to repeat, confirming, giving details).
4. Evaluate if the call objective is completed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: { type: Type.STRING },
            suggestedReplies: { type: Type.ARRAY, items: { type: Type.STRING } },
            isCallFinished: { type: Type.BOOLEAN },
            coachTip: { type: Type.STRING },
          },
          required: ["replyText", "suggestedReplies", "isCallFinished"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Phone Call error:", error);
    return res.json(generateFallbackPhoneCallReply(req.body.scenario, req.body.messages, req.body.userSpokenText));
  }
});

// 6. "Sound Natural" Trainer Evaluation Endpoint
app.post("/api/ai/sound-natural-evaluate", async (req, res) => {
  try {
    const { inputSentence } = req.body;
    const ai = getAI();

    if (!ai || !inputSentence) {
      return res.json(generateFallbackSoundNaturalEvaluation(inputSentence));
    }

    const prompt = `Analyze this English sentence to determine how natural it sounds to native speakers:
Sentence: "${inputSentence}"

Provide:
1. original sentence
2. status: "Unnatural" | "Understandable" | "Natural" | "Very Natural"
3. score (0-100)
4. whyExplanation (clear reason why native speakers say it differently)
5. naturalAlternatives (3 natural, native-level ways to say the exact same concept)
6. ruleTip (short takeaway rule)
7. practiceExercise (a multiple-choice exercise to test the natural phrasing).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            status: { type: Type.STRING },
            score: { type: Type.INTEGER },
            whyExplanation: { type: Type.STRING },
            naturalAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            ruleTip: { type: Type.STRING },
            practiceExercise: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["prompt", "options", "correctIndex", "explanation"],
            },
          },
          required: ["original", "status", "score", "whyExplanation", "naturalAlternatives", "ruleTip"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Sound Natural error:", error);
    return res.json(generateFallbackSoundNaturalEvaluation(req.body.inputSentence));
  }
});

// 7. Mission Mode Step-by-Step Interaction Endpoint
app.post("/api/ai/mission-turn", async (req, res) => {
  try {
    const { mission, messages = [], userMessage = "" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackMissionTurn(mission, messages, userMessage));
    }

    const history = (messages || [])
      .map((m: any) => `${m.sender === "user" ? "Student" : mission?.aiCharacter?.name || "Character"}: ${m.text}`)
      .join("\n");

    const prompt = `You are roleplaying as ${mission?.aiCharacter?.name} (${mission?.aiCharacter?.role}) in a real-life English learning mission:
Mission: "${mission?.title}"
Goal: "${mission?.goal}"
History:
${history}
Student said: "${userMessage}"

Respond naturally in character:
1. Provide a realistic response (1-2 sentences).
2. If student made a notable error, provide gentle correction.
3. Provide 3 suggested replies.
4. Check if checklist goals are completed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiResponse: { type: Type.STRING },
            correction: {
              type: Type.OBJECT,
              properties: {
                hasMistake: { type: Type.BOOLEAN },
                original: { type: Type.STRING },
                better: { type: Type.STRING },
                why: { type: Type.STRING },
              },
              required: ["hasMistake"],
            },
            suggestedReplies: { type: Type.ARRAY, items: { type: Type.STRING } },
            isMissionComplete: { type: Type.BOOLEAN },
            completedChecklistItems: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["aiResponse", "suggestedReplies", "isMissionComplete"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Mission Turn error:", error);
    return res.json(generateFallbackMissionTurn(req.body.mission, req.body.messages, req.body.userMessage));
  }
});

// 1. AI Course Generator Endpoint
app.post("/api/ai/generate-course", async (req, res) => {
  try {
    const { prompt: userPrompt, reason, level = "B1", timePerDay = "20 minutes/day", targetGoal } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackGeneratedCourse(userPrompt, reason, level, timePerDay, targetGoal));
    }

    const systemPrompt = `You are a World-Class English Curriculum Director and Personal AI Tutor.
Create a complete, highly structured, tailored personalized English course based on:
- Learning Topic: "${userPrompt}"
- Motivation / Reason: "${reason}"
- Target Level: "${level}"
- Daily Time Available: "${timePerDay}"
- Target Outcome: "${targetGoal || userPrompt}"

PEDAGOGICAL REQUIREMENTS:
1. Create 4-6 weekly modules with clear thematic progression.
2. For each module, create 5-7 daily lessons.
3. Every single lesson MUST follow the 6-step mastery cycle:
   - Learn: Simple explanation and 2-3 key rules
   - Examples: 2-3 realistic sentences with context
   - Practice: 2-3 interactive exercises (fill_blank, reorder, choice, correction)
   - Speak: Practical speaking prompt with target phrase and pronunciation tips
   - Apply: Real-life scenario with roleplay starter
   - Review: Flashcard prompt and key takeaways
4. Include a comprehensive final assessment with minimum passing score (70%).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            targetLevel: { type: Type.STRING },
            durationWeeks: { type: Type.INTEGER },
            dailyTimeMinutes: { type: Type.INTEGER },
            learningObjectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  description: { type: Type.STRING },
                  lessons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        dayNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                        completed: { type: Type.BOOLEAN },
                        learn: {
                          type: Type.OBJECT,
                          properties: {
                            explanation: { type: Type.STRING },
                            keyRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                            tips: { type: Type.STRING },
                          },
                          required: ["explanation", "keyRules"],
                        },
                        examples: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              sentence: { type: Type.STRING },
                              translationOrContext: { type: Type.STRING },
                              audioText: { type: Type.STRING },
                            },
                            required: ["sentence", "translationOrContext"],
                          },
                        },
                        practice: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              type: { type: Type.STRING },
                              prompt: { type: Type.STRING },
                              options: { type: Type.ARRAY, items: { type: Type.STRING } },
                              correctAnswer: { type: Type.STRING },
                              correctIndex: { type: Type.INTEGER },
                              explanation: { type: Type.STRING },
                            },
                            required: ["id", "type", "prompt", "correctAnswer", "explanation"],
                          },
                        },
                        speak: {
                          type: Type.OBJECT,
                          properties: {
                            prompt: { type: Type.STRING },
                            targetPhrase: { type: Type.STRING },
                            context: { type: Type.STRING },
                            pronunciationTip: { type: Type.STRING },
                          },
                          required: ["prompt", "targetPhrase", "context"],
                        },
                        apply: {
                          type: Type.OBJECT,
                          properties: {
                            scenarioTitle: { type: Type.STRING },
                            rolePrompt: { type: Type.STRING },
                            partnerRole: { type: Type.STRING },
                            dialogueGoal: { type: Type.STRING },
                            starterMessage: { type: Type.STRING },
                          },
                          required: ["scenarioTitle", "rolePrompt", "partnerRole", "dialogueGoal", "starterMessage"],
                        },
                        review: {
                          type: Type.OBJECT,
                          properties: {
                            vocabWords: { type: Type.ARRAY, items: { type: Type.STRING } },
                            keyGrammarPoint: { type: Type.STRING },
                            flashcardPrompt: { type: Type.STRING },
                          },
                          required: ["vocabWords", "keyGrammarPoint", "flashcardPrompt"],
                        },
                      },
                      required: ["id", "dayNumber", "title", "summary", "durationMinutes", "learn", "examples", "practice", "speak", "apply", "review"],
                    },
                  },
                },
                required: ["id", "weekNumber", "title", "theme", "description", "lessons"],
              },
            },
            finalAssessment: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                minPassScore: { type: Type.INTEGER },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      skill: { type: Type.STRING },
                      prompt: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ["id", "skill", "prompt", "options", "correctIndex", "explanation"],
                  },
                },
              },
              required: ["title", "minPassScore", "questions"],
            },
          },
          required: ["id", "title", "description", "category", "targetLevel", "durationWeeks", "dailyTimeMinutes", "learningObjectives", "modules", "finalAssessment"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.createdAt = new Date().toISOString();
    parsed.completed = false;
    parsed.currentWeekIndex = 0;
    parsed.currentLessonIndex = 0;
    parsed.userGoal = targetGoal || userPrompt;
    parsed.userReason = reason;

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Course Generator error:", error);
    return res.json(generateFallbackGeneratedCourse(req.body.prompt, req.body.reason, req.body.level, req.body.timePerDay, req.body.targetGoal));
  }
});

// 2. AI Live Teacher Interaction Mode
app.post("/api/ai/teacher-interaction", async (req, res) => {
  try {
    const {
      mode = "explain",
      userMessage = "",
      currentLesson = "General English",
      currentTopic = "Everyday Conversation",
      userLevel = "B1",
      mistakeHistory = [],
      conversationHistory = [],
    } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackTeacherInteraction(mode, userMessage, currentLesson, userLevel));
    }

    const modeInstructions = {
      explain: "Teach the concept clearly with step-by-step logic, 2 clear examples, and gentle tone.",
      practice: "Ask the learner an interactive question or challenge them to formulate a sentence using the concept.",
      quiz: "Generate a targeted multiple-choice or fill-in-the-blank question to test the student's mastery.",
      conversation: "Roleplay or chat naturally with the student while encouraging them to use the target lesson vocabulary and grammar.",
      review: `Review common mistakes the learner has made in this area (${mistakeHistory.slice(0, 3).map((m: any) => m.wrong || m).join(", ") || "tenses and prepositions"}).`,
      challenge: "Give a higher-level, nuanced task that pushes the learner to combine ideas smoothly and naturally.",
    };

    const prompt = `You are a patient, supportive, expert English Teacher named Alex.
Mode: "${mode}" (${(modeInstructions as any)[mode] || modeInstructions.explain})
Current Lesson: "${currentLesson}" (Topic: "${currentTopic}")
Student Level: "${userLevel}"
Student Message: "${userMessage}"

Recent Conversation History:
${conversationHistory.slice(-5).map((m: any) => `${m.sender === "user" ? "Student" : "Alex (Teacher)"}: ${m.text}`).join("\n")}

Respond to the student:
1. Provide your teacher response in character (conversational, clear, supportive).
2. If student message contains errors, provide constructive correction without shaming.
3. If mode is "quiz" or if student asked to be tested, provide structured quiz question.
4. Provide 3 quick response button options for the student to continue the dialogue smoothly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            correction: {
              type: Type.OBJECT,
              properties: {
                hasMistake: { type: Type.BOOLEAN },
                original: { type: Type.STRING },
                better: { type: Type.STRING },
                why: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["hasMistake"],
            },
            quizQuestion: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                prompt: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
            },
            speechAnalysis: {
              type: Type.OBJECT,
              properties: {
                grammarScore: { type: Type.INTEGER },
                vocabularyScore: { type: Type.INTEGER },
                naturalnessScore: { type: Type.INTEGER },
                feedback: { type: Type.STRING },
              },
            },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["reply", "suggestedReplies"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Teacher interaction error:", error);
    return res.json(generateFallbackTeacherInteraction(req.body.mode, req.body.userMessage, req.body.currentLesson, req.body.userLevel));
  }
});

// 3. AI Instant Lesson Generator
app.post("/api/ai/generate-instant-lesson", async (req, res) => {
  try {
    const { topic = "Present Perfect Tense", userLevel = "B1" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackInstantLesson(topic, userLevel));
    }

    const prompt = `Create an instant, high-yield English learning lesson on: "${topic}" for a ${userLevel} student.
Include:
- Title & Clear, jargon-free explanation
- 3 key rules
- 3 realistic examples with situational context
- 2 common mistakes with right vs wrong comparisons
- 3 practice exercises (fill in blank, sentence correction, multiple choice)
- 2 quiz questions with options & explanations
- 1 conversation prompt with starter message
- 1 speaking task with sample answer
- 3 key review takeaways.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            topic: { type: Type.STRING },
            userLevel: { type: Type.STRING },
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            keyRules: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sentence: { type: Type.STRING },
                  context: { type: Type.STRING },
                },
                required: ["sentence", "context"],
              },
            },
            commonMistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  wrong: { type: Type.STRING },
                  right: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["wrong", "right", "explanation"],
              },
            },
            practiceExercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "type", "prompt", "correctAnswer", "explanation"],
              },
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["question", "options", "correctIndex", "explanation"],
              },
            },
            conversationPrompt: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                partnerRole: { type: Type.STRING },
                starter: { type: Type.STRING },
                goal: { type: Type.STRING },
              },
              required: ["scenario", "partnerRole", "starter", "goal"],
            },
            speakingTask: {
              type: Type.OBJECT,
              properties: {
                prompt: { type: Type.STRING },
                sampleAnswer: { type: Type.STRING },
                targetPattern: { type: Type.STRING },
              },
              required: ["prompt", "sampleAnswer", "targetPattern"],
            },
            reviewTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "id",
            "topic",
            "userLevel",
            "title",
            "explanation",
            "keyRules",
            "examples",
            "commonMistakes",
            "practiceExercises",
            "quiz",
            "conversationPrompt",
            "speakingTask",
            "reviewTakeaways",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Instant Lesson error:", error);
    return res.json(generateFallbackInstantLesson(req.body.topic, req.body.userLevel));
  }
});

// 4. AI Exam Questions Generator Endpoint
app.post("/api/ai/generate-exam-questions", async (req, res) => {
  try {
    const { examType = "IELTS_ACADEMIC", skill = "Reading", count = 5 } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json(generateFallbackExamQuestions(examType, skill, count));
    }

    const prompt = `Generate ${count} authentic practice questions for "${examType}" focusing on the skill "${skill}".
IMPORTANT: Clearly structured as AI-generated practice simulation questions.
Include:
- Passage / context where appropriate (for Reading/Listening comprehension)
- Clear prompt
- 4 plausible options with exactly 1 correct answer
- Detailed explanatory breakdown of why the correct option is right and why others are wrong.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examType: { type: Type.STRING },
            skill: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  examType: { type: Type.STRING },
                  skill: { type: Type.STRING },
                  questionType: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  passageOrContext: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  topic: { type: Type.STRING },
                },
                required: ["id", "examType", "skill", "questionType", "difficulty", "prompt", "options", "correctIndex", "explanation", "topic"],
              },
            },
          },
          required: ["examType", "skill", "questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Exam Questions error:", error);
    return res.json(generateFallbackExamQuestions(req.body.examType, req.body.skill, req.body.count));
  }
});

// 5. AI Speaking Assessment Endpoint
app.post("/api/ai/evaluate-speaking-assessment", async (req, res) => {
  try {
    const { promptText, spokenTranscript, audioDuration = 45, userLevel = "B1" } = req.body;
    const ai = getAI();

    if (!ai || !spokenTranscript || spokenTranscript.trim().length < 5) {
      return res.json(generateFallbackSpeakingAssessment(promptText, spokenTranscript));
    }

    const prompt = `Conduct a comprehensive, objective AI Speaking Assessment.
Prompt given to candidate: "${promptText}"
Candidate's Spoken Transcription: "${spokenTranscript}"
Speaking Duration: ${audioDuration} seconds
Target Level: ${userLevel}

Evaluate on:
1. Grammar Score (0-100)
2. Vocabulary Score (0-100)
3. Sentence Variety Score (0-100)
4. Fluency Estimate (0-100)
5. Topic Relevance Score (0-100)
6. Pronunciation Estimate (0-100)
7. Overall Estimated Score (0-100)
8. Specific strengths (3 bullets)
9. Specific areas for improvement (2-3 bullets)
10. Authentic Native Alternative phrasing
11. Actionable practice recommendation.

NOTE: This is an estimated AI evaluation for learning and practice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grammarScore: { type: Type.INTEGER },
            vocabularyScore: { type: Type.INTEGER },
            sentenceVarietyScore: { type: Type.INTEGER },
            fluencyScore: { type: Type.INTEGER },
            topicRelevanceScore: { type: Type.INTEGER },
            pronunciationEstimate: { type: Type.INTEGER },
            overallScore: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            naturalAlternative: { type: Type.STRING },
            practiceRecommendation: { type: Type.STRING },
          },
          required: [
            "grammarScore",
            "vocabularyScore",
            "sentenceVarietyScore",
            "fluencyScore",
            "topicRelevanceScore",
            "pronunciationEstimate",
            "overallScore",
            "strengths",
            "areasForImprovement",
            "naturalAlternative",
            "practiceRecommendation",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.id = `spk_assess_${Date.now()}`;
    parsed.prompt = promptText;
    parsed.spokenTranscript = spokenTranscript;
    parsed.date = new Date().toISOString().split("T")[0];

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Speaking Assessment error:", error);
    return res.json(generateFallbackSpeakingAssessment(req.body.promptText, req.body.spokenTranscript));
  }
});

// 6. AI Writing Assessment Endpoint
app.post("/api/ai/evaluate-writing-assessment", async (req, res) => {
  try {
    const { promptText, writtenText, examTypeOrLevel = "B1" } = req.body;
    const ai = getAI();

    if (!ai || !writtenText || writtenText.trim().length < 10) {
      return res.json(generateFallbackWritingAssessment(promptText, writtenText));
    }

    const prompt = `Conduct an in-depth AI Writing Assessment on the learner's submitted essay/paragraph.
Prompt / Task: "${promptText}"
Candidate's Submission: "${writtenText}"
Target Level / Exam Context: "${examTypeOrLevel}"

Evaluate rigorously across key dimensions:
- Task Completion Score (0-100)
- Grammar Accuracy Score (0-100)
- Vocabulary Range Score (0-100)
- Organization & Paragraphing Score (0-100)
- Clarity Score (0-100)
- Coherence & Cohesion Score (0-100)
- Naturalness Score (0-100)
- Overall Score (0-100)

Provide:
1. What You Did Well (3 specific strengths)
2. What Needs Improvement (3 specific actionable weaknesses)
3. Example Improvement (a revised, polished version showing native flow)
4. Practice Recommendation (what specific grammar/vocab/exercise to do next).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            taskCompletionScore: { type: Type.INTEGER },
            grammarScore: { type: Type.INTEGER },
            vocabularyScore: { type: Type.INTEGER },
            organizationScore: { type: Type.INTEGER },
            clarityScore: { type: Type.INTEGER },
            coherenceScore: { type: Type.INTEGER },
            naturalnessScore: { type: Type.INTEGER },
            overallScore: { type: Type.INTEGER },
            whatYouDidWell: { type: Type.ARRAY, items: { type: Type.STRING } },
            whatNeedsImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            exampleImprovement: { type: Type.STRING },
            practiceRecommendation: { type: Type.STRING },
          },
          required: [
            "taskCompletionScore",
            "grammarScore",
            "vocabularyScore",
            "organizationScore",
            "clarityScore",
            "coherenceScore",
            "naturalnessScore",
            "overallScore",
            "whatYouDidWell",
            "whatNeedsImprovement",
            "exampleImprovement",
            "practiceRecommendation",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.id = `wrt_assess_${Date.now()}`;
    parsed.prompt = promptText;
    parsed.writtenText = writtenText;
    parsed.date = new Date().toISOString().split("T")[0];

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Writing Assessment error:", error);
    return res.json(generateFallbackWritingAssessment(req.body.promptText, req.body.writtenText));
  }
});

// 7. AI Smart Search Endpoint
app.post("/api/ai/smart-search", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = getAI();

    if (!ai || !query) {
      return res.json(generateFallbackSmartSearch(query));
    }

    const prompt = `A student searched for: "${query}" in their English learning application.
Understand their intent (e.g. "How do I ask my boss for leave?", "Words for talking about money", "Past tense rules").
Return a comprehensive categorized result containing:
- matchedIntent: Summary of what they want to achieve
- relevantPhrases: 4 useful expressions with level and usage context
- sentencePatterns: 2 flexible sentence templates
- grammarRule: The core grammar principle behind it
- exampleDialogue: A short 2-3 turn realistic dialogue
- professionalAlternatives: 2 polished workplace phrases
- practiceExercise: 1 multiple choice practice question.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING },
            matchedIntent: { type: Type.STRING },
            relevantPhrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  level: { type: Type.STRING },
                  whenToUse: { type: Type.STRING },
                },
                required: ["phrase", "meaning", "level", "whenToUse"],
              },
            },
            sentencePatterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pattern: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ["pattern", "example"],
              },
            },
            grammarRule: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                rule: { type: Type.STRING },
                tip: { type: Type.STRING },
              },
              required: ["topic", "rule", "tip"],
            },
            exampleDialogue: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
                required: ["speaker", "text"],
              },
            },
            professionalAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            practiceExercise: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
          required: [
            "query",
            "matchedIntent",
            "relevantPhrases",
            "sentencePatterns",
            "grammarRule",
            "exampleDialogue",
            "professionalAlternatives",
            "practiceExercise",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI Smart Search error:", error);
    return res.json(generateFallbackSmartSearch(req.body.query));
  }
});


// --- Smart Rule-Based Fallback Functions for Offline / Demo Mode ---

function generateFallbackTutorResponse(message: string = "", userLevel: string = "A1", currentLesson: string = "General") {
  const clean = (message || "").toLowerCase().trim();
  let reply = `That's a fantastic effort! As your personal tutor, I'm here to help you communicate with complete confidence.`;
  let correction: any = null;
  let exampleSentences: string[] = [];
  let suggestedReplies: string[] = [
    "How can I sound more natural?",
    "Can you give me an example with this word?",
    "Let's practice a short dialogue!",
  ];

  if (clean.includes("how to use") || clean.includes("explain") || clean.includes("what is")) {
    reply = `Great question! In English, we often look at how the word fits into a sentence (Subject + Verb + Object). Let me break it down step-by-step for you!`;
    exampleSentences = [
      "I practice speaking English every day.",
      "She improved her grammar by asking questions.",
    ];
  } else if (clean.includes("i go to school yesterday") || clean.includes("i see him yesterday")) {
    correction = {
      hasMistake: true,
      original: message,
      better: message.replace(/go to/gi, "went to").replace(/see/gi, "saw"),
      explanation: "Remember that 'yesterday' indicates the past, so we use the past tense form of the verb.",
      category: "Past Tense",
    };
    reply = `I understand what you mean! Just a small reminder: because it happened yesterday, we use the past tense.`;
    exampleSentences = ["I went to the store yesterday.", "We saw a great movie last night."];
  } else {
    reply = `I'm happy to help you with ${currentLesson}! What specific sentence or idea would you like to practice right now?`;
    exampleSentences = [
      "Can we practice making positive and negative sentences?",
      "How do I introduce myself professionally?",
    ];
  }

  return {
    success: true,
    data: {
      reply,
      correction,
      exampleSentences,
      suggestedReplies,
      encouragement: "Keep going! Every sentence you build brings you one step closer to fluency.",
    },
  };
}

function generateFallbackSayItBetter(sentence: string = "") {
  const original = sentence.trim() || "I want go market buy food.";
  let correctEnglish = "I want to go to the market to buy some food.";
  let naturalEnglish = "I'm heading over to the market to pick up some groceries.";
  let professionalEnglish = "I intend to visit the market to purchase necessary provisions.";
  let keyDifferences = [
    "'want' is followed by 'to + verb' (infinitive: 'want to go').",
    "Add the preposition 'to the' before specific physical destinations ('go to the market').",
    "In casual conversation, native speakers frequently say 'head over' or 'pick up groceries'.",
  ];
  let summaryTip = "Remember: want + to + verb (e.g. 'want to eat', 'want to learn').";
  let practiceExercise = {
    prompt: "Arrange the words to form the natural conversational sentence:",
    targetSentence: "I am heading to the store now.",
    jumbledWords: ["the", "heading", "to", "I", "now", "am", "store."],
    hint: "Start with the subject 'I' followed by the auxiliary verb 'am'.",
  };

  if (original.toLowerCase().includes("tell me your name")) {
    correctEnglish = "Please tell me what your name is.";
    naturalEnglish = "What's your name, if you don't mind me asking?";
    professionalEnglish = "May I please have your name?";
    keyDifferences = [
      "Direct commands like 'tell me' can sound blunt in English.",
      "Adding 'May I' or 'Could you' makes your sentence courteous and polite.",
    ];
    summaryTip = "Use 'May I please have...' for polite professional requests.";
  }

  return {
    success: true,
    data: {
      originalSentence: original,
      correctEnglish,
      naturalEnglish,
      professionalEnglish,
      keyDifferences,
      summaryTip,
      practiceExercise,
    },
  };
}

function generateFallbackHowDoISayThis(query: string = "") {
  return {
    success: true,
    data: {
      concept: query || "Expressing that you did not understand someone",
      options: [
        {
          tier: "Simple",
          phrase: "Sorry, I don't understand.",
          whenToUse: "Use with friends or casual situations when you need a quick, direct response.",
          sampleDialogue: "A: 'We will rendezvous at 0800.' B: 'Sorry, I don't understand.'",
        },
        {
          tier: "Natural",
          phrase: "Sorry, I'm not quite sure what you mean.",
          whenToUse: "Everyday conversational English with acquaintances, colleagues, or strangers.",
          sampleDialogue: "A: 'The brief is on the table.' B: 'Sorry, I'm not quite sure what you mean.'",
        },
        {
          tier: "Polite",
          phrase: "Could you please explain that again?",
          whenToUse: "Polite inquiries in classrooms, stores, or with people you want to show respect to.",
          sampleDialogue: "A: 'Turn left after the intersection.' B: 'Could you please explain that again?'",
        },
        {
          tier: "Professional",
          phrase: "Could you please clarify that point for me?",
          whenToUse: "Formal meetings, professional emails, job interviews, or client discussions.",
          sampleDialogue: "A: 'We need to pivot the KPI delivery.' B: 'Could you please clarify that point for me?'",
        },
      ],
      culturalTip: "In English-speaking culture, asking for clarification politely with 'Could you...' or 'Sorry...' is considered courteous, not rude.",
    },
  };
}

function generateFallbackSentenceExpansion(subject: string = "I", verb: string = "eat", object: string = "rice") {
  return {
    success: true,
    data: {
      title: `Expanding: ${subject} + ${verb} + ${object}`,
      steps: [
        {
          stepNumber: 1,
          structureName: "Subject + Verb",
          sentence: `${subject} ${verb}.`,
          addedComponent: `${subject} ${verb}`,
          componentRole: "Core action (Who does what)",
          explanation: "Every complete English sentence begins with a subject and a verb.",
          colorClass: "blue",
        },
        {
          stepNumber: 2,
          structureName: "Subject + Verb + Object",
          sentence: `${subject} ${verb} ${object}.`,
          addedComponent: object,
          componentRole: "Direct Object (What receives the action)",
          explanation: "The object clarifies what is being acted upon.",
          colorClass: "emerald",
        },
        {
          stepNumber: 3,
          structureName: "Subject + Verb + Object + Place",
          sentence: `${subject} ${verb} ${object} at home.`,
          addedComponent: "at home",
          componentRole: "Prepositional Phrase (Where it happens)",
          explanation: "Adding a place gives spatial context to the sentence.",
          colorClass: "purple",
        },
        {
          stepNumber: 4,
          structureName: "Subject + Verb + Object + Place + Time",
          sentence: `${subject} ${verb} ${object} at home every evening.`,
          addedComponent: "every evening",
          componentRole: "Adverbial of Time (When / how often)",
          explanation: "Place usually comes before Time in standard English word order.",
          colorClass: "amber",
        },
        {
          stepNumber: 5,
          structureName: "Subject + Verb + Object + Place + Time + Reason",
          sentence: `${subject} ${verb} ${object} at home every evening because it gives me energy.`,
          addedComponent: "because it gives me energy",
          componentRole: "Clause of Reason (Why it happens)",
          explanation: "Connecting with 'because' creates a rich, expressive complex sentence.",
          colorClass: "rose",
        },
      ],
    },
  };
}

function generateFallbackSentenceTransformation(baseSentence: string = "I study English.") {
  return {
    success: true,
    data: {
      baseSentence,
      transformations: [
        {
          type: "Positive Statement",
          transformedSentence: "I study English every day.",
          ruleExplanation: "Standard affirmative order: Subject + Verb + Object.",
          formula: "Subject + Verb + Object",
        },
        {
          type: "Negative Statement",
          transformedSentence: "I do not study English at night.",
          ruleExplanation: "Add auxiliary 'do not / does not' before the base form of the verb.",
          formula: "Subject + do/does not + Base Verb",
        },
        {
          type: "Yes / No Question",
          transformedSentence: "Do you study English every day?",
          ruleExplanation: "Invert the auxiliary: Place 'Do / Does' at the very beginning.",
          formula: "Do/Does + Subject + Base Verb + Object?",
        },
        {
          type: "Past Tense",
          transformedSentence: "I studied English yesterday.",
          ruleExplanation: "Change the verb to its past tense form (e.g. 'studied', 'went').",
          formula: "Subject + Past Verb + Time",
        },
        {
          type: "Future Tense",
          transformedSentence: "I will study English tomorrow.",
          ruleExplanation: "Use the modal auxiliary 'will' or 'am/is/are going to' before the verb.",
          formula: "Subject + will + Base Verb",
        },
        {
          type: "WH- Question",
          transformedSentence: "Why do you study English?",
          ruleExplanation: "Place Question Word (Why, Where, What) + Auxiliary + Subject + Verb.",
          formula: "WH-Word + Do/Does + Subject + Base Verb?",
        },
      ],
    },
  };
}

function generateFallbackMistakesPractice(mistakes: any[] = []) {
  return {
    success: true,
    data: {
      title: "Personalized Mistake Mastery Session",
      summary: "Let's turn your recent weak spots into permanent strengths!",
      questions: [
        {
          id: "mistake_q1",
          type: "correction",
          prompt: "Correct the error in this sentence:",
          contextSentence: "I went to the store and I buy some fresh bread.",
          options: [
            "I went to the store and I bought some fresh bread.",
            "I go to the store and I buy some fresh bread.",
            "I went to the store and I am buy fresh bread.",
            "I will go store and bought bread.",
          ],
          correctAnswer: "I went to the store and I bought some fresh bread.",
          correctIndex: 0,
          explanation: "Maintain consistent past tense in both coordinated clauses ('went' and 'bought').",
          category: "Past Tense Consistency",
        },
        {
          id: "mistake_q2",
          type: "fill_blank",
          prompt: "Choose the correct preposition to complete the sentence:",
          contextSentence: "She has been living in London _____ three years.",
          options: ["for", "since", "during", "at"],
          correctAnswer: "for",
          correctIndex: 0,
          explanation: "Use 'for' with a duration of time (three years), and 'since' with a specific starting point (e.g. since 2021).",
          category: "Prepositions",
        },
        {
          id: "mistake_q3",
          type: "multiple_choice",
          prompt: "Which sentence is the most natural and grammatically correct?",
          contextSentence: "Discussing an important life choice.",
          options: [
            "I need to make a decision quickly.",
            "I need to do a decision quickly.",
            "I need to take a decision quickly.",
            "I need to produce a decision quickly.",
          ],
          correctAnswer: "I need to make a decision quickly.",
          correctIndex: 0,
          explanation: "The natural English collocation is 'make a decision', not 'do a decision'.",
          category: "Collocations",
        },
      ],
    },
  };
}

function generateFallbackListeningPassage(level: string = "A1", topic: string = "Daily Routine") {
  return {
    success: true,
    data: {
      title: "Morning Routine in London",
      topic: topic,
      level: level,
      passage: "Every morning, David wakes up at seven o'clock. He drinks a warm cup of coffee and prepares breakfast for his family. Then, he catches the train to work at eight thirty. He enjoys listening to podcasts during his commute.",
      speaker: "David (Narrator)",
      keyVocabulary: [
        { word: "Commute", meaning: "The regular journey to and from your place of work." },
        { word: "Prepares", meaning: "To make something ready for use or eating." },
      ],
      questions: [
        {
          id: "l_q1",
          question: "What time does David wake up every morning?",
          options: ["At six o'clock", "At seven o'clock", "At eight thirty", "At nine o'clock"],
          correctIndex: 1,
          explanation: "The passage states: 'Every morning, David wakes up at seven o'clock.'",
        },
        {
          id: "l_q2",
          question: "How does David travel to work?",
          options: ["He walks", "He drives a car", "He takes the train", "He rides a bicycle"],
          correctIndex: 2,
          explanation: "The speaker mentions he catches the train at eight thirty.",
        },
        {
          id: "l_q3",
          question: "What does David do during his commute?",
          options: ["He reads the newspaper", "He listens to podcasts", "He calls his friends", "He sleeps"],
          correctIndex: 1,
          explanation: "He enjoys listening to podcasts during his commute.",
        },
      ],
    },
  };
}

function generateFallbackConversationResponse(scenario: any, messages: any[] = [], userLevel: string) {
  const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].text.toLowerCase() : "";
  let aiResponse = "That's great! Could you tell me a little more about that?";
  let correction: any = null;
  let suggestedReplies = ["Yes, I would love to.", "I understand.", "Can you give me an example?"];

  // Common pattern corrections
  if (lastMsg.includes("i am go") || lastMsg.includes("i go to yesterday") || (lastMsg.includes("yesterday") && lastMsg.includes("go"))) {
    correction = {
      hasMistake: true,
      original: messages[messages.length - 1].text,
      better: messages[messages.length - 1].text.replace(/i am go/gi, "I went").replace(/i go/gi, "I went"),
      why: "'Yesterday' signals the past tense, so we use 'went' instead of 'go' or 'am go'.",
      category: "Past Tense",
    };
    aiResponse = "Nice effort! Remember to use 'went' for past actions. What else did you do?";
  } else if (lastMsg.includes("want buy") || lastMsg.includes("want go") || lastMsg.includes("want learn")) {
    correction = {
      hasMistake: true,
      original: messages[messages.length - 1].text,
      better: messages[messages.length - 1].text.replace(/want (\w+)/gi, "want to $1"),
      why: "The verb 'want' is followed by 'to + verb' (e.g. 'want to buy', 'want to go').",
      category: "Infinitive Verbs",
    };
    aiResponse = "Good! Remember we say 'want to' do something. Let's continue!";
  } else if (lastMsg.includes("my name ") && !lastMsg.includes("my name is")) {
    correction = {
      hasMistake: true,
      original: messages[messages.length - 1].text,
      better: messages[messages.length - 1].text.replace(/my name (\w+)/gi, "My name is $1"),
      why: "In English sentences, we need the linking verb 'is' (Subject + Verb + Name).",
      category: "Verb 'to be'",
    };
    aiResponse = "Nice to meet you! A more natural sentence is 'My name is...'. Where are you from?";
    suggestedReplies = ["I am from New York.", "I live in Tokyo.", "I'm from Nigeria."];
  } else if (scenario?.id === "ordering_food") {
    aiResponse = "Excellent choice! Would you like anything to drink with that, or any side dishes?";
    suggestedReplies = ["A glass of water, please.", "What sides do you recommend?", "No thanks, that's all."];
  } else if (scenario?.id === "job_interview") {
    aiResponse = "That's a very interesting background. How do you usually handle challenges in a team?";
    suggestedReplies = ["I communicate openly with my team.", "I focus on finding solutions.", "I ask for help when needed."];
  }

  return {
    success: true,
    data: {
      aiResponse,
      correction,
      suggestedReplies,
      isGoalCompleted: (messages?.length || 0) >= 6,
    },
  };
}

function generateFallbackSentenceEvaluation(word: string = "", sentence: string = "") {
  const cleanWord = word.trim().toLowerCase();
  const cleanSentence = sentence.trim().toLowerCase();
  const containsWord = cleanSentence.includes(cleanWord);

  let isCorrect = containsWord && sentence.length > 8 && /^[A-Z]/.test(sentence.trim());
  let feedback = isCorrect
    ? `Great job! Your sentence uses "${word}" correctly with clear structure.`
    : `Good try! Make sure your sentence starts with a capital letter and clearly includes "${word}".`;
  let correctedSentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  if (!correctedSentence.endsWith(".")) correctedSentence += ".";

  let explanation = `The word "${word}" is used to describe or perform the action appropriately.`;

  return {
    success: true,
    data: {
      isCorrect,
      score: isCorrect ? 90 : 65,
      feedback,
      correctedSentence,
      naturalAlternative: `Native phrasing: "${correctedSentence}"`,
      explanation,
      grammarCategory: "Vocabulary Usage",
    },
  };
}

function generateFallbackNaturalize(text: string = "") {
  const original = text.trim();
  let correctEnglish = original;
  let moreNatural = original;
  let explanation = "We adjusted the sentence structure and verb tenses to match modern English phrasing.";
  let rules = ["Use standard Subject + Verb + Object word order.", "Check preposition usage."];

  if (original.toLowerCase().includes("i want go market because i need buy food")) {
    correctEnglish = "I want to go to the market because I need to buy food.";
    moreNatural = "I'm heading to the grocery store to pick up some food.";
    explanation = "'want' is followed by 'to + verb' (want to go), and 'market' takes the preposition 'to the market'.";
    rules = [
      "want + to + verb (want to go)",
      "go + to the + place (go to the market)",
      "need + to + verb (need to buy)",
    ];
  } else {
    correctEnglish = original.charAt(0).toUpperCase() + original.slice(1);
    if (!correctEnglish.endsWith(".")) correctEnglish += ".";
    moreNatural = correctEnglish;
  }

  return {
    success: true,
    data: {
      original,
      correctEnglish,
      moreNatural,
      explanation,
      rules,
      example: "I want to learn English because I want to travel.",
      category: "Grammar & Phrasal Flow",
    },
  };
}

function generateFallbackSpeakingFeedback(spokenText: string = "", promptText: string = "") {
  const clean = spokenText.trim();
  const accuracyScore = clean.length > 5 ? 88 : 60;
  const fluencyScore = clean.length > 15 ? 90 : 70;

  return {
    success: true,
    data: {
      accuracyScore,
      fluencyScore,
      feedback: "Clear pronunciation and great confidence! Keep speaking out loud every day.",
      correctedSentence: clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "I am practicing my English.",
      moreNatural: clean ? `A natural way to say this is: "${clean}"` : "I would like to order a coffee, please.",
      pronunciationTips: [
        { word: "the", tip: "Place your tongue gently between your front teeth for the /ð/ sound." },
        { word: "comfortable", tip: "Say it as 'KUMF-ter-bull' (3 syllables), not 4 syllables." },
      ],
    },
  };
}

function generateFallbackWritingCoach(text: string = "", writingType: string = "email") {
  const clean = text.trim() || "Dear Sir, I am writing this to ask about the job position. Please send me details.";
  return {
    success: true,
    data: {
      originalText: clean,
      correctedVersion: clean.includes("Dear Sir") 
        ? "Dear Hiring Team, I am writing to inquire about the open job position. Could you please share further details?"
        : clean.charAt(0).toUpperCase() + clean.slice(1),
      naturalVersion: "Hi there! I am reaching out to ask about the open role. I would love to learn more about the details.",
      professionalVersion: "Dear Hiring Manager, I am writing to express my interest in the advertised position and would greatly appreciate any additional details regarding the role.",
      overallScore: 86,
      grammarScore: 88,
      vocabularyScore: 84,
      clarityScore: 88,
      explanations: [
        {
          category: "Polite Register",
          originalSegment: "Please send me details.",
          improvedSegment: "Could you please share further details?",
          reason: "Using 'Could you please...' softens direct imperative requests in workplace emails.",
        },
        {
          category: "Vocabulary Choice",
          originalSegment: "ask about the job",
          improvedSegment: "inquire about the position",
          reason: "'Inquire' elevates the formal tone in professional applications.",
        },
      ],
      keyStrengths: ["Clear communicative intent", "Good paragraph spacing", "Polite opening greeting"],
      areasForImprovement: ["Vary your sentence openers", "Use modal auxiliary verbs for courteous requests"],
    },
  };
}

function generateFallbackPatternEvaluation(pattern: string = "", sentence: string = "") {
  const clean = sentence.trim();
  const isValid = clean.length > 5;
  return {
    success: true,
    data: {
      isValid,
      score: isValid ? 92 : 65,
      feedback: "Great application of the sentence pattern! Your sentence communicates your idea clearly.",
      correctedSentence: clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "I want to improve my English speaking skills.",
      naturalAlternative: `Naturally phrased: "${clean}"`,
      explanation: `You successfully used "${pattern}" followed by a valid base verb and complement.`,
      expandedSuggestion: clean ? `${clean} because it will help me in my international career.` : "I want to learn English because I enjoy connecting with people.",
    },
  };
}

function generateFallbackConversationAssessment(scenarioTitle: string = "", messages: any[] = []) {
  const userMessages = (messages || []).filter((m) => m.sender === "user");
  const count = userMessages.length;
  return {
    success: true,
    data: {
      communicationScore: count >= 3 ? 90 : 78,
      grammarScore: 88,
      vocabularyScore: 85,
      naturalnessScore: 87,
      fluencyEstimate: count >= 4 ? 88 : 75,
      overallFeedback: `You demonstrated commendable conversational engagement during the "${scenarioTitle}" scenario. You maintained a warm, polite tone and responded contextually to each prompt.`,
      strengths: [
        "Prompt, context-appropriate responses",
        "Polite conversational connectors",
        "Confidence in turn-taking",
      ],
      areasToImprove: [
        "Try using more varied sentence starters",
        "Incorporate phrasal verbs for casual dialogue",
      ],
      highlightedPhrases: [
        "Could you please...",
        "I would appreciate...",
        "Nice to meet you!",
      ],
    },
  };
}

function generateFallbackRoadmapResponse(userLevel: string = "A1", goals: string[] = [], weakAreas: string[] = []) {
  return {
    success: true,
    data: {
      planTitle: `YOUR 30-DAY ENGLISH ROADMAP (${userLevel.toUpperCase()} LEVEL)`,
      targetLevel: userLevel,
      adaptiveNotes: `Dynamically calibrated for goals: ${goals.join(", ") || "confidence and fluency"}. Prioritizing speaking practice and sentence structure.`,
      weeks: [
        {
          weekNumber: 1,
          title: "Week 1: Core Foundation & Sentence Architecture",
          theme: "Mastering Subject + Verb + Object, 20 high-frequency words, and effortless introductions.",
          focusSkills: ["Sentence Building", "Essential Vocabulary", "Present Tense", "Introductions"],
          days: [
            {
              dayNumber: 1,
              title: "Day 1: Sentence Foundations (Subject + Verb)",
              summary: "Learn how every complete English thought is constructed and build your first 5 sentences.",
              completed: true,
              xpReward: 30,
              tasks: [
                { id: "t_1_1", title: "Learn Subject + Verb + Object structure", type: "sentence", targetNav: { page: "sentence_builder" }, completed: true, description: "Master foundational English word order." },
                { id: "t_1_2", title: "5 Essential Daily Vocabulary words", type: "vocab", targetNav: { page: "vocabulary" }, completed: true, description: "Learn borrow, delicious, improve, polite, reliable." },
              ],
            },
            {
              dayNumber: 2,
              title: "Day 2: The Verb 'To Be' & Descriptions",
              summary: "Describe yourself, your job, and your feelings accurately.",
              completed: true,
              xpReward: 30,
              tasks: [
                { id: "t_2_1", title: "Verb 'To Be' Grammar Mastery", type: "grammar", targetNav: { page: "grammar" }, completed: true, description: "I am, You are, He/She is." },
                { id: "t_2_2", title: "Introduce Yourself in Voice", type: "speaking", targetNav: { page: "speaking_practice" }, completed: true, description: "Speak 3 full sentences." },
              ],
            },
            {
              dayNumber: 3,
              title: "Day 3: Present Simple & Daily Habits",
              summary: "Talk effortlessly about your morning routines and what you do every day.",
              completed: true,
              xpReward: 30,
              tasks: [
                { id: "t_3_1", title: "Present Simple Rules", type: "grammar", targetNav: { page: "grammar" }, completed: true, description: "He works vs They work." },
                { id: "t_3_2", title: "Sentence Pattern: 'I usually [verb] in the morning'", type: "sentence", targetNav: { page: "sentence_patterns" }, completed: true, description: "Habitual lifestyle sentences." },
              ],
            },
            {
              dayNumber: 4,
              title: "Day 4: Real-Life Mission: Meet & Greet",
              summary: "Step into a simulated networking break and introduce yourself to Alex.",
              completed: false,
              xpReward: 40,
              tasks: [
                { id: "t_4_1", title: "Mission 1: Introduce Yourself", type: "mission", targetNav: { page: "missions", id: "mission_intro" }, completed: false, description: "Exchange greetings and questions." },
                { id: "t_4_2", title: "Smart Review: Daily SRS Queue", type: "review", targetNav: { page: "smart_review" }, completed: false, description: "Review 10 flashcards due today." },
              ],
            },
            {
              dayNumber: 5,
              title: "Day 5: Asking Questions (Do vs. Does & WH-words)",
              summary: "Stop guessing how to formulate questions. Learn the inverted auxiliary rule.",
              completed: false,
              xpReward: 35,
              tasks: [
                { id: "t_5_1", title: "Question Formation Engine", type: "grammar", targetNav: { page: "sentence_transformation" }, completed: false, description: "Transform statements into questions." },
                { id: "t_5_2", title: "Interactive Story: The Secret Recipe", type: "reading", targetNav: { page: "story_mode" }, completed: false, description: "Make dialogue choices in an English cafe." },
              ],
            },
            {
              dayNumber: 6,
              title: "Day 6: Voice Journal & Fluency Kickoff",
              summary: "Record your very first 1-minute audio voice journal about your day.",
              completed: false,
              xpReward: 40,
              tasks: [
                { id: "t_6_1", title: "1-Minute Voice Journal Entry", type: "speaking", targetNav: { page: "voice_journal" }, completed: false, description: "Record free speech and get analysis." },
                { id: "t_6_2", title: "Word Choice: Say vs. Tell", type: "vocab", targetNav: { page: "word_choice" }, completed: false, description: "Eliminate 'He said me' errors." },
              ],
            },
            {
              dayNumber: 7,
              title: "Day 7: Week 1 Consolidation & AI Assessment",
              summary: "Review your 20 words, take your weekly quiz, and generate your progress report.",
              completed: false,
              xpReward: 50,
              tasks: [
                { id: "t_7_1", title: "Week 1 Milestone Quiz", type: "review", targetNav: { page: "adaptive_quiz" }, completed: false, description: "Test vocabulary and sentence building." },
                { id: "t_7_2", title: "Weekly Learning Report Check", type: "review", targetNav: { page: "weekly_report" }, completed: false, description: "Analyze your weekly statistics." },
              ],
            },
          ],
        },
      ],
    },
  };
}

function generateFallbackFluencyAnalysis(transcript: string = "", topic: string = "General", durationSeconds: number = 60) {
  const clean = transcript.trim();
  const wordCount = clean ? clean.split(/\s+/).length : 0;
  const isSolid = wordCount >= 15;

  return {
    success: true,
    data: {
      grammarScore: isSolid ? 86 : 74,
      vocabularyScore: isSolid ? 88 : 72,
      sentenceVarietyScore: isSolid ? 84 : 70,
      naturalnessScore: isSolid ? 87 : 75,
      pronunciationScore: 85,
      overallFluencyScore: isSolid ? 88 : 74,
      whatYouDidWell: [
        "Spoke smoothly without long hesitation or awkward pauses.",
        "Maintained continuous flow and clear focus on the chosen topic.",
        "Used good conversational rhythm and clear communicative intent.",
      ],
      commonMistakes: [
        {
          mistake: "I very like...",
          correction: "I really like...",
          explanation: "'Very' cannot directly modify verbs in English. Use 'really' before verbs.",
        },
        {
          mistake: "I went to there...",
          correction: "I went there...",
          explanation: "'There' is an adverb of place and does not take the preposition 'to' with 'go'.",
        },
      ],
      betterExpressions: [
        {
          original: "I think it is very good",
          better: "I find it remarkably enjoyable and rewarding",
          reason: "Using 'I find it...' sounds more natural and expresses thoughtful evaluation.",
        },
        {
          original: "In my opinion",
          better: "From my perspective / The way I see it",
          reason: "Expands conversational variety beyond standard textbook clichés.",
        },
      ],
      keyVocabularyUsed: ["experience", "important", "everyday", "learning"],
      feedbackSummary: `Commendable speaking attempt! You maintained focus on "${topic}" and articulated your thoughts with clarity. Practicing with our "Better Expressions" above will rapidly elevate your naturalness.`,
    },
  };
}

function generateFallbackLifeCurriculum(goalText: string = "Job Interview", userLevel: string = "A2") {
  return {
    success: true,
    data: {
      goalTitle: `Accelerated Preparation: ${goalText}`,
      userIntent: goalText,
      level: userLevel,
      vocabulary: [
        { word: "experience", meaning: "practical involvement in activity or job", example: "I have extensive experience working in collaborative teams." },
        { word: "opportunity", meaning: "a set of circumstances that makes it possible to do something", example: "This role represents an outstanding growth opportunity." },
        { word: "collaborate", meaning: "work jointly on an activity or project", example: "I regularly collaborate with international colleagues." },
        { word: "efficient", meaning: "achieving maximum productivity with minimum wasted effort", example: "I implement efficient workflows to meet deadlines." },
        { word: "responsibility", meaning: "the duty to deal with or take care of something", example: "My core responsibility was customer satisfaction." },
      ],
      usefulPhrases: [
        { phrase: "Could you tell me more about...", whenToUse: "Asking for elaboration or polite clarification." },
        { phrase: "I would appreciate the opportunity to...", whenToUse: "Expressing genuine professional enthusiasm." },
        { phrase: "In my previous role, I was responsible for...", whenToUse: "Describing past work experience structured." },
        { phrase: "Could we confirm the details by email?", whenToUse: "Securing written follow-up." },
        { phrase: "Thank you for your time and assistance.", whenToUse: "Polite concluding remark." },
      ],
      commonQuestions: [
        {
          question: "How do you handle unexpected challenges?",
          goodAnswer: "I stay calm, assess the primary root cause, communicate clearly with my team, and focus on immediate actionable solutions.",
          tip: "Structure answers with: Calm mindset -> Root cause -> Team communication -> Solution.",
        },
        {
          question: "What is your main goal for the coming year?",
          goodAnswer: "My goal is to master high-level English communication and contribute proactively to international projects.",
          tip: "Connect your personal development directly to organizational impact.",
        },
      ],
      sentencePatterns: [
        { pattern: "I have [X years of] experience in [noun/gerund]...", example: "I have three years of experience in project management." },
        { pattern: "I am confident that I can [verb]...", example: "I am confident that I can deliver results quickly." },
        { pattern: "What I value most is [noun/phrase]...", example: "What I value most is proactive communication and teamwork." },
      ],
      grammarFocus: [
        { topic: "Modal verbs for polite communication (Could / Would / May)", rule: "Use modal verbs to soften direct requests and sound courteous.", example: "Could you please clarify the project timeline?" },
      ],
      speakingPracticePrompt: `Practice introducing yourself in 60 seconds with your core goal: "${goalText}".`,
      mockScenario: {
        title: `Simulation: ${goalText}`,
        partnerRole: "Discussion Partner (Alex)",
        situation: `Practical real-life communication regarding ${goalText}.`,
        openingMessage: `Hello! I'm glad we could connect. Let's discuss your plan regarding "${goalText}". How can I help you prepare today?`,
      },
    },
  };
}

function generateFallbackVoiceJournalAnalysis(transcript: string = "", title: string = "Daily Reflection") {
  const clean = transcript.trim() || "Today I woke up early and practiced English. I want to speak better.";
  return {
    success: true,
    data: {
      originalTranscript: clean,
      correctedVersion: clean.replace(/i\b/g, "I").replace(/i want speak/gi, "I want to speak"),
      naturalVersion: `Today I got an early start to my morning and spent some time practicing English. I'm really looking forward to speaking more fluently.`,
      suggestedVocabulary: [
        { word: "productive", meaning: "achieving or producing a significant amount of results", context: "I had a very productive morning." },
        { word: "routine", meaning: "a sequence of actions regularly followed", context: "English practice is now part of my daily routine." },
        { word: "progress", meaning: "forward movement toward a destination or goal", context: "I can already feel my speaking progress." },
      ],
      grammarScore: 88,
      fluencyScore: 86,
      feedback: "Great reflection! Your message is clear and authentic. Review the suggested natural phrasing to make your daily journaling even smoother!",
    },
  };
}

function generateFallbackPhoneCallReply(scenario: any, messages: any[] = [], userSpokenText: string = "") {
  const clean = (userSpokenText || "").toLowerCase();
  let replyText = "Thank you for providing those details. I have updated that in our system for you.";
  let isCallFinished = false;

  if (messages.length === 0 || clean.includes("hello") || clean.includes("hi")) {
    replyText = `Thank you for calling. Could you please confirm your name and the details of your request?`;
  } else if (clean.includes("table") || clean.includes("book") || clean.includes("reserve")) {
    replyText = `Certainly! I see availability for four people at 7:30 PM tomorrow. Would you prefer indoor or outdoor seating?`;
  } else if (clean.includes("flight") || clean.includes("ticket") || clean.includes("airline")) {
    replyText = `I can certainly check available flights for you. What is your six-character reservation reference code?`;
  } else if (clean.includes("repeat") || clean.includes("pardon") || clean.includes("slowly")) {
    replyText = `Of course, I will speak more slowly. I was asking if you have your booking reference number ready?`;
  } else if (clean.includes("thank") || clean.includes("goodbye") || clean.includes("bye")) {
    replyText = `You are very welcome! Have a wonderful rest of your day, and thank you for calling. Goodbye!`;
    isCallFinished = true;
  } else {
    replyText = `Understood! I've noted that down. Is there anything else I can assist you with today?`;
  }

  return {
    success: true,
    data: {
      replyText,
      suggestedReplies: [
        "Could you repeat that, please?",
        "Yes, that sounds perfect, thank you!",
        "Could you send me a confirmation by email or SMS?",
      ],
      isCallFinished,
      coachTip: "Tip: Phone calls require active clarification since you cannot see facial expressions. Never hesitate to ask them to repeat or slow down.",
    },
  };
}

function generateFallbackSoundNaturalEvaluation(inputSentence: string = "") {
  const clean = inputSentence.trim();
  const lower = clean.toLowerCase();

  let status: any = "Understandable";
  let score = 75;
  let whyExplanation = "This sentence is understandable, but native speakers typically use more concise, idiomatic phrasings.";
  let naturalAlternatives = [
    clean,
    `Here is a native alternative: "${clean}"`,
    `A more polished phrasing: "${clean}"`,
  ];
  let ruleTip = "Prefer standard everyday collocations over direct word-for-word translation.";

  if (lower.includes("make a question")) {
    status = "Unnatural";
    score = 55;
    whyExplanation = "In English, questions are 'asked' or 'raised', never 'made' or 'done'.";
    naturalAlternatives = ["May I ask a question?", "I have a quick question.", "Could I ask you something?"];
    ruleTip = "Always say: ask a question / have a question.";
  } else if (lower.includes("very like") || lower.includes("very want")) {
    status = "Unnatural";
    score = 58;
    whyExplanation = "'Very' cannot directly modify verbs in English. Use 'really' before the verb.";
    naturalAlternatives = ["I really like this.", "I really enjoy this.", "I love this very much."];
    ruleTip = "Use 'really + verb' (e.g. 'I really want', 'I really like').";
  } else if (lower.includes("open the light") || lower.includes("close the light")) {
    status = "Unnatural";
    score = 60;
    whyExplanation = "Electrical fixtures and appliances are 'turned on/off' or 'switched on/off', not opened or closed.";
    naturalAlternatives = ["Please turn on the light.", "Could you switch the lights on?", "Can you flick the lights on?"];
    ruleTip = "Turn on / switch on lights and electronics.";
  } else {
    status = "Natural";
    score = 90;
    whyExplanation = "Your sentence is clear, grammatically well-formed, and sounds natural.";
    naturalAlternatives = [
      clean,
      `Polite alternative: "Could you please clarify this?"`,
      `Casual alternative: "Let me check that real quick."`,
    ];
  }

  return {
    success: true,
    data: {
      original: clean || "I want to ask a question.",
      status,
      score,
      whyExplanation,
      naturalAlternatives,
      ruleTip,
      practiceExercise: {
        prompt: "Choose the most natural way to ask for information in a meeting:",
        options: ["I want to make a question.", "Could I ask a quick question?", "I do a question for you.", "May I make one question?"],
        correctIndex: 1,
        explanation: "Native speakers say 'ask a question' or 'have a question'.",
      },
    },
  };
}

function generateFallbackMissionTurn(mission: any, messages: any[] = [], userMessage: string = "") {
  const clean = userMessage.trim();
  const count = (messages || []).length;
  const isComplete = count >= 3;

  return {
    success: true,
    data: {
      aiResponse: `That sounds great! Thank you for letting me know. I really appreciate how clearly you communicated that.`,
      correction: {
        hasMistake: false,
      },
      suggestedReplies: [
        "Thank you so much for your help!",
        "Could you please confirm the next step?",
        "Have a wonderful day!",
      ],
      isMissionComplete: isComplete,
      completedChecklistItems: [
        "Greeted politely",
        "Communicated requirement clearly",
      ],
    },
  };
}

function generateFallbackGeneratedCourse(
  prompt: string = "English for Everyday Communication",
  reason: string = "Personal Development",
  level: string = "B1",
  timePerDay: string = "20 minutes/day",
  targetGoal: string = "Speak fluently and confidently"
) {
  const cleanTopic = prompt || "English for Confident Everyday Life";
  return {
    success: true,
    data: {
      id: `course_gen_${Date.now()}`,
      title: cleanTopic.length > 5 ? `${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)} Mastery` : "Everyday English Fluency",
      description: `A personalized, high-yield curriculum designed specifically for ${reason.toLowerCase()} at ${level} level. Practice everyday conversations, grammar accuracy, natural phrasing, and speaking drills in just ${timePerDay}.`,
      category: "Personalized AI Course",
      targetLevel: level,
      durationWeeks: 4,
      dailyTimeMinutes: parseInt(timePerDay) || 20,
      learningObjectives: [
        `Master essential vocabulary and natural phrases for ${cleanTopic}`,
        "Build grammatical accuracy when formulating complex thoughts",
        "Speak fluently with reduced hesitation in real-life dialogue",
        "Understand native pace and varied speech patterns comfortably",
      ],
      userGoal: targetGoal || cleanTopic,
      userReason: reason,
      createdAt: new Date().toISOString(),
      completed: false,
      currentWeekIndex: 0,
      currentLessonIndex: 0,
      modules: [
        {
          id: "mod_1",
          weekNumber: 1,
          title: "Foundation & Core Expressions",
          theme: "Immediate practical communication and sentence frameworks",
          description: "Establish clear sentence habits, active vocabulary, and everyday confidence.",
          lessons: [
            {
              id: "les_1_1",
              dayNumber: 1,
              title: "Expressing Intentions & Needs Clearly",
              summary: "Learn how to state what you want politely and clearly without sounding blunt.",
              durationMinutes: 15,
              completed: false,
              learn: {
                explanation: "When expressing desires, native speakers replace blunt phrases like 'I want' with polite modal structures like 'I'd like to' or 'I was hoping to'.",
                keyRules: [
                  "Use 'I would like to + base verb' in professional and polite contexts.",
                  "Use 'I'm looking to + base verb' when describing plans or browsing.",
                  "Follow with 'if possible' or 'please' to soften requests.",
                ],
                tips: "Notice how polite phrasing immediately establishes warmth and mutual respect.",
              },
              examples: [
                {
                  sentence: "I was hoping to ask you a quick question regarding the project.",
                  translationOrContext: "Polite workplace opening",
                },
                {
                  sentence: "I'd like to schedule a brief call whenever you have a moment.",
                  translationOrContext: "Scheduling appointment",
                },
              ],
              practice: [
                {
                  id: "p_1_1_1",
                  type: "choice",
                  prompt: "Which option is the most polite and natural way to request assistance?",
                  options: [
                    "Give me the file now.",
                    "I want that you help me with this.",
                    "Could you please assist me with this file when you get a chance?",
                    "You must do this for me.",
                  ],
                  correctAnswer: "Could you please assist me with this file when you get a chance?",
                  correctIndex: 2,
                  explanation: "'Could you please...' with 'when you get a chance' gives a polite and respectful tone.",
                },
                {
                  id: "p_1_1_2",
                  type: "reorder",
                  prompt: "Arrange the words to form a polite expression of intent:",
                  options: ["I'd", "like", "to", "clarify", "one", "quick", "detail."],
                  correctAnswer: "I'd like to clarify one quick detail.",
                  explanation: "Subject + would like to + base verb + object.",
                },
              ],
              speak: {
                prompt: "Read aloud with confidence and clear intonation:",
                targetPhrase: "I'd really appreciate your guidance on this matter.",
                context: "Expressing gratitude while asking for advice",
                pronunciationTip: "Link 'appreciate' and 'your' smoothly: /əˈpriːʃieɪt jɔːr/.",
              },
              apply: {
                scenarioTitle: "Asking for Guidance at Work",
                rolePrompt: "You are talking to your team lead Alex about an assignment.",
                partnerRole: "Alex (Team Lead)",
                dialogueGoal: "Politely state that you would like clarification on the timeline.",
                starterMessage: "Hey there! How is your week coming along so far?",
              },
              review: {
                vocabWords: ["guidance", "clarify", "timeline", "assist"],
                keyGrammarPoint: "Modal verbs for polite requests (Could, Would like)",
                flashcardPrompt: "How do you turn 'I want to speak' into a polite business request?",
              },
            },
            {
              id: "les_1_2",
              dayNumber: 2,
              title: "Describing Ongoing Progress & Challenges",
              summary: "Use present perfect continuous and dynamic phrasing to discuss updates.",
              durationMinutes: 15,
              completed: false,
              learn: {
                explanation: "Use 'have been + -ing' to show actions that started in the past and continue into the present moment.",
                keyRules: [
                  "Formula: Subject + have/has been + verb-ing + for/since.",
                  "Use 'for' with time duration (for 3 weeks, for 2 hours).",
                  "Use 'since' with starting point (since Monday, since 2024).",
                ],
                tips: "This is the #1 tense used in interviews and project status reports.",
              },
              examples: [
                {
                  sentence: "I've been working on this report since early this morning.",
                  translationOrContext: "Status update",
                },
                {
                  sentence: "We have been developing new strategies for the past two months.",
                  translationOrContext: "Team overview",
                },
              ],
              practice: [
                {
                  id: "p_1_2_1",
                  type: "choice",
                  prompt: "Choose the correct sentence to indicate ongoing work for 3 months:",
                  options: [
                    "I am learning English since three months.",
                    "I have been learning English for three months.",
                    "I was learning English from three months.",
                    "I learn English since three months.",
                  ],
                  correctAnswer: "I have been learning English for three months.",
                  correctIndex: 1,
                  explanation: "Use Present Perfect Continuous with 'for' for elapsed time periods.",
                },
              ],
              speak: {
                prompt: "Practice your status update aloud:",
                targetPhrase: "I've been focusing on improving my English fluency every single day.",
                context: "Sharing your learning commitment",
                pronunciationTip: "Contract 'I have' to 'I've' /aɪv/.",
              },
              apply: {
                scenarioTitle: "Progress Meeting",
                rolePrompt: "Share what you've been working on recently with your mentor.",
                partnerRole: "Mentor",
                dialogueGoal: "Explain what tasks you've been handling this week.",
                starterMessage: "Welcome! Tell me, what have you been focusing on lately?",
              },
              review: {
                vocabWords: ["focusing", "recently", "progress", "milestone"],
                keyGrammarPoint: "Present Perfect Continuous (have/has been + -ing)",
                flashcardPrompt: "What is the difference between 'I work' and 'I have been working'?",
              },
            },
          ],
        },
        {
          id: "mod_2",
          weekNumber: 2,
          title: "Nuance, Opinion & Persuasion",
          theme: "Sharing opinions diplomatically and debating constructive ideas",
          description: "Elevate your speech from basic information sharing to diplomatic discussions.",
          lessons: [
            {
              id: "les_2_1",
              dayNumber: 3,
              title: "Expressing Agreement & Disagreement Diplomatically",
              summary: "Learn how to disagree respectfully without causing conflict.",
              durationMinutes: 20,
              completed: false,
              learn: {
                explanation: "Direct disagreement ('You are wrong') can sound harsh. Soften opinions with hedges like 'I see your point, however...' or 'I have a slightly different perspective.'",
                keyRules: [
                  "Acknowledge the other view first ('I understand where you're coming from...').",
                  "Transition gently using 'however', 'at the same time', or 'on the other hand'.",
                  "Frame disagreement around ideas rather than personal judgment.",
                ],
              },
              examples: [
                {
                  sentence: "I see what you mean, but we might want to consider the budget constraints.",
                  translationOrContext: "Diplomatic pushback",
                },
              ],
              practice: [
                {
                  id: "p_2_1_1",
                  type: "choice",
                  prompt: "Which phrase disagrees most professionally?",
                  options: [
                    "That makes no sense.",
                    "I take a somewhat different view on this.",
                    "You don't understand the problem.",
                    "No way.",
                  ],
                  correctAnswer: "I take a somewhat different view on this.",
                  correctIndex: 1,
                  explanation: "'I take a somewhat different view' is polite and professional.",
                },
              ],
              speak: {
                prompt: "Practice polite diplomatic disagreement:",
                targetPhrase: "While I appreciate that perspective, we should also keep our long-term goals in mind.",
                context: "Balanced discussion in a meeting",
              },
              apply: {
                scenarioTitle: "Budget Discussion",
                rolePrompt: "Offer an alternative proposal respectfully to your colleague.",
                partnerRole: "Colleague",
                dialogueGoal: "Acknowledge their suggestion and offer your idea.",
                starterMessage: "I think we should spend our entire marketing budget on print ads.",
              },
              review: {
                vocabWords: ["perspective", "diplomatic", "constraint", "alternative"],
                keyGrammarPoint: "Concessive clauses (While..., Although...)",
                flashcardPrompt: "How can you disagree politely in English without saying 'No'?",
              },
            },
          ],
        },
      ],
      finalAssessment: {
        title: "Course Mastery Assessment",
        minPassScore: 70,
        questions: [
          {
            id: "q_final_1",
            skill: "Polite Communication",
            prompt: "Select the most appropriate sentence to request time off from a supervisor:",
            options: [
              "I am not coming to work next Friday.",
              "I would like to request Friday off, if that works with the team schedule.",
              "Give me holiday on Friday please.",
              "I want off on Friday.",
            ],
            correctIndex: 1,
            explanation: "'I would like to request... if that works...' is professional and respectful.",
          },
          {
            id: "q_final_2",
            skill: "Tenses & Aspect",
            prompt: "Which sentence correctly highlights an activity that started in the past and continues now?",
            options: [
              "I am studying here since three years.",
              "I have been studying here for three years.",
              "I study here for three years.",
              "I was studying here since three years.",
            ],
            correctIndex: 1,
            explanation: "'have been studying... for three years' is the correct present perfect continuous form.",
          },
        ],
      },
    },
  };
}

function generateFallbackTeacherInteraction(
  mode: string = "explain",
  userMessage: string = "",
  currentLesson: string = "General English",
  userLevel: string = "B1"
) {
  const clean = (userMessage || "").toLowerCase();
  let reply = "I am right here with you! Let's break this down step-by-step so you feel completely confident.";
  let correction: any = { hasMistake: false };
  let quizQuestion: any = undefined;

  if (clean.includes("explain that again") || mode === "explain") {
    reply = `Certainly! When communicating in English, the golden rule is **Clarity over Complexity**. 
    
1. Start with the core subject and verb.
2. Add detail (time, location, reason) using prepositions.
3. Use polite markers like *could*, *would*, and *please* when making requests.

Would you like an example from a real workplace or everyday conversation?`;
  } else if (mode === "quiz" || clean.includes("quiz me")) {
    reply = "Here is a quick challenge to test your understanding! Choose the best answer:";
    quizQuestion = {
      id: `quiz_${Date.now()}`,
      prompt: "Which phrase is the most natural way to ask for someone's opinion in a discussion?",
      options: [
        "What is your idea about this?",
        "What are your thoughts on this?",
        "Do you have a thought for this?",
        "Say me what you think.",
      ],
      correctIndex: 1,
      explanation: "'What are your thoughts on this?' is the standard, natural expression used in everyday and professional English.",
    };
  } else if (clean.includes("i go to school yesterday") || clean.includes("i buyed") || clean.includes("i am agree")) {
    correction = {
      hasMistake: true,
      original: userMessage,
      better: userMessage.replace(/i am agree/gi, "I agree").replace(/i buyed/gi, "I bought").replace(/i go/gi, "I went"),
      why: "In English, 'agree' is a verb on its own ('I agree'), and irregular past tense verbs have unique forms (buy -> bought, go -> went).",
      category: "Grammar & Verb Forms",
    };
    reply = "You expressed your thought clearly! Just a small refinement: notice how we say 'I agree' rather than 'I am agree'. Let's try using that in another sentence!";
  } else {
    reply = `That makes total sense. You're doing a great job expressing yourself at the ${userLevel} level. How would you like to proceed next? We can practice a conversation, review common pitfalls, or test your skills with a quiz!`;
  }

  return {
    success: true,
    data: {
      reply,
      correction,
      quizQuestion,
      suggestedReplies: [
        "Give me another example",
        "Quiz me on this",
        "Let's practice in a dialogue",
      ],
      speechAnalysis: {
        grammarScore: 88,
        vocabularyScore: 85,
        naturalnessScore: 90,
        feedback: "Clear pronunciation rhythm and good sentence structuring.",
      },
    },
  };
}

function generateFallbackInstantLesson(topic: string = "Present Perfect Tense", userLevel: string = "B1") {
  return {
    success: true,
    data: {
      id: `instant_${Date.now()}`,
      topic,
      userLevel,
      title: `Mastering ${topic}`,
      explanation: `${topic} is a cornerstone of natural English. Understanding when and how to apply it will immediately make your communication more precise and native-sounding.`,
      keyRules: [
        "Focus on the connection between the action and the present outcome.",
        "Keep sentence formulas simple: Subject + Auxiliary + Main Verb.",
        "Pay special attention to collocations and natural phrase pairings.",
      ],
      examples: [
        {
          sentence: "I have lived in this city for five years, so I know the transit system well.",
          context: "Connecting past experience with present knowledge",
        },
        {
          sentence: "She has just finished the presentation and is ready for questions.",
          context: "Recently completed action with present impact",
        },
      ],
      commonMistakes: [
        {
          wrong: "I have seen him yesterday.",
          right: "I saw him yesterday.",
          explanation: "Specific past time markers like 'yesterday' require the Simple Past, not Present Perfect.",
        },
        {
          wrong: "I am living here since 2 years.",
          right: "I have been living here for 2 years.",
          explanation: "Use Present Perfect Continuous with 'for' for durations.",
        },
      ],
      practiceExercises: [
        {
          id: "pe_1",
          type: "choice",
          prompt: "Choose the correct sentence for an ongoing activity:",
          options: [
            "I know her since 2020.",
            "I have known her since 2020.",
            "I am knowing her since 2020.",
            "I knew her since 2020.",
          ],
          correctAnswer: "I have known her since 2020.",
          explanation: "'Know' is a stative verb used with Present Perfect + since.",
        },
      ],
      quiz: [
        {
          question: "When should you use the Simple Past instead of the Present Perfect?",
          options: [
            "When the exact time in the past is mentioned (e.g. yesterday, in 2021).",
            "When the action is happening right now.",
            "When talking about future intentions.",
            "Never, they are identical.",
          ],
          correctIndex: 0,
          explanation: "Specific past timestamps require Simple Past.",
        },
      ],
      conversationPrompt: {
        scenario: "Talking about life experiences with a colleague",
        partnerRole: "Colleague",
        starter: "Have you ever traveled abroad for work or study?",
        goal: "Use 'have you ever' and share a brief personal experience.",
      },
      speakingTask: {
        prompt: "Describe an accomplishment you are proud of using the target structure.",
        sampleAnswer: "I have completed several challenging projects this year, which has helped me build strong problem-solving skills.",
        targetPattern: "I have [verb in past participle]...",
      },
      reviewTakeaways: [
        "Present Perfect links past to now.",
        "Do not use specific past timestamps with Present Perfect.",
        "Use 'for' for duration and 'since' for starting points.",
      ],
    },
  };
}

function generateFallbackExamQuestions(examType: string = "IELTS_ACADEMIC", skill: string = "Reading", count: number = 3) {
  const isIELTS = examType.includes("IELTS");
  const isWAEC = examType.includes("WAEC") || examType.includes("NECO") || examType.includes("JAMB");

  return {
    success: true,
    data: {
      examType,
      skill,
      questions: [
        {
          id: `eq_1_${Date.now()}`,
          examType,
          skill,
          questionType: "multiple_choice",
          difficulty: "Medium",
          passageOrContext: "Renewable energy adoption has accelerated significantly over the past decade. While initial capital expenditure remains high, long-term operational costs and environmental benefits have convinced both governments and private investors to scale up solar and wind infrastructure.",
          prompt: "According to the passage, what is a primary incentive for investing in renewable energy despite initial costs?",
          options: [
            "Immediate short-term profit margins.",
            "Reduced long-term operational expenses and positive ecological impact.",
            "Mandatory global penalties on traditional fossil fuels.",
            "Complete elimination of maintenance personnel.",
          ],
          correctAnswer: "Reduced long-term operational expenses and positive ecological impact.",
          correctIndex: 1,
          explanation: "The passage explicitly notes that 'long-term operational costs and environmental benefits' convince investors.",
          topic: "Reading Comprehension",
        },
        {
          id: `eq_2_${Date.now()}`,
          examType,
          skill,
          questionType: "sentence_correction",
          difficulty: "Hard",
          prompt: "Choose the option that best corrects the underlined error: 'Neither the manager nor the employees ___ aware of the policy update until yesterday.'",
          options: ["was", "were", "is", "are"],
          correctAnswer: "were",
          correctIndex: 1,
          explanation: "In 'Neither... nor...' structures, the verb agrees with the closer subject ('the employees', which is plural, hence 'were' in past tense).",
          topic: "Subject-Verb Agreement",
        },
      ],
    },
  };
}

function generateFallbackSpeakingAssessment(promptText: string = "Describe your daily routine", spokenTranscript: string = "") {
  const wordCount = (spokenTranscript || "").trim().split(/\s+/).filter(Boolean).length;
  const isRich = wordCount > 25;

  return {
    success: true,
    data: {
      id: `spk_${Date.now()}`,
      prompt: promptText,
      spokenTranscript: spokenTranscript || "I usually wake up at seven and prepare my breakfast before starting my work.",
      grammarScore: isRich ? 88 : 78,
      vocabularyScore: isRich ? 85 : 74,
      sentenceVarietyScore: isRich ? 86 : 72,
      fluencyScore: isRich ? 90 : 80,
      topicRelevanceScore: 92,
      pronunciationEstimate: 85,
      overallScore: isRich ? 87 : 76,
      strengths: [
        "Clear and understandable message structure.",
        "Good control of foundational present tense verb forms.",
        "Smooth pace with natural pauses between thought groups.",
      ],
      areasForImprovement: [
        "Incorporate more varied transitional markers (e.g. 'subsequently', 'shortly thereafter').",
        "Expand compound sentences with dependent clauses to increase syntactic depth.",
      ],
      naturalAlternative: "I generally start my morning around seven, grab a quick breakfast, and dive straight into my daily responsibilities.",
      practiceRecommendation: "Practice the 'Sentence Expansion' module to build multi-clause sentences effortlessly.",
      date: new Date().toISOString().split("T")[0],
    },
  };
}

function generateFallbackWritingAssessment(promptText: string = "Discuss the pros and cons of remote work", writtenText: string = "") {
  const length = (writtenText || "").length;
  const isHighQuality = length > 120;

  return {
    success: true,
    data: {
      id: `wrt_${Date.now()}`,
      prompt: promptText,
      writtenText: writtenText || "Remote work has many advantages such as flexibility and saving commute time. However, it can also lead to isolation.",
      taskCompletionScore: isHighQuality ? 90 : 78,
      grammarScore: isHighQuality ? 88 : 80,
      vocabularyScore: isHighQuality ? 86 : 75,
      organizationScore: isHighQuality ? 88 : 76,
      clarityScore: isHighQuality ? 92 : 82,
      coherenceScore: isHighQuality ? 87 : 78,
      naturalnessScore: isHighQuality ? 89 : 80,
      overallScore: isHighQuality ? 88 : 78,
      whatYouDidWell: [
        "Directly addressed all components of the prompt with balanced arguments.",
        "Demonstrated solid sentence boundary mechanics without run-on sentences.",
        "Used appropriate cohesive devices ('However', 'In addition') to connect ideas.",
      ],
      whatNeedsImprovement: [
        "Enhance lexical variety by replacing common verbs with precise academic collocations.",
        "Provide more concrete supporting evidence or illustrative examples for key claims.",
      ],
      exampleImprovement: "Remote work offers substantial benefits, notably schedule autonomy and the elimination of taxing daily commutes. Nonetheless, organizations must proactively mitigate the risk of employee isolation through intentional collaboration channels.",
      practiceRecommendation: "Review the 'Collocations & Phrasal Verbs' and 'Academic Writing Lab' modules to enrich paragraph depth.",
      date: new Date().toISOString().split("T")[0],
    },
  };
}

function generateFallbackSmartSearch(query: string = "How do I ask for time off?") {
  return {
    success: true,
    data: {
      query,
      matchedIntent: `Seeking polite and professional communication strategies for: "${query}"`,
      relevantPhrases: [
        {
          phrase: "I was hoping to request some time off next week.",
          meaning: "Polite and tentative way to ask a manager for leave.",
          level: "B1",
          whenToUse: "Direct communication with team leads or supervisors.",
        },
        {
          phrase: "Would it be feasible for me to take Friday off?",
          meaning: "Formal and courteous scheduling inquiry.",
          level: "B2",
          whenToUse: "Corporate email or formal 1-on-1 meeting.",
        },
        {
          phrase: "I've arranged coverage for my tasks during my absence.",
          meaning: "Demonstrating proactive responsibility.",
          level: "B2",
          whenToUse: "Following up on a leave request.",
        },
        {
          phrase: "Please let me know if this timeline poses any issues.",
          meaning: "Respectful closing phrase.",
          level: "B1",
          whenToUse: "Written email conclusion.",
        },
      ],
      sentencePatterns: [
        {
          pattern: "I would like to request [Duration/Date] off due to [Reason].",
          example: "I would like to request two days off due to a family commitment.",
        },
        {
          pattern: "Would it be possible to arrange [Request] for [Timeframe]?",
          example: "Would it be possible to arrange remote coverage for next Thursday?",
        },
      ],
      grammarRule: {
        topic: "Polite Request Modals",
        rule: "Use 'would like', 'was hoping to', or 'could I' instead of 'I want' to sound polite and respectful in professional settings.",
        tip: "Avoid using imperative verbs like 'Give me' when requesting permissions.",
      },
      exampleDialogue: [
        { speaker: "Employee", text: "Good morning, Sarah. I was hoping to speak with you about taking next Friday off." },
        { speaker: "Manager", text: "Sure! Let me check the project calendar. Have you coordinated coverage for the release?" },
        { speaker: "Employee", text: "Yes, David has agreed to handle any urgent client inquiries while I'm away." },
        { speaker: "Manager", text: "That sounds well organized. Go ahead and submit the formal request in the portal." },
      ],
      professionalAlternatives: [
        "I would appreciate your approval for my upcoming leave request.",
        "I am writing to formally request leave from October 12th through October 15th.",
      ],
      practiceExercise: {
        question: "Which of the following is the most professional way to ask your supervisor for leave?",
        options: [
          "I will not come next week, give me holiday.",
          "I was hoping to request two days of annual leave next week, if the schedule permits.",
          "I want vacation now.",
          "Can I do not work on Friday?",
        ],
        correctIndex: 1,
        explanation: "Option 2 uses polite modal verbs ('was hoping to request') and acknowledges team scheduling constraints.",
      },
    },
  };
}


// Start Server with Vite Middleware in Development / Static Dist in Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FluentStep English Learning Server running on http://localhost:${PORT}`);
  });
}

startServer();
