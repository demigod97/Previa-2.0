import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeftRight, Receipt, MessageSquare, Settings, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FeatureStatusIndicator } from '@/components/ui/FeatureStatusIndicator';
import { APP_FEATURES, getFeatureStatus } from '@/types/featureStatus';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  emoji: string;
  icon: React.ElementType;
  path: string;
  featureId?: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', emoji: '🏠', icon: Home, path: '/' },
  { label: 'Reconciliation', emoji: '🔄', icon: ArrowLeftRight, path: '/reconciliation', featureId: 'reconciliation' },
  { label: 'Transactions', emoji: '📊', icon: Receipt, path: '/transactions', featureId: 'transactions' },
  { label: 'Chat', emoji: '💬', icon: MessageSquare, path: '/chat', featureId: 'chat' },
  { label: 'Reports', emoji: '📈', icon: Receipt, path: '/reports', featureId: 'reports' },
  { label: 'Integrations', emoji: '🔗', icon: Settings, path: '/integrations', featureId: 'integrations' },
  { label: 'Settings', emoji: '⚙️', icon: Settings, path: '/settings', featureId: 'settings' },
];

/**
 * Sidebar - Persistent navigation sidebar for Previa dashboard
 *
 * Features:
 * - Previa logo at top
 * - Main navigation items with active state
 * - User menu at bottom with avatar, email, tier, and sign out
 * - Responsive: collapsible on tablet, bottom nav on mobile
 */
export function Sidebar() {
  const { user, userTier, signOut } = useAuth();
  const location = useLocation();

  const getTierBadge = () => {
    if (!userTier) return null;
    const isPremium = userTier.tier === 'premium_user';
    const tierLabel = isPremium ? '👑 Premium' : '✨ Free';
    const tierColor = isPremium ? 'bg-sand text-charcoal' : 'bg-stone-200 text-charcoal';

    return (
      <Badge className={tierColor} variant="secondary">
        {tierLabel}
      </Badge>
    );
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar (≥1024px) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-cream lg:border-r lg:border-sand">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sand">
          <Logo size="md" />
          <span className="text-xl font-semibold text-charcoal">Previa</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'text-sm font-medium min-w-0',
                  'focus:outline-none focus:ring-2 focus:ring-sand focus:ring-offset-2 focus:ring-offset-cream',
                  active
                    ? 'bg-sand text-charcoal'
                    : 'text-darkStone hover:bg-sand/50 hover:text-charcoal'
                )}
              >
                <span className="text-lg" aria-hidden="true">{item.emoji}</span>
                <span className="flex-1">{item.label}</span>
                {item.featureId && APP_FEATURES[item.featureId] && (
                  <FeatureStatusIndicator
                    featureId={item.featureId}
                    size="compact"
                    showTooltip={true}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Menu Section */}
        <div className="px-4 py-4 border-t border-sand space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-sand text-charcoal text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">
                {user?.email}
              </p>
              <div className="mt-1">
                {getTierBadge()}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            aria-label="Sign out of your account"
            className="w-full justify-start text-darkStone hover:text-charcoal hover:bg-sand/50 focus:outline-none focus:ring-2 focus:ring-sand"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Tablet Sidebar (768px - 1023px) - Collapsible Icons Only */}
      <aside className="hidden md:flex lg:hidden md:flex-col md:w-20 md:fixed md:inset-y-0 md:bg-cream md:border-r md:border-sand">
        {/* Logo Section */}
        <div className="flex items-center justify-center px-2 py-6 border-b border-sand">
          <Logo size="md" />
        </div>

        {/* Navigation Items - Emojis Only */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {navigationItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={cn(
                  'flex items-center justify-center p-3 rounded-lg transition-colors text-2xl',
                  'focus:outline-none focus:ring-2 focus:ring-sand focus:ring-offset-2 focus:ring-offset-cream',
                  active
                    ? 'bg-sand'
                    : 'hover:bg-sand/50'
                )}
              >
                <span aria-hidden="true">{item.emoji}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Avatar */}
        <div className="px-2 py-4 border-t border-sand">
          <Link
            to="/settings"
            aria-label="Go to settings"
            className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sand focus:ring-offset-2 focus:ring-offset-cream rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-sand text-charcoal text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (<768px) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 bg-cream border-t border-sand z-50"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-3">
          {navigationItems.slice(0, 5).map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-sand',
                  active
                    ? 'text-charcoal'
                    : 'text-darkStone'
                )}
              >
                <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

