
import React, { useState, useEffect } from 'react';
import { Box, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/chakra-ui/card';
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
    <Box width="full" maxW="md" mx="auto">
      {mode === 'signin' ? (
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method to access your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OAuthProviders
              onProviderClick={handleOAuthProvider}
              loading={oauthLoading}
              mode="signin"
            />

            <Box mt={4} textAlign="center">
              <Text fontSize="sm" color="previa.darkStone">
                Don't have an account?{' '}
                <ChakraLink
                  as="button"
                  onClick={() => setMode('signup')}
                  color="previa.charcoal"
                  textDecoration="underline"
                  _hover={{ textDecoration: 'none' }}
                >
                  Sign up
                </ChakraLink>
              </Text>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <SignUpForm onSuccess={handleSignUpSuccess} />
      )}

      {mode === 'signup' && (
        <Box mt={4} textAlign="center">
          <Text fontSize="sm" color="previa.darkStone">
            Already have an account?{' '}
            <ChakraLink
              as="button"
              onClick={() => setMode('signin')}
              color="previa.charcoal"
              textDecoration="underline"
              _hover={{ textDecoration: 'none' }}
            >
              Sign in
            </ChakraLink>
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default AuthForm;
