import React from 'react';
import { GlobalFooter } from './GlobalFooter';

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

/**
 * AppLayout - Main application layout wrapper with footer
 * 
 * Features:
 * - Consistent layout structure
 * - Optional footer display
 * - Mobile-responsive spacing
 * - Previa design system
 */
export function AppLayout({ children, showFooter = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      
      {/* Global Footer */}
      {showFooter && (
        <GlobalFooter />
      )}
    </div>
  );
}

export default AppLayout;
