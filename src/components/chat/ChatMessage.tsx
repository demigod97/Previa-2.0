/**
 * Individual chat message component
 * Supports user and AI messages with Previa design system
 */

import React from 'react';
import { EnhancedChatMessage, Citation } from '@/types/message';
import MarkdownRenderer from './MarkdownRenderer';
import { Card } from '@/components/ui/card';

interface ChatMessageProps {
  message: EnhancedChatMessage;
  onCitationClick?: (citation: Citation) => void;
}

const ChatMessage = ({ message, onCitationClick }: ChatMessageProps) => {
  const isUserMessage = message.message.type === 'human' || message.message.type === 'user';
  const isAiMessage = message.message.type === 'ai' || message.message.type === 'assistant';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`${isUserMessage ? 'max-w-xs lg:max-w-md' : 'w-full max-w-3xl'}`}>
        {isUserMessage ? (
          // User message - right-aligned, sand background
          <div className="px-4 py-2 bg-sand text-charcoal rounded-lg">
            <MarkdownRenderer 
              content={message.message.content} 
              isUserMessage={true} 
            />
          </div>
        ) : (
          // AI message - left-aligned, cream background card
          <Card className="bg-cream border-sand">
            <div className="p-4">
              <div className="prose prose-gray max-w-none text-charcoal">
                <MarkdownRenderer 
                  content={message.message.content}
                  onCitationClick={onCitationClick}
                  isUserMessage={false}
                />
              </div>
            </div>
          </Card>
        )}
        
        {/* Timestamp */}
        <div className={`text-xs text-stone mt-1 ${isUserMessage ? 'text-right' : 'text-left'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

