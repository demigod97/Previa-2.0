import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, FileSpreadsheet, Upload } from 'lucide-react';

/**
 * UploadGuideStep - Step 2: Upload Guide
 * 
 * Purpose: Teach users how to upload bank statements
 * 
 * Content:
 * - File upload instructions
 * - Supported formats (PDF, CSV)
 * - Visual guide with icons
 * - Tips for best results
 */
export function UploadGuideStep() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl mb-4">📄</h2>
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          Uploading Your Bank Statement
        </h3>
        <p className="text-base text-charcoal">
          Previa accepts PDF and CSV files from any bank
        </p>
      </div>

      {/* Supported formats */}
      <Card className="p-6 bg-cream/30 border-stone/20">
        <h4 className="text-lg font-semibold text-charcoal mb-4">
          Supported file formats:
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone/20">
            <FileText className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-medium text-charcoal">PDF Files</p>
              <p className="text-sm text-stone">Bank statements, invoices</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone/20">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-charcoal">CSV Files</p>
              <p className="text-sm text-stone">Exported transaction data</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>File size limit:</strong> Up to 50 MB per file
          </p>
        </div>
      </Card>

      {/* Visual guide */}
      <Card className="p-6 bg-white border-stone/20">
        <h4 className="text-lg font-semibold text-charcoal mb-4">
          How to upload:
        </h4>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-semibold">
              1
            </div>
            <div>
              <p className="font-medium text-charcoal">Click "Upload Statement" button</p>
              <p className="text-sm text-stone">Or drag and drop files directly onto the upload zone</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-charcoal">Select your bank statement file</p>
              <p className="text-sm text-stone">Choose a PDF or CSV file from your computer</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center text-charcoal font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-charcoal">Wait for processing to complete</p>
              <p className="text-sm text-stone">Usually takes 5-10 seconds for AI to extract data</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="text-lg font-semibold text-charcoal mb-2">
              Tips for best results:
            </h4>
            <ul className="space-y-2 text-sm text-charcoal">
              <li>• <strong>Use clear scans</strong> - High-quality PDFs work best</li>
              <li>• <strong>One file at a time</strong> - Upload statements individually for accuracy</li>
              <li>• <strong>Official statements</strong> - Direct from your bank are most reliable</li>
              <li>• <strong>Check your data</strong> - Review extracted information before confirming</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Try it now callout */}
      <div className="text-center p-4 bg-sand/20 rounded-lg border border-sand">
        <p className="text-charcoal">
          <Upload className="inline h-5 w-5 mr-2 mb-1" />
          <strong>Ready to try?</strong> You'll upload your first statement after this wizard
        </p>
      </div>
    </div>
  );
}
