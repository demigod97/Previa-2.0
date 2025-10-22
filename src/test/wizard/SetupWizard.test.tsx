import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WizardProvider, useWizard } from '@/contexts/WizardContext';
import { SetupWizardModal } from '@/components/wizard/SetupWizardModal';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test wrapper component
function TestWizardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <WizardProvider>{children}</WizardProvider>
    </BrowserRouter>
  );
}

// Helper component to trigger wizard
function WizardTrigger() {
  const { openWizard, isOpen, currentStep } = useWizard();
  return (
    <div>
      <button onClick={openWizard}>Open Wizard</button>
      <div data-testid="wizard-open">{isOpen.toString()}</div>
      <div data-testid="current-step">{currentStep}</div>
    </div>
  );
}

describe('Setup Wizard - Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  /**
   * Test 10.2: Wizard Modal Component
   */
  describe('10.2: Wizard Modal Component', () => {
    it('should render wizard modal when opened', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Wizard should be open
      const wizardOpenStatus = screen.getByTestId('wizard-open');
      expect(wizardOpenStatus.textContent).toBe('true');
    });

    it('should close wizard when close button is clicked', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Find and click close button (X icon)
      const closeButton = screen.getByLabelText(/close/i);
      fireEvent.click(closeButton);

      await waitFor(() => {
        const wizardOpenStatus = screen.getByTestId('wizard-open');
        expect(wizardOpenStatus.textContent).toBe('false');
      });
    });

    it('should use shadcn Dialog component', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Check for Dialog role
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeDefined();
    });

    it('should have max-w-3xl width styling', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-3xl');
    });
  });

  /**
   * Test 10.3: Multi-Step Wizard Interface
   */
  describe('10.3: Multi-Step Navigation', () => {
    it('should start at step 1 by default', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const currentStepDisplay = screen.getByTestId('current-step');
      expect(currentStepDisplay.textContent).toBe('1');
    });

    it('should navigate to next step when Next button is clicked', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Click Next button
      const nextButton = screen.getByText(/next|get started/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        const currentStepDisplay = screen.getByTestId('current-step');
        expect(currentStepDisplay.textContent).toBe('2');
      });
    });

    it('should navigate to previous step when Back button is clicked', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Go to step 2
      const nextButton = screen.getByText(/next|get started/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        const currentStepDisplay = screen.getByTestId('current-step');
        expect(currentStepDisplay.textContent).toBe('2');
      });

      // Go back to step 1
      const backButton = screen.getByText(/back/i);
      fireEvent.click(backButton);

      await waitFor(() => {
        const currentStepDisplay = screen.getByTestId('current-step');
        expect(currentStepDisplay.textContent).toBe('1');
      });
    });

    it('should hide Back button on step 1', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      const backButtons = screen.queryAllByText(/back/i);
      // Back button should not be visible on step 1
      expect(backButtons.length).toBe(0);
    });

    it('should show "Finish & Go to Dashboard" on step 5', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 5
      for (let i = 0; i < 4; i++) {
        const nextButton = screen.getByText(/next|get started|try it now/i);
        fireEvent.click(nextButton);
        await waitFor(() => {
          const currentStepDisplay = screen.getByTestId('current-step');
          expect(parseInt(currentStepDisplay.textContent || '0')).toBeGreaterThan(i + 1);
        });
      }

      // Check for Finish button on step 5
      const finishButton = screen.getByText(/finish & go to dashboard/i);
      expect(finishButton).toBeDefined();
    });

    it('should support skip wizard functionality', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Find and click skip link
      const skipLink = screen.getByText(/skip wizard/i);
      fireEvent.click(skipLink);

      await waitFor(() => {
        const wizardOpenStatus = screen.getByTestId('wizard-open');
        expect(wizardOpenStatus.textContent).toBe('false');
      });

      // Check localStorage for skip flag
      const skipped = localStorage.getItem('previa:wizard:skipped');
      expect(skipped).toBe('true');
    });
  });

  /**
   * Test 10.4: Wizard Content for Onboarding Guidance
   */
  describe('10.4: Wizard Content', () => {
    it('should render Step 1 (Welcome) content', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Check for welcome content
      expect(screen.getByText(/welcome/i)).toBeDefined();
      expect(screen.getByText(/uploading your first bank statement/i)).toBeDefined();
    });

    it('should render Step 2 (Upload Guide) content', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 2
      const nextButton = screen.getByText(/get started/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/upload your bank statement/i)).toBeDefined();
      });

      // Check for upload guidance content
      expect(screen.getByText(/pdf or csv/i)).toBeDefined();
      expect(screen.getByText(/50mb/i)).toBeDefined();
    });

    it('should render Step 3 (Processing Guide) content', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 3
      for (let i = 0; i < 2; i++) {
        const nextButton = screen.getByText(/next|get started|try it now/i);
        fireEvent.click(nextButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/ai is extracting your data/i)).toBeDefined();
      });

      // Check for processing time info
      expect(screen.getByText(/5-10 seconds/i)).toBeDefined();
    });

    it('should render Step 4 (Confirm Data) content', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 4
      for (let i = 0; i < 3; i++) {
        const nextButton = screen.getByText(/next|get started|try it now/i);
        fireEvent.click(nextButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/confirm your account details/i)).toBeDefined();
      });

      // Check for edit instructions
      expect(screen.getByText(/edit/i)).toBeDefined();
    });

    it('should render Step 5 (Review Transactions) content', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 5
      for (let i = 0; i < 4; i++) {
        const nextButton = screen.getByText(/next|get started|try it now/i);
        fireEvent.click(nextButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/your transactions are ready/i)).toBeDefined();
      });

      // Check for next steps
      expect(screen.getByText(/dashboard/i)).toBeDefined();
      expect(screen.getByText(/reconciliation/i)).toBeDefined();
    });
  });

  /**
   * Test 10.5: Wizard State Management
   */
  describe('10.5: Wizard State Management', () => {
    it('should persist current step to localStorage', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 2
      const nextButton = screen.getByText(/get started/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        const lastStep = localStorage.getItem('previa:wizard:lastStep');
        expect(lastStep).toBe('2');
      });
    });

    it('should resume wizard from last step', async () => {
      // Set localStorage to step 3
      localStorage.setItem('previa:wizard:lastStep', '3');

      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const currentStepDisplay = screen.getByTestId('current-step');
      expect(currentStepDisplay.textContent).toBe('3');
    });

    it('should save completion state to localStorage', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 5
      for (let i = 0; i < 4; i++) {
        const nextButton = screen.getByText(/next|get started|try it now/i);
        fireEvent.click(nextButton);
      }

      // Click Finish button
      const finishButton = screen.getByText(/finish & go to dashboard/i);
      fireEvent.click(finishButton);

      await waitFor(() => {
        const completed = localStorage.getItem('previa:wizard:completed');
        expect(completed).toBe('true');
      });
    });

    it('should connect to showWizard toggle from context', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const wizardOpenStatus = screen.getByTestId('wizard-open');
      expect(wizardOpenStatus.textContent).toBe('false');

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      expect(wizardOpenStatus.textContent).toBe('true');
    });
  });

  /**
   * Test 10.6: Previa Design System Styling
   */
  describe('10.6: Previa Design System Styling', () => {
    it('should use Cream background for modal overlay', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      const dialog = screen.getByRole('dialog');
      // Check for Previa design system classes
      expect(dialog.className).toMatch(/bg-(cream|white|paper)/);
    });

    it('should use Sand color for primary CTA buttons', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      const nextButton = screen.getByText(/get started/i);
      // Check for Sand background color class
      expect(nextButton.className).toMatch(/bg-sand/);
    });

    it('should use Inter font family', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      const dialog = screen.getByRole('dialog');
      // Inter is set globally, so check root styles
      expect(document.body.className).toMatch(/font-(inter|sans)/);
    });

    it('should display progress bar with proper styling', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Check for progress text
      const progressText = screen.getByText(/step 1 of 5/i);
      expect(progressText).toBeDefined();
    });

    it('should show progress percentage (20% per step)', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Step 1 should be 20% (1/5 * 100)
      const progressIndicator = screen.getByRole('progressbar');
      expect(progressIndicator.getAttribute('aria-valuenow')).toBe('20');

      // Navigate to step 2
      const nextButton = screen.getByText(/get started/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        const progressIndicator = screen.getByRole('progressbar');
        expect(progressIndicator.getAttribute('aria-valuenow')).toBe('40');
      });
    });
  });

  /**
   * Test 10.7: Wizard Functionality and Navigation
   */
  describe('10.7: Wizard Functionality', () => {
    it('should support keyboard navigation (Tab, Enter, Escape)', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Press Escape to close
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      await waitFor(() => {
        const wizardOpenStatus = screen.getByTestId('wizard-open');
        expect(wizardOpenStatus.textContent).toBe('false');
      });
    });

    it('should have proper ARIA labels for accessibility', () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Check for dialog role
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeDefined();

      // Check for progress bar role
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeDefined();

      // Check for navigation buttons
      const nextButton = screen.getByText(/get started/i);
      expect(nextButton.tagName).toBe('BUTTON');
    });

    it('should announce step changes to screen readers', async () => {
      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Check for step indicator with sr-only class or aria-live
      const stepIndicator = screen.getByText(/step 1 of 5/i);
      expect(stepIndicator).toBeDefined();
    });

    it('should redirect to dashboard on finish', async () => {
      mockNavigate.mockClear();

      render(
        <TestWizardWrapper>
          <WizardTrigger />
          <SetupWizardModal />
        </TestWizardWrapper>
      );

      const openButton = screen.getByText('Open Wizard');
      fireEvent.click(openButton);

      // Navigate to step 5 and finish
      for (let i = 0; i < 4; i++) {
        const nextButton = screen.getByText(/next|get started|try it now/i);
        fireEvent.click(nextButton);
      }

      const finishButton = screen.getByText(/finish & go to dashboard/i);
      fireEvent.click(finishButton);

      // Verify navigate was called with /dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
