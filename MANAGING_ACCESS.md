# Managing User Access

## Overview

This app has a two-step process for granting access:

1. **Add user to Spotify Developer Dashboard** (required by Spotify)
2. **Add user email to `approvedUsers.ts`** (tells the app they're approved)

---

## Step-by-Step: Granting Access

### 1. User Submits Request

User clicks "Request Demo Access" and submits their Spotify email. You'll see the request in:
- Vercel deployment logs (Console)
- Email (if you setup Resend/SendGrid)

### 2. Add to Spotify Developer Dashboard

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click your app
3. Go to **Settings**
4. Scroll to **User Management**
5. Click **Add New User**
6. Enter their Spotify email
7. Click **Save**

### 3. Add to App Allowlist

Edit `src/config/approvedUsers.ts`:

```typescript
export const APPROVED_USERS = [
  'your-email@example.com',      // You (owner)
  'recruiter@company.com',        // ← Add approved user
  'friend@example.com',           // ← Add approved user
];
```

### 4. Deploy Changes

```bash
git add src/config/approvedUsers.ts
git commit -m "feat: approve user@example.com"
git push origin main
```

Vercel will auto-deploy (~2 minutes).

### 5. Notify User

Email the user:

```
Subject: Spotify Demo Access Approved ✅

Hi [Name],

Your access has been approved! You can now log in at:
https://spotify-fanmade.vercel.app

Click "Request Demo Access" (or "Log In" button), 
enter your email, and you'll be redirected to Spotify login.

Enjoy!
```

---

## How It Works

### User Flow (Approved User)

1. User clicks "Log In" or "Request Demo Access"
2. Enters their email
3. App checks `/api/check-approval`
4. ✅ **Email found in `approvedUsers.ts`**
5. → Redirects to Spotify OAuth
6. → User logs in successfully!

### User Flow (Not Approved)

1. User clicks "Log In" or "Request Demo Access"
2. Enters their email
3. App checks `/api/check-approval`
4. ❌ **Email NOT found in `approvedUsers.ts`**
5. → Shows "Request submitted, wait 24 hours" message
6. → You get notification to approve them

---

## Files to Know

### `src/config/approvedUsers.ts`
- List of approved user emails
- Check if user can use OAuth login
- Syncs with Spotify Developer Dashboard

### `src/app/api/check-approval/route.ts`
- API endpoint to check if email is approved
- Called before showing OAuth or Request Demo flow

### `src/app/api/request-demo/route.ts`
- Handles new access requests
- Logs to console (or emails you if configured)

---

## Quick Commands

**Add a user:**
```bash
# Edit approvedUsers.ts
code src/config/approvedUsers.ts

# Commit and deploy
git add src/config/approvedUsers.ts
git commit -m "feat: approve new-user@example.com"
git push
```

**Remove a user:**
```bash
# Edit approvedUsers.ts (remove their email)
# Also remove from Spotify Dashboard if needed
git add src/config/approvedUsers.ts
git commit -m "chore: remove user@example.com access"
git push
```

---

## Tips

- **Your email**: Add your own email to `ADMIN_EMAILS` in `approvedUsers.ts`
- **Batch approvals**: Add multiple users in one commit
- **Case insensitive**: Emails are compared lowercase
- **Max 25 users**: Spotify Development Mode limit

---

## Alternative: Database Approach

For a production app with many users, you'd use a database:

```typescript
// Instead of static file, query database
const approved = await db.approvedUsers.findOne({ email });
```

**But for a portfolio project with <25 users, the static file approach is simpler!**

