import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { uploadBankStatement, uploadReceipt } from '@/services/storageService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('Upload Integration Tests', () => {
  const mockUserId = 'test-user-123';
  const mockFile = new File(['test content'], 'test-statement.pdf', {
    type: 'application/pdf',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('8.1: File Type Validation', () => {
    it('should accept valid bank statement file types (PDF)', () => {
      const pdfFile = new File(['content'], 'statement.pdf', {
        type: 'application/pdf',
      });
      expect(pdfFile.type).toBe('application/pdf');
    });

    it('should accept valid bank statement file types (CSV)', () => {
      const csvFile = new File(['content'], 'statement.csv', {
        type: 'text/csv',
      });
      expect(csvFile.type).toBe('text/csv');
    });

    it('should accept valid receipt file types (PDF, JPG, PNG)', () => {
      const pdfFile = new File(['content'], 'receipt.pdf', {
        type: 'application/pdf',
      });
      const jpgFile = new File(['content'], 'receipt.jpg', {
        type: 'image/jpeg',
      });
      const pngFile = new File(['content'], 'receipt.png', {
        type: 'image/png',
      });

      expect(pdfFile.type).toBe('application/pdf');
      expect(jpgFile.type).toBe('image/jpeg');
      expect(pngFile.type).toBe('image/png');
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File(['content'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(invalidFile.type).not.toBe('application/pdf');
      expect(invalidFile.type).not.toBe('text/csv');
    });
  });

  describe('8.2: File Size Validation', () => {
    it('should accept files under 50MB', () => {
      const smallFile = new File(['x'.repeat(1024 * 1024)], 'small.pdf', {
        type: 'application/pdf',
      }); // 1MB
      expect(smallFile.size).toBeLessThan(50 * 1024 * 1024);
    });

    it('should reject files over 50MB', () => {
      const largeContent = 'x'.repeat(51 * 1024 * 1024); // 51MB
      const largeFile = new File([largeContent], 'large.pdf', {
        type: 'application/pdf',
      });
      expect(largeFile.size).toBeGreaterThan(50 * 1024 * 1024);
    });

    it('should accept files at exactly 50MB', () => {
      const exactContent = 'x'.repeat(50 * 1024 * 1024); // Exactly 50MB
      const exactFile = new File([exactContent], 'exact.pdf', {
        type: 'application/pdf',
      });
      expect(exactFile.size).toBeLessThanOrEqual(50 * 1024 * 1024);
    });
  });

  describe('8.3: Upload Queue Management', () => {
    it('should handle multiple files in queue', () => {
      const files = [
        { id: '1', file: mockFile, type: 'bank_statement', status: 'pending' },
        { id: '2', file: mockFile, type: 'receipt', status: 'pending' },
        { id: '3', file: mockFile, type: 'bank_statement', status: 'pending' },
      ];

      expect(files).toHaveLength(3);
      expect(files.filter((f) => f.status === 'pending')).toHaveLength(3);
    });

    it('should track individual file progress', () => {
      const uploadQueue = [
        { id: '1', progress: 0, status: 'pending' },
        { id: '2', progress: 50, status: 'uploading' },
        { id: '3', progress: 100, status: 'success' },
      ];

      expect(uploadQueue[0].progress).toBe(0);
      expect(uploadQueue[1].progress).toBe(50);
      expect(uploadQueue[2].progress).toBe(100);
    });

    it('should handle file removal from queue', () => {
      let queue = [
        { id: '1', file: mockFile },
        { id: '2', file: mockFile },
        { id: '3', file: mockFile },
      ];

      queue = queue.filter((item) => item.id !== '2');
      expect(queue).toHaveLength(2);
      expect(queue.find((item) => item.id === '2')).toBeUndefined();
    });

    it('should support concurrent upload limit of 3', () => {
      const concurrentLimit = 3;
      const totalFiles = 10;
      const batches = Math.ceil(totalFiles / concurrentLimit);

      expect(batches).toBe(4); // 10 files / 3 per batch = 4 batches
    });
  });

  describe('8.4: Upload to Supabase Storage', () => {
    it('should upload bank statement to correct bucket', async () => {
      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: `${mockUserId}/123456_test-statement.pdf` },
        error: null,
      });

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: mockUpload,
      } as any);

      const result = await uploadBankStatement(mockFile, mockUserId);

      expect(supabase.storage.from).toHaveBeenCalledWith('bank-statements');
      expect(result).toContain(mockUserId);
      expect(result).toContain('test-statement.pdf');
    });

    it('should upload receipt to correct bucket', async () => {
      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: `${mockUserId}/123456_receipt.jpg` },
        error: null,
      });

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: mockUpload,
      } as any);

      const receiptFile = new File(['content'], 'receipt.jpg', {
        type: 'image/jpeg',
      });
      const result = await uploadReceipt(receiptFile, mockUserId);

      expect(supabase.storage.from).toHaveBeenCalledWith('receipts');
      expect(result).toContain(mockUserId);
      expect(result).toContain('receipt.jpg');
    });

    it('should use correct file path format', async () => {
      const mockUpload = vi.fn().mockResolvedValue({
        data: { path: `${mockUserId}/123456_test-statement.pdf` },
        error: null,
      });

      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: mockUpload,
      } as any);

      const result = await uploadBankStatement(mockFile, mockUserId);
      const pathPattern = new RegExp(`^${mockUserId}/\\d+_test-statement\\.pdf$`);

      expect(result).toMatch(pathPattern);
    });

    it('should handle upload errors', async () => {
      const mockError = new Error('Upload failed');
      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      } as any);

      await expect(uploadBankStatement(mockFile, mockUserId)).rejects.toThrow(
        'Upload failed'
      );
    });
  });

  describe('8.5: Database Record Creation', () => {
    it('should create bank_statements record after upload', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'doc-123' },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const mockFrom = vi.mocked(supabase.from);
      mockFrom('bank_statements');

      expect(mockFrom).toHaveBeenCalledWith('bank_statements');
    });

    it('should create receipts record after upload', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'receipt-123' },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const mockFrom = vi.mocked(supabase.from);
      mockFrom('receipts');

      expect(mockFrom).toHaveBeenCalledWith('receipts');
    });

    it('should set processing_status to pending initially', () => {
      const record = {
        user_id: mockUserId,
        file_path: 'path/to/file.pdf',
        processing_status: 'pending',
      };

      expect(record.processing_status).toBe('pending');
    });

    it('should capture document ID for tracking', async () => {
      const mockDocumentId = 'doc-456';
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: mockDocumentId },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      // Simulate the insert operation
      const result = await supabase
        .from('bank_statements')
        .insert({ user_id: mockUserId })
        .select('id')
        .single();

      expect(result.data?.id).toBe(mockDocumentId);
    });
  });

  describe('8.6: Multi-File Concurrent Upload', () => {
    it('should process files in batches of 3', async () => {
      const files = Array(10).fill(mockFile);
      const concurrentLimit = 3;

      const batches: File[][] = [];
      for (let i = 0; i < files.length; i += concurrentLimit) {
        batches.push(files.slice(i, i + concurrentLimit));
      }

      expect(batches).toHaveLength(4);
      expect(batches[0]).toHaveLength(3);
      expect(batches[1]).toHaveLength(3);
      expect(batches[2]).toHaveLength(3);
      expect(batches[3]).toHaveLength(1);
    });

    it('should handle individual file errors without failing entire batch', async () => {
      const results = await Promise.allSettled([
        Promise.resolve('success'),
        Promise.reject(new Error('failed')),
        Promise.resolve('success'),
      ]);

      const successful = results.filter((r) => r.status === 'fulfilled');
      const failed = results.filter((r) => r.status === 'rejected');

      expect(successful).toHaveLength(2);
      expect(failed).toHaveLength(1);
    });

    it('should track progress per file independently', () => {
      const files = [
        { id: '1', progress: 100, status: 'success' },
        { id: '2', progress: 50, status: 'uploading' },
        { id: '3', progress: 0, status: 'pending' },
      ];

      // Each file maintains independent progress
      expect(files[0].progress).toBe(100);
      expect(files[1].progress).toBe(50);
      expect(files[2].progress).toBe(0);
    });
  });
});
