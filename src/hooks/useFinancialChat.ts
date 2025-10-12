/**
 * Hook for financial chat functionality
 * Manages chat messages, sending messages to N8N, and real-time updates
 * Adapted from PolicyAI's useChatMessages for financial context
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedChatMessage, Citation, MessageSegment } from '@/types/message';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

// Type for the expected message structure from n8n_chat_histories
interface N8nMessageFormat {
  type: 'human' | 'ai' | 'user' | 'assistant';
  content: string | {
    segments: Array<{ text: string; citation_id?: number }>;
    citations: Array<Citation>;
  };
  additional_kwargs?: Record<string, unknown>;
  response_metadata?: Record<string, unknown>;
  tool_calls?: Array<Record<string, unknown>>;
  invalid_tool_calls?: Array<Record<string, unknown>>;
}

// Type for AI response structure from n8n
interface N8nAiResponseContent {
  output: Array<{
    text: string;
    citations?: Array<{
      chunk_index: number;
      source_id: string;
      source_type: 'transaction' | 'receipt' | 'bank_account';
      transaction_id?: string;
      transaction_date?: string;
      transaction_amount?: number;
      receipt_id?: string;
      receipt_merchant?: string;
    }>;
  }>;
}

interface ChatHistoryItem {
  id: number;
  session_id: string;
  message: unknown;
}

const transformMessage = (item: ChatHistoryItem): EnhancedChatMessage => {
  console.log('Processing financial chat message:', item);

  let transformedMessage: EnhancedChatMessage['message'];
  
  if (item.message && 
      typeof item.message === 'object' && 
      !Array.isArray(item.message) &&
      'type' in item.message && 
      'content' in item.message) {
    
    const messageObj = item.message as unknown as N8nMessageFormat;
    
    // Check if this is an AI message with JSON content that needs parsing
    if ((messageObj.type === 'ai' || messageObj.type === 'assistant') && typeof messageObj.content === 'string') {
      try {
        const parsedContent = JSON.parse(messageObj.content) as N8nAiResponseContent;
        
        if (parsedContent.output && Array.isArray(parsedContent.output)) {
          // Transform the parsed content into segments and citations
          const segments: MessageSegment[] = [];
          const citations: Citation[] = [];
          let citationIdCounter = 1;
          
          parsedContent.output.forEach((outputItem) => {
            segments.push({
              text: outputItem.text,
              citation_id: outputItem.citations && outputItem.citations.length > 0 ? citationIdCounter : undefined
            });
            
            if (outputItem.citations && outputItem.citations.length > 0) {
              outputItem.citations.forEach((citation) => {
                citations.push({
                  citation_id: citationIdCounter,
                  source_id: citation.source_id,
                  source_title: citation.source_type === 'transaction' 
                    ? `Transaction ${citation.transaction_date}` 
                    : citation.source_type === 'receipt'
                    ? `Receipt from ${citation.receipt_merchant}`
                    : 'Bank Account',
                  source_type: citation.source_type,
                  transaction_id: citation.transaction_id,
                  transaction_date: citation.transaction_date,
                  transaction_amount: citation.transaction_amount,
                  receipt_id: citation.receipt_id,
                  receipt_merchant: citation.receipt_merchant,
                  chunk_index: citation.chunk_index,
                  excerpt: citation.source_type === 'transaction'
                    ? `${citation.transaction_date}: $${citation.transaction_amount}`
                    : undefined
                });
              });
              citationIdCounter++;
            }
          });
          
          transformedMessage = {
            type: messageObj.type,
            content: {
              segments,
              citations
            },
            additional_kwargs: messageObj.additional_kwargs,
            response_metadata: messageObj.response_metadata,
            tool_calls: messageObj.tool_calls,
            invalid_tool_calls: messageObj.invalid_tool_calls
          };
        } else {
          transformedMessage = {
            type: messageObj.type,
            content: messageObj.content,
            additional_kwargs: messageObj.additional_kwargs,
            response_metadata: messageObj.response_metadata,
            tool_calls: messageObj.tool_calls,
            invalid_tool_calls: messageObj.invalid_tool_calls
          };
        }
      } catch (parseError) {
        console.log('Failed to parse AI content as JSON, treating as plain text:', parseError);
        transformedMessage = {
          type: messageObj.type,
          content: messageObj.content,
          additional_kwargs: messageObj.additional_kwargs,
          response_metadata: messageObj.response_metadata,
          tool_calls: messageObj.tool_calls,
          invalid_tool_calls: messageObj.invalid_tool_calls
        };
      }
    } else {
      transformedMessage = {
        type: messageObj.type === 'human' ? 'human' : messageObj.type,
        content: messageObj.content || 'Empty message',
        additional_kwargs: messageObj.additional_kwargs,
        response_metadata: messageObj.response_metadata,
        tool_calls: messageObj.tool_calls,
        invalid_tool_calls: messageObj.invalid_tool_calls
      };
    }
  } else if (typeof item.message === 'string') {
    transformedMessage = {
      type: 'human',
      content: item.message
    };
  } else {
    transformedMessage = {
      type: 'human',
      content: 'Unable to parse message'
    };
  }

  console.log('Transformed financial message:', transformedMessage);

  return {
    id: item.id,
    session_id: item.session_id,
    message: transformedMessage
  };
};

// Fixed UUID for default financial chat session
const DEFAULT_SESSION_UUID = '00000000-0000-0000-0000-000000000001';

export const useFinancialChat = (sessionId: string = DEFAULT_SESSION_UUID) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['financial-chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      console.log('🔍 Fetching messages for session:', sessionId);
      
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: true });

      if (error) {
        console.error('❌ Error fetching messages:', error);
        throw error;
      }
      
      console.log('✅ Raw financial chat data from database:', data);
      console.log('📊 Number of messages found:', data?.length || 0);
      
      const transformed = data.map((item) => transformMessage(item));
      console.log('🔄 Transformed messages:', transformed);
      
      return transformed;
    },
    enabled: !!user,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Set up Realtime subscription for new messages
  useEffect(() => {
    if (!sessionId || !user) return;

    console.log('🔔 Setting up Realtime subscription for session:', sessionId);

    // Use a unique channel name per session to avoid conflicts
    const channelName = `financial-chat-${sessionId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'n8n_chat_histories',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload) => {
          console.log('🔔 Realtime: New financial message received:', payload);

          const newMessage = transformMessage(payload.new as ChatHistoryItem);
          
          queryClient.setQueryData(['financial-chat-messages', sessionId], (oldMessages: EnhancedChatMessage[] = []) => {
            const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) {
              console.log('⚠️ Message already exists, skipping:', newMessage.id);
              return oldMessages;
            }
            
            console.log('✅ Adding new financial message to cache:', newMessage);
            return [...oldMessages, newMessage];
          });
        }
      )
      .subscribe((status) => {
        console.log('🔔 Financial chat Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to financial chat updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Failed to subscribe to financial chat updates');
        }
      });

    return () => {
      console.log('🔕 Cleaning up Realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [sessionId, user, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async (messageData: {
      content: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('📤 Sending message:', messageData.content);

      // Call the n8n webhook via edge function
      const webhookResponse = await supabase.functions.invoke('send-chat-message', {
        body: {
          session_id: sessionId,
          message: messageData.content,
          user_id: user.id
        }
      });

      if (webhookResponse.error) {
        console.error('❌ Webhook error:', webhookResponse.error);
        throw new Error(`Webhook error: ${webhookResponse.error.message}`);
      }

      console.log('✅ Message sent successfully:', webhookResponse.data);
      return webhookResponse.data;
    },
    onMutate: async (messageData) => {
      // Optimistically add user message to cache
      const tempUserMessage: EnhancedChatMessage = {
        id: Date.now(), // Temporary ID
        session_id: sessionId,
        message: {
          type: 'human',
          content: messageData.content
        }
      };

      queryClient.setQueryData(['financial-chat-messages', sessionId], (old: EnhancedChatMessage[] = []) => {
        return [...old, tempUserMessage];
      });

      return { tempUserMessage };
    },
    onSuccess: () => {
      console.log('✅ Financial message sent to webhook successfully');
      // Refetch to get the actual message with correct ID from database
      queryClient.invalidateQueries({
        queryKey: ['financial-chat-messages', sessionId]
      });
    },
    onError: (error, variables, context) => {
      console.error('❌ Failed to send financial message:', error);
      
      // Remove the optimistic message on error
      if (context?.tempUserMessage) {
        queryClient.setQueryData(['financial-chat-messages', sessionId], (old: EnhancedChatMessage[] = []) => {
          return old.filter(msg => msg.id !== context.tempUserMessage.id);
        });
      }
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const clearChatHistory = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Clearing financial chat history for session:', sessionId);
      
      const { error } = await supabase
        .from('n8n_chat_histories')
        .delete()
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error clearing financial chat history:', error);
        throw error;
      }
      
      console.log('Financial chat history cleared successfully');
      return sessionId;
    },
    onSuccess: () => {
      console.log('Financial chat history cleared for session:', sessionId);
      toast({
        title: "Chat history cleared",
        description: "All messages have been deleted successfully.",
      });
      
      queryClient.setQueryData(['financial-chat-messages', sessionId], []);
      queryClient.invalidateQueries({
        queryKey: ['financial-chat-messages', sessionId]
      });
    },
    onError: (error) => {
      console.error('Failed to clear financial chat history:', error);
      toast({
        title: "Error",
        description: "Failed to clear chat history. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessage.mutate,
    sendMessageAsync: sendMessage.mutateAsync,
    isSending: sendMessage.isPending,
    clearChatHistory: clearChatHistory.mutate,
    isClearing: clearChatHistory.isPending,
  };
};

