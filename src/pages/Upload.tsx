import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { Badge } from '@/components/chakra-ui/badge';
import { Progress } from '@/components/chakra-ui/progress';
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

        // Invoke process-receipt Edge Function
        try {
          const { error: fnError } = await supabase.functions.invoke('process-receipt', {
            body: {
              receipt_id: documentId,
              user_id: user.id,
              file_path: filePath,
              bucket: 'receipts',
            },
          });

          if (fnError) {
            console.error('Error invoking process-receipt function:', fnError);
            // Don't throw - receipt is uploaded, processing can be retried
          }
        } catch (fnInvokeError) {
          console.error('Failed to invoke process-receipt function:', fnInvokeError);
          // Don't throw - receipt is uploaded, processing can be retried
        }
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
    const statusMap: Record<string, { label: string; colorScheme: string }> = {
      pending: { label: 'Pending', colorScheme: 'yellow' },
      processing: { label: 'Processing', colorScheme: 'blue' },
      completed: { label: 'Completed', colorScheme: 'green' },
      failed: { label: 'Failed', colorScheme: 'red' },
    };

    const statusInfo = statusMap[status || 'pending'] || statusMap.pending;
    return (
      <Badge colorScheme={statusInfo.colorScheme} variant="subtle" fontSize="xs" px={2} py={1} borderRadius="full">
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <Box maxW="6xl" mx="auto">
        <Heading as="h1" size="2xl" fontWeight="bold" color="previa.charcoal" mb={2}>
          Upload Documents
        </Heading>
        <Text color="previa.stone" mb={8}>
          Upload bank statements and receipts for AI processing and reconciliation.
        </Text>

        {/* Upload Zones */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={8}>
          {/* Bank Statements Zone */}
          <Card>
            <CardHeader>
              <CardTitle>
                <HStack spacing={2}>
                  <Icon as={FileText} boxSize={5} />
                  <Text>Bank Statements</Text>
                </HStack>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Box
                {...bankStatementDropzone.getRootProps()}
                border="2px dashed"
                borderColor={bankStatementDropzone.isDragActive ? 'previa.charcoal' : 'previa.stone'}
                bg={bankStatementDropzone.isDragActive ? 'previa.sand' : 'white'}
                borderRadius="lg"
                p={8}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
              >
                <input {...bankStatementDropzone.getInputProps()} />
                <Icon as={UploadIcon} boxSize={12} mx="auto" mb={4} color="previa.stone" />
                <Text color="previa.charcoal" fontWeight="medium" mb={1}>
                  Drop bank statements here
                </Text>
                <Text color="previa.stone" fontSize="sm">
                  PDF or CSV, max 50MB
                </Text>
              </Box>
            </CardContent>
          </Card>

          {/* Receipts Zone */}
          <Card>
            <CardHeader>
              <CardTitle>
                <HStack spacing={2}>
                  <Icon as={Receipt} boxSize={5} />
                  <Text>Receipts</Text>
                </HStack>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Box
                {...receiptDropzone.getRootProps()}
                border="2px dashed"
                borderColor={receiptDropzone.isDragActive ? 'previa.charcoal' : 'previa.stone'}
                bg={receiptDropzone.isDragActive ? 'previa.sand' : 'white'}
                borderRadius="lg"
                p={8}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
              >
                <input {...receiptDropzone.getInputProps()} />
                <Icon as={UploadIcon} boxSize={12} mx="auto" mb={4} color="previa.stone" />
                <Text color="previa.charcoal" fontWeight="medium" mb={1}>
                  Drop receipts here
                </Text>
                <Text color="previa.stone" fontSize="sm">
                  PDF, JPG, or PNG, max 50MB
                </Text>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <Card mb={8}>
            <CardHeader>
              <CardTitle>Upload Queue ({uploadQueue.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <VStack spacing={3} align="stretch">
                {uploadQueue.map(item => (
                  <HStack key={item.id} gap={3} p={3} bg="previa.cream" borderRadius="lg">
                    <VStack flex={1} align="stretch" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium" color="previa.charcoal">
                        {item.file.name}
                      </Text>
                      <Text fontSize="xs" color="previa.stone">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB · {item.type === 'bank_statement' ? 'Bank Statement' : 'Receipt'}
                      </Text>
                      {item.status === 'uploading' && (
                        <Box mt={2}>
                          <Progress value={item.progress} />
                        </Box>
                      )}
                      {item.status === 'error' && (
                        <Text fontSize="xs" color="red.600" mt={1}>{item.error}</Text>
                      )}
                    </VStack>
                    <Box>
                      {item.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromQueue(item.id)}
                        >
                          <Icon as={X} boxSize={4} />
                        </Button>
                      )}
                      {item.status === 'success' && <Text color="green.600">✓</Text>}
                      {item.status === 'error' && <Text color="red.600">✗</Text>}
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        {uploadQueue.some(f => f.status === 'pending') && (
          <Button size="lg" w="full" mb={8} onClick={handleUpload}>
            Upload {uploadQueue.filter(f => f.status === 'pending').length} Files
          </Button>
        )}

        {/* Recent Uploads */}
        {(recentBankStatements.length > 0 || recentReceipts.length > 0) && (
          <Box mt={8}>
            <Heading as="h2" size="xl" fontWeight="bold" color="previa.charcoal" mb={4}>
              Recent Uploads
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {/* Recent Bank Statements */}
              {recentBankStatements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <HStack spacing={2}>
                        <Icon as={FileText} boxSize={5} />
                        <Text fontSize="lg">Bank Statements</Text>
                      </HStack>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VStack spacing={3} align="stretch">
                      {recentBankStatements.map((statement) => (
                        <HStack
                          key={statement.id}
                          gap={3}
                          p={3}
                          bg="previa.cream"
                          borderRadius="lg"
                          _hover={{ bg: 'previa.sand' }}
                          transition="background-color 0.2s"
                        >
                          <Icon as={FileText} boxSize={4} color="previa.stone" flexShrink={0} />
                          <VStack flex={1} align="stretch" spacing={1} minW={0}>
                            <Text fontSize="sm" fontWeight="medium" color="previa.charcoal" noOfLines={1}>
                              {getFileName(statement.file_path)}
                            </Text>
                            <HStack spacing={2}>
                              <Icon as={Clock} boxSize={3} color="previa.stone" />
                              <Text fontSize="xs" color="previa.stone">
                                {formatDate(statement.created_at)}
                              </Text>
                            </HStack>
                          </VStack>
                          <HStack spacing={2} flexShrink={0}>
                            {getStatusBadge(statement.processing_status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/onboarding/processing/${statement.id}`)}
                              p={1}
                            >
                              <Icon as={Eye} boxSize={4} />
                            </Button>
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </CardContent>
                </Card>
              )}

              {/* Recent Receipts */}
              {recentReceipts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <HStack spacing={2}>
                        <Icon as={Receipt} boxSize={5} />
                        <Text fontSize="lg">Receipts</Text>
                      </HStack>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VStack spacing={3} align="stretch">
                      {recentReceipts.map((receipt) => (
                        <HStack
                          key={receipt.id}
                          gap={3}
                          p={3}
                          bg="previa.cream"
                          borderRadius="lg"
                          _hover={{ bg: 'previa.sand' }}
                          transition="background-color 0.2s"
                        >
                          <Icon as={Receipt} boxSize={4} color="previa.stone" flexShrink={0} />
                          <VStack flex={1} align="stretch" spacing={1} minW={0}>
                            <Text fontSize="sm" fontWeight="medium" color="previa.charcoal" noOfLines={1}>
                              {receipt.merchant || getFileName(receipt.file_path)}
                            </Text>
                            <HStack spacing={2}>
                              <Icon as={Clock} boxSize={3} color="previa.stone" />
                              <Text fontSize="xs" color="previa.stone">
                                {formatDate(receipt.created_at)}
                              </Text>
                            </HStack>
                          </VStack>
                          <HStack spacing={2} flexShrink={0}>
                            {getStatusBadge(receipt.processing_status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/receipts/${receipt.id}`)}
                              p={1}
                            >
                              <Icon as={Eye} boxSize={4} />
                            </Button>
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
