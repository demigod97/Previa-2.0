/**
 * Chat input component with auto-resize and financial prompts
 * Styled with Previa design system
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Button } from '@/components/chakra-ui/button';
import { Textarea } from '@/components/chakra-ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/chakra-ui/carousel';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  exampleQuestions?: string[];
}

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Ask about your finances...",
  exampleQuestions = []
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (question: string) => {
    onSendMessage(question);
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Input area */}
      <HStack spacing={2}>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          minH="44px"
          maxH="200px"
          resize="none"
          bg="white"
          borderColor="previa.sand"
          _focus={{ borderColor: 'previa.darkStone' }}
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          bg="previa.sand"
          _hover={{ bg: 'previa.sand', opacity: 0.9 }}
          color="previa.charcoal"
          h="44px"
          px={4}
        >
          {isLoading ? (
            <Icon as={Loader2} boxSize={4} animation="spin 1s linear infinite" />
          ) : (
            <Icon as={Send} boxSize={4} />
          )}
        </Button>
      </HStack>

      {/* Helper text */}
      <Text fontSize="xs" color="previa.stone" textAlign="center">
        Press Ctrl+Enter to send • AI responses may take a moment
      </Text>

      {/* Example questions carousel */}
      {exampleQuestions.length > 0 && !isLoading && (
        <Box>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {exampleQuestions.map((question, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    textAlign="left"
                    whiteSpace="nowrap"
                    h="auto"
                    py={2}
                    px={3}
                    fontSize="sm"
                    bg="white"
                    _hover={{ bg: 'previa.sand' }}
                    borderColor="previa.sand"
                    color="previa.charcoal"
                    onClick={() => handleExampleClick(question)}
                  >
                    {question}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            {exampleQuestions.length > 2 && (
              <>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </>
            )}
          </Carousel>
        </Box>
      )}
    </VStack>
  );
};

export default ChatInput;

