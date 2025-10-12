import React from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import { CountdownBanner } from '@/components/banner';
import { useAppConfig } from '@/hooks/useAppConfig';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout - Layout wrapper for dashboard pages with banner
 * 
 * Features:
 * - Sidebar navigation
 * - TopBar with user menu
 * - Automation countdown banner
 * - Main content area
 * - Responsive design
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { config, loading } = useAppConfig();

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Automation Countdown Banner - Below TopBar */}
        {!loading && config?.automationActivationDate && (
          <CountdownBanner activationDate={config.automationActivationDate} />
        )}

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
