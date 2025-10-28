/**
 * Financial Chat Panel Component
 * Main chat interface for AI financial assistant
 * Adapted from PolicyAI ChatArea with Previa design system
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { Button } from '@/components/chakra-ui/button';
import { ScrollArea } from '@/components/chakra-ui/scroll-area';
import { RefreshCw, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useFinancialChat } from '@/hooks/useFinancialChat';
import { Citation } from '@/types/message';
import { Card } from '@/components/chakra-ui/card';

interface FinancialChatPanelProps {
  onCitationClick?: (citation: Citation) => void;
  sessionId?: string;
}

const FinancialChatPanel = ({ 
  onCitationClick,
  sessionId = '00000000-0000-0000-0000-000000000001'
}: FinancialChatPanelProps) => {
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [showAiLoading, setShowAiLoading] = useState(false);
  const [clickedQuestions, setClickedQuestions] = useState<Set<string>>(new Set());
  
  const {
    messages,
    sendMessage,
    isSending,
    clearChatHistory,
    isClearing
  } = useFinancialChat(sessionId);
  
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Financial-specific example questions
  const exampleQuestions = [
    "What did I spend on groceries this month?",
    "Show me duplicate transactions",
    "Categorize my Uber transactions",
    "What's my biggest expense category?",
    "How much did I earn last month?",
    "Show unreconciled transactions"
  ].filter(q => !clickedQuestions.has(q));

  // Clear pending message when new messages arrive
  useEffect(() => {
    if (messages.length > lastMessageCount && pendingUserMessage) {
      setPendingUserMessage(null);
      setShowAiLoading(false);
    }
    setLastMessageCount(messages.length);
  }, [messages.length, lastMessageCount, pendingUserMessage]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (latestMessageRef.current && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        setTimeout(() => {
          latestMessageRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 50);
      }
    }
  }, [pendingUserMessage, messages.length, showAiLoading]);

  const handleSendMessage = async (messageText: string) => {
    if (messageText.trim()) {
      try {
        setPendingUserMessage(messageText);
        await sendMessage({ content: messageText });
        setShowAiLoading(true);
      } catch (error) {
        console.error('Failed to send message:', error);
        setPendingUserMessage(null);
        setShowAiLoading(false);
      }
    }
  };

  const handleExampleQuestionClick = (question: string) => {
    setClickedQuestions(prev => new Set(prev).add(question));
    handleSendMessage(question);
  };

  const handleRefreshChat = () => {
    clearChatHistory();
    setClickedQuestions(new Set());
    setPendingUserMessage(null);
    setShowAiLoading(false);
  };

  const shouldShowRefreshButton = messages.length > 0;

  return (
    <Flex flex={1} flexDir="column" h="full" overflow="hidden" bg="previa.cream">
      {/* Chat Header */}
      <Box p={4} borderBottom="1px solid" borderColor="previa.sand" flexShrink={0} bg="card">
        <Flex maxW="4xl" mx="auto" align="center" justify="space-between">
          <HStack spacing={2}>
            <Icon as={Sparkles} boxSize={5} color="previa.sand" />
            <Heading as="h2" size="md" fontWeight="medium" color="previa.charcoal">
              AI Financial Assistant
            </Heading>
          </HStack>
          {shouldShowRefreshButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshChat}
              disabled={isClearing}
              _hover={{ bg: 'previa.sand', opacity: 0.2 }}
            >
              <HStack spacing={2}>
                <Icon
                  as={RefreshCw}
                  boxSize={4}
                  animation={isClearing ? 'spin 1s linear infinite' : undefined}
                />
                <Text>{isClearing ? 'Clearing...' : 'Clear Chat'}</Text>
              </HStack>
            </Button>
          )}
        </Flex>
      </Box>

      {/* Chat Messages Area */}
      <ScrollArea flex={1} h="full" ref={scrollAreaRef}>
        <Box p={8}>
          <Box maxW="4xl" mx="auto">
            {/* Welcome message */}
            {messages.length === 0 && !pendingUserMessage && (
              <Card borderColor="previa.sand" mb={6}>
                <Box p={6}>
                  <HStack gap={3} mb={4}>
                    <Flex
                      w={10}
                      h={10}
                      borderRadius="full"
                      bg="previa.sand"
                      align="center"
                      justify="center"
                    >
                      <Icon as={Sparkles} boxSize={5} color="previa.charcoal" />
                    </Flex>
                    <VStack align="start" spacing={0}>
                      <Heading as="h3" size="sm" fontWeight="semibold" color="previa.charcoal">
                        Welcome to Previa AI
                      </Heading>
                      <Text fontSize="sm" color="previa.darkStone">
                        Your intelligent financial assistant
                      </Text>
                    </VStack>
                  </HStack>
                  <Text color="previa.darkStone" lineHeight="relaxed">
                    I can help you understand your financial data, analyze transactions,
                    track spending patterns, and answer questions about your finances.
                    Try asking me about your recent expenses, income trends, or specific transactions.
                  </Text>
                </Box>
              </Card>
            )}

            {/* Chat Messages */}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onCitationClick={onCitationClick}
              />
            ))}

            {/* Pending user message */}
            {pendingUserMessage && (
              <Flex justify="flex-end" mb={4}>
                <Box
                  maxW={{ base: 'xs', lg: 'md' }}
                  px={4}
                  py={2}
                  bg="previa.sand"
                  color="previa.charcoal"
                  borderRadius="lg"
                >
                  {pendingUserMessage}
                </Box>
              </Flex>
            )}

            {/* AI Loading Indicator */}
            {showAiLoading && (
              <Flex justify="flex-start" mb={4} ref={latestMessageRef}>
                <HStack
                  spacing={2}
                  px={4}
                  py={3}
                  bg="previa.cream"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="previa.sand"
                >
                  <Box w={2} h={2} bg="previa.sand" borderRadius="full" animation="bounce 1s infinite" />
                  <Box
                    w={2}
                    h={2}
                    bg="previa.sand"
                    borderRadius="full"
                    animation="bounce 1s infinite"
                    sx={{ animationDelay: '0.1s' }}
                  />
                  <Box
                    w={2}
                    h={2}
                    bg="previa.sand"
                    borderRadius="full"
                    animation="bounce 1s infinite"
                    sx={{ animationDelay: '0.2s' }}
                  />
                </HStack>
              </Flex>
            )}

            {/* Scroll target */}
            {!showAiLoading && (messages.length > 0 || pendingUserMessage) && (
              <Box ref={latestMessageRef} />
            )}
          </Box>
        </Box>
      </ScrollArea>

      {/* Chat Input - Fixed at bottom */}
      <Box p={6} borderTop="1px solid" borderColor="previa.sand" flexShrink={0} bg="card">
        <Box maxW="4xl" mx="auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isSending || !!pendingUserMessage}
            isLoading={isSending || showAiLoading}
            placeholder="Ask about your finances..."
            exampleQuestions={exampleQuestions}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box p={4} borderTop="1px solid" borderColor="previa.sand" flexShrink={0} bg="previa.cream">
        <Text textAlign="center" fontSize="sm" color="previa.stone">
          Previa AI can make mistakes. Please verify important information.
        </Text>
      </Box>
    </Flex>
  );
};

export default FinancialChatPanel;

