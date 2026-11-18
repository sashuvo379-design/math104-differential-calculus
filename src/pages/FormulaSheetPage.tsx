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
    <div className="space-y-8">
      <header className="border-b border-zinc-200 dark:border-[#242B3D] pb-6 space-y-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Quick Exam Reference
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            Differential Calculus Formula Cheat-Sheet
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl">
            Complete reference of all definitions, theorems, differentiation rules, and DU exam
            formulas across Phases 1–4.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter formulas (e.g. Leibniz, Hessian, Chain Rule, Folium, EVT)..."
              aria-label="Filter formulas"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-zinc-300 dark:border-[#242B3D] bg-white dark:bg-[#111622] text-xs outline-none focus:border-[#0F3D6E]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'DU Exam Hub'].map((ph) => (
              <button
                key={ph}
                type="button"
                onClick={() => setSelectedPhase(ph)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                  selectedPhase === ph
                    ? 'bg-[#0F3D6E] dark:bg-sky-600 text-white border-[#0F3D6E]'
                    : 'bg-white dark:bg-[#111622] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-[#242B3D] hover:border-zinc-400'
                }`}
              >
                {ph === 'all' ? 'All Formulas' : ph}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((f) => (
          <div key={f.id} className="academic-panel p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0F3D6E] dark:text-sky-400">
                  {f.phase}
                </span>
                <span className="text-[11px] font-medium text-zinc-500">{f.category}</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {f.title}
              </h2>
              <div className="math-display-box">
                <KaTeXMath math={f.formulaLatex} display />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {f.description}
              </p>
            </div>

            {f.exampleLatex && (
              <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                <strong className="font-semibold text-zinc-800 dark:text-zinc-200 mr-1">
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
