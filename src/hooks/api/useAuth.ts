/**
 * Auth API hooks using SWR
 */

import useSWR, { mutate } from 'swr';
import { apiClient, swrFetcher } from '@/lib/api-client';
import { SpotifyUser } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface LoginResponse {
  url: string;
}

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
      onError: (err) => {
        // Silently handle auth errors - user is just not authenticated
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
 */
export async function loginWithSpotify(): Promise<void> {
  try {
    const data = await apiClient.get<LoginResponse>('/api/auth/login');
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    // Failed to initiate login, silently fail
    // User will remain on current page
  }
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

