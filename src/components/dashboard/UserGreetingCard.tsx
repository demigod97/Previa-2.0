import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, FileText, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserGreetingCard = () => {
  const { user, userTier, tierLoading } = useAuth();

  if (!user) return null;

  // Get user's display name (fallback to email username if no full name)
  const displayName = user.user_metadata?.full_name ||
                     user.user_metadata?.name ||
                     user.email?.split('@')[0] ||
                     'User';

  // Format tier for display
  const getTierDisplay = () => {
    if (tierLoading) return { label: 'Loading...', icon: null, emoji: '⏳' };
    if (!userTier) return { label: 'Free', icon: Sparkles, emoji: '✨' };

    return userTier.tier === 'premium_user'
      ? { label: 'Premium', icon: Crown, emoji: '👑' }
      : { label: 'Free', icon: Sparkles, emoji: '✨' };
  };

  const tierDisplay = getTierDisplay();

  return (
    <Card style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg" style={{ color: '#403B31' }}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full" style={{ backgroundColor: '#D9C8B4' }}>
              <TrendingUp className="h-5 w-5" style={{ color: '#403B31' }} />
            </div>
            <span>Welcome back, {displayName}!</span>
          </div>
          {tierDisplay.icon && (
            <div className="flex items-center gap-1">
              <span className="text-base">{tierDisplay.emoji}</span>
              <Badge
                variant="outline"
                className="border-sand"
                style={{
                  backgroundColor: userTier?.tier === 'premium_user' ? '#FFD700' : '#D9C8B4',
                  color: '#403B31',
                  borderColor: '#D9C8B4'
                }}
              >
                {tierDisplay.label}
              </Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#595347' }}>
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>

        {userTier && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-2 rounded" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="text-xs" style={{ color: '#8C877D' }}>Bank Accounts</div>
              <div className="text-lg font-semibold" style={{ color: '#403B31' }}>
                {userTier.accounts_limit === 999999 ? '∞' : userTier.accounts_limit}
              </div>
            </div>
            <div className="text-center p-2 rounded" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="text-xs" style={{ color: '#8C877D' }}>Transactions</div>
              <div className="text-lg font-semibold" style={{ color: '#403B31' }}>
                {userTier.transactions_monthly_limit === 999999 ? '∞' : userTier.transactions_monthly_limit}/mo
              </div>
            </div>
            <div className="text-center p-2 rounded" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="text-xs" style={{ color: '#8C877D' }}>Receipts</div>
              <div className="text-lg font-semibold" style={{ color: '#403B31' }}>
                {userTier.receipts_monthly_limit === 999999 ? '∞' : userTier.receipts_monthly_limit}/mo
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGreetingCard;