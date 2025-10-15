import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WizardProvider, useWizard, shouldShowWizard, getWizardStats } from './WizardContext';
import { BrowserRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper with providers
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <WizardProvider>{children}</WizardProvider>
  </BrowserRouter>
);

describe('WizardContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('Initial State', () => {
    it('should initialize with step 1', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      expect(result.current.currentStep).toBe(1);
      expect(result.current.progress).toBe(20);
    });

    it('should initialize with closed modal', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize as not completed', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      expect(result.current.isCompleted).toBe(false);
    });

    it('should restore last viewed step from localStorage', () => {
      localStorage.setItem('previaWizardLastStep', '3');
      
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      expect(result.current.currentStep).toBe(3);
      expect(result.current.progress).toBe(60);
    });

    it('should read completed status from localStorage', () => {
      localStorage.setItem('previaWizardCompleted', 'true');
      
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      expect(result.current.isCompleted).toBe(true);
    });
  });

  describe('Modal Actions', () => {
    it('should open wizard', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.openWizard();
      });
      
      expect(result.current.isOpen).toBe(true);
    });

    it('should close wizard', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.openWizard();
      });
      
      expect(result.current.isOpen).toBe(true);
      
      act(() => {
        result.current.closeWizard();
      });
      
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Step Navigation', () => {
    it('should navigate to next step', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.nextStep();
      });
      
      expect(result.current.currentStep).toBe(2);
      expect(result.current.progress).toBe(40);
    });

    it('should navigate to previous step', () => {
      localStorage.setItem('previaWizardLastStep', '3');
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.previousStep();
      });
      
      expect(result.current.currentStep).toBe(2);
      expect(result.current.progress).toBe(40);
    });

    it('should not go below step 1', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.previousStep();
      });
      
      expect(result.current.currentStep).toBe(1);
    });

    it('should not go above step 5', () => {
      localStorage.setItem('previaWizardLastStep', '5');
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.nextStep();
      });
      
      expect(result.current.currentStep).toBe(5);
    });

    it('should jump to specific step', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.goToStep(4);
      });
      
      expect(result.current.currentStep).toBe(4);
      expect(result.current.progress).toBe(80);
    });

    it('should ignore invalid step numbers', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        // TypeScript prevents invalid steps, but test runtime behavior
        result.current.goToStep(0 as unknown as 1);
      });
      
      expect(result.current.currentStep).toBe(1);
      
      act(() => {
        result.current.goToStep(6 as unknown as 1);
      });
      
      expect(result.current.currentStep).toBe(1);
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      expect(result.current.progress).toBe(20); // Step 1
      
      act(() => result.current.goToStep(2));
      expect(result.current.progress).toBe(40);
      
      act(() => result.current.goToStep(3));
      expect(result.current.progress).toBe(60);
      
      act(() => result.current.goToStep(4));
      expect(result.current.progress).toBe(80);
      
      act(() => result.current.goToStep(5));
      expect(result.current.progress).toBe(100);
    });
  });

  describe('Skip Wizard', () => {
    it('should mark as skipped and close modal', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.openWizard();
      });
      
      expect(result.current.isOpen).toBe(true);
      
      act(() => {
        result.current.skipWizard();
      });
      
      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem('previaWizardSkipped')).toBe('true');
    });
  });

  describe('Finish Wizard', () => {
    it('should mark as completed, close modal, and navigate to dashboard', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.openWizard();
      });
      
      act(() => {
        result.current.finishWizard();
      });
      
      expect(result.current.isOpen).toBe(false);
      expect(localStorage.getItem('previaWizardCompleted')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Reset Wizard', () => {
    it('should clear completion flags and reset to step 1', () => {
      localStorage.setItem('previaWizardLastStep', '4');
      localStorage.setItem('previaWizardCompleted', 'true');
      localStorage.setItem('previaWizardSkipped', 'true');
      
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.resetWizard();
      });
      
      expect(result.current.currentStep).toBe(1);
      // Note: lastStep is '1' because useEffect persists currentStep after reset
      expect(localStorage.getItem('previaWizardLastStep')).toBe('1');
      expect(localStorage.getItem('previaWizardCompleted')).toBeNull();
      expect(localStorage.getItem('previaWizardSkipped')).toBeNull();
    });
  });

  describe('localStorage Persistence', () => {
    it('should persist current step to localStorage', () => {
      const { result } = renderHook(() => useWizard(), { wrapper });
      
      act(() => {
        result.current.goToStep(3);
      });
      
      expect(localStorage.getItem('previaWizardLastStep')).toBe('3');
    });
  });
});

describe('Utility Functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('shouldShowWizard', () => {
    it('should return true if not completed and not skipped', () => {
      expect(shouldShowWizard()).toBe(true);
    });

    it('should return false if completed', () => {
      localStorage.setItem('previaWizardCompleted', 'true');
      expect(shouldShowWizard()).toBe(false);
    });

    it('should return false if skipped', () => {
      localStorage.setItem('previaWizardSkipped', 'true');
      expect(shouldShowWizard()).toBe(false);
    });

    it('should return false if both completed and skipped', () => {
      localStorage.setItem('previaWizardCompleted', 'true');
      localStorage.setItem('previaWizardSkipped', 'true');
      expect(shouldShowWizard()).toBe(false);
    });
  });

  describe('getWizardStats', () => {
    it('should return correct stats with no localStorage', () => {
      const stats = getWizardStats();
      
      expect(stats.isCompleted).toBe(false);
      expect(stats.isSkipped).toBe(false);
      expect(stats.lastViewedStep).toBe('1');
    });

    it('should return correct stats with completed wizard', () => {
      localStorage.setItem('previaWizardCompleted', 'true');
      localStorage.setItem('previaWizardLastStep', '5');
      
      const stats = getWizardStats();
      
      expect(stats.isCompleted).toBe(true);
      expect(stats.isSkipped).toBe(false);
      expect(stats.lastViewedStep).toBe('5');
    });

    it('should return correct stats with skipped wizard', () => {
      localStorage.setItem('previaWizardSkipped', 'true');
      localStorage.setItem('previaWizardLastStep', '2');
      
      const stats = getWizardStats();
      
      expect(stats.isCompleted).toBe(false);
      expect(stats.isSkipped).toBe(true);
      expect(stats.lastViewedStep).toBe('2');
    });
  });
});
