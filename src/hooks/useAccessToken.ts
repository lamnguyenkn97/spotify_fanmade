import { useState, useEffect } from 'react';

/**
 * Hook to get the current access token from the server
 * This is needed for Web Playback SDK initialization
 */
export const useAccessToken = (): string | null => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenResponse = await fetch('/api/auth/token');
        if (tokenResponse.ok) {
          const data = await tokenResponse.json();
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchToken();
    
    // Refresh token periodically (every 50 minutes, tokens expire after 1 hour)
    const interval = setInterval(fetchToken, 50 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return accessToken;
};
