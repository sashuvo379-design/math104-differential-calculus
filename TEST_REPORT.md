# TEST_REPORT.md — MATH 104: Differential Calculus Platform

**Date:** 2026-11-11  
**Project:** `math104-differential-calculus` (`E:\MATH104 Differential Calculus\Self Learning\Differential Calculus`)  
**Status:** **ALL CHECKS PASSED (ZERO ERRORS, ZERO WARNINGS)**

---

## 1. Summary of Quality & Verification Gates

| Quality Gate | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Programmatic Math & Unit Tests** | `npm.cmd test` | **PASS (15/15)** | 2 suites, 15 test cases, 0 failures (`1331.8 ms`) |
| **TypeScript Strict Mode** | `npm.cmd run typecheck` | **PASS** | `tsc --noEmit` (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) — 0 errors |
| **ESLint Static Analysis** | `npm.cmd run lint` | **PASS** | `eslint "src/**/*.{ts,tsx}" --max-warnings 0` — 0 errors, 0 warnings |
| **Prettier Code Formatting** | `npm.cmd run format:check` | **PASS** | All 30 `src/**/*.{ts,tsx,css}` files conform to Prettier rules |
| **Production Build** | `npm.cmd run build` | **PASS** | Tailwind CSS + esbuild production bundle emitted to `./dist` |
| **Headless Chrome E2E & Visual Audit** | `verify_e2e_and_screenshots.mjs` | **PASS (12/12 routes)** | 0 console errors, 0 console warnings, 0 uncaught exceptions, 0 layout overflows at Desktop (`1280×900`) and Mobile (`375×812`) |

---

## 2. Programmatic Mathematical Verification Suite (`src/__tests__/mathVerification.test.ts`)

Every stored answer key, formula, worked example derivative, limit, and optimization critical point was verified programmatically against **central finite-difference numerical differentiation** ($O(h^2)$ / $O(h^4)$ approximations in `src/utils/mathEngine.ts`):

1. **Master Quiz Bank Answer Keys (`MASTER_QUIZ_BANK`)**:
   - Verified every question's stored symbolic derivative $f'(x)$ or partial derivative against `numericalDerivative(f, x)` / `numericalPartialDerivative(f, vars, varName)` across multiple domain test points (`tolerance = 1e-4`).
