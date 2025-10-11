/**
 * TierDisplay Component - Shows current user tier and usage limits
 *
 * Displays tier status (Free/Premium), usage indicators, and limits
 * for accounts, transactions, and receipts.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { UserTierData } from '@/types/financial';

interface TierDisplayProps {
  tier: UserTierData;
  currentUsage?: {
    accounts?: number;
    transactionsThisMonth?: number;
    receiptsThisMonth?: number;
  };
  className?: string;
}

/**
 * TierDisplay - Shows user's current tier and usage limits
 *
 * @param tier - User tier data from database
 * @param currentUsage - Current usage counts (optional)
 * @param className - Additional CSS classes
 */
export function TierDisplay({ tier, currentUsage = {}, className }: TierDisplayProps) {
  const isPremium = tier.tier === 'premium_user';
  const tierName = isPremium ? 'Premium' : 'Free';
  const tierColor = isPremium ? 'bg-sand text-charcoal' : 'bg-stone-200 text-charcoal';

  const {
    accounts = 0,
    transactionsThisMonth = 0,
    receiptsThisMonth = 0,
  } = currentUsage;

  const calculateProgress = (current: number, limit: number): number => {
    if (limit === 0) return 0;
    if (isPremium) return 0; // Don't show progress for unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const formatLimit = (limit: number): string => {
    if (isPremium || limit >= 999999) return 'Unlimited';
    return limit.toString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Your Plan</span>
          <Badge className={tierColor}>{tierName}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bank Accounts Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Bank Accounts</span>
            <span className="font-mono text-sm">
              {accounts}/{formatLimit(tier.accounts_limit)}
            </span>
          </div>
          {!isPremium && (
            <Progress
              value={calculateProgress(accounts, tier.accounts_limit)}
              className="h-2"
            />
          )}
        </div>

        {/* Transactions Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Transactions (Monthly)</span>
            <span className="font-mono text-sm">
              {transactionsThisMonth}/{formatLimit(tier.transactions_monthly_limit)}
            </span>
          </div>
          {!isPremium && (
            <Progress
              value={calculateProgress(transactionsThisMonth, tier.transactions_monthly_limit)}
              className="h-2"
            />
          )}
        </div>

        {/* Receipts Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Receipts (Monthly)</span>
            <span className="font-mono text-sm">
              {receiptsThisMonth}/{formatLimit(tier.receipts_monthly_limit)}
            </span>
          </div>
          {!isPremium && (
            <Progress
              value={calculateProgress(receiptsThisMonth, tier.receipts_monthly_limit)}
              className="h-2"
            />
          )}
        </div>

        {/* Premium Expiry Info */}
        {isPremium && tier.expires_at && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Expires</span>
              <span className="text-sm">
                {new Date(tier.expires_at).toLocaleDateString('en-AU')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { TierDisplayProps };
