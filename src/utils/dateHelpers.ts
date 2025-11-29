import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Enable relative time plugin
dayjs.extend(relativeTime);

/**
 * Format a date string to relative time (e.g., "2 days ago", "1 week ago")
 * Uses day.js for reliable date formatting
 */
export const formatRelativeTime = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};
