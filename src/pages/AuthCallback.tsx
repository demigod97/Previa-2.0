import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOAuth } from '@/hooks/auth/useOAuth';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/chakra-ui/card';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useOAuth();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Log URL parameters for debugging
        console.log('OAuth callback initiated', {
          url: window.location.href,
          params: Object.fromEntries(searchParams),
          timestamp: new Date().toISOString()
        });

        // Check for error from OAuth provider
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth provider error:', { error, errorDescription });
          setStatus('error');
          setMessage(errorDescription || `Authentication error: ${error}`);

          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
          return;
        }

        setStatus('loading');
        setMessage('Completing authentication...');

        const result = await handleOAuthCallback();

        if (result.success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Authentication failed');

          // Redirect to login after showing error
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Redirecting to login...');

        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [handleOAuthCallback, navigate, searchParams]);

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F2E9D8' }}>
      <Card style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#403B31' }}></div>
                <p style={{ color: '#403B31' }} className="text-lg font-medium">
                  {message}
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="text-green-600 text-6xl">✓</div>
                <p style={{ color: '#403B31' }} className="text-lg font-medium">
                  {message}
                </p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="text-red-600 text-6xl">✗</div>
                <p style={{ color: '#403B31' }} className="text-lg font-medium">
                  {message}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
