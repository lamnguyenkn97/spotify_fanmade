/**
 * Shared utility functions for image handling
 * Consolidates image URL extraction logic across the codebase
 */

import { SpotifyImage } from '@/types';

/**
 * Get the best quality image URL from an array of Spotify images
 * Prefers medium-sized images (200-400px height) for optimal display
 * Falls back to first available image if no medium-sized image is found
 * 
 * @param images - Array of Spotify image objects
 * @returns Best image URL or empty string if no images available
 */
export const getBestImageUrl = (
  images: SpotifyImage[] | Array<{ url: string; height?: number; width?: number }> | undefined
): string => {
  if (!images || images.length === 0) return '';
  
  // Try to find a medium-sized image (around 200-400px height)
  const mediumImage = images.find(
    (img) => img.height && img.height >= 200 && img.height <= 400
  );
  
  if (mediumImage) return mediumImage.url;
  
  // Fallback to first available image
  return images[0]?.url || '';
};

/**
 * Get the best quality image URL, preferring larger images
 * Used for scenarios where higher resolution is preferred
 * 
 * @param sources - Array of image sources with width/url
 * @returns Best image URL or empty string
 */
export const getBestImageUrlByWidth = (
  sources: Array<{ url: string; width?: number }> = []
): string => {
  if (!sources || sources.length === 0) return '';
  
  // Check if any sources have width property
  const hasWidth = sources.some((s) => s.width != null);
  
  if (hasWidth) {
    // Prefer larger images (>= 300px width)
    return (
      sources.find((source) => source.width && source.width >= 300)?.url ||
      sources.find((source) => source.width && source.width >= 64)?.url ||
      sources[0]?.url ||
      ''
    );
  }
  
  // If no width info, return first available
  return sources[0]?.url || '';
};

