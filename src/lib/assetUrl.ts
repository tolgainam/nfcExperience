/**
 * Asset URL Utilities
 *
 * Handles proper URL construction for public assets in both development and production.
 * In development: /asset.png
 * In production (GitHub Pages): /nfcExperience/asset.png
 */

/**
 * Get the full URL for a public asset, including the base path.
 *
 * @param path - Asset path (with or without leading slash)
 * @returns Full URL with base path included
 *
 * @example
 * // Development (BASE_URL = '/')
 * getPublicAssetUrl('/models/iluma-i.glb') // => '/models/iluma-i.glb'
 *
 * // Production (BASE_URL = '/nfcExperience/')
 * getPublicAssetUrl('/models/iluma-i.glb') // => '/nfcExperience/models/iluma-i.glb'
 */
export const getPublicAssetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}/${cleanPath}`
}
