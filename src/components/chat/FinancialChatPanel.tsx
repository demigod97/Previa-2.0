/**
 * Financial Chat Panel Component
 * Main chat interface for AI financial assistant
 * Adapted from PolicyAI ChatArea with Previa design system
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useFinancialChat } from '@/hooks/useFinancialChat';
import { Citation } from '@/types/message';
import { Card } from '@/components/ui/card';

interface FinancialChatPanelProps {
  onCitationClick?: (citation: Citation) => void;
  sessionId?: string;
}

const FinancialChatPanel = ({ 
  onCitationClick,
  sessionId = 'default-financial-chat'
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-previa-cream">
      {/* Chat Header */}
      <div className="p-4 border-b border-previa-sand flex-shrink-0 bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sand" />
            <h2 className="text-lg font-medium text-charcoal">AI Financial Assistant</h2>
          </div>
          {shouldShowRefreshButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshChat}
              disabled={isClearing}
              className="flex items-center space-x-2 hover:bg-sand/20"
            >
              <RefreshCw className={`h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
              <span>{isClearing ? 'Clearing...' : 'Clear Chat'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Welcome message */}
            {messages.length === 0 && !pendingUserMessage && (
              <Card className="border-previa-sand mb-6">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-charcoal" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">Welcome to Previa AI</h3>
                      <p className="text-sm text-darkStone">Your intelligent financial assistant</p>
                    </div>
                  </div>
                  <p className="text-darkStone leading-relaxed">
                    I can help you understand your financial data, analyze transactions, 
                    track spending patterns, and answer questions about your finances. 
                    Try asking me about your recent expenses, income trends, or specific transactions.
                  </p>
                </div>
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
              <div className="flex justify-end mb-4">
                <div className="max-w-xs lg:max-w-md px-4 py-2 bg-sand text-charcoal rounded-lg">
                  {pendingUserMessage}
                </div>
              </div>
            )}
            
            {/* AI Loading Indicator */}
            {showAiLoading && (
              <div className="flex justify-start mb-4" ref={latestMessageRef}>
                <div className="flex items-center space-x-2 px-4 py-3 bg-cream rounded-lg border border-sand">
                  <div className="w-2 h-2 bg-sand rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-sand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-sand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            
            {/* Scroll target */}
            {!showAiLoading && (messages.length > 0 || pendingUserMessage) && (
              <div ref={latestMessageRef} />
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Chat Input - Fixed at bottom */}
      <div className="p-6 border-t border-previa-sand flex-shrink-0 bg-card">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isSending || !!pendingUserMessage}
            isLoading={isSending || showAiLoading}
            placeholder="Ask about your finances..."
            exampleQuestions={exampleQuestions}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sand flex-shrink-0 bg-cream">
        <p className="text-center text-sm text-stone">
          Previa AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
};

export default FinancialChatPanel;

