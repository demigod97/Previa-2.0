import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import Logo from '@/components/ui/Logo';
const Auth = () => {
  return <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2E9D8' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#403B31' }}>Previa</h1>
          <p style={{ color: '#595347' }}>AI-powered financial intelligence platform</p>
        </div>
        <AuthForm />
      </div>
    </div>;
};
export default Auth;