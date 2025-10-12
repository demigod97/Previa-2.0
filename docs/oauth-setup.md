# OAuth Setup Guide for Previa

## Overview

This guide explains how to configure OAuth providers (Google, GitHub, Discord) for the Previa application in different environments.

## Environment Configuration

### Local Development

No additional configuration needed. The app will automatically use `http://localhost:5173/auth/callback` as the redirect URL.

### Vercel Production

1. **Set Environment Variables in Vercel:**
   ```bash
   VITE_APP_URL=https://your-app.vercel.app
   ```

2. **Update Supabase OAuth Settings:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > URL Configuration
   - Add your Vercel domain to "Site URL" and "Redirect URLs":
     - Site URL: `https://your-app.vercel.app`
     - Redirect URLs: `https://your-app.vercel.app/auth/callback`

### OAuth Provider Configuration

#### Google OAuth

1. **Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
   - Set authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`
     - `https://your-app.vercel.app/auth/callback` (for direct testing)

2. **Supabase Configuration:**
   - In Supabase dashboard, go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth client ID and secret

#### GitHub OAuth

1. **GitHub Settings:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`

2. **Supabase Configuration:**
   - Enable GitHub provider in Supabase
   - Add GitHub OAuth client ID and secret

#### Discord OAuth

1. **Discord Developer Portal:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application
   - Go to OAuth2 settings
   - Add redirect URI:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`

2. **Supabase Configuration:**
   - Enable Discord provider in Supabase
   - Add Discord OAuth client ID and secret

## Troubleshooting

### Common Issues

1. **404 Error on OAuth Callback:**
   - Ensure `/auth/callback` route is properly configured in your app
   - Check that Vercel rewrites are configured correctly
   - Verify the redirect URL in Supabase matches your domain

2. **Redirect URL Mismatch:**
   - Check that all OAuth providers have the correct callback URL
   - Ensure Supabase has the correct site URL configured
   - Verify environment variables are set correctly

3. **CORS Issues:**
   - Ensure your domain is added to Supabase allowed origins
   - Check that the redirect URL is exactly as configured

### Debug Steps

1. **Check Console Logs:**
   ```javascript
   // Look for these logs in browser console
   console.log('OAuth redirect URL:', redirectUrl);
   console.log('AuthCallback: Processing OAuth callback...');
   ```

2. **Verify Environment Variables:**
   ```bash
   # Check if environment variables are set
   echo $VITE_APP_URL
   echo $VERCEL_URL
   ```

3. **Test OAuth Flow:**
   - Try OAuth sign-in in incognito mode
   - Check network tab for redirect URLs
   - Verify Supabase session creation

## Security Considerations

1. **HTTPS Only:** Always use HTTPS in production
2. **Domain Validation:** Only allow your verified domains
3. **Secret Management:** Never expose OAuth secrets in client code
4. **Session Security:** Ensure proper session handling and cleanup

## Testing Checklist

- [ ] OAuth sign-in works locally
- [ ] OAuth sign-in works on Vercel preview
- [ ] OAuth sign-in works on Vercel production
- [ ] Redirect URLs are correct for all environments
- [ ] Error handling works properly
- [ ] Session persistence works after OAuth
- [ ] User profile creation works
- [ ] Logout works correctly
