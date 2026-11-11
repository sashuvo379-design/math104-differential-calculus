import React, { useCallback, useMemo, useState } from 'react';
import {
  evaluateAst,
  numericalDerivative,
  parseMathExpression,
  solveDerivativeStepByStep,
} from '../../utils/mathEngine';
import { generateCurveSegments, generateDerivativeSegments } from '../../utils/plotter';
import { KaTeXMath } from '../common/KaTeXMath';
import { AlertCircle, Eye, EyeOff, Sliders } from 'lucide-react';

const PRESETS = [
  {
    label: 'Cubic: x³ - 3x',
    expr: 'x^3 - 3*x',
    x0: 1.4,
    domain: [-3, 3] as [number, number],
    range: [-5, 5] as [number, number],
  },
  {
    label: 'ISRT Tangent: 2/x',
    expr: '2/x',
    x0: 2,
    domain: [-5, 5] as [number, number],
    range: [-5, 5] as [number, number],
  },
  {
    label: 'Diff Quotient: 2x² - 3x',
    expr: '2*x^2 - 3*x',
    x0: 1.5,
    domain: [-2, 4] as [number, number],
    range: [-4, 10] as [number, number],
  },
  {
    label: 'Radical: 2 + sqrt(x - 1)',
    expr: '2 + sqrt(x - 1)',
    x0: 2,
    domain: [0, 6] as [number, number],
    range: [0, 6] as [number, number],
  },
  {
    label: 'Rational: (x + 1)/(x - 1)',
    expr: '(x + 1)/(x - 1)',
    x0: 2,
    domain: [-4, 6] as [number, number],
    range: [-5, 7] as [number, number],
  },
  {
    label: 'Corner: abs(x)',
    expr: 'abs(x)',
    x0: 0,
    domain: [-4, 4] as [number, number],
    range: [-1, 5] as [number, number],
  },
];

