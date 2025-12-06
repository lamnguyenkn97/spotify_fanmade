# Setting Up Email Notifications

## Quick Setup with Resend (5 minutes)

### 1. Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month, 100/day)
3. Verify your email

### 2. Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: "Spotify Demo"
4. Copy the API key (starts with `re_...`)

### 3. Add to Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Select your `spotify-fanmade` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_your_key_here`
   - **Environment:** Production
5. Click **Save**

### 4. Install Resend Package

```bash
npm install resend
```

### 5. Update API Route

The code is already in the file, just uncommented! 

Or I can do it for you - just confirm!

### 6. Redeploy

```bash
git push origin main
```

Vercel will auto-deploy with the new env var.

---

## Test It

1. Go to your site
2. Submit a demo request
3. Check your email: `lamnguyen.hcmut@gmail.com`
4. You should receive: "New Spotify Demo Access Request"

---

## Email You'll Receive

```
Subject: New Spotify Demo Access Request

New Demo Access Request

Email: user@example.com
Name: John Doe
Message: I'm a recruiter at Company X
Time: 12/6/2025, 10:30 AM
```

---

## Alternative: Check Vercel Logs

Without email setup, you can check requests in Vercel:

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Select your project
3. Click **Logs** tab
4. Search for: "Demo Access Request"
5. You'll see all submissions

---

## Cost

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for portfolio projects!

**For 25 users max, this is MORE than enough!**

