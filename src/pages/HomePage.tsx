import React from 'react';
import { Link } from '../context/RouterContext';
import { useProgress } from '../context/ProgressContext';
import { PHASE_LESSONS } from '../data/phasesData';
import {
  ArrowRight,
  BookOpen,
  Box,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  FlaskConical,
  GraduationCap,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { state, overallProgressPercent, totalUnitsCount, weakTopics } = useProgress();

  return (
    <div className="space-y-14">
      {/* Architectural Editorial Masthead */}
      <section className="relative editorial-dot-grid rounded-lg border border-zinc-200 dark:border-[#242B3D] bg-white dark:bg-[#111622] p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Title, Academic Authority & Primary Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              <span className="text-[#0F3D6E] dark:text-sky-400">
                University of Dhaka • Dept. of Mathematics &amp; ISRT
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span>First-Year B.S. Honours</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12]">
              MATH 104: Differential Calculus
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              An interactive academic platform covering single-variable and multivariable
              differential calculus — from formal <span className="font-serif italic">ε–δ</span>{' '}
              limit proofs and continuity to implicit curves, total differentials, the multivariable
              chain rule, 3D Hessian optimization, and historical DU exam blueprints, based on the
              lectures of Dr. Md. Rakib Hossain.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={state.lastVisitedPath}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold bg-[#0F3D6E] hover:bg-[#0A2A4D] dark:bg-sky-600 dark:hover:bg-sky-500 text-white transition-colors shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Study
              </Link>

              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold bg-white dark:bg-[#0B0E14] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
              >
                <Box className="w-3.5 h-3.5 text-[#0F3D6E] dark:text-sky-400" />
                Open 3D &amp; Visual Lab
              </Link>

              <Link
                to="/overview"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 hover:underline"
              >
                <span>DU 5-Slot Exam Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Structured Progress & Resume Ledger */}
          <div className="lg:col-span-5 bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] rounded-md divide-y divide-zinc-200 dark:divide-[#242B3D]">
            {/* Row 1: Continue Where You Left Off */}
            <div className="p-4 sm:p-5 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Continue Where You Left Off
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {state.lastVisitedTitle}
                </div>
                <Link
                  to={state.lastVisitedPath}
                  className="text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 hover:underline shrink-0"
                >
                  Open →
                </Link>
              </div>
            </div>

            {/* Row 2: Overall Course Progress */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-widest text-[10px] text-zinc-500 dark:text-zinc-400">
                  Overall Course Progress
                </span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {state.completedUnits.length} / {totalUnitsCount} Units ({overallProgressPercent}
                  %)
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={overallProgressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Overall course completion percentage"
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden"
              >
                <div
                  className="h-full bg-[#0F3D6E] dark:bg-sky-500 transition-all duration-300"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Row 3: Tabular Telemetry */}
            <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-[#242B3D] text-xs">
              <div className="p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Study Streak
                </div>
                <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5 tabular-nums">
                  {state.streakDays} {state.streakDays === 1 ? 'Day' : 'Days'}
                </div>
              </div>
              <Link
                to="/progress"
                className="p-4 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 transition-colors flex flex-col justify-center"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Analytics
                </div>
                <div className="text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 mt-0.5">
                  View Dashboard →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Syllabus Index */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 dark:border-[#242B3D] pb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Course Modules
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
              4-Phase Curriculum Index
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            All original definitions, worked ISRT exam solutions, and proofs preserved verbatim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 dark:bg-[#242B3D] border border-zinc-200 dark:border-[#242B3D] rounded-lg overflow-hidden">
          {PHASE_LESSONS.map((phase) => {
            const completedCount = phase.units.filter((u) =>
              state.completedUnits.includes(u.id)
            ).length;
            const pct = Math.round((completedCount / phase.units.length) * 100);

            return (
              <div
                key={phase.id}
                className="bg-white dark:bg-[#111622] p-6 sm:p-7 flex flex-col justify-between gap-5 hover:bg-[#FAF9F6] dark:hover:bg-[#151B2B] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-wider text-[#0F3D6E] dark:text-sky-400">
                      PHASE 0{phase.phaseNumber}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 tabular-nums">
                      {pct === 100 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {completedCount}/{phase.units.length} Units
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {phase.bannerTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {phase.bannerDescription}
                  </p>

                  <ul className="pt-2 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-300">
                    {phase.units.map((u) => {
                      const done = state.completedUnits.includes(u.id);
                      return (
                        <li key={u.id} className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              done ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                            }`}
                          />
                          <span className="truncate">{u.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    {phase.selfAssessment.length} Assessment Set(s)
                  </span>
                  <Link
                    to={`/lesson/${phase.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Master DU Portal & 3D Lab Strip */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="academic-panel p-6 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#991B1B] dark:text-rose-400">
              DU Exam Blueprint &amp; Lectures
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Full Course Overview, Lecture 15 Slides &amp; DU 5-Slot Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Review the 5-Module DU Master Portal: 4-Phase Syllabus Roadmap, Taylor Hessian Proof,
              Dr. Md. Rakib Hossain Lecture 15 Slide Examples 3–7, DU 5-Slot Past Exam Blueprints,
              and Point-Loss Traps.
            </p>
          </div>
          <div>
            <Link
              to="/overview"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
            >
              <Compass className="w-3.5 h-3.5" />
              Open Master Overview Portal
            </Link>
          </div>
        </div>

        <div className="academic-panel p-6 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
              Interactive WebGL &amp; Symbolic Engine
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50">
              3D Multivariable Surface Grapher &amp; Visual Calculus Lab
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Rotate, pan, and zoom 3D surfaces in real time. Inspect saddle points (z = x² − y²),
              paraboloids (z = x² + y²), Slide Examples 5 &amp; 7, horizontal tangent planes, and
              single-variable difference quotients.
            </p>
          </div>
          <div>
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 text-white hover:opacity-90 transition-opacity"
            >
              <Box className="w-3.5 h-3.5" />
              Launch 3D &amp; Visual Lab
            </Link>
          </div>
        </div>
      </section>

      {/* Practice, Quiz, & Reference Workbench */}
      <section className="space-y-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Academic Workbench
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/lab" className="academic-panel p-5 space-y-2 group">
            <FlaskConical className="w-5 h-5 text-[#0F3D6E] dark:text-sky-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#0F3D6E] dark:group-hover:text-sky-400 transition-colors">
              Interactive Calculus Lab
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              3D Surface Grapher, Derivative Explorer, Limit Visualizer, and Curve Sketcher.
            </p>
          </Link>

          <Link to="/practice" className="academic-panel p-5 space-y-2 group">
            <GraduationCap className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              Worked Practice Problems
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              All ISRT Incourse &amp; Final Exam problems with step-by-step hints and verification.
            </p>
          </Link>

          <Link to="/quiz" className="academic-panel p-5 space-y-2 group">
            <Trophy className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              Assessment Quiz Engine
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Multiple-choice and typed algebraic expressions checked numerically at domain points.
            </p>
          </Link>

          <Link to="/formulas" className="academic-panel p-5 space-y-2 group">
            <FileSpreadsheet className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#0F3D6E] dark:group-hover:text-sky-400 transition-colors">
              Formula Cheat-Sheet
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Searchable theorem and derivative reference compendium across Phases 1–4.
            </p>
          </Link>
        </div>
      </section>

      {/* Weak Topics / Next Recommended Study Section */}
      {weakTopics.length > 0 && (
        <section className="academic-panel p-6 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-[#0F3D6E] dark:text-sky-400" />
            <span>Recommended Next Study Focus</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weakTopics.slice(0, 2).map((w) => (
              <div
                key={w.topicId}
                className="p-4 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {w.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {w.reason}
                  </div>
                </div>
                <Link
                  to={w.route}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 text-white shrink-0 hover:opacity-90 transition-opacity"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
