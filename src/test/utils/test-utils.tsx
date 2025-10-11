/**
 * React Testing Library Utilities
 * 
 * Custom render functions and utilities for testing React components
 * with proper providers and contexts.
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Custom render options with providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial React Query client state
   */
  queryClient?: QueryClient;
  
  /**
   * Initial router path
   */
  initialPath?: string;
  
  /**
   * Mock Supabase client
   */
  mockSupabase?: any;
}

/**
 * Create a test query client with sensible defaults
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
        gcTime: Infinity, // Don't garbage collect during tests
        staleTime: Infinity // Keep data fresh during tests
      },
      mutations: {
        retry: false
      }
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {} // Suppress console errors in tests
    }
  });
}

/**
 * Custom render function with all necessary providers
 * 
 * @example
 * ```typescript
 * import { renderWithProviders } from '@/test/utils/test-utils';
 * 
 * test('renders transaction card', () => {
 *   renderWithProviders(<TransactionCard transaction={mockTransaction} />);
 *   expect(screen.getByText('Woolworths')).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    queryClient = createTestQueryClient(),
    initialPath = '/',
    ...renderOptions
  } = options;

  // Set initial path if needed
  if (initialPath !== '/') {
    window.history.pushState({}, 'Test page', initialPath);
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient
  };
}

/**
 * Utility to wait for loading states to complete
 * Useful for async data fetching tests
 */
export async function waitForLoadingToFinish() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Utility to create mock router navigation
 */
export function mockUseNavigate() {
  return vi.fn();
}

/**
 * Utility to wait for React Query to settle
 */
export async function waitForQueryToSettle(queryClient: QueryClient) {
  await queryClient.invalidateQueries();
  await new Promise(resolve => setTimeout(resolve, 0));
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

