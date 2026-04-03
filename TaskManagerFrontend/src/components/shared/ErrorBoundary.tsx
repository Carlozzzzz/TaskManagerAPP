// src/components/shared/ErrorBoundary.tsx
import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.setState({ errorInfo });

    // Log to console in development
    console.error('Error Boundary caught:', error, errorInfo);

    // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
    // reportToErrorTracking(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mb-6 text-center text-gray-600">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 max-h-48 overflow-y-auto rounded bg-red-50 p-3 text-sm text-red-800">
                  <summary className="cursor-pointer font-semibold hover:text-red-900">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <button
                onClick={this.handleReset}
                className="mb-2 w-full rounded bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = '/tasks')}
                className="w-full rounded bg-gray-200 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-300"
              >
                Go to Home
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
