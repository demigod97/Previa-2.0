import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Wizard step numbers (1-5)
export type WizardStep = 1 | 2 | 3 | 4 | 5;

// Wizard state interface
interface WizardState {
  currentStep: WizardStep;
  isOpen: boolean;
  isCompleted: boolean;
  lastViewedStep: WizardStep;
}

// Wizard context interface
interface WizardContextType {
  // State
  currentStep: WizardStep;
  isOpen: boolean;
  isCompleted: boolean;
  progress: number; // 0-100

  // Actions
  openWizard: () => void;
  closeWizard: () => void;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipWizard: () => void;
  finishWizard: () => void;
  resetWizard: () => void;
}

// Create context with undefined default (will throw if used outside provider)
const WizardContext = createContext<WizardContextType | undefined>(undefined);

// localStorage keys
const STORAGE_KEYS = {
  LAST_STEP: 'previaWizardLastStep',
  COMPLETED: 'previaWizardCompleted',
  SKIPPED: 'previaWizardSkipped',
} as const;

// Provider props
interface WizardProviderProps {
  children: ReactNode;
}

/**
 * WizardProvider - Manages wizard state and persistence
 * 
 * Features:
 * - Tracks current step (1-5)
 * - Persists progress to localStorage
 * - Manages open/close state
 * - Tracks completion status
 * - Provides navigation methods
 */
export function WizardProvider({ children }: WizardProviderProps) {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [currentStep, setCurrentStep] = useState<WizardStep>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_STEP);
    return saved ? (parseInt(saved) as WizardStep) : 1;
  });

  const [isOpen, setIsOpen] = useState(false);

  const [isCompleted] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
  });

  // Calculate progress percentage (20% per step)
  const progress = (currentStep / 5) * 100;

  // Persist current step to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_STEP, currentStep.toString());
  }, [currentStep]);

  // Open wizard (resumes from last viewed step if not completed)
  const openWizard = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close wizard (preserves current step for resumption)
  const closeWizard = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Navigate to specific step
  const goToStep = useCallback((step: WizardStep) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  }, [currentStep]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  }, [currentStep]);

  // Skip wizard (mark as skipped, close modal)
  const skipWizard = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.SKIPPED, 'true');
    setIsOpen(false);
  }, []);

  // Finish wizard (mark as completed, navigate to dashboard)
  const finishWizard = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
    setIsOpen(false);
    navigate('/dashboard');
  }, [navigate]);

  // Reset wizard (clear localStorage, start from step 1)
  const resetWizard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.LAST_STEP);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED);
    localStorage.removeItem(STORAGE_KEYS.SKIPPED);
    setCurrentStep(1);
  }, []);

  const value: WizardContextType = {
    currentStep,
    isOpen,
    isCompleted,
    progress,
    openWizard,
    closeWizard,
    goToStep,
    nextStep,
    previousStep,
    skipWizard,
    finishWizard,
    resetWizard,
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

/**
 * useWizard - Hook to access wizard context
 * 
 * Usage:
 * ```tsx
 * const { currentStep, nextStep, closeWizard } = useWizard();
 * ```
 * 
 * @throws Error if used outside WizardProvider
 */
export function useWizard(): WizardContextType {
  const context = useContext(WizardContext);
  
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  
  return context;
}

/**
 * Utility: Check if wizard should auto-open for new users
 * 
 * Logic:
 * - Show if not completed AND not skipped
 * - Don't show if explicitly skipped
 * - Don't show if already completed
 * 
 * @returns boolean - true if wizard should open
 */
export function shouldShowWizard(): boolean {
  const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
  const skipped = localStorage.getItem(STORAGE_KEYS.SKIPPED) === 'true';
  
  return !completed && !skipped;
}

/**
 * Utility: Get wizard statistics for analytics
 * 
 * @returns Object with completion stats
 */
export function getWizardStats() {
  return {
    isCompleted: localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true',
    isSkipped: localStorage.getItem(STORAGE_KEYS.SKIPPED) === 'true',
    lastViewedStep: localStorage.getItem(STORAGE_KEYS.LAST_STEP) || '1',
  };
}
