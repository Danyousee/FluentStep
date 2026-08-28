import React, { useState } from 'react';
import { UserLevel, UserProgress } from '../types';
import { STORIES, InteractiveStory, StoryNode } from '../data/storyData';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Trophy,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface StoryModeViewProps {
  userLevel: UserLevel;
  userProgress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const StoryModeView: React.FC<StoryModeViewProps> = ({
  userLevel,
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedStory, setSelectedStory] = useState<InteractiveStory | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [selectedVocabWord, setSelectedVocabWord] = useState<{
    word: string;
    meaning: string;
    partOfSpeech?: string;
  } | null>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startStory = (story: InteractiveStory) => {
    setSelectedStory(story);
    setCurrentNodeId(story.startNodeId);
    setVisitedNodes([story.startNodeId]);
    setSelectedVocabWord(null);
  };

  const restartCurrentStory = () => {
    if (!selectedStory) return;
    setCurrentNodeId(selectedStory.startNodeId);
    setVisitedNodes([selectedStory.startNodeId]);
    setSelectedVocabWord(null);
  };

  const currentNode: StoryNode | undefined = selectedStory?.nodes[currentNodeId];

  const handleChoiceSelect = (targetNodeId: string) => {
    setCurrentNodeId(targetNodeId);
    setVisitedNodes((prev) => [...prev, targetNodeId]);
    setSelectedVocabWord(null);

    const nextNode = selectedStory?.nodes[targetNodeId];
    if (nextNode?.isEndNode) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedConversations: Array.from(
          new Set([...(prev.completedConversations || []), `story_${selectedStory?.id}`])
        ),
        dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + 1),
      }));
    }
  };

  return (
    <div id="story-mode-view" className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-purple-100 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            Interactive Branching Fiction
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Story Mode: Choose Your Adventure</h1>
          <p className="text-purple-100 text-base md:text-lg leading-relaxed">
            Read engaging, graded short stories where every dialogue decision shapes your path. Tap on highlighted vocabulary, listen to native audio, and uncover multiple realistic endings.
          </p>
        </div>
      </div>

      {!selectedStory ? (
        /* Story Selector Grid */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose a Story</h2>
            <span className="text-xs text-slate-500 font-medium">All levels available (A1 - C1)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORIES.map((story) => {
              const isCompleted = userProgress.completedConversations?.includes(`story_${story.id}`);
              return (
                <div
                  key={story.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {story.level} Level
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{story.estimatedMinutes} min read</span>
                    </div>

                    <div>
                      <div className="text-3xl mb-2">{story.coverEmoji}</div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{story.theme}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                        {story.synopsis}
                      </p>
                    </div>

                    {story.usefulExpressions && story.usefulExpressions.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Key Expressions:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {story.usefulExpressions.slice(0, 3).map((expr, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                            >
                              {expr}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                    <button
                      onClick={() => startStory(story)}
                      className="ml-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
                    >
                      Begin Story <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Story Reader Interface */
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <button
              onClick={() => setSelectedStory(null)}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 flex items-center gap-1.5"
            >
              ← Back to Stories
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {selectedStory.level}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Step {visitedNodes.length} • {selectedStory.title}
              </span>
            </div>
            <button
              onClick={restartCurrentStory}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              title="Restart story from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>

          {/* Main Story Narrative Card */}
          {currentNode && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-md space-y-8">
              {/* Speaker Header and Audio Button */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-2xl">
                    {currentNode.speakerAvatar || '👤'}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {currentNode.speaker}
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">{currentNode.speakerRole}</span>
                  </div>
                </div>
                <button
                  onClick={() => speakText(`${currentNode.speaker} says: ${currentNode.dialogue}`)}
                  className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors flex items-center gap-2 text-xs font-bold"
                  title="Listen to dialogue"
                >
                  <Volume2 className="w-4 h-4" /> Listen
                </button>
              </div>

              {/* Narration if any */}
              {currentNode.narration && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-sm italic text-slate-600 dark:text-slate-300">
                  {currentNode.narration}
                </div>
              )}

              {/* Dialogue Text */}
              <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                  "{currentNode.dialogue}"
                </p>
              </div>

              {/* Target Words in this Scene */}
              {currentNode.highlightedVocab && currentNode.highlightedVocab.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Vocabulary in this scene (Tap to learn):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentNode.highlightedVocab.map((tw) => (
                      <button
                        key={tw.word}
                        onClick={() => setSelectedVocabWord(tw)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedVocabWord?.word === tw.word
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                        }`}
                      >
                        {tw.word}
                      </button>
                    ))}
                  </div>

                  {selectedVocabWord && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between">
                      <div>
                        <strong>{selectedVocabWord.word}:</strong> {selectedVocabWord.meaning}
                      </div>
                      <button
                        onClick={() => speakText(selectedVocabWord.word)}
                        className="p-1 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Story Branching Choices OR Ending */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                {currentNode.isEndNode ? (
                  /* Story Ending Achieved */
                  <div className="text-center py-6 space-y-4 bg-purple-50 dark:bg-purple-950/20 rounded-3xl border border-purple-200 dark:border-purple-900/40 p-6">
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Adventure Completed!
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                        You successfully completed "{selectedStory.title}". Every story choice tested your English communication instincts.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={restartCurrentStory}
                        className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Play Different Path
                      </button>
                      <button
                        onClick={() => setSelectedStory(null)}
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors"
                      >
                        Explore More Stories
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Interactive Choices */
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      What do you want to say or do next?
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {currentNode.choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoiceSelect(choice.nextNodeId)}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {choice.text}
                            </div>
                            {choice.responsePreview && (
                              <div className="text-xs text-slate-500 mt-0.5">{choice.responsePreview}</div>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
