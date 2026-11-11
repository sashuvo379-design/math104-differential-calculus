export interface FormulaEntry {
  id: string;
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4' | 'DU Exam Hub';
  category: string;
  title: string;
  formulaLatex: string;
  description: string;
  exampleLatex?: string;
}

export const FORMULA_CHEAT_SHEET: FormulaEntry[] = [
  // Phase 1
  {
    id: 'f-even',
    phase: 'Phase 1',
    category: 'Functions & Symmetry',
    title: 'Even Function Symmetry',
    formulaLatex: 'f(-x) = f(x) \\quad \\forall x \\in \\text{Domain}(f)',
    description: 'Symmetric with respect to the y-axis [cite: 9].',
    exampleLatex: 'g(x) = \\frac{f(x) + f(-x)}{2} \\implies g(-x) = g(x)',
  },
  {
    id: 'f-odd',
    phase: 'Phase 1',
    category: 'Functions & Symmetry',
    title: 'Odd Function Symmetry',
    formulaLatex: 'f(-x) = -f(x) \\quad \\forall x \\in \\text{Domain}(f)',
    description: 'Symmetric with respect to the origin [cite: 9].',
    exampleLatex: 'h(x) = \\frac{f(x) - f(-x)}{2} \\implies h(-x) = -h(x)',
  },
  {
    id: 'f-eps-delta',
    phase: 'Phase 1',
    category: 'Limits & Continuity',
    title: 'Formal ε–δ Definition of a Limit',
    formulaLatex:
      '\\forall \\varepsilon > 0, \\, \\exists \\delta > 0 \\text{ s.t. } 0 < |x - c| < \\delta \\implies |f(x) - L| < \\varepsilon',
    description: 'Rigorous proof criteria for single-variable limits (DU Exam Slot 1).',
    exampleLatex:
      '\\lim_{x \\to 2}(x^2+3x)=10 \\implies \\delta = \\min\\left(1, \\frac{\\varepsilon}{8}\\right)',
  },
  {
    id: 'f-trig-limit',
    phase: 'Phase 1',
    category: 'Limits & Continuity',
    title: 'Fundamental Trigonometric Limit',
    formulaLatex:
      '\\lim_{\\theta \\to 0} \\frac{\\sin\\theta}{\\theta} = 1, \\qquad \\lim_{x \\to 0} \\frac{\\sin^2(kx)}{x^2} = k^2',
    description: 'Standard limit used to resolve 0/0 trigonometric indeterminate forms [cite: 10].',
  },
  {
    id: 'f-continuity',
    phase: 'Phase 1',
    category: 'Limits & Continuity',
    title: 'Continuity at a Point x = c',
    formulaLatex: '\\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = f(c)',
    description:
      'Left-hand limit, right-hand limit, and function value must all exist and agree [cite: 10].',
  },
  {
    id: 'f-diff-quotient',
    phase: 'Phase 1',
    category: 'Core Derivative Tools',
    title: 'Difference Quotient',
    formulaLatex: '\\frac{f(x+h) - f(x)}{h}, \\quad h \\neq 0',
    description: 'Slope of the secant line through (x, f(x)) and (x+h, f(x+h)) [cite: 9].',
    exampleLatex: 'f(x)=\\sqrt{x} \\implies \\frac{1}{\\sqrt{x+h}+\\sqrt{x}}',
  },
  {
    id: 'f-deriv-def',
    phase: 'Phase 1',
    category: 'Core Derivative Tools',
    title: 'Limit Definition of the Derivative',
    formulaLatex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}",
    description: 'Instantaneous rate of change and tangent line slope at x = a [cite: 5].',
  },

  // Phase 2
  {
    id: 'f-tangent-line',
    phase: 'Phase 2',
    category: 'Differentiation & Geometry',
    title: 'Tangent Line Equation at P(a, f(a))',
    formulaLatex: "y - f(a) = f'(a)(x - a)",
    description: 'Point-slope equation of the line tangent to y = f(x) at x = a [cite: 3, 4].',
    exampleLatex: 'y = \\frac{2}{x} \\text{ at } (2,1) \\implies y = -\\frac{1}{2}x + 2',
  },
  {
    id: 'f-velocity',
    phase: 'Phase 2',
    category: 'Differentiation & Geometry',
    title: 'Instantaneous Velocity',
    formulaLatex: "v(t) = s'(t) = \\frac{ds}{dt}",
    description: 'Derivative of position s = f(t) with respect to time t [cite: 4].',
  },
  {
    id: 'f-power-product-quotient',
    phase: 'Phase 2',
    category: 'Differentiation Rules',
    title: 'Power, Product & Quotient Rules',
    formulaLatex:
      "\\frac{d}{dx}[x^n] = nx^{n-1}, \\quad (uv)' = u'v + uv', \\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}",
    description: 'Core algebraic differentiation rules.',
  },
  {
    id: 'f-folium',
    phase: 'Phase 2',
    category: 'Implicit Differentiation',
    title: 'Folium of Descartes Implicit Derivative',
    formulaLatex: 'x^3 + y^3 = 3xy \\implies \\frac{dy}{dx} = \\frac{y - x^2}{y^2 - x}',
    description: 'Classic ISRT Final Exam implicit differentiation curve [cite: 3, 4].',
  },
  {
    id: 'f-evt',
    phase: 'Phase 2',
    category: 'Extrema & Optimization',
    title: 'Extreme Value Theorem (EVT)',
    formulaLatex:
      'f \\in C[a,b] \\implies \\exists c, d \\in [a,b] \\text{ s.t. } f(d) \\le f(x) \\le f(c) \\; \\forall x \\in [a,b]',
    description:
      'A continuous function on a closed interval [a,b] attains an absolute maximum and an absolute minimum [cite: 3].',
  },

  // Phase 3
  {
    id: 'f-total-diff-2d',
    phase: 'Phase 3',
    category: 'Multivariable Calculus',
    title: 'Total Differential (Two Variables)',
    formulaLatex:
      'dz = \\frac{\\partial z}{\\partial x} dx + \\frac{\\partial z}{\\partial y} dy = f_x(x,y)dx + f_y(x,y)dy',
    description: 'Linear approximation of Δz for z = f(x, y) [cite: 10].',
  },
  {
    id: 'f-total-diff-nd',
    phase: 'Phase 3',
    category: 'Multivariable Calculus',
    title: 'Total Differential (Four Variables)',
    formulaLatex:
      'dw = \\frac{\\partial w}{\\partial x} dx + \\frac{\\partial w}{\\partial y} dy + \\frac{\\partial w}{\\partial z} dz + \\frac{\\partial w}{\\partial u} du',
    description: 'Extension of total differential to w = f(x, y, z, u) [cite: 10].',
  },
  {
    id: 'f-diff-2var',
    phase: 'Phase 3',
    category: 'Multivariable Calculus',
    title: 'Formal Differentiability of z = f(x, y)',
    formulaLatex:
      '\\Delta z = f_x(x_0, y_0)\\Delta x + f_y(x_0, y_0)\\Delta y + \\varepsilon_1\\Delta x + \\varepsilon_2\\Delta y, \\quad (\\varepsilon_1, \\varepsilon_2) \\to (0,0)',
    description:
      'Sufficient condition (Theorem 13.4): f_x and f_y continuous on open region R [cite: 10].',
  },

  // Phase 4
  {
    id: 'f-chain-1var',
    phase: 'Phase 4',
    category: 'Multivariable Chain Rule',
    title: 'Theorem 13.5: Chain Rule (One Independent Variable)',
    formulaLatex:
      '\\frac{dw}{dt} = \\frac{\\partial w}{\\partial x} \\frac{dx}{dt} + \\frac{\\partial w}{\\partial y} \\frac{dy}{dt}',
    description: 'Rate of change of w = f(x, y) along path x = g(t), y = h(t) [cite: 10].',
  },
  {
    id: 'f-chain-2var',
    phase: 'Phase 4',
    category: 'Multivariable Chain Rule',
    title: 'Theorem 13.6: Chain Rule (Two Independent Variables)',
    formulaLatex:
      '\\frac{\\partial w}{\\partial s} = \\frac{\\partial w}{\\partial x} \\frac{\\partial x}{\\partial s} + \\frac{\\partial w}{\\partial y} \\frac{\\partial y}{\\partial s}, \\qquad \\frac{\\partial w}{\\partial t} = \\frac{\\partial w}{\\partial x} \\frac{\\partial x}{\\partial t} + \\frac{\\partial w}{\\partial y} \\frac{\\partial y}{\\partial t}',
    description: 'Partial derivatives of w = f(x, y) when x = g(s, t) and y = h(s, t) [cite: 10].',
  },
  {
    id: 'f-implicit-partial',
    phase: 'Phase 4',
    category: 'Multivariable Chain Rule',
    title: 'Theorem 13.7: Implicit Differentiation via Partials',
    formulaLatex:
      '\\frac{dy}{dx} = -\\frac{F_x(x,y)}{F_y(x,y)}, \\qquad \\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}, \\qquad \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}',
    description: 'Fast partial-derivative formula for F(x, y) = 0 and F(x, y, z) = 0 [cite: 10].',
  },

  // DU Exam Hub
  {
    id: 'f-hessian',
    phase: 'DU Exam Hub',
    category: '3D Surface Extrema & Exam Slots',
    title: 'Hessian Discriminant Second Partials Test',
    formulaLatex: 'D(x,y) = f_{xx}f_{yy} - (f_{xy})^2',
    description:
      'D > 0, f_xx > 0 ⇒ Local Min; D > 0, f_xx < 0 ⇒ Local Max; D < 0 ⇒ Saddle Point; D = 0 ⇒ Inconclusive.',
  },
  {
    id: 'f-lagrange',
    phase: 'DU Exam Hub',
    category: '3D Surface Extrema & Exam Slots',
    title: 'Lagrange Multipliers Condition',
    formulaLatex: '\\nabla f(x,y) = \\lambda \\nabla g(x,y), \\qquad g(x,y) = 0',
    description: 'Optimizes f(x, y) subject to constraint g(x, y) = 0.',
  },
  {
    id: 'f-leibniz',
    phase: 'DU Exam Hub',
    category: '3D Surface Extrema & Exam Slots',
    title: 'Leibniz Theorem & Recurrence at x = 0',
    formulaLatex:
      '(1+x^2)y_{n+2} + (2n+1)xy_{n+1} + (n^2 - m^2)y_n = 0 \\implies (y_{n+2})_0 = (m^2 - n^2)(y_n)_0',
    description: 'For y = (x + √(1+x²))^m in DU Exam Slot 2.',
  },
  {
    id: 'f-cauchy-mvt',
    phase: 'DU Exam Hub',
    category: '3D Surface Extrema & Exam Slots',
    title: "Cauchy's Mean Value Theorem",
    formulaLatex: "\\frac{f(b) - f(a)}{g(b) - g(a)} = \\frac{f'(c)}{g'(c)}",
    description:
      'With f(x)=sin x and g(x)=cos x, proves (sin b - sin a)/(cos b - cos a) = -cot c (Slot 3).',
  },
  {
    id: 'f-cubic-asymptotes',
    phase: 'DU Exam Hub',
    category: '3D Surface Extrema & Exam Slots',
    title: 'Oblique Asymptotes of Cubic Curves (y = mx + c)',
    formulaLatex:
      "c = -\\frac{\\phi_2(m)}{\\phi_3'(m)} \\text{ (distinct)}, \\qquad \\frac{c^2}{2!}\\phi_3''(m) + c\\phi_2'(m) + \\phi_1(m) = 0 \\text{ (repeated)}",
    description: 'Used when solving φ_3(m) = 0 for cubic asymptotes in DU Exam Slot 5.',
  },
];
