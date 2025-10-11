import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

/**
 * TopBar - Top navigation bar for dashboard views
 *
 * Features:
 * - User avatar dropdown menu (right)
 * - Notifications bell icon
 * - Optional search bar (for future implementation)
 * - Previa color scheme
 */
export function TopBar() {
  const { user, userTier, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getTierLabel = () => {
    if (!userTier) return 'Free';
    return userTier.tier === 'premium_user' ? '👑 Premium' : '✨ Free';
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-previa-sand">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Could add breadcrumbs or page title here */}
        <div className="flex-1">
          {/* Reserved for future search bar or breadcrumbs */}
        </div>

        {/* Right side - Notifications & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-darkStone hover:text-charcoal hover:bg-sand/50"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge (if there are notifications) */}
            {/* <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" /> */}
          </Button>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-sand/50"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-sand text-charcoal font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium text-charcoal">
                    {user?.email}
                  </p>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-sand text-charcoal text-xs"
                  >
                    {getTierLabel()}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/settings')}
                className="cursor-pointer"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/settings#billing')}
                className="cursor-pointer"
              >
                Billing & Upgrade
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

