/**
 * StatusBadge Component
 * Displays color-coded processing status indicators for receipts
 */

import React from 'react';
import { Badge, Box, Flex, Icon, Spinner } from '@chakra-ui/react';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface StatusBadgeProps {
  status: ProcessingStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}

const STATUS_CONFIG: Record<
  ProcessingStatus,
  {
    label: string;
    colorScheme: string;
    icon: typeof CheckCircle;
    bgColor: string;
    textColor: string;
  }
> = {
  pending: {
    label: 'Pending',
    colorScheme: 'gray',
    icon: Clock,
    bgColor: 'gray.100',
    textColor: 'gray.700',
  },
  processing: {
    label: 'Processing',
    colorScheme: 'blue',
    icon: Loader,
    bgColor: 'blue.100',
    textColor: 'blue.700',
  },
  completed: {
    label: 'Completed',
    colorScheme: 'green',
    icon: CheckCircle,
    bgColor: 'green.100',
    textColor: 'green.700',
  },
  failed: {
    label: 'Failed',
    colorScheme: 'red',
    icon: XCircle,
    bgColor: 'red.100',
    textColor: 'red.700',
  },
};

/**
 * StatusBadge - Color-coded status indicator
 */
export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  showLabel = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;

  const fontSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  }[size];

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  const padding = {
    sm: 1,
    md: 1.5,
    lg: 2,
  }[size];

  return (
    <Badge
      colorScheme={config.colorScheme}
      fontSize={fontSize}
      px={padding}
      py={padding / 2}
      borderRadius="md"
      display="inline-flex"
      alignItems="center"
      gap={1}
      bg={config.bgColor}
      color={config.textColor}
      fontWeight="medium"
    >
      {showIcon && (
        <Box display="inline-flex" alignItems="center">
          {status === 'processing' ? (
            <Spinner size={size === 'sm' ? 'xs' : 'sm'} />
          ) : (
            <Icon as={IconComponent} boxSize={iconSize} />
          )}
        </Box>
      )}
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}

/**
 * StatusBadgeWithTooltip - Status badge with hover tooltip
 */
export interface StatusBadgeWithTooltipProps extends StatusBadgeProps {
  tooltip?: string;
  processingTime?: string;
}

export function StatusBadgeWithTooltip({
  status,
  tooltip,
  processingTime,
  ...badgeProps
}: StatusBadgeWithTooltipProps) {
  const config = STATUS_CONFIG[status];

  const defaultTooltip = {
    pending: 'Waiting for OCR processing to start',
    processing: processingTime
      ? `Processing started ${processingTime} ago`
      : 'OCR extraction in progress',
    completed: 'OCR extraction completed successfully',
    failed: 'OCR extraction failed',
  }[status];

  return (
    <Box
      as="span"
      title={tooltip || defaultTooltip}
      cursor="help"
      display="inline-block"
    >
      <StatusBadge status={status} {...badgeProps} />
    </Box>
  );
}

/**
 * CompactStatusIndicator - Minimal status indicator (just icon)
 */
export interface CompactStatusIndicatorProps {
  status: ProcessingStatus;
  size?: number;
}

export function CompactStatusIndicator({
  status,
  size = 16,
}: CompactStatusIndicatorProps) {
  const config = STATUS_CONFIG[status];
  const IconComponent = config.icon;

  return (
    <Flex
      align="center"
      justify="center"
      w={size + 4}
      h={size + 4}
      borderRadius="full"
      bg={config.bgColor}
      color={config.textColor}
      title={config.label}
    >
      {status === 'processing' ? (
        <Spinner size="xs" />
      ) : (
        <Icon as={IconComponent} boxSize={size} />
      )}
    </Flex>
  );
}

/**
 * StatusProgress - Progress bar with status
 */
export interface StatusProgressProps {
  status: ProcessingStatus;
  showLabel?: boolean;
}

export function StatusProgress({ status, showLabel = true }: StatusProgressProps) {
  const config = STATUS_CONFIG[status];

  const progress = {
    pending: 0,
    processing: 50,
    completed: 100,
    failed: 100,
  }[status];

  return (
    <Box>
      {showLabel && (
        <Flex justify="space-between" align="center" mb={2}>
          <StatusBadge status={status} size="sm" />
        </Flex>
      )}
      <Box
        w="100%"
        h="6px"
        bg="gray.200"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          h="100%"
          w={`${progress}%`}
          bg={config.textColor}
          transition="width 0.3s ease"
          borderRadius="full"
        />
      </Box>
    </Box>
  );
}

export default StatusBadge;
