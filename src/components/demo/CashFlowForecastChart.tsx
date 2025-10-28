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
  ReferenceLine,
  Label,
} from 'recharts';
import { formatCurrency, mockCashFlowForecast, type CashFlowDataPoint } from '@/test/fixtures/analytics-mock-data';

interface CashFlowForecastChartProps {
  data?: CashFlowDataPoint[];
  height?: number;
}

/**
 * CashFlowForecastChart - 120-day cash flow projection with confidence bands
 *
 * Story 7.2 - Task 5: Cash Flow Forecast
 *
 * Features:
 * - Historical line (solid, last 30 days)
 * - Forecast line (dashed, next 90 days)
 * - Confidence band (shaded area with upper/lower bounds)
 * - Event annotations (rent, salary, bills)
 * - Custom tooltip with confidence interval
 */
export function CashFlowForecastChart({
  data = mockCashFlowForecast,
  height = 300,
}: CashFlowForecastChartProps) {
  // Split data into historical and forecast for styling
  const historicalData = data.filter(d => d.type === 'historical');
  const forecastData = data.filter(d => d.type === 'forecast');

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as CashFlowDataPoint;
      const isForecast = dataPoint.type === 'forecast';

      return (
        <div className="bg-white border border-sand rounded-lg shadow-lg p-3 min-w-[200px]">
          <p className="text-xs text-stone mb-1">
            Day {dataPoint.day > 0 ? '+' : ''}{dataPoint.day}
          </p>
          <p className="text-xs text-stone mb-2">
            {new Date(dataPoint.date).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>

          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-stone">
                {isForecast ? 'Projected:' : 'Balance:'}
              </span>
              <span className="text-sm font-mono text-charcoal font-bold">
                {formatCurrency(dataPoint.balance)}
              </span>
            </div>

            {isForecast && dataPoint.confidenceUpper && dataPoint.confidenceLower && (
              <div className="pt-2 border-t border-sand text-xs text-stone">
                <p>80% Confidence:</p>
                <p className="font-mono text-[11px] mt-1">
                  {formatCurrency(dataPoint.confidenceLower)} - {formatCurrency(dataPoint.confidenceUpper)}
                </p>
              </div>
            )}

            {dataPoint.event && (
              <div className="pt-2 border-t border-sand">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {dataPoint.event.type === 'rent' && '🏠'}
                    {dataPoint.event.type === 'salary' && '💰'}
                    {dataPoint.event.type === 'bill' && '📄'}
                  </span>
                  <span className="text-xs font-semibold text-charcoal">
                    {dataPoint.event.description}
                  </span>
                </div>
              </div>
            )}
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

  // Format X-axis to show days
  const formatXAxis = (value: number) => {
    if (value === 0) return 'Today';
    return value > 0 ? `+${value}d` : `${value}d`;
  };

  // Find events for annotations
  const eventsToAnnotate = data.filter(d => d.event);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#8C877D"
          opacity={0.2}
          vertical={false}
        />

        <XAxis
          dataKey="day"
          tick={{ fill: '#595347', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#8C877D', opacity: 0.3 }}
          tickFormatter={formatXAxis}
          ticks={[-30, -15, 0, 15, 30, 45, 60, 75, 90]}
        />

        <YAxis
          tick={{ fill: '#595347', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#8C877D', opacity: 0.3 }}
          tickFormatter={formatYAxis}
          width={70}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#403B31', strokeWidth: 1 }} />

        {/* Vertical line at today */}
        <ReferenceLine
          x={0}
          stroke="#403B31"
          strokeWidth={2}
          strokeDasharray="3 3"
          label={{
            value: 'Today',
            position: 'top',
            fill: '#403B31',
            fontSize: 11,
            fontWeight: 600,
          }}
        />

        {/* Confidence band (forecast only) */}
        <Area
          type="monotone"
          dataKey="confidenceUpper"
          stroke="none"
          fill="url(#confidenceBand)"
          fillOpacity={1}
        />
        <Area
          type="monotone"
          dataKey="confidenceLower"
          stroke="none"
          fill="url(#confidenceBand)"
          fillOpacity={1}
        />

        {/* Historical line (solid) */}
        <Line
          type="monotone"
          dataKey="balance"
          data={historicalData}
          stroke="#10B981"
          strokeWidth={3}
          dot={false}
          name="Historical"
        />

        {/* Forecast line (dashed) */}
        <Line
          type="monotone"
          dataKey="balance"
          data={forecastData}
          stroke="#3B82F6"
          strokeWidth={3}
          strokeDasharray="5 5"
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            if (!payload.event) return null;

            // Custom dot for events
            const eventIcon = payload.event.type === 'rent' ? '🏠'
              : payload.event.type === 'salary' ? '💰'
              : '📄';

            return (
              <g>
                <circle cx={cx} cy={cy} r={8} fill="white" stroke="#3B82F6" strokeWidth={2} />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                >
                  {eventIcon}
                </text>
              </g>
            );
          }}
          name="Forecast"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
