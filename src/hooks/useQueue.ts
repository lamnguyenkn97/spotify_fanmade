import { useState, useCallback, useEffect, useMemo } from 'react';
import { shuffle as lodashShuffle } from 'lodash';
import { CurrentTrack } from './useMusicPlayer';

export interface UseQueueReturn {
  queue: CurrentTrack[];
  currentIndex: number;
  isShuffled: boolean;
  setQueue: (tracks: CurrentTrack[]) => void;
  toggleShuffle: () => void;
  getNextIndex: () => number | null;
  getPreviousIndex: () => number | null;
  setCurrentIndex: (index: number) => void;
}

/**
 * Hook to manage the music queue with shuffle functionality
 */
export const useQueue = (
  currentTrack: CurrentTrack | null
): UseQueueReturn => {
  // Original queue is the source of truth
  const [originalQueue, setOriginalQueue] = useState<CurrentTrack[]>([]);
  // Shuffled indices: array of indices mapping to originalQueue
  // e.g., [2, 0, 3, 1] means: shuffled[0] = originalQueue[2], shuffled[1] = originalQueue[0], etc.
  const [shuffledIndices, setShuffledIndices] = useState<number[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Compute the actual queue from originalQueue and shuffledIndices
  const queue = useMemo(() => {
    if (shuffledIndices === null) {
      return originalQueue;
    }
    // Map shuffled indices to actual tracks
    return shuffledIndices.map((idx) => originalQueue[idx]);
  }, [originalQueue, shuffledIndices]);

  const isShuffled = shuffledIndices !== null;

  // Toggle shuffle on/off using index mapping
  const toggleShuffle = useCallback(() => {
    if (originalQueue.length === 0) {
      return;
    }

    if (isShuffled) {
      // Restore original queue order - clear shuffled indices
      const currentTrackId = currentTrack?.id;
      const originalIndex = originalQueue.findIndex((t) => t.id === currentTrackId);
      setShuffledIndices(null);
      if (originalIndex >= 0) {
        setCurrentIndex(originalIndex);
      }
    } else {
      // Create shuffled index mapping
      const indices = originalQueue.map((_, i) => i);
      const currentTrackId = currentTrack?.id;
      const currentIdx = originalQueue.findIndex((t) => t.id === currentTrackId);

      // Shuffle indices, but keep current track's index in place
      if (currentIdx >= 0) {
        // Remove current index, shuffle the rest, then insert it back
        const withoutCurrent = indices.filter((i) => i !== currentIdx);
        const shuffled = lodashShuffle(withoutCurrent);
        shuffled.splice(currentIdx, 0, currentIdx);
        setShuffledIndices(shuffled);
      } else {
        // No current track, just shuffle all indices
        setShuffledIndices(lodashShuffle(indices));
      }
    }
  }, [isShuffled, originalQueue, currentTrack]);

  // Set queue (resets shuffle state when called externally)
  const setQueue = useCallback(
    (tracks: CurrentTrack[]) => {
      setOriginalQueue([...tracks]);
      // Reset shuffle state
      setShuffledIndices(null);
    },
    []
  );

  // Get next index in queue
  const getNextIndex = useCallback((): number | null => {
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      return currentIndex + 1;
    }
    return null;
  }, [currentIndex, queue.length]);

  // Get previous index in queue
  const getPreviousIndex = useCallback((): number | null => {
    if (currentIndex > 0) {
      return currentIndex - 1;
    }
    return null;
  }, [currentIndex]);

  // Update current index when track changes
  useEffect(() => {
    if (currentTrack && queue.length > 0) {
      const index = queue.findIndex((t) => t.id === currentTrack.id);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [currentTrack, queue]);

  return {
    queue,
    currentIndex,
    isShuffled,
    setQueue,
    toggleShuffle,
    getNextIndex,
    getPreviousIndex,
    setCurrentIndex,
  };
};

