/**
 * TransactionCard - Display unmatched transaction for reconciliation
 */

import React from 'react';
import { Card, CardContent } from '@/components/chakra-ui/card';
import { Badge } from '@/components/chakra-ui/badge';
import { Button } from '@/components/chakra-ui/button';
import { Check } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '@/types/financial';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export interface TransactionCardProps {
  transaction: Transaction;
  onMatch?: (transactionId: string) => void;
  className?: string;
}

/**
 * TransactionCard component for reconciliation view
 * Displays transaction with drag-and-drop support
 */
export function TransactionCard({
  transaction,
  onMatch,
  className = '',
}: TransactionCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `transaction-${transaction.id}`,
    data: { type: 'transaction', transaction },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const formatAmount = (amount: number): string => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(absAmount / 100);
  };

  const isExpense = transaction.amount < 0;
  const amountColor = isExpense ? 'text-red-600' : 'text-green-600';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-sand hover:shadow-md transition-all cursor-move focus:outline-none focus:ring-2 focus:ring-sand ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`Transaction: ${transaction.description}, ${formatAmount(transaction.amount)}, ${format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}. Press Space to select, or drag to match with a receipt.`}
      {...attributes}
      {...listeners}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onMatch) {
            onMatch(transaction.id);
          }
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Left: Date and Description */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone mb-1">
              {format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}
            </p>
            <p className="text-sm font-medium text-charcoal truncate">
              {transaction.description}
            </p>
            {transaction.category && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {transaction.category}
              </Badge>
            )}
          </div>

          {/* Right: Amount and Action */}
          <div className="flex flex-col items-end gap-2">
            <span className={`font-mono text-sm font-semibold ${amountColor}`} aria-label={`Amount: ${formatAmount(transaction.amount)}`}>
              {formatAmount(transaction.amount)}
            </span>
            {onMatch && (
              <Button
                size="sm"
                variant="ghost"
                aria-label={`Match transaction ${transaction.description}`}
                className="h-7 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-sand"
                onClick={(e) => {
                  e.stopPropagation();
                  onMatch(transaction.id);
                }}
              >
                <Check className="h-3 w-3 mr-1" aria-hidden="true" />
                Match
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