export const DerivativeExplorer: React.FC = () => {
  const [exprInput, setExprInput] = useState<string>('x^3 - 3*x');
  const [x0, setX0] = useState<number>(1.4);
  const [showDerivativeCurve, setShowDerivativeCurve] = useState<boolean>(true);
  const [xDomain, setXDomain] = useState<[number, number]>([-3, 3]);
  const [yRange, setYRange] = useState<[number, number]>([-5, 5]);

  const parsed = useMemo(() => parseMathExpression(exprInput, ['x']), [exprInput]);
  const symbolic = useMemo(() => solveDerivativeStepByStep(exprInput, 'x'), [exprInput]);

  const pointEval = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return null;
    const fx = evaluateAst(parsed.ast, { x: x0 });
    const dfx = numericalDerivative(parsed.ast, x0);
    return { fx, dfx };
  }, [parsed, x0]);

  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yRange;

  const funcSegments = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return [];
    return generateCurveSegments(parsed.ast, xMin, xMax, yMin, yMax, 420);
  }, [parsed, xMin, xMax, yMin, yMax]);

  const derivSegments = useMemo(() => {
    if (!parsed.valid || !parsed.ast || !showDerivativeCurve) return [];
    return generateDerivativeSegments(parsed.ast, xMin, xMax, yMin, yMax, 320);
  }, [parsed, showDerivativeCurve, xMin, xMax, yMin, yMax]);

  const width = 680;
  const height = 380;
  const pad = 38;

  const toSvgX = useCallback(
    (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad),
    [pad, xMin, xMax, width]
  );
  const toSvgY = useCallback(
    (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad),
    [height, pad, yMin, yMax]
  );
  const fromSvgX = (px: number) => {
    const ratio = (px - pad) / (width - 2 * pad);
    const val = xMin + ratio * (xMax - xMin);
    return Math.max(xMin, Math.min(xMax, Number(val.toFixed(2))));
  };

  const handleSvgPointer = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.buttons !== 1 && e.type !== 'click') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = width / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;
    setX0(fromSvgX(svgX));
  };

  // Build tangent line endpoints across [xMin, xMax]
  const tangentLine = useMemo(() => {
    if (!pointEval || !pointEval.fx.ok || !pointEval.dfx.ok) return null;
    const m = pointEval.dfx.value;
    const y0 = pointEval.fx.value;
    const yAtMin = y0 + m * (xMin - x0);
    const yAtMax = y0 + m * (xMax - x0);
    const intercept = y0 - m * x0;
    return {
      x1: toSvgX(xMin),
      y1: toSvgY(yAtMin),
      x2: toSvgX(xMax),
      y2: toSvgY(yAtMax),
      m,
      y0,
      intercept,
    };
  }, [pointEval, x0, xMin, xMax, toSvgX, toSvgY]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive Tool 1 • Real-Time Calculus Grapher
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Derivative Explorer &amp; Live Tangent Line
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowDerivativeCurve((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            showDerivativeCurve
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          {showDerivativeCurve ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
          {showDerivativeCurve ? "Showing f'(x) Curve" : "Show f'(x) Curve"}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1">Course Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setExprInput(p.expr);
              setX0(p.x0);
              setXDomain(p.domain);
              setYRange(p.range);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              exprInput === p.expr
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input & Slider Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="derivative-explorer-input"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Function <KaTeXMath math="f(x) =" />
          </label>
          <input
            id="derivative-explorer-input"
            type="text"
            value={exprInput}
            onChange={(e) => setExprInput(e.target.value)}
            placeholder="e.g. x^3 - 3*x"
            aria-label="Enter function f(x)"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {!parsed.valid && (
            <div
              role="alert"
              className="mt-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{parsed.error}</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="tangent-point-slider"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Point of Tangency <KaTeXMath math={`x_0 = ${x0.toFixed(2)}`} />
            </label>
            <input
              type="number"
              step="0.1"
              min={xMin}
              max={xMax}
              value={x0}
              aria-label="Numeric point of tangency x0"
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (Number.isFinite(v)) {
                  setX0(Math.max(xMin, Math.min(xMax, v)));
                }
              }}
              className="w-20 px-2 py-0.5 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-right"
            />
          </div>
          <input
            id="tangent-point-slider"
            type="range"
            min={xMin}
            max={xMax}
            step="0.05"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-0.5">
            <span>x = {xMin}</span>
            <span>Click or drag directly on graph</span>
            <span>x = {xMax}</span>
          </div>
        </div>
      </div>

      {/* Coordinate Graph SVG */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Interactive graph of f(x) = ${exprInput} and its tangent line at x = ${x0}`}
          onClick={handleSvgPointer}
          onMouseMove={handleSvgPointer}
          className="w-full h-auto select-none cursor-crosshair touch-none"
        >
          <defs>
            <clipPath id="explorer-plot-clip">
              <rect x={pad} y={pad} width={width - 2 * pad} height={height - 2 * pad} />
            </clipPath>
          </defs>

          {/* Grid Lines */}
          {Array.from({ length: 7 }, (_, i) => {
            const gx = xMin + (i * (xMax - xMin)) / 6;
            const sx = toSvgX(gx);
            return (
              <g key={`gx-${i}`}>
                <line
                  x1={sx}
                  y1={pad}
                  x2={sx}
                  y2={height - pad}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={sx}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {gx.toFixed(1)}
                </text>
              </g>
            );
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const gy = yMin + (i * (yMax - yMin)) / 4;
            const sy = toSvgY(gy);
            return (
              <g key={`gy-${i}`}>
                <line
                  x1={pad}
                  y1={sy}
                  x2={width - pad}
                  y2={sy}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={pad - 6}
                  y={sy + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {gy.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Coordinate Axes */}
          {xMin <= 0 && xMax >= 0 && (
            <line
              x1={toSvgX(0)}
              y1={pad}
              x2={toSvgX(0)}
              y2={height - pad}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-600"
              strokeWidth="1.5"
            />
          )}
          {yMin <= 0 && yMax >= 0 && (
            <line
              x1={pad}
              y1={toSvgY(0)}
              x2={width - pad}
              y2={toSvgY(0)}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-600"
              strokeWidth="1.5"
            />
          )}

          {/* Plot Clipped Curves */}
          <g clipPath="url(#explorer-plot-clip)">
            {/* Derivative Curve f'(x) (Emerald Dashed) */}
            {showDerivativeCurve &&
              derivSegments.map((seg, idx) => {
                if (seg.length < 2) return null;
                const d = seg
                  .map(
                    (pt, i) =>
                      `${i === 0 ? 'M' : 'L'} ${toSvgX(pt.x).toFixed(1)} ${toSvgY(pt.y).toFixed(1)}`
                  )
                  .join(' ');
                return (
                  <path
                    key={`deriv-${idx}`}
                    d={d}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                );
              })}

            {/* Function Curve f(x) (Blue Solid) */}
            {funcSegments.map((seg, idx) => {
              if (seg.length < 2) return null;
              const d = seg
                .map(
                  (pt, i) =>
                    `${i === 0 ? 'M' : 'L'} ${toSvgX(pt.x).toFixed(1)} ${toSvgY(pt.y).toFixed(1)}`
                )
                .join(' ');
              return (
                <path
                  key={`func-${idx}`}
                  d={d}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Tangent Line (Red Solid) */}
            {tangentLine && (
              <line
                x1={tangentLine.x1}
                y1={tangentLine.y1}
                x2={tangentLine.x2}
                y2={tangentLine.y2}
                stroke="#dc2626"
                strokeWidth="2.25"
              />
            )}

            {/* Point of Tangency Marker */}
            {pointEval?.fx.ok && (
              <g>
                <line
                  x1={toSvgX(x0)}
                  y1={toSvgY(0)}
                  x2={toSvgX(x0)}
                  y2={toSvgY(pointEval.fx.value)}
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={toSvgX(x0)}
                  cy={toSvgY(pointEval.fx.value)}
                  r="6"
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
          </g>
        </svg>

        {/* Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400">
              <span className="w-3 h-1 bg-blue-600 rounded inline-block" />
              Function f(x) (Blue)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400">
              <span className="w-3 h-1 bg-rose-600 rounded inline-block" />
              Tangent Line (Red)
            </span>
            {showDerivativeCurve && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-emerald-600 inline-block" />
                Derivative f&apos;(x) (Green)
              </span>
            )}
          </div>
          {symbolic.valid && (
            <div className="text-slate-600 dark:text-slate-400">
              Symbolic <KaTeXMath math={`f'(x) = ${symbolic.derivativeLatex}`} />
            </div>
          )}
        </div>
      </div>

      {/* Live Numeric Readout Cards */}
      {parsed.valid && pointEval && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <div className="text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider text-[10px]">
              Function Value at x₀ = {x0.toFixed(2)}
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1 font-mono">
              {pointEval.fx.ok ? (
                `f(${x0.toFixed(2)}) = ${pointEval.fx.value.toFixed(4)}`
              ) : (
                <span className="text-rose-600 dark:text-rose-400 text-xs">
                  {pointEval.fx.message || 'Undefined at this point'}
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <div className="text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider text-[10px]">
              Tangent Slope m = f&apos;(x₀)
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1 font-mono">
              {pointEval.dfx.ok ? (
                `f'(${x0.toFixed(2)}) = ${pointEval.dfx.value.toFixed(4)}`
              ) : (
                <span className="text-rose-600 dark:text-rose-400 text-xs">
                  {pointEval.dfx.message || 'Not differentiable here'}
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
              Tangent Line Equation
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {tangentLine ? (
                <KaTeXMath
                  math={`y = ${tangentLine.m.toFixed(3)}x ${
                    tangentLine.intercept >= 0 ? '+' : '-'
                  } ${Math.abs(tangentLine.intercept).toFixed(3)}`}
                />
              ) : (
                <span className="text-slate-500">No tangent line at x₀ = {x0.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
