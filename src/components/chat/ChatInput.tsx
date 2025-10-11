/**
 * Chat input component with auto-resize and financial prompts
 * Styled with Previa design system
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
    <div className="space-y-4">
      {/* Input area */}
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="min-h-[44px] max-h-[200px] resize-none bg-white border-sand focus:border-darkStone"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          className="bg-sand hover:bg-sand/90 text-charcoal h-[44px] px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-stone text-center">
        Press Ctrl+Enter to send • AI responses may take a moment
      </p>

      {/* Example questions carousel */}
      {exampleQuestions.length > 0 && !isLoading && (
        <div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {exampleQuestions.map((question, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-left whitespace-nowrap h-auto py-2 px-3 text-sm bg-white hover:bg-sand border-sand text-charcoal"
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
        </div>
      )}
    </div>
  );
};

export default ChatInput;

