import React, { useEffect } from 'react';
import { DerivativeExplorer } from '../components/interactive/DerivativeExplorer';
import { LimitVisualizer } from '../components/interactive/LimitVisualizer';
import { SecantToTangent } from '../components/interactive/SecantToTangent';
import { StepByStepSolver } from '../components/interactive/StepByStepSolver';
import { OptimizationSketcher } from '../components/interactive/OptimizationSketcher';
import { HessianExplorer } from '../components/interactive/HessianExplorer';
import { SurfaceGrapher3D } from '../components/interactive/SurfaceGrapher3D';
import { useProgress } from '../context/ProgressContext';

export const InteractiveLabPage: React.FC = () => {
  const { recordVisit } = useProgress();

  useEffect(() => {
    recordVisit('/lab', 'Interactive Calculus Lab');
  }, [recordVisit]);

  return (
    <div className="space-y-10">
      <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-6 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
          Interactive Visual &amp; Symbolic Sandbox
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Interactive Differential Calculus Lab
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Experiment with live 3D multivariable surfaces, tangent planes, 2D derivative curves,
          limit tables, difference quotients, symbolic step-by-step derivatives, and curve
          sketching.
        </p>
      </header>

      {/* Flagship 3D Multivariable Surface & Tangent Plane Engine */}
      <SurfaceGrapher3D />

      <DerivativeExplorer />
      <LimitVisualizer />
      <SecantToTangent />
      <StepByStepSolver />
      <OptimizationSketcher />
      <HessianExplorer />
    </div>
  );
};
