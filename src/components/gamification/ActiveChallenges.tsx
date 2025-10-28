// Active Challenges Component
// Displays daily/weekly/monthly challenges with progress tracking and countdown timers

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/chakra-ui/card';
import { Progress } from '@/components/chakra-ui/progress';
import { Badge } from '@/components/chakra-ui/badge';
import { Trophy, Clock, Target } from 'lucide-react';
import { fetchActiveChallenges } from '@/services/gamificationService';
import type { UserChallenge } from '@/types/gamification';

export function ActiveChallenges() {
  // Fetch active challenges
  const { data: challenges, isLoading } = useQuery<UserChallenge[]>({
    queryKey: ['active-challenges'],
    queryFn: fetchActiveChallenges,
    staleTime: 60_000, // 1 minute
    refetchInterval: 60_000, // Refetch every minute for timer updates
  });

  /**
   * Calculate time remaining until challenge expires
   */
  const getTimeRemaining = (expiresAt: string | undefined): string => {
    if (!expiresAt) return 'No deadline';

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff < 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  /**
   * Get challenge type badge color
   */
  const getChallengeTypeBadge = (type: string) => {
    const typeClassMap = {
      daily: 'bg-blue-100 text-blue-800',
      weekly: 'bg-purple-100 text-purple-800',
      monthly: 'bg-green-100 text-green-800',
      educational: 'bg-yellow-100 text-yellow-800',
    };
    return typeClassMap[type as keyof typeof typeClassMap] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Get difficulty color
   */
  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      easy: 'text-green-600',
      medium: 'text-yellow-600',
      hard: 'text-red-600',
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'text-gray-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <p className="text-stone text-sm">Loading challenges...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-charcoal">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Active Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!challenges || challenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-stone mx-auto mb-3 opacity-50" />
            <p className="text-stone text-sm">No active challenges at the moment</p>
            <p className="text-xs text-stone mt-1">
              Check back daily for new financial literacy challenges!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => {
              if (!challenge.challenge) return null;

              const progressPercent =
                (challenge.current_progress / challenge.challenge.target_count) * 100;
              const isCompleted = challenge.current_progress >= challenge.challenge.target_count;

              return (
                <div
                  key={challenge.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-charcoal">
                          {challenge.challenge.challenge_name}
                        </h3>
                        {isCompleted && (
                          <Badge className="bg-green-500 text-white text-xs">
                            ✓ Complete
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-stone">
                        {challenge.challenge.challenge_description}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="ml-2 whitespace-nowrap font-semibold"
                    >
                      +{challenge.challenge.reward_points} pts
                    </Badge>
                  </div>

                  {/* Australian Context (if available) */}
                  {challenge.challenge.australian_context && (
                    <p className="text-xs text-stone bg-yellow-50 border border-yellow-200 rounded px-2 py-1 mb-3">
                      🇦🇺 {challenge.challenge.australian_context}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Progress
                      value={progressPercent}
                      className={`h-3 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`}
                    />
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-xs text-stone font-medium">
                        {challenge.current_progress} / {challenge.challenge.target_count}
                        {' completed'}
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                  </div>

                  {/* Challenge Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Challenge Type */}
                    <Badge className={getChallengeTypeBadge(challenge.challenge.challenge_type)}>
                      {challenge.challenge.challenge_type}
                    </Badge>

                    {/* Difficulty */}
                    <Badge variant="outline">
                      <span className={getDifficultyColor(challenge.challenge.difficulty)}>
                        {challenge.challenge.difficulty}
                      </span>
                    </Badge>

                    {/* Time Remaining */}
                    {challenge.expires_at && !isCompleted && (
                      <div className="flex items-center gap-1 text-stone">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeRemaining(challenge.expires_at)}</span>
                      </div>
                    )}

                    {/* Completion Time */}
                    {isCompleted && challenge.completed_at && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Trophy className="h-3 w-3" />
                        <span>
                          Completed {new Date(challenge.completed_at).toLocaleDateString('en-AU')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
