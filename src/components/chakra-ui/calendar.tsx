// Calendar component placeholder
// TODO: Integrate with a date picker library compatible with Chakra UI
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  className?: string;
}

export const Calendar = ({ mode, selected, onSelect, className }: CalendarProps) => (
  <Box className={className}>
    {/* Placeholder - needs date picker library integration */}
    <input type="date" onChange={(e) => onSelect?.(new Date(e.target.value))} />
  </Box>
);
