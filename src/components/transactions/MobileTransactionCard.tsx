/**
 * MobileTransactionCard - Mobile-optimized transaction card
 * 
 * Features:
 * - Touch-friendly 64px minimum height
 * - Tap to view details
 * - Swipe actions for quick edit/delete
 * - Status badges and category tags
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '@/types/financial';
import { cn } from '@/lib/utils';

interface MobileTransactionCardProps {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isSelected?: boolean;
  onSelect?: (transaction: Transaction) => void;
}

export function MobileTransactionCard({
  transaction,
  onView,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
}: MobileTransactionCardProps) {
  const isIncome = transaction.amount >= 0;
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  
  const getStatusBadge = () => {
    const statusColors = {
      'unreconciled': 'bg-red-100 text-red-700',
      'matched': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-gray-100 text-gray-700',
    };
    
    return (
      <Badge className={cn('text-xs', statusColors[transaction.status as keyof typeof statusColors] || 'bg-gray-100')}>
        {transaction.status}
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        'bg-card border-previa-stone/20 hover:border-previa-sand transition-all',
        'min-h-[64px] cursor-pointer',
        isSelected && 'ring-2 ring-sand'
      )}
      onClick={() => onView(transaction)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Date, Description, Category */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-stone font-medium">
                {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
              </p>
              {getStatusBadge()}
            </div>
            
            <p className="text-sm font-semibold text-charcoal truncate">
              {transaction.description}
            </p>
            
            {transaction.category && (
              <Badge variant="outline" className="text-xs bg-sand/20 border-sand/40 text-charcoal">
                {transaction.category}
              </Badge>
            )}
          </div>

          {/* Right: Amount & Actions */}
          <div className="flex flex-col items-end gap-2">
            <p className={cn('text-base font-bold font-mono', amountColor)}>
              {isIncome ? '+' : ''}{new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
              }).format(Math.abs(transaction.amount))}
            </p>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 min-h-[44px] min-w-[44px] hover:bg-sand/20"
                >
                  <MoreVertical className="h-4 w-4 text-darkStone" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-cream border-sand">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(transaction);
                  }}
                  className="hover:bg-sand/20"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(transaction);
                  }}
                  className="hover:bg-sand/20"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(transaction);
                  }}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

