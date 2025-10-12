// Australian Tip of the Day Component
// Displays contextual Australian financial literacy tips from the 200+ tip database

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getRandomTips } from '@/services/gamificationService';
import type { EducationalTip } from '@/types/gamification';

interface AustralianTipOfTheDayProps {
  contextTrigger?: string; // Optional: show tips related to specific action
  className?: string;
}

export function AustralianTipOfTheDay({
  contextTrigger,
  className = '',
}: AustralianTipOfTheDayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch random tips (or contextual tips if trigger provided)
  const { data: tips, isLoading } = useQuery<EducationalTip[]>({
    queryKey: ['educational-tips', contextTrigger || 'random'],
    queryFn: () => getRandomTips(20),
    staleTime: 300_000, // 5 minutes
  });

  // Shuffle tips when loaded
  useEffect(() => {
    if (tips && tips.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * tips.length));
    }
  }, [tips]);

  const nextTip = () => {
    if (!tips) return;
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    if (!tips) return;
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (isLoading || !tips || tips.length === 0) {
    return (
      <Card className={`bg-gradient-to-br from-yellow-50 to-orange-50 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <p className="text-stone text-sm">Loading tips...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTip = tips[currentIndex];

  // Category color mapping
  const categoryColorClass = {
    tax: 'bg-blue-100 text-blue-800',
    super: 'bg-purple-100 text-purple-800',
    banking: 'bg-green-100 text-green-800',
    gst: 'bg-yellow-100 text-yellow-800',
    consumer: 'bg-red-100 text-red-800',
    budget: 'bg-indigo-100 text-indigo-800',
    scam: 'bg-orange-100 text-orange-800',
    debt: 'bg-pink-100 text-pink-800',
  }[currentTip.tip_category] || 'bg-gray-100 text-gray-800';

  // Difficulty badge
  const difficultyBadgeClass = {
    beginner: 'bg-green-200 text-green-800',
    intermediate: 'bg-yellow-200 text-yellow-800',
    advanced: 'bg-red-200 text-red-800',
  }[currentTip.difficulty_level];

  return (
    <Card className={`bg-gradient-to-br from-yellow-50 via-orange-50 to-cream border-2 border-yellow-200 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            💡 Australian Financial Tip
          </CardTitle>
          <Badge className={categoryColorClass}>
            {currentTip.tip_category.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tip Text */}
        <div className="bg-white/60 rounded-lg p-4 min-h-[120px] flex items-center">
          <p className="text-sm text-charcoal leading-relaxed">
            {currentTip.tip_text}
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2">
          {currentTip.is_australian_specific && (
            <Badge variant="secondary" className="text-xs">
              🇦🇺 Australian Specific
            </Badge>
          )}
          <Badge className={`text-xs ${difficultyBadgeClass}`}>
            {currentTip.difficulty_level}
          </Badge>
          {currentTip.age_group !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Ages {currentTip.age_group}
            </Badge>
          )}
        </div>

        {/* External Link */}
        {currentTip.external_link && (
          <a
            href={currentTip.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {currentTip.regulatory_reference || 'Learn more'}
          </a>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-yellow-200">
          <Button variant="ghost" size="sm" onClick={prevTip} className="h-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-stone font-medium">
            {currentIndex + 1} / {tips.length}
          </span>
          <Button variant="ghost" size="sm" onClick={nextTip} className="h-8">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Context Trigger Note */}
        {contextTrigger && (
          <p className="text-xs text-stone italic text-center">
            Tip triggered by: {contextTrigger.replace(/_/g, ' ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
