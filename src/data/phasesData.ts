export interface WorkedExampleStep {
  title: string;
  explanation: string;
  mathLatex?: string;
  highlightMathLatex?: string;
}

export interface WorkedExample {
  id: string;
  examSource: string;
  problemBadge: string;
  questionLines: string[];
  questionMathLatex?: string;
  introNote?: string;
  hint: string;
  steps: WorkedExampleStep[];
  reviewNote?: string;
  // Programmatic numerical verification spec
  verification?: {
    type: 'derivative_1d' | 'limit_1d' | 'difference_quotient' | 'partial_2d';
    expr: string;
    expectedDerivativeExpr?: string;
    testPoints?: number[];
  };
}

export interface ReferenceRow {
  concept: string;
  formulaOrTechnique: string;
  citation: string;
}

export interface LessonUnit {
  id: string;
  moduleNumber: string;
  moduleTag: string;
  title: string;
  realLifeHook?: {
    title: string;
    content: string;
  };
  engineSection?: {
    title: string;
    introParagraphs?: string[];
    introMathLatex?: string;
    outroParagraphs?: string[];
    cards?: {
      title: string;
      content: string;
      mathLatex?: string;
      colSpan2?: boolean;
      variant?: 'slate' | 'blue';
    }[];
  };
  examinerTrap?: {
    title: string;
    paragraphs: string[];
  };
  workedExamples: WorkedExample[];
  referenceTable?: {
    headers: [string, string, string];
    rows: ReferenceRow[];
  };
  interactiveToolLink?: {
    toolId: string;
    label: string;
    description: string;
  };
}

export interface SelfAssessmentItem {
  id: string;
  badge: string;
  topicTag: string;
  question: string;
  hint: string;
  steps: WorkedExampleStep[];
  reviewNote?: string;
  verification?: {
    expr: string;
    expectedDerivativeExpr?: string;
  };
}

export interface PhaseLessonData {
  id: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
  phaseNumber: number;
  shortTitle: string;
  headerBadge: string;
  bannerSubtitle: string;
  bannerTitle: string;
  bannerDescription: string;
  themeColor: 'indigo' | 'rose';
  units: LessonUnit[];
  selfAssessmentSubtitle: string;
  selfAssessment: SelfAssessmentItem[];
}

