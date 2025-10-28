import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Icon,
  Button,
  Progress,
  useToast as useChakraToast,
} from '@chakra-ui/react';
import { Card, CardContent } from '@/components/chakra-ui/card';
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
  const toast = useChakraToast();
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
        status: 'error',
        duration: 5000,
        isClosable: true,
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
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to processing status screen
      navigate(`/onboarding/processing/${statement.id}`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="previa.cream"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box maxW="2xl" w="full">
        <VStack spacing={2} align="start" mb={8}>
          <Heading as="h1" size="xl" color="previa.charcoal">
            Upload Your Bank Statement
          </Heading>
          <Text color="previa.stone">
            Upload a PDF or CSV file from your bank. We'll extract your account details and transactions.
          </Text>
        </VStack>

        <Card>
          <CardContent>
            <Box
              {...getRootProps()}
              border="2px dashed"
              borderColor={isDragActive ? 'previa.charcoal' : 'previa.stone'}
              borderRadius="lg"
              p={12}
              textAlign="center"
              cursor="pointer"
              bg={isDragActive ? 'previa.sand' : 'white'}
              transition="all 0.2s"
              _hover={{
                borderColor: 'previa.charcoal',
                bg: 'previa.sand',
              }}
            >
              <input {...getInputProps()} />
              <Icon as={Upload} w={12} h={12} color="previa.stone" mx="auto" mb={4} />
              {file ? (
                <Flex align="center" justify="center" gap={2}>
                  <Icon as={FileText} w={5} h={5} color="previa.charcoal" />
                  <Text color="previa.charcoal" fontWeight="medium">{file.name}</Text>
                  <Text color="previa.stone" fontSize="sm">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Text>
                </Flex>
              ) : (
                <VStack spacing={2}>
                  <Text color="previa.charcoal" fontWeight="medium">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your bank statement'}
                  </Text>
                  <Text color="previa.stone" fontSize="sm">
                    or click to browse (PDF or CSV, max 50MB)
                  </Text>
                </VStack>
              )}
            </Box>

            {uploading && (
              <VStack spacing={2} mt={6}>
                <Progress
                  value={uploadProgress}
                  colorScheme="green"
                  size="sm"
                  w="full"
                  hasStripe
                  isAnimated
                />
                <Text color="previa.stone" fontSize="sm">
                  Uploading... {uploadProgress}%
                </Text>
              </VStack>
            )}

            <Button
              size="lg"
              w="full"
              mt={6}
              isDisabled={!file || uploading}
              isLoading={uploading}
              loadingText="Uploading..."
              onClick={handleUpload}
              bg="previa.charcoal"
              color="white"
              _hover={{ bg: 'previa.darkStone' }}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
