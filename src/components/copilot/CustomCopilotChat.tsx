/**
 * Custom CopilotKit Chat using useCopilotChat hook
 * Built from scratch to avoid version compatibility issues with CopilotChat component
 */

import React, { useRef, useEffect } from 'react';
import { Box, Flex, VStack, Text, Input, IconButton, ScrollArea } from '@chakra-ui/react';
import { useCopilotChat } from '@copilotkit/react-core';
import { Send, Sparkles } from 'lucide-react';

export const CustomCopilotChat: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const {
    visibleMessages,
    appendMessage,
    isLoading,
  } = useCopilotChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    appendMessage({
      role: 'user',
      content: inputValue,
    });

    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Flex
      direction="column"
      h="full"
      bg="previa.cream"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="previa.sand"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        align="center"
        gap={2}
        p={4}
        borderBottomWidth="1px"
        borderBottomColor="previa.sand"
        bg="white"
      >
        <Sparkles size={20} color="#D9C8B4" />
        <Text fontSize="lg" fontWeight="medium" color="previa.charcoal">
          Previa AI Assistant
        </Text>
      </Flex>

      {/* Messages */}
      <Box
        ref={scrollRef}
        flex="1"
        overflowY="auto"
        p={4}
      >
        <VStack spacing={4} align="stretch">
          {visibleMessages.length === 0 && (
            <Box textAlign="center" py={8}>
              <Sparkles size={32} color="#D9C8B4" style={{ margin: '0 auto 16px' }} />
              <Text color="previa.stone" fontSize="sm">
                Hello! I'm your Previa AI assistant. Ask me about your finances, transactions, or spending patterns.
              </Text>
            </Box>
          )}

          {visibleMessages.map((message, index) => (
            <Flex
              key={index}
              justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Box
                maxW="80%"
                bg={message.role === 'user' ? 'previa.sand' : 'white'}
                color="previa.charcoal"
                px={4}
                py={3}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={message.role === 'user' ? 'previa.sand' : 'previa.sand'}
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {message.content}
                </Text>
              </Box>
            </Flex>
          ))}

          {isLoading && (
            <Flex justify="flex-start">
              <Box
                maxW="80%"
                bg="white"
                color="previa.charcoal"
                px={4}
                py={3}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="previa.sand"
              >
                <Text fontSize="sm" color="previa.stone">
                  Thinking...
                </Text>
              </Box>
            </Flex>
          )}
        </VStack>
      </Box>

      {/* Input */}
      <Flex
        gap={2}
        p={4}
        borderTopWidth="1px"
        borderTopColor="previa.sand"
        bg="white"
      >
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your finances..."
          bg="previa.cream"
          borderColor="previa.sand"
          _hover={{ borderColor: 'previa.sand' }}
          _focus={{ borderColor: 'previa.sand', boxShadow: '0 0 0 1px #D9C8B4' }}
          disabled={isLoading}
        />
        <IconButton
          aria-label="Send message"
          icon={<Send size={18} />}
          onClick={handleSend}
          isDisabled={!inputValue.trim() || isLoading}
          bg="previa.sand"
          color="previa.charcoal"
          _hover={{ bg: 'previa.sand', opacity: 0.9 }}
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
        />
      </Flex>
    </Flex>
  );
};
