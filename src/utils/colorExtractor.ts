/**
 * Extracts dominant colors from an image URL
 * Returns the two most prominent colors for gradient backgrounds
 */

export interface ExtractedColors {
  color1: string; // First dominant color (hex)
  color2: string; // Second dominant color (hex)
}

export const extractColorsFromImage = async (
  imageUrl: string
): Promise<ExtractedColors> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas size (smaller for performance)
        canvas.width = 100;
        canvas.height = 100;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Extract colors using a more sophisticated approach
        // Group similar colors together to find dominant palette
        const colorBuckets: Array<{ r: number; g: number; b: number; count: number }> = [];
        const bucketSize = 20; // Group colors within this range

        // Sample pixels (every 8th pixel for performance)
        for (let i = 0; i < data.length; i += 32) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Find or create a bucket for this color
          let found = false;
          for (const bucket of colorBuckets) {
            const distance = Math.sqrt(
              Math.pow(r - bucket.r, 2) +
              Math.pow(g - bucket.g, 2) +
              Math.pow(b - bucket.b, 2)
            );

            if (distance < bucketSize) {
              // Update bucket average
              const total = bucket.count + 1;
              bucket.r = Math.round((bucket.r * bucket.count + r) / total);
              bucket.g = Math.round((bucket.g * bucket.count + g) / total);
              bucket.b = Math.round((bucket.b * bucket.count + b) / total);
              bucket.count = total;
              found = true;
              break;
            }
          }

          if (!found) {
            colorBuckets.push({ r, g, b, count: 1 });
          }
        }

        // Sort by frequency
        colorBuckets.sort((a, b) => b.count - a.count);

        // Get two most dominant colors
        // Prefer colors that are visually distinct
        let color1 = colorBuckets[0] || { r: 18, g: 18, b: 18 };
        let color2 = colorBuckets[1] || colorBuckets[0] || { r: 40, g: 40, b: 40 };

        // If colors are too similar, find a more distinct second color
        const color1Brightness = (color1.r + color1.g + color1.b) / 3;
        const color2Brightness = (color2.r + color2.g + color2.b) / 3;
        const brightnessDiff = Math.abs(color1Brightness - color2Brightness);

        if (brightnessDiff < 30 && colorBuckets.length > 2) {
          // Find a color with more contrast
          for (let i = 2; i < Math.min(10, colorBuckets.length); i++) {
            const candidate = colorBuckets[i];
            const candidateBrightness = (candidate.r + candidate.g + candidate.b) / 3;
            const diff = Math.abs(color1Brightness - candidateBrightness);
            if (diff > brightnessDiff) {
              color2 = candidate;
              break;
            }
          }
        }

        // Adjust colors for better gradient blending (Spotify style)
        // Make color1 lighter/more vibrant for the top
        color1 = {
          r: Math.max(0, Math.min(255, Math.round(color1.r * 0.8))),
          g: Math.max(0, Math.min(255, Math.round(color1.g * 0.8))),
          b: Math.max(0, Math.min(255, Math.round(color1.b * 0.8))),
        };

        // Make color2 darker for smooth transition
        color2 = {
          r: Math.max(0, Math.min(255, Math.round(color2.r * 0.5))),
          g: Math.max(0, Math.min(255, Math.round(color2.g * 0.5))),
          b: Math.max(0, Math.min(255, Math.round(color2.b * 0.5))),
        };

        // Convert to hex
        const hex1 = rgbToHex(color1.r, color1.g, color1.b);
        const hex2 = rgbToHex(color2.r, color2.g, color2.b);

        resolve({
          color1: hex1,
          color2: hex2,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      // Fallback to default colors if image fails to load
      resolve({
        color1: '#121212',
        color2: '#1a1a1a',
      });
    };

    img.src = imageUrl;
  });
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

