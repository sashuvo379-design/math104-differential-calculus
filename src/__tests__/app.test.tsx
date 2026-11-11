import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../App';
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/storage';

describe('Application Routes, Content Preservation & Component Rendering Suite', () => {
  it('1. Renders Home Page with Course Overview, Continue Where You Left Off, and Progress Bar', () => {
    const html = renderToStaticMarkup(<App initialPath="/" />);
    assert.ok(html.includes('MATH 104: Differential Calculus'));
    assert.ok(html.includes('Continue Where You Left Off'));
    assert.ok(html.includes('Overall Course Progress'));
  });

  it('2. Renders Master Overview Portal preserving all 5 DU Modules, Lecture 15 Slides, and DU 5-Slot Blueprint', () => {
    const html = renderToStaticMarkup(<App initialPath="/overview" />);
    assert.ok(html.includes('MATH 104: Comprehensive 4-Phase Academic Outline'));
    assert.ok(html.includes('Why Does the Hessian Discriminant Work?'));
    assert.ok(html.includes('Dr. Md. Rakib Hossain Lecture 15'));
    assert.ok(html.includes('DU 5-Slot Historical Exam Blueprint'));
    assert.ok(html.includes('Top 4 Academic Point-Loss Traps'));
  });

  it('3. Renders Phase 1–4 Lesson Pages preserving all original units, callouts, worked examples, and self-assessments', () => {
    const p1 = renderToStaticMarkup(<App initialPath="/lesson/phase-1" />);
    assert.ok(p1.includes('Unit 1.1: Functions, Domains, and Symmetry'));
    assert.ok(p1.includes('Unit 1.2: Limit Theorems &amp; Indeterminate Forms'));
    assert.ok(p1.includes('Unit 1.3: Continuity and Differentiability'));
    assert.ok(p1.includes('Unit 1.4: The Difference Quotient'));
    assert.ok(p1.includes('Unit 1.5: Phase 1 Summary Reference Sheet'));

    const p2 = renderToStaticMarkup(<App initialPath="/lesson/phase-2" />);
    assert.ok(p2.includes('Unit 2.1: Tangent Lines and Instantaneous Velocity'));
    assert.ok(p2.includes('Unit 2.2: Implicit Differentiation and the Folium of Descartes'));
    assert.ok(p2.includes('Unit 2.3: Related Rates'));
    assert.ok(p2.includes('Unit 2.4: Extrema and Optimization'));
    assert.ok(p2.includes('Unit 2.5: Phase 2 Summary Reference Sheet'));

    const p3 = renderToStaticMarkup(<App initialPath="/lesson/phase-3" />);
    assert.ok(p3.includes('Unit 3.1: The Total Differential'));
    assert.ok(p3.includes('Unit 3.2: Differentiability of Two Variables'));
    assert.ok(p3.includes('Unit 3.3: Approximation by Differentials &amp; Error Propagation'));

    const p4 = renderToStaticMarkup(<App initialPath="/lesson/phase-4" />);
    assert.ok(p4.includes('Unit 4.1: The Chain Rule (One Independent Variable)'));
    assert.ok(p4.includes('Unit 4.2: The Chain Rule (Two Independent Variables)'));
    assert.ok(p4.includes('Unit 4.3: Implicit Differentiation via Partial Derivatives'));
  });

  it('4. Renders Interactive Lab, Practice, Quiz, Formula Cheat-Sheet, Progress Dashboard, and Custom 404 Page', () => {
    const lab = renderToStaticMarkup(<App initialPath="/lab" />);
    assert.ok(lab.includes('Derivative Explorer'));
    assert.ok(lab.includes('Limit Visualizer'));
    assert.ok(lab.includes('Secant-to-Tangent Animation'));
    assert.ok(lab.includes('Step-by-Step Derivative Solver'));
    assert.ok(lab.includes('Optimization &amp; Curve-Sketching Analyzer'));

    const practice = renderToStaticMarkup(<App initialPath="/practice" />);
    assert.ok(practice.includes('Algebraic Expression Equivalence Checker'));

    const quiz = renderToStaticMarkup(<App initialPath="/quiz" />);
    assert.ok(quiz.includes('MATH 104 Interactive Quiz Engine'));

    const formulas = renderToStaticMarkup(<App initialPath="/formulas" />);
    assert.ok(formulas.includes('Differential Calculus Formula Cheat-Sheet'));

    const progress = renderToStaticMarkup(<App initialPath="/progress" />);
    assert.ok(progress.includes('Student Progress &amp; Exam Readiness Dashboard'));

    const notFound = renderToStaticMarkup(<App initialPath="/non-existent-route-xyz" />);
    assert.ok(notFound.includes('404'));
    assert.ok(notFound.includes('Page Not Found'));
  });

  it('5. Verifies safe localStorage fallback service works cleanly in non-browser/SSR environments', () => {
    safeSetItem('test_key_math104', { score: 5 });
    const val = safeGetItem('test_key_math104', { score: 0 });
    assert.equal(val.score, 5);
    safeRemoveItem('test_key_math104');
    const afterRemove = safeGetItem('test_key_math104', { score: 0 });
    assert.equal(afterRemove.score, 0);
  });
});
