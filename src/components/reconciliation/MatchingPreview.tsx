/**
 * MatchingPreview - Preview and approve/reject transaction-receipt matches
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
    <Card className="border-sand">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-charcoal text-lg">
          <ArrowLeftRight className="h-5 w-5 text-sand" />
          Match Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Details */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-darkStone uppercase tracking-wide">
            Transaction
          </p>
          <div className="bg-cream p-3 rounded-md">
            <p className="text-sm font-medium text-charcoal truncate">
              {transaction.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-stone">
                {format(txDate, 'dd/MM/yyyy')}
              </span>
              <span className="font-mono text-sm font-semibold text-charcoal">
                {formatAmount(transaction.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-darkStone uppercase tracking-wide">
            Receipt
          </p>
          <div className="bg-cream p-3 rounded-md">
            <p className="text-sm font-medium text-charcoal truncate">
              {receipt.merchant || 'Unknown Merchant'}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-stone">
                {format(rcDate, 'dd/MM/yyyy')}
              </span>
              <span className="font-mono text-sm font-semibold text-charcoal">
                {formatAmount(receipt.amount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-darkStone uppercase tracking-wide">
              Confidence Score
            </p>
            <span className={`font-mono text-2xl font-bold ${getConfidenceColor(confidenceScore)}`}>
              {confidenceScore}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={confidenceScore} 
              className="h-2 bg-stone/20"
            />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(confidenceScore)}`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Match Reasons */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-darkStone uppercase tracking-wide">
            Match Analysis
          </p>
          <ul className="space-y-1">
            {displayReasons.map((reason, index) => (
              <li key={index} className="text-xs text-stone flex items-start">
                <span className="mr-2">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={onApprove}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Approve Match
          </Button>
          <Button
            onClick={onReject}
            disabled={isLoading}
            variant="ghost"
            className="flex-1 text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
          {onEdit && (
            <Button
              onClick={onEdit}
              disabled={isLoading}
              variant="outline"
              size="icon"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

