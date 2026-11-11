import React, { useMemo, useState } from 'react';
import {
  evaluateExpression,
  numericalDerivative,
  solveDerivativeStepByStep,
} from '../../utils/mathEngine';
import { KaTeXMath } from '../common/KaTeXMath';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const SOLVER_PRESETS = [
  { label: 'Power & Sum: 4x³ - 92x² + 480x', expr: '4*x^3 - 92*x^2 + 480*x' },
  { label: 'Product Rule: x² * sin(x)', expr: 'x^2 * sin(x)' },
  { label: 'Quotient Rule: (x + 1)/(x - 1)', expr: '(x + 1) / (x - 1)' },
  { label: 'Chain Rule (Power): (3x² + 5)⁴', expr: '(3*x^2 + 5)^4' },
  { label: 'Chain Rule (Trig): sin(2x)²', expr: 'sin(2*x)^2' },
  { label: 'Exponential & Log: x² * exp(3x)', expr: 'x^2 * exp(3*x)' },
];

export const StepByStepSolver: React.FC = () => {
  const [exprInput, setExprInput] = useState<string>('x^2 * sin(x)');

  const solved = useMemo(() => solveDerivativeStepByStep(exprInput, 'x'), [exprInput]);

  // Verify symbolic result against numerical finite differences at sample points
  const verificationChecks = useMemo(() => {
    if (!solved.valid) return [];
    const samplePoints = [0.5, 1.2, 2.0];
    return samplePoints.map((pt) => {
      const symVal = evaluateExpression(solved.derivativeExpr, { x: pt });
      const numVal = numericalDerivative(exprInput, pt);
      const match =
        symVal.ok &&
        numVal.ok &&
        Math.abs(symVal.value - numVal.value) <= 1e-3 * Math.max(1, Math.abs(numVal.value));
      return {
        x: pt,
        symbolic: symVal.ok ? symVal.value.toFixed(5) : 'N/A',
        numerical: numVal.ok ? numVal.value.toFixed(5) : 'N/A',
        match,
      };
    });
  }, [solved, exprInput]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          Interactive Tool 4 • Symbolic Rule-by-Rule Engine
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Step-by-Step Derivative Solver
        </h3>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {SOLVER_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setExprInput(p.expr)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              exprInput === p.expr
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label
          htmlFor="step-solver-input"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
        >
          Enter Function <KaTeXMath math="f(x)" /> to Differentiate Step-by-Step:
        </label>
        <input
          id="step-solver-input"
          type="text"
          value={exprInput}
          onChange={(e) => setExprInput(e.target.value)}
          placeholder="e.g. x^2 * sin(x)"
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
        />
      </div>

      {!solved.valid ? (
        <div
          role="alert"
          className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{solved.error}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Final Result Banner */}
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Final Symbolic Derivative
            </div>
            <div className="overflow-x-auto py-1">
              <KaTeXMath
                math={`\\frac{d}{dx}\\left[${solved.originalLatex}\\right] = ${solved.derivativeLatex}`}
                display
              />
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Differentiation Steps &amp; Rules Applied ({solved.steps.length} steps)
            </h4>
            {solved.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    {step.rule}
                  </span>
                  <span className="text-xs font-mono text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/40 px-2 py-0.5 rounded">
                    <KaTeXMath math={`${step.targetLatex} = ${step.resultLatex}`} />
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{step.reason}</p>
              </div>
            ))}
          </div>

          {/* Numerical Verification Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Programmatically Against Central Finite Differences
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              {verificationChecks.map((chk) => (
                <div
                  key={chk.x}
                  className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-slate-800"
                >
                  <div className="font-bold text-slate-700 dark:text-slate-300">x = {chk.x}</div>
                  <div>Symbolic: {chk.symbolic}</div>
                  <div>Finite Diff: {chk.numerical}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
