import React, { useState } from 'react';
import { DemoBanner } from '@/components/demo';
import { SpendingTrendsChart } from '@/components/demo/SpendingTrendsChart';
import { CategoryBreakdownChart } from '@/components/demo/CategoryBreakdownChart';
import { BudgetVsActualChart } from '@/components/demo/BudgetVsActualChart';
import { CashFlowForecastChart } from '@/components/demo/CashFlowForecastChart';
import { TaxEstimationCard } from '@/components/demo/TaxEstimationCard';
import { SpendingInsightsPanel } from '@/components/demo/SpendingInsightsPanel';
import { DateRangeSelector, type DateRangePeriod } from '@/components/demo/DateRangeSelector';
import { Card } from '@/components/chakra-ui/card';

/**
 * AdvancedAnalyticsDemo - Viewing-only demo screen for advanced analytics
 *
 * Story 7.2: Advanced Analytics Demo Screen
 *
 * Features:
 * - Demo banner with dismissible notification
 * - Spending trends chart (12 months)
 * - Category breakdown donut chart
 * - Budget vs. actual bar chart
 * - Cash flow forecast (90 days)
 * - Tax estimation calculator
 * - Spending insights panel (AI-generated)
 * - Date range selector (interactive)
 *
 * All data is MOCK - no backend implementation
 */
export default function AdvancedAnalyticsDemo() {
  const [selectedPeriod, setSelectedPeriod] = useState<DateRangePeriod>('this-month');

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            📊 Advanced Analytics
          </h1>
          <p className="text-darkStone text-base">
            Preview of advanced reporting and forecasting capabilities
          </p>
        </div>

        {/* Demo Banner */}
        <DemoBanner
          title="🔍 Demo Mode - Future Feature Preview"
          message="Advanced Analytics coming in Q2 2026 with premium tier."
          icon="🔍"
          dismissible={true}
        />

        {/* Date Range Selector - Task 8 */}
        <Card className="mb-6 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-1">
                Time Period
              </h2>
              <p className="text-sm text-stone">
                Select a time range to filter analytics
              </p>
            </div>
            <DateRangeSelector value={selectedPeriod} onChange={setSelectedPeriod} />
          </div>
          {selectedPeriod !== 'this-month' && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              📊 Charts would update with {selectedPeriod.replace(/-/g, ' ')} data in full version
            </div>
          )}
        </Card>

        {/* Charts Grid - Placeholders for Tasks 2-7 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Spending Trends Chart - Task 2 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              💰 Spending Trends (Last 12 Months)
            </h2>
            <SpendingTrendsChart height={280} />
          </Card>

          {/* Category Breakdown Chart - Task 3 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              🍕 Category Breakdown (October 2024)
            </h2>
            <CategoryBreakdownChart height={280} />
          </Card>

          {/* Budget vs Actual Chart - Task 4 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              📊 Budget vs. Actual (October 2024)
            </h2>
            <BudgetVsActualChart height={280} />
          </Card>

          {/* Cash Flow Forecast - Task 5 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              📈 Cash Flow Forecast (Next 90 Days)
            </h2>
            <CashFlowForecastChart height={280} />
          </Card>
        </div>

        {/* Tax Estimation & Insights - Tasks 6-7 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Estimation Card - Task 6 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              💼 Tax Estimation (2024-25)
            </h2>
            <TaxEstimationCard />
          </Card>

          {/* Spending Insights Panel - Task 7 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              💡 AI-Generated Insights
            </h2>
            <SpendingInsightsPanel />
          </Card>
        </div>
      </div>
    </div>
  );
}
