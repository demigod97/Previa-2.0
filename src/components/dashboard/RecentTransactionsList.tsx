import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import type { Transaction } from '@/types/financial';

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-previa-charcoal flex items-center gap-2">
          📊 Recent Transactions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/transactions')}
          className="text-previa-sand hover:text-previa-darkStone hover:bg-previa-cream transition-all duration-150 hover:scale-102 active:scale-98 min-h-[44px] min-w-[44px]"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 animate-pulse bg-previa-sand/20 rounded"></div>
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-previa-stone/20">
            <p className="text-sm text-previa-stone">
              📭 No transactions yet. Upload your first bank statement to get started!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-previa-stone/20 divide-y divide-charcoal/10">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-3 hover:bg-previa-sand/10 transition-all duration-200 ease-out cursor-pointer min-h-[64px] ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${index === recentTransactions.length - 1 ? 'rounded-b-lg' : ''}`}
                onClick={() => navigate('/transactions')}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate text-previa-charcoal">
                      {transaction.description || 'Unknown'}
                    </p>
                    {transaction.category && (
                      <Badge
                        variant="outline"
                        className="shrink-0 bg-previa-sand/20 border-previa-sand"
                      >
                        {transaction.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs flex items-center text-previa-stone">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {new Date(transaction.transaction_date).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div
                  className={`text-lg font-semibold font-mono shrink-0 ml-4 ${
                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.amount >= 0 ? '+' : ''}
                  {transaction.amount.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

