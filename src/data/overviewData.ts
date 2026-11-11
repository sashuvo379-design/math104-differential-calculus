export interface RoadmapPhaseCard {
  id: string;
  phaseBadge: string;
  weightInfo: string;
  title: string;
  description: string;
  coreTopics: string[];
  accentColor: 'blue' | 'emerald' | 'purple' | 'amber';
  linkedRoute: string;
}

export interface SlideExampleItem {
  id: 'ex3' | 'ex4' | 'ex5' | 'ex6' | 'ex7' | 'lagrange';
  buttonLabel: string;
  title: string;
  equationLatex: string;
  hint: string;
  steps: {
    heading: string;
    paragraphs: string[];
    mathBlocks: string[];
    subCards?: {
      title: string;
      math: string;
      result: string;
      variant: 'rose' | 'emerald' | 'amber' | 'slate';
    }[];
  }[];
  reviewNote?: string;
  // Programmatic verification metadata
  verification: {
    expr2D?: string;
    testPoint: { x: number; y: number };
    expectedFx: number;
    expectedFy: number;
    expectedFxx?: number;
    expectedFyy?: number;
    expectedFxy?: number;
    expectedD?: number;
  };
}

export interface DuExamSlotItem {
  slotNumber: number;
  title: string;
  badge: string;
  weightPercent: number;
  questionPrompt: string;
  steps: {
    title: string;
    content: string;
    mathLatex?: string;
  }[];
  reviewNote?: string;
}

export interface OverviewQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const OVERVIEW_ROADMAP_PHASES: RoadmapPhaseCard[] = [
  {
    id: 'phase-1',
    phaseBadge: 'PHASE 1',
    weightInfo: 'Weight: 30% • Exam Slots 1 & 5',
    title: 'Limits, Continuity & Multivariable Extrema',
    description:
      'Foundations of single and multivariable calculus, limit rigorousness, partial derivatives, and optimization on open/closed domains.',
    coreTopics: [
      'Formal $\\varepsilon-\\delta$ limit proofs for single & multivariable functions.',
      "Partial differentiation & Euler's Theorem for homogeneous functions.",
      '3D surfaces, horizontal tangent planes, & Hessian matrix $D(x,y)$.',
      'Dr. Md. Rakib Hossain Lecture 15: Slide Examples 3 through 7.',
      'Constrained optimization using Lagrange Multipliers ($\\nabla f = \\lambda \\nabla g$).',
    ],
    accentColor: 'blue',
    linkedRoute: '/lesson/phase-1',
  },
  {
    id: 'phase-2',
    phaseBadge: 'PHASE 2',
    weightInfo: 'Weight: 25% • Exam Slot 2',
    title: 'Successive Differentiation & Leibniz Theorem',
    description:
      'Higher-order derivatives, nth derivative expressions, Leibniz product rule, and value evaluation at the origin $(y_n)_0$.',
    coreTopics: [
      'Standard $n$-th derivatives of trigonometric, inverse trig, and algebraic forms.',
      'Leibniz Theorem for $D^n[u \\cdot v]$ expansion.',
      'Derivation of non-linear differential equations for $y = (x + \\sqrt{1+x^2})^m$.',
      'Parity decomposition for odd/even $(y_n)_0$ evaluation.',
    ],
    accentColor: 'emerald',
    linkedRoute: '/lesson/phase-2',
  },
  {
    id: 'phase-3',
    phaseBadge: 'PHASE 3',
    weightInfo: 'Weight: 25% • Exam Slot 3',
    title: 'Mean Value Theorems & Series Expansions',
    description:
      'Fundamental theoretical theorems of differential calculus, Taylor and Maclaurin expansions, and indeterminate forms.',
    coreTopics: [
      "Rolle's Theorem, Lagrange's MVT, and Cauchy's Generalized MVT.",
      'Trigonometric proofs derived from Cauchy MVT: $\\frac{\\sin b - \\sin a}{\\cos b - \\cos a} = -\\cot c$.',
      'Taylor & Maclaurin series with Lagrange and Cauchy forms of remainder.',
      "L'Hôpital's Rule for $\\frac{0}{0}, \\frac{\\infty}{\\infty}, 0 \\cdot \\infty, 1^\\infty$ indeterminate limits.",
    ],
    accentColor: 'purple',
    linkedRoute: '/lesson/phase-3',
  },
  {
    id: 'phase-4',
    phaseBadge: 'PHASE 4',
    weightInfo: 'Weight: 20% • Exam Slot 4',
    title: 'Geometrical Invariants, Curvature & Asymptotes',
    description:
      'Application of calculus to plane curves, tangent intercept invariants, radius of curvature, and asymptotes of 3rd degree algebraic curves.',
    coreTopics: [
      'Astroid tangent invariant proof ($x^{2/3} + y^{2/3} = a^{2/3} \\implies \\text{Segment } AB = a$).',
      'Curvature $\\kappa$ and radius of curvature $\\rho$ in Cartesian and polar coordinates.',
      "Oblique asymptotes of cubic curves ($y = mx + c$) with distinct vs. repeated slope roots ($\\phi_3'(m) = 0$).",
      'Singular points classification: Nodes, Cusps, and Conjugate Points.',
    ],
    accentColor: 'amber',
    linkedRoute: '/lesson/phase-4',
  },
];

