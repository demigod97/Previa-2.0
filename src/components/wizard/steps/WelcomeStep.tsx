import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

/**
 * WelcomeStep - Step 1: Welcome & Getting Started
 * 
 * Purpose: Introduce Previa and explain what the wizard covers
 * 
 * Content:
 * - Welcome heading with emoji
 * - Brief value proposition
 * - What this wizard covers (checklist)
 * - Encouragement to get started
 */
export function WelcomeStep() {
  return (
    <div className="space-y-6">
      {/* Welcome heading */}
      <div className="text-center">
        <h2 className="text-4xl mb-4">👋</h2>
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          Welcome to Previa
        </h3>
        <p className="text-base text-charcoal">
          Previa automates bank reconciliation with AI-powered OCR
        </p>
      </div>

      {/* What this wizard covers */}
      <Card className="p-6 bg-cream/30 border-stone/20">
        <h4 className="text-lg font-semibold text-charcoal mb-4">
          What you'll learn in this wizard:
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-charcoal">
              <strong>Uploading your first bank statement</strong> - Learn how to drag and drop PDF or CSV files
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-charcoal">
              <strong>Understanding AI processing</strong> - See how Previa extracts your data automatically
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-charcoal">
              <strong>Confirming extracted data</strong> - Review and edit account details for accuracy
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-charcoal">
              <strong>Reviewing transactions</strong> - Preview your extracted transactions
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-charcoal">
              <strong>Exploring the dashboard</strong> - Navigate to key features like reconciliation and chat
            </span>
          </div>
        </div>
      </Card>

      {/* Encouragement message */}
      <div className="text-center">
        <p className="text-stone">
          This will take about 2 minutes. Let's get you set up! 🚀
        </p>
      </div>
    </div>
  );
}
