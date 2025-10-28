
import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Grid, GridItem, Heading, Text, VStack, List, ListItem, Icon } from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout';
import {
  UserGreetingCard,
  FinancialOverviewCards,
  RecentTransactionsList,
  BankAccountsList
} from '@/components/dashboard';
import { TierDisplay } from '@/components/auth/TierDisplay';
import { UpgradePrompt } from '@/components/auth/UpgradePrompt';
import { PreviaCopilotSidebar } from '@/components/copilot';
import { useAuth } from '@/contexts/AuthContext';
import { useBankAccounts, useTransactions, useReceipts } from '@/hooks/financial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserTierData, Transaction } from '@/types/financial';
import { ChartWidgetSkeleton } from '@/components/ui/skeletons';

// Lazy load chart components to reduce initial bundle size
const MonthlySpendingChart = lazy(() => import('@/components/widgets/MonthlySpendingChart').then(module => ({ default: module.MonthlySpendingChart })));
const IncomeVsExpensesChart = lazy(() => import('@/components/widgets/IncomeVsExpensesChart').then(module => ({ default: module.IncomeVsExpensesChart })));
const UnreconciledAlert = lazy(() => import('@/components/widgets/UnreconciledAlert').then(module => ({ default: module.UnreconciledAlert })));

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError, userTier } = useAuth();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { toast } = useToast();

  // Fetch real financial data
  const { data: bankAccounts = [], isLoading: accountsLoading } = useBankAccounts(user?.id);
  const { data: rawTransactions = [], isLoading: transactionsLoading } = useTransactions(user?.id, 100); // Fetch more for charts
  const { data: receipts = [], isLoading: receiptsLoading } = useReceipts(user?.id, 10);

  // Transform transactions to include type field for widgets
  const transactions: Transaction[] = useMemo(() => {
    return rawTransactions.map(tx => ({
      ...tx,
      type: tx.amount >= 0 ? 'income' as const : 'expense' as const,
      date: tx.transaction_date, // Add date alias for widget compatibility
    }));
  }, [rawTransactions]);

  // Calculate current month transactions and receipts
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const transactionsThisMonth = transactions.filter(t => {
    const date = new Date(t.transaction_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const receiptsThisMonth = receipts.filter(r => {
    if (!r.receipt_date) return false;
    const date = new Date(r.receipt_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  // Calculate usage stats
  const currentUsage = {
    accounts: bankAccounts.length,
    transactionsThisMonth,
    receiptsThisMonth,
  };

  const displayTier = userTier || {
    tier: 'user',
    accounts_limit: 3,
    transactions_monthly_limit: 50,
    receipts_monthly_limit: 10,
  } as UserTierData;

  // Show welcome badge for new users (signed up within last 5 minutes)
  useEffect(() => {
    const checkNewUser = async () => {
      if (!user?.id) return;

      // Check if we've already shown the welcome message in this session
      const hasShownWelcome = sessionStorage.getItem('welcome_shown');
      if (hasShownWelcome) return;

      try {
        // Fetch user metadata from Supabase Auth
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        const createdAt = new Date(authData.user.created_at);
        const now = new Date();
        const minutesSinceSignup = (now.getTime() - createdAt.getTime()) / 1000 / 60;

        // If user signed up within last 5 minutes, show welcome badge
        if (minutesSinceSignup < 5) {
          // Check if they have the First Steps badge
          const { data: badge } = await supabase
            .from('user_badges')
            .select('badge_id, unlocked_at')
            .eq('user_id', user.id)
            .eq('badge_id', 'first_steps')
            .single();

          if (badge) {
            toast({
              title: '🎉 Welcome to Previa!',
              description: 'You\'ve earned the "First Steps" badge and 10 points! Start by uploading your first bank statement.',
              duration: 6000,
            });

            // Mark as shown in this session
            sessionStorage.setItem('welcome_shown', 'true');
          }
        }
      } catch (error) {
        console.error('Failed to check new user status:', error);
      }
    };

    checkNewUser();
  }, [user?.id, toast]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <DashboardLayout>
        <Box textAlign="center" py={16}>
          <Box
            as="div"
            animation="spin 1s linear infinite"
            borderRadius="full"
            h={8}
            w={8}
            borderBottom="2px solid"
            borderColor="previa.sand"
            mx="auto"
            mb={4}
          />
          <Text color="previa.darkStone">Initializing...</Text>
        </Box>
      </DashboardLayout>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <DashboardLayout>
        <Box textAlign="center" py={16}>
          <Text color="red.600" mb={4}>Authentication error: {authError}</Text>
          <Button
            onClick={() => window.location.reload()}
            bg="previa.sand"
            color="previa.charcoal"
            _hover={{ bg: "previa.sand", opacity: 0.9 }}
          >
            Retry
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <Box mb={8}>
          <Heading as="h1" size="2xl" fontWeight="medium" mb={2} color="previa.charcoal">
            Welcome to Previa
          </Heading>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6} mb={8}>
          {/* Left Column - User Greeting, Widgets, and Financial Overview */}
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <VStack spacing={6} align="stretch">
              <UserGreetingCard />

              {/* 2x2 Widget Grid */}
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {/* Monthly Spending Chart */}
                {transactionsLoading ? (
                  <ChartWidgetSkeleton height="400px" type="bar" />
                ) : (
                  <Suspense fallback={<ChartWidgetSkeleton height="400px" type="bar" />}>
                    <MonthlySpendingChart transactions={transactions} />
                  </Suspense>
                )}

                {/* Income vs Expenses Chart */}
                {transactionsLoading ? (
                  <ChartWidgetSkeleton height="400px" type="line" />
                ) : (
                  <Suspense fallback={<ChartWidgetSkeleton height="400px" type="line" />}>
                    <IncomeVsExpensesChart transactions={transactions} />
                  </Suspense>
                )}

                {/* Unreconciled Alert */}
                {transactionsLoading ? (
                  <ChartWidgetSkeleton height="200px" showLegend={false} />
                ) : (
                  <Suspense fallback={<ChartWidgetSkeleton height="200px" showLegend={false} />}>
                    <UnreconciledAlert transactions={transactions} />
                  </Suspense>
                )}

                {/* Recent Transactions */}
                <RecentTransactionsList
                  transactions={transactions}
                  loading={transactionsLoading}
                  limit={5}
                />
              </Grid>

              {/* Financial Overview Cards */}
              <FinancialOverviewCards
                accountsCount={currentUsage.accounts}
                transactionsThisMonth={currentUsage.transactionsThisMonth}
                transactionsTotal={transactions.length}
                receiptsThisMonth={currentUsage.receiptsThisMonth}
                receiptsTotal={receipts.length}
                tier={displayTier}
                loading={{
                  accounts: accountsLoading,
                  transactions: transactionsLoading,
                  receipts: receiptsLoading,
                }}
              />
            </VStack>
          </GridItem>

          {/* Right Column - Tier Display & Bank Accounts */}
          <GridItem colSpan={{ base: 1, lg: 1 }}>
            <VStack spacing={6} align="stretch">
              <TierDisplay
                tier={displayTier}
                currentUsage={currentUsage}
              />

              {/* Bank Accounts List */}
              <BankAccountsList
                accounts={bankAccounts}
                loading={accountsLoading}
                onAddAccount={() => navigate('/onboarding/upload')}
              />

              {/* Show upgrade CTA for free tier */}
              {displayTier.tier === 'user' && (
                <Card
                  bgGradient="linear(to-br, previa.sand, stone.200)"
                  bgGradientOpacity={0.2}
                  borderColor="previa.sand"
                  borderOpacity={0.3}
                >
                  <CardHeader>
                    <CardTitle fontSize="lg">Upgrade to Premium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VStack spacing={4} align="stretch">
                      <List spacing={2} fontSize="sm" color="previa.charcoal" opacity={0.8}>
                        <ListItem>
                          <Flex align="flex-start">
                            <Text mr={2}>✓</Text>
                            <Text>Unlimited bank accounts</Text>
                          </Flex>
                        </ListItem>
                        <ListItem>
                          <Flex align="flex-start">
                            <Text mr={2}>✓</Text>
                            <Text>Unlimited transactions</Text>
                          </Flex>
                        </ListItem>
                        <ListItem>
                          <Flex align="flex-start">
                            <Text mr={2}>✓</Text>
                            <Text>Unlimited receipt storage</Text>
                          </Flex>
                        </ListItem>
                        <ListItem>
                          <Flex align="flex-start">
                            <Text mr={2}>✓</Text>
                            <Text>Priority support</Text>
                          </Flex>
                        </ListItem>
                      </List>
                      <Button
                        w="full"
                        bg="previa.sand"
                        color="previa.charcoal"
                        _hover={{ bg: "previa.sand", opacity: 0.9 }}
                        onClick={() => setShowUpgradePrompt(true)}
                      >
                        View Plans
                      </Button>
                    </VStack>
                  </CardContent>
                </Card>
              )}
            </VStack>
          </GridItem>
        </Grid>
        {/* Upgrade Prompt Modal */}
        <UpgradePrompt
          open={showUpgradePrompt}
          onOpenChange={setShowUpgradePrompt}
        />

        {/* Previa AI Copilot Sidebar - Temporarily disabled while debugging */}
        {/* <PreviaCopilotSidebar defaultOpen={false} /> */}
    </DashboardLayout>
  );
};

export default Dashboard;
