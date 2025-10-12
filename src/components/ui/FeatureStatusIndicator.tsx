import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getFeatureStatus, type FeatureStatus } from '@/types/featureStatus';
import { CompactStatusBadge } from './CompactStatusBadge';

interface FeatureStatusIndicatorProps {
  featureId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'compact';
  showTooltip?: boolean;
  customTooltip?: string;
}

/**
 * FeatureStatusIndicator - Displays the status of a specific feature
 * 
 * Features:
 * - Automatically fetches feature status from configuration
 * - Displays appropriate icon and color based on status
 * - Optional tooltip with feature information
 * - Consistent styling across the application
 * - Accessible with proper ARIA labels
 */
export function FeatureStatusIndicator({ 
  featureId,
  className = '', 
  size = 'sm',
  showTooltip = true,
  customTooltip
}: FeatureStatusIndicatorProps) {
  const statusInfo = getFeatureStatus(featureId);
  
  // Use compact badge for compact size
  if (size === 'compact') {
    return (
      <CompactStatusBadge
        status={statusInfo.status}
        className={className}
        showTooltip={showTooltip}
        tooltipText={customTooltip}
      />
    );
  }
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const getStatusColor = (status: FeatureStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'coming-soon':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'beta':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'disabled':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const badge = (
    <Badge 
      variant="secondary"
      className={`${getStatusColor(statusInfo.status)} ${sizeClasses[size]} ${className}`}
    >
      <span className="flex items-center gap-1">
        {statusInfo.icon && <span className="text-xs">{statusInfo.icon}</span>}
        <span>{statusInfo.label}</span>
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
            <p>{customTooltip || statusInfo.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

export default FeatureStatusIndicator;
