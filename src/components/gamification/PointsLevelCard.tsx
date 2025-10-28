// Enhanced Points & Level Card with Australian Level Titles
// Displays total points, current level, progress to next level, and points history

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/chakra-ui/card';
import { Progress } from '@/components/chakra-ui/progress';
import { Badge } from '@/components/chakra-ui/badge';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp } from 'lucide-react';
import {
  fetchGamificationProfile,
  fetchPointsHistory,
  calculateLevelInfo,
} from '@/services/gamificationService';
import type { GamificationProfile, PointTransaction } from '@/types/gamification';

export function PointsLevelCard() {
  const [levelInfo, setLevelInfo] = useState<ReturnType<typeof calculateLevelInfo> | null>(null);

  // Fetch gamification profile
  const { data: profile, isLoading: profileLoading } = useQuery<GamificationProfile | null>({
    queryKey: ['gamification-profile'],
    queryFn: fetchGamificationProfile,
    staleTime: 30_000, // 30 seconds
  });

  // Fetch points history
  const { data: history } = useQuery<PointTransaction[]>({
    queryKey: ['points-history', 10],
    queryFn: () => fetchPointsHistory(10),
    staleTime: 30_000,
  });

  // Calculate level info when profile changes
  useEffect(() => {
    if (profile) {
      const info = calculateLevelInfo(profile.total_points);
      setLevelInfo(info);
    }
  }, [profile]);

  if (profileLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <p className="text-stone">Loading your progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile || !levelInfo) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <p className="text-stone">No gamification data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-cream">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-charcoal">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Your Financial Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Points Display */}
        <div className="text-center">
          <p className="text-7xl font-bold text-charcoal font-mono tabular-nums">
            {profile.total_points.toLocaleString()}
          </p>
          <p className="text-stone text-sm mt-2">Total Points Earned</p>
        </div>

        {/* Current Level Badge */}
        <div className="text-center">
          <Badge
            variant="secondary"
            className="text-lg px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 text-charcoal font-semibold"
          >
            <Sparkles className="h-4 w-4 mr-2 inline text-yellow-500" />
            Level {levelInfo.currentLevel}: {levelInfo.levelTitle}
          </Badge>
        </div>

        {/* Progress to Next Level */}
        <div>
          <div className="flex justify-between text-sm text-stone mb-2">
            <span>Next: {levelInfo.nextLevelTitle}</span>
            <span className="font-medium text-charcoal">
              {profile.total_points.toLocaleString()} / {levelInfo.nextLevelThreshold.toLocaleString()} pts
            </span>
          </div>
          <Progress
            value={levelInfo.progressPercent}
            className="h-4 bg-stone/20"
          />
          <p className="text-xs text-stone mt-1 text-right">
            {levelInfo.pointsToNextLevel.toLocaleString()} points to Level {levelInfo.nextLevel}
          </p>
        </div>

        {/* Points History */}
        {history && history.length > 0 && (
          <div className="border-t border-stone/20 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-charcoal text-sm">Recent Activity</h3>
              <Link
                to="/dashboard/gamification/points-history"
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center text-sm py-2 px-3 rounded-lg bg-white/50 hover:bg-white/80 transition"
                >
                  <span className="text-stone text-xs">{tx.reason}</span>
                  <span className="font-semibold text-green-600 font-mono">
                    +{tx.points_earned}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EOFY Readiness Score (if available) */}
        {profile.eofy_readiness_score !== undefined && profile.eofy_readiness_score > 0 && (
          <div className="border-t border-stone/20 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-charcoal">EOFY Readiness</span>
              <span className="text-sm font-bold text-charcoal">
                {profile.eofy_readiness_score}%
              </span>
            </div>
            <Progress
              value={profile.eofy_readiness_score}
              className="h-2 bg-stone/20"
            />
            <p className="text-xs text-stone mt-1">
              {profile.eofy_readiness_score >= 80
                ? '🎉 Tax-ready! Great record keeping.'
                : 'Keep tagging work expenses to boost your score.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
