export type QuizQuestionType = 'multiple-choice' | 'typed-expression';

export interface QuizQuestionItem {
  id: string;
  topicId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'overview';
  topicLabel: string;
  type: QuizQuestionType;
  prompt: string;
  promptLatex?: string;
  // For multiple-choice
  options?: string[];
  correctOptionIndex?: number;
  // For typed-expression (checked via multi-point numerical equivalence)
  expectedExpression?: string;
  variables?: string[];
  placeholder?: string;
  explanation: string;
  explanationLatex?: string;
  // Programmatic test verification against mathEngine finite differences
  derivativeVerification?: {
    sourceFunction: string;
    variable: string;
    expectedDerivative: string;
    testPoints: Record<string, number>[];
  };
}

export const MASTER_QUIZ_BANK: QuizQuestionItem[] = [
  // =====================================================================
  // TYPED-ANSWER DERIVATIVE & DIFFERENTIAL QUESTIONS (Verified vs Finite Diff)
  // =====================================================================
  {
    id: 'q-typed-1',
    topicId: 'phase-1',
    topicLabel: 'Phase 1: Limits & Difference Quotients',
    type: 'typed-expression',
    prompt:
      "Find the derivative f'(x) of f(x) = 2x^2 - 3x (the limit as h → 0 of Practice Problem 1's difference quotient). Equivalent forms like 4x - 3 are accepted:",
    promptLatex: "f(x) = 2x^2 - 3x \\implies f'(x) = \\text{?}",
    expectedExpression: '4*x - 3',
    variables: ['x'],
    placeholder: 'e.g. 4x - 3',
    explanation:
      "From the difference quotient (f(x+h)-f(x))/h = 4x + 2h - 3, taking the limit as h → 0 gives f'(x) = 4x - 3.",
    explanationLatex: "f'(x) = \\lim_{h \\to 0}(4x + 2h - 3) = 4x - 3",
    derivativeVerification: {
      sourceFunction: '2*x^2 - 3*x',
      variable: 'x',
      expectedDerivative: '4*x - 3',
      testPoints: [{ x: -2 }, { x: 0.5 }, { x: 3 }],
    },
  },
  {
    id: 'q-typed-2',
    topicId: 'phase-2',
    topicLabel: 'Phase 2: Tangent Lines & Derivatives',
    type: 'typed-expression',
    prompt:
      "Find the derivative f'(x) of f(x) = x^2 + 2x + 5. Note that equivalent factored forms such as 2x + 2 or 2(x + 1) are both accepted!",
    promptLatex: "f(x) = x^2 + 2x + 5 \\implies f'(x) = \\text{?}",
    expectedExpression: '2*x + 2',
    variables: ['x'],
    placeholder: 'e.g. 2x + 2 or 2(x + 1)',
    explanation: 'By the Power Rule and Sum Rule, d/dx(x^2 + 2x + 5) = 2x + 2 = 2(x + 1).',
    explanationLatex: "f'(x) = 2x + 2 = 2(x + 1)",
    derivativeVerification: {
      sourceFunction: 'x^2 + 2*x + 5',
      variable: 'x',
      expectedDerivative: '2*x + 2',
      testPoints: [{ x: -3 }, { x: 1.5 }, { x: 4 }],
    },
  },
  {
    id: 'q-typed-3',
    topicId: 'phase-2',
    topicLabel: 'Phase 2: Tangent Lines & Derivatives',
    type: 'typed-expression',
    prompt:
      'In ISRT 2nd In-course Exam Problem 1, y = 2/x. Enter the derivative dy/dx as a function of x:',
    promptLatex: "f(x) = \\frac{2}{x} \\implies f'(x) = \\text{?}",
    expectedExpression: '-2 / (x^2)',
    variables: ['x'],
    placeholder: 'e.g. -2/x^2 or -2*x^(-2)',
    explanation: 'Writing y = 2x^(-1) and applying the Power Rule gives dy/dx = -2x^(-2) = -2/x^2.',
    explanationLatex: "f'(x) = -2x^{-2} = -\\frac{2}{x^2}",
    derivativeVerification: {
      sourceFunction: '2/x',
      variable: 'x',
      expectedDerivative: '-2/(x^2)',
      testPoints: [{ x: -2 }, { x: 1.5 }, { x: 3 }],
    },
  },
  {
    id: 'q-typed-4',
    topicId: 'phase-2',
    topicLabel: 'Phase 2: Tangent Lines & Velocity',
    type: 'typed-expression',
    prompt:
      "In ISRT 2nd In-course Exam Problem 2, a particle has position s(t) = 1 + 5t - 2t^2. Enter the velocity function v(t) = s'(t) in terms of t:",
    promptLatex: 's(t) = 1 + 5t - 2t^2 \\implies v(t) = \\text{?}',
    expectedExpression: '5 - 4*t',
    variables: ['t'],
    placeholder: 'e.g. 5 - 4t',
    explanation: 'Differentiating s(t) = 1 + 5t - 2t^2 with respect to t yields v(t) = 5 - 4t.',
    explanationLatex: "v(t) = s'(t) = 5 - 4t",
    derivativeVerification: {
      sourceFunction: '1 + 5*t - 2*t^2',
      variable: 't',
      expectedDerivative: '5 - 4*t',
      testPoints: [{ t: 0 }, { t: 2 }, { t: 3.5 }],
    },
  },
  {
    id: 'q-typed-5',
    topicId: 'phase-2',
    topicLabel: 'Phase 2: Extrema & Optimization',
    type: 'typed-expression',
    prompt:
      "In the ISRT Open Box Optimization problem (Unit 2.4), the volume is V(x) = 4x^3 - 92x^2 + 480x. Enter the derivative V'(x):",
    promptLatex: "V(x) = 4x^3 - 92x^2 + 480x \\implies V'(x) = \\text{?}",
    expectedExpression: '12*x^2 - 184*x + 480',
    variables: ['x'],
    placeholder: 'e.g. 12x^2 - 184x + 480',
    explanation:
      "Applying the Power Rule term-by-term gives V'(x) = 12x^2 - 184x + 480 = 4(3x^2 - 46x + 120).",
    explanationLatex: "V'(x) = 12x^2 - 184x + 480",
    derivativeVerification: {
      sourceFunction: '4*x^3 - 92*x^2 + 480*x',
      variable: 'x',
      expectedDerivative: '12*x^2 - 184*x + 480',
      testPoints: [{ x: 1 }, { x: 10 / 3 }, { x: 5 }],
    },
  },
  {
    id: 'q-typed-6',
    topicId: 'phase-3',
    topicLabel: 'Phase 3: Multivariable Differentials',
    type: 'typed-expression',
    prompt:
      'In Phase 3 Self-Assessment Problem 1, z = x^2 * exp(3y). Enter the partial derivative ∂z/∂x:',
    promptLatex: 'z = x^2 e^{3y} \\implies \\frac{\\partial z}{\\partial x} = \\text{?}',
    expectedExpression: '2*x*exp(3*y)',
    variables: ['x', 'y'],
    placeholder: 'e.g. 2*x*exp(3*y) or 2*x*e^(3*y)',
    explanation:
      'Treating y as a constant, the derivative of x^2 with respect to x is 2x, giving ∂z/∂x = 2x e^(3y).',
    explanationLatex: '\\frac{\\partial z}{\\partial x} = 2x e^{3y}',
    derivativeVerification: {
      sourceFunction: 'x^2 * exp(3*y)',
      variable: 'x',
      expectedDerivative: '2*x*exp(3*y)',
      testPoints: [
        { x: 1.5, y: 0.2 },
        { x: -2, y: 0.5 },
      ],
    },
  },

  // =====================================================================
  // MULTIPLE-CHOICE QUESTIONS FROM ALL PHASES & OVERVIEW PORTAL
  // =====================================================================
  {
    id: 'q-mc-1',
    topicId: 'phase-1',
    topicLabel: 'Phase 1: Limits & Continuity',
    type: 'multiple-choice',
    prompt:
      'In ISRT First Incourse Exam Problem 5(a), what is the value of the limit lim_{x → 1} (x - 1) / (√x - 1)?',
    promptLatex: '\\lim_{x \\to 1} \\frac{x - 1}{\\sqrt{x} - 1}',
    options: ['0', '1', '2', 'Does not exist'],
    correctOptionIndex: 2,
    explanation:
      'Rationalizing the denominator gives (x - 1)(√x + 1)/(x - 1) = √x + 1. Evaluating at x = 1 gives √1 + 1 = 2.',
    explanationLatex: '\\lim_{x \\to 1}(\\sqrt{x} + 1) = 1 + 1 = 2',
    derivativeVerification: {
      sourceFunction: 'sqrt(x)',
      variable: 'x',
      expectedDerivative: '1 / (2*sqrt(x))',
      testPoints: [{ x: 1 }, { x: 4 }],
    },
  },
  {
    id: 'q-mc-2',
    topicId: 'phase-1',
    topicLabel: 'Phase 1: Limits & Continuity',
    type: 'multiple-choice',
    prompt:
      'In ISRT First Incourse Exam Problem 7, which values of k and m make the piecewise function f(x) continuous everywhere at x = -1 and x = 2?',
    promptLatex:
      'f(x) = \\begin{cases} x^2 + 5, & x > 2 \\\\ m(x+1) + k, & -1 < x \\le 2 \\\\ 2x^3 + x + 7, & x \\le -1 \\end{cases}',
    options: ['k = 4, m = 5/3', 'k = 9, m = 4/3', 'k = 4, m = 3', 'k = -4, m = 5/3'],
    correctOptionIndex: 0,
    explanation:
      'Continuity at x = -1 gives k = 2(-1)^3 + (-1) + 7 = 4. Continuity at x = 2 gives 3m + k = 2^2 + 5 = 9 ⇒ 3m = 5 ⇒ m = 5/3.',
    explanationLatex: 'k = 4, \\quad 3m + 4 = 9 \\implies m = \\frac{5}{3}',
  },
  {
    id: 'q-mc-3',
    topicId: 'phase-2',
    topicLabel: 'Phase 2: Implicit Differentiation',
    type: 'multiple-choice',
    prompt:
      'For the Folium of Descartes x^3 + y^3 = 3xy (ISRT Final Exam Problem 4), what is the slope dy/dx and tangent line at (3/2, 3/2)?',
    promptLatex: 'x^3 + y^3 = 3xy \\text{ at } \\left(\\frac{3}{2}, \\frac{3}{2}\\right)',
    options: [
      'm = -1, Tangent line: x + y = 3',
      'm = 1, Tangent line: y = x',
      'm = -3/2, Tangent line: 3x + 2y = 6',
      'm = 0, Tangent line: y = 3/2',
    ],
    correctOptionIndex: 0,
    explanation:
      'Implicit differentiation gives dy/dx = (y - x^2)/(y^2 - x). At (3/2, 3/2), m = (3/2 - 9/4)/(9/4 - 3/2) = -1, so y - 3/2 = -1(x - 3/2) ⇒ x + y = 3.',
    explanationLatex:
      '\\frac{dy}{dx} = \\frac{y - x^2}{y^2 - x} \\implies m = -1, \\quad x + y = 3',
  },
  {
    id: 'q-mc-4',
    topicId: 'phase-3',
    topicLabel: 'Phase 3: Error Propagation',
    type: 'multiple-choice',
    prompt:
      'A rectangular box has dimensions x = 50 cm, y = 20 cm, z = 15 cm with measurement error ±0.1 mm (±0.01 cm) in each dimension. What is the propagated volume error dV?',
    promptLatex: 'V = xyz, \\quad dx = dy = dz = \\pm 0.01\\text{ cm}',
    options: ['±20.5 cm³', '±205 cm³', '±15.0 cm³', '±8.5 cm³'],
    correctOptionIndex: 0,
    explanation:
      'dV = yz dx + xz dy + xy dz = (300 + 750 + 1000)(±0.01) = 2050(±0.01) = ±20.5 cm³.',
    explanationLatex:
      'dV = (20\\cdot 15 + 50\\cdot 15 + 50\\cdot 20)(\\pm 0.01) = \\pm 20.5\\text{ cm}^3',
  },
  {
    id: 'q-mc-5',
    topicId: 'phase-4',
    topicLabel: 'Phase 4: Multivariable Chain Rule',
    type: 'multiple-choice',
    prompt:
      'Let w = x^2*y - y^2, where x = sin(t) and y = e^t (Phase 4 Unit 4.1 Example 3). What is dw/dt when t = 0?',
    promptLatex: 'w = x^2y - y^2, \\quad x = \\sin t, \\quad y = e^t \\quad \\text{at } t = 0',
    options: ['-2', '0', '2', '-1'],
    correctOptionIndex: 0,
    explanation:
      'At t = 0, x = sin(0) = 0 and y = e^0 = 1. By the Chain Rule, dw/dt = (2xy)cos(t) + (x^2 - 2y)e^t = 0 + (0 - 2)(1) = -2.',
    explanationLatex:
      '\\left.\\frac{dw}{dt}\\right|_{t=0} = (2\\cdot 0\\cdot 1)\\cos 0 + (0^2 - 2\\cdot 1)e^0 = -2',
    derivativeVerification: {
      sourceFunction: '(sin(t))^2 * exp(t) - (exp(t))^2',
      variable: 't',
      expectedDerivative: '2*sin(t)*cos(t)*exp(t) + (sin(t))^2*exp(t) - 2*exp(2*t)',
      testPoints: [{ t: 0 }, { t: 0.5 }],
    },
  },
  {
    id: 'q-mc-6',
    topicId: 'overview',
    topicLabel: 'DU Exam Hub: 3D Hessian & Extrema',
    type: 'multiple-choice',
    prompt:
      'In Lecture 15 Slide Example 3, f(x,y) = x^4 + y^4 - 4xy + 1. How are the critical points (0,0), (1,1), and (-1,-1) classified by the Hessian D(x,y) = 144x^2y^2 - 16?',
    promptLatex: 'f(x,y) = x^4 + y^4 - 4xy + 1',
    options: [
      '(0,0) is a Saddle Point (D = -16); (1,1) and (-1,-1) are Local Minima (D = 128, f_xx = 12)',
      '(0,0) is a Local Minimum; (1,1) and (-1,-1) are Saddle Points',
      'All three points are Local Minima',
      'D = 0 at (0,0), so the test is inconclusive',
    ],
    correctOptionIndex: 0,
    explanation:
      'At (0,0), D = -16 < 0 (Saddle Point). At (±1, ±1), D = 144 - 16 = 128 > 0 and f_xx = 12 > 0, giving Local Minima with f(±1, ±1) = -1.',
    explanationLatex:
      'D(0,0) = -16 < 0, \\quad D(\\pm 1, \\pm 1) = 128 > 0, \\, f_{xx}(\\pm 1, \\pm 1) = 12 > 0',
  },
];
