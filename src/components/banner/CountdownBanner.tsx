import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/chakra-ui/button';
import { calculateTimeRemaining, formatTimeRemaining, type TimeRemaining } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface CountdownBannerProps {
  activationDate: string;
  className?: string;
}

const STORAGE_KEY = 'previa_automation_banner_dismissed';

/**
 * CountdownBanner - Displays countdown timer for automation features activation
 * 
 * Features:
 * - Real-time countdown timer
 * - Dismissible with localStorage persistence
 * - Previa theme styling
 * - Responsive design
 * - Auto-hides when countdown reaches zero
 */
export function CountdownBanner({ activationDate, className }: CountdownBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsDismissed(dismissed);
  }, []);

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = calculateTimeRemaining(activationDate);
      setTimeRemaining(remaining);
      setIsInitialized(true); // Mark as initialized after first calc
      
      // Auto-hide when countdown reaches zero
      if (!remaining) {
        setIsVisible(false);
      }
    };

    // Initial calculation
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [activationDate]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  // Don't render if dismissed
  if (isDismissed) {
    return null; // Can return early if dismissed
  }

  // Don't show anything while loading (before first calculation)
  if (!isInitialized) {
    return null;
  }

  // Hide if countdown expired or not visible
  if (!isVisible || !timeRemaining) {
    return null;
  }

  return (
    <div className={cn(
      "w-full bg-sand text-charcoal border-b border-stone",
      "px-6 py-3 flex items-center justify-between",
      "flex-col md:flex-row gap-2 md:gap-4",
      className
    )}>
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm font-medium">
          <span className="font-semibold">Automation features activating in {formatTimeRemaining(timeRemaining)}</span>
          <span className="mx-2 text-stone-600">|</span>
          <span className="text-stone-600">Demo data only</span>
        </p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        aria-label="Dismiss automation countdown banner"
        className="flex-shrink-0 h-8 w-8 p-0 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default CountdownBanner;
