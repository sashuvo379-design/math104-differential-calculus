import React, { useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { PHASE_LESSONS } from '../data/phasesData';
import { Link } from '../context/RouterContext';
import { Award, CheckCircle2, Circle, Flame, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const {
    state,
    totalUnitsCount,
    overallProgressPercent,
    toggleUnitComplete,
    weakTopics,
    resetProgress,
    recordVisit,
  } = useProgress();

  useEffect(() => {
    recordVisit('/progress', 'Student Progress & Mastery Dashboard');
  }, [recordVisit]);

  const bestQuizPct =
    state.quizHistory.length > 0 ? Math.max(...state.quizHistory.map((q) => q.percentage)) : null;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Personal Analytics &amp; Mastery Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Student Progress &amp; Exam Readiness Dashboard
          </h1>
        </div>
        <button
          type="button"
          onClick={resetProgress}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Progress Data
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Overall Course Mastery</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {overallProgressPercent}%
          </div>
          <div className="text-xs text-slate-500">
            {state.completedUnits.length} of {totalUnitsCount} units completed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Examples Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {state.completedExamples.length}
          </div>
          <div className="text-xs text-slate-500">Worked ISRT &amp; Lecture problems</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Best Quiz Score</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {bestQuizPct !== null ? `${bestQuizPct}%` : 'No Attempts'}
          </div>
          <div className="text-xs text-slate-500">
            {state.quizHistory.length} total quiz attempt(s)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {state.streakDays} {state.streakDays === 1 ? 'Day' : 'Days'}
          </div>
          <div className="text-xs text-slate-500">Last active: {state.lastStudyDate}</div>
        </div>
      </div>

      {/* Weak Topics / Study Suggestions */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-4 h-4" />
          Personalized Study &amp; Weak-Topic Recommendations
        </div>
        {weakTopics.length === 0 ? (
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            🎉 You have completed all lesson units and achieved ≥80% accuracy across all tested
            topics!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakTopics.map((wt) => (
              <div
                key={wt.topicId}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{wt.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{wt.reason}</p>
                </div>
                <Link
                  to={wt.route}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline w-fit"
                >
                  Review Topic Now →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Unit-by-Unit Checklist */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          4-Phase Unit Mastery Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PHASE_LESSONS.map((phase) => (
            <div
              key={phase.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/lesson/${phase.id}`}
                  className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600"
                >
                  {phase.shortTitle}
                </Link>
                <span className="text-xs font-mono text-slate-500">
                  {phase.units.filter((u) => state.completedUnits.includes(u.id)).length}/
                  {phase.units.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {phase.units.map((u) => {
                  const done = state.completedUnits.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleUnitComplete(u.id)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs hover:border-blue-400 transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span
                        className={
                          done
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200 font-medium'
                        }
                      >
                        {u.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
