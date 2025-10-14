import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useOAuth } from '@/hooks/auth/useOAuth';
import Logo from '@/components/ui/Logo';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { awardPoints, awardBadge } from '@/services/gamificationService';
import OAuthProviders from '@/components/auth/OAuthProviders';

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function Auth() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { signInWithProvider, loading: oauthLoading } = useOAuth();

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleOAuthProvider = async (provider: 'google' | 'github' | 'discord') => {
    try {
      const result = await signInWithProvider(provider);
      if (result.success) {
        console.log(`OAuth ${provider} initiated successfully`);
      }
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (!authData.user) {
        throw new Error('Sign-up failed - no user returned');
      }

      // Create gamification profile and award initial badge/points
      try {
        await Promise.all([
          awardBadge('first_steps'),
          awardPoints(10, 'Account created'),
        ]);
      } catch (gamError) {
        console.error('Gamification setup failed (non-blocking):', gamError);
      }

      toast({
        title: 'Account created!',
        description: 'Welcome to Previa. Redirecting to your dashboard...',
      });

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Sign-up error:', error);
      toast({
        title: 'Sign-up failed',
        description: error instanceof Error ? error.message : 'An error occurred during sign-up',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (!authData.session) {
        throw new Error('Login failed - no session created');
      }

      toast({
        title: 'Welcome back!',
        description: 'Redirecting to your dashboard...',
      });

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentForm = mode === 'signup' ? signUpForm : loginForm;
  const onSubmit = mode === 'signup' ? handleSignUp : handleLogin;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-charcoal">Previa</h1>
          <p className="text-stone">AI-powered financial intelligence platform</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-cream border-sand">
          <CardHeader>
            <CardTitle className="text-charcoal">
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-stone">
              {mode === 'signup'
                ? 'Choose your preferred sign-up method'
                : 'Sign in to access your financial dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OAuth Providers (Primary) */}
            <div>
              <OAuthProviders
                onProviderClick={handleOAuthProvider}
                loading={oauthLoading}
                mode={mode === 'signup' ? 'signup' : 'signin'}
              />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sand" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cream px-2 text-stone">Or</span>
              </div>
            </div>

            {/* Email/Password Toggle (Optional) */}
            <div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEmailAuth(!showEmailAuth)}
                className="w-full text-stone hover:text-charcoal hover:bg-sand/20"
              >
                <span className="flex items-center gap-2">
                  {showEmailAuth ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {mode === 'signup' ? 'Sign up with email' : 'Sign in with email'}
                </span>
              </Button>

              {/* Email/Password Form (Collapsible) */}
              {showEmailAuth && (
                <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                  <Form {...currentForm}>
                    <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={currentForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="bg-white border-sand focus:border-charcoal"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={currentForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal">Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Enter your password'}
                                className="bg-white border-sand focus:border-charcoal"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      {mode === 'signup' && (
                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-charcoal">Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Re-enter your password"
                                  className="bg-white border-sand focus:border-charcoal"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-600" />
                            </FormItem>
                          )}
                        />
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-charcoal hover:bg-darkStone text-cream min-h-[44px]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                          </>
                        ) : (
                          <>{mode === 'signup' ? 'Create Account' : 'Sign In'}</>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>

            {/* Toggle Mode */}
            <div className="text-center pt-4 border-t border-sand">
              <p className="text-sm text-stone">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                    setShowEmailAuth(false);
                    currentForm.reset();
                  }}
                  className="underline hover:no-underline text-charcoal font-medium"
                  disabled={isLoading}
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <div className="mt-6 text-center text-sm text-stone">
          <a href="/privacy" className="hover:underline hover:text-charcoal transition-colors">
            Privacy Policy
          </a>
          {' · '}
          <a href="/terms" className="hover:underline hover:text-charcoal transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
