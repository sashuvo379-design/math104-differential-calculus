import React, { useMemo, useState } from 'react';
import { evaluateAst, parseMathExpression } from '../../utils/mathEngine';
import { generateCurveSegments } from '../../utils/plotter';
import { KaTeXMath } from '../common/KaTeXMath';
import { AlertCircle } from 'lucide-react';

const LIMIT_PRESETS = [
  {
    label: 'ISRT Prob 5a: (x - 1)/(√x - 1) as x → 1',
    expr: '(x - 1) / (sqrt(x) - 1)',
    targetC: 1,
    expectedLimitText: 'L = 2 (Removable Discontinuity)',
    domain: [0, 3] as [number, number],
    range: [0.5, 3.5] as [number, number],
  },
  {
    label: 'ISRT Prob 5c: sin²(2x)/x² as x → 0',
    expr: '(sin(2*x))^2 / (x^2)',
    targetC: 0,
    expectedLimitText: 'L = k² = 4',
    domain: [-2, 2] as [number, number],
    range: [-0.5, 5] as [number, number],
  },
  {
    label: 'DU Slot 1: x² + 3x as x → 2',
    expr: 'x^2 + 3*x',
    targetC: 2,
    expectedLimitText: 'L = 10 (Continuous Polynomial)',
    domain: [0, 4] as [number, number],
    range: [0, 20] as [number, number],
  },
  {
    label: 'ISRT Prob 3: |x|/x as x → 0 (Jump)',
    expr: 'abs(x) / x',
    targetC: 0,
    expectedLimitText: 'Does Not Exist (LHL = -1 ≠ RHL = 1)',
    domain: [-2, 2] as [number, number],
    range: [-2, 2] as [number, number],
  },
];

const DELTA_OFFSETS = [0.5, 0.1, 0.05, 0.01, 0.001, 0.0001];

