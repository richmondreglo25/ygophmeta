/**
 * Get the root path based on the environment.
 * @returns {string} The root path.
 */
export function getRootPath() {
  const isProd = process.env.NODE_ENV === "production";
  return isProd ? "/ygophmeta" : "";
}

/**
 * Get the full image path.
 * @param relativePath - The relative path of the image.
 * @returns {string} The full image path.
 */
export function getImagePath(relativePath: string) {
  const basePath = getRootPath();
  return `${basePath}/images/${relativePath}`;
}

/**
 * Get the full event image path.
 * @param id - Event ID
 * @param relativePath - The relative path of the image.
 * @returns {string} The full event image path.
 */
export function getEventImagePath(id: string, relativePath: string) {
  const basePath = getRootPath();
  return `${basePath}/images/events/${id}/${relativePath}`;
}

/**
 * Get the full JSON data path.
 * @param relativePath - The relative path of the JSON file.
 * @returns {string} The full JSON data path.
 */
export function getJsonPath(relativePath: string) {
  const basePath = getRootPath();
  return `${basePath}/data/${relativePath}`;
}
