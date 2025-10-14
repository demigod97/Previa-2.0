import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadBankStatement } from '@/services/storageService';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: vi.fn(),
    },
  },
}));

describe('storageService - uploadBankStatement', () => {
  const mockUpload = vi.fn();
  const mockFile = new File(['test content'], 'test-statement.pdf', { type: 'application/pdf' });
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.storage.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      upload: mockUpload,
    });
  });

  it('should upload file successfully', async () => {
    mockUpload.mockResolvedValue({
      data: { path: `${mockUserId}/1234567890_test-statement.pdf` },
      error: null,
    });

    const onProgress = vi.fn();
    const result = await uploadBankStatement(mockFile, mockUserId, onProgress);

    expect(result).toContain(mockUserId);
    expect(result).toContain('test-statement.pdf');
    expect(onProgress).toHaveBeenCalledWith(100);
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringContaining(mockUserId),
      mockFile,
      expect.objectContaining({
        cacheControl: '3600',
        upsert: false,
      })
    );
  });

  it('should throw error when upload fails', async () => {
    mockUpload.mockResolvedValue({
      data: null,
      error: { message: 'Storage quota exceeded' },
    });

    await expect(uploadBankStatement(mockFile, mockUserId)).rejects.toThrow('Upload failed: Storage quota exceeded');
  });

  it('should generate unique file paths', async () => {
    mockUpload.mockResolvedValue({
      data: { path: `${mockUserId}/timestamp_test.pdf` },
      error: null,
    });

    const result1 = await uploadBankStatement(mockFile, mockUserId);
    
    // Wait a tiny bit to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const result2 = await uploadBankStatement(mockFile, mockUserId);

    // Both paths should contain user ID but have different timestamps
    expect(result1).toContain(mockUserId);
    expect(result2).toContain(mockUserId);
  });
});
