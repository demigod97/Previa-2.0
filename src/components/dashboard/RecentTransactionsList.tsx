import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { Badge } from '@/components/chakra-ui/badge';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import type { Transaction } from '@/types/financial';
import { TransactionCardSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/EmptyState';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  loading?: boolean;
  limit?: number;
}

/**
 * Recent Transactions List Component
 *
 * Displays the most recent transactions with:
 * - Description and category badge
 * - Transaction date with icon
 * - Amount with color coding (red/green)
 * - "View All" link to full transactions page
 *
 * Follows Previa notebook design system:
 * - Paper white background for transaction cards
 * - Ruled lines between transactions (like notebook paper)
 * - JetBrains Mono for amounts
 * - Emoji + icon blending for friendly feel
 */
export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions,
  loading = false,
  limit = 5,
}) => {
  const navigate = useNavigate();

  // Get the most recent transactions
  const recentTransactions = transactions.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <Flex justify="space-between" align="center">
          <CardTitle fontSize="lg" color="previa.charcoal">
            <Flex align="center" gap={2}>
              📊 Recent Transactions
            </Flex>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/transactions')}
            color="previa.sand"
            minH="44px"
            minW="44px"
            _hover={{
              color: "previa.darkStone",
              bg: "previa.cream",
              transform: "scale(1.02)",
            }}
            _active={{ transform: "scale(0.98)" }}
            transition="all 0.15s"
          >
            View All
            <Icon as={ArrowRight} ml={1} w={4} h={4} />
          </Button>
        </Flex>
      </CardHeader>
      <CardContent>
        {loading ? (
          <TransactionCardSkeleton count={limit} />
        ) : recentTransactions.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No Transactions Yet"
            description="Upload your first bank statement to see your transactions here."
            action={
              <Button
                onClick={() => navigate('/onboarding/upload')}
                bg="previa.sand"
                color="previa.charcoal"
                _hover={{ bg: "previa.sand", opacity: 0.9 }}
              >
                Upload Statement
              </Button>
            }
            variant="outline"
            minH="240px"
          />
        ) : (
          <Box
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="previa.sand"
          >
            {recentTransactions.map((transaction, index) => (
              <Flex
                key={transaction.id}
                justify="space-between"
                align="center"
                p={3}
                minH="64px"
                cursor="pointer"
                borderTop={index > 0 ? "1px solid" : "none"}
                borderColor="previa.sand"
                borderTopRadius={index === 0 ? "lg" : "none"}
                borderBottomRadius={index === recentTransactions.length - 1 ? "lg" : "none"}
                _hover={{ bg: "previa.cream" }}
                transition="all 0.2s ease-out"
                onClick={() => navigate('/transactions')}
              >
                <Box flex={1} minW={0}>
                  <Flex align="center" gap={2} mb={1}>
                    <Text fontWeight="medium" noOfLines={1} color="previa.charcoal">
                      {transaction.description || 'Unknown'}
                    </Text>
                    {transaction.category && (
                      <Badge
                        variant="outline"
                        flexShrink={0}
                        bg="previa.cream"
                        borderColor="previa.sand"
                        color="previa.darkStone"
                      >
                        {transaction.category}
                      </Badge>
                    )}
                  </Flex>
                  <Flex align="center" fontSize="xs" color="previa.stone">
                    <Icon as={Calendar} w={3} h={3} mr={1} />
                    <Text>
                      {new Date(transaction.transaction_date).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </Flex>
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  fontFamily="mono"
                  flexShrink={0}
                  ml={4}
                  color={transaction.amount >= 0 ? "green.600" : "red.600"}
                >
                  {transaction.amount >= 0 ? '+' : ''}
                  {transaction.amount.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD'
                  })}
                </Text>
              </Flex>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

