import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CodeVerificationInput } from './CodeVerificationInput';
import { useToast } from '@/hooks/use-toast';
import { useSignUp } from '@/hooks/auth/useSignUp';

interface SignUpFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * SignUpForm - Two-phase sign-up form with code verification
 * 
 * Phase 1: Email and password entry
 * Phase 2: 6-digit code verification
 * 
 * @param onSuccess - Callback when sign-up is successful
 * @param className - Additional CSS classes
 */
export function SignUpForm({ onSuccess, className }: SignUpFormProps) {
  const [phase, setPhase] = useState<'credentials' | 'verification'>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { createAccount, verifySignUpCode } = useSignUp();

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Password Mismatch");
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      setError("Password Too Short");
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Move to verification phase
      setPhase('verification');
    } catch (error) {
      console.error('Credentials validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      // Verify the code first
      const verificationResult = await verifySignUpCode(code);
      
      if (!verificationResult.valid) {
        setError("Invalid Code");
        toast({
          title: "Invalid Code",
          description: verificationResult.reason || "The verification code is invalid or expired.",
          variant: "destructive",
        });
        return;
      }

      // Create the account
      const result = await createAccount(formData.email, formData.password, code);
      
      if (result.success) {
        toast({
          title: "Account Created!",
          description: "Welcome to Previa! Your account has been created successfully.",
        });
        onSuccess?.();
      } else {
        setError("Account Creation Failed");
        toast({
          title: "Account Creation Failed",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError("Sign-up Error");
      toast({
        title: "Sign-up Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (code: string) => {
    setVerificationCode(code);
    setError(null); // Clear error when user types
  };

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code);
    handleCodeVerification(code);
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Medium';
    if (strength < 80) return 'Strong';
    return 'Very Strong';
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 30) return '#ef4444'; // red
    if (strength < 60) return '#f59e0b'; // amber
    if (strength < 80) return '#10b981'; // emerald
    return '#059669'; // green
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`} style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4' }}>
      <CardHeader>
        <CardTitle style={{ color: '#403B31' }}>
          {phase === 'credentials' ? 'Create Account' : 'Verify Code'}
        </CardTitle>
        <CardDescription style={{ color: '#595347' }}>
          {phase === 'credentials' 
            ? 'Enter your details to create your Previa account'
            : 'Enter the 6-digit verification code'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {phase === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#403B31' }}>Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                placeholder="Create a password"
                minLength={6}
                style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4', color: '#403B31' }}
                className="focus:ring-2 focus:ring-opacity-50"
              />
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#595347' }}>Password Strength:</span>
                    <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className="h-2"
                    style={{ 
                      backgroundColor: '#D9C8B4'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: '#403B31' }}>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                placeholder="Confirm your password"
                minLength={6}
                style={{ backgroundColor: '#F2E9D8', borderColor: '#D9C8B4', color: '#403B31' }}
                className="focus:ring-2 focus:ring-opacity-50"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full hover:opacity-90"
              disabled={loading}
              style={{ backgroundColor: '#D9C8B4', color: '#403B31', borderColor: '#D9C8B4' }}
            >
              {loading ? 'Validating...' : 'Continue to Verification'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p style={{ color: '#595347' }} className="text-sm">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>
              <p style={{ color: '#8C877D' }} className="text-xs mt-1">
                Enter the 6-digit code below
              </p>
            </div>
            
            <CodeVerificationInput
              onComplete={handleCodeComplete}
              onCodeChange={handleCodeChange}
              disabled={loading}
              autoFocus
            />
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                <div>{error}</div>
                {error === "Account Creation Failed" && (
                  <div>Email already exists</div>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setPhase('credentials')}
                disabled={loading}
                style={{ borderColor: '#D9C8B4', color: '#403B31' }}
              >
                Back
              </Button>
              <Button
                type="button"
                className="flex-1 hover:opacity-90"
                onClick={() => handleCodeVerification(verificationCode)}
                disabled={loading || verificationCode.length !== 6}
                style={{ backgroundColor: '#D9C8B4', color: '#403B31', borderColor: '#D9C8B4' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SignUpForm;
