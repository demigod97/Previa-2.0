
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpForm } from './SignUpForm';
import OAuthProviders from './OAuthProviders';
import { useOAuth } from '@/hooks/auth/useOAuth';

const AuthForm = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { signInWithProvider, loading: oauthLoading } = useOAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignUpSuccess = () => {
    console.log('OAuth sign-up successful');
    // The AuthContext will handle the redirect automatically
  };

  const handleOAuthProvider = async (provider: 'google' | 'github' | 'discord') => {
    try {
      const result = await signInWithProvider(provider);
      if (result.success) {
        // OAuth redirect will happen automatically
        console.log(`OAuth ${provider} initiated successfully`);
      }
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {mode === 'signin' ? (
        <Card style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
          <CardHeader>
            <CardTitle style={{ color: '#403B31' }}>Sign In</CardTitle>
            <CardDescription style={{ color: '#595347' }}>
              Choose your preferred sign-in method to access your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OAuthProviders 
              onProviderClick={handleOAuthProvider}
              loading={oauthLoading}
              mode="signin"
            />
            
            <div className="mt-4 text-center">
              <p style={{ color: '#595347' }} className="text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="underline hover:no-underline"
                  style={{ color: '#403B31' }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SignUpForm onSuccess={handleSignUpSuccess} />
      )}
      
      {mode === 'signup' && (
        <div className="mt-4 text-center">
          <p style={{ color: '#595347' }} className="text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="underline hover:no-underline"
              style={{ color: '#403B31' }}
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
