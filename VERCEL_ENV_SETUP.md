# Vercel Environment Variables Setup Guide

## Required Environment Variables

When deploying to Vercel, you need to set the following environment variables in your project settings:

### 1. Navigate to Vercel Project Settings
- Go to https://vercel.com/dashboard
- Select your project
- Click on "Settings" tab
- Click on "Environment Variables" in the left sidebar

### 2. Add the Following Variables

#### Production & Preview Environments:

```
SPOTIFY_CLIENT_ID
Value: [Your Spotify Client ID from https://developer.spotify.com/dashboard]
Environments: ✅ Production ✅ Preview ✅ Development
```

```
SPOTIFY_CLIENT_SECRET
Value: [Your Spotify Client Secret from https://developer.spotify.com/dashboard]
Environments: ✅ Production ✅ Preview ✅ Development
```

```
SPOTIFY_REDIRECT_URI
Value (Production): https://your-production-domain.vercel.app/api/auth/callback
Value (Preview): https://your-preview-domain.vercel.app/api/auth/callback
Environments: ✅ Production ✅ Preview
```

```
NEXT_PUBLIC_APP_URL
Value (Production): https://your-production-domain.vercel.app
Value (Preview): https://your-preview-domain.vercel.app
Environments: ✅ Production ✅ Preview
```

```
SESSION_SECRET
Value: [Generate with: openssl rand -base64 32]
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. Update Spotify App Settings

⚠️ **IMPORTANT:** After deploying, you must update your Spotify App settings:

1. Go to https://developer.spotify.com/dashboard
2. Select your app
3. Click "Edit Settings"
4. Add your Vercel URLs to "Redirect URIs":
   - `https://your-production-domain.vercel.app/api/auth/callback`
   - `https://your-preview-domain.vercel.app/api/auth/callback` (for preview deployments)

### 4. Verify Deployment

After setting environment variables:
1. Trigger a new deployment (commit & push to main branch)
2. Check deployment logs for any errors
3. Test the login flow on your production URL

### Common Issues

**Issue:** "Redirect URI mismatch" error
**Solution:** Ensure the `SPOTIFY_REDIRECT_URI` in Vercel exactly matches one of the URIs in your Spotify App settings

**Issue:** "Invalid client" error
**Solution:** Double-check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct

**Issue:** Environment variables not updating
**Solution:** Redeploy your application after changing environment variables

### Security Best Practices

- ✅ Never commit `.env.local` or actual credentials to Git
- ✅ Use different Spotify apps for development and production
- ✅ Rotate `SESSION_SECRET` periodically
- ✅ Use Vercel's encrypted environment variables
- ✅ Enable "Automatically expose System Environment Variables" in Vercel settings

### Reference

For more information:
- Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Spotify OAuth: https://developer.spotify.com/documentation/general/guides/authorization/
