/**
 * ReceiptDetails Page
 * Display receipt OCR data, AI match suggestions, and reconciliation interface
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Image,
  useToast,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Stack,
} from '@chakra-ui/react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Receipt as ReceiptIcon,
  Store,
  Phone,
  MapPin,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReceiptService } from '@/services/receiptService';
import { StatusBadge } from '@/components/receipt/StatusBadge';
import { ConfidenceIndicator, ConfidenceSummary } from '@/components/receipt/ConfidenceIndicator';
import { inferCategory, getCategoryColor, getCategoryIcon } from '@/utils/categoryInference';
import type { MockReceipt, AIMatchSuggestion } from '@/test/fixtures/receipt-mock-data';

/**
 * ReceiptDetails Page Component
 */
export function ReceiptDetails() {
  const { receiptId } = useParams<{ receiptId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch receipt data
  const {
    data: receipt,
    isLoading: isLoadingReceipt,
    error: receiptError,
  } = useQuery({
    queryKey: ['receipt', receiptId],
    queryFn: () => ReceiptService.fetchReceiptById(receiptId!),
    enabled: !!receiptId,
  });

  // Fetch AI match suggestions
  const {
    data: matchSuggestions,
    isLoading: isLoadingSuggestions,
  } = useQuery({
    queryKey: ['ai-match-suggestions', receiptId],
    queryFn: () => ReceiptService.fetchMatchSuggestions(receiptId!),
    enabled: !!receiptId && receipt?.processing_status === 'completed',
  });

  // Approve match mutation
  const approveMutation = useMutation({
    mutationFn: ({ suggestionId, transactionId }: { suggestionId: string; transactionId: string }) =>
      ReceiptService.approveMatchSuggestion(suggestionId, receiptId!, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-match-suggestions', receiptId] });
      toast({
        title: 'Match approved',
        description: 'Receipt has been reconciled with the transaction',
        status: 'success',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval failed',
        description: error.message || 'Failed to approve match',
        status: 'error',
        duration: 5000,
      });
    },
  });

  // Reject match mutation
  const rejectMutation = useMutation({
    mutationFn: (suggestionId: string) => ReceiptService.rejectMatchSuggestion(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-match-suggestions', receiptId] });
      toast({
        title: 'Match rejected',
        description: 'AI suggestion has been dismissed',
        status: 'info',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection failed',
        description: error.message || 'Failed to reject match',
        status: 'error',
        duration: 5000,
      });
    },
  });

  // Retry processing mutation
  const retryMutation = useMutation({
    mutationFn: () => ReceiptService.retryProcessing(receiptId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipt', receiptId] });
      toast({
        title: 'Processing restarted',
        description: 'Receipt processing has been restarted',
        status: 'success',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Retry failed',
        description: error.message || 'Failed to retry processing',
        status: 'error',
        duration: 5000,
      });
    },
  });

  if (isLoadingReceipt) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      </Container>
    );
  }

  if (receiptError || !receipt) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Failed to load receipt</AlertTitle>
          <AlertDescription>{(receiptError as Error)?.message || 'Receipt not found'}</AlertDescription>
        </Alert>
        <Button mt={4} leftIcon={<Icon as={ArrowLeft} />} onClick={() => navigate('/processing-status')}>
          Back to Receipts
        </Button>
      </Container>
    );
  }

  const category = receipt.category || inferCategory(receipt.merchant);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center" gap={3}>
          <IconButton
            icon={<Icon as={ArrowLeft} />}
            aria-label="Back"
            onClick={() => navigate('/processing-status')}
            variant="ghost"
          />
          <Box>
            <Heading size="lg">Receipt Details</Heading>
            <Text color="gray.600" fontSize="sm">
              {receipt.merchant || 'Unknown Merchant'}
            </Text>
          </Box>
        </Flex>

        <Flex gap={2}>
          {receipt.processing_status === 'failed' && (
            <Button
              leftIcon={<Icon as={RefreshCw} />}
              colorScheme="blue"
              onClick={() => retryMutation.mutate()}
              isLoading={retryMutation.isPending}
            >
              Retry Processing
            </Button>
          )}
          <Button variant="outline" leftIcon={<Icon as={Download} />}>
            Download
          </Button>
        </Flex>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Left Column - Receipt Details */}
        <Box>
          {/* Status Card */}
          <Card mb={6}>
            <CardBody>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Processing Status
                  </Text>
                  <StatusBadge status={receipt.processing_status} size="lg" />
                </Box>

                {receipt.confidence_score && (
                  <Box textAlign="right">
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Overall Confidence
                    </Text>
                    <ConfidenceIndicator score={receipt.confidence_score} size="lg" variant="badge" />
                  </Box>
                )}
              </Flex>

              {receipt.error_message && (
                <Alert status="error" mt={4}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Processing Error</AlertTitle>
                    <AlertDescription>{receipt.error_message}</AlertDescription>
                  </Box>
                </Alert>
              )}
            </CardBody>
          </Card>

          {/* Merchant Information */}
          {receipt.ocr_data?.merchant && (
            <Card mb={6}>
              <CardHeader>
                <Heading size="md">Merchant Information</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={3}>
                  <Flex align="center" gap={3}>
                    <Text fontSize="2xl">{categoryIcon}</Text>
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">
                        {receipt.ocr_data.merchant.name}
                      </Text>
                      <Badge colorScheme={categoryColor}>{category}</Badge>
                    </Box>
                  </Flex>

                  {receipt.ocr_data.merchant.address && (
                    <Flex gap={2}>
                      <Icon as={MapPin} color="gray.500" />
                      <Text fontSize="sm">{receipt.ocr_data.merchant.address}</Text>
                    </Flex>
                  )}

                  {receipt.ocr_data.merchant.phone && (
                    <Flex gap={2}>
                      <Icon as={Phone} color="gray.500" />
                      <Text fontSize="sm">{receipt.ocr_data.merchant.phone}</Text>
                    </Flex>
                  )}

                  {receipt.ocr_data.merchant.abn && (
                    <Flex gap={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        ABN:
                      </Text>
                      <Text fontSize="sm">{receipt.ocr_data.merchant.abn}</Text>
                    </Flex>
                  )}

                  <ConfidenceIndicator
                    score={receipt.ocr_data.merchant.confidence_score}
                    size="sm"
                    variant="progress"
                  />
                </Stack>
              </CardBody>
            </Card>
          )}

          {/* Transaction Details */}
          {receipt.ocr_data?.transaction && (
            <Card mb={6}>
              <CardHeader>
                <Heading size="md">Transaction Details</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Date
                    </Text>
                    <Flex align="center" gap={2}>
                      <Icon as={Calendar} color="gray.500" />
                      <Text fontWeight="medium">{receipt.ocr_data.transaction.date}</Text>
                    </Flex>
                  </Box>

                  {receipt.ocr_data.transaction.time && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Time
                      </Text>
                      <Text fontWeight="medium">{receipt.ocr_data.transaction.time}</Text>
                    </Box>
                  )}

                  {receipt.ocr_data.transaction.receipt_number && (
                    <Box gridColumn="span 2">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Receipt Number
                      </Text>
                      <Text fontWeight="medium">{receipt.ocr_data.transaction.receipt_number}</Text>
                    </Box>
                  )}
                </Grid>

                <Box mt={4}>
                  <ConfidenceIndicator
                    score={receipt.ocr_data.transaction.confidence_score}
                    size="sm"
                    variant="progress"
                  />
                </Box>
              </CardBody>
            </Card>
          )}

          {/* Line Items */}
          {receipt.ocr_data?.line_items && receipt.ocr_data.line_items.length > 0 && (
            <Card mb={6}>
              <CardHeader>
                <Heading size="md">Line Items</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Item</Th>
                      <Th isNumeric>Qty</Th>
                      <Th isNumeric>Unit Price</Th>
                      <Th isNumeric>Subtotal</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {receipt.ocr_data.line_items.map((item, index) => (
                      <Tr key={index}>
                        <Td>
                          <Text fontSize="sm">{item.description}</Text>
                          <ConfidenceIndicator
                            score={item.confidence_score}
                            size="sm"
                            variant="icon"
                            showLabel={false}
                          />
                        </Td>
                        <Td isNumeric>{item.quantity}</Td>
                        <Td isNumeric>${(item.unit_price / 100).toFixed(2)}</Td>
                        <Td isNumeric fontWeight="medium">
                          ${(item.subtotal / 100).toFixed(2)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          )}

          {/* Payment Summary */}
          {receipt.ocr_data?.payment && (
            <Card>
              <CardHeader>
                <Heading size="md">Payment Summary</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={3}>
                  {receipt.ocr_data.payment.method && (
                    <Flex justify="space-between">
                      <Text color="gray.600">Payment Method</Text>
                      <Badge>{receipt.ocr_data.payment.method}</Badge>
                    </Flex>
                  )}

                  <Flex justify="space-between">
                    <Text color="gray.600">Subtotal</Text>
                    <Text fontWeight="medium">
                      ${(receipt.ocr_data.payment.subtotal / 100).toFixed(2)}
                    </Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text color="gray.600">GST (10%)</Text>
                    <Text fontWeight="medium">${(receipt.ocr_data.payment.tax / 100).toFixed(2)}</Text>
                  </Flex>

                  <Divider />

                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">
                      Total
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      ${(receipt.ocr_data.payment.total / 100).toFixed(2)}
                    </Text>
                  </Flex>

                  <ConfidenceIndicator
                    score={receipt.ocr_data.payment.confidence_score}
                    size="sm"
                    variant="progress"
                  />
                </Stack>
              </CardBody>
            </Card>
          )}
        </Box>

        {/* Right Column - AI Match Suggestions */}
        <Box>
          <Card position="sticky" top={4}>
            <CardHeader>
              <Heading size="md">AI Match Suggestions</Heading>
              <Text fontSize="sm" color="gray.600" mt={1}>
                Top transactions matching this receipt
              </Text>
            </CardHeader>
            <CardBody>
              {isLoadingSuggestions ? (
                <Flex justify="center" py={8}>
                  <Spinner color="purple.500" />
                </Flex>
              ) : matchSuggestions && matchSuggestions.length > 0 ? (
                <Stack spacing={4}>
                  {matchSuggestions.map((suggestion: any) => (
                    <AIMatchCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onApprove={() =>
                        approveMutation.mutate({
                          suggestionId: suggestion.id,
                          transactionId: suggestion.transaction_id,
                        })
                      }
                      onReject={() => rejectMutation.mutate(suggestion.id)}
                      isApproving={approveMutation.isPending}
                      isRejecting={rejectMutation.isPending}
                    />
                  ))}
                </Stack>
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>No matches found</AlertTitle>
                    <AlertDescription fontSize="sm">
                      No matching transactions were found in the last 90 days
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </CardBody>
          </Card>
        </Box>
      </Grid>
    </Container>
  );
}

/**
 * AIMatchCard Component
 */
interface AIMatchCardProps {
  suggestion: any;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function AIMatchCard({ suggestion, onApprove, onReject, isApproving, isRejecting }: AIMatchCardProps) {
  const transaction = suggestion.transaction;
  const isApproved = suggestion.status === 'approved';
  const isRejected = suggestion.status === 'rejected';

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor={isApproved ? 'green.200' : isRejected ? 'red.200' : 'gray.200'}
      bg={isApproved ? 'green.50' : isRejected ? 'red.50' : 'white'}
    >
      <Flex justify="space-between" align="start" mb={2}>
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
            {transaction?.description || 'Unknown Transaction'}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {transaction?.transaction_date}
          </Text>
        </Box>
        <ConfidenceIndicator score={suggestion.confidence_score} size="sm" variant="icon" />
      </Flex>

      <Text fontSize="lg" fontWeight="bold" color="purple.600" mb={2}>
        ${Math.abs((transaction?.amount || 0) / 100).toFixed(2)}
      </Text>

      <Text fontSize="xs" color="gray.600" mb={3}>
        {suggestion.match_reason}
      </Text>

      {!isApproved && !isRejected && (
        <Flex gap={2}>
          <Button
            size="sm"
            colorScheme="green"
            leftIcon={<Icon as={CheckCircle} />}
            onClick={onApprove}
            isLoading={isApproving}
            flex={1}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            leftIcon={<Icon as={XCircle} />}
            onClick={onReject}
            isLoading={isRejecting}
            flex={1}
          >
            Reject
          </Button>
        </Flex>
      )}

      {isApproved && (
        <Badge colorScheme="green" w="100%" textAlign="center" py={2}>
          <Icon as={CheckCircle} mr={1} />
          Approved
        </Badge>
      )}

      {isRejected && (
        <Badge colorScheme="red" w="100%" textAlign="center" py={2}>
          <Icon as={XCircle} mr={1} />
          Rejected
        </Badge>
      )}
    </Box>
  );
}

export default ReceiptDetails;
