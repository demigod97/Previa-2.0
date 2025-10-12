import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TopBar } from '@/components/layout/TopBar';
import { BrowserRouter } from 'react-router-dom';

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    userTier: { tier: 'user' },
    signOut: vi.fn(),
    loading: false,
    session: { access_token: 'test-token' },
    error: null,
    isAuthenticated: true,
    tierLoading: false,
    tierError: null,
  })),
}));

// Mock the useMockDataSeeding hook
const mockSeedMockData = vi.fn();
const mockUseMockDataSeeding = vi.fn(() => ({
  seedMockData: mockSeedMockData,
  isLoading: false,
}));

vi.mock('@/hooks/useMockDataSeeding', () => ({
  useMockDataSeeding: mockUseMockDataSeeding,
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

describe('TopBar - Mock Data Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the "Seed Mock Data" button for authenticated users', () => {
    render(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /seed mock data/i });
    expect(button).toBeInTheDocument();
  });

  it('should display correct styling for mock data button', () => {
    render(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /seed mock data/i });
    expect(button).toHaveClass('bg-sand');
    expect(button).toHaveClass('text-charcoal');
  });

  it('should call seedMockData when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>
    );

    const button = screen.getByRole('button', { name: /seed mock data/i });
    await user.click(button);

    expect(mockSeedMockData).toHaveBeenCalledTimes(1);
  });

  it('should not render mock data button for unauthenticated users', async () => {
    // Override the mock for this test
    const authModule = await import('@/contexts/AuthContext');
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: null,
      userTier: null,
      signOut: vi.fn(),
      loading: false,
      session: null,
      error: null,
      isAuthenticated: false,
      tierLoading: false,
      tierError: null,
    });

    render(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>
    );

    const button = screen.queryByRole('button', { name: /seed mock data/i });
    expect(button).not.toBeInTheDocument();
  });

  it('should show loading state with spinner', () => {
    // Mock the hook to return loading state
    mockUseMockDataSeeding.mockReturnValue({
      seedMockData: mockSeedMockData,
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>
    );

    // Button should have disabled state and show "Generating..." text
    const button = screen.getByRole('button', { name: /seed mock data/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    // Check for "Generating..." text
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
    
    // Check for spinner (element with animate-spin class)
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display "Generating..." text during loading', () => {
    // Mock the hook to return loading state
    mockUseMockDataSeeding.mockReturnValue({
      seedMockData: mockSeedMockData,
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>
    );

    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });
});
