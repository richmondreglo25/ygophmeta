/**
 * Returns the correct image path for static export (GitHub Pages) or local development.
 * Uses NEXT_PUBLIC_BASE_PATH from .env if set, otherwise defaults to /ygophmeta/ for production or '' for development.
 * @param {string} relativePath - The path relative to the public/images directory (e.g., 'sample.webp')
 * @returns {string} The full path to use in src attributes
 */
export function getImagePath(relativePath: string) {
  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/ygophmeta" : "";
  return `${basePath}/images/${relativePath}`;
}
