
import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout';
import {
  UserGreetingCard,
  FinancialOverviewCards,
  RecentTransactionsList,
  BankAccountsList
} from '@/components/dashboard';
import { TierDisplay } from '@/components/auth/TierDisplay';
import { UpgradePrompt } from '@/components/auth/UpgradePrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useBankAccounts, useTransactions, useReceipts } from '@/hooks/financial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserTierData, Transaction } from '@/types/financial';

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
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 border-sand"></div>
          <p className="text-darkStone">Initializing...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p className="text-red-600">Authentication error: {authError}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-sand hover:bg-sand/90 text-charcoal"
          >
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="mb-8">
          <h1 className="font-medium mb-2 text-5xl" style={{ color: '#403B31' }}>Welcome to Previa</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - User Greeting, Widgets, and Financial Overview */}
          <div className="lg:col-span-2 space-y-6">
            <UserGreetingCard />

            {/* 2x2 Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly Spending Chart */}
              {transactionsLoading ? (
                <div className="h-[400px] rounded-lg animate-pulse" style={{ backgroundColor: '#F2E9D8' }}></div>
              ) : (
                <Suspense fallback={<Card className="h-[400px] flex items-center justify-center"><Skeleton className="h-[360px] w-full" /></Card>}>
                  <MonthlySpendingChart transactions={transactions} />
                </Suspense>
              )}

              {/* Income vs Expenses Chart */}
              {transactionsLoading ? (
                <div className="h-[400px] rounded-lg animate-pulse" style={{ backgroundColor: '#F2E9D8' }}></div>
              ) : (
                <Suspense fallback={<Card className="h-[400px] flex items-center justify-center"><Skeleton className="h-[360px] w-full" /></Card>}>
                  <IncomeVsExpensesChart transactions={transactions} />
                </Suspense>
              )}

              {/* Unreconciled Alert */}
              {transactionsLoading ? (
                <div className="h-[200px] rounded-lg animate-pulse" style={{ backgroundColor: '#F2E9D8' }}></div>
              ) : (
                <Suspense fallback={<Card className="h-[200px] flex items-center justify-center"><Skeleton className="h-[160px] w-full" /></Card>}>
                  <UnreconciledAlert transactions={transactions} />
                </Suspense>
              )}

              {/* Recent Transactions */}
              <RecentTransactionsList
                transactions={transactions}
                loading={transactionsLoading}
                limit={5}
              />
            </div>

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

          </div>

          {/* Right Column - Tier Display & Bank Accounts */}
          <div className="space-y-6">
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
              <Card className="bg-gradient-to-br from-sand/20 to-stone-200/20 border-sand/30">
                <CardHeader>
                  <CardTitle className="text-lg">Upgrade to Premium</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-charcoal/80">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Unlimited bank accounts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Unlimited transactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Unlimited receipt storage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-sand hover:bg-sand/90 text-charcoal"
                    onClick={() => setShowUpgradePrompt(true)}
                  >
                    View Plans
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Upgrade Prompt Modal */}
        <UpgradePrompt
          open={showUpgradePrompt}
          onOpenChange={setShowUpgradePrompt}
        />
    </DashboardLayout>
  );
};

export default Dashboard;
