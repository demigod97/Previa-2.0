/**
 * OAuth Configuration for Previa
 * Handles OAuth redirect URLs for different environments
 */

export const getOAuthRedirectUrl = (): string => {
  // In browser environment, use current origin
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  
  // For SSR or build-time, use environment variable
  const appUrl = process.env.VITE_APP_URL || process.env.VERCEL_URL;
  
  if (appUrl) {
    // Ensure protocol is included
    const protocol = appUrl.startsWith('http') ? '' : 'https://';
    return `${protocol}${appUrl}/auth/callback`;
  }
  
  // Fallback for development
  return 'http://localhost:5173/auth/callback';
};

export const getOAuthProviders = () => {
  return [
    {
      id: 'google',
      name: 'Google',
      icon: 'FaGoogle',
      color: '#4285F4'
    },
    {
      id: 'github', 
      name: 'GitHub',
      icon: 'FaGithub',
      color: '#333333'
    },
    {
      id: 'discord',
      name: 'Discord', 
      icon: 'FaDiscord',
      color: '#5865F2'
    }
  ];
};

export const OAuthConfig = {
  redirectUrl: getOAuthRedirectUrl(),
  providers: getOAuthProviders()
};
