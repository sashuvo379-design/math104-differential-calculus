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
import {
  AlertTriangle,
  Check,
  Compass,
  Eye,
  EyeOff,
  GitCommitHorizontal,
  Info,
  Lightbulb,
  Mountain,
  RotateCcw,
} from 'lucide-react';

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
    <div className="space-y-10">
      {/* Editorial Portal Top Header & Module Switcher */}
      <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              <span className="text-[#991B1B] dark:text-rose-400">DU Master Portal</span>
              <span>•</span>
              <span>Department of Mathematics &amp; ISRT, University of Dhaka</span>
              <span>•</span>
              <span className="text-[#0F3D6E] dark:text-sky-400">
                Developed by Saad • All rights reserved
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              MATH 104: Master Interactive Portal &amp; Exam Hub
            </h1>
          </div>
        </div>

        {/* Clean Bordered Tab Strip (Wrapping cleanly, zero horizontal scrollbar) */}
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
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                activeTab === t.id
                  ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E] dark:border-sky-600'
                  : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MODULE 1: 4-PHASE CURRICULUM ROADMAP */}
      {/* ==================================================================== */}
      {showSection('roadmap') && (
        <section id="tab-roadmap" className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
              Module 1.0 • Curriculum Overview
            </div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              MATH 104: Comprehensive 4-Phase Academic Outline
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              The DU MATH 104 Differential Calculus syllabus is structured into four progressive
              learning phases. Use this roadmap to track your mastery from fundamental limits to
              multivariable optimization and exam-level problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {OVERVIEW_ROADMAP_PHASES.map((phase) => (
              <div
                key={phase.id}
                className="academic-panel p-5 border-l-2 border-l-[#0F3D6E] dark:border-l-sky-400 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-[#0F3D6E] dark:text-sky-400">
                      {phase.phaseBadge}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">{phase.weightInfo}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <RichMathText text={phase.description} />
                  </p>
                  <div className="bg-[#FAF9F6] dark:bg-[#0B0E14] p-3.5 rounded-md border border-zinc-200 dark:border-[#242B3D] space-y-1.5 text-xs">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">
                      Core Topics Covered:
                    </div>
                    <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-300 space-y-1">
                      {phase.coreTopics.map((topic, i) => (
                        <li key={i}>
                          <RichMathText text={topic} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    to={phase.linkedRoute}
                    className="text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 hover:underline"
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
        <section
          id="tab-intuition"
          className="space-y-6 pt-8 border-t border-zinc-200 dark:border-[#242B3D]"
        >
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
              Module 2.0 • Surface Theory
            </div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              3D Surface Geometry &amp; Hessian Theoretical Foundations
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              <RichMathText text="In multivariable calculus, understanding the physical geometry of surfaces $z = f(x,y)$ connects physical spatial intuition with formal mathematical proofs. At critical points where the gradient vector vanishes $\nabla f(x,y) = (0,0)$, the surface possesses a horizontal tangent plane parallel to the $xy$-plane." />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="academic-panel p-5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Mountain className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  Mountain Peak &amp; Basin
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                  At a Local Maximum or Minimum, moving in any direction initially leaves elevation
                  flat. Slope along every axis is zero.
                </p>
                <div className="bg-[#FAF9F6] dark:bg-[#0B0E14] p-2.5 rounded-sm border border-zinc-200 dark:border-[#242B3D] text-xs">
                  <KaTeXMath
                    math="\nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y} \right) = (0,0)"
                    display
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-2 rounded-sm flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Curvature is negative everywhere for Max, positive for Min.</span>
              </div>
            </div>

            <div className="academic-panel p-5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
                  <GitCommitHorizontal className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  The Saddle Point
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                  At a mountain pass (saddle point), moving front-to-back goes downhill, while
                  moving left-to-right goes uphill!
                </p>
                <div className="bg-[#FAF9F6] dark:bg-[#0B0E14] p-2.5 rounded-sm border border-zinc-200 dark:border-[#242B3D] text-xs">
                  <KaTeXMath
                    math="f_x = 0, \quad f_y = 0, \quad \text{Discriminant } D < 0"
                    display
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-amber-900 dark:text-amber-300 font-medium bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-2 rounded-sm flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Surface curves upwards along one cross-section and downwards along another.
                </span>
              </div>
            </div>

            <div className="academic-panel p-5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-md bg-[#F0F4F8] dark:bg-[#131C2E] border border-zinc-300 dark:border-sky-900 text-[#0F3D6E] dark:text-sky-400 flex items-center justify-center mb-3">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  Level Curves &amp; Gradient Rays
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                  Topographic maps display level curves <KaTeXMath math="f(x,y) = c" />. Gradient
                  vector <KaTeXMath math="\nabla f" /> points perpendicular to contours in the
                  steepest ascent direction.
                </p>
                <div className="bg-[#FAF9F6] dark:bg-[#0B0E14] p-2.5 rounded-sm border border-zinc-200 dark:border-[#242B3D] text-xs">
                  <KaTeXMath
                    math="\|\nabla f\| = \text{Steepness}, \quad \nabla f \perp \text{Level Curves}"
                    display
                  />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-[#0F3D6E] dark:text-sky-300 font-medium bg-[#F0F4F8] dark:bg-[#131C2E] border border-zinc-200 dark:border-sky-900/50 p-2 rounded-sm flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Essential for Lagrange Multipliers:{' '}
                  <KaTeXMath math="\nabla f = \lambda \nabla g" />.
                </span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Surface Visualizer for Module 2 */}
          <SurfaceGrapher3D />

          {/* Hessian Derivation */}
          <div className="academic-panel p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-[#242B3D] pb-2">
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
        <section
          id="tab-slides-notes"
          className="space-y-6 pt-8 border-t border-zinc-200 dark:border-[#242B3D]"
        >
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Module 3.0 • Lecture Repository
            </div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Dr. Md. Rakib Hossain Lecture 15 &amp; Slide Notes
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              Exhaustive worked solutions and notes for every example presented in the course
              slides. DU examiners award full step marks for complete algebraic steps—study these
              formatted solutions to guarantee full marks.
            </p>
          </div>

          {/* Slide Problem Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {LECTURE_15_SLIDE_PROBLEMS.map((prob) => (
              <button
                key={prob.id}
                type="button"
                onClick={() => handleSelectSlide(prob.id)}
                className={`px-3.5 py-1.5 text-xs rounded-md border transition-colors ${
                  selectedSlideId === prob.id
                    ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E] dark:border-sky-600 font-semibold'
                    : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400 font-medium'
                }`}
              >
                {prob.buttonLabel}
              </button>
            ))}
          </div>

          {/* Selected Slide Worked Solution */}
          <div className="academic-panel p-6 space-y-5">
            <div className="border-b border-zinc-200 dark:border-[#242B3D] pb-4">
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF9F6] dark:bg-[#0B0E14] text-amber-800 dark:text-amber-300 border border-zinc-300 dark:border-zinc-700 hover:border-amber-500 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {showSlideHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setVisibleSlideSteps((prev) => (prev >= currentSlide.steps.length ? 1 : prev + 1))
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF9F6] dark:bg-[#0B0E14] text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 text-white hover:opacity-90 transition-opacity"
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
              <div className="p-3.5 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-zinc-800 dark:text-zinc-200">
                <strong className="text-amber-900 dark:text-amber-300">Hint:</strong>{' '}
                {currentSlide.hint}
              </div>
            )}

            <div className="space-y-4">
              {currentSlide.steps.slice(0, visibleSlideSteps).map((st, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] dark:bg-[#0B0E14] p-4 rounded-md border border-zinc-200 dark:border-[#242B3D] space-y-2"
                >
                  <h4 className="text-xs font-bold text-[#0F3D6E] dark:text-sky-400 uppercase tracking-wider">
                    {st.heading}
                  </h4>
                  {st.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed"
                    >
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
                          className={`p-3 rounded-md border ${
                            sc.variant === 'rose'
                              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
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
              <div className="p-3 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0F3D6E] dark:text-sky-400" />
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
        <section
          id="tab-du-slots"
          className="space-y-6 pt-8 border-t border-zinc-200 dark:border-[#242B3D]"
        >
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#991B1B] dark:text-rose-400">
              Module 4.0 • Past Examination Architecture
            </div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              DU 5-Slot Historical Exam Blueprint &amp; Solved Questions
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              Historical analysis of University of Dhaka MATH 104 final examination papers reveals a
              consistent 5-slot structure. Master these solved question blueprints to maximize score
              efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Slot Weightage Chart */}
            <div className="academic-panel p-5 space-y-4 h-fit">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
                DU Exam Slot Mark Allocation
              </h3>
              <div className="space-y-3 pt-2">
                {[
                  { label: 'Slot 1: Limits (ε–δ)', pct: 20, color: 'bg-[#0F3D6E] dark:bg-sky-500' },
                  {
                    label: 'Slot 2: Leibniz Theorem',
                    pct: 25,
                    color: 'bg-emerald-700 dark:bg-emerald-500',
                  },
                  {
                    label: 'Slot 3: Mean Value Theorems',
                    pct: 20,
                    color: 'bg-zinc-700 dark:bg-zinc-400',
                  },
                  {
                    label: 'Slot 4: Tangent Invariants',
                    pct: 15,
                    color: 'bg-amber-700 dark:bg-amber-500',
                  },
                  {
                    label: 'Slot 5: Cubic Asymptotes',
                    pct: 20,
                    color: 'bg-[#991B1B] dark:bg-rose-500',
                  },
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{bar.label}</span>
                      <span className="font-mono font-bold tabular-nums">{bar.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-sm overflow-hidden">
                      <div
                        className={`h-full ${bar.color}`}
                        style={{ width: `${(bar.pct / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                Historical point distribution across standard DU exam slots.
              </p>
            </div>

            {/* Detailed Blueprint Cards */}
            <div className="lg:col-span-2 space-y-4">
              {DU_PAST_EXAM_SLOTS.map((slot) => (
                <div key={slot.slotNumber} className="academic-panel p-5 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                    <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-[#0F3D6E] dark:bg-sky-600 text-white">
                        Slot {slot.slotNumber}
                      </span>
                      <RichMathText text={slot.title} />
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] dark:text-rose-400">
                      {slot.badge}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <RichMathText text={slot.questionPrompt} />
                  </p>

                  <div className="space-y-2 text-xs">
                    {slot.steps.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-[#FAF9F6] dark:bg-[#0B0E14] rounded-md border border-zinc-200 dark:border-[#242B3D] space-y-1.5"
                      >
                        <strong className="text-[#0F3D6E] dark:text-sky-400 block">
                          {st.title}
                        </strong>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          <RichMathText text={st.content} />
                        </p>
                        {st.mathLatex && <KaTeXMath math={st.mathLatex} display />}
                      </div>
                    ))}
                  </div>

                  {slot.reviewNote && (
                    <div className="p-3 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
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
        <section
          id="tab-exam-protocol"
          className="space-y-6 pt-8 border-t border-zinc-200 dark:border-[#242B3D]"
        >
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#991B1B] dark:text-rose-400">
              Module 5.0 • Examination Strategy
            </div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              DU Exam Scoring Hacks &amp; Interactive Self-Test Engine
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              Review the common mark-loss traps, follow the 72-hour cram timetable, and test your
              readiness using the interactive assessment engine below.
            </p>
          </div>

          {/* Top 4 Academic Point-Loss Traps */}
          <div className="academic-panel p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-[#242B3D] pb-2">
              Top 4 Academic Point-Loss Traps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {POINT_LOSS_TRAPS.map((trap) => (
                <div
                  key={trap.number}
                  className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border-l-2 border-l-[#991B1B] border border-zinc-200 dark:border-rose-900/40 rounded-r-md space-y-1"
                >
                  <strong className="text-[#991B1B] dark:text-rose-300 font-bold block">
                    {trap.number}. {trap.title}
                  </strong>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <RichMathText text={trap.description} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 72-Hour Study Timetable */}
          <div className="academic-panel p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-[#242B3D] pb-2">
              72-Hour Final Exam Preparation Timetable
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] space-y-1">
                <strong className="text-[#0F3D6E] dark:text-sky-400 block">
                  Day 1 (Hours 1–24): Phase 1 &amp; Slot 1/5
                </strong>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Master ε–δ proofs, piecewise continuity (ISRT Prob 7), difference quotients, and
                  Lecture 15 Slide Examples 3–7 (Hessian &amp; bounded domains).
                </p>
              </div>
              <div className="p-4 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] space-y-1">
                <strong className="text-emerald-700 dark:text-emerald-400 block">
                  Day 2 (Hours 25–48): Phase 2 &amp; Slot 2/4
                </strong>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Practice Leibniz recurrence &amp; (y_n)_0 parity, Folium of Descartes implicit
                  tangent lines, related rates, and open box optimization.
                </p>
              </div>
              <div className="p-4 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] space-y-1">
                <strong className="text-zinc-900 dark:text-zinc-100 block">
                  Day 3 (Hours 49–72): Phases 3–4 &amp; Slot 3
                </strong>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Drill total differentials, error propagation, multivariable chain rule (Theorems
                  13.5–13.7), Cauchy MVT proofs, and cubic asymptotes.
                </p>
              </div>
            </div>
          </div>

          {/* 5-Question Concept Assessment Quiz */}
          <div className="academic-panel p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-[#242B3D] pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
                  Self-Test Engine
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                  DU MATH 104 Concept Assessment Quiz
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuizAnswers(Array(OVERVIEW_SELF_QUIZ.length).fill(null))}
                className="inline-flex items-center gap-1.5 text-xs bg-[#FAF9F6] hover:bg-zinc-100 dark:bg-[#0B0E14] dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#242B3D] px-3 py-1.5 rounded-md font-semibold transition-colors"
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
                    className="p-4 bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] rounded-md space-y-3"
                  >
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      <span className="font-mono px-2 py-0.5 bg-[#0F3D6E] dark:bg-sky-600 text-white rounded-sm text-[10px] mr-2">
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
                            className={`p-2.5 text-left rounded-md border transition-colors ${
                              selected
                                ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E] font-semibold'
                                : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {userAns !== null && (
                      <div
                        className={`text-xs p-2.5 rounded-md font-medium ${
                          userAns === item.correctIndex
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                        }`}
                      >
                        {userAns === item.correctIndex ? 'Correct. ' : 'Incorrect. '}
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {answeredCount > 0 && (
              <div className="p-4 bg-[#F0F4F8] dark:bg-[#131C2E] border border-zinc-300 dark:border-sky-900/50 rounded-md text-center space-y-1">
                <div className="text-[10px] text-[#0F3D6E] dark:text-sky-400 font-bold uppercase tracking-widest">
                  Test Score
                </div>
                <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  {quizScore} / {OVERVIEW_SELF_QUIZ.length}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  {quizScore === 5
                    ? 'Outstanding. Prepared for DU MATH 104.'
                    : quizScore >= 3
                      ? 'Solid progress. Review any missed concepts above.'
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
