/**
 * Individual chat message component
 * Supports user and AI messages with Previa design system
 */

import React from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { EnhancedChatMessage, Citation } from '@/types/message';
import MarkdownRenderer from './MarkdownRenderer';
import { Card } from '@/components/chakra-ui/card';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: EnhancedChatMessage;
  onCitationClick?: (citation: Citation) => void;
}

const ChatMessage = ({ message, onCitationClick }: ChatMessageProps) => {
  const isUserMessage = message.message.type === 'human' || message.message.type === 'user';
  const isAiMessage = message.message.type === 'ai' || message.message.type === 'assistant';

  return (
    <Flex justify={isUserMessage ? 'flex-end' : 'flex-start'} mb={4} gap={3}>
      {/* AI Avatar - Left side for AI messages */}
      {!isUserMessage && (
        <Flex flexShrink={0} w={8} h={8} borderRadius="full" bg="previa.sand" align="center" justify="center">
          <Icon as={Sparkles} boxSize={4} color="previa.charcoal" />
        </Flex>
      )}

      {/* Message content */}
      <VStack
        align="stretch"
        spacing={1}
        maxW={isUserMessage ? { base: 'xs', lg: 'md' } : '3xl'}
        w={isUserMessage ? 'auto' : 'full'}
      >
        {isUserMessage ? (
          // User message - right-aligned, sand background
          <Box px={4} py={2} bg="previa.sand" color="previa.charcoal" borderRadius="lg">
            <MarkdownRenderer
              content={message.message.content}
              isUserMessage={true}
            />
          </Box>
        ) : (
          // AI message - left-aligned, cream background card
          <Card bg="previa.cream" borderColor="previa.sand">
            <Box p={4}>
              <Box className="prose prose-gray" maxW="none" color="previa.charcoal">
                <MarkdownRenderer
                  content={message.message.content}
                  onCitationClick={onCitationClick}
                  isUserMessage={false}
                />
              </Box>
            </Box>
          </Card>
        )}

        {/* Timestamp */}
        <Text
          fontSize="xs"
          color="previa.stone"
          textAlign={isUserMessage ? 'right' : 'left'}
        >
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </VStack>

      {/* User Avatar - Right side for user messages */}
      {isUserMessage && (
        <Flex flexShrink={0} w={8} h={8} borderRadius="full" bg="previa.charcoal" align="center" justify="center">
          <Icon as={User} boxSize={4} color="previa.cream" />
        </Flex>
      )}
    </Flex>
  );
};

export default ChatMessage;

