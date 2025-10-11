/**
 * Error Boundary Component
 *
 * Catches React errors and displays user-friendly error UI
 * Follows Previa design system with notebook aesthetics
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-previa-cream flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-4xl">🚫</div>
                <CardTitle className="text-2xl text-previa-charcoal">
                  Something went wrong
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-previa-darkStone">
                We encountered an unexpected error. Don't worry, your data is safe.
                You can try refreshing the page or return to the home screen.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-red-900">
                    Error Details (Development Only):
                  </p>
                  <pre className="text-xs text-red-800 overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="text-xs text-red-700">
                      <summary className="cursor-pointer font-medium">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-60">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  className="bg-previa-sand hover:bg-previa-sand/90 text-previa-charcoal"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  🔄 Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="border-previa-sand text-previa-darkStone hover:bg-previa-sand/10"
                >
                  <Home className="mr-2 h-4 w-4" />
                  🏠 Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
