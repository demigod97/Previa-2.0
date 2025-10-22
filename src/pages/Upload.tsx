import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Receipt, Upload as UploadIcon, X, Eye, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadBankStatement, uploadReceipt } from '@/services/storageService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useBankStatements, useReceipts } from '@/hooks/financial';

interface UploadFile {
  id: string;
  file: File;
  type: 'bank_statement' | 'receipt';
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  documentId?: string;
}

export default function Upload() {
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch recent uploads
  const { data: recentBankStatements = [] } = useBankStatements(user?.id, 5);
  const { data: recentReceipts = [] } = useReceipts(user?.id, 5);

  // Bank statement dropzone
  const bankStatementDropzone = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: `${Date.now()}-${file.name}`,
        file,
        type: 'bank_statement' as const,
        progress: 0,
        status: 'pending' as const,
      }));
      setUploadQueue(prev => [...prev, ...newFiles]);
    },
    onDropRejected: (rejections) => {
      toast({
        title: 'Invalid file',
        description: rejections[0].errors[0].message,
        variant: 'destructive',
      });
    },
  });

  // Receipt dropzone
  const receiptDropzone = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: `${Date.now()}-${file.name}`,
        file,
        type: 'receipt' as const,
        progress: 0,
        status: 'pending' as const,
      }));
      setUploadQueue(prev => [...prev, ...newFiles]);
    },
    onDropRejected: (rejections) => {
      toast({
        title: 'Invalid file',
        description: rejections[0].errors[0].message,
        variant: 'destructive',
      });
    },
  });

  const handleUpload = async () => {
    const pendingFiles = uploadQueue.filter(f => f.status === 'pending');

    // Upload max 3 files concurrently
    const concurrentLimit = 3;
    for (let i = 0; i < pendingFiles.length; i += concurrentLimit) {
      const batch = pendingFiles.slice(i, i + concurrentLimit);
      await Promise.allSettled(batch.map(uploadFile));
    }

    // Navigate to processing status page
    const successfulIds = uploadQueue
      .filter(f => f.status === 'success' && f.documentId)
      .map(f => f.documentId);

    if (successfulIds.length > 0) {
      navigate('/processing-status', { state: { documentIds: successfulIds } });
    }
  };

  const uploadFile = async (uploadItem: UploadFile) => {
    if (!user) {
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadItem.id
          ? { ...item, status: 'error', error: 'User not authenticated' }
          : item
      ));
      return;
    }

    try {
      // Update status to uploading
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadItem.id ? { ...item, status: 'uploading' } : item
      ));

      let filePath: string;
      let documentId: string;

      if (uploadItem.type === 'bank_statement') {
        filePath = await uploadBankStatement(uploadItem.file, user.id, (progress) => {
          setUploadQueue(prev => prev.map(item =>
            item.id === uploadItem.id ? { ...item, progress } : item
          ));
        });

        // Create database record
        const { data, error } = await supabase
          .from('bank_statements')
          .insert({ user_id: user.id, file_path: filePath, processing_status: 'pending' })
          .select('id')
          .single();

        if (error) throw error;
        documentId = data.id;
      } else {
        filePath = await uploadReceipt(uploadItem.file, user.id, (progress) => {
          setUploadQueue(prev => prev.map(item =>
            item.id === uploadItem.id ? { ...item, progress } : item
          ));
        });

        // Create database record
        const { data, error } = await supabase
          .from('receipts')
          .insert({ user_id: user.id, file_path: filePath, processing_status: 'pending' })
          .select('id')
          .single();

        if (error) throw error;
        documentId = data.id;
      }

      // Update status to success
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadItem.id
          ? { ...item, status: 'success', progress: 100, documentId }
          : item
      ));
    } catch (error) {
      setUploadQueue(prev => prev.map(item =>
        item.id === uploadItem.id
          ? { ...item, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : item
      ));
    }
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop()?.split('_').slice(1).join('_') || filePath;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
      failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status || 'pending'] || statusMap.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-previa-cream p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-previa-charcoal mb-2">Upload Documents</h1>
        <p className="text-previa-stone mb-8">
          Upload bank statements and receipts for AI processing and reconciliation.
        </p>

        {/* Upload Zones */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Bank Statements Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Bank Statements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...bankStatementDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  bankStatementDropzone.isDragActive
                    ? 'border-previa-charcoal bg-previa-sand'
                    : 'border-previa-stone bg-white'
                }`}
              >
                <input {...bankStatementDropzone.getInputProps()} />
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-previa-stone" />
                <p className="text-previa-charcoal font-medium mb-1">
                  Drop bank statements here
                </p>
                <p className="text-previa-stone text-sm">
                  PDF or CSV, max 50MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Receipts Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...receiptDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  receiptDropzone.isDragActive
                    ? 'border-previa-charcoal bg-previa-sand'
                    : 'border-previa-stone bg-white'
                }`}
              >
                <input {...receiptDropzone.getInputProps()} />
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-previa-stone" />
                <p className="text-previa-charcoal font-medium mb-1">
                  Drop receipts here
                </p>
                <p className="text-previa-stone text-sm">
                  PDF, JPG, or PNG, max 50MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Queue ({uploadQueue.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uploadQueue.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-previa-cream rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-previa-charcoal">{item.file.name}</p>
                    <p className="text-xs text-previa-stone">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB · {item.type === 'bank_statement' ? 'Bank Statement' : 'Receipt'}
                    </p>
                    {item.status === 'uploading' && (
                      <Progress value={item.progress} className="mt-2" />
                    )}
                    {item.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {item.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromQueue(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    {item.status === 'success' && <span className="text-green-600">✓</span>}
                    {item.status === 'error' && <span className="text-red-600">✗</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        {uploadQueue.some(f => f.status === 'pending') && (
          <Button size="lg" className="w-full mb-8" onClick={handleUpload}>
            Upload {uploadQueue.filter(f => f.status === 'pending').length} Files
          </Button>
        )}

        {/* Recent Uploads */}
        {(recentBankStatements.length > 0 || recentReceipts.length > 0) && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-previa-charcoal mb-4">Recent Uploads</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Bank Statements */}
              {recentBankStatements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5" />
                      Bank Statements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentBankStatements.map((statement) => (
                        <div
                          key={statement.id}
                          className="flex items-center gap-3 p-3 bg-previa-cream rounded-lg hover:bg-previa-sand transition-colors"
                        >
                          <FileText className="w-4 h-4 text-previa-stone flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-previa-charcoal truncate">
                              {getFileName(statement.file_path)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-previa-stone" />
                              <p className="text-xs text-previa-stone">
                                {formatDate(statement.uploaded_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusBadge(statement.processing_status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/onboarding/processing/${statement.id}`)}
                              className="p-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Receipts */}
              {recentReceipts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Receipt className="w-5 h-5" />
                      Receipts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentReceipts.map((receipt) => (
                        <div
                          key={receipt.id}
                          className="flex items-center gap-3 p-3 bg-previa-cream rounded-lg hover:bg-previa-sand transition-colors"
                        >
                          <Receipt className="w-4 h-4 text-previa-stone flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-previa-charcoal truncate">
                              {receipt.merchant || getFileName(receipt.file_path)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-previa-stone" />
                              <p className="text-xs text-previa-stone">
                                {formatDate(receipt.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusBadge(receipt.processing_status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/receipts/${receipt.id}`)}
                              className="p-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
