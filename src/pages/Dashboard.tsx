
import React, { useState, useMemo } from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import UserGreetingCard from '@/components/dashboard/UserGreetingCard';
import { TierDisplay } from '@/components/auth/TierDisplay';
import { UpgradePrompt } from '@/components/auth/UpgradePrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useBankAccounts, useTransactions, useReceipts } from '@/hooks/financial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CreditCard, Receipt, Calendar } from 'lucide-react';
import { MonthlySpendingChart, IncomeVsExpensesChart, UnreconciledAlert } from '@/components/widgets';
import type { UserTierData, Transaction } from '@/types/financial';

const Dashboard = () => {
  const { user, loading: authLoading, error: authError, userTier } = useAuth();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

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

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex h-screen bg-cream">
        <Sidebar />
        <div className="flex-1 lg:ml-64 md:ml-20">
          <TopBar />
          <main className="p-6">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 border-sand"></div>
              <p className="text-darkStone">Initializing...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <div className="flex h-screen bg-cream">
        <Sidebar />
        <div className="flex-1 lg:ml-64 md:ml-20">
          <TopBar />
          <main className="p-6">
            <div className="text-center py-16">
              <p className="text-red-600">Authentication error: {authError}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-sand hover:bg-sand/90 text-charcoal"
              >
                Retry
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
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
                <MonthlySpendingChart transactions={transactions} />
              )}

              {/* Income vs Expenses Chart */}
              {transactionsLoading ? (
                <div className="h-[400px] rounded-lg animate-pulse" style={{ backgroundColor: '#F2E9D8' }}></div>
              ) : (
                <IncomeVsExpensesChart transactions={transactions} />
              )}

              {/* Unreconciled Alert */}
              {transactionsLoading ? (
                <div className="h-[200px] rounded-lg animate-pulse" style={{ backgroundColor: '#F2E9D8' }}></div>
              ) : (
                <UnreconciledAlert transactions={transactions} />
              )}

              {/* Recent Transactions - moved here */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: '#403B31' }}>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 animate-pulse rounded" style={{ backgroundColor: '#F2E9D8' }}></div>
                      ))}
                    </div>
                  ) : transactions.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: '#8C877D' }}>
                      No transactions yet. Upload your first bank statement to get started!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded hover:bg-cream transition"
                          style={{ border: '1px solid #D9C8B4' }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium" style={{ color: '#403B31' }}>{transaction.description || 'Unknown'}</p>
                              {transaction.category && (
                                <Badge variant="outline" style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
                                  {transaction.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: '#8C877D' }}>
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`text-lg font-semibold font-mono ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Bank Accounts
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-sand" />
                </CardHeader>
                <CardContent>
                  {accountsLoading ? (
                    <div className="h-8 w-16 animate-pulse rounded" style={{ backgroundColor: '#D9C8B4' }}></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-charcoal">
                        {currentUsage.accounts}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        of {displayTier.accounts_limit === 999999 ? 'unlimited' : displayTier.accounts_limit} available
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Transactions
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-sand" />
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="h-8 w-16 animate-pulse rounded" style={{ backgroundColor: '#D9C8B4' }}></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-charcoal">
                        {currentUsage.transactionsThisMonth}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        this month ({transactions.length} total)
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receipts
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-sand" />
                </CardHeader>
                <CardContent>
                  {receiptsLoading ? (
                    <div className="h-8 w-16 animate-pulse rounded" style={{ backgroundColor: '#D9C8B4' }}></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-charcoal">
                        {currentUsage.receiptsThisMonth}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        this month ({receipts.length} total)
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Column - Tier Display */}
          <div className="space-y-6">
            <TierDisplay
              tier={displayTier}
              currentUsage={currentUsage}
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
        </main>

        {/* Upgrade Prompt Modal */}
        <UpgradePrompt
          open={showUpgradePrompt}
          onOpenChange={setShowUpgradePrompt}
        />
      </div>
    </div>
  );
};

export default Dashboard;
