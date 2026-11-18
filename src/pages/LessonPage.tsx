import React, { useEffect, useState } from 'react';
import { PHASE_LESSONS, PhaseLessonData } from '../data/phasesData';
import { KaTeXMath, RichMathText } from '../components/common/KaTeXMath';
import { WorkedExampleCard } from '../components/common/WorkedExampleCard';
import { DerivativeExplorer } from '../components/interactive/DerivativeExplorer';
import { LimitVisualizer } from '../components/interactive/LimitVisualizer';
import { SecantToTangent } from '../components/interactive/SecantToTangent';
import { OptimizationSketcher } from '../components/interactive/OptimizationSketcher';
import { SurfaceGrapher3D } from '../components/interactive/SurfaceGrapher3D';
import { useProgress } from '../context/ProgressContext';
import { Link } from '../context/RouterContext';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface LessonPageProps {
  phaseId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
}

export const LessonPage: React.FC<LessonPageProps> = ({ phaseId }) => {
  const { state, toggleUnitComplete, recordVisit } = useProgress();
  const [outlineVisible, setOutlineVisible] = useState(true);

  const phaseIndex = PHASE_LESSONS.findIndex((p) => p.id === phaseId);
  const phase: PhaseLessonData = PHASE_LESSONS[phaseIndex] || PHASE_LESSONS[0];
  const prevPhase = phaseIndex > 0 ? PHASE_LESSONS[phaseIndex - 1] : null;
  const nextPhase = phaseIndex < PHASE_LESSONS.length - 1 ? PHASE_LESSONS[phaseIndex + 1] : null;

  useEffect(() => {
    recordVisit(`/lesson/${phase.id}`, phase.bannerTitle);
  }, [phase.id, phase.bannerTitle, recordVisit]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      {/* Left Sticky Collapsible Chapter Outline Rail (Documentation-Grade, Zero Horizontal Scrollbar) */}
      {outlineVisible ? (
        <aside
          aria-label={`${phase.shortTitle} unit outline`}
          className="w-full lg:w-64 lg:sticky lg:top-24 shrink-0 space-y-6 bg-white lg:bg-transparent dark:bg-[#111622] lg:dark:bg-transparent p-4 lg:p-0 rounded-md lg:rounded-none border border-zinc-200 lg:border-0 dark:border-[#242B3D]"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#242B3D] pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Chapter Outline
            </span>
            <button
              type="button"
              onClick={() => setOutlineVisible(false)}
              className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              title="Collapse Chapter Outline"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
              <span>Hide</span>
            </button>
          </div>

          {/* Current Phase Units */}
          <nav className="space-y-1 border-l border-zinc-200 dark:border-[#242B3D] pl-3">
            {phase.units.map((u) => {
              const isDone = state.completedUnits.includes(u.id);
              return (
                <a
                  key={u.id}
                  href={`#${u.id}`}
                  className="flex items-start justify-between gap-2 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-[#0F3D6E] dark:hover:text-sky-400 transition-colors leading-snug"
                >
                  <span>{u.title.replace(/^Unit\s+/, '')}</span>
                  {isDone && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </a>
              );
            })}
            <a
              href="#self-assessment"
              className="flex items-center gap-1.5 py-1.5 text-xs font-semibold text-[#0F3D6E] dark:text-sky-400 hover:underline pt-2"
            >
              <span>Δ Self-Assessment Set</span>
            </a>
          </nav>

          {/* Quick Phase Switcher */}
          <div className="pt-4 border-t border-zinc-200 dark:border-[#242B3D] space-y-2 hidden lg:block">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Switch Phase
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {PHASE_LESSONS.map((p) => {
                const active = p.id === phase.id;
                return (
                  <Link
                    key={p.id}
                    to={`/lesson/${p.id}`}
                    className={`py-1.5 text-center font-mono text-xs font-bold rounded-md border transition-colors ${
                      active
                        ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E] dark:border-sky-600'
                        : 'bg-white dark:bg-[#111622] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400'
                    }`}
                  >
                    0{p.phaseNumber}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      ) : (
        <div className="hidden lg:block lg:sticky lg:top-24 shrink-0">
          <button
            type="button"
            onClick={() => setOutlineVisible(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 shadow-2xs transition-colors"
            title="Expand Chapter Outline"
          >
            <PanelLeftOpen className="w-3.5 h-3.5 text-[#0F3D6E] dark:text-sky-400" />
            <span>Outline</span>
          </button>
        </div>
      )}

      {/* Main Editorial Reading Column */}
      <div className="flex-1 min-w-0 max-w-4xl space-y-12">
        {/* Clean Editorial Chapter Masthead */}
        <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-7 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
            <span>{phase.bannerSubtitle}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {phase.bannerTitle}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            <RichMathText text={phase.bannerDescription} />
          </p>
        </header>

        {/* Render Every Unit in Exact Original Order */}
        <div className="space-y-14">
          {phase.units.map((unit) => {
            const isCompleted = state.completedUnits.includes(unit.id);

            return (
              <section
                key={unit.id}
                id={unit.id}
                className="scroll-mt-24 space-y-7 pb-10 border-b border-zinc-200 dark:border-[#242B3D] last:border-b-0"
              >
                {/* Unit Header & Completion Action */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <span className="text-[#0F3D6E] dark:text-sky-400">{unit.moduleNumber}</span>
                      <span>•</span>
                      <span>{unit.moduleTag}</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                      {unit.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleUnitComplete(unit.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                      isCompleted
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-[#242B3D] hover:border-zinc-400'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Intuitive Real-Life Hook (Minimalist Ochre Left-Border Note) */}
                {unit.realLifeHook && (
                  <div className="border-l-2 border-amber-700 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 px-5 py-4 rounded-r-md space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>{unit.realLifeHook.title}</span>
                    </h3>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      <RichMathText text={unit.realLifeHook.content} />
                    </p>
                  </div>
                )}

                {/* The Mathematical Engine */}
                {unit.engineSection && (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 border-l-2 border-[#0F3D6E] dark:border-sky-400 pl-3">
                      {unit.engineSection.title}
                    </h3>

                    {unit.engineSection.introParagraphs?.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
                      >
                        <RichMathText text={p} />
                      </p>
                    ))}

                    {unit.engineSection.introMathLatex && (
                      <div className="math-display-box">
                        <KaTeXMath math={unit.engineSection.introMathLatex} display />
                      </div>
                    )}

                    {unit.engineSection.outroParagraphs?.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
                      >
                        <RichMathText text={p} />
                      </p>
                    ))}

                    {unit.engineSection.cards && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                        {unit.engineSection.cards.map((card, cIdx) => (
                          <div
                            key={cIdx}
                            className={`p-4 rounded-md border ${
                              card.variant === 'blue'
                                ? 'bg-[#F0F4F8] dark:bg-[#131C2E] border-zinc-300 dark:border-sky-900/50 text-zinc-900 dark:text-zinc-100'
                                : 'bg-white dark:bg-[#111622] border-zinc-200 dark:border-[#242B3D]'
                            } ${card.colSpan2 ? 'md:col-span-2' : ''}`}
                          >
                            <span className="font-bold text-zinc-900 dark:text-zinc-50 block mb-1.5">
                              <RichMathText text={card.title} />
                            </span>
                            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                              <RichMathText text={card.content} />
                            </p>
                            {card.mathLatex && (
                              <div className="pt-2.5 overflow-x-auto">
                                <KaTeXMath math={card.mathLatex} display />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Examiner Traps */}
                {unit.examinerTrap && (
                  <div className="border-l-2 border-[#991B1B] dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 px-5 py-4 rounded-r-md space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#991B1B] dark:text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{unit.examinerTrap.title}</span>
                    </h4>
                    <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 space-y-2 leading-relaxed">
                      {unit.examinerTrap.paragraphs.map((p, idx) => (
                        <p key={idx}>
                          <RichMathText text={p} />
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Worked Exam & Faculty Examples */}
                {unit.workedExamples.map((ex) => (
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
                    variant={ex.examSource.includes('Faculty') ? 'lecture' : 'exam'}
                  />
                ))}

                {/* Summary Reference Table (Units 1.5 & 2.5) */}
                {unit.referenceTable && (
                  <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-[#242B3D] bg-white dark:bg-[#111622]">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 font-semibold border-b border-zinc-200 dark:border-[#242B3D]">
                          <th className="p-3.5 w-1/4">{unit.referenceTable.headers[0]}</th>
                          <th className="p-3.5 w-1/2">{unit.referenceTable.headers[1]}</th>
                          <th className="p-3.5 w-1/4">{unit.referenceTable.headers[2]}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-[#242B3D] text-zinc-700 dark:text-zinc-300">
                        {unit.referenceTable.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                          >
                            <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                              <RichMathText text={row.concept} />
                            </td>
                            <td className="p-3.5">
                              <RichMathText text={row.formulaOrTechnique} />
                            </td>
                            <td className="p-3.5 text-zinc-500 text-xs font-mono">
                              <RichMathText text={row.citation} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Embedded Interactive Visualizers */}
                {unit.id === 'unit-1-2' && <LimitVisualizer />}
                {unit.id === 'unit-1-4' && <SecantToTangent />}
                {unit.id === 'unit-2-1' && <DerivativeExplorer />}
                {unit.id === 'unit-2-4' && <OptimizationSketcher />}
                {unit.id === 'unit-3-1' && <SurfaceGrapher3D />}
              </section>
            );
          })}
        </div>

        {/* Self-Assessment Problem Set */}
        <section
          id="self-assessment"
          className="scroll-mt-24 pt-8 border-t-2 border-zinc-300 dark:border-[#242B3D] space-y-6"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
              Active Recall • Practice Problems
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Δ Phase {phase.phaseNumber} Self-Assessment Problem Set
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <RichMathText text={phase.selfAssessmentSubtitle} />
            </p>
          </div>

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
          </div>
        </section>

        {/* Architectural Previous / Next Pagination Strip */}
        <div className="pt-8 border-t border-zinc-200 dark:border-[#242B3D] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPhase ? (
            <Link
              to={`/lesson/${prevPhase.id}`}
              className="academic-panel p-4 flex items-center gap-3 hover:border-zinc-400"
            >
              <ArrowLeft className="w-4 h-4 text-[#0F3D6E] dark:text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Previous Chapter
                </div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {prevPhase.shortTitle}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              to="/overview"
              className="academic-panel p-4 flex items-center gap-3 hover:border-zinc-400"
            >
              <ArrowLeft className="w-4 h-4 text-[#0F3D6E] dark:text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Course Blueprint
                </div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  DU Master Overview &amp; Exam Hub
                </div>
              </div>
            </Link>
          )}

          {nextPhase ? (
            <Link
              to={`/lesson/${nextPhase.id}`}
              className="p-4 rounded-md bg-[#0F3D6E] dark:bg-sky-600 text-white hover:opacity-95 transition-opacity flex items-center justify-end gap-3 text-right"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-sky-200">
                  Next Chapter
                </div>
                <div className="text-sm font-semibold">{nextPhase.shortTitle}</div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          ) : (
            <Link
              to="/quiz"
              className="p-4 rounded-md bg-emerald-700 text-white hover:opacity-95 transition-opacity flex items-center justify-end gap-3 text-right"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                  Completed All 4 Phases?
                </div>
                <div className="text-sm font-semibold">Take the Assessment Quiz →</div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
