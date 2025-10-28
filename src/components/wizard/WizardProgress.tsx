import { Progress } from '@/components/chakra-ui/progress';
import { useWizard } from '@/contexts/WizardContext';

/**
 * WizardProgress - Progress indicator for setup wizard
 * 
 * Features:
 * - Linear progress bar (0-100%)
 * - Step counter (e.g., "Step 2 of 5")
 * - Progress percentage display
 * - Previa design system styling (Sand fill, Stone/20 background)
 */
export function WizardProgress() {
  const { currentStep, progress } = useWizard();

  return (
    <div className="mb-6">
      {/* Step counter and progress percentage */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-stone">
          Step {currentStep} of 5
        </span>
        <span className="text-sm text-stone">
          {progress}% complete
        </span>
      </div>

      {/* Progress bar */}
      <Progress 
        value={progress} 
        className="h-2 bg-stone/20"
        aria-label={`Wizard progress: ${progress}% complete`}
      />
    </div>
  );
}
