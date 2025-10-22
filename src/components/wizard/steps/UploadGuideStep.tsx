import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, FileSpreadsheet, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadBankStatement } from '@/services/storageService';
import { triggerBankStatementProcessing } from '@/services/ocrService';
import { awardPoints } from '@/services/gamificationService';

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
 * - Actual file upload functionality with "Try It Now"
 */
export function UploadGuideStep() {
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejections) => {
      const error = rejections[0].errors[0];
      toast({
        title: 'Invalid file',
        description: error.code === 'file-too-large'
          ? 'File is too large. Maximum size is 50MB.'
          : 'Please upload a PDF or CSV file.',
        variant: 'destructive',
      });
    },
  });

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const filePath = await uploadBankStatement(file, user.id, (progress) => {
        setUploadProgress(progress);
      });

      // 2. Create database record
      const { data: statement, error: dbError } = await supabase
        .from('bank_statements')
        .insert({
          user_id: user.id,
          file_path: filePath,
          processing_status: 'pending',
          file_size: file.size,
        })
        .select('id')
        .single();

      if (dbError) throw dbError;

      // 3. Trigger OCR processing
      await triggerBankStatementProcessing(
        statement.id,
        user.id,
        filePath,
        'bank-statements'
      );

      // 4. Award gamification points (non-blocking)
      try {
        await awardPoints(user.id, 5, 'First bank statement uploaded via wizard');
      } catch (error) {
        console.error('Failed to award points:', error);
      }

      toast({
        title: 'Upload successful!',
        description: 'Processing your statement now. Redirecting...',
      });

      // Navigate to processing status screen
      setTimeout(() => {
        navigate(`/onboarding/processing/${statement.id}`);
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

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

      {/* Try it now - Interactive Upload */}
      {!showUpload ? (
        <div className="text-center">
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-sand hover:bg-sand/90 text-charcoal px-6 py-3 text-lg"
          >
            <Upload className="inline h-5 w-5 mr-2" />
            Try It Now - Upload Your First Statement
          </Button>
          <p className="text-sm text-stone mt-2">
            Test the upload process right here in the wizard
          </p>
        </div>
      ) : (
        <Card className="p-6 bg-cream/30 border-sand">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-charcoal">
              Upload Your Bank Statement
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUpload(false);
                setFile(null);
              }}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive
                ? 'border-sand bg-sand/20'
                : 'border-stone/30 hover:border-sand hover:bg-sand/10'}
              ${file ? 'bg-green-50 border-green-300' : ''}
            `}
          >
            <input {...getInputProps()} />

            {file ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-green-600 mx-auto" />
                <p className="font-medium text-charcoal">{file.name}</p>
                <p className="text-sm text-stone">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-stone mx-auto" />
                <p className="font-medium text-charcoal">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                </p>
                <p className="text-sm text-stone">
                  or click to browse (PDF or CSV, max 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-center text-charcoal">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Upload Button */}
          {file && !uploading && (
            <Button
              onClick={handleUpload}
              className="w-full mt-4 bg-sand hover:bg-sand/90 text-charcoal"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload & Process Statement
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
