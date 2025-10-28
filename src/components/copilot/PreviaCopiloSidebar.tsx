/**
 * Previa-themed CopilotSidebar Component
 * Integrates CopilotKit with Previa design system
 */

import React from 'react';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { Box } from '@chakra-ui/react';
import { Sparkles } from 'lucide-react';

interface PreviaCopilotSidebarProps {
  defaultOpen?: boolean;
  clickOutsideToClose?: boolean;
  onSetOpen?: (open: boolean) => void;
}

const PreviaCopilotSidebar: React.FC<PreviaCopilotSidebarProps> = ({
  defaultOpen = false,
  clickOutsideToClose = true,
  onSetOpen,
}) => {
  return (
    <Box
      sx={{
        // Previa theme color variables for CopilotKit
        '--copilot-kit-primary-color': '#D9C8B4', // previa.sand
        '--copilot-kit-background-color': '#F2E9D8', // previa.cream
        '--copilot-kit-secondary-color': '#403B31', // previa.charcoal
        '--copilot-kit-text-color': '#403B31', // previa.charcoal
        '--copilot-kit-muted-color': '#8C877D', // previa.stone
        '--copilot-kit-border-color': '#D9C8B4', // previa.sand
        '--copilot-kit-separator-color': '#D9C8B4', // previa.sand

        // Typography
        '--copilot-kit-font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

        // Sizing
        '--copilot-kit-sidebar-width': '400px',

        // Border radius for Previa's soft, warm aesthetic
        '--copilot-kit-border-radius': '0.5rem',

        // Shadows - subtle for warmth
        '--copilot-kit-shadow': '0 2px 8px rgba(64, 59, 49, 0.1)',
      } as React.CSSProperties}
    >
      <CopilotSidebar
        defaultOpen={defaultOpen}
        clickOutsideToClose={clickOutsideToClose}
        onSetOpen={onSetOpen}
        labels={{
          title: 'Previa AI Assistant',
          initial: 'Hello! I\'m your Previa AI assistant. Ask me about your finances, transactions, or spending patterns.',
          placeholder: 'Ask about your finances...',
        }}
        icons={{
          openIcon: <Sparkles size={20} color="#403B31" />,
          closeIcon: <Sparkles size={20} color="#403B31" />,
        }}
      />
    </Box>
  );
};

export default PreviaCopilotSidebar;
