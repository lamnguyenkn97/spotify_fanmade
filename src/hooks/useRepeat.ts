import { useState, useCallback } from 'react';

export type RepeatMode = 'off' | 'all' | 'one';

export interface UseRepeatReturn {
  repeatMode: RepeatMode;
  toggleRepeat: () => void;
  shouldRepeatTrack: () => boolean;
  shouldRepeatQueue: (isLastTrack: boolean) => boolean;
}

/**
 * Hook to manage repeat mode (off, all, one)
 */
export const useRepeat = (): UseRepeatReturn => {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  // Toggle repeat mode: off -> one -> off
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'one';
      return 'off';
    });
  }, []);

  // Check if current track should repeat (repeat one mode)
  // This doesn't depend on track position - if repeat one is on, always repeat
  const shouldRepeatTrack = useCallback((): boolean => {
    return repeatMode === 'one';
  }, [repeatMode]);

  // Check if queue should repeat (go to start)
  // Note: With only off/one modes, queue repeat is not supported
  const shouldRepeatQueue = useCallback(
    (isLastTrack: boolean): boolean => {
      return false; // Queue repeat (all) is no longer supported
    },
    []
  );

  return {
    repeatMode,
    toggleRepeat,
    shouldRepeatTrack,
    shouldRepeatQueue,
  };
};

