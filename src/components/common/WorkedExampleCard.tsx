import React, { useState } from 'react';
import { WorkedExampleStep } from '../../data/phasesData';
import { KaTeXMath, RichMathText } from './KaTeXMath';
import { CheckCircle2, ChevronRight, Eye, EyeOff, Lightbulb, Info } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface WorkedExampleCardProps {
  id: string;
  examSource: string;
  problemBadge: string;
  questionLines: string[];
  questionMathLatex?: string;
  hint: string;
  steps: WorkedExampleStep[];
  reviewNote?: string;
  variant?: 'exam' | 'lecture' | 'practice';
}

export const WorkedExampleCard: React.FC<WorkedExampleCardProps> = ({
  id,
  examSource,
  problemBadge,
  questionLines,
  questionMathLatex,
  hint,
  steps,
  reviewNote,
  variant = 'exam',
}) => {
  const { state, markExampleMastered } = useProgress();
  const isMastered = state.completedExamples.includes(id);

  const [showHint, setShowHint] = useState(false);
  const [visibleStepsCount, setVisibleStepsCount] = useState<number>(steps.length);

  const handleShowNextStep = () => {
    setVisibleStepsCount((prev) => {
      const next = Math.min(steps.length, prev + 1);
      if (next === steps.length) {
        markExampleMastered(id);
      }
      return next;
    });
  };

  const handleShowFullSolution = () => {
    if (visibleStepsCount === steps.length) {
      setVisibleStepsCount(0);
    } else {
      setVisibleStepsCount(steps.length);
      markExampleMastered(id);
    }
  };

  const borderStyle =
    variant === 'lecture'
      ? 'border-l-4 border-l-blue-600 bg-blue-50/70 dark:bg-blue-950/25 border-blue-200 dark:border-blue-900'
      : variant === 'practice'
        ? 'border-l-4 border-l-indigo-600 bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
        : 'border-l-4 border-l-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-900';

  return (
    <div className={`p-5 sm:p-6 rounded-xl border ${borderStyle} space-y-4 transition-colors`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/70 dark:border-slate-700 pb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
          {examSource}
        </span>
        <div className="flex items-center gap-2">
          {isMastered && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reviewed
            </span>
          )}
          <span className="text-xs font-mono font-bold text-emerald-950 dark:text-emerald-200 bg-emerald-200/70 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded">
            {problemBadge}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 space-y-1.5">
        <p className="font-bold">Question:</p>
        {questionLines.map((line, idx) => (
          <p key={idx} className="leading-relaxed">
            <RichMathText text={line} />
          </p>
        ))}
        {questionMathLatex && (
          <div className="py-2">
            <KaTeXMath math={questionMathLatex} display />
          </div>
        )}
      </div>

      {/* Interactive Controls: Show Hint / Show Next Step / Show Full Solution */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setShowHint((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:hover:bg-amber-900/80 dark:text-amber-200 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        <button
          type="button"
          onClick={() => {
            if (visibleStepsCount === steps.length) {
              setVisibleStepsCount(1);
            } else {
              handleShowNextStep();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:hover:bg-blue-900/80 dark:text-blue-200 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          {visibleStepsCount === steps.length
            ? 'Step-by-Step Practice Mode (Step 1)'
            : `Show Next Step (${visibleStepsCount}/${steps.length})`}
        </button>

        <button
          type="button"
          onClick={handleShowFullSolution}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          {visibleStepsCount === steps.length ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Hide Full Solution
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Show Full Solution
            </>
          )}
        </button>
      </div>

      {/* Hint Drawer */}
      {showHint && (
        <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200">
          <strong className="font-bold block mb-0.5">Strategy Hint:</strong>
          <RichMathText text={hint} />
        </div>
      )}

      {/* Solution Steps */}
      {visibleStepsCount > 0 && (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-emerald-300 dark:border-slate-700 space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          <div className="font-bold text-emerald-900 dark:text-emerald-300 border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
            <span>Model Exam Solution (Written for Full Marks):</span>
            <span className="text-[11px] font-mono text-slate-500">
              Showing {visibleStepsCount} of {steps.length} steps
            </span>
          </div>

          <div className="space-y-3">
            {steps.slice(0, visibleStepsCount).map((step, sIdx) => (
              <div
                key={sIdx}
                className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5"
              >
                <div className="font-bold text-slate-900 dark:text-white">
                  <RichMathText text={step.title} />
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <RichMathText text={step.explanation} />
                </p>
                {step.mathLatex && (
                  <div className="py-1 overflow-x-auto">
                    <KaTeXMath math={step.mathLatex} display />
                  </div>
                )}
                {step.highlightMathLatex && (
                  <div className="py-1 font-bold text-indigo-700 dark:text-indigo-300 overflow-x-auto">
                    <KaTeXMath math={step.highlightMathLatex} display />
                  </div>
                )}
              </div>
            ))}
          </div>

          {reviewNote && visibleStepsCount === steps.length && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div>
                <RichMathText text={reviewNote} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
