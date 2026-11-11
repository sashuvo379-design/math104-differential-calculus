import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/storage';
import { PHASE_LESSONS } from '../data/phasesData';

export interface QuizAttemptRecord {
  id: string;
  timestamp: string;
  score: number;
  total: number;
  percentage: number;
  topicScores: Record<string, { correct: number; total: number }>;
}

export interface ProgressState {
  completedUnits: string[];
  completedExamples: string[];
  lastVisitedPath: string;
  lastVisitedTitle: string;
  quizHistory: QuizAttemptRecord[];
  streakDays: number;
  lastStudyDate: string;
}

export interface WeakTopicSuggestion {
  topicId: string;
  title: string;
  reason: string;
  route: string;
  accuracyPercent?: number;
}

interface ProgressContextValue {
  state: ProgressState;
  totalUnitsCount: number;
  overallProgressPercent: number;
  toggleUnitComplete: (unitId: string) => void;
  markExampleMastered: (exampleId: string) => void;
  recordVisit: (path: string, title: string) => void;
  recordQuizAttempt: (attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>) => void;
  weakTopics: WeakTopicSuggestion[];
  resetProgress: () => void;
}

const STORAGE_KEY = 'math104_student_progress_v1';

const ALL_UNIT_IDS = PHASE_LESSONS.flatMap((phase) => phase.units.map((u) => u.id));

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_PROGRESS: ProgressState = {
  completedUnits: [],
  completedExamples: [],
  lastVisitedPath: '/lesson/phase-1',
  lastVisitedTitle: 'Phase 1: Functions, Limits, & Continuity',
  quizHistory: [],
  streakDays: 1,
  lastStudyDate: getTodayIsoDate(),
};

const ProgressContext = createContext<ProgressContextValue>({
  state: DEFAULT_PROGRESS,
  totalUnitsCount: ALL_UNIT_IDS.length,
  overallProgressPercent: 0,
  toggleUnitComplete: () => {},
  markExampleMastered: () => {},
  recordVisit: () => {},
  recordQuizAttempt: () => {},
  weakTopics: [],
  resetProgress: () => {},
});

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProgressState>(() => {
    const saved = safeGetItem<ProgressState>(STORAGE_KEY, DEFAULT_PROGRESS);
    return {
      ...DEFAULT_PROGRESS,
      ...saved,
      completedUnits: Array.isArray(saved.completedUnits) ? saved.completedUnits : [],
      completedExamples: Array.isArray(saved.completedExamples) ? saved.completedExamples : [],
      quizHistory: Array.isArray(saved.quizHistory) ? saved.quizHistory : [],
    };
  });

  const updateState = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const today = getTodayIsoDate();
      const next = updater(prev);
      let streak = next.streakDays || 1;
      if (next.lastStudyDate !== today) {
        const prevDate = new Date(next.lastStudyDate);
        const currDate = new Date(today);
        const diffDays = Math.round(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          streak += 1;
        } else if (diffDays > 1) {
          streak = 1;
        }
      }
      const updated = { ...next, streakDays: streak, lastStudyDate: today };
      safeSetItem(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const toggleUnitComplete = useCallback(
    (unitId: string) => {
      updateState((prev) => {
        const exists = prev.completedUnits.includes(unitId);
        const completedUnits = exists
          ? prev.completedUnits.filter((id) => id !== unitId)
          : [...prev.completedUnits, unitId];
        return { ...prev, completedUnits };
      });
    },
    [updateState]
  );

  const markExampleMastered = useCallback(
    (exampleId: string) => {
      updateState((prev) => {
        if (prev.completedExamples.includes(exampleId)) return prev;
        return { ...prev, completedExamples: [...prev.completedExamples, exampleId] };
      });
    },
    [updateState]
  );

  const recordVisit = useCallback(
    (path: string, title: string) => {
      updateState((prev) => {
        if (prev.lastVisitedPath === path && prev.lastVisitedTitle === title) return prev;
        return { ...prev, lastVisitedPath: path, lastVisitedTitle: title };
      });
    },
    [updateState]
  );

  const recordQuizAttempt = useCallback(
    (attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>) => {
      updateState((prev) => {
        const newRecord: QuizAttemptRecord = {
          ...attempt,
          id: `quiz-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        return {
          ...prev,
          quizHistory: [newRecord, ...prev.quizHistory].slice(0, 25),
        };
      });
    },
    [updateState]
  );

  const resetProgress = useCallback(() => {
    safeRemoveItem(STORAGE_KEY);
    setState(DEFAULT_PROGRESS);
  }, []);

  const totalUnitsCount = ALL_UNIT_IDS.length;
  const overallProgressPercent = Math.min(
    100,
    Math.round((state.completedUnits.length / Math.max(1, totalUnitsCount)) * 100)
  );

  const weakTopics = useMemo<WeakTopicSuggestion[]>(() => {
    const suggestions: WeakTopicSuggestion[] = [];
    const topicMeta: Record<string, { title: string; route: string }> = {
      'phase-1': {
        title: 'Phase 1: Limits, Continuity & Difference Quotients',
        route: '/lesson/phase-1',
      },
      'phase-2': {
        title: 'Phase 2: Tangent Lines, Implicit Curves & Optimization',
        route: '/lesson/phase-2',
      },
      'phase-3': {
        title: 'Phase 3: Total Differentials & Error Propagation',
        route: '/lesson/phase-3',
      },
      'phase-4': {
        title: 'Phase 4: Multivariable Chain Rule & Implicit Partials',
        route: '/lesson/phase-4',
      },
      overview: { title: 'DU Exam Hub: 3D Hessian & 5-Slot Blueprint', route: '/overview' },
    };

    // Aggregate quiz accuracy by topic
    const agg: Record<string, { correct: number; total: number }> = {};
    for (const attempt of state.quizHistory) {
      for (const [topicId, stats] of Object.entries(attempt.topicScores || {})) {
        if (!agg[topicId]) agg[topicId] = { correct: 0, total: 0 };
        agg[topicId].correct += stats.correct;
        agg[topicId].total += stats.total;
      }
    }

    for (const [topicId, stats] of Object.entries(agg)) {
      if (stats.total > 0) {
        const acc = Math.round((stats.correct / stats.total) * 100);
        if (acc < 80 && topicMeta[topicId]) {
          suggestions.push({
            topicId,
            title: topicMeta[topicId].title,
            reason: `Quiz accuracy is ${acc}% (${stats.correct}/${stats.total} correct). Review worked exam solutions and retry practice problems.`,
            route: topicMeta[topicId].route,
            accuracyPercent: acc,
          });
        }
      }
    }

    // Also suggest any phase with uncompleted units
    for (const phase of PHASE_LESSONS) {
      const doneInPhase = phase.units.filter((u) => state.completedUnits.includes(u.id)).length;
      if (doneInPhase < phase.units.length && !suggestions.some((s) => s.topicId === phase.id)) {
        suggestions.push({
          topicId: phase.id,
          title: phase.bannerTitle,
          reason: `${doneInPhase} of ${phase.units.length} units completed in this phase.`,
          route: `/lesson/${phase.id}`,
        });
      }
    }

    return suggestions.slice(0, 4);
  }, [state.completedUnits, state.quizHistory]);

  return (
    <ProgressContext.Provider
      value={{
        state,
        totalUnitsCount,
        overallProgressPercent,
        toggleUnitComplete,
        markExampleMastered,
        recordVisit,
        recordQuizAttempt,
        weakTopics,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgress(): ProgressContextValue {
  return useContext(ProgressContext);
}