export const LECTURE_15_SLIDE_PROBLEMS: SlideExampleItem[] = [
  {
    id: 'ex3',
    buttonLabel: 'Ex 3: Polynomial Extrema',
    title: 'Slide Example 3: Classifying Critical Points of Polynomial Surface',
    equationLatex: 'f(x,y) = x^4 + y^4 - 4xy + 1',
    hint: 'Compute the first partial derivatives f_x = 4x^3 - 4y and f_y = 4y^3 - 4x, set both to 0 to obtain y = x^3 and x^9 - x = 0, and then apply the Hessian Discriminant D(x,y) = 144x^2y^2 - 16.',
    steps: [
      {
        heading: 'Step 1: First Partial Derivatives & Simultaneous System',
        paragraphs: [
          'Differentiating $f(x,y)$ with respect to $x$ and $y$:',
          'Substituting $y = x^3$ into $x = y^3$:',
          'Using $y = x^3$, the critical points are $(0,0)$, $(1,1)$, and $(-1,-1)$.',
        ],
        mathBlocks: [
          'f_x = \\frac{\\partial}{\\partial x}(x^4 + y^4 - 4xy + 1) = 4x^3 - 4y = 0 \\implies y = x^3',
          'f_y = \\frac{\\partial}{\\partial y}(x^4 + y^4 - 4xy + 1) = 4y^3 - 4x = 0 \\implies x = y^3',
          'x = (x^3)^3 = x^9 \\implies x^9 - x = 0 \\implies x(x^8 - 1) = 0 \\implies x(x^4 - 1)(x^4 + 1) = 0',
          'x(x^2 - 1)(x^2 + 1)(x^4 + 1) = 0 \\implies x = 0, \\, 1, \\, -1',
        ],
      },
      {
        heading: 'Step 2: Second Partial Derivatives & Hessian Discriminant Formula',
        paragraphs: ['Compute second-order partial derivatives and assemble $D(x,y)$:'],
        mathBlocks: [
          'f_{xx} = 12x^2, \\quad f_{yy} = 12y^2, \\quad f_{xy} = -4',
          'D(x,y) = f_{xx}f_{yy} - (f_{xy})^2 = (12x^2)(12y^2) - (-4)^2 = 144x^2y^2 - 16',
        ],
      },
      {
        heading: 'Step 3: Point-by-Point Classification',
        paragraphs: ['Evaluate $D(x,y)$ and $f_{xx}$ at each critical point:'],
        mathBlocks: [],
        subCards: [
          {
            title: 'At Point (0,0):',
            math: 'D(0,0) = 144(0)^2(0)^2 - 16 = -16 < 0',
            result: 'Result: Saddle Point at $(0,0)$ with elevation $f(0,0) = 1$.',
            variant: 'rose',
          },
          {
            title: 'At Point (1,1):',
            math: 'D(1,1) = 144(1)^2(1)^2 - 16 = 128 > 0 \\quad \\text{and} \\quad f_{xx}(1,1) = 12(1)^2 = 12 > 0',
            result: 'Result: Local Minimum at $(1,1)$ with value $f(1,1) = 1 + 1 - 4 + 1 = -1$.',
            variant: 'emerald',
          },
          {
            title: 'At Point (-1,-1):',
            math: 'D(-1,-1) = 144(-1)^2(-1)^2 - 16 = 128 > 0 \\quad \\text{and} \\quad f_{xx}(-1,-1) = 12(-1)^2 = 12 > 0',
            result: 'Result: Local Minimum at $(-1,-1)$ with value $f(-1,-1) = -1$.',
            variant: 'emerald',
          },
        ],
      },
    ],
    verification: {
      expr2D: 'x^4 + y^4 - 4*x*y + 1',
      testPoint: { x: 1, y: 1 },
      expectedFx: 0,
      expectedFy: 0,
      expectedFxx: 12,
      expectedFyy: 12,
      expectedFxy: -4,
      expectedD: 128,
    },
  },
  {
    id: 'ex4',
    buttonLabel: 'Ex 4: Monkey Saddle',
    title: 'Slide Example 4: The Monkey Saddle Surface Analysis',
    equationLatex: 'f(x,y) = x^3 - 3xy^2 + 2',
    hint: 'Find where f_x = 3x^2 - 3y^2 = 0 and f_y = -6xy = 0. Notice that D(0,0) = 0 is inconclusive, so inspect cross-sections like y = 0 where f(x,0) = x^3 + 2.',
    steps: [
      {
        heading: 'Step 1: First Partial Derivatives & Critical Point Identification',
        paragraphs: ['If $x = 0 \\implies y^2 = 0 \\implies y = 0$. Critical point: $(0,0)$.'],
        mathBlocks: [
          'f_x = 3x^2 - 3y^2 = 3(x^2 - y^2) = 0 \\implies x^2 = y^2',
          'f_y = -6xy = 0 \\implies x = 0 \\quad \\text{or} \\quad y = 0',
        ],
      },
      {
        heading: 'Step 2: Second Partials & Inconclusive Hessian',
        paragraphs: [
          'Since $D = 0$, the Hessian Discriminant test fails (Inconclusive). Direct surface analysis is required.',
        ],
        mathBlocks: [
          'f_{xx} = 6x, \\quad f_{yy} = -6x, \\quad f_{xy} = -6y',
          '\\text{At } (0,0): \\quad f_{xx} = 0, \\quad f_{yy} = 0, \\quad f_{xy} = 0 \\implies D = (0)(0) - (0)^2 = 0',
        ],
      },
      {
        heading: 'Step 3: Direct Algebraic Surface Inspection',
        paragraphs: [
          'Along the line $y = 0$:',
          'Since $f(x,y)$ takes values both strictly greater than and strictly less than $f(0,0)=2$ in every open neighborhood of $(0,0)$, the point $(0,0)$ is a Monkey Saddle Point.',
        ],
        mathBlocks: [
          'f(x,0) = x^3 + 2',
          '\\text{For } x > 0 \\implies f(x,0) > 2, \\quad \\text{For } x < 0 \\implies f(x,0) < 2',
        ],
      },
    ],
    verification: {
      expr2D: 'x^3 - 3*x*y^2 + 2',
      testPoint: { x: 0, y: 0 },
      expectedFx: 0,
      expectedFy: 0,
      expectedFxx: 0,
      expectedFyy: 0,
      expectedFxy: 0,
      expectedD: 0,
    },
  },
  {
    id: 'ex5',
    buttonLabel: 'Ex 5: Distance to Plane',
    title: 'Slide Example 5: Shortest Distance from Point to Plane',
    equationLatex:
      '\\text{Find shortest distance from } (1,0,-2) \\text{ to plane } x + 2y + z = 4',
    hint: 'Minimize squared distance d^2 = (x-1)^2 + y^2 + (z+2)^2 by substituting z = 4 - x - 2y so that z + 2 = 6 - x - 2y.',
    steps: [
      {
        heading: 'Step 1: Formulate Square Distance Function',
        paragraphs: [
          'Instead of minimizing distance $d$, minimize $d^2$ to simplify derivatives:',
          'From plane constraint $x + 2y + z = 4 \\implies z + 2 = 6 - x - 2y$. Substituting:',
        ],
        mathBlocks: [
          'd^2 = f(x,y,z) = (x - 1)^2 + y^2 + (z + 2)^2',
          'g(x,y) = (x - 1)^2 + y^2 + (6 - x - 2y)^2',
        ],
      },
      {
        heading: 'Step 2: Partial Derivatives & System Solution',
        paragraphs: ['Differentiate $g(x,y)$ and subtract equations:'],
        mathBlocks: [
          'g_x = 2(x - 1) + 2(6 - x - 2y)(-1) = 4x + 4y - 14 = 0 \\implies 2x + 2y = 7',
          'g_y = 2y + 2(6 - x - 2y)(-2) = 4x + 10y - 24 = 0 \\implies 2x + 5y = 12',
          '3y = 5 \\implies y = \\frac{5}{3}, \\quad x = \\frac{11}{6}, \\quad z = -\\frac{7}{6}',
        ],
      },
      {
        heading: 'Step 3: Distance Value Calculation',
        paragraphs: ['Compute the minimum Euclidean distance $d$:'],
        mathBlocks: [
          '\\text{Minimum Distance } d = \\frac{|1(1) + 2(0) + 1(-2) - 4|}{\\sqrt{1^2 + 2^2 + 1^2}} = \\frac{5}{\\sqrt{6}}',
        ],
      },
    ],
    verification: {
      expr2D: '(x - 1)^2 + y^2 + (6 - x - 2*y)^2',
      testPoint: { x: 11 / 6, y: 5 / 3 },
      expectedFx: 0,
      expectedFy: 0,
      expectedFxx: 4,
      expectedFyy: 10,
      expectedFxy: 4,
      expectedD: 24,
    },
  },
  {
    id: 'ex6',
    buttonLabel: 'Ex 6: Box Optimization',
    title: 'Slide Example 6: Open Rectangular Box Volume Optimization',
    equationLatex: 'V(x,y,z) = xyz \\quad \\text{subject to cardboard area } xy + 2xz + 2yz = 12',
    hint: 'Solve the surface area constraint for z = (12 - xy) / (2(x + y)), substitute into V = xyz, and set ∂V/∂x = 0 and ∂V/∂y = 0.',
    steps: [
      {
        heading: 'Step 1: Eliminate Variable z',
        paragraphs: ['Express $z$ in terms of $x$ and $y$ from the surface area constraint:'],
        mathBlocks: [
          '2z(x + y) = 12 - xy \\implies z = \\frac{12 - xy}{2(x + y)}',
          'V(x,y) = \\frac{12xy - x^2y^2}{2(x + y)}',
        ],
      },
      {
        heading: 'Step 2: Differentiate & Solve',
        paragraphs: ['Since $x,y > 0 \\implies x = y = 2\\text{ m}$ and $z = 1\\text{ m}$.'],
        mathBlocks: [
          '\\frac{\\partial V}{\\partial x} = 0 \\implies x^2 + 2xy = 12',
          '\\frac{\\partial V}{\\partial y} = 0 \\implies y^2 + 2xy = 12',
        ],
      },
      {
        heading: 'Step 3: Maximum Volume',
        paragraphs: ['Substitute $(x,y,z) = (2,2,1)$ into $V(x,y,z)$:'],
        mathBlocks: [
          'V_{\\max} = (2\\text{ m}) \\times (2\\text{ m}) \\times (1\\text{ m}) = 4\\text{ m}^3',
        ],
      },
    ],
    verification: {
      expr2D: '(12*x*y - x^2*y^2) / (2*(x + y))',
      testPoint: { x: 2, y: 2 },
      expectedFx: 0,
      expectedFy: 0,
    },
  },
  {
    id: 'ex7',
    buttonLabel: 'Ex 7: Bounded Rectangle',
    title: 'Slide Example 7: Absolute Extrema on Closed Rectangular Domain',
    equationLatex:
      'f(x,y) = 2 + 2x + 2y - x^2 - y^2 \\quad \\text{on } D = \\{(x,y) : 0 \\le x \\le 3, \\, 0 \\le y \\le 2\\}',
    hint: 'Find the interior critical point where f_x = 0 and f_y = 0, then check all 4 boundary segments L_1 (y=0), L_2 (x=3), L_3 (y=2), and L_4 (x=0).',
    steps: [
      {
        heading: 'Step 1: Interior Point',
        paragraphs: ['Set first partial derivatives to zero inside $D$:'],
        mathBlocks: [
          'f_x = 2 - 2x = 0 \\implies x = 1, \\quad f_y = 2 - 2y = 0 \\implies y = 1',
          'f(1,1) = 2 + 2 + 2 - 1 - 1 = 4',
        ],
      },
      {
        heading: 'Step 2: Boundary Paths (L1, L2, L3, L4)',
        paragraphs: ['Evaluate 1D extrema and endpoints along each boundary segment:'],
        mathBlocks: [
          'L_1 (y=0): f(x,0) = 2+2x-x^2 \\implies f(1,0)=3, \\, f(3,0)=-1',
          'L_2 (x=3): f(3,y) = -1+2y-y^2 \\implies f(3,1)=0, \\, f(3,2)=-1',
          'L_3 (y=2): f(x,2) = 2+2x-x^2 \\implies f(1,2)=3, \\, f(3,2)=-1',
          'L_4 (x=0): f(0,y) = 2+2y-y^2 \\implies f(0,1)=3, \\, f(0,0)=2',
        ],
      },
      {
        heading: 'Step 3: Global Max & Min',
        paragraphs: ['Compare all candidate values across interior and boundary points:'],
        mathBlocks: [
          '\\text{Absolute Maximum} = 4 \\quad \\text{at } (1,1)',
          '\\text{Absolute Minimum} = -1 \\quad \\text{at } (3,0) \\text{ and } (3,2)',
        ],
      },
    ],
    reviewNote:
      'Review Note: Corner (0,2) also evaluates to f(0,2) = 2 on L3/L4, which lies strictly between the global minimum (-1) and global maximum (4).',
    verification: {
      expr2D: '2 + 2*x + 2*y - x^2 - y^2',
      testPoint: { x: 1, y: 1 },
      expectedFx: 0,
      expectedFy: 0,
      expectedFxx: -2,
      expectedFyy: -2,
      expectedFxy: 0,
      expectedD: 4,
    },
  },
  {
    id: 'lagrange',
    buttonLabel: 'Lagrange Ex 1: Constraint',
    title: 'Lagrange Multipliers Example 1: Hyperbolic Constraint Optimization',
    equationLatex:
      '\\text{Minimize } f(x,y) = x^2 + y^2 \\quad \\text{subject to } g(x,y) = xy - 1 = 0',
    hint: 'Set ∇f = λ∇g to get (2x, 2y) = λ(y, x), multiply by x and y to show 2x^2 = 2y^2 = λ, and substitute into xy = 1.',
    steps: [
      {
        heading: 'Step 1: Gradient Vector System',
        paragraphs: [
          'Set $\\nabla f = \\lambda \\nabla g$ together with the constraint $g(x,y) = 0$:',
        ],
        mathBlocks: [
          '\\nabla f = \\lambda \\nabla g \\implies (2x, 2y) = \\lambda (y, x)',
          '2x = \\lambda y \\quad (1), \\quad 2y = \\lambda x \\quad (2), \\quad xy = 1 \\quad (3)',
        ],
      },
      {
        heading: 'Step 2: Coordinate Solutions',
        paragraphs: ['Multiply (1) by $x$ and (2) by $y$:'],
        mathBlocks: [
          '2x^2 = \\lambda xy = \\lambda, \\quad 2y^2 = \\lambda xy = \\lambda \\implies x^2 = y^2',
          '\\text{Since } xy = 1 \\implies x = y = \\pm 1 \\implies \\text{Points } (1,1) \\text{ and } (-1,-1)',
        ],
      },
      {
        heading: 'Step 3: Minimum Value',
        paragraphs: ['Evaluate the objective function at the constrained critical points:'],
        mathBlocks: [
          'f(1,1) = 1^2 + 1^2 = 2, \\quad f(-1,-1) = 2 \\implies \\text{Minimum Distance } d = \\sqrt{2}',
        ],
      },
    ],
    verification: {
      expr2D: 'x^2 + y^2 - 2*(x*y - 1)',
      testPoint: { x: 1, y: 1 },
      expectedFx: 0,
      expectedFy: 0,
    },
  },
];