export const LimitVisualizer: React.FC = () => {
  const [exprInput, setExprInput] = useState<string>('(x - 1) / (sqrt(x) - 1)');
  const [targetC, setTargetC] = useState<number>(1);
  const [sliderDelta, setSliderDelta] = useState<number>(0.25);
  const [domain, setDomain] = useState<[number, number]>([0, 3]);
  const [range, setRange] = useState<[number, number]>([0.5, 3.5]);

  const parsed = useMemo(() => parseMathExpression(exprInput, ['x']), [exprInput]);

  const tableRows = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return [];
    const ast = parsed.ast;
    return DELTA_OFFSETS.map((d) => {
      const xLeft = targetC - d;
      const xRight = targetC + d;
      const fLeft = evaluateAst(ast, { x: xLeft });
      const fRight = evaluateAst(ast, { x: xRight });
      return {
        delta: d,
        xLeft,
        fLeft: fLeft.ok ? fLeft.value.toFixed(6) : 'Undefined',
        xRight,
        fRight: fRight.ok ? fRight.value.toFixed(6) : 'Undefined',
      };
    });
  }, [parsed, targetC]);

  const liveApproach = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return null;
    const xL = targetC - sliderDelta;
    const xR = targetC + sliderDelta;
    const fL = evaluateAst(parsed.ast, { x: xL });
    const fR = evaluateAst(parsed.ast, { x: xR });
    const nearL = evaluateAst(parsed.ast, { x: targetC - 1e-5 });
    const nearR = evaluateAst(parsed.ast, { x: targetC + 1e-5 });
    const limitExists = nearL.ok && nearR.ok && Math.abs(nearL.value - nearR.value) < 1e-2;
    const limitVal = limitExists ? 0.5 * (nearL.value + nearR.value) : null;
    return { xL, xR, fL, fR, nearL, nearR, limitExists, limitVal };
  }, [parsed, targetC, sliderDelta]);

  const [xMin, xMax] = domain;
  const [yMin, yMax] = range;
  const width = 620;
  const height = 300;
  const pad = 34;

  const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
  const toSvgY = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);

  const segments = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return [];
    return generateCurveSegments(parsed.ast, xMin, xMax, yMin, yMax, 360);
  }, [parsed, xMin, xMax, yMin, yMax]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Interactive Tool 2 • Two-Sided Limit Convergence
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Limit Visualizer (<KaTeXMath math="x \to c^-" /> and <KaTeXMath math="x \to c^+" />)
        </h3>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {LIMIT_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setExprInput(p.expr);
              setTargetC(p.targetC);
              setDomain(p.domain);
              setRange(p.range);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              exprInput === p.expr && targetC === p.targetC
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="limit-func-input"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Function <KaTeXMath math="f(x)" />
          </label>
          <input
            id="limit-func-input"
            type="text"
            value={exprInput}
            onChange={(e) => setExprInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
          />
        </div>

        <div>
          <label
            htmlFor="limit-target-c"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Target Point <KaTeXMath math="c" /> (<KaTeXMath math="x \to c" />)
          </label>
          <input
            id="limit-target-c"
            type="number"
            step="0.5"
            value={targetC}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (Number.isFinite(val)) setTargetC(val);
            }}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
          />
        </div>

        <div>
          <label
            htmlFor="limit-delta-slider"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Approach Distance <KaTeXMath math={`\\delta = ${sliderDelta.toFixed(4)}`} />
          </label>
          <input
            id="limit-delta-slider"
            type="range"
            min="0.001"
            max="0.8"
            step="0.001"
            value={sliderDelta}
            onChange={(e) => setSliderDelta(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer mt-2"
          />
        </div>
      </div>

      {!parsed.valid && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      )}

      {/* Graph + Table Split */}
      {parsed.valid && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Graph */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={`Limit visualization graph for f(x) = ${exprInput} approaching c = ${targetC}`}
              className="w-full h-auto"
            >
              {/* Target x = c vertical line */}
              <line
                x1={toSvgX(targetC)}
                y1={pad}
                x2={toSvgX(targetC)}
                y2={height - pad}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Curve segments */}
              {segments.map((seg, idx) => {
                if (seg.length < 2) return null;
                const d = seg
                  .map(
                    (pt, i) =>
                      `${i === 0 ? 'M' : 'L'} ${toSvgX(pt.x).toFixed(1)} ${toSvgY(pt.y).toFixed(1)}`
                  )
                  .join(' ');
                return (
                  <path
                    key={idx}
                    d={d}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Left approach point (Amber) */}
              {liveApproach?.fL.ok && (
                <circle
                  cx={toSvgX(liveApproach.xL)}
                  cy={toSvgY(liveApproach.fL.value)}
                  r="6"
                  fill="#d97706"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}

              {/* Right approach point (Emerald) */}
              {liveApproach?.fR.ok && (
                <circle
                  cx={toSvgX(liveApproach.xR)}
                  cy={toSvgY(liveApproach.fR.value)}
                  r="6"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}

              {/* Open circle at limit value L */}
              {liveApproach?.limitVal !== null && liveApproach?.limitVal !== undefined && (
                <circle
                  cx={toSvgX(targetC)}
                  cy={toSvgY(liveApproach.limitVal)}
                  r="5.5"
                  fill="#ffffff"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
              )}
            </svg>

            {liveApproach && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Left (<KaTeXMath math={`x = ${(targetC - sliderDelta).toFixed(4)}`} />
                    ):
                  </span>
                  <span className="font-mono font-bold">
                    {liveApproach.fL.ok ? liveApproach.fL.value.toFixed(6) : 'Undefined'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Right (<KaTeXMath math={`x = ${(targetC + sliderDelta).toFixed(4)}`} />
                    ):
                  </span>
                  <span className="font-mono font-bold">
                    {liveApproach.fR.ok ? liveApproach.fR.value.toFixed(6) : 'Undefined'}
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 font-bold text-indigo-700 dark:text-indigo-300">
                  {liveApproach.limitExists
                    ? `Two-Sided Limit Converges: L ≈ ${liveApproach.limitVal?.toFixed(4)}`
                    : 'Left-Hand Limit ≠ Right-Hand Limit: General Limit Does Not Exist!'}
                </div>
              </div>
            )}
          </div>

          {/* Two-Sided Numerical Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5">δ</th>
                  <th className="p-2.5 text-amber-800 dark:text-amber-300">x = c - δ</th>
                  <th className="p-2.5 text-amber-800 dark:text-amber-300">f(c - δ) [LHL]</th>
                  <th className="p-2.5 text-emerald-800 dark:text-emerald-300">x = c + δ</th>
                  <th className="p-2.5 text-emerald-800 dark:text-emerald-300">f(c + δ) [RHL]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                {tableRows.map((row) => (
                  <tr key={row.delta} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2.5 font-bold text-slate-600 dark:text-slate-400">
                      {row.delta}
                    </td>
                    <td className="p-2.5">{row.xLeft.toFixed(4)}</td>
                    <td className="p-2.5 font-semibold text-amber-700 dark:text-amber-400">
                      {row.fLeft}
                    </td>
                    <td className="p-2.5">{row.xRight.toFixed(4)}</td>
                    <td className="p-2.5 font-semibold text-emerald-700 dark:text-emerald-400">
                      {row.fRight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
