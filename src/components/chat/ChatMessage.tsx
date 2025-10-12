/**
 * Individual chat message component
 * Supports user and AI messages with Previa design system
 */

import React from 'react';
import { EnhancedChatMessage, Citation } from '@/types/message';
import MarkdownRenderer from './MarkdownRenderer';
import { Card } from '@/components/ui/card';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: EnhancedChatMessage;
  onCitationClick?: (citation: Citation) => void;
}

const ChatMessage = ({ message, onCitationClick }: ChatMessageProps) => {
  const isUserMessage = message.message.type === 'human' || message.message.type === 'user';
  const isAiMessage = message.message.type === 'ai' || message.message.type === 'assistant';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4 gap-3`}>
      {/* AI Avatar - Left side for AI messages */}
      {!isUserMessage && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-charcoal" />
          </div>
        </div>
      )}
      
      {/* Message content */}
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
      
      {/* User Avatar - Right side for user messages */}
      {isUserMessage && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center">
            <User className="h-4 w-4 text-cream" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

