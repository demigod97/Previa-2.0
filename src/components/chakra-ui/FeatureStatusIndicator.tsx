// Feature Status Indicator component
import { Badge, BadgeProps, Tooltip } from '@chakra-ui/react';
import { APP_FEATURES, FeatureStatus } from '@/types/featureStatus';

export interface FeatureStatusIndicatorProps extends Omit<BadgeProps, 'size'> {
  featureId?: string;
  status?: FeatureStatus;
  size?: 'compact' | 'default';
  showTooltip?: boolean;
}

export const FeatureStatusIndicator = ({
  featureId,
  status: directStatus,
  size = 'default',
  showTooltip = false,
  ...props
}: FeatureStatusIndicatorProps) => {
  // Determine status from featureId or direct status prop
  let status: FeatureStatus | undefined = directStatus;

  if (featureId && APP_FEATURES[featureId]) {
    status = APP_FEATURES[featureId].status;
  }

  // If still no status, don't render anything
  if (!status) {
    return null;
  }

  const statusConfig: Record<FeatureStatus, { colorScheme: string; label: string }> = {
    active: { colorScheme: 'green', label: size === 'compact' ? '' : 'Active' },
    'coming-soon': { colorScheme: 'yellow', label: size === 'compact' ? '🚧' : 'Coming Soon' },
    beta: { colorScheme: 'blue', label: size === 'compact' ? '🧪' : 'Beta' },
    disabled: { colorScheme: 'gray', label: size === 'compact' ? '⏸️' : 'Disabled' },
  };

  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  const badge = (
    <Badge
      colorScheme={config.colorScheme}
      fontSize={size === 'compact' ? 'xs' : 'sm'}
      {...props}
    >
      {config.label}
    </Badge>
  );

  if (showTooltip && featureId && APP_FEATURES[featureId]) {
    const feature = APP_FEATURES[featureId];
    const tooltipLabel = feature.description || feature.name;

    return (
      <Tooltip label={tooltipLabel} placement="right">
        {badge}
      </Tooltip>
    );
  }

  return badge;
};
