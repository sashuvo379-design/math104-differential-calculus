import React from 'react';

declare global {
  interface Window {
    katex?: {
      renderToString: (
        tex: string,
        options?: { displayMode?: boolean; throwOnError?: boolean; output?: string }
      ) => string;
    };
  }
}

interface KaTeXMathProps {
  math: string;
  display?: boolean;
  className?: string;
}

/**
 * Accessible fallback formatter when window.katex CDN script is not yet loaded or in headless tests.
 * Converts LaTeX commands into clean, readable mathematical HTML with proper ARIA semantics.
 */
function formatLatexFallback(tex: string): string {
  return tex
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\partial/g, '∂')
    .replace(/\\nabla/g, '∇')
    .replace(/\\infty/g, '∞')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\delta/g, 'δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\pi/g, 'π')
    .replace(/\\phi/g, 'φ')
    .replace(/\\kappa/g, 'κ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\implies/g, '⇒')
    .replace(/\\iff/g, '⇔')
    .replace(/\\to/g, '→')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\pm/g, '±')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\blacksquare/g, '■')
    .replace(/\\quad|\\qquad|\\,|\\;/g, ' ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\text\{([^{}]+)\}/g, '$1');
}

export const KaTeXMath: React.FC<KaTeXMathProps> = ({ math, display = false, className = '' }) => {
  const cleanMath = math.trim();

  if (typeof window !== 'undefined' && window.katex) {
    try {
      const html = window.katex.renderToString(cleanMath, {
        displayMode: display,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
      return (
        <span
          role="math"
          aria-label={formatLatexFallback(cleanMath)}
          className={`${display ? 'block my-2 overflow-x-auto' : 'inline'} ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      // Fallback below
    }
  }

  return (
    <span
      role="math"
      aria-label={formatLatexFallback(cleanMath)}
      className={`font-serif ${
        display
          ? 'block my-2 py-1.5 px-3 text-center bg-slate-100/70 dark:bg-slate-800/60 rounded overflow-x-auto'
          : 'inline'
      } ${className}`}
    >
      {formatLatexFallback(cleanMath)}
    </span>
  );
};

interface RichMathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders a string containing inline `$...$` or display `$$...$$` math and `[cite: ...]` markers.
 */
export const RichMathText: React.FC<RichMathTextProps> = ({ text, className = '' }) => {
  // Split by $$...$$ or $...$ or [cite: ...]
  const tokens = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$|\[cite:\s*[^\]]+\])/g);

  return (
    <span className={className}>
      {tokens.map((part, idx) => {
        if (!part) return null;
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <KaTeXMath key={idx} math={part.slice(2, -2)} display />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <KaTeXMath key={idx} math={part.slice(1, -1)} />;
        }
        if (part.startsWith('[cite:')) {
          return (
            <span
              key={idx}
              className="inline-flex items-center px-1.5 py-0.5 mx-0.5 text-[11px] font-mono font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700"
              title="Original Lecture / Exam Source Reference"
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};
