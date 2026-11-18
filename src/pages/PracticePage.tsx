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
    <div className="space-y-10">
      <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-6 space-y-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Active Recall &amp; Step-by-Step Drills
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            Practice Problem Set &amp; ISRT Exam Solutions
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl">
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
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                selectedPhase === btn.id
                  ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E]'
                  : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </header>

      {/* Interactive Algebraic Equivalence Sandbox */}
      <div className="academic-panel p-6 space-y-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
            Interactive Equivalence Verifier
          </div>
          <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Algebraic Expression Equivalence Checker
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Test whether your simplified derivative or difference quotient is mathematically
            equivalent to another form (e.g. <code>2*(x+1)</code> vs <code>2*x+2</code>).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="scratch-user-expr"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Your Expression:
            </label>
            <input
              id="scratch-user-expr"
              type="text"
              value={scratchInput}
              onChange={(e) => setScratchInput(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-[#242B3D] bg-[#FAF9F6] dark:bg-[#0B0E14] text-xs font-mono"
            />
          </div>
          <div>
            <label
              htmlFor="scratch-target-expr"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Target Expression:
            </label>
            <input
              id="scratch-target-expr"
              type="text"
              value={scratchTarget}
              onChange={(e) => setScratchTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-[#242B3D] bg-[#FAF9F6] dark:bg-[#0B0E14] text-xs font-mono"
            />
          </div>
        </div>

        <div
          className={`p-3 rounded-md border text-xs font-semibold flex items-center gap-2 ${
            equivalenceCheck.equivalent
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
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
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50 border-l-2 border-[#0F3D6E] dark:border-sky-400 pl-3">
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