export const DU_PAST_EXAM_SLOTS: DuExamSlotItem[] = [
  {
    slotNumber: 1,
    title: 'Limit Proofs via $\\varepsilon-\\delta$ Definition',
    badge: 'High Frequency',
    weightPercent: 20,
    questionPrompt:
      'Standard DU Question: "Prove by $\\varepsilon-\\delta$ definition that $\\lim_{x \\to 2} (x^2 + 3x) = 10$."',
    steps: [
      {
        title: 'Step 1: Target Inequality Formulation:',
        content:
          'For any $\\varepsilon > 0$, we must find $\\delta > 0$ such that if $0 < |x - 2| < \\delta$, then $|(x^2 + 3x) - 10| < \\varepsilon$.',
      },
      {
        title: 'Step 2: Factor & Bound Auxiliary Term:',
        content:
          'Assume initial bound $\\delta_0 = 1$. Then $0 < |x - 2| < 1 \\implies 1 < x < 3$. Adding $5$: $6 < x + 5 < 8 \\implies |x + 5| < 8$.',
        mathLatex: '|(x^2 + 3x) - 10| = |(x - 2)(x + 5)| = |x - 2| \\cdot |x + 5|',
      },
      {
        title: 'Step 3: Define Final Delta & Formal Conclusion:',
        content:
          'Set $8 |x - 2| = \\varepsilon \\implies |x - 2| = \\frac{\\varepsilon}{8}$. Therefore, choose $\\delta = \\min\\left(1, \\frac{\\varepsilon}{8}\\right)$. Q.E.D.',
        mathLatex: '|(x - 2)(x + 5)| < 8 |x - 2|',
      },
    ],
  },
  {
    slotNumber: 2,
    title: 'Leibniz Recurrence & $(y_n)_0$ Parity Evaluation',
    badge: 'Must Solve',
    weightPercent: 25,
    questionPrompt:
      'Standard DU Question: If $y = \\left(x + \\sqrt{1+x^2}\\right)^m$, find $(y_n)_0$.',
    steps: [
      {
        title: '1. Derive Differential Equation:',
        content:
          'Squaring both sides: $(1+x^2)y_1^2 = m^2 y^2$. Differentiating again yields $(1+x^2)y_2 + x y_1 - m^2 y = 0$.',
        mathLatex:
          'y_1 = m\\left(x + \\sqrt{1+x^2}\\right)^{m-1} \\cdot \\left(1 + \\frac{x}{\\sqrt{1+x^2}}\\right) = \\frac{m y}{\\sqrt{1+x^2}}',
      },
      {
        title: "2. Apply Leibniz's Theorem n times:",
        content: 'Differentiate the second-order ODE $n$ times using Leibniz product rule:',
        mathLatex:
          'D^n[(1+x^2)y_2] + D^n[x y_1] - m^2 D^n[y] = 0 \\implies (1+x^2)y_{n+2} + (2n+1)x y_{n+1} + (n^2 - m^2)y_n = 0',
      },
      {
        title: '3. Evaluate at x = 0 & Parity Cases:',
        content:
          'Setting $x = 0 \\implies (y_{n+2})_0 = (m^2 - n^2)(y_n)_0$. Base values: $y(0) = 1$, $y_1(0) = m$. If $n$ is even: $(y_n)_0 = m^2(m^2 - 2^2)(m^2 - 4^2)\\dots(m^2 - (n-2)^2)$. If $n$ is odd: $(y_n)_0 = m(m^2 - 1^2)(m^2 - 3^2)\\dots(m^2 - (n-2)^2)$.',
      },
    ],
  },
  {
    slotNumber: 3,
    title: 'Mean Value Theorems & Trigonometric Proofs',
    badge: 'Theoretical Proof',
    weightPercent: 20,
    questionPrompt:
      "Cauchy's Mean Value Theorem: If $f, g$ are continuous on $[a,b]$ and differentiable on $(a,b)$ with $g'(x) \\neq 0$, then there exists $c \\in (a,b)$ such that:",
    steps: [
      {
        title: "Cauchy's Generalized Mean Value Theorem Formula:",
        content:
          'DU Classic Question Variant: Setting $f(x) = \\sin x$ and $g(x) = \\cos x$ on $[a,b]$ proves that $\\frac{\\sin b - \\sin a}{\\cos b - \\cos a} = -\\cot c$.',
        mathLatex: "\\frac{f(b) - f(a)}{g(b) - g(a)} = \\frac{f'(c)}{g'(c)}",
      },
    ],
  },
  {
    slotNumber: 4,
    title: 'Astroid Tangent Invariant',
    badge: 'Curve Geometry',
    weightPercent: 15,
    questionPrompt: 'For astroid $x^{2/3} + y^{2/3} = a^{2/3}$, tangent line equation is:',
    steps: [
      {
        title: 'Original Slide / Portal Derivation:',
        content:
          'X-intercept $A = (a\\cos^3\\theta, 0)$, Y-intercept $B = (0, a\\sin^3\\theta)$. Length $AB = \\sqrt{a^2\\cos^6\\theta + a^2\\sin^6\\theta + \\dots} = a$ (Constant length)!',
        mathLatex: 'x \\cos\\theta + y \\sin\\theta = a \\sin\\theta \\cos\\theta',
      },
    ],
    reviewNote:
      'Mathematical Review Note (see REVIEW_NOTES.md): With x = a cos³θ and y = a sin³θ, the tangent line is x/cosθ + y/sinθ = a (i.e. x sinθ + y cosθ = a sinθ cosθ), so the actual intercepts are A = (a cosθ, 0) and B = (0, a sinθ), immediately giving AB = √(a²cos²θ + a²sin²θ) = a.',
  },
  {
    slotNumber: 5,
    title: 'Asymptotes of 3rd Degree Cubics',
    badge: 'Algebraic Curves',
    weightPercent: 20,
    questionPrompt: 'To find oblique asymptotes $y = mx + c$ for cubic $f(x,y) = 0$:',
    steps: [
      {
        title: 'Distinct vs. Repeated Slope Roots:',
        content:
          "1. Solve $\\phi_3(m) = 0$ for slopes. 2. If roots are distinct: $c = -\\frac{\\phi_2(m)}{\\phi_3'(m)}$. 3. If roots are repeated ($m_1 = m_2$): Use quadratic:",
        mathLatex: "\\frac{c^2}{2!}\\phi_3''(m) + c\\,\\phi_2'(m) + \\phi_1(m) = 0",
      },
    ],
  },
];

