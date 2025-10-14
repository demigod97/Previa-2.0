import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Welcome from './Welcome';

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Welcome Component', () => {
  const renderWelcome = () => {
    return render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
  };

  it('renders welcome screen with Previa branding', () => {
    renderWelcome();

    expect(screen.getByText('Welcome to Previa')).toBeInTheDocument();
    expect(screen.getByText('AI-driven financial intelligence for Australian freelancers')).toBeInTheDocument();
  });

  it('displays three key benefits with icons', () => {
    renderWelcome();

    expect(screen.getByText('Smart Document Processing')).toBeInTheDocument();
    expect(screen.getByText('Automated Reconciliation')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Insights')).toBeInTheDocument();

    // Check descriptions are present
    expect(screen.getByText(/Upload bank statements and receipts/i)).toBeInTheDocument();
    expect(screen.getByText(/AI matches transactions to receipts/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard shows spending patterns/i)).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    renderWelcome();

    const button = screen.getByRole('button', { name: /get started/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to /auth when Get Started is clicked', () => {
    renderWelcome();

    const button = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('displays legal links in footer', () => {
    renderWelcome();

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    const termsLink = screen.getByRole('link', { name: /terms of service/i });

    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  it('applies Previa design system colors', () => {
    renderWelcome();

    const container = screen.getByText('Welcome to Previa').closest('div');
    expect(container).toHaveClass('bg-cream');
  });

  it('is responsive with mobile-first layout', () => {
    renderWelcome();

    // Check for responsive grid classes
    const benefitsContainer = screen.getByText('Smart Document Processing').closest('div')?.parentElement;
    expect(benefitsContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3');
  });
});
