import React, { useEffect } from 'react';
import { PHASE_LESSONS, PhaseLessonData } from '../data/phasesData';
import { KaTeXMath, RichMathText } from '../components/common/KaTeXMath';
import { WorkedExampleCard } from '../components/common/WorkedExampleCard';
import { DerivativeExplorer } from '../components/interactive/DerivativeExplorer';
import { LimitVisualizer } from '../components/interactive/LimitVisualizer';
import { SecantToTangent } from '../components/interactive/SecantToTangent';
import { OptimizationSketcher } from '../components/interactive/OptimizationSketcher';
import { useProgress } from '../context/ProgressContext';
import { Link } from '../context/RouterContext';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

interface LessonPageProps {
  phaseId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
}

export const LessonPage: React.FC<LessonPageProps> = ({ phaseId }) => {
  const { state, toggleUnitComplete, recordVisit } = useProgress();

  const phaseIndex = PHASE_LESSONS.findIndex((p) => p.id === phaseId);
  const phase: PhaseLessonData = PHASE_LESSONS[phaseIndex] || PHASE_LESSONS[0];
  const prevPhase = phaseIndex > 0 ? PHASE_LESSONS[phaseIndex - 1] : null;
  const nextPhase = phaseIndex < PHASE_LESSONS.length - 1 ? PHASE_LESSONS[phaseIndex + 1] : null;

  useEffect(() => {
    recordVisit(`/lesson/${phase.id}`, phase.bannerTitle);
  }, [phase.id, phase.bannerTitle, recordVisit]);

  return (
    <div className="space-y-10">
      {/* Sticky Unit Jump Sub-Bar Preserving Original HTML Sub-Navigation */}
      <nav
        aria-label={`${phase.shortTitle} unit navigation`}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 overflow-x-auto shadow-2xs"
      >
        <div className="flex items-center space-x-1.5 text-xs font-medium whitespace-nowrap">
          {phase.units.map((u) => {
            const isDone = state.completedUnits.includes(u.id);
            return (
              <a
                key={u.id}
                href={`#${u.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{u.title.replace(/^Unit\s+/, '')}</span>
              </a>
            );
          })}
          <a
            href="#self-assessment"
            className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-bold hover:bg-indigo-200 transition-colors"
          >
            Δ Self-Assessment
          </a>
        </div>
      </nav>

      {/* Introductory Banner (Preserved Verbatim) */}
      <section
        className={`bg-gradient-to-r ${
          phase.themeColor === 'rose'
            ? 'from-slate-900 via-rose-950 to-slate-900'
            : 'from-slate-900 via-indigo-950 to-slate-900'
        } text-white rounded-2xl p-6 sm:p-8 shadow-xl`}
      >
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block mb-3">
            {phase.bannerSubtitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            {phase.bannerTitle}
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            <RichMathText text={phase.bannerDescription} />
          </p>
        </div>
      </section>

      {/* Render Every Unit in Original Order */}
      {phase.units.map((unit) => {
        const isCompleted = state.completedUnits.includes(unit.id);

        return (
          <section
            key={unit.id}
            id={unit.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-7"
          >
            {/* Unit Header & Completion Toggle */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <span>{unit.moduleNumber}</span>
                  <span>•</span>
                  <span>{unit.moduleTag}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {unit.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => toggleUnitComplete(unit.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Unit Completed
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    Mark Unit Complete
                  </>
                )}
              </button>
            </div>

            {/* Intuitive Real-Life Hook */}
            {unit.realLifeHook && (
              <div className="border-l-4 border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/30 p-5 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>{unit.realLifeHook.title}</span>
                </h3>
                <p className="text-sm text-amber-900 dark:text-amber-100/90 leading-relaxed">
                  <RichMathText text={unit.realLifeHook.content} />
                </p>
              </div>
            )}

            {/* The Mathematical Engine */}
            {unit.engineSection && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-slate-900 dark:border-blue-500 pl-3">
                  {unit.engineSection.title}
                </h3>

                {unit.engineSection.introParagraphs?.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <RichMathText text={p} />
                  </p>
                ))}

                {unit.engineSection.introMathLatex && (
                  <div className="py-2">
                    <KaTeXMath math={unit.engineSection.introMathLatex} display />
                  </div>
                )}

                {unit.engineSection.outroParagraphs?.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <RichMathText text={p} />
                  </p>
                ))}

                {unit.engineSection.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {unit.engineSection.cards.map((card, cIdx) => (
                      <div
                        key={cIdx}
                        className={`p-4 rounded-xl border ${
                          card.variant === 'blue'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                            : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                        } ${card.colSpan2 ? 'md:col-span-2' : ''}`}
                      >
                        <span className="font-bold text-slate-900 dark:text-white block mb-1">
                          <RichMathText text={card.title} />
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          <RichMathText text={card.content} />
                        </p>
                        {card.mathLatex && (
                          <div className="pt-2 overflow-x-auto">
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
              <div className="border-l-4 border-l-red-600 bg-red-50/80 dark:bg-red-950/30 p-5 rounded-xl space-y-2">
                <h4 className="text-sm font-bold text-red-950 dark:text-red-200 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                  <span>{unit.examinerTrap.title}</span>
                </h4>
                <div className="text-xs sm:text-sm text-red-900 dark:text-red-100/90 space-y-2">
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
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 w-1/4">{unit.referenceTable.headers[0]}</th>
                      <th className="p-3 w-1/2">{unit.referenceTable.headers[1]}</th>
                      <th className="p-3 w-1/4">{unit.referenceTable.headers[2]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {unit.referenceTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <RichMathText text={row.concept} />
                        </td>
                        <td className="p-3">
                          <RichMathText text={row.formulaOrTechnique} />
                        </td>
                        <td className="p-3 text-slate-500">
                          <RichMathText text={row.citation} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Embedded Interactive Tool on Relevant Units */}
            {unit.id === 'unit-1-2' && <LimitVisualizer />}
            {unit.id === 'unit-1-4' && <SecantToTangent />}
            {unit.id === 'unit-2-1' && <DerivativeExplorer />}
            {unit.id === 'unit-2-4' && <OptimizationSketcher />}
          </section>
        );
      })}

      {/* Self-Assessment Problem Set */}
      <section
        id="self-assessment"
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6"
      >
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <span>Active Recall</span>
            <span>•</span>
            <span>Practice Problems</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Δ Phase {phase.phaseNumber} Self-Assessment Problem Set
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
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

      {/* Previous / Next Lesson Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        {prevPhase ? (
          <Link
            to={`/lesson/${prevPhase.id}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Previous Lesson
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {prevPhase.shortTitle}
              </div>
            </div>
          </Link>
        ) : (
          <Link
            to="/overview"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Course Syllabus
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                DU Master Overview &amp; Exam Hub
              </div>
            </div>
          </Link>
        )}

        {nextPhase ? (
          <Link
            to={`/lesson/${nextPhase.id}`}
            className="flex items-center justify-end gap-3 p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-colors text-right"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Next Lesson
              </div>
              <div className="text-xs sm:text-sm font-bold">{nextPhase.shortTitle}</div>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>
        ) : (
          <Link
            to="/quiz"
            className="flex items-center justify-end gap-3 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-right"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                Completed All 4 Phases?
              </div>
              <div className="text-xs sm:text-sm font-bold">
                Take the Full MATH 104 Assessment Quiz →
              </div>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
};
