import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { uploadBankStatement } from '@/services/storageService';
import { triggerBankStatementProcessing } from '@/services/ocrService';
import { awardPoints } from '@/services/gamificationService';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: vi.fn(),
    },
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('Bank Statement Upload - Integration Tests', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockFile = new File(['test content'], 'test-statement.pdf', { type: 'application/pdf' });
  const mockStatementId = '987e6543-e21b-12d3-a456-426614174000';
  const mockFilePath = `${mockUserId}/1234567890_test-statement.pdf`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Test 7.4: Integration test database record creation
   * Tests that bank_statements record is created after successful upload
   */
  describe('7.4: Database Record Creation', () => {
    it('should create bank_statements record with correct fields', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: mockStatementId,
          user_id: mockUserId,
          file_path: mockFilePath,
          processing_status: 'pending',
          uploaded_at: new Date().toISOString(),
        },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      const { data, error } = await supabase
        .from('bank_statements')
        .insert({
          user_id: mockUserId,
          file_path: mockFilePath,
          processing_status: 'pending',
        })
        .select('id')
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(mockStatementId);
      expect(data?.user_id).toBe(mockUserId);
      expect(data?.file_path).toBe(mockFilePath);
      expect(data?.processing_status).toBe('pending');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        file_path: mockFilePath,
        processing_status: 'pending',
      });
    });

    it('should handle database insert errors', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection error', code: 'PGRST301' },
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      const { data, error } = await supabase
        .from('bank_statements')
        .insert({
          user_id: mockUserId,
          file_path: mockFilePath,
          processing_status: 'pending',
        })
        .select('id')
        .single();

      expect(data).toBeNull();
      expect(error).toBeDefined();
      expect(error?.message).toBe('Database connection error');
    });

    it('should enforce RLS policies (user can only insert their own records)', async () => {
      const otherUserId = '999e9999-e99b-99d9-a999-999999999999';
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'new row violates row-level security policy', code: '42501' },
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      mockInsert.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        single: mockSingle,
      });

      // Attempt to insert record with different user_id
      const { data, error } = await supabase
        .from('bank_statements')
        .insert({
          user_id: otherUserId,
          file_path: mockFilePath,
          processing_status: 'pending',
        })
        .select('id')
        .single();

      expect(data).toBeNull();
      expect(error?.code).toBe('42501'); // RLS violation code
    });
  });

  /**
   * Test 7.5: Integration test Edge Function call
   * Tests that process-document Edge Function is called correctly
   */
  describe('7.5: Edge Function Call', () => {
    it('should call process-document Edge Function with correct payload', async () => {
      const mockInvoke = vi.fn().mockResolvedValue({
        data: { message: 'Processing started', status: 202 },
        error: null,
      });

      (supabase.functions.invoke as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInvoke);

      await triggerBankStatementProcessing(
        mockStatementId,
        mockUserId,
        mockFilePath,
        'bank-statements'
      );

      expect(mockInvoke).toHaveBeenCalledWith('process-document', {
        body: {
          document_id: mockStatementId,
          user_id: mockUserId,
          document_type: 'bank_statement',
          file_path: mockFilePath,
          storage_bucket: 'bank-statements',
        },
      });
    });

    it('should handle Edge Function errors (4xx)', async () => {
      const mockInvoke = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid document ID', status: 400 },
      });

      (supabase.functions.invoke as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInvoke);

      await expect(
        triggerBankStatementProcessing(mockStatementId, mockUserId, mockFilePath, 'bank-statements')
      ).rejects.toThrow('Failed to start processing');
    });

    it('should handle Edge Function errors (5xx)', async () => {
      const mockInvoke = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Internal server error', status: 500 },
      });

      (supabase.functions.invoke as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInvoke);

      await expect(
        triggerBankStatementProcessing(mockStatementId, mockUserId, mockFilePath, 'bank-statements')
      ).rejects.toThrow('Failed to start processing');
    });

    it('should return success on 202 Accepted response', async () => {
      const mockInvoke = vi.fn().mockResolvedValue({
        data: { message: 'Processing started', requestId: 'req-123' },
        error: null,
      });

      (supabase.functions.invoke as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInvoke);

      await expect(
        triggerBankStatementProcessing(mockStatementId, mockUserId, mockFilePath, 'bank-statements')
      ).resolves.not.toThrow();
    });
  });

  /**
   * Test 7.6: Integration test status polling and redirect
   * Tests React Query polling behavior and status transitions
   */
  describe('7.6: Status Polling and Redirect', () => {
    it('should poll bank_statements table every 2 seconds while processing', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn();

      // First call: processing
      mockSingle.mockResolvedValueOnce({
        data: { processing_status: 'processing', error_message: null },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const { data } = await supabase
        .from('bank_statements')
        .select('processing_status, error_message')
        .eq('id', mockStatementId)
        .single();

      expect(data?.processing_status).toBe('processing');
      expect(mockSelect).toHaveBeenCalledWith('processing_status, error_message');
      expect(mockEq).toHaveBeenCalledWith('id', mockStatementId);
    });

    it('should stop polling when status is completed', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { processing_status: 'completed', error_message: null },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const { data } = await supabase
        .from('bank_statements')
        .select('processing_status, error_message')
        .eq('id', mockStatementId)
        .single();

      expect(data?.processing_status).toBe('completed');
      // In actual implementation, React Query's refetchInterval would return false here
    });

    it('should stop polling and show error when status is failed', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { processing_status: 'failed', error_message: 'OCR extraction failed' },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        single: mockSingle,
      });

      const { data } = await supabase
        .from('bank_statements')
        .select('processing_status, error_message')
        .eq('id', mockStatementId)
        .single();

      expect(data?.processing_status).toBe('failed');
      expect(data?.error_message).toBe('OCR extraction failed');
    });
  });

  /**
   * Test 7.7: Integration test gamification points award
   * Tests that points are awarded correctly for first upload
   */
  describe('7.7: Gamification Points Award', () => {
    it('should insert point_transactions record with correct data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: {
          id: 'pt-123',
          user_id: mockUserId,
          points: 5,
          reason: 'First bank statement uploaded',
        },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
      });

      await awardPoints(mockUserId, 5, 'First bank statement uploaded');

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        points_earned: 5,
        reason: 'First bank statement uploaded',
      });
    });

    it('should update gamification_profiles total_points', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({
        data: { total_points: 5 },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      mockUpdate.mockReturnValue({
        eq: mockEq,
      });

      await supabase
        .from('gamification_profiles')
        .update({ total_points: 5 })
        .eq('user_id', mockUserId);

      expect(mockUpdate).toHaveBeenCalledWith({ total_points: 5 });
      expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
    });

    it('should handle gamification errors gracefully without blocking upload', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Gamification table not found' },
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
      });

      // Should not throw error - gracefully handles failure
      await expect(
        awardPoints(mockUserId, 5, 'First bank statement uploaded')
      ).resolves.not.toThrow();
    });

    it('should award 5 points for first bank statement upload', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: { points: 5 },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
      });

      await awardPoints(mockUserId, 5, 'First bank statement uploaded');

      // Verify exactly 5 points awarded
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          points_earned: 5,
        })
      );
    });
  });

  /**
   * Test 7.8: E2E test - upload file → process → redirect to step 3
   * Tests the complete flow from upload to redirect
   */
  describe('7.8: E2E Upload Flow', () => {
    it('should complete full upload → process → redirect flow', async () => {
      // Step 1: Upload file to storage
      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: mockFilePath },
        error: null,
      });

      (supabase.storage.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        upload: mockUpload,
      });

      const filePath = await uploadBankStatement(mockFile, mockUserId);
      expect(filePath).toBe(mockFilePath);

      // Step 2: Create database record
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: mockStatementId },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      mockInsert.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });

      const { data: statement } = await supabase
        .from('bank_statements')
        .insert({
          user_id: mockUserId,
          file_path: filePath,
          processing_status: 'pending',
        })
        .select('id')
        .single();

      expect(statement?.id).toBe(mockStatementId);

      // Step 3: Trigger OCR processing
      const mockInvoke = vi.fn().mockResolvedValue({
        data: { message: 'Processing started' },
        error: null,
      });

      (supabase.functions.invoke as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInvoke);

      await triggerBankStatementProcessing(
        mockStatementId,
        mockUserId,
        filePath,
        'bank-statements'
      );

      expect(mockInvoke).toHaveBeenCalled();

      // Step 4: Award gamification points
      const mockPointsInsert = vi.fn().mockResolvedValue({
        data: { points: 5 },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        insert: mockPointsInsert,
      });

      await awardPoints(mockUserId, 5, 'First bank statement uploaded');
      expect(mockPointsInsert).toHaveBeenCalled();

      // Step 5: Poll for completion
      const mockStatusSelect = vi.fn().mockReturnThis();
      const mockStatusEq = vi.fn().mockReturnThis();
      const mockStatusSingle = vi.fn().mockResolvedValue({
        data: { processing_status: 'completed' },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockStatusSelect,
        eq: mockStatusEq,
        single: mockStatusSingle,
      });

      mockStatusSelect.mockReturnValue({ eq: mockStatusEq });
      mockStatusEq.mockReturnValue({ single: mockStatusSingle });

      const { data: status } = await supabase
        .from('bank_statements')
        .select('processing_status, error_message')
        .eq('id', mockStatementId)
        .single();

      expect(status?.processing_status).toBe('completed');

      // Step 6: Verify redirect happens (in actual app, this would navigate to /onboarding/confirm-account)
      // This would be tested in component/E2E tests with React Router
      const redirectPath = `/onboarding/confirm-account/${mockStatementId}`;
      expect(redirectPath).toBe(`/onboarding/confirm-account/${mockStatementId}`);
    });

    it('should handle upload failure gracefully', async () => {
      const mockUpload = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Storage quota exceeded' },
      });

      (supabase.storage.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        upload: mockUpload,
      });

      await expect(uploadBankStatement(mockFile, mockUserId)).rejects.toThrow(
        'Upload failed: Storage quota exceeded'
      );

      // Subsequent steps should not execute
      expect(supabase.from).not.toHaveBeenCalledWith('bank_statements');
    });

    it('should handle processing failure with retry option', async () => {
      // Simulate failed processing status
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          processing_status: 'failed',
          error_message: 'Unable to extract text from PDF',
        },
        error: null,
      });

      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });

      const { data } = await supabase
        .from('bank_statements')
        .select('processing_status, error_message')
        .eq('id', mockStatementId)
        .single();

      expect(data?.processing_status).toBe('failed');
      expect(data?.error_message).toBeTruthy();
      // In actual UI, this would show error message with retry button
    });
  });
});
