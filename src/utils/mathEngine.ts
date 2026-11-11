/**
 * Zero-Error Mathematical Engine for Differential Calculus
 * Provides:
 * 1. Expression sanitization, tokenization, and recursive-descent AST parsing
 * 2. Safe numeric evaluation with friendly error classification (division by zero, complex/undefined, overflow)
 * 3. Central finite-difference numerical differentiation (1st, 2nd, and multivariable partial derivatives)
 * 4. Symbolic differentiation with step-by-step rule explanations (Power, Constant Multiple, Sum/Diff, Product, Quotient, Chain)
 * 5. Multi-point numerical equivalence checking for typed quiz answers (e.g., 2x+2 === 2(x+1))
 */

export type MathNode =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'unary'; op: '-' | '+'; arg: MathNode }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: MathNode; right: MathNode }
  | { type: 'call'; fn: string; arg: MathNode };

export interface ValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
  ast?: MathNode;
}

export interface EvalResult {
  ok: boolean;
  value: number;
  reason?: 'division_by_zero' | 'complex_or_undefined' | 'overflow' | 'syntax_error';
  message?: string;
}

export interface DerivativeStep {
  stepNumber: number;
  rule: string;
  targetLatex: string;
  resultLatex: string;
  reason: string;
}

export interface StepByStepDerivativeResult {
  valid: boolean;
  error?: string;
  originalLatex: string;
  derivativeLatex: string;
  derivativeExpr: string;
  steps: DerivativeStep[];
}

const KNOWN_FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'cot',
  'sec',
  'csc',
  'asin',
  'arcsin',
  'acos',
  'arccos',
  'atan',
  'arctan',
  'sinh',
  'cosh',
  'tanh',
  'sqrt',
  'cbrt',
  'ln',
  'log',
  'exp',
  'abs',
]);

const DEFAULT_ALLOWED_VARS = new Set([
  'x',
  'y',
  'z',
  't',
  's',
  'h',
  'k',
  'm',
  'a',
  'b',
  'c',
  'u',
  'v',
]);

type Token =
  | { type: 'num'; value: number }
  | { type: 'id'; value: string }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '^' }
  | { type: 'lparen' }
  | { type: 'rparen' };

/**
 * Sanitizes and tokenizes a mathematical input string.
 * Supports implicit multiplication like `2x`, `3(x+1)`, `(x+1)(x-1)`, `2sin(x)`.
 */
function tokenize(
  rawInput: string,
  allowedVars: Set<string>
): { ok: true; tokens: Token[] } | { ok: false; error: string } {
  const input = rawInput
    .trim()
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/\*\*/g, '^');

  if (!input) {
    return {
      ok: false,
      error: 'Please enter a mathematical expression (for example: x^3 - 3*x + 1).',
    };
  }

  if (input.length > 200) {
    return {
      ok: false,
      error: 'Expression is too long. Please keep it under 200 characters.',
    };
  }

  const rawTokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dotCount = 0;
      while (i < input.length && /[0-9.]/.test(input[i])) {
        if (input[i] === '.') dotCount++;
        if (dotCount > 1) {
          return { ok: false, error: `Invalid number format near "${numStr}."` };
        }
        numStr += input[i];
        i++;
      }
      if (numStr === '.') {
        return { ok: false, error: 'Unexpected decimal point "." without digits.' };
      }
      const val = Number(numStr);
      if (!Number.isFinite(val)) {
        return { ok: false, error: `Number "${numStr}" is out of range.` };
      }
      rawTokens.push({ type: 'num', value: val });
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      let idStr = '';
      while (i < input.length && /[a-zA-Z]/.test(input[i])) {
        idStr += input[i];
        i++;
      }
      const lower = idStr.toLowerCase();

      if (KNOWN_FUNCTIONS.has(lower)) {
        rawTokens.push({ type: 'id', value: lower });
      } else if (lower === 'pi') {
        rawTokens.push({ type: 'num', value: Math.PI });
      } else if (lower === 'e') {
        rawTokens.push({ type: 'num', value: Math.E });
      } else if (allowedVars.has(lower)) {
        rawTokens.push({ type: 'id', value: lower });
      } else {
        // Check if idStr can be split into single-letter variables/constants like "xy" or "xe"
        const chars = lower.split('');
        const allValidSingle = chars.every((c) => allowedVars.has(c) || c === 'e');
        if (allValidSingle && chars.length > 1) {
          for (const c of chars) {
            if (c === 'e') {
              rawTokens.push({ type: 'num', value: Math.E });
            } else {
              rawTokens.push({ type: 'id', value: c });
            }
          }
        } else {
          return {
            ok: false,
            error: `Unrecognized symbol or function "${idStr}". Use standard functions like sin(x), cos(x), sqrt(x), ln(x), exp(x) and variable x.`,
          };
        }
      }
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      rawTokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (ch === '(' || ch === '[') {
      rawTokens.push({ type: 'lparen' });
      i++;
      continue;
    }

    if (ch === ')' || ch === ']') {
      rawTokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    return {
      ok: false,
      error: `Invalid character "${ch}" in expression. Allowed operators are +, -, *, /, ^, and parentheses ().`,
    };
  }

  // Insert implicit multiplication tokens where appropriate:
  // e.g. num followed by id/lparen, rparen followed by id/num/lparen, variable id followed by id/num/lparen
  const tokens: Token[] = [];
  for (let idx = 0; idx < rawTokens.length; idx++) {
    const curr = rawTokens[idx];
    tokens.push(curr);

    if (idx + 1 < rawTokens.length) {
      const next = rawTokens[idx + 1];
      const currIsValue =
        curr.type === 'num' ||
        curr.type === 'rparen' ||
        (curr.type === 'id' && !KNOWN_FUNCTIONS.has(curr.value));
      const nextIsValueStart = next.type === 'num' || next.type === 'id' || next.type === 'lparen';

      if (currIsValue && nextIsValueStart) {
        tokens.push({ type: 'op', value: '*' });
      }
    }
  }

  return { ok: true, tokens };
}

