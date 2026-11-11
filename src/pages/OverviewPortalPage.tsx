import React, { useEffect, useState } from 'react';
import {
  DU_PAST_EXAM_SLOTS,
  LECTURE_15_SLIDE_PROBLEMS,
  OVERVIEW_ROADMAP_PHASES,
  OVERVIEW_SELF_QUIZ,
  POINT_LOSS_TRAPS,
} from '../data/overviewData';
import { KaTeXMath, RichMathText } from '../components/common/KaTeXMath';
import { HessianExplorer } from '../components/interactive/HessianExplorer';
import { SurfaceGrapher3D } from '../components/interactive/SurfaceGrapher3D';
import { Link } from '../context/RouterContext';
import { useProgress } from '../context/ProgressContext';
import { Eye, EyeOff, Info, Lightbulb, RotateCcw } from 'lucide-react';

type OverviewTab = 'roadmap' | 'intuition' | 'slides-notes' | 'du-slots' | 'exam-protocol' | 'all';

export const OverviewPortalPage: React.FC = () => {
  const { recordVisit } = useProgress();
  const [activeTab, setActiveTab] = useState<OverviewTab>('all');
  const [selectedSlideId, setSelectedSlideId] = useState<string>('ex3');
  const [showSlideHint, setShowSlideHint] = useState<boolean>(false);
  const [visibleSlideSteps, setVisibleSlideSteps] = useState<number>(3);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(
    Array(OVERVIEW_SELF_QUIZ.length).fill(null)
  );

  useEffect(() => {
    recordVisit('/overview', 'DU MATH 104: Master Interactive Portal & Exam Hub');
  }, [recordVisit]);

  const currentSlide =
    LECTURE_15_SLIDE_PROBLEMS.find((s) => s.id === selectedSlideId) || LECTURE_15_SLIDE_PROBLEMS[0];

  const handleSelectSlide = (id: string) => {
    setSelectedSlideId(id);
    setShowSlideHint(false);
    const found = LECTURE_15_SLIDE_PROBLEMS.find((s) => s.id === id);
    setVisibleSlideSteps(found ? found.steps.length : 3);
  };

  const answeredCount = quizAnswers.filter((a) => a !== null).length;
  const quizScore = quizAnswers.reduce<number>(
    (acc, ans, idx) => (ans === OVERVIEW_SELF_QUIZ[idx].correctIndex ? acc + 1 : acc),
    0
  );

  const showSection = (tab: OverviewTab) => activeTab === 'all' || activeTab === tab;

  return (
    <div className="space-y-8">
      {/* Portal Top Header & Module Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-600 text-white text-xs font-extrabold rounded uppercase tracking-wider">
                DU Master Portal
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Department of Mathematics • University of Dhaka
              </span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold rounded">
                Made and developed by Saad, IASDS-32
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              MATH 104: Master Interactive Portal &amp; Exam Hub
            </h1>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All 5 Modules' },
              { id: 'roadmap', label: '1. 4-Phase Roadmap' },
              { id: 'intuition', label: '2. 3D Intuition & Hessian' },
              { id: 'slides-notes', label: '3. Lecture 15 Slides' },
              { id: 'du-slots', label: '4. DU Past Exam Blueprint' },
              { id: 'exam-protocol', label: '5. Strategy & Self-Quiz' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as OverviewTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === t.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODULE 1: 4-PHASE CURRICULUM ROADMAP */}
      {/* ==================================================================== */}
      {showSection('roadmap') && (
        <section id="tab-roadmap" className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold rounded-full uppercase">
                Curriculum Overview
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                MATH 104: Comprehensive 4-Phase Academic Outline
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The DU MATH 104 Differential Calculus syllabus is structured into four progressive
              learning phases. Use this roadmap to track your mastery from fundamental limits to
              multivariable optimization and exam-level problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {OVERVIEW_ROADMAP_PHASES.map((phase) => (
              <div
                key={phase.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border-l-4 border-l-blue-600 border-y border-r border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold rounded">
                    {phase.phaseBadge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{phase.weightInfo}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {phase.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <RichMathText text={phase.description} />
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Core Topics Covered:
                  </div>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                    {phase.coreTopics.map((topic, i) => (
                      <li key={i}>
                        <RichMathText text={topic} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-1">
                  <Link
                    to={phase.linkedRoute}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Go to {phase.phaseBadge} Masterclass Lesson →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* MODULE 2: 3D GEOMETRY & HESSIAN THEORY */}
      {/* ==================================================================== */}
      {showSection('intuition') && (
        <section id="tab-intuition" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold rounded-full uppercase">
                Module 2.0
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                3D Surface Geometry &amp; Hessian Theoretical Foundations
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <RichMathText text="In multivariable calculus, understanding the physical geometry of surfaces $z = f(x,y)$ connects physical spatial intuition with formal mathematical proofs. At critical points where the gradient vector vanishes $\nabla f(x,y) = (0,0)$, the surface possesses a horizontal tangent plane parallel to the $xy$-plane." />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
                  🏔️
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Mountain Peak &amp; Basin
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  At a Local Maximum or Minimum, moving in any direction initially leaves elevation
                  flat. Slope along every axis is zero.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
                  <KaTeXMath
                    math="\nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y} \right) = (0,0)"
                    display
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded">
                ✔ Curvature is negative everywhere for Max, positive for Min.
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-3">
                  🐎
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  The Saddle Point
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  At a mountain pass (saddle point), moving front-to-back goes downhill, while
                  moving left-to-right goes uphill!
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
                  <KaTeXMath
                    math="f_x = 0, \quad f_y = 0, \quad \text{Discriminant } D < 0"
                    display
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/50 p-2 rounded">
                ⚠️ Surface curves upwards along one cross-section and downwards along another.
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-3">
                  🗺️
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Level Curves &amp; Gradient Rays
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Topographic maps display level curves <KaTeXMath math="f(x,y) = c" />. Gradient
                  vector <KaTeXMath math="\nabla f" /> points perpendicular to contours in the
                  steepest ascent direction.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
                  <KaTeXMath
                    math="\|\nabla f\| = \text{Steepness}, \quad \nabla f \perp \text{Level Curves}"
                    display
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-purple-700 dark:text-purple-300 font-semibold bg-purple-50 dark:bg-purple-950/50 p-2 rounded">
                💡 Essential for Lagrange Multipliers:{' '}
                <KaTeXMath math="\nabla f = \lambda \nabla g" />.
              </div>
            </div>
          </div>

          {/* Interactive 3D Surface Visualizer for Module 2 */}
          <SurfaceGrapher3D />

          {/* Hessian Derivation */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Why Does the Hessian Discriminant Work? (2D Taylor Expansion Proof)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <RichMathText text="Let $(a,b)$ be a critical point where $f_x(a,b) = 0$ and $f_y(a,b) = 0$. By multivariable Taylor Expansion:" />
            </p>
            <div className="math-display-box">
              <KaTeXMath
                math="f(a+h, b+k) - f(a,b) = \frac{1}{2!} \left[ f_{xx}(a,b)h^2 + 2f_{xy}(a,b)hk + f_{yy}(a,b)k^2 \right] + R_2(h,k)"
                display
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <RichMathText text="The sign of local elevation change $\Delta f = f(a+h, b+k) - f(a,b)$ is governed by the quadratic form $Q(h,k) = Ah^2 + 2Bhk + Ck^2$, where $A = f_{xx}, B = f_{xy}, C = f_{yy}$. Multiplying by $A$:" />
            </p>
            <div className="math-display-box">
              <KaTeXMath
                math="A \cdot Q(h,k) = A^2 h^2 + 2AB hk + AC k^2 = (Ah + Bk)^2 + (AC - B^2)k^2"
                display
              />
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <RichMathText text="Notice the key discriminant term $(AC - B^2) = f_{xx}f_{yy} - (f_{xy})^2 = D$!" />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <strong className="text-emerald-900 dark:text-emerald-300 font-bold block mb-1">
                  If D &gt; 0:
                </strong>
                Both terms are positive. The sign of Q(h,k) is strictly determined by A = f_xx.
                <br />• f_xx &gt; 0 ⇒ Local Minimum
                <br />• f_xx &lt; 0 ⇒ Local Maximum
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg">
                <strong className="text-rose-900 dark:text-rose-300 font-bold block mb-1">
                  If D &lt; 0:
                </strong>
                The term (AC - B²) is negative. Q(h,k) takes both positive and negative values.
                Indicates a <strong>Saddle Point</strong>.
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg">
                <strong className="text-slate-900 dark:text-white font-bold block mb-1">
                  If D = 0:
                </strong>
                The quadratic form collapses. Higher-order terms govern surface behavior. The test
                is <strong>Inconclusive</strong>.
              </div>
            </div>
          </div>

          <HessianExplorer />
        </section>
      )}

      {/* ==================================================================== */}
      {/* MODULE 3: LECTURE SLIDES & NOTES REPOSITORY (LECTURE 15) */}
      {/* ==================================================================== */}
      {showSection('slides-notes') && (
        <section id="tab-slides-notes" className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-full uppercase">
                Lecture Repository
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dr. Md. Rakib Hossain Lecture 15 &amp; Slide Notes
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Exhaustive worked solutions and notes for every example presented in the course
              slides. DU examiners award full step marks for complete algebraic steps—study these
              formatted solutions to guarantee full marks.
            </p>
          </div>

          {/* Slide Problem Selector Buttons */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-2">
            {LECTURE_15_SLIDE_PROBLEMS.map((prob) => (
              <button
                key={prob.id}
                type="button"
                onClick={() => handleSelectSlide(prob.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  selectedSlideId === prob.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold'
                }`}
              >
                {prob.buttonLabel}
              </button>
            ))}
          </div>

          {/* Selected Slide Worked Solution with Hint / Next Step / Full Solution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentSlide.title}
              </h3>
              <div className="math-display-box text-sm mt-2">
                <KaTeXMath math={currentSlide.equationLatex} display />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowSlideHint((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {showSlideHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setVisibleSlideSteps((prev) => (prev >= currentSlide.steps.length ? 1 : prev + 1))
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200"
              >
                {visibleSlideSteps >= currentSlide.steps.length
                  ? 'Practice Step-by-Step (Step 1)'
                  : `Show Next Step (${visibleSlideSteps}/${currentSlide.steps.length})`}
              </button>

              <button
                type="button"
                onClick={() =>
                  setVisibleSlideSteps((prev) =>
                    prev === currentSlide.steps.length ? 0 : currentSlide.steps.length
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white"
              >
                {visibleSlideSteps === currentSlide.steps.length ? (
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

            {showSlideHint && (
              <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200">
                <strong>Hint:</strong> {currentSlide.hint}
              </div>
            )}

            <div className="space-y-4">
              {currentSlide.steps.slice(0, visibleSlideSteps).map((st, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                    {st.heading}
                  </h4>
                  {st.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs text-slate-700 dark:text-slate-300">
                      <RichMathText text={p} />
                    </p>
                  ))}
                  {st.mathBlocks.map((mb, mIdx) => (
                    <div key={mIdx} className="math-display-box">
                      <KaTeXMath math={mb} display />
                    </div>
                  ))}
                  {st.subCards && (
                    <div className="space-y-2 text-xs pt-1">
                      {st.subCards.map((sc, scIdx) => (
                        <div
                          key={scIdx}
                          className={`p-3 rounded-lg border ${
                            sc.variant === 'rose'
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <strong>{sc.title}</strong>
                          <KaTeXMath math={sc.math} display />
                          <div>
                            <RichMathText text={sc.result} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {currentSlide.reviewNote && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <span>{currentSlide.reviewNote}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* MODULE 4: DU 5-SLOT HISTORICAL PAST EXAM BLUEPRINT */}
      {/* ==================================================================== */}
      {showSection('du-slots') && (
        <section id="tab-du-slots" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs font-bold rounded-full uppercase">
                Module 4.0
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                DU 5-Slot Historical Exam Blueprint &amp; Solved Questions
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Historical analysis of University of Dhaka MATH 104 final examination papers reveals a
              consistent 5-slot structure. Master these solved question blueprints to maximize score
              efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Slot Weightage Chart (SVG Bar Chart) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                DU Exam Slot Mark Allocation
              </h3>
              <div className="space-y-3 pt-2">
                {[
                  { label: 'Slot 1: Limits (ε–δ)', pct: 20, color: 'bg-blue-600' },
                  { label: 'Slot 2: Leibniz Theorem', pct: 25, color: 'bg-emerald-600' },
                  { label: 'Slot 3: Mean Value Theorems', pct: 20, color: 'bg-purple-600' },
                  { label: 'Slot 4: Tangent Invariants', pct: 15, color: 'bg-amber-600' },
                  { label: 'Slot 5: Cubic Asymptotes', pct: 20, color: 'bg-rose-600' },
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{bar.label}</span>
                      <span className="font-mono font-bold">{bar.pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full`}
                        style={{ width: `${(bar.pct / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 text-center pt-2">
                Historical point distribution across standard DU exam slots.
              </p>
            </div>

            {/* Detailed Blueprint Cards */}
            <div className="lg:col-span-2 space-y-4">
              {DU_PAST_EXAM_SLOTS.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                        Slot {slot.slotNumber}
                      </span>
                      <RichMathText text={slot.title} />
                    </h3>
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold uppercase rounded">
                      {slot.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <RichMathText text={slot.questionPrompt} />
                  </p>

                  <div className="space-y-2 text-xs">
                    {slot.steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5"
                      >
                        <strong className="text-blue-700 dark:text-blue-400 block">
                          {st.title}
                        </strong>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          <RichMathText text={st.content} />
                        </p>
                        {st.mathLatex && <KaTeXMath math={st.mathLatex} display />}
                      </div>
                    ))}
                  </div>

                  {slot.reviewNote && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>{slot.reviewNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* MODULE 5: STRATEGY, 72-HOUR TIMETABLE & SELF-TEST QUIZ ENGINE */}
      {/* ==================================================================== */}
      {showSection('exam-protocol') && (
        <section id="tab-exam-protocol" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-full uppercase">
                Module 5.0
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                DU Exam Scoring Hacks &amp; Interactive Self-Test Engine
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Review the common mark-loss traps, follow the 72-hour cram timetable, and test your
              readiness using the interactive assessment engine below.
            </p>
          </div>

          {/* Top 4 Academic Point-Loss Traps */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Top 4 Academic Point-Loss Traps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {POINT_LOSS_TRAPS.map((trap) => (
                <div
                  key={trap.number}
                  className="p-3.5 bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800 rounded-lg space-y-1"
                >
                  <strong className="text-rose-900 dark:text-rose-200 font-bold block">
                    {trap.number}. {trap.title}
                  </strong>
                  <p className="text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
                    <RichMathText text={trap.description} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 72-Hour Study Timetable (Referenced in Module 5 intro) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              72-Hour Final Exam Preparation Timetable
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-blue-600 dark:text-blue-400 block">
                  Day 1 (Hours 1–24): Phase 1 &amp; Slot 1/5
                </strong>
                <p className="text-slate-600 dark:text-slate-300">
                  Master ε–δ proofs, piecewise continuity (ISRT Prob 7), difference quotients, and
                  Lecture 15 Slide Examples 3–7 (Hessian &amp; bounded domains).
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-emerald-600 dark:text-emerald-400 block">
                  Day 2 (Hours 25–48): Phase 2 &amp; Slot 2/4
                </strong>
                <p className="text-slate-600 dark:text-slate-300">
                  Practice Leibniz recurrence &amp; (y_n)_0 parity, Folium of Descartes implicit
                  tangent lines, related rates, and open box optimization.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-purple-600 dark:text-purple-400 block">
                  Day 3 (Hours 49–72): Phases 3–4 &amp; Slot 3
                </strong>
                <p className="text-slate-600 dark:text-slate-300">
                  Drill total differentials, error propagation, multivariable chain rule (Theorems
                  13.5–13.7), Cauchy MVT proofs, and cubic asymptotes.
                </p>
              </div>
            </div>
          </div>

          {/* 5-Question Concept Assessment Quiz */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold rounded">
                  SELF-TEST ENGINE
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  DU MATH 104 Concept Assessment Quiz
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuizAnswers(Array(OVERVIEW_SELF_QUIZ.length).fill(null))}
                className="inline-flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Quiz
              </button>
            </div>

            <div className="space-y-4">
              {OVERVIEW_SELF_QUIZ.map((item, qIdx) => {
                const userAns = quizAnswers[qIdx];
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] mr-2">
                        Q{qIdx + 1}
                      </span>
                      {item.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {item.options.map((opt, oIdx) => {
                        const selected = userAns === oIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((prev) => {
                                const next = [...prev];
                                next[qIdx] = oIdx;
                                return next;
                              })
                            }
                            className={`p-2.5 text-left rounded-lg border transition-colors ${
                              selected
                                ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {userAns !== null && (
                      <div
                        className={`text-xs p-2.5 rounded-lg font-medium ${
                          userAns === item.correctIndex
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                        }`}
                      >
                        {userAns === item.correctIndex ? '✔ Correct! ' : '✖ Incorrect. '}
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {answeredCount > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-center space-y-1">
                <div className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                  Your Test Score
                </div>
                <div className="text-2xl font-black text-blue-900 dark:text-white">
                  {quizScore} / {OVERVIEW_SELF_QUIZ.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {quizScore === 5
                    ? 'Outstanding! You are 100% prepared for DU MATH 104!'
                    : quizScore >= 3
                      ? 'Good progress! Review the missed questions above.'
                      : 'Review the slides and past slots to strengthen your core concepts.'}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
