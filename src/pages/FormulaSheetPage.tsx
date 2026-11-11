import React, { useEffect, useMemo, useState } from 'react';
import { FORMULA_CHEAT_SHEET } from '../data/formulasData';
import { KaTeXMath } from '../components/common/KaTeXMath';
import { useProgress } from '../context/ProgressContext';
import { Search } from 'lucide-react';

export const FormulaSheetPage: React.FC = () => {
  const { recordVisit } = useProgress();
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    recordVisit('/formulas', 'MATH 104 Master Formula Cheat-Sheet');
  }, [recordVisit]);

  const filteredFormulas = useMemo(() => {
    return FORMULA_CHEAT_SHEET.filter((item) => {
      const phaseMatch = selectedPhase === 'all' || item.phase === selectedPhase;
      const q = searchQuery.trim().toLowerCase();
      const textMatch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return phaseMatch && textMatch;
    });
  }, [selectedPhase, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Quick Exam Reference
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Differential Calculus Formula Cheat-Sheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Complete reference of all definitions, theorems, differentiation rules, and DU exam
            formulas across Phases 1–4.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter formulas (e.g. Leibniz, Hessian, Chain Rule, Folium, EVT)..."
              aria-label="Filter formulas"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'DU Exam Hub'].map((ph) => (
              <button
                key={ph}
                type="button"
                onClick={() => setSelectedPhase(ph)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedPhase === ph
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {ph === 'all' ? 'All Formulas' : ph}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((f) => (
          <div
            key={f.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                  {f.phase}
                </span>
                <span className="text-[11px] font-medium text-slate-500">{f.category}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h2>
              <div className="math-display-box">
                <KaTeXMath math={f.formulaLatex} display />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {f.description}
              </p>
            </div>

            {f.exampleLatex && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <strong className="font-semibold text-slate-800 dark:text-slate-200 mr-1">
                  Example:
                </strong>
                <KaTeXMath math={f.exampleLatex} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
