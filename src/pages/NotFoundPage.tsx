import React from 'react';
import { Link } from '../context/RouterContext';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-black text-2xl">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Page Not Found (Limit Does Not Exist)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          The page or route you requested is outside the domain of this course portal. Use the links
          below to return to the Differential Calculus curriculum.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Course Home
        </Link>
        <Link
          to="/lesson/phase-1"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Go to Phase 1 Lesson
        </Link>
      </div>
    </div>
  );
};
