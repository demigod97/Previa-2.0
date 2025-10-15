import { Button } from '@/components/ui/button';
import { useWizard } from '@/contexts/WizardContext';

/**
 * WizardNavigation - Navigation buttons for setup wizard
 * 
 * Features:
 * - Back button (hidden on step 1)
 * - Next button (or "Finish & Go to Dashboard" on step 5)
 * - Skip wizard link
 * - Previa design system styling
 * - Keyboard navigation support
 */
export function WizardNavigation() {
  const { currentStep, nextStep, previousStep, skipWizard, finishWizard } = useWizard();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;

  const handleNext = () => {
    if (isLastStep) {
      finishWizard();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t border-stone/20">
      {/* Back button - only show after step 1 */}
      {!isFirstStep && (
        <Button
          variant="ghost"
          onClick={previousStep}
          className="text-stone hover:text-charcoal hover:bg-sand/50"
        >
          Back
        </Button>
      )}

      {/* Spacer for alignment when Back button is hidden */}
      {isFirstStep && <div />}

      {/* Right side - Skip link and Next/Finish button */}
      <div className="flex items-center gap-4">
        {/* Skip wizard link - hide on last step */}
        {!isLastStep && (
          <button
            onClick={skipWizard}
            className="text-sm text-stone hover:underline hover:text-charcoal transition-colors"
            type="button"
          >
            Skip wizard
          </button>
        )}

        {/* Next or Finish button */}
        <Button
          onClick={handleNext}
          className="bg-sand hover:bg-sand/90 text-charcoal font-medium"
        >
          {isLastStep ? 'Finish & Go to Dashboard' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
