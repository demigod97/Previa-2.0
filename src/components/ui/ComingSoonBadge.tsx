import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ComingSoonBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  tooltipText?: string;
}

/**
 * ComingSoonBadge - Displays a "Coming Soon" badge with optional tooltip
 * 
 * Features:
 * - Consistent "Coming Soon" styling
 * - Multiple sizes (sm, md, lg)
 * - Optional tooltip with custom text
 * - Previa design system colors
 * - Accessible with proper ARIA labels
 */
export function ComingSoonBadge({ 
  className = '', 
  size = 'sm',
  showTooltip = true,
  tooltipText = 'This feature is in development and will be available soon'
}: ComingSoonBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const badge = (
    <Badge 
      variant="secondary"
      className={`bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 transition-colors ${sizeClasses[size]} ${className}`}
    >
      <span className="flex items-center gap-1">
        <span className="text-xs">🚧</span>
        <span>Coming Soon</span>
      </span>
    </Badge>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

export default ComingSoonBadge;
