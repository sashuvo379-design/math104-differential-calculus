import React, { useState } from 'react';
import { KaTeXMath } from '../common/KaTeXMath';

const HESSIAN_PRESETS = [
  { label: 'Slide Ex 3 at (1,1): Local Min', fxx: 12, fyy: 12, fxy: -4 },
  { label: 'Slide Ex 3 at (0,0): Saddle Point', fxx: 0, fyy: 0, fxy: -4 },
  { label: 'Slide Ex 4 at (0,0): Monkey Saddle (D=0)', fxx: 0, fyy: 0, fxy: 0 },
  { label: 'Slide Ex 7 at (1,1): Local Max', fxx: -2, fyy: -2, fxy: 0 },
];

export const HessianExplorer: React.FC = () => {
  const [fxx, setFxx] = useState<number>(12);
  const [fyy, setFyy] = useState<number>(12);
  const [fxy, setFxy] = useState<number>(-4);

  const D = fxx * fyy - fxy * fxy;

  let classification = 'Inconclusive (D = 0)';
  let colorClass = 'text-amber-400';
  let explanationLatex = `D = 0 \\implies \\text{Inconclusive. Higher Taylor expansion required.}`;

  if (D > 0) {
    if (fxx > 0) {
      classification = 'Relative Minimum';
      colorClass = 'text-emerald-400';
      explanationLatex = `D = (${fxx})(${fyy}) - (${fxy})^2 = ${D} > 0 \\quad \\text{and} \\quad f_{xx} = ${fxx} > 0 \\implies \\text{Local Minimum}`;
    } else if (fxx < 0) {
      classification = 'Relative Maximum';
      colorClass = 'text-blue-400';
      explanationLatex = `D = (${fxx})(${fyy}) - (${fxy})^2 = ${D} > 0 \\quad \\text{and} \\quad f_{xx} = ${fxx} < 0 \\implies \\text{Local Maximum}`;
    } else {
      classification = 'Inconclusive (f_xx = 0)';
      colorClass = 'text-amber-400';
      explanationLatex = `D > 0 \\text{ but } f_{xx} = 0`;
    }
  } else if (D < 0) {
    classification = 'Saddle Point';
    colorClass = 'text-rose-400';
    explanationLatex = `D = (${fxx})(${fyy}) - (${fxy})^2 = ${D} < 0 \\implies \\text{Saddle Point}`;
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">
            INTERACTIVE ENGINE
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Dynamic Hessian Discriminant Engine
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {HESSIAN_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setFxx(p.fxx);
                setFyy(p.fyy);
                setFxy(p.fxy);
              }}
              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-300">
        Enter second partial derivative values <KaTeXMath math="f_{xx}" />,{' '}
        <KaTeXMath math="f_{yy}" />, and <KaTeXMath math="f_{xy}" /> at any critical point to
        instantly classify the surface geometry:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="hessian-fxx" className="block text-xs text-slate-300 font-medium mb-1">
            Partial Derivative <KaTeXMath math="f_{xx}" />
          </label>
          <input
            id="hessian-fxx"
            type="number"
            value={fxx}
            onChange={(e) => setFxx(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <div>
          <label htmlFor="hessian-fyy" className="block text-xs text-slate-300 font-medium mb-1">
            Partial Derivative <KaTeXMath math="f_{yy}" />
          </label>
          <input
            id="hessian-fyy"
            type="number"
            value={fyy}
            onChange={(e) => setFyy(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <div>
          <label htmlFor="hessian-fxy" className="block text-xs text-slate-300 font-medium mb-1">
            Mixed Derivative <KaTeXMath math="f_{xy}" />
          </label>
          <input
            id="hessian-fxy"
            type="number"
            value={fxy}
            onChange={(e) => setFxy(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Discriminant D:</strong>{' '}
            <span className="font-mono text-blue-400 font-bold text-sm">{D}</span>
          </div>
          <div>
            <strong>Classification:</strong>{' '}
            <span className={`font-bold text-sm ${colorClass}`}>{classification}</span>
          </div>
        </div>
        <div className="text-slate-300 pt-1 overflow-x-auto">
          <KaTeXMath math={explanationLatex} display />
        </div>
      </div>
    </div>
  );
};
