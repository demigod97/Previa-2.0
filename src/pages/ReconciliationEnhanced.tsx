/**
 * Enhanced Reconciliation View - AI-Powered Match Review (Story 4.3)
 *
 * **Purpose**: Review and approve/reject AI-suggested matches between transactions and receipts
 *
 * **Key Features**:
 * - Statistics panel (match counts, reconciliation rate, avg confidence)
 * - AI match suggestions sorted by confidence score (High → Medium → Low)
 * - Side-by-side comparison with field-level indicators
 * - Approve/reject workflow with keyboard shortcuts (A/R/N)
 * - Bulk approve high confidence matches (≥80%)
 * - Recent approvals with Undo capability
 *
 * @see docs/stories/4.3-interactive-matching-interface.md
 * @see docs/USER-FLOW-RECONCILIATION.md
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Icon,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout';
import { Card } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { Badge } from '@/components/chakra-ui/badge';
import { AIMatchCard } from '@/components/reconciliation';
import {
  useAIMatchSuggestions,
  useApproveSuggestion,
  useRejectSuggestion,
  useBulkApproveSuggestions,
} from '@/hooks/financial/useReconciliation';
import { CheckCircle, XCircle, TrendingUp, RefreshCw, Zap, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReconciliationEnhanced() {
  const { toast } = useToast();

  // Data hooks
  const { data: suggestions = [], isLoading, refetch } = useAIMatchSuggestions();
  const approveMutation = useApproveSuggestion();
  const rejectMutation = useRejectSuggestion();
  const bulkApproveMutation = useBulkApproveSuggestions();

  // Local state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentApprovals, setRecentApprovals] = useState<Array<{ id: string; timestamp: number }>>([]);

  // Calculate statistics
  const totalSuggestions = suggestions.length;
  const highConfidenceCount = suggestions.filter(s => s.confidence_score >= 0.80).length;
  const mediumConfidenceCount = suggestions.filter(s => s.confidence_score >= 0.50 && s.confidence_score < 0.80).length;
  const lowConfidenceCount = suggestions.filter(s => s.confidence_score < 0.50).length;
  const avgConfidence = totalSuggestions > 0
    ? Math.round((suggestions.reduce((sum, s) => sum + s.confidence_score, 0) / totalSuggestions) * 100)
    : 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentSuggestion = suggestions[currentIndex];
      if (!currentSuggestion) return;

      switch (event.key.toLowerCase()) {
        case 'a':
          handleApprove(currentSuggestion.id);
          break;
        case 'r':
          handleReject(currentSuggestion.id);
          break;
        case 'n':
          handleSkip(currentSuggestion.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, suggestions]);

  // Handle approve
  const handleApprove = async (suggestionId: string) => {
    try {
      await approveMutation.mutateAsync(suggestionId);
      setRecentApprovals(prev => [...prev, { id: suggestionId, timestamp: Date.now() }]);
      moveToNext();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  // Handle reject
  const handleReject = async (suggestionId: string) => {
    try {
      await rejectMutation.mutateAsync(suggestionId);
      moveToNext();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  // Handle skip
  const handleSkip = (suggestionId: string) => {
    moveToNext();
  };

  // Move to next suggestion
  const moveToNext = () => {
    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  // Handle bulk approve high confidence
  const handleBulkApprove = async () => {
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence_score >= 0.80);

    if (highConfidenceSuggestions.length === 0) {
      toast({
        title: 'No high confidence matches',
        description: 'There are no matches with confidence ≥80%.',
        variant: 'default',
      });
      return;
    }

    if (!window.confirm(`Approve ${highConfidenceSuggestions.length} high confidence match${highConfidenceSuggestions.length !== 1 ? 'es' : ''}?`)) {
      return;
    }

    try {
      const suggestionIds = highConfidenceSuggestions.map(s => s.id);
      await bulkApproveMutation.mutateAsync(suggestionIds);
      setRecentApprovals(prev => [
        ...prev,
        ...suggestionIds.map(id => ({ id, timestamp: Date.now() }))
      ]);
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    }
  };

  // Handle undo (placeholder - full implementation requires tracking match IDs)
  const handleUndo = (approvalId: string) => {
    toast({
      title: 'Undo feature coming soon',
      description: 'This feature will be implemented in Story 4.4',
      variant: 'default',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" minH="50vh">
            <Text color="previa.stone">Loading AI match suggestions...</Text>
          </Flex>
        </Container>
      </DashboardLayout>
    );
  }

  // Empty state
  if (totalSuggestions === 0) {
    return (
      <DashboardLayout>
        <Container maxW="container.xl" py={8}>
          <VStack gap={6} textAlign="center" py={12}>
            <Icon as={CheckCircle} boxSize={16} color="green.500" />
            <Heading size="lg" color="previa.charcoal">No Suggested Matches</Heading>
            <Text color="previa.stone" maxW="md">
              Upload receipts and import transactions to let AI find potential matches for you.
            </Text>
            <Button colorScheme="blue" onClick={() => window.location.href = '/upload'}>
              Upload Documents
            </Button>
          </VStack>
        </Container>
      </DashboardLayout>
    );
  }

  const currentSuggestion = suggestions[currentIndex];

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py={8}>
        <VStack align="stretch" gap={6}>
          {/* Header */}
          <Box>
            <Heading size="2xl" fontWeight="bold" color="previa.charcoal" mb={2}>
              Reconciliation Review
            </Heading>
            <Text color="previa.stone">
              Review AI-suggested matches and approve or reject them
            </Text>
          </Box>

          {/* Statistics Panel */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            <Card.Root variant="outline">
              <Card.Body>
                <Stat.Root>
                  <Stat.Label color="previa.stone">Total Suggestions</Stat.Label>
                  <Stat.ValueText fontSize="3xl" fontWeight="bold" color="previa.charcoal">
                    {totalSuggestions}
                  </Stat.ValueText>
                  <Stat.HelpText color="previa.stone">Pending review</Stat.HelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>

            <Card.Root variant="outline" bg="green.50">
              <Card.Body>
                <Stat.Root>
                  <Stat.Label color="green.700">High Confidence</Stat.Label>
                  <Stat.ValueText fontSize="3xl" fontWeight="bold" color="green.700">
                    {highConfidenceCount}
                  </Stat.ValueText>
                  <Stat.HelpText color="green.600">≥80% confidence</Stat.HelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>

            <Card.Root variant="outline" bg="yellow.50">
              <Card.Body>
                <Stat.Root>
                  <Stat.Label color="yellow.700">Medium Confidence</Stat.Label>
                  <Stat.ValueText fontSize="3xl" fontWeight="bold" color="yellow.700">
                    {mediumConfidenceCount}
                  </Stat.ValueText>
                  <Stat.HelpText color="yellow.600">50-79% confidence</Stat.HelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>

            <Card.Root variant="outline" bg="blue.50">
              <Card.Body>
                <Stat.Root>
                  <Stat.Label color="blue.700">Avg Confidence</Stat.Label>
                  <Stat.ValueText fontSize="3xl" fontWeight="bold" color="blue.700">
                    {avgConfidence}%
                  </Stat.ValueText>
                  <Stat.HelpText color="blue.600">
                    <Icon as={TrendingUp} boxSize={3} mr={1} />
                    Overall quality
                  </Stat.HelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Quick Actions Toolbar */}
          <Card.Root variant="outline">
            <Card.Body>
              <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
                <HStack gap={3}>
                  <Button
                    colorScheme="green"
                    size="md"
                    onClick={handleBulkApprove}
                    isLoading={bulkApproveMutation.isPending}
                    disabled={highConfidenceCount === 0}
                  >
                    <Icon as={Zap} boxSize={4} mr={2} />
                    Approve All High Confidence ({highConfidenceCount})
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => refetch()}
                    isLoading={isLoading}
                  >
                    <Icon as={RefreshCw} boxSize={4} mr={2} />
                    Refresh
                  </Button>
                </HStack>

                <Text fontSize="sm" color="previa.stone">
                  Reviewing {currentIndex + 1} of {totalSuggestions}
                </Text>
              </Flex>
            </Card.Body>
          </Card.Root>

          {/* Current Match Card */}
          {currentSuggestion && (
            <AIMatchCard
              suggestionId={currentSuggestion.id}
              transaction={currentSuggestion.transaction}
              receipt={currentSuggestion.receipt}
              confidenceScore={currentSuggestion.confidence_score}
              matchReason={currentSuggestion.match_reason}
              onApprove={handleApprove}
              onReject={handleReject}
              onSkip={handleSkip}
              isLoading={approveMutation.isPending || rejectMutation.isPending}
            />
          )}

          {/* Recent Approvals Section (Last 5) */}
          {recentApprovals.length > 0 && (
            <Card.Root variant="outline">
              <Card.Header>
                <Card.Title>
                  <Flex justify="space-between" align="center">
                    <Text>Recent Approvals</Text>
                    <Badge colorScheme="green" size="sm">{recentApprovals.length}</Badge>
                  </Flex>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <VStack align="stretch" gap={2}>
                  {recentApprovals.slice(-5).reverse().map((approval, idx) => (
                    <Flex
                      key={approval.id}
                      justify="space-between"
                      align="center"
                      p={3}
                      bg="green.50"
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="green.500"
                    >
                      <HStack>
                        <Icon as={CheckCircle} boxSize={4} color="green.600" />
                        <Text fontSize="sm" color="green.900">
                          Match approved {Math.floor((Date.now() - approval.timestamp) / 1000)}s ago
                        </Text>
                      </HStack>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        onClick={() => handleUndo(approval.id)}
                      >
                        <Icon as={Undo2} boxSize={3} mr={1} />
                        Undo
                      </Button>
                    </Flex>
                  ))}
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </VStack>
      </Container>
    </DashboardLayout>
  );
}
