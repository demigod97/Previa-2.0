/**
 * Receipt Service
 * Handles all API calls related to receipt OCR processing
 */

import { supabase } from '@/integrations/supabase/client';
import type { MockReceipt, ReceiptOCRData, AIMatchSuggestion } from '@/test/fixtures/receipt-mock-data';

export interface ProcessReceiptRequest {
  receipt_id: string;
  user_id: string;
  file_path: string;
  bucket: string;
}

export interface ProcessReceiptResponse {
  success: boolean;
  receipt_id: string;
  message: string;
}

export interface AIMatchResponse {
  success: boolean;
  receipt_id: string;
  matches_found: number;
  matches: Array<{
    transaction_id: string;
    confidence: number;
    reason: string;
  }>;
  message?: string;
}

/**
 * Receipt database operations
 */
export class ReceiptService {
  /**
   * Fetch all receipts for the current user
   */
  static async fetchReceipts(filters?: {
    status?: string;
    category?: string;
    merchant?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<MockReceipt[]> {
    let query = supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('processing_status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.merchant) {
      query = query.ilike('merchant', `%${filters.merchant}%`);
    }
    if (filters?.dateFrom) {
      query = query.gte('receipt_date', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('receipt_date', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching receipts:', error);
      throw new Error(`Failed to fetch receipts: ${error.message}`);
    }

    return data as MockReceipt[];
  }

  /**
   * Fetch a single receipt by ID
   */
  static async fetchReceiptById(receiptId: string): Promise<MockReceipt | null> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', receiptId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching receipt:', error);
      throw new Error(`Failed to fetch receipt: ${error.message}`);
    }

    return data as MockReceipt;
  }

  /**
   * Create a new receipt record (called after file upload)
   */
  static async createReceipt(
    userId: string,
    filePath: string,
    bucket: string = 'receipts'
  ): Promise<string> {
    const { data, error } = await supabase
      .from('receipts')
      .insert({
        user_id: userId,
        file_path: filePath,
        bucket,
        processing_status: 'pending',
        uploaded_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating receipt:', error);
      throw new Error(`Failed to create receipt: ${error.message}`);
    }

    return data.id;
  }

  /**
   * Trigger OCR processing for a receipt
   */
  static async processReceipt(request: ProcessReceiptRequest): Promise<ProcessReceiptResponse> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('User not authenticated');
      }

      const response = await supabase.functions.invoke('process-receipt', {
        body: request,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to start receipt processing');
      }

      return response.data as ProcessReceiptResponse;
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      throw new Error(`Failed to process receipt: ${error.message}`);
    }
  }

  /**
   * Retry failed receipt processing
   */
  static async retryProcessing(receiptId: string): Promise<ProcessReceiptResponse> {
    try {
      // Get receipt details
      const receipt = await this.fetchReceiptById(receiptId);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      // Reset status to pending
      const { error: updateError } = await supabase
        .from('receipts')
        .update({
          processing_status: 'pending',
          error_message: null,
          processing_started_at: null,
        })
        .eq('id', receiptId);

      if (updateError) {
        throw new Error(`Failed to reset receipt status: ${updateError.message}`);
      }

      // Trigger processing
      return await this.processReceipt({
        receipt_id: receiptId,
        user_id: receipt.user_id,
        file_path: receipt.file_path,
        bucket: receipt.bucket,
      });
    } catch (error: any) {
      console.error('Error retrying receipt processing:', error);
      throw new Error(`Failed to retry processing: ${error.message}`);
    }
  }

  /**
   * Fetch AI match suggestions for a receipt
   */
  static async fetchMatchSuggestions(receiptId: string): Promise<AIMatchSuggestion[]> {
    const { data, error } = await supabase
      .from('ai_match_suggestions')
      .select(`
        *,
        transaction:transactions (
          id,
          transaction_date,
          description,
          amount,
          bank_account_id
        )
      `)
      .eq('receipt_id', receiptId)
      .order('confidence_score', { ascending: false });

    if (error) {
      console.error('Error fetching AI match suggestions:', error);
      throw new Error(`Failed to fetch match suggestions: ${error.message}`);
    }

    return data as AIMatchSuggestion[];
  }

