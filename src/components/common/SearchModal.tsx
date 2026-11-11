import React, { useMemo, useState } from 'react';
import { PHASE_LESSONS } from '../../data/phasesData';
import { FORMULA_CHEAT_SHEET } from '../../data/formulasData';
import { LECTURE_15_SLIDE_PROBLEMS, DU_PAST_EXAM_SLOTS } from '../../data/overviewData';
import { useRouter } from '../../context/RouterContext';
import { Search, X, BookOpen, Calculator, FileText } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Lesson Unit' | 'Formula' | 'Exam Problem';
  route: string;
}

const ALL_SEARCH_ITEMS: SearchItem[] = [
  ...PHASE_LESSONS.flatMap((phase) =>
    phase.units.map((u) => ({
      id: u.id,
      title: u.title,
      subtitle: `${phase.shortTitle} • ${u.moduleTag}`,
      category: 'Lesson Unit' as const,
      route: `/lesson/${phase.id}#${u.id}`,
    }))
  ),
  ...FORMULA_CHEAT_SHEET.map((f) => ({
    id: f.id,
    title: f.title,
    subtitle: `${f.phase} • ${f.description}`,
    category: 'Formula' as const,
    route: '/formulas',
  })),
  ...LECTURE_15_SLIDE_PROBLEMS.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: 'Dr. Md. Rakib Hossain Lecture 15 Slide Repository',
    category: 'Exam Problem' as const,
    route: '/overview',
  })),
  ...DU_PAST_EXAM_SLOTS.map((slot) => ({
    id: `slot-${slot.slotNumber}`,
    title: `DU Slot ${slot.slotNumber}: ${slot.title}`,
    subtitle: slot.questionPrompt,
    category: 'Exam Problem' as const,
    route: '/overview',
  })),
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_SEARCH_ITEMS.slice(0, 8);
    return ALL_SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search course topics, formulas, and exam problems"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics (e.g. Folium, Hessian, Leibniz, Chain Rule, Limits, Box)..."
            aria-label="Search input"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching topics or formulas found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  navigate(item.route);
                  onClose();
                }}
                className="w-full p-3.5 text-left hover:bg-blue-50/70 dark:hover:bg-slate-800/70 flex items-start gap-3 transition-colors"
              >
                <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                  {item.category === 'Lesson Unit' ? (
                    <BookOpen className="w-4 h-4" />
                  ) : item.category === 'Formula' ? (
                    <Calculator className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
