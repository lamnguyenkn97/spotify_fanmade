/**
 * Auth API hooks using SWR
 */

import useSWR, { mutate } from 'swr';
import { apiClient, swrFetcher } from '@/lib/api-client';
import { SpotifyUser } from '@/types';

// ============================================================================
// Auth Hooks
// ============================================================================

/**
 * Get current authenticated user
 */
export function useAuthUser() {
  const { data, error, isLoading } = useSWR<SpotifyUser>(
    '/api/auth/me',
    swrFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err: any) => {
        // Check if user is not on allowlist (403 error)
        if (err?.code === 'NOT_ON_ALLOWLIST' || err?.error === 'User not authorized') {
          // Redirect to home with error message
          window.location.href = '/?error=not_on_allowlist';
        }
        // Otherwise silently handle - user is just not authenticated
      },
    }
  );

  return {
    user: data || null,
    isAuthenticated: !!data,
    isLoading,
    error,
  };
}

/**
 * Login - initiates OAuth flow
 * Note: /api/auth/login now redirects directly to Spotify, no JSON response
 */
export async function loginWithSpotify(): Promise<void> {
  // Directly navigate to the login endpoint which will redirect to Spotify
  window.location.href = '/api/auth/login';
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/logout');
    // Clear SWR cache for auth endpoints
    mutate('/api/auth/me', null, false);
    window.location.href = '/';
  } catch (error) {
    // Failed to logout on server, but redirect anyway
    mutate('/api/auth/me', null, false);
    window.location.href = '/';
  }
}

/**
 * Revalidate auth state
 */
export function revalidateAuth() {
  mutate('/api/auth/me');
}

