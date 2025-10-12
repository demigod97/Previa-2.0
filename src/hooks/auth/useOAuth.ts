import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type OAuthProvider = 'google' | 'github' | 'discord';

interface OAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

export const useOAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signInWithProvider = async (provider: OAuthProvider): Promise<OAuthResult> => {
    setLoading(true);
    
    try {
      console.log(`Attempting OAuth sign-in with ${provider}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error(`OAuth ${provider} error:`, error);
        throw error;
      }

      console.log(`OAuth ${provider} initiated successfully`);
      
      return {
        success: true
      };
      
    } catch (error: any) {
      console.error(`OAuth ${provider} error:`, error);
      
      const errorMessage = error?.message || `Failed to sign in with ${provider}`;
      
      toast({
        title: "OAuth Sign-In Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('OAuth callback error:', error);
        throw error;
      }

      if (data.session) {
        console.log('OAuth callback successful:', data.session.user);
        
        // Create profile if it doesn't exist
        await createUserProfile(data.session.user);
        
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });

        return {
          success: true,
          user: data.session.user
        };
      }

      return {
        success: false,
        error: 'No session found'
      };
      
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      
      toast({
        title: "Authentication Error",
        description: error?.message || "Failed to complete authentication",
        variant: "destructive",
      });

      return {
        success: false,
        error: error?.message || "Authentication failed"
      };
    }
  };

  const createUserProfile = async (user: any) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        console.log('Profile already exists for user:', user.id);
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      // Create user tier
      const { error: tierError } = await supabase
        .from('user_tiers')
        .insert({
          user_id: user.id,
          tier: 'user',
          created_at: new Date().toISOString()
        });

      if (tierError) {
        console.error('Error creating user tier:', tierError);
        throw tierError;
      }

      console.log('Profile and tier created successfully for OAuth user:', user.id);
      
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      throw error;
    }
  };

  return {
    signInWithProvider,
    handleOAuthCallback,
    loading
  };
};
