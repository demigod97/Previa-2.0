import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Upload, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { Progress } from '@/components/chakra-ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface DocumentStatus {
  id: string;
  type: 'bank_statement' | 'receipt';
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export default function ProcessingStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const documentIds = (location.state?.documentIds || []) as string[];

  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentIds.length === 0) {
      // No documents to process, redirect to upload page
      navigate('/upload');
      return;
    }

    // Initial fetch of document statuses
    fetchDocumentStatuses();

    // Poll for status updates every 3 seconds
    const interval = setInterval(fetchDocumentStatuses, 3000);

    return () => clearInterval(interval);
  }, [documentIds]);

  const fetchDocumentStatuses = async () => {
    try {
      const statusPromises = documentIds.map(async (id) => {
        // Try to fetch from bank_statements first
        const { data: bankStatement } = await supabase
          .from('bank_statements')
          .select('id, file_path, processing_status, error_message')
          .eq('id', id)
          .single();

        if (bankStatement) {
          return {
            id: bankStatement.id,
            type: 'bank_statement' as const,
            fileName: getFileName(bankStatement.file_path),
            status: (bankStatement.processing_status || 'pending') as DocumentStatus['status'],
            error: bankStatement.error_message || undefined,
          };
        }

        // Try to fetch from receipts
        const { data: receipt } = await supabase
          .from('receipts')
          .select('id, file_path, merchant, processing_status, error_message')
          .eq('id', id)
          .single();

        if (receipt) {
          return {
            id: receipt.id,
            type: 'receipt' as const,
            fileName: receipt.merchant || getFileName(receipt.file_path),
            status: (receipt.processing_status || 'pending') as DocumentStatus['status'],
            error: receipt.error_message || undefined,
          };
        }

        // Document not found
        return {
          id,
          type: 'bank_statement' as const,
          fileName: 'Unknown',
          status: 'failed' as const,
          error: 'Document not found',
        };
      });

      const statuses = await Promise.all(statusPromises);
      setDocuments(statuses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching document statuses:', error);
      setLoading(false);
    }
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop()?.split('_').slice(1).join('_') || filePath;
  };

  const getStatusIcon = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'processing':
      case 'pending':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  const getStatusLabel = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
    }
  };

  const handleViewDetails = (doc: DocumentStatus) => {
    if (doc.status !== 'completed') return;

    if (doc.type === 'bank_statement') {
      navigate(`/onboarding/processing/${doc.id}`);
    } else {
      navigate(`/receipts/${doc.id}`);
    }
  };

  const allCompleted = documents.every(
    (doc) => doc.status === 'completed' || doc.status === 'failed'
  );

  const completedCount = documents.filter((doc) => doc.status === 'completed').length;
  const failedCount = documents.filter((doc) => doc.status === 'failed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-previa-cream flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-previa-charcoal" />
        <p className="mt-4 text-previa-stone">Loading document statuses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-previa-cream p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-previa-charcoal mb-2">Processing Status</h1>
          <p className="text-previa-stone">
            Tracking {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Summary Progress */}
        {!allCompleted && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-previa-charcoal" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-previa-charcoal mb-2">
                    Processing your documents...
                  </p>
                  <Progress
                    value={(completedCount + failedCount) / documents.length * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-previa-stone mt-2">
                    {completedCount + failedCount} of {documents.length} completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Status List */}
        <div className="space-y-4 mb-8">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(doc.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-previa-charcoal truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-previa-stone mt-1">
                      {doc.type === 'bank_statement' ? 'Bank Statement' : 'Receipt'}
                    </p>
                    {doc.error && (
                      <p className="text-xs text-red-600 mt-1">{doc.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {getStatusLabel(doc.status)}
                    </span>
                    {doc.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(doc)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-previa-stone">Total documents:</span>
                <span className="font-medium text-previa-charcoal">{documents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-previa-stone">Completed:</span>
                <span className="font-medium text-green-600">{completedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-previa-stone">Failed:</span>
                <span className="font-medium text-red-600">{failedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-previa-stone">Processing:</span>
                <span className="font-medium text-blue-600">
                  {documents.length - completedCount - failedCount}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-6"
              onClick={() => navigate('/upload')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload More Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