2. **Phase 1–4 Worked Examples & Self-Assessment Answer Keys**:
   - **Phase 1**: Difference quotient of $2x^2 - 3x \implies 4x - 3$; radical domain & derivative of $2 + \sqrt{x-1} \implies \frac{1}{2\sqrt{x-1}}$; rational function $\frac{x+1}{x-1} \implies -\frac{2}{(x-1)^2}$; piecewise continuity system $a+b=2, 9a+3b=8 \implies a=\frac{1}{3}, b=\frac{5}{3}$; $|x|$ corner at $x=0$ ($L'_-(0)=-1 \neq L'_+(0)=+1$).
   - **Phase 2**: Tangent line to $y = 2/x$ at $(2,1)$ ($m = -1/2$); implicit Folium of Descartes $x^3 + y^3 - 9xy = 0$ at $(2,4)$ ($dy/dx = 4/5$); conical tank related rates ($dh/dt = \frac{1}{9\pi}\text{ ft/min}$); open-top box optimization $V(x) = x(12-2x)^2$ ($V'(2) = 0, V''(2) = -48 < 0, V_{\max} = 128\text{ in}^3$).
   - **Phase 3**: Total differential of $f(x,y) = x^2 + 3xy - y^2$ at $(2,3)$ with $dx=0.05, dy=-0.04$ ($dz = 0.65, \Delta z = 0.6449$); sphere volume error propagation ($dV/V = 3\,dr/r = \pm 3\%$); cylindrical can error propagation ($|\Delta V| \approx 15\pi \approx 47.12\text{ cm}^3$).
   - **Phase 4**: Multivariable Chain Rule $dw/dt$ for $w=xy+z, x=\cos t, y=\sin t, z=t$ at $t=0$ ($dw/dt = 2$); implicit partials $\partial z/\partial x = -\frac{3x^2+z}{3z^2+x}$ for $x^3+y^3+z^3+xyz-4=0$; cone rates $dV/dt = 520\pi\text{ in}^3/\text{s}$; $z = x^2y + 3xy^4$ with $x=\sin(2t), y=\cos t$ at $t=0$ ($dz/dt = 6$).
   - **Lecture 15 Slide Examples 3–7**: Verified critical points and Hessian discriminants $D = f_{xx}f_{yy} - (f_{xy})^2$ for all 5 multivariable optimization examples.
3. **Multi-Point Numerical Equivalence Checker (`checkExpressionEquivalence`)**:
   - Verified that equivalent algebraic forms such as `2x + 2` and `2*(x + 1)`, or `cos(x) - x*sin(x)` and `-x*sin(x) + cos(x)`, evaluate identically across 12 pseudo-random test points and are accepted by the quiz engine.
4. **Input Validation & Edge-Case Sanitization**:
   - Verified that empty strings, unbalanced parentheses, unknown functions, division by zero (`1/0`), complex outputs (`sqrt(-4)`), and out-of-domain inputs return structured error messages without throwing uncaught exceptions.
5. **Discontinuity & Asymptote Splitting (`src/utils/plotter.ts`)**:
   - Verified that `generateCurveSegments('1/(x - 2)', [-5, 5], [-10, 10])` and jump discontinuities (`abs(x)/x`) split into disconnected curve segments with zero false connecting lines across vertical asymptotes.

---

## 3. Component, Route & Content Fidelity Suite (`src/__tests__/app.test.tsx`)

1. **Home Page (`/`)**: Verified course overview, "Continue Where You Left Off" resume card, and overall progress bar.
2. **Master Overview Portal (`/overview`)**: Verified all 5 DU Modules, Lecture 15 Slide Examples 3–7, and DU 5-Slot Final Exam Blueprint.
3. **Lesson Pages (`/lesson/phase-1` to `/lesson/phase-4`)**: Verified 100% of original units, intuitive real-life hooks, mathematical engine definitions, exam traps, worked ISRT examples, and self-assessment cards.
4. **Interactive Lab (`/lab`), Practice (`/practice`), Quiz (`/quiz`), Formulas (`/formulas`), Progress (`/progress`), and Custom 404 (`/unknown-route`)**: Verified full rendering and ErrorBoundary wrapping.
5. **Safe Storage Service (`src/utils/storage.ts`)**: Verified `try/catch` wrapper and in-memory fallback when `window.localStorage` is unavailable or restricted.

---

## 4. Browser End-to-End & Responsive Viewport Verification

All 12 routes were rendered in Headless Google Chrome at **Desktop (`1280×900`)** and **Mobile (`375×812`)** viewports against the production `dist` server (`http://127.0.0.1:4173`):

| Route | Desktop Screenshot | Mobile Screenshot | Desktop Overflow | Mobile Overflow | Console Errors/Warnings |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `desktop_home.png` | `mobile_home.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/overview` | `desktop_overview_portal.png` | `mobile_overview_portal.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/lesson/phase-1` | `desktop_lesson_phase1.png` | `mobile_lesson_phase1.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/lesson/phase-2` | `desktop_lesson_phase2.png` | `mobile_lesson_phase2.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/lesson/phase-3` | `desktop_lesson_phase3.png` | `mobile_lesson_phase3.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/lesson/phase-4` | `desktop_lesson_phase4.png` | `mobile_lesson_phase4.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/lab` | `desktop_interactive_lab.png` | `mobile_interactive_lab.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/practice` | `desktop_practice.png` | `mobile_practice.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/quiz` | `desktop_quiz.png` | `mobile_quiz.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/formulas` | `desktop_formulas.png` | `mobile_formulas.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/progress` | `desktop_progress.png` | `mobile_progress.png` | `false` (`1265px`) | `false` (`375px`) | `0` |
| `/not-found-404-test` | `desktop_not_found_404.png` | `mobile_not_found_404.png` | `false` (`1265px`) | `false` (`375px`) | `0` |

---

## 5. Known Limitations

1. **Symbolic Step-by-Step Solver Scope**: The rule-by-rule symbolic differentiator (`solveDerivativeStepByStep` in `src/utils/mathEngine.ts`) decomposes single-variable algebraic, trigonometric, exponential, and logarithmic expressions using Power, Constant Multiple, Sum/Difference, Product, Quotient, and Chain rules. For deeply nested non-elementary functions, the solver provides exact numerical finite-difference verification alongside the outermost structural rule breakdown.
2. **Client-Side Storage**: Student progress is stored locally in `localStorage` (with an automatic in-memory fallback when browser privacy settings block storage) since no backend is required.
