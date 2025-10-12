import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignUpCode {
  id: string;
  code: string;
  is_active: boolean;
  use_limit?: number;
  used_count: number;
  expiry_date?: string;
}

interface VerificationResult {
  valid: boolean;
  reason?: string;
}

interface CreateAccountResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}

/**
 * useSignUp - Custom hook for sign-up functionality with code verification
 * 
 * Provides functions for:
 * - Verifying sign-up codes
 * - Creating user accounts
 * - Managing sign-up flow state
 */
export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Verify a sign-up code against the database
   * SECURITY NOTE: This should be moved to server-side validation via Edge Function
   * @param code - The 6-digit verification code
   * @returns Promise<VerificationResult>
   */
  const verifySignUpCode = async (code: string): Promise<VerificationResult> => {
    try {
      setLoading(true);

      // SECURITY WARNING: This is client-side validation and can be bypassed
      // TODO: Move to server-side Edge Function for secure validation
      const { data, error } = await supabase
        .from('signup_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Code verification error:', error);
        return { valid: false, reason: 'Code not found or inactive' };
      }

      if (!data) {
        return { valid: false, reason: 'Invalid verification code' };
      }

      // Check if code has expired
      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        return { valid: false, reason: 'Verification code has expired' };
      }

      // Check if usage limit has been reached
      if (data.use_limit && data.used_count >= data.use_limit) {
        return { valid: false, reason: 'Verification code usage limit reached' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Code verification error:', error);
      return { valid: false, reason: 'Failed to verify code' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new user account with code verification
   * @param email - User's email address
   * @param password - User's password
   * @param code - Verification code
   * @returns Promise<CreateAccountResult>
   */
  const createAccount = async (
    email: string, 
    password: string, 
    code: string
  ): Promise<CreateAccountResult> => {
    try {
      setLoading(true);

      // First verify the code
      const verificationResult = await verifySignUpCode(code);
      if (!verificationResult.valid) {
        return { 
          success: false, 
          error: verificationResult.reason || 'Invalid verification code' 
        };
      }

      // Create the Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return { 
          success: false, 
          error: authError.message || 'Failed to create account' 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          error: 'User creation failed' 
        };
      }

      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Note: We don't fail here as the user is already created in auth
        // The profile will be created by the trigger, but we log the error
      }

      // Create user_tiers record
      const { error: tierError } = await supabase
        .from('user_tiers')
        .insert({
          user_id: authData.user.id,
          tier: 'user',
          created_at: new Date().toISOString(),
        });

      if (tierError) {
        console.error('Tier creation error:', tierError);
        // Note: We don't fail here as the user is already created in auth
        // The tier will be created by the trigger, but we log the error
      }

      // Update signup code usage
      const { error: codeUpdateError } = await supabase
        .from('signup_codes')
        .update({
          last_used_at: new Date().toISOString(),
        })
        .eq('code', code);

      if (codeUpdateError) {
        console.error('Code usage update error:', codeUpdateError);
        // Non-critical error, don't fail the sign-up
      }

      return { 
        success: true, 
        user: authData.user 
      };

    } catch (error) {
      console.error('Account creation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifySignUpCode,
    createAccount,
  };
}

export default useSignUp;
