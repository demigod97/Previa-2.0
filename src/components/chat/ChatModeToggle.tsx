/**
 * ChatModeToggle - Chakra UI toggle to switch between CopilotKit and Financial Chat
 */

import React from 'react';
import { Box, Flex, Text, HStack, Switch } from '@chakra-ui/react';
import { useChatMode } from '@/contexts/ChatModeContext';
import { Sparkles, MessageSquare } from 'lucide-react';

export const ChatModeToggle: React.FC = () => {
  const { chatMode, setChatMode } = useChatMode();

  const isCopilotMode = chatMode === 'copilot';

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMode(e.target.checked ? 'copilot' : 'financial');
  };

  return (
    <Box
      bg="previa.cream"
      borderRadius="lg"
      p={4}
      mb={4}
      borderWidth="1px"
      borderColor="previa.sand"
    >
      <Flex align="center" justify="space-between">
        <HStack spacing={3}>
          <Box
            p={2}
            borderRadius="md"
            bg={!isCopilotMode ? 'previa.sand' : 'transparent'}
            transition="all 0.2s"
          >
            <MessageSquare size={20} color="#403B31" />
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="previa.charcoal">
              {isCopilotMode ? 'CopilotKit AI' : 'Financial Chat'}
            </Text>
            <Text fontSize="xs" color="previa.stone">
              {isCopilotMode
                ? 'AI-powered assistant with context awareness'
                : 'Standard financial chat interface'
              }
            </Text>
          </Box>
        </HStack>

        <HStack spacing={3}>
          <Switch
            isChecked={isCopilotMode}
            onChange={handleToggle}
            aria-label="Toggle chat mode"
            colorScheme="orange"
          />
          <Box
            p={2}
            borderRadius="md"
            bg={isCopilotMode ? 'previa.sand' : 'transparent'}
            transition="all 0.2s"
          >
            <Sparkles size={20} color="#403B31" />
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};
