import {
  Dialog,
  ModalOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/chakra-ui/dialog';
import { useWizard } from '@/contexts/WizardContext';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { WelcomeStep } from './steps/WelcomeStep';
import { UploadGuideStep } from './steps/UploadGuideStep';
import { ProcessingGuideStep } from './steps/ProcessingGuideStep';
import { ConfirmDataStep } from './steps/ConfirmDataStep';
import { ReviewTransactionsStep } from './steps/ReviewTransactionsStep';

/**
 * SetupWizardModal - Main wizard modal component
 * 
 * Features:
 * - 5-step onboarding wizard
 * - Modal dialog with Previa design system
 * - Progress tracking and navigation
 * - Context-aware step rendering
 * - localStorage persistence for resume capability
 */
export function SetupWizardModal() {
  const { currentStep, isOpen, closeWizard } = useWizard();

  console.log('🧙 SetupWizardModal render - isOpen:', isOpen, 'currentStep:', currentStep);

  // Determine which step component to render
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <UploadGuideStep />;
      case 3:
        return <ProcessingGuideStep />;
      case 4:
        return <ConfirmDataStep />;
      case 5:
        return <ReviewTransactionsStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={closeWizard}>
      <ModalOverlay />
      <DialogContent
        className="max-w-3xl bg-white p-8 max-h-[90vh] overflow-y-auto"
        aria-describedby="wizard-description"
      >
        {/* Hidden description for accessibility */}
        <span id="wizard-description" className="sr-only">
          Setup wizard to guide you through Previa's features
        </span>

        <DialogHeader>
          <DialogTitle className="sr-only">
            Setup Wizard - Step {currentStep} of 5
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <WizardProgress />

        {/* Step content */}
        <div className="space-y-6">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <WizardNavigation />
      </DialogContent>
    </Dialog>
  );
}
