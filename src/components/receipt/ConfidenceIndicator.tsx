/**
 * ConfidenceIndicator Component
 * Displays visual confidence scores for OCR extraction quality
 */

import React from 'react';
import { Box, Flex, Text, Progress, Badge, Icon, Tooltip } from '@chakra-ui/react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export interface ConfidenceIndicatorProps {
  score: number; // 0.0 to 1.0
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPercentage?: boolean;
  variant?: 'badge' | 'progress' | 'icon';
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Determine confidence level from score
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.9) return 'high';
  if (score >= 0.7) return 'medium';
  return 'low';
}

/**
 * Get color scheme for confidence level
 */
export function getConfidenceLevelColor(level: ConfidenceLevel): string {
  return {
    high: 'green',
    medium: 'yellow',
    low: 'red',
  }[level];
}

/**
 * Get icon for confidence level
 */
export function getConfidenceLevelIcon(level: ConfidenceLevel) {
  return {
    high: CheckCircle,
    medium: AlertTriangle,
    low: AlertCircle,
  }[level];
}

/**
 * ConfidenceIndicator - Main component
 */
export function ConfidenceIndicator({
  score,
  size = 'md',
  showLabel = true,
  showPercentage = true,
  variant = 'badge',
}: ConfidenceIndicatorProps) {
  const level = getConfidenceLevel(score);
  const color = getConfidenceLevelColor(level);
  const percentage = Math.round(score * 100);

  if (variant === 'badge') {
    return (
      <ConfidenceBadge
        score={score}
        size={size}
        showLabel={showLabel}
        showPercentage={showPercentage}
      />
    );
  }

  if (variant === 'progress') {
    return (
      <ConfidenceProgress
        score={score}
        size={size}
        showLabel={showLabel}
        showPercentage={showPercentage}
      />
    );
  }

  if (variant === 'icon') {
    return (
      <ConfidenceIcon
        score={score}
        size={size}
        showLabel={showLabel}
      />
    );
  }

  return null;
}

/**
 * ConfidenceBadge - Badge variant
 */
export function ConfidenceBadge({
  score,
  size = 'md',
  showLabel = true,
  showPercentage = true,
}: ConfidenceIndicatorProps) {
  const level = getConfidenceLevel(score);
  const color = getConfidenceLevelColor(level);
  const percentage = Math.round(score * 100);
  const IconComponent = getConfidenceLevelIcon(level);

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

  return (
    <Badge
      colorScheme={color}
      fontSize={fontSize}
      px={2}
      py={1}
      borderRadius="md"
      display="inline-flex"
      alignItems="center"
      gap={1}
      fontWeight="medium"
    >
      <Icon as={IconComponent} boxSize={iconSize} />
      {showLabel && <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>}
      {showPercentage && <span>({percentage}%)</span>}
    </Badge>
  );
}

/**
 * ConfidenceProgress - Progress bar variant
 */
export function ConfidenceProgress({
  score,
  size = 'md',
  showLabel = true,
  showPercentage = true,
}: ConfidenceIndicatorProps) {
  const level = getConfidenceLevel(score);
  const color = getConfidenceLevelColor(level);
  const percentage = Math.round(score * 100);

  const height = {
    sm: '4px',
    md: '6px',
    lg: '8px',
  }[size];

  const labelSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  }[size];

  return (
    <Box w="100%">
      {(showLabel || showPercentage) && (
        <Flex justify="space-between" align="center" mb={1}>
          {showLabel && (
            <Text fontSize={labelSize} fontWeight="medium" color={`${color}.700`}>
              {level.charAt(0).toUpperCase() + level.slice(1)} Confidence
            </Text>
          )}
          {showPercentage && (
            <Text fontSize={labelSize} fontWeight="bold" color={`${color}.700`}>
              {percentage}%
            </Text>
          )}
        </Flex>
      )}
      <Progress
        value={percentage}
        colorScheme={color}
        size={size}
        borderRadius="full"
        hasStripe
        isAnimated={percentage < 100}
      />
    </Box>
  );
}

/**
 * ConfidenceIcon - Icon-only variant
 */
export function ConfidenceIcon({
  score,
  size = 'md',
  showLabel = false,
}: Omit<ConfidenceIndicatorProps, 'variant' | 'showPercentage'>) {
  const level = getConfidenceLevel(score);
  const color = getConfidenceLevelColor(level);
  const percentage = Math.round(score * 100);
  const IconComponent = getConfidenceLevelIcon(level);

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const tooltipLabel = `${level.charAt(0).toUpperCase() + level.slice(1)} confidence (${percentage}%)`;

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <Flex align="center" gap={1}>
        <Icon
          as={IconComponent}
          boxSize={iconSize}
          color={`${color}.500`}
        />
        {showLabel && (
          <Text fontSize="sm" color={`${color}.700`} fontWeight="medium">
            {percentage}%
          </Text>
        )}
      </Flex>
    </Tooltip>
  );
}

/**
 * ConfidenceGrid - Display multiple confidence scores
 */
export interface ConfidenceGridProps {
  scores: {
    label: string;
    value: number;
    description?: string;
  }[];
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceGrid({ scores, size = 'md' }: ConfidenceGridProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
      gap={3}
    >
      {scores.map((item, index) => (
        <Tooltip
          key={index}
          label={item.description}
          placement="top"
          hasArrow
          isDisabled={!item.description}
        >
          <Box
            p={3}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            _hover={{ borderColor: 'gray.300', shadow: 'sm' }}
            transition="all 0.2s"
          >
            <Text fontSize="sm" color="gray.600" mb={1}>
              {item.label}
            </Text>
            <ConfidenceProgress
              score={item.value}
              size={size}
              showLabel={false}
              showPercentage={true}
            />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}

/**
 * ConfidenceSummary - Overall confidence with breakdown
 */
export interface ConfidenceSummaryProps {
  overallScore: number;
  breakdown?: {
    merchant?: number;
    transaction?: number;
    items?: number;
    payment?: number;
    tax?: number;
  };
}

export function ConfidenceSummary({
  overallScore,
  breakdown,
}: ConfidenceSummaryProps) {
  const level = getConfidenceLevel(overallScore);
  const color = getConfidenceLevelColor(level);
  const percentage = Math.round(overallScore * 100);

  const breakdownScores = breakdown
    ? [
        { label: 'Merchant', value: breakdown.merchant || 0, description: 'Business name, address, ABN accuracy' },
        { label: 'Transaction', value: breakdown.transaction || 0, description: 'Date, time, receipt number accuracy' },
        { label: 'Items', value: breakdown.items || 0, description: 'Line items, quantities, prices accuracy' },
        { label: 'Payment', value: breakdown.payment || 0, description: 'Payment method, total, subtotal accuracy' },
        { label: 'Tax', value: breakdown.tax || 0, description: 'GST amount and calculation accuracy' },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <Box>
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Overall Confidence
        </Text>
        <ConfidenceBadge
          score={overallScore}
          size="lg"
          showLabel={true}
          showPercentage={true}
        />
      </Flex>

      <Progress
        value={percentage}
        colorScheme={color}
        size="lg"
        borderRadius="full"
        hasStripe
        isAnimated
        mb={4}
      />

      {breakdownScores.length > 0 && (
        <>
          <Text fontSize="md" fontWeight="semibold" mb={3}>
            Confidence Breakdown
          </Text>
          <ConfidenceGrid scores={breakdownScores} size="sm" />
        </>
      )}
    </Box>
  );
}

export default ConfidenceIndicator;
