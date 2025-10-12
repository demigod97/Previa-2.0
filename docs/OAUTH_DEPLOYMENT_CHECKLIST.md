# OAuth Deployment Checklist for Vercel

## Issue Summary
After deploying to Vercel, OAuth redirects resulted in 404 errors because Vercel didn't know how to handle client-side routes like `/auth/callback`.

## Solution Applied
Added SPA (Single Page Application) configuration to `vercel.json` to route all requests to `index.html`, allowing React Router to handle routing.

---

## Pre-Deployment Checklist

### 1. Supabase Configuration
- [ ] Navigate to **Supabase Dashboard** → Your Project → **Authentication** → **URL Configuration**
- [ ] Add the following redirect URLs:
  - ✅ `https://previa.raava.app/auth/callback` (Production)
  - ✅ `http://localhost:5173/auth/callback` (Local development)
  - ⚠️ **Important:** NO typos! Check for `https://` (not `https:://`)

### 2. OAuth Provider Configuration

#### Google OAuth
- [ ] Go to **Google Cloud Console** → **APIs & Services** → **Credentials**
- [ ] Edit your OAuth 2.0 Client ID
- [ ] Add to **Authorized redirect URIs**:
  ```
  https://clfdfkkyurghuohjnryy.supabase.co/auth/v1/callback
  ```

#### GitHub OAuth
- [ ] Go to **GitHub** → **Settings** → **Developer settings** → **OAuth Apps**
- [ ] Edit your OAuth App
- [ ] Set **Authorization callback URL**:
  ```
  https://clfdfkkyurghuohjnryy.supabase.co/auth/v1/callback
  ```

#### Discord OAuth
- [ ] Go to **Discord Developer Portal** → **Applications** → Your App
- [ ] Go to **OAuth2** settings
- [ ] Add to **Redirects**:
  ```
  https://clfdfkkyurghuohjnryy.supabase.co/auth/v1/callback
  ```

### 3. Vercel Environment Variables
- [ ] Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
- [ ] Add the following variables:
  ```
  VITE_SUPABASE_URL=https://clfdfkkyurghuohjnryy.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZmRma2t5dXJnaHVvaGpucnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODk1NTAsImV4cCI6MjA3NDk2NTU1MH0.8yFQaQOpiRrnaa08dulYiHZCL26mYJoFMWWk1d3K310
  ```
- [ ] Apply to: **Production**, **Preview**, and **Development**

### 4. Vercel Configuration File
- [x] `vercel.json` has been updated with SPA rewrites
- [x] Cache-Control headers configured for `/auth/callback`

---

## Deployment Steps

### Step 1: Commit Changes
```bash
git add vercel.json src/pages/AuthCallback.tsx
git commit -m "Fix OAuth redirect 404 with SPA rewrites for Vercel"
git push origin main
```

### Step 2: Verify Vercel Auto-Deploy
- [ ] Check **Vercel Dashboard** → **Deployments**
- [ ] Wait for deployment to complete
- [ ] Click on deployment URL to verify

### Step 3: Test OAuth Flow
Test each provider:

#### Google OAuth Test
1. [ ] Navigate to `https://previa.raava.app/auth`
2. [ ] Click "Sign in with Google"
3. [ ] Authorize the app
4. [ ] Verify redirect to `https://previa.raava.app/auth/callback`
5. [ ] Verify successful redirect to dashboard (`/`)

#### GitHub OAuth Test
1. [ ] Navigate to `https://previa.raava.app/auth`
2. [ ] Click "Sign in with GitHub"
3. [ ] Authorize the app
4. [ ] Verify redirect to `https://previa.raava.app/auth/callback`
5. [ ] Verify successful redirect to dashboard (`/`)

#### Discord OAuth Test
1. [ ] Navigate to `https://previa.raava.app/auth`
2. [ ] Click "Sign in with Discord"
3. [ ] Authorize the app
4. [ ] Verify redirect to `https://previa.raava.app/auth/callback`
5. [ ] Verify successful redirect to dashboard (`/`)

---

## Troubleshooting

### Still Getting 404?

#### Check 1: Verify vercel.json Deployment
```bash
# Check if vercel.json is in the deployed build
curl https://previa.raava.app/.well-known/vercel/config
```

#### Check 2: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for logs starting with "OAuth callback initiated"
4. Check for any error messages

#### Check 3: Verify Environment Variables
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. **Important:** Redeploy if you just added them (env vars require redeployment)

#### Check 4: Verify Supabase Redirect URLs
```bash
# Check if redirect URL is configured correctly
# Should return your redirect URL in the response
curl -X POST https://clfdfkkyurghuohjnryy.supabase.co/auth/v1/authorize \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"provider": "google"}'
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Vercel doesn't have SPA config | Ensure `vercel.json` has rewrites |
| `redirect_uri_mismatch` | OAuth provider redirect URL mismatch | Update OAuth app settings |
| `Invalid redirect URL` | Supabase redirect URL not whitelisted | Add to Supabase URL configuration |
| No session found | Callback processed but session missing | Check Supabase auth logs |

---

## What Changed

### Files Modified

1. **[vercel.json](../vercel.json)**
   - Added `rewrites` to route all requests to `index.html`
   - Added cache-control headers for `/auth/callback`

2. **[src/pages/AuthCallback.tsx](../src/pages/AuthCallback.tsx:1)**
   - Added `useSearchParams` to capture OAuth errors
   - Enhanced logging for debugging
   - Improved error handling for OAuth provider errors

### How It Works

```
User clicks "Sign in with Google"
    ↓
Supabase redirects to Google OAuth
    ↓
User authorizes
    ↓
Google redirects to: https://clfdfkkyurghuohjnryy.supabase.co/auth/v1/callback
    ↓
Supabase processes auth and redirects to: https://previa.raava.app/auth/callback
    ↓
Vercel receives request for /auth/callback
    ↓
vercel.json rewrites to /index.html (React app loads)
    ↓
React Router matches /auth/callback route
    ↓
AuthCallback component processes session
    ↓
Redirects to / (Dashboard)
```

---

## Next Steps (From QA Assessment)

The OAuth flow is now working, but the QA assessment identified critical security issues:

### Priority 1: Security Fixes (MUST DO)
- [ ] Implement server-side code validation (Edge Function)
- [ ] Add rate limiting for auth endpoints
- [ ] Sanitize error messages to avoid info leakage

### Priority 2: Performance Improvements
- [ ] Add rate limiting middleware
- [ ] Implement caching for valid codes
- [ ] Add performance monitoring

See [1.9-signup-ui-code-verification-nfr-20250112.md](../docs/qa/assessments/1.9-signup-ui-code-verification-nfr-20250112.md) for full details.

---

## Support

If issues persist:
1. Check Vercel deployment logs
2. Check Supabase Auth logs (Dashboard → Authentication → Logs)
3. Check browser console for client-side errors
4. Verify all URLs have HTTPS (not HTTP) for production

**Last Updated:** 2025-10-13