export const POINT_LOSS_TRAPS = [
  {
    number: 1,
    title: 'Forgetting Boundary Filtering on Bounded Domains',
    description:
      'In closed domain extrema problems (e.g. Slide Ex 7), candidates find interior critical points like $(1,1)$ and forget to verify if they lie inside $0 \\le x \\le 3, 0 \\le y \\le 2$. Points outside the domain MUST be explicitly discarded!',
  },
  {
    number: 2,
    title: 'Omitting Continuity & Differentiability Hypotheses',
    description:
      "In Rolle's or Lagrange's MVT proofs, writing $f'(c) = 0$ without explicitly writing \"f(x) is continuous on [a,b] and differentiable on (a,b)\" costs 1.5 out of 5 marks immediately.",
  },
  {
    number: 3,
    title: 'Division by Zero in Repeated Asymptote Formulas',
    description:
      "When $\\phi_3'(m) = 0$, applying $c = -\\frac{\\phi_2}{\\phi_3'}$ causes division by zero! You MUST switch to the quadratic equation in $c$.",
  },
  {
    number: 4,
    title: 'Wrong Base Initial Value in Leibniz Recurrence',
    description:
      'In $(y_n)_0$ problems, candidates mix up $y(0)$ and $y_1(0)$. Even orders $(y_{2k})_0$ start from $y(0)$; Odd orders $(y_{2k+1})_0$ start from $y_1(0)$.',
  },
];

