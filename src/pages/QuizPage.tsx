import React, { useEffect, useState } from 'react';
import { MASTER_QUIZ_BANK, QuizQuestionItem } from '../data/quizAndPracticeData';
import { checkExpressionEquivalence } from '../utils/mathEngine';
import { KaTeXMath } from '../components/common/KaTeXMath';
import { useProgress } from '../context/ProgressContext';
import { CheckCircle2, RotateCcw, Send, Trophy, XCircle } from 'lucide-react';

interface QuestionSubmissionState {
  submitted: boolean;
  isCorrect: boolean;
  selectedOptionIndex?: number;
  typedValue?: string;
  validationError?: string;
}

export const QuizPage: React.FC = () => {
  const { state, recordQuizAttempt, recordVisit } = useProgress();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [submissions, setSubmissions] = useState<Record<string, QuestionSubmissionState>>({});
  const [typedDrafts, setTypedDrafts] = useState<Record<string, string>>({});
  const [attemptSaved, setAttemptSaved] = useState<boolean>(false);

  useEffect(() => {
    recordVisit('/quiz', 'Interactive Assessment Quiz Engine');
  }, [recordVisit]);

  const filteredQuestions: QuizQuestionItem[] =
    selectedTopic === 'all'
      ? MASTER_QUIZ_BANK
      : MASTER_QUIZ_BANK.filter((q) => q.topicId === selectedTopic);

  const handleSelectMc = (q: QuizQuestionItem, optionIdx: number) => {
    const isCorrect = optionIdx === q.correctOptionIndex;
    setSubmissions((prev) => ({
      ...prev,
      [q.id]: {
        submitted: true,
        isCorrect,
        selectedOptionIndex: optionIdx,
      },
    }));
  };

  const handleSubmitTyped = (q: QuizQuestionItem) => {
    const raw = (typedDrafts[q.id] || '').trim();
    if (!raw) {
      setSubmissions((prev) => ({
        ...prev,
        [q.id]: {
          submitted: false,
          isCorrect: false,
          typedValue: raw,
          validationError: 'Please enter a mathematical expression before checking.',
        },
      }));
      return;
    }

    const eqRes = checkExpressionEquivalence(
      raw,
      q.expectedExpression || '0',
      q.variables || ['x']
    );

    if (eqRes.error) {
      setSubmissions((prev) => ({
        ...prev,
        [q.id]: {
          submitted: false,
          isCorrect: false,
          typedValue: raw,
          validationError: eqRes.error,
        },
      }));
      return;
    }

    setSubmissions((prev) => ({
      ...prev,
      [q.id]: {
        submitted: true,
        isCorrect: eqRes.equivalent,
        typedValue: raw,
        validationError: undefined,
      },
    }));
  };

  const answeredQuestions = filteredQuestions.filter((q) => submissions[q.id]?.submitted);
  const correctCount = answeredQuestions.filter((q) => submissions[q.id]?.isCorrect).length;

  const handleSaveScore = () => {
    if (answeredQuestions.length === 0) return;
    const topicScores: Record<string, { correct: number; total: number }> = {};
    for (const q of answeredQuestions) {
      if (!topicScores[q.topicId]) topicScores[q.topicId] = { correct: 0, total: 0 };
      topicScores[q.topicId].total += 1;
      if (submissions[q.id]?.isCorrect) {
        topicScores[q.topicId].correct += 1;
      }
    }
    recordQuizAttempt({
      score: correctCount,
      total: filteredQuestions.length,
      percentage: Math.round((correctCount / filteredQuestions.length) * 100),
      topicScores,
    });
    setAttemptSaved(true);
  };

  const handleResetQuiz = () => {
    setSubmissions({});
    setTypedDrafts({});
    setAttemptSaved(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Score Banner */}
      <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
              Instant Grading &amp; Multi-Point Symbolic/Numeric Verification
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              MATH 104 Interactive Quiz Engine
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl">
              Includes both Multiple-Choice and Typed-Expression questions. Equivalent algebraic
              forms (such as <code>2x + 2</code> and <code>2(x + 1)</code>) are automatically
              recognized and accepted.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-white dark:bg-[#111622] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-[#242B3D] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Quiz
            </button>
            {answeredQuestions.length > 0 && !attemptSaved && (
              <button
                type="button"
                onClick={handleSaveScore}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 hover:opacity-90 text-white transition-opacity"
              >
                <Trophy className="w-3.5 h-3.5" />
                Save Score ({correctCount}/{filteredQuestions.length})
              </button>
            )}
          </div>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'all', label: `All Topics (${MASTER_QUIZ_BANK.length})` },
            { id: 'phase-1', label: 'Phase 1: Limits & Continuity' },
            { id: 'phase-2', label: 'Phase 2: Derivatives & Extrema' },
            { id: 'phase-3', label: 'Phase 3: Total Differentials' },
            { id: 'phase-4', label: 'Phase 4: Chain Rule' },
            { id: 'overview', label: 'DU Exam Hub' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTopic(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                selectedTopic === t.id
                  ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E]'
                  : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Live Score Summary Bar */}
      {answeredQuestions.length > 0 && (
        <div className="p-4 rounded-md bg-[#F0F4F8] dark:bg-[#131C2E] border border-zinc-300 dark:border-sky-900/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#0F3D6E] dark:text-sky-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D6E] dark:text-sky-400">
                Current Quiz Progress
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {correctCount} Correct out of {answeredQuestions.length} Answered (Total:{' '}
                {filteredQuestions.length})
              </div>
            </div>
          </div>
          {attemptSaved && (
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-sm">
              Score Recorded to Progress History
            </span>
          )}
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-5">
        {filteredQuestions.map((q, idx) => {
          const sub = submissions[q.id];

          return (
            <div key={q.id} className="academic-panel p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                <span className="font-mono text-xs font-bold text-[#0F3D6E] dark:text-sky-400">
                  Question {idx + 1} • {q.topicLabel}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  {q.type === 'typed-expression' ? 'Typed Math Expression' : 'Multiple Choice'}
                </span>
              </div>

              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-relaxed">
                {q.prompt}
              </p>

              {q.promptLatex && (
                <div className="math-display-box">
                  <KaTeXMath math={q.promptLatex} display />
                </div>
              )}

              {/* Multiple-Choice Options */}
              {q.type === 'multiple-choice' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = sub?.selectedOptionIndex === oIdx;
                    let btnStyle =
                      'bg-[#FAF9F6] dark:bg-[#0B0E14] text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400';
                    if (sub?.submitted) {
                      if (oIdx === q.correctOptionIndex) {
                        btnStyle =
                          'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-600 font-bold';
                      } else if (isSelected) {
                        btnStyle =
                          'bg-rose-50/70 dark:bg-rose-950/40 text-[#991B1B] dark:text-rose-200 border-[#991B1B] font-bold';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectMc(q, oIdx)}
                        className={`p-3 rounded-md border text-left transition-colors ${btnStyle}`}
                      >
                        <span className="font-mono font-bold mr-1.5">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Typed-Answer Input */}
              {q.type === 'typed-expression' && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      aria-label={`Typed answer for ${q.id}`}
                      value={typedDrafts[q.id] ?? ''}
                      onChange={(e) =>
                        setTypedDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmitTyped(q);
                      }}
                      placeholder={q.placeholder || 'Type expression...'}
                      className="flex-1 px-3.5 py-2 rounded-md border border-zinc-300 dark:border-[#242B3D] bg-[#FAF9F6] dark:bg-[#0B0E14] text-sm font-mono outline-none focus:border-[#0F3D6E]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitTyped(q)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 hover:opacity-90 text-white transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Check Answer
                    </button>
                  </div>
                  {sub?.validationError && (
                    <div
                      role="alert"
                      className="text-xs text-[#991B1B] dark:text-rose-400 font-medium"
                    >
                      {sub.validationError}
                    </div>
                  )}
                </div>
              )}

              {/* Instant Feedback & Explanation */}
              {sub?.submitted && (
                <div
                  className={`p-4 rounded-md border text-xs space-y-1.5 ${
                    sub.isCorrect
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-[#991B1B] dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    {sub.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Correct.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-[#991B1B] shrink-0" />
                        <span>Incorrect. Review the explanation below:</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                  {q.explanationLatex && <KaTeXMath math={q.explanationLatex} display />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score History Section */}
      {state.quizHistory.length > 0 && (
        <section className="academic-panel p-6 space-y-3">
          <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Recent Quiz Score History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {state.quizHistory.slice(0, 6).map((attempt) => (
              <div
                key={attempt.id}
                className="p-3 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-zinc-200 dark:border-[#242B3D] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    Score: {attempt.score} / {attempt.total} ({attempt.percentage}%)
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-sm bg-[#F0F4F8] dark:bg-[#131C2E] text-[#0F3D6E] dark:text-sky-300 font-mono font-bold tabular-nums">
                  {attempt.percentage}%
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
