import React, { useEffect, useMemo, useState } from 'react';
import { evaluateAst, numericalDerivative, parseMathExpression } from '../../utils/mathEngine';
import { generateCurveSegments } from '../../utils/plotter';
import { KaTeXMath } from '../common/KaTeXMath';
import { Pause, Play, RotateCcw } from 'lucide-react';

const SECANT_PRESETS = [
  {
    label: 'Lecture Ex 8c: √x at a = 1',
    expr: 'sqrt(x)',
    a: 1,
    domain: [0, 4] as [number, number],
    range: [0, 2.5] as [number, number],
  },
  {
    label: 'Phase 1 Practice: 2x² - 3x at a = 1',
    expr: '2*x^2 - 3*x',
    a: 1,
    domain: [-1, 3] as [number, number],
    range: [-2, 8] as [number, number],
  },
  {
    label: 'ISRT Tangent: 2/x at a = 2',
    expr: '2/x',
    a: 2,
    domain: [0.4, 4.5] as [number, number],
    range: [0, 4] as [number, number],
  },
];

export const SecantToTangent: React.FC = () => {
  const [exprInput, setExprInput] = useState<string>('sqrt(x)');
  const [pointA, setPointA] = useState<number>(1);
  const [hVal, setHVal] = useState<number>(1.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [domain, setDomain] = useState<[number, number]>([0, 4]);
  const [range, setRange] = useState<[number, number]>([0, 2.5]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setHVal((prev) => {
        const next = prev * 0.88;
        if (Math.abs(next) < 0.005) {
          setIsPlaying(false);
          return 0.005;
        }
        return Number(next.toFixed(4));
      });
    }, 80);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const parsed = useMemo(() => parseMathExpression(exprInput, ['x']), [exprInput]);

  const calc = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return null;
    const safeH = Math.abs(hVal) < 1e-4 ? 1e-4 : hVal;
    const fa = evaluateAst(parsed.ast, { x: pointA });
    const fah = evaluateAst(parsed.ast, { x: pointA + safeH });
    const exactDeriv = numericalDerivative(parsed.ast, pointA);
    if (!fa.ok || !fah.ok || !exactDeriv.ok) return null;

    const secantSlope = (fah.value - fa.value) / safeH;
    const tangentSlope = exactDeriv.value;
    return {
      safeH,
      fa: fa.value,
      fah: fah.value,
      secantSlope,
      tangentSlope,
      error: Math.abs(secantSlope - tangentSlope),
    };
  }, [parsed, pointA, hVal]);

  const [xMin, xMax] = domain;
  const [yMin, yMax] = range;
  const width = 640;
  const height = 320;
  const pad = 36;

  const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
  const toSvgY = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);

  const segments = useMemo(() => {
    if (!parsed.valid || !parsed.ast) return [];
    return generateCurveSegments(parsed.ast, xMin, xMax, yMin, yMax, 350);
  }, [parsed, xMin, xMax, yMin, yMax]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Interactive Tool 3 • Difference Quotient Convergence
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Secant-to-Tangent Animation (<KaTeXMath math="h \to 0" />)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (Math.abs(hVal) < 0.02) setHVal(1.5);
              setIsPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause h → 0' : 'Animate h → 0'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setHVal(1.5);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset h
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {SECANT_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setExprInput(p.expr);
              setPointA(p.a);
              setHVal(1.5);
              setDomain(p.domain);
              setRange(p.range);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              exprInput === p.expr
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Slider for h */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center text-xs font-bold mb-1">
          <span>
            Step Size <KaTeXMath math={`h = ${hVal.toFixed(4)}`} /> (Anchor{' '}
            <KaTeXMath math={`a = ${pointA}`} />)
          </span>
          <span className="font-mono text-amber-700 dark:text-amber-400">
            a + h = {(pointA + hVal).toFixed(4)}
          </span>
        </div>
        <input
          type="range"
          min="-1.5"
          max="2.0"
          step="0.005"
          value={hVal}
          aria-label="Secant step size h"
          onChange={(e) => {
            setIsPlaying(false);
            const v = parseFloat(e.target.value);
            setHVal(Math.abs(v) < 0.005 ? 0.005 : v);
          }}
          className="w-full accent-amber-600 cursor-pointer"
        />
      </div>

      {/* SVG Graph */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Secant to tangent convergence graph for ${exprInput}`}
          className="w-full h-auto"
        >
          {/* Curve */}
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
                strokeWidth="2.75"
                strokeLinecap="round"
              />
            );
          })}

          {calc && (
            <>
              {/* True Tangent Line (Red Solid) */}
              <line
                x1={toSvgX(xMin)}
                y1={toSvgY(calc.fa + calc.tangentSlope * (xMin - pointA))}
                x2={toSvgX(xMax)}
                y2={toSvgY(calc.fa + calc.tangentSlope * (xMax - pointA))}
                stroke="#dc2626"
                strokeWidth="2"
              />

              {/* Secant Line (Amber Dashed) */}
              <line
                x1={toSvgX(xMin)}
                y1={toSvgY(calc.fa + calc.secantSlope * (xMin - pointA))}
                x2={toSvgX(xMax)}
                y2={toSvgY(calc.fa + calc.secantSlope * (xMax - pointA))}
                stroke="#d97706"
                strokeWidth="2.25"
                strokeDasharray="6 4"
              />

              {/* Anchor Point P(a, f(a)) */}
              <circle
                cx={toSvgX(pointA)}
                cy={toSvgY(calc.fa)}
                r="6"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Moving Secant Point Q(a+h, f(a+h)) */}
              <circle
                cx={toSvgX(pointA + calc.safeH)}
                cy={toSvgY(calc.fah)}
                r="6"
                fill="#d97706"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>

      {/* Difference Quotient Readout */}
      {calc && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="font-bold text-amber-900 dark:text-amber-300 uppercase text-[10px]">
              Secant Difference Quotient
            </div>
            <div className="mt-1 font-mono text-sm font-bold">
              [f(a+h) - f(a)] / h = {calc.secantSlope.toFixed(5)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <div className="font-bold text-rose-900 dark:text-rose-300 uppercase text-[10px]">
              True Tangent Slope f&apos;(a)
            </div>
            <div className="mt-1 font-mono text-sm font-bold">
              f&apos;({pointA}) = {calc.tangentSlope.toFixed(5)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="font-bold text-emerald-900 dark:text-emerald-300 uppercase text-[10px]">
              Convergence Gap |m_sec - f&apos;(a)|
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {calc.error.toExponential(3)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
