import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { mockAIInsights, type AIInsight } from '@/test/fixtures/analytics-mock-data';
import { Button } from '@/components/chakra-ui/button';

interface SpendingInsightsPanelProps {
  insights?: AIInsight[];
}

/**
 * SpendingInsightsPanel - Carousel of AI-generated financial insights
 *
 * Story 7.2 - Task 7: Spending Insights Panel
 *
 * Features:
 * - 5 AI-generated insights
 * - Carousel navigation (Previous/Next buttons)
 * - Insight cards with icon, title, description
 * - "Learn More" button (disabled in demo with tooltip)
 * - Type-based styling (positive, warning, neutral, tip)
 */
export function SpendingInsightsPanel({ insights = mockAIInsights }: SpendingInsightsPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentInsight = insights[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? insights.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === insights.length - 1 ? 0 : prev + 1));
  };

  // Get styling based on insight type
  const getInsightStyles = (type: AIInsight['type']) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          titleColor: 'text-green-900',
          descColor: 'text-green-700',
        };
      case 'warning':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          titleColor: 'text-red-900',
          descColor: 'text-red-700',
        };
      case 'tip':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          titleColor: 'text-blue-900',
          descColor: 'text-blue-700',
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          titleColor: 'text-gray-900',
          descColor: 'text-gray-700',
        };
    }
  };

  const styles = getInsightStyles(currentInsight.type);

  return (
    <div className="space-y-4">
      {/* Insight Card */}
      <div
        className={`p-6 rounded-lg border-2 ${styles.bg} ${styles.border} min-h-[280px] flex flex-col transition-all duration-300`}
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
          <span className="text-3xl" role="img" aria-label="insight icon">
            {currentInsight.icon}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold ${styles.titleColor} mb-3`}>
          {currentInsight.title}
        </h3>

        {/* Description */}
        <p className={`text-sm ${styles.descColor} leading-relaxed flex-1`}>
          {currentInsight.description}
        </p>

        {/* Learn More Button (Disabled in Demo) */}
        <div className="mt-4 pt-4 border-t border-current/20">
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="w-full opacity-50 cursor-not-allowed"
            >
              <Info className="mr-2 h-4 w-4" />
              Learn More
            </Button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Available in full version
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-charcoal"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          aria-label="Previous insight"
          className="hover:bg-sand/50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {/* Page Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-charcoal">
            {currentIndex + 1} of {insights.length}
          </span>
          <div className="flex gap-1">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to insight ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-charcoal'
                    : 'w-2 bg-stone hover:bg-darkStone'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          aria-label="Next insight"
          className="hover:bg-sand/50 transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Priority Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-stone">
        <span>Priority:</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-5 h-1 rounded-full ${
                i < currentInsight.priority ? 'bg-sand' : 'bg-stone/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
