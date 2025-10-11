
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpForm } from './SignUpForm';

const AuthForm = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting sign in for:', email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else {
          throw error;
        }
      }
      
      console.log('Sign in successful:', data.user?.email);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // The AuthContext will handle the redirect automatically
      
    } catch (error: unknown) {
      console.error('Auth form error:', error);
      toast({
        title: "Sign In Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSuccess = () => {
    toast({
      title: "Welcome to Previa!",
      description: "Your account has been created successfully.",
    });
    // The AuthContext will handle the redirect automatically
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {mode === 'signin' ? (
        <Card style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
          <CardHeader>
            <CardTitle style={{ color: '#403B31' }}>Sign In</CardTitle>
            <CardDescription style={{ color: '#595347' }}>
              Enter your credentials to access your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: '#403B31' }}>Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4', color: '#403B31' }}
              className="focus:ring-2 focus:ring-opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#403B31' }}>Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
              style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4', color: '#403B31' }}
              className="focus:ring-2 focus:ring-opacity-50"
            />
          </div>
            <Button
              type="submit"
              className="w-full hover:opacity-90"
              disabled={loading}
              style={{ backgroundColor: '#D9C8B4', color: '#403B31', borderColor: '#D9C8B4' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
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
