/**
 * ReceiptCard - Display unmatched receipt for reconciliation
 */

import React from 'react';
import { Card, CardContent } from '@/components/chakra-ui/card';
import { Badge } from '@/components/chakra-ui/badge';
import { Button } from '@/components/chakra-ui/button';
import { Check, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Receipt } from '@/types/financial';
import { useDroppable } from '@dnd-kit/core';

export interface ReceiptCardProps {
  receipt: Receipt;
  onMatch?: (receiptId: string) => void;
  className?: string;
}

/**
 * ReceiptCard component for reconciliation view
 * Displays receipt with drop target support
 */
export function ReceiptCard({
  receipt,
  onMatch,
  className = '',
}: ReceiptCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `receipt-${receipt.id}`,
    data: { type: 'receipt', receipt },
  });

  const formatAmount = (amount: number): string => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(absAmount / 100);
  };

  // Determine confidence level badge color
  const getConfidenceBadge = (score?: number) => {
    if (!score) return { variant: 'secondary' as const, label: 'Unknown' };
    if (score >= 0.8) return { variant: 'default' as const, label: 'High' };
    if (score >= 0.5) return { variant: 'secondary' as const, label: 'Medium' };
    return { variant: 'destructive' as const, label: 'Low' };
  };

  const confidence = getConfidenceBadge(receipt.confidence_score);

  return (
    <Card
      ref={setNodeRef}
      className={`border-sand hover:shadow-md transition-all ${
        isOver ? 'ring-2 ring-sand bg-sand/10' : ''
      } ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Left: Icon/Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded bg-cream flex items-center justify-center">
              <FileText className="h-6 w-6 text-darkStone" />
            </div>
          </div>

          {/* Middle: Details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-charcoal truncate">
              {receipt.merchant || 'Unknown Merchant'}
            </p>
            <p className="text-xs text-stone mt-1">
              {format(new Date(receipt.receipt_date || new Date()), 'dd/MM/yyyy')}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-mono text-sm font-semibold text-charcoal">
                {formatAmount(receipt.amount || 0)}
              </span>
              <Badge variant={confidence.variant} className="text-xs">
                {confidence.label}
              </Badge>
            </div>
          </div>

          {/* Right: Action */}
          {onMatch && (
            <div className="flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onMatch(receipt.id);
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                Match
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

