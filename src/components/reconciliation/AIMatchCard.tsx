/**
 * AIMatchCard - Side-by-side comparison of AI-suggested transaction-receipt match
 *
 * Shows transaction (left) vs receipt (right) with field-level confidence indicators
 * Used in Story 4.3: Interactive Matching Interface
 */

import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { Badge } from '@/components/chakra-ui/badge';
import { Button } from '@/components/chakra-ui/button';
import { Card } from '@/components/chakra-ui/card';
import { CheckCircle, AlertTriangle, XCircle, Check, X, SkipForward } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import type { Transaction, Receipt } from '@/types/financial';

export interface AIMatchCardProps {
  suggestionId: string;
  transaction: Transaction;
  receipt: Receipt;
  confidenceScore: number; // 0-1 scale
  matchReason: string;
  onApprove: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  onSkip?: (suggestionId: string) => void;
  isLoading?: boolean;
}

interface FieldComparison {
  color: string;
  icon: typeof CheckCircle;
  text: string;
  textColor: string;
}

export function AIMatchCard({
  suggestionId,
  transaction,
  receipt,
  confidenceScore,
  matchReason,
  onApprove,
  onReject,
  onSkip,
  isLoading = false,
}: AIMatchCardProps) {

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount / 100));
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  // Get confidence badge
  const getConfidenceBadge = () => {
    if (confidenceScore >= 0.80) {
      return <Badge colorScheme="green" size="sm">High Confidence ({Math.round(confidenceScore * 100)}%)</Badge>;
    } else if (confidenceScore >= 0.50) {
      return <Badge colorScheme="yellow" size="sm">Medium Confidence ({Math.round(confidenceScore * 100)}%)</Badge>;
    } else {
      return <Badge colorScheme="red" size="sm">Low Confidence ({Math.round(confidenceScore * 100)}%)</Badge>;
    }
  };

  // Compare dates
  const getDateComparison = (): FieldComparison => {
    const txDate = new Date(transaction.transaction_date);
    const rcDate = new Date(receipt.receipt_date || new Date());
    const daysDiff = Math.abs(differenceInDays(txDate, rcDate));

    if (daysDiff === 0) {
      return {
        color: 'green.50',
        icon: CheckCircle,
        text: 'Exact match',
        textColor: 'green.700',
      };
    } else if (daysDiff <= 3) {
      return {
        color: 'yellow.50',
        icon: AlertTriangle,
        text: `${daysDiff} day${daysDiff > 1 ? 's' : ''} apart`,
        textColor: 'yellow.700',
      };
    } else {
      return {
        color: 'red.50',
        icon: XCircle,
        text: `${daysDiff} days apart`,
        textColor: 'red.700',
      };
    }
  };

  // Compare amounts
  const getAmountComparison = (): FieldComparison => {
    const txAmount = Math.abs(transaction.amount);
    const rcAmount = receipt.amount ? receipt.amount * 100 : 0; // Convert receipt amount to cents
    const diff = Math.abs(txAmount - rcAmount);

    if (diff === 0) {
      return {
        color: 'green.50',
        icon: CheckCircle,
        text: 'Exact match',
        textColor: 'green.700',
      };
    } else if (diff <= 500) { // Within $5
      return {
        color: 'yellow.50',
        icon: AlertTriangle,
        text: `${formatCurrency(diff)} difference`,
        textColor: 'yellow.700',
      };
    } else {
      return {
        color: 'red.50',
        icon: XCircle,
        text: `${formatCurrency(diff)} difference`,
        textColor: 'red.700',
      };
    }
  };

  // Compare description/merchant (using simple includes check)
  const getDescriptionComparison = (): FieldComparison => {
    const descLower = transaction.description?.toLowerCase() || '';
    const merchantLower = receipt.merchant?.toLowerCase() || '';

    // Simple similarity heuristic
    let similarity = 0;
    if (descLower.includes(merchantLower) || merchantLower.includes(descLower)) {
      similarity = 0.7; // High similarity
    } else {
      // Check for common words
      const descWords = descLower.split(/\s+/);
      const merchantWords = merchantLower.split(/\s+/);
      const commonWords = descWords.filter(word =>
        word.length > 3 && merchantWords.some(mw => mw.includes(word) || word.includes(mw))
      );
      similarity = commonWords.length > 0 ? 0.5 : 0.2;
    }

    const percent = Math.round(similarity * 100);

    if (similarity >= 0.6) {
      return {
        color: 'green.50',
        icon: CheckCircle,
        text: `${percent}% similar`,
        textColor: 'green.700',
      };
    } else if (similarity >= 0.3) {
      return {
        color: 'yellow.50',
        icon: AlertTriangle,
        text: `${percent}% similar`,
        textColor: 'yellow.700',
      };
    } else {
      return {
        color: 'red.50',
        icon: XCircle,
        text: `${percent}% similar`,
        textColor: 'red.700',
      };
    }
  };

  const dateComp = getDateComparison();
  const amountComp = getAmountComparison();
  const descComp = getDescriptionComparison();

  return (
    <Card.Root variant="outline" borderWidth="1px" borderColor="previa.sand">
      <Card.Body gap={4}>
        {/* Header: Confidence Badge + Actions */}
        <Flex justify="space-between" align="center">
          {getConfidenceBadge()}
          <HStack gap={2}>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => onApprove(suggestionId)}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <Icon as={Check} boxSize={4} mr={1} />
              Approve (A)
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={() => onReject(suggestionId)}
              disabled={isLoading}
            >
              <Icon as={X} boxSize={4} mr={1} />
              Reject (R)
            </Button>
            {onSkip && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSkip(suggestionId)}
                disabled={isLoading}
              >
                <Icon as={SkipForward} boxSize={4} mr={1} />
                Skip (N)
              </Button>
            )}
          </HStack>
        </Flex>

        {/* AI Match Reason */}
        <Box bg="blue.50" p={3} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
          <Text fontSize="sm" color="blue.900" fontWeight="medium">
            AI Suggestion: {matchReason}
          </Text>
        </Box>

        {/* Side-by-Side Comparison */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Left: Transaction */}
          <GridItem>
            <VStack align="stretch" gap={3}>
              <Text fontSize="sm" fontWeight="bold" color="previa.charcoal" mb={2}>
                Transaction
              </Text>

              {/* Date Field */}
              <Box bg={dateComp.color} p={3} borderRadius="md">
                <Text fontSize="xs" color="previa.stone" mb={1}>Date</Text>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" fontWeight="medium" color={dateComp.textColor}>
                    {formatDate(transaction.transaction_date)}
                  </Text>
                  <Icon as={dateComp.icon} boxSize={4} color={dateComp.textColor} />
                </Flex>
                <Text fontSize="xs" color={dateComp.textColor} mt={1}>{dateComp.text}</Text>
              </Box>

              {/* Description Field */}
              <Box bg={descComp.color} p={3} borderRadius="md">
                <Text fontSize="xs" color="previa.stone" mb={1}>Description</Text>
                <Flex justify="space-between" align="start">
                  <Text fontSize="sm" fontWeight="medium" color={descComp.textColor} noOfLines={2} flex={1}>
                    {transaction.description}
                  </Text>
                  <Icon as={descComp.icon} boxSize={4} color={descComp.textColor} ml={2} flexShrink={0} />
                </Flex>
                <Text fontSize="xs" color={descComp.textColor} mt={1}>{descComp.text}</Text>
              </Box>

              {/* Amount Field */}
              <Box bg={amountComp.color} p={3} borderRadius="md">
                <Text fontSize="xs" color="previa.stone" mb={1}>Amount</Text>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" fontWeight="bold" fontFamily="mono" color={amountComp.textColor}>
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Icon as={amountComp.icon} boxSize={4} color={amountComp.textColor} />
                </Flex>
                <Text fontSize="xs" color={amountComp.textColor} mt={1}>{amountComp.text}</Text>
              </Box>

              {/* Category (if available) */}
              {transaction.category && (
                <Box bg="gray.50" p={2} borderRadius="md">
                  <Text fontSize="xs" color="previa.stone">Category</Text>
                  <Text fontSize="sm" fontWeight="medium" color="previa.charcoal">
                    {transaction.category}
                  </Text>
                </Box>
              )}
            </VStack>
          </GridItem>

          {/* Right: Receipt */}
          <GridItem>
            <VStack align="stretch" gap={3}>
              <Text fontSize="sm" fontWeight="bold" color="previa.charcoal" mb={2}>
                Receipt
              </Text>

              {/* Date Field */}
              <Box bg={dateComp.color} p={3} borderRadius="md">
                <Text fontSize="xs" color="previa.stone" mb={1}>Date</Text>
                <Text fontSize="sm" fontWeight="medium" color={dateComp.textColor}>
                  {receipt.receipt_date ? formatDate(receipt.receipt_date) : 'N/A'}
                </Text>
              </Box>

              {/* Merchant Field */}
              <Box bg={descComp.color} p={3} borderRadius="md">
                <Text fontSize="xs" color="previa.stone" mb={1}>Merchant</Text>
                <Text fontSize="sm" fontWeight="medium" color={descComp.textColor} noOfLines={2}>
                  {receipt.merchant || 'Unknown'}
                </Text>
              </Box>

              {/* Amount Field */}
              <Box bg={amountComp.color} p={3} borderRadius="md">
                <Text fontSize="xs" color="previa.stone" mb={1}>Amount</Text>
                <Text fontSize="sm" fontWeight="bold" fontFamily="mono" color={amountComp.textColor}>
                  {receipt.amount ? formatCurrency(receipt.amount * 100) : 'N/A'}
                </Text>
              </Box>

              {/* Tax (if available) */}
              {receipt.tax && (
                <Box bg="gray.50" p={2} borderRadius="md">
                  <Text fontSize="xs" color="previa.stone">Tax (GST)</Text>
                  <Text fontSize="sm" fontWeight="medium" color="previa.charcoal">
                    {formatCurrency(receipt.tax * 100)}
                  </Text>
                </Box>
              )}
            </VStack>
          </GridItem>
        </Grid>

        {/* Keyboard Shortcuts Hint */}
        <Box bg="previa.cream" p={2} borderRadius="md" mt={2}>
          <Text fontSize="xs" color="previa.stone" textAlign="center">
            Keyboard shortcuts: <Text as="span" fontWeight="bold">A</Text> = Approve, <Text as="span" fontWeight="bold">R</Text> = Reject, <Text as="span" fontWeight="bold">N</Text> = Next/Skip
          </Text>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
