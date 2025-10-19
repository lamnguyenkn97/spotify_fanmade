# 🎵 Spotify API Setup Guide

## Step 1: Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the details:
   - **App name**: Spotify Fanmade
   - **App description**: A fanmade Spotify web app
   - **Redirect URI**: `http://localhost:3010/api/auth/callback`
   - **API**: Select Web API
5. Click **"Save"**
6. Copy your **Client ID** and **Client Secret**

---

## Step 2: Create Environment Variables

Create a file named `.env.local` in the root directory with:

```bash
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3010/api/auth/callback

# Next.js
NEXTAUTH_URL=http://localhost:3010
NEXTAUTH_SECRET=generate_this_with_openssl
```

### Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

---

## Step 3: Restart Development Server

After creating `.env.local`, restart your dev server:

```bash
npm run dev
```

---

## 📌 Important Notes:

- **Never commit `.env.local`** to git (it's already in `.gitignore`)
- For production, set these environment variables in your hosting platform
- Update `SPOTIFY_REDIRECT_URI` for production deployment

---

## 🔒 Scopes Used:

The app requests these Spotify permissions:

- `user-read-private` - Read user profile
- `user-read-email` - Read user email
- `playlist-read-private` - Read private playlists
- `playlist-read-collaborative` - Read collaborative playlists
- `playlist-modify-public` - Modify public playlists
- `playlist-modify-private` - Modify private playlists

---

## 🧪 Testing:

1. Start the dev server: `npm run dev`
2. Click "Log in" button
3. Authorize the app on Spotify
4. You'll be redirected back with access to your Spotify data
