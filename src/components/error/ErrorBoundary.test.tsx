/**
 * ErrorBoundary Component Tests
 *
 * Tests error boundary functionality including:
 * - Error catching and state management
 * - Custom fallback rendering
 * - Reset functionality
 * - Development vs production error display
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
}

// Suppress console.error during tests to avoid noise
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  describe('Normal Rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Test Child Component</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('does not render error UI when children render successfully', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Error Catching', () => {
    it('catches errors from child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('displays default error UI with emoji and message', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('🚫')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          /We encountered an unexpected error. Don't worry, your data is safe./
        )
      ).toBeInTheDocument();
    });

    it('renders action buttons with emojis', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      const goHomeButton = screen.getByRole('button', { name: /Go Home/i });

      expect(tryAgainButton).toBeInTheDocument();
      expect(goHomeButton).toBeInTheDocument();

      // Check button text contains emojis
      expect(tryAgainButton.textContent).toContain('🔄');
      expect(goHomeButton.textContent).toContain('🏠');
    });
  });

  describe('Custom Fallback', () => {
    it('renders custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('calls onReset callback when Try Again button is clicked', () => {
      const onReset = vi.fn();

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(tryAgainButton);

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('clears error state internally when Try Again button is clicked', () => {
      // Create a wrapper component to control re-rendering
      let renderKey = 0;
      const Wrapper = () => {
        const [key, setKey] = React.useState(renderKey);
        return (
          <ErrorBoundary onReset={() => setKey(k => k + 1)}>
            <div key={key}>
              <ThrowError shouldThrow={key === 0} />
            </div>
          </ErrorBoundary>
        );
      };

      render(<Wrapper />);

      // Initially shows error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Click Try Again
      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(tryAgainButton);

      // Should recover and show normal content
      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Go Home Functionality', () => {
    it('redirects to home when Go Home button is clicked', () => {
      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByRole('button', { name: /Go Home/i });
      fireEvent.click(goHomeButton);

      expect(window.location.href).toBe('/');
    });
  });

  describe('Development Mode Error Details', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('displays error details in development mode', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details \(Development Only\):/)).toBeInTheDocument();
      expect(screen.getByText(/Error: Test error message/)).toBeInTheDocument();
    });

    it('displays stack trace in development mode', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const stackTraceToggle = screen.getByText('Stack Trace');
      expect(stackTraceToggle).toBeInTheDocument();
    });
  });

  describe('Production Mode Error Display', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('hides error details in production mode', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/Error Details \(Development Only\):/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Test error message/)).not.toBeInTheDocument();
    });
  });

  describe('Previa Design System', () => {
    it('applies notebook design aesthetics with paper white card', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for Previa cream background
      const background = container.querySelector('.bg-previa-cream');
      expect(background).toBeInTheDocument();

      // Check for white card (paper white)
      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
    });

    it('uses Previa color scheme for buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      const goHomeButton = screen.getByRole('button', { name: /Go Home/i });

      // Try Again button uses sand background
      expect(tryAgainButton.className).toContain('bg-previa-sand');

      // Go Home button uses sand border
      expect(goHomeButton.className).toContain('border-previa-sand');
    });
  });

  describe('Console Logging', () => {
    it('logs error to console when caught', () => {
      const consoleErrorSpy = vi.fn();
      console.error = consoleErrorSpy;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
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
