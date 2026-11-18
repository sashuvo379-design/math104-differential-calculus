import React, { useState } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { PHASE_LESSONS } from '../../data/phasesData';
import { SearchModal } from './SearchModal';
import { ChevronDown, Menu, Moon, Search, Sun, X, CheckCircle2, BookOpen } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { overallProgressPercent, state } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [curriculumMenuOpen, setCurriculumMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isLessonRoute = path.startsWith('/lesson/');

  const topLinks = [
    { to: '/', label: 'Syllabus' },
    { to: '/overview', label: 'DU Exam Hub' },
    { to: '/lab', label: 'Calculus & 3D Lab' },
    { to: '/practice', label: 'Practice' },
    { to: '/quiz', label: 'Quizzes' },
    { to: '/formulas', label: 'Formulas' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#0B0E14] text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Top Academic Masthead Bar */}
      <header className="sticky top-0 z-40 h-16 bg-[#FAF9F6]/90 dark:bg-[#0B0E14]/90 backdrop-blur-md border-b border-zinc-200 dark:border-[#242B3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 -ml-2 rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-md bg-[#0F3D6E] dark:bg-zinc-100 text-white dark:text-[#0B0E14] flex items-center justify-center font-serif font-bold text-base tracking-tighter shadow-2xs group-hover:opacity-90 transition-opacity">
                ∂x
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    MATH 104
                  </span>
                  <span className="hidden sm:inline-block text-zinc-300 dark:text-zinc-700">|</span>
                  <span className="hidden sm:inline-block text-xs font-semibold text-zinc-600 dark:text-zinc-400 tracking-tight">
                    Differential Calculus
                  </span>
                </div>
                <span className="hidden md:block text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                  University of Dhaka • Developed by Saad
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Clean Horizontal Top Navigation (Desktop) */}
          <nav
            aria-label="Primary site navigation"
            className="hidden lg:flex items-center gap-1 h-full"
          >
            {topLinks.slice(0, 2).map((item) => {
              const active = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative h-full inline-flex items-center px-3 text-[13px] font-medium transition-colors ${
                    active
                      ? 'text-[#0F3D6E] dark:text-white font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0F3D6E] dark:bg-sky-400" />
                  )}
                </Link>
              );
            })}

            {/* Lessons Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setCurriculumMenuOpen(true)}
              onMouseLeave={() => setCurriculumMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCurriculumMenuOpen((v) => !v)}
                className={`relative h-full inline-flex items-center gap-1 px-3 text-[13px] font-medium transition-colors ${
                  isLessonRoute
                    ? 'text-[#0F3D6E] dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <span>Chapters</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                {isLessonRoute && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0F3D6E] dark:bg-sky-400" />
                )}
              </button>

              {curriculumMenuOpen && (
                <div className="absolute top-16 left-0 w-80 bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] rounded-lg shadow-xl py-2 z-50">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                    4-Phase Masterclass Curriculum
                  </div>
                  {PHASE_LESSONS.map((phase) => {
                    const activePhase = path === `/lesson/${phase.id}`;
                    const doneCount = phase.units.filter((u) =>
                      state.completedUnits.includes(u.id)
                    ).length;
                    return (
                      <Link
                        key={phase.id}
                        to={`/lesson/${phase.id}`}
                        onClick={() => setCurriculumMenuOpen(false)}
                        className={`flex items-start gap-3 px-3.5 py-2.5 text-left transition-colors ${
                          activePhase
                            ? 'bg-zinc-100 dark:bg-zinc-800/80 text-[#0F3D6E] dark:text-sky-400'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-200'
                        }`}
                      >
                        <span className="font-mono text-[11px] font-bold text-zinc-400 mt-0.5">
                          0{phase.phaseNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{phase.shortTitle}</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {doneCount}/{phase.units.length} units completed
                          </div>
                        </div>
                        {doneCount === phase.units.length && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {topLinks.slice(2).map((item) => {
              const active = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative h-full inline-flex items-center px-3 text-[13px] font-medium transition-colors ${
                    active
                      ? 'text-[#0F3D6E] dark:text-white font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0F3D6E] dark:bg-sky-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Utilities (Search, Mastery, Theme) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search course content"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#111622] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-[#242B3D] transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <Link
              to="/progress"
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] hover:border-zinc-300 dark:hover:border-zinc-700 text-xs transition-colors"
              title="View Course Mastery & Dashboard"
            >
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Mastery</span>
              <span className="font-mono font-bold text-[#0F3D6E] dark:text-sky-400 tabular-nums">
                {overallProgressPercent}%
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-md bg-white dark:bg-[#111622] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-[#242B3D] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Clean Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-zinc-200 dark:border-[#242B3D] bg-[#FAF9F6] dark:bg-[#0B0E14] px-4 py-4 space-y-4 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              {topLinks.map((item) => {
                const active = path === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-xs font-semibold border ${
                      active
                        ? 'bg-[#0F3D6E] text-white border-[#0F3D6E]'
                        : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="space-y-1 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1 mb-1">
                Course Chapters
              </div>
              {PHASE_LESSONS.map((phase) => {
                const active = path === `/lesson/${phase.id}`;
                return (
                  <Link
                    key={phase.id}
                    to={`/lesson/${phase.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium ${
                      active
                        ? 'bg-zinc-200/70 dark:bg-zinc-800 text-[#0F3D6E] dark:text-sky-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{phase.shortTitle}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Authoritative Editorial Colophon Footer */}
      <footer className="border-t border-zinc-200 dark:border-[#242B3D] bg-white/60 dark:bg-[#0D1119] py-7 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-serif font-semibold text-zinc-800 dark:text-zinc-200">
              MATH 104: Differential Calculus
            </span>
            <span>•</span>
            <span>Department of Mathematics &amp; ISRT, University of Dhaka</span>
          </div>
          <div className="font-medium text-zinc-700 dark:text-zinc-300">
            Developed by Saad • All rights reserved
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
