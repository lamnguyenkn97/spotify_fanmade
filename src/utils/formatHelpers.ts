/**
 * Shared utility functions for formatting data
 * Consolidates formatting logic across the codebase
 */

/**
 * Format duration from milliseconds to MM:SS format
 * 
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string (e.g., "3:45", "0:30")
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format large numbers with commas for readability
 * 
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1,234,567")
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format number with abbreviations (K, M, B)
 * 
 * @param num - Number to format
 * @returns Abbreviated number string (e.g., "1.2M", "456K")
 */
export const formatNumberAbbreviated = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format duration to human-readable string (e.g., "3 hr 45 min")
 * 
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration string
 */
export const formatDurationLong = (ms: number): string => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
};

