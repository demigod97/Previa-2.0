import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { uploadBankStatement } from '@/services/storageService';
import { triggerBankStatementProcessing } from '@/services/ocrService';
import { awardPoints } from '@/services/gamificationService';

export default function BankStatementUpload() {
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
        await awardPoints(user.id, 5, 'First bank statement uploaded');
      } catch (error) {
        // Log but don't block user flow
        console.error('Failed to award points:', error);
      }

      toast({
        title: 'Upload successful!',
        description: 'Processing your statement now...',
      });

      // Navigate to processing status screen
      navigate(`/onboarding/processing/${statement.id}`);
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
    <div className="min-h-screen bg-previa-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-previa-charcoal mb-2">
          Upload Your Bank Statement
        </h1>
        <p className="text-previa-stone mb-8">
          Upload a PDF or CSV file from your bank. We'll extract your account details and transactions.
        </p>

        <Card className="p-8 bg-white border-previa-stone/20">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-previa-charcoal bg-previa-sand'
                : 'border-previa-stone bg-white'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-previa-stone" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-previa-charcoal" />
                <span className="text-previa-charcoal font-medium">{file.name}</span>
                <span className="text-previa-stone text-sm">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ) : (
              <div>
                <p className="text-previa-charcoal font-medium mb-2">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your bank statement'}
                </p>
                <p className="text-previa-stone text-sm">
                  or click to browse (PDF or CSV, max 50MB)
                </p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-6">
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-center text-previa-stone text-sm">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full mt-6"
            disabled={!file || uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Uploading...' : 'Continue'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
