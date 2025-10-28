import React from 'react';
import { Calendar } from 'lucide-react';
import { Select } from '@/components/chakra-ui/select';

export type DateRangePeriod =
  | 'this-month'
  | 'last-month'
  | 'last-3-months'
  | 'last-6-months'
  | 'last-12-months'
  | 'ytd'
  | 'custom';

interface DateRangeSelectorProps {
  value: DateRangePeriod;
  onChange: (period: DateRangePeriod) => void;
  className?: string;
}

/**
 * DateRangeSelector - Dropdown selector for time period filtering
 *
 * Story 7.2 - Task 8: Interactive Date Range Selector
 *
 * Features:
 * - 7 time period options (This Month → Custom Range)
 * - State management via props (controlled component)
 * - Triggers chart updates when changed (parent responsibility)
 * - Smooth transition animations (handled by parent components)
 * - Calendar icon for visual clarity
 *
 * Note: "Custom Range" would open a date picker modal in full implementation.
 * For demo, it's selectable but shows a notice.
 */
export function DateRangeSelector({ value, onChange, className = '' }: DateRangeSelectorProps) {
  const options: { value: DateRangePeriod; label: string }[] = [
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-12-months', label: 'Last 12 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range...' },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as DateRangePeriod;

    // Show notice for custom range (not implemented in demo)
    if (newValue === 'custom') {
      alert('Custom date range picker coming in full version! For now, please select a preset period.');
      return;
    }

    onChange(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="h-5 w-5 text-darkStone flex-shrink-0" aria-hidden="true" />
      <Select
        value={value}
        onChange={handleChange}
        className="flex-1 min-w-[200px]"
        aria-label="Select time period"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
