import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { Progress } from '@/components/chakra-ui/progress';
import { useProcessingStatus } from '@/hooks/useProcessingStatus';

export default function ProcessingStatus() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const { data: status, error } = useProcessingStatus(documentId, 'bank_statement');

  useEffect(() => {
    // Redirect to account confirmation when processing completes
    if (status?.processing_status === 'completed') {
      navigate(`/onboarding/confirm-account/${documentId}`);
    }
  }, [status?.processing_status, documentId, navigate]);

  const handleRetry = () => {
    // Navigate back to upload page
    navigate('/onboarding/upload');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-previa-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="p-8 bg-white border-previa-stone/20 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-previa-charcoal mb-4">
              Processing Failed
            </h1>
            <p className="text-previa-stone mb-6">
              We encountered an error while processing your document. Please try uploading again.
            </p>
            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-previa-cream flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-previa-charcoal" />
      </div>
    );
  }

  if (status.processing_status === 'failed') {
    return (
      <div className="min-h-screen bg-previa-cream flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="p-8 bg-white border-previa-stone/20 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-previa-charcoal mb-4">
              Processing Failed
            </h1>
            <p className="text-previa-stone mb-6">
              We couldn't extract information from your document. Please check that it's a valid bank statement and try again.
            </p>
            <Button onClick={handleRetry} className="w-full">
              Upload a Different File
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-previa-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8 bg-white border-previa-stone/20">
          <div className="text-center">
            {status.processing_status === 'completed' ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 animate-in zoom-in duration-500" />
                <h1 className="text-2xl font-bold text-previa-charcoal mb-2">
                  Processing Complete!
                </h1>
                <p className="text-previa-stone">
                  Redirecting to account confirmation...
                </p>
              </>
            ) : (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-previa-charcoal animate-spin" />
                <h1 className="text-2xl font-bold text-previa-charcoal mb-2">
                  Processing Your Statement
                </h1>
                <p className="text-previa-stone mb-6">
                  We're extracting your account details and transactions...
                </p>
                <Progress value={status.processing_status === 'processing' ? 50 : 10} className="mb-2" />
                <p className="text-sm text-previa-stone">
                  This usually takes 5-10 seconds
                </p>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
