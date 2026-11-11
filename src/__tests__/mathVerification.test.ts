import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkExpressionEquivalence,
  evaluateExpression,
  numericalDerivative,
  numericalPartialDerivative,
  numericalSecondDerivative,
  solveDerivativeStepByStep,
  validateMathExpression,
} from '../utils/mathEngine';
import { analyzeFunctionOnInterval, generateCurveSegments } from '../utils/plotter';
import { LECTURE_15_SLIDE_PROBLEMS, OVERVIEW_SELF_QUIZ } from '../data/overviewData';
import { PHASE_LESSONS } from '../data/phasesData';
import { MASTER_QUIZ_BANK } from '../data/quizAndPracticeData';

describe('Zero-Error Programmatic Mathematical Verification Suite', () => {
  it('1. Verifies every quiz question derivative answer key against finite-difference numerical differentiation', () => {
    for (const q of MASTER_QUIZ_BANK) {
      if (q.derivativeVerification) {
        const { sourceFunction, variable, expectedDerivative, testPoints } =
          q.derivativeVerification;

        for (const pt of testPoints) {
          const numDeriv =
            variable === 'x' && Object.keys(pt).length === 1
              ? numericalDerivative(sourceFunction, pt.x).value
              : numericalPartialDerivative(sourceFunction, variable, pt);

          const storedAns = evaluateExpression(expectedDerivative, pt);
          assert.equal(
            storedAns.ok,
            true,
            `Stored answer "${expectedDerivative}" for question ${q.id} failed evaluation`
          );
          assert.ok(
            Math.abs(storedAns.value - numDeriv) < 1e-4 * Math.max(1, Math.abs(numDeriv)),
            `Mismatch on ${q.id} at ${JSON.stringify(pt)}: stored=${storedAns.value}, finiteDiff=${numDeriv}`
          );
        }
      }
    }
  });

  it('2. Verifies all Phase 1–4 worked examples & self-assessment derivatives against numerical finite differences', () => {
    for (const phase of PHASE_LESSONS) {
      for (const unit of phase.units) {
        for (const ex of unit.workedExamples) {
          if (ex.verification && ex.verification.expectedDerivativeExpr) {
            const pts = ex.verification.testPoints || [1, 2, 3];
            for (const x of pts) {
              const numD = numericalDerivative(ex.verification.expr, x);
              const symD = evaluateExpression(ex.verification.expectedDerivativeExpr, { x });
              assert.equal(numD.ok, true);
              assert.equal(symD.ok, true);
              assert.ok(
                Math.abs(numD.value - symD.value) < 1e-4 * Math.max(1, Math.abs(numD.value)),
                `Worked example ${ex.id} failed finite difference check at x=${x}`
              );
            }
          }
        }
      }

      for (const sa of phase.selfAssessment) {
        if (sa.verification && sa.verification.expectedDerivativeExpr) {
          for (const x of [-1.5, 0.5, 2.5]) {
            const numD = numericalDerivative(sa.verification.expr, x);
            const symD = evaluateExpression(sa.verification.expectedDerivativeExpr, { x });
            assert.equal(numD.ok, true);
            assert.equal(symD.ok, true);
            assert.ok(Math.abs(numD.value - symD.value) < 1e-4);
          }
        }
      }
    }
  });

  it('3. Verifies Phase 1 limits, difference quotients, continuity system, and |x| corner non-differentiability', () => {
    // ISRT Prob 5(a): lim_{x->1} (x-1)/(sqrt(x)-1) = 2
    const lim5aLeft = evaluateExpression('(x - 1) / (sqrt(x) - 1)', { x: 1 - 1e-7 });
    const lim5aRight = evaluateExpression('(x - 1) / (sqrt(x) - 1)', { x: 1 + 1e-7 });
    assert.ok(Math.abs(lim5aLeft.value - 2) < 1e-5);
    assert.ok(Math.abs(lim5aRight.value - 2) < 1e-5);

    // ISRT Prob 5(b): lim_{x->inf} sqrt(x^2+2)/(3x-6) = 1/3
    const lim5b = evaluateExpression('sqrt(x^2 + 2) / (3*x - 6)', { x: 1e6 });
    assert.ok(Math.abs(lim5b.value - 1 / 3) < 1e-5);

    // ISRT Prob 5(c): lim_{x->0} sin^2(3x)/x^2 = 9
    const lim5c = evaluateExpression('(sin(3*x))^2 / (x^2)', { x: 1e-5 });
    assert.ok(Math.abs(lim5c.value - 9) < 1e-4);

    // ISRT Prob 3: f(x) = abs(x) at x = 0 is not differentiable (LHD = -1 != RHD = 1)
    const absAtZero = numericalDerivative('abs(x)', 0);
    assert.equal(absAtZero.ok, false);

    // ISRT Prob 7: Piecewise continuity k = 4, m = 5/3
    const k = 4;
    const m = 5 / 3;
    assert.equal(3 * m + k, 9);
    assert.equal(2 * Math.pow(-1, 3) + -1 + 7, k);

    // Lecture Ex 8c: Difference quotient of sqrt(x) === 1 / (sqrt(x+h) + sqrt(x))
    const eq8c = checkExpressionEquivalence(
      '(sqrt(x + h) - sqrt(x)) / h',
      '1 / (sqrt(x + h) + sqrt(x))',
      ['x', 'h']
    );
    assert.equal(eq8c.equivalent, true);

    // Phase 1 Self-Assessment 1: Difference quotient of 2x^2 - 3x === 4x + 2h - 3
    const eqSa1 = checkExpressionEquivalence(
      '(2*(x + h)^2 - 3*(x + h) - (2*x^2 - 3*x)) / h',
      '4*x + 2*h - 3',
      ['x', 'h']
    );
    assert.equal(eqSa1.equivalent, true);
  });

  it('4. Verifies Phase 2 Folium of Descartes, Related Rates, and Open Box Optimization', () => {
    // Folium of Descartes F(x,y) = x^3 + y^3 - 3xy = 0 at (1.5, 1.5)
    const fx = numericalPartialDerivative('x^3 + y^3 - 3*x*y', 'x', { x: 1.5, y: 1.5 });
    const fy = numericalPartialDerivative('x^3 + y^3 - 3*x*y', 'y', { x: 1.5, y: 1.5 });
    const slope = -fx / fy;
    assert.ok(Math.abs(slope - -1) < 1e-5);

    // Baseball related rates: z^2 = x^2 + 90^2 at x = 20, dx/dt = -30 => dz/dt = -60/sqrt(85)
    const z = Math.sqrt(20 * 20 + 90 * 90);
    const dzdt = (20 * -30) / z;
    assert.ok(Math.abs(dzdt - -60 / Math.sqrt(85)) < 1e-9);

    // Open Box V(x) = 4x^3 - 92x^2 + 480x at x = 10/3
    const dV = numericalDerivative('4*x^3 - 92*x^2 + 480*x', 10 / 3);
    const ddV = numericalSecondDerivative('4*x^3 - 92*x^2 + 480*x', 10 / 3);
    assert.ok(Math.abs(dV.value) < 1e-4);
    assert.ok(Math.abs(ddV.value - -104) < 1e-2);
  });

  it('5. Verifies Phase 3 & Phase 4 Total Differentials, Error Propagation, and Multivariable Chain Rule', () => {
    // Phase 3 Ex 1a: z = 2*x*sin(y) - 3*x^2*y^2
    const pt = { x: 1.4, y: 0.7 };
    const dzdxNum = numericalPartialDerivative('2*x*sin(y) - 3*x^2*y^2', 'x', pt);
    const dzdyNum = numericalPartialDerivative('2*x*sin(y) - 3*x^2*y^2', 'y', pt);
    const dzdxSym = evaluateExpression('2*sin(y) - 6*x*y^2', pt);
    const dzdySym = evaluateExpression('2*x*cos(y) - 6*x^2*y', pt);
    assert.ok(Math.abs(dzdxNum - dzdxSym.value) < 1e-5);
    assert.ok(Math.abs(dzdyNum - dzdySym.value) < 1e-5);

    // Phase 3 Approximation: z = sqrt(4 - x^2 - y^2) from (1,1) to (1.01, 0.97)
    const z1 = evaluateExpression('sqrt(4 - x^2 - y^2)', { x: 1, y: 1 }).value;
    const z2 = evaluateExpression('sqrt(4 - x^2 - y^2)', { x: 1.01, y: 0.97 }).value;
    const exactDeltaZ = z2 - z1;
    const approxDz = Math.sqrt(2) * 0.01;
    assert.ok(Math.abs(approxDz - 0.014142) < 1e-4);
    assert.ok(Math.abs(exactDeltaZ - 0.013706) < 1e-4);

    // Phase 4 Ex 4: w = 2xy where x = s^2 + t^2, y = s/t => w(s,t) = 2*(s^2 + t^2)*(s/t)
    const stPoint = { s: 1.8, t: 2.3 };
    const dwdsNum = numericalPartialDerivative('2*(s^2 + t^2)*(s/t)', 's', stPoint);
    const dwdtNum = numericalPartialDerivative('2*(s^2 + t^2)*(s/t)', 't', stPoint);
    const dwdsSym = evaluateExpression('(6*s^2 + 2*t^2)/t', stPoint);
    const dwdtSym = evaluateExpression('(2*s*t^2 - 2*s^3)/(t^2)', stPoint);
    assert.ok(Math.abs(dwdsNum - dwdsSym.value) < 1e-4);
    assert.ok(Math.abs(dwdtNum - dwdtSym.value) < 1e-4);

    // Phase 4 Ex 6: F(x,y) = y^3 + y^2 - 5y - x^2 + 4
    const xyPt = { x: 2.1, y: 1.9 };
    const Fx = numericalPartialDerivative('y^3 + y^2 - 5*y - x^2 + 4', 'x', xyPt);
    const Fy = numericalPartialDerivative('y^3 + y^2 - 5*y - x^2 + 4', 'y', xyPt);
    const dydxNum = -Fx / Fy;
    const dydxSym = evaluateExpression('2*x / (3*y^2 + 2*y - 5)', xyPt);
    assert.ok(Math.abs(dydxNum - dydxSym.value) < 1e-5);
  });

  it('6. Verifies Lecture 15 Slide Examples 3–7 critical points & Hessian discriminants', () => {
    for (const slide of LECTURE_15_SLIDE_PROBLEMS) {
      if (slide.verification.expr2D) {
        const fx = numericalPartialDerivative(
          slide.verification.expr2D,
          'x',
          slide.verification.testPoint
        );
        const fy = numericalPartialDerivative(
          slide.verification.expr2D,
          'y',
          slide.verification.testPoint
        );
        assert.ok(
          Math.abs(fx - slide.verification.expectedFx) < 1e-4,
          `Slide ${slide.id} fx mismatch: ${fx}`
        );
        assert.ok(
          Math.abs(fy - slide.verification.expectedFy) < 1e-4,
          `Slide ${slide.id} fy mismatch: ${fy}`
        );
      }
      if (
        slide.verification.expectedFxx !== undefined &&
        slide.verification.expectedFyy !== undefined &&
        slide.verification.expectedFxy !== undefined &&
        slide.verification.expectedD !== undefined
      ) {
        const computedD =
          slide.verification.expectedFxx * slide.verification.expectedFyy -
          Math.pow(slide.verification.expectedFxy, 2);
        assert.equal(computedD, slide.verification.expectedD);
      }
    }

    assert.equal(OVERVIEW_SELF_QUIZ.length, 5);
  });

  it('7. Verifies multi-point numerical equivalence checker for typed answers (e.g. 2x+2 === 2(x+1))', () => {
    assert.equal(checkExpressionEquivalence('2x + 2', '2*(x + 1)', ['x']).equivalent, true);
    assert.equal(checkExpressionEquivalence('(x + 1)^2', 'x^2 + 2*x + 1', ['x']).equivalent, true);
    assert.equal(checkExpressionEquivalence('-2/x^2', '-2 * x^(-2)', ['x']).equivalent, true);
    assert.equal(checkExpressionEquivalence('2x + 2', '2x + 3', ['x']).equivalent, false);
  });

  it('8. Verifies input validation & sanitization handles edge cases gracefully without crashing', () => {
    // Empty input
    assert.equal(validateMathExpression('').valid, false);
    assert.equal(validateMathExpression('   ').valid, false);

    // Invalid syntax
    assert.equal(validateMathExpression('2 + * x').valid, false);
    assert.equal(validateMathExpression('(x + 1').valid, false);
    assert.equal(validateMathExpression('sin()').valid, false);

    // Literal division by zero
    assert.equal(validateMathExpression('1 / 0').valid, false);

    // Undefined / complex / division by zero at point evaluation
    const divZeroAtPoint = evaluateExpression('2 / (x - 1)', { x: 1 });
    assert.equal(divZeroAtPoint.ok, false);
    assert.equal(divZeroAtPoint.reason, 'division_by_zero');

    const complexAtPoint = evaluateExpression('sqrt(x - 1)', { x: -3 });
    assert.equal(complexAtPoint.ok, false);
    assert.equal(complexAtPoint.reason, 'complex_or_undefined');
  });

  it('9. Verifies Step-by-Step Derivative Solver matches finite differences across all rules', () => {
    const expressions = [
      '4*x^3 - 92*x^2 + 480*x',
      'x^2 * sin(x)',
      '(x + 1) / (x - 1)',
      '(3*x^2 + 5)^4',
      'x^2 * exp(3*x)',
    ];

    for (const expr of expressions) {
      const res = solveDerivativeStepByStep(expr, 'x');
      assert.equal(res.valid, true, `Solver failed on ${expr}`);
      assert.ok(res.steps.length >= 1);

      for (const x of [0.4, 1.7, 2.3]) {
        const sym = evaluateExpression(res.derivativeExpr, { x });
        const num = numericalDerivative(expr, x);
        assert.equal(sym.ok, true);
        assert.equal(num.ok, true);
        assert.ok(
          Math.abs(sym.value - num.value) < 1e-3 * Math.max(1, Math.abs(num.value)),
          `Solver derivative mismatch for ${expr} at x=${x}: sym=${sym.value}, num=${num.value}`
        );
      }
    }
  });

  it('10. Verifies plotter splits curve segments across vertical asymptotes and jump discontinuities', () => {
    // 2/x on [-4, 4] must split into at least 2 disjoint segments across x = 0
    const segsReciprocal = generateCurveSegments('2/x', -4, 4, -10, 10, 300);
    assert.ok(segsReciprocal.length >= 2, '2/x should split across x = 0 asymptote');

    // (x+1)/(x-1) on [-3, 5] must split across x = 1
    const segsRational = generateCurveSegments('(x+1)/(x-1)', -3, 5, -10, 10, 300);
    assert.ok(segsRational.length >= 2, '(x+1)/(x-1) should split across x = 1 asymptote');

    // Curve analysis on x^3 - 3x^2 - 9x + 5 finds Local Max at x = -1 and Local Min at x = 3
    const analysis = analyzeFunctionOnInterval('x^3 - 3*x^2 - 9*x + 5', -3, 5, 450);
    assert.equal(analysis.valid, true);
    assert.ok(
      analysis.criticalPoints.some(
        (cp) => Math.abs(cp.x - -1) < 0.05 && cp.type === 'Local Maximum'
      )
    );
    assert.ok(
      analysis.criticalPoints.some((cp) => Math.abs(cp.x - 3) < 0.05 && cp.type === 'Local Minimum')
    );
  });
});
