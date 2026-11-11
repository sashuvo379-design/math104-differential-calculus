import React, { useState } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { PHASE_LESSONS } from '../../data/phasesData';
import { safeGetItem, safeSetItem } from '../../utils/storage';
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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { overallProgressPercent, state } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState<boolean>(() => {
    return safeGetItem<boolean>('math104_sidebar_collapsed', false);
  });

  const toggleDesktopCollapse = () => {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      safeSetItem('math104_sidebar_collapsed', next);
      return next;
    });
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      {/* Top Lucrative Spectrum Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-cyan-400 via-indigo-500 via-purple-500 to-amber-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D1322]/95 backdrop-blur-md border-b border-slate-200 dark:border-cyan-500/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle course navigation sidebar"
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Palette Collapse/Expand Button */}
            <button
              type="button"
              onClick={toggleDesktopCollapse}
              aria-label={desktopCollapsed ? 'Expand navigation palette' : 'Collapse navigation palette'}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/30 transition-all"
              title={desktopCollapsed ? 'Expand Navigation Palette' : 'Collapse Navigation Palette'}
            >
              {desktopCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-cyan-400" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Brand Logo & Author Attribution */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-white/20 transition-transform group-hover:scale-105">
                ∇
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                    MATH 104: Differential Calculus
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded shadow-xs">
                    DU &amp; ISRT Master Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  University of Dhaka • Made &amp; Developed by{' '}
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">Saad, IASDS-32</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Overall Progress Pill */}
            <Link
              to="/progress"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold hover:border-cyan-500/40 transition-colors"
              title="Overall Course Mastery"
            >
              <span className="text-slate-600 dark:text-slate-300">Mastery:</span>
              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {overallProgressPercent}%
              </span>
            </Link>

            {/* Global Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search course content"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/30 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search Course...</span>
            </button>

            {/* Light / Dark Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area with Responsive & Collapsible Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation & Table of Contents */}
        <aside
          aria-label="Course Table of Contents"
          className={`fixed lg:sticky top-[66.5px] left-0 z-30 h-[calc(100vh-4.2rem)] bg-white dark:bg-[#0D1322] border-r border-slate-200 dark:border-cyan-500/15 overflow-y-auto transition-all duration-300 shrink-0 ${
            desktopCollapsed ? 'lg:w-20 p-2.5' : 'lg:w-72 p-4'
          } ${
            sidebarOpen ? 'w-72 translate-x-0 p-4' : 'w-72 -translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            <div>
              {!desktopCollapsed ? (
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 mb-2">
                  <span>Course Navigation</span>
                  <button
                    type="button"
                    onClick={toggleDesktopCollapse}
                    className="hidden lg:inline-block text-slate-400 hover:text-cyan-400 text-[10px] font-semibold"
                    title="Collapse sidebar palette"
                  >
                    Collapse
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex justify-center mb-2">
                  <button
                    type="button"
                    onClick={toggleDesktopCollapse}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 text-[10px]"
                    title="Expand sidebar palette"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </button>
                </div>
              )}

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
                    <div key={item.to} className="relative group">
                      <Link
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center ${
                          desktopCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                        } rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-cyan-600 dark:hover:text-cyan-400'
                        }`}
                        title={desktopCollapsed ? item.label : undefined}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 shrink-0" />
                          {!desktopCollapsed && <span className="truncate">{item.label}</span>}
                        </span>

                        {!desktopCollapsed && phaseDone && (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              active ? 'text-white' : 'text-emerald-500'
                            }`}
                          />
                        )}
                      </Link>

                      {/* Tooltip for desktop collapsed state */}
                      {desktopCollapsed && (
                        <div className="hidden lg:group-hover:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none z-50">
                          {item.label}
                        </div>
                      )}

                      {/* Unit Sub-TOC when viewing a Phase Lesson (expanded only) */}
                      {!desktopCollapsed && active && phaseObj && (
                        <div className="ml-6 mt-1 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                          {phaseObj.units.map((u) => {
                            const done = state.completedUnits.includes(u.id);
                            return (
                              <a
                                key={u.id}
                                href={`#${u.id}`}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center justify-between py-1 px-2 rounded text-[11px] text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
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
            {!desktopCollapsed ? (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/20 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Study Streak</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                    🔥 {state.streakDays} {state.streakDays === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  ISRT &amp; DU MATH 104 Syllabus: Incourse (~25M) + Final Exam (70M).
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>Made &amp; Developed by Saad, IASDS-32</span>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center p-2 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
                <span className="text-sm">🔥</span>
                <span className="text-[10px] font-bold text-amber-400 mt-0.5">{state.streakDays}d</span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-all duration-300">
          {children}
        </main>
      </div>

      {/* Lucrative Global Footer */}
      <footer className="bg-white dark:bg-[#0D1322] border-t border-slate-200 dark:border-cyan-500/20 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <strong className="text-slate-800 dark:text-slate-200">
              MATH 104 Differential Calculus
            </strong>{' '}
            • Department of Mathematics &amp; ISRT, University of Dhaka
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              Made and developed by Saad, IASDS-32
            </span>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
