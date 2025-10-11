/**
 * Message types for financial chat system
 * Adapted from PolicyAI to support financial data context
 */

export interface MessageSegment {
  text: string;
  citation_id?: number;
}

export interface Citation {
  citation_id: number;
  source_id: string;
  source_title: string;
  source_type: 'transaction' | 'receipt' | 'bank_account' | 'document';
  // For transactions
  transaction_id?: string;
  transaction_date?: string;
  transaction_amount?: number;
  // For receipts
  receipt_id?: string;
  receipt_merchant?: string;
  // Generic fields
  chunk_index?: number;
  excerpt?: string;
}

export interface EnhancedChatMessage {
  id: number;
  session_id: string;
  message: {
    type: 'human' | 'ai' | 'user' | 'assistant';
    content: string | {
      segments: MessageSegment[];
      citations: Citation[];
    };
    additional_kwargs?: Record<string, unknown>;
    response_metadata?: Record<string, unknown>;
    tool_calls?: Array<Record<string, unknown>>;
    invalid_tool_calls?: Array<Record<string, unknown>>;
  };
}
