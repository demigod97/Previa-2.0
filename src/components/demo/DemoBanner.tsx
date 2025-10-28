import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/chakra-ui/button';
import { cn } from '@/lib/utils';

interface DemoBannerProps {
  title?: string;
  message?: string;
  icon?: string;
  dismissible?: boolean;
  className?: string;
}

/**
 * DemoBanner - Reusable banner for demo/preview features
 *
 * Features:
 * - Customizable title and message
 * - Optional dismissible with X button
 * - Previa sand color background
 * - Responsive layout
 *
 * Used in:
 * - Story 7.1: Data Export Demo
 * - Story 7.2: Advanced Analytics Demo
 */
export function DemoBanner({
  title = '🔍 Demo Mode - Future Feature Preview',
  message = 'This is a preview. Full functionality coming soon.',
  icon = '🔍',
  dismissible = true,
  className,
}: DemoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative bg-sand border border-sand-dark rounded-lg p-4 mb-6',
        'shadow-sm',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-charcoal mb-1">
            {title}
          </h3>
          <p className="text-sm text-darkStone">
            {message}
          </p>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss banner"
            className="h-8 w-8 p-0 text-darkStone hover:text-charcoal hover:bg-sand-dark/20 focus:ring-2 focus:ring-charcoal"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
