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
    <div className="space-y-10">
      <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
            Personal Analytics &amp; Mastery Tracker
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            Student Progress &amp; Exam Readiness Dashboard
          </h1>
        </div>
        <button
          type="button"
          onClick={resetProgress}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-950/30 text-[#991B1B] dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Progress Data
        </button>
      </header>

      {/* KPI Summary Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="academic-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Overall Course Mastery</span>
            <TrendingUp className="w-4 h-4 text-[#0F3D6E] dark:text-sky-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
            {overallProgressPercent}%
          </div>
          <div className="text-xs text-zinc-500">
            {state.completedUnits.length} of {totalUnitsCount} units completed
          </div>
        </div>

        <div className="academic-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Examples Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
            {state.completedExamples.length}
          </div>
          <div className="text-xs text-zinc-500">Worked ISRT &amp; Lecture problems</div>
        </div>

        <div className="academic-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Best Quiz Score</span>
            <Award className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
            {bestQuizPct !== null ? `${bestQuizPct}%` : 'No Attempts'}
          </div>
          <div className="text-xs text-zinc-500">
            {state.quizHistory.length} total quiz attempt(s)
          </div>
        </div>

        <div className="academic-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
            {state.streakDays} {state.streakDays === 1 ? 'Day' : 'Days'}
          </div>
          <div className="text-xs text-zinc-500">Last active: {state.lastStudyDate}</div>
        </div>
      </div>

      {/* Weak Topics / Study Suggestions */}
      <section className="academic-panel p-6 space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          Personalized Study &amp; Weak-Topic Recommendations
        </div>
        {weakTopics.length === 0 ? (
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            All lesson units completed with strong quiz performance across tested topics.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakTopics.map((wt) => (
              <div
                key={wt.topicId}
                className="p-4 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] flex flex-col justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{wt.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{wt.reason}</p>
                </div>
                <Link
                  to={wt.route}
                  className="text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 hover:underline w-fit"
                >
                  Review Topic Now →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Unit-by-Unit Checklist */}
      <section className="academic-panel p-6 space-y-5">
        <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50">
          4-Phase Unit Mastery Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PHASE_LESSONS.map((phase) => (
            <div
              key={phase.id}
              className="p-4 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] space-y-3"
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/lesson/${phase.id}`}
                  className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-[#0F3D6E] dark:hover:text-sky-400"
                >
                  {phase.shortTitle}
                </Link>
                <span className="text-xs font-mono text-zinc-500 tabular-nums">
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
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-md bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] text-left text-xs hover:border-zinc-400 transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                      <span
                        className={
                          done
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-800 dark:text-zinc-200 font-medium'
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
