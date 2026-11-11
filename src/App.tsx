import React from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/common/Layout';
import { ProgressProvider } from './context/ProgressContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';
import { FormulaSheetPage } from './pages/FormulaSheetPage';
import { HomePage } from './pages/HomePage';
import { InteractiveLabPage } from './pages/InteractiveLabPage';
import { LessonPage } from './pages/LessonPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OverviewPortalPage } from './pages/OverviewPortalPage';
import { PracticePage } from './pages/PracticePage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizPage } from './pages/QuizPage';

const RouteSwitch: React.FC = () => {
  const { path } = useRouter();
  const cleanPath = path.split('?')[0].replace(/\/+$/, '') || '/';

  switch (cleanPath) {
    case '/':
      return <HomePage />;
    case '/overview':
      return <OverviewPortalPage />;
    case '/lesson/phase-1':
      return <LessonPage phaseId="phase-1" />;
    case '/lesson/phase-2':
      return <LessonPage phaseId="phase-2" />;
    case '/lesson/phase-3':
      return <LessonPage phaseId="phase-3" />;
    case '/lesson/phase-4':
      return <LessonPage phaseId="phase-4" />;
    case '/lab':
      return <InteractiveLabPage />;
    case '/practice':
      return <PracticePage />;
    case '/quiz':
      return <QuizPage />;
    case '/formulas':
      return <FormulaSheetPage />;
    case '/progress':
      return <ProgressPage />;
    default:
      return <NotFoundPage />;
  }
};

export const App: React.FC<{ initialPath?: string }> = ({ initialPath }) => {
  return (
    <ErrorBoundary fallbackTitle="Application Error Boundary">
      <ThemeProvider>
        <ProgressProvider>
          <RouterProvider initialPath={initialPath}>
            <Layout>
              <ErrorBoundary fallbackTitle="Page Content Error Boundary">
                <RouteSwitch />
              </ErrorBoundary>
            </Layout>
          </RouterProvider>
        </ProgressProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
