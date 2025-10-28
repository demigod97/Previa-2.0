/**
 * Settings Page - User settings and profile management
 *
 * Includes tier display and account settings
 */

import React from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { TierDisplay } from '@/components/auth/TierDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/chakra-ui/card';
import { Button } from '@/components/chakra-ui/button';

export default function Settings() {
  const { user, userTier, tierLoading, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen bg-cream">
        <Sidebar />
        <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <p className="text-center text-muted-foreground">Please sign in to access settings.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cream">
      <Sidebar />
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-semibold text-charcoal">Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="text-xs font-mono text-muted-foreground">{user.id}</p>
            </div>
            <div className="pt-4">
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tier Display Card */}
        {tierLoading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">Loading tier information...</p>
            </CardContent>
          </Card>
        ) : userTier ? (
          <TierDisplay tier={userTier} />
        ) : (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                Unable to load tier information
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Preferences</h3>
            <p className="text-sm text-muted-foreground">
              Account preferences and settings will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
