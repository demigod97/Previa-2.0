-- Migration: Extend receipts table for OCR processing workflow
-- Created: 2025-10-27
-- Purpose: Add fields for processing status, category, and tracking

-- Add new columns to receipts table
ALTER TABLE public.receipts
  ADD COLUMN IF NOT EXISTS category VARCHAR(50),
  ADD COLUMN IF NOT EXISTS processing_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS extracted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add check constraint for processing_status values
ALTER TABLE public.receipts
  DROP CONSTRAINT IF EXISTS receipts_processing_status_check;

ALTER TABLE public.receipts
  ADD CONSTRAINT receipts_processing_status_check
  CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));

-- Create index for filtering by processing status
CREATE INDEX IF NOT EXISTS idx_receipts_processing_status
  ON public.receipts(processing_status);

-- Create index for filtering by category
CREATE INDEX IF NOT EXISTS idx_receipts_category
  ON public.receipts(category) WHERE category IS NOT NULL;

-- Update existing receipts to have default status if NULL
UPDATE public.receipts
SET processing_status = 'pending'
WHERE processing_status IS NULL;

-- Comment the table
COMMENT ON COLUMN public.receipts.category IS 'Auto-inferred expense category from merchant name (e.g., Groceries, Fuel, Dining)';
COMMENT ON COLUMN public.receipts.processing_status IS 'OCR processing status: pending, processing, completed, failed';
COMMENT ON COLUMN public.receipts.processing_started_at IS 'Timestamp when OCR processing started (when status changed to processing)';
COMMENT ON COLUMN public.receipts.extracted_at IS 'Timestamp when OCR data was successfully extracted and stored';
COMMENT ON COLUMN public.receipts.error_message IS 'Error message if OCR processing failed';
