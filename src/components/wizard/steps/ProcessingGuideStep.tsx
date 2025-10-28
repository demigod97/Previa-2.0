import { Card } from '@/components/chakra-ui/card';
import { Badge } from '@/components/chakra-ui/badge';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';

/**
 * ProcessingGuideStep - Step 3: AI Processing Guide
 * 
 * Purpose: Explain how AI extracts data from bank statements
 * 
 * Content:
 * - What happens during processing
 * - Processing time expectations
 * - Confidence scores explanation
 * - What gets extracted
 */
export function ProcessingGuideStep() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl mb-4">🤖</h2>
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          Understanding AI Processing
        </h3>
        <p className="text-base text-charcoal">
          See how Previa extracts your financial data automatically
        </p>
      </div>

      {/* What happens */}
      <Card className="p-6 bg-cream/30 border-stone/20">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-purple-600 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-charcoal mb-2">
              What happens during processing:
            </h4>
          </div>
        </div>

        <div className="space-y-3 ml-9">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Account details extraction</p>
              <p className="text-sm text-stone">Bank name, account number, statement period</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Balance information</p>
              <p className="text-sm text-stone">Opening balance, closing balance, currency</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Transaction parsing</p>
              <p className="text-sm text-stone">Date, description, amount, category for each transaction</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Smart categorization</p>
              <p className="text-sm text-stone">AI assigns categories based on transaction descriptions</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Processing time */}
      <Card className="p-6 bg-white border-stone/20">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-blue-600" />
          <h4 className="text-lg font-semibold text-charcoal">
            How long does it take?
          </h4>
        </div>

        <p className="text-charcoal mb-4">
          Processing typically takes <strong>5-10 seconds</strong> per statement, depending on:
        </p>

        <ul className="space-y-2 text-sm text-charcoal ml-6">
          <li>• File size and format (PDF vs CSV)</li>
          <li>• Number of transactions (more transactions = slightly longer)</li>
          <li>• Document quality (clear scans process faster)</li>
        </ul>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Real-time updates:</strong> You'll see progress indicators while processing
          </p>
        </div>
      </Card>

      {/* Confidence scores */}
      <Card className="p-6 bg-white border-stone/20">
        <h4 className="text-lg font-semibold text-charcoal mb-4">
          Understanding confidence scores:
        </h4>

        <p className="text-charcoal mb-4">
          After processing, you'll see confidence badges on extracted data:
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
              High Confidence
            </Badge>
            <span className="text-sm text-charcoal">
              Data extracted with 95%+ accuracy - ready to use
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Medium Confidence
            </Badge>
            <span className="text-sm text-charcoal">
              Data looks good but worth reviewing - may need minor edits
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
              Low Confidence
            </Badge>
            <span className="text-sm text-charcoal">
              AI had trouble - please review and correct before using
            </span>
          </div>
        </div>
      </Card>

      {/* Reassurance */}
      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-charcoal">
          <Sparkles className="inline h-5 w-5 mr-2 mb-1 text-purple-600" />
          <strong>Don't worry!</strong> You'll always get a chance to review and edit everything before confirming
        </p>
      </div>
    </div>
  );
}
