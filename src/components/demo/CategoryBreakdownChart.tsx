import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency, mockCategoryBreakdown, mockCategoryTotal, type CategorySpending } from '@/test/fixtures/analytics-mock-data';

interface CategoryBreakdownChartProps {
  data?: CategorySpending[];
  height?: number;
}

/**
 * CategoryBreakdownChart - Donut chart showing expense distribution by category
 *
 * Story 7.2 - Task 3: Category Breakdown Chart
 *
 * Features:
 * - Donut chart with 7 expense categories
 * - Percentages and amounts per category
 * - Total in center of donut
 * - Color-coded segments
 * - Legend with category names and amounts
 * - Hover effect highlights segment
 */
export function CategoryBreakdownChart({
  data = mockCategoryBreakdown,
  height = 300,
}: CategoryBreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total for center label
  const total = data.reduce((sum, cat) => sum + cat.amount, 0);

  // Custom label in center of donut
  const CenterLabel = () => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      className="font-mono font-bold"
      fill="#403B31"
    >
      <tspan x="50%" dy="-0.5em" fontSize="14" fill="#595347">
        Total
      </tspan>
      <tspan x="50%" dy="1.5em" fontSize="20">
        {formatCurrency(total)}
      </tspan>
    </text>
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as CategorySpending;
      return (
        <div className="bg-white border border-sand rounded-lg shadow-lg p-3">
          <p className="font-semibold text-charcoal text-sm mb-1">
            {dataPoint.category}
          </p>
          <p className="text-charcoal font-mono text-lg font-bold">
            {formatCurrency(dataPoint.amount)}
          </p>
          <p className="text-xs text-stone mt-1">
            {dataPoint.percentage}% of total
          </p>
          <p className="text-xs text-stone">
            {dataPoint.transactionCount} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = () => {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center justify-between text-sm cursor-pointer hover:bg-cream-dark/20 rounded px-2 py-1 transition-colors"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center gap-2 flex-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-charcoal font-medium">{entry.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-stone text-xs">{entry.percentage}%</span>
              <span className="text-charcoal font-mono font-semibold min-w-[80px] text-right">
                {formatCurrency(entry.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={2}
            dataKey="amount"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                stroke={activeIndex === index ? '#403B31' : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <CenterLabel />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      {renderLegend()}
    </div>
  );
}
