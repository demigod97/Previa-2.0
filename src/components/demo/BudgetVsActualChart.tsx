import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency, mockBudgetComparison, type BudgetComparison } from '@/test/fixtures/analytics-mock-data';

interface BudgetVsActualChartProps {
  data?: BudgetComparison[];
  height?: number;
}

/**
 * BudgetVsActualChart - Horizontal bar chart comparing budgeted vs actual spending
 *
 * Story 7.2 - Task 4: Budget vs. Actual Bar Chart
 *
 * Features:
 * - Horizontal bar chart with 6 categories
 * - Two bars per category (budgeted blue, actual orange)
 * - Visual indicators for under/over budget (green/red borders)
 * - Percentage variance text
 * - Responsive layout
 */
export function BudgetVsActualChart({
  data = mockBudgetComparison,
  height = 300,
}: BudgetVsActualChartProps) {
  // Transform data for stacked bars display
  const chartData = data.map(item => ({
    category: item.category,
    budgeted: item.budgeted,
    actual: item.actual,
    variance: item.variance,
    variancePercentage: item.variancePercentage,
    status: item.status,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as BudgetComparison & { category: string };
      const isUnder = data.status === 'under';
      const isOver = data.status === 'over';

      return (
        <div className="bg-white border border-sand rounded-lg shadow-lg p-3 min-w-[200px]">
          <p className="font-semibold text-charcoal text-sm mb-2">
            {data.category}
          </p>

          <div className="space-y-1 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone">Budgeted:</span>
              <span className="text-sm font-mono text-blue-600 font-semibold">
                {formatCurrency(data.budgeted)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone">Actual:</span>
              <span className="text-sm font-mono text-orange-600 font-semibold">
                {formatCurrency(data.actual)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-sand">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone">Variance:</span>
              <span
                className={`text-sm font-mono font-bold ${
                  isUnder ? 'text-green-600' : isOver ? 'text-red-600' : 'text-charcoal'
                }`}
              >
                {data.variancePercentage > 0 ? '+' : ''}
                {data.variancePercentage.toFixed(1)}%
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${
                isUnder ? 'text-green-600' : isOver ? 'text-red-600' : 'text-charcoal'
              }`}
            >
              {isUnder && `✓ Under budget by ${formatCurrency(Math.abs(data.variance))}`}
              {isOver && `⚠ Over budget by ${formatCurrency(data.variance)}`}
              {data.status === 'on-track' && 'On track'}
            </p>
          </div>
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

  // Custom label showing variance percentage
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, payload } = props;

    // Guard: payload might be undefined or incomplete during initial render
    if (!payload || !payload.status || payload.variancePercentage === undefined) {
      return null;
    }

    const isUnder = payload.status === 'under';
    const isOver = payload.status === 'over';
    const variance = payload.variancePercentage;

    // Position label at end of longer bar
    const labelX = x + width + 5;
    const labelY = y + height / 2;

    return (
      <g>
        {/* Border indicator */}
        <rect
          x={x - 2}
          y={y - 2}
          width={4}
          height={height + 4}
          fill={isUnder ? '#10B981' : isOver ? '#EF4444' : 'transparent'}
          rx={2}
        />

        {/* Variance percentage text */}
        <text
          x={labelX}
          y={labelY}
          fill={isUnder ? '#10B981' : isOver ? '#EF4444' : '#403B31'}
          fontSize={11}
          fontWeight="600"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {variance > 0 ? '+' : ''}{variance.toFixed(0)}%
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#8C877D"
          opacity={0.2}
          horizontal={false}
        />

        <XAxis
          type="number"
          tick={{ fill: '#595347', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#8C877D', opacity: 0.3 }}
          tickFormatter={formatYAxis}
        />

        <YAxis
          type="category"
          dataKey="category"
          tick={{ fill: '#595347', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#8C877D', opacity: 0.3 }}
          width={100}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F2E9D8', opacity: 0.3 }} />

        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="square"
          formatter={(value) => (
            <span className="text-sm text-charcoal">{value}</span>
          )}
        />

        <Bar
          dataKey="budgeted"
          fill="#3B82F6"
          name="Budgeted"
          radius={[0, 4, 4, 0]}
          barSize={18}
        />

        <Bar
          dataKey="actual"
          fill="#F59E0B"
          name="Actual"
          radius={[0, 4, 4, 0]}
          barSize={18}
          label={renderCustomLabel}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
