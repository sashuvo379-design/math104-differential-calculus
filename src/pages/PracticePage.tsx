import React, { useEffect, useState } from 'react';
import { PHASE_LESSONS } from '../data/phasesData';
import { WorkedExampleCard } from '../components/common/WorkedExampleCard';
import { checkExpressionEquivalence } from '../utils/mathEngine';
import { useProgress } from '../context/ProgressContext';
import { CheckCircle2, XCircle } from 'lucide-react';

export const PracticePage: React.FC = () => {
  const { recordVisit } = useProgress();
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [scratchInput, setScratchInput] = useState<string>('2*(x + 1)');
  const [scratchTarget, setScratchTarget] = useState<string>('2*x + 2');

  useEffect(() => {
    recordVisit('/practice', 'Worked Practice & Exam Problem Repository');
  }, [recordVisit]);

  const equivalenceCheck = checkExpressionEquivalence(scratchInput, scratchTarget, ['x']);

  const filteredPhases =
    selectedPhase === 'all' ? PHASE_LESSONS : PHASE_LESSONS.filter((p) => p.id === selectedPhase);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Active Recall &amp; Step-by-Step Drills
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Practice Problem Set &amp; ISRT Exam Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Use &ldquo;Show Hint&rdquo;, &ldquo;Step-by-Step Practice Mode&rdquo;, or &ldquo;Show
            Full Solution&rdquo; on any worked example or self-assessment problem below.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Phases (1–4)' },
            { id: 'phase-1', label: 'Phase 1: Limits & Continuity' },
            { id: 'phase-2', label: 'Phase 2: Derivatives & Extrema' },
            { id: 'phase-3', label: 'Phase 3: Total Differentials' },
            { id: 'phase-4', label: 'Phase 4: Chain Rule' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setSelectedPhase(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedPhase === btn.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Algebraic Equivalence Sandbox */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive Equivalence Verifier
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Algebraic Expression Equivalence Checker
          </h2>
          <p className="text-xs text-slate-500">
            Test whether your simplified derivative or difference quotient is mathematically
            equivalent to another form (e.g. <code>2*(x+1)</code> vs <code>2*x+2</code>).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="scratch-user-expr"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Your Expression:
            </label>
            <input
              id="scratch-user-expr"
              type="text"
              value={scratchInput}
              onChange={(e) => setScratchInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div>
            <label
              htmlFor="scratch-target-expr"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
            >
              Target Expression:
            </label>
            <input
              id="scratch-target-expr"
              type="text"
              value={scratchTarget}
              onChange={(e) => setScratchTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            equivalenceCheck.equivalent
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-200'
          }`}
        >
          {equivalenceCheck.equivalent ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Expressions are mathematically equivalent across all test points in the domain!
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {equivalenceCheck.error ||
                  'Expressions are NOT equivalent. Check algebraic simplification or signs.'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Practice Problems by Phase */}
      {filteredPhases.map((phase) => (
        <section key={phase.id} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 pl-3">
            {phase.bannerTitle}
          </h2>

          <div className="space-y-4">
            {phase.selfAssessment.map((sa) => (
              <WorkedExampleCard
                key={sa.id}
                id={sa.id}
                examSource={sa.badge}
                problemBadge={sa.topicTag}
                questionLines={[sa.question]}
                hint={sa.hint}
                steps={sa.steps}
                reviewNote={sa.reviewNote}
                variant="practice"
              />
            ))}

            {phase.units.flatMap((u) =>
              u.workedExamples.map((ex) => (
                <WorkedExampleCard
                  key={ex.id}
                  id={ex.id}
                  examSource={ex.examSource}
                  problemBadge={ex.problemBadge}
                  questionLines={ex.questionLines}
                  questionMathLatex={ex.questionMathLatex}
                  hint={ex.hint}
                  steps={ex.steps}
                  reviewNote={ex.reviewNote}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
