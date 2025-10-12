import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OAuthProviders from './OAuthProviders';

describe('OAuthProviders', () => {
  const mockOnProviderClick = vi.fn();

  beforeEach(() => {
    mockOnProviderClick.mockClear();
  });

  it('renders OAuth provider buttons', () => {
    render(
      <OAuthProviders 
        onProviderClick={mockOnProviderClick}
        mode="signin"
      />
    );

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Discord')).toBeInTheDocument();
  });

  it('renders signup mode correctly', () => {
    render(
      <OAuthProviders 
        onProviderClick={mockOnProviderClick}
        mode="signup"
      />
    );

    expect(screen.getByText('Sign up with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign up with GitHub')).toBeInTheDocument();
    expect(screen.getByText('Sign up with Discord')).toBeInTheDocument();
  });

  it('calls onProviderClick with correct provider when clicked', () => {
    render(
      <OAuthProviders 
        onProviderClick={mockOnProviderClick}
        mode="signin"
      />
    );

    fireEvent.click(screen.getByText('Sign in with Google'));
    expect(mockOnProviderClick).toHaveBeenCalledWith('google');

    fireEvent.click(screen.getByText('Sign in with GitHub'));
    expect(mockOnProviderClick).toHaveBeenCalledWith('github');

    fireEvent.click(screen.getByText('Sign in with Discord'));
    expect(mockOnProviderClick).toHaveBeenCalledWith('discord');
  });

  it('disables buttons when loading', () => {
    render(
      <OAuthProviders 
        onProviderClick={mockOnProviderClick}
        mode="signin"
        loading={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('renders without separator text', () => {
    render(
      <OAuthProviders 
        onProviderClick={mockOnProviderClick}
        mode="signin"
      />
    );

    // Should not have separator text since it's OAuth-only
    expect(screen.queryByText('Or sign in with')).not.toBeInTheDocument();
  });
});
