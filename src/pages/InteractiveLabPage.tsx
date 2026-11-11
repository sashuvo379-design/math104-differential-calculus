import React, { useEffect } from 'react';
import { DerivativeExplorer } from '../components/interactive/DerivativeExplorer';
import { LimitVisualizer } from '../components/interactive/LimitVisualizer';
import { SecantToTangent } from '../components/interactive/SecantToTangent';
import { StepByStepSolver } from '../components/interactive/StepByStepSolver';
import { OptimizationSketcher } from '../components/interactive/OptimizationSketcher';
import { HessianExplorer } from '../components/interactive/HessianExplorer';
import { useProgress } from '../context/ProgressContext';

export const InteractiveLabPage: React.FC = () => {
  const { recordVisit } = useProgress();

  useEffect(() => {
    recordVisit('/lab', 'Interactive Calculus Lab');
  }, [recordVisit]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Interactive Visual Sandbox
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Interactive Differential Calculus Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Experiment with live graphs, tangent lines, limit tables, difference quotients, symbolic
          step-by-step derivatives, curve sketching, and 3D Hessian discriminants.
        </p>
      </div>

      <DerivativeExplorer />
      <LimitVisualizer />
      <SecantToTangent />
      <StepByStepSolver />
      <OptimizationSketcher />
      <HessianExplorer />
    </div>
  );
};
