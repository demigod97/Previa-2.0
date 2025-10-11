import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, CreditCard, Receipt } from 'lucide-react';
import type { UserTierData } from '@/types/financial';

interface FinancialOverviewCardsProps {
  accountsCount: number;
  transactionsThisMonth: number;
  transactionsTotal: number;
  receiptsThisMonth: number;
  receiptsTotal: number;
  tier: UserTierData;
  loading?: {
    accounts?: boolean;
    transactions?: boolean;
    receipts?: boolean;
  };
}

/**
 * Financial Overview Cards Component
 * 
 * Displays three cards showing:
 * - Bank Accounts count with tier limit
 * - Transactions this month with total count
 * - Receipts this month with total count
 * 
 * Follows Previa design system with cream/sand/charcoal colors
 */
export const FinancialOverviewCards: React.FC<FinancialOverviewCardsProps> = ({
  accountsCount,
  transactionsThisMonth,
  transactionsTotal,
  receiptsThisMonth,
  receiptsTotal,
  tier,
  loading = {},
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Bank Accounts Card */}
      <Card className="border-previa-stone/20 hover:border-previa-sand hover:shadow-md transition-all duration-200 ease-out cursor-default">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bank Accounts
          </CardTitle>
          <CreditCard className="h-4 w-4 text-previa-sand transition-transform duration-200 group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          {loading.accounts ? (
            <div className="h-8 w-16 animate-pulse bg-previa-sand/20 rounded"></div>
          ) : (
            <>
              <div className="text-2xl font-bold text-previa-charcoal">
                {accountsCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                of {tier.accounts_limit === 999999 ? 'unlimited' : tier.accounts_limit} available
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Transactions Card */}
      <Card className="border-previa-stone/20 hover:border-previa-sand hover:shadow-md transition-all duration-200 ease-out cursor-default">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Transactions
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-previa-sand transition-transform duration-200 group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          {loading.transactions ? (
            <div className="h-8 w-16 animate-pulse bg-previa-sand/20 rounded"></div>
          ) : (
            <>
              <div className="text-2xl font-bold text-previa-charcoal">
                {transactionsThisMonth}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                this month ({transactionsTotal} total)
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Receipts Card */}
      <Card className="border-previa-stone/20 hover:border-previa-sand hover:shadow-md transition-all duration-200 ease-out cursor-default">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receipts
          </CardTitle>
          <Receipt className="h-4 w-4 text-previa-sand transition-transform duration-200 group-hover:scale-110" />
        </CardHeader>
        <CardContent>
          {loading.receipts ? (
            <div className="h-8 w-16 animate-pulse bg-previa-sand/20 rounded"></div>
          ) : (
            <>
              <div className="text-2xl font-bold text-previa-charcoal">
                {receiptsThisMonth}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                this month ({receiptsTotal} total)
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