/**
 * Recursive-descent parser turning tokens into a MathNode AST.
 */
export function parseMathExpression(
  input: string,
  allowedVars: string[] = Array.from(DEFAULT_ALLOWED_VARS)
): ValidationResult {
  const varSet = new Set(allowedVars.map((v) => v.toLowerCase()));
  const tokResult = tokenize(input, varSet);
  if (!tokResult.ok) {
    return { valid: false, error: tokResult.error };
  }

  const tokens = tokResult.tokens;
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseExpression(): MathNode {
    let left = parseTerm();
    while (
      peek()?.type === 'op' &&
      (peek() as { type: 'op'; value: string }).value in { '+': 1, '-': 1 }
    ) {
      const op = (consume() as { type: 'op'; value: '+' | '-' }).value;
      const right = parseTerm();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  function parseTerm(): MathNode {
    let left = parseFactor();
    while (
      peek()?.type === 'op' &&
      (peek() as { type: 'op'; value: string }).value in { '*': 1, '/': 1 }
    ) {
      const op = (consume() as { type: 'op'; value: '*' | '/' }).value;
      const right = parseFactor();
      if (op === '/' && right.type === 'number' && right.value === 0) {
        throw new Error('Division by zero detected in expression (cannot divide by 0).');
      }
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  function parseFactor(): MathNode {
    const t = peek();
    if (t?.type === 'op' && (t.value === '+' || t.value === '-')) {
      consume();
      const arg = parseFactor();
      if (t.value === '+') return arg;
      return { type: 'unary', op: '-', arg };
    }
    return parsePower();
  }

  function parsePower(): MathNode {
    const base = parsePrimary();
    const t = peek();
    if (t?.type === 'op' && t.value === '^') {
      consume();
      const exponent = parseFactor(); // right-associative
      return { type: 'binary', op: '^', left: base, right: exponent };
    }
    return base;
  }

  function parsePrimary(): MathNode {
    const t = peek();
    if (!t) {
      throw new Error(
        'Unexpected end of expression. Check for missing operands after an operator.'
      );
    }

    if (t.type === 'num') {
      consume();
      return { type: 'number', value: t.value };
    }

    if (t.type === 'id') {
      consume();
      if (KNOWN_FUNCTIONS.has(t.value)) {
        const next = peek();
        if (!next) {
          throw new Error(`Function "${t.value}" requires an argument, e.g., ${t.value}(x).`);
        }
        let arg: MathNode;
        if (next.type === 'lparen') {
          consume();
          if (peek()?.type === 'rparen') {
            throw new Error(`Function "${t.value}()" cannot have empty parentheses.`);
          }
          arg = parseExpression();
          if (peek()?.type !== 'rparen') {
            throw new Error(`Missing closing parenthesis ")" after ${t.value}(...`);
          }
          consume();
        } else {
          arg = parseFactor();
        }
        return { type: 'call', fn: t.value, arg };
      }
      return { type: 'variable', name: t.value };
    }

    if (t.type === 'lparen') {
      consume();
      if (peek()?.type === 'rparen') {
        throw new Error('Empty parentheses "()" are not allowed.');
      }
      const expr = parseExpression();
      if (peek()?.type !== 'rparen') {
        throw new Error('Mismatched parentheses: missing closing ")".');
      }
      consume();
      return expr;
    }

    if (t.type === 'rparen') {
      throw new Error('Unexpected closing parenthesis ")" without a matching opening "(".');
    }

    throw new Error(`Unexpected operator "${t.value}". Check your syntax.`);
  }

  try {
    const ast = parseExpression();
    if (pos < tokens.length) {
      const rem = tokens[pos];
      if (rem.type === 'rparen') {
        return { valid: false, error: 'Mismatched parentheses: extra closing ")".' };
      }
      return { valid: false, error: 'Invalid syntax: unexpected tokens at end of expression.' };
    }
    return {
      valid: true,
      normalized: astToString(ast),
      ast,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid mathematical syntax.',
    };
  }
}

export function validateMathExpression(
  input: string,
  allowedVars: string[] = ['x']
): ValidationResult {
  return parseMathExpression(input, allowedVars);
}

/**
 * Evaluates a parsed MathNode AST safely at the given variable bindings.
 */
export function evaluateAst(node: MathNode, scope: Record<string, number> = { x: 0 }): EvalResult {
  function evalRec(n: MathNode): number {
    switch (n.type) {
      case 'number':
        return n.value;
      case 'variable': {
        const val = scope[n.name];
        if (val === undefined) {
          throw new Error(`Undefined variable: ${n.name}`);
        }
        return val;
      }
      case 'unary': {
        const v = evalRec(n.arg);
        return n.op === '-' ? -v : v;
      }
      case 'binary': {
        const l = evalRec(n.left);
        const r = evalRec(n.right);
        switch (n.op) {
          case '+':
            return l + r;
          case '-':
            return l - r;
          case '*':
            return l * r;
          case '/': {
            if (Math.abs(r) < 1e-15) {
              const err = new Error('Division by zero');
              err.name = 'DivisionByZero';
              throw err;
            }
            return l / r;
          }
          case '^': {
            if (l === 0 && r < 0) {
              const err = new Error('Division by zero (0 raised to negative power)');
              err.name = 'DivisionByZero';
              throw err;
            }
            // Handle negative base with odd-denominator rational powers like x^(1/3) or x^(2/3)
            if (l < 0 && !Number.isInteger(r)) {
              // Check common rational denominators (3, 5, 7, 9)
              for (const denom of [3, 5, 7, 9]) {
                const num = Math.round(r * denom);
                if (Math.abs(r - num / denom) < 1e-7) {
                  const root = -Math.pow(-l, 1 / denom);
                  return Math.pow(root, num);
                }
              }
              const err = new Error('Complex result from negative base with fractional exponent');
              err.name = 'ComplexResult';
              throw err;
            }
            return Math.pow(l, r);
          }
        }
        break;
      }
      case 'call': {
        const a = evalRec(n.arg);
        switch (n.fn) {
          case 'sin':
            return Math.sin(a);
          case 'cos':
            return Math.cos(a);
          case 'tan': {
            const c = Math.cos(a);
            if (Math.abs(c) < 1e-14) {
              const err = new Error('Vertical asymptote in tan(x)');
              err.name = 'DivisionByZero';
              throw err;
            }
            return Math.tan(a);
          }
          case 'cot': {
            const s = Math.sin(a);
            if (Math.abs(s) < 1e-14) {
              const err = new Error('Vertical asymptote in cot(x)');
              err.name = 'DivisionByZero';
              throw err;
            }
            return Math.cos(a) / s;
          }
          case 'sec': {
            const c = Math.cos(a);
            if (Math.abs(c) < 1e-14) {
              const err = new Error('Vertical asymptote in sec(x)');
              err.name = 'DivisionByZero';
              throw err;
            }
            return 1 / c;
          }
          case 'csc': {
            const s = Math.sin(a);
            if (Math.abs(s) < 1e-14) {
              const err = new Error('Vertical asymptote in csc(x)');
              err.name = 'DivisionByZero';
              throw err;
            }
            return 1 / s;
          }
          case 'asin':
          case 'arcsin': {
            if (a < -1 || a > 1) {
              const err = new Error('arcsin(x) is only defined for -1 <= x <= 1');
              err.name = 'ComplexResult';
              throw err;
            }
            return Math.asin(a);
          }
          case 'acos':
          case 'arccos': {
            if (a < -1 || a > 1) {
              const err = new Error('arccos(x) is only defined for -1 <= x <= 1');
              err.name = 'ComplexResult';
              throw err;
            }
            return Math.acos(a);
          }
          case 'atan':
          case 'arctan':
            return Math.atan(a);
          case 'sinh':
            return Math.sinh(a);
          case 'cosh':
            return Math.cosh(a);
          case 'tanh':
            return Math.tanh(a);
          case 'sqrt': {
            if (a < 0) {
              const err = new Error('Square root of a negative number is not a real number');
              err.name = 'ComplexResult';
              throw err;
            }
            return Math.sqrt(a);
          }
          case 'cbrt':
            return Math.cbrt(a);
          case 'ln': {
            if (a === 0) {
              const err = new Error('ln(0) is undefined (vertical asymptote)');
              err.name = 'DivisionByZero';
              throw err;
            }
            if (a < 0) {
              const err = new Error('ln(x) is undefined for negative real numbers');
              err.name = 'ComplexResult';
              throw err;
            }
            return Math.log(a);
          }
          case 'log': {
            if (a <= 0) {
              const err = new Error('log(x) is only defined for x > 0');
              err.name = 'ComplexResult';
              throw err;
            }
            return Math.log10(a);
          }
          case 'exp':
            return Math.exp(a);
          case 'abs':
            return Math.abs(a);
          default:
            throw new Error(`Unknown function: ${n.fn}`);
        }
      }
    }
  }

  try {
    const val = evalRec(node);
    if (Number.isNaN(val)) {
      return {
        ok: false,
        value: NaN,
        reason: 'complex_or_undefined',
        message: 'Function is undefined or produces a non-real value at this point.',
      };
    }
    if (!Number.isFinite(val) || Math.abs(val) > 1e12) {
      return {
        ok: false,
        value: val,
        reason: 'overflow',
        message: 'Value grows extremely large (approaching ±∞ / vertical asymptote).',
      };
    }
    return { ok: true, value: val };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'DivisionByZero') {
        return {
          ok: false,
          value: NaN,
          reason: 'division_by_zero',
          message: err.message || 'Division by zero (undefined point).',
        };
      }
      if (err.name === 'ComplexResult') {
        return {
          ok: false,
          value: NaN,
          reason: 'complex_or_undefined',
          message: err.message || 'Result is outside the real domain at this point.',
        };
      }
    }
    return {
      ok: false,
      value: NaN,
      reason: 'syntax_error',
      message: 'Could not evaluate expression at this point.',
    };
  }
}

export function evaluateExpression(
  expr: string | MathNode,
  scope: Record<string, number> = { x: 0 }
): EvalResult {
  if (typeof expr === 'string') {
    const parsed = parseMathExpression(expr, Object.keys(scope));
    if (!parsed.valid || !parsed.ast) {
      return {
        ok: false,
        value: NaN,
        reason: 'syntax_error',
        message: parsed.error || 'Invalid syntax',
      };
    }
    return evaluateAst(parsed.ast, scope);
  }
  return evaluateAst(expr, scope);
}

/**
 * Central Finite Difference 1st Derivative:
 * f'(x) ≈ (f(x + h) - f(x - h)) / (2h)
 */
export function numericalDerivative(
  expr: string | MathNode,
  x: number,
  h = 1e-6,
  extraScope: Record<string, number> = {}
): EvalResult {
  const ast =
    typeof expr === 'string'
      ? parseMathExpression(expr, ['x', ...Object.keys(extraScope)]).ast
      : expr;
  if (!ast) {
    return { ok: false, value: NaN, reason: 'syntax_error', message: 'Invalid expression' };
  }

  const right = evaluateAst(ast, { ...extraScope, x: x + h });
  const left = evaluateAst(ast, { ...extraScope, x: x - h });

  if (!right.ok || !left.ok) {
    return {
      ok: false,
      value: NaN,
      reason: right.reason || left.reason || 'complex_or_undefined',
      message: 'Derivative is undefined at this point.',
    };
  }

  // Check if LHD and RHD disagree sharply (corner/cusp like |x| at x = 0 or jump discontinuity)
  const center = evaluateAst(ast, { ...extraScope, x });
  if (center.ok) {
    const rhd = (right.value - center.value) / h;
    const lhd = (center.value - left.value) / h;
    if (Math.abs(rhd - lhd) > 1e-2 * (1 + Math.abs(rhd) + Math.abs(lhd))) {
      return {
        ok: false,
        value: NaN,
        reason: 'complex_or_undefined',
        message: `Left-hand derivative (${lhd.toFixed(3)}) ≠ Right-hand derivative (${rhd.toFixed(3)}): sharp corner or discontinuity at x = ${x}.`,
      };
    }
  }

  const slope = (right.value - left.value) / (2 * h);
  if (!Number.isFinite(slope) || Math.abs(slope) > 1e10) {
    return {
      ok: false,
      value: NaN,
      reason: 'overflow',
      message: 'Vertical tangent or asymptote detected.',
    };
  }

  return { ok: true, value: slope };
}

/**
 * Central Finite Difference 2nd Derivative:
 * f''(x) ≈ (f(x + h) - 2f(x) + f(x - h)) / h^2
 */
export function numericalSecondDerivative(
  expr: string | MathNode,
  x: number,
  h = 1e-4
): EvalResult {
  const ast = typeof expr === 'string' ? parseMathExpression(expr, ['x']).ast : expr;
  if (!ast) {
    return { ok: false, value: NaN, reason: 'syntax_error', message: 'Invalid expression' };
  }

  const right = evaluateAst(ast, { x: x + h });
  const center = evaluateAst(ast, { x });
  const left = evaluateAst(ast, { x: x - h });

  if (!right.ok || !center.ok || !left.ok) {
    return { ok: false, value: NaN, reason: 'complex_or_undefined' };
  }

  const val = (right.value - 2 * center.value + left.value) / (h * h);
  if (!Number.isFinite(val) || Math.abs(val) > 1e9) {
    return { ok: false, value: NaN, reason: 'overflow' };
  }
  return { ok: true, value: val };
}

/**
 * Multivariable Partial Derivative via Central Finite Differences:
 * ∂f/∂v ≈ (f(..., v+h, ...) - f(..., v-h, ...)) / (2h)
 */
export function numericalPartialDerivative(
  expr: string,
  variable: string,
  point: Record<string, number>,
  h = 1e-6
): number {
  const vars = Object.keys(point);
  const parsed = parseMathExpression(expr, vars);
  if (!parsed.valid || !parsed.ast) {
    return NaN;
  }

  const plusScope = { ...point, [variable]: point[variable] + h };
  const minusScope = { ...point, [variable]: point[variable] - h };

  const fPlus = evaluateAst(parsed.ast, plusScope);
  const fMinus = evaluateAst(parsed.ast, minusScope);

  if (!fPlus.ok || !fMinus.ok) return NaN;
  return (fPlus.value - fMinus.value) / (2 * h);
}

/**
 * Checks if two algebraic expressions are mathematically equivalent by evaluating
 * them across 25 diverse test points in the domain.
 * Handles equivalent forms like `2x+2` and `2(x+1)`, `(x-1)/(sqrt(x)-1)` and `sqrt(x)+1`, etc.
 */
export function checkExpressionEquivalence(
  userInput: string,
  expectedExpr: string,
  variables: string[] = ['x'],
  tolerance = 1e-4
): { equivalent: boolean; error?: string } {
  const userParsed = parseMathExpression(userInput, variables);
  if (!userParsed.valid || !userParsed.ast) {
    return { equivalent: false, error: userParsed.error || 'Invalid mathematical expression.' };
  }

  const expectedParsed = parseMathExpression(expectedExpr, variables);
  if (!expectedParsed.valid || !expectedParsed.ast) {
    return { equivalent: false, error: 'Invalid target expression.' };
  }

  // Deterministic + irrational test seeds avoiding common singularities (0, 1, -1, 2)
  const testCoords = [
    -3.71, -2.83, -2.19, -1.64, -1.27, -0.83, -0.47, -0.23, 0.19, 0.41, 0.67, 0.89, 1.17, 1.43,
    1.79, 2.13, 2.47, 2.89, 3.19, 3.53, 3.91, 4.27, 4.63, 5.11, 5.49,
  ];

  let validComparisons = 0;

  for (let i = 0; i < testCoords.length; i++) {
    const scope: Record<string, number> = {};
    for (let vIdx = 0; vIdx < variables.length; vIdx++) {
      const varName = variables[vIdx];
      scope[varName] = testCoords[(i + vIdx * 5) % testCoords.length];
    }

    const expRes = evaluateAst(expectedParsed.ast, scope);
    if (!expRes.ok || Math.abs(expRes.value) > 1e7) {
      continue;
    }

    const usrRes = evaluateAst(userParsed.ast, scope);
    if (!usrRes.ok) {
      return { equivalent: false };
    }

    const diff = Math.abs(usrRes.value - expRes.value);
    const scale = Math.max(1, Math.abs(expRes.value));
    if (diff / scale > tolerance) {
      return { equivalent: false };
    }
    validComparisons++;
  }

  return { equivalent: validComparisons >= 5 };
}

/**
 * Formats an AST node back into a clean algebraic string.
 */
export function astToString(node: MathNode): string {
  switch (node.type) {
    case 'number': {
      if (Math.abs(node.value - Math.PI) < 1e-12) return 'pi';
      if (Math.abs(node.value - Math.E) < 1e-12) return 'e';
      return Number(node.value.toFixed(6)).toString();
    }
    case 'variable':
      return node.name;
    case 'unary': {
      const inner = astToString(node.arg);
      if (node.arg.type === 'binary' && (node.arg.op === '+' || node.arg.op === '-')) {
        return `-(${inner})`;
      }
      return `-${inner}`;
    }
    case 'binary': {
      const l = astToString(node.left);
      const r = astToString(node.right);
      const wrapLeft =
        node.op !== '+' &&
        node.op !== '-' &&
        node.left.type === 'binary' &&
        (node.left.op === '+' || node.left.op === '-');
      const wrapRight =
        (node.op !== '+' &&
          node.right.type === 'binary' &&
          (node.right.op === '+' || node.right.op === '-')) ||
        (node.op === '/' && node.right.type === 'binary') ||
        (node.op === '^' && (node.right.type === 'binary' || node.right.type === 'unary'));
      const lStr = wrapLeft ? `(${l})` : l;
      const rStr = wrapRight ? `(${r})` : r;
      if (node.op === '+' || node.op === '-') {
        return `${lStr} ${node.op} ${rStr}`;
      }
      return `${lStr}${node.op}${rStr}`;
    }
    case 'call':
      return `${node.fn}(${astToString(node.arg)})`;
  }
}

/**
 * Converts a MathNode AST into textbook LaTeX notation.
 */
export function astToLatex(node: MathNode): string {
  switch (node.type) {
    case 'number': {
      if (Math.abs(node.value - Math.PI) < 1e-12) return '\\pi';
      if (Math.abs(node.value - Math.E) < 1e-12) return 'e';
      return Number(node.value.toFixed(4)).toString();
    }
    case 'variable':
      return node.name;
    case 'unary': {
      const inner = astToLatex(node.arg);
      if (node.arg.type === 'binary' && (node.arg.op === '+' || node.arg.op === '-')) {
        return `-\\left(${inner}\\right)`;
      }
      return `-${inner}`;
    }
    case 'binary': {
      if (node.op === '/') {
        return `\\frac{${astToLatex(node.left)}}{${astToLatex(node.right)}}`;
      }
      if (node.op === '^') {
        const baseNeedParens =
          node.left.type === 'binary' || node.left.type === 'unary' || node.left.type === 'call';
        const b = baseNeedParens
          ? `\\left(${astToLatex(node.left)}\\right)`
          : astToLatex(node.left);
        return `${b}^{${astToLatex(node.right)}}`;
      }
      if (node.op === '*') {
        const wrapL = node.left.type === 'binary' && (node.left.op === '+' || node.left.op === '-');
        const wrapR =
          node.right.type === 'binary' && (node.right.op === '+' || node.right.op === '-');
        const l = wrapL ? `\\left(${astToLatex(node.left)}\\right)` : astToLatex(node.left);
        const r = wrapR ? `\\left(${astToLatex(node.right)}\\right)` : astToLatex(node.right);
        if (
          node.left.type === 'number' &&
          (node.right.type === 'variable' ||
            node.right.type === 'call' ||
            node.right.type === 'binary')
        ) {
          return `${l}${r}`;
        }
        return `${l} \\cdot ${r}`;
      }
      const l = astToLatex(node.left);
      const r =
        node.op === '-' &&
        node.right.type === 'binary' &&
        (node.right.op === '+' || node.right.op === '-')
          ? `\\left(${astToLatex(node.right)}\\right)`
          : astToLatex(node.right);
      return `${l} ${node.op} ${r}`;
    }
    case 'call': {
      const argTex = astToLatex(node.arg);
      if (node.fn === 'sqrt') return `\\sqrt{${argTex}}`;
      if (node.fn === 'cbrt') return `\\sqrt[3]{${argTex}}`;
      if (node.fn === 'abs') return `\\left|${argTex}\\right|`;
      if (node.fn === 'exp') return `e^{${argTex}}`;
      return `\\${node.fn}\\left(${argTex}\\right)`;
    }
  }
}

/**
 * Algebraic AST Simplifier for clean symbolic derivatives.
 */
export function simplifyAst(node: MathNode): MathNode {
  switch (node.type) {
    case 'number':
    case 'variable':
      return node;
    case 'unary': {
      const arg = simplifyAst(node.arg);
      if (arg.type === 'number') {
        return { type: 'number', value: node.op === '-' ? -arg.value : arg.value };
      }
      if (node.op === '-' && arg.type === 'unary' && arg.op === '-') {
        return arg.arg;
      }
      return { type: 'unary', op: node.op, arg };
    }
    case 'call':
      return { type: 'call', fn: node.fn, arg: simplifyAst(node.arg) };
    case 'binary': {
      const l = simplifyAst(node.left);
      const r = simplifyAst(node.right);

      if (l.type === 'number' && r.type === 'number') {
        if (node.op === '+') return { type: 'number', value: l.value + r.value };
        if (node.op === '-') return { type: 'number', value: l.value - r.value };
        if (node.op === '*') return { type: 'number', value: l.value * r.value };
        if (node.op === '^') return { type: 'number', value: Math.pow(l.value, r.value) };
      }

      if (node.op === '+') {
        if (l.type === 'number' && l.value === 0) return r;
        if (r.type === 'number' && r.value === 0) return l;
        if (r.type === 'unary' && r.op === '-') {
          return simplifyAst({ type: 'binary', op: '-', left: l, right: r.arg });
        }
      }

      if (node.op === '-') {
        if (r.type === 'number' && r.value === 0) return l;
        if (l.type === 'number' && l.value === 0)
          return simplifyAst({ type: 'unary', op: '-', arg: r });
      }

      if (node.op === '*') {
        if ((l.type === 'number' && l.value === 0) || (r.type === 'number' && r.value === 0)) {
          return { type: 'number', value: 0 };
        }
        if (l.type === 'number' && l.value === 1) return r;
        if (r.type === 'number' && r.value === 1) return l;
        if (l.type === 'number' && l.value === -1) {
          return simplifyAst({ type: 'unary', op: '-', arg: r });
        }
        if (r.type === 'number' && r.value === -1) {
          return simplifyAst({ type: 'unary', op: '-', arg: l });
        }
        // Combine c1 * (c2 * u) -> (c1*c2) * u
        if (
          l.type === 'number' &&
          r.type === 'binary' &&
          r.op === '*' &&
          r.left.type === 'number'
        ) {
          return simplifyAst({
            type: 'binary',
            op: '*',
            left: { type: 'number', value: l.value * r.left.value },
            right: r.right,
          });
        }
        // Put number on the left: u * c -> c * u
        if (r.type === 'number' && l.type !== 'number') {
          return simplifyAst({ type: 'binary', op: '*', left: r, right: l });
        }
      }

      if (node.op === '/') {
        if (l.type === 'number' && l.value === 0) return { type: 'number', value: 0 };
        if (r.type === 'number' && r.value === 1) return l;
      }

      if (node.op === '^') {
        if (r.type === 'number' && r.value === 0) return { type: 'number', value: 1 };
        if (r.type === 'number' && r.value === 1) return l;
        if (l.type === 'number' && l.value === 0) return { type: 'number', value: 0 };
        if (l.type === 'number' && l.value === 1) return { type: 'number', value: 1 };
      }

      return { type: 'binary', op: node.op, left: l, right: r };
    }
  }
}

function containsVar(node: MathNode, v = 'x'): boolean {
  switch (node.type) {
    case 'number':
      return false;
    case 'variable':
      return node.name === v;
    case 'unary':
      return containsVar(node.arg, v);
    case 'call':
      return containsVar(node.arg, v);
    case 'binary':
      return containsVar(node.left, v) || containsVar(node.right, v);
  }
}

/**
 * Symbolic Step-by-Step Derivative Solver with Rule Classification and Justifications.
 */
export function solveDerivativeStepByStep(
  inputExpr: string,
  variable = 'x'
): StepByStepDerivativeResult {
  const parsed = parseMathExpression(inputExpr, [variable]);
  if (!parsed.valid || !parsed.ast) {
    return {
      valid: false,
      error: parsed.error || 'Invalid mathematical expression.',
      originalLatex: '',
      derivativeLatex: '',
      derivativeExpr: '',
      steps: [],
    };
  }

  const steps: DerivativeStep[] = [];

  function diff(node: MathNode): MathNode {
    if (!containsVar(node, variable)) {
      const res: MathNode = { type: 'number', value: 0 };
      steps.push({
        stepNumber: steps.length + 1,
        rule: 'Constant Rule',
        targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
        resultLatex: '0',
        reason: `The derivative of any constant term ${astToLatex(node)} with respect to ${variable} is 0.`,
      });
      return res;
    }

    switch (node.type) {
      case 'number':
        return { type: 'number', value: 0 };

      case 'variable': {
        const res: MathNode = { type: 'number', value: 1 };
        steps.push({
          stepNumber: steps.length + 1,
          rule: 'Identity / Power Rule',
          targetLatex: `\\frac{d}{d${variable}}[${variable}]`,
          resultLatex: '1',
          reason: `The derivative of ${variable} with respect to ${variable} is 1.`,
        });
        return res;
      }

      case 'unary': {
        const dArg = simplifyAst(diff(node.arg));
        return simplifyAst({ type: 'unary', op: node.op, arg: dArg });
      }

      case 'binary': {
        if (node.op === '+' || node.op === '-') {
          const targetTex = `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`;
          const dl = simplifyAst(diff(node.left));
          const dr = simplifyAst(diff(node.right));
          const res = simplifyAst({ type: 'binary', op: node.op, left: dl, right: dr });
          steps.push({
            stepNumber: steps.length + 1,
            rule: 'Sum / Difference Rule',
            targetLatex: targetTex,
            resultLatex: astToLatex(res),
            reason: `Differentiate each term separately: d/d${variable}[u ${node.op} v] = u' ${node.op} v'.`,
          });
          return res;
        }

        if (node.op === '*') {
          // Constant Multiple Rule check
          if (!containsVar(node.left, variable)) {
            const c = node.left;
            const du = simplifyAst(diff(node.right));
            const res = simplifyAst({ type: 'binary', op: '*', left: c, right: du });
            steps.push({
              stepNumber: steps.length + 1,
              rule: 'Constant Multiple Rule',
              targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
              resultLatex: astToLatex(res),
              reason: `Factor out constant ${astToLatex(c)}: d/d${variable}[c · u] = c · u'.`,
            });
            return res;
          }
          if (!containsVar(node.right, variable)) {
            const c = node.right;
            const du = simplifyAst(diff(node.left));
            const res = simplifyAst({ type: 'binary', op: '*', left: c, right: du });
            steps.push({
              stepNumber: steps.length + 1,
              rule: 'Constant Multiple Rule',
              targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
              resultLatex: astToLatex(res),
              reason: `Factor out constant ${astToLatex(c)}: d/d${variable}[u · c] = c · u'.`,
            });
            return res;
          }

          // Product Rule: d/dx[u*v] = u'*v + u*v'
          const u = node.left;
          const v = node.right;
          const du = simplifyAst(diff(u));
          const dv = simplifyAst(diff(v));
          const term1 = simplifyAst({ type: 'binary', op: '*', left: du, right: v });
          const term2 = simplifyAst({ type: 'binary', op: '*', left: u, right: dv });
          const res = simplifyAst({ type: 'binary', op: '+', left: term1, right: term2 });
          steps.push({
            stepNumber: steps.length + 1,
            rule: 'Product Rule',
            targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
            resultLatex: astToLatex(res),
            reason: `Apply Product Rule d/d${variable}[u · v] = u'v + uv' with u = ${astToLatex(u)} and v = ${astToLatex(v)}.`,
          });
          return res;
        }

        if (node.op === '/') {
          // Check if denominator is constant: u / c
          if (!containsVar(node.right, variable)) {
            const du = simplifyAst(diff(node.left));
            const res = simplifyAst({ type: 'binary', op: '/', left: du, right: node.right });
            steps.push({
              stepNumber: steps.length + 1,
              rule: 'Constant Multiple Rule',
              targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
              resultLatex: astToLatex(res),
              reason: `Since denominator ${astToLatex(node.right)} is constant, differentiate the numerator directly.`,
            });
            return res;
          }

          // Quotient Rule: (u'v - uv') / v^2
          const u = node.left;
          const v = node.right;
          const du = simplifyAst(diff(u));
          const dv = simplifyAst(diff(v));
          const num1 = simplifyAst({ type: 'binary', op: '*', left: du, right: v });
          const num2 = simplifyAst({ type: 'binary', op: '*', left: u, right: dv });
          const num = simplifyAst({ type: 'binary', op: '-', left: num1, right: num2 });
          const den = simplifyAst({
            type: 'binary',
            op: '^',
            left: v,
            right: { type: 'number', value: 2 },
          });
          const res = simplifyAst({ type: 'binary', op: '/', left: num, right: den });
          steps.push({
            stepNumber: steps.length + 1,
            rule: 'Quotient Rule',
            targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
            resultLatex: astToLatex(res),
            reason: `Apply Quotient Rule d/d${variable}[u/v] = (u'v - uv') / v² with u = ${astToLatex(u)} and v = ${astToLatex(v)}.`,
          });
          return res;
        }

        if (node.op === '^') {
          const base = node.left;
          const exp = node.right;

          // Case 1: Power Rule u(x)^n where exponent n is constant
          if (!containsVar(exp, variable)) {
            const nMinus1 = simplifyAst({
              type: 'binary',
              op: '-',
              left: exp,
              right: { type: 'number', value: 1 },
            });
            const outerDeriv = simplifyAst({
              type: 'binary',
              op: '*',
              left: exp,
              right: { type: 'binary', op: '^', left: base, right: nMinus1 },
            });

            if (base.type === 'variable' && base.name === variable) {
              steps.push({
                stepNumber: steps.length + 1,
                rule: 'Power Rule',
                targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
                resultLatex: astToLatex(outerDeriv),
                reason: `Apply Power Rule d/d${variable}[${variable}^n] = n·${variable}^(n-1) with n = ${astToLatex(exp)}.`,
              });
              return outerDeriv;
            }

            // Generalized Power + Chain Rule: n * u^(n-1) * u'
            const innerDeriv = simplifyAst(diff(base));
            const res = simplifyAst({
              type: 'binary',
              op: '*',
              left: outerDeriv,
              right: innerDeriv,
            });
            steps.push({
              stepNumber: steps.length + 1,
              rule: 'Chain Rule + Power Rule',
              targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
              resultLatex: astToLatex(res),
              reason: `Apply Power Rule to outer power ${astToLatex(exp)} and multiply by inner derivative d/d${variable}[${astToLatex(base)}] = ${astToLatex(innerDeriv)}.`,
            });
            return res;
          }

          // Case 2: Exponential Rule a^u(x) where base a is constant
          if (!containsVar(base, variable)) {
            const du = simplifyAst(diff(exp));
            const isBaseE = base.type === 'number' && Math.abs(base.value - Math.E) < 1e-10;
            const factor = isBaseE
              ? node
              : ({
                  type: 'binary',
                  op: '*',
                  left: node,
                  right: { type: 'call', fn: 'ln', arg: base },
                } as MathNode);
            const res = simplifyAst({ type: 'binary', op: '*', left: factor, right: du });
            steps.push({
              stepNumber: steps.length + 1,
              rule: exp.type === 'variable' ? 'Exponential Rule' : 'Chain Rule + Exponential Rule',
              targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
              resultLatex: astToLatex(res),
              reason: `Differentiate exponential function and multiply by exponent derivative ${astToLatex(du)}.`,
            });
            return res;
          }
        }
        break;
      }

      case 'call': {
        const u = node.arg;
        const isSimpleVar = u.type === 'variable' && u.name === variable;
        const du = isSimpleVar ? ({ type: 'number', value: 1 } as MathNode) : simplifyAst(diff(u));

        let outer: MathNode;
        let baseRuleName = 'Trigonometric / Transcendental Rule';

        switch (node.fn) {
          case 'sin':
            outer = { type: 'call', fn: 'cos', arg: u };
            baseRuleName = 'Trigonometric Rule (sin)';
            break;
          case 'cos':
            outer = { type: 'unary', op: '-', arg: { type: 'call', fn: 'sin', arg: u } };
            baseRuleName = 'Trigonometric Rule (cos)';
            break;
          case 'tan':
            outer = {
              type: 'binary',
              op: '^',
              left: { type: 'call', fn: 'sec', arg: u },
              right: { type: 'number', value: 2 },
            };
            baseRuleName = 'Trigonometric Rule (tan)';
            break;
          case 'cot':
            outer = {
              type: 'unary',
              op: '-',
              arg: {
                type: 'binary',
                op: '^',
                left: { type: 'call', fn: 'csc', arg: u },
                right: { type: 'number', value: 2 },
              },
            };
            baseRuleName = 'Trigonometric Rule (cot)';
            break;
          case 'sec':
            outer = {
              type: 'binary',
              op: '*',
              left: { type: 'call', fn: 'sec', arg: u },
              right: { type: 'call', fn: 'tan', arg: u },
            };
            baseRuleName = 'Trigonometric Rule (sec)';
            break;
          case 'csc':
            outer = {
              type: 'unary',
              op: '-',
              arg: {
                type: 'binary',
                op: '*',
                left: { type: 'call', fn: 'csc', arg: u },
                right: { type: 'call', fn: 'cot', arg: u },
              },
            };
            baseRuleName = 'Trigonometric Rule (csc)';
            break;
          case 'sqrt':
            outer = {
              type: 'binary',
              op: '/',
              left: { type: 'number', value: 1 },
              right: {
                type: 'binary',
                op: '*',
                left: { type: 'number', value: 2 },
                right: { type: 'call', fn: 'sqrt', arg: u },
              },
            };
            baseRuleName = 'Power / Radical Rule (√u)';
            break;
          case 'ln':
            outer = {
              type: 'binary',
              op: '/',
              left: { type: 'number', value: 1 },
              right: u,
            };
            baseRuleName = 'Logarithmic Rule (ln)';
            break;
          case 'exp':
            outer = { type: 'call', fn: 'exp', arg: u };
            baseRuleName = 'Exponential Rule (e^u)';
            break;
          case 'atan':
          case 'arctan':
            outer = {
              type: 'binary',
              op: '/',
              left: { type: 'number', value: 1 },
              right: {
                type: 'binary',
                op: '+',
                left: { type: 'number', value: 1 },
                right: {
                  type: 'binary',
                  op: '^',
                  left: u,
                  right: { type: 'number', value: 2 },
                },
              },
            };
            baseRuleName = 'Inverse Trig Rule (arctan)';
            break;
          case 'asin':
          case 'arcsin':
            outer = {
              type: 'binary',
              op: '/',
              left: { type: 'number', value: 1 },
              right: {
                type: 'call',
                fn: 'sqrt',
                arg: {
                  type: 'binary',
                  op: '-',
                  left: { type: 'number', value: 1 },
                  right: {
                    type: 'binary',
                    op: '^',
                    left: u,
                    right: { type: 'number', value: 2 },
                  },
                },
              },
            };
            baseRuleName = 'Inverse Trig Rule (arcsin)';
            break;
          default:
            outer = { type: 'number', value: 1 };
        }

        const res = simplifyAst({ type: 'binary', op: '*', left: outer, right: du });
        steps.push({
          stepNumber: steps.length + 1,
          rule: isSimpleVar ? baseRuleName : `Chain Rule + ${baseRuleName}`,
          targetLatex: `\\frac{d}{d${variable}}\\left[${astToLatex(node)}\\right]`,
          resultLatex: astToLatex(res),
          reason: isSimpleVar
            ? `Apply standard derivative formula for ${node.fn}(${variable}).`
            : `Apply Chain Rule d/d${variable}[${node.fn}(u)] = ${astToLatex(outer)} · u' where u = ${astToLatex(u)} and u' = ${astToLatex(du)}.`,
        });
        return res;
      }
    }

    return { type: 'number', value: 0 };
  }

  const finalAst = simplifyAst(diff(parsed.ast));

  return {
    valid: true,
    originalLatex: astToLatex(parsed.ast),
    derivativeLatex: astToLatex(finalAst),
    derivativeExpr: astToString(finalAst),
    steps,
  };
}
