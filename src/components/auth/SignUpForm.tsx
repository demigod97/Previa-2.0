import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OAuthProviders from './OAuthProviders';
import { useOAuth } from '@/hooks/auth/useOAuth';

interface SignUpFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * SignUpForm - OAuth-only sign-up form
 * 
 * @param onSuccess - Callback when sign-up is successful
 * @param className - Additional CSS classes
 */
export function SignUpForm({ onSuccess, className }: SignUpFormProps) {
  const { signInWithProvider, loading: oauthLoading } = useOAuth();

  const handleOAuthProvider = async (provider: 'google' | 'github' | 'discord') => {
    try {
      const result = await signInWithProvider(provider);
      if (result.success) {
        // OAuth redirect will happen automatically
        console.log(`OAuth ${provider} initiated successfully`);
        onSuccess?.();
      }
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`} style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
      <CardHeader>
        <CardTitle style={{ color: '#403B31' }}>
          Create Account
        </CardTitle>
        <CardDescription style={{ color: '#595347' }}>
          Choose your preferred sign-up method to create your Previa account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OAuthProviders 
          onProviderClick={handleOAuthProvider}
          loading={oauthLoading}
          mode="signup"
        />
      </CardContent>
    </Card>
  );
}

export default SignUpForm;