import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus } from 'lucide-react';
import type { BankAccount } from '@/hooks/financial/useBankAccounts';

interface BankAccountsListProps {
  accounts: BankAccount[];
  loading?: boolean;
  onAddAccount?: () => void;
}

/**
 * Bank Accounts List Component
 *
 * Displays list of connected bank accounts with:
 * - Institution name and account name
 * - Last 4 digits of account number
 * - Current balance (JetBrains Mono font)
 * - Total balance summary
 * - Add Account button (placeholder)
 *
 * Follows Previa notebook design system with paper white cards and emojis
 */
export const BankAccountsList: React.FC<BankAccountsListProps> = ({
  accounts,
  loading = false,
  onAddAccount,
}) => {
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg mb-1 text-previa-charcoal flex items-center gap-2">
            🏦 Bank Accounts
          </CardTitle>
          {!loading && accounts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-previa-stone">Total Balance:</span>
              <span className="text-sm font-semibold text-previa-charcoal font-mono">
                {totalBalance.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD'
                })}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddAccount}
          disabled={!onAddAccount}
          className="border-previa-sand text-previa-darkStone hover:bg-previa-sand/10 transition-all duration-150 hover:scale-102 active:scale-98 min-h-[44px]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Account
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 animate-pulse bg-previa-sand/20 rounded"></div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-previa-stone/20">
            <div className="text-4xl mb-3">💰</div>
            <p className="text-sm mb-2 text-previa-stone">
              No bank accounts connected yet
            </p>
            <p className="text-xs mb-4 text-previa-stone">
              Upload a bank statement to get started
            </p>
            {onAddAccount && (
              <Button
                onClick={onAddAccount}
                className="bg-previa-sand hover:bg-previa-sand/90 text-previa-charcoal transition-all duration-150 hover:scale-102 active:scale-98 min-h-[44px]"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Account
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-previa-stone/20 divide-y divide-charcoal/10">
            {accounts.map((account, index) => (
              <div
                key={account.id}
                className={`p-4 hover:bg-previa-sand/10 transition-all duration-200 ease-out cursor-default min-h-[88px] ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${index === accounts.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 shrink-0 text-previa-darkStone" />
                      <p className="font-semibold truncate text-previa-charcoal">
                        {account.institution}
                      </p>
                    </div>
                    <p className="text-sm truncate text-previa-darkStone">
                      {account.account_name}
                    </p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div
                      className={`text-lg font-semibold font-mono ${
                        (account.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {(account.balance || 0).toLocaleString('en-AU', {
                        style: 'currency',
                        currency: account.currency || 'AUD'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-previa-stone">
                    {account.account_number_masked || '···· ····'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

