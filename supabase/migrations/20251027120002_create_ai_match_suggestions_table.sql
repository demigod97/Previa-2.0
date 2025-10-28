-- Migration: Create ai_match_suggestions table
-- Created: 2025-10-27
-- Purpose: Store OpenAI-generated transaction match suggestions for receipts

-- Create ai_match_suggestions table
CREATE TABLE IF NOT EXISTS public.ai_match_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receipt_id UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  confidence_score DECIMAL(3, 2) NOT NULL CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
  match_reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(receipt_id, transaction_id)  -- Prevent duplicate suggestions for same receipt-transaction pair
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_receipt
  ON public.ai_match_suggestions(receipt_id);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_transaction
  ON public.ai_match_suggestions(transaction_id);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user
  ON public.ai_match_suggestions(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_confidence
  ON public.ai_match_suggestions(confidence_score DESC);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status
  ON public.ai_match_suggestions(status);

-- Enable Row Level Security
ALTER TABLE public.ai_match_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own AI match suggestions
DROP POLICY IF EXISTS "Users can view their own AI match suggestions" ON public.ai_match_suggestions;
CREATE POLICY "Users can view their own AI match suggestions"
  ON public.ai_match_suggestions
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own AI match suggestions
DROP POLICY IF EXISTS "Users can insert their own AI match suggestions" ON public.ai_match_suggestions;
CREATE POLICY "Users can insert their own AI match suggestions"
  ON public.ai_match_suggestions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own AI match suggestions (approve/reject)
DROP POLICY IF EXISTS "Users can update their own AI match suggestions" ON public.ai_match_suggestions;
CREATE POLICY "Users can update their own AI match suggestions"
  ON public.ai_match_suggestions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own AI match suggestions
DROP POLICY IF EXISTS "Users can delete their own AI match suggestions" ON public.ai_match_suggestions;
CREATE POLICY "Users can delete their own AI match suggestions"
  ON public.ai_match_suggestions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_ai_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ai_suggestions_timestamp ON public.ai_match_suggestions;
CREATE TRIGGER update_ai_suggestions_timestamp
  BEFORE UPDATE ON public.ai_match_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_suggestions_updated_at();

-- Add table comments
COMMENT ON TABLE public.ai_match_suggestions IS 'OpenAI-generated transaction match suggestions for receipts. Users review and approve/reject these suggestions in the reconciliation UI.';
COMMENT ON COLUMN public.ai_match_suggestions.confidence_score IS 'AI confidence score (0.00 to 1.00) indicating likelihood of correct match';
COMMENT ON COLUMN public.ai_match_suggestions.match_reason IS 'Human-readable explanation of why AI suggested this match (e.g., "Same merchant and exact amount on same date")';
COMMENT ON COLUMN public.ai_match_suggestions.status IS 'Suggestion status: suggested (pending review), approved (user confirmed match), rejected (user dismissed suggestion)';
