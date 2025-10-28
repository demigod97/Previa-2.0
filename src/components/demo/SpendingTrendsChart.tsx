import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { formatCurrency, mockSpendingTrends, type MonthlySpending } from '@/test/fixtures/analytics-mock-data';

interface SpendingTrendsChartProps {
  data?: MonthlySpending[];
  height?: number;
}

/**
 * SpendingTrendsChart - 12-month spending history line chart
 *
 * Story 7.2 - Task 2: Spending Trends Chart
 *
 * Features:
 * - Line chart with gradient fill
 * - 12 months of spending data (Jan - Dec 2024)
 * - Hover tooltip with amount and percentage change
 * - Responsive sizing (stacks on mobile)
 * - Previa color scheme (charcoal line, sand gradient)
 */
export function SpendingTrendsChart({
  data = mockSpendingTrends,
  height = 300,
}: SpendingTrendsChartProps) {
  // Custom tooltip with percentage change
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as MonthlySpending;
      const amount = formatCurrency(dataPoint.totalSpent);
      const percentageChange = dataPoint.percentageChange;

      return (
        <div className="bg-white border border-sand rounded-lg shadow-lg p-3">
          <p className="font-semibold text-charcoal text-sm mb-1">
            {dataPoint.month}
          </p>
          <p className="text-charcoal font-mono text-lg font-bold">
            {amount}
          </p>
          <p className="text-xs text-stone mt-1">
            {dataPoint.transactionCount} transactions
          </p>
          {percentageChange !== undefined && (
            <p
              className={`text-xs font-medium mt-1 ${
                percentageChange < 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {percentageChange > 0 ? '↑' : '↓'}{' '}
              {Math.abs(percentageChange).toFixed(1)}% from previous month
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format Y-axis to show currency
  const formatYAxis = (value: number) => {
    const dollars = value / 100;
    if (dollars >= 1000) {
      return `$${(dollars / 1000).toFixed(1)}k`;
    }
    return `$${dollars.toFixed(0)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D9C8B4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#D9C8B4" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#8C877D"
          opacity={0.2}
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fill: '#595347', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#8C877D', opacity: 0.3 }}
          interval="preserveStartEnd"
          tickFormatter={(value) => {
            // Show only month abbreviation on mobile
            const parts = value.split(' ');
            return parts[0]; // e.g., "Jan"
          }}
        />

        <YAxis
          tick={{ fill: '#595347', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#8C877D', opacity: 0.3 }}
          tickFormatter={formatYAxis}
          width={60}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#403B31', strokeWidth: 1 }} />

        {/* Gradient area under line */}
        <Area
          type="monotone"
          dataKey="totalSpent"
          fill="url(#spendingGradient)"
          stroke="none"
        />

        {/* Main line */}
        <Line
          type="monotone"
          dataKey="totalSpent"
          stroke="#403B31"
          strokeWidth={3}
          dot={{ fill: '#403B31', r: 4 }}
          activeDot={{ r: 6, fill: '#D9C8B4', stroke: '#403B31', strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
