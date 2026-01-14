/**
 * Get the full path for an asset, respecting the Vite base URL configuration.
 * This ensures assets work correctly regardless of deployment location.
 *
 * @param path - The path relative to the public directory (e.g., 'assets/cards/riders/thalia.png')
 * @returns The full path with base URL prepended
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // import.meta.env.BASE_URL is set by Vite based on the 'base' config
  // Locally: '/'
  // GitHub Pages: '/dragonriders-ttrpg-claude/'
  // Other deployments: whatever base is configured
  const baseUrl = import.meta.env.BASE_URL;

  return `${baseUrl}${cleanPath}`;
}
