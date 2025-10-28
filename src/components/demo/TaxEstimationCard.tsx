import React from 'react';
import { formatCurrency, mockTaxEstimation, type TaxEstimation } from '@/test/fixtures/analytics-mock-data';
import { Progress } from '@/components/chakra-ui/progress';

interface TaxEstimationCardProps {
  data?: TaxEstimation;
}

/**
 * TaxEstimationCard - Australian tax estimation calculator with ATO 2024-25 brackets
 *
 * Story 7.2 - Task 6: Tax Estimation Calculator
 *
 * Features:
 * - Income summary (total, deductions, taxable)
 * - ATO 2024-25 tax bracket breakdown
 * - Medicare levy calculation (2%)
 * - Progress bar for income target
 * - Deductions summary
 * - Disclaimer for accuracy
 */
export function TaxEstimationCard({ data = mockTaxEstimation }: TaxEstimationCardProps) {
  const incomeProgress = (data.totalIncome / 12000000) * 100; // Target: $120,000

  return (
    <div className="space-y-6">
      {/* Income Summary */}
      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-3">Income Summary (YTD)</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-stone">Total Income:</span>
            <span className="text-base font-mono font-bold text-charcoal">
              {formatCurrency(data.totalIncome)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-stone">Total Deductions:</span>
            <span className="text-base font-mono font-semibold text-green-600">
              -{formatCurrency(data.totalDeductions)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-sand">
            <span className="text-sm font-semibold text-charcoal">Taxable Income:</span>
            <span className="text-lg font-mono font-bold text-charcoal">
              {formatCurrency(data.taxableIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Income Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-stone">Annual Income Target</span>
          <span className="text-xs font-mono text-stone">
            {formatCurrency(data.totalIncome)} / $120,000 ({incomeProgress.toFixed(0)}%)
          </span>
        </div>
        <Progress value={incomeProgress} className="h-2" />
      </div>

      {/* Tax Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-3">Tax Breakdown (ATO 2024-25)</h3>
        <div className="space-y-3">
          {data.brackets.map((bracket, index) => {
            const isActive = bracket.taxAmount > 0;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-medium ${isActive ? 'text-blue-900' : 'text-gray-600'}`}>
                    {bracket.label}
                  </span>
                  <span className={`text-sm font-mono font-bold ${isActive ? 'text-blue-900' : 'text-gray-500'}`}>
                    {formatCurrency(bracket.taxAmount)}
                  </span>
                </div>
                {isActive && (
                  <div className="text-xs text-blue-700 mt-1">
                    Rate: {(bracket.rate * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            );
          })}

          {/* Medicare Levy */}
          <div className="p-3 rounded-lg border bg-purple-50 border-purple-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-purple-900">
                Medicare Levy (2%)
              </span>
              <span className="text-sm font-mono font-bold text-purple-900">
                {formatCurrency(data.medicareLvy)}
              </span>
            </div>
          </div>

          {/* Total Tax */}
          <div className="p-4 rounded-lg bg-charcoal border-2 border-charcoal">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">
                Total Estimated Tax:
              </span>
              <span className="text-xl font-mono font-bold text-sand">
                {formatCurrency(data.totalTax)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deductions Summary */}
      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-3">Deductions Breakdown</h3>
        <div className="space-y-2">
          {data.deductionBreakdown.map((deduction, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-stone">{deduction.category}:</span>
              <span className="text-sm font-mono font-semibold text-green-600">
                {formatCurrency(deduction.amount)}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 border-t border-sand">
            <span className="text-sm font-semibold text-charcoal">Total Deductions:</span>
            <span className="text-base font-mono font-bold text-green-600">
              {formatCurrency(data.totalDeductions)}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-1">
              Estimate Only
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              This is an estimate based on ATO 2024-25 tax brackets. Actual tax liability may vary.
              Consult a qualified tax professional for accurate advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
