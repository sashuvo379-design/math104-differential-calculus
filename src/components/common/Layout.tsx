import React, { useState } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { PHASE_LESSONS } from '../../data/phasesData';
import { SearchModal } from './SearchModal';
import {
  BookOpen,
  Compass,
  FileSpreadsheet,
  FlaskConical,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sun,
  Trophy,
  X,
  CheckCircle2,
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { overallProgressPercent, state } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home & Course Hub', icon: Home },
    { to: '/overview', label: 'Master Portal & DU Slots', icon: Compass },
    {
      to: '/lesson/phase-1',
      label: 'Phase 1: Limits & Continuity',
      icon: BookOpen,
      phaseId: 'phase-1',
    },
    {
      to: '/lesson/phase-2',
      label: 'Phase 2: Derivatives & Extrema',
      icon: BookOpen,
      phaseId: 'phase-2',
    },
    {
      to: '/lesson/phase-3',
      label: 'Phase 3: Total Differentials',
      icon: BookOpen,
      phaseId: 'phase-3',
    },
    {
      to: '/lesson/phase-4',
      label: 'Phase 4: Multivariable Chain Rule',
      icon: BookOpen,
      phaseId: 'phase-4',
    },
    { to: '/lab', label: 'Interactive Calculus Lab', icon: FlaskConical },
    { to: '/practice', label: 'Practice Problem Set', icon: GraduationCap },
    { to: '/quiz', label: 'Assessment Quiz Engine', icon: Trophy },
    { to: '/formulas', label: 'Formula Cheat-Sheet', icon: FileSpreadsheet },
    { to: '/progress', label: 'Progress & Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle course navigation sidebar"
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-sm transition-colors">
                ∇
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    MATH 104: Differential Calculus
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white rounded">
                    DU &amp; ISRT Master Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  University of Dhaka • Interactive Learning &amp; Exam Hub
                </p>
              </div>
            </Link>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Overall Progress Pill */}
            <Link
              to="/progress"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              title="Overall Course Mastery"
            >
              <span className="text-slate-600 dark:text-slate-300">Mastery:</span>
              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {overallProgressPercent}%
              </span>
            </Link>

            {/* Global Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search course content"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search Course...</span>
            </button>

            {/* Light / Dark Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area with Responsive Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation & Table of Contents */}
        <aside
          aria-label="Course Table of Contents"
          className={`fixed lg:sticky top-16 left-0 z-30 w-72 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 transition-transform lg:translate-x-0 shrink-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 mb-2">
                Course Navigation
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = path === item.to;
                  const phaseObj = item.phaseId
                    ? PHASE_LESSONS.find((p) => p.id === item.phaseId)
                    : undefined;
                  const phaseDone =
                    phaseObj && phaseObj.units.every((u) => state.completedUnits.includes(u.id));

                  return (
                    <div key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {phaseDone && (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              active ? 'text-white' : 'text-emerald-500'
                            }`}
                          />
                        )}
                      </Link>

                      {/* Unit Sub-TOC when viewing a Phase Lesson */}
                      {active && phaseObj && (
                        <div className="ml-6 mt-1 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                          {phaseObj.units.map((u) => {
                            const done = state.completedUnits.includes(u.id);
                            return (
                              <a
                                key={u.id}
                                href={`#${u.id}`}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center justify-between py-1 px-2 rounded text-[11px] text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <span className="truncate">
                                  {u.title.replace(/^Unit \d\.\d:\s*/, '')}
                                </span>
                                {done && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                )}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Study Streak & Exam Info Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Study Streak</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                  🔥 {state.streakDays} {state.streakDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                ISRT &amp; DU MATH 104 Syllabus: Incourse (~25M) + Final Exam (70M). All original
                lessons &amp; Dr. Md. Rakib Hossain lecture problems preserved.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <strong className="text-slate-700 dark:text-slate-300">
              MATH 104 Differential Calculus
            </strong>{' '}
            • Department of Mathematics &amp; ISRT, University of Dhaka
          </div>
          <div>First-Year B.S. Honours • Interactive Academic Masterclass &amp; Exam Hub</div>
        </div>
      </footer>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
