/**
 * Error Handling Integration Tests
 *
 * Tests the integration between ErrorBoundary and application components
 * Validates:
 * - Error boundary catches component errors
 * - User-friendly error UI displays
 * - Reset functionality works end-to-end
 * - Development vs production error display modes
 * - Error recovery flows
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock component that can throw errors
interface ErrorThrowingComponentProps {
  shouldThrow?: boolean;
  errorMessage?: string;
}

function ErrorThrowingComponent({
  shouldThrow = false,
  errorMessage = 'Test error',
}: ErrorThrowingComponentProps) {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid="success-content">Component rendered successfully</div>;
}

// Mock component with async error
function AsyncErrorComponent({ shouldThrow = false }: { shouldThrow?: boolean }) {
  const [, setData] = React.useState(null);

  React.useEffect(() => {
    if (shouldThrow) {
      // Simulate async error (e.g., failed data fetch)
      setData(() => {
        throw new Error('Async error occurred');
      });
    }
  }, [shouldThrow]);

  return <div data-testid="async-content">Async component</div>;
}

// Suppress console.error during tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

// Wrapper for tests with Router and QueryClient
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
}

describe('Error Handling Integration Tests', () => {
  describe('ErrorBoundary Integration', () => {
    it('catches synchronous errors from child components', () => {
      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByTestId('success-content')).not.toBeInTheDocument();
    });

    it('displays user-friendly error message with emoji', () => {
      const { container } = render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Check for notebook-styled error UI with emoji
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Check for emoji in the container (it's in a sibling div)
      expect(container.textContent).toContain('🚫');

      expect(
        screen.getByText(/We encountered an unexpected error/i)
      ).toBeInTheDocument();
    });

    it('provides recovery actions (Try Again & Go Home)', () => {
      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      const goHomeButton = screen.getByRole('button', { name: /Go Home/i });

      expect(tryAgainButton).toBeInTheDocument();
      expect(goHomeButton).toBeInTheDocument();

      // Buttons should have emojis
      expect(tryAgainButton.textContent).toContain('🔄');
      expect(goHomeButton.textContent).toContain('🏠');
    });
  });

  describe('Error Recovery Flow', () => {
    it('recovers when error is cleared and Try Again is clicked', () => {
      let shouldThrow = true;

      const Wrapper = () => {
        const [errorState, setErrorState] = React.useState(shouldThrow);
        return (
          <TestWrapper>
            <ErrorBoundary onReset={() => setErrorState(false)}>
              <ErrorThrowingComponent shouldThrow={errorState} />
            </ErrorBoundary>
          </TestWrapper>
        );
      };

      render(<Wrapper />);

      // Initially shows error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click Try Again
      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(tryAgainButton);

      // Should show success content
      waitFor(() => {
        expect(screen.getByTestId('success-content')).toBeInTheDocument();
      });
    });

    it('allows navigation to home on error', () => {
      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      const goHomeButton = screen.getByRole('button', { name: /Go Home/i });
      fireEvent.click(goHomeButton);

      expect(window.location.href).toBe('/');
    });
  });

  describe('Error Context Information', () => {
    it('displays custom error messages', () => {
      const customErrorMessage = 'Custom integration test error';

      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} errorMessage={customErrorMessage} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Error boundary should still show friendly message
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('catches errors from deeply nested components', () => {
      function NestedComponent({ shouldThrow }: { shouldThrow: boolean }) {
        return (
          <div>
            <div>
              <div>
                <ErrorThrowingComponent shouldThrow={shouldThrow} />
              </div>
            </div>
          </div>
        );
      }

      render(
        <TestWrapper>
          <ErrorBoundary>
            <NestedComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Multiple Error Boundaries', () => {
    it('isolates errors to the nearest boundary', () => {
      render(
        <TestWrapper>
          <div>
            <ErrorBoundary>
              <ErrorThrowingComponent shouldThrow={false} />
            </ErrorBoundary>

            <ErrorBoundary>
              <ErrorThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
          </div>
        </TestWrapper>
      );

      // First boundary should show success
      expect(screen.getByTestId('success-content')).toBeInTheDocument();

      // Second boundary should show error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Development vs Production Modes', () => {
    it('shows error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} errorMessage="Dev mode error" />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.getByText(/Error Details \(Development Only\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Dev mode error/i)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('hides error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} errorMessage="Prod mode error" />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(screen.queryByText(/Error Details \(Development Only\)/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Prod mode error/i)).not.toBeInTheDocument();

      // But still shows user-friendly message
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Notebook Design System Integration', () => {
    it('applies Previa design system to error UI', () => {
      const { container } = render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      // Check for Previa cream background
      const creamBackground = container.querySelector('.bg-previa-cream');
      expect(creamBackground).toBeInTheDocument();

      // Check for paper white card
      const whiteCard = container.querySelector('.bg-white');
      expect(whiteCard).toBeInTheDocument();
    });

    it('uses Previa color scheme for action buttons', () => {
      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </TestWrapper>
      );

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      const goHomeButton = screen.getByRole('button', { name: /Go Home/i });

      // Try Again uses sand background
      expect(tryAgainButton.className).toContain('bg-previa-sand');

      // Go Home uses sand border
      expect(goHomeButton.className).toContain('border-previa-sand');
    });
  });

  describe('Console Logging', () => {
    it('logs error to console for debugging', () => {
      const consoleErrorSpy = vi.fn();
      console.error = consoleErrorSpy;

      render(
        <TestWrapper>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={true} errorMessage="Test error for logging" />
          </ErrorBoundary>
        </TestWrapper>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );
    });
  });
});
