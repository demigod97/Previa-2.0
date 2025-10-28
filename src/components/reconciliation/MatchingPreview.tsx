/**
 * MatchingPreview - Preview and approve/reject transaction-receipt matches
 */

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress as ChakraProgress,
  Icon,
  List,
  ListItem,
} from '@chakra-ui/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { ArrowLeftRight, Check, X, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction, Receipt } from '@/types/financial';

export interface MatchingPreviewProps {
  transaction: Transaction;
  receipt: Receipt;
  confidenceScore: number;
  matchReasons?: string[];
  onApprove: () => void;
  onReject: () => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

/**
 * MatchingPreview component displays potential match with confidence score
 */
export function MatchingPreview({
  transaction,
  receipt,
  confidenceScore,
  matchReasons = [],
  onApprove,
  onReject,
  onEdit,
  isLoading = false,
}: MatchingPreviewProps) {
  const formatAmount = (amount: number): string => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(absAmount / 100);
  };

  const getConfidenceColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate amount difference
  const amountDiff = Math.abs(transaction.amount - (receipt.amount || 0));
  const amountMatch = amountDiff === 0 ? 'exact' : amountDiff <= 50 ? 'close' : 'different';

  // Calculate date difference in days
  const txDate = new Date(transaction.transaction_date);
  const rcDate = new Date(receipt.receipt_date || new Date());
  const dateDiff = Math.abs(Math.floor((txDate.getTime() - rcDate.getTime()) / (1000 * 60 * 60 * 24)));
  const dateMatch = dateDiff === 0 ? 'exact' : dateDiff <= 2 ? 'close' : 'different';

  // Generate default match reasons if none provided
  const displayReasons = matchReasons.length > 0 ? matchReasons : [
    `Amount: ${amountMatch} (${formatAmount(amountDiff)} difference)`,
    `Date: ${dateMatch} (${dateDiff} days apart)`,
    receipt.merchant ? `Merchant: ${receipt.merchant}` : 'Merchant: Unknown',
  ];

  return (
    <Card borderColor="previa.sand">
      <CardHeader>
        <CardTitle>
          <HStack spacing={2}>
            <Icon as={ArrowLeftRight} w={5} h={5} color="previa.sand" />
            <Text fontSize="lg" color="previa.charcoal">Match Preview</Text>
          </HStack>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <VStack spacing={6} align="stretch">
          {/* Transaction Details */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="xs" fontWeight="semibold" color="previa.darkStone" textTransform="uppercase" letterSpacing="wide">
              Transaction
            </Text>
            <Box bg="previa.cream" p={3} borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" color="previa.charcoal" noOfLines={1}>
                {transaction.description}
              </Text>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="xs" color="previa.stone">
                  {format(txDate, 'dd/MM/yyyy')}
                </Text>
                <Text fontFamily="mono" fontSize="sm" fontWeight="semibold" color="previa.charcoal">
                  {formatAmount(transaction.amount)}
                </Text>
              </HStack>
            </Box>
          </VStack>

          {/* Receipt Details */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="xs" fontWeight="semibold" color="previa.darkStone" textTransform="uppercase" letterSpacing="wide">
              Receipt
            </Text>
            <Box bg="previa.cream" p={3} borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" color="previa.charcoal" noOfLines={1}>
                {receipt.merchant || 'Unknown Merchant'}
              </Text>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="xs" color="previa.stone">
                  {format(rcDate, 'dd/MM/yyyy')}
                </Text>
                <Text fontFamily="mono" fontSize="sm" fontWeight="semibold" color="previa.charcoal">
                  {formatAmount(receipt.amount || 0)}
                </Text>
              </HStack>
            </Box>
          </VStack>

          {/* Confidence Score */}
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="xs" fontWeight="semibold" color="previa.darkStone" textTransform="uppercase" letterSpacing="wide">
                Confidence Score
              </Text>
              <Text
                fontFamily="mono"
                fontSize="2xl"
                fontWeight="bold"
                color={confidenceScore >= 80 ? 'green.600' : confidenceScore >= 50 ? 'yellow.600' : 'red.600'}
              >
                {confidenceScore}%
              </Text>
            </HStack>
            <ChakraProgress
              value={confidenceScore}
              h={2}
              borderRadius="full"
              colorScheme={confidenceScore >= 80 ? 'green' : confidenceScore >= 50 ? 'yellow' : 'red'}
              bg="previa.stone"
              bgOpacity={0.2}
            />
          </VStack>

          {/* Match Reasons */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="xs" fontWeight="semibold" color="previa.darkStone" textTransform="uppercase" letterSpacing="wide">
              Match Analysis
            </Text>
            <List spacing={1}>
              {displayReasons.map((reason, index) => (
                <ListItem key={index} fontSize="xs" color="previa.stone">
                  <HStack align="flex-start" spacing={2}>
                    <Text>•</Text>
                    <Text>{reason}</Text>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </VStack>

          {/* Action Buttons */}
          <HStack spacing={2} pt={2}>
            <Button
              onClick={onApprove}
              isDisabled={isLoading}
              isLoading={isLoading}
              flex={1}
              bg="green.600"
              color="white"
              _hover={{ bg: 'green.700' }}
              leftIcon={<Icon as={Check} w={4} h={4} />}
            >
              Approve Match
            </Button>
            <Button
              onClick={onReject}
              isDisabled={isLoading}
              flex={1}
              variant="ghost"
              color="red.600"
              _hover={{ bg: 'red.50' }}
              leftIcon={<Icon as={X} w={4} h={4} />}
            >
              Reject
            </Button>
            {onEdit && (
              <Button
                onClick={onEdit}
                isDisabled={isLoading}
                variant="outline"
                size="icon"
              >
                <Icon as={Edit} w={4} h={4} />
              </Button>
            )}
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

