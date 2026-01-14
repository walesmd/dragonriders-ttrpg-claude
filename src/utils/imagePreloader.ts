import { getAssetPath } from './assets';

/**
 * Tracks which images have been loaded in the current session to avoid redundant loads
 */
const loadedImages = new Set<string>();

/**
 * Preload a single image by creating an Image element and loading it.
 * The browser will cache it naturally for subsequent uses.
 *
 * @param imagePath - The path to the image (will be passed through getAssetPath)
 * @returns Promise that resolves when image is loaded (or fails silently)
 */
function preloadImage(imagePath: string): Promise<void> {
  return new Promise((resolve) => {
    // Skip if already loaded in this session
    if (loadedImages.has(imagePath)) {
      resolve();
      return;
    }

    const img = new Image();
    const fullPath = getAssetPath(imagePath);

    img.onload = () => {
      loadedImages.add(imagePath);
      resolve();
    };

    img.onerror = () => {
      // Silently fail - image might not exist yet (like individual cards)
      // Still mark as "loaded" to avoid retry spam
      loadedImages.add(imagePath);
      resolve();
    };

    img.src = fullPath;
  });
}

/**
 * Preload an array of images in series (one after another).
 * This avoids overwhelming the browser with simultaneous requests
 * and allows early exit if user navigates away.
 *
 * @param imagePaths - Array of image paths to preload
 * @returns Promise that resolves when all images are loaded
 */
async function preloadImagesSeries(imagePaths: string[]): Promise<void> {
  for (const path of imagePaths) {
    await preloadImage(path);
  }
}

/**
 * Preload game assets in priority order:
 * 1. Rider images (most likely to be seen first in setup)
 * 2. Dragon images (second in setup flow)
 * 3. Card images (seen during gameplay)
 *
 * Images are loaded in series within each category to allow early exit
 * if the user navigates away from the menu.
 *
 * @param riderPaths - Array of rider image paths
 * @param dragonPaths - Array of dragon image paths
 * @param cardPaths - Array of card image paths
 * @returns Promise that resolves when all images are loaded
 */
export async function preloadGameAssets(
  riderPaths: string[],
  dragonPaths: string[],
  cardPaths: string[] = []
): Promise<void> {
  // Load riders first (highest priority - first in setup flow)
  await preloadImagesSeries(riderPaths);

  // Then dragons (second in setup flow)
  await preloadImagesSeries(dragonPaths);

  // Finally cards (seen during gameplay, lowest priority)
  if (cardPaths.length > 0) {
    await preloadImagesSeries(cardPaths);
  }
}

/**
 * Clear the loaded images cache. Useful for testing or if you need
 * to force reload images (e.g., after an update).
 */
export function clearPreloadCache(): void {
  loadedImages.clear();
}
