import React, { useMemo, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { AchievementToast } from './components/AchievementToast';
import { UserLevel, UserProgress } from './types';

import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { VocabularyView } from './views/VocabularyView';
import { VocabularyLessonView } from './views/VocabularyLessonView';
import { VocabularyPracticeView } from './views/VocabularyPracticeView';
import { SentenceBuilderView } from './views/SentenceBuilderView';
import { SentenceLessonView } from './views/SentenceLessonView';
import { GrammarView } from './views/GrammarView';
import { GrammarLessonView } from './views/GrammarLessonView';
import { ConversationView } from './views/ConversationView';
import { SpeakingPracticeView } from './views/SpeakingPracticeView';
import { NaturalEnglishView } from './views/NaturalEnglishView';
import { DailyChallengeView } from './views/DailyChallengeView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';

// Advanced AI & Interactive Views
import { AITutorView } from './views/AITutorView';
import { MyMistakesView } from './views/MyMistakesView';
import { SayItBetterView } from './views/SayItBetterView';
import { HowDoISayThisView } from './views/HowDoISayThisView';
import { SentenceExpansionView } from './views/SentenceExpansionView';
import { VocabularySRSView } from './views/VocabularySRSView';
import { PhrasalVerbsView } from './views/PhrasalVerbsView';
import { CollocationsView } from './views/CollocationsView';
import { ListeningPracticeView } from './views/ListeningPracticeView';
import { CommunicationSkillsView } from './views/CommunicationSkillsView';
import { CommonDifferencesView } from './views/CommonDifferencesView';
import { AdaptiveQuizView } from './views/AdaptiveQuizView';

// Major Feature Upgrade Views
import { SentencePatternsView } from './views/SentencePatternsView';
import { StoryModeView } from './views/StoryModeView';
import { ReadingLabView } from './views/ReadingLabView';
import { WritingCoachView } from './views/WritingCoachView';
import { PronunciationLabView } from './views/PronunciationLabView';
import { CommonMistakesView } from './views/CommonMistakesView';
import { DailySessionView } from './views/DailySessionView';

// Personal English Coach & Real-Life Communication Views
import { RoadmapView } from './views/RoadmapView';
import { FluencyModeView } from './views/FluencyModeView';
import { MissionsView } from './views/MissionsView';
import { PhoneCallView } from './views/PhoneCallView';
import { VoiceJournalView } from './views/VoiceJournalView';
import { WritingChallengesView } from './views/WritingChallengesView';
import { WeeklyReportView } from './views/WeeklyReportView';
import { EnglishForMyLifeView } from './views/EnglishForMyLifeView';
import { SoundNaturalView } from './views/SoundNaturalView';
import { WordChoiceView } from './views/WordChoiceView';
import { ContextualVocabView } from './views/ContextualVocabView';
import { MyWordsView } from './views/MyWordsView';
import { SmartReviewView } from './views/SmartReviewView';

// AI Course Generator, AI Teacher & Assessment Platform Views
import { CourseGeneratorView } from './views/CourseGeneratorView';
import { CourseRunnerView } from './views/CourseRunnerView';
import { AITeacherLiveView } from './views/AITeacherLiveView';
import { ExamPrepView } from './views/ExamPrepView';
import { MockExamView } from './views/MockExamView';
import { SpeakingAssessmentView } from './views/SpeakingAssessmentView';
import { WritingAssessmentView } from './views/WritingAssessmentView';
import { CertificatesView } from './views/CertificatesView';
import { StructuredProgramsView } from './views/StructuredProgramsView';
import { ContentLibraryView } from './views/ContentLibraryView';
import { MyEnglishNotebookView } from './views/MyEnglishNotebookView';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView, searchOpen, setSearchOpen, placementTestOpen, setPlacementTestOpen, userStats, userProfile, addXP } =
    useApp();

  // Unified bridge for user level & progress across all interactive modules
  const currentCEFRLevel: UserLevel = useMemo(() => {
    const raw = (userProfile.level || 'B1').toUpperCase();
    if (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(raw)) {
      return raw as UserLevel;
    }
    if (raw === 'BEGINNER') return 'A1';
    if (raw === 'ELEMENTARY') return 'A2';
    if (raw === 'INTERMEDIATE') return 'B1';
    if (raw === 'UPPER INTERMEDIATE') return 'B2';
    if (raw === 'ADVANCED') return 'C1';
    return 'B1';
  }, [userProfile.level]);

  const [interactiveProgress, setInteractiveProgress] = useState<UserProgress>({
    level: currentCEFRLevel,
    streakDays: userStats.streak || 3,
    xp: userStats.xp || 420,
    dailyGoal: userStats.dailyGoal || 5,
    dailyGoalProgress: 3,
    completedPatterns: ['pat_want_to', 'pat_need_to'],
    completedWords: ['word_ubiquitous', 'pv_bring_up'],
    completedStories: [],
    completedConversations: ['conv_coffee_shop'],
    totalSentencesConstructed: 18,
  });

  const handleUpdateInteractiveProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setInteractiveProgress((prev) => {
      const next = updater(prev);
      addXP(15, 'Learning milestone completed!');
      return next;
    });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'ai_tutor':
      case 'tutor':
        return <AITutorView />;
      case 'daily_session':
        return (
          <DailySessionView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'sentence_patterns':
        return (
          <SentencePatternsView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'story_mode':
      case 'stories':
        return (
          <StoryModeView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'reading_lab':
        return (
          <ReadingLabView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'writing_coach':
        return (
          <WritingCoachView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'pronunciation_lab':
        return (
          <PronunciationLabView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'common_mistakes':
        return (
          <CommonMistakesView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'my_mistakes':
        return <MyMistakesView />;
      case 'say_it_better':
        return <SayItBetterView />;
      case 'how_do_i_say':
      case 'how_do_i_say_this':
        return <HowDoISayThisView />;
      case 'sentence_expansion':
      case 'sentence_transformation':
        return <SentenceExpansionView />;
      case 'vocab_srs':
      case 'vocabulary_srs':
        return <VocabularySRSView />;
      case 'phrasal_verbs':
        return (
          <PhrasalVerbsView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'collocations':
        return (
          <CollocationsView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'listening':
      case 'listening_practice':
        return <ListeningPracticeView />;
      case 'communication_skills':
        return (
          <CommunicationSkillsView
            userLevel={currentCEFRLevel}
            userProgress={interactiveProgress}
            onUpdateProgress={handleUpdateInteractiveProgress}
          />
        );
      case 'common_differences':
        return <CommonDifferencesView />;
      case 'adaptive_quiz':
        return <AdaptiveQuizView />;
      case 'roadmap':
      case 'my_roadmap':
        return <RoadmapView />;
      case 'fluency_mode':
      case 'fluency':
        return <FluencyModeView />;
      case 'missions':
      case 'real_life_missions':
        return <MissionsView />;
      case 'phone_call':
      case 'phone_call_simulator':
        return <PhoneCallView />;
      case 'voice_journal':
        return <VoiceJournalView />;
      case 'writing_challenges':
        return <WritingChallengesView />;
      case 'weekly_report':
        return <WeeklyReportView />;
      case 'english_for_my_life':
      case 'life_curriculum':
        return <EnglishForMyLifeView />;
      case 'sound_natural':
      case 'sound_more_natural':
        return <SoundNaturalView />;
      case 'word_choice':
      case 'word_choice_nuance':
        return <WordChoiceView />;
      case 'contextual_vocab':
      case 'contextual_vocabulary':
        return <ContextualVocabView />;
      case 'my_words':
      case 'saved_words':
        return <MyWordsView />;
      case 'smart_review':
      case 'weak_areas_review':
        return <SmartReviewView />;
      case 'course_generator':
        return <CourseGeneratorView />;
      case 'course_runner':
        return <CourseRunnerView />;
      case 'ai_teacher':
        return <AITeacherLiveView />;
      case 'exam_prep':
        return <ExamPrepView />;
      case 'mock_exam':
        return <MockExamView />;
      case 'speaking_assessment':
        return <SpeakingAssessmentView />;
      case 'writing_assessment':
        return <WritingAssessmentView />;
      case 'certificates':
        return <CertificatesView />;
      case 'structured_programs':
        return <StructuredProgramsView />;
      case 'content_library':
        return <ContentLibraryView />;
      case 'my_notebook':
        return <MyEnglishNotebookView />;
      case 'vocabulary':
        return <VocabularyView />;
      case 'vocab_lesson':
      case 'vocabulary_lesson':
        return <VocabularyLessonView />;
      case 'vocab_practice':
      case 'vocabulary_practice':
        return <VocabularyPracticeView />;
      case 'sentence_builder':
        return <SentenceBuilderView />;
      case 'sentence_lesson':
        return <SentenceLessonView />;
      case 'grammar':
        return <GrammarView />;
      case 'grammar_lesson':
        return <GrammarLessonView />;
      case 'conversation':
        return <ConversationView />;
      case 'speaking':
      case 'speaking_practice':
        return <SpeakingPracticeView />;
      case 'natural_english':
        return <NaturalEnglishView />;
      case 'daily_challenge':
        return <DailyChallengeView />;
      case 'progress':
        return <ProgressView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // If on landing view, render clean full-width landing page without sidebars
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <LandingView />
        <PlacementTestModal
          isOpen={placementTestOpen}
          onClose={() => setPlacementTestOpen(false)}
        />
        <AchievementToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <PlacementTestModal
        isOpen={placementTestOpen}
        onClose={() => setPlacementTestOpen(false)}
      />
      <AchievementToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
