import React from 'react';
import { Link } from '../context/RouterContext';
import { useProgress } from '../context/ProgressContext';
import { PHASE_LESSONS } from '../data/phasesData';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  FlaskConical,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { state, overallProgressPercent, totalUnitsCount, weakTopics } = useProgress();

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Department of Mathematics &amp; ISRT • University of Dhaka
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              First-Year B.S. Honours
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            MATH 104: Differential Calculus — Interactive Masterclass &amp; Exam Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Master single-variable and multivariable differential calculus from formal{' '}
            <span className="font-serif italic">ε–δ</span> limits and continuity to implicit curves,
            total differentials, the multivariable chain rule, 3D Hessian optimization, and
            historical DU exam blueprints — based on the lectures of Dr. Md. Rakib Hossain.
          </p>

          {/* Continue Where You Left Off + Overall Progress Bar */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex flex-col justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                  Continue Where You Left Off
                </div>
                <div className="text-sm font-bold text-white mt-1 truncate">
                  {state.lastVisitedTitle}
                </div>
              </div>
              <Link
                to={state.lastVisitedPath}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors w-fit"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Lesson
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-emerald-300">
                  Overall Course Progress
                </span>
                <span className="font-mono font-bold text-white">
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
                className="w-full h-3 bg-slate-800 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>🔥 Streak: {state.streakDays} day(s)</span>
                <Link to="/progress" className="underline hover:text-white">
                  View Full Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Portal Overview Callout */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
              DU Master Portal
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Full Course Overview, 3D Hessian Theory, Lecture 15 Slides &amp; DU 5-Slot Blueprint
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Explore the complete 5-Module DU Master Portal: 4-Phase Syllabus Roadmap, 3D Surface
            Geometry &amp; Taylor Hessian Proof, Dr. Md. Rakib Hossain Lecture 15 Slide Examples
            3–7, DU 5-Slot Past Exam Blueprints, and Point-Loss Traps.
          </p>
        </div>
        <Link
          to="/overview"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Open Master Overview Hub
        </Link>
      </section>

      {/* 4 Phase Masterclass Lesson Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4-Phase Interactive Masterclass Lessons
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every explanation, formula, ISRT exam solution, and practice problem preserved in
              exact order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PHASE_LESSONS.map((phase) => {
            const completedCount = phase.units.filter((u) =>
              state.completedUnits.includes(u.id)
            ).length;
            const pct = Math.round((completedCount / phase.units.length) * 100);

            return (
              <div
                key={phase.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                      Phase 0{phase.phaseNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {pct === 100 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {completedCount}/{phase.units.length} Units ({pct}%)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {phase.bannerTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {phase.bannerDescription}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Units Included:
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {phase.units.map((u) => (
                        <li key={u.id} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span className="truncate">{u.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    {phase.selfAssessment.length} Self-Assessment Set(s)
                  </span>
                  <Link
                    to={`/lesson/${phase.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Study Phase {phase.phaseNumber}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Tools, Practice, Quiz & Formulas Quick Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/lab"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Interactive Calculus Lab
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Derivative Explorer, Limit Visualizer, Secant-to-Tangent Animator, Step-by-Step Solver,
            and Curve Sketcher.
          </p>
        </Link>

        <Link
          to="/practice"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Worked Practice Problems
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            All ISRT Incourse &amp; Final Exam problems with progressive Hints, Next Step, and Full
            Solutions.
          </p>
        </Link>

        <Link
          to="/quiz"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-colors space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Interactive Quiz Engine
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Multiple-choice and typed algebraic answers with numerical equivalence checking and
            instant feedback.
          </p>
        </Link>

        <Link
          to="/formulas"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-colors space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Formula Cheat-Sheet</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Searchable reference sheet of all theorems, differentiation rules, and DU exam formulas.
          </p>
        </Link>
      </section>

      {/* Weak Topics / Next Recommended Study Section */}
      {weakTopics.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
            Recommended Next Study Focus
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weakTopics.slice(0, 2).map((wt) => (
              <Link
                key={wt.topicId}
                to={wt.route}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{wt.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {wt.reason}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
