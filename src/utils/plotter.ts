import {
  evaluateAst,
  MathNode,
  numericalDerivative,
  numericalSecondDerivative,
  parseMathExpression,
} from './mathEngine';

export interface PlotPoint {
  x: number;
  y: number;
}

export type CurveSegment = PlotPoint[];

export interface CriticalPointInfo {
  x: number;
  y: number;
  type: 'Local Maximum' | 'Local Minimum' | 'Horizontal Inflection';
  secondDerivative: number;
}

export interface InflectionPointInfo {
  x: number;
  y: number;
}

export interface IntervalBehavior {
  from: number;
  to: number;
  label: string;
}

export interface CurveAnalysisResult {
  valid: boolean;
  error?: string;
  criticalPoints: CriticalPointInfo[];
  inflectionPoints: InflectionPointInfo[];
  increasingIntervals: IntervalBehavior[];
  decreasingIntervals: IntervalBehavior[];
  concaveUpIntervals: IntervalBehavior[];
  concaveDownIntervals: IntervalBehavior[];
}

/**
 * Generates disjoint polyline segments for y = f(x) over [xMin, xMax].
 * Automatically splits segments across:
 * 1. Undefined/non-real domain points (e.g. sqrt(x-1) for x < 1)
 * 2. Vertical asymptotes (e.g. 2/x at x = 0, (x+1)/(x-1) at x = 1, tan(x) at pi/2)
 * 3. Jump discontinuities (e.g. abs(x)/x at x = 0)
 * Never draws false vertical lines across gaps!
 */