export const PHASE_LESSONS: PhaseLessonData[] = [
  // =========================================================================
  // PHASE 01.html
  // =========================================================================
  {
    id: 'phase-1',
    phaseNumber: 1,
    shortTitle: 'Phase 1: Limits & Continuity',
    headerBadge: 'Phase 1: Limits & Continuity',
    bannerSubtitle: 'Academic Rigor & Departmental Standards',
    bannerTitle: 'Phase 1: Functions, Limits, & Continuity',
    bannerDescription:
      'Welcome to MATH 104, based on the lectures of Dr. Md. Rakib Hossain [cite: 9]. This phase establishes the rigorous foundation of real-valued functions, limit evaluation techniques, and the critical distinctions between continuity and differentiability required for the First-Year B.S. Honours examinations at the Institute of Statistical Research and Training (ISRT).',
    themeColor: 'indigo',
    units: [
      {
        id: 'unit-1-1',
        moduleNumber: 'Module 01',
        moduleTag: 'Foundations',
        title: 'Unit 1.1: Functions, Domains, and Symmetry',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: Unique Outputs',
          content:
            'A function from set $X$ into set $Y$ is a relation that associates each element of $X$ with exactly one element of $Y$ [cite: 9]. Think of a function as a well-calibrated machine: if you input the number of calories in a specific fast-food sandwich, it outputs a single, definitive fat content [cite: 9]. If one input could magically produce two different outputs simultaneously, the system would break—this is why the equation $x^2 + y^2 = 1$ (a circle) fails the vertical line test and is not a function [cite: 9].',
        },
        engineSection: {
          title: 'The Mathematical Engine',
          cards: [
            {
              title: 'Domain & Range',
              content:
                'The domain is the set of all valid inputs ($x$). Restrictions occur when dividing by zero or taking even roots of negative numbers. For $h(t) = \\sqrt{4-3t}$, we require $4-3t \\ge 0$, so $t \\le 4/3$ [cite: 9].',
            },
            {
              title: 'Even Functions',
              content:
                'A function $f$ is even if for every $x$ in its domain, $f(-x) = f(x)$ [cite: 9]. The graph is perfectly symmetric with respect to the y-axis [cite: 9].',
            },
            {
              title: 'Odd Functions',
              content:
                'A function $f$ is odd if for every $x$ in its domain, $f(-x) = -f(x)$ [cite: 9]. The graph is symmetric with respect to the origin [cite: 9].',
            },
          ],
        },
        examinerTrap: {
          title: 'Examiner Trap & Memory Trick: The "Neither" Trap',
          paragraphs: [
            'When asked to determine if a function is even or odd, do not assume it must be one of the two! For example, $g(x) = x^3 - 1$ yields $g(-x) = (-x)^3 - 1 = -x^3 - 1$. This is neither $g(x)$ nor $-g(x)$ [cite: 9]. Always explicitly evaluate $f(-x)$ step-by-step to claim it is "neither even nor odd" [cite: 9].',
          ],
        },
        workedExamples: [
          {
            id: 'p1-ex-1-1',
            examSource: 'ISRT First Incourse Examination 2024',
            problemBadge: 'Problem 2 & 3',
            questionLines: [
              '1. Find the domain and range of: (a) $f(x) = 2 + \\sqrt{x-1}$, (b) $f(x) = (x+1)/(x-1)$ [cite: 10].',
              '2. Suppose that the function $f$ has domain all real numbers. Determine whether each function can be classified as even or odd. Explain. (a) $g(x) = \\frac{f(x)+f(-x)}{2}$, (b) $h(x) = \\frac{f(x)-f(-x)}{2}$ [cite: 10].',
            ],
            hint: 'For Part 1, check square root non-negativity (x - 1 ≥ 0) and non-zero denominators (x - 1 ≠ 0). For Part 2, substitute -x into g(x) and h(x) and use -(-x) = x.',
            steps: [
              {
                title: 'Part 1(a): Domain and Range of $f(x) = 2 + \\sqrt{x-1}$',
                explanation:
                  'Domain: The expression under the square root must be non-negative. $x - 1 \\ge 0 \\implies x \\ge 1$. Domain = $[1, \\infty)$. Range: Since $\\sqrt{x-1} \\ge 0$ for all valid $x$, $f(x) \\ge 2 + 0 = 2$. Range = $[2, \\infty)$.',
              },
              {
                title: 'Part 1(b): Domain and Range of $f(x) = \\frac{x+1}{x-1}$',
                explanation:
                  'Domain: The denominator cannot be zero. $x - 1 \\neq 0 \\implies x \\neq 1$. Domain = $(-\\infty, 1) \\cup (1, \\infty)$. Range: Let $y = \\frac{x+1}{x-1}$. Solving for $x$: $yx - y = x+1 \\implies x(y-1) = y+1 \\implies x = \\frac{y+1}{y-1}$. For $x$ to exist, $y - 1 \\neq 0 \\implies y \\neq 1$. Range = $(-\\infty, 1) \\cup (1, \\infty)$.',
              },
              {
                title: 'Part 2(a): Even / Odd Classification for $g(x) = \\frac{f(x)+f(-x)}{2}$',
                explanation:
                  'Substitute $-x$ into $g(x)$ to check symmetry properties. Since $g(-x) = g(x)$, the function $g(x)$ is strictly Even.',
                mathLatex: 'g(-x) = \\frac{f(-x)+f(-(-x))}{2} = \\frac{f(-x)+f(x)}{2} = g(x)',
              },
              {
                title: 'Part 2(b): Even / Odd Classification for $h(x) = \\frac{f(x)-f(-x)}{2}$',
                explanation:
                  'Substitute $-x$ into $h(x)$. Since $h(-x) = -h(x)$, the function $h(x)$ is strictly Odd.',
                mathLatex:
                  'h(-x) = \\frac{f(-x)-f(-(-x))}{2} = \\frac{f(-x)-f(x)}{2} = -\\left(\\frac{f(x)-f(-x)}{2}\\right) = -h(x)',
              },
            ],
          },
        ],
        interactiveToolLink: {
          toolId: 'derivative-explorer',
          label: 'Explore Domains & Graphs in Derivative Explorer',
          description:
            'Plot 2 + sqrt(x-1) and (x+1)/(x-1) with automatic domain boundary and vertical asymptote detection.',
        },
      },
      {
        id: 'unit-1-2',
        moduleNumber: 'Module 02',
        moduleTag: 'Evaluation',
        title: 'Unit 1.2: Limit Theorems & Indeterminate Forms',
        engineSection: {
          title: 'The Mathematical Engine: Algebraic Manipulations',
          introParagraphs: [
            "When direct substitution yields $0/0$ or $\\infty/\\infty$, algebraic manipulation (factoring, rationalizing) or L'Hôpital's rule is required. For limits approaching infinity for rational functions, divide the numerator and denominator by the highest power of $x$ present in the denominator.",
          ],
        },
        workedExamples: [
          {
            id: 'p1-ex-1-2',
            examSource: 'ISRT First Incourse Examination 2024',
            problemBadge: 'Problem 5',
            questionLines: [
              'Find the following limits [cite: 10]:',
              '(a) $\\lim_{x \\to 1} \\frac{x-1}{\\sqrt{x}-1}$',
              '(b) $\\lim_{x \\to \\infty} \\frac{\\sqrt{x^2+2}}{3x-6}$',
              '(c) $\\lim_{x \\to 0} \\frac{\\sin^2(kx)}{x^2}, k \\neq 0$',
            ],
            hint: 'For (a), rationalize by multiplying by (√x + 1). For (b), divide numerator and denominator by x = √(x²). For (c), use lim_{θ→0} (sin θ)/θ = 1.',
            steps: [
              {
                title: '(a) $\\lim_{x \\to 1} \\frac{x-1}{\\sqrt{x}-1}$',
                explanation:
                  'Direct substitution yields $\\frac{0}{0}$. Multiply the numerator and denominator by the conjugate of the denominator, $(\\sqrt{x}+1)$, and cancel $(x-1)$ since $x \\to 1$ but $x \\neq 1$:',
                mathLatex:
                  '= \\lim_{x \\to 1} \\frac{(x-1)(\\sqrt{x}+1)}{(\\sqrt{x}-1)(\\sqrt{x}+1)} = \\lim_{x \\to 1} \\frac{(x-1)(\\sqrt{x}+1)}{x-1}',
                highlightMathLatex: '= \\lim_{x \\to 1} (\\sqrt{x}+1) = \\sqrt{1} + 1 = 2',
              },
              {
                title: '(b) $\\lim_{x \\to \\infty} \\frac{\\sqrt{x^2+2}}{3x-6}$',
                explanation:
                  'Divide the numerator and denominator by $x$ (which is equal to $\\sqrt{x^2}$ for $x>0$). As $x \\to \\infty$, terms with $x$ in the denominator approach 0:',
                mathLatex:
                  '= \\lim_{x \\to \\infty} \\frac{\\frac{\\sqrt{x^2+2}}{x}}{\\frac{3x-6}{x}} = \\lim_{x \\to \\infty} \\frac{\\sqrt{\\frac{x^2+2}{x^2}}}{3 - \\frac{6}{x}} = \\lim_{x \\to \\infty} \\frac{\\sqrt{1 + \\frac{2}{x^2}}}{3 - \\frac{6}{x}}',
                highlightMathLatex: '= \\frac{\\sqrt{1 + 0}}{3 - 0} = \\frac{1}{3}',
              },
              {
                title: '(c) $\\lim_{x \\to 0} \\frac{\\sin^2(kx)}{x^2}$',
                explanation:
                  'Rewrite the expression using exponent properties, then multiply numerator and denominator inside the parenthesis by $k$ to utilize the standard limit $\\lim_{\\theta \\to 0} \\frac{\\sin\\theta}{\\theta} = 1$:',
                mathLatex: '= \\lim_{x \\to 0} \\left(\\frac{\\sin(kx)}{x}\\right)^2',
                highlightMathLatex:
                  '= \\lim_{x \\to 0} \\left(k \\cdot \\frac{\\sin(kx)}{kx}\\right)^2 = (k \\cdot 1)^2 = k^2',
              },
            ],
          },
        ],
        interactiveToolLink: {
          toolId: 'limit-visualizer',
          label: 'Open Interactive Limit Visualizer',
          description:
            'Approach x → 1 on (x-1)/(sqrt(x)-1) from both sides with a live numerical table.',
        },
      },
      {
        id: 'unit-1-3',
        moduleNumber: 'Module 03',
        moduleTag: 'Smoothness',
        title: 'Unit 1.3: Continuity and Differentiability',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: Corners vs Curves',
          content:
            'Continuity means a path is unbroken—you can trace it without lifting your pencil. Differentiability is stricter: it requires the path to be smooth. The absolute value function $y = |x|$ is perfectly continuous at $x=0$, but it has a sharp "corner" there [cite: 5]. At that exact moment, the trajectory abruptly changes direction, meaning it has no single, defined tangent line (instantaneous velocity). Thus, it is continuous, but not differentiable.',
        },
        engineSection: {
          title: 'The Mathematical Engine: Differentiability Proofs',
          introParagraphs: [
            'To prove a function $f(x)$ is not differentiable at $x=c$, we evaluate the left-hand derivative (LHD) and right-hand derivative (RHD) using the limit definition, and show they are not equal.',
          ],
        },
        workedExamples: [
          {
            id: 'p1-ex-1-3-1',
            examSource: 'ISRT Second Incourse Examination 2024',
            problemBadge: 'Problem 3',
            questionLines: [
              'The graph of $y = |x|$ has a corner at $x = 0$, which implies that $f(x) = |x|$ is not differentiable at $x = 0$. Prove that $f(x) = |x|$ is not differentiable at $x = 0$ by showing that the limit does not exist at $x = 0$ [cite: 5].',
            ],
            hint: 'Write out the difference quotient at x = 0: lim_{h→0} |h|/h, then evaluate the right-hand limit (h > 0, |h| = h) and left-hand limit (h < 0, |h| = -h).',
            steps: [
              {
                title: 'Step 1: Set Up Limit Definition of Derivative at $x = 0$',
                explanation:
                  'By definition, the derivative of $f(x)$ at $x=0$ is given by the limit. We must evaluate the one-sided limits to determine if the general limit exists.',
                mathLatex:
                  "f'(0) = \\lim_{h \\to 0} \\frac{f(0+h) - f(0)}{h} = \\lim_{h \\to 0} \\frac{|h| - 0}{h} = \\lim_{h \\to 0} \\frac{|h|}{h}",
              },
              {
                title: 'Step 2: Right-Hand Derivative (RHD) & Left-Hand Derivative (LHD)',
                explanation:
                  'For RHD, let $h \\to 0^+$. Since $h > 0$, $|h| = h$. For LHD, let $h \\to 0^-$. Since $h < 0$, $|h| = -h$.',
                mathLatex:
                  '\\text{RHD: } \\lim_{h \\to 0^+} \\frac{|h|}{h} = \\lim_{h \\to 0^+} \\frac{h}{h} = 1, \\qquad \\text{LHD: } \\lim_{h \\to 0^-} \\frac{|h|}{h} = \\lim_{h \\to 0^-} \\frac{-h}{h} = -1',
              },
              {
                title: 'Step 3: Conclusion',
                explanation:
                  'Since the Left-Hand Derivative ($-1$) $\\neq$ Right-Hand Derivative ($1$), the limit $\\lim_{h \\to 0} \\frac{|h|}{h}$ does not exist. Therefore, $f(x) = |x|$ is not differentiable at $x=0$.',
              },
            ],
          },
          {
            id: 'p1-ex-1-3-2',
            examSource: 'ISRT First Incourse Examination 2024',
            problemBadge: 'Problem 7',
            questionLines: [
              'Find values of the constants $k$ and $m$, if possible, that will make the function $f$ continuous everywhere [cite: 10].',
            ],
            questionMathLatex:
              'f(x) = \\begin{cases} x^2 + 5, & x > 2 \\\\ m(x+1) + k, & -1 < x \\le 2 \\\\ 2x^3 + x + 7, & x \\le -1 \\end{cases}',
            hint: 'Equate the left-hand limit (LHL) and right-hand limit (RHL) at both transition points x = 2 and x = -1 to form two linear equations in m and k.',
            steps: [
              {
                title: 'Step 1: Continuity at $x = 2$',
                explanation:
                  'For $f(x)$ to be continuous everywhere, it must be continuous at the piece transition points $x = 2$ and $x = -1$. Equating LHL and RHL at $x = 2$ gives our first equation:',
                mathLatex:
                  '\\text{RHL: } \\lim_{x \\to 2^+} (x^2 + 5) = 2^2 + 5 = 9, \\quad \\text{LHL: } \\lim_{x \\to 2^-} (m(x+1) + k) = 3m + k',
                highlightMathLatex: '3m + k = 9 \\quad \\text{--- (Equation 1)}',
              },
              {
                title: 'Step 2: Continuity at $x = -1$',
                explanation: 'Equating RHL and LHL at $x = -1$ gives our second equation:',
                mathLatex:
                  '\\text{RHL: } \\lim_{x \\to -1^+} (m(x+1) + k) = k, \\quad \\text{LHL: } \\lim_{x \\to -1^-} (2x^3 + x + 7) = -2 - 1 + 7 = 4',
                highlightMathLatex: 'k = 4 \\quad \\text{--- (Equation 2)}',
              },
              {
                title: 'Step 3: Solving the System',
                explanation:
                  'Substitute $k = 4$ into Equation 1. Final Answer: $k = 4, m = \\frac{5}{3}$.',
                highlightMathLatex: '3m + 4 = 9 \\implies 3m = 5 \\implies m = \\frac{5}{3}',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-1-4',
        moduleNumber: 'Module 04',
        moduleTag: 'Core Tools',
        title: 'Unit 1.4: The Difference Quotient',
        engineSection: {
          title: 'The Mathematical Engine',
          introParagraphs: [
            'The difference quotient of a function $f$ at $x$ is defined as [cite: 9]:',
          ],
          introMathLatex: '\\frac{f(x+h) - f(x)}{h}, \\quad h \\neq 0',
          outroParagraphs: [
            'This quotient is the fundamental algebraic block used in calculus to define the derivative, mapping seamlessly to the slope of a secant line [cite: 9]. Simplifying it requires rigorous algebraic manipulation to safely cancel the $h$ parameter in the denominator.',
          ],
        },
        workedExamples: [
          {
            id: 'p1-ex-1-4',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Example 8c',
            questionLines: [
              'Find the difference quotient of the function $f(x) = \\sqrt{x}$ [cite: 9]:',
            ],
            hint: 'Set up (√(x+h) - √x)/h and multiply numerator and denominator by the conjugate (√(x+h) + √x).',
            steps: [
              {
                title: 'Step 1: Set Up & Multiply by Conjugate',
                explanation:
                  'Set up the difference quotient formula and rationalize the numerator by multiplying numerator and denominator by the conjugate $(\\sqrt{x+h} + \\sqrt{x})$ [cite: 9]:',
                mathLatex:
                  '= \\frac{\\sqrt{x+h} - \\sqrt{x}}{h} \\cdot \\frac{\\sqrt{x+h} + \\sqrt{x}}{\\sqrt{x+h} + \\sqrt{x}}',
              },
              {
                title: 'Step 2: Apply Difference of Squares & Cancel $h$',
                explanation:
                  'Apply $(A-B)(A+B) = A^2 - B^2$, simplify, and divide out the factor $h$ [cite: 9]:',
                mathLatex:
                  '= \\frac{(\\sqrt{x+h})^2 - (\\sqrt{x})^2}{h(\\sqrt{x+h} + \\sqrt{x})} = \\frac{x+h-x}{h(\\sqrt{x+h} + \\sqrt{x})}',
                highlightMathLatex:
                  '= \\frac{h}{h(\\sqrt{x+h} + \\sqrt{x})} = \\frac{1}{\\sqrt{x+h} + \\sqrt{x}}',
              },
            ],
          },
        ],
        interactiveToolLink: {
          toolId: 'secant-to-tangent',
          label: 'Launch Secant-to-Tangent Difference Quotient Animator',
          description:
            'Animate h → 0 and watch the difference quotient converge live to the derivative slope.',
        },
      },
      {
        id: 'unit-1-5',
        moduleNumber: 'Quick Review',
        moduleTag: 'Exam Reference',
        title: 'Unit 1.5: Phase 1 Summary Reference Sheet',
        workedExamples: [],
        referenceTable: {
          headers: ['Concept', 'Core Formula / Technique', 'Citation Note'],
          rows: [
            {
              concept: 'Even Function',
              formulaOrTechnique: '$f(-x) = f(x)$, symmetric to y-axis',
              citation: '[cite: 9]',
            },
            {
              concept: 'Odd Function',
              formulaOrTechnique: '$f(-x) = -f(x)$, symmetric to origin',
              citation: '[cite: 9]',
            },
            {
              concept: 'Difference Quotient',
              formulaOrTechnique: '$\\frac{f(x+h) - f(x)}{h}$',
              citation: '[cite: 9]',
            },
            {
              concept: 'Continuous at $x=c$',
              formulaOrTechnique: '$\\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = f(c)$',
              citation: '[cite: 10]',
            },
            {
              concept: 'Derivative at $x=a$',
              formulaOrTechnique: "$f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$",
              citation: '[cite: 5]',
            },
          ],
        },
      },
    ],
    selfAssessmentSubtitle:
      'Test your preparation with problems modeled on past ISRT examination questions.',
    selfAssessment: [
      {
        id: 'p1-sa-1',
        badge: 'Practice Problem 1',
        topicTag: 'Difference Quotient [cite: 9]',
        question:
          'Find and fully simplify the difference quotient for $f(x) = 2x^2 - 3x$ [cite: 9].',
        hint: 'Expand 2(x+h)^2 - 3(x+h), subtract (2x^2 - 3x), and factor out h from the numerator.',
        steps: [
          {
            title: 'Step 1: Substitute $x+h$ into $f(x) = 2x^2 - 3x$',
            explanation: 'Expand $(x+h)^2 = x^2 + 2xh + h^2$ and distribute:',
            mathLatex:
              '= \\frac{[2(x+h)^2 - 3(x+h)] - [2x^2 - 3x]}{h} = \\frac{2(x^2 + 2xh + h^2) - 3x - 3h - 2x^2 + 3x}{h}',
          },
          {
            title: 'Step 2: Cancel Like Terms and Divide by $h$',
            explanation: 'Cancel $2x^2 - 2x^2$ and $-3x + 3x$, then factor out $h$:',
            mathLatex:
              '= \\frac{2x^2 + 4xh + 2h^2 - 3x - 3h - 2x^2 + 3x}{h} = \\frac{4xh + 2h^2 - 3h}{h} = \\frac{h(4x + 2h - 3)}{h}',
            highlightMathLatex: '= 4x + 2h - 3',
          },
        ],
        verification: {
          expr: '2*x^2 - 3*x',
          expectedDerivativeExpr: '4*x - 3',
        },
      },
      {
        id: 'p1-sa-2',
        badge: 'Practice Problem 2',
        topicTag: 'Limits at Infinity [cite: 7]',
        question: 'Find the limit: $\\lim_{x \\to +\\infty} \\frac{7 - 6x^5}{x + 3}$ [cite: 7].',
        hint: 'Divide numerator and denominator by x (the highest power of x in the denominator).',
        steps: [
          {
            title: 'Step 1: Divide by Highest Power in Denominator ($x$)',
            explanation:
              'Divide numerator and denominator by $x$ (the highest power in the denominator):',
            mathLatex: '= \\lim_{x \\to +\\infty} \\frac{\\frac{7}{x} - 6x^4}{1 + \\frac{3}{x}}',
          },
          {
            title: 'Step 2: Evaluate Behaviour as $x \\to +\\infty$',
            explanation:
              'As $x \\to +\\infty$, the terms $7/x$ and $3/x$ approach 0. However, the term $-6x^4$ grows without bound in the negative direction.',
            highlightMathLatex: '= -\\infty',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // PHASE 02.html
  // =========================================================================
  {
    id: 'phase-2',
    phaseNumber: 2,
    shortTitle: 'Phase 2: Derivatives & Optimization',
    headerBadge: 'Phase 2: Derivatives & Applications',
    bannerSubtitle: 'Academic Rigor & Departmental Standards',
    bannerTitle: 'Phase 2: Differentiation, Implicit Curves, & Optimization',
    bannerDescription:
      'Moving beyond the limits and continuity of Phase 1, Phase 2 delves into the heart of differential calculus. We will explore the geometry of tangent lines, the mechanics of implicit differentiation on complex curves like the Folium of Descartes, dynamic related rates problems, and the rigorous definitions of absolute and relative extrema required for ISRT examinations.',
    themeColor: 'indigo',
    units: [
      {
        id: 'unit-2-1',
        moduleNumber: 'Module 01',
        moduleTag: 'Geometry',
        title: 'Unit 2.1: Tangent Lines and Instantaneous Velocity',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: Speedometers and Slopes',
          content:
            'If you drive 120 miles in 2 hours, your average velocity is 60 mph. But what does your speedometer read at exactly 1 hour and 15 minutes? That is instantaneous velocity. In calculus, average velocity corresponds to the slope of a secant line connecting two points on a position-time graph. As those two points merge into one, the secant line becomes a tangent line, and its slope represents the exact instantaneous rate of change at that moment [cite: 3, 4].',
        },
        engineSection: {
          title: 'The Mathematical Engine: Definitions',
          cards: [
            {
              title: 'Tangent Line Definition [cite: 3]',
              content:
                'The tangent line to the curve $y=f(x)$ at the point $P(a, f(a))$ is the line through $P$ with slope $m = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$, provided this limit exists.',
            },
            {
              title: 'Instantaneous Velocity',
              content:
                "If $s = f(t)$ is the position function of a particle, its instantaneous velocity at time $t$ is the derivative $v(t) = s'(t) = \\frac{ds}{dt}$ [cite: 4].",
            },
          ],
        },
        workedExamples: [
          {
            id: 'p2-ex-2-1',
            examSource: 'ISRT 1st Year 2nd In-course Exam 2024',
            problemBadge: 'Problem 1 & 2',
            questionLines: [
              '1. Find an equation for the tangent line to the curve $y = 2/x$ at the point $(2,1)$ on this curve [cite: 4].',
              "2. Consider a particle whose position function is $s = f(t) = 1 + 5t - 2t^2$. The position of the particle at time $t = 2$ s is $s = 3$ m. Find the particle's instantaneous velocity at time $t = 2$ s [cite: 4].",
            ],
            hint: "For Part 1, write y = 2x^(-1), differentiate to find f'(2), and use y - 1 = m(x - 2). For Part 2, differentiate s(t) with respect to t and plug in t = 2.",
            steps: [
              {
                title: 'Part 1: Tangent Line Equation for $y = 2/x$ at $(2,1)$',
                explanation:
                  'Given $y = f(x) = \\frac{2}{x} = 2x^{-1}$. Differentiate and evaluate the slope $m$ at $x = 2$, then apply point-slope form $y - y_1 = m(x - x_1)$ with point $(2, 1)$:',
                mathLatex:
                  "f'(x) = -2x^{-2} = -\\frac{2}{x^2} \\implies m = f'(2) = -\\frac{2}{(2)^2} = -\\frac{1}{2}, \\quad y - 1 = -\\frac{1}{2}(x - 2)",
                highlightMathLatex: 'y = -\\frac{1}{2}x + 1 + 1 \\implies y = -\\frac{1}{2}x + 2',
              },
              {
                title: 'Part 2: Instantaneous Velocity at $t = 2$ s',
                explanation:
                  'The position function is $s(t) = 1 + 5t - 2t^2$. The velocity function $v(t)$ is the derivative of position with respect to time. Evaluate at $t = 2$ s:',
                mathLatex: "v(t) = s'(t) = \\frac{d}{dt}(1 + 5t - 2t^2) = 5 - 4t",
                highlightMathLatex: 'v(2) = 5 - 4(2) = 5 - 8 = -3 \\text{ m/s}',
              },
            ],
            verification: {
              type: 'derivative_1d',
              expr: '2/x',
              expectedDerivativeExpr: '-2/(x^2)',
              testPoints: [1, 2, 4],
            },
          },
        ],
        interactiveToolLink: {
          toolId: 'derivative-explorer',
          label: 'Inspect Tangent Line to y = 2/x at x = 2 in Derivative Explorer',
          description: 'See the curve y = 2/x and its tangent line y = -0.5x + 2 live.',
        },
      },
      {
        id: 'unit-2-2',
        moduleNumber: 'Module 02',
        moduleTag: 'Advanced Differentiation',
        title: 'Unit 2.2: Implicit Differentiation and the Folium of Descartes',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: Curves that loop',
          content:
            'Most functions we see are explicitly solved for $y$, like $y = x^2$. But many beautiful and important geometric curves, like circles ($x^2 + y^2 = r^2$) or the Folium of Descartes ($x^3 + y^3 = 3xy$), twist and cross themselves, failing the vertical line test [cite: 3, 4]. We cannot isolate $y$ easily. Implicit differentiation allows us to find the slope $\\frac{dy}{dx}$ at any point on these complex curves by differentiating both sides with respect to $x$ and applying the chain rule whenever we differentiate a term containing $y$ [cite: 3, 4].',
        },
        examinerTrap: {
          title: 'Examiner Trap & Memory Trick: The Missing Chain Rule',
          paragraphs: [
            'When differentiating $y^3$ implicitly with respect to $x$, students often write $3y^2$ and stop. This is wrong! Because $y$ is a function of $x$, the chain rule requires multiplying by the inner derivative: $\\frac{d}{dx}(y^3) = 3y^2 \\cdot \\frac{dy}{dx}$. Similarly, terms like $xy$ require the product rule: $\\frac{d}{dx}(xy) = 1 \\cdot y + x \\cdot \\frac{dy}{dx}$ [cite: 3, 4].',
          ],
        },
        workedExamples: [
          {
            id: 'p2-ex-2-2',
            examSource: 'ISRT Final Examination 2024',
            problemBadge: 'Problem 4',
            questionLines: [
              '(a) Use implicit differentiation to find $\\frac{dy}{dx}$ for the Folium of Descartes: $x^3 + y^3 = 3xy$ [cite: 3, 4].',
              '(b) Find an equation for the tangent line to the Folium of Descartes at the point $(\\frac{3}{2}, \\frac{3}{2})$ [cite: 3, 4].',
            ],
            hint: 'Differentiate both sides wrt x: 3x² + 3y²(dy/dx) = 3(y + x(dy/dx)), divide by 3, and solve for dy/dx.',
            steps: [
              {
                title: 'Part (a): Implicit Differentiation of $x^3 + y^3 = 3xy$',
                explanation:
                  'Differentiate both sides with respect to $x$, using the chain rule on $y^3$ and the product rule on $3xy$. Divide by 3 and group all terms with $\\frac{dy}{dx}$ on one side:',
                mathLatex:
                  '3x^2 + 3y^2 \\frac{dy}{dx} = 3 \\left( y + x\\frac{dy}{dx} \\right) \\implies x^2 + y^2 \\frac{dy}{dx} = y + x\\frac{dy}{dx} \\implies \\frac{dy}{dx} (y^2 - x) = y - x^2',
                highlightMathLatex: '\\frac{dy}{dx} = \\frac{y - x^2}{y^2 - x}',
              },
              {
                title: 'Part (b): Tangent Line Equation at $(\\frac{3}{2}, \\frac{3}{2})$',
                explanation:
                  'Evaluate the derivative at $(x, y) = (\\frac{3}{2}, \\frac{3}{2})$ to find the slope $m = -1$, then apply point-slope form $y - y_1 = m(x - x_1)$:',
                mathLatex:
                  'm = \\frac{\\frac{3}{2} - (\\frac{3}{2})^2}{(\\frac{3}{2})^2 - \\frac{3}{2}} = \\frac{\\frac{6}{4} - \\frac{9}{4}}{\\frac{9}{4} - \\frac{6}{4}} = \\frac{-\\frac{3}{4}}{\\frac{3}{4}} = -1, \\quad y - \\frac{3}{2} = -1 \\left(x - \\frac{3}{2}\\right)',
                highlightMathLatex:
                  'y = -x + \\frac{3}{2} + \\frac{3}{2} \\implies y = -x + 3 \\implies x + y = 3',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-2-3',
        moduleNumber: 'Module 03',
        moduleTag: 'Dynamic Systems',
        title: 'Unit 2.3: Related Rates',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: Connected Movements',
          content:
            'When variables are tied together by geometry (like the sides of a right triangle via the Pythagorean theorem), their rates of change are also tied together [cite: 4]. If a baseball player runs from second to third base, his distance to third base is shrinking at a known rate. But how fast is his distance from home plate changing? Because the diamond is a square, these distances form a right triangle. By taking the derivative of the Pythagorean theorem with respect to time ($t$), we link the unknown rate to the known rates [cite: 4].',
        },
        workedExamples: [
          {
            id: 'p2-ex-2-3',
            examSource: 'ISRT 1st Year 2nd In-course Exam 2024',
            problemBadge: 'Problem 8',
            questionLines: [
              "A baseball diamond is a square whose sides are 90 ft long. Suppose that a player running from second base to third base has a speed of 30 ft/s at the instant when he is 20 ft from third base. At what rate is the player's distance from home plate changing at that instant? [cite: 4]",
            ],
            hint: 'Set up the right triangle with legs x (distance to 3rd base) and 90 ft (3rd base to home plate), so hypotenuse z satisfies z² = x² + 90². Differentiate wrt t: z(dz/dt) = x(dx/dt).',
            steps: [
              {
                title: 'Step 1: Define Variables and Given Information',
                explanation:
                  "Let home plate be at $(0,0)$, first base at $(90,0)$, second base at $(90,90)$, and third base at $(0,90)$. Let $x$ be the player's distance from third base and $z$ be the direct distance from home plate. We are given $\\frac{dx}{dt} = -30 \\text{ ft/s}$ (negative because $x$ is decreasing) and need $\\frac{dz}{dt}$ when $x = 20 \\text{ ft}$.",
              },
              {
                title: 'Step 2 & 3: Geometric Relationship & Differentiation wrt Time ($t$)',
                explanation:
                  'Using the Pythagorean theorem for the triangle formed by home plate, third base, and the player, and differentiating with respect to $t$:',
                mathLatex:
                  'z^2 = x^2 + 90^2 \\implies \\frac{d}{dt}(z^2) = \\frac{d}{dt}(x^2 + 8100) \\implies 2z \\frac{dz}{dt} = 2x \\frac{dx}{dt} \\implies z \\frac{dz}{dt} = x \\frac{dx}{dt}',
              },
              {
                title: 'Step 4: Solve for Unknowns at $x = 20$',
                explanation:
                  "When $x = 20$, $z = \\sqrt{20^2 + 90^2} = \\sqrt{8500} = 10\\sqrt{85}$. Substitute into the differentiated equation. The player's distance from home plate is decreasing at a rate of $60/\\sqrt{85}$ ft/s.",
                mathLatex: '(10\\sqrt{85}) \\frac{dz}{dt} = (20)(-30) = -600',
                highlightMathLatex:
                  '\\frac{dz}{dt} = \\frac{-600}{10\\sqrt{85}} = -\\frac{60}{\\sqrt{85}} \\approx -6.51 \\text{ ft/s}',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-2-4',
        moduleNumber: 'Module 04',
        moduleTag: 'Optimization',
        title: 'Unit 2.4: Extrema and Optimization',
        engineSection: {
          title: 'The Mathematical Engine: Definitions',
          cards: [
            {
              title: 'Absolute Maxima [cite: 3]',
              content:
                'Let $f$ be a function defined on some interval $I$ containing $c$. Then $f(c)$ is the absolute maximum of $f$ on $I$ if $f(c) \\ge f(x)$ for all $x$ in $I$ [cite: 3].',
            },
            {
              title: 'Relative Extrema [cite: 3]',
              content:
                'A function $f$ has a relative maximum (or minimum) at $c$ if there exists an open interval $(a, b)$ containing $c$ such that $f(c) \\ge f(x)$ (or $f(c) \\le f(x)$) for all $x$ in $(a, b)$ [cite: 3].',
            },
            {
              title: 'Extreme Value Theorem [cite: 3]',
              content:
                'If $f$ is continuous on a closed interval $[a, b]$, then $f$ attains both an absolute maximum value $f(c)$ and an absolute minimum value $f(d)$ at some numbers $c$ and $d$ in $[a, b]$ [cite: 3].',
              colSpan2: true,
            },
          ],
        },
        workedExamples: [
          {
            id: 'p2-ex-2-4',
            examSource: 'ISRT 1st Year 2nd In-course Exam 2024',
            problemBadge: 'Problem 9',
            questionLines: [
              'An open box is to be made from a 16-inch by 30-inch piece of cardboard by cutting out squares of equal size from the four corners and bending up the sides. What size should the squares be to obtain a box with the largest volume? [cite: 4]',
            ],
            hint: "Let x be the side length of each corner square (0 < x < 8). Then V(x) = (30 - 2x)(16 - 2x)x = 4x³ - 92x² + 480x. Solve V'(x) = 0.",
            steps: [
              {
                title: 'Step 1: Define Variables and the Objective Function',
                explanation:
                  'Let $x$ be the side length of the square cut from each corner. Length $L = 30 - 2x$, Width $W = 16 - 2x$, Height $H = x$. The valid domain is $0 < x < 8$ (constrained by half the shorter 16-inch side).',
                mathLatex:
                  'V(x) = (30 - 2x)(16 - 2x)(x) = (480 - 60x - 32x + 4x^2)x = 4x^3 - 92x^2 + 480x',
              },
              {
                title: 'Step 2: Find Critical Points',
                explanation:
                  'Differentiate $V(x)$ with respect to $x$, set to zero, divide by 4, and apply the quadratic formula:',
                mathLatex:
                  "V'(x) = 12x^2 - 184x + 480 = 0 \\implies 3x^2 - 46x + 120 = 0 \\implies x = \\frac{46 \\pm \\sqrt{2116 - 1440}}{6} = \\frac{46 \\pm 26}{6}",
                highlightMathLatex:
                  'x_1 = \\frac{72}{6} = 12 \\quad \\text{and} \\quad x_2 = \\frac{20}{6} = \\frac{10}{3} = 3\\frac{1}{3}',
              },
              {
                title: 'Step 3: Domain Filtering & Second Derivative Verification',
                explanation:
                  "The root $x = 12$ is outside our valid domain $(0, 8)$. Check $V''(x) = 24x - 184$ at $x = 10/3$: $V''(10/3) = 80 - 184 = -104 < 0$, confirming a local maximum.",
                highlightMathLatex:
                  '\\text{The squares should be } \\frac{10}{3} \\text{ inches by } \\frac{10}{3} \\text{ inches.}',
              },
            ],
            verification: {
              type: 'derivative_1d',
              expr: '4*x^3 - 92*x^2 + 480*x',
              expectedDerivativeExpr: '12*x^2 - 184*x + 480',
              testPoints: [1, 2, 10 / 3, 5],
            },
          },
        ],
        interactiveToolLink: {
          toolId: 'optimization-sketcher',
          label: 'Analyze V(x) = 4x³ - 92x² + 480x in Optimization & Curve-Sketching Tool',
          description:
            'Visualize the critical points at x = 10/3 and x = 12, concavity, and inflection point.',
        },
      },
      {
        id: 'unit-2-5',
        moduleNumber: 'Quick Review',
        moduleTag: 'Exam Reference',
        title: 'Unit 2.5: Phase 2 Summary Reference Sheet',
        workedExamples: [],
        referenceTable: {
          headers: ['Concept', 'Definition / Core Technique', 'Citation Note'],
          rows: [
            {
              concept: 'Tangent Line',
              formulaOrTechnique:
                'Line through $(a, f(a))$ with slope $m = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$',
              citation: '[cite: 3]',
            },
            {
              concept: 'Instantaneous Velocity',
              formulaOrTechnique: "$v(t) = s'(t) = \\frac{ds}{dt}$",
              citation: '[cite: 4]',
            },
            {
              concept: 'Implicit Differentiation',
              formulaOrTechnique:
                'Differentiate $f(x, y) = c$ wrt $x$, use chain rule on $y$, solve for $dy/dx$',
              citation: '[cite: 3, 4]',
            },
            {
              concept: 'Absolute Maxima',
              formulaOrTechnique: '$f(c) \\ge f(x)$ for all $x \\in I$',
              citation: '[cite: 3]',
            },
            {
              concept: 'Relative Extrema',
              formulaOrTechnique:
                '$f(c) \\ge (\\text{or } \\le) f(x)$ for all $x$ in an open interval $(a, b)$',
              citation: '[cite: 3]',
            },
            {
              concept: 'Extreme Value Theorem',
              formulaOrTechnique:
                'If $f$ continuous on $[a, b]$, $f$ attains absolute max/min on $[a, b]$',
              citation: '[cite: 3]',
            },
          ],
        },
      },
    ],
    selfAssessmentSubtitle:
      'Test your preparation with problems modeled on past ISRT examination questions.',
    selfAssessment: [
      {
        id: 'p2-sa-1',
        badge: 'Practice Problem 1',
        topicTag: 'Implicit Differentiation [cite: 3, 4, 8]',
        question:
          'Show that $x^3 + 3xy^2 = 1$ is an implicit solution to the differential equation $2xy \\frac{dy}{dx} + x^2 + y^2 = 0$ on the interval $0 < x < 1$ [cite: 8].',
        hint: 'Differentiate x³ + 3xy² = 1 wrt x using the product rule on 3xy², then divide the entire equation by 3.',
        steps: [
          {
            title: 'Step 1: Differentiate Implicitly with Respect to $x$',
            explanation:
              'Differentiate $x^3 + 3xy^2 = 1$ implicitly with respect to $x$, applying the power rule and product rule:',
            mathLatex:
              '\\frac{d}{dx}(x^3) + \\frac{d}{dx}(3xy^2) = \\frac{d}{dx}(1) \\implies 3x^2 + \\left[ 3 \\cdot y^2 + 3x \\cdot 2y \\frac{dy}{dx} \\right] = 0',
          },
          {
            title: 'Step 2: Divide by 3 and Rearrange',
            explanation:
              'Divide $3x^2 + 3y^2 + 6xy \\frac{dy}{dx} = 0$ by 3 to obtain the target differential equation [cite: 8]:',
            mathLatex: 'x^2 + y^2 + 2xy \\frac{dy}{dx} = 0',
            highlightMathLatex: '2xy \\frac{dy}{dx} + x^2 + y^2 = 0 \\quad \\blacksquare',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // PHASE 03.html
  // =========================================================================
  {
    id: 'phase-3',
    phaseNumber: 3,
    shortTitle: 'Phase 3: Multivariable Differentials',
    headerBadge: 'Phase 3: Multivariable Calculus',
    bannerSubtitle: 'Academic Rigor & Departmental Standards',
    bannerTitle: 'Phase 3: Differentiability & The Chain Rule for Several Variables',
    bannerDescription:
      'Based directly on Lecture 13 by Dr. Md. Rakib Hossain [cite: 10], this phase extends our calculus toolkit into higher dimensions. We transition from single-variable functions to functions of several variables, introducing total differentials, the formal definition of differentiability for surfaces, and practical applications in approximation and error propagation.',
    themeColor: 'indigo',
    units: [
      {
        id: 'unit-3-1',
        moduleNumber: 'Module 01',
        moduleTag: 'Higher Dimensions',
        title: 'Unit 3.1: The Total Differential',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: Navigating a Topographical Map',
          content:
            'Imagine standing on a hillside. If you walk North, your elevation changes based on the slope in the North direction ($\\partial z / \\partial y$). If you walk East, your elevation changes based on the Eastward slope ($\\partial z / \\partial x$). The total differential $dz$ calculates your total approximate change in elevation by combining your movement in both directions simultaneously [cite: 10].',
        },
        engineSection: {
          title: 'The Mathematical Engine: Definition of Total Differential',
          cards: [
            {
              title: 'Total Differential of Two Variables $z = f(x, y)$ [cite: 10]',
              content:
                'If $z = f(x, y)$ and $\\Delta x$ and $\\Delta y$ are increments of $x$ and $y$, then the differentials of the independent variables $x$ and $y$ are $dx = \\Delta x$ and $dy = \\Delta y$ [cite: 10]. The total differential of the dependent variable $z$ is:',
              mathLatex:
                'dz = \\frac{\\partial z}{\\partial x} dx + \\frac{\\partial z}{\\partial y} dy = f_x(x, y) dx + f_y(x, y) dy',
              colSpan2: true,
            },
            {
              title: 'Extension to Three or More Variables $w = f(x, y, z, u)$ [cite: 10]',
              content:
                'This definition can be extended to a function of three or more variables. For instance, if $w = f(x, y, z, u)$, then $dx = \\Delta x$, $dy = \\Delta y$, $dz = \\Delta z$, $du = \\Delta u$ [cite: 10]. The total differential of $w$ is:',
              mathLatex:
                'dw = \\frac{\\partial w}{\\partial x} dx + \\frac{\\partial w}{\\partial y} dy + \\frac{\\partial w}{\\partial z} dz + \\frac{\\partial w}{\\partial u} du',
              colSpan2: true,
            },
          ],
        },
        workedExamples: [
          {
            id: 'p3-ex-3-1',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Example 1',
            questionLines: [
              'Find the total differential for each function [cite: 10]:',
              'a. $z = 2x \\sin y - 3x^2y^2$',
              'b. $w = x^2 + y^2 + z^2$',
            ],
            hint: 'For (a), compute ∂z/∂x (treating y as constant) and ∂z/∂y (treating x as constant). For (b), sum the partial derivatives wrt x, y, and z.',
            steps: [
              {
                title: 'Part a: Total Differential $dz$ for $z = 2x \\sin y - 3x^2y^2$',
                explanation:
                  'Calculate the partial derivatives $\\frac{\\partial z}{\\partial x} = 2 \\sin y - 6xy^2$ and $\\frac{\\partial z}{\\partial y} = 2x \\cos y - 6x^2y$, and substitute into $dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy$:',
                highlightMathLatex: 'dz = (2 \\sin y - 6xy^2) dx + (2x \\cos y - 6x^2y) dy',
              },
              {
                title: 'Part b: Total Differential $dw$ for $w = x^2 + y^2 + z^2$',
                explanation:
                  'Use $dw = \\frac{\\partial w}{\\partial x} dx + \\frac{\\partial w}{\\partial y} dy + \\frac{\\partial w}{\\partial z} dz$:',
                highlightMathLatex: 'dw = 2x \\, dx + 2y \\, dy + 2z \\, dz',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-3-2',
        moduleNumber: 'Module 02',
        moduleTag: 'Theoretical Foundations',
        title: 'Unit 3.2: Differentiability of Two Variables',
        engineSection: {
          title: 'Definition of Differentiability',
          introParagraphs: [
            'Unlike a single variable function where differentiability simply means a derivative exists, for surfaces $z = f(x, y)$, differentiability requires the surface to be locally "flat" (approximated well by a tangent plane) [cite: 10].',
          ],
          cards: [
            {
              title: 'Formal Definition [cite: 10]',
              content:
                'A function $f$ given by $z = f(x, y)$ is differentiable at $(x_0, y_0)$ if $\\Delta z$ can be written in the form below, where both $\\varepsilon_1 \\to 0$ and $\\varepsilon_2 \\to 0$ as $(\\Delta x, \\Delta y) \\to (0, 0)$. The function $f$ is differentiable in a region $R$ if it is differentiable at each point in $R$ [cite: 10].',
              mathLatex:
                '\\Delta z = f_x(x_0, y_0)\\Delta x + f_y(x_0, y_0)\\Delta y + \\varepsilon_1\\Delta x + \\varepsilon_2\\Delta y',
              colSpan2: true,
            },
            {
              title: 'Theorem 13.4: Sufficient Condition for Differentiability [cite: 10]',
              content:
                'If $f$ is a function of $x$ and $y$, where $f_x$ and $f_y$ are continuous in an open region $R$, then $f$ is differentiable on $R$.',
              colSpan2: true,
              variant: 'blue',
            },
          ],
        },
        workedExamples: [
          {
            id: 'p3-ex-3-2',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Proof Example',
            questionLines: [
              'Show that the function given by $f(x, y) = x^2 + 3y$ is differentiable at every point in the plane [cite: 10].',
            ],
            hint: 'Expand Δz = f(x + Δx, y + Δy) - f(x, y) and group terms into f_x Δx + f_y Δy + ε_1 Δx + ε_2 Δy.',
            steps: [
              {
                title: 'Step 1: Expand the Exact Increment $\\Delta z$',
                explanation:
                  'Letting $z = f(x, y)$, the exact increment of $z$ at an arbitrary point $(x, y)$ in the plane is [cite: 10]:',
                mathLatex:
                  '\\Delta z = f(x + \\Delta x, y + \\Delta y) - f(x, y) = [(x + \\Delta x)^2 + 3(y + \\Delta y)] - (x^2 + 3y) = 2x\\Delta x + \\Delta x^2 + 3\\Delta y',
              },
              {
                title: 'Step 2: Match with Formal Definition of Differentiability',
                explanation:
                  'Where $\\varepsilon_1 = \\Delta x$ and $\\varepsilon_2 = 0$ [cite: 10]. Because $\\varepsilon_1 \\to 0$ and $\\varepsilon_2 \\to 0$ as $(\\Delta x, \\Delta y) \\to (0, 0)$, it follows that $f$ is differentiable at every point in the plane [cite: 10]. $\\blacksquare$',
                mathLatex: '= 2x(\\Delta x) + 3(\\Delta y) + \\Delta x(\\Delta x) + 0(\\Delta y)',
                highlightMathLatex:
                  '= f_x(x, y)\\Delta x + f_y(x, y)\\Delta y + \\varepsilon_1\\Delta x + \\varepsilon_2\\Delta y',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-3-3',
        moduleNumber: 'Module 03',
        moduleTag: 'Approximations',
        title: 'Unit 3.3: Approximation by Differentials & Error Propagation',
        engineSection: {
          title: 'Linear Approximation by Total Differential',
          introParagraphs: [
            'The exact change in $z$ is $\\Delta z$. This change can be approximated by the total differential $dz$ [cite: 10].',
          ],
          introMathLatex:
            '\\Delta z \\approx dz = \\frac{\\partial z}{\\partial x} dx + \\frac{\\partial z}{\\partial y} dy',
        },
        workedExamples: [
          {
            id: 'p3-ex-3-3-1',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Approximation Example',
            questionLines: [
              'Use the differential $dz$ to approximate the change in $z = \\sqrt{4 - x^2 - y^2}$ as $(x, y)$ moves from the point $(1, 1)$ to the point $(1.01, 0.97)$. Compare this approximation with the exact change in $z$ [cite: 10].',
            ],
            hint: 'Set (x, y) = (1, 1), dx = 0.01, dy = -0.03, and evaluate ∂z/∂x = -x/√(4-x²-y²) and ∂z/∂y = -y/√(4-x²-y²).',
            steps: [
              {
                title: 'Step 1: Compute Increments and Partial Derivatives',
                explanation:
                  'Letting $(x, y) = (1, 1)$ and $(x + \\Delta x, y + \\Delta y) = (1.01, 0.97)$ produces $dx = \\Delta x = 0.01$ and $dy = \\Delta y = -0.03$ [cite: 10]:',
                mathLatex:
                  '\\Delta z \\approx dz = \\frac{-x}{\\sqrt{4 - x^2 - y^2}} \\Delta x + \\frac{-y}{\\sqrt{4 - x^2 - y^2}} \\Delta y',
              },
              {
                title: 'Step 2: Evaluate $dz$ at $(1, 1)$ and Compare with Exact $\\Delta z$',
                explanation:
                  'The exact change corresponds to the difference in heights of two points on the surface of the hemisphere [cite: 10]:',
                mathLatex:
                  'dz = -\\frac{1}{\\sqrt{2}} (0.01) - \\frac{1}{\\sqrt{2}} (-0.03) = \\frac{0.02}{\\sqrt{2}} = \\sqrt{2} (0.01) \\approx 0.0141',
                highlightMathLatex:
                  '\\Delta z = f(1.01, 0.97) - f(1, 1) = \\sqrt{4 - (1.01)^2 - (0.97)^2} - \\sqrt{4 - 1^2 - 1^2} \\approx 0.0137',
              },
            ],
          },
          {
            id: 'p3-ex-3-3-2',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Error Propagation',
            questionLines: [
              'The possible error involved in measuring each dimension of a rectangular box is $\\pm 0.1$ millimeter. The dimensions of the box are $x = 50$ centimeters, $y = 20$ centimeters, and $z = 15$ centimeters. Use $dV$ to estimate the propagated error in the calculated volume of the box [cite: 10].',
            ],
            hint: 'Convert ±0.1 mm to ±0.01 cm, then evaluate dV = yz dx + xz dy + xy dz at x=50, y=20, z=15.',
            steps: [
              {
                title: 'Step 1: Total Differential of Box Volume $V = xyz$',
                explanation: 'The volume of the box is given by $V = xyz$, and so [cite: 10]:',
                mathLatex:
                  'dV = \\frac{\\partial V}{\\partial x} dx + \\frac{\\partial V}{\\partial y} dy + \\frac{\\partial V}{\\partial z} dz = yz \\, dx + xz \\, dy + xy \\, dz',
              },
              {
                title: 'Step 2: Substitute Dimensions & Measurement Error',
                explanation:
                  'Using $0.1$ millimeter $= 0.01$ centimeter, you have $dx = dy = dz = \\pm 0.01$, and the propagated error is approximately [cite: 10]:',
                mathLatex:
                  'dV = (20)(15)(\\pm 0.01) + (50)(15)(\\pm 0.01) + (50)(20)(\\pm 0.01) = (300 + 750 + 1000)(\\pm 0.01)',
                highlightMathLatex: 'dV = 2050(\\pm 0.01) = \\pm 20.5 \\text{ cubic centimeters}',
              },
            ],
          },
        ],
      },
    ],
    selfAssessmentSubtitle:
      'Test your preparation with these multivariable calculus problems based on Lecture 13 [cite: 10].',
    selfAssessment: [
      {
        id: 'p3-sa-1',
        badge: 'Practice Problem 1',
        topicTag: 'Total Differential',
        question: 'Find the total differential $dz$ for the function $z = x^2e^{3y}$',
        hint: 'Treat y as constant to find ∂z/∂x = 2x e^(3y), and treat x as constant to find ∂z/∂y = 3x² e^(3y).',
        steps: [
          {
            title: 'Step 1: Compute Partial Derivatives',
            explanation:
              'Calculate $\\frac{\\partial z}{\\partial x}$ treating $y$ as constant, and $\\frac{\\partial z}{\\partial y}$ treating $x$ as constant:',
            mathLatex:
              '\\frac{\\partial z}{\\partial x} = 2x e^{3y}, \\qquad \\frac{\\partial z}{\\partial y} = x^2 (3e^{3y}) = 3x^2 e^{3y}',
          },
          {
            title: 'Step 2: Assemble Total Differential $dz$',
            explanation:
              'Substitute into $dz = \\frac{\\partial z}{\\partial x} dx + \\frac{\\partial z}{\\partial y} dy$:',
            highlightMathLatex: 'dz = (2x e^{3y}) dx + (3x^2 e^{3y}) dy',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // PHASE 04.html
  // =========================================================================
  {
    id: 'phase-4',
    phaseNumber: 4,
    shortTitle: 'Phase 4: Multivariable Chain Rule',
    headerBadge: 'Phase 4: Multivariable Dynamics',
    bannerSubtitle: 'Academic Rigor & Departmental Standards',
    bannerTitle: 'Phase 4: The Multivariable Chain Rule',
    bannerDescription:
      'Based on Lecture 13 and 14 materials [cite: 10], Phase 4 tackles the pinnacle of differential calculus for this course: The Multivariable Chain Rule. We will learn how to track rates of change through nested functions involving one or two independent variables using tree diagrams, and establish a powerful new shortcut for implicit differentiation.',
    themeColor: 'rose',
    units: [
      {
        id: 'unit-4-1',
        moduleNumber: 'Module 01',
        moduleTag: 'Dynamic Paths',
        title: 'Unit 4.1: The Chain Rule (One Independent Variable)',
        realLifeHook: {
          title: 'The Intuitive Real-Life Hook: The Ant on a Hot Plate',
          content:
            "Imagine an ant walking across a metal plate. The temperature $w$ on the plate depends on the position $(x, y)$. However, the ant's position $(x, y)$ changes as time $t$ passes. If you want to know how fast the temperature the ant experiences is changing with respect to time ($dw/dt$), you must account for how temperature changes with $x$ and $y$, multiplied by how fast the ant is moving in those directions.",
        },
        engineSection: {
          title: 'Theorem 13.5: Chain Rule - One Independent Variable [cite: 10]',
          cards: [
            {
              title: 'Formal Statement [cite: 10]',
              content:
                'Let $w = f(x, y)$, where $f$ is a differentiable function of $x$ and $y$. If $x = g(t)$ and $y = h(t)$, where $g$ and $h$ are differentiable functions of $t$, then $w$ is a differentiable function of $t$, and [cite: 10]:',
              mathLatex:
                '\\frac{dw}{dt} = \\frac{\\partial w}{\\partial x} \\frac{dx}{dt} + \\frac{\\partial w}{\\partial y} \\frac{dy}{dt}',
              colSpan2: true,
            },
          ],
        },
        workedExamples: [
          {
            id: 'p4-ex-4-1',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Example 3',
            questionLines: [
              'Let $w = x^2y - y^2$, where $x = \\sin t$ and $y = e^t$. Find $dw/dt$ when $t = 0$ [cite: 10].',
            ],
            hint: 'Compute ∂w/∂x = 2xy, ∂w/∂y = x² - 2y, dx/dt = cos t, dy/dt = e^t, and evaluate at t = 0 where x = 0, y = 1.',
            steps: [
              {
                title: 'Step 1: Compute Partial and Ordinary Derivatives',
                explanation:
                  'By the Chain Rule for one independent variable, calculate each component derivative [cite: 10]:',
                mathLatex:
                  '\\frac{\\partial w}{\\partial x} = 2xy, \\quad \\frac{\\partial w}{\\partial y} = x^2 - 2y, \\quad \\frac{dx}{dt} = \\cos t, \\quad \\frac{dy}{dt} = e^t',
              },
              {
                title: 'Step 2: Substitute and Evaluate at $t = 0$',
                explanation:
                  'When $t = 0$, $x = \\sin(0) = 0$ and $y = e^0 = 1$ [cite: 10]. Substitute $t=0, x=0, y=1$ into the chain rule expression:',
                mathLatex: '\\frac{dw}{dt} = (2xy)(\\cos t) + (x^2 - 2y)(e^t)',
                highlightMathLatex:
                  '\\frac{dw}{dt} = (2 \\cdot 0 \\cdot 1)(\\cos 0) + (0^2 - 2 \\cdot 1)(e^0) = 0 - 2 = -2',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-4-2',
        moduleNumber: 'Module 02',
        moduleTag: 'Complex Dependencies',
        title: 'Unit 4.2: The Chain Rule (Two Independent Variables)',
        engineSection: {
          title: 'Theorem 13.6 [cite: 10]',
          introParagraphs: [
            'If $w$ depends on $x$ and $y$, and both $x$ and $y$ depend on two independent variables $s$ and $t$, the chain rule expands into partial derivatives for each independent variable [cite: 10].',
          ],
          cards: [
            {
              title: 'Formal Definition [cite: 10]',
              content:
                'Let $w = f(x, y)$, where $f$ is differentiable, and let $x = g(s, t)$ and $y = h(s, t)$ such that the first partial derivatives of $x$ and $y$ with respect to $s$ and $t$ exist. Then $\\partial w/\\partial s$ and $\\partial w/\\partial t$ exist and are given by:',
              mathLatex:
                '\\frac{\\partial w}{\\partial s} = \\frac{\\partial w}{\\partial x} \\frac{\\partial x}{\\partial s} + \\frac{\\partial w}{\\partial y} \\frac{\\partial y}{\\partial s}, \\qquad \\frac{\\partial w}{\\partial t} = \\frac{\\partial w}{\\partial x} \\frac{\\partial x}{\\partial t} + \\frac{\\partial w}{\\partial y} \\frac{\\partial y}{\\partial t}',
              colSpan2: true,
            },
          ],
        },
        workedExamples: [
          {
            id: 'p4-ex-4-2',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Example 4',
            questionLines: [
              'Use the Chain Rule to find $\\partial w/\\partial s$ and $\\partial w/\\partial t$ for $w = 2xy$ where $x = s^2 + t^2$ and $y = s/t$ [cite: 10].',
            ],
            hint: 'Use ∂w/∂x = 2y and ∂w/∂y = 2x, combined with ∂x/∂s = 2s, ∂x/∂t = 2t, ∂y/∂s = 1/t, and ∂y/∂t = -s/t².',
            steps: [
              {
                title: 'Step 1: Compute $\\frac{\\partial w}{\\partial s}$',
                explanation:
                  'Apply Theorem 13.6 with respect to $s$ and substitute $x = s^2 + t^2$ and $y = s/t$ [cite: 10]:',
                mathLatex:
                  '\\frac{\\partial w}{\\partial s} = (2y)(2s) + (2x)\\left(\\frac{1}{t}\\right) = 4s\\left(\\frac{s}{t}\\right) + \\frac{2(s^2 + t^2)}{t}',
                highlightMathLatex:
                  '\\frac{\\partial w}{\\partial s} = \\frac{4s^2 + 2s^2 + 2t^2}{t} = \\frac{6s^2 + 2t^2}{t}',
              },
              {
                title: 'Step 2: Compute $\\frac{\\partial w}{\\partial t}$',
                explanation:
                  'Apply Theorem 13.6 with respect to $t$ and substitute for $x$ and $y$ [cite: 10]:',
                mathLatex:
                  '\\frac{\\partial w}{\\partial t} = (2y)(2t) + (2x)\\left(-\\frac{s}{t^2}\\right) = 4t\\left(\\frac{s}{t}\\right) - \\frac{2s(s^2 + t^2)}{t^2}',
                highlightMathLatex:
                  '\\frac{\\partial w}{\\partial t} = 4s - \\frac{2s^3 + 2st^2}{t^2} = \\frac{4st^2 - 2s^3 - 2st^2}{t^2} = \\frac{2st^2 - 2s^3}{t^2}',
              },
            ],
          },
        ],
      },
      {
        id: 'unit-4-3',
        moduleNumber: 'Module 03',
        moduleTag: 'Advanced Tools',
        title: 'Unit 4.3: Implicit Differentiation via Partial Derivatives',
        engineSection: {
          title: 'Theorem 13.7: Implicit Differentiation Shortcut [cite: 10]',
          introParagraphs: [
            'In Phase 2, we used standard implicit differentiation to find $dy/dx$. The Multivariable Chain Rule provides an elegant shortcut [cite: 10].',
          ],
          cards: [
            {
              title: 'Single Implicit Function $F(x, y) = 0$ [cite: 10]',
              content:
                'If the equation $F(x, y) = 0$ defines $y$ implicitly as a differentiable function of $x$, then [cite: 10]:',
              mathLatex: '\\frac{dy}{dx} = -\\frac{F_x(x, y)}{F_y(x, y)}, \\quad F_y(x, y) \\neq 0',
            },
            {
              title: 'Surface Implicit Function $F(x, y, z) = 0$ [cite: 10]',
              content:
                'Similarly, if $F(x, y, z) = 0$ defines $z$ implicitly as a function of $x$ and $y$, then [cite: 10]:',
              mathLatex:
                '\\frac{\\partial z}{\\partial x} = -\\frac{F_x(x, y, z)}{F_z(x, y, z)} \\quad \\text{and} \\quad \\frac{\\partial z}{\\partial y} = -\\frac{F_y(x, y, z)}{F_z(x, y, z)}',
            },
          ],
        },
        workedExamples: [
          {
            id: 'p4-ex-4-3',
            examSource: 'Faculty Lecture Standard',
            problemBadge: 'Example 6',
            questionLines: ['Find $dy/dx$ given $y^3 + y^2 - 5y - x^2 + 4 = 0$ [cite: 10].'],
            hint: 'Define F(x, y) = y³ + y² - 5y - x² + 4, compute F_x = -2x and F_y = 3y² + 2y - 5, and use dy/dx = -F_x / F_y.',
            steps: [
              {
                title: 'Step 1: Define $F(x, y)$ and Compute Partial Derivatives',
                explanation:
                  'Define the function $F(x, y) = y^3 + y^2 - 5y - x^2 + 4$ and compute $F_x$ and $F_y$ [cite: 10]:',
                mathLatex: 'F_x(x, y) = -2x, \\qquad F_y(x, y) = 3y^2 + 2y - 5',
              },
              {
                title: 'Step 2: Apply Theorem 13.7',
                explanation:
                  'Substitute into $\\frac{dy}{dx} = -\\frac{F_x(x,y)}{F_y(x,y)}$ [cite: 10]:',
                highlightMathLatex:
                  '\\frac{dy}{dx} = -\\frac{F_x(x, y)}{F_y(x, y)} = -\\frac{-2x}{3y^2 + 2y - 5} = \\frac{2x}{3y^2 + 2y - 5}',
              },
            ],
          },
        ],
      },
    ],
    selfAssessmentSubtitle:
      'Test your preparation with these multivariable chain rule problems based on Lecture 13 [cite: 10].',
    selfAssessment: [
      {
        id: 'p4-sa-1',
        badge: 'Practice Problem 1',
        topicTag: 'Implicit Partial Differentiation',
        question:
          'Find $\\frac{\\partial z}{\\partial x}$ and $\\frac{\\partial z}{\\partial y}$ for the surface defined by $x^2 + y^2 + z^2 + xez - 5 = 0$.',
        hint: 'Define F(x, y, z) = x² + y² + z² + x e^z - 5 = 0, compute F_x, F_y, and F_z, and apply Theorem 13.7.',
        steps: [
          {
            title: 'Step 1: Define $F(x,y,z)$ and Partial Derivatives',
            explanation:
              "Define $F(x, y, z) = x^2 + y^2 + z^2 + xez - 5 = 0$. Note: Assuming $xez$ means $x \\cdot e \\cdot z$, or perhaps $x \\cdot e^z$. Let's assume it is $x \\cdot e^z$ based on standard calculus problems.",
            mathLatex: 'F_x = 2x + e^z, \\quad F_y = 2y, \\quad F_z = 2z + xe^z',
          },
          {
            title: 'Step 2: Apply Theorem 13.7',
            explanation:
              'Compute $\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}$ and $\\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}$:',
            highlightMathLatex:
              '\\frac{\\partial z}{\\partial x} = -\\frac{2x + e^z}{2z + xe^z}, \\qquad \\frac{\\partial z}{\\partial y} = -\\frac{2y}{2z + xe^z}',
          },
        ],
        reviewNote:
          'Review Note (see REVIEW_NOTES.md): In the original HTML file, the problem statement writes "xez" while the solution clarifies that it represents x·e^z. If interpreted literally as e·x·z, then F_x = 2x + ez and F_z = 2z + ex.',
      },
    ],
  },
];
