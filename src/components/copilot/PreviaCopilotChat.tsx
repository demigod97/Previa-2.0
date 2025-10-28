/**
 * Previa-themed CopilotChat Component
 * Uses CopilotChat (not CopilotSidebar) for in-page rendering with toggle support
 */

import React from 'react';
import { CopilotChat } from '@copilotkit/react-ui';
import { Box } from '@chakra-ui/react';

interface PreviaCopilotChatProps {
  className?: string;
}

const PreviaCopilotChat: React.FC<PreviaCopilotChatProps> = ({ className }) => {
  return (
    <Box
      className={className}
      h="full"
      sx={{
        // Previa theme color variables for CopilotKit
        '--copilot-kit-primary-color': '#D9C8B4', // previa.sand
        '--copilot-kit-background-color': '#F2E9D8', // previa.cream
        '--copilot-kit-secondary-color': '#403B31', // previa.charcoal
        '--copilot-kit-text-color': '#403B31', // previa.charcoal
        '--copilot-kit-muted-color': '#8C877D', // previa.stone
        '--copilot-kit-border-color': '#D9C8B4', // previa.sand
        '--copilot-kit-separator-color': '#D9C8B4', // previa.sand
        '--copilot-kit-response-button-background-color': '#D9C8B4',
        '--copilot-kit-response-button-color': '#403B31',

        // Typography
        '--copilot-kit-font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

        // Border radius for Previa's soft, warm aesthetic
        '--copilot-kit-border-radius': '0.5rem',

        // Shadows - subtle for warmth
        '--copilot-kit-shadow': '0 2px 8px rgba(64, 59, 49, 0.1)',
      } as React.CSSProperties}
    >
      <CopilotChat
        labels={{
          title: 'Previa AI Assistant',
          initial: 'Hello! I\'m your Previa AI assistant. Ask me about your finances, transactions, or spending patterns.',
          placeholder: 'Ask about your finances...',
        }}
        instructions="You are a helpful AI financial assistant for Previa, an Australian financial management platform. Help users understand their transactions, spending patterns, and financial data. Be friendly, professional, and focus on Australian financial context (AUD currency, ATO, Australian banking). Provide clear, actionable insights."
      />
    </Box>
  );
};

export default PreviaCopilotChat;
