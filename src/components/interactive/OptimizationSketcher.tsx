import React, { useMemo, useState } from 'react';
import { analyzeFunctionOnInterval, generateCurveSegments } from '../../utils/plotter';
import { parseMathExpression } from '../../utils/mathEngine';
import { KaTeXMath } from '../common/KaTeXMath';
import { AlertCircle } from 'lucide-react';

const SKETCHER_PRESETS = [
  {
    label: 'Cubic: x³ - 3x² - 9x + 5',
    expr: 'x^3 - 3*x^2 - 9*x + 5',
    xMin: -3,
    xMax: 5,
    yMin: -25,
    yMax: 15,
  },
  {
    label: 'ISRT Open Box: 4x³ - 92x² + 480x',
    expr: '4*x^3 - 92*x^2 + 480*x',
    xMin: 0,
    xMax: 15,
    yMin: -200,
    yMax: 800,
  },
  {
    label: 'Quartic W-Curve: x⁴ - 4x² + 2',
    expr: 'x^4 - 4*x^2 + 2',
    xMin: -2.5,
    xMax: 2.5,
    yMin: -3,
    yMax: 6,
  },
];

export const OptimizationSketcher: React.FC = () => {
  const [exprInput, setExprInput] = useState<string>('x^3 - 3*x^2 - 9*x + 5');
  const [bounds, setBounds] = useState({ xMin: -3, xMax: 5, yMin: -25, yMax: 15 });

  const parsed = useMemo(() => parseMathExpression(exprInput, ['x']), [exprInput]);
  const analysis = useMemo(
    () => analyzeFunctionOnInterval(exprInput, bounds.xMin, bounds.xMax, 450),
    [exprInput, bounds.xMin, bounds.xMax]
  );

  const segments = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return [];
    return generateCurveSegments(
      parsed.ast,
      bounds.xMin,
      bounds.xMax,
      bounds.yMin,
      bounds.yMax,
      400
    );
  }, [parsed, bounds]);

  const width = 640;
  const height = 320;
  const pad = 38;
  const toSvgX = (x: number) =>
    pad + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * (width - 2 * pad);
  const toSvgY = (y: number) =>
    height - pad - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * (height - 2 * pad);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Interactive Tool 5 • Extrema, Monotonicity &amp; Concavity
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Optimization &amp; Curve-Sketching Analyzer
        </h3>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {SKETCHER_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setExprInput(p.expr);
              setBounds({ xMin: p.xMin, xMax: p.xMax, yMin: p.yMin, yMax: p.yMax });
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              exprInput === p.expr
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label
            htmlFor="sketcher-expr-input"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Function <KaTeXMath math="f(x)" />
          </label>
          <input
            id="sketcher-expr-input"
            type="text"
            value={exprInput}
            onChange={(e) => setExprInput(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              xMin
            </label>
            <input
              type="number"
              value={bounds.xMin}
              onChange={(e) => setBounds((b) => ({ ...b, xMin: parseFloat(e.target.value) || -5 }))}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              xMax
            </label>
            <input
              type="number"
              value={bounds.xMax}
              onChange={(e) => setBounds((b) => ({ ...b, xMax: parseFloat(e.target.value) || 5 }))}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {!parsed.valid ? (
        <div
          role="alert"
          className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{parsed.error}</span>
        </div>
      ) : (
        <>
          {/* Graph */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={`Curve sketching plot of ${exprInput}`}
              className="w-full h-auto"
            >
              {/* Axes */}
              {bounds.xMin <= 0 && bounds.xMax >= 0 && (
                <line
                  x1={toSvgX(0)}
                  y1={pad}
                  x2={toSvgX(0)}
                  y2={height - pad}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              )}
              {bounds.yMin <= 0 && bounds.yMax >= 0 && (
                <line
                  x1={pad}
                  y1={toSvgY(0)}
                  x2={width - pad}
                  y2={toSvgY(0)}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              )}

              {/* Function curve */}
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

              {/* Critical Points */}
              {analysis.criticalPoints.map((cp, idx) => (
                <g key={`cp-${idx}`}>
                  <circle
                    cx={toSvgX(cp.x)}
                    cy={toSvgY(cp.y)}
                    r="6.5"
                    fill={cp.type === 'Local Maximum' ? '#dc2626' : '#059669'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={toSvgX(cp.x)}
                    y={toSvgY(cp.y) - 10}
                    textAnchor="middle"
                    className="fill-slate-800 dark:fill-slate-200 text-[10px] font-bold"
                  >
                    {cp.type === 'Local Maximum' ? 'Max' : 'Min'} ({cp.x.toFixed(2)},{' '}
                    {cp.y.toFixed(1)})
                  </text>
                </g>
              ))}

              {/* Inflection Points */}
              {analysis.inflectionPoints.map((ip, idx) => (
                <g key={`ip-${idx}`}>
                  <circle
                    cx={toSvgX(ip.x)}
                    cy={toSvgY(ip.y)}
                    r="5.5"
                    fill="#9333ea"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={toSvgX(ip.x)}
                    y={toSvgY(ip.y) + 16}
                    textAnchor="middle"
                    className="fill-purple-700 dark:fill-purple-300 text-[10px] font-bold"
                  >
                    Infl ({ip.x.toFixed(2)}, {ip.y.toFixed(1)})
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Analysis Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Critical Points (<KaTeXMath math="f'(x)=0" />)
              </div>
              {analysis.criticalPoints.length === 0 ? (
                <p className="text-slate-500">None in interval</p>
              ) : (
                analysis.criticalPoints.map((cp, i) => (
                  <div key={i} className="font-mono text-[11px]">
                    ({cp.x.toFixed(2)}, {cp.y.toFixed(2)}) —{' '}
                    <strong
                      className={cp.type === 'Local Maximum' ? 'text-rose-600' : 'text-emerald-600'}
                    >
                      {cp.type}
                    </strong>
                  </div>
                ))
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Monotonicity (<KaTeXMath math="f'(x)" /> Sign)
              </div>
              <div className="text-emerald-700 dark:text-emerald-400">
                <strong>Increasing:</strong>{' '}
                {analysis.increasingIntervals.map((iv) => iv.label).join(' ∪ ') || 'None'}
              </div>
              <div className="text-rose-700 dark:text-rose-400">
                <strong>Decreasing:</strong>{' '}
                {analysis.decreasingIntervals.map((iv) => iv.label).join(' ∪ ') || 'None'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Concavity (<KaTeXMath math="f''(x)" /> Sign)
              </div>
              <div className="text-blue-700 dark:text-blue-400">
                <strong>Concave Up (∪):</strong>{' '}
                {analysis.concaveUpIntervals.map((iv) => iv.label).join(' ∪ ') || 'None'}
              </div>
              <div className="text-amber-700 dark:text-amber-400">
                <strong>Concave Down (∩):</strong>{' '}
                {analysis.concaveDownIntervals.map((iv) => iv.label).join(' ∪ ') || 'None'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Inflection Points (<KaTeXMath math="f''(x)=0" />)
              </div>
              {analysis.inflectionPoints.length === 0 ? (
                <p className="text-slate-500">None in interval</p>
              ) : (
                analysis.inflectionPoints.map((ip, i) => (
                  <div
                    key={i}
                    className="font-mono text-[11px] text-purple-700 dark:text-purple-300"
                  >
                    ({ip.x.toFixed(2)}, {ip.y.toFixed(2)})
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
