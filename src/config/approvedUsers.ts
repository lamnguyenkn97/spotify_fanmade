/**
 * Approved users allowlist - managed via environment variable
 * 
 * Set APPROVED_USERS in your environment (Vercel, .env.local):
 * APPROVED_USERS="user1@example.com,user2@example.com,admin@example.com"
 * 
 * This allows adding users without code changes - just update env var and redeploy
 */

export const APPROVED_USERS = process.env.APPROVED_USERS 
  ? process.env.APPROVED_USERS.split(',').map(email => email.trim().toLowerCase())
  : [];

/**
 * Check if a user email is approved for OAuth login
 */
export function isUserApproved(email: string | null | undefined): boolean {
  if (!email) return false;
  return APPROVED_USERS.includes(email.toLowerCase());
}

/**
 * For admin/owner - always allow OAuth login
 * Set ADMIN_EMAILS in your environment:
 * ADMIN_EMAILS="admin1@example.com,admin2@example.com"
 */
const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : ['lamnguyen.hcmut@gmail.com']; // Fallback to owner email

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

