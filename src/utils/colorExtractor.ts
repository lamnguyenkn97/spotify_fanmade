/**
 * Color Extraction Utility
 * 
 * Extracts dominant colors from album artwork to create Spotify-style gradient backgrounds.
 * Uses fast-average-color library for efficient color extraction.
 */

import { FastAverageColor } from 'fast-average-color';

export interface ExtractedColors {
  color1: string; // Primary dominant color (hex)
  color2: string; // Secondary dominant color (hex)
}

// Fallback colors (Spotify dark theme)
const FALLBACK_COLORS: ExtractedColors = {
  color1: '#121212',
  color2: '#1a1a1a',
};

// Color adjustment factors for Spotify-style gradients
const PRIMARY_COLOR_FACTOR = 0.85; // Slightly darken primary
const SECONDARY_COLOR_FACTOR = 0.6; // Darker for gradient effect

/**
 * Extract dominant colors from an image URL
 * Returns two colors suitable for gradient backgrounds
 */
export const extractColorsFromImage = async (imageUrl: string): Promise<ExtractedColors> => {
  const fac = new FastAverageColor();

  try {
    // Extract average color from image
    const color = await fac.getColorAsync(imageUrl, {
      algorithm: 'dominant', // Use dominant color algorithm
      ignoredColor: [
        [255, 255, 255, 255, 50], // Ignore white
        [0, 0, 0, 255, 50],        // Ignore black
      ],
    });

    // Get RGB values
    const [r, g, b] = color.value;

    // Create primary color (slightly darker)
    const color1 = adjustColor(r, g, b, PRIMARY_COLOR_FACTOR);

    // Create secondary color (much darker for gradient)
    const color2 = adjustColor(r, g, b, SECONDARY_COLOR_FACTOR);

    return {
      color1: rgbToHex(color1.r, color1.g, color1.b),
      color2: rgbToHex(color2.r, color2.g, color2.b),
    };
  } catch (error) {
    return FALLBACK_COLORS;
  } finally {
    // Clean up resources
    fac.destroy();
  }
};

/**
 * Adjust color intensity for gradient effect
 */
function adjustColor(r: number, g: number, b: number, factor: number) {
  return {
    r: Math.round(Math.max(0, Math.min(255, r * factor))),
    g: Math.round(Math.max(0, Math.min(255, g * factor))),
    b: Math.round(Math.max(0, Math.min(255, b * factor))),
  };
}

/**
 * Convert RGB values to hexadecimal color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
