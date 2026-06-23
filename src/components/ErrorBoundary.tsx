import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-destructive rounded-xl p-6 shadow-lg">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
              <p className="text-muted-foreground">
                The application encountered an unexpected error. Your data is safe.
              </p>
              {this.state.error && (
                <details className="text-left text-xs bg-secondary p-3 rounded border border-border">
                  <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
                  <pre className="overflow-auto">{this.state.error.message}</pre>
                </details>
              )}
              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Go Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