export const OVERVIEW_SELF_QUIZ: OverviewQuizQuestion[] = [
  {
    id: 'ov-q1',
    question:
      'In the 2D Taylor expansion proof of the Hessian, what expression defines the discriminant D?',
    options: [
      'f_xx + f_yy',
      'f_xx * f_yy - (f_xy)^2',
      '(f_xy)^2 - f_xx * f_yy',
      'f_xx * f_xy - f_yy',
    ],
    correctIndex: 1,
    explanation: 'The Hessian discriminant is D = f_xx * f_yy - (f_xy)^2.',
  },
  {
    id: 'ov-q2',
    question:
      'For the Monkey Saddle surface f(x,y) = x^3 - 3xy^2 + 2 at (0,0), what is the Hessian result?',
    options: [
      'D > 0 (Local Minimum)',
      'D < 0 (Saddle Point)',
      'D = 0 (Inconclusive)',
      'D > 0 (Local Maximum)',
    ],
    correctIndex: 2,
    explanation:
      'At (0,0), all second partials vanish, giving D = 0. Direct inspection reveals a Monkey Saddle.',
  },
  {
    id: 'ov-q3',
    question:
      'When finding asymptotes for cubic curves with repeated slope roots (m1 = m2), which equation must be solved for c?',
    options: [
      "c = -phi_2(m) / phi_3'(m)",
      "(c^2 / 2!) * phi_3''(m) + c * phi_2'(m) + phi_1(m) = 0",
      'c = phi_3(m) / phi_1(m)',
      'c^2 * phi_2(m) + c = 0',
    ],
    correctIndex: 1,
    explanation:
      "When phi_3'(m) = 0, applying c = -phi_2/phi_3' leads to division by zero. You must use the quadratic in c.",
  },
  {
    id: 'ov-q4',
    question:
      'What is the length of the tangent segment intercepted between coordinate axes for the astroid x^(2/3) + y^(2/3) = a^(2/3)?',
    options: ['a / 2', 'a * sin(theta)', 'a (Constant length)', 'a^2'],
    correctIndex: 2,
    explanation: "The astroid tangent length between intercepts is constant and equals 'a'.",
  },
  {
    id: 'ov-q5',
    question:
      "In Lagrange's Multiplier method, what vector condition must be satisfied at constrained extrema?",
    options: [
      'grad f = lambda * grad g',
      'grad f + grad g = 0',
      'grad f . grad g = 0',
      'grad f = grad g',
    ],
    correctIndex: 0,
    explanation:
      'Gradient vectors must be parallel at constrained extrema: grad f = lambda * grad g.',
  },
];
