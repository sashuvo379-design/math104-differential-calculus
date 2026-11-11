# MATH 104: Differential Calculus — Interactive Learning Platform

A production-quality, zero-error interactive learning website for **MATH 104: Differential Calculus** (University of Dhaka CSE Blueprint & 4-Phase Mastery Curriculum). Built with React 18, TypeScript (strict mode), Tailwind CSS, KaTeX, SVG Asymptote-Safe Function Plotter, and a deterministic mathematical engine with automated finite-difference verification.

- **Live GitHub Pages URL**: [https://sashuvo379-design.github.io/math104-differential-calculus/](https://sashuvo379-design.github.io/math104-differential-calculus/)
- **GitHub Repository**: [https://github.com/sashuvo379-design/math104-differential-calculus](https://github.com/sashuvo379-design/math104-differential-calculus)
- **Author & Developer**: **Saad, IASDS-32** (Institute of Statistical Research and Training — ISRT, University of Dhaka)

---

## Features & Curriculum Coverage

### 1. 100% Content Fidelity & Preservation
All five original HTML curriculum files in `/lessons` are preserved verbatim in structure, sequence, explanations, formulas, worked examples, and self-assessments:
- **Master Overview Portal (`/overview`)**: Full Course Overview covering all 5 DU Modules, verbatim **Lecture 15 Slide Examples 1–7** (3D domain analysis, curves of constant elevation, multivariable limits along paths, second-order partials, and constrained/unconstrained extrema with Hessian discriminants), and the **DU 5-Slot Final Exam Blueprint** (Slots 1–5 with interactive reveal steps).
- **Phase 01 (`/lesson/phase-1`)**: *Foundations of Change — Functions, Limits & Continuity* (Units 1.1–1.3: Piecewise & Absolute Value Functions, Existence of Limits & One-Sided Limits, Continuity & Discontinuity Types).
- **Phase 02 (`/lesson/phase-2`)**: *Single-Variable Differentiation & Exam Applications* (Units 2.1–2.4: Limit Definition & Differentiability vs. Continuity, Advanced Differentiation Toolkit & Implicit Curves, Tangents/Normals/Extrema/Concavity, Related Rates & Applied Optimization).
- **Phase 03 (`/lesson/phase-3`)**: *Functions of Several Variables & Partial Differentiation* (Units 3.1–3.2: Domain/Range/Level Curves & Multivariable Limits, First & Higher-Order Partial Derivatives & Clairaut's Theorem).
- **Phase 04 (`/lesson/phase-4`)**: *Advanced Partial Derivatives & Multivariable Optimization* (Units 4.1–4.3: Total Differentials & Linear Approximation, Multivariable Chain Rule & Implicit Partial Differentiation, Critical Points & Saddle Points & The Hessian Discriminant).

### 2. Interactive Calculus Tools (`/lab` & Embedded in Lessons)
1. **Derivative Explorer**: Type any $f(x)$ with live input validation; view $f(x)$, $f'(x)$, draggable point $x_0$, live tangent line, and exact numerical derivative.
2. **Limit Visualizer**: Approach $x \to a$ from the left ($a - \delta$) and right ($a + \delta$) with a synchronized dual-direction numerical table and two-sided existence detector.
3. **Secant-to-Tangent Animation**: Animate $\Delta x = h \to 0$ (including play/pause animation and sign reversal) watching the secant chord converge to the tangent line.
4. **Step-by-Step Derivative Solver**: Displays each differentiation rule applied (Power, Constant Multiple, Sum/Difference, Product, Quotient, Chain, Exponential/Log/Trig) with mathematical reasons and automatic numerical finite-difference verification.
5. **Optimization & Curve-Sketching Tool**: Automatically locates critical points ($f'(x)=0$), inflection points ($f''(x)=0$), and monotony/concavity intervals.
6. **3D Hessian Discriminant Explorer**: Interactive contour & critical-point analyzer for Lecture 15 Slide Examples 5–7 ($D = f_{xx}f_{yy} - (f_{xy})^2$).

### 3. Practice, Quizzes, Formula Sheet & Progress Tracking
- **Worked Examples & Practice (`/practice`)**: Interactive "Show Hint", "Show Next Step", and "Show Full Solution" progressive disclosure cards across all phases.
- **Verified Quiz Engine (`/quiz`)**: Multiple-choice and free-response typed math questions. Typed symbolic expressions are verified via **multi-point random numerical equivalence testing** so algebraically equivalent answers (e.g., `2x + 2` and `2*(x + 1)`, or `cos(x) - x*sin(x)` and `-x*sin(x) + cos(x)`) are both accepted.
- **Formula Cheat-Sheet (`/formulas`)**: Filterable KaTeX reference sheet covering Limits, Derivatives, Applications, Multivariable Calculus, and the DU Exam Blueprint.
- **Progress Dashboard (`/progress`)**: Tracks completed lessons, quiz score history, active study streaks, and personalized weak-topic recommendations stored safely in `localStorage` with `try/catch` and in-memory fallback.

---

## Architecture & Technical Choices

### Why Custom SVG Asymptote-Safe Plotter + Deterministic Math Engine?
Instead of relying on heavy external charting bundles that draw false connecting lines across vertical asymptotes, [`src/utils/plotter.ts`](./src/utils/plotter.ts) implements adaptive sampling with slope/jump discontinuity detection (`splitAtDiscontinuities`), cleanly breaking SVG paths across vertical asymptotes (such as $1/(x-2)$ or $\tan(x)$) and jump discontinuities (such as $|x|/x$). It pairs with [`src/utils/mathEngine.ts`](./src/utils/mathEngine.ts) for safe recursive-descent parsing, AST evaluation, central finite-difference derivatives ($O(h^4)$ / central difference), symbolic rule-by-rule differentiation, and 12-point numerical equivalence checking.

---

## Setup, Development, Testing & Production Build

### Prerequisites
- **Node.js**: v18+ (tested with Node v22)

### 1. Run Unit & Programmatic Math Verification Tests
Every stored quiz answer key, worked example derivative, limit, and optimization critical point is verified programmatically against numerical differentiation:
```bash
npm.cmd test
```

### 2. Run TypeScript Strict Check, ESLint & Prettier
```bash
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
```

### 3. Start Local Development Server
```bash
npm.cmd run dev
```
Starts the live-reloading development server at `http://localhost:5173`.

### 4. Build & Preview Production Bundle
```bash
npm.cmd run build
npm.cmd run preview
```
- `npm.cmd run build` compiles Tailwind CSS, bundles and minifies the TypeScript/React application into `./dist`, and copies static assets.
- `npm.cmd run preview` serves the production `./dist` build at `http://localhost:4173` with SPA fallback routing.

---

## Project Structure

```text
├── lessons/                        # Original 5 HTML lesson files (preserved verbatim)
├── scripts/
│   ├── build.mjs                   # Production bundler (Tailwind CSS + esbuild)
│   ├── dev.mjs                     # Development server with live reload
│   └── preview.mjs                 # Production SPA preview server
├── src/
│   ├── __tests__/
│   │   ├── app.test.tsx            # Component, route & content preservation tests
│   │   └── mathVerification.test.ts# Automated finite-difference math verification suite
│   ├── components/
│   │   ├── common/                 # Layout, ErrorBoundary, KaTeXMath, WorkedExampleCard, SearchModal
│   │   └── interactive/            # 6 interactive calculus visualizers & explorers
│   ├── context/                    # ThemeContext, ProgressContext, RouterContext
│   ├── data/                       # Verbatim curriculum data, formulas, and verified quiz bank
│   ├── pages/                      # 9 page views (Home, Overview, Lesson, Lab, Practice, Quiz, etc.)
│   └── utils/                      # mathEngine.ts, plotter.ts, storage.ts
├── README.md                       # Setup, run, build, test, and architecture documentation
├── REVIEW_NOTES.md                 # Mathematical & content audit of original HTML files
└── TEST_REPORT.md                  # Automated test suite & browser verification report
```
