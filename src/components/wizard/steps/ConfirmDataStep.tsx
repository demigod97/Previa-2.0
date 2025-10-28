import { Card } from '@/components/chakra-ui/card';
import { Badge } from '@/components/chakra-ui/badge';
import { CheckCircle2, Edit3, AlertCircle, Eye } from 'lucide-react';

/**
 * ConfirmDataStep - Step 4: Confirm Extracted Data
 * 
 * Purpose: Teach users how to review and edit extracted account details
 * 
 * Content:
 * - What to check before confirming
 * - How to edit details
 * - Confidence badge explanation
 * - Example account details card
 */
export function ConfirmDataStep() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl mb-4">✅</h2>
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          Confirming Your Data
        </h3>
        <p className="text-base text-charcoal">
          Review and edit extracted account details for accuracy
        </p>
      </div>

      {/* What to check */}
      <Card className="p-6 bg-cream/30 border-stone/20">
        <div className="flex items-start gap-3 mb-4">
          <Eye className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-charcoal mb-2">
              What to check before confirming:
            </h4>
          </div>
        </div>

        <div className="space-y-3 ml-9">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Bank name and account number</p>
              <p className="text-sm text-stone">Make sure it matches your actual account</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Statement period dates</p>
              <p className="text-sm text-stone">Verify the start and end dates are correct</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Opening and closing balances</p>
              <p className="text-sm text-stone">These should match your statement exactly</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Currency</p>
              <p className="text-sm text-stone">Confirm the correct currency is detected</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Example account details card */}
      <Card className="p-6 bg-white border-stone/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-charcoal">
            Example: Account Details
          </h4>
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            High Confidence
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-stone/10">
            <span className="text-stone">Bank Name:</span>
            <span className="font-medium text-charcoal">First National Bank</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-stone/10">
            <span className="text-stone">Account Number:</span>
            <span className="font-medium text-charcoal">****1234</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-stone/10">
            <span className="text-stone">Statement Period:</span>
            <span className="font-medium text-charcoal">Jan 1 - Jan 31, 2024</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-stone/10">
            <span className="text-stone">Opening Balance:</span>
            <span className="font-medium text-charcoal">$5,240.50</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-stone">Closing Balance:</span>
            <span className="font-medium text-charcoal">$6,128.75</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
          <strong>This is what your extracted data will look like!</strong> You'll see all fields clearly labeled.
        </div>
      </Card>

      {/* How to edit */}
      <Card className="p-6 bg-white border-stone/20">
        <div className="flex items-start gap-3 mb-4">
          <Edit3 className="h-6 w-6 text-purple-600" />
          <div>
            <h4 className="text-lg font-semibold text-charcoal mb-2">
              How to edit details:
            </h4>
          </div>
        </div>

        <div className="space-y-3 ml-9">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-semibold text-sm">
              1
            </div>
            <div>
              <p className="font-medium text-charcoal">Click the "Edit" button</p>
              <p className="text-sm text-stone">You'll see an ✏️ icon next to each field you can change</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-semibold text-sm">
              2
            </div>
            <div>
              <p className="font-medium text-charcoal">Make your corrections</p>
              <p className="text-sm text-stone">Update any fields that need fixing</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-semibold text-sm">
              3
            </div>
            <div>
              <p className="font-medium text-charcoal">Save your changes</p>
              <p className="text-sm text-stone">Click "Save" to update the account details</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Important note about confidence */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-charcoal mb-2">
              Pay attention to confidence badges:
            </h4>
            <p className="text-charcoal text-sm mb-3">
              Fields with <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100 inline-flex mx-1">Low Confidence</Badge> 
              badges should be double-checked carefully. The AI had trouble reading these fields and they may contain errors.
            </p>
            <p className="text-charcoal text-sm">
              Fields with <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 inline-flex mx-1">High Confidence</Badge> 
              badges are usually accurate, but it's still good practice to review them.
            </p>
          </div>
        </div>
      </Card>

      {/* CTA explanation */}
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-charcoal">
          <CheckCircle2 className="inline h-5 w-5 mr-2 mb-1 text-green-600" />
          <strong>Ready to proceed?</strong> After confirming, you'll see all extracted transactions
        </p>
      </div>
    </div>
  );
}
