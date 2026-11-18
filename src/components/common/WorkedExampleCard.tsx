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
      ? 'border-l-2 border-l-[#0F3D6E] dark:border-l-sky-400'
      : variant === 'practice'
        ? 'border-l-2 border-l-zinc-500 dark:border-l-zinc-400'
        : 'border-l-2 border-l-emerald-700 dark:border-l-emerald-400';

  return (
    <div
      className={`p-5 sm:p-6 rounded-md bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] ${borderStyle} space-y-4`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-[#242B3D] pb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
          {examSource}
        </span>
        <div className="flex items-center gap-2">
          {isMastered && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reviewed
            </span>
          )}
          <span className="text-[11px] font-mono font-semibold text-[#0F3D6E] dark:text-sky-300 bg-[#F0F4F8] dark:bg-[#161F30] px-2.5 py-0.5 rounded-sm border border-zinc-200 dark:border-zinc-700">
            {problemBadge}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 space-y-1.5">
        <p className="font-bold text-zinc-900 dark:text-zinc-50">Problem Statement</p>
        {questionLines.map((line, idx) => (
          <p key={idx} className="leading-relaxed text-zinc-700 dark:text-zinc-300">
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF9F6] dark:bg-[#0B0E14] text-amber-800 dark:text-amber-300 border border-zinc-300 dark:border-zinc-700 hover:border-amber-500 transition-colors"
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF9F6] dark:bg-[#0B0E14] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 text-[#0F3D6E] dark:text-sky-400" />
          {visibleStepsCount === steps.length
            ? 'Step-by-Step Practice Mode (Step 1)'
            : `Show Next Step (${visibleStepsCount}/${steps.length})`}
        </button>

        <button
          type="button"
          onClick={handleShowFullSolution}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 hover:opacity-90 text-white transition-opacity"
        >
          {visibleStepsCount === steps.length ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Hide Solution
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
        <div className="p-3.5 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-zinc-800 dark:text-zinc-200">
          <strong className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
            Strategy Hint:
          </strong>
          <RichMathText text={hint} />
        </div>
      )}

      {/* Solution Steps */}
      {visibleStepsCount > 0 && (
        <div className="bg-[#FAF9F6] dark:bg-[#0B0E14] p-4 sm:p-5 rounded-md border border-zinc-200 dark:border-[#242B3D] space-y-4 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-[#242B3D] pb-2 flex justify-between items-center">
            <span>Model Exam Solution</span>
            <span className="text-[11px] font-mono text-zinc-500">
              {visibleStepsCount} / {steps.length} steps
            </span>
          </div>

          <div className="space-y-3 divide-y divide-zinc-200 dark:divide-[#242B3D]">
            {steps.slice(0, visibleStepsCount).map((step, sIdx) => (
              <div key={sIdx} className={`${sIdx > 0 ? 'pt-3' : ''} space-y-1.5`}>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  <RichMathText text={step.title} />
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <RichMathText text={step.explanation} />
                </p>
                {step.mathLatex && (
                  <div className="py-1 overflow-x-auto">
                    <KaTeXMath math={step.mathLatex} display />
                  </div>
                )}
                {step.highlightMathLatex && (
                  <div className="py-1.5 px-3 bg-[#F0F4F8] dark:bg-[#131C2E] border-l-2 border-[#0F3D6E] dark:border-sky-400 font-bold text-[#0F3D6E] dark:text-sky-300 overflow-x-auto rounded-r-sm">
                    <KaTeXMath math={step.highlightMathLatex} display />
                  </div>
                )}
              </div>
            ))}
          </div>

          {reviewNote && visibleStepsCount === steps.length && (
            <div className="p-3 rounded-md bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0F3D6E] dark:text-sky-400" />
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
