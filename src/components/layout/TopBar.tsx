import React, { useState } from 'react';
import { Bell, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWizard } from '@/contexts/WizardContext';
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
import { DiscordIcon } from '@/components/ui/discord-icon';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { SetupWizardModal } from '@/components/wizard/SetupWizardModal';
import { useNavigate } from 'react-router-dom';
import { useMockDataSeeding } from '@/hooks/useMockDataSeeding';
import { useDeleteMockData } from '@/hooks/useDeleteMockData';

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
  const { openWizard } = useWizard();
  const navigate = useNavigate();
  const { seedMockData, isLoading: isSeedingLoading } = useMockDataSeeding();
  const { deleteMockData, isLoading: isDeletingLoading } = useDeleteMockData();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDiscordClick = () => {
    window.open('https://discord.gg/P8UWXgyNZJ', '_blank', 'noopener,noreferrer');
  };

  const handleDeleteMockData = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await deleteMockData();
    setShowDeleteDialog(false);
  };

  const handleWizardClick = () => {
    // Open wizard modal using context
    openWizard();
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-previa-sand">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Discord Community Button & Mock Data Button */}
        <div className="flex-1 flex gap-3">
          <Button
            onClick={handleDiscordClick}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            title="Join our Discord community for bug reports, announcements, giveaways, and collaborations"
            aria-label="Join Discord community"
          >
            <DiscordIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Join Our Community</span>
          </Button>

          {/* Mock Data Buttons - Only visible to authenticated users */}
          {user && (
            <>
              <Button
                onClick={seedMockData}
                disabled={isSeedingLoading || isDeletingLoading}
                className="bg-sand hover:bg-sand/80 text-charcoal px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                title="Seed your account with realistic mock financial data to explore features"
                aria-label="Seed mock data"
              >
                {isSeedingLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">Seed Mock Data</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleDeleteMockData}
                disabled={isSeedingLoading || isDeletingLoading}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                title="Delete all mock financial data from your account"
                aria-label="Delete mock data"
              >
                {isDeletingLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Delete Mock Data</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleWizardClick}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                title="Open setup wizard to guide you through configuration"
                aria-label="Open wizard"
              >
                <Wand2 className="h-4 w-4" />
                <span className="text-sm font-medium">Setup Wizard</span>
              </Button>
            </>
          )}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingLoading}
      />

      {/* Setup Wizard Modal */}
      <SetupWizardModal />
    </header>
  );
}

