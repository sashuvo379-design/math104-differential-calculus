import React from 'react';
import { Link } from '../context/RouterContext';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
      <div className="px-4 py-2 rounded-md bg-white dark:bg-[#111622] border border-zinc-200 dark:border-[#242B3D] text-[#0F3D6E] dark:text-sky-400 font-mono font-bold text-2xl">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Page Not Found (Limit Does Not Exist)
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The page or route you requested is outside the domain of this course portal. Return to the
          Differential Calculus curriculum below.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-[#0F3D6E] dark:bg-sky-600 text-white hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          Back to Course Home
        </Link>
        <Link
          to="/lesson/phase-1"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-white dark:bg-[#111622] border border-zinc-300 dark:border-[#242B3D] text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Go to Phase 1 Lesson
        </Link>
      </div>
    </div>
  );
};
