import React from 'react';
import { Card, CardContent } from '@/components/chakra-ui/card';
import { Badge } from '@/components/chakra-ui/badge';

interface GlobalFooterProps {
  className?: string;
}

/**
 * GlobalFooter - Displays app-wide footer with branding and alpha status
 * 
 * Features:
 * - Team IVORY branding
 * - Alpha stage disclaimer
 * - Previa design system colors
 * - Responsive layout
 * - Mobile-friendly spacing
 */
export function GlobalFooter({ className = '' }: GlobalFooterProps) {
  return (
    <footer className={`w-full border-t border-sand/20 bg-cream/50 backdrop-blur-sm ${className}`}>
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
            {/* Left side - Branding */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-charcoal">
                  Developed by Team IVORY
                </span>
                <Badge 
                  variant="secondary" 
                  className="bg-sand/20 text-charcoal border-sand/30 text-xs"
                >
                  Alpha
                </Badge>
              </div>
            </div>

            {/* Right side - Status and Info */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs text-stone">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                Previa is in active development
              </span>
              <span className="hidden md:inline">•</span>
              <span>Features may change without notice</span>
            </div>
          </div>

          {/* Mobile-only additional info */}
          <div className="md:hidden mt-2 pt-2 border-t border-sand/10">
            <div className="flex items-center justify-between text-xs text-stone">
              <span>Version 0.1.0-alpha</span>
              <span>© 2025 Team IVORY</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}

export default GlobalFooter;
