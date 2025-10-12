// Australian Badge Showcase Component
// Displays all 30+ Australian-specific financial literacy badges with earned status

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Lock,
  Trophy,
  Star,
  Medal,
  Award,
  Building,
  CheckCircle,
  Camera,
  RefreshCw,
  PieChart,
  FileText,
  Landmark,
  Shield,
  AlertTriangle,
  Search,
  DollarSign,
  TrendingUp,
  Target,
  Calculator,
  Sparkles,
  Gem,
  PartyPopper,
  Calendar,
  Flame,
  GraduationCap,
} from 'lucide-react';
import { fetchBadgesWithProgress } from '@/services/gamificationService';
import type { BadgeWithProgress } from '@/types/gamification';

// Map badge icons from string to Lucide components
const badgeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Building,
  CheckCircle,
  Camera,
  RefreshCw,
  Medal,
  Award,
  PieChart,
  Star,
  FileText,
  Landmark,
  Shield,
  AlertTriangle,
  Search,
  DollarSign,
  TrendingUp,
  Target,
  Calculator,
  Sparkles,
  Gem,
  PartyPopper,
  Calendar,
  Flame,
  GraduationCap,
};

export function AustralianBadgeShowcase() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithProgress | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Fetch all badges with progress and earned status
  const { data: badges, isLoading } = useQuery<BadgeWithProgress[]>({
    queryKey: ['badges-with-progress'],
    queryFn: fetchBadgesWithProgress,
    staleTime: 60_000, // 1 minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <p className="text-stone">Loading badges...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredBadges =
    categoryFilter === 'all'
      ? badges
      : badges?.filter((b) => b.badge_category === categoryFilter);

  const earnedCount = badges?.filter((b) => b.isEarned).length || 0;
  const totalCount = badges?.length || 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              Australian Badge Collection
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {earnedCount} / {totalCount} Earned
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter Tabs */}
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="onboarding">Getting Started</TabsTrigger>
              <TabsTrigger value="transaction">Transactions</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="data_driven">Data-Driven</TabsTrigger>
              <TabsTrigger value="milestone">Milestones</TabsTrigger>
            </TabsList>

            <TabsContent value={categoryFilter} className="mt-6">
              {/* Badge Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBadges?.map((badge) => {
                  const IconComponent =
                    badgeIconMap[badge.badge_icon] || Trophy;
                  const isEarned = badge.isEarned;

                  // Theme color mapping
                  const themeColorClass = {
                    green: 'from-green-100 to-green-50 border-green-200',
                    blue: 'from-blue-100 to-blue-50 border-blue-200',
                    gold: 'from-yellow-100 to-yellow-50 border-yellow-200',
                    purple: 'from-purple-100 to-purple-50 border-purple-200',
                    platinum: 'from-gray-100 to-gray-50 border-gray-200',
                  }[badge.badge_theme];

                  const rarityBadgeClass = {
                    common: 'bg-gray-200 text-gray-700',
                    rare: 'bg-blue-200 text-blue-700',
                    epic: 'bg-purple-200 text-purple-700',
                    legendary: 'bg-yellow-200 text-yellow-700',
                  }[badge.rarity];

                  return (
                    <div
                      key={badge.badge_id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                        isEarned
                          ? `bg-gradient-to-br ${themeColorClass}`
                          : 'bg-gray-50 border-gray-200 opacity-60 grayscale'
                      }`}
                    >
                      {/* Rarity Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className={`text-xs px-1.5 py-0.5 ${rarityBadgeClass}`}>
                          {badge.rarity}
                        </Badge>
                      </div>

                      {/* Icon */}
                      <div className="flex justify-center mb-3 mt-4">
                        {isEarned ? (
                          <IconComponent
                            className="h-14 w-14"
                            style={{ color: badge.badge_color }}
                          />
                        ) : (
                          <Lock className="h-14 w-14 text-gray-400" />
                        )}
                      </div>

                      {/* Badge Name */}
                      <p
                        className={`text-center font-semibold text-sm leading-tight ${
                          isEarned ? 'text-charcoal' : 'text-gray-400'
                        }`}
                      >
                        {badge.badge_name}
                      </p>

                      {/* Points */}
                      {isEarned && (
                        <p className="text-center text-xs text-stone mt-1">
                          +{badge.reward_points} pts
                        </p>
                      )}

                      {/* Progress Bar (if in progress) */}
                      {!isEarned && badge.progress && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all"
                              style={{
                                width: `${(badge.progress.current_progress / badge.progress.target_progress) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-1">
                            {badge.progress.current_progress}/{badge.progress.target_progress}
                          </p>
                        </div>
                      )}

                      {/* Lock Criteria (if not earned and no progress) */}
                      {!isEarned && !badge.progress && (
                        <p className="text-xs text-gray-400 text-center mt-2 line-clamp-2">
                          {badge.unlock_criteria}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {(() => {
                  const IconComponent =
                    badgeIconMap[selectedBadge.badge_icon] || Trophy;
                  return (
                    <IconComponent
                      className="h-8 w-8"
                      style={{ color: selectedBadge.badge_color }}
                    />
                  );
                })()}
                <span>{selectedBadge.badge_name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* Badge Status */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={selectedBadge.isEarned ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {selectedBadge.isEarned ? '✓ Earned' : 'Locked'}
                </Badge>
                <Badge className="text-xs">{selectedBadge.rarity}</Badge>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-sm text-charcoal mb-1">Description</h4>
                <p className="text-sm text-stone">{selectedBadge.badge_description}</p>
              </div>

              {/* Australian Context */}
              <div>
                <h4 className="font-semibold text-sm text-charcoal mb-1">🇦🇺 Australian Context</h4>
                <p className="text-sm text-stone">{selectedBadge.australian_context}</p>
              </div>

              {/* Unlock Criteria */}
              <div>
                <h4 className="font-semibold text-sm text-charcoal mb-1">Unlock Criteria</h4>
                <p className="text-sm text-stone">{selectedBadge.unlock_criteria}</p>
              </div>

              {/* Reward */}
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <span className="text-sm font-medium text-charcoal">Reward</span>
                <span className="text-lg font-bold text-green-600">
                  +{selectedBadge.reward_points} points
                </span>
              </div>

              {/* External Links */}
              {(selectedBadge.asic_reference || selectedBadge.ato_reference) && (
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-2">Learn More</h4>
                  <div className="space-y-2">
                    {selectedBadge.asic_reference && (
                      <a
                        href={selectedBadge.asic_reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline block"
                      >
                        📚 ASIC MoneySmart →
                      </a>
                    )}
                    {selectedBadge.ato_reference && (
                      <a
                        href={selectedBadge.ato_reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline block"
                      >
                        🧾 ATO Resource →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Earned Date */}
              {selectedBadge.isEarned && selectedBadge.earnedDate && (
                <div className="text-center text-xs text-stone pt-2 border-t">
                  Earned on {new Date(selectedBadge.earnedDate).toLocaleDateString('en-AU')}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
