import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  GraduationCap,
  MessageSquare,
  Mic,
  Sparkles,
  Flame,
  BarChart3,
  User,
  Settings,
  Compass,
  Headphones,
  Puzzle,
  Link2,
  Globe,
  Clock,
  HelpCircle,
  Zap,
  PenTool,
  BookMarked,
  Gamepad2,
  AlertTriangle,
  Repeat,
  Phone,
  TrendingUp,
  Briefcase,
  RotateCcw,
  Calendar,
  Award,
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, isDailyChallengeCompleted, userStats, userProfile } = useApp();

  const unmasteredMistakes = userStats.mistakes?.filter((m) => !m.mastered).length || 0;

  const navItems: { section: string; items: NavItem[] }[] = [
    {
      section: 'AI Course & Teacher Platform',
      items: [
        { id: 'course_generator', label: 'AI Course Generator', icon: <Sparkles size={18} className="text-indigo-500" />, badge: 'New AI' },
        { id: 'course_runner', label: 'Active Course Study', icon: <BookOpen size={18} className="text-blue-500" />, badge: '5-Step' },
        { id: 'ai_teacher', label: 'Sarah (AI Live Teacher)', icon: <MessageSquare size={18} className="text-purple-500" />, badge: 'Live' },
        { id: 'content_library', label: 'Curriculum Library', icon: <BookMarked size={18} className="text-teal-500" /> },
        { id: 'structured_programs', label: '30/60/90 Day Programs', icon: <Calendar size={18} className="text-emerald-500" /> },
        { id: 'my_notebook', label: 'My English Notebook', icon: <BookOpen size={18} className="text-amber-500" />, badge: 'SRS' },
      ],
    },
    {
      section: 'AI Exams & Certifications',
      items: [
        { id: 'exam_prep', label: 'AI Exam Prep (IELTS/TOEFL/WAEC)', icon: <GraduationCap size={18} className="text-amber-500" />, badge: 'Exam' },
        { id: 'speaking_assessment', label: 'AI Speaking Assessment', icon: <Mic size={18} className="text-emerald-500" />, badge: 'Diagnostic' },
        { id: 'writing_assessment', label: 'AI Writing Assessment', icon: <PenTool size={18} className="text-purple-500" /> },
        { id: 'certificates', label: 'Verified Certificates', icon: <Award size={18} className="text-yellow-500" />, badge: 'Cert' },
      ],
    },
    {
      section: 'Personal Coach & Roadmap',
      items: [
        { id: 'roadmap', label: 'My 30-Day Roadmap', icon: <Calendar size={18} className="text-indigo-500" />, badge: 'AI Plan' },
        { id: 'fluency_mode', label: 'Fluency Mode (Speech)', icon: <Mic size={18} className="text-emerald-500" />, badge: 'Live' },
        { id: 'missions', label: 'Real-Life Missions', icon: <Compass size={18} className="text-blue-500" />, badge: 'Tasks' },
        { id: 'phone_call', label: 'AI Phone Call Sim', icon: <Phone size={18} className="text-teal-500" />, badge: 'Audio' },
        { id: 'voice_journal', label: 'My Voice Journal', icon: <Sparkles size={18} className="text-purple-500" />, badge: 'Diary' },
        { id: 'weekly_report', label: 'Weekly Report', icon: <TrendingUp size={18} className="text-amber-500" /> },
      ],
    },
    {
      section: 'Real-Life Situations & Nuance',
      items: [
        { id: 'english_for_my_life', label: 'English For My Life', icon: <Briefcase size={18} className="text-blue-600" />, badge: 'Custom' },
        { id: 'sound_natural', label: 'Sound More Natural', icon: <Sparkles size={18} className="text-amber-500" /> },
        { id: 'word_choice', label: 'Word Choice Nuance', icon: <Layers size={18} className="text-violet-500" /> },
        { id: 'contextual_vocab', label: 'Contextual Vocab', icon: <BookOpen size={18} className="text-emerald-500" /> },
        { id: 'writing_challenges', label: 'Writing Challenges', icon: <PenTool size={18} className="text-cyan-500" /> },
        { id: 'smart_review', label: 'Smart Review (SRS)', icon: <RotateCcw size={18} className="text-rose-500" /> },
        { id: 'my_words', label: 'My Saved Words', icon: <BookMarked size={18} className="text-indigo-500" /> },
      ],
    },
    {
      section: 'AI Personal Tutor & Memory',
      items: [
        { id: 'voice_tutor', label: 'AI Voice Tutor (Alex)', icon: <Mic size={18} className="text-emerald-500 animate-pulse" />, badge: 'Voice' },
        { id: 'tutor_memory', label: 'My AI Tutor Memory', icon: <Sparkles size={18} className="text-indigo-500" />, badge: 'Memory' },
        { id: 'ai_diagnostics', label: 'Skill Diagnostics', icon: <Zap size={18} className="text-amber-500" />, badge: 'Diagnostic' },
        { id: 'emergency_help', label: 'I Need English Now', icon: <AlertTriangle size={18} className="text-rose-500" />, badge: 'Urgent' },
        { id: 'word_retrieval', label: 'Word Retrieval Gym', icon: <BookOpen size={18} className="text-blue-500" />, badge: 'Recall' },
        { id: 'ai_tutor', label: 'Alex (Chat Tutor)', icon: <MessageSquare size={18} className="text-purple-500" /> },
        { id: 'daily_session', label: '15-Min Daily Routine', icon: <Clock size={18} className="text-blue-500" />, badge: 'Daily' },
        { id: 'writing_coach', label: 'AI Writing Coach', icon: <PenTool size={18} className="text-violet-500" /> },
        { id: 'say_it_better', label: 'Say It Better', icon: <MessageSquare size={18} className="text-emerald-500" /> },
        { id: 'how_do_i_say', label: 'How Do I Say This?', icon: <HelpCircle size={18} /> },
        {
          id: 'my_mistakes',
          label: 'My Mistakes Book',
          icon: <BookOpen size={18} className="text-rose-500" />,
          badge: unmasteredMistakes > 0 ? `${unmasteredMistakes}` : undefined,
        },
      ],
    },
    {
      section: 'Core Language & Patterns',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'sentence_patterns', label: 'Sentence Patterns', icon: <Repeat size={18} className="text-indigo-500" />, badge: 'New' },
        { id: 'reading_lab', label: 'Reading Lab', icon: <BookMarked size={18} className="text-teal-500" />, badge: 'Read' },
        { id: 'story_mode', label: 'Interactive Stories', icon: <Gamepad2 size={18} className="text-amber-500" />, badge: 'RPG' },
        { id: 'sentence_builder', label: 'Sentence Builder', icon: <Layers size={18} /> },
        { id: 'vocabulary', label: 'Vocabulary Explorer', icon: <BookOpen size={18} /> },
        { id: 'phrasal_verbs', label: 'Phrasal Verbs', icon: <Puzzle size={18} className="text-orange-500" /> },
        { id: 'collocations', label: 'Collocations (Make/Do)', icon: <Link2 size={18} className="text-pink-500" /> },
        { id: 'common_mistakes', label: 'Common Mistakes', icon: <AlertTriangle size={18} className="text-red-500" /> },
        { id: 'grammar', label: 'Grammar Guide', icon: <GraduationCap size={18} /> },
      ],
    },
    {
      section: 'Speaking & Communication',
      items: [
        { id: 'pronunciation_lab', label: 'Pronunciation Lab', icon: <Mic size={18} className="text-cyan-500" />, badge: 'Audio' },
        { id: 'speaking', label: 'Speaking Practice', icon: <Mic size={18} /> },
        { id: 'listening', label: 'Listening Practice', icon: <Headphones size={18} /> },
        { id: 'communication_skills', label: 'Real-Life Skills', icon: <Compass size={18} className="text-emerald-500" /> },
        { id: 'common_differences', label: 'Global vs Regional', icon: <Globe size={18} /> },
        { id: 'adaptive_quiz', label: 'CEFR Diagnostic', icon: <Zap size={18} className="text-amber-500" /> },
        {
          id: 'daily_challenge',
          label: 'Daily Challenge',
          icon: <Flame size={18} className="text-orange-500" />,
          badge: isDailyChallengeCompleted ? 'Done' : '+35 XP',
        },
      ],
    },
    {
      section: 'Account & Analytics',
      items: [
        { id: 'progress', label: 'Progress & Stats', icon: <BarChart3 size={18} /> },
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  // Level progress percentage estimation
  const xpInCurrentLevel = userStats.xp % 500;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));
  const xpNeeded = 500 - xpInCurrentLevel;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 min-h-[calc(100vh-5rem)]">
      {/* Brand Icon & Name */}
      <div
        className="flex items-center gap-3 mb-8 cursor-pointer select-none group"
        onClick={() => setCurrentView('dashboard')}
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
          L
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 block">
            LingoFlow
          </span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
            FluentStep Professional
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-6 flex-1 overflow-y-auto pr-1 scrollbar-none">
        {navItems.map((group, gIdx) => (
          <div key={gIdx}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  currentView === item.id ||
                  (item.id === 'vocabulary' && (currentView === 'vocab_lesson' || currentView === 'vocab_practice')) ||
                  (item.id === 'sentence_builder' && currentView === 'sentence_lesson') ||
                  (item.id === 'grammar' && currentView === 'grammar_lesson');

                return (
                  <button
                    key={item.id}
                    id={`sidebar_link_${item.id}`}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : item.badge === 'Done'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Level Progress Widget */}
      <div className="mt-auto pt-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Current Level</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{userProfile.level}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center uppercase font-bold tracking-tight">
            {xpNeeded} XP to Next Level
          </p>
        </div>
      </div>
    </aside>
  );
};