  /**
   * Trigger AI matching for a receipt
   */
  static async triggerAIMatching(receiptId: string): Promise<AIMatchResponse> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('User not authenticated');
      }

      const response = await supabase.functions.invoke('match-receipt-transactions', {
        body: { receipt_id: receiptId },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to trigger AI matching');
      }

      return response.data as AIMatchResponse;
    } catch (error: any) {
      console.error('Error triggering AI matching:', error);
      throw new Error(`Failed to trigger AI matching: ${error.message}`);
    }
  }

  /**
   * Update AI match suggestion status (approve/reject)
   */
  static async updateMatchSuggestionStatus(
    suggestionId: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    const { error } = await supabase
      .from('ai_match_suggestions')
      .update({ status })
      .eq('id', suggestionId);

    if (error) {
      console.error('Error updating match suggestion status:', error);
      throw new Error(`Failed to update match suggestion: ${error.message}`);
    }
  }

  /**
   * Approve AI match suggestion and create reconciliation match
   */
  static async approveMatchSuggestion(
    suggestionId: string,
    receiptId: string,
    transactionId: string
  ): Promise<void> {
    try {
      // Start transaction
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Update suggestion status to approved
      await this.updateMatchSuggestionStatus(suggestionId, 'approved');

      // Create reconciliation match (if table exists)
      // Note: This assumes reconciliation_matches table exists
      const { error: matchError } = await supabase
        .from('reconciliation_matches')
        .insert({
          user_id: user.user.id,
          receipt_id: receiptId,
          transaction_id: transactionId,
          matched_at: new Date().toISOString(),
        });

      if (matchError) {
        // Rollback suggestion status
        await this.updateMatchSuggestionStatus(suggestionId, 'suggested');
        throw new Error(`Failed to create reconciliation match: ${matchError.message}`);
      }

      // Update transaction status to reconciled
      const { error: txnError } = await supabase
        .from('transactions')
        .update({ status: 'reconciled' })
        .eq('id', transactionId);

      if (txnError) {
        console.warn('Failed to update transaction status:', txnError);
        // Don't fail the whole operation
      }
    } catch (error: any) {
      console.error('Error approving match suggestion:', error);
      throw new Error(`Failed to approve match: ${error.message}`);
    }
  }

  /**
   * Reject AI match suggestion
   */
  static async rejectMatchSuggestion(suggestionId: string): Promise<void> {
    await this.updateMatchSuggestionStatus(suggestionId, 'rejected');
  }

  /**
   * Delete a receipt and its associated data
   */
  static async deleteReceipt(receiptId: string, filePath: string, bucket: string = 'receipts'): Promise<void> {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) {
        console.warn('Failed to delete receipt file:', storageError);
        // Continue with database deletion even if file deletion fails
      }

      // Delete receipt record (cascades to AI suggestions)
      const { error: dbError } = await supabase
        .from('receipts')
        .delete()
        .eq('id', receiptId);

      if (dbError) {
        throw new Error(`Failed to delete receipt: ${dbError.message}`);
      }
    } catch (error: any) {
      console.error('Error deleting receipt:', error);
      throw new Error(`Failed to delete receipt: ${error.message}`);
    }
  }

  /**
   * Get receipt processing statistics
   */
  static async getReceiptStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const { data, error } = await supabase
      .from('receipts')
      .select('processing_status');

    if (error) {
      console.error('Error fetching receipt stats:', error);
      throw new Error(`Failed to fetch receipt stats: ${error.message}`);
    }

    const stats = {
      total: data.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    data.forEach((receipt) => {
      const status = receipt.processing_status as keyof typeof stats;
      if (status in stats && status !== 'total') {
        stats[status]++;
      }
    });

    return stats;
  }
}

export default ReceiptService;