export function generateCurveSegments(
  exprOrAst: string | MathNode,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  numSamples = 450
): CurveSegment[] {
  const ast = typeof exprOrAst === 'string' ? parseMathExpression(exprOrAst, ['x']).ast : exprOrAst;
  if (!ast) return [];

  const segments: CurveSegment[] = [];
  let currentSegment: CurveSegment = [];
  const dx = (xMax - xMin) / numSamples;
  const ySpan = Math.max(1, yMax - yMin);
  const clipMargin = ySpan * 2.5;

  let prevX: number | null = null;
  let prevY: number | null = null;

  for (let i = 0; i <= numSamples; i++) {
    const x = xMin + i * dx;
    const res = evaluateAst(ast, { x });

    if (!res.ok || !Number.isFinite(res.value) || Math.abs(res.value) > Math.max(1e5, ySpan * 50)) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
      prevX = null;
      prevY = null;
      continue;
    }

    const y = res.value;

    // Check for asymptote or jump discontinuity between (prevX, prevY) and (x, y)
    if (prevX !== null && prevY !== null) {
      const deltaY = Math.abs(y - prevY);
      const midX = 0.5 * (prevX + x);
      const midRes = evaluateAst(ast, { x: midX });

      const signFlip = (prevY > 0 && y < 0) || (prevY < 0 && y > 0);
      const steepJump = deltaY > ySpan * 0.45;
      const midpointDiverges =
        !midRes.ok ||
        Math.abs(midRes.value - 0.5 * (prevY + y)) > Math.max(deltaY * 0.65, ySpan * 0.15);

      if ((steepJump && (signFlip || midpointDiverges)) || deltaY > clipMargin) {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    }

    if (y >= yMin - clipMargin && y <= yMax + clipMargin) {
      currentSegment.push({ x, y });
    } else if (currentSegment.length > 0) {
      segments.push(currentSegment);
      currentSegment = [];
    }

    prevX = x;
    prevY = y;
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

/**
 * Generates disjoint segments for the numerical derivative curve y = f'(x).
 */
export function generateDerivativeSegments(
  exprOrAst: string | MathNode,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  numSamples = 350
): CurveSegment[] {
  const ast = typeof exprOrAst === 'string' ? parseMathExpression(exprOrAst, ['x']).ast : exprOrAst;
  if (!ast) return [];

  const segments: CurveSegment[] = [];
  let currentSegment: CurveSegment = [];
  const dx = (xMax - xMin) / numSamples;
  const ySpan = Math.max(1, yMax - yMin);
  const clipMargin = ySpan * 2.5;

  let prevY: number | null = null;

  for (let i = 0; i <= numSamples; i++) {
    const x = xMin + i * dx;
    const dRes = numericalDerivative(ast, x);
    if (!dRes.ok || !Number.isFinite(dRes.value)) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
      prevY = null;
      continue;
    }

    const y = dRes.value;
    if (prevY !== null && Math.abs(y - prevY) > ySpan * 0.65) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    }

    if (y >= yMin - clipMargin && y <= yMax + clipMargin) {
      currentSegment.push({ x, y });
    } else if (currentSegment.length > 0) {
      segments.push(currentSegment);
      currentSegment = [];
    }

    prevY = y;
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

/**
 * Finds critical points (f'(x) = 0), inflection points (f''(x) = 0),
 * increasing/decreasing intervals, and concavity intervals on [xMin, xMax].
 */
export function analyzeFunctionOnInterval(
  expr: string,
  xMin: number,
  xMax: number,
  steps = 400
): CurveAnalysisResult {
  const parsed = parseMathExpression(expr, ['x']);
  if (!parsed.valid || !parsed.ast) {
    return {
      valid: false,
      error: parsed.error || 'Invalid expression',
      criticalPoints: [],
      inflectionPoints: [],
      increasingIntervals: [],
      decreasingIntervals: [],
      concaveUpIntervals: [],
      concaveDownIntervals: [],
    };
  }

  const ast = parsed.ast;
  const dx = (xMax - xMin) / steps;
  const criticalPoints: CriticalPointInfo[] = [];
  const inflectionPoints: InflectionPointInfo[] = [];

  // Bisection helper to refine root of g(x) = 0
  function bisectRoot(fn: (x: number) => number, a: number, b: number): number {
    let left = a;
    let right = b;
    let fLeft = fn(left);
    for (let iter = 0; iter < 28; iter++) {
      const mid = 0.5 * (left + right);
      const fMid = fn(mid);
      if (!Number.isFinite(fMid)) break;
      if (Math.abs(fMid) < 1e-9) return mid;
      if ((fLeft > 0 && fMid < 0) || (fLeft < 0 && fMid > 0)) {
        right = mid;
      } else {
        left = mid;
        fLeft = fMid;
      }
    }
    return 0.5 * (left + right);
  }

  for (let i = 0; i < steps; i++) {
    const x1 = xMin + i * dx;
    const x2 = x1 + dx;

    // Check 1st derivative zero crossing
    const d1 = numericalDerivative(ast, x1);
    const d2 = numericalDerivative(ast, x2);
    if (d1.ok && d2.ok) {
      if (
        Math.abs(d1.value) < 1e-6 ||
        (d1.value > 0 && d2.value < 0) ||
        (d1.value < 0 && d2.value > 0)
      ) {
        const rootX =
          Math.abs(d1.value) < 1e-6
            ? x1
            : bisectRoot((x) => numericalDerivative(ast, x).value, x1, x2);
        const fVal = evaluateAst(ast, { x: rootX });
        const dAtRoot = numericalDerivative(ast, rootX);
        const ddAtRoot = numericalSecondDerivative(ast, rootX);

        if (
          fVal.ok &&
          dAtRoot.ok &&
          Math.abs(dAtRoot.value) < 1e-2 &&
          !criticalPoints.some((cp) => Math.abs(cp.x - rootX) < dx * 1.8)
        ) {
          const secondD = ddAtRoot.ok ? ddAtRoot.value : 0;
          let type: CriticalPointInfo['type'] = 'Horizontal Inflection';
          if (secondD < -1e-3) type = 'Local Maximum';
          else if (secondD > 1e-3) type = 'Local Minimum';

          criticalPoints.push({
            x: Number(rootX.toFixed(4)),
            y: Number(fVal.value.toFixed(4)),
            type,
            secondDerivative: Number(secondD.toFixed(4)),
          });
        }
      }
    }

    // Check 2nd derivative zero crossing (inflection point)
    const dd1 = numericalSecondDerivative(ast, x1);
    const dd2 = numericalSecondDerivative(ast, x2);
    if (dd1.ok && dd2.ok) {
      if ((dd1.value > 1e-4 && dd2.value < -1e-4) || (dd1.value < -1e-4 && dd2.value > 1e-4)) {
        const infX = bisectRoot((x) => numericalSecondDerivative(ast, x).value, x1, x2);
        const fVal = evaluateAst(ast, { x: infX });
        const ddAtInf = numericalSecondDerivative(ast, infX);
        if (
          fVal.ok &&
          ddAtInf.ok &&
          Math.abs(ddAtInf.value) < 0.5 &&
          !inflectionPoints.some((ip) => Math.abs(ip.x - infX) < dx * 2)
        ) {
          inflectionPoints.push({
            x: Number(infX.toFixed(4)),
            y: Number(fVal.value.toFixed(4)),
          });
        }
      }
    }
  }

  // Build monotonicity intervals from critical points
  const monoBounds = [xMin, ...criticalPoints.map((c) => c.x), xMax].sort((a, b) => a - b);
  const increasingIntervals: IntervalBehavior[] = [];
  const decreasingIntervals: IntervalBehavior[] = [];

  for (let i = 0; i < monoBounds.length - 1; i++) {
    const a = monoBounds[i];
    const b = monoBounds[i + 1];
    if (b - a < 1e-3) continue;
    const mid = 0.5 * (a + b);
    const dMid = numericalDerivative(ast, mid);
    if (dMid.ok) {
      const label = `(${a.toFixed(2)}, ${b.toFixed(2)})`;
      if (dMid.value > 1e-4) {
        increasingIntervals.push({ from: a, to: b, label });
      } else if (dMid.value < -1e-4) {
        decreasingIntervals.push({ from: a, to: b, label });
      }
    }
  }

  // Build concavity intervals from inflection points
  const concBounds = [xMin, ...inflectionPoints.map((p) => p.x), xMax].sort((a, b) => a - b);
  const concaveUpIntervals: IntervalBehavior[] = [];
  const concaveDownIntervals: IntervalBehavior[] = [];

  for (let i = 0; i < concBounds.length - 1; i++) {
    const a = concBounds[i];
    const b = concBounds[i + 1];
    if (b - a < 1e-3) continue;
    const mid = 0.5 * (a + b);
    const ddMid = numericalSecondDerivative(ast, mid);
    if (ddMid.ok) {
      const label = `(${a.toFixed(2)}, ${b.toFixed(2)})`;
      if (ddMid.value > 1e-4) {
        concaveUpIntervals.push({ from: a, to: b, label });
      } else if (ddMid.value < -1e-4) {
        concaveDownIntervals.push({ from: a, to: b, label });
      }
    }
  }

  return {
    valid: true,
    criticalPoints,
    inflectionPoints,
    increasingIntervals,
    decreasingIntervals,
    concaveUpIntervals,
    concaveDownIntervals,
  };
}
