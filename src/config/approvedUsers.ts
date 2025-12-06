/**
 * Approved users allowlist
 * 
 * When you add a user to Spotify Developer Dashboard,
 * also add their email here so they can log in via OAuth
 */

export const APPROVED_USERS = [
  // Owner (you)
  'your-email@example.com',
  
  // Add approved users here as you grant them access
  // 'recruiter@company.com',
  // 'friend@example.com',
];

/**
 * Check if a user email is approved for OAuth login
 */
export function isUserApproved(email: string | null | undefined): boolean {
  if (!email) return false;
  return APPROVED_USERS.includes(email.toLowerCase());
}

/**
 * For admin/owner - always allow OAuth login
 * Add your own emails here
 */
const ADMIN_EMAILS = [
  'your-email@example.com', // Replace with your actual email
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

