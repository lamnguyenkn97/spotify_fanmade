'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLikedTracksReturn {
  likedTrackIds: Set<string>;
  isLiked: (trackId: string) => boolean;
  toggleLike: (trackId: string) => Promise<void>;
  checkLikedStatus: (trackIds: string[]) => Promise<void>;
  loading: boolean;
}

export const useLikedTracks = (trackIds?: string[]): UseLikedTracksReturn => {
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const checkedTrackIdsRef = useRef<Set<string>>(new Set());

  // Check liked status for tracks
  const checkLikedStatus = useCallback(async (trackIdsToCheck: string[]) => {
    if (trackIdsToCheck.length === 0) return;

    setLoading(true);
    try {
      const idsParam = trackIdsToCheck.join(',');
      const response = await fetch(`/api/spotify/check-saved-tracks?ids=${idsParam}`);
      
      if (response.ok) {
        const data = await response.json();
        const likedIds = new Set<string>();
        
        Object.entries(data.saved || {}).forEach(([trackId, isSaved]) => {
          if (isSaved) {
            likedIds.add(trackId);
          }
        });
        
        setLikedTrackIds(likedIds);
      }
    } catch (error) {
      console.error('Error checking liked status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check status when trackIds change (only once per unique set of tracks)
  const previousTrackIdsKeyRef = useRef<string>('');
  
  useEffect(() => {
    if (!trackIds || trackIds.length === 0) return;
    
    // Create a key from sorted track IDs to identify this set
    const trackIdsKey = [...trackIds].sort().join(',');
    
    // Only check if this is a different set of tracks than we've seen
    if (trackIdsKey !== previousTrackIdsKeyRef.current) {
      previousTrackIdsKeyRef.current = trackIdsKey;
      
      // Spotify API allows max 50 tracks per request
      const maxPerRequest = 50;
      for (let i = 0; i < trackIds.length; i += maxPerRequest) {
        const batch = trackIds.slice(i, i + maxPerRequest);
        checkLikedStatus(batch);
      }
    }
  }, [trackIds, checkLikedStatus]); // Re-run if trackIds array reference changes

  // Toggle like/unlike
  const toggleLike = useCallback(async (trackId: string) => {
    const isCurrentlyLiked = likedTrackIds.has(trackId);
    
    // Optimistic update
    setLikedTrackIds((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });

    try {
      const response = await fetch('/api/spotify/my-saved-tracks', {
        method: isCurrentlyLiked ? 'DELETE' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackIds: [trackId] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to update liked status:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          trackId,
        });
        
        // Revert on error
        setLikedTrackIds((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(trackId);
          } else {
            newSet.delete(trackId);
          }
          return newSet;
        });
        
        // Check for specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required. Please log out and log back in to grant library modification permissions.');
        } else if (response.status === 403) {
          throw new Error('Permission denied. Please ensure you have granted library modification permissions.');
        }
        
        throw new Error(errorData.details || errorData.error || `Failed to update liked status (${response.status})`);
      }
      
      // Verify the change was successful by checking the status
      // This ensures the UI stays in sync
      // Use a small delay to allow Spotify API to update
      setTimeout(async () => {
        try {
          const checkResponse = await fetch(`/api/spotify/check-saved-tracks?ids=${trackId}`);
          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            const isNowLiked = checkData.saved?.[trackId] || false;
            
            // Update state to match server state
            setLikedTrackIds((prev) => {
              const newSet = new Set(prev);
              if (isNowLiked) {
                newSet.add(trackId);
              } else {
                newSet.delete(trackId);
              }
              return newSet;
            });
          }
        } catch (error) {
          // Silently fail verification - optimistic update is already done
          console.warn('Failed to verify liked status:', error);
        }
      }, 500);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikedTrackIds((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(trackId);
        } else {
          newSet.delete(trackId);
        }
        return newSet;
      });
    }
  }, [likedTrackIds]);

  const isLiked = useCallback((trackId: string) => {
    return likedTrackIds.has(trackId);
  }, [likedTrackIds]);

  return {
    likedTrackIds,
    isLiked,
    toggleLike,
    checkLikedStatus,
    loading,
  };
};

