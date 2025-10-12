import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureStatus } from '@/types/featureStatus';

interface CompactStatusBadgeProps {
  status: FeatureStatus;
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

/**
 * CompactStatusBadge - Compact status badge for tight spaces like sidebars
 * 
 * Features:
 * - Ultra-compact design for sidebar use
 * - Icon-only display to save space
 * - Tooltip for full information
 * - Responsive sizing
 * - Previa design system colors
 */
export function CompactStatusBadge({ 
  status,
  className = '', 
  showTooltip = true,
  tooltipText
}: CompactStatusBadgeProps) {
  const getStatusConfig = (status: FeatureStatus) => {
    switch (status) {
      case 'active':
        return {
          icon: '✓',
          color: 'bg-green-100 text-green-700 border-green-200',
          label: 'Available',
          defaultTooltip: 'This feature is fully functional'
        };
      case 'coming-soon':
        return {
          icon: '🚧',
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          label: 'Coming Soon',
          defaultTooltip: 'This feature is in development and will be available soon'
        };
      case 'beta':
        return {
          icon: '🧪',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          label: 'Beta',
          defaultTooltip: 'This feature is in beta testing and may have limited functionality'
        };
      case 'disabled':
        return {
          icon: '⏸️',
          color: 'bg-gray-100 text-gray-500 border-gray-200',
          label: 'Disabled',
          defaultTooltip: 'This feature is temporarily disabled'
        };
      default:
        return {
          icon: '?',
          color: 'bg-gray-100 text-gray-500 border-gray-200',
          label: 'Unknown',
          defaultTooltip: 'Status unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const finalTooltipText = tooltipText || config.defaultTooltip;

  const badge = (
    <Badge 
      variant="secondary"
      className={`${config.color} text-xs px-1.5 py-0.5 rounded-full min-w-0 flex-shrink-0 ${className}`}
    >
      <span className="text-xs leading-none">{config.icon}</span>
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
            <p>{finalTooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

export default CompactStatusBadge;
