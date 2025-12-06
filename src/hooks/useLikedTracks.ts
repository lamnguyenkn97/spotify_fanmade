'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLikedTracksReturn {
  isLiked: (trackId: string) => boolean;
}

export const useLikedTracks = (trackIds?: string[]): UseLikedTracksReturn => {
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

  // Check liked status for tracks
  const checkLikedStatus = useCallback(async (trackIdsToCheck: string[]) => {
    if (trackIdsToCheck.length === 0) return;

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

  const isLiked = useCallback((trackId: string) => {
    return likedTrackIds.has(trackId);
  }, [likedTrackIds]);

  return {
    isLiked,
  };
};

