import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('loading');
        setMessage('Completing authentication...');
        
        console.log('AuthCallback: Processing OAuth callback...');
        
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthCallback error getting session:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast({
            title: "Authentication Error",
            description: error.message || "Failed to process OAuth callback.",
            variant: "destructive",
          });
          
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
          return;
        }

        if (session) {
          console.log('AuthCallback: Session found, redirecting to dashboard.');
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          toast({
            title: "Authentication Successful",
            description: "You have been successfully logged in.",
          });
          
          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          // This case might happen if the session is not immediately available
          console.log('AuthCallback: No session found after redirect, checking for user.');
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            console.log('AuthCallback: User found, redirecting to dashboard.');
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            toast({
              title: "Authentication Successful",
              description: "You have been successfully logged in.",
            });
            
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1500);
          } else {
            console.log('AuthCallback: No user or session found, redirecting to auth page.');
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
            
            toast({
              title: "Authentication Error",
              description: "Could not complete authentication. Please try again.",
              variant: "destructive",
            });
            
            setTimeout(() => {
              navigate('/auth', { replace: true });
            }, 3000);
          }
        }
      } catch (err) {
        console.error('AuthCallback unexpected error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication.');
        
        toast({
          title: "Authentication Error",
          description: (err as Error).message || "An unexpected error occurred.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

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
