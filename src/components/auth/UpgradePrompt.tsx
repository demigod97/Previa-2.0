/**
 * UpgradePrompt Component - Premium upgrade modal
 *
 * Displays pricing comparison and upgrade options when user hits tier limits.
 * Currently a placeholder - upgrade functionality to be implemented later.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/chakra-ui/dialog';
import { Button } from '@/components/chakra-ui/button';
import { Badge } from '@/components/chakra-ui/badge';
import { Check } from 'lucide-react';
import type { TierLimitType } from '@/types/financial';

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType?: TierLimitType;
  message?: string;
}

/**
 * UpgradePrompt - Modal dialog for premium upgrade
 *
 * @param open - Whether dialog is open
 * @param onOpenChange - Callback when dialog open state changes
 * @param limitType - Type of limit that triggered the prompt
 * @param message - Custom message (optional)
 */
export function UpgradePrompt({
  open,
  onOpenChange,
  limitType,
  message,
}: UpgradePromptProps) {
  const defaultMessage = limitType
    ? `You've reached your ${limitType} limit for the Free tier.`
    : 'Upgrade to Premium for unlimited access.';

  const displayMessage = message || defaultMessage;

  const freeTierFeatures = [
    '3 bank accounts',
    '50 transactions per month',
    '10 receipts per month',
    'Basic reconciliation',
  ];

  const premiumTierFeatures = [
    'Unlimited bank accounts',
    'Unlimited transactions',
    'Unlimited receipts',
    'Advanced reconciliation',
    'Priority support',
    'Export to accounting software',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade to Premium</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {displayMessage}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Free Tier */}
          <div className="border rounded-lg p-4 bg-stone-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Free</h3>
              <Badge variant="secondary">Current</Badge>
            </div>
            <div className="text-3xl font-bold mb-4">$0</div>
            <ul className="space-y-2">
              {freeTierFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="border-2 border-sand rounded-lg p-4 bg-sand/10 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sand text-charcoal">
              Best Value
            </Badge>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="text-lg font-semibold">Premium</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {premiumTierFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-sand flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button
            className="bg-sand hover:bg-sand/90 text-charcoal"
            onClick={() => {
              // TODO: Implement upgrade flow
              alert('Upgrade functionality coming soon!');
            }}
          >
            Upgrade to Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { UpgradePromptProps };
