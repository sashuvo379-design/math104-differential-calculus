import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-6 my-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 max-w-2xl mx-auto shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <h2 className="text-lg font-bold">
              {this.props.fallbackTitle || 'Something went wrong in this module'}
            </h2>
          </div>
          <p className="text-sm text-rose-800 dark:text-rose-300 mb-4">{this.state.errorMessage}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Recover View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
